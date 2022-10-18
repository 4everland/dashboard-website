<style lang="scss">
.gateway-generate-container {
  font-family: "AppleSystemUIFont";
}
.check-all {
  background: #e1e4e8 !important;
}
</style>

<template>
  <div>
    <v-btn color="primary" @click="onShow">
      <span class="fz-18">+</span>
      <span class="ml-1">Generate</span>
    </v-btn>
    <v-dialog v-model="showPop" max-width="600">
      <div class="pa-6 pt-5 gateway-generate-container">
        <h3 class="fz-30">Create Gateway</h3>
        <div class="pa-5" v-if="stepIdx == 0">
          <div class="fz-16 gray">Set a gateway name</div>
          <div class="mt-3 d-flex align-start">
            <v-text-field
              outlined
              dense
              v-model="subDomain"
              placeholder="my company name"
              suffix=".4everland.link"
              :rules="[
                (v) =>
                  /^[a-z0-9A-Z]{0,43}$/.test(v) ? true : 'Invalid subdomain',
              ]"
            ></v-text-field>
            <v-btn color="primary" class="ml-3" @click="checkoutGateway"
              >Checkout</v-btn
            >
          </div>
          <decode-status
            v-if="showDecodeStatus"
            :status="validStatus"
            :statusText="statusText"
          />
        </div>
        <template v-else>
          <div class="gray fz-13 mt-1">Gateway Access</div>
          <div class="pa-5">
            <div class="al-c hide-msg">
              <span class="mr-auto">Private Gateway</span>
              <v-switch v-model="isPrivate" dense></v-switch>
            </div>
            <div class="mt-2 fz-13 gray">
              <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon>Choose
              whether or not you want your gateway to be able to pull content
              from the whole IPFS network or just content you have pinned.
            </div>
          </div>
        </template>

        <div class="ta-c mt-5">
          <v-btn outlined width="180" @click="showPop = false">Cancel</v-btn>
          <v-btn
            color="primary"
            class="ml-6"
            width="180"
            @click="onNext"
            :disabled="stepIdx == 0 && validStatus != 2"
            >{{ stepIdx == 0 ? "Next" : "Create" }}</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import DecodeStatus from "@/components/custom/decode-status";
export default {
  components: {
    DecodeStatus,
  },
  data() {
    return {
      showPop: false,
      stepIdx: 0,
      isPrivate: true,
      validStatus: 1,
      showDecodeStatus: false,
      subDomain: "",
    };
  },
  computed: {
    statusText() {
      return {
        1: "Checking availability...",
        2: "Available!",
        3: "Domain unavailable!",
      };
    },
  },
  methods: {
    onShow() {
      this.stepIdx = 0;
      this.showPop = true;
    },
    onNext() {
      if (this.stepIdx == 0) {
        this.stepIdx = 1;
      }
    },
    checkoutGateway() {
      if (!/^[a-z0-9A-Z]{0,43}$/.test(this.subDomain)) return;
      this.showDecodeStatus = true;
      this.validStatus = 1;
      // request checkout gateway
      setTimeout(() => {
        this.validStatus = 2;
      }, 2000);
    },
    resetDecodeStatus() {
      this.showDecodeStatus = false;
      this.validStatus = 1;
    },
  },
  watch: {
    showPop(val) {
      if (!val) {
        this.subDomain = "";
        this.resetDecodeStatus();
      }
    },
    subDomain(newVal, oldVal) {
      if (newVal != oldVal) {
        this.resetDecodeStatus();
      }
    },
  },
};
</script>