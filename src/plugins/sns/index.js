/* eslint-disable no-unused-vars */
const web3 = require("@solana/web3.js");
const splNameService = require("@solana/spl-name-service");

const SOL_TLD_AUTHORITY = new web3.PublicKey(
  "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
);

//'devnet' | 'testnet' | 'mainnet-beta';
const connection = new web3.Connection(
  web3.clusterApiUrl("mainnet-beta"),
  "confirmed"
);

async function getDomainKey(domain) {
  let hostnameArray = domain.split(".");
  const hostnameLength = hostnameArray.length;
  const domainName = domain.split(".")[hostnameLength - 2]; // Without the .sol
  const domainHash = await splNameService.getHashedName(domainName);
  const domainKey = await splNameService.getNameAccountKey(
    domainHash,
    undefined,
    SOL_TLD_AUTHORITY
  );
  return domainKey;
}

async function getSubdomainKey(domain) {
  let hostnameArray = domain.split(".");
  const subDomain = hostnameArray[0];
  const parentDomainKey = await getDomainKey(domain);
  const hashedName = await splNameService.getHashedName("\0".concat(subDomain));
  const subdomainAccount = await splNameService.getNameAccountKey(
    hashedName,
    undefined,
    parentDomainKey
  );
  return subdomainAccount;
}

async function getContentFromAccount(connection, publicKey) {
  const nameAccount = await connection.getAccountInfo(publicKey, "processed");
  if (!nameAccount) {
    return null;
  }
  const data = nameAccount.data
    .toString("ascii")
    .slice(96)
    .replace(/\0.*$/g, "");
  return data;
}

async function formatterDomainName(domain) {
  let hostnameArray = domain.split(".");
  if (hostnameArray.length === 3) {
    // Check if there's a subdomain in the input and set accountKey if so
    const subDomain = hostnameArray[0];
    return {
      name: "\0".concat(subDomain),
      nameParent: getDomainKey(domain),
    };
  } else {
    const domainName = hostnameArray[0];
    return {
      name: domainName,
      nameParent: SOL_TLD_AUTHORITY,
    };
  }
}

export const getConnect = async () => {
  try {
    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    if (!isPhantomInstalled) {
      window.open("https://phantom.app/", "_blank");
      return console.log("Please install Phantom to use this app.");
    }
    const resp = await window.solana.connect();
    return resp.publicKey.toString();
  } catch (err) {
    // { code: 4001, message: 'User rejected the request.' }
  }
};

export const getOwner = async (domain) => {
  const domainKey = await getDomainKey(domain);
  try {
    const nameAccount = await splNameService.NameRegistryState.retrieve(
      connection,
      domainKey
    );
    return nameAccount.owner.toBase58();
  } catch (error) {
    return "";
  }
};

export const getResolveData = async (domain) => {
  let hostnameArray = domain.split(".");
  const domainKey = await getDomainKey(domain);
  let accountKey = domainKey;
  if (hostnameArray.length === 3) {
    accountKey = await getSubdomainKey(domain);
  }
  try {
    const resolveData = await getContentFromAccount(connection, accountKey);
    return resolveData;
  } catch (error) {
    return "";
  }
};

export const domainUpdate = async (domain, cid) => {
  const domainObj = await formatterDomainName(domain);
  // ipfs={CID}
  const input_data = Buffer.from(`ipfs=${cid}\0`);
  let programContent = await splNameService.updateNameRegistryData(
    connection,
    domainObj.name,
    0,
    input_data,
    null,
    domainObj.nameParent
  );
  const recentBlockhash = await connection.getRecentBlockhash();
  const resp = await window.solana.connect();
  let allocateTransaction = new web3.Transaction({
    recentBlockhash: recentBlockhash.blockhash,
    feePayer: resp.publicKey,
  });
  allocateTransaction.add(programContent);
  return allocateTransaction;
};

export const sendTransaction = async (transaction) => {
  const { signature } = await window.solana.signAndSendTransaction(transaction);
  const result = await connection.confirmTransaction(signature);
  return result;
};
