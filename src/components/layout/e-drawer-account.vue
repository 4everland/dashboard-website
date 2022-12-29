<style lang="scss">
.account-card {
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  bottom: 0;
  left: 98%;
  width: 220px;
  min-height: 160px;
}
</style>

<template>
  <div class="pos-r" v-click-outside="onOut">
    <div
      class="bg-f9 al-c ma-3 pa-1 hover-1"
      @click="showAccount = !showAccount"
    >
      <span class="mr-auto">{{ showAccount }}</span>
      <v-chip label small color="primary" class="ev-n">Individual</v-chip>
      <img :src="`/img/svg/drawer/up-down.svg`" height="30" class="d-b" />
    </div>
    <div class="pos-a bg-white shadow-1 account-card" v-show="showAccount">
      hhh
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAccount: false,
    };
  },
  methods: {
    onOut() {
      this.showAccount = false;
    },
  },
};
</script>