<template>
  <div id="airDropBnb">
    <div class="container">
      <div></div>
      <bnb-task />
    </div>
  </div>
</template>

<script>
import BnbTask from "./components/bnb/bnb-task.vue";
export default {
  components: { BnbTask },
};
</script>

<style lang="scss" scoped>
#airDropBnb {
  background: #111214;
}
</style>
