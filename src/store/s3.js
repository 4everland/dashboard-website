import { S3 } from "@aws-sdk/client-s3";
const Minio = require("@4everland/minio");
import { endpoint } from "../api";
import Vue from "vue";
export default {
  state: () => ({
    s3Timing: null,
    s3: null,
    s3m: null,
  }),
  mutations: {
    SET_S3TIMING(state, refreshDelay) {
      state.s3Timing = setTimeout(() => {
        this.initS3();
        console.info(
          `refresh sts after ${(refreshDelay / 3600 / 1e3).toFixed(2)}h`
        );
      }, refreshDelay);
    },

    SET_S3(state, { s3, s3m }) {
      state.s3 = s3;
      state.s3m = s3m;
    },
  },
  actions: {
    async initS3({ state, commit }) {
      let stsData = JSON.parse(localStorage.stsData1 || "null");
      if (!stsData || Date.now() >= (stsData.expiredAt - 3600) * 1e3) {
        const { data } = await Vue.prototype.$http.get("/user/sts/assume-role");
        stsData = data;
        localStorage.stsData1 = JSON.stringify(data);
      }
      // auto refresh sts
      if (state.s3Timing) {
        clearTimeout(state.s3Timing);
      }
      const refreshDelay = (stsData.expiredAt - 3600) * 1e3 - Date.now();
      console.log(refreshDelay);
      if (refreshDelay > 1e3) {
        commit("SET_S3TIMING", refreshDelay);
      }
      const { accessKey, secretKey, sessionToken } = stsData;
      const s3 = new S3({
        endpoint,
        signatureVersion: "v2",
        s3ForcePathStyle: true,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
          sessionToken,
        },
        region: "eu-west-2",
      });
      const s3m = new Minio.Client({
        endPoint: endpoint.replace("https://", ""),
        port: 443,
        useSSL: true,
        accessKey,
        secretKey,
        sessionToken,
      });
      window.s3 = Vue.prototype.$s3 = s3;
      commit("SET_S3", { s3, s3m });
    },
  },
};
