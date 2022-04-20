<template>
  <div class="table-container">
    <v-data-table
      :headers="headers"
      :items="
        type == 0
          ? listAll
          : type == 1
          ? listUploading
          : type == 2
          ? listStopped
          : type == 3
          ? listUploaded
          : listFailed
      "
      class="elevation-1"
      hide-default-footer
    >
      <template #item.action>
        <span style="cursor: pointer">Cancel</span>
        <span style="cursor: pointer">Share</span>
        <span style="cursor: pointer">ClearRecords</span>
        <!-- <span style="cursor: pointer">Cancel</span> -->
      </template>
    </v-data-table>

    <div class="table-footer d-flex align-center justify-center pt-6">
      <v-pagination
        v-if="length > 1"
        v-model="page"
        :length="length"
        @input="handleSkip"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    content: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      headers: [
        {
          text: "Name",
          align: "center",
          sortable: false,
          value: "name",
        },
        { text: "Upload To", value: "path", sortable: false, align: "center" },
        { text: "Status", value: "status", sortable: false, align: "center" },
        { text: "Action", value: "action", sortable: false, align: "center" },
      ],
      page: 1,
      tableList: [],
    };
  },
  computed: {
    ...mapGetters(["all", "uploading", "stopped", "uploaded", "failed"]),
    listAll() {
      return this.all.slice((this.page - 1) * 10, this.page * 10);
    },
    listUploading() {
      return this.uploading.slice((this.page - 1) * 10, this.page * 10);
    },
    listStopped() {
      return this.stopped.slice((this.page - 1) * 10, this.page * 10);
    },
    listUploaded() {
      return this.uploaded.slice((this.page - 1) * 10, this.page * 10);
    },
    listFailed() {
      return this.failed.slice((this.page - 1) * 10, this.page * 10);
    },
    length() {
      return Math.ceil(this.$store.state.upload.executionFiles.length / 10);
    },
  },
  methods: {
    handleRemove(item) {
      this.$emit("handleRemove", item.index);
    },
    handleSkip(item) {
      this.page = item;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>