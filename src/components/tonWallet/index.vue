<template>
  <div>
    <div id="tonClickBtn">Button</div>
  </div>
</template>

<script>
import { TonConnectUI } from "@tonconnect/ui";

export default {
  mounted() {
    console.log(TonConnectUI);
    const tonConnectUI = new TonConnectUI({
      manifestUrl: "http://localhost:8080/tonconnect-manifest.json",
      buttonRootId: "tonClickBtn",
    });
    this.tonConnectUI = tonConnectUI;
  },
  methods: {
    async connectToWallet() {
      try {
        const connectedWallet = await this.tonConnectUI.connectWallet();
        console.log(connectedWallet);
      } catch (error) {
        console.log(error);
      }
      // Do something with connectedWallet if needed
      console.log(connectedWallet);
    },
  },
};
</script>

<style lang="scss" scoped></style>
