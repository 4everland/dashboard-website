<template>
  <div class="main-wrap h-flex space-btw">
    <div>
      <span>'coin addr:' {{ coinAddr }}</span>
      <span class="ml-4">'land recharge addr:' {{ landRechargeAddr }}</span>
    </div>
    <div>
      <h2 class="fz-16">Purchase</h2>
      <div class="deposite-section mt-4">
        <div class="al-c deposite-control">
          <input
            class="deposite-input flex-1"
            v-model="landAmount"
            type="text"
          />
          <span class="num">,000,000</span>
          <span class="d-ib deposite-btn">LAND</span>
        </div>
        <p class="mt-1 fz-12">1,000,000 LAND = 1U</p>
      </div>

      <h2 class="fz-16 mt-6">Network</h2>
      <pay-network
        class="mt-4"
        @onNetwork="onNetwork"
        :allow="allowNetwork"
        ref="payNetwork"
      />
    </div>
    <resouce-counter></resouce-counter>

    <div class="pay-confirm-container">
      <div class="pay-confirm pa-4 al-c space-btw">
        <div class="amout-info">
          <div class="fz-16 fw-b">Total</div>

          <div class="mt-1">
            <span class="amount fw-b">{{ usdcAmount.toString() }}</span>
            <span class="unit fz-14 ml-1">USDC</span>

            {{ payAmounts.toString() }}
          </div>
        </div>
        <div class="confirm-btn fw-b" v-ripple @click="handleAct">
          {{ confirmText }}
        </div>
      </div>
    </div>

    <recharge-step-dialog
      ref="rechargeDialog"
      :step="step"
      @handleApprove="handleApprove"
      @handleConfirm="handleRechargeLand"
    ></recharge-step-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import payNetwork from "./component/pay-network.vue";
import resouceCounter from "./component/resouce-counter.vue";
import rechargeStepDialog from "./component/recharge-step-dialog.vue";

import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { ICoin__factory } from "@4everland/land-v5";

import mixin from "./mixin";
const uint256Max = BigNumber.from("1").shl(256).sub(1);

export default {
  mixins: [mixin],
  components: {
    payNetwork,
    resouceCounter,
    rechargeStepDialog,
  },
  data() {
    return {
      landAmount: "",
      allowance: BigNumber.from("0"),
      usdcAmount: BigNumber.from("0"),
      curAmountDecimals: 18,
      chainName: "Polygon",
      rechargeSuccess: false,
    };
  },
  computed: {
    ...mapState({
      onChain: (s) => s.onChain,
      connectAddr: (s) => s.connectAddr,
      chainContract: (s) => s.moduleResource.chainContract,
    }),
    allowNetwork() {
      if (this.onChain) {
        // return ["Polygon", "Ethereum", "BSC"];
        if (this.$inDev) {
          return ["Polygon", "Ethereum", "BSC", "zkSync", "everPay"];
        }
        return ["Polygon", "Ethereum", "BSC", "Arbitrum", "zkSync", "everPay"];
      } else {
        return ["Polygon"];
      }
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
      if (!this.landAmount) return "";
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
    curChainInfo() {
      return this.chainAddrs.find((it) => it.name == this.chainName);
    },
    landRechargeAddr() {
      return this.curChainInfo.landRecharge;
    },
    coinAddr() {
      return this.curChainInfo.coin.usdc;
    },
    step() {
      if (this.isApproved) return 2;
      if (this.rechargeSuccess) return 4;
      return 1;
    },
  },
  mounted() {
    this.checkApproved();
  },
  methods: {
    onNetwork(chainName) {
      this.chainName = chainName;
    },
    async handleRechargeLand() {
      try {
        const tx = await this.chainContract.LandRecharge.mint(
          this.coinAddr,
          "0x866925e79c447352711bf740183aa3cc67371e16000000000000000000000034", // uid
          this.payAmounts
        );
        const receipt = await tx.wait();
        console.log(receipt);
        this.rechargeSuccess = true;
      } catch (error) {
        console.log(error);
      }
    },
    async checkApproved() {
      try {
        const allowance = await this.ERC20.allowance(
          "0x866925e79c447352711bF740183AA3Cc67371E16",
          this.landRechargeAddr
        );
        this.curAmountDecimals = await this.ERC20.decimals();
        console.log(allowance, "allowance");
        // console.log(this.curAmountDecimals);
        this.allowance = allowance;
      } catch (error) {
        //
        console.log(error);

        // if locked wallet  throw Error account
        this.getAccount();
      }
    },
    async handleApprove() {
      console.log(222);
      let gas = await this.ERC20.estimateGas.approve(
        this.landRechargeAddr,
        uint256Max
      );
      console.log("gas", gas);
      let gasPrice = await this.ERC20.provider.getGasPrice();
      const tx = await this.ERC20.approve(this.landRechargeAddr, uint256Max, {
        gasLimit: gas.mul(15).div(10),
        gasPrice: gasPrice.mul(12).div(10),
      });
      console.log("tx", tx);
      const receipt = await tx.wait();
      console.log(receipt);
      this.checkApproved();
    },
    handleAct() {
      // this.showDialog = true
      this.$refs.rechargeDialog.showDialog = true;
      // if (this.isApproved) {
      //   this.handleRechargeLand();
      // } else {
      //   this.handleApprove();
      // }
    },

    async getAccount() {
      await this.walletObj.request({
        method: "eth_requestAccounts",
      });
    },
  },
  watch: {
    landAmount() {
      this.landAmount = this.landAmount.replace(/[^\d]/g, "");
      if (this.landAmount) {
        this.usdcAmount = BigNumber.from(this.landAmount);
      } else {
        this.landAmount = "0";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.deposite-control {
  border: 1px solid #cbd5e1;
  border-radius: 4px;
}
.deposite-input {
  background: #fff;
  padding: 13px 0;
  text-indent: 20px;
  text-align: right;
  font-size: 20px;
  border-radius: 4px 0 0 4px;
  font-family: "DIN Alternate";
}
.num {
  font-family: "DIN Alternate";
  font-size: 20px;
  padding: 13px 10px 13px 0;
  color: #64748b;
}
.deposite-btn {
  padding: 16px 41px;
  background: #f1f5f9;
  border-radius: 0 4px 4px 0;
}

.pay-confirm {
  border-radius: 8px;
  background: #f3e8ff;
  .redeem-trigger {
    color: #735ea1;
  }
  .amount {
    font-size: 28px;
  }
  .unit {
    color: #64748b;
  }
  .confirm-btn {
    color: #fff;
    padding: 15px 46px;
    border-radius: 4px;
    background: #735ea1;
  }
}
</style>
