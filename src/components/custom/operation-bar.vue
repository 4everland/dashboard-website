<template>
  <div
    class="operation-bar"
    :style="appDrawer ? 'width:100%' : 'width:calc(100% - 256px)'"
  >
    <!-- <button @click="isShow = !isShow">button</button> -->
    <Transition name="operation" appear>
      <div v-show="isShow" class="content">
        <v-checkbox
          v-model="checked"
          @change="handleChangeCheck"
          class="check-box"
          color="#34A9FF"
        ></v-checkbox>
        <v-btn
          outlined
          tile
          @click="$emit('handleAddDomain')"
          v-show="selected.length <= 1 && inBucket"
        >
          <!-- <img src="/img/icon/ic-domain.svg" width="14" class="mr-2" /> -->
          <span>Add Domain</span>
        </v-btn>

        <!-- <v-list-item :href="getViewUrl(selected[0])" target="_blank">
        </v-list-item> -->

        <v-btn
          outlined
          tile
          class="ml-4"
          @click="$emit('download')"
          v-show="selected.length == 1 && inFile && isFile"
        >
          <span class="gray-2">Download</span>
        </v-btn>
        <v-btn
          outlined
          tile
          class="ml-4"
          v-show="selected.length == 1 && inFile && isFile"
          v-clipboard="clipboardVal"
          @success="onCopied"
        >
          <span class="gray-2">Copy Path</span>
        </v-btn>
        <v-btn
          outlined
          tile
          class="ml-4"
          v-show="selected.length == 1 && inFile && isFile"
          @click="$emit('onRename')"
        >
          <span class="gray-2">Rename</span>
        </v-btn>
        <v-btn
          outlined
          tile
          class="ml-4"
          v-show="selected.length == 1 && inFile && isFile"
          @click="$emit('onSyncAR')"
        >
          <span v-if="isNotAr" class="gray-2">Sync to AR</span>
          <span v-else class="gray-2">Verify on Ar</span>
        </v-btn>
        <v-btn
          tile
          style="border-color: #6c7789"
          outlined
          class="ml-4"
          v-show="selected.length >= 1"
          @click="$emit('handleDeleteSelected')"
        >
          <!-- <img src="/img/icon/ic-delete.svg" width="14" class="mr-2" /> -->
          <span class="gray">Delete</span>
        </v-btn>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      checked: false,
    };
  },
  props: {
    selected: Array,
    inBucket: {
      type: Boolean,
      default: false,
    },
    inFile: {
      type: Boolean,
      default: false,
    },
    isNotAr: {
      type: Boolean,
      default: false,
    },
    clipboardVal: {
      type: String,
      default: "",
    },
  },
  computed: {
    appDrawer() {
      return this.$vuetify.application.framework.breakpoint.mobile;
    },
    isFile() {
      if (this.selected.length && this.selected[0].isFile) return true;
      return false;
    },
  },
  methods: {
    onCopied() {
      this.$toast("Copied to clipboard !");
    },
    handleChangeCheck(value) {
      console.log(value);
      if (!value) {
        // this.isShow =false
        this.$emit("handleClearSelected");
      }
    },
  },
  watch: {
    selected: {
      handler(arr) {
        const length = arr.length;
        if (length) {
          return (this.isShow = this.checked = true);
        }
        this.isShow = false;
      },
      deep: true,
    },
  },
};
</script>
<style >
.content .v-btn:first-of-type {
  margin-left: 20px !important;
}
</style>
<style lang="scss" scoped>
.operation-enter-active,
.operation-leave-active {
  transition: opacity 0.5s ease;
}

.operation-enter,
.operation-leave-to {
  height: 0;
  opacity: 0;
}

.operation-bar {
  position: fixed;
  // width: calc(100% - 256px);
  right: 0;
  bottom: 0;
  .content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background: rgba(255, 255, 255);
    .check-box {
      padding: 0 16px;
    }
  }
}
</style>