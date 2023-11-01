<template>
  <div class="pos-r">
    <div id="pie"></div>
    <div class="pos-a data">{{ "23123123123".toLocaleString() }}</div>
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
  },
  data() {
    return {};
  },
  computed: {
    colorList() {
      return ["#836BAF", "#F3CC5C", "#9AD3DC", "#000", "#57B9BC"];
    },
    dataOptions() {
      const arr = [
        { value: 20093, name: "IPFS" },
        { value: 12223, name: "Arweave" },
        { value: 42293, name: "Bandwidth" },
        { value: 32293, name: "Build Minutes" },
        { value: 22293, name: "RPC Requests" },
      ];

      return arr.map((it, i) => {
        return { ...it, color: this.colorList[i] };
      });
    },
    options() {
      return {
        tooltip: {
          trigger: "item",
          formatter(params) {
            let curResource = "";
            switch (params.name) {
              case "IPFS":
                curResource = params.value * 2 + "MD";
                break;
              case "Arweave":
                curResource = params.value * 2 + "GB";
                break;
              case "Bandwidth":
                curResource = params.value * 2 + "MB";
                break;
              case "Build Minutes":
                curResource = params.value * 2 + "Min";
                break;
              case "RPC Requests":
                curResource = params.value * 2 + "CU";
                break;
              default:
                curResource = params.value * 2;
                break;
            }
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
                <span>${curResource}</span>
                +
                <span>${params.value}LAND</span>
              </div>
          `;
          },
        },
        series: [
          {
            // name: "Access From",
            type: "pie",
            radius: ["100%", "150%"],
            center: ["50%", "100%"],
            itemStyle: {
              borderRadius: "2px",
              color: (colors) => {
                return this.colorList[colors.dataIndex];
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
    var myChart = echarts.init(document.getElementById("pie"));
    myChart.setOption(this.options);
    const fn = window.onresize;
    window.onresize = () => {
      fn();
      myChart.resize();
    };
  },
  methods: {},
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
