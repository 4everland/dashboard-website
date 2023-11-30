<template>
  <div class="tips-container" v-if="showTips">
    <div class="h-flex al-end" v-show="isOpen">
      <img
        class="cursor-p"
        :src="noticeText"
        @click="handleShowDialog"
        alt=""
      />
      <img
        @click="isOpen = !isOpen"
        class="cursor-p"
        width="70"
        src="/img/svg/rewardHub/notice-open.svg"
        alt=""
      />
    </div>

    <div class="h-flex al-end pos-r" v-show="!isOpen" @click="isOpen = !isOpen">
      <img
        class="cursor-p pos-a"
        style="top: -23px; left: -42px"
        src="/img/svg/rewardHub/notice-close1.svg"
        alt=""
      />
      <img
        class="cursor-p"
        width="70"
        src="/img/svg/rewardHub/notice-close.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      isOpen: true,
    };
  },
  computed: {
    ...mapState({
      firstRecharge: (s) => s.moduleResource.firstRecharge,
      onChain: (s) => s.onChain,
    }),

    noticeText() {
      if (this.onChain) return "/img/svg/rewardHub/notice-open1.svg";
      return "/img/svg/rewardHub/notice-open2.svg";
    },
    showTips() {
      if (this.$route.path !== "/overview") return false;
      return !this.firstRecharge || !this.onChain;
    },
  },
  methods: {
    handleShowDialog() {
      if (this.onChain) {
        this.$emit("showFirstRecharge");
      } else {
        this.$emit("showDialog");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tips-container {
  z-index: 100;
  position: fixed;
  right: 50px;
  bottom: 50px;
}
</style>
