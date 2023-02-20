<style lang="scss">
.e-drawer {
  box-shadow: 5px 0px 30px 0px rgba(0, 0, 0, 0.1);
  z-index: 999;

  .v-navigation-drawer__border {
    display: none;
  }
  .v-navigation-drawer__content {
    overflow: auto;
    display: flex;
    flex-direction: column;
    overflow: visible;
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
    <v-list flat dense ref="drawerList" id="drawerList">
      <template v-for="(it, i) in list">
        <v-list-group
          class="group-item"
          :id="'group-' + i"
          :ref="'group-' + i"
          @input="Toggle(i, $event)"
          v-model="activeArr[i]"
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
                <img
                  v-if="it.suffixImg"
                  class="ml-2"
                  width="25"
                  :src="it.suffixImg"
                  alt=""
                />
              </v-list-item-title>
              <!--  -->
            </v-list-item-content>
          </template>

          <template v-for="(sub, j) in it.subs">
            <v-list-group
              v-if="sub.subs"
              :ref="'sub-' + j"
              :key="j"
              :group="sub.group"
              sub-group
              no-action
              v-model="openSub"
              @input="onSubsToggle(j, $event)"
            >
              <template v-slot:activator>
                <div class="ml-2"></div>
                <v-list-item-content>
                  <v-list-item-title>
                    <b class="fz-14 fw-n">{{ sub.label }}</b>
                    <img
                      v-if="sub.suffixImg"
                      class="ml-2"
                      width="25"
                      :src="sub.suffixImg"
                      alt=""
                    />
                  </v-list-item-title>
                  <!--  -->
                </v-list-item-content>
              </template>
              <v-list-item
                :ref="'sub' + j + '-' + k"
                class="sub"
                active-class="active-item"
                :class="{
                  'v-list-item--active':
                    secondSub.matPath && secondSub.matPath.test(path),
                }"
                :to="secondSub.to"
                :href="secondSub.href"
                :target="secondSub.href ? '_blank' : ''"
                v-for="(secondSub, k) in sub.subs"
                :key="k"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="fz-14">{{ secondSub.label }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>

            <v-list-item
              v-else
              :ref="i + '-' + j"
              class="sub"
              active-class="active-item"
              :class="{
                'v-list-item--active': sub.matPath && sub.matPath.test(path),
              }"
              :to="sub.to"
              :href="sub.href"
              :target="sub.href ? '_blank' : ''"
              :key="j"
            >
              <v-list-item-content>
                <v-list-item-title>
                  <span class="fz-14"> {{ sub.label }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
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

    <div class="mt-auto pa-3"></div>
    <e-drawer-account></e-drawer-account>
    <div class="mb-3 al-c pa-3 bg-white">
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
  </v-navigation-drawer>
</template>

<script>
import mixin from "./e-drawer-mixin";
import { bus } from "@/utils/bus";
const initFilePath = "/bucket/storage/";

export default {
  mixins: [mixin],
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
      guideActived: false,
      openSub: true,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    path() {
      return this.$route.path;
    },
  },
  created() {
    bus.$on("sidebar-item", (id) => {
      if (this.$refs[id][0] && !this.$refs[id][0].isActive) {
        this.$refs[id][0].click();
        console.log(id);
        if (id == "group-2") {
          setTimeout(() => {
            this.openSub = true;
          }, 300);
        }
      }
      this.guideActived = true;
    });
    bus.$on("guide", () => {
      this.guideActived = false;
    });
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
    Toggle(i, open) {
      if (this.guideActived) {
        return false;
      }
      return this.onToggle(i, open);
    },
    onToggle(i, open) {
      if (!open) return;
      if (i == 2) {
        if (/^\/bucket\/pinning-service/.test(this.path)) return;
        setTimeout(() => {
          this.openSub = true;
          this.onSubsToggle(0, true);
        }, 300);
      } else {
        if (this.list[i].group.test(this.path)) return;
        this.$refs[i + "-0"][0].$el.click();
      }
    },
    onSubsToggle(i, open) {
      if (!open) return;
      if (this.list[2].subs[0].group.test(this.path)) return;
      this.$refs["sub" + i + "-0"][0].$el.click();
    },
  },
};
</script>
