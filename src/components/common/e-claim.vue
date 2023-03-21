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
            min-width="200"
            @click="handleClaim"
            :loading="loading"
            >Claim</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import polygonContract from "../../plugins/pay/contracts/dst-chain-contracts";
import { providerAddr } from "../../plugins/pay/contracts/contracts-addr";
import { providers } from "ethers";

export default {
  data() {
    return {
      showClaim: false,
      items: [
        {
          name: "IPFS Storage",
          value: "25GB",
          icon: require("/public/img/airDrop/ipfs.png"),
        },
        {
          name: "Arweave Storage",
          value: "100MB",
          icon: require("/public/img/airDrop/ar.png"),
        },
        {
          name: "Build Minutes",
          value: "100",
          icon: require("/public/img/airDrop/minutes.png"),
        },
        {
          name: "Recharge Balance",
          value: "100",
          icon: require("/public/img/airDrop/balance.png"),
        },
      ],
      registerInfo: {},
      loading: false,
      contract: null,
    };
  },
  created() {
    this.isRegister();
    this.initContract();
  },
  methods: {
    initContract() {
      const provider = new providers.Web3Provider(window.ethereum);
      polygonContract.setProvider(provider);
      this.contract = polygonContract;
    },

    async isRegister() {
      try {
        const { data } = await this.$http.get(
          "$auth/self-handled-register-apply"
        );
        this.showClaim = !data.handled;
        this.registerInfo = data;
        if (!data.handled) {
          const euid = await this.contract.providerController.userRegistration(
            data.wallet
          );
          if (euid) {
            // euid exist  over
            await this.registerSuccess();
            this.showClaim = false;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    async handleClaim() {
      try {
        this.loading = true;
        await this.switchPolygon();
        const { sign, encode } = await this.getSignAddress();
        const tx = await this.contract.ProviderController.userRegistration(
          providerAddr,
          this.registerInfo.wallet,
          this.registerInfo.uid,
          encode,
          sign
        );
        console.log(tx);
        const receipt = await tx.wait();
        console.log(receipt);
        await this.registerSuccess();
        this.showClaim = false;
        this.$emit("onUserGuide");
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
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
    async registerSuccess() {
      try {
        await this.$http.post("$auth/self-handled-register", { txn: "" });
      } catch (error) {
        console.log(error);
      }
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