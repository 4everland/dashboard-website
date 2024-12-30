<template>
  <div class="nft-drawer-box">
    <v-navigation-drawer
      class="nft-drawer"
      :absolute="!asMobile"
      :fixed="asMobile"
      bottom
      temporary
      :hide-overlay="!asMobile"
      color="#1E2234"
      :value="showHoldProve"
      @input="stateHoldDrawerShow"
    >
      <v-container fluid>
        <div class="nft-drawer-top">
          <div class="drawer-title nft-drawer-title">$4EVER HOLD PROVE</div>
          <div class="nft-drawer-desc">
            We randomly snapshot $4EVER balance in your wallet. Every 100 $4EVER
            contributes 0.0005% to a staking yield.
            <span class="get-more">Get more $4EVER!</span>
          </div>
          <div class="hold-prove mt-6">
            <div class="d-flex justify-space-between align-center">
              <div class="prove-title">Wallet address</div>
              <div class="prove-text">
                {{ (userInfo.username || "Not bound").cutStr(4, 4) }}
              </div>
            </div>
            <div class="d-flex justify-space-between align-center mt-4">
              <div class="prove-title">My $4EVER</div>
              <div class="prove-text">1,111,111</div>
            </div>
            <div class="d-flex justify-space-between align-center mt-4">
              <div class="prove-title">Staking yield</div>
              <div class="prove-text">0</div>
            </div>
            <div
              class="d-flex justify-space-between align-center mt-4 pt-4 prove-border"
            >
              <div class="prove-title">Total $4EVER holders</div>
              <div class="prove-text">17,608</div>
            </div>
            <div class="d-flex justify-space-between align-center mt-4">
              <div class="prove-title">Total $4EVER staked</div>
              <div class="prove-text">4,317,608 $4EVER</div>
            </div>
          </div>
          <div class="mt-6 d-flex justify-end">
            <v-btn
              class="staking-btn"
              width="146px"
              height="40px"
              @click="showStakeYield = true"
              >Get Staking Yield</v-btn
            >
          </div>
        </div>
      </v-container>
    </v-navigation-drawer>
    <StakeYieldDialog v-model="showStakeYield"></StakeYieldDialog>
  </div>
</template>
  <script>
import { mapState, mapGetters } from "vuex";
import StakeYieldDialog from "@/pages/booster/components/stake-yield-dialog";
import {
  fetch4everStakeInfo,
  fetch4everStakeTotal,
} from "@/api/booster.js";

export default {
  components: {
    StakeYieldDialog,
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["showHoldProve"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    return {
      showStakeYield: false,
    };
  },
  created() {},
  mounted() {
  },
  methods: {
    stateHoldDrawerShow(state) {
      if (state) {
        // this.getStakeInfo();
        // this.getNftLists();
        // this.getStakeKeyInfo();
      }
      this.$store.dispatch("HoldProveState", { state });
    },
    get4everStakeInfo() {
      fetch4everStakeInfo().then((res) => {
        console.log(res);
      });

      fetch4everStakeTotal().then((res) => {
        console.log(res);
      });
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.nft-drawer-box {
  ::v-deep .nft-drawer {
    width: 100% !important;
    height: 80% !important;
    max-height: 100% !important;
    background-image: url("/img/booster/drawer/nft-bg.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    overflow: scroll;
    .drawer-title {
      font-size: 24px;
      font-weight: 500;
      color: #fff;
      text-shadow: 0px 0px 8px #6172f3;
    }
    .nft-drawer-top {
      padding: 24px 16px;
      border-bottom: none !important;
      .endTime {
        font-size: 14px;
        color: #0fe1f8;
        .label {
          background-color: #000000;
          padding: 0px 4px;
          border: 1px solid #a4bcfd40;
          margin-right: 2px;
          margin-left: 2px;
          border-radius: 2px;
        }
      }
      .get-more {
        color: #2970ff;
        font-family: Inter;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        text-decoration-line: underline;
      }
      .hold-prove {
        border-radius: 8px;
        background: #000000;
        padding: 16px;
        .prove-title {
          font-family: Inter;
          font-weight: 400;
          font-size: 16px;
          line-height: 20px;
        }
        .prove-text {
          font-weight: 700;
          line-height: 20px;
          font-size: 16px;
        }
        .prove-border {
          border-top: 1px solid rgba(255, 255, 255, 0.3);
        }
      }
      .staking-btn {
        padding: 12px 16px;
        border-radius: 4px;
        background: linear-gradient(96.98deg, #0fe1f8 -22.19%, #1102fc 99.83%);
        font-family: Inter;
        font-size: 14px;
        font-weight: 400;
        line-height: 16px;
        color: #fff;
        letter-spacing: normal;
      }
    }
  }
}

@media (min-width: 960px) {
  .nft-drawer-box {
    ::v-deep .nft-drawer {
      top: 74px !important;
      left: 24px !important;
      width: 558px !important;
      height: calc(100% - 74px - 64px - 24px) !important;
      .nft-drawer-top {
        padding: 24px 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);

        .nft-drawer-desc {
          font-size: 12px;
          color: #FFFFFF99;
        }
      }
    }
  }
  .col-md-15 {
    width: 20%;
    max-width: 20%;
  }
}
@media (max-width: 960px) {
  .prove-title {
    font-size: 14px !important;
  }
  .prove-text {
    font-size: 14px ;
  }
}
</style>
  