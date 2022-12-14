<template>
  <div>
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <slot :item="item"></slot>
      </li>
    </ul>
    <slot name="load">
      <div class="ta-r mt-4">
        <span class="fz-14" v-if="list.length > 20" @click="$emit('packUp')"
          >Pack Up</span
        >
        <span
          class="ml-6 fz-14"
          v-if="list.length >= 20"
          @click="$emit('loadMore')"
          >Load More</span
        >
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [1, 2, 3, 4, 5, 6],
    },
  },
};
</script>

<style lang="scss" scoped>
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>