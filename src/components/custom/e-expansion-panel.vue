<template>
  <div class="upload-control-container">
    <div class="control-content">
      <div class="control-header al-c px-7">
        <slot name="header"> </slot>
        <slot
          name="control"
          :handle-click="handleClick"
          :isShowBody="isShowBody"
        >
          <button @click="handleClick">click</button>
        </slot>
        <slot></slot>
      </div>
      <div class="control-body" :style="{ height: height }">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    length: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      isShowBody: true,
      height: 0,
    };
  },
  mounted() {
    this.$watch(
      "this.isShowBody",
      (newVal) => {
        if (newVal) {
          this.height = this.length * 60 + "px";
        } else {
          this.height = 0;
        }
      },
      {
        immediate: true,
      }
    );
  },
  methods: {
    handleClick() {
      this.isShowBody = !this.isShowBody;
      if (this.isShowBody) {
        this.height = this.length * 60 + "px";
      } else {
        this.height = 0;
      }
    },
  },
  watch: {
    length(newVal) {
      this.height = newVal * 60 + "px";
    },
    isShowBody: {
      handler(newVal) {
        if (newVal) {
          this.$emit("showBody");
          this.height = this.length * 60 + "px";
        } else {
          this.height = 0;
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-control-container {
  width: 400px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgb(0 0 0 / 4%), 0 8px 28px rgb(0 0 0 / 6%),
    0 12px 48px rgb(0 0 0 / 4%);
  border-radius: 10px;
  background: #fff;
  .control-content {
    .control-header {
      height: 60px;
    }
    .control-body {
      background: #fff;
      transition: all 0.3s ease;
      overflow: scroll;
    }
  }
  .control-body::-webkit-scrollbar {
    display: none;
  }
}
</style>