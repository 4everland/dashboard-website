<template>
  <div>
    <v-skeleton-loader
      type="article"
      v-if="balance === null"
    ></v-skeleton-loader>
    <div v-else-if="isLock">
      <div class="pa-3 mt-5 ta-c">
        <img src="/img/svg/gateway/lock.svg" width="180" />
      </div>
      <div class="d-flex f-center">
        <div style="max-width: 550px">
          As the 4EVERLAND account balance is less than 100u, the gateway
          service has been suspended. Once the balance is replenished, the
          service will be automatically resumed.
        </div>
      </div>
      <div class="ta-c mt-8">
        <v-btn color="primary" width="120" to="/resource/deposit"
          >Deposit</v-btn
        >
      </div>
    </div>
    <div v-else>
      <e-right-opt-wrap :top="-74">
        <ipns-generate />
      </e-right-opt-wrap>
      <v-data-table
        :loading="loading"
        item-key="id"
        :headers="headers"
        :items="list"
        hide-default-footer
      ></v-data-table>
    </div>
  </div>
</template>

<script>
import IpnsGenerate from "@/views/gateway/ipns-generate";

export default {
  components: {
    IpnsGenerate,
  },
  data() {
    return {
      balance: null,
      headers: [
        { text: "Name", value: "name" },
        { text: "Access", value: "access" },
        { text: "Past 30 days  of Bandwidth", value: "bandwidth" },
        { text: "Created", value: "created" },
        { text: "Action", value: "act" },
      ],
      list: [],
      loading: false,
    };
  },
  computed: {
    isLock() {
      return this.balance < 10;
    },
  },
  mounted() {
    this.getBalance();
  },
  methods: {
    async getBalance() {
      const {
        data: { balance },
      } = await this.$http.get("$v3/account/balance");
      this.balance = balance;
    },
  },
};
</script>