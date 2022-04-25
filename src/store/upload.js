export default {
  state: {
    path: "",
    specifiedPath: "",
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
    UPDATE_SPECIFIED_PATH(state, value) {
      state.specifiedPath = value;
    },
    UPDATE_ORIGIN_FILES(state, value) {
      console.log(typeof value);
      if (typeof value == "string") {
        let index = state.originFiles.findIndex((it) => it.id == value);
        state.originFiles.splice(index, 1);
      } else {
        state.originFiles.unshift(value);
      }
    },
    UPDATE_UPLOAD_FILES(state, value) {
      if (value instanceof Array && value.length == 0)
        return (state.uploadFiles = []);
      if (typeof value == "string") {
        let index = state.uploadFiles.findIndex((it) => it.id == value);

        return state.uploadFiles.splice(index, 1);
      }
      state.uploadFiles.unshift(value);
    },
    UPDATE_STATUS(state, { progress, id }) {
      let i = state.executionFiles.findIndex((it) => it.id == id);
      state.executionFiles[i].status = progress;
    },
    PUT_EXECUTION(state) {
      let arr = state.uploadFiles.map((item) => {
        return {
          name: (item.name || "").cutStr(20, 10),
          id: item.id,
          path: state.path + state.specifiedPath,
          status: "Preparing",
          actions: "",
        };
      });
      state.executionFiles = [...arr, ...state.executionFiles];
    },
    CLEAR_RECORDS(state, id) {
      state.executionFiles.splice(
        state.executionFiles.findIndex((it) => it.id == id),
        1
      );
      state.originFiles.splice(
        state.originFiles.findIndex((it) => it.id == id),
        1
      );
    },
    STOP_TASK(state, id) {
      let index = state.executionFiles.findIndex((it) => it.id == id);
      state.executionFiles[index].status = "Stopped";
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
  },
};
