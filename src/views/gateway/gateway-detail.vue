<template>
  <div>
    <e-tabs :list="list"></e-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { text: "Settings", comp: "gateway-settings" },
        { text: "Allowlists", comp: "gateway-allowlists" },
        { text: "Domains", comp: "gateway-domains" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>