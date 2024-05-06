<template>
  <div
    class="airdrop-header al-c space-btw"
    :class="{ transparent: scrollTop == 0 }"
  >
    <a href="/" class="d-b">
      <img
        :src="`/img/airDrop/airdrop-logo.svg`"
        height="26"
        class="d-b m-auto"
      />
    </a>

    <e-team-avatar
      class="cursor-p mr-2"
      v-if="userInfo.uid"
      :src="userInfo.avatar"
      :size="30"
      :uid="userInfo.uid"
    ></e-team-avatar>
    <v-btn v-else style="color: #fff" color="#039CFF" @click="onLogin"
      >Login</v-btn
    >
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    scrollTop: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
  },
  methods: {
    onLogin() {
      localStorage.loginTo = "/airdrop";
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
.airdrop-header {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 12px 48px;
  background: #111214;
  transition: all 0.4s ease;
}
.airdrop-header.transparent {
  background: transparent;
}
@media screen and (max-width: 768px) {
  .airdrop-header {
    padding: 12px 16px !important;
  }
}
</style>
