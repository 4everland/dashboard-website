<template>
  <div
    class="pa-5 bd-1 bdrs-3 bg-white"
    :style="icon == 'fail' ? 'border-color: #FF6960' : ''"
  >
    <div class="d-flex al-c hover-1" @click="isShow = !isShow">
      <v-icon
        :color="color"
        :class="{
          'rotate-90': isShow,
        }"
        >mdi-menu-right</v-icon
      >
      <span class="fz-14">{{ title }}</span>
      <div class="ml-auto d-flex al-c">
        <span>
          <slot name="time"></slot>
        </span>
        <div v-if="icon && icon != 'fail'" class="ml-2 d-flex">
          <img
            src="img/svg/common/ic-checked1.svg"
            height="15"
            class="d-b"
            v-if="icon == 'checked'"
          />
          <v-progress-circular
            v-else
            :size="15"
            :width="1.5"
            color="#999"
            :indeterminate="icon == 'loading'"
          />
        </div>
      </div>
    </div>
    <div class="mt-5" v-if="isShow">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    title: String,
    color: {
      type: String,
      default: "#775DA6",
    },
    icon: String,
  },
  data() {
    return {
      isShow: this.value,
    };
  },
  watch: {
    value(val) {
      this.isShow = val;
    },
    isShow(val) {
      this.$emit("input", val);
    },
  },
};
</script>