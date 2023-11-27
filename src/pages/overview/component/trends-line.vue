<template>
  <div>
    <div class="tags al-c my-4">
      <div
        class="tag fz-14 mr-1 cursor-p"
        v-ripple
        v-for="(item, index) in tagList"
        :key="item.type"
        :class="{ actived: curIndex == index }"
        @click="handleSelectTag(index)"
      >
        {{ item.name }}
      </div>
    </div>

    <div class="al-c">
      <div v-for="item in appList" :key="item.name" class="mr-2">
        <span
          class="circle hosting"
          :style="{ background: item.itemStyle.color }"
        ></span>
        <span class="fz-14 ml-1">{{ item.name }}</span>
      </div>
    </div>
    <div id="main"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      myChart: null,
      tagList: [
        {
          type: "TRAFFIC",
          name: "BindWidth",
        },
        {
          type: "BUILD_TIME",
          name: "Build Minutes",
        },
        {
          type: "COMPUTE_UNIT",
          name: "RPC",
        },
        {
          type: "IPFS_STORAGE",
          name: "IPFS Storage",
        },
        {
          type: "AR_STORAGE",
          name: "AR Storage",
        },
      ],
      curIndex: 0,
      baseOptions: {
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            let str = "";
            params.forEach((it) => {
              let size = this.$utils.getFileSize(it.value);
              if (this.tagList[this.curIndex].type == "COMPUTE_UNIT") {
                size = this.$utils.getNumCount(it.value) + "CUs";
              }
              if (this.tagList[this.curIndex].type == "BUILD_TIME") {
                size = this.$utils.getNumCount(it.value / 60) + "Mins";
              }
              str += `<div class="al-c mt-1">
              <span class="mr-2 d-ib" style="width: 10px; height: 10px; border-radius: 50%; background: ${it.color}">  </span>
              <span class="mr-1">${it.seriesName}:</span>
              <span > ${size}</span>
              </div>`;
            });
            return `
              <div>${params[0].axisValueLabel}</div>
              ${str}
            `;
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },

        yAxis: {
          type: "value",
          axisLabel: {
            formatter: (value) => {
              if (value <= 1 && value >= 0) return value;
              if (this.tagList[this.curIndex].type == "BUILD_TIME") {
                return this.$utils.getNumCount(Number(value) / 60) + " Mins";
              }
              if (this.tagList[this.curIndex].type == "COMPUTE_UNIT") {
                return this.$utils.getNumCount(value) + " CUs";
              }
              return this.$utils.getFileSize(value);
            },
          },
        },
      },
      RPC_PROXY: new Array(31).fill(0),
      GATEWAY: new Array(31).fill(0),
      HOSTING: new Array(31).fill(0),
      BUCKET: new Array(31).fill(0),
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
        series: this.appList,
      };
    },
    appList() {
      if (this.tagList[this.curIndex].type == "BUILD_TIME") {
        return [
          {
            name: "Hosting",
            type: "line",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#5066CA",
                },
                {
                  offset: 1,
                  color: "rgba(80, 102, 202, 0.00)",
                },
              ]),
            },
            itemStyle: {
              color: "#809AF4",
            },
            stack: "Total",
            data: this.HOSTING,
          },
        ];
      }
      if (
        this.tagList[this.curIndex].type == "AR_STORAGE" ||
        this.tagList[this.curIndex].type == "IPFS_STORAGE"
      ) {
        return [
          {
            name: "Hosting",
            type: "line",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#5066CA",
                },
                {
                  offset: 1,
                  color: "rgba(80, 102, 202, 0.00)",
                },
              ]),
            },
            itemStyle: {
              color: "#809AF4",
            },
            stack: "Total",
            data: this.HOSTING,
          },
          {
            name: "Bucket",
            type: "line",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#5066CA",
                },
                {
                  offset: 1,
                  color: "rgba(80, 102, 202, 0.00)",
                },
              ]),
            },
            itemStyle: {
              color: "#5066CA",
            },
            stack: "Total",
            data: this.BUCKET,
          },
        ];
      }
      if (this.tagList[this.curIndex].type == "COMPUTE_UNIT") {
        return [
          {
            name: "RPC",
            type: "line",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#5066CA",
                },
                {
                  offset: 1,
                  color: "rgba(80, 102, 202, 0.00)",
                },
              ]),
            },
            itemStyle: {
              color: "#809AF4",
            },
            stack: "Total",
            data: this.RPC_PROXY,
          },
        ];
      }

      return [
        {
          name: "Hosting",
          type: "line",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#5066CA",
              },
              {
                offset: 1,
                color: "rgba(80, 102, 202, 0.00)",
              },
            ]),
          },
          itemStyle: {
            color: "#809AF4",
          },
          stack: "Total",
          data: this.HOSTING,
        },
        {
          name: "Bucket",
          type: "line",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#5066CA",
              },
              {
                offset: 1,
                color: "rgba(80, 102, 202, 0.00)",
              },
            ]),
          },
          itemStyle: {
            color: "#5066CA",
          },
          stack: "Total",
          data: this.BUCKET,
        },
        {
          name: "Gateway",
          type: "line",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#5066CA",
              },
              {
                offset: 1,
                color: "rgba(80, 102, 202, 0.00)",
              },
            ]),
          },
          itemStyle: {
            color: "#94ADF6",
          },
          stack: "Total",
          data: this.GATEWAY,
        },
      ];
    },
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("main"));
    this.myChart.setOption({ ...this.baseOptions, ...this.options }, true);
    window.addEventListener("resize", () => {
      this.myChart.resize();
    });
    this.getAnalytics();
  },
  methods: {
    async getAnalytics() {
      try {
        const { data } = await this.$http.get(
          "$bill-analytics/bill/app/analytics",
          {
            params: {
              resourceType: this.tagList[this.curIndex].type,
            },
          }
        );

        this.GATEWAY = new Array(31).fill(0);
        this.HOSTING = new Array(31).fill(0);
        this.BUCKET = new Array(31).fill(0);
        this.RPC_PROXY = new Array(31).fill(0);
        this.monthAgoTimeStamp.forEach((it, i) => {
          data.forEach((item) => {
            if (item.timestamp == it) {
              this[item.appType][i] = Number(item.resourceConsume);
            }
          });
        });
        this.myChart.setOption({ ...this.baseOptions, ...this.options }, true);
      } catch (error) {
        console.log(error);
      }
    },
    handleSelectTag(index) {
      this.curIndex = index;
      this.getAnalytics();
    },
  },
};
</script>

<style lang="scss" scoped>
#main {
  width: 100%;
  min-height: 300px;
  height: 100%;
}

.tags {
  .tag {
    width: 152px;
    height: 33px;
    text-align: center;
    line-height: 33px;
    color: #0f172a;

    border-radius: 4px;
    border: 1px solid #cbd5e1;
  }
  .tag.actived {
    font-weight: bold;
    color: #735ea1;

    background: #f3e8ff;
    border: none;
  }
}
.circle {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>
