<template>
  <div class="register-share-container pos-a">
    <v-dialog v-model="showDialog" max-width="1000" hide-overlay>
      <div class="share-container pos-r">
        <div class="pos-a share-content">
          <div class="wallet-input line-1 fz-14 gray">
            0x2323rsadasf34234234234234qasdasdassdasdasdasdas
          </div>
          <div class="fz-14 mt-6 white-0">
            Congratulations on successfully minting 4EVERLAND's on-chain
            identity Enjoy more resources and enter the decentralized world of
            Web3
          </div>
          <div class="ta-c mt-3">
            <v-btn color="primary">Share</v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
    <e-animation-flowers ref="flowers"></e-animation-flowers>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
    };
  },
  watch: {
    showDialog(val) {
      if (val) {
        this.$refs.flowers.showAnimation();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.register-share-container {
  left: 0;
  top: 0;
  height: 100vh;
  width: 100%;
  pointer-events: none;
}
.share-container {
  background: url("/img/bg/share/share_bg.png") center/cover no-repeat;
  height: 500px;
  width: 100%;
  .share-content {
    left: 50%;
    top: 50%;
    width: 400px;
    transform: translate(-50%, -50%);
  }
  .wallet-input {
    width: 350px;
    padding: 10px;
    margin: 50px auto 0;
    border-radius: 6px;
    background: #fff;
  }
}
</style>