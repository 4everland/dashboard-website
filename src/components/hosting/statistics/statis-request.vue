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

    <div class="mt-10">
      <h4 class="mb-5">Requests by source</h4>
      <v-row>
        <v-col cols="12" md="6" v-for="(it, i) in reqList" :key="i">
          <statis-chart2
            :appId="appId"
            :show-date="it.date"
            :lazy="it.date"
            :title="it.title"
            :type="it.type"
            :reloadAt="reloadAt"
          ></statis-chart2>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
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
          title: "IP From",
          type: "IP",
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
};
</script>