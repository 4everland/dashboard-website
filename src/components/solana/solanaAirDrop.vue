<template>
  <div v-show="dialogFormVisible" id="solanaBox">
    <div class="solana-con">
      <div class="btn-box">
        <v-btn class="solana-ok" color="#2DABFF" rounded @click="cancel"
          >OK</v-btn
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
    };
  },
  methods: {
    getSolanaAirDrop() {
      this.dialogFormVisible = true;
    },
    cancel() {
      this.dialogFormVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
#solanaBox {
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99999999;
  background-color: rgba(33, 33, 33, 0.45);
  .solana-con {
    width: 450px;
    height: 657px;
    background-image: url("/img/bg/solana/bg.png");
    background-size: contain;
    background-color: transparent;
    position: absolute;
    left: 0;
    right: 0;
    top: -60px;
    bottom: 0;
    margin: auto;
    .btn-box {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 20px;
      text-align: center;
      .solana-ok {
        color: #fff;
        width: 250px;
      }
    }
  }
}
</style>
