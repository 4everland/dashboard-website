<template>
  <v-overlay :value="value" opacity="1" z-index="10">
    <div class="start-boosting d-flex flex-column justify-center">
      <img
        class="close-btn"
        @click="$emit('input', false)"
        src="/img/booster/svg/close.svg"
        width="18"
        alt=""
      />
      <div class="first-dialog-title py-2 fz-20 text-center mb-2">
        Claim LAND
      </div>
      <div class="first-dialog-content">
        <div class="paragraph d-flex align-center justify-space-between">
          <span>Amount</span>
          <span v-if="depositLand != 0"
            >{{ depositLand.toLocaleString() }} LAND (${{
              depositLand / 1e6
            }})</span
          >
          <div class="d-flex align-center deposit-control py-1 px-2" v-else>
            <input
              class="deposit-input text-right"
              style="width: 50px; color: #fff"
              maxlength="5"
              v-model="customLand"
              autofocus
              type="number"
              @input="handleInput"
            />
            <span class="num">,000,000</span>
            <span class="ml-1 fz-14">LAND</span>
          </div>
        </div>
        <div class="paragraph ">
          <div class="pb-4">Choose Asset</div>
          <div class="d-flex align-center justify-space-between">
            <div class="coinWrap" :class="{'activeselect': paytype == 'toncoin'}" @click="handleSelect('toncoin')">
              <div class="d-flex align-center px-3 py-3" style="gap: 12px">
                <img
                 v-if="paytype == 'toncoin'"
                  width="16"
                  src="/img/booster/svg/choose-token-active.svg"
                  alt=""
                />
                <img
                  v-else
                  width="16"
                  src="/img/booster/svg/choose-token.svg"
                  alt=""
                />
                <div class="d-flex align-center">
                  <img width="24" src="/img/booster/ton-icon.png" alt="" />
                  <span class="ml-1">Toncoin</span>
                </div>
              </div>
            </div>
            <div class="coinWrap" :class="{'activeselect': paytype == 'starcoin'}" @click="handleSelect('starcoin')">
              <div class="d-flex align-center px-3 py-3" style="gap: 12px">
                <img
                 v-if="paytype == 'starcoin'"
                  width="16"
                  src="/img/booster/svg/choose-token-active.svg"
                  alt=""
                />
                <img
                  v-else
                  width="16"
                  src="/img/booster/svg/choose-token.svg"
                  alt=""
                />
                <div class="d-flex align-center">
                  <img width="24" src="/img/booster/icon_star.png" alt="" />
                  <span class="ml-1">Star</span>
                </div>
                <div class="discountWrap">
                  20% off
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <div class="fz-12 text-center" v-if="tonConnected&&paytype == 'toncoin'">
          Having trouble claiming? Please click '<span
            @click="handleDisconnect"
            style="color: #34a9ff"
          >
            Disconnect </span
          >' and try again.
        </div>
        <div class="fz-12 text-center" v-else>
          Claiming LAND may take some time. Please wait.
        </div>

        <div
          class="act-btn d-flex align-center justify-center mt-10"
          style="gap: 16px"
        >
          <v-btn
            outlined
            color="rgba(255, 255, 255, 0.60)"
            @click="$emit('input', false)"
            width="180"
            >Cancel</v-btn
          >
          <v-btn
            style="
              border: 1px solid #0e6cc6;
              background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
              text-shadow: 0px 0px 8px #6172f3;
            "
            outlined
            color="#fff"
            width="180"
            :disabled="customAmount == 0"
            :loading="load"
            @click="handleClaim"
            >Claim</v-btn
          >
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { beginCell } from "@ton/ton";
import axios from "axios";
import { tgPaymentInvoice } from "@/api/booster";

export default {
  props: {
    value: Boolean,
    depositLand: Number,
    report: Boolean,
  },
  data() {
    return {
      load: false,
      customLand: "",
      tonClient: null,
      paytype: 'toncoin'
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      tonConnectUI: (s) => s.moduleBooster.tonConnectUI,
    }),

    ...mapGetters(["tonConnected"]),
    customAmount() {
      if (this.depositLand == 0) {
        return this.customLand * 1e6;
      }
      return this.depositLand;
    },
  },
  methods: {
    async handleDisconnect() {
      if (this.tonConnected) {
        await this.tonConnectUI.disconnect();
        this.$toast2(
          "Disconnected successfully. Please proceed to claim.",
          "success"
        );
      }
    },
    handleInput(e){
      this.customLand = e.target.value.replace(/[^\d]/g, "");
    },
    async handleDeposit() {
      console.log(
        this.tonConnectUI,
        this.tonConnectUI.account,
        this.tonConnected,
        "====="
      );

      if (!this.tonConnected) {
        await this.tonConnectUI.connectWallet();
      }
      let payload = JSON.stringify({
        uid: this.userInfo.uid,
      });

      const body = beginCell()
        .storeUint(0, 32)
        .storeStringTail(payload)
        .endCell();

      const { data } = await axios.get(
        "https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026"
      );
      let price = data.parsed[0].price.price;

      const amount = ((this.customAmount / 1e6 / price) * 1e17 * 1.05).toFixed(
        0
      );
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages: [
          {
            address: process.env.VUE_APP_TON_DST_ADDR,
            amount,
            payload: body.toBoc().toString("base64"),
          },
        ],
      };
      try {
        const result = await this.tonConnectUI.sendTransaction(transaction);
        console.log(result, "result");
        this.$toast2("Submission successful. Claiming in progress!", "success");
        this.$emit("input", false);
      } catch (e) {
        console.error(e);
      }
    },
    handleSelect(type) {
      this.paytype = type;
    },
    handleClaim(){
      if(this.paytype == 'toncoin') {
        this.handleDeposit();
      } else {
        this.handlePayAsStar();
      }
    },
    async handlePayAsStar(){
      try {
        this.load = true;
        const { data } = await tgPaymentInvoice(String(this.customAmount));
        console.log('data',data?.data)
        this.load = false;
        this.$tg.openInvoice(data?.data, (status) => {
          if (status == "paid") {
            this.$toast2("Submission successful. Claiming in progress!", "success");
            this.$emit("input", false);
          }
        });
      } catch (e) {
        console.error(e);
        this.load = false;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.start-boosting {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .first-dialog-title {
    background: rgba(0, 129, 248, 0.1);
    text-shadow: 0px 0px 8px #6172f3;
  }
  .paragraph {
    padding: 16px 24px;
    margin-bottom: 8px;
    background: url("/img/booster/svg/fringe-bg.svg");
  }

  .deposit-control {
    border-radius: 4px;
    border: 1px solid #43e7fa;
    background: rgba(0, 48, 92, 0.8);
  }

  .deposit-input[type="number"]::-webkit-inner-spin-button,
  .deposit-input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .deposit-input[type="number"] {
    -moz-appearance: textfield;
  }

  // .network-select {
  //   color: #fff;
  //   border-radius: 4px;
  //   border: 0.5px solid rgba(255, 255, 255, 0.3);
  //   background: rgba(49, 49, 49, 0.9);
  //   box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.35);
  // }
  .coinWrap {
    background: #00000080;
    border: 1px solid #8C8CA140;
    min-width: 45%;
    min-height: 48px;
    position: relative;
    border-radius: 4px;
  }

  .activeselect{
    background: #00305CCC;
    border: 1px solid;
    border-image: linear-gradient(to right, #43E7FA -22.19%, #4135FD 99.83%) 1;
    border-radius: 4px;
  }
  .discountWrap{
    position: absolute;
    right: 0;
    top: 0;
    color: #fff;
    font-size: 12px;
    padding: 0 4px;
    background: linear-gradient(90deg, #1102FC 0%, #0FE1F8 100%);
    border-top-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
}
</style>
