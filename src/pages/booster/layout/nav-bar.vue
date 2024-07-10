<template>
  <div class="nav-bar">
    <div class="nav d-flex align-center">
      <div class="logo d-flex align-center">
        <img src="/img/booster/svg/logo.svg" width="157" alt="" />
      </div>

      <div class="router-link d-flex align-center">
        <div class="router-item">Home</div>
        <div class="router-item">Elite Quest</div>
        <div class="router-item">Leaderboard</div>
      </div>

      <div class="flex-1"></div>

      <div class="user-info">0xDD3..33e38</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.nav-bar {
  z-index: 999;
  position: fixed;
  width: 100%;
  top: 24px;
  .nav {
    height: 48px;
    margin: 0 24px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.05) 100%
      ),
      rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    > div {
      height: 100%;
    }
    .logo {
      padding: 0 59px 0 24px;
    }

    .router-link {
      border-left: 1px solid rgba(255, 255, 255, 0.25);

      .router-item {
        padding: 16px 0;
        width: 128px;
        text-align: center;
        border-right: 1px solid rgba(255, 255, 255, 0.25);
        line-height: 16px;
        box-sizing: border-box;
      }

      .router-item:hover {
        // background: url("/img/booster/svg/link-hover.svg") no-repeat;
        background: linear-gradient(270deg, #fff, #fff) 0 0 no-repeat,
          linear-gradient(180deg, #fff, #fff) 0 0 no-repeat,
          linear-gradient(270deg, #fff, #fff) 100% 0 no-repeat,
          linear-gradient(180deg, #fff, #fff) 100% 0 no-repeat,
          linear-gradient(270deg, #fff, #fff) 0 100% no-repeat,
          linear-gradient(180deg, #fff, #fff) 0 100% no-repeat,
          linear-gradient(270deg, #fff, #fff) 100% 100% no-repeat,
          linear-gradient(270deg, #fff, #fff) 100% 100% no-repeat;
        background-size: 1px 8px, 8px 1px, 1px 8px, 8px 1px;
      }
    }

    .user-info {
      border-left: 1px solid rgba(255, 255, 255, 0.25);
    }
  }
}
</style>
