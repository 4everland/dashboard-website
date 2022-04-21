<template>
  <div class="ta-c">
    <img
      :src="img || `img/svg/common/empty${loading ? 1 : 2}.svg`"
      :height="height || (loading ? 100 : 130)"
    />
    <div class="mt-5">
      <p class="fw-b mb-3 fz-18" v-if="title">{{ title }}</p>
      <p class="fz-17 gray">
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    title: String,
    img: String,
    height: Number,
  },
};
</script>