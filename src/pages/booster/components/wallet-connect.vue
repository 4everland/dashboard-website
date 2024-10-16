<template>
  <div class="invite-drawer-box">
    <v-navigation-drawer
      class="invite-drawer"
      :absolute="!asMobile"
      :fixed="asMobile"
      bottom
      right
      temporary
      :hide-overlay="!asMobile"
      color="#1E2234"
      :value="showConnectDrawer"
      @input="handleToggle"
    >
      <v-container fluid style="padding: 24px 16px">
        <div class="drawer-title mb-6">Connect your wallet</div>

        <div class="mobile-invite-panel-content">
          <div class="wallet-item">
            <div class="wallet-icon-box">
              <img src="/img/booster/wallet/wallet-okx.png" width="44" alt="" />
              <div>OKX wallet</div>
            </div>
            <div>
              <v-btn class="drawer-btn" @click="connectOkxWallet"
                >Connect</v-btn
              >
            </div>
          </div>
          <div class="wallet-item">
            <div class="wallet-icon-box">
              <img
                src="/img/booster/wallet/wallet-walletconnect.png"
                width="44"
                alt=""
              />
              <div>WalletConnect</div>
            </div>
            <div>
              <v-btn
                class="drawer-btn"
                :loading="walletConnectLoading"
                @click="onBindWithWalletConnect"
                >Connect</v-btn
              >
            </div>
          </div>
        </div>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { fetchWeb3codeBind, fetchWeb3Vcode } from "@/api/login.js";

import { ConnectWalletCon, onSignWalletCon } from "@/utils/login";

import { connectOkxWallet } from "@/pages/booster/components/wallet-connect.js";
export default {
  computed: {
    ...mapState({
      showInviteDrawer: (s) => s.moduleBooster.showInviteDrawer,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTg() {
      return process.env.VUE_APP_TG_VERSION == "true";
    },
  },

  data() {
    return {
      showConnectDrawer: false,
      walletConnectLoading: false,
    };
  },
  created() {},
  methods: {
    onShowConnect() {
      this.showConnectDrawer = true;
    },
    async onConnectOkxWallet() {
      connectOkxWallet();
    },
    async onBindWithWalletConnect() {
      const type = 99;
      this.walletConnectLoading = true;
      window.walletConnectModal.subscribeModal((state) => {
        if (!state.open) {
          this.walletConnectLoading = false;
        }
      });
      const { session, account } = await ConnectWalletCon();
      if (!account) {
        return;
      }
      const params = {
        type: type,
        apply: account,
      };
      const nonce = await this.onExchangeCode(params);
      if (!nonce) {
        return;
      }
      this.walletConnectLoading = false;
      const signature = await onSignWalletCon(session, account, nonce);
      if (signature) {
        this.onVcode(type, signature);
      }
    },
    async onExchangeCode(params) {
      try {
        const { data } = await fetchWeb3codeBind(params);
        return data.applyR;
      } catch (error) {
        console.log(error);
        this.$toast2(error.message, "error");
      }
    },
    async onVcode(type, code) {
      try {
        let params = {
          type,
        };
        const { data } = await fetchWeb3Vcode(code, params);

        if (data.nodeToken) {
          localStorage.nodeToken = data.nodeToken;
        }
        this.$toast2("Connect successfully!", "success");
        this.$setMsg({
          name: "updateUser",
        });
      } catch (error) {
        console.log(error);
      }
    },
    handleToggle(val) {
      this.showConnectDrawer = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-drawer-box {
  ::v-deep .invite-drawer {
    width: 100% !important;
    height: 30% !important;
    max-height: 100% !important;

    overflow: scroll;
    .drawer-title {
      font-size: 20px;
      font-weight: 500;
      color: #fff;
      text-shadow: 0px 0px 8px #6172f3;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

@media (min-width: 960px) {
  .invite-drawer-box {
    ::v-deep .invite-drawer {
      top: 74px !important;
      right: 24px !important;
      width: 558px !important;
      height: calc(100% - 74px - 64px - 24px) !important;
    }
  }
}

.wallet-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
  .wallet-icon-box {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .drawer-btn {
    background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
    box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
    color: #fff !important;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
  }
}
</style>
