<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="list"
      hide-default-footer
      disable-pagination
    >
    </v-data-table>

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
          value: "content",
        },
        {
          text: "Amount",
          value: "amount",
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
        const { data } = await this.$http.get("$v3/bill/consume/list", {
          params: {
            page: this.page,
            size: 10,
          },
        });
        this.list = data.rows.map((it) => {
          return it;
        });
        this.total = data.count;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>