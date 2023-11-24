<template>
  <div>
    <h2 class="fz-16 mt-6 mb-4">Choose Token</h2>
    <div
      @click="onSelect(it.label)"
      class="coin-label py-2 px-4 cursor-p d-flex space-btw mr-2 mb-2"
      :class="{
        active: selected == it.label,
      }"
      v-for="(it, i) in coinList"
      :key="i"
    >
      <div class="al-c flex-1">
        <v-icon size="16" :color="selected == it.label ? $color1 : '#555'"
          >mdi-{{
            selected == it.label
              ? "circle-slice-8"
              : "checkbox-blank-circle-outline"
          }}</v-icon
        >
        <img
          class="ml-3"
          style="vertical-align: middle"
          :src="it.img"
          width="40"
        />
        <div class="fz-12 ml-1">
          <div
            class="fz-14"
            :class="{
              'color-1': selected == it.label,
            }"
          >
            {{ it.name }}
          </div>
          <div>{{ it.label }}</div>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chainId: {
      type: Number,
    },
  },
  data() {
    return {
      selected: "USDC",
    };
  },
  computed: {
    coinList() {
      const coinList = [
        {
          label: "USDC",
          name: "USDC Coin",
          img: "/img/svg/pay/usdc.svg",
        },
        {
          label: "USDT",
          name: "Tether USD",
          img: "/img/svg/pay/usdt.svg",
        },
        {
          label: "DAI",
          name: "Dai Stablecoin",
          img: "/img/svg/pay/dai.svg",
        },
      ];
      // if (this.chainId == 280 || this.chainId == 324)
      //   return coinList.filter((it) => it.label == "USDC");

      return coinList;
    },
  },
  methods: {
    onSelect(label) {
      this.selected = label;
      this.$emit("onSelectCoin", label);
    },
  },

  watch: {
    chainId(val) {
      if (val == 280 || val == 324) {
        this.selected = "USDC";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.coin-label {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
}
.coin-label.active {
  font-weight: bold;
  border: 1px solid #735ea1;
}
</style>
