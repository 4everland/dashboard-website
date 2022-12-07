<template>
  <div v-if="isRender">
    <e-date-range class="mb-3" val="24h" @dates="onDates"></e-date-range>

    <statis-chart
      v-if="dates"
      :reloadAt="reloadAt"
      :appId="appId"
      title="Total requests"
      type="PAGE_VIEW"
      :dates="dates"
    ></statis-chart>

    <div class="mt-15">
      <h4 class="mb-5">Requests by source</h4>
      <v-row>
        <v-col cols="12" :md="it.md || 6" v-for="(it, i) in reqList" :key="i">
          <statis-chart2
            :appId="appId"
            :show-date="it.date"
            :lazy="it.date"
            :title="it.title"
            :type="it.type"
            :reloadAt="reloadAt"
            :showRatio="it.showRatio"
          ></statis-chart2>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import EDateRange from "@/views/hosting/statistics/e-date-range";
import StatisChart2 from "@/views/hosting/statistics/statis-chart2";
import StatisChart from "@/views/hosting/statistics/statis-chart";

export default {
  props: {
    appId: String,
    reloadAt: null,
    isRender: Boolean,
  },
  data() {
    return {
      dates: null,
      reqList: [
        {
          title: "Referers",
          type: "Referer",
          date: true,
        },
        {
          title: "Browsers",
          type: "Browsers",
        },
        {
          title: "Device",
          type: "Device",
        },
        {
          title: "Operating Systems",
          type: "OS",
        },
        {
          title: "Path",
          type: "Path",
          date: true,
        },
        {
          title: "Request by country",
          type: "IP",
          md: 12,
          showRatio: true,
        },
      ],
    };
  },
  watch: {
    appId() {
      this.getData();
    },
  },
  created() {
    this.getData();
  },
  methods: {
    onDates(val) {
      this.dates = val;
    },
    async getData() {
      try {
        //
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {
    EDateRange,
    StatisChart2,
    StatisChart,
  },
};
</script>