<template>
  <div class="task-box">
    <div class="task-tit">Tasks</div>
    <div class="task-tips">
      Complete tasks to unlock the prize pool sharing eligibility. Rewards will
      be distributed uniformly at the end of the event.
    </div>
    <template>
      <v-expansion-panels dark>
        <v-expansion-panel v-for="(item, i) in 5" :key="i">
          <v-expansion-panel-header> Item </v-expansion-panel-header>
          <v-expansion-panel-content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </div>
</template>

<script>
export default {
  name: "DashboardWebsiteBnbTask",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.task-box {
  .task-tit {
    color: #f1f5f9;
    font-size: 24px;
    font-weight: 700;
  }
  .task-tips {
    color: #f1f5f9;
    font-size: 14px;
    font-weight: 400;
    margin-top: 8px;
  }
}
</style>
