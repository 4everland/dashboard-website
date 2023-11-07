<style lang="scss">
#e-header {
  box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 15%) !important;
  z-index: 110;
}
</style>
<template>
  <div class="pos-r">
    <div class="pos-f top-0 w100p z-1000" v-show="showProgress">
      <v-progress-linear
        indeterminate
        color="cyan"
        height="2"
      ></v-progress-linear>
    </div>
    <v-app-bar id="e-header" app clipped-left height="60" color="#fff">
      <a href="/">
        <img
          :src="`/img/svg/logo${asMobile ? '-m' : ''}.svg`"
          height="30"
          class="d-b"
        />
      </a>
      <v-spacer></v-spacer>
      <template>
        <e-menu
          offset-y
          open-on-hover
          :disabled="!it.subs"
          v-for="(it, i) in menus"
          :key="i"
        >
          <!-- :href="it.href"
          :to="it.to"
          :target="it.href ? '_blank' : ''" -->

          <v-btn
            slot="ref"
            text
            @click="onMenu(it)"
            :style="it.btnStyle"
            class="ml-4"
            :id="it.to == '/task-hub' ? 'reward-guide' : null"
          >
            <img
              v-if="it.preImg"
              :src="it.preImg"
              :width="it.width"
              :height="it.height"
              :class="it.imgCls"
            />
            <e-team-avatar
              class="cursor-p mr-2"
              v-if="it.uid"
              :src="it.avatar"
              :size="20"
              :uid="it.uid"
            ></e-team-avatar>
            <v-badge dot color="error" :value="it.badge || 0">
              <span :style="{ color: it.color || '#555' }">{{ it.label }}</span>
            </v-badge>
            <img
              v-if="it.subs && !it.noSuffix"
              :src="`/img/svg/header/ic-down-${it.color || 'def'}.svg`"
              width="10"
              class="ml-2"
            />
            <img
              v-if="it.img"
              :src="it.img"
              :width="it.width"
              :height="it.height"
              :class="it.imgCls"
            />
          </v-btn>

          <v-list dense v-if="it.subs">
            <!-- :to="sub.to"
            :href="sub.href"
            :target="sub.href ? '_blank' : ''" -->
            <v-list-item
              v-for="(sub, j) in it.subs"
              :key="j"
              link
              @click="onMenu(sub)"
            >
              <img
                :src="sub.img || `/img/svg/header/${sub.icon}.svg`"
                :width="sub.width || 12"
                :height="sub.height"
                class="mr-2"
              />
              <span class="gray-6">{{ sub.label }}</span>
            </v-list-item>
          </v-list>
        </e-menu>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import Axios from "axios";

export default {
  data() {
    return {
      newChagelogNum: 0,
    };
  },
  computed: {
    ...mapState({
      pageLoaded: (s) => s.pageLoaded,
      userInfo: (s) => s.userInfo,
      showProgress: (s) => s.showProgress,
      changelogNum: (s) => s.changelogNum,
      hasClaim: (s) => s.hasClaim,
    }),
    ...mapGetters(["teamInfo"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    menus() {
      const info = this.userInfo;
      let list = [
        {
          label: "Docs",
          icon: "m-docs",
          href: "https://docs.4everland.org",
        },
        {
          label: "Changelog",
          icon: "m-log",
          to: "/changelog",
          noLogin: true,
          badge: Math.max(0, this.newChagelogNum - this.changelogNum),
        },
      ];

      if (info.uid) {
        list.unshift({
          preImg: "/img/svg/header/icon_hot.svg",
          imgCls: "mr-2",
          width: 16,
          to: "/task-hub",
          label: "Task Hub",
          badge: this.activedClaim,
        });

        list.push({
          uid: info.uid,
          addr: info.username || "unkown",
          label: (info.username || "unkown").cutStr(6, 4),
          avatar: info.avatar || "/img/bg/user/def-avatar.png",
          btnStyle: "border: 1px solid #775DA6",
          noSuffix: true,
          subs: [
            {
              label: "Referral",
              icon: "m-refer",
              to: "/referral",
            },
            {
              label: "Collection",
              icon: "m-collect",
              to: "/collections",
            },
            // {
            //   label: "Activity Log",
            //   icon: "m-actlog",
            //   to: "/account/activity-log",
            // },
            {
              label: "Feedback",
              icon: "m-report",
              noticeMsg: {
                name: "feedback",
              },
            },
            {
              label: "Disconnect",
              icon: "m-logout",
              name: "logout",
            },
          ],
        });
      }
      list.unshift({
        href: "https://firstsowing.4everland.org/",
        label: "First Sowing",
      });
      return list;
    },
    activedClaim() {
      return this.hasClaim;
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
        "https://4ever-web.4everland.store/config/header.json"
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
