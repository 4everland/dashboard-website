import polygonContract from "../../plugins/pay/contracts/dst-chain-contracts";
import bscContract from "../../plugins/pay/contracts/src-chain-contracts-bsc";
import arbitrumContract from "../../plugins/pay/contracts/src-chain-contracts-arbitrum";
import ethContract from "../../plugins/pay/contracts/src-chain-contracts";
import zkSyncContract from "../../plugins/pay/contracts/src-chain-contracts-zkSync";
import opBNBContract from "../../plugins/pay/contracts/src-chain-contracts-opBNB";
import polygonZkEVMContract from "../../plugins/pay/contracts/src-chain-contracts-polygonZkEVM";
import lineaContract from "../../plugins/pay/contracts/src-chain-contracts-linea";

import { Web3Provider } from "zksync-web3";

import { providerAddr } from "../../plugins/pay/contracts/contracts-addr";
import { BigNumber, providers } from "ethers";
import axios from "axios";
import * as zksync from "zksync";
export default {
  data() {
    return {
      registerInfo: {},
      contract: null,
      provider: null,
      collectionAddress: "0xb7b4360f7f6298de2e7a11009270f35f189bd77e",
      zkSyncfee: BigNumber.from("100000000000000"),
    };
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
        this.$setState({
          onChain: data.handled,
        });
        if (!data.handled) {
          const isExists = await this.contract.ProviderController.accountExists(
            providerAddr,
            data.uid
          );
          const records = await this.searchZySyncRecord();
          console.log(records);
          console.log(isExists);
          if (isExists) {
            // euid exist  over
            console.log("register success");
            await this.registerSuccess();
            location.reload();
            return true;
          }
          if (records.length) {
            // euid exist  over
            console.log("register success");
            await this.registerSuccess(records[0].txHash);
            location.reload();
            return true;
          }
        }
      } catch (error) {
        console.log(error, "isRegister");
      }
      return false;
    },

    async handleClaim() {
      try {
        await this.switchNet("Polygon");
        await this.getCurrentContract();
        const { sign } = await this.getSignAddress();
        const tx = await this.contract.ProviderController.functions[
          "registerAccount(address,bytes32,bytes)"
        ](providerAddr, this.registerInfo.uid, sign);
        console.log(tx);
        const receipt = await tx.wait(2);
        console.log(receipt);
        await this.registerSuccess();
        this.$loading.close();
        return true;
      } catch (error) {
        this.onErr(error);
        return false;
      }
    },
    async handleZkClaim() {
      try {
        // check main eth
        await this.switchNet("Ethereum");
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
          if (records.length) {
            await this.registerSuccess(records[0].txHash);
          }
          return true;
          // notify server
        } else {
          throw new Error(
            "Your zkSync account does't have enough ETH, please recharge it."
          );
        }
      } catch (error) {
        this.onErr(error);
        return false;
      }
    },
    async handleOtherChainClaim(chain) {
      try {
        await this.switchNet(chain);
        await this.getCurrentContract();
        const fee = await this.contract.Register.fee();
        // console.log(fee);
        const tx = await this.contract.Register.register(
          providerAddr,
          this.registerInfo.uid,
          {
            value: fee,
          }
        );
        const receipt = await tx.wait();
        console.log(receipt, "receipt");
        const isExists = await this.contract.ProviderController.accountExists(
          providerAddr,
          this.registerInfo.uid
        );
        if (isExists) {
          await this.registerSuccess();
        }
        return true;
      } catch (error) {
        console.log(error);
        this.onErr(error);
        return false;
      }
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
        this.$setMsg("updateUser");
        if (this.getList) {
          this.getList();
        }
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
        } else if (chainId == 421613 || chainId == 42161) {
          arbitrumContract.setProvider(provider);
          this.contract = arbitrumContract;
        } else if (chainId == 280 || chainId == 324) {
          const provider = new Web3Provider(window.ethereum);
          zkSyncContract.setProvider(provider);
          this.contract = zkSyncContract;
        } else if (chainId == 5611 || chainId == 204) {
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
    onCancel() {
      this.$clearLogin();
      location.href = this.$getLoginUrl();
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
            "https://polygon.llamarpc.com",
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
        204: {
          chainId,
          chainName: "opBNB",
          rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org"],
          nativeCurrency: {
            name: "BNB Coin",
            symbol: "BNB",
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
