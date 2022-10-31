<template>
  <v-dialog v-model="showPop" max-width="600">
    <div class="pa-6 pt-5 edit-container">
      <h3 class="fz-20">Edit Gateway</h3>
      <div class="pt-3">
        <div class="gray fz-16 mb-3">
          {{ curGateway.name }}.4everland.link Access
        </div>
        <div class="al-c hide-msg">
          <span class="mr-auto">Private Gateway</span>
          <v-switch v-model="curGateway.scope" dense></v-switch>
        </div>
        <div class="mt-2 fz-13 gray">
          <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon>Choose whether
          or not you want your gateway to be able to pull content from the whole
          IPFS network or just content you have pinned.
        </div>
      </div>
      <div class="ta-c mt-8">
        <v-btn
          color="primary"
          width="180"
          @click="onSave"
          :loading="saveLoading"
          >Save</v-btn
        >
        <v-btn outlined width="180" class="ml-6" @click="showPop = false"
          >Cancel</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      showPop: false,
      curGateway: {},
      saveLoading: false,
    };
  },
  methods: {
    show(item) {
      this.curGateway = JSON.parse(JSON.stringify(item));
      this.curGateway.scope = item.scope == "private" ? true : false;
      console.log(this.curGateway);
      this.showPop = true;
    },
    async onSave() {
      try {
        this.saveLoading = true;
        await this.$http2.put(
          "$gateway/gateway",
          {
            name: this.curGateway.name,
            scope: this.curGateway.scope ? "private" : "public",
          },
          { noTip: 1 }
        );
        this.$emit("getList");
      } catch (error) {
        console.log(error);
        if (error.code == "EXISTS_PRIVATE_GATEWAY") {
          this.$alert("You reached your private gateways count limit.");
        }
      }
      this.saveLoading = false;
      this.showPop = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>