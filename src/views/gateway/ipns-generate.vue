<template>
  <div>
    <v-btn color="primary" @click="onShow">
      <span class="fz-18">+</span>
      <span class="ml-1">Generate</span>
    </v-btn>
    <v-dialog v-model="showPop" max-width="600">
      <div class="pa-6 pt-5">
        <h3>Create Gateway</h3>
        <div class="pa-5" v-if="stepIdx == 0">
          <div class="fz-14 gray">Set a gateway name</div>
          <div class="al-c mt-3 mb-5">
            <v-text-field
              class="hide-msg"
              outlined
              dense
              solo
              placeholder="my company name"
              suffix=".4everland.link"
            ></v-text-field>
            <v-btn color="primary" class="ml-3">Checkout</v-btn>
          </div>
        </div>
        <template v-else>
          <div class="gray fz-13 mt-1">Gateway Access</div>
          <div class="pa-5">
            <div class="al-c hide-msg">
              <span class="mr-auto">Private Gateway</span>
              <v-switch v-model="form.isPrivate" dense></v-switch>
            </div>
            <div class="mt-1 fz-13 gray">
              Tips：Choose whether or not you want your gateway to be able to
              pull content from the whole IPFS network or just content you have
              pinned.
            </div>
            <div class="mt-3 al-c">
              <span>Using this Gateway</span>
              <e-tooltip top>
                <v-icon slot="ref" size="14" color="#999" class="ml-2"
                  >mdi-alert-circle</v-icon
                >
                <span
                  >Specify which files are accessible through the gateway,
                  including all or some projects or files.</span
                >
              </e-tooltip>
            </div>
          </div>
        </template>

        <div class="ta-c mt-5">
          <v-btn outlined width="100" @click="showPop = false">Cancel</v-btn>
          <v-btn color="primary" class="ml-6" width="100" @click="onNext">{{
            stepIdx == 0 ? "Next" : "Create"
          }}</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPop: false,
      stepIdx: 0,
      form: {
        isPrivate: true,
      },
    };
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
  },
};
</script>