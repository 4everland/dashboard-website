<template>
  <div class="pos-r al-c" style="width: 328px">
    <div id="pie"></div>
    <div class="pos-a data">
      {{ $utils.formatLand(landConsume.toString()) }}LAND
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    height: {
      type: String,
      default: "200px",
    },
    curInfo: {
      type: Array,
      default: () => {
        return [
          { value: 32331, name: "IPFS" },
          { value: 2331, name: "Arweave" },
          { value: 344, name: "Bandwidth" },
          { value: 3434, name: "Build Minutes" },
          { value: 333, name: "RPC Requests" },
        ];
      },
    },
  },
  data() {
    return {
      myChart: null,
    };
  },
  computed: {
    dataOptions() {
      if (this.landConsume == 0) return [{ value: 0, name: "" }];
      return this.curInfo;
    },
    landConsume() {
      if (!this.curInfo) return 0;
      const landConsume = this.curInfo.reduce(
        (pre, it) => (pre += it.value),
        0
      );
      return landConsume;
      // return this.$utils.formatLand(landConsume.toString());
    },
    options() {
      return {
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            return `
              <div class="al-c">
                <span class="d-ib" style="width: 8px; height: 8px; background: ${
                  params.color
                }; border-radius:50%"></span>
                <span class="ml-1">${params.name}</span>
                <span class="ml-2 fw-b fz-20" style="font-family: DIN Alternate;">${
                  params.percent * 2
                }%</span></div>
              <div class="mt-1 fz-12" style="color: #64748B">
                <span>${params.data.resourceUsed}</span>
                +
                <span>${this.$utils.formatLand(
                  params.value.toString()
                )}LAND</span>
              </div>
          `;
          },
          show: this.landConsume == 0 ? false : true,
        },
        series: [
          {
            type: "pie",
            minAngle: 10,
            radius: ["100%", "150%"],
            center: ["50%", "100%"],
            itemStyle: {
              borderRadius: "2px",
              color: (component) => {
                if (this.landConsume == 0) return "#94A3B8";
                return component.data.color;
              },
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
              ...this.dataOptions,
              {
                // make an record to fill the bottom 50%
                value: this.dataOptions.reduce((pre, it) => pre + it.value, 0),
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
      };
    },
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("pie"));
    this.myChart.setOption(this.options);
    const fn = window.onresize;
    window.onresize = () => {
      fn();
      this.myChart.resize();
    };
  },
  watch: {
    landConsume() {
      this.myChart.setOption(this.options);
    },
  },
};
</script>

<style lang="scss" scoped>
#pie {
  width: 100%;
  height: 100%;
  min-height: 200px;
}
.data {
  left: 50%;
  transform: translateX(-50%);
  bottom: 0%;
  font-family: "DIN Alternate";
  font-size: 28px;
}
</style>
