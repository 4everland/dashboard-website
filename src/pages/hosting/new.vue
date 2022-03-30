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
      font-size: 20px;
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
          :data="info"
          @set-info="info = $event"
          @next="curStep += 1"
          @back="onBack"
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
    "$route.query"() {
      this.onQuery();
    },
  },
  mounted() {
    this.onQuery();
  },
  methods: {
    onQuery() {
      const { taskId, type, s } = this.$route.query;
      if (type == "clone-flow" && s) this.curStep = 1;
      else if (taskId) this.curStep = 2;
    },
    onBack() {
      this.$router.back();
      this.curStep -= 1;
    },
  },
};
</script>