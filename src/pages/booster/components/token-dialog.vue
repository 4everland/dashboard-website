<template>
  <div class="token-dialog">
    <v-dialog persistent v-model="showTokenDialog" width="327">
      <div class="token-dialog-content px-4 py-9">
        <div class="token-title">$4EVER token</div>
        <ul>
          <li>
            Over 3 years development, 2 round of financing, $4EVER is comming.
          </li>
          <li>Grab $4EVER points and harvest $4EVER token.</li>
          <li>Stay tuned, won't be long.</li>
        </ul>

        <div class="partner-container">
          <img src="/img/booster/svg/token-banner.svg" width="100%" alt="" />
        </div>

        <div></div>

        <div class="boost-btn">
          <img src="/img/booster/svg/lightning.svg" width="20" alt="" />
          <span>Boost your earn</span>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTokenDialog: true,
    };
  },
};
</script>

<style lang="scss" scoped>
.token-dialog-content {
  color: #fff;
  border-radius: 16px;
  border: 1px solid #1aa6ff;
  background: linear-gradient(
      180deg,
      rgba(17, 2, 252, 0.15) 28.41%,
      rgba(15, 225, 248, 0) 100%
    ),
    linear-gradient(180deg, #000a10 8.53%, #003e70 99.59%), rgba(5, 5, 5, 0.8);

  .token-title {
    margin-bottom: 32px;
    font-style: italic;
    font-size: 24px;
    font-weight: 700;
  }
  ul,
  li {
    font-size: 12px;
    list-style: disc;
    color: #0fe1f8;
    font-weight: 500;
  }
  .partner-container {
    margin-top: 13px;
    width: 100%;
  }

  .boost-btn {
    display: flex;
    padding: 12px 24px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-weight: bold;
    border-radius: 16px;
    background: linear-gradient(100deg, #dc33d6 0%, #ff3821 100%),
      linear-gradient(129deg, #0fe1f8 2.4%, #1102fc 69.3%),
      linear-gradient(180deg, #00070c 0%, #074178 113.39%);
  }
}
</style>
