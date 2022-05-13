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
    option: null,
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
      this.setData();
    });
  },
  methods: {
    setData() {
      if (!this.option) return;
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart);
      }
      this.chart.setOption(this.option);
    },
  },
};
</script>