<template>
  <div>
    <div class="d-flex flex-wrap">
      <div
        @click="onSelect(it.label)"
        class="network-label py-3 cursor-p justify-center d-flex"
        :class="{
          active: payBy == it.label,
        }"
        v-for="(it, i) in payList"
        :key="i"
      >
        <v-icon size="16" :color="payBy == it.label ? $color1 : '#555'"
          >mdi-{{
            payBy == it.label
              ? "circle-slice-8"
              : "checkbox-blank-circle-outline"
          }}</v-icon
        >
        <img
          class="ml-3"
          style="vertical-align: middle"
          :src="it.img"
          height="20"
        />

        <span
          class="ml-2"
          style="width: 90px"
          :class="{
            'color-1': payBy == it.label,
          }"
          >{{ it.name }}</span
        >
      </div>
    </div>
    <ever-pay ref="everPay" v-if="payBy == 'everPay'"></ever-pay>
  </div>
</template>

<script>
import everPay from "./ever-pay.vue";
import { mapState } from "vuex";

export default {
  components: {
    everPay,
  },
  props: {
    allow: Array,
  },
  computed: {
    ...mapState({
      payBy: (s) => s.payBy,
      chainId: (s) => s.chainId,
    }),
    payList() {
      if (!this.allow) return this.list;
      return this.list.filter((it) => this.allow.includes(it.label));
    },
  },
  data() {
    return {
      list: [
        {
          label: "Polygon",
          name: "Polygon",
          img: "/img/svg/billing/ic-polygon-0.svg",
        },
        {
          label: "Ethereum",
          name: "Ethereum",
          img: "/img/svg/billing/ic-ethereum.svg",
        },
        {
          label: "BSC",
          name: "BSC",
          img: "/img/svg/billing/ic-bsc.png",
        },
        {
          label: "Arbitrum",
          name: "Arbitrum",
          img: "/img/svg/billing/ic-arbitrum.png",
        },
        {
          label: "zkSync",
          name: "zkSync Era",
          img: "/img/svg/logo-no-letters.svg",
        },
        {
          label: "everPay",
          name: "everPay",
          img: "/img/svg/billing/ic-everpay.svg",
        },
      ],
    };
  },
  created() {
    if (this.allow && !this.allow.includes(this.payBy)) {
      this.onSelect(this.allow[0]);
    }
  },
  methods: {
    onSelect(payBy) {
      this.$setState({
        payBy,
      });
      localStorage.payBy = payBy;
    },
  },
};
</script>

<style lang="scss" scoped>
.network-label {
  width: 172px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
}
.network-label.active {
  font-weight: bold;
  border: 1px solid #735ea1;
  background: #f3e8ff;
}
.network-label + .network-label {
  margin-left: 8px;
}
</style>
