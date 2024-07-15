<template>
  <div class="elite-quest-container">
    <div>
      <h3 class="tit">Elite Quest</h3>
      <div class="desc">
        Check the campaign details, complete the corresponding tasks, and earn
        points!
      </div>
    </div>
    <div class="quest-list d-flex flex-column flex-md-row align-center mt-6">
      <div v-for="(item, i) in 4" :key="i" class="quest">
        <div class="pa-6">
          <img src="/img/booster/elite-quest/bg1.png" width="100%" alt="" />
        </div>
        <div class="pa-6 content">
          <h3 class="tit">BNB CHAIN AIRDROP ALLIANCE PROGRAM</h3>
          <div class="desc my-3 fz-14">
            The BNB Chain Airdrop Alliance Program serves as a gesture of
            gratitude towards the supportive BNB Chain community. Through this
            program, 4EVERLAND is partnering with BNB Chain to introduce
            exclusive rewards for retroactive users on BNB Smart Chain (BSC) and
            opBNB.
          </div>
          <div
            class="quest-act d-flex align-center justify-space-between fz-14"
          >
            <div class="reward">Shared Reward of 15 Million Points</div>
            <div class="act-btn">Let's go</div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quests: [],
    };
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .quest-list {
    gap: 12px;
  }
}
.elite-quest-container {
  padding: 96px 24px;
  background: #000;
  position: relative;
  width: 100%;
  height: 100%;
  .tit {
    font-size: 24px;
  }
  .desc {
    color: rgba(255, 255, 255, 0.6);
  }

  .quest-list {
    .quest {
      border: 1px solid rgba(255, 255, 255, 0.25);
      .content {
        border-top: 1px solid rgba(255, 255, 255, 0.25);

        .tit {
          font-size: 18px;
        }
        .desc {
          color: #f1f5f9;
          line-height: 23.8px; /* 170% */
        }
      }
      .quest-act {
        .reward {
          color: #ffce56;
        }
        .act-btn {
          white-space: nowrap;
          padding: 6px 18px;
          border-radius: 4px;
          background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
          box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
