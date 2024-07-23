<template>
  <div>
    <v-bottom-sheet v-model="sheet">
      <div class="sheet-content">
        <div class="user-card" v-show="!showLog">
          <div class="user-card-item fz-12">
            <div class="user-card-item-title">Total $4EVER points</div>
            <div class="linear-border mb-1"></div>
            <div class="user-card-item-content">
              <div
                class="content-rate d-flex align-center justify-space-between"
              >
                <img src="/img/booster/svg/union.svg" width="52" alt="" />
                <div>
                  <span>{{ boosterInfo.totalPoint }}</span>
                  <img
                    @click="showLog = true"
                    class="ml-1"
                    width="16"
                    src="/img/booster/svg/log.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="user-card-item fz-12 mt-2">
            <div class="user-card-item-title">Current Production Rate</div>
            <div class="linear-border mb-1"></div>
            <div class="user-card-item-content">
              <div
                class="content-rate d-flex align-center justify-space-between"
              >
                <img src="/img/booster/svg/union.svg" width="52" alt="" />
                <div>{{ totalRate }}/H</div>
              </div>
              <div class="content-detail pt-2 fz-12">
                <div class="d-flex align-center justify-space-between">
                  <span>Base Production Rate</span>
                  <span>{{ baseRate }}/H</span>
                </div>
                <div class="d-flex align-center justify-space-between mt-1">
                  <span>Boost Production Rate</span>
                  <span>+{{ boostRate }}/H</span>
                </div>
                <div class="d-flex align-center justify-space-between mt-1">
                  <span>Staking Weight</span>
                  <span>{{ boosterInfo.rateBuff }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="showLog">
          <img
            class="mb-4"
            src="/img/booster/svg/back-arrow.svg"
            width="24"
            alt=""
            @click="showLog = false"
          />

          <div class="log-list">
            <div
              class="log-item mb-6 d-flex align-center justify-space-between"
              v-for="(it, i) in logs"
              :key="i"
            >
              <div style="width: 250px">{{ it.text }}</div>
              <div>{{ it.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      sheet: false,
      showLog: false,
      logs: [
        {
          text: "I claimed 100 points.",
          time: "2024-06-12 17:33",
        },
        {
          text: "0x223 claimed 100 points and received a 10-point commission.",
          time: "2024-06-12 17:33",
        },
        {
          text: "I helped 0x222 claim points and received a 10-point commission.",
          time: "2024-06-12 17:33",
        },
        {
          text: "I won 100 points in the raffle.",
          time: "2024-06-12 17:33",
        },
        {
          text: "0x223 claimed 100 points and received a 10-point commission.",
          time: "2024-06-12 17:33",
        },
        {
          text: "I claimed 100 points.",
          time: "2024-06-12 17:33",
        },
        {
          text: "0x223 claimed 100 points and received a 10-point commission.",
          time: "2024-06-12 17:33",
        },
        {
          text: "I helped 0x222 claim points and received a 10-point commission.",
          time: "2024-06-12 17:33",
        },
        {
          text: "I won 100 points in the raffle.",
          time: "2024-06-12 17:33",
        },
        {
          text: "0x223 claimed 100 points and received a 10-point commission.",
          time: "2024-06-12 17:33",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
    }),
    ...mapGetters(["boostLocked", "baseRate", "boostRate"]),
    totalRate() {
      return (
        (this.baseRate + this.boostRate) * (1 + this.boosterInfo.rateBuff / 100)
      );
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.sheet-content {
  height: 600px;
  padding: 24px 16px;
  color: #fff;
  background: linear-gradient(0deg, #4c5277 0%, #4c5277 100%),
    linear-gradient(
      180deg,
      rgba(57, 59, 62, 0.9) 25.52%,
      rgba(36, 39, 42, 0.9) 100%
    );
  background-blend-mode: overlay, normal;
  backdrop-filter: blur(19.75px);

  .user-card {
    .user-card-item {
      .user-card-item-content {
        padding: 4px 16px;
        background: linear-gradient(
          90deg,
          rgba(97, 114, 243, 0.05) 0%,
          rgba(97, 114, 243, 0.5) 100%
        );
        backdrop-filter: blur(2px);

        .content-rate {
          font-family: "DIN Alternate";
          font-size: 20px;
          font-weight: 700;
        }
        .content-detail {
          border-top: 1px solid rgba(164, 188, 253, 0.25);
        }
      }
    }
  }

  .log-list {
    height: 500px;
    font-size: 14px;
    overflow: auto;
  }
}
</style>
