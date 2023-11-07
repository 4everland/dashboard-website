<template>
  <div id="main"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      IPFS_STORAGE: new Array(31).fill(0),
      AR_STORAGE: new Array(31).fill(0),
      BUILD_TIME: new Array(31).fill(0),
      TRAFFIC: new Array(31).fill(0),
      COMPUTE_UNIT: new Array(31).fill(0),
      myChart: null,
      baseOption: {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [
            "IPFS",
            "Arweave",
            "Band Width",
            "Build Minutes",
            "Rpc Requests",
          ],
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
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
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.monthAgoDate,
          },
        ],
        series: [
          {
            name: "IPFS",
            type: "line",
            stack: "Total",
            areaStyle: {},
            itemStyle: {
              color: "#836BAF",
            },
            emphasis: {
              focus: "series",
            },
            data: this.IPFS_STORAGE,
          },
          {
            name: "Arweave",
            type: "line",
            stack: "Total",
            areaStyle: {},
            itemStyle: {
              color: "#F3CC5C",
            },
            emphasis: {
              focus: "series",
            },
            data: this.AR_STORAGE,
          },
          {
            name: "Band Width",
            type: "line",
            stack: "Total",
            areaStyle: {},
            itemStyle: {
              color: "#9AD3DC",
            },
            emphasis: {
              focus: "series",
            },
            data: this.TRAFFIC,
          },
          {
            name: "Build Minutes",
            type: "line",
            stack: "Total",
            areaStyle: {},
            itemStyle: {
              color: "#000",
            },
            emphasis: {
              focus: "series",
            },
            data: this.BUILD_TIME,
          },
          {
            name: "Rpc Requests",
            type: "line",
            stack: "Total",
            // label: {
            //   show: true,
            //   position: "top",
            // },
            areaStyle: {},
            itemStyle: {
              color: "#57B9BC",
            },
            emphasis: {
              focus: "series",
            },
            data: this.COMPUTE_UNIT,
          },
        ],
      };
    },
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("main"));
    this.myChart.setOption({ ...this.baseOption, ...this.options });
    const fn = window.onresize;
    window.onresize = () => {
      fn();
      this.myChart.resize();
    };
    this.getStaticView();
  },
  methods: {
    async getStaticView() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/land-used/analytics",
          {
            params: {
              analyticsType: "DAY",
            },
          }
        );
        console.time();
        this.monthAgoTimeStamp.forEach((it, i) => {
          data.forEach((item) => {
            if (item.timestamp == it) {
              this[item.resourceType][i] = Number(item.landUsed);
            }
          });
        });
        this.myChart.setOption({ ...this.baseOption, ...this.options });

        console.timeEnd();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
#main {
  width: 100%;
  min-height: 300px;
  height: 100%;
}
</style>
