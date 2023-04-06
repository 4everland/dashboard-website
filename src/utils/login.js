import axios from "axios";
import contracts from "@/contracts";
import * as fcl from "@onflow/fcl";

import Vue from "vue";
import noWallet from "@/components/noWallet/index.js";
Vue.use(noWallet);

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

export const ExchangeCode = async (accounts) => {
  const res = await axios.get(`${authApi}/web3code/${accounts}`);
  return res.data.data.nonce;
};

export const Web3Login = async (accounts, data) => {
  const res = await Vue.prototype.$http.post(
    `$auth/web3login/${accounts}`,
    data
  );
  return res.data.stoken;
};

export const ConnectMetaMask = async () => {
  if (!window.ethereum) {
    Vue.prototype.$Dialog.getnoWallet("metamask");
    // window.open("https://metamask.io/download.html", "_blank");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts;
};

export const SignMetaMask = async (accounts, nonce, inviteCode, capToken) => {
  try {
    const signature = await contracts.signer.signMessage(nonce);
    const data = {
      signature,
      appName: "BUCKET",
      inviteCode,
      type: "ETH",
      walletType: "METAMASK",
      capT: capToken,
    };
    const stoken = await Web3Login(accounts, data);
    return stoken;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const ConnectOkx = async () => {
  if (!window.okxwallet) {
    Vue.prototype.$Dialog.getnoWallet("okx");
    // window.open(
    //   "https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
    //   "_blank"
    // );
    return;
  }

  const accounts = await window.okxwallet.request({
    method: "eth_requestAccounts",
  });
  return accounts;
};

export const SignOkx = async (accounts, nonce, inviteCode, capToken) => {
  try {
    const signature = await window.okxwallet.request({
      method: "personal_sign",
      params: [accounts, nonce],
    });
    const data = {
      signature,
      appName: "BUCKET",
      inviteCode,
      type: "ETH",
      walletType: "OKX",
      capT: capToken,
    };
    const stoken = await Web3Login(accounts, data);
    return stoken;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const ConnectPhantom = async () => {
  try {
    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    if (!isPhantomInstalled) {
      Vue.prototype.$Dialog.getnoWallet("phantom");
      // window.open("https://phantom.app/", "_blank");
      return console.log("Please install Phantom to use this app.");
    }
    const resp = await window.solana.connect();
    return resp.publicKey.toString();
  } catch (err) {
    // { code: 4001, message: 'User rejected the request.' }
    console.log(err);
    return false;
  }
};

export const SignPhantom = async (accounts, nonce, inviteCode, capToken) => {
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
      walletType: "PHANTOM",
      capT: capToken,
    };
    const stoken = await Web3Login(accounts, data);
    return stoken;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const ConnectFlow = async () => {
  try {
    await fcl.authenticate();
    return fcl.currentUser.snapshot();
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const SignFlow = async (accounts, nonce, inviteCode, capToken) => {
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
      walletType: "ONFLOW",
      capT: capToken,
    };
    const stoken = await Web3Login(accounts, data);
    return stoken;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const ConnectPetra = async () => {
  if (!window.aptos) {
    Vue.prototype.$Dialog.getnoWallet("petra");
    return;
  }

  try {
    const { address } = await window.aptos.connect();
    return address;
  } catch (error) {
    // { code: 4001, message: "User rejected the request."}
  }
};

export const SignPetra = async (account, nonce, inviteCode, capToken) => {
  try {
    const { signature } = await window.aptos.signMessage({
      nonce,
      message: nonce,
    });
    const data = {
      signature,
      appName: "BUCKET",
      inviteCode,
      type: "NACL",
      walletType: "PETRA",
      capT: capToken,
    };
    const stoken = await Web3Login(account, data);
    return stoken;
  } catch (e) {
    console.log(e);
    return false;
  }
};
