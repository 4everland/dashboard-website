<template>
  <div>
    <ul>
      <li v-for="item in claimList" :key="item.type">
        <div class="al-c">
          <div style="width: 180px" class="al-c">
            <span>{{ item.name }}</span>
            <img width="20" height="20" class="ml-2" :src="item.icon" alt="" />
          </div>
          <v-text-field v-model="item.value"></v-text-field>
          <v-btn
            class="ml-10"
            color="primary"
            @click="handleChangeFee(item.type, item.value)"
            >Confirm</v-btn
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import polygonContract from "../plugins/pay/contracts/dst-chain-contracts";
import bscContract from "../plugins/pay/contracts/src-chain-contracts-bsc";
import arbitrumContract from "../plugins/pay/contracts/src-chain-contracts-arbitrum";
import ethContract from "../plugins/pay/contracts/src-chain-contracts";
import zkSyncContract from "../plugins/pay/contracts/src-chain-contracts-zkSync";
import opBNBContract from "../plugins/pay/contracts/src-chain-contracts-opBNB";
import polygonZkEVMContract from "../plugins/pay/contracts/src-chain-contracts-polygonZkEVM";
import lineaContract from "../plugins/pay/contracts/src-chain-contracts-linea";
import { Web3Provider } from "zksync-web3";

import { utils, providers } from "ethers";
export default {
  data() {
    return {
      contract: null,
      claimList: [
        {
          name: "ZkSync Era(V2)",
          icon: require("/public/img/svg/logo-no-letters.svg"),
          type: "zkSyncV2",
          tips: "Please ensure that you have sufficient ETH inzkSync Era. Interaction with the zkSync network will rely on cross-chain communication services to complete on-chain identity registration on Polygon.",
          value: null,
        },
        {
          name: "opBNB",
          icon: require("/public/img/svg/billing/ic-opbnb-test.svg"),
          type: "OpBNB",
          value: null,
        },
        {
          name: "Ethereum",
          icon: require("/public/img/svg/billing/ic-ethereum.svg"),
          type: "Ethereum",
          value: null,
        },
        {
          name: "Polygon ZkEVM",
          icon: require("/public/img/svg/billing/ic-polygon-zkEVM.svg"),
          type: "PolygonZkEVM",
          value: null,
        },
        {
          name: "BNB Chain",
          icon: require("/public/img/svg/billing/ic-bsc.png"),
          type: "BSC",
          value: null,
        },
        {
          name: "Arbitrum",
          icon: require("/public/img/svg/billing/ic-arbitrum.png"),
          type: "Arbitrum",
          value: null,
        },
        {
          name: "Linea",
          icon: require("/public/img/svg/billing/ic-linea.svg"),
          type: "Linea",
          value: null,
        },
      ],
    };
  },
  methods: {
    async switchNet(chainName) {
      const payBy = (localStorage.payBy = chainName);
      const id = this.getChainId(payBy);
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

        421613: {
          chainId,
          chainName: "Arbitrum Goerli",
          rpcUrls: ["https://endpoints.omniatech.io/v1/arbitrum/goerli/public"],
          nativeCurrency: {
            name: "Arbitrum Coin",
            symbol: "AGOR",
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
        280: {
          chainId,
          chainName: "zkSync Era Testnet",
          rpcUrls: ["https://testnet.era.zksync.dev"],
          nativeCurrency: {
            name: "zkSync Coin",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        324: {
          chainId,
          chainName: "zkSync Era Mainnet",
          rpcUrls: ["https://mainnet.era.zksync.io"],
          nativeCurrency: {
            name: "zkSync Coin",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        5611: {
          chainId,
          chainName: "opBNB Testnet",
          rpcUrls: ["https://opbnb-testnet-rpc.bnbchain.org"],
          nativeCurrency: {
            name: "BNB Coin",
            symbol: "tBNB",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        1442: {
          chainId,
          chainName: "Polygon zkEVM Testnet",
          rpcUrls: ["https://rpc.public.zkevm-test.net"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        1101: {
          chainId,
          chainName: "Polygon zkEVM",
          rpcUrls: ["https://rpc.ankr.com/polygon_zkevm"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        59140: {
          chainId,
          chainName: "Linea Test",
          rpcUrls: ["https://rpc.goerli.linea.build"],
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          // blockExplorerUrls: [],
        },
        59144: {
          chainId,
          chainName: "Linea",
          rpcUrls: ["https://linea-mainnet.infura.io/v3"],
          nativeCurrency: {
            name: "ETH",
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
    getChainId(type) {
      if (type == "Polygon") return this.$inDev ? 80001 : 137;
      if (type == "BSC") return this.$inDev ? 97 : 56;
      if (type == "Arbitrum") return this.$inDev ? 421613 : 42161;
      if (type == "zkSync") return this.$inDev ? 280 : 324;
      if (type == "OpBNB") return this.$inDev ? 5611 : 204;
      if (type == "PolygonZkEVM") return this.$inDev ? 1442 : 1101;
      if (type == "Linea") return this.$inDev ? 59140 : 59144;
      return this.$inDev ? 5 : 1;
    },
    async handleChangeFee(chain, value) {
      try {
        this.$loading();
        if (chain == "zkSyncV2") {
          await this.switchNet("zkSync");
        } else {
          await this.switchNet(chain);
        }
        await this.getCurrentContract();
        const _fee = utils.parseEther(value).toString();
        console.log(_fee);
        const tx = await this.contract.Register.changeFee(_fee);
        const receipt = await tx.wait();
        console.log(receipt, "receipt");
        const fee = await this.contract.Register.fee();
        console.log(fee);
        this.$loading.close();
        return true;
      } catch (error) {
        console.log(error);
        this.$loading.close();
        this.onErr(error);
        return false;
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
        } else if (chainId == 421613 || chainId == 42161) {
          arbitrumContract.setProvider(provider);
          this.contract = arbitrumContract;
        } else if (chainId == 280 || chainId == 324) {
          const provider = new Web3Provider(window.ethereum);
          zkSyncContract.setProvider(provider);
          this.contract = zkSyncContract;
        } else if (chainId == 5611) {
          opBNBContract.setProvider(provider);
          this.contract = opBNBContract;
        } else if (chainId == 1442 || chainId == 1101) {
          polygonZkEVMContract.setProvider(provider);
          this.contract = polygonZkEVMContract;
        } else if (chainId == 59140 || chainId == 59144) {
          lineaContract.setProvider(provider);
          this.contract = lineaContract;
        } else {
          ethContract.setProvider(provider);
          this.contract = ethContract;
        }
      } catch (error) {
        console.log(error);
      }
    },
    onErr(err, retry) {
      if (!err) return console.log("---- err null");
      const { data } = err;
      let msg = err.message;
      if (data) {
        msg = data.message || msg;
      }
      if (/repriced/i.test(msg) && /replaced/i.test(msg)) {
        return this.$toast("Transaction was replaced.");
      }
      if (/missing revert data/i.test(msg)) {
        msg = "Network Error";
      } else if (/user rejected transaction/i.test(msg)) {
        msg = "Your transaction has been canceled.";
      } else if (/transaction failed/i.test(msg)) {
        msg = "Transaction Failed";
      } else if (/ipfs/.test(msg) && /invalid params/.test(msg)) {
        msg = "IPFS Storage Expired, extending service duration is required.";
      } else if (
        /exceeds balance/i.test(msg) ||
        msg == "overflow" ||
        /err: insufficient/i.test(msg) ||
        /insufficient funds/i.test(msg)
      ) {
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

<style lang="scss" scoped></style>
