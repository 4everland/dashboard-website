<template>
  <v-app-bar
    app
    height="64"
    color="#fff"
    elevation="0"
    style="padding: 0px 8px"
  >
    <v-app-bar-nav-icon
      class="d-block d-lg-none"
      @click="$setMsg('showDrawer')"
    ></v-app-bar-nav-icon>
    <a href="/">
      <img v-if="asMobile" src="/img/svg/logo-m.svg" width="46" alt="" />
    </a>
    <div v-if="path == '/overview' && !asMobile">
      <div class="fz-20 fw-b">Overview of {{ teamInfo.name }}</div>
      <div class="fz-11 text--secondary">Welcome to 4EVERLAND Dashboard</div>
    </div>
    <v-spacer></v-spacer>
    <div class="header-right-box">
      <div class="hidden-sm-and-down">
        <v-btn
          v-for="item in textBtnList"
          :key="item.label"
          :text="item.text || true"
          :plain="item.plain || true"
          :ripple="item.ripple || false"
          :color="item.color || 'textSecondary'"
          :to="item.to"
          :href="item.href"
          :target="item.target"
          >{{ item.label }}</v-btn
        >
      </div>

      <v-divider vertical class="mr-4 hidden-sm-and-down"></v-divider>
      <div class="menu-btn-box mr-4 mr-sm-2">
        <!-- <v-btn
          v-for="item in menuBtnList"
          class="px-0 px-md-4"
          :class="item.hiddenMobile ? 'hidden-sm-and-down' : ''"
          :key="item.label"
          :color="item.color"
          :to="item.to"
          :href="item.href"
          :target="item.target"
          :min-width="asMobile ? '40px' : ''"
        >
          <img
            v-if="item.icon"
            class="mr-0"
            :class="item.iconClass || 'mr-md-2'"
            :src="item.icon"
            :width="item.iconWhidth || 24"
            :alt="item.label + '_icon'"
          />
          <span v-if="!asMobile"> {{ item.label }}</span>
        </v-btn> -->

        <v-btn
          class="boost-enter px-0 px-md-4"
          @click="$router.push('/boost')"
          :min-width="asMobile ? '40px' : ''"
        >
          <img width="28" src="/img/booster/4ever-point-icon.png" alt="" />
          <span v-if="!asMobile" class="fw-b ml-2" style="color: #fff"
            >4EVER Boost</span
          >
        </v-btn>
      </div>
      <v-menu
        bottom
        min-width="128px"
        content-class="avartar-menu"
        rounded
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            :max-width="asMobile ? 24 : 40"
            :max-height="asMobile ? 24 : 40"
            v-on="on"
          >
            <v-avatar color="brown" :size="asMobile ? 24 : 40">
              <img :src="avatar" alt="avatar" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card elevation="4">
          <v-list>
            <!-- :to="sub.to"
            :href="sub.href"
            :target="sub.href ? '_blank' : ''" -->
            <v-list-item
              v-for="(item, i) in menus"
              :key="i"
              link
              @click="onMenu(item)"
            >
              <img
                :src="item.img || `/img/svg/header/${item.icon}.svg`"
                :width="item.width || 24"
                :height="item.height"
                class="mr-2"
              />
              <span class="text--secondary fz-12">{{ item.label }}</span>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import Axios from "axios";

export default {
  data() {
    return {
      textBtnList: [
        {
          label: "Docs",
          href: "https://docs.4everland.org",
          target: "_blank",
        },
        // {
        //   label: "Changelog",
        //   to: "/changelog",
        //   badge: Math.max(0, this.newChagelogNum - this.changelogNum),
        // },
      ],
      menuBtnList: [
        {
          label: "Task Hub",
          to: "/task-hub",
          hiddenMobile: true,
        },
        {
          label: "Elite Quest",
          to: "/quest",
          color: "primary",
          icon: require("@/assets/imgs/header/eliteQuest.png"),
          iconClass: "mr-md-2",
          iconWhidth: 24,
        },
      ],
      menus: [
        {
          label: "Referral",
          icon: "m-refer",
          to: "/referral",
        },
        // {
        //   label: "Collection",
        //   icon: "m-collect",
        //   to: "/collections",
        // },
        {
          label: "Feedback",
          icon: "m-report",
          // noticeMsg: {
          //   name: "feedback",
          // },
          href: "https://discord.com/channels/852482727164117022/1039457937594257448",
        },
        {
          label: "Disconnect",
          icon: "m-logout",
          name: "logout",
        },
      ],
      newChagelogNum: 0,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      showProgress: (s) => s.showProgress,
      changelogNum: (s) => s.changelogNum,
    }),
    ...mapGetters(["teamInfo"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    avatar() {
      const info = this.userInfo;
      return info.avatar || "/img/bg/user/def-avatar.png";
    },
    path() {
      return this.$route.path;
    },
  },
  watch: {
    userInfo() {
      setTimeout(() => {
        window.jdenticon();
      }, 100);
    },
  },
  mounted() {
    if (this.userInfo.uid) {
      this.$nextTick(() => {
        window.jdenticon();
      });
    }
    this.getNewChagneLogNum();
    if (localStorage.token) {
      this.checkClaim();
    }
  },
  methods: {
    ...mapActions(["checkClaim"]),
    async getNewChagneLogNum() {
      const { data } = await Axios.get(
        "https://4ever-web.bucket.4everland.xyz/config/header.json"
      );
      this.newChagelogNum = data.changeLogNum;
      // localStorage.changelogNum = this.newChagelogNum;
    },

    async onMenu(it) {
      if (it.name == "logout") {
        this.$clearLogin();
        location.href = this.$getLoginUrl();
        return;
      }
      if (it.href) {
        window.open(it.href);
      }
      if (it.to) {
        if (this.teamInfo.isMember && !it.noLogin) {
          await this.$confirm(
            "Switch to the owner account and show relevant content?"
          );
          this.$setState({
            teamId: null,
          });
        }
        this.$router.push(it.to);
      }
      if (it.noticeMsg) {
        console.log(it);
        this.$setMsg({
          ...it.noticeMsg,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header-right-box {
  display: flex;
  align-items: center;
  .menu-btn-box {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}
.avartar-menu {
  border-radius: 4px !important;
  border: 1px solid #eaecf0 !important;
  box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08),
    0px 4px 6px -2px rgba(16, 24, 40, 0.03) !important;
}

.boost-enter {
  background: url("/img/booster/enter-bg.png") lightgray 50% / cover no-repeat;
  background-size: 100% 100%;
}
</style>
