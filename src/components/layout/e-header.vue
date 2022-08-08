<style lang="scss">
#e-header {
  box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 15%) !important;
  z-index: 110;
}
</style>
<template>
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
        <v-btn
          slot="ref"
          text
          :href="it.href"
          :to="it.to"
          :target="it.href ? '_blank' : ''"
          :style="it.btnStyle"
          class="ml-4"
        >
          <img
            v-if="it.img"
            :src="it.img"
            :width="it.width"
            :height="it.height"
            class="mr-2"
          />
          <div class="u-avatar bg-1 bdrs-100 mr-2" v-if="it.avatar">
            <v-avatar size="22" class="bg-white d-b">
              <!-- <v-img :src="it.avatar"></v-img> -->
              <svg
                style="display: block"
                width="80"
                height="80"
                :data-jdenticon-value="it.label"
              ></svg>
            </v-avatar>
          </div>
          <span :style="{ color: it.color || '#555' }">{{ it.label }}</span>
          <img
            v-if="it.subs && !it.noSuffix"
            :src="`/img/svg/header/ic-down-${it.color || 'def'}.svg`"
            width="10"
            class="ml-2"
          />
        </v-btn>

        <v-list dense v-if="it.subs">
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
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      pageLoaded: (s) => s.pageLoaded,
      userInfo: (s) => s.userInfo,
      payBy: (s) => s.payBy,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    menus() {
      const info = this.userInfo;
      if (!info.uid) return [];
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
        },
      ];

      if (/billing\/(usage\/more|bills)/.test(this.$route.path)) {
        const paySubs = [
          {
            label: "Polygon",
            img: "/img/svg/billing/ic-polygon-0.svg",
            width: 18,
            height: 18,
            type: "pay",
          },
          {
            label: "Ethereum",
            img: "/img/svg/billing/ic-ethereum.svg",
            width: 18,
            height: 18,
            type: "pay",
          },
          {
            label: "BSC",
            img: "/img/svg/billing/ic-bsc.png",
            width: 18,
            height: 18,
            type: "pay",
          },
        ];
        const defPay =
          paySubs.filter((it) => it.label == this.payBy)[0] || paySubs[0];
        list.push({
          ...defPay,
          noSuffix: true,
          subs: paySubs.length > 1 ? paySubs : null,
        });
      }

      list.push({
        label: (info.username || "unkown").cutStr(6, 4),
        avatar: info.avatar || "/img/bg/user/def-avatar.png",
        btnStyle: "border: 1px solid #775DA6",
        noSuffix: true,
        subs: [
          {
            label: "Settings",
            icon: "m-settings",
            to: "/settings",
          },
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
          {
            label: "Activity Log",
            icon: "m-actlog",
            to: "/activity-log",
          },
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
      return list;
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
  },
  methods: {
    onMenu(it) {
      if (it.type == "pay") {
        this.$setState({
          payBy: it.label,
        });
        localStorage.payBy = it.label;
      }
      if (it.noticeMsg) {
        console.log(it);
        this.$setMsg({
          ...it.noticeMsg,
        });
      }
      if (it.name == "logout") {
        localStorage.clear();
        location.href = "index.html";
      }
    },
  },
};
</script>