<template>
  <div>
    <v-dialog
      v-model="firstRechargeDialog"
      max-width="920"
      content-class="claim-dialog "
      persistent
    >
      <div class="first-recharge">
        <div class="task-hub-content ml-auto">
          <div class="task-hub-title fw-b">
            {{
              isOverActivityTime
                ? "First Deposit Bonus for LAND!"
                : "Limited-time First Deposit Bonus for LAND!"
            }}
          </div>
          <div class="al-c fw-b py-6" v-if="!isOverActivityTime">
            <span class="mr-4">End Time:</span>
            <time-count-down :endTimeStamp="endTime"></time-count-down>
          </div>
          <div class="fw-b">
            Complete your frst deposit to unlock the following benefts.
          </div>
          <div class="fz-14 task-hub-description">starting from $1</div>

          <div
            v-for="(item, index) in firstRechargeItems"
            :key="index"
            class="mt-4 recharge-item al-c"
          >
            <div class="pa-2 al-c space-btw mr-4 img-icon">
              <img :src="item.img" alt="" />
            </div>
            <div>
              <div class="recharge-item-title fw-b fz-16">{{ item.title }}</div>
              <div class="recharge-item-description fz-12">
                {{ item.description }}
              </div>
            </div>
          </div>
          <div class="d-flex justify-center mt-8">
            <div
              class="give-up-btn fz-14 fw-b cursor-p"
              v-ripple
              @click="handleGiveUp"
            >
              Give up the benefits
            </div>
            <div
              class="deposite-now-btn al-c justify-center ml-6 flex-1 cursor-p"
              v-ripple
              @click="handleDeposite"
            >
              <span class="fz-14 fw-b">Deposit now</span>
              <img
                width="16"
                class="ml-1"
                src="/img/svg/new-user-activity/right-circle.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </v-dialog>

    <v-dialog
      v-model="showDialog"
      max-width="920"
      content-class="claim-dialog "
      persistent
    >
      <div class="d-flex mint-content pos-r">
        <div
          class="pos-a back-to-first-recharge al-c cursor-p"
          @click="handleBackFirstRecharge"
        >
          <img
            width="24"
            src="/img/svg/new-user-activity/left-arrow.svg"
            alt=""
          />
          <span class="ml-1 fz-14">Return to First Deposit Bonus</span>
        </div>
        <div class="mint-box ml-auto">
          <h3 class="mint-title fw-b">Minting Your Own On-Chain Identity</h3>
          <div class="mint-description fz-14">
            Welcome to 4EVERLAND. You are in a trial status and can only access
            limited product functionalities. Please complete the on-chain
            identity registration below to unlock the full potential of your
            Web3 journey.
          </div>

          <div class="mt-6">
            <h3 class="fz-16">Unlock new benefits</h3>
            <div class="d-flex flex-wrap">
              <div
                class="d-flex al-c pa-2"
                v-for="item in items"
                :key="item.name"
                style="width: 50%"
              >
                <div class="img-icon al-c space-btw pa-2">
                  <img height="40" :src="item.img" alt="" />
                </div>
                <div class="ml-3 fz-14">{{ item.name }}</div>
              </div>
            </div>
          </div>
          <div class="mt-8 al-c">
            <div
              class="skip-btn ta-c fw-b fz-14 flex-1 cursor-p"
              @click="showDialog = false"
              v-ripple
            >
              Skip
            </div>

            <div class="ml-6">
              <e-menu
                ref="menu"
                top
                :close-on-content-click="false"
                left
                open-on-hover
                nudge-top="8"
                @input="
                  (val) => {
                    menuOpen = val;
                  }
                "
              >
                <div
                  slot="ref"
                  class="mint-btn al-c justify-center fw-b fz-14 cursor-p"
                >
                  <span> Mint now</span>
                  <img
                    class="ml-1"
                    width="16"
                    :src="
                      menuOpen
                        ? '/img/svg/rewardHub/down-arrow.svg'
                        : '/img/svg/rewardHub/up-arrow.svg'
                    "
                    alt=""
                  />
                </div>

                <v-list>
                  <div class="al-c flex-wrap pa-4 pb-2" style="width: 560px">
                    <template v-for="item in claimList">
                      <div
                        :key="item.type"
                        class="pa-3 claim-chain-item mb-2 cursor-p al-c"
                        @click="handleTypeClaim(item.type)"
                        :class="claimList.length % 2 == 1 ? 'even' : 'odd'"
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
                  </div>
                </v-list>
              </e-menu>
            </div>
          </div>
        </div>
      </div>
    </v-dialog>
    <e-register-share ref="share"></e-register-share>
    <e-no-register-tip
      @showFirstRecharge="firstRechargeDialog = true"
    ></e-no-register-tip>
  </div>
</template>

<script>
import mixin from "@/pages/more/mixin-register";
import timeCountDown from "./time-count-down.vue";
import { bus } from "@/utils/bus";
import { mapState } from "vuex";
export default {
  mixins: [mixin],
  components: {
    timeCountDown,
  },
  computed: {
    ...mapState({
      onChain: (s) => s.onChain,
    }),

    endTime() {
      return Number(this.firstRechargeInfo.timestamp) + 86400 * 3;
    },
    isOverActivityTime() {
      return +new Date() >= this.endTime * 1000;
    },
    firstRechargeItems() {
      return [
        {
          img: "/img/svg/new-user-activity/upgrade.svg",
          title: "Upgrade your account for free",
          description:
            "Upgrade to a Standard user to access increased storage capacity and computing resources.",
        },
        {
          img: "/img/svg/new-user-activity/diamond.svg",
          title: this.isOverActivityTime ? "100Points" : "300 Points",
          description: this.isOverActivityTime
            ? "Complete your frst deposit and receive 100 points!"
            : "Limited-Time! Complete your first deposit before December 1st, and receive 300 points!",
        },
        {
          img: "/img/svg/new-user-activity/lock.svg",
          title: "Unlock Exclusive Features",
          description:
            "Deposit to activate dedicated gateway functionality and gain priority access to new feature experiences.",
        },
      ];
    },
  },
  data() {
    return {
      items: [
        {
          img: "/img/svg/rewardHub/web31.svg",
          name: "Web3 Identity",
        },
        {
          img: "/img/svg/rewardHub/ownership1.svg",
          name: "Ownership of data",
        },
        {
          img: "/img/svg/rewardHub/enhanced1.svg",
          name: "Enhanced product functionalities",
        },
        {
          img: "/img/svg/rewardHub/fee_resource1.svg",
          name: "Access to additional free resources",
        },
      ],
      showDialog: false,
      firstRechargeDialog: false,
      accountExists: false,
      registerInfo: {},
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
          name: "opBNB",
          icon: require("/public/img/svg/billing/ic-opbnb-test.svg"),
          type: "OpBNB",
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
          name: "BNB Smart Chain",
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
      firstRechargeInfo: {
        timestamp: 0,
        firstRecharge: true,
      },
      menuOpen: false,
    };
  },
  async created() {
    await this.getCurrentContract();
    if (localStorage.token) {
      this.getHandler();
      this.handleCheckFirstCharge();
    }
    bus.$on("showDialog", () => {
      this.showDialog = true;
    });
  },
  methods: {
    onAnimation() {
      this.showDialog = false;
      this.$refs.share.showDialog = true;
    },
    async handleTypeClaim(type = "Polygon") {
      try {
        this.$loading();
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
          this.claimCompeleted();
        }
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },

    async claimCompeleted() {
      try {
        const { data } = await this.$http.get(
          "$auth/self-handled-register-apply"
        );
        this.$setState({
          onChain: data.handled,
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getHandler() {
      try {
        const { data } = await this.$http.get(
          "$auth/self-handled-register-apply"
        );
        this.registerInfo = data;
        this.$setState({
          onChain: data.handled,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async handleCheckFirstCharge() {
      try {
        const { data } = await this.$http.get(
          "$bill-consume/common/first/recharge"
        );
        this.firstRechargeInfo = data;
        const loginTrigger = localStorage.getItem("loginTrigger");
        this.$store.commit("SET_FIRST_RECHARGE", data.firstRecharge);
        if (loginTrigger == "1") return;
        if (!data.firstRecharge) {
          this.firstRechargeDialog = true;
          localStorage.setItem("loginTrigger", "1");
        }
      } catch (error) {
        console.log(error);
      }
    },

    handleGiveUp() {
      this.firstRechargeDialog = false;
      if (!this.onChain) {
        this.showDialog = true;
      }
    },
    handleBackFirstRecharge() {
      this.firstRechargeDialog = true;
      this.showDialog = false;
    },
    handleDeposite() {
      this.firstRechargeDialog = false;
      this.$router.push("/billing/deposite");
    },
    handleMenu(val) {
      console.log(val);
    },
  },
};
</script>

<style>
.claim-dialog {
  border-radius: 16px;
}
.v-list.v-sheet.theme--light {
  padding: 0;
}
.v-menu__content.theme--light.v-menu__content--fixed {
  box-shadow: none;
  border-radius: 8px;
  border: 1px solid rgba(203, 213, 225, 0.25);
}
</style>
<style lang="scss" scoped>
.task-hub-content {
  width: 560px;
  .task-hub-title {
    font-size: 24px;
    color: #735ea1;
  }
  .task-hub-description {
    color: #64748b;
  }
}
.claim-chain-item {
  width: calc(50% - 4px);
  box-sizing: border-box;
  background: rgba(140, 140, 161, 0.05);
  color: #0e0e2c;
}

.claim-chain-item:nth-of-type(even) {
  margin-left: 8px;
}

.claim-chain-item.even:last-of-type {
  width: 100%;
}

.img-icon {
  border-radius: 50%;
  background: #f3e8ff;
}
.first-recharge {
  padding: 40px;
  background: url("/img/bg/share/first-recharge-bg.png") no-repeat;
  .recharge-item {
    .recharge-item-title {
      color: #775da6;
    }
  }
  .give-up-btn {
    padding: 16px 38px 16px 37px;
    color: #64748b;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
  }
  .deposite-now-btn {
    color: #fff;
    border-radius: 8px;
    background: #735ea1;
  }
}

.mint-content {
  padding: 40px;
  background: url("/img/bg/share/mint-bg.png") no-repeat;
  .mint-box {
    width: 560px;
    .mint-title {
      font-size: 24px;
      color: #735ea1;
    }
    .mint-description {
      color: #64748b;
    }
  }
}

.skip-btn {
  color: #64748b;
  border-radius: 8px;
  padding: 16px 0;

  border: 1px solid #cbd5e1;
  background: #fff;
}
.mint-btn {
  width: 320px;
  padding: 16px 0;
  color: #fff;
  border-radius: 8px;
  background: #735ea1;
}
.back-to-first-recharge {
  left: 20px;
  top: 20px;
  color: #735ea1;
}
</style>
