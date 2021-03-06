import Vue from "vue";
import "./css/style.scss";
import "./components";
import VueClipboards from "vue-clipboards";
import router from "./router";
import { CID } from "multiformats/cid";
import frameworks from "./plugins/config/frameworks";

Vue.use(VueClipboards);

Vue.prototype.$color1 = "#34A9FF";
Vue.prototype.$color2 = "#ff6960";

Vue.prototype.$onLoginData = (data) => {
  console.log(data);
  localStorage.clear();
  localStorage.authData = JSON.stringify(data);
  const token = data.accessToken;
  localStorage.token = token;
  localStorage.refreshAt = Date.now();
  let hash = "";
  if (localStorage.loginTo) {
    const storKey = "got_storage_" + token.substr(-5);
    if (localStorage[storKey]) hash = localStorage.loginTo;
    localStorage.loginTo = "";
  }
  location.href = "index.html" + hash;
};

Vue.prototype.$sleep = (msec = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
};

Vue.prototype.$navTo = (url) => {
  if (/^https?:/.test(url)) {
    window.open(url);
  } else if (/:/.test(url)) {
    location.href = url;
  } else {
    router.push(url);
  }
};

Vue.prototype.$getFramework = (name) => {
  let obj = frameworks.filter((it) => it.slug == name)[0];
  if (!obj) {
    obj = frameworks[frameworks.length - 1];
  }
  return obj;
};

Vue.prototype.$openWindow = (url) => {
  if ("ontouchstart" in window) location.href = url;
  else
    window.open(
      url,
      "n1",
      "height=600,width=900,top=50,left=200,toolbar=no,menubar=no"
    );
};

const offset = new Date().getTimezoneOffset() * 60e3;
Vue.prototype.$getUTC0 = (date) => {
  return parseInt((date - offset) / 1e3);
};

Vue.prototype.$regMap = {
  email: /^.+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  domain: /(\w+\.)+\w{2,10}/,
  eth: /^(0x)?[0-9a-fA-F]{40}$/,
};

Vue.prototype.$utils = {
  getNonce(len = 4, radix = 36) {
    let str = "";
    while (str.length < len) {
      str += Math.random().toString(radix).substr(2);
    }
    return str.substring(0, len);
  },
  getFileSize(byte, isObj = false) {
    if (!byte && byte !== 0 && !isObj) {
      return byte;
    }
    const mb = Math.pow(1024, 2);
    const gb = Math.pow(1024, 3);
    let num = byte;
    let unit = "B";
    if (byte >= gb) {
      num = (byte / gb).toFixed(2);
      unit = "GB";
    } else if (byte >= mb) {
      num = (byte / mb).toFixed(2);
      unit = "MB";
    } else if (byte >= 1024 || (byte < 0.01 && isObj)) {
      num = (byte / 1024).toFixed(2);
      unit = "KB";
    } else if (byte > 0) {
      num = parseInt(byte);
    }
    if (num) num = (num + "").replace(".00", "");
    if (isObj)
      return {
        num,
        unit,
      };
    return num + " " + unit;
  },
  getCidV1(cid) {
    if (!cid) return "";
    cid = cid.replace(/"/g, "");
    if (/^Qm/i.test(cid)) {
      return CID.parse(cid).toV1().toString();
    }
    return cid;
  },
  getCidLink(cid) {
    if (!cid) return "";
    return `https://${this.getCidV1(cid)}.ipfs.dweb.link`;
  },
  cutFixed(num, keep = 2) {
    const str = num + "";
    let i = str.indexOf(".");
    if (i == -1) return num;
    return str.substring(0, i + keep + 1) * 1;
  },
  getPurchase(type, amount) {
    const nameMap = {
      BUILD_TIME: "Build Minutes",
      TRAFFIC: "Bandwidth",
      AR_STORAGE: "Arweave",
      IPFS_STORAGE: "IPFS",
    };
    const it = {
      type,
      name: nameMap[type] || "Unknown",
      amount,
    };
    if (/build/i.test(it.type)) {
      it.amount = parseInt(it.amount / 60);
      it.unit = "Min";
    } else if (/ipfs/i.test(it.type) && it.amount == "0") {
      it.amount = "Extend Duration";
    } else {
      const obj = this.getFileSize(it.amount, true);
      it.amount = obj.num;
      it.unit = obj.unit;
    }
    return it;
  },
  getCost(usdt) {
    if (usdt < 0.0001) return "<0.0001";
    return this.cutFixed(usdt, usdt < 0.01 ? 4 : 2);
  },
};
