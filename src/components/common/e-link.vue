<template>
  <a :href="href" target="_blank" class="u" v-if="href">
    <slot></slot>
  </a>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    href: String,
  },
};
</script>