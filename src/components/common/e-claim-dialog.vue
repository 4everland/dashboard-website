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
          <e-menu ref="menu" open-on-hover top :close-on-content-click="false">
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
              <v-list-item link @click="handleTypeClaim('polygon')">
                <v-list-item-title class="item-title fz-14 al-c justify-center">
                  <img
                    src="/img/svg/billing/ic-polygon-0.svg"
                    width="18"
                    alt=""
                  />
                  <span class="ml-3">Polygon</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item link @click="handleTypeClaim('zkSync')">
                <v-list-item-title class="item-title fz-14 al-c justify-center">
                  <div class="al-c">
                    <img src="/img/svg/logo-no-letters.svg" width="20" alt="" />
                    <span class="ml-3">zkSync Lite(V1)</span>
                  </div>
                  <e-tooltip right>
                    <v-icon slot="ref" size="18" color="#999" class="pa-1 d-ib"
                      >mdi-alert-circle-outline</v-icon
                    >
                    <span
                      >Please ensure that you have sufficient ETH in zkSync
                      Lite. Interaction with the zkSync network will rely on
                      cross-chain communication services to complete on-chain
                      identity registration on Polygon.</span
                    >
                  </e-tooltip>
                </v-list-item-title>
              </v-list-item>
              <v-list-item link @click="handleTypeClaim('zkSyncV2')">
                <v-list-item-title class="item-title fz-14 al-c justify-center">
                  <div class="al-c">
                    <img src="/img/svg/logo-no-letters.svg" width="20" alt="" />
                    <span class="ml-3">zkSync Era(V2)</span>
                  </div>
                  <e-tooltip right>
                    <v-icon slot="ref" size="18" color="#999" class="pa-1 d-ib"
                      >mdi-alert-circle-outline</v-icon
                    >
                    <span
                      >Please ensure that you have sufficient ETH in zkSync Era.
                      Interaction with the zkSync network will rely on
                      cross-chain communication services to complete on-chain
                      identity registration on Polygon.</span
                    >
                  </e-tooltip>
                </v-list-item-title>
              </v-list-item>

              <v-list-item link @click="onMore" v-if="!showMore">
                <v-list-item-title class="fz-14 al-c justify-center">
                  <span class="ml-3 gray">More</span>
                </v-list-item-title>
              </v-list-item>
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
    async handleTypeClaim(type = "polygon") {
      try {
        const register = await this.isRegister();
        if (register) {
          this.onAnimation();
          return this.$emit("claimCompeleted");
        }
        let claimStatus = null;
        if (type == "polygon") {
          claimStatus = await this.handleClaim();
        } else if (type == "zkSync") {
          claimStatus = await this.handleZkClaim();
        } else {
          claimStatus = await this.handleZkClaimV2();
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