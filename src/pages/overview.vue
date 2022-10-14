<style lang="scss">
.ov-wrap-1 {
  padding: 30px 20px;
}
</style>

<template>
  <div>
    <e-right-opt-wrap>
      <v-btn color="primary" to="/bucket/storage/?new=bucket">
        <span class="fz-18">+</span>
        <span class="ml-1"> New Bucket </span>
      </v-btn>
      <v-btn color="primary" class="ml-5" to="/hosting/new">
        <span class="fz-18">+</span>
        <span class="ml-1"> New Project </span>
      </v-btn>
    </e-right-opt-wrap>

    <v3-usage />

    <div class="mt-3">
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v3-uv />
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v3-stor />
          </v-card>
        </v-col>
      </v-row>

      <v-card class="mt-5">
        <v3-req />
      </v-card>
    </div>
    <new-user-tips />
  </div>
</template>

<script>
import { isAirDrop } from "@/plugins/flow/flowAirDrop.js";

export default {
  mounted() {
    isAirDrop();
  },
};
</script>