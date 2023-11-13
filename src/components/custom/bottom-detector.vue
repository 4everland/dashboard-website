<template>
  <div class="mt-3 ta-c">
    <div class="wavy" v-if="loadingMore">
      <span style="--i: 1">L</span>
      <span style="--i: 2">o</span>
      <span style="--i: 3">a</span>
      <span style="--i: 4">d</span>
      <span style="--i: 5">i</span>
      <span style="--i: 6">n</span>
      <span style="--i: 7">g</span>
      <span style="--i: 8">.</span>
      <span style="--i: 9">.</span>
      <span style="--i: 10">.</span>
    </div>
    <div v-show="noMore" class="fz-14">No More</div>
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
<style scoped>
.wavy {
  position: relative;
  /* -webkit-box-reflect: below -12px linear-gradient(transparent, rgba(0, 0, 0, 0.2)); */
}
.wavy span {
  position: relative;
  display: inline-block;
  color: #000;
  font-size: 14px;
  letter-spacing: 2px;
  animation: wavyAnimate 1s ease-in-out infinite;
  animation-delay: calc(0.1s * var(--i));
}
@keyframes wavyAnimate {
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-10px);
  }
  40%,
  100% {
    transform: translateY(0);
  }
}
</style>
