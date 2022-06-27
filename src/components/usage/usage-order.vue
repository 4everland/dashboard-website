<template>
  <div class="pa-4">
    <h3>Order</h3>
    <div class="mt-4 fz-14 ov-a" style="max-height: 300px">
      <div
        class="bdrs-8 bd-1 bg-f8a mb-4 pa-4"
        v-for="(it, i) in list"
        :key="i"
      >
        <div class="al-c">
          <div class="flex-1">
            <div class="al-c">
              <span class="gray-7">Content:</span>
              <span class="ml-auto">{{ it.label }}</span>
            </div>
            <div class="al-c mt-1">
              <span class="gray-7">Amount:</span>
              <span class="ml-auto color-1">{{ it.value }} {{ it.unit }}</span>
            </div>
            <div class="al-c mt-1">
              <span class="gray-7">Effective Time:</span>
              <span class="ml-auto">{{ it.until }}</span>
            </div>
          </div>
          <div class="bg-white pa-4 ml-4 bdrs-5">
            <div>Price:</div>
            <div>
              <span class="red-1 fz-22">{{ it.price.toFixed(2) }}</span>
              <span class="ml-2">USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pa-2">
      <e-kv label="Network:" min-width="70px" label-class="gray-7 mt-1">
        <div class="al-c">
          <img
            :src="`img/svg/billing/ic-${payBy.toLowerCase()}.${
              payBy == 'BSC' ? 'png' : 'svg'
            }`"
            height="24"
            class="d-b"
          />
          <span class="ml-3 fz-16">{{ payBy }}</span>
        </div>
        <p class="fz-12 mt-1 gray-7">
          (You can switch the network in the wallet)
        </p>
      </e-kv>
      <e-kv
        label="Support:"
        min-width="70px"
        label-class="gray-7 mt-2"
        class="mt-2"
      >
        <div class="al-c">
          <img src="img/svg/settings/c-usdc.svg" width="24" class="mr-1" />
          <span class="ml-2">USDC</span>

          <div class="ml-auto fz-14 gray-7">
            <span class="">Total price:</span>
            <span class="red-1 fz-20 ml-2">{{ total }}</span>
            <span class="ml-1">USD</span>
          </div>
        </div>
      </e-kv>
    </div>
    <div class="pa-2 mt-1">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    list: Array,
    total: null,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      payBy: (s) => s.payBy,
    }),
  },
  mounted() {},
  methods: {},
};
</script>