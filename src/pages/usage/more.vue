<style lang="scss">
.usage-more {
  label {
    width: 100px;
  }
}
</style>

<template>
  <div class="usage-more">
    <div class="bd-1 pa-6 mb-6 bdrs-10 d-flex" v-for="(it, i) in list" :key="i">
      <label class="fz-15 ta-r mr-3 mt-1">{{ it.label }}:</label>
      <usage-input v-model="form[it.key]" :min="100" :max="10000" :step="100" />
    </div>
  </div>
</template>

<script>
const list = [
  {
    label: "Bandwidth",
    desc: "（Need to enter an integer multiple of 100.）",
    key: "bandwidth",
  },
  {
    label: "Storage IPFS",
    key: "ipfs",
  },
  {
    label: "Storage AR",
    key: "ar",
  },
  {
    label: "Build Minutes",
    key: "buildMinutes",
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