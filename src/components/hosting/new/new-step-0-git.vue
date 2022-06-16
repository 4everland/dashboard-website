<template>
  <div>
    <h-storage ref="stor" />
    <template v-if="isBind">
      <div class="d-flex al-c mb-3">
        <v-btn icon small :loading="loading" @click="onRefresh" class="mr-3">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-menu offset-y :open-on-hover="!isTouch" v-model="popAccounts">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              rounded
              color="primary"
              class="mr-3"
              @click="addNew"
              small
              v-bind="attrs"
              v-on="on"
            >
              <v-icon size="18" class="mr-1">mdi-github</v-icon>
              <span>{{ selectLabel }}</span>
            </v-btn>
          </template>
          <v-list dense v-if="accountList.length > 0">
            <v-list-item
              @click="onChooseAccount(it)"
              link
              v-for="it in accountList"
              :key="it.githubId"
            >
              <v-list-item-title class="d-flex al-c">
                <v-icon
                  size="18"
                  class="mr-1"
                  :color="it.githubId == chooseGithubId ? '#4A96FA' : null"
                >
                  mdi-{{
                    it.ownerType == "Organization"
                      ? "account-group-outline"
                      : "account-outline"
                  }}
                </v-icon>
                <span
                  :class="{
                    'fw-b color-1': it.githubId == chooseGithubId,
                  }"
                  >{{ it.name }}</span
                >
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item link @click="addNew">
              <v-list-item-title class="d-flex al-c">
                <v-icon size="18" class="mr-1">mdi-plus</v-icon>
                <span>Add Org or Account</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-text-field
          v-model="keyword"
          clearable
          @keyup="onSearch"
          prepend-icon="mdi-magnify"
          style="margin-top: 14px"
          placeholder="Search"
          dense
          autocomplete="off"
        ></v-text-field>
      </div>

      <v-skeleton-loader v-if="!list" type="article" />

      <div
        class="bd-1 bg-f5 bdrs-5 pa-10 d-flex flex-center al-c"
        style="min-height: 355px"
        v-else-if="!list.length"
      >
        <div class="ta-c mt-8">
          <!-- v-if="keyword" -->
          <h3>No Results Found</h3>
        </div>
      </div>
      <div v-else>
        <div class="bd-1 bdrs-5 ov-a" style="max-height: 355px">
          <div v-for="(it, i) in list" :key="it.id">
            <div class="pd-20 d-flex al-c">
              <!-- <v-icon class="mr-5">mdi-wallet</v-icon> -->
              <img :src="it.fwImg" width="18" class="mr-2" />
              <span class="fz-17 line-1 mr-1">{{ it.name }}</span>
              <v-icon v-if="it.private" color="#999" size="16" class="ml-1"
                >mdi-lock-outline</v-icon
              >
              <span class="ml-2 mr-3 gray fz-13 shrink-0" v-if="!asMobile">
                <e-time>{{ it.updateAt }}</e-time>
              </span>
              <v-btn
                class="ml-auto"
                color="primary"
                small
                @click="onSelect(it)"
                >{{ inSetting ? "Select" : "Import" }}</v-btn
              >
            </div>
            <v-divider v-if="i < list.length - 1"></v-divider>
          </div>
        </div>
        <div class="mt-3" v-show="pageLen > 1">
          <v-pagination
            @input="onPage"
            v-model="page"
            :length="pageLen"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            :total-visible="6"
          ></v-pagination>
        </div>
      </div>
    </template>
    <div class="bg-f9 pa-5 pt-8 pb-8" v-else>
      <p class="fz-18 fw-b mt-">Continuous Deployment</p>
      <template v-if="!inSetting">
        <div class="pa-5"></div>
        <div class="gray fz-15 mt-16">
          <p>
            We use Deloyhooks to connect with your Github, and if we receive
            push, we will automatically deploy updates. Github binds your Git
            account with your 4EVERLAND account by default.
          </p>
        </div>
        <div class="pa-9"></div>
      </template>
      <div class="mt-16 pb-1">
        <v-btn color="primary" @click="addNew" :loading="loading">
          <v-icon size="20">mdi-github</v-icon>
          <span class="ml-2">Connect with Github</span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import debounce from "../../../plugins/debounce";

export default {
  props: {
    active: Boolean,
    inSetting: Boolean,
  },
  data() {
    const { c } = this.$route.query;
    return {
      connecting: false,
      list: null,
      loading: false,
      keyword: "",
      timing: null, // after select git, auto refresh
      accountList: [],
      chooseGithubId: !c ? localStorage.chooseGithubId || "" : "",
      popAccounts: false,
      page: 1,
      pageLen: 1,
      isBind: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      isFocus: (s) => s.isFocus,
      isTouch: (s) => s.isTouch,
      noticeMsg: (s) => s.noticeMsg,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    chooseAccount() {
      return this.accountList.filter(
        (it) => it.githubId == this.chooseGithubId
      )[0];
    },
    selectLabel() {
      if (this.chooseAccount) return this.chooseAccount.name;
      return "Connect To Git";
    },
  },
  watch: {
    isFocus(val) {
      if (val && this.isAddClick) {
        this.isAddClick = false;
        this.getAccounts();
        let times = 0;
        this.clearTiming();
        this.timing = setInterval(() => {
          if (!this.accountList.length) {
            this.getAccounts();
            times += 1;
            if (times > 2) this.clearTiming();
          }
        }, 5e3);
      }
    },
    keyword(val) {
      if (!val) this.getList();
    },
    active(val) {
      if (val) this.getList();
    },
    noticeMsg({ name }) {
      if (name == "check-agree") this.addNew();
    },
    isBind(val) {
      if (val)
        this.$setMsg({
          name: "updateUser",
        });
    },
  },
  async mounted() {
    // await this.checkBind();
    if (this.$route.query.from == "github-install") {
      window.close();
      return;
    }
    this.getAccounts();
  },
  methods: {
    clearTiming() {
      if (this.timing) {
        clearInterval(this.timing);
        this.timing = null;
      }
    },
    onSelect(it) {
      this.$emit("select", it);
    },
    onCheck() {
      return this.$refs.stor.checkStorage();
    },
    async checkBind() {
      const { code } = this.$route.query;
      if (!code || code == localStorage.last_github_code) return;
      localStorage.last_github_code = code;
      try {
        this.connecting = true;
        await this.$http.get(`/auth/vcode/${code}`, {
          params: {
            _auth: 1,
            type: 1,
          },
        });
        this.$setMsg({
          name: "updateUser",
        });
      } catch (error) {
        console.log(error);
      }
      this.connecting = false;
    },
    async addNew() {
      if (this.isTouch && !this.popAccounts && this.accountList.length) {
        this.popAccounts = true;
        return;
      }
      const needCheck = await this.onCheck();
      if (needCheck) return;
      this.isAddClick = true;
      try {
        this.$loading();
        const { data } = await this.$http2.get("/githubapp/install");
        this.$openWindow(data.installUrl);
      } catch (error) {
        //
      }
      this.$loading.close();
    },
    onKeyword() {
      if (this.keyword == this.usedKeyword) return;
      this.page = 1;
      this.list = null;
      this.getList();
    },
    onSearch() {
      if (this.keyword) {
        debounce(this.onKeyword);
      }
    },
    onPage() {
      this.getList();
    },
    onChooseAccount(it) {
      this.chooseGithubId = it.githubId;
      localStorage.chooseGithubId = this.chooseGithubId;
      this.list = null;
      this.page = 1;
      this.getList();
    },
    onRefresh() {
      if (!this.chooseAccount) {
        this.list = [];
        this.getAccounts();
        return;
      }
      this.getList();
    },
    async getAccounts() {
      try {
        this.loading = true;
        const { data } = await this.$http2.get("/user/git-namespaces", {
          noTip: true,
        });
        if (data.length) {
          this.isBind = true;
          data.sort((a, b) => {
            if (a.ownerType == "User" && b) return -1;
            return 0;
          });
          if (
            this.isAddClick === false &&
            data.length == this.accountList.length + 1
          ) {
            this.isAddClick = 0;
            const newItem = data.filter((it) => {
              return (
                this.accountList.filter((row) => row.githubId == it.githubId)
                  .length == 0
              );
            })[0];
            if (newItem) this.chooseGithubId = newItem.githubId;
          }
          this.accountList = data;
          if (!this.chooseAccount) {
            this.chooseGithubId = data[0].githubId;
          }
        } else {
          this.isBind = false;
        }
        this.page = 1;
        this.getList();
      } catch (error) {
        console.log(error.code);
        this.isBind = false;
      }
      this.loading = false;
    },
    async getList() {
      if (!this.accountList.length) return;
      try {
        this.loading = true;
        const params = {
          githubId: this.chooseGithubId,
          page: this.page - 1,
        };
        if (this.keyword) params.word = this.keyword;
        const { data } = await this.$http2.get("/repo/refresh/list", {
          params,
        });
        this.usedKeyword = this.keyword;
        this.pageLen = Math.max(1, Math.ceil(data.totalCount / 5));
        this.list = (data.repoList || []).map((it) => {
          it.fwImg = this.$getFramework(it.frameWorkAdvice).logo;
          return it;
        });
        this.$emit("list", this.list);
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>
