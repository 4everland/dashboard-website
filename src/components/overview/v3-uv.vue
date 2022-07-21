<template>
  <div class="ov-wrap-1">
    <div class="al-c">
      <img src="img/svg/overview/uv.svg" width="16" />
      <b class="ml-2 fz-16">Hosting UV</b>
      <div class="ml-auto pa-1 hover-1">
        <img src="img/svg/overview/exchange.svg" width="18" />
      </div>
    </div>
    <div class="d-flex">
      <ul class="pl-0 shrink-0">
        <li
          class="mt-2 mb-2"
          @click="curIdx = i"
          :class="{
            'color-1 fw-b': curIdx == i,
          }"
          v-for="(it, i) in projList"
          :key="i"
        >
          <p>{{ it.totalUv }}</p>
          <p class="gray fz-12">{{ it.projectName }}</p>
        </li>
      </ul>
      <div class="pos-r flex-1 pr-10">
        <div>
          <div
            class="pos-a left-0"
            style="top: -30px; bottom: -20px; right: 50px; height: 350px"
            ref="chart"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projList: [],
      curIdx: 0,
    };
  },
  computed: {
    curProj() {
      return this.projList[this.curIdx];
    },
  },
  watch: {
    curProj(val) {
      if (val) this.setChart(val.uv);
    },
  },
  mounted() {
    this.getProjList();
  },
  methods: {
    async getProjList() {
      try {
        const { data } = await this.$http2.get("/favourite/analytics/uv");
        this.projList = data;
      } catch (error) {
        console.log(error);
      }
    },
    setChart(data) {
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
      console.log(list);
      for (const it of list) {
        const fmt = "HH:mm";
        xArr.push(it.time.format(fmt));
        // it.num = (Math.random() * 20) | 0;
        yArr.push(it.num);
      }
      if (!this.chart) {
        const el = this.$refs.chart;
        this.chart = window.echarts.init(el);
      }
      const option = {
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
            const obj = list[idx];
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