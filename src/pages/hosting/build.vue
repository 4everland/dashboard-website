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
          text: "Overview",
          comp: "build-overview",
        },
        {
          text: "Source",
          comp: "build-source",
        },
      ],
    };
  },
};
</script>