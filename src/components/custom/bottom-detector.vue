<template>
  <div style="text-align: center">
    <!-- <div v-if="loadingMore">loading...</div> -->
    <!-- <div v-if="noMore">no more</div> -->
  </div>
</template>
<script>
import debounce from "../../plugins/debounce";
export default {
  props: {
    loadingMore: {
      type: Boolean,
      required: true,
    },
    distance: {
      type: Number,
      default: 0,
    },
    noMore: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    window.addEventListener("scroll", () => {
      debounce(this.listenBottomOut);
    });
    this.element = document.documentElement;
  },
  destroyed() {
    window.removeEventListener("scroll", this.listenBottomOut, false);
  },
  data() {
    return {
      element: null,
    };
  },
  methods: {
    listenBottomOut() {
      if (this.noMore || this.loadingMore) return;
      let scrollTop = this.element.scrollTop || document.body.scrollTop;
      let clientHeight = this.element.clientHeight;
      let scrollHeight = this.element.scrollHeight;
      if (scrollTop + clientHeight >= scrollHeight - this.distance) {
        this.$emit("arriveBottom");
      }
    },
  },
};
</script>

