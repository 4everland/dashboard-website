<template>
  <div class="nft-drawer-box">
    <v-navigation-drawer
      class="nft-drawer"
      absolute
      bottom
      temporary
      hide-overlay
      color="#1E2234"
      :value="showStakeDrawer"
      @input="stateStakeDrawerShow"
    >
      <v-container fluid>
        <div class="nft-drawer-top">
          <div class="drawer-title nft-drawer-title">T4EVER STAKING</div>
          <div class="nft-drawer-desc">
            Received a 10% bonus on staking yield.
          </div>
          <div class="nft-drawer-btn-box">
            <div class="nft-drawer-logo">
              <img class="logo" src="/favicon.ico" alt="" />
              <div>Staked: {{ staking }} T4EVER</div>
            </div>
            <div>
              <v-btn class="drawer-btn" @click="showStakeDialog = true"
                >Stake</v-btn
              >
            </div>
          </div>
        </div>
        <div class="nft-box">
          <div class="drawer-title mb-4">NFT STAKE</div>
          <v-row v-if="nftList.length > 0" no-gutters style="gap: 16px 0">
            <v-col v-for="item in nftList" :key="item.key" cols="4" md="15">
              <div class="nft-item-box">
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
                <div
                  v-if="item.private && !item.isStakeData.stake"
                  class="nft-item-boost"
                >
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
    <StakeDialog v-model="showStakeDialog" />
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

export default {
  components: {
    StakeDialog,
  },
  computed: {
    ...mapGetters(["showStakeDrawer"]),
  },
  data() {
    return {
      staking: 0,
      nftList: [],
      showStakeDialog: false,
    };
  },
  created() {
    this.getStakeInfo();
    this.getNftLists();
  },
  methods: {
    async getStakeInfo() {
      const { data } = await fetchStakeInfo();
      console.log(data);
      this.staking = data.staking;
    },
    async getNftLists() {
      const { data } = await fetchNftLists();
      const isStakeData = await this.getNftIsStake();

      NFT_LISTS.map((el, index) => {
        el.public = data.public.find(
          (item) =>
            item.contractAddress == el.contractAddress && item.batch == el.batch
        );
        el.private = data.private.find(
          (item) =>
            item.contractAddress == el.contractAddress && item.batch == el.batch
        );
        el.isStakeData = isStakeData.find(
          (item) =>
            item.contract == el.contractAddress && item.batch == el.batch
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
        id: item.private.batch,
      };
      try {
        await fetchNftBind(params);
        this.getNftLists();
      } catch (error) {
        console.log(error);
      }
    },
    stateStakeDrawerShow(state) {
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
      height: calc(100% - 74px - 64px) !important;
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
