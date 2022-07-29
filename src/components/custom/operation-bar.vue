<template>
  <div class="operation-bar">
    <!-- <button @click="isShow = !isShow">button</button> -->
    <Transition name="operation" appear>
      <div v-show="isShow" class="content">
        <v-checkbox
          v-model="checked"
          @change="handleChangeCheck"
          class="check-box"
        ></v-checkbox>
        <v-btn outlined>
          <img src="img/icon/ic-domain.svg" width="14" class="mr-2" />
          <span>Add Domain</span>
        </v-btn>
        <v-btn outlined class="ml-4" @click="$emit('handleDeleteSelected')">
          <img src="img/icon/ic-delete.svg" width="14" class="mr-2" />
          <span class="gray-2">Delete</span>
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
    selected: Number,
  },
  methods: {
    handleChangeCheck(value) {
      console.log(value);
      if (!value) {
        // this.isShow =false
        this.$emit("handleClearSelected");
      }
    },
  },
  watch: {
    selected(length) {
      if (length) {
        return (this.isShow = this.checked = true);
      }
      this.isShow = false;
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
  position: absolute;
  padding: 0 32px;
  width: 100%;
  left: 0;
  bottom: 50px;
  .content {
    display: flex;
    align-items: center;
    height: 70px;
    background: #f7f9fb;
    .check-box {
      padding: 0 16px;
    }
  }
}
</style>