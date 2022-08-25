<template>
  <div>
    <h3>Details</h3>
    <div v-if="!info">
      <v-skeleton-loader type="article" />
    </div>
    <div v-else>
      <div class="d-flex">
        <e-kv class="flex-1" label="Type">
          <span>{{ info.contentType }}</span>
        </e-kv>
        <e-kv class="flex-2 ml-2" label="Time">
          <span>{{ info.time }}</span>
        </e-kv>
      </div>
      <div class="d-flex mt-6">
        <e-kv class="flex-1" label="From">
          <span>{{ info.startChain }}</span>
        </e-kv>
        <e-kv class="flex-2 ml-2" label="Hash" v-if="info.startChainHash">
          <a
            class="color-1 fz-14"
            target="_blank"
            :href="$getTxLink(info.startChainHash, info.startChain)"
            >{{ (info.startChainHash || "").cutStr(6, 6) }}</a
          >
          <v-btn
            class="ml-2 pos-r"
            style="top: -1px"
            icon
            x-small
            v-clipboard="info.startChainHash"
            @success="$toast('Copied to clipboard !')"
          >
            <img src="/img/svg/copy.svg" width="11" />
          </v-btn>
        </e-kv>
      </div>

      <div class="d-flex mt-6">
        <e-kv class="flex-1" label="To">
          <span>{{ info.endChain }}</span>
        </e-kv>
        <e-kv class="flex-2 ml-2" label="Hash" v-if="info.endChainHash">
          <a
            class="color-1 fz-14"
            target="_blank"
            :href="$getTxLink(info.endChainHash, info.endChain)"
            >{{ (info.endChainHash || "").cutStr(6, 6) }}</a
          >
          <v-btn
            class="ml-2 pos-r"
            style="top: -1px"
            icon
            x-small
            v-clipboard="info.endChainHash"
            @success="$toast('Copied to clipboard !')"
          >
            <img src="/img/svg/copy.svg" width="11" />
          </v-btn>
        </e-kv>
      </div>

      <e-kv class="mt-6" label="Amount">
        <span>{{ info.cost }}</span>
        <span v-if="info.cost" class="gray-7 ml-2">USDC</span>
      </e-kv>
      <e-kv class="mt-6 e-table-head-1" label="Resource">
        <div v-if="info.resource">
          {{ info.resource }}
        </div>
        <v-data-table
          class="mb-6"
          v-if="list.length"
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
            <span class="gray-7 ml-1">USDC</span>
          </template>
        </v-data-table>
      </e-kv>
      <e-kv class="mt-6" label="Status">
        <span>{{ info.status }}</span>
      </e-kv>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    list() {
      const list = JSON.parse(this.info.contentJson || "[]");
      return list.map((it) => {
        it.cost = this.$utils.getCost(it.cost);
        it.time = "Until used up";
        if (it.effectiveTime) {
          it.time = "Until " + new Date(it.effectiveTime * 1000).format("date");
        }
        let amount = it.overuse || it.amount;
        if (/ipfs/i.test(it.type) && it.contentType == "Deductions") {
          amount /= 3600;
        }
        const row = this.$utils.getPurchase(it.type, amount);
        Object.assign(it, row);
        return it;
      });
    },
  },
  data() {
    return {
      headers: [
        {
          text: "Type",
          value: "name",
        },
        {
          text: "Specification",
          value: "amount",
        },
        {
          text: "Amount",
          value: "cost",
        },
        {
          text: "Effective Time",
          value: "time",
        },
      ],
      info: null,
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    setData(it) {
      if (it.contentType == "Recharge") it.contentType = "Deposit";
      if (it.contentType == "Airdrop") it.contentType = "Giveaway";
      if (["Deposit", "Withdraw"].includes(it.contentType)) {
        it.resource = it.contentType + " Account";
      }
      it.endChain = this.getChainType(it.endChain);
      it.startChain = this.getChainType(it.startChain);
      it.status = it.states;
    },
    async getInfo() {
      try {
        const { id } = this.$route.query;
        const { data } = await this.$http.get(
          "$v3/bill/cross/chain/capital/detail/" + id
        );
        console.log(data);
        data.time = new Date(data.createdAt * 1000).format();
        if (!data.usdt && data.amount) data.usdt = data.amount.value / 1e18;
        data.cost = !data.usdt ? "" : this.$utils.getCost(data.usdt);
        this.setData(data);
        this.info = data;
      } catch (error) {
        console.log(error);
      }
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