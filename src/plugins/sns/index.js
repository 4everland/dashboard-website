/* eslint-disable no-unused-vars */
const web3 = require("@solana/web3.js");
// const splNameService = require("@solana/spl-name-service");
const splNameService = require("@bonfida/spl-name-service");
console.log("nameService", splNameService);
const bs58 = require("bs58");

const SOL_TLD_AUTHORITY = new web3.PublicKey(
  "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
);

//'devnet' | 'testnet' | 'mainnet-beta';
const main_net_rpc =
  "https://skilled-silent-snowflake.solana-mainnet.quiknode.pro/";
// const main_net_rpc = web3.clusterApiUrl("mainnet-beta");
console.log(main_net_rpc);
const connection = new web3.Connection(main_net_rpc, "confirmed");
let myWallet = web3.Keypair.fromSecretKey(
  bs58.decode(
    "sdEisbAvWXQv1dcydzMBUzKsfedK2iJYgEjRtcLHpn81zwaB7CH8F6bdcjafifummZHm6pSaHmsuTxB4po37mvr"
  )
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

// export const domainUpdate = async (domain, ipns) => {
//   const domainObj = await formatterDomainName(domain);
//   // ipns={ipns}
//   const input_data = Buffer.from(`ipns=${ipns}\0`);
//   let programContent = await splNameService.updateNameRegistryData(
//     connection,
//     domainObj.name,
//     0,
//     input_data,
//     null,
//     domainObj.nameParent
//   );
//   const recentBlockhash = await connection.getRecentBlockhash();
//   const resp = await window.solana.connect();
//   let allocateTransaction = new web3.Transaction({
//     recentBlockhash: recentBlockhash.blockhash,
//     feePayer: resp.publicKey,
//   });
//   allocateTransaction.add(programContent);
//   return allocateTransaction;
// };

export const sendTransaction = async (transaction) => {
  const { signature } = await window.solana.signAndSendTransaction(transaction);
  const result = await connection.confirmTransaction(signature);
  return result;
};

export const domainUpdate = async (wallet, domain, value) => {
  let ixs = [];
  // const wallet = getOwner();
  // const wallet = myWallet;
  console.log("wallet", wallet);
  //const domain = "4everland"
  const record = splNameService.Record.IPFS;
  const { pubkey: domainKey } = await splNameService.getDomainKey(domain);
  const { pubkey: recordKey } = await splNameService.getDomainKey(
    record + "." + domain,
    true
  );

  const recordAccInfo = await connection.getAccountInfo(recordKey);
  console.log("recordAccInfo", recordAccInfo);
  if (!recordAccInfo?.data) {
    // The record does not exist so create it first
    const space = 2000;
    const lamports = await connection.getMinimumBalanceForRentExemption(
      space + splNameService.NameRegistryState.HEADER_LEN
    );
    const ix = await splNameService.createNameRegistry(
      connection,
      Buffer.from([1]).toString() + record,
      space,
      wallet.publicKey,
      wallet.publicKey,
      lamports,
      undefined,
      domainKey
    );
    ixs.push(ix);
  }

  const ix = splNameService.updateInstruction(
    splNameService.NAME_PROGRAM_ID,
    recordKey,
    new splNameService.Numberu32(0),
    Buffer.from(value),
    wallet.publicKey
  );

  ixs.push(ix);
  const tx = new web3.Transaction();

  tx.feePayer = wallet.publicKey;
  //const signers = [wallet]
  tx.add(...ixs);

  let result = await web3.sendAndConfirmTransaction(connection, tx, [wallet]);

  console.log(`Updated record ${result}`);
};

domainUpdate(
  myWallet,
  "4everland",
  "ipns://k51qzi5uqu5dgwhj3ar0vo0hjv8skqstyxma7cx7fi6h76s38qsgeleru9zg9z"
);
