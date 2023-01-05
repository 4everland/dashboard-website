import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store, { setState } from "./store";
import { mapState } from "vuex";
import vuetify from "./plugins/vuetify";
import "./setup";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { newUserDrop } from "@/plugins/airDrop/index.js";
newUserDrop();
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
      allowNoLogin: (s) => s.allowNoLogin,
      teamId: (s) => s.teamId,
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
      if (location.href.includes("type=clone-flow")) {
        this.$setState({
          allowNoLogin: true,
        });
      }
      if (this.token) {
        await this.getUesrInfo();
        this.initSocket();
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
        console.log(name, data);
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
        allowNoLogin: this.allowNoLogin && !data.github,
      });
      this.getTeamList();
    },
    async getTeamList() {
      // let {
      //   data: { items },
      // } = await this.$http.get("$auth/cooperation/teams");
      let items = [
        {
          teamId: "0x712b4daf0ab3761abadf80baeccba92bb120252d",
          teamName: "",
          teamAvatar: null,
          token:
            "e30=.eyJqdGkiOiJtV1lmRnM0S1cxMlkrL2N3dVBISVNpUGp5UUpjZ3ZlSVQxSi9RbFpNQThmTWxIaGJIalNJdEhtc0RBVTlwelVCa0ZjWnlXeEJKdjhDa3AvaUx5UURJa3FTQ253ZG9qVVRkYktBVTVKdEVkbz0ifQ==.ff0bcb467e0bd5ce23c2ea83c53160287e78177e0020cf36b30efecefac45ca2",
          type: "INDIVIDUAL",
        },
        {
          teamId: "2",
          teamName: "long-team",
          teamAvatar: null,
          token:
            "e30=.eyJqdGkiOiJtV1lmRnM0S1cxMlkrL2N3dVBISVNwZ2ZUNUE0L0xCYlk1Z1hwbmVEV0FxUlkwakgvYWg0QnpXWEdXb3prL0VUT0t1VzA5MGsrV3lsZ0c2c0ZrY3kvWC9CWERwUU9Ib0hhVjNBakJtWmlyND0ifQ==.cf5b4ffd438d3ae962a8fdffe4f2f4ca5d026f31bfcf2af3aaa356b72c0f8cf1",
          type: "COLLABORATION",
        },
      ];
      items.forEach((it) => {
        it.name = it.teamName || it.teamId.cutStr(6, 4);
      });
      let teamId = this.teamId;
      if (!items.find((it) => it.teamId == teamId)) {
        teamId = items[0].teamId;
      }
      localStorage.teamList = JSON.stringify(items);
      localStorage.teamId = teamId;
      this.$setState({
        teamList: items,
        teamId,
      });
    },
  },
}).$mount("#app");
