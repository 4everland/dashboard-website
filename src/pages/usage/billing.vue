<template>
  <div>
    <bill-act ref="act" @update="getList" />

    <div class="mt-6">
      <div class="mb-4 fz-14 gray-6" v-if="showPending">
        <span class="d-ib mr-2 ml-1">•</span>
        <span
          >A {{ lastHash.contentType }} ({{ lastHash.usdt }} USD) transaction is
          pending at</span
        >
        <e-time>{{ lastHash.paymentTime * 1e3 }}</e-time>
        <v-btn small icon :loading="loading" @click="onRefresh" class="ml-1">
          <v-icon :color="$color1" size="20">mdi-refresh</v-icon>
        </v-btn>
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
      showPending: false,
      lastHash: null,
    };
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
        const { data } = await this.$http.get("$v3/bill/list", {
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
          if (it.contentType == "Purchased") it.contentType = "Purchase";
          if (this.showPending && lastHash.contentType == it.contentType) {
            const timeDiff = Math.abs(it.paymentTime - lastHash.paymentTime);
            const priceDiff = Math.abs(lastHash.usdt - it.usdt * 1);
            const mt1h = Date.now() - lastHash.paymentTime * 1e3 > 3600e3;
            if (
              timeDiff < 120 ||
              (priceDiff < 0.1 && timeDiff < 15 * 60) ||
              mt1h
            )
              this.showPending = false;
          }
          it.time = new Date(it.paymentTime * 1e3).format();
          it.cost =
            it.usdt < 0.01
              ? Math.max(0.0001, it.usdt)
              : this.$utils.cutFixed(it.usdt);
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