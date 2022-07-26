<template>
  <div class="ov-wrap-1">
    <div class="al-c">
      <img src="img/svg/overview/earth.svg" width="16" />
      <b class="ml-2 fz-16">Requests by country</b>
      <e-radio-btn
        class="ml-auto"
        :options="['Hosting', 'Bucket']"
      ></e-radio-btn>
    </div>
    <v-row class="mt-4">
      <v-col cols="12" md="7">
        <div ref="chart" style="height: 300px"></div>
      </v-col>
      <v-col cols="12" md="5">
        <table class="w100p">
          <thead class="bg-gray-a">
            <tr>
              <td>State</td>
              <td>Requests</td>
              <td>Bandwidth</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>China</td>
              <td>15</td>
              <td>1.2MB</td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  computed: {
    worldMapJson() {
      return this.$store.state.worldMapJson;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        // const { data } = await this.$http2.get("/favourite/analytics/request/flux");
        const { data } = await this.$http.get("/bi/charts/map");
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async setChart() {
      if (!this.worldMapJson) {
        this.loading = true;
        try {
          const { data } = await Axios.get(
            "https://static1.4everland.org/config/world.json"
          );
          this.$setState({
            worldMapJson: data,
          });
        } catch (error) {
          //
        }
        this.loading = false;
      }
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
            name: /flux/.test(this.api) ? "Data Transfer(MB)" : "Request",
            type: "map",
            roam: true,
            map: "world",
            scaleLimit: {
              min: 0.8,
              max: 2,
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