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
        // {
        //   text: "Billing",
        //   comp: "st-billing",
        // },
        {
          text: "Account Binding",
          comp: "st-account",
        },
        {
          text: "Auth Tokens",
          comp: "st-tokens",
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