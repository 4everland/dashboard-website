import Vue from "vue";
import Vuex from "vuex";
import { http, http2 } from "../api";

Vue.use(Vuex);

const SET_DATA = "setData";

const store = new Vuex.Store({
  state: {
    nowDate: new Date(),
    pageLoaded: false,
    ...getWH(),
    isTouch: "ontouchstart" in window,
    isFocus: true,
    appInfo: {
      title: "",
    },
    token: () => {
      return localStorage.token;
    },
    loginSta: 0,
    userInfo: JSON.parse(localStorage.userInfo || "{}"),
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
    walletTip: "",
    buildInfo: {},
    projectInfo: {},
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
  },
  actions: {
    async getProjectInfo({ commit }, id) {
      const { data } = await http2.get("/project/" + id);
      commit("setProject", data);
      return data;
    },
    async getUsageInfo() {
      const { data } = await http.get("/user/resource/usage");
      const {
        arweaveUsedStorage = 0,
        arweaveSyncingStorage = 0,
        arweaveTotalStorage = 0,
      } = data;
      let arUsed = (arweaveUsedStorage * 1 + arweaveSyncingStorage * 1) / 1024;
      setState({
        usageInfo: {
          ipfsTotal: data.totalStorage * 1024,
          ipfsUsed: data.usedStorage * 1024,
          arTotal: parseInt(arweaveTotalStorage / 1024),
          arUsed: arUsed.toFixed(2),
          arSyncing: (arweaveSyncingStorage / 1024).toFixed(2),
          arSynced: (arweaveUsedStorage / 1024).toFixed(2),
        },
      });
    },
  },
});

export const setState = (Vue.prototype.$setState = (data) => {
  store.commit(SET_DATA, data);
});
Vue.prototype.$setMsg = (noticeMsg) => {
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

export default store;
