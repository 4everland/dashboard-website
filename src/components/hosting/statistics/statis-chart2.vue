<template>
  <div class="pos-r">
    <div class="pos-a top-0 z-1 w100p d-flex al-c">
      <v-chip color="primary" small class="ml-5">{{ title }}</v-chip>
      <div style="max-width: 350px" class="ml-auto">
        <e-date-pick v-model="date" v-if="showDate"></e-date-pick>
      </div>
    </div>
    <div class="pos-r">
      <div class="d-flex pt-6">
        <div ref="chart" style="height: 260px" class="flex-1 pa-2"></div>
        <div style="width: 40%">
          <ul class="mt-12">
            <li
              class="fz-14 d-flex al-c mb-2"
              v-for="(it, i) in items"
              :key="i"
            >
              <span class="line-1 gray-6 mr-3">{{ it.name }}</span>
              <b class="ml-auto">{{ it.text }}</b>
            </li>
          </ul>
          <v-btn
            v-if="hasMore"
            @click="showAll = true"
            color="primary"
            text
            small
            class="ml-3"
            >View All</v-btn
          >
        </div>
      </div>
      <div class="pos-center z-10" v-if="loading && !showAll">
        <v-progress-circular
          :size="40"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
    </div>

    <v-dialog v-model="showAll" max-width="500">
      <div class="pd-30">
        <h3>{{ title }}</h3>
        <ul class="mt-3">
          <li class="fz-14 d-flex al-c mb-2" v-for="(it, i) in list" :key="i">
            <span class="line-1 gray-6 mr-3">{{ it.name }}</span>
            <b class="ml-auto">{{ it.text }}</b>
          </li>
        </ul>
        <div class="pa-3 ta-c" v-if="loading && showAll">
          <v-progress-circular
            :size="40"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <div class="mt-6" v-if="pageLen > 1">
          <v-pagination
            @input="onPage"
            v-model="page"
            :length="pageLen"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            :total-visible="7"
          ></v-pagination>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    title: String,
    api: {
      type: String,
      default: "/request/source/list",
    },
    type: String,
    appId: String,
    reloadAt: null,
    lazy: Boolean,
    showDate: Boolean,
  },
  data() {
    return {
      items: [],
      list: [],
      loading: false,
      page: 1,
      pageLen: 1,
      hasMore: false,
      showAll: false,
      date: null,
    };
  },
  watch: {
    reloadAt(val) {
      if (val) this.getData();
    },
    showAll(val) {
      if (val) {
        this.page = 1;
        this.pageLen = 1;
        this.onPage();
      } else {
        this.loading = false;
      }
    },
    date() {
      this.getData();
    },
  },
  mounted() {
    if (!this.lazy) {
      this.getData();
    }
  },
  methods: {
    onPage() {
      this.getList(this.page, 10);
    },
    getSize(num) {
      const mb = Math.pow(1024, 2);
      if (num > mb) return (num / mb).toFixed(2) + "MB";
      if (num > 1024) return (num / 1024).toFixed(2) + "KB";
      return num + "B";
    },
    async getList(page = 1, size = 5) {
      const params = {
        projectId: this.appId,
        sourceType: this.type,
        page: page - 1,
        size,
      };
      if (this.date) {
        params.createAt = this.date;
      }
      try {
        this.loading = true;
        const { data } = await this.$http.get(this.api, {
          params,
        });
        this.list = data.content.map((it) => {
          const obj = {
            name: it.sourceName.replace("https://", ""),
            value: it.sourceNum || it.sourceSize,
          };
          obj.text = it.sourceSize ? this.getSize(it.sourceSize) : obj.value;
          return obj;
        });
        if (size == 5) {
          this.hasMore = data.totalPages > 1;
        } else {
          this.pageLen = data.totalPages;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async getData() {
      await this.getList();
      this.items = [...this.list];
      this.$nextTick(() => {
        this.setData(this.items);
      });
    },
    setData(data) {
      const el = this.$refs.chart;
      if (!this.chart) {
        this.chart = echarts.init(el);
      }
      const option = {
        tooltip: {
          trigger: "item",
        },
        // legend: {
        //   orient: "vertical",
        //   left: "right",
        //   formatter(name) {
        //     return name.cutStr(5, 3);
        //   },
        // },
        series: [
          {
            name: this.title,
            type: "pie",
            radius: ["40%", "60%"],
            data, // [{name, value}]
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