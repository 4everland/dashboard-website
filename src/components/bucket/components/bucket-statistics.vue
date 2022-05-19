<template>
  <div class="hide-msg" v-if="active">
    <v-alert class="mb-5 fz-14" text type="error" dense>
      The data on this page is not updated in real time. These statistics are
      for reference only.
    </v-alert>

    <v-card outlined>
      <div class="card-head-1">
        <e-date-range val="24h" dayType @dates="handleChangeBucketDate" />
      </div>
      <div class="chart-title">Bucket</div>
      <e-chart height="400px" :option="bucketOption"></e-chart>
    </v-card>
    <v-card outlined class="mt-8">
      <div class="card-head-1">
        <e-date-range val="24h" dayType @dates="handleChangeOtherDate" />
      </div>
      <div class="chart-title">Traffic Usage</div>
      <e-chart height="400px" :option="basicOption"></e-chart>
      <div class="chart-title">Requests</div>
      <e-chart height="400px" :option="basicOption"></e-chart>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    active: Boolean,
  },
  watch: {
    active(newVal) {
      console.log(newVal);
    },
  },
  data() {
    return {
      basicOption: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
            // console.log(params);
            return `<div class="pa-2" style="width: 200px">
              <div style="color:#0B0817; height:44px;line-height:44px">Mar 11 2022 03:00</div>
              <div>
                <div class="d-flex justify-space-between" style="height:30px">
                  <span style="color: #0B0817;font-size:16px">IPFS:</span>
                  <span>91.12MB</span>
                </div>
                 <div  class="d-flex justify-space-between" style="height:30px">
                  <span style="color: #0B0817;font-size:16px">AR:</span>
                  <span>91.12MB</span>
                </div>
              </div>
            </div>`;
          },
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
            symbolSize: 8,
            // lineStyle: {
            //   color: "#34A9FF",
            //   width: 2,
            // },
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
      bucketOption: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
            // console.log(params);
            return `<div class="pa-2" style="width: 200px">
              <div style="color:#0B0817; height:44px;line-height:44px">Mar 11 2022 03:00</div>
              <div>
                <div class="d-flex justify-space-between" style="height:30px">
                  <span style="color: #0B0817;font-size:16px">IPFS:</span>
                  <span>91.12MB</span>
                </div>
                 <div  class="d-flex justify-space-between" style="height:30px">
                  <span style="color: #0B0817;font-size:16px">AR:</span>
                  <span>91.12MB</span>
                </div>
              </div>
            </div>`;
          },
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
            symbolSize: 8,
            itemStyle: {
              color: "#34A9FF",
            },
          },
          {
            type: "line",
            symbolSize: 8,
            itemStyle: {
              color: "#34A9FF",
            },
            data: [150, 232, 201, 154, 190, 330, 410],
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
      bucket: "",
    };
  },
  created() {
    this.bucket = this.$route.path.split("/")[3];
  },
  methods: {
    handleChangeBucketDate(val) {
      this.getChartData(val, "STORAGE_LINE");
    },
    handleChangeOtherDate(val) {
      this.getChartData(val, "TRAFFIC_USAGE_LINE");
      this.getChartData(val, "REQUESTS_LINE");
    },
    async getChartData(timeArr, type) {
      try {
        const { data } = await this.$http({
          url: "/bi/charts/line",
          methods: "get",
          params: {
            startAt: timeArr[1],
            endAt: timeArr[0],
            type,
            bucket: this.bucket,
          },
        });
        console.log(data, 11111111);
      } catch (error) {
        console.log(error);
      }
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