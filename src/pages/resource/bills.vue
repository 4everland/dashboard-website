<template>
  <div>
    <div class="al-c mb-4">
      <e-radio-btn
        :options="['Polygon Transaction', 'Cross-chain Transaction']"
        v-model="typeIdx"
        min-width="170px"
      ></e-radio-btn>
    </div>

    <div class="mb-4 fz-14 gray-6" v-if="typeIdx == 0 && showPending">
      <span class="d-ib mr-2 ml-1">•</span>
      <span
        >Confirming the transaction, please be patient for a few minutes</span
      >
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
        <e-link
          v-if="item.hash"
          :href="$getTxLink(item.hash)"
          @click.stop="onStop"
        >
          <span>{{ item.hash.cutStr(6, 6) }}</span>
        </e-link>
      </template>
      <template v-slot:item.startChainHash="{ item }">
        <e-link
          v-if="item.startChainHash"
          :href="$getTxLink(item.startChainHash, item.startChain)"
          @click.stop="onStop"
        >
          <span>{{ item.startChainHash.cutStr(6, 6) }}</span>
        </e-link>
      </template>
      <template v-slot:item.endChainHash="{ item }">
        <e-link
          v-if="item.endChainHash"
          :href="$getTxLink(item.endChainHash, item.endChain)"
          @click.stop="onStop"
        >
          <span>{{ item.endChainHash.cutStr(6, 6) }}</span>
        </e-link>
      </template>
      <template v-slot:item.cost="{ item }">
        <div v-if="item.usdt > 0">
          <span>{{ item.cost }}</span>
          <span class="gray-7 ml-1">USDC</span>
        </div>
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
      showPending: false,
    };
  },
  computed: {
    headers() {
      return this.typeIdx == 0
        ? [
            {
              text: "#",
              value: "seq",
            },
            {
              text: "Hash",
              value: "hash",
            },
            {
              text: "Type",
              value: "contentType",
            },
            {
              text: "Resource",
              value: "resource",
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
              text: "#",
              value: "seq",
            },
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
            {
              text: "State",
              value: "status",
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
    },
    async getList() {
      try {
        this.loading = true;
        const isPolygon = this.typeIdx == 0;
        const url = isPolygon ? "/bill/list" : "/bill/cross/chain/list";
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
        this.list = list.map((it, i) => {
          if (it.contentType == "Recharge") it.contentType = "Deposit";
          if (it.contentType == "Airdrop") it.contentType = "Giveaway";
          if (["Deposit", "Withdraw"].includes(it.contentType)) {
            it.resource = it.contentType + " Account";
          } else if (it.contentType == "Purchase") {
            const arr = JSON.parse(it.contentJson);
            it.resource = arr
              .map((it) => {
                let amount = it.overuse || it.amount;
                if (/ipfs/i.test(it.type) && it.contentType == "Deductions") {
                  amount /= 3600;
                }
                const row = this.$utils.getPurchase(it.type, amount);
                return `${row.name} ${row.amount}${row.unit}`;
              })
              .join(", ");
          }
          it.seq = i + 1;
          let time = isPolygon ? it.paymentTime : it.createdAt;
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
          it.cost = this.$utils.getCost(it.usdt);
          if (!isPolygon) {
            it.endChain = this.getChainType(it.endChain);
            it.startChain = this.getChainType(it.startChain);
            it.status = it.states;
          }
          return it;
        });
        this.total = data.count;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    onItem(row) {
      if (this.typeIdx == 0) this.$navTo(`/resource/bill-detail?id=` + row.id);
    },
    getChainType(id) {
      id *= 1;
      if ([137, 80001].includes(id)) return "Polygon";
      if ([56, 97].includes(id)) return "BSC";
      return "Ethereum";
    },
  },
};
</script>