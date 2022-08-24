<template>
  <v-card>
    <div class="pa-5">
      <div class="al-c hover-1" @click="$navTo('resource/balance-alloc')">
        <span class="gray-5">Balance Allocation</span>
        <span class="gray ml-auto fz-14">More</span>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div>
    <div style="height: 190px" class="pos-r ov-h">
      <v-skeleton-loader
        class="pt-4"
        type="article"
        v-if="!list || resizing"
      ></v-skeleton-loader>
      <div class="ta-c pt-4" v-else-if="!list.length">
        <!-- <img src="/img/svg/overview/pie-def.svg" height="150" /> -->
        <v-progress-circular
          class="circular-0"
          :size="130"
          :width="20"
          :value="100"
          color="#e6e9ea"
        >
          <span class="fz-12 gray">No Data</span>
        </v-progress-circular>
      </div>
      <div
        v-else
        ref="chart"
        class="pos-a left-0 right-0"
        style="top: -20px; bottom: 10px"
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
        const total = data.reduce((a, b) => a + b.usdt, 0);
        this.list = data.map((it) => {
          const obj = this.$utils.getPurchase(it.resourceType); //, it.amount
          it.perc = ((it.usdt * 100) / total).toFixed(2);
          it.name = obj.name + ` ${it.perc}%`;
          it.value = it.usdt.toFixed(4);
          it.itemStyle = {
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
            return `${data.name}`; //: <b>${data.value}U</b>
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