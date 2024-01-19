<template>
  <div>
    <div v-if="!teamInfo.isMember">
      <overview-notice class="mb-4" />
    </div>
    <div class="user-plate d-flex flex-column flex-md-row space-btw mb-6">
      <div class="left flex-2">
        <div class="header">
          <p class="fz-12 mb-0 tips">Welcome to 4EVERLAND Dashboard</p>
          <div class="al-c">
            <v-btn
              icon
              v-if="asMobile"
              style="margin-left: -px"
              @click="$setMsg('showDrawer')"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
            <h3 class="fz-20">{{ uname }}</h3>
          </div>
        </div>
        <div class="body">
          <div class="al-c space-btw">
            <h3 class="fz-20">Balance</h3>
            <div class="cursor-p fz-14 al-c" @click="$router.push('/billing')">
              <span>Billing</span>
              <img
                src="/img/svg/new-billing/right-arrow.svg"
                width="24"
                alt=""
              />
            </div>
          </div>
          <div
            class="space-btw al-end d-flex flex-wrap mt-3"
            style="height: 100%"
          >
            <div>
              <div>
                <div>
                  <span class="balance fw-b">{{ balance.land }}</span>
                  <span class="fz-12 ml-2">{{ balance.unit }}</span>
                  <span class="fz-20 fw-b ml-4" style="margin-right: 2px"
                    >LAND</span
                  >
                  <a
                    href="https://docs.4everland.org/get-started/billing-and-pricing/what-is-land"
                    target="__blank"
                  >
                    <img
                      width="16"
                      class="cursor-p"
                      src="/img/svg/overview/landfile.svg"
                      alt=""
                    />
                  </a>
                </div>
                <div class="fz-14 tips mt-1">≈ {{ balanceToUSD }}USD</div>
              </div>

              <div class="al-c mt-6">
                <div
                  class="deposite-btn"
                  @click="$router.push('/billing/deposit')"
                  v-ripple
                >
                  Deposit
                </div>
                <!-- <div
                  class="conversion-btn"
                  v-ripple
                  @click="showTransform = !showTransform"
                >
                  Conversion
                </div> -->
                <!-- <v-tooltip top max-width="300" nudge-top="5">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="ml-1" size="18" v-bind="attrs" v-on="on"
                      >mdi-alert-circle-outline</v-icon
                    >
                  </template>
                  <div style="line-height: normal" class="py-2">
                    Conversion will convert LAND into various resources at the
                    full amount, for reference purposes only
                  </div>
                </v-tooltip> -->
              </div>
            </div>

            <half-pie
              style="50%"
              :curInfo="landUsedMonthly"
              :showName="true"
            ></half-pie>
          </div>
        </div>
      </div>

      <div class="right ml-6 mt-4 flex-1 mt-md-0 d-md-block d-none">
        <div class="pos-r carousel-container">
          <v-carousel
            :show-arrows="false"
            v-model="carouselIdx"
            :interval="5000"
            class="bdrs-10 mb-4"
            cycle
            hide-delimiter-background
            hide-delimiters
            height="100%"
            ref="carouselRef"
          >
            <v-carousel-item
              v-for="(it, i) in banners"
              :key="i"
              :src="it.img"
              :to="it.to"
              :href="it.href"
              :target="it.href ? '_blank' : null"
            >
            </v-carousel-item>
          </v-carousel>
          <div class="delimiter-content al-c justify-center">
            <template v-for="(item, index) in banners">
              <div
                class="delimiter cursor-p"
                :class="{ active: carouselIdx == index }"
                :key="index"
                @click.stop="carouselIdx = index"
              ></div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="usage-plate pa-6">
      <div class="combo al-c space-btw">
        <div class="al-c">
          <h3 class="fz-20">Usage</h3>
          <div class="combo-name ml-2 fz-12 al-c">
            <div class="combo-tag" :class="onChain ? 'on-chain' : ''">
              {{ onChain ? "Standard" : "Trial" }}
            </div>
            <div
              class="upgrad fw-b fz-12 al-c ml-1 cursor-p"
              v-if="!onChain"
              @click="handleUpgrad"
            >
              <img src="/img/svg/overview/upgrad.svg" width="16" alt="" />
              <span class="pa-1" style="margin-left: 2px"
                >Activate Account</span
              >
            </div>
          </div>
        </div>
        <div class="period fz-14">
          {{ efficientAt ? new Date(efficientAt).format("date") : "--" }} -
          {{ invalidAt ? new Date(invalidAt).format("date") : "--" }}
        </div>
      </div>

      <v-row v-show="resourceLoading" class="mt-3">
        <v-col> <v-skeleton-loader type="article"></v-skeleton-loader></v-col>
      </v-row>
      <v-row v-show="!resourceLoading">
        <v-col v-for="item in resourceList" :key="item.type">
          <resource-view
            :view="item"
            :transformData="landToResource[item.type]"
          ></resource-view>
        </v-col>
      </v-row>
    </div>

    <div class="trends-plate pa-6 mt-6">
      <h3 class="fz-20">Trends</h3>
      <trends-line></trends-line>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { bus } from "@/utils/bus";
import mixin from "@/pages/more/mixin-register";
import resourceView from "./component/resource-view.vue";
import trendsLine from "./component/trends-line.vue";
import halfPie from "../billing/component/half-pie.vue";
import { formatEther } from "ethers/lib/utils";

export default {
  mixins: [mixin],
  components: {
    halfPie,
    resourceView,
    trendsLine,
  },
  data() {
    return {
      carouselIdx: 0,
      resourceLoading: false,
      invalidAt: null,
      efficientAt: null,
      resourceList: [],
      landUsedMonthly: [],
    };
  },
  created() {
    this.$store.dispatch("getBalance");
    this.$store.dispatch("getPrice");
    this.getUserResource();
    this.getLandUsedMonthly();
    this.isRegister();
  },

  computed: {
    ...mapGetters(["teamInfo", "balance", "landToResource"]),
    ...mapState({
      onChain: (s) => s.onChain,
      userInfo: (s) => s.userInfo,
      originBalance: (s) => s.moduleResource.originBalance,
    }),
    balanceToUSD() {
      const land = Number(formatEther(this.originBalance));
      return Math.floor(land / 1e6);
    },
    banners() {
      return [
        {
          img: "https://overview-banner.4everland.store/land.png",
          href: "https://medium.com/4everland/embracing-efficiency-and-innovation-introducing-land-as-the-unified-payment-unit-on-4everland-3a935f6b0d9e",
        },
        {
          // img: "https://4ever-web.4everland.store/img/banner/20230721-174716.png",
          img: "https://overview-banner.4everland.store/feedback.png",
          to: "/bucket/storage/",
        },
        {
          img: "https://overview-banner.4everland.store/Frame%20337691.png",
          href: "https://forms.gle/SAzZ2Sw31atnSSsB8",
        },
      ];
    },
    asMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    uname() {
      const info = this.userInfo;
      if (this.teamInfo.name) return "Overview of " + this.teamInfo.name;
      if (info.username) return "Hi " + info.username.cutStr(6, 4);
      return "Overview";
    },
  },
  methods: {
    async getUserResource() {
      this.resourceLoading = true;
      try {
        const { data } = await this.$http.get("$bill-consume/combo/user/list");
        const comboItem = data.combo;
        this.invalidAt = Number(comboItem.invalidAt) * 1e3;
        this.efficientAt = Number(comboItem.efficientAt) * 1e3;
        this.resourceList = comboItem.resourceItems.map((it, i) => {
          let total = Number(it.size);
          let used =
            Number(comboItem.consumeItems[i].size) +
            Number(data.realTimeItems[i].size);
          if (it.resourceType == "BUILD_TIME") {
            return {
              type: it.resourceType,
              total: total / 60,
              used: used / 60,
            };
          }
          if (it.resourceType == "IPFS_STORAGE") {
            used =
              Number(data.totalIpfsStorage) +
              Number(data.realTimeItems[i].size);
          }
          if (it.resourceType == "AR_STORAGE") {
            used =
              Number(data.totalArStorage) + Number(data.realTimeItems[i].size);
          }

          return {
            type: it.resourceType,
            total,
            used,
          };
        });
      } catch (error) {
        console.log(error);
      }
      this.resourceLoading = false;
    },

    async getLandUsedMonthly() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/land-used/analytics",
          {
            params: {
              analyticsType: "DAY",
            },
          }
        );
        let resourceUsedObj = {};
        data.forEach((item) => {
          if (
            !Object.prototype.hasOwnProperty.call(
              resourceUsedObj,
              item.resourceType
            )
          ) {
            resourceUsedObj[item.resourceType] = {
              landUsed: 0,
              resourceUsed: 0,
              resourceType: item.resourceType,
            };
          }
          resourceUsedObj[item.resourceType].landUsed = Number(
            (
              resourceUsedObj[item.resourceType].landUsed +
              Number(item.landUsed)
            ).toFixed(2)
          );
          resourceUsedObj[item.resourceType].resourceUsed =
            resourceUsedObj[item.resourceType].resourceUsed +
            Number(item.resourceUsed);
        });
        this.landUsedMonthly = Object.values(resourceUsedObj).map((it) => {
          let name = "IPFS";
          let color = "#000";
          let resourceUsed = "0";
          switch (it.resourceType) {
            case "AR_STORAGE":
              name = "Arweave";
              color = "#000";
              resourceUsed = this.$utils.getFileSize(it.resourceUsed);
              break;
            case "BUILD_TIME":
              name = "Build Minutes";
              color = "#F3CC5C";
              resourceUsed =
                this.$utils.getNumCount(it.resourceUsed / 60) + "Mins";
              break;
            case "TRAFFIC":
              name = "Bandwidth";
              color = "#9AD3DC";
              resourceUsed = this.$utils.getFileSize(it.resourceUsed);
              break;
            case "COMPUTE_UNIT":
              name = "RPC Requests";
              color = "#836BAF";
              resourceUsed = this.$utils.getNumCount(it.resourceUsed) + "CUs";
              break;
            default:
              name = "IPFS";
              color = "#57B9BC";
              resourceUsed = this.$utils.getFileSize(it.resourceUsed);
              break;
          }
          return {
            value: it.landUsed,
            color,
            name,
            landUsed: it.landUsed.toString(),
            resourceUsed,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },

    handleUpgrad() {
      bus.$emit("showDialog");
    },
  },
};
</script>

<style lang="scss" scoped>
@media (width > 1440px) {
  .carousel-container {
    height: 324px !important;
  }
}
.carousel-container {
  height: 100%;
}

.delimiter-content {
  z-index: 100;
  width: 100%;
  height: 30px;
  position: absolute;
  left: 0;
  bottom: 0;
  .delimiter {
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: #fff;
  }
  .delimiter + .delimiter {
    margin-left: 10px;
  }
  .delimiter.active {
    background: #775da6;
  }
}

.user-plate {
  .left,
  .right {
    border-radius: 8px;
    background: #fff;
  }
  .left {
    .header {
      padding: 16px 24px;
      border-bottom: 1px solid #cbd5e1;
      .tips {
        color: #64748b;
      }
    }
    .body {
      padding: 16px 24px 24px;
      .balance {
        color: #0f172a;
        font-family: "DIN Alternate";
        font-size: 32px;
      }
      .tips {
        color: #64748b;
      }
      .deposite-btn,
      .conversion-btn {
        border-radius: 4px;
        padding: 12px 48px;
        cursor: pointer;
      }
      .deposite-btn {
        color: #fff;
        border: 1px solid #775da6;
        background: #775da6;
      }
      .conversion-btn {
        color: #775da6;
        border: 1px solid #775da6;
      }
    }
  }
  .right {
    width: 368px;
    .log-item {
      border-radius: 4px;
      background: #f8fafc;
      .date {
        color: #64748b;
      }
    }
  }
}

.usage-plate {
  border-radius: 8px;
  background: #fff;

  .combo {
    display: flex;
    .combo-tag {
      color: #fff;
      padding: 4px 16px;
      background: #94a3b8;
      border-radius: 4px;
    }
    .combo-tag.on-chain {
      background: linear-gradient(
          307deg,
          rgba(151, 71, 255, 0.8) 37.75%,
          rgba(115, 94, 161, 0.8) 93.02%
        ),
        #735ea1;
    }
    .upgrad {
      color: #fff;
      padding: 0 4px;
      border-radius: 4px;
      background: linear-gradient(
          307deg,
          rgba(151, 71, 255, 0.8) 37.75%,
          rgba(115, 94, 161, 0.8) 93.02%
        ),
        #735ea1;
    }
  }
}
.trends-plate {
  border-radius: 8px;
  background: #fff;
}

.v-tooltip__content {
  background: rgba(0, 0, 0, 0.9);
  border-radius: 4px;
}
.v-tooltip__content::after {
  display: block;
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -20px;
  border: 10px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
}
</style>
