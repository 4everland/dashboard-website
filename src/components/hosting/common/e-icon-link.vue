<template>
  <div class="d-flex al-c">
    <img :src="img" :height="height" />
    <div class="ml-2 fz-14">
      <a v-if="link" class="u b" :href="link" target="_blank">
        <slot></slot>
      </a>
      <span v-else>
        <slot></slot>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: null,
      default: 18,
    },
    img: String,
    link: String,
  },
};
</script>