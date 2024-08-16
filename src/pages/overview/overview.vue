<template>
  <div>
    <div v-if="!teamInfo.isMember">
      <overview-notice class="mb-4" />
    </div>
    <!-- <div class="user-plate d-flex flex-column flex-md-row justify-space-between mb-6"> -->
    <div
      class="user-plate d-flex flex-column flex-md-row justify-space-between mx-6"
    >
      <div class="left flex-1">
        <div class="body pos-r pa-4">
          <div
            class="unchain-mask pos-a d-flex align-center justify-center flex-col"
            v-if="!onChain"
            @click="handleUpgrad"
          >
            <img
              src="/img/svg/overview/unactived.png"
              width="160"
              height="120"
              alt=""
            />

            <div class="fz-14 mt-2 mb-4 ta-c" v-show="!trialExpired">
              The trial account is valid until
              <b>{{
                new Date(teamInfo.createAt + 30 * 24 * 3600 * 1000).format(
                  "date"
                )
              }}</b>
              , and activating it unlocks permanent free resources.
            </div>
            <div class="fz-14 mt-2 mb-4 ta-c" v-show="trialExpired">
              Your trial account has expired. Activate now to unlock permanent
              free resources.
            </div>

            <v-btn color="primary">Activate</v-btn>
          </div>
          <div class="d-flex align-center justify-space-between">
            <h3 class="fz-20">Balance</h3>
            <div
              class="cursor-p fz-14 d-flex align-center"
              @click="$router.push('/billing')"
            >
              <span>Billing</span>
              <img
                src="/img/svg/new-billing/right-arrow.svg"
                width="24"
                alt=""
              />
            </div>
          </div>
          <div
            class="justify-space-between align-center d-flex flex-column flex-sm-row mt-2"
            style="height: 100%"
          >
            <div
              class="balance-content d-flex flex-column align-center align-sm-start justify-space-between"
            >
              <div>
                <div class="d-flex align-end">
                  <div>
                    <span class="balance fw-b">{{ balance.land }}</span>
                    <span class="fz-12 ml-2">{{ balance.unit }}</span>
                    <span class="fz-20 fw-b ml-4" style="margin-right: 2px"
                      >LAND</span
                    >
                  </div>
                  <a
                    class="ml-2"
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

              <v-btn
                elevation="0"
                class="primary white--text mt-sm-6 ml-2 ml-sm-0"
                style="padding: 0 48px"
                @click="$router.push('/billing/deposit')"
                v-ripple
              >
                Deposit
              </v-btn>
            </div>

            <half-pie :curInfo="landUsedMonthly" :showName="true"></half-pie>
          </div>
        </div>
      </div>

      <div class="right flex-1">
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
          <div class="delimiter-content d-flex align-center justify-center">
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
      <div
        class="combo d-flex flex-column flex-sm-row align-sm-center justify-space-between"
      >
        <div class="d-flex align-center justify-space-between">
          <h3 class="fz-20">Usage</h3>
          <div class="combo-name ml-2 fz-12 d-flex align-center">
            <div class="combo-tag" :class="onChain ? 'on-chain' : ''">
              {{ onChain ? "Standard" : "Trial" }}
            </div>
            <div
              class="upgrad fw-b fz-12 d-flex align-center ml-1 cursor-p"
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
        <v-col v-for="item in resourceList" :md="4" :key="item.type">
          <resource-view
            :view="item"
            :transformData="landToResource[item.type]"
          ></resource-view>
        </v-col>
      </v-row>
    </div>

    <div class="trends-plate pa-6 pt-0">
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
          img: "https://overview-banner.4everland.store/EliteQuest.png",
          to: "/quest",
        },
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
    trialExpired() {
      return (
        !this.onChain &&
        +new Date() > this.teamInfo.createAt + 30 * 24 * 3600 * 1000
      );
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
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const startOfMonth =
          new Date(currentYear, currentMonth - 1, 1).getTime() / 1000;
        let resourceUsedObj = {};
        data
          .filter((it) => it.timestamp >= startOfMonth)
          .forEach((item) => {
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
                timestamp: item.timestamp,
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
              name = "Build Time";
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
              color = "#8098F9";
              resourceUsed = this.$utils.getNumCount(it.resourceUsed) + "CUs";
              break;
            case "AI_RPC":
              name = "AI_RPC";
              color = "#6172F3";
              resourceUsed =
                this.$utils.formatLand(it.resourceUsed, false, false) + "LAND";
              break;
            case "RAAS":
              name = "RaaS";
              color = "#F78E69";
              resourceUsed = this.$utils.getFileSize(it.resourceUsed);
              break;
            case "ASS_NODE":
              name = "ASS Node";
              color = "#70707B";
              resourceUsed = this.$utils.getFileSize(it.resourceUsed);
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
            timestamp: it.timestamp,
          };
        });

        console.log(this.landUsedMonthly);
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
@media screen and (max-width: 960px) {
  .right {
    width: 100% !important;
  }
}

@media screen and (max-width: 600px) {
  .balance-content {
    width: 100%;
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
}

.user-plate {
  gap: 16px;
  .left,
  .right {
    border-radius: 8px;
    background: #fff;
  }
  .left {
    .body {
      background: #f9fafb;
      border-radius: 8px;
      .unchain-mask {
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        opacity: 0.95;
        z-index: 2;
        color: #475569;
        b {
          color: #0f172a;
        }
      }
      .balance {
        color: #0f172a;
        font-family: "DIN Alternate";
        font-size: 32px;
      }
      .tips {
        color: #64748b;
      }
    }
  }
  .right {
    width: 472px;
    height: 228px;
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
      background: var(--v-textInfo-base);
      border-radius: 4px;
    }
    .combo-tag.on-chain {
      background: linear-gradient(
          307deg,
          rgba(110, 88, 242, 0.8) 37.75%,
          rgba(105, 65, 198, 0.8) 93.02%
        ),
        var(--color-font-brand, #6172f3);
    }
    .upgrad {
      color: #fff;
      padding: 0 4px;
      border-radius: 4px;
      background: linear-gradient(
          307deg,
          rgba(110, 88, 242, 0.8) 37.75%,
          rgba(105, 65, 198, 0.8) 93.02%
        ),
        var(--color-font-brand, #6172f3);
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
