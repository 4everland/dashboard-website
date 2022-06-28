<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="list"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.amount="{ item }">
        <span>{{ item.amount }}</span>
        <span class="gray-7 ml-1">{{ item.unit || "" }}</span>
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
        {{ loading ? "Loading details..." : "No details" }}
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
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Content",
          value: "name",
        },
        {
          text: "Amount",
          value: "amount",
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
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("$v3/bill/consume/list", {
          params: {
            page: this.page,
            size: 10,
          },
        });
        this.list = data.rows.map((it) => {
          const row = this.$utils.getPurchase(it.resourceType, it.data);
          Object.assign(it, row);
          if (it.paymentTime) {
            it.time = new Date(it.paymentTime * 1e3).format();
          } else {
            it.time = "-";
          }
          it.cost = this.$utils.cutFixed(Math.max(0.0001, it.usdt), 4);
          it.status = it.status ? "Success" : "Unpaid";
          return it;
        });
        this.total = data.count;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>