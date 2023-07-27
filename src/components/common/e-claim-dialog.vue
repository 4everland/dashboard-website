<template>
  <div>
    <v-dialog v-model="showDialog" max-width="700" persistent>
      <div class="reward-hub-content">
        <h3 class="ta-c">Minting Your Own On-Chain Identity</h3>
        <div class="mt-4 fz-14 lh-2">
          Welcome to 4EVERLAND. You are in a trial status and can only access
          limited product functionalities. Please complete the on-chain identity
          registration below to unlock the full potential of your Web3 journey.
        </div>
        <v-row class="mt-2">
          <v-col :sm="3" :cols="6" v-for="item in items" :key="item.name">
            <div class="resource-item al-c flex-column px-3 py-5 mb-5">
              <img height="40" :src="item.img" alt="" />
              <span class="mt-6 ta-c fz-12">{{ item.name }}</span>
            </div>
          </v-col>
        </v-row>
        <div class="d-flex justify-center mt-8">
          <e-menu ref="menu" top :close-on-content-click="false" open-on-hover>
            <v-btn slot="ref" color="primary" dark width="500px">
              <span class="ml-2">Mint now</span>
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>

            <v-list v-if="showMore">
              <v-list-item link @click="onSkip">
                <v-list-item-title class="fz-14 al-c justify-center">
                  <span class="ml-3 gray">Skip</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <v-list v-else>
              <div class="al-c flex-wrap pa-4" style="width: 500px">
                <template v-for="item in claimList">
                  <div
                    :key="item.type"
                    class="pa-3 claim-chain-item mt-2 cursor-p al-c"
                    @click="handleTypeClaim(item.type)"
                  >
                    <img :src="item.icon" width="24" height="24" alt="" />
                    <span class="ml-3 fz-14">
                      {{ item.name }}
                    </span>
                    <e-tooltip top v-if="item.tips">
                      <v-icon
                        slot="ref"
                        size="18"
                        color="#999"
                        class="pa-1 d-ib"
                        >mdi-alert-circle-outline</v-icon
                      >
                      <span>{{ item.tips }}</span>
                    </e-tooltip>
                  </div>
                </template>

                <div
                  v-if="!showMore"
                  @click="onMore"
                  class="claim-chain-item pa-3 mt-2 cursor-p fz-14 al-c"
                  :class="{ 'f-center': claimList.length % 2 == 0 }"
                  :style="{
                    width: claimList.length % 2 ? 'calc(50% - 4px)' : '100%',
                  }"
                >
                  <img width="20" src="/img/svg/more.svg" alt="" />
                  <span class="ml-3 fz-14">More</span>
                </div>
              </div>
            </v-list>
          </e-menu>
        </div>
      </div>
    </v-dialog>
    <e-register-share ref="share"></e-register-share>
  </div>
</template>

<script>
import mixin from "@/pages/more/mixin-register";
export default {
  mixins: [mixin],
  data() {
    return {
      showMore: false,
      items: [
        {
          img: "/img/svg/rewardHub/web3.svg",
          name: "Web3 Identity",
        },
        {
          img: "/img/svg/rewardHub/ownership.svg",
          name: "Ownership of data",
        },
        {
          img: "/img/svg/rewardHub/enhanced.svg",
          name: "Enhanced product functionalities",
        },
        {
          img: "/img/svg/rewardHub/fee_resource.svg",
          name: "Access to additional free resources",
        },
      ],
      showDialog: false,
      accountExists: false,
      registerInfo: {},
      newUserInfo: null,
      claimList: [
        {
          name: "Polygon",
          icon: require("/public/img/svg/billing/ic-polygon-0.svg"),
          type: "Polygon",
        },
        {
          name: "zkSync Lite(v1)",
          icon: require("/public/img/svg/logo-no-letters.svg"),
          type: "zkSync",
          tips: "Please ensure that you have sufficient ETH in zkSync Lite. Interaction with the zkSync network will rely on cross-chain communication services to complete on-chain identity registration on Polygon.",
        },
        {
          name: "ZkSync Era(V2)",
          icon: require("/public/img/svg/logo-no-letters.svg"),
          type: "zkSyncV2",
          tips: "Please ensure that you have sufficient ETH inzkSync Era. Interaction with the zkSync network will rely on cross-chain communication services to complete on-chain identity registration on Polygon.",
        },
        {
          name: "opBNB Testnet",
          icon: require("/public/img/svg/billing/ic-opbnb-test.svg"),
          type: "OpBNBTest",
        },
        {
          name: "Ethereum",
          icon: require("/public/img/svg/billing/ic-ethereum.svg"),
          type: "Ethereum",
        },
        {
          name: "Polygon ZkEVM",
          icon: require("/public/img/svg/billing/ic-polygon-zkEVM.svg"),
          type: "PolygonZkEVM",
        },
        {
          name: "BNB Chain",
          icon: require("/public/img/svg/billing/ic-bsc.png"),
          type: "BSC",
        },
        {
          name: "Arbitrum",
          icon: require("/public/img/svg/billing/ic-arbitrum.png"),
          type: "Arbitrum",
        },
        {
          name: "Linea",
          icon: require("/public/img/svg/billing/ic-linea.svg"),
          type: "Linea",
        },
      ],
    };
  },
  async created() {
    await this.getCurrentContract();
  },
  methods: {
    onMore() {
      this.showMore = true;
      this.$refs.menu.$children[0].onResize();
    },
    async onSkip() {
      try {
        await this.$confirm(
          "As a trial user, you will only have access to limited product functionalities and a small amount of experience resources. We recommend completing the on-chain registration to fully experience all the functionalities available.",
          "Are you sure you want to skip the on-chain identity registration?",
          {
            cancelText: "Skip",
            confirmText: "Mint",
          }
        );
        this.showMore = false;
      } catch (error) {
        this.showDialog = false;
      }
    },
    onAnimation() {
      this.showDialog = false;
      this.$refs.share.showDialog = true;
    },
    async handleTypeClaim(type = "Polygon") {
      try {
        const register = await this.isRegister();
        if (register) {
          this.onAnimation();
          return this.$emit("claimCompeleted");
        }
        let claimStatus = null;
        if (type == "Polygon") {
          claimStatus = await this.handleClaim();
        } else if (type == "zkSync") {
          claimStatus = await this.handleZkClaim();
        } else if (type == "zkSyncV2") {
          claimStatus = await this.handleOtherChainClaim("zkSync");
        } else {
          claimStatus = await this.handleOtherChainClaim(type);
        }
        if (claimStatus) {
          this.onAnimation();
          return this.$emit("claimCompeleted");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    showDialog(val) {
      if (!val) {
        this.showMore = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.claim-chain-item {
  width: calc(50% - 4px);
  box-sizing: border-box;
  background: rgba(140, 140, 161, 0.05);
  color: #0e0e2c;
}
.claim-chain-item:nth-of-type(even) {
  margin-left: 8px;
}
</style>
