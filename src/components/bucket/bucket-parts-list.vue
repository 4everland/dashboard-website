<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      class="drawer-container ov-a"
      fixed
      right
      temporary
    >
      <div class="d-flex justify-space-between pr-6">
        <span class="fw-b fz-18">Fragments</span>
        <img
          style="cursor: pointer"
          @click="drawer = false"
          src="/img/svg/close_icon.svg"
          alt=""
        />
      </div>
      <!-- {{ pathInfo }} -->
      <div class="upload-opreation py-4">
        <v-btn
          rounded
          color="#339CFE"
          outlined
          @click="handleDeleteAll"
          :disabled="!partList.length"
        >
          <span class="ml-2">Delete All</span>
        </v-btn>
        <v-btn
          rounded
          color="#339CFE"
          outlined
          class="ml-7"
          @click="handleDelete"
          :disabled="!selected.length"
        >
          <span class="ml-2">Delete</span>
        </v-btn>
      </div>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="list"
        show-select
        :checkbox-color="$color1"
        item-key="UploadId"
        class="elevation-1 part-list-table"
        hide-default-footer
      >
        <template #item.Key="{ item }">
          <div class="key-name">
            <span>
              {{ item.Key }}
            </span>
          </div>
        </template>
      </v-data-table>

      <template v-if="length == 0">
        <e-empty :loading="loading">
          {{ loading ? `Loading Fragments...` : `No Fragments` }}
        </e-empty>
      </template>
      <v-pagination
        class="mt-4"
        v-if="length > 1"
        v-model="page"
        :length="length"
        @input="handleSkip"
      ></v-pagination>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    value: {
      type: Boolean,
    },
    pathInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      drawer: this.value,
      headers: [
        {
          text: "Name",
          align: "center",
          sortable: false,
          value: "Key",
          width: 400,
        },
        {
          text: "Upload ID",
          value: "UploadId",
          sortable: false,
          align: "center",
        },
      ],
      partList: [],
      selected: [],
      page: 1,
      loading: false,
    };
  },
  created() {
    this.page = 1;
  },
  computed: {
    ...mapState({
      s3: (s) => s.s3,
      s3m: (s) => s.s3m,
    }),
    list() {
      if (this.partList)
        return this.partList.slice((this.page - 1) * 10, this.page * 10);
      return [];
    },
    length() {
      if (this.partList) return Math.ceil(this.partList.length / 10);
      return 0;
    },
  },
  methods: {
    getPartList() {
      this.loading = true;
      const { Bucket, Prefix } = this.pathInfo;
      if (!this.s3) return;
      this.s3.listMultipartUploads(
        { Bucket, Prefix, MaxUploads: 500 },
        (err, data) => {
          if (err) {
            // console.log(err);
            throw new Error(err);
          }
          // console.log(data);
          this.partList = data.Uploads ?? [];
          this.loading = false;
          this.$loading.close();
        }
      );
    },
    deleteFn(item) {
      const { Bucket } = this.pathInfo;
      return new Promise((resolve, reject) => {
        this.s3.abortMultipartUpload(
          {
            Bucket,
            Key: item.Key,
            UploadId: item.UploadId,
          },
          (err, data) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(data);
            }
            // console.log(data);
          }
        );
      });
    },
    handleDeleteAll() {
      this.$loading();
      let arr = [];
      this.partList.forEach((it) => {
        arr.push(this.deleteFn(it));
      });
      console.log(arr);
      Promise.all(arr)
        .then(() => {
          // console.log(res);
          this.page = 1;
          this.getPartList();
          this.selected = [];
        })
        .catch((err) => {
          // console.log(err, "err");
          this.$alert(err.message);
        });
    },
    handleDelete() {
      this.$loading();
      let arr = [];
      this.selected.forEach((it) => {
        arr.push(this.deleteFn(it));
      });
      Promise.all(arr)
        .then(() => {
          // console.log(res);
          this.selected = [];
          this.page = 1;
          this.getPartList();
        })
        .catch((err) => {
          // console.log(err, "err");
          this.$alert(err.message);
        });
    },
    handleSkip(value) {
      this.page = value;
    },
  },
  watch: {
    value(value) {
      this.drawer = value;
    },
    drawer(newValue) {
      this.$emit("input", newValue);
      if (newValue == true) {
        this.getPartList();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-application .elevation-1 {
  box-shadow: none !important;
  color: #0b0817 !important;
}
.drawer-container {
  width: 50vw !important;
  padding: 24px 0 24px 24px;
  bottom: 0;
  box-sizing: border-box;
  border-radius: 20px 0 0 20px;
  height: 100vh !important;
  overflow: auto;
  .key-name {
    color: #339cfe;
    width: 400px;
    word-break: break-all;
    white-space: pre-wrap;
  }
}

.v-tab {
  font-size: 14px;
  font-weight: 400;
  color: #6a778b;
  border-bottom: 1px solid #d0dae9;
}
.v-tab.v-tab--active {
  color: #34a9ff;
}
.v-tab.v-tab--active span:nth-of-type(1) {
  font-size: 20px;
}
</style>