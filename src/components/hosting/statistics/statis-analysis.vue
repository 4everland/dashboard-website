<template>
  <div v-if="isRender">
    <e-date-range class="mb-3" val="24h" @dates="onDates"></e-date-range>
    <v-row v-if="dates">
      <v-col
        class="mb-10"
        cols="12"
        md="6"
        v-for="(it, i) in chartList"
        :key="i"
      >
        <statis-chart
          :reloadAt="reloadAt"
          :appId="appId"
          :title="it.title"
          :type="it.type"
          :dates="dates"
        ></statis-chart>
      </v-col>
    </v-row>

    <h4 class="mb-2">Retention Rate</h4>
    <v-skeleton-loader type="article" v-if="tableLoading"></v-skeleton-loader>
    <statis-table :list="tableList" v-else></statis-table>
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
      chartList: [
        {
          title: "Total Users",
          type: "TOTAL_USERS",
        },
        { title: "New Users", type: "NEW_USERS" },
        {
          title: "Unique Visitor",
          type: "UNIQUE_VISITOR",
        },
        // { title: 'PageView', type: "PAGE_VIEW" },
      ],
      tableList: [],
      tableLoading: false,
    };
  },
  watch: {
    reloadAt() {
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
        this.tableLoading = true;
        const { data: list } = await this.$http2.get(
          "/analytics/user/retention/project/" + this.appId
        );
        this.tableList = list.map((it) => {
          it.date = new Date(it.createAt * 1e3).format("date");
          return it;
        });
      } catch (error) {
        console.log(error);
      }
      this.tableLoading = false;
    },
  },
};
</script>