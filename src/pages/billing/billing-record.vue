<template>
  <div class="billing-records-container">
    <billing-tabs
      class=""
      :tabs="['Monthly Bill', 'Bill Details', 'Deposit History']"
      :tabsCmpList="tabItemList"
    ></billing-tabs>
  </div>
</template>

<script>
import BillingTabs from "./component/billing-tabs.vue";
import BillingMonthlyBill from "./views/billing-monthly-bill.vue";
import BillingRecharge from "./views/billing-recharge.vue";
import BillingTransction from "./views/billing-transction.vue";
export default {
  components: {
    BillingTabs,
  },
  data() {
    return {
      tab: 0,
      tabItemList: [BillingMonthlyBill, BillingTransction, BillingRecharge],
    };
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .billing-records-container {
    padding: 12px !important;
  }
}
.billing-records-container {
  padding: 26px 32px;
}
</style>
