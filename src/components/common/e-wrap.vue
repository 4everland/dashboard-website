<template>
  <div :class="wrapCls || 'wrap-1'">
    <div :class="conCls || ''">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    wrapCls: String,
    conCls: String,
  },
};
</script>

<style lang="scss">
.wrap-0 {
  padding: 40px 0;
}
.wrap-1 {
  padding: 20px 20px;
}

.con-1 {
  max-width: 1200px;
  margin: 0 auto;
}
.con-2 {
  max-width: 970px;
  margin: 0 auto;
}
.con-3 {
  max-width: 860px;
  margin: 0 auto;
}
</style>