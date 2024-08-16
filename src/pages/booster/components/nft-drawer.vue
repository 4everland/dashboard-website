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
      :value="showStakeDrawer"
      @input="stateStakeDrawerShow"
    >
      <v-container fluid>
        <div class="nft-drawer-top">
          <div class="drawer-title nft-drawer-title">T4EVER STAKING</div>
          <!-- <div class="nft-drawer-desc">Receive a 10% Staking Yield</div> -->
          <div class="nft-drawer-btn-box">
            <div class="nft-drawer-logo">
              <img class="logo" src="/favicon.ico" alt="" />
              <div>Staked: {{ stakingAmount }} T4EVER</div>
            </div>
            <div>
              <v-btn class="drawer-btn" @click="onStake">Stake</v-btn>
            </div>
          </div>
        </div>
        <div class="nft-box">
          <div class="drawer-title mb-4">NFT STAKING</div>
          <v-row v-if="nftList.length > 0" no-gutters style="gap: 16px 0">
            <v-col v-for="item in nftList" :key="item.key" cols="4" md="15">
              <div class="nft-item-box">
                <v-tooltip bottom color="#000" nudge-top="40">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <img
                        v-if="item.private && item.isStakeData.stake"
                        class="nft-item-image"
                        :src="`/img/booster/nft/${item.key}_1.png`"
                        alt=""
                      />
                      <img
                        v-else-if="item.private"
                        class="nft-item-image"
                        :src="`/img/booster/nft/${item.key}_2.png`"
                        alt=""
                      />
                      <img
                        v-else
                        class="nft-item-image"
                        :src="`/img/booster/nft/${item.key}_3.png`"
                        alt=""
                      />
                    </div>
                  </template>
                  <span>{{ item.name }}</span>
                </v-tooltip>
                <div v-if="item.private" class="nft-item-boost">
                  +{{ item.public.coefficient }}%
                </div>
                <div
                  v-if="item.private && !item.isStakeData.stake"
                  class="nft-item-btn-box"
                >
                  <v-btn class="drawer-btn" @click="onBindNft(item)"
                    >Stake</v-btn
                  >
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-navigation-drawer>
    <StakeDialog
      v-model="showStakeDialog"
      :stakingAmount="stakingAmount"
      @onStaked="onStaked"
      ref="StakeDialog"
    />
    <stake-error v-model="showStakeError" />
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import {
  fetchStakeInfo,
  fetchNftLists,
  fetchNftIsStake,
  fetchNftBind,
} from "@/api/booster.js";

import NFT_LISTS from "../nft.js";

import StakeDialog from "@/pages/booster/components/stake-dialog";
import StakeError from "@/pages/booster/components/stake-error";

export default {
  components: {
    StakeDialog,
    StakeError,
  },
  computed: {
    ...mapGetters(["showStakeDrawer"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTg() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },
  data() {
    return {
      staking: 0,
      everpayStaking: 0,
      nftList: [],
      showStakeDialog: false,
      stakingAmount: 0,
      showStakeError: false,
    };
  },
  created() {},
  methods: {
    onStake() {
      if (this.isTg) {
        this.stateStakeDrawerShow(false);
        // this.showStakeError = true;
        window.open("https://dashboard.4everland.org/boost");
        return;
      }
      this.$refs.StakeDialog.init();
      this.stateStakeDrawerShow(false);
      this.showStakeDialog = true;
    },
    async getStakeInfo() {
      const { data } = await fetchStakeInfo();
      this.staking = data.staking;
      this.everpayStaking = data.everpayStaking;
      this.stakingAmount = data.staking + data.everpayStaking;
    },
    async getNftLists() {
      const { data } = await fetchNftLists();
      const isStakeData = await this.getNftIsStake();

      NFT_LISTS.map((el, index) => {
        el.public = data.public.find(
          (item) =>
            item.contractAddress.toLowerCase() ==
              el.contractAddress.toLowerCase() && item.batch == el.batch
        );
        el.private = data.private.find(
          (item) =>
            item.contractAddress.toLowerCase() ==
              el.contractAddress.toLowerCase() && item.batch == el.batch
        );
        el.isStakeData = isStakeData.find(
          (item) =>
            item.contract.toLowerCase() == el.contractAddress.toLowerCase() &&
            item.batch == el.batch
        );
      });

      this.nftList = NFT_LISTS;
    },
    async getNftIsStake() {
      const { data } = await fetchNftIsStake();
      return data;
    },
    async onBindNft(item) {
      const params = {
        contract: item.contractAddress,
        id: item.private.nftId,
      };
      try {
        await fetchNftBind(params);
        this.getNftLists();
        this.$store.dispatch("getBoosterUserInfo");
      } catch (error) {
        console.log(error);
      }
    },
    onStaked() {
      this.getStakeInfo();
    },
    stateStakeDrawerShow(state) {
      if (state) {
        this.getStakeInfo();
        this.getNftLists();
      }
      this.$store.dispatch("StakeDrawerState", { state });
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-btn {
  background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
  box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
  color: #fff !important;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
}
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
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);

      .nft-drawer-title {
      }
      .nft-drawer-desc {
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
        font-weight: 400;
      }
      .nft-drawer-btn-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .nft-drawer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          .logo {
            width: 28px;
          }
        }
      }
    }
  }
  .nft-box {
    padding: 24px 16px;
    .nft-item-box {
      margin: 0 auto;
      width: 100px;
      position: relative;
      .nft-item-image {
        width: 100%;
      }
      .nft-item-boost {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 34px;
        margin: 0 auto;
        text-align: center;
      }
      .nft-item-btn-box {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 5px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        .v-btn {
          height: 24px;
        }
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
          font-size: 16px;
        }
      }
    }
  }
  .col-md-15 {
    width: 20%;
    max-width: 20%;
  }
}
</style>
