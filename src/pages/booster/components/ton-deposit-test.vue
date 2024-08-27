<template>
  <v-overlay v-model="showoverlay" opacity="1">
    <div class="start-boosting d-flex flex-column justify-center">
      <img
        class="close-btn"
        @click="showoverlay = false"
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
            />
            <span class="num">,000,000</span>
            <span class="ml-1 fz-14">LAND</span>
          </div>
        </div>
        <div class="paragraph d-flex align-center justify-space-between">
          <div>Token</div>
          <div>
            <div class="d-flex align-center px-3 py-2" style="gap: 12px">
              <!-- <img
                width="16"
                src="/img/booster/svg/choose-token-active.svg"
                alt=""
              /> -->
              <div class="d-flex align-center">
                <img width="24" src="/img/booster/ton-icon.png" alt="" />
                <span class="ml-1">Toncoin</span>
              </div>
            </div>
          </div>
        </div>

        <div class="fz-12 text-center">
          Claiming LAND may take some time. Please wait.
        </div>

        <div
          class="act-btn d-flex align-center justify-center mt-10"
          style="gap: 16px"
        >
          <v-btn
            outlined
            color="rgba(255, 255, 255, 0.60)"
            @click="showoverlay = false"
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
            @click="handleDeposit"
            >Claim</v-btn
          >
        </div>

        <button @click="getLastHash">Get Last Transaction</button>
      </div>
    </div>
  </v-overlay>
</template>

<script>
import { mapState } from "vuex";
import { TonConnectUI } from "@tonconnect/ui";
import {
  Address,
  TonClient,
  Cell,
  beginCell,
  storeStateInit,
  toNano,
} from "@ton/ton";
import axios from "axios";

export default {
  props: {
    value: Boolean,
    depositLand: {
      type: Number,
      default: 0,
    },
    report: Boolean,
  },

  data() {
    return {
      showoverlay: true,
      tonConnectUI: null,
      load: false,
      customLand: "",
      tonClient: null,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    connected() {
      if (this.tonConnectUI) {
        return this.tonConnectUI.connected;
      }
      return false;
    },

    customAmount() {
      if (this.depositLand == 0) {
        return this.customLand * 1e6;
      }
      return this.depositLand;
    },
  },
  mounted() {
    const tonConnectUI = new TonConnectUI({
      manifestUrl: "https://dashboard.4everland.org/tonconnect-manifest.json",
    });
    this.tonConnectUI = tonConnectUI;
    this.tonConnectUI.onStatusChange((wallet) => {
      if (
        wallet &&
        wallet.connectItems?.tonProof &&
        "proof" in wallet.connectItems.tonProof
      ) {
        console.log(wallet.connectItems.tonProof, "-----");
      }
    });

    const tonClient = new TonClient({
      endpoint: "https://toncenter.com/api/v2/jsonRPC",
    });
    this.tonClient = tonClient;
  },
  methods: {
    // async getTxs() {
    //   try {
    //     console.log(this.tonConnectUI.account);
    //     if (this.tonConnectUI.account.address) {
    //       const data = await this.tonClient.getTransactions(
    //         Address.parse(this.tonConnectUI.account.address),
    //         {
    //           limit: 10,
    //         }
    //       );

    //       // const data = await this.tonClient.getTransaction(
    //       //   Address.parse(this.tonConnectUI.account.address),
    //       //   "0",
    //       //   "28b666c83471b0db08f9a6116b1f906b59df2cae9d9809aa2e88f8ff30cf1957"
    //       // );
    //       console.log(data);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    async handleDeposit() {
      if (!this.connected) {
        await this.tonConnectUI.connectWallet();
      }
      let payload = JSON.stringify({
        uid: "580fa3ae794f4998a358389d25a60667",
      });

      const body = beginCell()
        .storeUint(0, 32)
        .storeStringTail(payload)
        .endCell();

      const { data } = await axios.get(
        "https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026"
      );
      let price = data.parsed[0].price.price;

      const amount = ((200000 / 1e6 / price) * 1e17 * 1.05).toFixed(0);
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

        this.transformBoc(result.boc);
        this.$toast2("Submission successful. Claiming in progress!", "success");
        this.$emit("input", false);
      } catch (e) {
        console.error(e);
      }
    },

    transformBoc(boc) {
      const cell = Cell.fromBase64(boc);
      const buffer = cell.hash();
      const hashHex = buffer.toString("hex");
      console.log(hashHex);
    },

    async getLastHash() {
      if (!this.connected) {
        await this.tonConnectUI.connectWallet();
      }
      const data = await this.tonClient.getContractState(
        Address.parse(this.tonConnectUI.account.address)
      );
      console.log(data, "last-data");
    },
    // setTonDepositHash(hash) {
    //   let hashJson = localStorage.getItem("ton_deposit_hash");
    //   if (!hashJson) {
    //     localStorage.setItem("ton_deposit_hash", JSON.stringify([hash]));
    //   } else {
    //     let hashArr = JSON.parse(hashJson);
    //     hashArr.push(hash);
    //     localStorage.setItem("ton_deposit_hash", JSON.stringify(hashArr));
    //   }
    // },

    // async handleDepositUSDT() {
    //   if (!this.connected) return this.handleShowModel();
    //   try {
    //     const jettonWalletContract = await this.initJettonWallet();
    //     let payload = JSON.stringify({
    //       uid: "580fa3ae794f4998a358389d25a60667",
    //     });
    //     // const body = beginCell()
    //     //   .storeUint(0xf8a7ea5, 32)
    //     //   .storeUint(0, 64)
    //     //   .storeCoins(1000000)
    //     //   .storeAddress(
    //     //     Address.parse("UQCdcwc7GXPGy8aglWg8B03LLWx_BtwF2rL5HUtqCoUp_1Ge")
    //     //   )
    //     //   .storeAddress(
    //     //     Address.parse("UQBD_LZMPv4U5DrZ9XyKOrtSYttVW05wnwQGIARIpMjnUcjk")
    //     //   )
    //     //   .storeUint(0, 1)
    //     //   .storeCoins(toNano(0.05))
    //     //   .storeUInt(0, 1)
    //     //   .endCell();

    //     const body = beginCell()
    //       .storeUint(0xf8a7ea5, 32) // jetton 转账操作码
    //       .storeUint(0, 64) // query_id:uint64
    //       .storeCoins(1000000) // amount:(VarUInteger 16) -  转账的 Jetton 金额（小数位 = 6 - jUSDT, 9 - 默认）
    //       .storeAddress(
    //         Address.parse("")
    //       ) // destination:MsgAddress
    //       .storeAddress(
    //         Address.parse("")
    //       ) // response_destination:MsgAddress
    //       .storeUint(0, 1) // custom_payload:(Maybe ^Cell)
    //       .storeCoins(toNano(0.05)) // forward_ton_amount:(VarUInteger 16)
    //       .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)
    //       .endCell();

    //     const transaction = {
    //       validUntil: Math.floor(Date.now() / 1000) + 360,
    //       messages: [
    //         {
    //           address: "",
    //           amount: toNano("0.05").toString(),
    //           payload: body.toBoc().toString("base64"),
    //         },
    //       ],
    //     };

    //     const result = await this.tonConnectUI.sendTransaction(transaction);
    //     console.log(result, "result");
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // async initJettonWallet() {
    //   const client = new TonClient({
    //     endpoint: "https://toncenter.com/api/v2/jsonRPC",
    //     apiKey:
    //       "",
    //   });

    //   const jettonWalletAddress = Address.parse(
    //     ""
    //   );
    //   let jettonWalletDataResult = await client.runMethod(
    //     jettonWalletAddress,
    //     "get_wallet_data"
    //   );
    //   jettonWalletDataResult.stack.readNumber();
    //   const ownerAddress = jettonWalletDataResult.stack.readAddress();
    //   const jettonMasterAddress = jettonWalletDataResult.stack.readAddress();
    //   const jettonCode = jettonWalletDataResult.stack.readCell();

    //   console.log(ownerAddress.toString(), jettonMasterAddress.toString());
    //   const jettonData = beginCell()
    //     .storeCoins(0)
    //     .storeAddress(ownerAddress)
    //     .storeAddress(jettonMasterAddress)
    //     .storeRef(jettonCode)
    //     .endCell();

    //   const stateInit = {
    //     code: jettonCode,
    //     data: jettonData,
    //   };

    //   const stateInitCell = beginCell()
    //     .store(storeStateInit(stateInit))
    //     .endCell();

    //   console.log(new Address(0, stateInitCell.hash()));

    //   return new Address(0, stateInitCell.hash());
    // },
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
}
</style>
