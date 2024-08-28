<template>
  <div class="tool-card-container">
    <div class="card_item_header">
      <div class="card_name">{{ cardName }} Card</div>
      <div class="card_desc">{{ cardDesc }}</div>
      <img class="d-b" :src="cardImg" width="164" alt="" />
      <div class="card_unit_price">
        {{ unitPrice.toLocaleString() }} LAND ×1
      </div>
    </div>
    <div
      class="card_calculate_container d-flex align-center justify-space-between mt-1"
    >
      <div class="card_calculate d-flex align-center">
        <v-btn
          icon
          x-small
          @click="() => (count -= 1)"
          :disabled="count <= minCount"
        >
          <img src="/img/booster/svg/decrement.svg" width="16" alt="" />
        </v-btn>

        <div class="fz-14 text-center" style="width: 18px">{{ count }}</div>

        <v-btn
          icon
          x-small
          @click="() => (count += 1)"
          :disabled="count >= maxCount"
        >
          <img src="/img/booster/svg/increment.svg" width="16" alt="" />
        </v-btn>
      </div>

      <v-btn class="act-btn" height="25" min-width="58">Buy</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
    maxCount: {
      type: Number,
      default: 99,
    },
    minCount: {
      type: Number,
      default: 0,
    },
    unitPrice: {
      type: Number,
      default: 50000,
    },
  },
  data() {
    return {
      count: 0,
    };
  },
};
</script>

<style lang="scss" scoped>
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
  }
}
</style>
