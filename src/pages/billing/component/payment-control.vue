<template>
  <div>
    <div class="submit-control pa-4"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    isApproved() {
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.submit-control {
  border-radius: 8px;
  background: #f3e8ff;
}
</style>
