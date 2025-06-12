<template>
  <div>
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:item="{ item }">
          <router-link
            v-if="!item.disabled"
            :to="item.to"
            class="breadcrumb-link"
          >
            {{ item.text }}
          </router-link>
          <span v-else>
            {{ item.text }}
          </span>
        </template>
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <div class="deposite-container d-flex flex-column flex-md-row pa-md-6">
      <div class="deposite-content flex-1 h-flex">
        <div class="purchase-plate">
          <h2 class="fz-16">Deposit</h2>
          <div class="deposite-section mt-4">
            <div class="al-c deposite-control">
              <input
                maxlength="8"
                class="deposite-input flex-1"
                v-model="landAmount"
                @input="handleInput"
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
      <div class="act-control pos-r h-flex">
        <h2 class="fz-16">Network</h2>
        <pay-network @onNetwork="onNetwork" />
        <everpay-bar
          ref="everpay"
          class="flex-1"
          @onEverpay="onEverpay"
          v-if="isEverpay"
          :payAmounts="payAmounts"
        ></everpay-bar>
        <pay-coin
          v-else
          v-model="coinSelect"
          class="flex-1"
          ref="payCoin"
          :chainId="chainId"
          @onSelectCoin="handleSelectCoin"
        ></pay-coin>

        <div class="pay-confirm-container pos-a">
          <div class="pay-confirm primary pa-4 al-c space-btw">
            <div class="amout-info">
              <div class="fz-16 fw-b">Total</div>

              <div class="mt-1">
                <span class="amount fw-b">{{ displayPrice }}</span>
                <span class="unit fz-14 ml-1">{{ CoinType }}</span>
              </div>
            </div>
            <!-- everpay confirm btn -->
            <div
              class="confirm-btn fw-b cursor-p"
              v-ripple
              v-if="isEverpay"
              @click="handleEverpayPayment"
              :class="everpayDisabled ? 'disabled' : ''"
            >
              Confirm
            </div>
            <!-- eth bsc another payment btn -->

            <div
              class="confirm-btn fw-b cursor-p"
              v-ripple
              :class="ethAmount.toString() == '0' ? 'disabled' : ''"
              v-else-if="coinSelect == 'ETH' || coinSelect == 'BNB'"
              @click="handleRechargeLand"
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
              <v-btn
                v-show="checkApproving"
                text
                :loading="true"
                class="primary--text"
              >
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
  </div>
</template>

<script>
import { custom4everPriceFeedAddress, Bsc4everPriceFeed, Token4ever, BscToken4ever } from "../../plugins/pay/contracts/contracts-addr";
import payNetwork from "./component/pay-network.vue";
import payCoin from "./component/pay-coin.vue";
import everpayBar from "./component/everpay-bar.vue";
import resouceCounter from "./component/resouce-counter.vue";
import rechargeStepDialog from "./component/recharge-step-dialog.vue";
import { mapState } from "vuex";
import { BigNumber, providers } from "ethers";
import * as zksync from "zksync";
import debounce from "../../plugins/debounce";
import {
  parseUnits,
  parseEther,
  formatEther,
  formatUnits,
} from "ethers/lib/utils";
import { ICoin__factory, BlastOracleLand__factory, ETHOracleLand__factory } from "@4everland-contracts";
import { getProvider } from "@/plugins/ens";
import uidToEuid from "@/utils/uid2euid";
import mixin from "./mixin";
import { Web3Provider } from "zksync-web3";
const uint256Max = BigNumber.from("1").shl(256).sub(1);
const abi4everPrice = require("@/plugins/pay/abi-fetch-4everprice.json");

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
      ethAmount: BigNumber.from("0"),
      blastUnitPrice: BigNumber.from("0"),
      token4everUnitPrice: BigNumber.from("0"),
      token4everAmount: BigNumber.from("0"),
      token4everBscUnitPrice: BigNumber.from("0"),
      token4everBscAmount: BigNumber.from("0"),
      curAmountDecimals: 18,
      chainId: 0,
      rechargeSuccess: false,
      checkApproving: false,
      approving: false,
      depositing: false,
      everpayPayInfo: {},
      btnDisabled: true,
      collectionAddress: this.$inDev
        ? "0xA8425124C2B26E6b52983aFfbB5176187375CdC8"
        : "0xb7b4360f7f6298de2e7a11009270f35f189bd77e",
      blastUnitPriceTimer: null,
      breadcrumbsItems: [
        {
          text: "Billing",
          disabled: false,
          to: "/billing",
        },
        {
          text: "Deposit",
          disabled: true,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      connectAddr: (s) => s.connectAddr,
      teamId: (s) => s.teamId,
      onChain: (s) => s.onChain,
      isZksyncLite: (s) => s.isZksyncLite,
      userInfo: (s) => s.userInfo,
      isEverpay: (s) => s.isEverpay,
    }),
    signer() {
      let provider = new providers.Web3Provider(this.walletObj);
      if (this.chainId == (this.$inDev ? "280" : "324")) {
        provider = new Web3Provider(this.walletObj);
      }
      return provider.getSigner();
    },
    isApproved() {
      return this.allowance.gte(this.payAmounts);
    },
    displayPrice() {
      if (this.coinSelect == "ETH" || this.coinSelect == "BNB") {
        return (formatEther(this.ethAmount) * 1).toFixed(5);
      } else if(this.coinSelect == "4EVER" && this.coinAddr == Token4ever){
        return this.token4everAmount.toString();
      } else if(this.coinSelect == "4EVER" && this.coinAddr == BscToken4ever){
        return this.token4everBscAmount.toString();
      } else {
        return this.usdcAmount.toString();
      }
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
      return ICoin__factory.connect(this.coinAddr, this.signer);
    },
    LandRecharge() {
      return BlastOracleLand__factory.connect(
        this.landRechargeAddr,
        this.signer
      );
    },
    LandEthRecharge() {
      return ETHOracleLand__factory.connect(
        this.landRechargeAddr,
        this.signer
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
      // console.log('curChainInfo',this.curChainInfo.coin,coinType);
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
    everpayDisabled() {
      return this.payAmounts.toString() == "0";
    },
  },
  mounted() {
    this.walletObj.on("accountsChanged", (val) => {
      this.$store.commit("SET_CONNECT_ADDR", val[0]);
      this.checkApproved();
    });
  },

  methods: {
    async onNetwork(chainId) {
      console.log(chainId, "onNetwork---");
      if (this.chainAddrs.findIndex((it) => it.chainId == chainId) == -1) {
        this.btnDisabled = true;
      } else {
        this.btnDisabled = false;
      }
      this.chainId = chainId;
      this.coinSelect = "USDC";
      if (chainId == 81457 || chainId == 167000 || this.isZksyncLite) {
        this.coinSelect = "ETH";
        console.log("ETH");
        await this.getBlastEthUnitPrice();
        if (this.blastUnitPriceTimer) {
          clearInterval(this.blastUnitPriceTimer);
        }
        this.blastUnitPriceTimer = setInterval(
          this.getBlastEthUnitPrice,
          20000
        );
      } else if (
        chainId == 56 ||
        chainId == 97 ||
        chainId == 204 ||
        chainId == 5611
      ) {

        this.coinSelect = "BNB";
        // if (chainId == 56 || chainId == 97){
        //   //  this.coinSelect = "4EVER";
        //    await this.getBsc4everUnitPrice();
        // }
        await this.getBlastEthUnitPrice();
        if (this.blastUnitPriceTimer) {
          clearInterval(this.blastUnitPriceTimer);
        }
        this.blastUnitPriceTimer = setInterval(
          this.getBlastEthUnitPrice,
          20000
        );
      } else if (
        chainId == 1
      ) {
        this.coinSelect = "4EVER";
        await this.get4everUnitPrice();
        if (this.blastUnitPriceTimer) {
          clearInterval(this.blastUnitPriceTimer);
        }
        this.blastUnitPriceTimer = setInterval(
          this.getBlastEthUnitPrice,
          20000
        );
      } else {
        if (this.blastUnitPriceTimer) {
          clearInterval(this.blastUnitPriceTimer);
        }
        this.checkApproved();
      }
    },
    async handleRechargeLand() {
      this.depositing = true;

      if (this.isZksyncLite) {
        try {
          // check main eth
          this.$loading();
          const zkprovider = await zksync.getDefaultProvider("mainnet");
          // eth signer
          const provider = new providers.Web3Provider(this.walletObj);
          const signer = provider.getSigner();
          const walletAddress = await signer.getAddress();
          if (walletAddress.toLowerCase() != this.userInfo.wallet.address)
            return;
          const wallet = await zksync.Wallet.fromEthSigner(signer, zkprovider);
          const accountState = await wallet.getAccountState();
          console.log(accountState);
          if (accountState.id) {
            const isSigningKeySet = await wallet.isSigningKeySet();
            console.log("isSigningKeySet", isSigningKeySet);
            if (!isSigningKeySet) {
              const changeKeyTx = await wallet.setSigningKey({
                feeToken: "ETH",
                // ethAuthType: "ECDSA",
                ethAuthType: "ECDSALegacyMessage",
                // fee: utils.parseEther("0.0006"),
              });
              // console.log("setSigningKey", changeKeyTx);
              const changeKeyTxReceipt = await changeKeyTx.awaitReceipt();
              console.log("changeKeyTxReceipt", changeKeyTxReceipt);
            }
            console.log("accountState.committed", accountState.committed);
            const balance = BigNumber.from(
              accountState.committed.balances["ETH"] || "0"
            );

            console.log(
              this.ethAmount,
              zksync.utils.closestPackableTransactionAmount(this.ethAmount)
            );

            if (!balance.gt(this.ethAmount)) {
              throw new Error("insufficient balance");
            }
            const zkwalletFor4Everland = this.collectionAddress.toLowerCase();
            const tx = await wallet.syncTransfer({
              to: zkwalletFor4Everland,
              token: "ETH",
              amount: zksync.utils.closestPackableTransactionAmount(
                this.ethAmount
              ),

              // fee: utils.parseEther("0.0003"),
            });
            console.log("tx", tx);
            console.log(tx.txHash);
            const receipt = await tx.awaitReceipt();
            console.log("receipt", receipt);
            let hash = tx.txHash.replace("sync-tx:", "0x");
            this.$http.post("$bill-consume/recharge_agent/report", {
              address: accountState.address,
              hash,
              source: 1,
            });
            // const records = await this.searchZySyncRecord();
            // if (records.length) {
            //   await this.registerSuccess(records[0].txHash);
            // }
            this.$loading.close();

            // notify server
          } else {
            throw new Error(
              "Your zkSync account does't have enough ETH, please recharge it."
            );
          }
        } catch (error) {
          this.onErr(error);
        }
      } else {
        try {
          let receipt = "";
          if (this.coinSelect == "ETH" || this.coinSelect == "BNB") {
            if (this.ethAmount.toString() == "0") return;
            this.$loading();
            let tx = await this.LandRecharge.mintByETH(this.euid, {
              value: this.ethAmount,
            });
            receipt = await tx.wait();
            this.$loading.close();
          } else if(this.coinSelect == "4EVER" && this.coinAddr == Token4ever){
            if (this.token4everAmount.toString() == "0") return;
            this.$loading();
            const _amount = parseEther(this.token4everAmount.toString());
            console.log('amount',_amount);
            let tx = await this.LandEthRecharge.mintBy4EVER(this.euid, _amount);
            receipt = await tx.wait();
            this.$loading.close();
          } else if(this.coinSelect == "4EVER" && this.coinAddr == BscToken4ever){
            if (this.token4everBscAmount.toString() == "0") return;
            this.$loading();
            const _amount = parseEther(this.token4everBscAmount.toString());
            console.log('amount',_amount);
            let tx = await this.LandEthRecharge.mintBy4EVER(this.euid, _amount);
            receipt = await tx.wait();
            this.$loading.close();
          } else {
            const tx = await this.LandRecharge.mint(
              this.coinAddr,
              this.euid, // euid
              this.payAmounts
            );
            receipt = await tx.wait();
            console.log(receipt);
          }
          console.log("recharge success");
          this.rechargeSuccess = true;
          this.transactionCache(receipt.transactionHash);
          this.$store.dispatch("checkOnChain");
          if (this.coinSelect == "ETH" || this.coinSelect == "BNB") {
            this.$router.push("/billing/records?tab=Deposit History");
          }

          this.$refs.payCoin.fetchAllBalance();
        } catch (error) {
          this.onErr(error);
        }
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
        console.log("gas", gas);
        let gasPrice = await this.ERC20.provider.getGasPrice();

        const tx = await this.ERC20.approve(this.landRechargeAddr, uint256Max, {
          gasLimit: gas.mul(15).div(10),
          gasPrice: gasPrice.mul(12).div(10),
        });
        console.log("tx", tx);
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
      // console.log("handleSelectCoin", this.coinSelect);
      if (this.coinSelect == "ETH" || this.coinSelect == "BNB") {
        this.getBlastEthUnitPrice();
      } else if(this.coinSelect == "4EVER" && this.coinAddr == Token4ever) {
        await this.get4everUnitPrice();
        await this.checkApproved();
        let value = this.usdcAmount
            .mul((1e18).toString())
            .mul((1e18).toString())
            .div(this.token4everUnitPrice);
        this.token4everAmount = value;
      } else if(this.coinSelect == "4EVER" && this.coinAddr == BscToken4ever) {
        await this.getBsc4everUnitPrice();
        await this.checkApproved();
        let value = this.usdcAmount
            .mul((1e18).toString())
            .div(this.token4everBscUnitPrice);
            console.log('value', value);
        this.token4everBscAmount = value;
      } else {
        await this.checkApproved();
      }
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
      this.handleInput();
    },
    onEverpay(item) {
      this.everpayPayInfo = item;
    },
    async handleEverpayPayment() {
      if (this.everpayDisabled) return;
      // this.everpayPayInfo.balance <= this.landAmount
      const provider = getProvider();
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const balance = parseEther(this.everpayPayInfo.balance.toString());

      let landAmount = parseEther(this.landAmount);
      if (balance.lt(landAmount))
        return this.$alert(
          "Insufficient balance, please deposit and try again.",
          "alert"
        );
      if (this.everpayPayInfo.symbol == "DAI") {
        landAmount = formatEther(landAmount);
      } else {
        landAmount = formatUnits(landAmount.div(10 ** 12), 6);
      }

      const everpay = new window.Everpay.default({
        account,
        chainType: "ethereum",
        ethConnectedSigner: signer,
      });
      const data = await everpay.transfer({
        tag: this.everpayPayInfo.tag,
        amount: landAmount,
        to: this.$inDev
          ? "0xd8b38301655FaeE94C43f7121189E3E0f8973dd0"
          : "0xb7B4360F7F6298dE2e7a11009270F35F189Bd77E",
        data: {
          account: this.teamId,
        },
      });
      console.log(data);
      this.$http.post("$bill-consume/recharge_agent/report", {
        address: account,
        hash: data.everHash,
        source: 0,
      });
      await this.$alert(
        "Deposit successful! The 4EVER cross-chain bridge is in action, using USDC on Polygon for the final step. Please wait patiently for your LAND to be credited."
      );

      this.$router.push("/billing");
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
      } else if (
        /exceeds balance/i.test(msg) ||
        msg == "overflow" ||
        /insufficient funds/i.test(msg) ||
        /insufficient-balance/i.test(msg)
      ) {
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
        originalValue:
          this.coinSelect == "ETH" || this.coinSelect == "BNB"
            ? this.ethAmount.toString()
            : "",
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
    handleInput() {
      this.landAmount = this.landAmount.replace(/[^\d]/g, "");
      if (this.landAmount) {
        this.usdcAmount = BigNumber.from(this.landAmount);
      } else {
        this.usdcAmount = BigNumber.from("0");
        this.ethAmount = BigNumber.from("0");
      }
      if (this.coinSelect == "ETH" || this.coinSelect == "BNB") {
        debounce(() => {
          let value = this.usdcAmount
            .mul((1e18).toString())
            .mul((1e18).toString())
            .div(this.blastUnitPrice);
            console.log('eth',value);
          this.ethAmount = value;
        });
      }
      if(this.coinSelect == "4EVER" && this.coinAddr == Token4ever) {
        debounce(() => {

          let value = this.usdcAmount
            .mul((1e18).toString())
            .mul((1e18).toString())
            .div(this.token4everUnitPrice);
          this.token4everAmount = value;
        });
      }
      if(this.coinSelect == "4EVER" && this.coinAddr == BscToken4ever) {
        debounce(() => {

          let value = this.usdcAmount
            .mul((1e18).toString())
            .div(this.token4everBscUnitPrice);
          this.token4everBscAmount = value;
        });
      }
    },
    async getBlastEthUnitPrice() {
      try {
        let provider = new providers.Web3Provider(this.walletObj);
        const signer = provider.getSigner();
        const BlastOracleLand = BlastOracleLand__factory.connect(
          this.landRechargeAddr,
          signer
        );
        this.blastUnitPrice = await BlastOracleLand.callStatic.fetchPrice();

      } catch (error) {
        console.log(error);
      }
    },
    async get4everUnitPrice() {
      try {
        //if(this.blastUnitPrice.toString() == "0") {
          await this.getBlastEthUnitPrice();
        //}
        
        const token4everEthprice = await this.fetchPrice(custom4everPriceFeedAddress);
        this.token4everUnitPrice = BigNumber.from(token4everEthprice).mul(this.blastUnitPrice);
        console.log(this.token4everUnitPrice.toString());
      } catch (error) {
        console.log(error);
      }
    },
    async getBsc4everUnitPrice() {
      try {
        
        const token4everbscprice = await this.fetchPrice(Bsc4everPriceFeed);
        console.log('token4everbscprice', token4everbscprice);
        this.token4everBscUnitPrice = BigNumber.from(token4everbscprice);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchPrice(tokenAddress) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        let address = accounts[0];

        if (!address) return;
        const provider = new ethers.providers.Web3Provider(this.walletObj);
        if (tokenAddress) {
          const contract = new ethers.Contract(
            tokenAddress,
            abi4everPrice.abi,
            provider
          );
          
          const tokenprice = await contract.fetchPrice(this.curChainInfo.coin['4ever']);
          console.log('tokenBalance',tokenprice);
          
          return tokenprice;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  watch: {
    blastUnitPrice() {
      let value = this.usdcAmount
        .mul((1e18).toString())
        .mul((1e18).toString())
        .div(this.blastUnitPrice);
      this.ethAmount = value;
    },
    isZksyncLite(val) {
      if (val) {
        this.chainId = 1;
        this.coinSelect = "ETH";
        this.getBlastEthUnitPrice();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .act-control {
    width: 100% !important;
  }
  .breadcrumbs {
    position: static !important;
  }
  .v-breadcrumbs {
    padding: 0 0 16px 0;
    margin-top: -12px;
  }
}
.breadcrumbs {
  position: fixed;
  top: 0;
  left: 230px;
  z-index: 10;
}
.deposite-container {
  min-height: 100%;
  gap: 24px;
  align-items: stretch;
}
.deposite-control {
  border: 1px solid #cbd5e1;
  border-radius: 4px;
}
.deposite-input {
  min-width: 20px;
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
  background: var(--v-background3-base);
  box-sizing: border-box;
  .pay-confirm-container {
    width: 100%;
    left: 0;
    bottom: 0;
    border-radius: 0px 0px 8px 8px;
    .pay-confirm {
      border-radius: 0 0 8px 8px;
      color: #fff;
      .redeem-trigger {
        color: var(--v-primary-base);
      }
      .amount {
        font-size: 28px;
      }
      .unit {
        color: #e2e8f0;
        font-family: "DIN Alternate";
      }
      .confirm-btn {
        padding: 15px 46px;
        border-radius: 4px;
        background: #fff;
        color: #000;
      }
      .confirm-btn.disabled {
        color: #fff;
      }

      .confirm-tip {
        width: 336px;
        padding: 8px;
        font-size: 12px;
        font-weight: normal;
        top: -65px;
        right: 0;
        border-radius: 4px;
        background: var(--v-background3-base);
        color: var(--v-primary-base);
      }
      .confirm-tip::after {
        display: block;
        content: "";
        position: absolute;
        right: 30%;
        bottom: -20px;
        border: 10px solid transparent;
        border-top-color: var(--v-background3-base);
      }
    }
  }
}
</style>
