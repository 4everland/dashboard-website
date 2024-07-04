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
        class="plan-level pa-4 h-flex al-c space-btw"
        :class="onChain ? 'on-chain' : ''"
      >
        <div class="al-c space-btw">
          <!-- <div class="al-c">
            <img src="/img/svg/new-billing/manage.svg" width="24" alt="" />
            <span class="fw-b ml-1">Manage Sub</span>
          </div> -->
          <div
            class="level-tag cursor-p fz-14 fw-b py-2 px-3"
            :class="onChain ? 'on-chain' : ''"
          >
            {{ onChain ? "Standard" : "Trial" }}
          </div>

          <div
            class="upgrad pa-2 fw-b fz-14 al-c ml-1 cursor-p"
            v-if="!onChain"
            @click="handleUpgrad"
          >
            <img src="/img/svg/overview/upgrad.svg" width="16" alt="" />
            <span style="margin-left: 2px">Activate Account</span>
          </div>
        </div>

        <div class="resource-description py-4">
          <div v-if="onChain" class="standard">
            <span class="fee">$0</span>
            <span>/mo</span>
          </div>
          <h3 v-else class="fz-20 trial">Free for one-month</h3>
        </div>
        <div>
          <p class="mb-0 fz-12 al-c">
            <img
              src="/img/svg/new-billing/upcoming.svg"
              width="16"
              height="16"
              alt=""
            />
            <span class="ml-1" style="text-wrap: nowrap"
              >Upcoming resource allocation:</span
            >
            <span
              style="text-wrap: nowrap"
              class="fw-b variable ml-2"
              :class="onChain ? 'on-chain' : ''"
              >{{ efficientDate }}</span
            >
          </p>
          <p class="mb-0 fz-12 al-c mt-1">
            <img src="/img/svg/new-billing/validity.svg" width="16" alt="" />
            <span class="ml-1">Validity:</span>
            <span
              class="fw-b variable ml-2"
              :class="onChain ? 'on-chain' : ''"
              >{{ invalidDate }}</span
            >
          </p>
        </div>
      </v-col>
      <v-col :md="8" cols="12" style="padding: 0">
        <v-row style="margin: 0; background: #fff" align="center">
          <v-col
            class="resource-col"
            v-for="item in resourceList"
            :key="item.type"
          >
            <billing-resource-view :view="item"></billing-resource-view>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <div class="mb-4 mt-6 al-c space-btw">
      <h3>LAND</h3>
      <div
        class="fz-12 cursor-p al-c"
        @click="$router.push('/billing/records?tab=Monthly%20Bill')"
      >
        <span>Billing History</span>
        <img src="/img/svg/new-billing/right-arrow.svg" width="16" alt="" />
      </div>
    </div>

    <v-row class="land-row">
      <v-col :md="4" cols="12" style="padding: 0">
        <div class="py-6 px-4 h-flex al-c">
          <h4 class="fz-16">LAND Balance</h4>
          <div class="mt-6">
            <img src="/img/svg/new-billing/land-icon.svg" width="24" alt="" />
            <span class="balance fw-b ml-2">{{ balance.land }}</span>
            <span class="fz-12 ml-2">{{ balance.unit }}</span>
          </div>
          <div v-if="!this.teamInfo.isMember">
            <v-btn
              text
              plain
              elevation="0"
              color="#0079F2"
              @click="balanceAlertShow = true"
              >Balance Alert</v-btn
            >
          </div>
          <div
            class="deposite-btn py-4 px-6 cursor-p al-c mt-6"
            v-ripple
            @click="$router.push('/billing/deposit')"
          >
            <span>Deposit</span>
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
        <div class="py-4 px-4 h-flex al-c">
          <h4 class="fz-14">Build Time</h4>
          <div class="my-2">
            <span class="balance fw-b">{{ buildMin.size }}</span>
            <span class="fz-12 ml-2">{{ buildMin.unit }}</span>
          </div>
          <div class="fz-14 data">
            <span>Total builds: </span>
            <span>{{ buildCount }}</span>
          </div>
        </div>
        <div class="py-4 px-4 h-flex al-c rpc-section">
          <h4 class="fz-14">Web3 RPC</h4>
          <div class="my-2">
            <span class="balance fw-b">{{ rpcRequest.num }}</span>
            <span class="fz-12 ml-2">{{ rpcRequest.unit }}</span>
          </div>
          <div class="fz-14 data">
            <span>Total Requests: </span>
            <span>{{ rpcInstance }}</span>
          </div>
        </div>
        <div class="py-4 px-4 h-flex al-c rpc-section">
          <h4 class="fz-14">AI RPC</h4>
          <div class="my-2">
            <span class="balance fw-b">{{ airpcLandUsed.land }}</span>
            <span class="fz-12 ml-2">{{ airpcLandUsed.unit }} LAND</span>
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
    <v-dialog
      v-model="balanceAlertShow"
      max-width="700"
      @click:outside="cancelAlert"
    >
      <div class="pa-4">
        <h3 class="mb-4">Balance Alert</h3>
        <span class="fz-14 pa-4">
          Once the alert is activated, an email will be sent if the account
          balance falls below the threshold.
        </span>
        <v-row class="pa-6">
          <v-col cols="12">
            <div class="d-flex al-c mb-8" style="gap: 30px">
              <h2 class="fz-16" style="width: 120px">Alert</h2>
              <div>
                <v-radio-group v-model="alertEnable" row>
                  <v-radio label="ON" :value="true"></v-radio>
                  <v-radio label="OFF" :value="false"></v-radio>
                </v-radio-group>
              </div>
            </div>

            <div class="d-flex al-c mb-8" style="gap: 30px">
              <h2 class="fz-16" style="width: 120px">Alert Threshold</h2>
              <div class="purchase-plate d-flex al-c">
                <div class="deposite-section">
                  <div class="al-c deposite-control">
                    <input
                      class="deposite-input flex-1"
                      v-model="alertLand"
                      type="number"
                      min="0"
                      onkeyup="value=value.replace(/[^\d]+/g,'')"
                    />
                    <span class="d-ib symbal fz-14">LAND</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex al-c mb-8" style="gap: 30px">
              <h2 class="fz-16" style="width: 120px">Email</h2>
              <div class="fz-14">
                <span v-if="email">
                  {{ email }}
                </span>
                <v-btn
                  v-else
                  elevation="0"
                  color="primary"
                  small
                  @click="onBind"
                >
                  Bind Email
                </v-btn>
              </div>
            </div>
            <div class="d-flex justify-center">
              <v-btn elevation="0" large @click="cancelAlert"> Cancel </v-btn>
              <v-btn
                :disabled="!email"
                :loading="alertLoading"
                elevation="0"
                color="primary"
                large
                class="ml-8"
                @click="saveAlert"
              >
                Save
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { BigNumber } from "ethers";
import { bus } from "@/utils/bus";
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
      rpcRequest: {
        num: 0,
        unit: "",
      },
      landUsedMonthlyLine: [],
      landUsedMonthlyPie: [],
      showWithDrawNotice: true,
      buildCount: 0,
      rpcInstance: 0,
      airpcLandUsed: {
        land: 0,
        unit: "",
      },
      balanceAlertShow: false,
      alertEnable: false,
      alertLand: "500000",
      fromValid: false,
      alertLoading: false,
      defaultAlert: {},
    };
  },
  computed: {
    ...mapGetters(["balance", "teamInfo"]),
    ...mapState({
      onChain: (s) => s.onChain,
      email: (s) => s.userInfo.email,
    }),

    efficientDate() {
      if (!this.onChain) return "One-time distribution";
      return this.efficientAt
        ? new Date(this.efficientAt).format("date")
        : "--";
    },
    invalidDate() {
      console.log(this.teamInfo.createAt);
      if (this.onChain) return "Permanent";
      let timestamp = +new Date();
      if (timestamp > this.teamInfo.createAt + 86400 * 30 * 1000)
        return "Expired";
      return new Date(this.teamInfo.createAt + 86400 * 30 * 1000).format(
        "date"
      );
    },
  },
  created() {
    this.$store.dispatch("getBalance");
    this.getUserResource();
    this.getAnalyticsIpfs();
    this.getAnalyticsAr();
    this.getAnalyticsBandwidth();
    this.getAnalyticsBuildMin();
    this.getAnalyticsRpc();
    this.getAnalyticsAiRpc();
    this.getLandUsedMonthly();
    this.getAlert();
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
          .filter(
            (it) =>
              it.resourceType != "COMPUTE_UNIT" && it.resourceType != "AI_RPC"
          )
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
        this.buildCount = data.reduce((pre, it) => {
          let value = 0;
          if (it.statistics) {
            value = Number(it.statistics);
          }
          return value + pre;
        }, 0);
      } catch (error) {
        console.log(error);
      }
    },

    async getAnalyticsRpc() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/app/analytics",
          {
            params: {
              resourceType: "COMPUTE_UNIT",
            },
          }
        );
        const request = data.reduce((pre, it) => {
          return pre.add(BigNumber.from(it.resourceConsume));
        }, BigNumber.from("0"));

        this.rpcRequest = this.$utils.getNumCount(request, true);

        console.log(data);
        const rpcInstance = data.reduce((pre, it) => {
          let value = 0;
          if (it.statistics) {
            value = Number(it.statistics);
          }
          return value + pre;
        }, 0);
        this.rpcInstance = this.$utils.getNumCount(rpcInstance);
        this.$utils.getNumCount(request, true);
      } catch (error) {
        console.log(error);
      }
    },
    async getAnalyticsAiRpc() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/app/analytics",
          {
            params: {
              resourceType: "AI_RPC",
            },
          }
        );
        console.log(data, "airpc");
        const request = data.reduce((pre, it) => {
          return pre.add(BigNumber.from(it.resourceConsume));
        }, BigNumber.from("0"));

        this.airpcLandUsed = this.$utils.formatLand(request, true, false);
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
    async onVcode(type, code) {
      try {
        this.$loading("Binding Email");
        this.$loading.close();
        let params = {
          type,
        };

        // const { data } =
        await this.$http.get(`$auth/auth/vcode/${code}`, {
          params,
        });
        this.$setMsg({
          name: "updateUser",
        });
        this.$toast("Email binded successfully!");
      } catch (error) {
        console.log(error);
      }
    },
    async onBind() {
      try {
        let apply = "";
        const email = await this.$prompt(
          "Verify your email to stay up to date on the 4EVERLAND latest news and events.",
          "Verify Email",
          {
            confirmText: "Send",
            inputAttrs: {
              label: `Your email address`,
              rules: [
                (v) => this.$regMap.email.test(v) || "Invalid email address.",
              ],
              required: true,
            },
          }
        );
        apply = email.value;
        this.$loading();
        await this.$http.post("$auth/bind", {
          type: 3,
          apply,
          entranceId: 100,
        });
        const { value } = await this.$prompt(
          "The verification code has been sent to your email address.",
          "Verify Email",
          {
            confirmText: "Verify",
            inputAttrs: {
              label: `Verify code`,
              rules: [(v) => v.trim().length >= 4 || "Invalid code."],
              required: true,
            },
          }
        );
        await this.$sleep(100);
        this.onVcode(3, value);
      } catch (error) {
        console.log(error);
      } finally {
        this.$loading.close();
      }
    },
    async getAlert() {
      try {
        const { data } = await this.$http.get(
          "$bill-consume/assets/early/warn"
        );
        this.alertEnable = data.enable;
        this.alertLand = data.land;
        this.defaultAlert = data;
      } catch (error) {
        console.log(error);
      }
    },
    async saveAlert() {
      this.alertLoading = true;
      try {
        await this.$http.put("$bill-consume/assets/early/warn", {
          land: this.alertLand,
          enable: this.alertEnable,
        });
        this.balanceAlertShow = false;
        this.$toast("Save successfully!");
      } catch (error) {
        console.log(error);
      } finally {
        this.alertLoading = false;
      }
    },
    async cancelAlert() {
      this.alertEnable = this.defaultAlert.enable;
      this.alertLand = this.defaultAlert.land;
      this.balanceAlertShow = false;
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
  background: #e2e8f0;
  border-radius: 8px 0 0 8px;
  .level-tag {
    color: #fff;
    line-height: 16px; /* 114.286% */
    border-radius: 4px;
    background: #94a3b8;
  }
  .level-tag.on-chain {
    background: linear-gradient(
        307deg,
        rgba(110, 88, 242, 0.8) 37.75%,
        rgba(105, 65, 198, 0.8) 93.02%
      ),
      var(--color-font-brand, #6172f3);
  }
  .resource-description {
    .standard {
      .fee {
        font-family: "DIN Alternate";
        font-size: 24px;
        color: #0f172a;
      }
      span {
        color: #64748b;
        font-size: 12px;
      }
    }
    .trial {
      color: #0f172a;
    }
  }
  .upgrad {
    color: #fff;
    line-height: 16px;
    border-radius: 4px;
    background: linear-gradient(
        307deg,
        rgba(151, 71, 255, 0.8) 37.75%,
        rgba(115, 94, 161, 0.8) 93.02%
      ),
      #735ea1;
  }
  .variable {
    color: #0f172a;
  }
  .variable.on-chain {
    color: var(--v-primary-base);
  }
}

.plan-level.on-chain {
  background: var(--v-background2-base);
}
.resource-col {
  height: 100%;
  padding: 12px 6px;
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
.notice {
  color: #735ea1;
  border-radius: 4px;
  background: #f3e8ff;
  span {
    text-decoration: underline;
  }
  a {
    text-decoration: underline;
    color: #735ea1;
  }
}

.deposite-control {
  min-width: 350px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
}
.deposite-input {
  height: 48px;
  background: #fff;
  text-indent: 20px;
  text-align: right;
  font-size: 20px;
  border-radius: 4px 0 0 4px;
  font-family: "DIN Alternate";
  padding-right: 10px;
}

.deposite-input[type="number"]::-webkit-inner-spin-button,
.deposite-input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.deposite-input[type="number"] {
  -moz-appearance: textfield;
}

.symbal {
  padding: 0px 20px;
  height: 48px;
  line-height: 48px;
  background: #f1f5f9;
  border-radius: 0 4px 4px 0;
}
</style>
