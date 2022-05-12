<template>
  <div ref="chart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    option: Array,
  },
  watch: {
    option() {
      this.setData();
    },
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