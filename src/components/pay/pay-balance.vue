<template>
  <v-card>
    <div class="pa-5">
      <div class="al-c hover-1" @click="$navTo('resource/balance')">
        <span class="gray-5">Balance Allocation</span>
        <span class="gray ml-auto fz-14">More</span>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div>
    <div style="height: 186px" class="pos-r ov-h">
      <v-skeleton-loader
        class="pt-4"
        type="article"
        v-if="!list || resizing"
      ></v-skeleton-loader>
      <div class="ta-c pt-4" v-else-if="!list.length">
        <img src="/img/svg/overview/pie-def.svg" height="150" />
      </div>
      <div
        v-else
        ref="chart"
        class="pos-a left-0 btm-0 right-0"
        style="top: -20px"
      ></div>
    </div>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      clientWidth: (s) => s.clientWidth,
    }),
  },
  data() {
    return {
      list: null,
      resizing: false,
      colors: ["3B478E", "5D68A6", "707DC1", "8290DB", "919FED", "B7C2FE"],
    };
  },
  watch: {
    clientWidth() {
      this.resizing = true;
      clearTimeout(this.resizeTiming);
      this.resizeTiming = setTimeout(() => {
        this.resizing = false;
        setTimeout(() => {
          this.setChart();
        }, 200);
      }, 200);
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        let { data } = await this.$http.get("$v3/bill/distributed");
        // console.log(data);
        data = [
          {
            resourceType: "TRAFFIC",
            usdt: 1,
          },
        ];
        this.list = data.map((it, i) => {
          const obj = this.$utils.getPurchase(it.resourceType); //, it.amount
          it.name = obj.name;
          it.value = it.usdt;
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
      if (!el) return;
      this.chart = window.echarts.init(el);
      const option = {
        tooltip: {
          trigger: "item",
          formatter: ({ data }) => {
            return `${data.name}: <b>${data.value}U</b>`;
          },
        },
        series: [
          {
            // name: this.title,
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