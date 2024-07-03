<template>
  <div>
    <h2 class="fz-16 mt-6 mb-4">Choose Token</h2>
    <div style="height: 100%; margin-bottom: 100px; overflow: auto">
      <div
        @click="onSelect(it.label)"
        class="coin-label py-2 px-4 cursor-p d-flex space-btw mr-2 mb-2"
        :class="{
          border2: value == it.label,
        }"
        v-for="(it, i) in coinList"
        :key="i"
      >
        <div class="al-c flex-1">
          <v-icon size="16" :color="value == it.label ? $color1 : '#555'"
            >mdi-{{
              value == it.label
                ? "circle-slice-8"
                : "checkbox-blank-circle-outline"
            }}</v-icon
          >
          <img
            class="ml-3"
            style="vertical-align: middle"
            :src="it.img"
            width="40"
          />
          <div class="fz-12 ml-1">
            <div
              class="fz-14"
              :class="{
                'primary--text': value == it.label,
              }"
            >
              {{ it.name }}
            </div>
            <div>
              {{ it.showLabel }}

              <v-tooltip
                top
                max-width="300"
                nudge-top="5"
                v-if="it.label == 'USDCE'"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="ml-auto" size="18" v-bind="attrs" v-on="on"
                    >mdi-alert-circle-outline</v-icon
                  >
                </template>
                <div style="line-height: normal" class="py-2">
                  The USDC.e is a "bridged form Ethereum USDC", which is bridged
                  from the Ethereum blockchain. You can also opt to purchase it
                  from Uniswap
                </div>
              </v-tooltip>
            </div>
          </div>

          <div class="ml-auto ta-r" v-show="it.balance">
            <div class="fz-14">{{ it.balance }}</div>
            <div class="balance fz-12">Balance</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { mapState, mapGetters } from "vuex";
import { formatEther } from "ethers/lib/utils";

import {
  MumbaiUSDC,
  MumbaiUSDCE,
  MumbaiUSDT,
  MumbaiDAI,
  GoerliUSDC,
  GoerliUSDT,
  GoerliDAI,
  ChapelUSDC,
  ChapelUSDT,
  ChapelDAI,
  ArbitrumUSDC,
  ArbitrumUSDT,
  ArbitrumDAI,
  zkSyncUSDC,
  zkSyncUSDT,
  zkSyncDAI,
  optimisUSDC,
  optimisUSDT,
  optimisDAI,
  scrollUSDC,
  scrollUSDT,
  scrollDAI,
} from "../../../plugins/pay/contracts/contracts-addr";
export default {
  props: {
    value: {
      type: String,
    },
    chainId: {
      type: Number,
    },
  },
  data() {
    return {
      selected: "USDC",
      USDCbalance: "",
      USDCEbalance: "",
      USDTbalance: "",
      DAIbalance: "",
      originBalance: "",
    };
  },
  computed: {
    ...mapState({
      isZksyncLite: (s) => s.isZksyncLite,
      connectAddr: (s) => s.connectAddr,
    }),
    ...mapGetters(["walletObj"]),

    showToolTip() {
      if (this.$inDev ? this.chainId == 80001 : this.chainId == 137) {
        return true;
      }
      return false;
    },
    coinList() {
      const coinList = [
        {
          label: "USDC",
          showLabel: "USDC",
          name: "USDC Coin",
          img: "/img/svg/pay/usdc.svg",
          addr: "",
        },
        {
          label: "USDT",
          showLabel: "USDT",
          name: "Tether USD",
          img: "/img/svg/pay/usdt.svg",
          addr: "",
        },
        {
          label: "DAI",
          showLabel: "DAI",
          name: "Dai Stablecoin",
          img: "/img/svg/pay/dai.svg",
          addr: "",
        },
      ];

      if (this.showToolTip) {
        return [
          {
            label: "USDCE",
            showLabel: "USDC.e",
            name: "Bridged USDC",
            img: "/img/svg/pay/usdc.svg",
            addr: MumbaiUSDCE,
            balance: this.USDCEbalance,
          },
          {
            label: "USDC",
            showLabel: "USDC",
            name: "USDC Coin",
            img: "/img/svg/pay/usdc.svg",
            addr: MumbaiUSDC,
            balance: this.USDCbalance,
          },
          {
            label: "USDT",
            showLabel: "USDT",
            name: "Tether USD",
            img: "/img/svg/pay/usdt.svg",
            addr: MumbaiUSDT,
            balance: this.USDTbalance,
          },
          {
            label: "DAI",
            showLabel: "DAI",
            name: "Dai Stablecoin",
            img: "/img/svg/pay/dai.svg",
            addr: MumbaiDAI,
            balance: this.DAIbalance,
          },
        ];
      }
      if (this.isZksyncLite) {
        return [
          {
            label: "ETH",
            showLabel: "ETH",
            name: "ETH",
            img: "/img/svg/pay/eth.svg",
            addr: "",
            // balance: this.originBalance,
          },
        ];
      }

      if (this.chainId == 1 || this.chainId == 10 || this.chainId == 534352) {
        return [
          {
            label: "USDC",
            showLabel: "USDC",
            name: "USDC Coin",
            img: "/img/svg/pay/usdc.svg",
            addr:
              this.chainId == 1
                ? GoerliUSDC
                : this.chainId == 10
                ? optimisUSDC
                : scrollUSDC,
            balance: this.USDCbalance,
          },
          {
            label: "USDT",
            showLabel: "USDT",
            name: "Tether USD",
            img: "/img/svg/pay/usdt.svg",
            addr:
              this.chainId == 1
                ? GoerliUSDT
                : this.chainId == 10
                ? optimisUSDT
                : scrollUSDT,
            balance: this.USDTbalance,
          },
          {
            label: "DAI",
            showLabel: "DAI",
            name: "Dai Stablecoin",
            img: "/img/svg/pay/dai.svg",
            addr:
              this.chainId == 1
                ? GoerliDAI
                : this.chainId == 10
                ? optimisDAI
                : scrollDAI,
            balance: this.DAIbalance,
          },
          {
            label: "ETH",
            showLabel: "ETH",
            name: "ETH",
            img: "/img/svg/pay/eth.svg",
            addr: "",
            balance: this.originBalance,
          },
        ];
      }

      if (this.chainId == 81457 || this.chainId == 167000) {
        return [
          {
            label: "ETH",
            showLabel: "ETH",
            name: "ETH",
            img: "/img/svg/pay/eth.svg",
            addr: "",
            balance: this.originBalance,
          },
        ];
      }

      if (this.chainId == 5611 || this.chainId == 204) {
        return [
          {
            label: "BNB",
            showLabel: "BNB",
            name: "BNB",
            img: "/img/svg/pay/bnb.svg",
            addr: "",
            balance: this.originBalance,
          },
        ];
      }

      if (this.chainId == 56 || this.chainId == 97) {
        return [
          {
            label: "BNB",
            showLabel: "BNB",
            name: "BNB",
            img: "/img/svg/pay/bnb.svg",
            addr: "",
            balance: this.originBalance,
          },
          {
            label: "USDC",
            showLabel: "USDC",
            name: "USDC Coin",
            img: "/img/svg/pay/usdc.svg",
            addr: ChapelUSDC,
            balance: this.USDCbalance,
          },
          {
            label: "USDT",
            showLabel: "USDT",
            name: "Tether USD",
            img: "/img/svg/pay/usdt.svg",
            addr: ChapelUSDT,
            balance: this.USDTbalance,
          },
          {
            label: "DAI",
            showLabel: "DAI",
            name: "Dai Stablecoin",
            img: "/img/svg/pay/dai.svg",
            addr: ChapelDAI,
            balance: this.DAIbalance,
          },
        ];
      }

      if (this.chainId == 42161 || this.chainId == 421613) {
        return [
          {
            label: "USDC",
            showLabel: "USDC",
            name: "USDC Coin",
            img: "/img/svg/pay/usdc.svg",
            addr: ArbitrumUSDC,
            balance: this.USDCbalance,
          },
          {
            label: "USDT",
            showLabel: "USDT",
            name: "Tether USD",
            img: "/img/svg/pay/usdt.svg",
            addr: ArbitrumUSDT,
            balance: this.USDTbalance,
          },
          {
            label: "DAI",
            showLabel: "DAI",
            name: "Dai Stablecoin",
            img: "/img/svg/pay/dai.svg",
            addr: ArbitrumDAI,
            balance: this.DAIbalance,
          },
        ];
      }
      if (this.chainId == 324 || this.chainId == 280) {
        return [
          {
            label: "USDC",
            showLabel: "USDC",
            name: "USDC Coin",
            img: "/img/svg/pay/usdc.svg",
            addr: zkSyncUSDC,
            balance: this.USDCbalance,
          },
          {
            label: "USDT",
            showLabel: "USDT",
            name: "Tether USD",
            img: "/img/svg/pay/usdt.svg",
            addr: zkSyncUSDT,
            balance: this.USDTbalance,
          },
          {
            label: "DAI",
            showLabel: "DAI",
            name: "Dai Stablecoin",
            img: "/img/svg/pay/dai.svg",
            addr: zkSyncDAI,
            balance: this.DAIbalance,
          },
        ];
      }

      return coinList;
    },
  },
  methods: {
    onSelect(label) {
      this.$emit("onSelectCoin", label);
    },

    async fetchBalance(tokenAddress) {
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
            [
              {
                constant: true,
                inputs: [],
                name: "decimals",
                outputs: [
                  {
                    name: "",
                    type: "uint8",
                  },
                ],
                payable: false,
                stateMutability: "view",
                type: "function",
              },
              {
                constant: true,
                inputs: [
                  {
                    name: "account",
                    type: "address",
                  },
                ],
                name: "balanceOf",
                outputs: [
                  {
                    name: "",
                    type: "uint256",
                  },
                ],
                payable: false,
                stateMutability: "view",
                type: "function",
              },
            ],
            provider
          );

          const tokenBalance = await contract.balanceOf(address);
          const balance = ethers.utils.formatUnits(
            tokenBalance,
            await contract.decimals()
          );

          return Number(balance).toFixed(5);
        } else {
          const ethBalance = await provider.getBalance(address);
          return Number(formatEther(ethBalance)).toFixed(5);
        }
      } catch (err) {
        console.log(err);
      }
    },

    fetchAllBalance() {
      this.coinList.forEach((it) => {
        let varibal = it.label + "balance";
        this.fetchBalance(it.addr).then((res) => {
          if (!it.addr) {
            this.originBalance = res;
          } else {
            this[varibal] = res;
          }
        });
      });
    },
  },
  watch: {
    chainId(val) {
      console.log(val);
      this.fetchAllBalance();
    },
    connectAddr() {
      this.fetchAllBalance();
    },
  },
};
</script>

<style lang="scss" scoped>
.coin-label {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
}
.coin-label.active {
  font-weight: bold;
  border: 1px solid #735ea1;
}
.balance {
  color: #64748b;
}
.v-tooltip__content {
  background: rgba(0, 0, 0, 0.9);
  border-radius: 4px;
}
.v-tooltip__content::after {
  display: block;
  content: "";
  position: absolute;
  right: 50%;
  bottom: -20px;
  border: 10px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
}
</style>
