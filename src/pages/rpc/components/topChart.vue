<template>
  <div>
    <v-row class="mt-2">
      <v-col cols="12">
        <div class="api-list">
          <div class="d-flex al-c mb-8 justify-space-between">
            <span class="list-tit">TOP 5 Methods</span>
            <e-radio-btn
              class="ml-auto"
              minWidth="110px"
              minHeight="24px"
              :options="typeList"
              v-model="typeIdx"
              @input="tabChange"
            ></e-radio-btn>
          </div>
          <div ref="chart" style="height: 325px"></div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { parseTime, setNotopt } from "@/utils";
import { fetchTop } from "@/api/rpc.js";
export default {
  props: {
    chartParams: {
      type: Object,
      default() {
        return {
          type: "REQUESTS",
          chain: "",
          userKey: "",
          startAt: "",
          endAt: "",
          days: "",
        };
      },
    },
  },
  components: {},
  data() {
    return {
      typeList: ["Requests", "CU"],
      typeIdx: 0,
      chartData: { x: [] },
    };
  },
  created() {},
  mounted() {},
  methods: {
    init() {
      this.getChartData();
    },
    async getChartData() {
      const params = this.chartParams;
      const { data } = await fetchTop(params);
      let chartDom = this.$refs.chart;
      let myChart = echarts.init(chartDom, null, {
        renderer: "canvas",
        useDirtyRect: false,
      });
      myChart.clear();
      if (data.x.length == 0) {
        return setNotopt(myChart, "No Data Available");
      } else {
        return this.setChart(myChart, data);
      }
    },
    setChart(myChart, data) {
      const option = {
        grid: {
          top: 24,
          bottom: 36,
          left: "3%",
          right: 0,
        },
        xAxis: {
          type: "category",
          data: data.x,
          axisLabel: {
            show: true,
            interval: 0,
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter(value) {
              if (value >= 1000000) {
                value = value / 1000000 + "M";
              } else if (value >= 1000) {
                value = value / 1000 + "K";
              }
              return value;
            },
          },
          splitLine: {
            lineStyle: {
              type: [5, 5],
              dashOffset: 5,
            },
          },
        },
        series: [
          {
            data: data.y,
            type: "bar",
            barWidth: "80",
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0],
              },
            },
          },
        ],
        tooltip: {
          trigger: "axis",
        },
        color: ["#735EA1"],
      };
      if (option && typeof option === "object") {
        myChart.setOption(option);
      }

      window.addEventListener("resize", myChart.resize);
    },
    formatterTime(timestamp, cFormat) {
      return parseTime(timestamp, cFormat);
    },
    tabChange(val) {
      switch (val) {
        case 0:
          this.chartParams.type = "REQUESTS";
          break;
        case 1:
          this.chartParams.type = "CU";
          break;
        default:
          break;
      }
      this.getChartData();
    },
  },
};
</script>

<style lang="scss" scoped>
.api-list {
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.05);
  padding: 24px;
  .list-tit {
    color: #000;
    font-size: 24px;
    font-weight: 400;
  }
  .empty-box {
    text-align: center;
    padding: 90px 0;
    .empty-tips {
      color: #64748b;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      max-width: 640px;
      margin: 0 auto;
      margin-top: 24px;
    }
  }
  .list-box {
    .list-item {
      padding: 24px;
      justify-content: space-between;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
    }
  }
}
</style>
