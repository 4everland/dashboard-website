<template>
  <div class="ov-wrap-1">
    <div class="al-c">
      <img src="img/svg/overview/pie.svg" width="16" />
      <b class="ml-2 fz-16">Bucket Storage</b>
      <e-radio-btn
        class="ml-auto z-100"
        :options="typeList"
        v-model="typeIdx"
      ></e-radio-btn>
    </div>

    <v-skeleton-loader
      class="mt-15 mb-15"
      type="article"
      v-if="loading"
    ></v-skeleton-loader>
    <div class="d-flex" v-else>
      <div class="pos-r flex-1 pr-10 mt-5" style="height: 260px">
        <div
          class="pos-a left-0 h100p"
          style="top: -30px; bottom: -20px; right: 50px"
          ref="chart"
        ></div>
      </div>
      <div class="mt-10 fz-14" style="width: 200px">
        <div class="al-c mt-3" v-for="(it, i) in list" :key="i">
          <span
            class="d-ib pa-2 bdrs-3 mr-2"
            :style="{
              background: it.itemStyle.color,
            }"
          ></span>
          <span class="gray">{{ it.name.cutStr(5, 5) }}</span>
          <span class="ml-auto">
            {{ it.size }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typeList: ["IPFS", "AR"],
      typeIdx: 0,
      loading: false,
      list: [],
      colors: ["3B478E", "5D68A6", "707DC1", "8290DB", "919FED"],
    };
  },
  watch: {
    typeIdx() {
      this.getData();
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        this.loading = true;
        const type = this.typeList[this.typeIdx];
        const { data } = await this.$http.get(`/bi/charts/pie`, {
          params: {
            type,
          },
        });
        console.log(data);
        this.loading = false;
        this.list = data.collections.map((it, i) => {
          it.size = this.$utils.getFileSize(it.value);
          it.itemStyle = {
            color: "#" + this.colors[i],
            borderColor: "#fff",
          };
          return it;
        });
        this.$nextTick(() => {
          this.setChart();
        });
      } catch (error) {
        console.log(error);
      }
    },
    setChart() {
      const el = this.$refs.chart;
      this.chart = window.echarts.init(el);
      const option = {
        tooltip: {
          trigger: "item",
          formatter: ({ data }) => {
            return `${data.name}: <b>${data.size}</b>`;
          },
        },
        series: [
          {
            name: this.title,
            type: "pie",
            radius: ["40%", "60%"],
            data: this.list,
            emphasis: {
              itemStyle: {
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>