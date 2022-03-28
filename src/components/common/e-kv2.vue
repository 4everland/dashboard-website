<template>
  <div>
    <p class="gray-6 fz-14">{{ label }}</p>
    <div class="mt-2">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
  },
};
</script>