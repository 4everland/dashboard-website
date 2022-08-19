<template>
  <div>
    <div class="al-c mb-4">
      <e-radio-btn
        :options="['Polygon Transaction', 'Cross-chain Transaction']"
        v-model="typeIdx"
        min-width="170px"
      ></e-radio-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="list"
      :loading="loading"
      hide-default-footer
      disable-pagination
      @click:row="onItem"
    >
      <template v-slot:item.hash="{ item }">
        <e-link :href="$getPolygonUrl(item.hash)" @click.stop="onStop">
          <span>{{ item.hash.cutStr(6, 6) }}</span>
        </e-link>
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
        {{ loading ? "Loading..." : "No Transaction" }}
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
      typeIdx: 0,
      loading: false,
      list: [],
      total: 0,
      page: 1,
    };
  },
  computed: {
    headers() {
      return this.typeIdx == 0
        ? [
            {
              text: "Hash",
              value: "hash",
            },
            {
              text: "Type",
              value: "contentType",
            },
            {
              text: "Network",
              value: "network",
            },
            {
              text: "Amount",
              value: "cost",
            },
            {
              text: "CreateAt",
              value: "time",
            },
            {
              text: "Status",
              value: "status",
            },
          ]
        : [
            {
              text: "Type",
              value: "contentType",
            },
            {
              text: "From",
              value: "startChain",
            },
            {
              text: "Hash",
              value: "startChainHash",
            },
            {
              text: "To",
              value: "endChain",
            },
            {
              text: "Hash",
              value: "endChainHash",
            },
            {
              text: "Amount",
              value: "cost",
            },
            {
              text: "CreateAt",
              value: "time",
            },
          ];
    },
  },
  watch: {
    typeIdx() {
      this.list = [];
      this.page = 1;
      this.total = 0;
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    onStop() {},
    async onRefresh() {
      await this.getList();
      this.$refs.act.getBalance();
    },
    async getList() {
      try {
        this.loading = true;
        const url = this.typeIdx == 0 ? "/bill/list" : "/bill/cross/chain/list";
        const { data } = await this.$http.get("$v3" + url, {
          params: {
            page: this.page,
            size: 10,
          },
        });
        const lastHash = JSON.parse(localStorage.lastHash || "null");
        this.lastHash = lastHash;
        this.showPending = !!lastHash && this.page == 1;
        const list = data.rows;
        this.list = list.map((it) => {
          let time = this.typeIdx == 0 ? it.paymentTime : it.createdAt;
          it.network = "Polygon";
          if (this.showPending && lastHash.contentType == it.contentType) {
            const timeDiff = Math.abs(time - lastHash.paymentTime);
            const priceDiff = Math.abs(lastHash.usdt - it.usdt * 1);
            const mt1h = Date.now() - lastHash.paymentTime * 1e3 > 3600e3;
            if (
              timeDiff < 120 ||
              (priceDiff < 0.1 && timeDiff < 15 * 60) ||
              mt1h
            )
              this.showPending = false;
          }
          it.time = new Date(time * 1e3).format();
          it.cost = this.$utils.getCost(
            this.typeIdx == 0 ? it.usdt : it.amount
          );
          return it;
        });
        this.total = data.count;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    onItem(row) {
      this.$navTo(`/resource/bill-detail?id=` + row.id);
    },
  },
};
</script>