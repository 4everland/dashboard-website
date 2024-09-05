<template>
  <div class="invite-detail d-flex flex-column">
    <div class="invite-reward-content">
      <InviteReward></InviteReward>

      <div class="total-invite mt-4 d-flex align-center justify-space-between">
        <div class="d-flex aling-center">
          <span class="total-text">Total invites</span>
          <span class="total-num ml-2">0</span>
        </div>
        <div class="claim-btn">Claim</div>
      </div>
    </div>
    <div style="margin-top: auto">
      <div class="invite-act d-flex align-center" style="gap: 12px">
        <v-btn class="act-btn flex-1" height="49">
          <span class="mr-2">Share on </span>
          <img src="/img/booster/invite/x.svg" width="16" alt="" />
        </v-btn>

        <v-btn class="act-btn" width="160" height="49">
          <img src="/img/booster/invite/copy.svg" width="24" alt="" />
          <span class="ml-2"> Copy</span>
        </v-btn>
      </div>

      <div class="d-flex justify-center mt-2">
        <div class="invite-tips">
          🎁 you'll earn an additional 5% points reward!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InviteReward from "./invite-reward.vue";
export default {
  components: {
    InviteReward,
  },
};
</script>

<style lang="scss" scoped>
.invite-detail {
  .invite-reward-content {
    padding: 16px;
    border-radius: 16px;
    background: linear-gradient(117deg, #0fe1f8 -21.41%, #1102fc 99.47%);
  }
  .total-invite {
    color: #06090f;
    padding: 8px;
    border-radius: 16px;
    background: linear-gradient(99deg, #ffe205 35.35%, #ffc305 56.77%);
    .total-text {
      font-size: 14px;
      font-weight: 500;
      line-height: 32px; /* 114.286% */
    }
    .total-num {
      font-family: "DIN Alternate";
      font-size: 28px;
      font-weight: 700;
      line-height: 32px; /* 114.286% */
    }
    .claim-btn {
      display: flex;
      padding: 12px 24px;
      color: rgba(6, 9, 15, 0.5);
      font-size: 16px;
      font-weight: 700;
      border-radius: 8px;
      background: linear-gradient(0deg, #eaecf0 0%, #eaecf0 100%),
        linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
      cursor: pointer;
    }
  }

  .invite-act {
    .act-btn {
      font-size: 14px;
      letter-spacing: 0;
      border-radius: 4px;
      color: #fff !important;
      text-shadow: 0px 0px 8px #6172f3;
      border: 1px solid #0e6cc6;
      background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
      box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
        0px 4px 8px 0px rgba(0, 133, 195, 0.25);
    }
  }

  .invite-tips {
    display: inline-block;
    padding: 4px 20px;
    border-radius: 80px;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
