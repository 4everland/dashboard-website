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
      <div>
        <span class="circle hosting"></span>
        <span class="fz-14 ml-1">Hosting</span>
      </div>
      <div class="ml-2">
        <span class="circle bucket"></span>
        <span class="fz-14 ml-1">Bucket</span>
      </div>
      <div class="ml-2">
        <span class="circle gateway"></span>
        <span class="fz-14 ml-1">Gateway</span>
      </div>
    </div>
    <div id="main"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { BigNumber } from "ethers";
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
            // if (this.tagList[this.curIndex].type == "BUILD_TIME") {
            //   return BigNumber.from(params.value).div(60).toString() + " Mins";
            // }
            // return BigNumber.from(params.value).div(1024).toString() + " KB";

            let str = "";
            params.forEach((it) => {
              let size = this.$utils.getFileSize(it.value);
              if (this.tagList[this.curIndex].type == "COMPUTE_UNIT") {
                size = this.$utils.getNumCount(it.value) + "Cus";
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
              if (value <= 1) return value;
              if (this.tagList[this.curIndex].type == "BUILD_TIME") {
                return this.$utils.getNumCount(Number(value) / 60) + " Mins";
              }
              if (this.tagList[this.curIndex].type == "COMPUTE_UNIT") {
                return this.$utils.getNumCount(value) + " Cus";
              }
              return this.$utils.getFileSize(value);
            },
          },
        },
      },
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

        series: [
          {
            name: "Hosting",
            type: "line",
            areaStyle: {},
            itemStyle: {
              color: "#809AF4",
            },
            stack: "Total",
            data: this.HOSTING,
          },
          {
            name: "Bucket",
            type: "line",
            areaStyle: {},
            itemStyle: {
              color: "#5066CA",
            },
            stack: "Total",
            data: this.BUCKET,
          },
          {
            name: "Gateway",
            type: "line",
            areaStyle: {},
            itemStyle: {
              color: "#94ADF6",
            },
            stack: "Total",
            data: this.GATEWAY,
          },
        ],
      };
    },
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("main"));
    this.myChart.setOption({ ...this.baseOptions, ...this.options });
    const fn = window.onresize;
    window.onresize = () => {
      fn();
      this.myChart.resize();
    };
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

        this.monthAgoTimeStamp.forEach((it, i) => {
          data.forEach((item) => {
            if (item.timestamp == it) {
              this[item.appType][i] = Number(item.resourceConsume);
            }
          });
        });
        this.myChart.setOption({ ...this.baseOptions, ...this.options });
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
.hosting {
  background: #809af4;
}
.bucket {
  background: #5066ca;
}
.gateway {
  background: #94adf6;
}
</style>
