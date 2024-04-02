<template>
  <div class="billing-records-container main-wrap">
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
.notice {
  color: #735ea1;

  border-radius: 4px;
  background: #f3e8ff;
  a {
    text-decoration: underline;
    color: #735ea1;
  }
}
</style>
