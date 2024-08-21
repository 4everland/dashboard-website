<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile">
      <div class="start-boosting d-flex flex-column justify-center">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="18"
          alt=""
        />
        <div class="text-center fz-20 mb-4 fw-b">Stake T4EVER</div>
        <div
          class="boosting-task d-flex align-center justify-space-between pa-3 fz-14"
        >
          <div>
            <div>Choose network</div>
            <div>
              <v-radio-group v-model="network" row>
                <v-radio
                  class="choose-item"
                  :class="network == 'ethereum' ? 'choosed' : ''"
                  value="ethereum"
                >
                  <template v-slot:label>
                    <div style="color: #fff">
                      <img
                        class="mx-2"
                        style="vertical-align: middle"
                        src="/img/booster/drawer/ethereum.svg"
                        height="20"
                      />
                      Ethereum
                    </div>
                  </template>
                </v-radio>
                <v-radio
                  class="choose-item"
                  :class="network == 'everPay' ? 'choosed' : ''"
                  value="everPay"
                >
                  <template v-slot:label>
                    <div
                      class="d-flex"
                      style="
                        color: #fff;
                        justify-content: space-between;
                        flex: 1;
                      "
                    >
                      <div>
                        <img
                          class="mx-2"
                          style="vertical-align: middle"
                          src="/img/booster/drawer/everpay.svg"
                          width="20"
                        />
                        <span> everPay </span>
                      </div>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            small
                            color="#6C7789"
                            class="ml-2"
                            v-bind="attrs"
                            v-on="on"
                          >
                            mdi-alert-circle-outline
                          </v-icon>
                        </template>
                        <div style="width: 300px">
                          When you deposit using everPay, the 4EVER cross-chain
                          bridge will automatically complete your transaction,
                          using USDC on Polygon.
                        </div>
                      </v-tooltip>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
          </div>
        </div>
        <div
          class="boosting-task d-flex align-center justify-space-between pa-3 fz-14"
        >
          <div class="d-flex align-center">
            <div>Balance</div>
          </div>
          <div>
            {{ network == "ethereum" ? ethereumBalance : everPayBalance }}
          </div>
        </div>
        <div
          class="boosting-task d-flex align-center justify-space-between pa-3 fz-14"
        >
          <div class="d-flex align-center">
            <div>Stake amount</div>
          </div>
          <div class="d-flex">
            <div class="invite-content">
              <input
                class="invite-input"
                type="text"
                placeholder="Please enter"
                v-model="stakeAmount"
              />
            </div>
            <v-btn text @click="onMax">Max</v-btn>
          </div>
        </div>
        <ul class="stake-tips">
          <li>Stake a minimum of 100 T4EVER to start.</li>
          <li>
            Each staked T4EVER token contributes to a 0.005% Staking Yield.
          </li>
          <li>
            Staked T4EVER will automatically convert to 4EVER tokens at a 1:1
            ratio during the airdrop.
          </li>
        </ul>
        <v-btn
          class="start-boost-btn text-center fw-b"
          @click="onStake"
          :loading="stakeLoading"
        >
          Stake
        </v-btn>
      </div>
    </v-overlay>

    <v-dialog
      v-else
      max-width="738px"
      :value="value"
      persistent
      content-class="booster-dialog"
      style="background-color: transparent; box-shadow: none; height: 524px"
    >
      <div class="booster-module-dialog">
        <div class="start-boosting-dialog">
          <img
            class="close-btn"
            @click="$emit('input', false)"
            src="/img/booster/svg/close.svg"
            width="18"
            alt=""
          />
          <div class="text-center mt-4 fw-b" style="font-size: 24px">
            Stake T4EVER
          </div>
          <div class="boosting-task fz-16">
            <div class="">
              <div class="d-flex align-center">Choose network</div>
              <div>
                <v-radio-group
                  v-model="network"
                  row
                  @change="handleChangeNetwork"
                >
                  <v-radio
                    class="choose-item"
                    :class="network == 'ethereum' ? 'choosed' : ''"
                    value="ethereum"
                  >
                    <template v-slot:label>
                      <div style="color: #fff">
                        <img
                          class="mx-2"
                          style="vertical-align: middle"
                          src="/img/booster/drawer/ethereum.svg"
                          height="20"
                        />
                        Ethereum
                      </div>
                    </template>
                  </v-radio>
                  <v-radio
                    class="choose-item"
                    :class="network == 'everPay' ? 'choosed' : ''"
                    value="everPay"
                  >
                    <template v-slot:label>
                      <div
                        class="d-flex"
                        style="
                          color: #fff;
                          justify-content: space-between;
                          flex: 1;
                        "
                      >
                        <div>
                          <img
                            class="mx-2"
                            style="vertical-align: middle"
                            src="/img/booster/drawer/everpay.svg"
                            width="20"
                          />
                          <span> everPay </span>
                        </div>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              small
                              color="#6C7789"
                              class="ml-2"
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-alert-circle-outline
                            </v-icon>
                          </template>
                          <div style="width: 300px">
                            When you deposit using everPay, the 4EVER
                            cross-chain bridge will automatically complete your
                            transaction, using USDC on Polygon.
                          </div>
                        </v-tooltip>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </div>
            </div>
          </div>
          <div class="boosting-task fz-16">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">Balance</div>
              <div>
                {{ network == "ethereum" ? ethereumBalance : everPayBalance }}
              </div>
            </div>
          </div>
          <div class="boosting-task fz-16">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">Stake amount</div>
              <div class="d-flex">
                <div class="invite-content">
                  <input
                    class="invite-input"
                    type="text"
                    placeholder="Please enter"
                    v-model="stakeAmount"
                  />
                </div>
                <v-btn text @click="onMax">Max</v-btn>
              </div>
            </div>
          </div>
          <ul class="stake-tips">
            <li>Stake a minimum of 100 T4EVER to start.</li>
            <li>
              Each staked T4EVER token contributes to a 0.005% Staking Yield.
            </li>
            <li>
              Staked T4EVER will automatically convert to 4EVER tokens at a 1:1
              ratio during the airdrop.
            </li>
          </ul>
          <div class="d-flex align-center justify-center mt-4">
            <v-btn class="cancel-btn" @click="$emit('input', false)"
              >Cancel</v-btn
            >
            <v-btn
              class="start-boost-btn"
              @click="onStake"
              :loading="stakeLoading"
              >Stake</v-btn
            >
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { ethers } from "ethers";

import { mapGetters, mapState } from "vuex";
import { fetchEverPayHash } from "@/api/booster";
export default {
  props: {
    value: Boolean,
    stakingAmount: Number,
  },
  data() {
    return {
      network: "",
      ethereumBalance: 0,
      everPayBalance: 0,
      stakeAmount: 0,
      // overlay: false,
      activity: [],
      inviteCode: "",
      tag: "ethereum-t4ever-0xeaba187306335dd773ca8042b3792c46e213636a",
      tokenAddress: "0xeaba187306335dd773ca8042b3792c46e213636a",
      // testToAddress: "0x3A1A365D9Ee59B47471Cfe31451b4Fd1D7A83Daa",
      testToAddress: "0xD47a47D44AF4a509b862AC05505D5254DceECCf5",
      prodToAddress: "0xE770EB217B850341AA5654eb09617eA9b88De657",
      stakeLoading: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["walletObj"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentAddress() {
      return this.userInfo.wallet.address;
    },
  },
  created() {
    this.initNetwork();
    this.walletObj.on("chainChanged", this.initNetwork);
  },
  methods: {
    initNetwork() {
      this.network = parseInt(this.walletObj.chainId) == 1 ? "ethereum" : "";
    },
    init() {
      this.initEverPay();
      this.getEthereumBalance();
    },
    async handleChangeNetwork(val) {
      if (val == "ethereum") {
        await this.switchNet(1);
        this.init();
      }
    },
    async switchNet(id) {
      const chainId = "0x" + id.toString(16);
      try {
        await this.walletObj.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
      } catch (error) {
        console.log("switch error 2", error);

        this.network = "";
      }
    },
    async initEverPay() {
      try {
        const everPay = new window.Everpay.default();

        const account = this.currentAddress;

        const tag = this.tag;

        const data = await everPay.balance({
          tag,
          account,
        });
        this.everPayBalance = data;
      } catch (err) {
        if (err.code && err.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          console.log(err);
          // this.$alert(err.message);
        }
      }
    },
    async getEthereumBalance() {
      try {
        const account = this.currentAddress;
        const tokenAddress = this.tokenAddress;

        const provider = new ethers.providers.Web3Provider(this.walletObj);

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
        console.log("contract", contract);

        console.log(account);
        const tokenBalance = await contract.balanceOf(account);
        const balance = ethers.utils.formatUnits(
          tokenBalance,
          await contract.decimals()
        );

        console.log(balance, "balance");
        this.ethereumBalance = Math.floor(balance);
      } catch (err) {
        console.log(err);
      }
    },
    onMax() {
      const network = this.network;
      switch (network) {
        case "ethereum":
          this.stakeAmount = this.ethereumBalance;
          break;
        case "everPay":
          this.stakeAmount = this.everPayBalance;
          break;
        default:
          this.stakeAmount = 0;
      }
    },
    async onStake() {
      if (this.stakingAmount == 0 && this.stakeAmount < 100) {
        this.$toast(
          "Sorry, the initial staking amount cannot be less than 100 T4EVER."
        );
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      if (account.toLowerCase() !== this.currentAddress.toLowerCase()) {
        return this.$toast(
          `The currently connected wallet is not the one bound to your 4EVERLAND account. Please switch to the ${this.currentAddress.cutStr(
            6,
            4
          )} wallet to proceed.`
        );
      }
      const network = this.network;
      switch (network) {
        case "ethereum":
          this.handleEthPayment();
          break;
        case "everPay":
          this.handleEverpayPayment();
          break;
        default:
          return;
      }
    },
    async handleEverpayPayment() {
      this.stakeLoading = true;
      try {
        const provider = new ethers.providers.Web3Provider(this.walletObj);
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        const balance = this.everPayBalance;
        let stakeAmount = this.stakeAmount;
        if (stakeAmount > balance)
          return this.$alert(
            "Insufficient balance, please deposit and try again.",
            "alert"
          );

        const everpay = new window.Everpay.default({
          account,
          chainType: "ethereum",
          ethConnectedSigner: signer,
        });
        const data = await everpay.transfer({
          tag: this.tag,
          amount: stakeAmount,
          to: this.$inDev ? this.testToAddress : this.prodToAddress,
          data: {
            account: this.teamId,
          },
        });
        console.log(data);
        const everHash = data.everHash;
        await fetchEverPayHash(everHash);
        this.$store.dispatch("getBoosterUserInfo");
        this.$toast2("Successfully staked!");
        this.$emit("input", false);
        this.$emit("onStaked");
      } catch (error) {
        console.log(error);
      } finally {
        this.stakeLoading = false;
      }
    },

    async handleEthPayment() {
      this.stakeLoading = true;
      try {
        const provider = new ethers.providers.Web3Provider(this.walletObj);
        const signer = provider.getSigner();
        const account = await signer.getAddress();

        const balance = this.ethereumBalance;
        let stakeAmount = this.stakeAmount;

        if (stakeAmount > balance)
          return this.$alert(
            "Insufficient balance, please deposit and try again.",
            "alert"
          );

        console.log(stakeAmount);

        const tokenContract = new ethers.Contract(
          this.tokenAddress,
          ["function transfer(address to, uint amount) returns (bool)"],
          signer
        );

        const tx = await tokenContract.transfer(
          this.$inDev ? this.testToAddress : this.prodToAddress,
          ethers.utils.parseEther(stakeAmount)
        );
        // const tx = await window.ethereum.request({
        //   method: "eth_sendTransaction",
        //   params: [
        //     {
        //       to: this.$inDev ? this.testToAddress : this.prodToAddress,
        //       from: account,
        //       value: stakeAmount,
        //     },
        //   ],
        // });
        console.log(tx);
        const receipt = await tx.wait();
        console.log(receipt);
        this.$store.dispatch("getBoosterUserInfo");
        this.$toast2("Successfully staked!");
        this.$emit("input", false);
        this.$emit("onStaked");
      } catch (error) {
        console.log(error);
      } finally {
        this.stakeLoading = false;
      }
    },
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
  .boosting-task {
    margin-bottom: 8px;
    background: url("/img/booster/svg/fringe-bg.svg");
    .idx {
      width: 26px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: #000;
      font-weight: bold;
      border-radius: 100%;
      background: rgba(255, 255, 255, 0.6);
    }
    .act-btn {
      color: #fff;
      width: 88px;
      height: 29px;
      line-height: 29px;
      text-align: center;
      border-radius: 4px;
      background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
      box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
    }
  }

  .start-boost-btn {
    color: #fff;
    margin: 34px auto 0;
    width: 50%;
    padding: 16px 24px;
    border-radius: 4px;
    text-shadow: 0px 0px 8px #6172f3;
    border: 1px solid #0e6cc6;
    background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
    box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
      0px 4px 8px 0px rgba(0, 133, 195, 0.25);
  }
}

::v-deep .booster-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}
.booster-module-dialog {
  padding: 13px;
  height: 524px;
  background: url("/img/booster/svg/dialog-bg.svg") no-repeat;
  background-size: contain;
}
.start-boosting-dialog {
  position: relative;
  height: 100%;
  padding: 26px 7px 20px 7px;
  color: #fff;
  border-radius: 5px;
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
    cursor: pointer;
  }
  .boost-icon {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -50px;
  }
  .boosting-task {
    padding: 16px 24px;
    margin-bottom: 8px;
    background: url("/img/booster/svg/fringe-bg.svg");
    .idx {
      width: 26px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: #000;
      font-weight: bold;
      border-radius: 100%;
      background: rgba(255, 255, 255, 0.6);
    }
    .act-btn {
      color: #fff;
      width: 88px;
      height: 29px;
      line-height: 29px;
      text-align: center;
      border-radius: 4px;
      background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
      box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
      cursor: pointer;
    }
  }

  .cancel-btn {
    display: flex;
    width: 148px;
    padding: 16px 24px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(2px);
    margin-right: 30px;
    cursor: pointer;
    background: transparent;
    color: #fff;
  }
  .start-boost-btn {
    color: #fff;
    display: flex;
    padding: 16px 24px;
    width: 148px;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-radius: 4px;
    border: 1px solid #0e6cc6;
    background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
    box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
      0px 4px 8px 0px rgba(0, 133, 195, 0.25);
    cursor: pointer;
  }
}
.invite-content {
  padding: 8px;
  border-radius: 4px;
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  background: rgba(49, 49, 49, 0.9);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.35);
  .invite-input {
    color: #fff;
  }
}
::v-deep .choose-item {
  display: flex;
  height: 48px;
  padding: 8px 12px;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  border-radius: 4px;
  border: 1px solid rgba(140, 140, 161, 0.25);
}
::v-deep .choosed {
  border-radius: 4px;
  border: 1px solid #43e7fa;
  background: rgba(0, 48, 92, 0.8);
}
.stake-tips {
  padding: 0 24px;
  color: #fff;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  opacity: 0.6;
}

ul,
li {
  list-style: outside;
}
</style>
