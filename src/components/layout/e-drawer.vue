<style lang="scss">
.e-drawer {
  box-shadow: 5px 0px 30px 0px rgba(0, 0, 0, 0.1);
  z-index: 999;
  .v-navigation-drawer__border {
    display: none;
  }
  .v-navigation-drawer__content {
    overflow: auto;
  }
  .group-item {
    margin-bottom: 10px !important;
  }
  .mini-arrow {
    right: -8px;
    bottom: 25px;
    padding: 5px;
    background: #fff;
    transform: rotate(45deg);
    cursor: pointer;
    .icon {
      width: 14px;
      transform: rotate(-45deg);
    }
  }
  &.v-navigation-drawer--mini-variant {
    .v-list-item {
      padding-left: 11px;
    }
    .mini-arrow {
      .icon {
        transform: rotate(135deg);
      }
    }
  }
  .v-list-item--active {
    color: #775da6;
    background: none;

    &.sub::before {
      opacity: 0;
    }
    &.v-list-group__header::before {
      opacity: 0.12 !important;
    }
  }
  .active-item {
    background: #eeebf4;
  }
}
</style>

<template>
  <v-navigation-drawer
    class="e-drawer"
    :mini-variant.sync="mini"
    v-model="isShow"
    app
    clipped
  >
    <div>
      <a href="/" class="mt-8 d-b" v-if="asMobile">
        <img :src="`/img/svg/logo.svg`" height="26" class="d-b m-auto" />
      </a>
    </div>

    <div class="pa-5"></div>
    <v-list flat dense>
      <template v-for="(it, i) in list">
        <v-list-group
          class="group-item"
          v-model="activeArr[i]"
          @input="onToggle(i, $event)"
          :group="it.group"
          v-if="it.subs"
          :key="i"
          no-action
        >
          <template v-slot:activator>
            <e-drawer-icon :it="it" :active="activeArr[i]"></e-drawer-icon>
            <v-list-item-content>
              <v-list-item-title>
                <b class="fz-16">{{ it.label }}</b>
              </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            :ref="i + '-' + j"
            class="sub"
            active-class="active-item"
            :class="{
              'v-list-item--active': sub.matPath && sub.matPath.test(path),
            }"
            :to="sub.to"
            :href="sub.href"
            :target="sub.href ? '_blank' : ''"
            v-for="(sub, j) in it.subs"
            :key="j"
          >
            <v-list-item-content>
              <v-list-item-title>
                <span class="fz-14"> {{ sub.label }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item
          class="group-item"
          v-else
          :to="it.to"
          :href="it.href"
          :target="it.href ? '_blank' : ''"
          :key="i"
        >
          <e-drawer-icon
            :it="it"
            :active="path.indexOf(it.to) == 0"
          ></e-drawer-icon>
          <v-list-item-content>
            <v-list-item-title>
              <b class="fz-16">{{ it.label }}</b>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>

    <!-- <div class="pos-a mini-arrow" @click="mini = !mini">
      <img src="/img/svg/drawer/mini-arrow.svg" class="icon d-b" />
    </div> -->
    <div class="pos-a btm-0 left-0 w100p mb-4 al-c pa-3 bg-white">
      <a
        class="flex-1 ta-c"
        :href="it.url"
        target="_blank"
        v-for="(it, i) in mLinks"
        :key="i"
      >
        <img
          :src="`/img/svg/drawer/social/${it.label.toLocaleLowerCase()}.svg`"
          width="24"
        />
      </a>
    </div>
    <div style="height: 80px"></div>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

const initFilePath = "/bucket/storage/";

export default {
  data() {
    return {
      mLinks: [
        {
          url: "https://twitter.com/4everland_org",
          label: "Twitter",
        },
        {
          url: "http://discord.gg/4everland",
          label: "Discord",
        },
        {
          url: "https://t.me/org_4everland",
          label: "Telegram",
        },
        {
          url: "https://4everland.medium.com/",
          label: "Medium",
        },
        {
          url: "https://github.com/4everland",
          label: "Github",
        },
      ],
      isShow: this.asMobile,
      mini: false,
      activeArr: [],
      filesPath: initFilePath,
    };
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
      userInfo: (s) => s.userInfo,
      token: (s) => s.token(),
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    path() {
      return this.$route.path;
    },
    list() {
      return [
        {
          label: "Overview",
          img: "m-overview",
          to: "/overview",
          active: false,
        },
        {
          label: "Hosting",
          img: "m-hosting",
          group: /^\/hosting/i,
          subs: [
            {
              label: "Projects",
              to: "/hosting/projects",
              matPath: /hosting\/(new|project|build)/,
            },
            {
              label: "Domains",
              to: "/hosting/domains",
            },
            {
              label: "Statistics",
              to: "/hosting/statistics",
            },
            {
              label: "Auth Tokens",
              to: "/hosting/auth-tokens",
            },
          ],
        },
        {
          label: "Bucket",
          img: "m-bucket",
          active: false,
          group: /^\/bucket/i,
          subs: [
            // {
            //   label: "Buckets",
            //   to: this.path.includes(initFilePath)
            //     ? initFilePath
            //     : this.filesPath,
            // },
            {
              label: "Buckets",
              to: "/bucket/storage/",
            },
            {
              label: "AR History",
              to: "/bucket/arweave",
            },
            {
              label: "Domains",
              to: "/bucket/domains",
              matPath: /bucket\/domain/,
            },
            {
              label: "Access Keys",
              to: "/bucket/access-keys",
            },
          ],
        },
        {
          label: "Gateway",
          img: "m-gateway",
          group: /^\/gateway/i,
          subs: [
            {
              label: "Gateways",
              to: "/gateway/list",
            },
            // {
            //   label: "IPNS Manager",
            //   to: "/gateway/ipns",
            // },
          ],
        },
        {
          label: "Resource",
          img: "m-usage",
          to: "/resource",
          active: false,
          group: /^\/resource/i,
        },
      ];
    },
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "showDrawer") {
        this.isShow = true;
      }
    },
    path(val, oldVal) {
      if (val.includes(initFilePath)) {
        this.filesPath = val;
        if (!oldVal.includes(initFilePath)) {
          this.$setMsg({
            name: "updateUsage",
          });
        }
      }
    },
  },
  methods: {
    onToggle(i, open) {
      if (!open) return;
      if (this.list[i].group.test(this.path)) return;
      this.$refs[i + "-0"][0].$el.click();
    },
  },
};
</script>
