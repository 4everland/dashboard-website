<template>
  <v-card class="no-register-container pa-5" v-if="onChain == false">
    <label for="check" class="pos-a">
      <img width="16" src="/img/svg/overview/notice.svg" alt="" />
    </label>
    <input type="checkbox" id="check" class="check-box" />
    <div class="ml-8 fz-14 text">
      You still have an outstanding benefit to claim, go ahead and claim it now
    </div>
  </v-card>
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
  methods: {
    onShowText() {
      this.showText = !this.showText;
    },
  },
};
</script>

<style lang="scss" scoped>
.no-register-container {
  z-index: 999;
  position: fixed;
  width: 50px;
  height: 80px;
  right: 50px;
  bottom: 50px;
  border-radius: 10px;
  background: #fff;
  align-items: flex-start;
  overflow: hidden;
  transition: width 0.5s ease-out;
}
.text {
  width: 230px;
  transform: translateX(100px);
  transition: all 0.5s ease-out;
}
.check-box {
  display: none;
}
.check-box:checked + .text {
  transform: translateX(0);
}
.no-register-container:has(.check-box:checked) {
  width: 300px;
}
</style>