<template>
  <div>
    <div class="chart-title">{{ name }}</div>
    <e-chart height="400px" :option="option"></e-chart>
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
      default: () => [1, 2, 3, 4],
    },
    yAxisData: {
      type: Array,
      default: () => [1, 2, 3, 4],
    },
    overDay: {
      type: Boolean,
      required: true,
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
          },
        },
        yAxis: {
          type: "value",
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
                  <span class=" fz-16" style="color: #34A9FF">${
                    this.$utils.getFileSize(params[0].value, true).num
                  }</span>
                  <span class="ml-1">${
                    this.$utils.getFileSize(params[0].value, true).unit
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
              color: "#34A9FF",
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
      // console.log(data);
      this.option.xAxis.data = data;
    },
    yAxisData(data) {
      // console.log(data);
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