<template>
  <div class="chart-container">
    <div class="operation-bar" v-if="operationBar"></div>
    <h3>{{ chartName }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    operationBar: {
      type: Boolean,
      default: false,
    },
    chartName: {
      type: String,
      default: "ChartName",
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>