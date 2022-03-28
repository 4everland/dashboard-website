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
  },
  mounted() {
    this.onGithubCode();
  },
  methods: {
    async onGithubCode() {
      const { code } = this.$route.query;
      if (!code || code == localStorage.last_github_code) return;
      localStorage.last_github_code = code;
      try {
        this.$loading("Binding Github");
        const { data } = await this.$http.get(`/auth/vcode/${code}`, {
          params: {
            _auth: 1,
            type: 1,
          },
        });
        console.log(data);
        this.$setMsg({
          name: "updateUser",
        });
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
    async onBind(it) {
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