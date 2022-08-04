import axios from "axios";
import contracts from "@/contracts";
import * as fcl from "@onflow/fcl";
fcl
  .config()
  .put("accessNode.api", process.env.VUE_APP_FLOW_API)
  .put("app.detail.title", "4EVERLAND")
  .put(
    "app.detail.icon",
    "https://eco.4everland.space/logo/4EVERLAND-logo3.png"
  )
  .put("discovery.wallet", process.env.VUE_APP_FLOW_DISCOVERY);

const authApi = process.env.VUE_APP_AUTH_URL;
// eslint-disable-next-line no-unused-vars
const BUCKET_HOST = process.env.VUE_APP_BUCKET_HOST;

export const ExchangeCode = async (accounts) => {
  const res = await axios.get(`${authApi}/web3code/${accounts}`);
  return res.data.data.nonce;
};

export const Web3Login = async (accounts, data) => {
  const res = await axios.post(`${authApi}/web3login/${accounts}`, data);
  return res.data.data.stoken;
};

export const ConnectMetaMask = async () => {
  if (!window.ethereum) {
    window.open("https://metamask.io/download.html", "_blank");
    return;
  }

  //   const isUnlocked = await window.ethereum._metamask.isUnlocked();
  //   if (!isUnlocked) {
  //     console.log("Metamask has been locked, please unlock it.");
  //     return;
  //   }

  let accounts = await window.ethereum.request({
    method: "eth_accounts",
  });
  if (accounts.length === 0) {
    accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
  }
  return accounts;
};

export const SignMetaMask = async (accounts, nonce, inviteCode) => {
  try {
    const signature = await contracts.signer.signMessage(nonce);
    const data = {
      signature,
      appName: "BUCKET",
      inviteCode,
      type: "ETH",
    };
    const stoken = await Web3Login(accounts, data);
    // location.href = `${BUCKET_HOST}/login?stoken=${stoken}`;
    return stoken;
  } catch (e) {
    console.log(e);
  }
};

export const ConnectPhantom = async () => {
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

export const SignPhantom = async (accounts, nonce, inviteCode) => {
  try {
    const encodedMessage = new TextEncoder().encode(nonce);
    const signedMessage = await window.solana.request({
      method: "signMessage",
      params: {
        message: encodedMessage,
      },
    });
    const data = {
      signature: signedMessage.signature,
      appName: "BUCKET",
      inviteCode,
      type: "SOLANA",
    };
    const stoken = await Web3Login(accounts, data);
    // location.href = `${BUCKET_HOST}/login?stoken=${stoken}`;
    return stoken;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const ConnectFlow = async () => {
  try {
    await fcl.authenticate();
    return fcl.currentUser.snapshot();
  } catch (err) {
    console.log(err);
    return e;
  }
};

export const SignFlow = async (accounts, nonce, inviteCode) => {
  try {
    const MSG = Buffer.from(nonce).toString("hex");
    const signUserMessage = await fcl.currentUser.signUserMessage(MSG);
    const signature = signUserMessage[0].signature;
    const keyId = signUserMessage[0].keyId;
    if (!signature) {
      return;
    }
    const data = {
      signature,
      keyId,
      appName: "BUCKET",
      inviteCode,
      type: "ONFLOW",
    };
    const stoken = await Web3Login(accounts, data);
    // location.href = `${BUCKET_HOST}/login?stoken=${stoken}`;
    return stoken;
  } catch (e) {
    console.log(e);
    return e;
  }
};
