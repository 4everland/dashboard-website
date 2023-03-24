<template>
  <div>
    <v-dialog v-model="showClaim" max-width="700" persistent>
      <div class="reward-hub-content">
        <h3>Thank You for Registering!</h3>
        <div class="mt-2 fz-14 lh-2">
          4EVERLAND offers free resource packages that help you better
          experience its services. Claim them now.
        </div>
        <v-row class="mt-2">
          <v-col :sm="6" :cols="12" v-for="item in items" :key="item.name">
            <div class="resource-item al-c">
              <img width="28" :src="item.icon" alt="" />
              <span class="resource-item-value ml-2">{{ item.value }}</span>
              <span class="ml-2 fz-12">{{ item.name }}</span>
            </div>
          </v-col>
        </v-row>
        <div class="d-flex justify-center mt-8">
          <v-btn
            color="primary"
            outlined
            @click="onCancel"
            width="200"
            class="mr-4"
          >
            Cancel
          </v-btn>

          <e-menu open-on-hover offset-y>
            <v-btn slot="ref" color="primary" dark width="200px">
              <span class="ml-2">Claim</span>
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
            <v-list>
              <v-list-item link @click="handleClaim">
                <v-list-item-title class="fz-14 al-c">
                  <img
                    src="/img/svg/billing/ic-polygon-0.svg"
                    width="18"
                    alt=""
                  />
                  <span class="ml-3">Ploygon Claim</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item link @click="handleZySyncClaim">
                <v-list-item-title class="fz-14 al-c justify-space-between">
                  <div class="al-c">
                    <img src="/img/svg/logo-no-letters.svg" width="20" alt="" />
                    <span class="ml-3">zkSync Lite(V1) Claim</span>
                  </div>

                  <e-tooltip right>
                    <v-icon
                      slot="ref"
                      size="18"
                      color="#333"
                      class="pa-1 d-ib ml-2"
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
            </v-list>
          </e-menu>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import polygonContract from "../../plugins/pay/contracts/dst-chain-contracts";
import bscContract from "../../plugins/pay/contracts/src-chain-contracts-bsc";
import arbitrumContract from "../../plugins/pay/contracts/src-chain-contracts-arbitrum";
import ethContract from "../../plugins/pay/contracts/src-chain-contracts";
import { providerAddr } from "../../plugins/pay/contracts/contracts-addr";
import { BigNumber, providers, utils } from "ethers";
import axios from "axios";
import * as zksync from "zksync";

export default {
  data() {
    return {
      showClaim: false,
      items: [
        {
          name: "IPFS Storage",
          value: "6GB",
          icon: require("/public/img/airDrop/ipfs.png"),
        },
        {
          name: "Arweave Storage",
          value: "100MB",
          icon: require("/public/img/airDrop/ar.png"),
        },
        {
          name: "Build Minutes",
          value: "250Min",
          icon: require("/public/img/airDrop/minutes.png"),
        },
        {
          name: "Bandwidth",
          value: "100GB",
          icon: require("/public/img/airDrop/balance.png"),
        },
      ],
      registerInfo: {},
      loading: false,
      contract: null,
      provider: null,
      collectionAddress: "0xb7b4360f7f6298de2e7a11009270f35f189bd77e",
      zkSyncfee: BigNumber.from("40000000000000"),
      timer: null,
    };
  },
  async created() {
    this.isRegister();

    // const register = await this.isRegister();
    // if (records.length) {
    //   this.showClaim = false;
    //   this.$emit("onUserGuide");
    // }
    this.timer = setInterval(() => {
      this.isRegister();
    }, 10000);
  },
  methods: {
    async isRegister() {
      await this.getCurrentContract();

      if (!localStorage.token) return;
      try {
        const { data } = await this.$http.get(
          "$auth/self-handled-register-apply"
        );

        this.registerInfo = data;
        if (!data.handled) {
          const isExists = await this.contract.ProviderController.accountExists(
            providerAddr,
            data.uid
          );
          const records = await this.searchZySyncRecord();
          console.log(records);
          console.log(isExists);
          if (isExists || records.length) {
            // euid exist  over
            console.log("register success");
            clearInterval(this.timer);
            await this.registerSuccess(records[0].txHash);
            this.showClaim = false;
            this.$emit("onUserGuide");
            return true;
          }
        } else {
          clearInterval(this.timer);
        }
      } catch (error) {
        console.log(error, "isRegister");
      }
      this.showClaim = !this.registerInfo.handled;
      return false;
    },

    async handleClaim() {
      try {
        this.$loading();

        await this.switchPolygon();
        await this.getCurrentContract();
        const { sign, encode } = await this.getSignAddress();
        const tx = await this.contract.ProviderController.registerAndDrip(
          providerAddr,
          this.registerInfo.uid,
          encode,
          sign
        );
        console.log(tx);
        const receipt = await tx.wait(2);
        console.log(receipt);
        await this.registerSuccess();
        this.showClaim = false;
        this.$emit("onUserGuide");
      } catch (error) {
        // this.onErr(error);
        console.log(error);
      }
      this.$loading.close();
    },

    async handleZySyncClaim() {
      try {
        // check main eth
        this.switchEth();
        this.$loading();
        const zkprovider = await zksync.getDefaultProvider("mainnet");
        // eth signer
        const signer = this.contract.provider.getSigner();
        const walletAddress = await signer.getAddress();
        if (walletAddress.toLowerCase() != this.registerInfo.wallet) return;
        const wallet = await zksync.Wallet.fromEthSigner(signer, zkprovider);
        const accountState = await wallet.getAccountState();
        console.log(accountState);
        if (accountState.id) {
          const isSigningKeySet = await wallet.isSigningKeySet();
          console.log("isSigningKeySet", isSigningKeySet);
          if (!isSigningKeySet) {
            const changeKeyTx = await wallet.setSigningKey({
              feeToken: "ETH",
              ethAuthType: "ECDSA",
              // fee: utils.parseEther("0.0006"),
            });
            console.log("setSigningKey", changeKeyTx);
            const changeKeyTxReceipt = await changeKeyTx.awaitReceipt();
            console.log("changeKeyTxReceipt", changeKeyTxReceipt);
          }
          console.log("accountState.committed", accountState.committed);
          const balance = BigNumber.from(
            accountState.committed.balances["ETH"] || "0"
          );
          // 4everland zksync lite payment fee
          const fee = this.zkSyncfee;
          if (!balance.gt(fee)) {
            throw new Error("insufficient balance");
          }
          const zkwalletFor4Everland = this.collectionAddress.toLowerCase();
          const tx = await wallet.syncTransfer({
            to: zkwalletFor4Everland,
            token: "ETH",
            amount: fee,
            // fee: utils.parseEther("0.0003"),
          });
          console.log("tx", tx);
          console.log(tx.txHash);
          const receipt = await tx.awaitReceipt();
          console.log("receipt", receipt);
          const records = await this.searchZySyncRecord();
          this.$loading.close();
          if (records.length) {
            await this.registerSuccess(records[0].txHash);
            this.showClaim = false;
            this.$emit("onUserGuide");
          }
          // notify server
        } else {
          throw new Error(
            "Your zkSync  account does't  have enough ETH, please recharge it."
          );
        }
      } catch (error) {
        console.log(error);
        this.onErr(error);
      }
      this.$loading.close();
    },
    async searchZySyncRecord() {
      try {
        const { data } = await axios.get(
          `https://api.zksync.io/api/v0.2/accounts/${this.registerInfo.wallet}/transactions?from=latest&limit=100&direction=older`
        );
        const { result } = data;
        console.log(result, "record");
        const records = result.list.filter((it) => {
          if (it.op.type != "Transfer") return false;
          return (
            (it.status == "finalized" || it.status == "committed") &&
            it.op.from.toLowerCase() ==
              this.registerInfo.wallet.toLowerCase() &&
            it.op.to.toLowerCase() == this.collectionAddress.toLowerCase() &&
            BigNumber.from(it.op.amount).gte(this.zkSyncfee)
          );
        });
        console.log(records);
        return records;
      } catch (error) {
        console.log(error);
      }
    },
    // get sign && encode(payload)
    async getSignAddress() {
      try {
        const { data } = await this.$http.get(
          "$auth/self-handled-register-sign-from-server"
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    // request for account exist
    async registerSuccess(txh) {
      try {
        await this.$http.post("$auth/self-handled-register", {
          txn: txh ?? "",
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getCurrentContract() {
      try {
        const provider = new providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        if (chainId == 80001 || chainId == 137) {
          polygonContract.setProvider(provider);
          this.contract = polygonContract;
        } else if (chainId == 97 || chainId == 56) {
          bscContract.setProvider(provider);
          this.contract = bscContract;
        } else if (chainId == 42161) {
          arbitrumContract.setProvider(provider);
          this.contract = arbitrumContract;
        } else {
          ethContract.setProvider(provider);
          this.contract = ethContract;
        }
      } catch (error) {
        console.log(error);
      }
    },
    onCancel() {
      this.$clearLogin();
      location.href = this.$getLoginUrl();
    },
    getChainId(type) {
      if (type == "Polygon") return this.$inDev ? 80001 : 137;
      if (type == "BSC") return this.$inDev ? 97 : 56;
      if (type == "Arbitrum") return 42161;
      return this.$inDev ? 5 : 1;
    },
    async switchPolygon() {
      const payBy = (localStorage.payBy = "Polygon");
      const id = this.getChainId(payBy);
      await this.switchNet(id);
    },
    async switchEth() {
      const payBy = (localStorage.payBy = "");
      const id = this.getChainId(payBy);
      await this.switchNet(id);
    },
    async switchNet(id) {
      try {
        const chainId = "0x" + id.toString(16);
        await this.addChain(chainId, id);
        const res = await window.web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
        console.log("switch err 1", res);
        if (res && res.error) {
          throw new Error(res.error);
        }
      } catch (error) {
        console.log("switch error 2", error);
        if (error.code !== 4902) {
          this.onErr(error).then(() => {
            // this.switchNet(id);
          });
        }
      }
    },
    async addChain(chainId, id) {
      let params = {
        137: {
          chainId,
          chainName: "Polygon Mainnet",
          rpcUrls: [
            "https://rpc.ankr.com/polygon",
            // "https://polygon-rpc.com",
          ],
          nativeCurrency: {
            name: "Polygon Coin",
            symbol: "MATIC",
            decimals: 18,
          },
          blockExplorerUrls: ["https://polygonscan.com"],
        },
        5: {
          chainId,
          chainName: "Goerli Testnet",
          rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
          nativeCurrency: {
            name: "Goerli-ETH",
            symbol: "G-ETH",
            decimals: 18,
          },
          blockExplorerUrls: ["https://goerli.etherscan.io/"],
        },
        56: {
          chainId,
          chainName: "BSC Mainnet",
          rpcUrls: ["https://rpc.ankr.com/bsc"],
          nativeCurrency: {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
          },
          blockExplorerUrls: ["https://bscscan.com"],
        },
        80001: {
          chainId,
          chainName: "polygon mumbai",
          rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
          nativeCurrency: {
            name: "matic Coin",
            symbol: "MATIC",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        97: {
          chainId,
          chainName: "BSC Chapel",
          rpcUrls: ["https://bsc-testnet.public.blastapi.io"],
          nativeCurrency: {
            name: "BNB Coin",
            symbol: "tBNB",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        42161: {
          chainId,
          chainName: "Arbitrum One",
          rpcUrls: ["https://arb1.arbitrum.io/rpc"],
          nativeCurrency: {
            name: "Arbitrum Coin",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
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
    onErr(err, retry) {
      if (!err) return console.log("---- err null");
      // console.log(err);
      const { data } = err;
      // console.log(data);
      let msg = err.message;
      // console.log(msg);
      if (data) {
        msg = data.message || msg;
      }
      if (/repriced/i.test(msg) && /replaced/i.test(msg)) {
        return this.$toast("Transaction was replaced.");
      }
      if (/missing revert data/i.test(msg)) {
        msg = "Network Error";
      } else if (/transaction failed/i.test(msg)) {
        msg = "Transaction Failed";
      } else if (/ipfs/.test(msg) && /invalid params/.test(msg)) {
        msg = "IPFS Storage Expired, extending service duration is required.";
      } else if (/exceeds balance/i.test(msg) || msg == "overflow") {
        msg = "Insufficient balance";
      } else if (msg.length > 100) {
        const mat = /^(.+)\[/.exec(msg);
        if (mat) msg = mat[1];
      }
      if (retry) {
        return this.$confirm(msg, "Network Error", {
          confirmText: "Retry",
        });
      }
      return this.$toast(msg);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>