<style lang="scss">
.check-all {
  background: #e1e4e8 !important;
}
</style>

<template>
  <div>
    <v-btn
      color="primary"
      @click="onShow"
      :disabled="isInsufficient || listLength >= 3"
    >
      <span class="fz-18">+</span>
      <span class="ml-1">Generate</span>
    </v-btn>
    <v-dialog v-model="showPop" max-width="600">
      <div class="pa-6 pt-5 gateway-generate-container">
        <h3 class="fz-20">Create IPFS Dedicated Gateway</h3>
        <div class="pt-5" v-show="stepIdx == 0">
          <div class="mt-3 d-flex align-start">
            <v-form ref="form" class="flex-1">
              <v-text-field
                dense
                v-model="subDomain"
                persistent-placeholder
                label="gateway name"
                :rules="[
                  (v) => !!v || 'Invalid subdomain',
                  (v) =>
                    /^(?!-)[a-z0-9-_]{6,20}(?!<-)$/.test(v)
                      ? true
                      : 'The gateway name can only support numbers, letters, and has to 6-20 digits.',
                ]"
                @input="checkout"
              ></v-text-field>
            </v-form>
            <span class="ml-3 mt-2">.4everland.link</span>
          </div>
          <decode-status
            v-if="showDecodeStatus"
            :status="validStatus"
            :statusText="statusText"
          />
        </div>
        <div v-show="stepIdx != 0">
          <div class="gray fz-13 mt-1">Gateway Access</div>
          <div class="pa-5">
            <div class="al-c hide-msg">
              <span class="mr-auto">Private Gateway</span>
              <v-switch v-model="isPrivate" dense></v-switch>
            </div>
            <div class="mt-2 fz-13 gray">
              <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon>
              <span
                >Choose whether or not you want your gateway to be able to pull
                content from the whole IPFS network or just content you have
                pinned.</span
              >
            </div>
          </div>
        </div>

        <div class="ta-c mt-5">
          <v-btn
            color="primary"
            width="180"
            @click="onNext"
            :loading="createLoading"
            :disabled="stepIdx == 0 && validStatus != 2"
            >{{ stepIdx == 0 ? "Next" : "Create" }}</v-btn
          >
          <v-btn class="ml-6" outlined width="180" @click="showPop = false"
            >Cancel</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import DecodeStatus from "@/components/custom/decode-status";
import debounce from "@/plugins/debounce";
export default {
  components: {
    DecodeStatus,
  },
  props: {
    isInsufficient: Boolean,
    listLength: Number,
  },
  data() {
    return {
      showPop: false,
      stepIdx: 0,
      isPrivate: true,
      validStatus: 1,
      showDecodeStatus: false,
      subDomain: "",
      createLoading: false,
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
    async onNext() {
      if (this.stepIdx == 0) {
        this.stepIdx = 1;
      } else {
        try {
          this.createLoading = true;
          await this.$http.put(
            "$gateway/gateway",
            {
              name: this.subDomain,
              scope: this.isPrivate ? "private" : "public",
            },
            { noTip: 1 }
          );
          this.$emit("getList");
        } catch (error) {
          console.log(error);
          if (error.code == "NAME_REACH_LIMIT") {
            this.$alert("You reached your gateways count limit.");
          }
          if (error.code == "EXISTS_PRIVATE_GATEWAY") {
            this.$alert("You reached your private gateways count limit.");
          }
        }
        this.createLoading = false;
        this.showPop = false;
      }
    },

    async checkoutGateway() {
      try {
        // console.log(this.subDomain);
        if (!this.$refs.form.validate()) return;
        // if (!/^(?!-)[a-z0-9-_]{2,20}(?!<-)$/.test(this.subDomain)) return;
        this.showDecodeStatus = true;
        this.validStatus = 1;
        const { data } = await this.$http.get(
          `$gateway/gateway/check/${this.subDomain}`
        );
        // console.log(data);
        if (data) return (this.validStatus = 3);
        this.validStatus = 2;
      } catch (error) {
        console.log(error);
        this.validStatus = 3;
      }
    },
    checkout() {
      if (!this.showPop) return;
      debounce(this.checkoutGateway, 500);
    },
    resetDecodeStatus() {
      this.showDecodeStatus = false;
      this.validStatus = 1;
    },
  },
  watch: {
    showPop(val) {
      if (!val) {
        this.$refs.form.reset();
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