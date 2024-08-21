<template>
  <div>
    <div class="connect-wallet" @click="handleShowModel" v-show="!connected">
      Connect Wallet
    </div>

    <div @click="handleDeposit">Deposit</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { TonConnectUI } from "@tonconnect/ui";
import { beginCell } from "@ton/ton";

export default {
  data() {
    return {
      tonConnectUI: null,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
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

    // handleSign() {
    //   if (process.env.VUE_APP_TG_VERSION == "false") {
    //     this.$router.push("/login");
    //   } else {
    //     this.tonConnectUI.setConnectRequestParameters({ state: "loading" });
    //     const tonProof = "abcdefg";
    //     this.tonConnectUI.setConnectRequestParameters({
    //       state: "ready",
    //       value: { tonProof },
    //     });
    //     this.handleShowModel();
    //   }
    // },

    async handleDeposit() {
      if (!this.connected) return this.handleShowModel();

      let payload = JSON.stringify({
        uid: "580fa3ae794f4998a358389d25a60667",
      });

      const body = beginCell()
        .storeUint(0, 32)
        .storeStringTail(payload)
        .endCell();
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages: [
          // {
          //   address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
          //   amount: "20000000",
          //   // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
          // },
          {
            address: "UQCdcwc7GXPGy8aglWg8B03LLWx_BtwF2rL5HUtqCoUp_1Ge",
            amount: "20000000",
            // payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove
            payload: body.toBoc().toString("base64"),
          },
        ],
      };

      try {
        const result = await this.tonConnectUI.sendTransaction(transaction);

        console.log(result, "result");
        // // you can use signed boc to find the transaction
        // const someTxData = await myAppExplorerService.getTransaction(
        //   result.boc
        // );
        // alert("Transaction was sent successfully", someTxData);
      } catch (e) {
        console.error(e);
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
