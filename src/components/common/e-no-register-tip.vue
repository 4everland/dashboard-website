<template>
  <v-card class="no-register-container pa-5 d-flex" v-if="onChain == false">
    <v-icon size="18" class="mt-1">mdi-bell-outline</v-icon>
    <span class="ml-3 fz-14"
      >You still have an outstanding benefit to claim, go ahead and claim it
      now</span
    >
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      onChain: (s) => s.onChain,
    }),
  },
};
</script>

<style lang="scss" scoped>
.no-register-container {
  z-index: 999;
  position: fixed;
  width: 20vw;
  right: 50px;
  bottom: 50px;
  border-radius: 30px;
  background: #fff;
  align-items: flex-start;
}
</style>