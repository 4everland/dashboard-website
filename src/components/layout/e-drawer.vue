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
              :ref="i + '-' + j"
              @input="Toggle(j, $event)"
              :key="j"
              sub-group
              no-action
              :value="true"
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
                :ref="i + '-' + j + '-' + k"
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
import { bus } from "@/utils/bus";
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
      guideActived: false,
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
          label: "Storage",
          img: "m-bucket",
          active: false,
          group: /^\/bucket/i,
          subs: [
            {
              label: "Buckets",
              active: false,
              group:
                /^(\/bucket\/storage|\/bucket\/arweave|\/bucket\/domains)/i,
              subs: [
                {
                  label: "Buckets(s3)",
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
              label: "Pinning Service",
              to: "/bucket/pinning-service",
            },
          ],
        },
        {
          label: "Gateway",
          img: "m-gateway",
          suffixImg: "/img/svg/hosting/h-beta-active.svg",
          group: /^\/gateway/i,
          subs: [
            {
              label: "Dedicated Gateway",
              to: "/gateway/list",
            },
            {
              label: "IPNS Manager",
              to: "/gateway/ipns",
            },
            {
              label: "Auth Token",
              to: "/gateway/auth-token",
            },
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
  created() {
    bus.$on("sidebar-item", (id) => {
      if (this.$refs[id][0] && !this.$refs[id][0].isActive) {
        this.$refs[id][0].click();
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
      console.log(i, open);
      if (this.guideActived) {
        return false;
      }
      return this.onToggle(i, open);
    },
    onToggle(i, open) {
      if (!open) return;
      if (this.list[i].group.test(this.path)) return;
      if (i == 2) {
        setTimeout(() => {
          this.$refs["2-0"][0].$children[0].$el.click();
          this.$refs["2-0"][0].$children[1].$el.click();
        }, 300);
        // this.$refs["2-0"][0].$children[0].click();
      } else {
        this.$refs[i + "-0"][0].$el.click();
      }
    },
  },
};
</script>
// <style lang="scss">
// div#driver-highlighted-element-stage,
// div#driver-page-overlay {
//   background: transparent !important;
//   outline: 5000px solid rgba(0, 0, 0, 0.75);
//   z-index: 100013 !important;
// }
// .guide-class {
//   max-width: 400px !important;
//   .driver-next-btn {
//     background: #634695 !important;
//     border: none !important;
//     text-shadow: none !important;
//     border-radius: 0 !important;
//     color: #fff !important;
//     font-size: 14px !important;
//     padding: 4px 20px !important;
//   }
//   .driver-prev-btn {
//     display: none !important;
//   }
//   .driver-close-btn {
//     padding: 3px !important;
//     font-size: 14px !important;
//     color: #889ab3 !important;
//     background: #fff !important;
//     border: none !important;
//   }
// }
// .reward-guide-class {
//   max-width: 600px !important;
// }
// .paging {
//   position: absolute;
//   left: 50px;
//   bottom: 19px;
//   font-size: 12px;
//   color: #889ab3;
// }
// .description-content {
//   color: #6c7789;
//   line-height: 28px;
// }
// .airdrop-content {
//   position: relative;
//   padding: 10px;
//   box-sizing: border-box;
//   .text {
//     margin-bottom: 10px;
//     color: #0b0817;
//     line-height: 36px;
//   }
//   .close-icon {
//     position: absolute;
//     top: 33px;
//     right: 17px;
//   }
//   .resource-item {
//     position: relative;
//     padding: 5px 15px;
//     height: 70px;
//     color: #898989;
//     box-sizing: border-box;
//     background: #f9fbfc;
//     box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.11);
//     border-radius: 10px;
//     .resource-item-value {
//       font-size: 18px;
//       margin-left: 10px;
//       color: #100d58;
//     }
//     .resource-text {
//       margin-left: 16px;
//     }
//   }
//   .resource-item::after {
//     content: "";
//     display: block;
//     position: absolute;
//     right: 15px;
//     top: 10px;
//     width: 18px;
//     height: 18px;
//     background: url("/img/airDrop/check.svg") no-repeat;
//   }
//   .claim-btn {
//     display: block;
//     width: 70%;
//     margin: 20px auto;
//     padding: 8px 5px;
//     text-align: center;
//     color: #fff;
//     background: #634695;
//     border-radius: 2px;
//     text-decoration: none;
//   }
// }
//
</style>