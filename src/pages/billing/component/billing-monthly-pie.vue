<template>
  <div class="billing-mothly-pie">
    <h2>2023-11 monthly bill</h2>
    <div id="pie"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    title: {
      type: String,
    },
  },
  data() {
    return {
      options: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          selectedMode: false,
          top: "bottom",
          left: "left",
          orient: "vertical",
          itemWidth: 14,
          itemHeight: 14,
          // doesn't perfectly work with our tricks, disable it
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["80%", "120%"],
            center: ["50%", "70%"],
            itemStyle: {
              borderRadius: "2px",
            },
            // adjust the start angle
            startAngle: 180,
            labelLine: {
              show: false,
            },
            label: {
              show: false,
            },
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
              {
                // make an record to fill the bottom 50%
                value: 1048 + 735 + 580 + 484 + 300,
                itemStyle: {
                  // stop the chart from rendering this piece
                  color: "none",
                  decal: {
                    symbol: "none",
                  },
                },
                label: {
                  show: false,
                },
              },
            ],
          },
        ],
      },
    };
  },
  mounted() {
    let myChart = echarts.init(document.querySelector("#pie"));
    myChart.setOption(this.options);

    window.onresize = () => {
      myChart.resize();
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.billing-mothly-pie {
  width: 100%;
}
#pie {
  width: 100%;
  height: 300px;
}
</style>
