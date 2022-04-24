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
      <!-- {{ pathInfo }} -->
      <div class="upload-opreation py-4">
        <v-btn rounded color="#339CFE" outlined @click="handleAllRemove">
          <span class="ml-2">Delete All</span>
        </v-btn>
        <v-btn
          rounded
          color="#339CFE"
          outlined
          class="ml-7"
          @click="handleDelete"
        >
          <span class="ml-2">Delete</span>
        </v-btn>
      </div>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="list"
        show-select
        item-key="UploadId"
        class="elevation-1"
        hide-default-footer
      >
        <template #item.Key="{ item }">
          <span style="color: #339cfe">{{ item.Key }}</span>
        </template>
      </v-data-table>

      <template v-if="length == 0">
        <e-empty :loading="loading">
          {{ loading ? `Loading files...` : `No folders or files` }}
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
          value: "Key",
        },
        {
          text: "Upload Id",
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
  computed: {
    ...mapState({
      s3: (s) => s.s3,
      s3m: (s) => s.s3m,
    }),
    list() {
      return this.partList.slice((this.page - 1) * 10, this.page * 10);
    },
    length() {
      return Math.ceil(this.partList.length / 10);
    },
  },
  methods: {
    getPartList() {
      this.loading = true;
      const { Bucket, Prefix } = this.pathInfo;
      this.s3.listMultipartUploads(
        { Bucket, Prefix, MaxUploads: 500 },
        (err, data) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          console.log(data);
          this.partList = data.Uploads;
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
              reject(err);
            } else {
              resolve(data);
            }
            // console.log(data);
          }
        );
      });
    },
    handleAllRemove() {
      const { Bucket } = this.pathInfo;
      console.log(Bucket);
      this.s3.abortMultipartUpload(
        {
          Bucket,
          Key: "20MB的副本2.png",
          UploadId: "2891t70vRxGRRxTijx48bmDuYqA",
        },
        (err, data) => {
          if (err) throw new Error(err);
          console.log(data);
        }
      );
    },
    handleDelete() {
      this.$loading();
      // const { Bucket } = this.pathInfo;
      if (this.selected.length == 0) {
        return console.log("you selected parts is empty");
      }
      let arr = [];
      this.selected.forEach((it) => {
        arr.push(this.deleteFn(it));
      });
      console.log(arr);
      Promise.all(arr).then(async (res) => {
        console.log(res);
        this.selected = [];
        this.getPartList();
      });
    },
    handleSkip(value) {
      this.page = value;
    },
  },
  watch: {
    drawer(newValue) {
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