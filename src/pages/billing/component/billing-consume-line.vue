<template>
  <div class="billing-consume-line pt-2 h-flex">
    <div class="text fw-b mb-4 ml-4">LAND Consumption (31 Days)</div>
    <div id="main" class="flex-1"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    landUsedMonthly: {
      type: Array,
    },
  },
  data() {
    return {
      IPFS_STORAGE: new Array(31).fill(0),
      AR_STORAGE: new Array(31).fill(0),
      BUILD_TIME: new Array(31).fill(0),
      TRAFFIC: new Array(31).fill(0),
      COMPUTE_UNIT: new Array(31).fill(0),
      AI_RPC: new Array(31).fill(0),
      RAAS: new Array(31).fill(0),
      ASS_NODE: new Array(31).fill(0),
      myChart: null,
      baseOption: {
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            let str = "";
            params.forEach((it) => {
              let size = this.$utils.formatLand(
                parseInt(it.value / 1e18),
                false,
                false
              );
              str += `<div class="al-c mt-1">
              <span class="mr-2 d-ib" style="width: 10px; height: 10px; border-radius: 50%; background: ${
                it.color
              }">  </span>
              <span class="mr-1">${it.seriesName}:</span>
              <span> ${size == 0 ? "0" : size + " LAND"}</span>
              </div>`;
            });
            return `
              <div>${params[0].axisValueLabel}</div>
              ${str}
            `;
          },
        },
        legend: {
          data: [
            "IPFS",
            "Arweave",
            "Bandwidth",
            "Build Time",
            "RPC Requests",
            "AI RPC",
            "RaaS",
            // "Others",
          ],
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: (value) => {
              if (value <= 1) return value;
              return (
                this.$utils.formatLand(parseInt(value / 1e18), false, false) +
                " " +
                "LAND"
              );
            },
          },
        },
      },
    };
  },
  computed: {
    timestamp() {
      let year = new Date().getUTCFullYear();
      let month =
        new Date().getUTCMonth() + 1 > 9
          ? new Date().getUTCMonth() + 1
          : "0" + (new Date().getUTCMonth() + 1);
      let date =
        new Date().getUTCDate() > 9
          ? new Date().getUTCDate()
          : "0" + new Date().getUTCDate();

      return +new Date(year + "-" + month + "-" + date) / 1e3;
    },
    monthAgoTimeStamp() {
      return new Array(31).fill(0).map((it, i) => {
        return this.timestamp - (31 - i) * 86400;
      });
    },
    monthAgoDate() {
      return this.monthAgoTimeStamp.map(
        (it) =>
          new Date(it * 1e3).getUTCMonth() +
          1 +
          "-" +
          new Date(it * 1e3).getUTCDate()
      );
    },
    options() {
      return {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.monthAgoDate,
        },
        series: [
          {
            name: "IPFS",
            type: "line",
            itemStyle: {
              color: "#57B9BC",
            },
            data: this.IPFS_STORAGE,
          },
          {
            name: "Arweave",
            type: "line",
            itemStyle: {
              color: "#000",
            },
            data: this.AR_STORAGE,
          },
          {
            name: "Bandwidth",
            type: "line",
            itemStyle: {
              color: "#9AD3DC",
            },
            data: this.TRAFFIC,
          },
          {
            name: "Build Time",
            type: "line",
            itemStyle: {
              color: "#F3CC5C",
            },
            data: this.BUILD_TIME,
          },
          {
            name: "RPC Requests",
            type: "line",
            itemStyle: {
              color: "#8098F9",
            },
            data: this.COMPUTE_UNIT,
          },
          {
            name: "AI RPC",
            type: "line",
            itemStyle: {
              color: "#6172F3",
            },
            data: this.AI_RPC,
          },
          {
            name: "RaaS",
            type: "line",
            itemStyle: {
              color: "#F78E69",
            },
            data: this.RAAS,
          },
          // {
          //   name: "Others",
          //   type: "line",
          //   itemStyle: {
          //     color: "#70707B",
          //   },
          //   data: this.ASS_NODE,
          // },
        ],
      };
    },
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("main"));
    this.myChart.setOption({ ...this.baseOption, ...this.options });

    window.addEventListener("resize", () => {
      this.myChart.resize();
    });
  },
  watch: {
    landUsedMonthly() {
      this.monthAgoTimeStamp.forEach((it, i) => {
        this.landUsedMonthly.forEach((item) => {
          if (item.timestamp == it) {
            this[item.resourceType][i] = Number(item.landUsed);
          }
        });
      });
      this.myChart.setOption({ ...this.baseOption, ...this.options });
    },
  },
};
</script>

<style scoped lang="scss">
.billing-consume-line {
  width: 100%;
  height: 100%;
  .text {
    color: #0f172a;
  }
}
#main {
  width: 100%;
  min-height: 300px;
}
</style>
