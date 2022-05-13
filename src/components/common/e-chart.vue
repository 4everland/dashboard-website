<template>
  <div
    ref="chart"
    :style="{
      height,
    }"
  ></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    option: Array,
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
    this.setData();
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