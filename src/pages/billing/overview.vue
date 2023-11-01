<template>
  <div class="billing-container">
    <h3 class="mb-4">Plan</h3>
    <v-row class="plan-row">
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
          <div class="level-tag cursor-p fz-14 fw-b py-2 px-3">Standard</div>
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
            <span class="fw-b variable">June 24, 2023</span>
          </p>
          <p class="mb-0 fz-12 al-c mt-1">
            <img src="/img/svg/new-billing/validity.svg" width="16" alt="" />
            <span class="ml-1">Validity:</span>
            <span class="fw-b variable">Permanent</span>
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
      </v-col>
    </v-row>

    <div class="mb-4 mt-6 al-c space-btw">
      <h3>LAND</h3>
      <div
        class="fz-12 cursor-p"
        @click="$router.push('/billing/records?tab=Monthly%20Bill')"
      >
        <span>Transaction history</span>
        <img src="" alt="" />
      </div>
    </div>

    <v-row class="land-row">
      <v-col :md="4" cols="12" style="padding: 0">
        <div class="py-6 px-4 h-flex al-c">
          <h4 class="fz-14">LAND Balance</h4>
          <div class="my-6 al-c">
            <img src="" alt="" />
            <span class="balance fw-b">{{ balance.land }}</span>
            <span class="fz-12 ml-2">{{ balance.unit }}</span>
          </div>
          <div
            class="deposite-btn py-4 px-6 cursor-p"
            v-ripple
            @click="$router.push('/billing/deposite')"
          >
            <span>Deposite</span>
            <img src="" alt="" />
          </div>
        </div>
        <div class="land-consume py-6 px-4">
          <h3 class="ta-c">Monthly Consumptior</h3>
          <half-pie></half-pie>
        </div>
      </v-col>
      <v-col :md="8" cols="12" class="line-charts">
        <billing-consume-line></billing-consume-line>
      </v-col>
    </v-row>

    <h3 class="mb-4 mt-6">Resource Statistics (31 days)</h3>
    <v-row class="statistics-row">
      <v-col :md="4" cols="12" style="padding: 0">
        <div class="py-6 px-4 h-flex al-c">
          <h4 class="fz-14">Build Minutes</h4>
          <div class="my-6 al-c">
            <span class="balance fw-b">23,233</span>
            <span class="fz-12 ml-2">Mins</span>
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
          <v-col
            :md="4"
            cols="12"
            class="pie-col"
            v-for="item in 3"
            :key="item"
          >
            <pie :id="item"></pie>
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
import pie from "./component/pie.vue";
export default {
  components: {
    billingConsumeLine,
    billingResourceView,
    halfPie,
    pie,
  },
  data() {
    return {
      resourceList: [],
      balance: {
        land: "",
        unit: "",
      },
    };
  },
  created() {
    this.getBalance();
    this.getUserResource();
    // this.getStaticView();
  },
  methods: {
    async getUserResource() {
      try {
        const { data } = await this.$http.get("$bill-consume/combo/user/list");
        console.log(data);
        const comboItem = data.comboItems[0];
        this.resourceList = comboItem.resourceItems.map((it, i) => {
          let total = this.$utils.getBigFileSize(it.size);
          let used = this.$utils.getBigFileSize(comboItem.consumeItems[i].size);

          if (it.resourceType == "BUILD_TIME") {
            return {
              type: it.resourceType,
              total: Number(it.size) / 60 + " Min",
              used: Number(comboItem.consumeItems[i].size) / 60 + " Min",
              remaining:
                Number(it.size) / 60 -
                Number(comboItem.consumeItems[i].size) / 60 +
                " Min",
              percent:
                (Number(comboItem.consumeItems[i].size) / Number(it.size)) *
                100,
            };
          }
          return {
            type: it.resourceType,
            total,
            used,
            remaining: this.$utils.getBigFileSize(
              BigNumber.from(it.size)
                .sub(BigNumber.from(comboItem.consumeItems[i].size))
                .toString()
            ),
            percent: BigNumber.from(comboItem.consumeItems[i].size)
              .mul("100")
              .div(BigNumber.from(it.size))
              .toNumber(),
          };

          // if(it.resourceType == "BUILD_TIME"){
          //   return {
          //      type: it.resourceType,
          //   total: this.$utils.get(it.size),
          //   }
          // }
          // return {
          //   type: it.resourceType,
          //   total: this.$utils.getFileSize(it.size),
          //   used: this.$utils.getFileSize(comboItem.consumeItems[i].size),
          // }
        });
        console.log(this.resourceList);
      } catch (error) {
        console.log(error);
      }
    },
    async getBalance() {
      try {
        const { data } = await this.$http.get("$bill-consume/assets");
        console.log(data);

        this.balance = this.$utils.formatLand(data.land, true);
      } catch (error) {
        console.log(error);
      }
    },

    async getStaticView() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/land-used/analytics",
          {
            params: {
              analyticsType: "HOUR",
            },
          }
        );
        console.log(data);
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
  height: 168px;
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
