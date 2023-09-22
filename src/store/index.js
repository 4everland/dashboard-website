import Vue from "vue";
import Vuex from "vuex";
import http from "../api";
import moduleS3 from "./s3";
Vue.use(Vuex);

const SET_DATA = "setData";

const store = new Vuex.Store({
  state: {
    nowDate: new Date(),
    pageLoaded: false,
    ...getWH(),
    isTouch: "ontouchstart" in window,
    scrollTop: 0,
    isFocus: true,
    appInfo: {
      title: "",
    },
    token: () => {
      return localStorage.token;
    },
    loginSta: 0,
    userInfo: JSON.parse(localStorage.userInfo || "{}"),
    teamList: JSON.parse(localStorage.teamList || "[]"),
    teamId: localStorage.teamId || null,
    noticeMsg: {},
    alertInfo: {},
    navItems: [],
    // bucket
    s3: null,
    s3m: null,
    searchKey: "",
    usageInfo: {},
    // hosting
    connectAddr: "",
    netType: "",
    chainId: 0,
    buildInfo: {},
    projectInfo: {},
    worldMapJson: null,
    payBy: localStorage.payBy || "Polygon",
    orderInfo: JSON.parse(localStorage.orderInfo || "{}"),
    showProgress: false,
    allowNoLogin: false,
    changelogNum: localStorage.changelogNum || "30",
    onChain: null,
    hasClaim: false,
    pointsTrack: 0,
    code: null,
  },
  getters: {
    teamInfo(state) {
      const obj =
        state.teamList.find((it) => it.teamId == state.teamId) ||
        state.teamList[0];
      const info = { ...obj };
      return info;
    },
    walletObj(state) {
      const { walletType } = state.userInfo.wallet || {};
      let provider = window.ethereum;
      let metamaskProvider,
        coinbaseProvider = null;
      if (window.ethereum.providers?.length) {
        window.ethereum.providers.forEach(async (p) => {
          if (p.isCoinbaseWallet) {
            coinbaseProvider = p;
          }
          if (p.isMetaMask) {
            metamaskProvider = p;
          }
        });
        if (walletType == "COINBASE") {
          provider = coinbaseProvider;
        } else {
          provider = metamaskProvider;
        }
      }

      return walletType == "OKX" ? window.okxwallet : provider;
    },
  },
  mutations: {
    [SET_DATA](state, data) {
      for (const key in data) {
        state[key] = data[key];
      }
    },
    setProject(_, info) {
      const data = { ...info };
      const { repo = {} } = data;
      repo.pathPre = `${repo.namespace}/${repo.name}`;
      data.repo = repo;
      const { name, projectId } = (data.config = data.buildConfig);
      delete data.buildConfig;
      data.name = name;
      data.id = projectId;
      Object.assign(data, {
        state: "unknown",
        ...data.latest,
      });
      const [row] = data.domains || [];
      if (row) {
        data.mainLink = "//" + row.domain;
      }
      setState({
        projectInfo: data,
      });
    },
    SET_HAS_CLAIM(state, data) {
      state.pointsTrack = data.total;
      state.hasClaim = data.hasClaim;
    },
    SET_CODE(state, code) {
      state.code = code;
    },
  },
  actions: {
    async getProjectInfo({ commit }, id) {
      const { data } = await http.get("$hosting/project/" + id);
      console.log(data.buildConfig.node, "----");
      if (data.platform == "IC") {
        let index = data.domains.findIndex((it) =>
          /foreverland\.xyz$/.test(it.domain)
        );
        data.domains.splice(index, 1);
      }
      commit("setProject", data);
      return data;
    },
    async checkClaim({ commit }) {
      try {
        const { data } = await Vue.prototype.$http(
          "$auth/activities/point/overview",
          {
            noTip: 1,
          }
        );
        if (data.unclaimed > 0) {
          data.hasClaim = true;
          commit("SET_HAS_CLAIM", data);
        } else {
          data.hasClaim = false;
          commit("SET_HAS_CLAIM", data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getCode({ commit }) {
      try {
        const { data } = await Vue.prototype.$http.get("$auth/invitation/code");
        commit("SET_CODE", data);
      } catch (error) {
        // throw error
        console.log(error);
      }
    },
  },
  modules: {
    moduleS3,
  },
});

export const setState = (Vue.prototype.$setState = (data) => {
  store.commit(SET_DATA, data);
});
Vue.prototype.$setMsg = (obj) => {
  let noticeMsg = obj;
  if (typeof obj == "string") {
    noticeMsg = {
      name: obj,
    };
  }
  setState({
    noticeMsg,
  });
};

function getWH() {
  const { clientWidth, clientHeight } = document.documentElement;
  return {
    clientWidth,
    clientHeight,
  };
}
window.onresize = () => {
  setState({
    ...getWH(),
  });
};
window.onblur = () => {
  setState({
    isFocus: false,
  });
};
window.onfocus = () => {
  const isTouch = "ontouchstart" in window;
  setState({
    isFocus: true,
    isTouch,
  });
};

setInterval(() => {
  setState({
    nowDate: new Date(),
  });
}, 1e3);

window.onload = () => {
  // console.log("onload", window.jdenticon);
  setState({
    pageLoaded: true,
  });
};

window.onscroll = () => {
  setState({
    scrollTop: window.scrollY,
  });
};

export default store;
