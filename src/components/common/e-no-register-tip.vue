<template>
  <div
    class="tips-container"
    v-if="$route.path != '/login' && onChain == false"
  >
    <div class="h-flex al-end" v-if="isOpen">
      <img
        class="cursor-p"
        src="/img/svg/rewardHub/notice-open1.svg"
        @click="$router.push('/account/config')"
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

    <div class="h-flex al-end pos-r" v-else @click="isOpen = !isOpen">
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
      onChain: (s) => s.onChain,
    }),
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
