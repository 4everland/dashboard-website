<template>
  <div class="billing-records-container main-wrap">
    <div class="notice fz-14 py-2 px-4 al-c">
      <img src="/img/svg/new-billing/notice.svg" width="24" alt="" />
      <span class="ml-2">
        The resource center has been fully upgraded. If you wish to view your
        billing history, please
        <a @click.prevent="$router.push('/billing/bills')"><b>click here</b></a>
        .
      </span>
    </div>

    <billing-tabs
      class="mt-5"
      :tabs="['Monthly Bill', 'Bill Details', 'Purchase History']"
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
