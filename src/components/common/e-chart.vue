<template>
  <div class="echart-item">
    <div
      ref="chart"
      :style="{
        width,
        height,
      }"
    ></div>
    <div class="no-data" v-show="noData">No data available</div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      basicOption: {
        xAxis: {
          boundaryGap: false,
          type: "category",
          // data: ["", "", "", "", "", "", ""],
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
        },
        series: [
          {
            // data: [0, 0, 0, 0, 0, 0, 0],
            type: "line",
            symbolSize: 8,
            itemStyle: {
              color: "#34A9FF",
            },
          },
        ],
        grid: {
          top: "5%",
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
        },
      },
      noData: true,
    };
  },
  watch: {
    option: {
      handler(data) {
        let basicOption = JSON.parse(JSON.stringify(this.basicOption));
        if (data.xAxis.data.length) {
          this.noData = false;
          Object.assign(basicOption, data);
          this.$nextTick(() => {
            this.setEchartsOption(basicOption);
          });
        } else {
          this.noData = true;
          this.$nextTick(() => {
            this.setEchartsOption(this.basicOption);
          });
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      this.chart = echarts.init(this.$refs.chart);
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
      this.setEchartsOption(this.basicOption);
    },
    setEchartsOption(finalOption) {
      this.chart.clear();
      this.chart.setOption(finalOption);
    },
  },
};
</script>
<style lang="scss" scoped>
.echart-item {
  position: relative;
  .no-data {
    z-index: 1;
    position: absolute;
    padding: 50px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
  }
}
</style>