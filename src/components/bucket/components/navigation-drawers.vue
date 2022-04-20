<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      width="700"
      stateless
      absolute
      right
      temporary
    >
      <div class="d-flex justify-space-between">
        <span>TaskList</span>
        <span @click="$emit('update:drawer', false)">close</span>
      </div>
      <v-tabs @change="HandleChangeTab">
        <v-tab>Upload Task</v-tab>
        <v-tab>Delete Folder</v-tab>
      </v-tabs>

      <v-tabs v-model="status" @change="handleChangeStatus">
        <v-tab>all({{ all.length }})</v-tab>
        <v-tab>Uploading({{ uploading.length }})</v-tab>
        <v-tab>Stop({{ stopped.length }})</v-tab>
        <v-tab>Uploaded({{ uploaded.length }})</v-tab>
        <v-tab>Upload Failed({{ failed.length }})</v-tab>
      </v-tabs>
      <div>
        <v-btn> Stop Uploading </v-btn>
      </div>

      <uploading-table :type="status"></uploading-table>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    drawer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      status: 0,
    };
  },
  computed: {
    ...mapGetters(["all", "uploading", "stopped", "uploaded", "failed"]),
  },
  methods: {
    HandleChangeTab(value) {
      console.log(value);
    },
    handleChangeStatus(value) {
      this.status = value;
    },
  },
};
</script>

<style scoped></style>
