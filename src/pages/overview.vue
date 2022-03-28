<template>
  <div>
    <e-settings :list="list" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          text: "Hosting",
          comp: "h-projects",
          props: {
            limit: 5,
          },
        },
        {
          text: "Bucket",
          comp: "s-bucket",
        },
      ],
    };
  },
};
</script>