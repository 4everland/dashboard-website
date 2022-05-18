<template>
  <div
    ref="chart"
    :style="{
      width,
      height,
    }"
  ></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    option: {
      type: Object,
      default: () => {
        return {
          xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
              data: [150, 230, 224, 218, 135, 147, 260],
              type: "line",
              symbolSize: 8,
              // lineStyle: {
              //   color: "#34A9FF",
              //   width: 2,
              // },
              itemStyle: {
                color: "#34A9FF",
              },
            },
          ],
        };
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
  watch: {
    option() {
      this.setData();
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
      this.setEchartsOption();
    },
    setEchartsOption() {
      // if (!this.option) return;
      // if (!this.chart) {
      //   this.chart = echarts.init(this.$refs.chart);

      // }
      this.chart.setOption(this.option);
    },
  },
};
</script>