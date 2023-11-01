import Vue from "vue";
import "./css/style.scss";
import "./components";
import VueClipboards from "vue-clipboards";
import router from "./router";
import { CID } from "multiformats/cid";
import frameworks from "./plugins/config/frameworks";
import * as clipboard from "clipboard-polyfill/text";
import { BigNumber } from "ethers";
const inDev = /xyz/.test(process.env.VUE_APP_BASE_URL);

Vue.use(VueClipboards);

Vue.prototype.$color1 = "#775DA6";
Vue.prototype.$color2 = "#ff6960";

Vue.prototype.$sleep = (msec = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
};

Vue.prototype.$copy = async (text, tip = "Copied!") => {
  try {
    await clipboard.writeText(text);
    Vue.prototype.$toast(tip);
  } catch (error) {
    Vue.prototype.$toast("Copied fail !");
  }
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
  secondLevelDomain:
    /^(?=^.{3,255}$)([a-zA-Z0-9][-a-zA-Z0-9]{0,62}|\*)(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62}){1,2}$/,
};

Vue.prototype.$utils = {
  getNonce(len = 4, radix = 36) {
    let str = "";
    while (str.length < len) {
      str += Math.random().toString(radix).substr(2);
    }
    return str.substring(0, len);
  },
  getFileSize(byte, isObj = false, fix = 2) {
    if (!byte && byte !== 0 && !isObj) {
      return byte;
    }
    const mb = Math.pow(1024, 2);
    const gb = Math.pow(1024, 3);
    const tb = Math.pow(1024, 4);
    let num = byte;
    let unit = "B";
    if (byte >= tb) {
      num = byte / tb;
      unit = "TB";
    } else if (byte >= gb) {
      num = byte / gb;
      unit = "GB";
    } else if (byte >= mb) {
      num = byte / mb;
      unit = "MB";
    } else if (byte >= 1024 || byte < 0.01) {
      num = byte / 1024;
      unit = "KB";
    } else if (byte > 0) {
      num = parseInt(byte);
    }
    if (unit != "B") {
      num = num.toFixed(fix);
    }
    if (num) num = (num + "").replace(".00", "");
    if (isObj)
      return {
        num,
        unit,
      };
    return num + " " + unit;
  },
  getNumCount(number, isObj = false, fix = 2) {
    let num = number;
    let unit = "";
    if (typeof number !== "number") {
      num = parseInt(number);
    }
    const k = Math.pow(10, 3);
    if (num >= k) {
      num = num / k;
      unit = "K";
    }
    if (/\./.test(num)) {
      num = num.toFixed(fix);
    }
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
  getCidLink(cid, plat) {
    //, assign = true
    if (!cid) return "";
    if (plat == "IPNS") {
      return `https://${cid}.ipns.dweb.link/`;
      // return assign
      //   ? `https://${cid}.ipns.4everland.io/`
      //   : `https://${cid}.ipns.dweb.link/`;
    }
    if (plat == "IC") {
      return `https://${cid}.raw.icp0.io/`;
    }
    if (plat == "AR") {
      return inDev
        ? `https://arweave.net/${cid}`
        : `https://arweave.net/${cid}`;
      // : `https://arweave.4everland.xyz/${cid}`;
    }
    return `https://${this.getCidV1(cid)}.ipfs.dweb.link`;
    // return assign
    //   ? `https://${this.getCidV1(cid)}.ipfs.4everland.io`
    //   : `https://${this.getCidV1(cid)}.ipfs.dweb.link`;
  },

  getGreenfieldLink(tx) {
    return `https://greenfieldscan.com/tx/${tx}`;
  },

  cutFixed(num, keep = 2) {
    const str = num + "";
    let i = str.indexOf(".");
    if (i == -1) return num;
    return str.substring(0, i + keep + 1) * 1;
  },
  getPurchase(type, amount = 0, time) {
    const nameMap = {
      BUILD_TIME: "Build Minutes",
      TRAFFIC: "Bandwidth",
      AR_STORAGE: "Arweave Storage",
      IPFS_STORAGE: "IPFS Storage",
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
      it.amount = "renewal";
    } else {
      const obj = this.getFileSize(it.amount, true);
      it.amount = obj.num;
      it.unit = obj.unit;
    }
    if (time) {
      it.until = "until " + new Date(time * 1e3).format("date");
    }
    return it;
  },
  getCost(usdt, len = 4) {
    if (usdt < 0.0001) return "<0.0001";
    if (!len) len = usdt < 0.01 ? 4 : 2;
    return this.cutFixed(usdt, len);
  },

  async resourceInsufficient() {
    try {
      await Vue.prototype.$confirm(
        "Insufficient resources! Please make purchases in the Resource Centre.",
        "Tip",
        {
          cancelText: "Cancel",
          confirmText: "Purchase",
        }
      );
      location.href = "/resource/subscribe";
    } catch (error) {
      console.log(error);
    }
  },

  getBigFileSize(byte, isObj = false, fix = 2) {
    const fileSize = BigNumber.from(byte);
    let fixSize = fileSize.mul(BigNumber.from(Math.pow(10, fix).toString()));
    const kb = BigNumber.from("1024");
    const mb = BigNumber.from(Math.pow(1024, 2).toString());
    const gb = BigNumber.from(Math.pow(1024, 3).toString());
    const tb = BigNumber.from(Math.pow(1024, 4).toString());
    let formatVal = "";
    let unit = "Byte";

    if (fileSize.gte(tb)) {
      formatVal = fixSize.div(tb).toNumber() / Math.pow(10, fix);
      unit = "TB";
    } else if (fileSize.gte(gb)) {
      formatVal = fixSize.div(gb).toNumber() / Math.pow(10, fix);
      unit = "GB";
    } else if (fileSize.gte(mb)) {
      formatVal = fixSize.div(mb).toNumber() / Math.pow(10, fix);
      unit = "MB";
    } else if (fileSize.gte(kb)) {
      formatVal = fixSize.div(kb).toNumber() / Math.pow(10, fix);
      unit = "KB";
    } else if (fileSize.gt(BigNumber.from("0"))) {
      formatVal = fixSize.toNumber() / Math.pow(10, fix);
      unit = "Byte";
    } else {
      formatVal = "0";
      unit = "Byte";
    }

    return formatVal + " " + unit;
  },

  formatLand(land, isObj = false) {
    const landNum = BigNumber.from(land).div((1e18).toString());
    console.log(landNum.toString());
    let formatVal = land;
    let unit = "";
    const k = BigNumber.from(Math.pow(10, 5).toString());
    const m = BigNumber.from(Math.pow(10, 8).toString());
    const b = BigNumber.from(Math.pow(10, 14).toString());
    const t = BigNumber.from(Math.pow(10, 16).toString());
    const thanT = BigNumber.from(Math.pow(10, 20).toString());

    if (landNum.gte(thanT)) {
      formatVal = "> 99999";
      unit = "T";
    } else if (landNum.gte(t)) {
      formatVal = landNum.div(BigNumber.from(1e12)).toString();
      unit = "T";
    } else if (landNum.gte(b)) {
      formatVal = landNum.div(BigNumber.from(1e8)).toString();
      unit = "B";
    } else if (landNum.gte(m)) {
      formatVal = landNum.div(BigNumber.from(1e6)).toString();
      unit = "M";
    } else if (landNum.gte(k)) {
      formatVal = landNum.div(BigNumber.from(1e3)).toString();
      unit = "K";
    }

    if (isObj) {
      return {
        land: formatVal,
        unit,
      };
    }
    return formatVal + " " + unit;
  },
};
