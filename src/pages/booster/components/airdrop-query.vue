<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="airdrop-boost-dialog"
      :value="value"
      overlay-opacity="0.9"
      overlay-color="black"
      persistent
    >
      <div class="airdrop-dialog">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="20"
          alt=""
        />
        <div class="airdrop-header">
          <img
            class="head-img"
            src="/img/booster/earnings/airdrop-head.png"
            width="295"
            alt=""
          />
          <div class="airdrop-title d-flex justify-space-between align-center">
            <div class="mr-3">
              <div>Airdrop Query</div>
              <div class="title-border"></div>
            </div>
            <div class="user d-flex justify-center align-center">
              <div>
                <e-team-avatar
                  :src="userInfo.avatar"
                  :size="24"
                  :uid="userInfo.uid"
                ></e-team-avatar>
              </div>
              <div class="user-name">{{ (userInfo.username || "unkown").cutStr(4, 4) }}</div>
            </div>
          </div>
        </div>
        <div class="airdrop-content">
          <div v-for="(item, index) in dataList" :key="index" v-if="item.status" :class="{'queryItem': item.status !=0}">
            <div class="d-flex justify-space-between">
              <div class="list-left">
                <div class="list-title">{{ item.title }}</div>
                <div class="list-text mb-1">{{ item.subtitle }}</div>
              </div>
              <div class="list-right">
                <img
                  v-if="item.status === 1"
                  class="imgLoading"
                  src="/img/booster/earnings/waiting-icon.png"
                  width="24"
                  alt=""
                />
                <img
                  v-if="item.status === 2"
                  src="/img/booster/earnings/completed.png"
                  width="24"
                  alt=""
                />
                <img
                  v-if="item.status === 3"
                  src="/img/booster/earnings/x-circle.png"
                  width="24"
                  alt=""
                />
              </div>
            </div>
            <img
              class="mb-1"
              style="width: 100%"
              src="/img/booster/earnings/diver-dark.png"
              height="9"
              alt=""
            />
          </div>
          <div v-if="showPoint">
            <div class="d-flex justify-center">
              <div class="light-btn d-flex justify-center align-center">
                <div class="light-span">
                  <v-btn class="submit-btn">
                    <span class="number">
                      <ICountUp
                        class="points"
                        :delay="1000"
                        :endVal="shortPoint"
                        :options="{
                          useEasing: true,
                          useGrouping: true,
                          decimalPlaces: 0,
                          separator: ',',
                          decimal: '.',
                          prefix: '',
                          suffix: '',
                        }"
                      />
                    </span>
                    <span class="btn-text">4EVER</span>
                  </v-btn>
                </div>
              </div>
            </div>
            <v-btn class="share-btn">
              <span class="btn-text">Share to X</span>
            </v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import { bus } from "@/utils/bus";
import { mapGetters, mapState } from "vuex";
import ICountUp from "vue-countup-v2";
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      showPoint: false,
      shortPoint: 10000,
      dataList: [
        {
          title: "Staked T4EVER Token",
          subtitle: "The amount of T4EVER staked.",
          status: 0,
        },
        {
          title: "Have $4EVER Points",
          subtitle: "The $4EVER Points you've earned.",
          status: 0,
        },
        {
          title: "Product Interaction",
          subtitle: "Engaged with 4EVERLAND products prior to ",
          status: 0,
        },
        {
          title: "On-chain Interaction",
          subtitle: "Performed on-chain interaction prior to xxx.",
          status: 0,
        },
        {
          title: "Gitcoin Donation",
          subtitle: "Made a donation to 4EVERLAND on Gitcoin.",
          status: 0,
        },
      ]
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    })
  },
  mounted() {
    bus.$on("showQueryDialogEvent", () => {
      this.handleListStatus();
    });
  },
  methods: {
    async handleListStatus() {
      for (const item of this.dataList) {
        await this.$sleep(2000);
        item.status = 1;
        await this.$sleep(2000);
        item.status = 2;
      }
      this.showPoint = true;

    },
  },
  components: {
    ICountUp
  },
};
</script>

<style lang="scss" src="../spin.scss"></style>
<style lang="scss" scoped>
::v-deep .airdrop-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}

.airdrop-dialog {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 36px 16px;
  border-radius: 16px;
  .close-btn {
    position: absolute;
    right: 18px;
    top: 0;
    cursor: pointer;
  }
  .airdrop-header {
    width: 295px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    .airdrop-title {
      position: absolute;
      top: 20px;
      left: 0;
      width: 100%;
      padding: 0 12px;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
      text-align: left;
      color: #fff;
      text-shadow: 0px 0px 8px #ffffff80;
      .title-border {
        width: 24px;
        height: 4px;
        background: #fff;
        margin-top: 8px;
      }
      .user {
        padding: 4px 8px;
        border-radius: 8px;
        background: #00000080;
        .user-name {
          font-size: 12px;
          font-weight: 700;
          line-height: 16px;
          margin-left: 8px;
        }
      }
    }
  }
  .airdrop-content {
    width: 327px;
    height: 521px;
    margin: 0 auto;
    top: 72px;
    padding: 24px 16px;
    gap: 24px;
    border-radius: 16px;
    margin-top: -7px;
    background: linear-gradient(179.52deg, #000a10 8.53%, #003e70 99.59%),
      linear-gradient(
        180deg,
        rgba(17, 2, 252, 0.15) 28.41%,
        rgba(15, 225, 248, 0) 100%
      );

    border: 1px solid;
    border-image-source: linear-gradient(
      165.76deg,
      rgba(69, 81, 111, 0.5) -11.63%,
      #11b7ff 88.45%
    );
    border-image-slice: 1;
    .list-title {
      font-size: 14px;
      font-weight: 700;
      line-height: 16px;
      color: #ffffff;
    }
    .list-title2 {
      font-size: 14px;
      font-weight: 700;
      line-height: 16px;
      color: #0fe1f8;
    }
    .list-text {
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: #ffffffbf;
    }
    .list-right {
      position: relative;
      top: 16px;
      right: 12px;
    }
    .submit-btn {
      width: 286px;
      height: 53px;
      border-radius: 16px;
      padding: 0 !important;
      .number {
        font-family: DIN Alternate;
        font-size: 32px;
        font-weight: 700;
        line-height: 37.25px;
        color: #40e8ff;
      }
      .btn-text {
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
        color: #fff;
        margin-top: 8px;
      }
      background: url("/img/booster/earnings/grid.png") no-repeat #000000;
      background-size: contain;
    }
    .share-btn {
      margin-top: 24px;
      width: 295px;
      height: 44px;
      padding: 8px 16px;
      border-radius: 16px;
      border: 1px;
      background: linear-gradient(90.97deg, #0fe1f8 0.68%, #1102fc 99.51%);
      .btn-text {
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
        color: #fff;
      }
    }
    .light-btn {
      position: relative;
      padding: 2px;
      border: 0;
      border-radius: 16px;
      overflow: hidden;
    }
    .light-btn::before {
      content: "";
      position: absolute;
      inset: 0;
      background: conic-gradient(
        from var(--rotation),
        transparent,
        #0fe1f8 60deg,
        transparent 61deg
      );
      animation: spin 4s infinite linear;
    }
    @property --rotation {
      syntax: "<angle>";
      inherits: true;
      initial-value: 0deg;
    }
    @keyframes spin {
      0% {
        --rotation: 0deg;
      }
      100% {
        --rotation: 360deg;
      }
    }
    .light-btn::after {
      content: "";
      position: absolute;
      inset: 3px;
      border-radius: 999px;
      background: var(--bg);
    }
    .light-span {
      padding: 2px;
      border-radius: 16px;
      background: #000000;
      position: relative;
      z-index: 2;
    }
  }
}
</style>
      