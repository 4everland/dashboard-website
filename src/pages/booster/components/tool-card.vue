<template>
  <div class="tool-card-container">
    <div class="card_item_header">
      <div class="card_name">{{ cardName }} Card</div>
      <div class="card_desc mt-1">{{ cardDesc }}</div>
      <img class="d-b" :src="cardImg" width="164" alt="" />
      <div class="card_unit_price">{{ price.toLocaleString() }} LAND ×1</div>
    </div>

    <div class="card_sold_out mt-1" v-if="stock == 0">Sold Out</div>
    <div
      class="card_calculate_container d-flex align-center justify-space-between mt-1"
      v-else
    >
      <div class="card_calculate d-flex align-center">
        <v-btn icon x-small @click="handleCrement(-1)" :disabled="count <= 0">
          <v-icon class="count-icon" color="#fff">mdi-minus </v-icon>
        </v-btn>

        <div class="fz-14 text-center" style="width: 28px">
          <input
            style="width: 100%; color: #fff"
            class="text-center count-ipt"
            type="number"
            @input="handleInput"
            v-model="count"
          />
        </div>

        <v-btn
          icon
          x-small
          @click="handleCrement(1)"
          :disabled="count >= stock"
        >
          <!-- <img src="/img/booster/svg/increment.svg" width="16" alt="" /> -->

          <v-icon color="#fff" class="count-icon">mdi-plus</v-icon>
        </v-btn>
      </div>

      <v-btn
        class="act-btn"
        height="25"
        min-width="58"
        :loading="loading"
        :disabled="buyDisabled"
        @click="$emit('showBuy', { type, count, price, buff })"
        >Buy</v-btn
      >
    </div>
  </div>
</template>

<script>
import { bus } from "@/utils/bus";
import { mapState } from "vuex";
export default {
  props: {
    type: {
      type: String,
      require: true,
    },
    cardName: {
      type: String,
      default: "Capacity",
    },

    cardDesc: {
      type: String,
      default: "Capacity limit+10",
    },
    cardImg: {
      type: String,
      default: "/img/booster/drawer/capacity_card.png",
    },
    price: {
      type: Number,
      default: 50000,
    },
    stock: {
      type: Number,
      default: 99,
    },
    buff: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      count: 0,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      showToolDrawer: (s) => s.moduleBooster.showToolDrawer,
    }),
    buyDisabled() {
      return this.count < 1;
    },
  },
  created() {
    bus.$on("clearBuyCardCount", (buyCardType) => {
      if (this.type == buyCardType) {
        this.count = 0;
      }
    });
  },
  methods: {
    handleInput(e) {
      if (e.target.value < 0) {
        this.count = 0;
      }
      if (e.target.value > this.stock) {
        this.count = this.stock;
      }
    },
    handleCrement(val) {
      if (this.count == "" || this.count == 0) {
        this.count = 1;
      } else {
        this.count = Number(this.count) + val;
      }
    },
  },
  watch: {
    showToolDrawer(val) {
      if (!val) this.count = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.theme--light.v-btn.v-btn--disabled .count-icon.v-icon {
  color: #fff !important;
  opacity: 0.2;
}
.tool-card-container {
  width: 164px;
  .card_item_header {
    position: relative;

    .card_name {
      position: absolute;
      left: 12px;
      top: 13px;
      text-shadow: 0px 0px 8px #6172f3;
      font-style: italic;
      font-weight: 500;
    }
    .card_desc {
      position: absolute;
      left: 12px;
      top: 34px;
      padding: 0px 4px;
      font-size: 12px;
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.25);
    }

    .card_unit_price {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      border-radius: 0px 0px 8px 8px;
      background: rgba(0, 0, 0, 0.75);
      box-shadow: 0px -4px 0px 0px rgba(0, 0, 0, 0.25) inset;
    }
  }

  .card_sold_out {
    padding: 4px 0;
    width: 90px;
    margin-left: auto;
    font-size: 14px;
    text-align: center;
    border-radius: 4px;
    background: rgba(152, 162, 179, 0.2);
  }
  .card_calculate_container {
    .card_calculate {
      padding: 4px;
      border-radius: 20px;
      background: rgba(0, 0, 0, 0.25);
    }
    .act-btn {
      border-radius: 4px;
      color: #fff;
      background: linear-gradient(
        97deg,
        #0fe1f8 -22.19%,
        #1102fc 99.83%
      ) !important;
      box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
    }

    .act-btn.v-btn--disabled {
      opacity: 0.5 !important;
      color: #fff !important;
    }
  }
  .count-ipt[type="number"]::-webkit-inner-spin-button,
  .count-ipt[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .count-ipt[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>
