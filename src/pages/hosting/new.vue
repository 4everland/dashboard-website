<style lang="scss">
.new-project {
  .v-window {
    overflow: visible;
  }
  .main-wrap {
    min-height: auto;
    padding: 20px;
    h3 {
      margin-bottom: 20px;
      font-size: 18px;
      line-height: 1;
    }
    h4 {
      margin-bottom: 10px;
      line-height: 1;
      font-size: 14px;
      font-weight: normal;
    }
  }
}
</style>

<template>
  <div class="new-project">
    <e-steps :options="stepList" :value="curStep"></e-steps>
    <!-- <div class="main-wrap">new</div> -->
    <v-window v-model="curStep" class="mt-5">
      <v-window-item v-for="i in [0, 1, 2]" :key="i" :value="i">
        <component
          :is="'new-step-' + i"
          :active="i == curStep"
          :info="info"
          @set-info="info = $event"
          @next="curStep += 1"
          @back="curStep -= 1"
        />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stepList: ["Import Repository", "Edit Configuration", "Start Deployment"],
      curStep: 0,
      info: null,
    };
  },
  watch: {
    "$route.path"() {
      this.curStep = 0;
    },
  },
  mounted() {
    const { taskId } = this.$route.query;
    if (taskId) this.curStep = 2;
  },
};
</script>