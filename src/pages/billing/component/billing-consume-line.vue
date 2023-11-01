<template>
  <div id="main"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
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
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
        ],
        yAxis: [
          {
            type: "value",
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
            data: [120, 132, 101, 134, 90, 230, 210],
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

            data: [220, 182, 191, 234, 290, 330, 310],
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
            data: [150, 232, 201, 154, 190, 330, 410],
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
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: "Rpc Requests",
            type: "line",
            stack: "Total",
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {},
            itemStyle: {
              color: "#57B9BC",
            },
            emphasis: {
              focus: "series",
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
      },
    };
  },
  mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    myChart.setOption(this.option);
    const fn = window.onresize;
    window.onresize = () => {
      fn();
      myChart.resize();
    };
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
