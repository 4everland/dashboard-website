<template>
  <div>
    <div class="connect-wallet" @click="handleSign" v-show="!connected">
      Connect Wallet
    </div>
  </div>
</template>

<script>
import { TonConnectUI } from "@tonconnect/ui";

export default {
  data() {
    return {
      tonConnectUI: null,
    };
  },
  computed: {
    connected() {
      if (this.tonConnectUI) {
        return this.tonConnectUI.connected;
      }
      return false;
    },
  },
  mounted() {
    const tonConnectUI = new TonConnectUI({
      manifestUrl: "https://hb.4everland.app/tonconnect-manifest.json",
    });
    this.tonConnectUI = tonConnectUI;
    this.tonConnectUI.onStatusChange((wallet) => {
      if (
        wallet &&
        wallet.connectItems?.tonProof &&
        "proof" in wallet.connectItems.tonProof
      ) {
        console.log(wallet.connectItems.tonProof, "-----");
      }
    });
  },
  methods: {
    async handleShowModel() {
      await this.tonConnectUI.openModal();
      console.log(this.tonConnectUI);
    },

    handleSign() {
      if (process.env.VUE_APP_TG_VERSION == "false") {
        this.$router.push("/login");
      } else {
        this.tonConnectUI.setConnectRequestParameters({ state: "loading" });
        const tonProof = "abcdefg";
        this.tonConnectUI.setConnectRequestParameters({
          state: "ready",
          value: { tonProof },
        });
        this.handleShowModel();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.connect-wallet {
  display: inline-flex;
  padding: 8px 12px;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}
</style>
