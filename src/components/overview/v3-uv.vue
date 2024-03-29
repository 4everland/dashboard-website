<template>
  <div class="ov-wrap-1 pb-0" style="min-height: 400px">
    <div class="al-c">
      <img src="/img/svg/overview/uv.svg" width="16" />
      <b class="ml-2 fz-16">Hosting UV</b>
      <div class="ml-auto pa-1 hover-1 z-1" @click="showSelect = true">
        <img src="/img/svg/overview/exchange.svg" width="18" />
      </div>
    </div>

    <v-skeleton-loader
      class="mt-15 mb-15"
      v-if="!uvList || loading"
      type="article"
    ></v-skeleton-loader>
    <div class="pos-r mt-5 pt-2" v-else-if="!uvList.length">
      <div class="pos-center bg-f1 pa-2 fz-14 lh-1">No Data Available</div>
      <img
        src="/img/svg/overview/uv-def.svg"
        class="w100p ev-n op-8"
        style="max-height: 260px"
      />
    </div>
    <div v-else class="d-flex pos-r">
      <div class="shrink-0 mr-5" style="min-width: 110px">
        <div class="gray fz-12 mt-3">Total</div>
        <ul class="pl-0">
          <li
            class="mt-4 lh-12 pos-r hover-1"
            @click="curIdx = i"
            :class="{
              'color-1': curIdx == i,
            }"
            v-for="(it, i) in uvList"
            :key="i"
          >
            <p class="fw-b">{{ it.totalUv }}</p>
            <p class="fz-12 mt-1" :class="curIdx == i ? 'color-1' : 'gray'">
              {{ (it.projectName || "").cutStr(10, 6) }}
            </p>
            <img
              src="/img/svg/overview/arrow.svg"
              class="pos-a"
              style="bottom: -5px; width: 115%"
              v-if="curIdx == i"
            />
          </li>
        </ul>
      </div>
      <div class="flex-1">
        <div class="gray fz-12 mt-3 ml-6 ta-c">Last 24h</div>
        <div class="pos-r" style="min-height: 295px">
          <div>
            <div
              class="pos-a left-0"
              style="top: -35px; bottom: -20px; right: -30px; height: 360px"
              ref="chart"
            ></div>
            <div class="pos-center ml-4 bg-f1 pa-2 fz-14 lh-1" v-if="!dayTotal">
              No Data Available
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="showSelect" max-width="600">
      <div class="pa-5">
        <div class="d-flex">
          <h2 class="fz-20">Select to Present</h2>
          <span v-if="!disabled" class="ml-auto fz-14 gray pa-1 mr-1"
            >{{ projChecked.length }}/5</span
          >
        </div>
        <div class="gray fz-14 mt-1">
          Up to five projects can be selected for data presentation.
        </div>
        <div class="pa-3">
          <v-skeleton-loader
            v-if="!projList"
            type="article"
          ></v-skeleton-loader>
          <e-empty v-else-if="!projList.length" class="pt-6"
            >No Projects</e-empty
          >
          <div
            v-else
            class="bd-1 bdc-d0 bg-f9 pa-2 bdrs-5 mt-2 ov-a"
            style="max-height: 50vh"
          >
            <div
              @click="onProjCheck(it)"
              class="pa-3 al-c"
              :class="
                projChecked.length == 5 && !getChecked(it) ? '' : 'hover-c2'
              "
              v-for="(it, i) in projList"
              :key="i"
            >
              <img src="/img/svg/overview/uv-dir.svg" width="14" />
              <span class="fz-14 ml-3">{{ it.projectName }}</span>
              <img
                class="ml-auto"
                :src="`/img/svg/overview/uv-${
                  getChecked(it) ? 'checked' : 'uncheck'
                }.svg`"
                width="16"
              />
            </div>
          </div>
        </div>
        <div class="ta-c mt-4">
          <v-btn outlined width="90" @click="showSelect = false">Cancel</v-btn>
          <v-btn
            color="primary"
            width="90"
            class="ml-6"
            :loading="saving"
            :disabled="disabled || !projChecked.length"
            @click="onSave"
          >
            Save
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      uvList: null,
      projList: null,
      projChecked: [],
      curIdx: 0,
      showSelect: false,
      saving: false,
      dayTotal: 0,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      clientWidth: (s) => s.clientWidth,
    }),
    curProj() {
      if (!this.uvList) return null;
      return this.uvList[this.curIdx];
    },
    disabled() {
      return !(this.projList || []).length;
    },
  },
  watch: {
    clientWidth() {
      this.loading = true;
      clearTimeout(this.resizeTiming);
      this.resizeTiming = setTimeout(() => {
        this.loading = false;
        this.chart = null;
        setTimeout(() => {
          this.setChart();
        }, 200);
      }, 200);
    },
    curProj(val) {
      if (val) {
        this.$nextTick(() => {
          this.setChart();
        });
      }
    },
    showSelect(val) {
      if (val) this.getProjList();
    },
  },
  mounted() {
    this.getUvList();
  },
  methods: {
    setData() {
      this.$nextTick(() => {
        this.setChart();
      });
    },
    getChecked(it) {
      return this.projChecked.includes(it.projectId);
    },
    onProjCheck(it) {
      if (this.projChecked.length == 5 && !this.getChecked(it))
        return this.$toast("Up to five projects can be selected");
      const idx = this.projChecked.indexOf(it.projectId);
      if (idx > -1) this.projChecked.splice(idx, 1);
      else this.projChecked.push(it.projectId);
    },
    async onSave() {
      try {
        this.saving = true;
        await this.$http.put("$hosting/favourite/analytics", this.projChecked);
        this.$toast("Saved successfully.");
        this.curIdx = 0;
        this.showSelect = false;
        this.getUvList();
      } catch (error) {
        console.log(error);
      }
      this.saving = false;
    },
    async getProjList() {
      try {
        this.projList = null;
        let { data: list } = await this.$http.get("$hosting/project/simple");
        if (list.length) {
          let { data: arr } = await this.$http.get(
            "$hosting/favourite/analytics/list"
          );

          if (!arr.length) arr = list.slice(0, 5);
          this.projChecked = arr
            .map((it) => it.projectId)
            .filter((id) => {
              return list.find((it) => it.projectId == id);
            });
        }
        this.projList = list;
      } catch (error) {
        console.log(error);
      }
    },
    async getUvList() {
      try {
        this.uvList = null;
        this.chart = null;
        let { data } = await this.$http.get("$hosting/favourite/analytics/uv");
        data.sort((a, b) => {
          return a.totalUv - b.totalUv > 0 ? -1 : 1;
        });
        this.uvList = data;
      } catch (error) {
        console.log(error);
      }
    },
    setChart() {
      if (!this.curProj) return;
      const list = [];
      const xArr = [];
      const yArr = [];
      this.dayTotal = 0;
      const data = this.curProj.uv;
      for (const key in data) {
        const num = (data[key] || 0) * 1;
        list.push({
          time: new Date(key * 1e3),
          num,
        });
        this.dayTotal += num;
      }
      list.sort((a, b) => {
        return a.time - b.time;
      });
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
          min: 6,
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          // splitLine: {
          //   show: false,
          // },
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