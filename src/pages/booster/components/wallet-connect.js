import Vue from "vue";
import { OKXUniversalProvider } from "@okxconnect/universal-provider";
import { fetchWeb3codeBind, fetchWeb3Vcode } from "@/api/login.js";

let okxUniversalProvider = null;

export const initOkx = async () => {
  okxUniversalProvider = await OKXUniversalProvider.init({
    dappMetaData: {
      name: "4EVERLAND",
      icon: "https://dashboard.4everland.org/favicon.ico",
    },
  });
};

export const getOkxAccount = async () => {
  const session = await okxUniversalProvider.connect({
    namespaces: {
      eip155: {
        chains: ["eip155:1"],
        rpcMap: {
          1: "", // set your own rpc url
        },
        defaultChain: "1",
      },
    },
    // optionalNamespaces: {},
    // sessionConfig: {
    //   redirect: "tg://resolve",
    // },
  });
  const accounts = session.namespaces.eip155.accounts;
  const account = accounts[0].split(":")[2];
  console.log(account);
  return account;
};

export const signWithOkx = async (msg) => {
  let params = {};
  params = {
    method: "personal_sign",
    params: [msg],
  };
  const signature = await okxUniversalProvider.request(params);
  console.log(signature);
  return signature;
};

export const onExchangeCode = async (params) => {
  try {
    const { data } = await fetchWeb3codeBind(params);
    return data.applyR;
  } catch (error) {
    console.log(error);
    Vue.prototype.$toast2(error.message, "error");
  }
};

export const onVcode = async (type, code) => {
  let params = {
    type,
  };
  const { data } = await fetchWeb3Vcode(code, params);
  if (data.nodeToken) {
    localStorage.nodeToken = data.nodeToken;
  }
  Vue.prototype.$toast2("Connect successfully!", "success");
  Vue.prototype.$setMsg({
    name: "updateUser",
  });
};

export const connectOkxWallet = async (callback) => {
  if (!okxUniversalProvider) {
    await initOkx();
  }
  const account = await getOkxAccount();

  const params = {
    type: "7",
    apply: account,
  };
  const nonce = await onExchangeCode(params);
  const msg = "0x" + Buffer.from(nonce).toString("hex");
  console.log(msg);
  const signature = await signWithOkx(msg);
  console.log(signature);

  if (signature) {
    await onVcode(7, signature);
    callback();
  }
};
