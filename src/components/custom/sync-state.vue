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
    color: #28aa91;
  }
  &.syncing {
    color: #0f8dff;
  }
  &.timeout {
    color: #ff8843;
  }
  &.failure {
    color: #ff5b60;
  }
}
</style>