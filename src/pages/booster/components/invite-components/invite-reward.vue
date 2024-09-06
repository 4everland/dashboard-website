<template>
  <div>
    <div class="invite-reward" ref="inviteReward">
      <div class="reward-progress" :style="{ width: list.length * 100 + 'px' }">
        <PointDesc
          class="point-dot"
          v-for="(item, index) in list"
          :key="index"
          :style="{ left: index * 100 + 'px' }"
          v-bind="item"
        ></PointDesc>

        <div
          class="completed-progress"
          :style="{ width: curTaskIdx * 100 + 'px' }"
        ></div>
      </div>
    </div>

    <div class="total-invite mt-4 d-flex align-center justify-space-between">
      <div class="d-flex aling-center">
        <span class="total-text">Total invites</span>

        <ICountUp
          class="total-num ml-2"
          :delay="1000"
          :endVal="inviteInfo.invited"
          :options="{
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.',
            prefix: '',
            suffix: '',
          }"
        />
      </div>
      <v-btn
        class="claim-btn text-center"
        @click="handleBatchClaim"
        :loading="loading"
        :disabled="claimList.length == 0"
        :class="{ disabled: claimList.length == 0 }"
      >
        <div>
          <div class="fz-16">Claim</div>
          <div class="fz-12 claim-text">
            {{ claimText }}
          </div>
        </div>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { fetchInvite_Milestone_Tasks, inviteBatchClaim } from "@/api/booster";
import PointDesc from "./point-desc.vue";
import ICountUp from "vue-countup-v2";
import { mapState } from "vuex";

export default {
  components: { PointDesc, ICountUp },
  data() {
    return {
      list: [
        {
          status: "UNDO",
          inviteCount: "2",
          pointType: "point",
          rewardValue: "300",
        },
        {
          status: "UNDO",
          inviteCount: "5",
          pointType: "point",
          rewardValue: "600",
        },
        {
          status: "UNDO",
          inviteCount: "10",
          pointType: "point",
          rewardValue: "1500",
        },
        {
          status: "UNDO",
          inviteCount: "20",
          pointType: "usdt",
          rewardValue: "0.5",
        },
        {
          status: "UNDO",
          inviteCount: "50",
          pointType: "usdt",
          rewardValue: "0.8",
        },
        {
          status: "UNDO",
          inviteCount: "100",
          pointType: "usdt",
          rewardValue: "5",
        },

        {
          status: "UNDO",
          inviteCount: "300",
          pointType: "usdt",
          rewardValue: "8",
        },
        {
          status: "UNDO",
          inviteCount: "500",
          pointType: "usdt",
          rewardValue: "10",
        },
      ],
      loading: false,
      curTaskIdx: 0,
    };
  },

  computed: {
    ...mapState({
      inviteInfo: (s) => s.moduleBooster.inviteInfo,
    }),
    claimList() {
      return this.list.filter((it) => it.status == "CLAIM");
    },
    claimText() {
      if (this.claimList.length == 0) return "";
      const usdt = this.claimList.reduce((prev, it) => {
        return (prev += it.pointType == "usdt" ? Number(it.rewardValue) : 0);
      }, 0);

      const point = this.claimList.reduce((prev, it) => {
        return (prev += it.pointType == "point" ? Number(it.rewardValue) : 0);
      }, 0);

      let text = "";
      if (point > 0) {
        text += "+" + point;
      }
      if (usdt > 0) {
        text += "+" + usdt;
      }

      return text;
    },
  },
  created() {
    this.getTaskList();
  },
  methods: {
    async getTaskList() {
      try {
        const { data } = await fetchInvite_Milestone_Tasks();
        console.log(data);
        if (data) {
          const list = data.items.map((it, i) => {
            if (it.actStatus == "CLAIM" || it.actStatus == "DONE") {
              this.curTaskIdx = i;
            }
            const descArr = it.description.split(":");
            return {
              status: it.actStatus,
              inviteCount: descArr[0],
              pointType: descArr[1],
              rewardValue: descArr[2],
            };
          });

          this.list = list;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async handleBatchClaim() {
      this.loading = true;
      try {
        const data = await inviteBatchClaim();
        console.log(data);
        this.getTaskList();
        this.$store.dispatch("getBoostUSDTCount");
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },

  watch: {
    list(val, oldVal) {
      if (val.length != oldVal) {
        const completedArr = val.filter(
          (it) => it.status == "DONE" || it.status == "CLAIM"
        );
        this.$refs.inviteReward.scrollTo({
          left: (completedArr.length - 2) * 100,
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-reward {
  height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid #000;
  background: linear-gradient(180deg, #00070c 0%, #074178 113.39%), #121536;
  overflow: auto;
  .reward-progress {
    position: relative;
    margin: 0 12px;
    height: 8px;
    background: #2b364f;
    border-radius: 16px;
    .point-dot {
      position: absolute;
      z-index: 5;
      left: 8px;
      top: -9px;
    }
    .completed-progress {
      z-index: 1;
      position: absolute;
      width: 100%;
      height: 8px;
      left: 0;
      top: 0;
      background: linear-gradient(163deg, #1102fc 2.92%, #0fe1f8 79.4%);
      border-radius: 16px;
      transition: all 1s ease;
    }
  }
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
    letter-spacing: 0;
    padding: 0 24px;
    height: 44px;
    color: #06090f;
    font-weight: 700;
    border-radius: 8px;
    background: linear-gradient(0deg, #fff 0%, #fff 100%),
      linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
    cursor: pointer;
    .claim-text {
      color: #6172f3;
      line-height: 14px;
    }
  }

  .claim-btn.disabled {
    color: rgba(6, 9, 15, 0.5);
    background: linear-gradient(0deg, #eaecf0 0%, #eaecf0 100%),
      linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
  }
}
</style>
