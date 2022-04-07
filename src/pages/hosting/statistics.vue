
<template>
  <div>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="list"
      no-data-text=""
      loading-text=""
      hide-default-footer
      @click:row="onRow"
    >
      <template v-slot:item.projectName="{ item }">
        <v-btn text small rounded color="primary" :to="getPath(item)">
          <b>{{ item.projectName }}</b>
        </v-btn>
      </template>
    </v-data-table>

    <div class="mt-8" v-if="!list.length">
      <e-empty :loading="loading">
        {{ loading ? "Loading Projects..." : "No Projects" }}
      </e-empty>
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
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      headers: [
        { text: "Project", value: "projectName" },
        { text: "New Users", value: "newUsers" },
        { text: "Total Users", value: "totalUsers" },
        { text: "Total UV", value: "totalUv" },
        { text: "Total PV", value: "queryCount" },
      ].map((it) => {
        // it.align = "center";
        return it;
      }),
      list: [],
      page: 1,
      pageLen: 1,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getPath(item) {
      return `/hosting/statistics/${item.projectName}/${item.projectId}`;
    },
    onRow(it) {
      const url = this.getPath(it);
      this.$router.push(url);
    },
    onPage() {
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        const params = {
          page: this.page - 1,
          size: 10,
        };
        let { data } = await this.$http2.get(
          "/analytics/user/project/page/list",
          {
            params,
          }
        );
        this.list = data.content || [];
        const total = data.totalElements || 0;
        this.pageLen = Math.max(1, Math.ceil(total / params.size));
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>