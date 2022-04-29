<style lang="scss">
.usage-more {
  label {
    width: 100px;
  }
}
</style>

<template>
  <div class="usage-more">
    <div
      class="bd-1 pa-6 mb-6 bdrs-10 d-flex al-c"
      v-for="(it, i) in list"
      :key="i"
    >
      <label class="fz-15 ta-r mr-3">{{ it.label }}:</label>
      <usage-input v-model="form[it.key]" :min="100" :max="10000" :step="100" />
      <span class="ml-3 fz-14">{{ it.unit }}</span>
      <div class="ml-5">
        <v-btn
          @click="$set(form, it.key, txt)"
          class="mr-3 scale-9 tr-origin-0 op-7"
          outlined
          rounded
          color="primary"
          x-small
          v-for="txt in [200, 500, 1000]"
          :key="txt"
          >{{ txt }}</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
const list = [
  {
    label: "Bandwidth",
    desc: "（Need to enter an integer multiple of 100.）",
    key: "bandwidth",
    unit: "GB",
  },
  {
    label: "Storage IPFS",
    key: "ipfs",
    unit: "GB",
  },
  {
    label: "Storage AR",
    key: "ar",
    unit: "MB",
  },
  {
    label: "Build Minutes",
    key: "buildMinutes",
    unit: "Minutes",
  },
];
export default {
  data() {
    const form = {};
    list.forEach((it) => {
      form[it.key] = 100;
    });
    return {
      form,
      list,
    };
  },
};
</script>