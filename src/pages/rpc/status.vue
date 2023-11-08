<template>
  <div>
    <div class="select-box">
      <v-row>
        <v-col>
          <div style="background-color: #fff">
            <v-select
              class="hide-msg"
              outlined
              :items="chainList"
              item-text="name"
              item-value="chain"
              dense
              @change="handleChangeSelectChain"
              v-model="seletedChain"
            ></v-select>
          </div>
        </v-col>
        <v-col>
          <div style="background-color: #fff">
            <v-select
              class="hide-msg"
              outlined
              :items="userKeyList"
              item-text="name"
              item-value="id"
              dense
              @change="handleChangeSelectKey"
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
import { fetchOverview, fetchEndpoints, fetchKeyList } from "@/api/rpc.js";

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
      seletedChain: "",
      seletedUserKey: "",
      seletedTime: 1,
      chainList: [],
      userKeyList: [],
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
  created() {
    this.getEndpoints();
    this.getKeyList();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getOverview();
      const days = this.chartParams.days;
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
    async getEndpoints() {
      let chainList = [
        {
          name: "All Chains",
          chain: "",
        },
      ];
      const params = { type: "ALL" };
      const { data } = await fetchEndpoints(params);
      chainList = chainList.concat(data);
      this.chainList = chainList;
    },
    async getKeyList() {
      let userKeyList = [
        {
          name: "All Api Keys",
          id: "",
        },
      ];
      const { data } = await fetchKeyList();
      userKeyList = userKeyList.concat(data);
      this.userKeyList = userKeyList;
    },
    handleChangeSelectChain(val) {
      this.chartParams.chain = val;
      this.init();
    },
    handleChangeSelectKey(val) {
      this.chartParams.userKey = val;
      this.init();
    },
    handleChangeSelectTime(val) {
      let endAt = new Date().getTime();
      let startAt = endAt - val * 24 * 3600 * 1000;
      this.chartParams.days = val;
      this.chartParams.startAt = startAt;
      this.chartParams.endAt = endAt;
      this.init();
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
