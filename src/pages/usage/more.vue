<style lang="scss">
.usage-more {
  .label {
    min-width: 100px;
    margin-top: 6px;
  }
}
</style>

<template>
  <div class="usage-more">
    <div
      class="mb-5 bdrs-10 d-flex lh-1"
      :class="form[it.key] > 0 ? 'bd-1 bg-hover-f8a' : 'bd-1n'"
      style="padding: 32px 40px"
      v-for="(it, i) in list"
      :key="i"
    >
      <label class="label fz-15 ta-r mr-3">{{ it.label }}:</label>
      <div class="flex-1" style="max-width: 700px">
        <div class="al-c">
          <usage-input
            v-model="form[it.key]"
            :min="0"
            :max="10000"
            :step="100"
          />
          <span class="ml-3 fz-14">{{ it.unit }}</span>
          <div class="ml-5">
            <v-btn
              @click="$set(form, it.key, txt)"
              class="mr-3 scale-9 tr-origin-0 op-7"
              outlined
              rounded
              color="primary"
              x-small
              v-for="txt in [200, 500, 1000]"
              :key="txt"
              >{{ txt }}</v-btn
            >
          </div>
        </div>
        <div class="" v-if="it.key == 'ipfs'">
          <ipfs-time />
        </div>
      </div>
    </div>
    <div class="mt-8 d-flex pt-4 bdt-1">
      <div class="ml-auto bg-f8a bdrs-8 pa-3 pl-5 pr-5 d-flex al-c">
        <span class="fz-18">Total:</span>
        <span class="red-1 ml-2 lh-1">
          <b
            class="fz-20"
            v-html="totalPrice.replace(/\.(\d+)/, `<b class='fz-15'>.$1</b>`)"
          ></b>
        </span>
        <span class="mt-1 gray-6 ml-2 fz-14">USD</span>
        <usage-preview :previewList="previewList" :list="list" />
        <v-btn
          color="primary"
          rounded
          class="ml-5"
          min-width="120"
          :disabled="totalPrice <= 0"
          @click="showOrder = true"
          >Preview</v-btn
        >
      </div>
    </div>

    <v-dialog v-model="showOrder" max-width="500">
      <e-dialog-close @click="showOrder = false" />
      <usage-order :list="previewList" :total="totalPrice" />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import { BigNumber, providers, utils } from "ethers";
import srccontracts from "../../plugins/pay/contracts/src-chain-contracts";
import dstcontracts from "../../plugins/pay/contracts/dst-chain-contracts";
import client from "../../plugins/pay/contracts/SGNClient";

const list = [
  {
    label: "Bandwidth",
    desc: "（Need to enter an integer multiple of 100.）",
    key: "bandwidth",
    unit: "GB",
    unitPrice: 12.6,
  },
  {
    label: "Storage IPFS",
    key: "ipfs",
    unit: "GB",
    unitPrice: 12,
  },
  {
    label: "Storage AR",
    key: "ar",
    unit: "MB",
    unitPrice: 10,
  },
  {
    label: "Build Minutes",
    key: "buildMinutes",
    unit: "Minutes",
    unitPrice: 12.6,
  },
];
export default {
  data() {
    const form = {};
    list.forEach((it) => {
      form[it.key] = 0;
    });
    return {
      form,
      list,
      showOrder: false,
    };
  },
  computed: {
    ...mapState({
      connectAddr: (s) => s.connectAddr,
      netType: (s) => s.netType,
      chainId: (s) => s.chainId,
    }),
    previewList() {
      return this.list
        .map((it) => {
          const value = this.form[it.key];
          return {
            label: it.label,
            value,
            price: (value * it.unitPrice) / 100,
            unit: it.unit,
            until: "Until used up",
          };
        })
        .filter((it) => it.value > 0);
    },
    totalPrice() {
      return this.previewList
        .reduce((a, b) => {
          return a + b.price;
        }, 0)
        .toFixed(2);
    },
  },
  watch: {
    connectAddr(val) {
      if (val) this.onConnect();
    },
  },
  mounted() {
    if (this.connectAddr) {
      this.onConnect();
    } else {
      this.showConnect();
    }
  },
  methods: {
    showConnect() {
      this.$setMsg({
        name: "showMetaConnect",
      });
    },
    onConnect() {
      console.log(srccontracts, dstcontracts, client);
      console.log(this.netType, this.chainId);
    },
  },
};
</script>