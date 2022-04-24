<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      class="drawer-container ov-a"
      stateless
      fixed
      right
      temporary
    >
      <div class="d-flex justify-space-between pr-6">
        <span class="fw-b fz-18">Parts</span>
        <span class="fw-b" @click="$emit('update:drawer', false)">close</span>
      </div>
      {{ pathInfo }}
      <div class="upload-opreation">
        <v-btn rounded color="primary" @click="handleAllRemove">
          <span class="ml-2">Delete All</span>
        </v-btn>
        <v-btn rounded color="primary" class="ml-7">
          <span class="ml-2">Delete</span>
        </v-btn>
      </div>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="list"
        show-select
        class="elevation-1"
        hide-default-footer
      >
      </v-data-table>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    drawer: {
      type: Boolean,
      default: true,
    },
    pathInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      headers: [
        {
          text: "Name",
          align: "center",
          sortable: false,
          value: "key",
        },
        {
          text: "Upload Id",
          value: "uploadId",
          sortable: false,
          align: "center",
        },
        { text: "Parts", value: "parts", sortable: false, align: "center" },
      ],
      parsList: [],
      selected: [],
    };
  },
  created() {},
  computed: {
    ...mapState({
      s3: (s) => s.s3,
      s3m: (s) => s.s3m,
    }),
    list() {
      return this.parsList;
    },
  },
  methods: {
    handleAllRemove() {
      console.log(this.s3m);
      console.log(111);
      // const { Bucket } = this.pathInfo;
      this.s3m.removeIncompleteUpload("lyw", "123", (err) => {
        console.log(err);
      });
    },
  },
  watch: {
    drawer(newValue) {
      if (newValue == true) {
        const { Bucket, Prefix } = this.pathInfo;
        console.log(this.s3m);
        console.log(this.s3m.extensions);
        const stream = this.s3m.listIncompleteUploadsQuery(
          Bucket,
          Prefix,
          "",
          "",
          "/"
        );
        stream.on("data", (obj) => {
          console.log(obj);
        });
        stream.on("end", function () {
          console.log("End");
        });
        stream.on("error", function (err) {
          console.log(err);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-container {
  width: 70vw !important;
}
</style>