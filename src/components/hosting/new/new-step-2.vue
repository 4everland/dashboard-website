<template>
  <div v-if="info">
    <div class="main-wrap">
      <h3>Deploy</h3>
      <div class="d-flex al-c" v-if="!isDone">
        <v-progress-circular
          :size="15"
          :width="1.5"
          color="#999"
          indeterminate
        />
        <div class="gray fz-15 ml-3">
          Deployment started <e-time>{{ Date.now() }}</e-time>
        </div>
      </div>
    </div>

    <build-overview-logs @done="isDone = true" @info="info = $event" />

    <div class="ta-r mt-4" v-if="!isDone">
      <v-btn rounded outlined @click="onCancel">Cancel</v-btn>
    </div>
  </div>
  <div class="main-wrap" v-else>
    <v-skeleton-loader type="article" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDone: false,
      info: null,
    };
  },
  methods: {
    onCancel() {
      this.$confirm("", "Are you sure to quit this deployment ?").then(() => {
        this.$router.replace("/hosting/projects");
      });
    },
  },
};
</script>