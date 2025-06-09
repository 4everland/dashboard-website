<template>
  
  <div class="airdrop-container">
    <div class="airdrop-in-container">
      <v-row>
        <v-col cols="12" md="6">
          <v-list class="transparent">
            <v-list-item v-for="(item, index) in airdropItems" :key="index" class="airdrop-item content-bg" :class="{'content-bg-check': item.status === true}">
              <v-list-item-avatar size="32" tile>
                <v-img :src="item.icon"  size="32"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="white--text font-weight-bold airdrop-title">{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle class="grey--text fz-12 text-wrap airdrop-subtitle flex align-center">
                  {{ item.subtitle }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <img
                  v-if="item.status === 'loading'"
                  class="imgLoading"
                  src="/img/airdrop/icon_loading.png"
                  width="24"
                  alt=""
                />
                <img
                  v-if="item.status === true"
                  src="/img/airdrop/icon_check.png"
                  width="24"
                  alt=""
                />
                <img
                  v-if="item.status === false"
                  src="/img/airdrop/icon_error.png"
                  width="24"
                  alt=""
                />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="transparent" flat>
            <v-card-text class="text-center position-relative">
              <v-img
                src="/img/booster/icon_fourever.png"
                :max-width="asMobile ? 120 : 200"
                class="mx-auto mb-4 img-right"
                :class="{'img-right-mobile': asMobile}"
              ></v-img>
              <div class="right-content" :class="{'right-content2': access}">
                <div>
                  <div v-if="access" class="big-title mb-4 text-left fz-28">🎉Congratulations, you're eligible</div>
                  <div v-if="loading || access" class="white--text mb-4 text-left">You will receive:</div>
                </div>
                <div v-if="!loading&&!access" class="mt-16">
                  <div class="big-title mt-4 text-left fz-28">Sorry</div>
                  <div class="big-title mb-4 text-left fz-28">You're not eligible</div>
                  <div class="white--text mb-4 text-left" style="letter-spacing: normal;">
                    Don't be discouraged! You can still participate in 4EVER Boost, and you'll have the opportunity to receive it in the future.
                  </div>
                </div>
                <div v-if="loading || access" class="d-flex justify-center">
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
                        <span class="btn-text"> $4EVER </span>
                      </v-btn>
                    </div>
                  </div>
                </div>
                <v-btn
                  v-if="loading || access"
                  block
                  class="mt-6 btn-claim"
                  :class="{'btn-claim-can': canClaim}"
                  height="48"
                  :disabled="!canClaim || alreadyClaim"
                  :loading="claimLoading"
                  @click="handleClaim"
                >
                  {{ alreadyClaim ? 'Already Claimed' : 'Claim Now' }}
                </v-btn>
                <!-- <div class="flex justify-between  mt-4">
                  <v-btn
                  
                  class="btn-share"
                  
                  height="48"
                  
                  @click="handleClaim"
                >
                  Share to X
                </v-btn>
                <v-btn
                  class=" btn-claim"
                  height="40"
                  @click="handleClaim"
                >
                  Add Token to Wallet
                </v-btn>

                </div> -->
                <v-btn
                  v-if="!loading && !access"
                  block
                  class="mt-6 btn-boost"
                  height="48"
                  @click="$router.push('/boost')"
                >
                  4EVER Boost
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-caption grey--text text--lighten-1 text-left mt-4 pl-4" style="letter-spacing: normal !important;">
            ✨ No duplicate rewards for those who have already claimed airdrops on exchanges previously.<br>
            ✨ This airdrop will be distributed on the BSC. Please claim yours before 8:00AM July 8 UTC.
          </div>
        </v-col>
      </v-row>
    </div>
  </div>

</template>

<script>
import { ethers } from "ethers";
import { mapState, mapGetters } from "vuex";
import { formatEther } from "ethers/lib/utils";
import { airdropAbi } from "@/plugins/abi/airdropAbi";

import ICountUp from "vue-countup-v2";
import starrise from "../components/star-rise.vue";
import { fetchAirdropList } from "@/api/booster";
export default {
  name: 'Airdrop',
  components: {
    ICountUp,
    starrise,
  },
  data: () => ({
    canClaim: false,
    access: false,
    loading: true,
    shortPoint: 0,
    airdropInfo: {},
    proof: [],
    claimLoading: false,
    alreadyClaim: false,
    airdropItems: [
      {
        icon: '/img/airdrop/icon_stake.png',
        title: 'Staked T4EVER',
        subtitle: '0.5% of tokens for 1:1 T4EVER exchange.',
        keyStr:'stakeT4ever',
        status: "loading",
        realStatus: false,
      },
      {
        icon: '/img/airdrop/icon_4ever.png',
        title: '$4EVER Points',
        subtitle: '3% of tokens for users with $4EVER Points.',
        status: "loading",
        keyStr:'holdPoints',
        realStatus: false,
      },
      {
        icon: '/img/airdrop/icon_product.png',
        title: 'Product Interaction',
        subtitle: '1% of tokens for early users who engage with products and on-chain activities.',
        status: "loading",
        keyStr: 'productIteracted',
        realStatus: false,
      },
      {
        icon: '/img/airdrop/icon_early.png',
        title: 'Early Contributors',
        subtitle: '0.5% of tokens for early ecosystem contributors and Gitcoin donation.',
        status: "loading",
        keyStr:'gitcoinDonation',
        realStatus: false,
      }
    ]
  }),
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      connectAddr: (s) => s.connectAddr,
    }),
    ...mapGetters(["walletObj","notLogin"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  created() {
    if (this.notLogin) {
      this.$router.push("/boost");
      return;
    }
  },
  async mounted() {
    let { data: airdropData } = await fetchAirdropList();
    console.log(airdropData);
    
    this.airdropItems.forEach(item => {
      item.realStatus = airdropData[item.keyStr];
      console.log(item.realStatus);
    });

    for (const item of this.airdropItems) {
      item.status = "loading";
      await this.$sleep(1000);
      item.status = item.realStatus;
      await this.$sleep(1000);
    }
    const dropValue = airdropData.dropValue||0;
    this.shortPoint = Number(ethers.utils.formatEther(dropValue));
    this.proof = airdropData.node||[];
    this.access = airdropData.access;
    // this.access = true; // For testing purposes, set access to true
    this.loading = false;
    this.airdropInfo = airdropData;
    const claimInfo = localStorage.getItem("claimInfo" + this.userInfo.wallet.address);
    if(claimInfo){
      this.alreadyClaim = true;
    }
    if(this.access){
      this.handleCanClaim();
    }
  },
  methods: {
    async handleCanClaim() {
      try {
        let address = this.userInfo.wallet.address;
        console.log(address, this.shortPoint, this.proof)
        if (!address) return;
        const tokenAddress = process.env.VUE_APP_AIRDROP_ADDRESS;
        const provider = new ethers.providers.Web3Provider(this.walletObj);
        const { chainId } = await provider.getNetwork();
        console.log('chainId', chainId);
        if (this.$inDev && chainId != 97) {
          await this.switchNet('BSC');
        }
        if (!this.$inDev && chainId != 56) {
          await this.switchNet('BSC');
        }
        const contract = new ethers.Contract(
          tokenAddress,
          airdropAbi,
          provider
        );
        console.log(address, ethers.utils.parseEther(String(this.shortPoint)).toString(), this.proof, tokenAddress)
        const canClaim = await contract.canClaim(address, ethers.utils.parseEther(String(this.shortPoint)).toString(), this.proof);

        console.log('canClaim', canClaim);
        this.canClaim = canClaim;
      } catch (err) {
        console.log(err);
      }
    },
    async handleClaim() {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        let address = accounts[0];

        if (!address) return;
        if(address.toLowerCase() !== this.airdropInfo.address.toLowerCase()){
          this.$toast2(`Please switch to the correct account ${this.airdropInfo?.address}`);
          return;
        }
        const tokenAddress = process.env.VUE_APP_AIRDROP_ADDRESS;
        const provider = new ethers.providers.Web3Provider(this.walletObj);
        const { chainId } = await provider.getNetwork();
        if (this.$inDev && chainId != 97) {
          await this.switchNet('BSC');
        }
        if (!this.$inDev && chainId != 56) {
          await this.switchNet('BSC');
        }
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          tokenAddress,
          airdropAbi,
          signer
        );

        const canClaim = await contract.canClaim(
          address,
          ethers.utils.parseEther(String(this.shortPoint)).toString(),
          this.proof
        );
        console.log('Can claim:', canClaim);
        
        if (!canClaim) {
          this.$toast2("You cannot claim at this time");
          return;
        }

  
        const gasLimit = await contract.estimateGas.claim(
          ethers.utils.parseEther(String(this.shortPoint)).toString(),
          this.proof
        );
        this.claimLoading = true;

        const tx = await contract.claim(
          ethers.utils.parseEther(String(this.shortPoint)).toString(),
          this.proof,
          {
            gasLimit: gasLimit,
          }
        );

        const receipt = await tx.wait();
        this.$toast2("Successfully Claimed!");
        let info = this.userInfo.wallet.address;
        localStorage.setItem("claimInfo" + info, true);
        this.alreadyClaim = true;
        this.claimLoading = false;
        console.log('Transaction receipt:', receipt);
      } catch (error) {
        console.log('error', error);
        const regex = /"message": "([^"]+)"/;
        const match = String(error).match(regex);
        if (match) {
          const extractedMessage = match[1];
          console.log('error message:', extractedMessage);
          this.$toast2(extractedMessage, 'error');
        } else if(/insufficient|estimateGas/.test(String(error)||'')) {
          this.$toast2('Insufficient funds', 'error');
        } else if(/rejected action"([\w\s]+)"/.test(String(error))) {
          this.$toast2('user rejected action', 'error');
        } else {
          this.$toast2('send transaction failed', 'error');
        }
        this.claimLoading = false;
      }
    },
    async switchNet(chainName) {
      const id = this.getChainId(chainName);
      const chainId = "0x" + id.toString(16);
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
      } catch (error) {
        console.log("switch error 2", error);
        if (error.code == 4902 || error.data?.originalError.code == 4902) {
          await this.addChain(chainId, id);
        } else {
          throw new Error(error.message);
        }
      }
    },
    getChainId(type) {
      if (type == "BSC") return this.$inDev ? 97 : 56;
      return this.$inDev ? 97 : 56;
    },
    async addChain(chainId, id) {
      let params = {
        
        56: {
          chainId,
          chainName: "Binance Smart Chain",
          rpcUrls: ["https://bsc-dataseed1.bnbchain.org"],
          nativeCurrency: {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
          },
          blockExplorerUrls: ["https://bscscan.com"],
        },
        
        97: {
          chainId,
          chainName: "BNB Smart Chain Testnet",
          rpcUrls: ["https://data-seed-prebsc-1-s1.bnbchain.org:8545"],
          nativeCurrency: {
            name: "BNB Coin",
            symbol: "tBNB",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        }
      }[id];
      if (!params) return;
      try {
        await window.ethereum.request(
          {
            method: "wallet_addEthereumChain",
            params: [params],
          },
          this.connectAddr
        );
      } catch (error) {
        console.log("add chain err", error);
      }
    },
  }
}
</script>

<style lang="scss" src="../spin.scss"></style>
<style scoped lang="scss">
.airdrop-container {
  width: 100%;
  height: 100%;
  padding-top: 200px;
  background: url("/img/booster/bg_airdrop_second.svg") repeat #000000;
}
.airdrop-in-container {
  max-width: 1032px;
  margin: 0 auto;
  border: 1px solid #0FE1F81A;
  background: linear-gradient(281.05deg, rgba(0, 62, 112, 0.5) 19.1%, rgba(0, 10, 16, 0.5) 100.11%);
  backdrop-filter: blur(8px);
  padding: 40px;
  border-radius: 8px;

}
.content-bg{
  background: url("/img/booster/svg/fringe-bg.svg");
}
.content-bg-check{
  background: linear-gradient(270.31deg, rgba(15, 225, 248, 0.2) 0.18%, rgba(0, 114, 248, 0.2) 100.11%), url("/img/booster/svg/fringe-bg.svg");
}
.img-right{
  position: absolute;
  right: -46px;
  top: -90px;
}
.img-right-mobile{
  right: -20px;
  top: 25px;
}
.right-content{
  margin-top: 97px;
  .big-title{
    color: #0FE1F8;
    max-width: 68%;
  }
  .fz-28{
    font-size: 28px;
    font-weight: 700;
    line-height: 34px;
  }
  .submit-btn {
    width: 100%;
    height: 79px;
    border-radius: 16px;
    padding: 0 !important;
    .number {
      font-family: DIN Alternate;
      font-size: 32px;
      font-weight: 700;
      line-height: 37.25px;
      color: #039CFF;
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
}
.right-content2{
  margin-top: 15px;
}


.light-btn {
  position: relative;
  padding: 2px;
  border: 0;
  border-radius: 16px;
  overflow: hidden;
  z-index: 1;
  width: 100%;
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
  width: 100%;
}
#starRise {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 0;
}
.btnWrap {
  position: relative;
  z-index: 1;
}
.airdrop-title {
  position: absolute;
  top: -10px;
}

.airdrop-item {
  border-radius: 8px;
  margin-bottom: 25px;
  min-height: 60px;
  position: relative;
}

.receipt-card {
  background: rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px;
  height: 100px;
}

.timeline-line {
  height: 2px;
  flex-grow: 1;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 16px;
  position: relative;
}

.timeline-line::before {
  content: '';
  position: absolute;
  left: 30%;
  width: 20%;
  height: 100%;
  background: cyan;
}

.token-amount {
  font-size: 20px;
  font-weight: bold;
  color: white;
}
.btn-claim {
  background-color: #344054 !important;
  color: #fff !important;
}
.btn-share{
  background-color: #000 !important;
  color: #fff !important;
}
.btn-add-token {
  background: linear-gradient(90.97deg, #0FE1F8 0.68%, #1102FC 99.51%);
  color: #fff !important;
}
.btn-claim-can {
  background-color: #039CFF !important;
}
.btn-boost {
  background: linear-gradient(90.97deg, #0FE1F8 0.68%, #1102FC 99.51%);
  color: #fff !important;
}
:deep .v-list-item__content{
  overflow: inherit;
}
</style>
