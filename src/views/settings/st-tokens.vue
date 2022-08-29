<template>
  <div class="main-wrap">
    <e-tabs :list="list" vertical />
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          comp: "st-tokens-h",
          text: "Hosting Auth Tokens",
        },
        {
          comp: "st-tokens-b",
          text: "Bucket Auth Tokens",
        },
      ],
    };
  },
};
</script>