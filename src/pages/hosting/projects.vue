<template>
  <h-projects />
</template>
<script>
import HProjects from "@/views/hosting/h-projects";
export default {
  components: {
    HProjects,
  },
  mounted() {
    this.$setState({
      allowNoLogin: false,
    });
  },
};
</script>