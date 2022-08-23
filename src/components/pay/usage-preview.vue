<template>
  <div>
    <e-menu open-on-hover offset-y top>
      <v-icon slot="ref" color="#999" size="14" class="ml-2"
        >mdi-help-circle</v-icon
      >
      <div class="pa-3 bg-white lh-11" style="width: 330px">
        <div
          class="bd-1 bg-f8a pa-3 bdrs-5 fz-14 mb-2"
          v-for="(it, i) in previewList"
          :key="i"
        >
          <div class="bdb-1 pb-3 mb-3">
            <div class="al-c mb-1">
              <span class="gray-7">{{ it.type }}</span>
              <span class="ml-auto"> {{ it.label }}</span>
              <span class="ml-2 color-1">{{ it.value }}</span>
            </div>
          </div>
          <div class="d-flex">
            <div class="ml-auto">
              <span>Price:</span>
              <b class="red-1 fz-16 ml-1">{{ $utils.cutFixed(it.price, 4) }}</b>
              <span class="fz-12 ml-1">USD</span>
            </div>
          </div>
        </div>
        <div class="fz-12 lh-12">
          <p class="mb-3">
            <b class="red-1">*</b>
            <span class="gray-7 ml-2">Charge Standard</span>
          </p>
          <p v-for="(it, i) in list" :key="i">
            <label class="gray d-ib ta-r mr-2" style="min-width: 90px"
              >{{ it.label }}:</label
            >
            <span> {{ it.unitPricePer }} </span>
          </p>
        </div>
      </div>
    </e-menu>
  </div>
</template>

<script>
export default {
  props: {
    previewList: Array,
    list: Array,
  },
};
</script>