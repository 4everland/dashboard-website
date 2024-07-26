<template>
  <div class="pos-r al-c" style="width: 328px">
    <div id="pie"></div>
    <div class="pos-a data ta-c">
      <div v-if="showName" class="data-title">Consumption for this month</div>
      <div v-else>
        <div class="fz-14 gray">LAND</div>
        <div>
          {{ showLandConsume }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    curInfo: {
      type: Array,
      default: () => {
        return [
          { value: 0, name: "IPFS" },
          { value: 0, name: "Arweave" },
          { value: 0, name: "Bandwidth" },
          { value: 0, name: "Build Time" },
          { value: 0, name: "RPC Requests" },
          { value: 0, name: "AI RPC" },
          { value: 0, name: "ASS Node" },
        ];
      },
    },
    showName: {
      type: Boolean,
      default: false,
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
      return this.curInfo.reduce((pre, it) => (pre += it.value), 0) / 1e18;
    },
    landConsumeInt() {
      return this.landConsume.toFixed(0);
    },
    showLandConsume() {
      if (this.landConsume == 0) return 0;
      return this.landConsume > 1
        ? this.$utils.formatLand(this.landConsumeInt.toString(), false, false)
        : "< 1";
    },

    options() {
      return {
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            const land = (params.value / 1e18).toFixed(0);
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
                <span>${
                  land < 1
                    ? "< 1"
                    : this.$utils.formatLand(land.toString(), false, false)
                } LAND</span>
              </div>
          `;
          },
          show: this.landConsume == 0 ? false : true,
        },
        grid: {
          left: "0px",
          top: "0px",
          right: "0px",
          bottom: "0px",
        },
        series: [
          {
            type: "pie",
            minAngle: 10,
            radius: ["130%", "190%"],
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
    window.addEventListener("resize", () => {
      this.myChart.resize();
    });
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
  min-height: 160px;
}
.data {
  left: 50%;
  transform: translateX(-50%);
  bottom: 0%;
  font-family: "DIN Alternate";
  font-size: 28px;
  .data-title {
    color: #0f172a;
    text-align: center;
    font-family: "SF Pro Text";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}
</style>
