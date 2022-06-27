<template>
  <div>
    <bill-act @update="getList" />

    <div class="mt-6">
      <v-data-table
        :headers="headers"
        :items="list"
        :loading="loading"
        hide-default-footer
        disable-pagination
        @click:row="onItem"
      >
        <template v-slot:item.hash="{ item }">
          <v-btn
            x-small
            color="primary"
            :href="$getPolygonUrl(item.hash)"
            target="_blank"
            text
            @click.stop="onStop"
          >
            <span>{{ item.hash.cutStr(6, 6) }}</span>
          </v-btn>
        </template>
        <template v-slot:item.cost="{ item }">
          <span>{{ item.cost }}</span>
          <span class="gray-7 ml-1">USD</span>
        </template>
        <template v-slot:item.status="{ item }">
          <h-status :val="item.status" />
        </template>
      </v-data-table>

      <div class="mt-8" v-if="!list.length">
        <e-empty :loading="loading">
          {{ loading ? "Loading billing..." : "No billings" }}
        </e-empty>
      </div>

      <e-pagi
        class="pa-5"
        @input="getList"
        v-model="page"
        :limit="10"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Hash",
          value: "hash",
        },
        {
          text: "Content",
          value: "contentType",
        },
        {
          text: "Cost",
          value: "cost",
        },
        {
          text: "Payment Time",
          value: "time",
        },
        {
          text: "Status",
          value: "status",
        },
      ],
      loading: false,
      list: [],
      total: 0,
      page: 1,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    onStop() {},
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("$v3/bill/list", {
          params: {
            page: this.page,
            size: 10,
          },
        });
        this.list = data.rows.map((it) => {
          it.time = new Date(it.paymentTime * 1e3).format();
          it.cost = it.usdt.toFixed(2);
          return it;
        });
        this.total = data.count;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    onItem(row) {
      this.$navTo(`/usage/billing/detail?id=` + row.id);
    },
  },
};
</script>