<template>
  <div>
    <div class="al-c ov-a pb-1">
      <v-icon color="#6e7787" size="18" class="mr-2">mdi-alert-circle</v-icon>
      <span class="gray-7 mr-3">Total balance:</span>
      <b class="fz-20 red-1">{{ balance }}</b>
      <span class="gray-6 fz-12 ml-2 mt-1">USDC</span>
      <v-btn color="primary" rounded class="ml-8" @click="showRecharge = true"
        >Recharge</v-btn
      >
      <v-btn outlined rounded class="ml-4">Withdraw</v-btn>
      <a class="ml-auto al-c" href="#/usage/billing/deduction">
        <img src="img/svg/billing/usage-list.svg" width="14" />
        <span class="ml-2 fz-14">Deduction details</span>
      </a>
    </div>

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
          <v-btn x-small color="primary" text>
            <span>{{ item.hash.cutStr(6, 6) }}</span>
          </v-btn>
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

    <v-dialog v-model="showRecharge" max-width="500">
      <e-dialog-close @click="showRecharge = false" />
      <div class="pa-4 pos-r">
        <h3>Recharge</h3>
        <div class="mt-3 bd-1 bg-f8a pa-5 bdrs-8 d-flex al-start">
          <v-icon color="#ff8843" size="22">mdi-alert-circle</v-icon>
          <div class="ml-2">
            <p class="fz-15">
              Recharge will lock your funds. <br />
              When the account resource over used, the excess quantities will be
              deducted. <br />
              You can withdraw your balance at any time.
            </p>
            <div class="mt-4 gray-7 fz-13 lh-11">
              <p>
                * Currently, racharge are only supported on the Polygon network.
              </p>
              <p class="mt-2">* Only supports USDC recharge.</p>
            </div>
          </div>
        </div>
        <div class="mt-4 al-c gray-7">
          <span class="ml-2">Total Balance:</span>
          <b class="fz-20 red-1 mr-1 ml-2">{{ balance }}</b>
          <span class="fz-13 mt-1">USD</span>
          <span class="ml-auto">
            Wallet Banace: 200 <span class="fz-13">USDC</span>
          </span>
        </div>
        <div class="bd-1 mt-3 al-c bdrs-5">
          <div class="al-c bdr-1 pr-4 pl-2">
            <img src="img/svg/billing/ic-polygon.svg" width="26" />
            <span class="ml-2 fz-14">Polygon</span>
          </div>
          <input
            type="tel"
            class="input-1 flex- shrink-1 fz-18 pa-2 pl-4"
            style="width: auto"
          />
          <img src="img/svg/settings/c-usdc.svg" height="24" />
          <span class="ml-2 mr-2 fz-14">USDC</span>
          <v-btn color="primary" small class="mr-2">MAX</v-btn>
        </div>
        <div class="fz-14 mt-2 ml-2 gray-7">
          * Recharge at least 100 USDC
          <span class="red-1">（Insufficient balance）</span>
        </div>
        <div class="mt-4 pa-3">
          <v-btn color="primary" rounded block depressed @click="onApprove"
            >Approve</v-btn
          >
          <v-btn class="mt-5" outlined rounded block>Confirm</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showRecharge: false,
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
      loading: false,
      list: [],
      total: 0,
      page: 1,
      balance: 0,
    };
  },
  mounted() {
    this.getBalance();
    this.getList();
  },
  methods: {
    async getBalance() {
      try {
        const { data } = await this.$http.get("$v3/account/balance");
        this.balance = data;
      } catch (error) {
        //
      }
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
        this.list = data.rows.map((it) => {
          it.time = new Date(it.paymentTime * 1e3).format();
          it.amount = it.usdt + " USD";
          return it;
        });
        this.total = data.count;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    onItem(row) {
      this.$navTo(`/usage/billing/detail?hash=` + row.hash);
    },
    onApprove() {},
  },
};
</script>