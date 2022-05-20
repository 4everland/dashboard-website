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
      <e-chart height="400px" :option="trafficOption"></e-chart>
      <div class="chart-title">Requests</div>
      <e-chart height="400px" :option="requestsOption"></e-chart>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
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
      trafficOption: {
        xAxis: {
          boundaryGap: false,
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLabel: {
            formatter: (value) => {
              let date = new Date(Number(value));
              if (this.overDateOverDay) {
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: (params) => {
            // console.log(params);
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
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
            symbolSize: 8,
            itemStyle: {
              color: "#34A9FF",
            },
          },
        ],
      },
      requestsOption: {
        xAxis: {
          boundaryGap: false,
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLabel: {
            formatter: (value) => {
              let date = new Date(Number(value));
              if (this.overDateOverDay) {
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: (params) => {
            // console.log(params);
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
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
            symbolSize: 8,
            itemStyle: {
              color: "#34A9FF",
            },
          },
        ],
      },
      bucketOption: {
        xAxis: {
          boundaryGap: false,
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLabel: {
            formatter: (value) => {
              let date = new Date(Number(value));
              if (this.bucketDateOverDay) {
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: (params) => {
            let html = `<div class="py-1 px-6" style="width: 200px"><div style="color:#0B0817; height:44px;line-height:44px">${new Date(
              Number(params[0].axisValue)
            ).format()}</div><div>`;
            params.forEach((item) => {
              html += `<div class="d-flex justify-space-between" style="height:30px">
                  <span style="color: #0B0817;font-size:16px">${
                    item.seriesName
                  }</span>
                  <span class="ml-auto fz-16" style="color: #34A9FF">${
                    this.$utils.getFileSize(item.value, true).num
                  }</span>
                  <span class="ml-2">${
                    this.$utils.getFileSize(item.value, true).unit
                  }</span>
                </div>`;
            });
            html += "</div></div></div>";
            return html;
          },
        },
        series: [
          {
            name: "IPFS",
            data: [],
            type: "line",
            symbolSize: 8,
            itemStyle: {
              color: "#34A9FF",
            },
          },
          {
            name: "AR",
            type: "line",
            symbolSize: 8,
            itemStyle: {
              color: "#34A9FF",
            },
            data: [],
          },
        ],
      },
      bucket: "",
      bucketDateOverDay: false,
      overDateOverDay: false,
    };
  },
  created() {
    this.bucket = this.$route.path.split("/")[3];
  },
  methods: {
    handleChangeBucketDate(val) {
      this.getChartData(val, "STORAGE_LINE").then((res) => {
        // console.log(res, "res");
        if (val[1] - val[0] > 86400) {
          this.bucketDateOverDay = true;
        } else {
          this.bucketDateOverDay = false;
        }
        this.bucketOption.xAxis.data = res.subsections;
        this.bucketOption.series.forEach((it) => {
          res.collections.forEach((item) => {
            if (it.name == item.name) {
              it.data = item.raws.map((i) => i);
            }
          });
        });
      });
    },
    handleChangeOtherDate(val) {
      if (val[1] - val[0] > 86400) {
        this.overDateOverDay = true;
      } else {
        this.overDateOverDay = false;
      }
      this.getChartData(val, "TRAFFIC_USAGE_LINE").then((res) => {
        // console.log(res, "res");

        this.trafficOption.xAxis.data = res.subsections;
        this.trafficOption.series[0].data = res.collections[0].raws;
      });
      this.getChartData(val, "REQUESTS_LINE").then((res) => {
        this.requestsOption.xAxis.data = res.subsections;
        this.requestsOption.series[0].data = res.collections[0].raws;
      });
    },
    async getChartData(timeArr, type) {
      try {
        const { data } = await axios({
          url: "http://192.168.0.23:8080/bi/charts/line",
          methods: "get",
          params: {
            startAt: timeArr[0] * 1000,
            endAt: timeArr[1] * 1000,
            type,
            bucket: this.bucket,
          },
          headers: {
            Authorization: "Bearer " + 123456,
          },
        });
        // data.subsections = data.subsections.map((it) => {
        //   let date = new Date(it);
        //   if (timeArr[1] - timeArr[0] > 86400) {
        //     return date.getMonth() + 1 + "-" + date.getDate();
        //   }
        //   return date.getHours() + ":" + "0" + date.getMinutes();
        // });
        return data;
      } catch (e) {
        console.log(e);
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