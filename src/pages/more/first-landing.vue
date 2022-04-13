<style lang="scss">
.act-p1 {
  min-height: 200px;

  .reward-item {
    min-width: 156px;
    height: 150px;
    &.done {
      background: #fff url(/img/icon/hosting/act-checked.png) right bottom
        no-repeat;
      background-size: 36px;
    }
  }
}
.act-gift1 {
  right: -20px;
  top: -130px;
  width: 300px;
}
.act-wrap1 {
  background: url(https://4ever-web.4everland.store/bg/act/act-bg1.jpg)
    no-repeat;
  background-size: 100%;
  margin: -20px;
  padding: 20px;
  .bd-1b {
    border: 1px solid #f9fbfc;
  }
  table {
    border-spacing: 0;
    font-size: 15px;

    thead {
      background: #f9fbfc;
      color: #7e8ea8;
      font-size: 14px;
      td {
        padding: 15px 0;
      }
    }
    tbody {
      font-size: 14px;
    }
    td {
      padding: 10px;
      text-align: center;
      min-width: 20px;
      border-bottom: 1px solid #efefef;
    }
  }
}
</style>
<template>
  <div class="act-wrap1">
    <v-alert
      border="bottom"
      colored-border
      type="error"
      elevation="2"
      v-if="netTip"
    >
      {{ netTip }}
    </v-alert>
    <div class="ta-r">
      <v-btn
        class="mr-5"
        small
        :color="myEthAddr != connectAddr ? 'error' : 'primary'"
        @click="setAddr"
      >
        <v-icon size="16" class="mr-1" v-if="myEthAddr">mdi-wallet</v-icon>
        <span>{{
          myEthAddr ? myEthAddr.cutStr(6, 4) : "Submit Wallet Address"
        }}</span>
      </v-btn>
      <v-btn
        color="primary"
        small
        href="https://www.4everland.org/firstlanding"
        target="_blank"
        >Rules</v-btn
      >
    </div>
    <div class="ta-c">
      <img
        src="https://4ever-web.4everland.store/bg/act/act-title1.png"
        :style="{
          height: asMobile ? '100px' : '250px',
        }"
      />
    </div>
    <div
      :style="{
        'margin-top': asMobile ? '60px' : '50px',
      }"
    ></div>

    <div class="pos-r">
      <img
        src="https://4ever-web.4everland.store/bg/act/act-gift.png"
        class="pos-a z-1 act-gift1"
        :style="asMobile ? 'width: 240px;top:-100px;' : ''"
      />
      <!-- <act-countdown></act-countdown> -->
    </div>
    <div class="act-p1 bdrs-5 pos-r bg-white">
      <div class="pd-20 pl-0 pr-0">
        <div class="ml-5 mr-6 d-flex al-c">
          <h3>My Rewards</h3>
          <!-- <v-btn
            plain
            color="white"
            small
            :loading="loading"
            @click="onRefresh"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn> -->
        </div>
        <div class="ov-a mt-5 gray-3 ta-c">
          <div class="ml-5 nowrap d-flex">
            <div
              class="
                bg-white
                bdrs-5
                bd-1
                pt-5
                pb-5
                d-ib
                reward-item
                mr-6
                flex-1
              "
              :class="{
                done: it.done,
              }"
              v-for="it in list"
              :key="it.type"
              v-show="!it.hide || it.done"
            >
              <div v-if="it.loaded">
                <p class="fw-b">
                  {{ numberComma(it.reward) }}
                  <span class="fz-12">4EVER</span>
                </p>
                <div class="gray fz-12 mt-1 d-flex al-c flex-center">
                  <span>{{ it.title }}</span>
                  <e-tooltip right max-width="300" v-if="it.tip">
                    <v-icon slot="ref" color="#999" size="14" class="pa-1 d-ib"
                      >mdi-help-circle-outline</v-icon
                    >
                    <span v-html="it.tip"></span>
                  </e-tooltip>
                </div>
                <div class="mt-8">
                  <v-btn
                    @click="onClick(it)"
                    color="primary"
                    small
                    :disabled="it.disabled"
                    v-if="it.btnTxt"
                    >{{ it.btnTxt }}</v-btn
                  >
                </div>
              </div>
              <div v-else>
                <v-skeleton-loader
                  type="card-heading, list-item-two-line"
                ></v-skeleton-loader>
              </div>
            </div>
          </div>
        </div>
        <div class="ta-c mt-10">
          <v-btn
            :disabled="claimAmount == 0 || isClaimed"
            @click="onClaim"
            :loading="claimLoading"
            rounded
            color="primary"
          >
            <span class="white-0 d-ib pl-3 pr-3"
              >{{ claimBtnTxt }} :
              {{ numberComma(claimAmount) }}
              <span class="fz-12">4EVER</span></span
            >
          </v-btn>
          <!-- <div class="mt-3">
            <v-btn small plain color="white" @click="setAddr"
              >Wallet Address</v-btn
            >
          </div> -->
        </div>
      </div>
    </div>

    <act-dapp ref="dapp" :tip="list[4].tip" />

    <act-invite ref="invite" :tip="list[3].tip" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Web3 from "web3";
// import WalletConnectProvider from '@walletconnect/web3-provider';

export default {
  computed: {
    ...mapState({
      actStatus: (s) => s.actStatus,
      userInfo: (s) => s.userInfo,
      isFocus: (s) => s.isFocus,
      nowDate: (s) => s.nowDate,
      connectAddr: (s) => s.connectAddr,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    myEthAddr() {
      return this.ethAddr || this.connectAddr;
    },
    claimBtnTxt() {
      return this.isClaimed ? "Claimed" : "Claim Now";
    },
  },
  data() {
    return {
      loading: false,
      isEnd: true,
      list: [
        {
          type: "OLD_USER_DEPLOY",
          title: "Early adopter",
          hide: true,
          txt2: "Deployed",
          tip: "Early adopter rewards are to those who deployed one or more projects before First Landing start in 4EVERLAND.",
        },
        {
          type: "DEPLOY",
          title: "Deploy rewards",
          txt: "Deploy",
          txt2: "Deployed",
          link: "/new",
          tip: "Deploy rewards are to those who deploy one or more projects during First Landing to win deploy rewards. They might run out so hurry up!",
        },
        {
          type: "BIND_DOMAIN",
          title: "Domain rewards",
          txt: "Add Domain",
          txt2: "Domain Added",
          link: "/dashboard/domains",
          tip: "Domain rewards are to those who customise their project domain name.",
        },
        {
          type: "INVITE_REWARD",
          title: "Invite rewards",
          txt: "Invite",
          tip: "Your valid invited developers/ total valid invited developers * 10 million = your invitation rewards.  <i>* Invited developer GitHub accounts must be registered before 8th September.</i>",
          isMore: true,
        },
        {
          type: "VIEWER_REWARD",
          title: "Viewer rewards",
          txt: "Copy Domain",
          tip: "Your valid page users/ total valid page users * 10 million = your total user rewards. <i>* You must connect  your domain to claim total user rewards.</i>",
          isMore: true,
        },
      ],
      ethAddr: "",
      claimLoading: false,
      errAccount: false,
      isClaimed: !!localStorage.is_claimed3,
      claimAmount: 0,
      isNetOk: false,
      netTip: "",
      noChange: true,
    };
  },
  watch: {
    isFocus(val) {
      if (val) {
        this.onRefresh();
      }
    },
    "$route.path"(val) {
      if (val == "/dashboard/first-landing") {
        this.onRefresh();
      }
    },
    isClaimed(val) {
      localStorage.is_claimed3 = val ? "1" : "";
      if (val && !localStorage.tever_symbol2) {
        this.addSymbol();
      }
    },
    connectAddr(val) {
      if (val) this.getClaimInfo();
    },
  },
  created() {
    this.getList();
  },
  methods: {
    async connectMetaMask() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        // await window.ethereum.enable();
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          return true;
        } catch (error) {
          this.$alert("Failed to connect wallet" + ": " + error.message);
          return false;
        }
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        return true;
      } else {
        this.$confirm("Metamask is not installed", {
          confirnText: "Install",
        }).then(() => {
          window.open(
            "https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
          );
        });
        return false;
      }
    },
    async getClaimInfo() {
      await this.checkNet();
      if (!this.isNetOk) return;
      try {
        this.$loading();
        const { data: info } = await this.$http2.get("/firstland/claim-info", {
          params: {
            addr: this.myEthAddr,
          },
          noTip: true,
        });
        this.$loading.close();
        this.claimInfo = info;
        this.claimAmount = parseInt(info.amount / 1e18);
        if (window.ethContract) {
          this.isClaimed = await window.ethContract.methods
            .isClaimed(info.index)
            .call();
        }
        return info;
      } catch (error) {
        this.claimAmount = 0;
        throw error;
      }
    },
    async checkNet() {
      if (!localStorage.isConnectMetaMask) {
        this.$setState({
          noticeMsg: {
            name: "showWalletConnect",
          },
        });
        return;
      }
      const netType = await window.web3.eth.net.getNetworkType();
      let msg = "";
      if (this.$inDev) {
        if (netType != "rinkeby") msg = "Dev: please connect to rinkeby";
      } else {
        if (netType != "main")
          msg = "Wrong network, please connect to Ethereum mainnet";
      }
      this.netTip = msg;
      // if (msg) this.$alert(msg);
      this.isNetOk = !msg;
    },
    async onClaim() {
      // if (!this.ethAddr) {
      //   this.setAddr();
      //   return;
      // }
      //
      try {
        this.claimLoading = true;
        if (!window.ethContract) {
          const isOk = await this.connectMetaMask();
          if (!isOk) return;
          this.$setState({
            noticeMsg: {
              name: "walletConnect",
            },
          });
          await this.$sleep(100);
          // console.log(window.ethContract);
        }

        await this.checkNet();
        if (!this.isNetOk) throw new Error(this.netTip);

        let accounts = await window.web3.eth.getAccounts();
        const account = accounts[0] || "";
        if (!this.ethAddr) {
          if (account) this.ethAddr = account;
          else {
            throw new Error("No Wallet Address");
          }
        } else {
          this.errAccount = account.toLowerCase() != this.ethAddr.toLowerCase();
          if (this.errAccount) {
            throw new Error(
              `Wallet address(${this.ethAddr.cutStr(
                6,
                4
              )}) is not connected in MetaMask.`
            );
          }
        }

        let info = this.claimInfo;
        if (!info) {
          info = await this.getClaimInfo();
        }
        // const info = actAbi.result.claims[this.ethAddr];
        // if (!info || !info.tokenId) {
        //   return this.$alert(`Your Wallet address is not in reward list.`);
        // }

        const { methods } = window.ethContract;
        if (this.isClaimed) {
          throw new Error("Your wallet address has been claimed.");
        }

        if (localStorage.claim_txid) {
          const trans = await window.web3.eth.getTransaction(
            localStorage.claim_txid
          );
          console.log(trans);
          if (trans && !trans.blockHash) {
            throw new Error("The Claim Transaction is running.");
          }
        }
        await methods
          .claim(
            info.index,
            this.ethAddr,
            info.amount,
            info.tokenId,
            info.proof
          )
          .send(
            {
              from: this.ethAddr,
              gasPrice: 60 * 1e9,
            },
            (err, txid) => {
              if (err) {
                this.$alert(err.message);
                return;
              }
              localStorage.claim_txid = txid;
              console.log("claim_txid: " + txid);
              this.$toast("Transaction start");
            }
          );

        this.isClaimed = true;
        this.addSymbol();
        await this.$alert(
          '<div class="mt-5 ta-c"><img src="https://4ever-web.4everland.store/bg/party.gif" style="height: 200px;" /></div>',
          "Claim successfully!",
          {
            type: "success",
          }
        );
        this.$router.push("/collections");
      } catch (error) {
        console.log(error);
        if (localStorage.claim_txid) {
          localStorage.claim_fail_txid = localStorage.claim_txid;
          localStorage.claim_txid = "";
        }
        let msg = error.message;
        if (/Not Found/i.test(msg)) {
          msg = "Your Wallet address is not in reward list.";
        }
        this.$alert(msg);
      }
      this.claimLoading = false;
    },
    addSymbol() {
      if (localStorage.tever_symbol2) {
        return;
      }
      // https://github.com/dinn2018/airdrop-claim/blob/master/deployments/ropsten/TEver.json
      window.web3.currentProvider.send(
        {
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: this.$inDev
                ? "0xCb33f96167614d000F73703cC4979789516A5eD1"
                : "0xEAbA187306335dd773Ca8042b3792c46E213636a",
              symbol: "T-4EVER",
              decimals: 18,
              image: location.origin + "/img/icon/tever.jpg",
            },
          },
        },
        (err, ok) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("set symbol", ok);
          localStorage.tever_symbol2 = 1;
        }
      );
    },
    numberComma(source, length = 3) {
      source = String(source).split(".");
      source[0] = source[0].replace(
        new RegExp("(\\d)(?=(\\d{" + length + "})+$)", "ig"),
        "$1,"
      );
      return source.join(".");
    },
    async getAddr() {
      const { data } = await this.$http2.get("/activity/ethAddress");
      this.ethAddr = data;
    },
    async setAddr() {
      if (this.noChange) {
        let tip = this.myEthAddr;
        if (!this.myEthAddr) {
          tip = "Unable to set wallet adress after 21st October 2021.";
        } else if (this.errAccount) {
          tip = `Wallet address(${this.ethAddr.cutStr(
            6,
            4
          )}) is not connected in MetaMask.`;
        }
        return this.$alert(tip, "Wallet Address");
      }
      const tip =
        "Submit your ETH Address, rewards available at the end of the 4EVERLAND FirstLanding.";
      let value = "";
      try {
        const data = await this.$prompt(tip, "Prompt", {
          hideTitle: true,
          defaultValue: this.ethAddr,
          inputAttrs: {
            label: "Wallet Adress",
            require: true,
            placeholder: "Enter your wallet address",
            rules: [
              (v) =>
                this.$regMap.eth.test(v) ||
                "Please enter correct eth wallet address.",
            ],
            required: true,
          },
        });
        value = data.value;
      } catch (error) {
        return;
      }
      if (value == this.ethAddr) {
        return;
      }
      try {
        console.log(value);
        this.$loading();
        await this.$http2.put(`/activity/bind/eth/${value}`);
        this.$loading.close();
        this.$toast(`${!this.ethAddr ? "Added" : "Updated"} successfully`);
        this.ethAddr = value;
        this.getAddr();
      } catch (error) {
        console.log(error);
        this.setAddr();
      }
    },
    async onRefresh() {
      if (!this.isNetOk) {
        this.getClaimInfo();
      }
      // await this.getList();
      // this.$refs.dapp.getList();
      // this.$refs.invite.getList();
    },
    onClick(row) {
      let { type, link } = row;
      console.log(type);
      const dapp = this.$refs.dapp;
      if (["VIEWER_REWARD", "DEPLOY"].includes(type) && !dapp.list.length) {
        link = "/new";
      }
      if (link) this.$navTo(link);
      else if (type == "INVITE_REWARD") {
        this.$refs.invite.onInvite();
      } else if (type == "VIEWER_REWARD") {
        dapp.setTipCopy();
      }
    },
    async getList() {
      try {
        this.loading = true;
        // const { data: status } = await this.$http2.get("/activity/status");
        // this.$setState({
        //   actStatus: status,
        // });
        let {
          data: { myRewards: rows, poolD2E: rest, totalRewards },
        } = await this.$http2.get("/activity/rewards");
        const list = [];
        this.claimAmount = totalRewards;
        for (const row of rows) {
          delete row.title;
          const item = this.list.filter((it) => it.type == row.type)[0];
          if (!item) continue;
          row.loaded = true;
          row.btnTxt = item.txt;
          // row.done = true;
          if (row.done) {
            if (item.txt2) {
              row.btnTxt = item.txt2;
              row.disabled = true;
            }
            if (!this.isEnd && item.isMore) {
              row.done = false;
            }
          }
          if ((rest <= 0 && !item.isMore) || this.isEnd) {
            row.disabled = true;
            row.btnTxt = this.isEnd ? "Ended" : "Run out";
          }
          list.push({
            ...item,
            ...row,
          });
        }
        this.list = list;
        // if (totalRewards && !this.connectAddr) {
        //   this.$setState({
        //     noticeMsg: {
        //       name: "showWalletConnect",
        //     },
        //   });
        // }
        await this.getAddr();
        this.getClaimInfo();
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>