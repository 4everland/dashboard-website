import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { mapState } from "vuex";
import vuetify from "./plugins/vuetify";
import "./setup";
import { endpoint } from "./api";
// import AWS from "aws-sdk";
import { S3 } from "@aws-sdk/client-s3";
// import { isSolana } from "@/plugins/sns/snsAirDrop.js";
import { isAirDrop } from "@/plugins/flow/flowAirDrop.js";
export const bus = new Vue();
Vue.config.productionTip = false;

const Minio = require("minio-s");

router.beforeEach((to, _, next) => {
  let { title, group } = to.meta || {};
  const name = "4EVERLAND";
  if (title) {
    if (group) {
      title += " - " + group;
    }
    title += " - " + name;
    for (const key in to.params) {
      title = title.replace(`{${key}}`, to.params[key]);
    }
  } else title = name;
  document.title = title;
  next();
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  computed: {
    ...mapState({
      token: (s) => s.token(),
      noticeMsg: (s) => s.noticeMsg,
      isFocus: (s) => s.isFocus,
    }),
  },
  mounted() {
    this.onInit();
  },
  watch: {
    "$route.path"() {
      window.scrollTo(0, 0);
      this.$loading.close();
    },
    token(val) {
      if (val) {
        this.onInit();
      }
    },
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
    noticeMsg({ name }) {
      if (name == "updateUser") {
        this.getUesrInfo();
      }
    },
  },
  methods: {
    async onInit() {
      if (this.token) {
        await this.getUesrInfo();
        this.initSocket();
        // isSolana();
        isAirDrop();
      } else if (["/", "/login"].indexOf(this.$route.path) == -1) {
        this.$router.replace("/");
      }
    },
    initSocket() {
      const url = /xyz$/.test(process.env.VUE_APP_BASE_URL)
        ? "ws.foreverland.xyz"
        : "ws.4everland.org";
      this.socket = window.io(url, {
        path: "/socket.io",
        query: "authorization=" + encodeURIComponent(this.token),
        withCredentials: false,
        transports: ["websocket", "polling"],
      });
      this.socket.on("error", (err) => {
        console.log("socket error", err, this.socket); // socket.io auto reconnect
      });
      this.socket.on("connect", () => {
        console.log("socket connect");
      });
      this.socket.on("PROJECT_BUILD", ({ name, data }) => {
        if (!name) return;
        if (name == "log") {
          data.state = "RUNNING";
        } else {
          data.state = name.replace("build_", "").toUpperCase();
        }
        this.$setState({
          buildInfo: {
            name,
            data,
          },
        });
        console.log(name, data);
      });
    },
    async getUesrInfo() {
      const { data } = await this.$http.get("/user", {
        params: {
          _auth: 1,
        },
      });
      localStorage.userInfo = JSON.stringify(data);
      this.$setState({
        userInfo: data,
      });
      this.initS3();
    },
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
      // console.log("s3", s3);
      // window.ss3 = Vue.prototype.$ss3 = new AWS.S3({
      //   endpoint,
      //   signatureVersion: "v2",
      //   s3ForcePathStyle: true,
      //   accessKeyId: accessKey,
      //   secretAccessKey: secretKey,
      // });
      // console.log(s3m);
      this.$setState({
        s3,
        s3m,
      });
    },
  },
}).$mount("#app");
