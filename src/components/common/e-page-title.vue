<template>
  <div>
    <h3><slot></slot></h3>
    <div class="gray mt-1 fz-14">{{ desc }}</div>
  </div>
</template>

<script>
export default {
  props: {
    desc: String,
  },
};
</script>
