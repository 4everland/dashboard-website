<template>
  <div>
    <v-row>
      <v-col cols="12" md="4" v-for="(it, i) in list" :key="i">
        <div class="item bg-f8a pa-5 bd-1 bdrs-10">
          <div class="d-flex al-c">
            <img :src="`img/svg/settings/${it.icon}.svg`" height="30" />
            <b class="ml-3">{{ it.title }}</b>
          </div>
          <div class="mt-2 gray fz-14" style="min-height: 40px">
            {{ it.desc }}
          </div>
          <div class="mt-3 d-flex al-c">
            <v-btn
              color="primary"
              :disabled="!!it.account"
              rounded
              small
              min-width="75"
              @click="onBind(it)"
              >{{ it.account ? "Verified" : "Verify" }}</v-btn
            >
            <span v-if="it.account" class="ml-auto gray fz-13">
              {{ it.account.cutStr(6, 6) }}
            </span>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      connectAddr: (s) => s.connectAddr,
    }),
    list() {
      const info = this.userInfo;
      return [
        {
          title: "Github",
          desc: "Get verified by connecting your github account.",
          icon: "m-github",
          type: 1,
          account: (info.github || {}).name,
        },
        {
          title: "MetaMask",
          desc: "Get verified by connecting your metamask account.",
          icon: "m-metamask",
          type: 2,
          account: (info.wallet || {}).address,
        },
        {
          title: "Email",
          desc: "Verify your email address to receive updates and notices for your account.",
          icon: "m-email",
          type: 3,
          account: info.email,
        },
      ];
    },
    query() {
      return this.$route.query;
    },
  },
  watch: {
    query() {
      this.checkQuery();
    },
    connectAddr(val) {
      if (this.binding == 2 && val) {
        this.binding = null;
        this.onVcode(2, val);
      }
    },
  },
  mounted() {
    this.onGithubCode();
    this.checkQuery();
  },
  methods: {
    checkQuery() {
      const { type, redirect } = this.query;
      if (type) {
        const item = this.list.filter((it) => it.type == type)[0];
        if (item) {
          if (redirect) localStorage.bind_redirect = redirect;
          this.onBind(item);
        }
      }
    },
    onBindSuc() {
      const link = localStorage.bind_redirect;
      if (link) {
        this.$navTo(link);
        localStorage.bind_redirect = "";
      }
    },
    async onGithubCode() {
      const { code } = this.$route.query;
      if (!code || code == localStorage.last_github_code) return;
      localStorage.last_github_code = code;
    },
    async onVcode(type, code) {
      try {
        const item = this.list[type - 1];
        this.$loading("Binding " + item.title);
        this.$loading.close();
        // const { data } =
        await this.$http.get(`/auth/vcode/${code}`, {
          params: {
            _auth: 1,
            type,
          },
        });
        this.$setMsg({
          name: "updateUser",
        });
        this.onBindSuc();
      } catch (error) {
        console.log(error);
      }
    },
    async onBind(it) {
      if (it.type == 2) {
        this.binding = 2;
        this.$setMsg({
          name: "showMetaConnect",
        });
        return;
      }
      if (it.type != 1) return this.$toast("todo");
      try {
        this.$loading();
        const { data } = await this.$http.post(
          "/bind",
          {
            type: it.type,
          },
          {
            params: {
              _auth: 1,
            },
          }
        );
        console.log(data);
        const url = data.applyR;
        if (it.type == 1) {
          location.href = url;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>