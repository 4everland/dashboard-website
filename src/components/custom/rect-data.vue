<style lang="scss">
%rect-item-line {
  content: "";
  position: absolute;
  background: #e6e8eb;
}
.rect-data {
  .item {
    $gap: 10px;
    $line: 36px;
    position: relative;
    padding: 15px 0;
    &:first-of-type {
      &:after {
        @extend %rect-item-line;
        right: 0;
        bottom: $gap;
        height: $line;
        width: 1px;
      }
      &::before {
        @extend %rect-item-line;
        right: $gap;
        bottom: 0;
        height: 1px;
        width: $line;
      }
    }
    &:last-of-type {
      &:after {
        @extend %rect-item-line;
        left: 0;
        top: $gap;
        height: $line;
        width: 1px;
      }
      &::before {
        @extend %rect-item-line;
        left: $gap;
        top: 0;
        height: 1px;
        width: $line;
      }
    }
  }
}
</style>

<template>
  <v-row class="rect-data bd-1 bdrs-5" v-if="list">
    <v-col cols="6" class="item" v-for="(it, i) in resList" :key="i">
      <div class="ta-c" v-if="it.title">
        <p class="fz-14 gray-6">{{ it.title }}</p>
        <div>
          <b
            class="fz-20"
            :style="{
              color: it.numColor || '#3656a5',
            }"
          >
            {{ it.num || 0 }}</b
          >
          <span class="ml-1 fz-13" v-if="it.unit">{{ it.unit }}</span>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    list: Array,
  },
  computed: {
    resList() {
      const list = [...this.list];
      if (list.length % 2 != 0) list.push({});
      return list;
    },
  },
};
</script>