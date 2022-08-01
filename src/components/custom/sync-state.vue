<template>
  <span class="sync-state" :class="val" v-if="val">
    {{ val.capitalize() }}
  </span>
</template>

<script>
export default {
  props: {
    val: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
.sync-state {
  text-transform: capitalize;
  color: #7e8ea8;
  &.synced {
    color: #00bd9a;
  }
  &.syncing {
    color: #775da6;
  }
  &.timeout {
    color: #f99536;
  }
  &.failure {
    color: #ff6960;
  }
}
</style>