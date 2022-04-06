<style lang="scss">
#e-header {
  box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 15%) !important;
}
.u-avatar {
  background: #cac3e0;
  padding: 4px;
  border-radius: 100px;
  transform: scale(1.4);
  position: relative;
  left: -10px;
}
</style>
<template>
  <v-app-bar id="e-header" app clipped-left height="60" color="#fff">
    <a href="/">
      <img
        :src="`img/svg/logo${asMobile ? '-m' : ''}.svg`"
        height="30"
        class="d-b"
      />
    </a>
    <v-spacer></v-spacer>
    <template>
      <e-menu offset-y open-on-hover v-for="(it, i) in menus" :key="i">
        <v-btn
          slot="ref"
          text
          rounded
          :style="{
            background: it.btnBg,
          }"
          class="ml-4"
        >
          <div class="u-avatar" v-if="it.avatar">
            <v-avatar size="22" class="bg-white">
              <v-img :src="it.avatar"></v-img>
              <!-- <svg
                v-if="pageLoaded"
                width="80"
                height="80"
                :data-jdenticon-value="it.label"
              ></svg> -->
            </v-avatar>
          </div>
          <span :style="{ color: it.color || '#555' }">{{ it.label }}</span>
          <img
            :src="`img/svg/header/ic-down-${it.color || 'def'}.svg`"
            width="10"
            class="ml-2"
          />
        </v-btn>

        <v-list dense>
          <v-list-item
            v-for="(sub, j) in it.subs"
            :key="j"
            link
            :to="sub.to"
            :href="sub.href"
            :target="sub.href ? '_blank' : ''"
            @click="onMenu(sub)"
          >
            <img
              :src="`img/svg/header/${sub.icon}.svg`"
              width="12"
              class="mr-2"
            />
            <span class="gray-6">{{ sub.label }}</span>
          </v-list-item>
        </v-list>
      </e-menu>
    </template>
  </v-app-bar>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      pageLoaded: (s) => s.pageLoaded,
      userInfo: (s) => s.userInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    menus() {
      const info = this.userInfo;
      if (!info.uid) return [];
      let list = [
        {
          label: "Support",
          subs: [
            {
              label: "Documents",
              icon: "m-docs",
              href: "https://4ever-docs.4everland.app/",
            },
            // {
            //   label: "Community",
            //   icon: "m-chat",
            // },
            {
              label: "Bug Bounty",
              icon: "m-bug",
              to: "/bug-bounty",
            },
            // {
            //   label: "Changelog",
            //   icon: "m-log",
            // },
          ],
        },
      ];

      list.push({
        label: (info.username || "unkown").cutStr(6, 4),
        avatar: info.avatar || "img/bg/user/def-avatar.png",
        color: "white",
        btnBg: "#CAC3E0",
        subs: [
          {
            label: "Settings",
            icon: "m-settings",
            to: "/settings",
          },
          {
            label: "My Collection",
            icon: "m-collect",
            to: "/collections",
          },
          {
            label: "My Referral",
            icon: "m-refer",
            to: "/referral",
          },
          {
            label: "Report",
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
      return list;
    },
  },
  methods: {
    onMenu(it) {
      const { name } = it;
      if (it.noticeMsg) {
        console.log(it);
        this.$setMsg({
          ...it.noticeMsg,
        });
      }
      if (name == "logout") {
        localStorage.token = "";
        delete localStorage.userInfo;
        location.href = "index.html";
      }
    },
  },
};
</script>