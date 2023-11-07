<template>
  <div>
    <div class="select-box">
      <v-row>
        <v-col>
          <div style="background-color: #fff">
            <v-select
              class="hide-msg"
              outlined
              :items="chain"
              item-text="name"
              item-value="key"
              dense
              @change="handleChangeSelect"
              v-model="seletedChain"
            ></v-select>
          </div>
        </v-col>
        <v-col>
          <div style="background-color: #fff">
            <v-select
              class="hide-msg"
              outlined
              :items="userKey"
              item-text="name"
              item-value="key"
              dense
              @change="handleChangeSelect"
              v-model="seletedUserKey"
            ></v-select>
          </div>
        </v-col>
        <v-col>
          <div style="background-color: #fff">
            <v-select
              class="hide-msg"
              outlined
              :items="time"
              dense
              @change="handleChangeSelectTime"
              v-model="seletedTime"
            ></v-select>
          </div>
        </v-col>
      </v-row>
    </div>
    <top-board ref="topBoard" :overViewData="overViewData" />
    <trends-chart ref="trendsChart" :chartParams="chartParams" />
    <top-chart ref="topChart" :chartParams="chartParams" />
    <rpc-chart ref="rpcChart" :chartParams="chartParams" />
  </div>
</template>

<script>
import topBoard from "./topBoard.vue";
import trendsChart from "./components/trendsChart.vue";
import topChart from "./components/topChart.vue";
import rpcChart from "./components/rpcChart.vue";
import { fetchOverview, fetchKeyList } from "@/api/rpc.js";

export default {
  name: "RpcStatus",
  components: {
    topBoard,
    trendsChart,
    topChart,
    rpcChart,
  },
  data() {
    return {
      overViewData: {
        rate: 0,
        requests: 0,
        usage: 0,
      },
      seletedChain: "All Chains",
      seletedUserKey: "All Api Keys",
      seletedTime: 1,
      chain: ["All Chains"],
      userKey: ["All Api Keys"],
      time: [
        {
          text: "Last 24 Hrs",
          value: 1,
        },
        {
          text: "Last Month",
          value: 30,
        },
      ],
      chartParams: {
        type: "REQUESTS",
        chain: "",
        userKey: "",
        startAt: "",
        endAt: "",
        days: 1,
      },
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init(days = 1) {
      this.getOverview();
      this.$refs.topBoard.setOverView(days);
      this.$refs.trendsChart.getChartData();
      this.$refs.topChart.getChartData();
      this.$refs.rpcChart.getChartData();
    },
    async getOverview() {
      const params = this.chartParams;
      const { data } = await fetchOverview(params);
      this.overViewData = data;
      this.overViewData.days = params.days;
    },
    handleChangeSelect() {},
    handleChangeSelectTime(val) {
      let endAt = new Date().getTime();
      let startAt = endAt - val * 24 * 3600 * 1000;
      this.chartParams.days = val;
      this.chartParams.startAt = startAt;
      this.chartParams.endAt = endAt;
      this.init(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.select-box {
  width: 100%;
  padding: 20px 0;
  position: sticky;
  top: 59px;
}
.select-box-sticky {
  background-color: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.05);
  padding: 20px;
}
</style>
