<template>
  <div
    class="operation-bar"
    :style="appDrawer ? 'width:calc(100% - 20px)' : 'width:calc(100% - 276px)'"
  >
    <Transition name="operation" appear>
      <div v-show="isShow" class="content">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
    };
  },
  computed: {
    appDrawer() {
      return this.$vuetify.application.framework.breakpoint.mobile;
    },
  },
};
</script>
<style >
.content .v-btn:first-of-type {
  margin-left: 20px !important;
}
</style>
<style lang="scss" scoped>
.operation-enter-active,
.operation-leave-active {
  transition: opacity 0.5s ease;
}

.operation-enter,
.operation-leave-to {
  opacity: 0;
}
.operation-bar {
  position: fixed;
  z-index: 20;
  right: 0;
  bottom: 0;
  .content {
    display: flex;
    padding-right: 40px;
    flex-wrap: wrap;
    align-items: center;
    background: #f7f9fb;
    border-radius: 6px;
  }
}
</style>