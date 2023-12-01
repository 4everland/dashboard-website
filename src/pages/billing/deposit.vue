<template>
  <div class="deposite-container d-flex pa-6">
    <div class="deposite-content flex-1 h-flex">
      <!-- <div>
        <span>'coin addr:' {{ coinAddr }}</span>
        <span class="ml-4">'land recharge addr:' {{ landRechargeAddr }}</span>
      </div> -->
      <div class="purchase-plate">
        <h2 class="fz-16">Deposit</h2>
        <div class="deposite-section mt-4">
          <div class="al-c deposite-control">
            <input
              maxlength="8"
              class="deposite-input flex-1"
              v-model="landAmount"
              type="text"
            />
            <span class="num">,000,000</span>
            <span class="d-ib deposite-btn fz-14">LAND</span>
          </div>
          <div class="mt-1 fz-12">
            1000,000 LAND is equivalent to 1 USD, and it cannot be withdrawn.
          </div>
        </div>
      </div>

      <resouce-counter
        @estimateInput="estimateInput"
        :inputVal="landAmount"
      ></resouce-counter>
    </div>
    <div class="act-control ml-6 pos-r">
      <h2 class="fz-16">Network</h2>
      <pay-network
        @onNetwork="onNetwork"
        :allow="allowNetwork"
        ref="payNetwork"
      />
      <everpay-bar
        ref="everpay"
        @onEverpay="onEverpay"
        v-if="isEverpay"
        :payAmounts="payAmounts"
      ></everpay-bar>
      <pay-coin
        v-else
        class="mt-4"
        :chainId="chainId"
        @onSelectCoin="handleSelectCoin"
      ></pay-coin>
      <div class="pay-confirm-container pos-a">
        <div class="pay-confirm pa-4 al-c space-btw">
          <div class="amout-info">
            <div class="fz-16 fw-b">Total</div>

            <div class="mt-1">
              <span class="amount fw-b">{{ usdcAmount.toString() }}</span>
              <span class="unit fz-14 ml-1">{{ CoinType }}</span>
            </div>
          </div>
          <!-- everpay confirm btn -->
          <div
            class="confirm-btn fw-b cursor-p"
            v-ripple
            v-if="isEverpay"
            @click="handleEverpayPayment"
          >
            Confirm
          </div>
          <!-- other confirm btn -->
          <div
            class="confirm-btn fw-b cursor-p pos-r"
            :class="disabled ? 'disabled' : ''"
            v-ripple="!checkApproving"
            v-else
            @click="
              () => {
                if (disabled) return '';
                return checkApproving ? '' : handleShowStep();
              }
            "
          >
            <v-btn v-show="checkApproving" text :loading="true" color="#735EA1">
            </v-btn>
            <span v-show="!checkApproving">
              {{ confirmText }}
            </span>

            <div class="pos-a confirm-tip" v-if="!onChain">
              After your first deposit, we'll upgrade you to a Standard User
              with free on-chain identity minting.
            </div>
          </div>
        </div>
      </div>
    </div>

    <recharge-step-dialog
      ref="rechargeDialog"
      :step="step"
      :approving="approving"
      :depositing="depositing"
      @handleApprove="handleApprove"
      @handleConfirm="handleRechargeLand"
      @handleClose="handleClose"
    ></recharge-step-dialog>
  </div>
</template>

<script>
import payNetwork from "./component/pay-network.vue";
import payCoin from "./component/pay-coin.vue";
import everpayBar from "./component/everpay-bar.vue";
import resouceCounter from "./component/resouce-counter.vue";
import rechargeStepDialog from "./component/recharge-step-dialog.vue";
import { mapState } from "vuex";
import { BigNumber } from "ethers";
import {
  parseUnits,
  parseEther,
  formatEther,
  formatUnits,
} from "ethers/lib/utils";
import { ICoin__factory, Land__factory } from "@4everland-contracts";
import { getProvider } from "@/plugins/ens";

import uidToEuid from "@/utils/uid2euid";
import mixin from "./mixin";
const uint256Max = BigNumber.from("1").shl(256).sub(1);

export default {
  mixins: [mixin],
  components: {
    payNetwork,
    resouceCounter,
    rechargeStepDialog,
    payCoin,
    everpayBar,
  },
  data() {
    return {
      coinSelect: "USDC",
      landAmount: "",
      allowance: BigNumber.from("0"),
      usdcAmount: BigNumber.from("0"),
      curAmountDecimals: 18,
      chainId: this.$inDev ? 80001 : 137,
      rechargeSuccess: false,
      checkApproving: false,
      approving: false,
      depositing: false,
      isEverpay: localStorage.getItem("isEverpay") ? true : false,
      everpayPayInfo: {},
      btnDisabled: true,
    };
  },
  computed: {
    ...mapState({
      connectAddr: (s) => s.connectAddr,
      chainContract: (s) => s.moduleResource.chainContract,
      teamId: (s) => s.teamId,
      onChain: (s) => s.onChain,
    }),
    allowNetwork() {
      if (this.$inDev) {
        return ["Polygon", "Ethereum", "BSC", "zkSync", "everPay"];
      }
      return ["Polygon", "Ethereum", "BSC", "Arbitrum", "zkSync", "everPay"];
    },
    isApproved() {
      return (
        this.allowance.eq(uint256Max) || this.allowance.gte(this.usdcAmount)
      );
    },
    confirmText() {
      if (this.isApproved) return "Confirm";
      return "Approve";
    },
    payAmounts() {
      if (!this.landAmount) return BigNumber.from("0");
      // return BigNumber.from(this.landAmount).mul(1e24).div(1e6);
      let amoutU = parseUnits(this.landAmount, 24).div(1e6);
      const subDecimal = 18 - this.curAmountDecimals;
      if (subDecimal > 0) {
        amoutU = amoutU.div(BigNumber.from(10 ** subDecimal));
      }

      return amoutU;
    },
    ERC20() {
      return ICoin__factory.connect(this.coinAddr, this.chainContract.signer);
    },
    LandRecharge() {
      return Land__factory.connect(
        this.landRechargeAddr,
        this.chainContract.signer
      );
    },
    curChainInfo() {
      return this.chainAddrs.find((it) => it.chainId == this.chainId);
    },
    landRechargeAddr() {
      return this.curChainInfo?.landRecharge;
    },
    coinAddr() {
      const coinType = this.coinSelect.toLowerCase();
      console.log(this.curChainInfo.coin);
      return this.curChainInfo?.coin[coinType];
    },
    step() {
      if (this.rechargeSuccess) return 4;
      if (this.isApproved) return 2;
      return 1;
    },
    euid() {
      return uidToEuid(this.teamId);
    },
    CoinType() {
      if (this.isEverpay) {
        return this.everpayPayInfo.symbol;
      }
      return this.coinSelect;
    },
    disabled() {
      return this.payAmounts.toString() == "0" || this.btnDisabled;
    },
  },
  mounted() {
    // this.checkApproved();
    this.walletObj.on("accountsChanged", (val) => {
      this.$store.commit("SET_CONNECT_ADDR", val[0]);
      this.checkApproved();
    });
  },
  methods: {
    onNetwork(chainId) {
      if (this.chainAddrs.findIndex((it) => it.chainId == chainId) == -1) {
        this.btnDisabled = true;
      } else {
        this.btnDisabled = false;
      }
      this.chainId = chainId;
      if (this.chainId == 9999999) {
        this.isEverpay = true;
      } else {
        this.isEverpay = false;
      }
      this.checkApproved();
    },
    async handleRechargeLand() {
      this.depositing = true;
      try {
        const tx = await this.LandRecharge.mint(
          this.coinAddr,
          this.euid, // euid
          this.payAmounts
        );
        const receipt = await tx.wait();
        console.log(receipt);
        console.log("recharge success");
        this.rechargeSuccess = true;

        this.transactionCache(receipt.transactionHash);
        this.$store.dispatch("checkOnChain");
      } catch (error) {
        this.onErr(error);
      }
      this.depositing = false;
    },
    async checkApproved() {
      if (!this.landRechargeAddr) return;
      this.checkApproving = true;
      if (!this.connectAddr) {
        await this.getAccount();
      }
      try {
        const allowance = await this.ERC20.allowance(
          this.connectAddr,
          this.landRechargeAddr
        );
        this.curAmountDecimals = await this.ERC20.decimals();
        console.log(allowance, "allowance");
        this.allowance = allowance;
      } catch (error) {
        console.log(error);
        // if locked wallet  throw Error account, need get account
        this.getAccount();
      }
      this.checkApproving = false;
    },
    async handleApprove() {
      this.approving = true;
      try {
        let gas = await this.ERC20.estimateGas.approve(
          this.landRechargeAddr,
          uint256Max
        );
        // console.log("gas", gas);
        let gasPrice = await this.ERC20.provider.getGasPrice();
        const tx = await this.ERC20.approve(this.landRechargeAddr, uint256Max, {
          gasLimit: gas.mul(15).div(10),
          gasPrice: gasPrice.mul(12).div(10),
        });
        // console.log("tx", tx);
        const receipt = await tx.wait();
        console.log(receipt);
      } catch (error) {
        this.onErr(error);
      }
      this.approving = false;
      this.checkApproved();
    },
    handleShowStep() {
      this.$refs.rechargeDialog.showDialog = true;
    },
    async handleSelectCoin(val) {
      this.coinSelect = val;
      await this.checkApproved();
    },
    handleClose() {
      if (this.rechargeSuccess) {
        this.landAmount = "";
        this.rechargeSuccess = false;
      }
    },
    async getAccount() {
      await this.$store.dispatch("getWalletAccount");
    },
    estimateInput(val) {
      this.landAmount = val;
    },
    onEverpay(item) {
      this.everpayPayInfo = item;
    },
    async handleEverpayPayment() {
      const provider = getProvider();
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const balance = parseEther(this.everpayPayInfo.balance.toString());
      let payAmounts = this.payAmounts;
      if (balance.lt(payAmounts))
        return this.$alert(
          "Insufficient balance, please deposit and try again.",
          "alert"
        );
      if (this.everpayPayInfo.symbol == "DAI") {
        payAmounts = formatEther(payAmounts);
      } else {
        payAmounts = formatUnits(payAmounts.div(10 ** 12), 6);
      }
      const everpay = new window.Everpay.default({
        account,
        chainType: "ethereum",
        ethConnectedSigner: signer,
      });
      const data = await everpay.transfer({
        tag: this.everpayPayInfo.tag,
        amount: payAmounts,
        to: this.$inDev
          ? "0xd8b38301655FaeE94C43f7121189E3E0f8973dd0"
          : "0xb7B4360F7F6298dE2e7a11009270F35F189Bd77E",
        data: {
          account: this.teamId,
        },
      });
      console.log(data);
      this.$alert("Recharge success!!");
      this.$refs.everpay.initEverPay();
    },
    onErr(err, retry) {
      if (!err) return console.log("---- err null");
      console.log(err);
      if (/unknown account/.test(err.message)) {
        return this.getAccount();
      }
      const { data } = err;
      let msg = err.message;
      if (data) {
        msg = data.message || msg;
      }
      if (/repriced/i.test(msg) && /replaced/i.test(msg)) {
        return this.$toast("Transaction was replaced.");
      }
      window.gtag("event", "contract_error", {
        message: msg,
      });
      if (/missing revert data/i.test(msg)) {
        msg = "Network Error";
      } else if (/user rejected/i.test(msg)) {
        msg = "Your transaction has been canceled.";
      } else if (/transaction failed/i.test(msg)) {
        msg = "Transaction Failed";
      } else if (/ipfs/.test(msg) && /invalid params/.test(msg)) {
        msg = "IPFS Storage Expired, extending service duration is required.";
      } else if (/exceeds balance/i.test(msg) || msg == "overflow") {
        msg = "Insufficient balance in your wallet.";
      } else if (msg.length > 100) {
        const mat = /^(.+)\[/.exec(msg);
        if (mat) msg = mat[1];
      }
      if (/already pending for origin/gi.test(msg)) {
        msg = "Wrong network, please switch your wallet network and try again.";
      }
      if (retry) {
        return this.$confirm(msg, "Network Error", {
          confirmText: "Retry",
        });
      }
      return this.$alert(msg, "Error");
    },

    transactionCache(txHash) {
      let transactionItem = {
        network: this.chainId.toString(),
        landAmount: this.usdcAmount
          .mul((1e18).toString())
          .mul((1e6).toString())
          .toString(),
        amount: this.usdcAmount.mul((1e18).toString()).toString(),
        txHash,
        createdAt: +new Date() / 1e3,
        status: "2",
        amountType: this.coinAddr,
      };
      let transactionList = localStorage.getItem("transactionCache");
      if (!transactionList) {
        localStorage.setItem("transactionCache", JSON.stringify([]));
        transactionList = [];
      } else {
        transactionList = JSON.parse(localStorage.getItem("transactionCache"));
      }
      transactionList.unshift(transactionItem);
      localStorage.setItem("transactionCache", JSON.stringify(transactionList));
    },
  },
  watch: {
    landAmount() {
      this.landAmount = this.landAmount.replace(/[^\d]/g, "");

      if (this.landAmount) {
        this.usdcAmount = BigNumber.from(this.landAmount);
      } else {
        this.usdcAmount = BigNumber.from("0");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.deposite-container {
  // height: 100%;
  min-height: 100%;

  align-items: stretch;
}
.deposite-control {
  border: 1px solid #cbd5e1;
  border-radius: 4px;
}
.deposite-input {
  height: 48px;
  background: #fff;
  text-indent: 20px;
  text-align: right;
  font-size: 20px;
  border-radius: 4px 0 0 4px;
  font-family: "DIN Alternate";
}
.num {
  font-family: "DIN Alternate";
  font-size: 20px;
  padding-right: 10px;
  color: #64748b;
}
.deposite-btn {
  padding: 0px 41px;
  height: 48px;
  line-height: 48px;
  background: #f1f5f9;
  border-radius: 0 4px 4px 0;
}

.deposite-content {
  // height: 100%;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #fff;
  .purchase-plate {
    padding: 18px 16px;
    border-bottom: 1px solid #cbd5e1;
  }
}
.act-control {
  width: 368px;
  padding: 24px 16px 0;
  border-radius: 8px;
  background: #f3e8ff;
  box-sizing: border-box;
  .pay-confirm-container {
    width: 100%;
    left: 0;
    bottom: 0;
    border-radius: 0px 0px 8px 8px;
    background: #735ea1;
    .pay-confirm {
      color: #fff;
      .redeem-trigger {
        color: #735ea1;
      }
      .amount {
        font-size: 28px;
      }
      .unit {
        color: #e2e8f0;
        font-family: "DIN Alternate";
      }
      .confirm-btn {
        color: #735ea1;
        padding: 15px 46px;
        border-radius: 4px;
        background: #fff;
      }
      .confirm-btn.disabled {
        color: #fff;
        background: #e2e8f0;
      }
      .confirm-tip {
        width: 336px;
        padding: 8px;
        font-size: 12px;
        font-weight: normal;
        top: -65px;
        right: 0;
        border-radius: 4px;
        background: #d8c8ec;
        color: #735ea1;
      }
      .confirm-tip::after {
        display: block;
        content: "";
        position: absolute;
        right: 30%;
        bottom: -20px;
        border: 10px solid transparent;
        border-top-color: #d8c8ec;
      }
    }
  }
}
</style>