<template>
  <div class="tool-card-container">
    <div class="card_item_header">
      <div class="card_name">Capacity Card</div>
      <div class="card_desc">Capacity limit+10</div>
      <img
        class="d-b"
        src="/img/booster/drawer/capacity_card.png"
        width="164"
        alt=""
      />
      <div class="card_unit_price">50,000 LAND ×1</div>
    </div>
    <div
      class="card_calculate-container d-flex align-center justify-space-between"
    >
      <div class="card_calculate">
        <v-btn icon x-small>
          <img src="/img/booster/svg/decrement.svg" width="16" alt="" />
        </v-btn>

        <span class="px-1 fz-14">99</span>

        <v-btn icon x-small>
          <img src="/img/booster/svg/increment.svg" width="16" alt="" />
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.card_item_header {
  position: relative;
  width: 164px;

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

.card_calculate {
  padding: 4px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.25);
}
</style>
