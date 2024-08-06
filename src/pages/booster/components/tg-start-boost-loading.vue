<template>
  <div class="tg-start-boost-loading">
    <dotlottie-player
      src="https://lottie.host/0fcf9393-b0fc-4f31-9d06-fa0896d3bdc6/dkjFgkEUlS.json"
      background="transparent"
      speed="1"
      style="width: 400px; height: 206px"
      loop
      autoplay
    ></dotlottie-player>
    <div class="pb-4">LOADING...</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.tg-start-boost-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
</style>
