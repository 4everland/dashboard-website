<template>
  <div>
    <div class="chart-title">{{ name }}</div>
    <div class="pos-r">
      <e-chart height="400px" :option="option"></e-chart>
      <v-progress-circular
        v-show="!option.xAxis.data"
        class="pos-center"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "chartName",
    },
    xAxisData: {
      type: Array,
    },
    yAxisData: {
      type: Array,
    },
    overDay: {
      type: Boolean,
      required: true,
    },
    dataType: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      option: {
        xAxis: {
          boundaryGap: false,
          type: "category",
          data: this.xAxisData,
          axisLabel: {
            formatter: (value) => {
              let date = new Date(Number(value));
              if (this.overDay) {
                return date.getMonth() + 1 + "-" + date.getDate();
              }
              return (
                date.getHours() +
                ":" +
                (date.getMinutes() > 9
                  ? date.getMinutes()
                  : "0" + date.getMinutes())
              );
            },
            interval: 0,
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: (value) => {
              if (this.dataType) return value;
              const gb = Math.pow(1024, 3);
              const mb = Math.pow(1024, 2);
              const kb = 1024;
              if (value > gb) {
                return (value / gb).toFixed(2) + "GB";
              } else if (value > mb) {
                return (value / mb).toFixed(2) + "MB";
              } else if (value > kb) {
                return (value / kb).toFixed(2) + "KB";
              } else {
                return value + "B";
              }
            },
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: (params) => {
            return `<div class="py-1 px-6" style="width: 200px">
              <div style="color:#0B0817; height:44px;line-height:44px">${new Date(
                Number(params[0].axisValue)
              ).format()}</div>
             <div  style="height:30px">
                  <span class=" fz-16" style="color: #775DA6">${
                    this.dataType
                      ? this.$utils.getNumCount(params[0].value, true).num
                      : this.$utils.getFileSize(params[0].value, true).num
                  }</span>
                  <span class="ml-1">${
                    this.dataType
                      ? this.$utils.getNumCount(params[0].value, true).unit
                      : this.$utils.getFileSize(params[0].value, true).unit
                  }</span>
                </div>
            </div>`;
          },
        },
        series: [
          {
            data: this.yAxisData,
            type: "line",
            symbolSize: 8,
            itemStyle: {
              color: "#775DA6",
            },
          },
        ],
        grid: {
          top: "5%",
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
        },
      },
    };
  },
  watch: {
    xAxisData(data) {
      this.option.xAxis.data = data;
    },
    yAxisData(data) {
      this.option.series[0].data = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-title {
  margin: 34px 0 14px 21px;
  height: 20px;
  line-height: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #0b0817;
}
</style>