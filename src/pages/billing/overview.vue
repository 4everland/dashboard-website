<template>
  <div class="billing-container pa-5">
    <div class="plan-container">
      <h3 class="mb-5 fz-22">Plan</h3>

      <v-row class="bd-1 pa-5">
        <v-col cols="12" xl="6">
          <div class="plan-info pa-5 bdrs-4">
            <div>
              <h3 class="fz-22">Plan Title</h3>
            </div>
            <e-kv label="IPFS Storage" class="mt-6"> 123 </e-kv>
            <e-kv label="Arweave" class="mt-2"> 123 </e-kv>
            <e-kv label="Band Width" class="mt-2"> 123 </e-kv>
            <e-kv label="Build Mintus" class="mt-2"> 123 </e-kv>

            <div class="plan-expired al-c space-btw mt-6 fz-14">
              <div>
                <span>Next Resource Time: </span>
                <span class="ml-4">June 24, 2023</span>
              </div>
              <div>
                <span>Period of validity:</span>
                <span class="ml-4">Forever</span>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" xl="6">
          <resource-progress
            title="IPFS"
            :used-resource="100"
            :total-resource="300"
          ></resource-progress>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import resourceProgress from "./component/resource-progress.vue";

export default {
  components: {
    resourceProgress,
  },
};
</script>

<style lang="scss" scoped>
.plan-info {
  background: #ccc;
}
</style>
