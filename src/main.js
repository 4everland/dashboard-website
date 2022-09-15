import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store, { setState } from "./store";
import { mapState } from "vuex";
import vuetify from "./plugins/vuetify";
import "./setup";
import { isAirDrop } from "@/plugins/flow/flowAirDrop.js";
Vue.config.productionTip = false;

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
  setState({
    showProgress: true,
  });
  next();
});
router.afterEach(() => {
  setState({
    showProgress: false,
  });
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
        // console.log(name, data);
      });
    },
    async getUesrInfo() {
      const { data } = await this.$http.get("$auth/user");
      localStorage.userInfo = JSON.stringify(data);
      this.$setState({
        userInfo: data,
      });
    },
  },
}).$mount("#app");
