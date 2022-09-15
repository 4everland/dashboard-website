import { S3 } from "@aws-sdk/client-s3";
const Minio = require("minio-s");
import { endpoint } from "../../api";
import Vue from "vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      s3Timing: null,
    };
  },
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
    }),
  },
  watch: {
    isFocus(val) {
      if (val) {
        setTimeout(() => {
          const stsData = JSON.parse(localStorage.stsData1 || "null");
          if (stsData && stsData.expiredAt - Date.now() / 1e3 < 600) {
            location.reload();
          }
        }, 1e3);
      }
    },
  },
  methods: {
    async initS3() {
      let stsData = JSON.parse(localStorage.stsData1 || "null");
      if (!stsData || Date.now() >= (stsData.expiredAt - 3600) * 1e3) {
        const { data } = await this.$http.get("/user/sts/assume-role");
        stsData = data;
        localStorage.stsData1 = JSON.stringify(data);
      }
      // auto refresh sts
      if (this.s3Timing) {
        clearTimeout(this.s3Timing);
      }
      const refreshDelay = (stsData.expiredAt - 3600) * 1e3 - Date.now();
      if (refreshDelay > 1e3) {
        this.s3Timing = setTimeout(() => {
          this.initS3();
        }, refreshDelay);
        console.info(
          `refresh sts after ${(refreshDelay / 3600 / 1e3).toFixed(2)}h`
        );
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
      this.$setState({
        s3,
        s3m,
      });
    },
  },
};
