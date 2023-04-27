<template>
  <div class="tips-container">
    <label for="check" class="pos-a check-box-label cursor-p">
      <img width="40" src="/img/svg/rewardHub/notice.svg" alt="" />
    </label>
    <input type="checkbox" id="check" class="check-box" />
    <div
      class="fz-14 cursor-p no-register-container ta-c"
      @click="$router.push('/reward-hub')"
      v-if="onChain == false"
    >
      <div class="text">
        You still have an outstanding benefit to claim, go ahead and claim it
        now.
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from "vuex";
export default {
  date() {
    return {
      showText: false,
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
  z-index: 999;
  position: fixed;
  width: 50px;
  right: 50px;
  bottom: 50px;
}

.no-register-container {
  z-index: 99;
  position: fixed;
  right: 50px;
  bottom: 50px;
  padding: 20px;
  width: 300px;
  border-radius: 10px;
  background: #f2eefc;
  border-image: linear-gradient(
      90deg,
      rgba(172, 148, 224, 1),
      rgba(165, 135, 224, 1),
      rgba(159, 127, 218, 1)
    )
    3 3;
  transition: all 0.3s ease-out;
  overflow: hidden;
  border: 3px solid #a587e0;
}
.text {
  width: 260px;
}
.check-box-label {
  z-index: 100;
  right: -20px;
  bottom: -20px;
}
.check-box {
  display: none;
}
.check-box:checked + .no-register-container {
  width: 0px;
  height: 0;
  padding: 0;
}
.check-box:checked + .no-register-container .text {
  display: none;
}
</style>