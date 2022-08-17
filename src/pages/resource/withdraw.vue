<template>
  <div class="hide-msg">
    <e-kv label="Account Balance" min-width="120px" center>
      <span class="fz-18">{{ balance }}</span>
      <span class="gray-6 fz-13 ml-1">USD</span>
    </e-kv>
    <e-kv2 class="mt-7" label="Deposit Account">
      <v-text-field outlined dense style="width: 240px">
        <span slot="append" class="fz-14 mt-1">USD</span>
      </v-text-field>
    </e-kv2>
    <e-kv2 class="mt-7" label="Address">
      <v-text-field outlined dense style="max-width: 500px"></v-text-field>
    </e-kv2>
    <e-kv2 class="mt-7" label="Network">
      <pay-network :allow="['Polygon']" />
    </e-kv2>
  </div>
</template>

<script>
import mixin from "@/components/pay/mixin";

export default {
  mixins: [mixin],
  mounted() {
    this.getBalance();
  },
};
</script>