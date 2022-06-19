<template>
  <div>
    <v-alert
      text
      type="info"
      dismissible
      v-if="userInfo.email && !noTip"
      @input="onCloseTip"
    >
      <router-link to="/settings?tab=account_binding&type=3">
        Subscribe to stay up to date on the 4EVERLAND latest news and events.
      </router-link>
    </v-alert>
    <e-tabs :list="list" />
    <new-user-tips />
  </div>
</template>

<script>
import newUserTips from "@/components/overview/s-newUserTips.vue";
import Axios from "axios";
export default {
  components: { newUserTips },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  data() {
    return {
      list: [
        {
          text: "Hosting",
          comp: "h-projects",
          props: {
            limit: 5,
          },
        },
        {
          text: "Bucket",
          comp: "s-bucket",
        },
      ],
      noTip: !!localStorage.noEmailTip,
      signature: "",
    };
  },
  created() {
    // this.isSolana();
  },
  methods: {
    onCloseTip() {
      localStorage.noEmailTip = "1";
      this.noTip = true;
    },
    async isSolana() {
      const isSolana = this.userInfo.solana;
      if (isSolana) {
        const Array = await this.getSignaturesForAddress();
        this.checkBlock(Array);
      }
    },
    async getSignaturesForAddress(signature) {
      // const account = this.userInfo.solana.address;
      // console.log(account);
      let Param = {
        limit: 1000,
        commitment: "confirmed",
      };
      if (signature) {
        Param.before = signature;
      }
      try {
        const { data } = await Axios.post(process.env.VUE_APP_SOLANA_URL, {
          jsonrpc: "2.0",
          id: 1,
          method: "getSignaturesForAddress",
          params: ["Vote111111111111111111111111111111111111111", Param],
        });
        const array = data.result;
        return array;
      } catch (error) {
        console.log(error);
        setTimeout(async () => {
          const signature = this.signature;
          const Array = await this.getSignaturesForAddress(signature);
          this.checkBlock(Array);
        }, 11000);
      }
    },
    async checkBlock(array) {
      if (!array) {
        return;
      }
      const length = array.length;
      let flag = array.find((element) => {
        return element.slot <= 135140758;
      });
      if (flag) {
        console.log(flag);
      } else {
        const signature = array[length - 1].signature;
        this.signature = signature;
        const Array = await this.getSignaturesForAddress(signature);
        this.checkBlock(Array);
      }
    },
  },
};
</script>
