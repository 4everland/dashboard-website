<style lang="scss">
.e-drawer {
  box-shadow: 5px 0px 30px 0px rgba(0, 0, 0, 0.1);
  .v-navigation-drawer__border {
    display: none;
  }
  .v-navigation-drawer__content {
    overflow: scroll;
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
    color: #34a9ff;
    background: none;
    &.sub::before {
      opacity: 0;
    }
    &.v-list-group__header::before {
      opacity: 0.12 !important;
    }
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
        <img :src="`img/svg/logo.svg`" height="26" class="d-b m-auto" />
      </a>
    </div>

    <div class="pa-5"></div>
    <v-list rounded dense>
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
                <span class="fz-14">{{ sub.label }}</span>
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

    <div class="pos-a mini-arrow" @click="mini = !mini">
      <img src="img/svg/drawer/mini-arrow.svg" class="icon d-b" />
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

const initFilePath = "/bucket/storage/";

export default {
  data() {
    return {
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
              label: "First Landing",
              to: "/hosting/first-landing",
            },
          ],
        },
        {
          label: "Bucket",
          img: "m-bucket",
          active: false,
          group: /^\/bucket/i,
          subs: [
            {
              label: "Buckets",
              to: this.path.includes(initFilePath)
                ? initFilePath
                : this.filesPath,
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
          ],
        },
        {
          label: "Plan",
          img: "m-plan",
          to: "/plan",
          active: false,
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
    onLogout() {
      localStorage.clear();
      location.href = "index.html";
    },
  },
};
</script>