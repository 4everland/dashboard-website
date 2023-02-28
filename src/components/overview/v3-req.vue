<style lang="scss">
.v3-req {
  table {
    border-spacing: 0;
    thead {
      background: #f2f2f2;
    }
    td {
      padding: 5px;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
<template>
  <div class="ov-wrap-1 v3-req">
    <div class="al-c">
      <img src="/img/svg/overview/earth.svg" width="16" />
      <b class="ml-2 fz-16">Network</b>
      <e-radio-btn
        class="ml-auto"
        :options="typeList"
        v-model="typeIdx"
      ></e-radio-btn>
    </div>
    <v-row class="mt-4">
      <v-col cols="12" md="7">
        <v-skeleton-loader
          class="mt-10 mb-10"
          v-if="loading"
          type="article"
        ></v-skeleton-loader>
        <div v-show="!loading" ref="chart" style="height: 300px"></div>
      </v-col>
      <v-col cols="12" md="5">
        <v-skeleton-loader
          class="mt-10 mb-10"
          v-if="loading"
          type="article"
        ></v-skeleton-loader>
        <div class="pos-r" v-else>
          <div class="pos-center bg-f1 pa-2 fz-14 lh-1 ml-5 mt-2" v-if="noData">
            No Data Available
          </div>
          <table class="w100p fz-13">
            <thead class="gray">
              <tr>
                <td></td>
                <td>Requests</td>
                <td>Bandwidth</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, i) in list" :key="i">
                <td class="gray-89 fw-b">{{ it.name }}</td>
                <td class="fw-b">{{ it.request }}</td>
                <td class="fw-b">{{ it.band }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Axios from "axios";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["teamInfo"]),
    worldMapJson() {
      return this.$store.state.worldMapJson;
    },
  },
  data() {
    return {
      typeList: ["Hosting", "Bucket"],
      typeIdx: 0,
      list: [],
      loading: false,
      noData: false,
      noList: [
        { name: "United States" },
        { name: "China" },
        { name: "Japan" },
        { name: "India" },
        { name: "Canada" },
        { name: "Russia" },
        { name: "Mexico" },
        { name: "Australia" },
        { name: "Malaysia" },
        { name: "France" },
        { name: "Singapore" },
        { name: "South Korea" },
      ],
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
        let res;
        this.loading = true;
        const isH = this.typeIdx == 0;
        if (isH)
          res = await this.$http.get(
            "$hosting/favourite/analytics/request/flux"
          );
        else res = await this.$http.get("/bi/charts/map");
        const { data } = res;
        const list = !isH
          ? data.collections
          : data.totalRequestVo.map((it) => {
              return {
                name: it.area,
                request: it.request,
                bandWidth: it.flux,
              };
            });
        if (!isH && this.teamInfo.isMember) {
          this.list = [];
        } else {
          this.list = list
            .filter((it) => !!it)
            .map((it) => {
              it.band = this.$utils.getFileSize(it.bandWidth || 0);
              it.value = it.request;
              return it;
            });
        }
        this.noData = !this.list.length;
        if (this.noData) {
          this.list = this.noList.map((it) => {
            it.value = "";
            return it;
          });
        }
        if (!this.worldMapJson) {
          const { data } = await Axios.get(
            "https://static1.4everland.org/config/world.json"
          );
          this.$setState({
            worldMapJson: data,
          });
        }
        this.loading = false;
        this.$nextTick(() => {
          this.setChart(this.list);
        });
      } catch (error) {
        console.log(error);
      }
    },
    setChart(data) {
      if (!this.chart) {
        const el = this.$refs.chart;
        this.chart = window.echarts.init(el);
        window.echarts.registerMap("world", this.worldMapJson, {});
      }
      const option = {
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
        },
        visualMap: {
          left: "bottom",
          min: 10,
          max: 1000000,
          // text: ["High", "Low"],
          calculable: true,
        },
        series: [
          {
            name: "Request",
            type: "map",
            roam: true,
            map: "world",
            scaleLimit: {
              min: 1,
              max: 1.5,
            },
            emphasis: {
              label: {
                show: true,
              },
            },
            data,
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>