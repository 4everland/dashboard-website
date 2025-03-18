<template>
  <div>
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <BillingTabs
      :tabs="['Models', 'Keys']"
      :tabsCmpList="tabsCmpList"
      :center="false"
    ></BillingTabs>
  </div>
</template>

<script>
import BillingTabs from "../billing/component/billing-tabs.vue";
import keysVue from "./keys.vue";
import modelsVue from "./models.vue";
export default {
  data() {
    return {
      tabsCmpList: [modelsVue, keysVue],
      breadcrumbsItems: [
        {
          text: "AI RPC",
          disabled: true,
        },
      ],
    };
  },
  components: {
    BillingTabs,
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .breadcrumbs {
    position: static !important;
  }
  .v-breadcrumbs {
    padding: 0 0 16px 0;
    margin-top: -12px;
  }
}
.breadcrumbs {
  position: fixed;
  top: 0;
  left: 230px;
  z-index: 10;
}
</style>
