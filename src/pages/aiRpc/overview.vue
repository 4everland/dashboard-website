<template>
  <BillingTabs
    :tabs="['Models', 'Keys']"
    :tabsCmpList="tabsCmpList"
    :center="false"
  ></BillingTabs>
</template>

<script>
import BillingTabs from "../billing/component/billing-tabs.vue";
import keysVue from "./keys.vue";
import modelsVue from "./models.vue";
export default {
  data() {
    return {
      tabsCmpList: [modelsVue, keysVue],
    };
  },
  components: {
    BillingTabs,
  },
};
</script>

<style lang="scss" scoped></style>
