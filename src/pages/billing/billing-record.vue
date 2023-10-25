<template>
  <div class="billing-records-container">
    <div class="notice fz-14 py-2">
      <span class="ml-4">
        The resource center has been fully upgraded. If you wish to view your
        billing history, please click here .
      </span>
    </div>
    <v-tabs
      v-model="tab"
      style="border-radius: 8px"
      class="mt-4 tabs-cpm db-i"
      centered
      background-color="#F1F5F9"
    >
      <v-tab active-class="active-tab" class="tab-cpm">Monthly Bill </v-tab>
      <v-tab active-class="active-tab" class="tab-cpm"
        >Transaction Record</v-tab
      >
      <v-tab active-class="active-tab" class="tab-cpm">Recharge Record</v-tab>

      <v-tab-item v-for="item in tabItemList" :key="item">
        <component :is="item"></component>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import BillingMonthlyBill from "./component/billing-monthly-bill.vue";
import BillingRecharge from "./component/billing-recharge.vue";
import BillingTransction from "./component/billing-transction.vue";
export default {
  components: {
    BillingMonthlyBill,
    BillingRecharge,
    BillingTransction,
  },
  data() {
    return {
      tab: 0,
      tabItemList: [
        "BillingMonthlyBill",
        "BillingRecharge",
        "BillingTransction",
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.active-tab {
  background: #fff;
  border-radius: 4px;
}
.tabs-cpm :deep .v-tabs-bar {
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.tab-cpm {
  margin: 0 16px;
  padding: 6px;
}
:deep .v-tabs-slider-wrapper .v-tabs-slider {
  background: transparent;
}
.notice {
  color: #735ea1;

  border-radius: 4px;
  background: #f3e8ff;
}
</style>
