<template>
  <div class="hide-msg" v-if="active">
    <!-- <v-alert class="mb-5 fz-14" text type="info" dense>
      The data on this page is not updated in real time. These statistics are
      for reference only.
    </v-alert> -->

    <div class="tips pa-2 mb-5 al-c">
      <v-icon slot="ref" size="22" color="#ff6d24" class="d-ib mx-3"
        >mdi-alert-circle-outline</v-icon
      >
      <span
        >Refreshing or closing the browser will cancel ongoing tasks, clear
        records, and display deleted tasks incorrectly.</span
      >
    </div>
    <!-- IPFS && AR chart -->
    <v-card outlined>
      <div class="card-head-1">
        <e-date-range
          class="data-range"
          val="24h"
          dayType
          @dates="handleChangeBucketDate"
        />
      </div>
      <bucket-chart
        name="IPFS"
        :overDay="bucketDateOverDay"
        :xAxisData="ipfsData.xAxis"
        :yAxisData="ipfsData.yAxis"
      ></bucket-chart>
      <bucket-chart
        name="AR"
        :overDay="bucketDateOverDay"
        :xAxisData="arData.xAxis"
        :yAxisData="arData.yAxis"
      ></bucket-chart>
    </v-card>
    <!-- Traffic && Request chart -->
    <v-card outlined class="mt-8">
      <div class="card-head-1">
        <e-date-range
          class="data-range"
          val="24h"
          dayType
          @dates="handleChangeOtherDate"
        />
      </div>
      <bucket-chart
        name="Traffic Usage"
        :overDay="overDateOverDay"
        :xAxisData="trafficData.xAxis"
        :yAxisData="trafficData.yAxis"
      ></bucket-chart>
      <bucket-chart
        name="Requests"
        :overDay="overDateOverDay"
        :xAxisData="requestData.xAxis"
        :yAxisData="requestData.yAxis"
      ></bucket-chart>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    active: Boolean,
  },
  data() {
    return {
      bucket: "",
      ipfsData: {
        xAxis: [],
        yAxis: [],
      },
      arData: {
        xAxis: [],
        yAxis: [],
      },
      trafficData: {
        xAxis: [],
        yAxis: [],
      },
      requestData: {
        xAxis: [],
        yAxis: [],
      },
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
        if (val[1] - val[0] > 86400000) {
          this.bucketDateOverDay = true;
        } else {
          this.bucketDateOverDay = false;
        }
        if (res.subsections.length) {
          this.ipfsData.xAxis = res.subsections;
          this.ipfsData.yAxis = res.collections[0].raws;
          this.arData.xAxis = res.subsections;
          this.arData.yAxis = res.collections[1].raws;
        } else {
          this.ipfsData.xAxis = [];
          this.ipfsData.yAxis = [];
          this.arData.xAxis = [];
          this.arData.yAxis = [];
        }
      });
    },
    handleChangeOtherDate(val) {
      if (val[1] - val[0] > 86400000) {
        this.overDateOverDay = true;
      } else {
        this.overDateOverDay = false;
      }
      this.getChartData(val, "TRAFFIC_USAGE_LINE").then((res) => {
        if (res.subsections.length) {
          this.trafficData.xAxis = res.subsections;
          this.trafficData.yAxis = res.collections[0].raws;
        } else {
          this.trafficData.xAxis = [];
          this.trafficData.yAxis = [];
        }
      });
      this.getChartData(val, "REQUESTS_LINE").then((res) => {
        if (res.subsections.length) {
          this.requestData.xAxis = res.subsections;
          this.requestData.yAxis = res.collections[0].raws;
        } else {
          this.requestData.xAxis = [];
          this.requestData.yAxis = [];
        }
      });
    },
    async getChartData(timeArr, type) {
      this.$loading();
      try {
        const { data } = await this.$http({
          url: "/bi/charts/line",
          methods: "get",
          params: {
            startAt: timeArr[0],
            endAt: timeArr[1],
            type,
            bucket: this.bucket,
          },
        });
        return data;
      } catch (e) {
        console.log(e, "err");
      }
    },
  },
  watch: {
    active(val) {
      if (val) {
        this.ipfsData.xAxis = [];
        this.ipfsData.yAxis = [];
        this.arData.xAxis = [];
        this.arData.yAxis = [];
        this.trafficData.xAxis = [];
        this.trafficData.yAxis = [];
        this.requestData.xAxis = [];
        this.requestData.yAxis = [];
      }
    },
    "trafficData.xAxis"() {
      if (
        this.trafficData.xAxis.length &&
        this.requestData.xAxis.length &&
        this.ipfsData.xAxis.length
      ) {
        this.$loading.close();
      }
    },
    "requestData.xAxis"() {
      if (
        this.trafficData.xAxis.length &&
        this.requestData.xAxis.length &&
        this.ipfsData.xAxis.length
      ) {
        this.$loading.close();
      }
    },
    "ipfsData.xAxis"() {
      if (
        this.trafficData.xAxis.length &&
        this.requestData.xAxis.length &&
        this.ipfsData.xAxis.length
      ) {
        this.$loading.close();
      }
    },
  },
};
</script>
<style >
.data-range .v-input {
  margin: 0 !important;
}
</style>
<style lang="scss" scoped>
.chart-title {
  margin: 34px 0 14px 21px;
  height: 20px;
  line-height: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #0b0817;
}
.tips {
  color: #6a778b;
  font-size: 14px;
  color: #ff6d24;
  background: #ffeee4;
  border-radius: 6px;
  .icon {
    vertical-align: sub;
  }
}
</style>