<template>
  <div>
    <create-first v-if="step == 0" @onNext="onNext" />
    <create-oneclick
      v-if="step == 1 && fastDeploy"
      @onSubmit="onStep1Submit"
      @goBack="goBack"
      :onLoading="onLoading"
    />
    <create-second
      v-if="step == 1 && !fastDeploy"
      @onSubmit="onStep2Submit"
      @goBack="goBack"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { sendCreateRaas } from "@/api/raas.js";

import createFirst from "./component/create-first.vue";
import createOneclick from "./component/create-oneclick.vue";
import createSecond from "./component/create-second.vue";
export default {
  components: {
    createFirst,
    createOneclick,
    createSecond,
  },
  computed: {
    ...mapGetters(["balance"]),
    ...mapState({
      originBalance: (s) => s.moduleResource.originBalance,
    }),
  },
  data() {
    return {
      step: 0,
      fastDeploy: false,
      step0Data: {},
      step1Data: {},
      step2Data: {},
      onLoading: false,
    };
  },
  created() {
    // this.getDefaultChainId();
  },
  mounted() {},

  methods: {
    onNext(data) {
      if (data.fastDeploy) {
        this.step = 1;
        this.step0Data = data;
        this.fastDeploy = data.fastDeploy;
      }
      if (!data.fastDeploy) {
        let limitBalance = 1000000000;
        if (process.env.NODE_ENV == "development") {
          limitBalance = 10000000;
        }
        const balance = this.originBalance / 1e18;
        if (Number(balance) >= limitBalance) {
          this.step = 1;
          this.step0Data = data;
          this.fastDeploy = data.fastDeploy;
        } else {
          this.$confirm(
            "To create a Rollup, ensure your account balance exceeds 1,000,000,000 LAND (1,000 USD). Please deposit before proceeding.",
            "Tips",
            {
              cancelText: "Cancel",
              confirmText: "Deposit",
            }
          ).then(async () => {
            this.$router.push("/billing/deposit");
          });
        }
      }
    },
    onStep1Submit(data) {
      this.step1Data = data;
      if (data.purchasePlan == 0) {
        this.onSubmit();
      } else {
        this.beforePayTips(data.purchasePlan);
      }
    },
    onStep2Submit(data) {
      this.step2Data = data;
      this.onSubmit();
    },
    beforePayTips(purchasePlan) {
      let land = "";
      switch (purchasePlan) {
        case 90:
          land = "1,500,000,000";
          break;
        case 185:
          land = "3,000,000,000";
          break;
        case 365:
          land = "6,000,000,000";
          break;
        default:
          break;
      }

      const message = `Creating will consume ${land} LAND, ready to proceed?`;
      this.$confirm(message, "Tips", {
        cancelText: "Cancel",
        confirmText: "Pay",
      }).then(async () => {
        this.onSubmit();
      });
    },
    goBack() {
      this.step = 0;
    },
    async onSubmit() {
      this.onLoading = true;
      const body = {
        ...this.step0Data,
        ...this.step1Data,
        ...this.step2Data,
      };
      try {
        const { data } = await sendCreateRaas(body);
        if (this.fastDeploy) {
          this.$router.push(
            `/raas/progress/${this.step1Data.chainName || "-"}/${data.id}`
          );
        } else {
          this.$router.push("/raas");
        }
      } catch (error) {
        const code = error.code;
        if (code == 10002) {
          this.$confirm(error.message, "Tips", {
            cancelText: "Cancel",
            confirmText: "Deposit",
          }).then(async () => {
            this.$router.push("/billing/deposit");
          });
        } else {
          this.$alert(error.message);
        }
      }
      this.onLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
