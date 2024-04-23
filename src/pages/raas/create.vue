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
import Axios from "axios";
import {
  fetchDefaultChainId,
  sendCreateRaas,
  sendCheckChainId,
} from "@/api/raas.js";

import createFirst from "./component/create-first.vue";
import createOneclick from "./component/create-oneclick.vue";
import createSecond from "./component/create-second.vue";
export default {
  components: {
    createFirst,
    createOneclick,
    createSecond,
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
      this.step = 1;
      this.step0Data = data;
      this.fastDeploy = data.fastDeploy;
    },
    onStep1Submit(data) {
      this.step1Data = data;
      this.onSubmit();
    },
    onStep2Submit(data) {
      this.step2Data = data;
      this.onSubmit();
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
      console.log(body);
      try {
        const { data } = await sendCreateRaas(body);
        if (data.id) {
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
