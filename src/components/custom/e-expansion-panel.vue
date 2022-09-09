<template>
  <div class="upload-control-container">
    <div class="control-content">
      <div class="control-header al-c">
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
      <div class="control-body" ref="content">
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
    this.$nextTick(() => {
      this.height = this.$refs.content.offsetHeight;
    });
    this.$watch(
      "this.isShowBody",
      (newVal) => {
        if (newVal) {
          this.$refs.content.style.height = this.length * 60 + "px";
        } else {
          this.$refs.content.style.height = 0 + "px";
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
        this.$refs.content.style.height = this.length * 60 + "px";
      } else {
        this.$refs.content.style.height = 0 + "px";
      }
    },
  },
  watch: {
    length(newVal) {
      this.$refs.content.style.height = newVal * 60 + "px";
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-control-container {
  width: 400px;
  padding: 0 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgb(0 0 0 / 4%), 0 8px 28px rgb(0 0 0 / 6%),
    0 12px 48px rgb(0 0 0 / 4%);
  border-radius: 4px;
  box-shadow: border-box;
  background: #fff;
  .control-content {
    .control-header {
      height: 60px;
      background: #fff;
    }
    .control-body {
      background: #fff;
      transition: all 0.3s ease;
      overflow: scroll;
    }
  }
}
</style>