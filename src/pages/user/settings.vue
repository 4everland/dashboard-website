<template>
  <div>
    <e-tabs :list="list" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          text: "Account Binding",
          comp: "st-account",
        },
        {
          text: "General",
          comp: "st-general",
        },
      ],
    };
  },
};
</script>