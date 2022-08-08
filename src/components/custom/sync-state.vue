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
  color: #fff;
  font-size: 12px;
  padding: 5px 20px;
  border: none;

  border-radius: 5px;
  &.desynced {
    background: #e6e8eb;
    color: #6c7789;
  }
  &.synced {
    background: #00bd9a;
  }
  &.syncing {
    background: #34a9ff;
  }
  &.timeout {
    background: #f99536;
  }
  &.failure {
    background: #ff6960;
  }
}
</style>