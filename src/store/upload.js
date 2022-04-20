export default {
  state: {
    path: "",
    originFiles: [],
    uploadFiles: [],
    executionFiles: [],
  },
  getters: {
    all(state) {
      return state.executionFiles;
    },
    uploading(state) {
      return state.executionFiles.filter((i) => /(Preparing)|%/.test(i.status));
    },
    stopped(state) {
      return state.executionFiles.filter((i) => i.status == "Stopped");
    },
    uploaded(state) {
      return state.executionFiles.filter((i) => i.status == "Uploaded");
    },
    failed(state) {
      return state.executionFiles.filter((i) => i.status == "Uploaded Failed");
    },
  },
  mutations: {
    UPDATE_PATH(state, value) {
      state.path = value;
    },
    UPDATE_ORIGIN_FILES(state, value) {
      // state.originFiles = value;
      console.log(typeof value);
      if (typeof value == "number") {
        state.originFiles.splice(value, 1);
      } else {
        state.originFiles.unshift(value);
      }
    },
    UPDATE_EXECUTION_FILES(state, value) {
      // state.executionFiles = value.map((item, index) => {
      //   return {
      //     name: (item.name || "").cutStr(20, 10),
      //     index,
      //     path: state.path,
      //     status: "Preparing",
      //     actions: "",
      //   };
      // });

      state.executionFiles.unshift({
        name: (value.name || "").cutStr(20, 10),
        // index,
        path: state.path,
        status: "Preparing",
        actions: "",
      });
    },
    UPDATE_UPLOAD_FILES(state, value) {
      if (value instanceof Array && value.length == 0)
        return (state.uploadFiles = []);
      if (typeof value == "number") return state.uploadFiles.splice(value, 1);
      state.uploadFiles.unshift(value);
    },
    UPDATE_STATUS(state, { progress, i }) {
      state.executionFiles[i].status = progress;
    },
    PUT_EXECUTION(state) {
      let arr = state.uploadFiles.map((item, index) => {
        return {
          name: (item.name || "").cutStr(20, 10),
          index,
          path: state.path,
          status: "Preparing",
          actions: "",
        };
      });

      state.executionFiles = [...arr, ...state.executionFiles];
    },
  },
  actions: {
    updateOriginFiles({ commit }, payload) {
      commit("UPDATE_ORIGIN_FILES", payload);
    },
    updateStatus({ commit }, payload) {
      commit("UPDATE_STATUS", payload);
    },
    updateUploadFiles({ commit }, payload) {
      commit("UPDATE_UPLOAD_FILES", payload);
    },
    updateExecutionFiles({ commit }, payload) {
      commit("UPDATE_EXECUTION_FILES", payload);
    },
  },
};
