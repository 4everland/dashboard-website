<template>
  <v-dialog v-model="showPop" max-width="600">
    <div class="pa-6 pt-5 edit-container">
      <h3 class="fz-30">Edit Gateway</h3>
      <div class="px-5 pt-3">
        <div class="gray fz-16 mb-3">Gateway Access</div>
        <div class="al-c hide-msg">
          <span class="mr-auto">Private Gateway</span>
          <v-switch v-model="curGateway.isPrivate" dense></v-switch>
        </div>
        <div class="mt-2 fz-13 gray">
          <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon>Choose whether
          or not you want your gateway to be able to pull content from the whole
          IPFS network or just content you have pinned.
        </div>
      </div>
      <div class="ta-c mt-8">
        <v-btn outlined width="180" @click="showPop = false">Cancel</v-btn>
        <v-btn color="primary" class="ml-6" width="180">Save</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      showPop: false,
      curGateway: {
        isPrivate: false,
      },
    };
  },
  methods: {
    show(item) {
      this.curGateway = item;
      this.showPop = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-container {
  font-family: "AppleSystemUIFont";
}
</style>