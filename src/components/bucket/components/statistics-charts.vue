<template>
  <div>
    <v-card outlined>
      <div class="card-head-1">
        <e-date-range v-model="range1" />
      </div>
      <e-chart height="400px" :option="option"></e-chart>
    </v-card>
  </div>
</template>

<script>
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
            formatter: (params) => {
              console.log(params);
              return `<div class="pa-2" style="width: 200px">
              <div style="color:#0B0817; height:44px;line-height:44px">Mar 11 2022 03:00</div>
              <div>
                <div class="d-flex justify-space-between" style="height:30px">
                  <span style="color: #0B0817;font-size:16px">IPFS:</span>
                  <span>91.12MB</span>
                </div>
                 <div  class="d-flex justify-space-between" style="height:30px">
                  <span style="color: #0B0817;font-size:16px">AR:</span>
                  <span>91.12MB</span>
                </div>
              </div>
            </div>`;
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
  },
  data() {
    return {
      range1: [],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>