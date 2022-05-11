<template>
  <div class="pa-4">
    <h3>Order</h3>
    <div class="mt-4 fz-14">
      <div
        class="bdrs-8 bd-1 bg-f8a mb-4 pa-4"
        v-for="(it, i) in list"
        :key="i"
      >
        <div class="al-c">
          <div class="flex-1">
            <div class="al-c">
              <span class="gray-7">Content:</span>
              <span class="ml-auto">{{ it.label }}</span>
            </div>
            <div class="al-c mt-1">
              <span class="gray-7">Amount:</span>
              <span class="ml-auto color-1">{{ it.value }} {{ it.unit }}</span>
            </div>
            <div class="al-c mt-1">
              <span class="gray-7">Effective Time:</span>
              <span class="ml-auto">{{ it.until }}</span>
            </div>
          </div>
          <div class="bg-white pa-4 ml-4 bdrs-5">
            <div>Price:</div>
            <div>
              <span class="red-1 fz-22">12.6</span>
              <span class="ml-2">USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pa-2">
      <e-kv label="Network:" min-width="70px" label-class="gray-7 mt-1">
        <div class="al-c">
          <img
            :src="`img/svg/billing/ic-${payBy.toLowerCase()}.svg`"
            height="24"
            class="d-b"
          />
          <span class="ml-3 fz-16">{{ payBy }}</span>
        </div>
        <p class="fz-12 mt-1 gray-7">
          (You can switch the network in the wallet)
        </p>
      </e-kv>
      <e-kv
        label="Support:"
        min-width="70px"
        label-class="gray-7 mt-2"
        class="mt-2"
      >
        <div class="al-c">
          <v-select
            style="max-width: 120px"
            v-model="tokenIdx"
            :items="tokenList"
            item-text="symbol"
            item-value="index"
            single-line
            dense
            :menu-props="{
              offsetY: true,
            }"
          >
            <template #prepend v-if="selectedToken.symbol">
              <img
                :src="`img/svg/settings/c-${selectedToken.symbol.toLowerCase()}.svg`"
                width="24"
                class="mr-1"
              />
            </template>
            <template #item="{ item }">
              <div class="d-flex al-c pt-2 pb-2">
                <img
                  :src="`img/svg/settings/c-${item.symbol.toLowerCase()}.svg`"
                  style="width: 20px"
                />
                <div class="ml-2 lh-1 mr-3" style="min-width: 90px">
                  <p class="fz-13">{{ item.symbol }}</p>
                  <p class="gray fz-12 mt-1">{{ item.name }}</p>
                </div>
                <span class="fz-14 gray">{{ item.balance }}</span>
              </div>
            </template>
          </v-select>

          <div class="ml-auto fz-14 gray-7">
            <span class="">Total price:</span>
            <span class="red-1 fz-20 ml-2">{{ total }}</span>
            <span class="ml-1">USD</span>
          </div>
        </div>
      </e-kv>
    </div>
    <div class="pa-2 mt-4">
      <v-btn color="primary" rounded block depressed>Approve</v-btn>
      <v-btn outlined rounded block class="mt-4">Submit</v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    list: Array,
    total: null,
  },
  data() {
    return {
      tokenIdx: 0,
      tokenList: JSON.parse(localStorage.pay_token_list || "[]"),
    };
  },
  computed: {
    ...mapState({
      payBy: (s) => s.payBy,
    }),
    selectedToken() {
      return this.tokenList[this.tokenIdx] || {};
    },
  },
  mounted() {
    this.getTokenList();
  },
  methods: {
    async getTokenList() {
      if (this.tokenList.length) return;
      if (!this.payment) return;
      try {
        this.$loading();
        let len = await this.payment.tokenLength();
        len = len.toNumber();
        const list = [];
        for (let i = 0; i < len; i++) {
          let address = await this.payment.tokens(i);
          const erc = this.erc20(address);
          const name = await erc.name();
          const symbol = await erc.symbol();
          let balance = await erc.balanceOf(this.connectAddr);
          //
          balance =
            balance.div(
              BigNumber.from((symbol == "DAI" ? 1e18 : 1e6).toString())
            ) + "";
          list.push({
            index: i,
            name,
            symbol,
            address,
            balance,
          });
        }
        console.log(list);
        this.tokenList = list;
        localStorage.pay_token_list = JSON.stringify(list);
      } catch (error) {
        if (error) this.$alert(error.message);
      }
      this.$loading.close();
    },
  },
};
</script>