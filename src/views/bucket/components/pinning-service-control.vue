<template>
  <div class="control-container pa-5">
    <div class="al-c justify-space-between">
      <span class="fz-14">{{ title }}</span>
      <v-icon size="18" class="cursor-p" @click="$emit('close')"
        >mdi-close</v-icon
      >
    </div>
    <div class="progress mt-4">
      <div
        class="progress-content"
        :style="{ width: progressValue + '%', background: statusColor }"
      ></div>
    </div>
    <div class="gray fz-14 mt-4 al-c justify-space-between">
      <span>{{ completedTasks }} / {{ tasks.length }}</span>
      <v-btn
        v-if="failedTasks.length"
        small
        @click="$emit('retryUpload')"
        color="primary"
        >Continue</v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tasks: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  computed: {
    title() {
      if (this.processing) return "Uploading CID";
      if (this.completed) return "Upload Completed";
      return "Uploading Failed";
    },
    processing() {
      return this.tasks.some((it) => it.status == 1 || it.status == 0);
    },
    completed() {
      return !this.tasks.some((it) => it.status != 3);
    },
    failedTasks() {
      return this.tasks.filter((it) => it.status == 4 || it.status == 2);
    },
    statusColor() {
      if (this.processing) return "#34A9FF";
      if (this.completed) return "#00BD9A";
      return "#FF5656";
    },
    completedTasks() {
      return this.tasks.filter((it) => it.status == 3).length;
    },
    progressValue() {
      return (this.completedTasks / this.tasks.length) * 100;
    },
  },
};
</script>

<style lang="scss" scoped>
.control-container {
  width: 350px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  background: #ffffff;
  z-index: 2;
  position: fixed;
  right: 24px;
  bottom: 70px;
  transition: all 0.2s ease;
  .progress {
    height: 8px;
    border-radius: 4px;
    background: #f4f6f8;
    .progress-content {
      height: 100%;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
  }
}
</style>