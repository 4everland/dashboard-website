<template>
  <div class="pos-r">
    <div class="pos-a top-0 z-1 w100p d-flex al-c">
      <h4>{{ title }}</h4>
      <div style="max-width: 350px" class="ml-auto">
        <e-date-pick v-model="date" v-if="showDate"></e-date-pick>
      </div>
    </div>
    <div class="pos-r">
      <div ref="chart" style="height: 200px"></div>
      <div class="pos-center z-10" v-if="loading">
        <v-progress-circular
          :size="40"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    title: String,
    type: String,
    appId: String,
    reloadAt: null,
    lazy: Boolean,
    dates: null,
    showDate: Boolean,
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isHour() {
      return this.dates == "24h";
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      timeLimit: "HOUR_24", //DAY_7 DAY_30
      timeList: [
        {
          label: "30Day",
          value: "DAY_30",
        },
        {
          label: "7Day",
          value: "DAY_7",
        },
        {
          label: "24H",
          value: "HOUR_24",
        },
      ],
      date: null,
    };
  },
  watch: {
    timeLimit() {
      this.getData();
    },
    reloadAt(val) {
      if (val) this.getData();
    },
    dates() {
      this.getData();
    },
  },
  mounted() {
    if (!this.lazy) {
      this.getData();
    }
  },
  methods: {
    onTime(it) {
      this.timeLimit = it.value;
    },
    async getData() {
      try {
        this.loading = true;
        const params = {
          viewType: this.type,
          projectId: this.appId,
        };
        if (this.isHour) {
          params.timeLimit = this.timeLimit;
        } else {
          params.startTime = this.dates[0];
          params.endTime = this.dates[1];
          params.timeLimit = "CUSTOM_TIME";
        }
        if (this.date) {
          params.createAt = this.date;
        }
        const {
          data: { data },
        } = await this.$http.get("/analytics/user/view/data", {
          params,
        });
        // console.log(data)
        // const now = new Date()
        const list = [];
        const xArr = [];
        const yArr = [];
        for (const key in data) {
          list.push({
            time: new Date(key * 1e3),
            num: data[key],
          });
        }
        list.sort((a, b) => {
          return a.time - b.time;
        });
        this.list = list;
        for (const it of list) {
          const fmt = this.isHour ? "HH:mm" : "MM-dd";
          xArr.push(it.time.format(fmt));
          // it.num = (Math.random() * 20) | 0;
          yArr.push(it.num);
        }
        this.$nextTick(() => {
          this.setData(xArr, yArr);
        });
      } catch (error) {
        //
      }
      this.loading = false;
    },
    setData(xArr, yArr) {
      const el = this.$refs.chart;
      // console.log(el, echarts)
      if (!this.chart) {
        this.chart = echarts.init(el);
      }
      const option = {
        // title: {
        //   text: this.title,
        // },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xArr,
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          splitLine: {
            show: false,
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            const { dataIndex: idx } = params[0];
            const obj = this.list[idx];
            return `${obj.time.format().replace(/:00$/, "")}<br><b>${
              obj.num
            }</b>`;
          },
        },
        series: [
          {
            data: yArr,
            type: "line",
            symbol: "none",
            areaStyle: {
              color: "rgba(52, 169, 255, 0.2)",
            },
            itemStyle: {
              color: "rgba(52, 169, 255, 0.2)",
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>