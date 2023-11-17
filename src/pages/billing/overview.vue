<template>
  <div class="billing-container">
    <h3 class="mb-4">Plan</h3>
    <v-row class="plan-row" v-show="resourceLoading">
      <v-col> <v-skeleton-loader type="article"></v-skeleton-loader></v-col>
    </v-row>
    <v-row class="plan-row" v-show="!resourceLoading">
      <v-col
        :md="4"
        cols="12"
        class="plan-level py-8 px-4 h-flex al-c space-btw"
      >
        <div class="al-c space-btw" style="width: 100%">
          <div class="al-c">
            <img src="/img/svg/new-billing/manage.svg" width="24" alt="" />
            <span class="fw-b ml-1">Manage Sub</span>
          </div>
          <div class="level-tag cursor-p fz-14 fw-b py-2 px-3">
            {{ onChain ? "Standard" : "Trial" }}
          </div>
        </div>
        <div>
          <p class="mb-0 fz-12 al-c">
            <img
              src="/img/svg/new-billing/upcoming.svg"
              width="16"
              height="16"
              alt=""
            />
            <span class="ml-1">Upcoming resource allocation:</span>
            <span class="fw-b variable ml-2">{{
              efficientAt ? new Date(efficientAt).format("date") : "--"
            }}</span>
          </p>
          <p class="mb-0 fz-12 al-c mt-1">
            <img src="/img/svg/new-billing/validity.svg" width="16" alt="" />
            <span class="ml-1">Validity:</span>
            <span class="fw-b variable ml-2">{{
              invalidAt ? new Date(invalidAt).format("date") : "--"
            }}</span>
          </p>
        </div>
      </v-col>
      <v-col :md="8" cols="12" style="padding: 0">
        <v-row style="margin: 0; background: #fff" align="center">
          <v-col
            class="resource-col"
            :md="3"
            v-for="item in resourceList"
            :key="item.type"
          >
            <billing-resource-view :view="item"></billing-resource-view>
          </v-col>
        </v-row>

        <!-- <div class="al-c space-btw px-6 py-4">
          <div
            class="resource-col flex-1"
            v-for="item in resourceList"
            :key="item.type"
          >
            <billing-resource-view :view="item"></billing-resource-view>
          </div>
        </div> -->
      </v-col>
    </v-row>

    <div class="mb-4 mt-6 al-c space-btw">
      <h3>LAND</h3>
      <div
        class="fz-12 cursor-p al-c"
        @click="$router.push('/billing/records?tab=Monthly%20Bill')"
      >
        <span>Transaction history</span>
        <img src="/img/svg/new-billing/right-arrow.svg" width="16" alt="" />
      </div>
    </div>

    <v-row class="land-row">
      <v-col :md="4" cols="12" style="padding: 0">
        <div class="py-6 px-4 h-flex al-c">
          <h4 class="fz-14">LAND Balance</h4>
          <div class="my-6 al-c">
            <img src="/img/svg/new-billing/land-icon.svg" width="24" alt="" />
            <span class="balance fw-b ml-2">{{ balance.land }}</span>
            <span class="fz-12 ml-2">{{ balance.unit }}</span>
          </div>
          <div
            class="deposite-btn py-4 px-6 cursor-p al-c"
            v-ripple
            @click="$router.push('/billing/deposite')"
          >
            <span>Deposite</span>
            <img src="/img/svg/new-billing/right-arrow.svg" width="16" alt="" />
          </div>
        </div>
        <div class="land-consume py-6 px-4 h-flex al-c">
          <h3 class="ta-c">Monthly Consumptior</h3>
          <half-pie :curInfo="landUsedMonthlyPie"></half-pie>
        </div>
      </v-col>
      <v-col :md="8" cols="12" class="line-charts">
        <billing-consume-line
          :landUsedMonthly="landUsedMonthlyLine"
        ></billing-consume-line>
      </v-col>
    </v-row>

    <h3 class="mb-4 mt-6">Resource Statistics (31 days)</h3>
    <v-row class="statistics-row">
      <v-col :md="4" cols="12" style="padding: 0">
        <div class="py-6 px-4 h-flex al-c">
          <h4 class="fz-14">Build Minutes</h4>
          <div class="my-6 al-c">
            <span class="balance fw-b">{{ buildMin.size }}</span>
            <span class="fz-12 ml-2">{{ buildMin.unit }}</span>
          </div>
          <div class="py-4 px-6 fz-14 data">
            <span>Total builds:</span>
            <span>23</span>
          </div>
        </div>
        <div class="py-6 px-4 h-flex al-c rpc-section">
          <h4 class="fz-14">Web3 RPC</h4>
          <div class="my-6 al-c">
            <span class="balance fw-b">23,233</span>
            <span class="fz-12 ml-2">CUs</span>
          </div>
          <div class="py-4 px-6 fz-14 data">
            <span>Total instances:</span>
            <span>1,200,202</span>
          </div>
        </div>
      </v-col>
      <v-col :md="8" cols="12">
        <v-row style="height: 100%">
          <v-col :md="4" cols="12" class="pie-col">
            <resource-monthly-pie
              name="Bandwidth"
              type="TRAFFIC"
              :resourceAppUsed="bandwidthResourceObj"
            ></resource-monthly-pie>
          </v-col>
          <v-col :md="4" cols="12" class="pie-col">
            <resource-monthly-pie
              name="IPFS Storage"
              type="IPFS_STORAGE"
              :resourceAppUsed="ipfsResourceObj"
            >
            </resource-monthly-pie>
          </v-col>
          <v-col :md="4" cols="12" class="pie-col">
            <resource-monthly-pie
              name="Arweave"
              type="AR_STORAGE"
              :resourceAppUsed="arResourceObj"
            >
            </resource-monthly-pie>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { BigNumber } from "ethers";
import billingConsumeLine from "./component/billing-consume-line.vue";
import billingResourceView from "./component/billing-resource-view.vue";
import halfPie from "./component/half-pie.vue";
import resourceMonthlyPie from "./component/resource-monthly-pie.vue";
import { mapGetters, mapState } from "vuex";
export default {
  components: {
    billingConsumeLine,
    billingResourceView,
    halfPie,
    resourceMonthlyPie,
  },
  data() {
    return {
      resourceList: [],
      resourceLoading: false,
      invalidAt: null,
      efficientAt: null,
      ipfsResourceObj: {
        HOSTING: "0",
        BUCKET: "0",
        GATEWAY: "0",
      },
      arResourceObj: {
        HOSTING: "0",
        BUCKET: "0",
      },
      bandwidthResourceObj: {
        HOSTING: "0",
        BUCKET: "0",
        GATEWAY: "0",
      },
      buildMin: {
        size: 0,
        unit: "Min",
      },
      landUsedMonthlyLine: [],
      landUsedMonthlyPie: [],
    };
  },
  computed: {
    ...mapGetters(["balance"]),
    ...mapState({
      onChain: (s) => s.onChain,
    }),
  },
  created() {
    this.$store.dispatch("getBalance");
    this.getUserResource();
    this.getAnalyticsIpfs();
    this.getAnalyticsAr();
    this.getAnalyticsBandwidth();
    this.getAnalyticsBuildMin();
    this.getLandUsedMonthly();
  },
  methods: {
    async getUserResource() {
      this.resourceLoading = true;
      try {
        const { data } = await this.$http.get("$bill-consume/combo/user/list");
        const comboItem = data.combo;
        this.invalidAt = Number(comboItem.invalidAt) * 1e3;
        this.efficientAt = Number(comboItem.efficientAt) * 1e3;
        this.resourceList = comboItem.resourceItems
          .filter((it) => it.resourceType != "COMPUTE_UNIT")
          .map((it, i) => {
            let total = Number(it.size);
            let used =
              Number(comboItem.consumeItems[i].size) +
              Number(data.realTimeItems[i].size);
            let remaining = total - used;
            let percent;
            if (it.size == "0") {
              percent = 0;
            } else {
              percent = ((used / total) * 100).toFixed(0);
            }
            if (it.resourceType == "BUILD_TIME") {
              return {
                type: it.resourceType,
                total: total / 60,
                used: used / 60,
                remaining: (total - used) / 60,
                percent,
              };
            }
            if (it.resourceType == "IPFS_STORAGE") {
              used =
                Number(comboItem.consumeItems[i].size) +
                Number(data.totalIpfsStorage);
            }
            return {
              type: it.resourceType,
              total,
              used,
              remaining,
              percent,
            };
          });
      } catch (error) {
        console.log(error);
      }
      this.resourceLoading = false;
    },
    async getAnalyticsIpfs() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/app/analytics",
          {
            params: {
              resourceType: "IPFS_STORAGE",
            },
          }
        );

        for (const key in this.ipfsResourceObj) {
          this.ipfsResourceObj[key] = data
            .filter((it) => it.appType == key)
            .reduce((prev, it) => {
              return prev.add(BigNumber.from(it.resourceConsume));
            }, BigNumber.from("0"))
            .toString();
        }
        console.log(this.ipfsResourceObj);
      } catch (error) {
        console.log(error);
      }
    },
    async getAnalyticsAr() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/app/analytics",
          {
            params: {
              resourceType: "AR_STORAGE",
            },
          }
        );
        // console.log(data);
        for (const key in this.arResourceObj) {
          this.arResourceObj[key] = data
            .filter((it) => it.appType == key)
            .reduce((prev, it) => {
              return prev.add(BigNumber.from(it.resourceConsume));
            }, BigNumber.from("0"))
            .toString();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getAnalyticsBandwidth() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/app/analytics",
          {
            params: {
              resourceType: "TRAFFIC",
            },
          }
        );
        for (const key in this.bandwidthResourceObj) {
          this.bandwidthResourceObj[key] = data
            .filter((it) => it.appType == key)
            .reduce((prev, it) => {
              return prev.add(BigNumber.from(it.resourceConsume));
            }, BigNumber.from("0"))
            .toString();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getAnalyticsBuildMin() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/app/analytics",
          {
            params: {
              resourceType: "BUILD_TIME",
            },
          }
        );
        const totalMin = data.reduce((pre, it) => {
          return pre.add(BigNumber.from(it.resourceConsume));
        }, BigNumber.from("0"));

        this.buildMin = this.$utils.getResourceTypeSize(
          totalMin,
          true,
          "BUILD_TIME"
        );
      } catch (error) {
        console.log(error);
      }
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

        this.landUsedMonthlyLine = data;

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
        this.landUsedMonthlyPie = Object.values(resourceUsedObj).map((it) => {
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
              resourceUsed = this.$utils.getNumCount(it.resourceUsed) + "Cus";
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
  },
};
</script>

<style lang="scss" scoped>
.plan-row,
.land-row,
.statistics-row {
  margin: 0;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.plan-level {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background: #f3e8ff;
  border-radius: 8px 0 0 8px;

  .level-tag {
    color: #fff;
    line-height: 16px; /* 114.286% */
    border-radius: 6px;
    background: linear-gradient(
        307deg,
        rgba(151, 71, 255, 0.8) 37.75%,
        rgba(115, 94, 161, 0.8) 93.02%
      ),
      #735ea1;
  }
}
.resource-col {
  height: 100%;
  padding: 12px 6px;
}

.variable {
  color: #775da6;
}
.balance {
  color: #0f172a;
  font-family: "DIN Alternate";
  font-size: 32px;
}
.deposite-btn {
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  background: #fff;
}
.land-consume {
  border-top: 1px solid #cbd5e1;
}
.line-charts {
  border-left: 1px solid #cbd5e1;
}
.rpc-section {
  border-top: 1px solid #cbd5e1;
}
.data {
  color: #64748b;
}
.pie-col {
  border-left: 1px solid #cbd5e1;
}
</style>
