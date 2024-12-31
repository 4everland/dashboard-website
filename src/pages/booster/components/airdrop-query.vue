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
              <div class="user-name">
                {{ (userInfo.username || "unkown").cutStr(4, 4) }}
              </div>
            </div>
          </div>
        </div>
        <div class="airdrop-content">
          <div
            v-for="(item, index) in dataList"
            :key="index"
            v-if="item.status !== 'hide'"
            :class="{ queryItem: item.status != 'hide' }"
          >
            <div class="d-flex justify-space-between">
              <div class="list-left">
                <div
                  class="list-title"
                  :class="{ 'list-title-no': item.status === false }"
                >
                  {{ item.title }}
                </div>
                <div class="list-text mb-1">{{ item.subtitle }}</div>
              </div>
              <div class="list-right">
                <img
                  v-if="item.status === 'loading'"
                  class="imgLoading"
                  src="/img/booster/earnings/waiting-icon.png"
                  width="24"
                  alt=""
                />
                <img
                  v-if="item.status === true"
                  src="/img/booster/earnings/completed.png"
                  width="24"
                  alt=""
                />
                <img
                  v-if="item.status === false"
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
          <div v-if="showPoint" class="queryItem btnWrap">
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
                    <span class="btn-text"> $4EVER </span>
                  </v-btn>
                </div>
              </div>
            </div>
            
            <div v-if="shortPoint > 0">
              <v-btn class="share-btn" @click="handleShare">
                <span class="btn-text d-flex justify-center align-center">
                  <img
                    v-if="linkShared === true"
                    src="/img/booster/earnings/completed.png"
                    width="24"
                    style="margin-right: 10px"
                    alt=""
                  />{{ linkShared ? "Shared" : "Share on X" }}</span
                >
              </v-btn>
              
              <div v-show="!dropped">
              <div  class="d-flex justify-space-between align-center mt-3">
                <div class="evm-wallet fz-14">Your EVM Wallet</div>
                <v-btn v-if="!address" :loading="loading" class="bind-btn" @click="asMobile?onConnetc():toConfig()"
                  >Bind</v-btn
                >
                <div class="d-flex justify-start align-center" v-if="address">
                  
                  <span class="evm-wallet" style="font-weight: bold;">{{ address.cutStr(4, 4) }}</span>
                  
                  <v-btn
                    class="e-btn-text"
                    icon
                    @click="copytext"
                  >
                    <img src="/img/svg/copy.svg" width="14" />
                  </v-btn>
                </div>
              </div>
            </div>
              
              <div class="d-flex justify-start align-center mt-4">
                <img
                  src="/img/booster/earnings/subtract.png"
                  width="16"
                  alt=""
                />
                <div class="view" v-if="!dropped" >
                  Please bind your EVM address to claim the second round of airdrop. Timing will be announced!
                </div>
                <div class="view" v-else>
                  Your airdrop has been sent to your linked exchange. For any questions, contact us on Telegram.
                </div>
              </div>
            </div>

          </div>
          <starrise id="starRise"></starrise>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import { bus } from "@/utils/bus";
import { mapGetters, mapState } from "vuex";
import { fetchAirdropInfo } from "@/api/booster";
import ICountUp from "vue-countup-v2";
import starrise from "./star-rise.vue";
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      showPoint: false,
      shortPoint: 0,
      linkShared: false,
      dataList: [
        {
          title: "Staked T4EVER",
          subtitle: "0.5% of tokens for 1:1 T4EVER exchange.",
          status: "hide",
          realStatus: false,
        },
        {
          title: "$4EVER Points",
          subtitle: "3% of tokens for users with $4EVER Points.",
          status: "hide",
          realStatus: false,
        },
        {
          title: "Product Interaction",
          subtitle:
            "1% of tokens for early users who engage with products and on-chain activities.",
          status: "hide",
          realStatus: false,
        },
        {
          title: "Early Contributors",
          subtitle:
            "0.5% of tokens for early ecosystem contributors and Gitcoin donation.",
          status: "hide",
          realStatus: false,
        },
      ],
      address: "",
      dropped: false,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      inviteInfo: (s) => s.moduleBooster.inviteInfo,
    }),
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    addressCopy(){
      return this.address
    },
    copyValue() {
      return (
        "Invite link:" +
        this.inviteInfo.link +
        "\n" +
        "Invite code:" +
        this.inviteInfo.inviteCode
      );
    },
  },
  mounted() {
    this.$store.dispatch("getInviteInfo");
    bus.$on("showQueryDialogEvent", () => {
      this.handleListStatus();
    });
    bus.$on("refreshAirdropQuery", () => {
      this.handleListStatus();
    });
  },
  methods: {
    copytext() {
      this.$copy2(this.addressCopy);
    },
    async handleListStatus() {
      this.loading = true;
      await this.getAirdrop();
      let info = this.userInfo.username;
      let airInfo = localStorage.getItem("airdrop" + info);
      if (!airInfo) {
        for (const item of this.dataList) {
          item.status = "loading";
          await this.$sleep(1000);
          item.status = item.realStatus;
          await this.$sleep(1000);
        }
        this.showPoint = true;
      } else {
        for (const item of this.dataList) {
          item.status = item.realStatus;
        }
        this.showPoint = true;
      }
      this.loading = false;
      localStorage.setItem("airdrop" + info, true);
    },
    async getAirdrop() {
      try {
        const { data } = await fetchAirdropInfo();
        if (data) {
          this.dataList[0].realStatus = data.stakeT4ever;
          this.dataList[1].realStatus = data.holdPoints;
          this.dataList[2].realStatus = data.productIteracted;
          this.dataList[3].realStatus = data.gitcoinDonation;
          this.shortPoint = Number(data.t4ever);
          this.dropped = data.dropped;
          this.address = data.address;
        }
        
      } catch (error) {
        console.log(error);
      }
    },
    handleShare() {
      let shareUrl = `🪂Awesome! I've just checked my eligibility for the @4everland_org #airdrop! Don’t wait - come check your $4EVER airdrop details here! 💰
More info: https://x.com/4everland_org/status/1866783372850446538
Airdrop: `;
      shareUrl = shareUrl + this.inviteInfo.link;
      shareUrl =
        "https://x.com/intent/tweet?text=" + encodeURIComponent(shareUrl);
      if (this.isTgMiniApp) {
        this.$tg.openAuto(shareUrl);
      } else {
        this.asMobile
          ? (location.href = shareUrl)
          : window.open(shareUrl, "_blank");
      }
      setTimeout(() => {
        this.linkShared = true;
      }, 20000);
    },
    onConnetc() {
      let state = true;
      this.$store.dispatch("ConnectDrawerState", { state });
    },
    toConfig() {
      this.$router.push("/account/config");
    }
  },
  components: {
    ICountUp,
    starrise,
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
  margin-top: 0px;
  padding: 26px 16px 36px;
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
    min-height: 400px;
    position: relative;
    margin: 0 auto;
    top: 0px;
    padding: 24px 16px;
    border-radius: 16px;
    margin-top: -7px;
    background: linear-gradient(179.52deg, #000a10 8.53%, #003e70 99.59%),
      linear-gradient(
        180deg,
        rgba(17, 2, 252, 0.15) 28.41%,
        rgba(15, 225, 248, 0) 100%
      );

    border: 1px solid #45516f80;

    .list-title {
      font-size: 14px;
      font-weight: 700;
      line-height: 16px;
      color: #0fe1f8;
    }
    .list-title-no {
      color: #ffffff70;
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
      margin-right: 20px;
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
        line-height: 28px;
        color: #fff;
        display: inline-block;
        background: url("/img/booster/earnings/share-btn-bg.png") no-repeat;
        width: 200px;
        height: 28px;
      }
    }
    .light-btn {
      position: relative;
      padding: 2px;
      border: 0;
      border-radius: 16px;
      overflow: hidden;
      z-index: 1;
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
    .evm-wallet {
      color: #fff;
    }
    .bind-btn {
      width: 100px;
      background: #6172F3;
      color: #fff;
    }
    .view {
      font-size: 11px;
      font-weight: 400;
      line-height: 15px;
      color: #c0c1c2;
      margin-left: 4px;
    }
  }
}
</style>
      