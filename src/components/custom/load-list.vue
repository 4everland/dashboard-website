<template>
  <div>
    <ul class="list" :style="{ height: height }">
      <li v-for="(item, index) in list" :key="item">
        <slot :item="item" :index="index"></slot>
      </li>
    </ul>
    <slot name="load">
      <div class="ta-r mt-4">
        <span
          class="fz-14 cursor-p"
          v-if="list.length > 20"
          @click="handlePackUp"
          >Collapse</span
        >
        <span
          class="ml-6 fz-14 cursor-p"
          v-if="list.length > 20"
          @click="handleLoadMore"
          >Expand</span
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
      default: () => [],
    },
    size: {
      type: Number,
      default: 20,
    },
  },
  computed: {
    page() {
      return Math.ceil(this.list.length / this.size);
    },
  },
  data() {
    return {
      height: 0,
      currentPage: 1,
    };
  },
  methods: {
    handlePackUp() {
      this.currentPage = 1;
    },
    handleLoadMore() {
      if (this.currentPage == this.page) return;
      this.currentPage++;
    },
  },
  watch: {
    currentPage: {
      handler(val) {
        if (
          val == this.page &&
          this.list.length - val * this.size <= this.size
        ) {
          this.height = this.list.length * 50 + "px";
        } else if (this.page == 0) {
          this.height = this.list.length * 50 + "px";
        } else {
          this.height = 50 * this.size * val + "px";
        }
      },
      immediate: true,
    },
    list(val) {
      if (val.length <= 20) {
        this.height = val.length * 50 + "px";
      }
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
.list {
  transition: height 0.7s ease;
  overflow: hidden;
}
</style>