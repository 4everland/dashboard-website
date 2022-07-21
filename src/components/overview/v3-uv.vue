<template>
  <div class="ov-wrap-1">
    <div class="al-c">
      <img src="img/svg/overview/uv.svg" width="16" />
      <b class="ml-2 fz-16">Hosting UV</b>
      <div class="ml-auto pa-1 hover-1 z-10">
        <img src="img/svg/overview/exchange.svg" width="18" />
      </div>
    </div>
    <v-skeleton-loader
      class="mt-15 mb-15"
      v-if="!projList.length"
      type="article"
    ></v-skeleton-loader>
    <div class="d-flex pos-r">
      <ul class="pl-0 shrink-0">
        <li
          class="mt-4 lh-12 pos-r hover-1"
          @click="curIdx = i"
          :class="{
            'color-1': curIdx == i,
          }"
          v-for="(it, i) in projList"
          :key="i"
        >
          <p>{{ it.totalUv }}</p>
          <p class="fz-12 mt-1" :class="curIdx == i ? 'color-1' : 'gray'">
            {{ it.projectName.cutStr(10, 6) }}
          </p>
          <img
            src="img/svg/overview/arrow.svg"
            class="pos-a"
            style="bottom: -5px; width: 115%"
            v-if="curIdx == i"
          />
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
              color: "#E8E2F4",
            },
            itemStyle: {
              color: "#836CAE",
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>