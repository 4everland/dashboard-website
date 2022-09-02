<template>
  <span v-if="disabled">
    {{ val }}
  </span>
  <a v-else :href="'//' + val" class="u" target="_blank">
    {{ val }}
  </a>
</template>

<script>
export default {
  props: {
    val: String,
    disabled: Boolean,
  },
};
</script>