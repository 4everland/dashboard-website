<template>
  <div class="hide-msg">
    <v-alert class="mb-5" text type="error" dense>
      If you refresh or close the page when the folder is being deleted, the
      displayed number of deleted files may be inaccurate.
    </v-alert>

    <v-card outlined>
      <div class="card-head-1">
        <e-date-range v-model="range1" />
      </div>
      <e-chart height="400px" :option="option1"></e-chart>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      range1: [],
      option1: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>