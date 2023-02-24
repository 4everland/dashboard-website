<template>
  <div class="main-wrap">
    <div class="pa-8 ta-c" v-if="isEmpty">
      <e-empty> No Output </e-empty>
    </div>
    <v-row v-else>
      <v-col cols="12" md="5">
        <v-skeleton-loader type="article" v-if="initLoading" />
        <v-treeview
          v-else
          :load-children="getFiles"
          @update:active="onActive"
          activatable
          hoverable
          open-on-click
          dense
          :items="dirList"
        >
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="item.type == 'dir'">
              {{ open ? "mdi-folder-open" : "mdi-folder" }}
            </v-icon>
            <v-icon v-else>
              {{ files[item.ftype] || "mdi-file" }}
            </v-icon>
          </template>
        </v-treeview>
      </v-col>
      <v-col cols="12" md="7" v-if="fileName">
        <v-skeleton-loader type="article" v-if="loading" />
        <div class="ta-c" v-else-if="isMedia">
          <img
            v-if="isImg"
            :src="result"
            :alt="fileName"
            style="max-width: 100%"
          />
          <audio v-else-if="isAudio" :src="result"></audio>
          <video v-else :src="result" class="w100p" controls></video>
        </div>
        <div class="ta-c pd-20" v-else-if="isLarge">
          <v-btn :href="result" target="_blank">
            <v-icon>mdi-file-export-outline</v-icon>
            <span>{{ fileName }}</span>
          </v-btn>
        </div>
        <div v-else class="fz-14 lh-2 ov-a" style="max-height: 80vh">
          {{ result }}
        </div>
        <div class="ta-c mt-3 gray fz-14">
          {{ sizeInfo }}
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initLoading: true,
      isEmpty: false,
      dirList: [],
      files: {
        html: "mdi-language-html5",
        js: "mdi-nodejs",
        css: "mdi-language-css3",
        json: "mdi-code-json",
        md: "mdi-language-markdown",
        pdf: "mdi-file-pdf",
        ico: "mdi-file-image",
        png: "mdi-file-image",
        svg: "mdi-file-image",
        txt: "mdi-file-document-outline",
        xls: "mdi-file-excel",
      },
      result: null,
      loading: false,
      fileName: null,
      info: null,
      fileSize: 0,
    };
  },
  computed: {
    taskId() {
      return this.$route.params.taskId;
    },
    buildInfo() {
      return this.$store.state.buildInfo;
    },
    ftype() {
      return this.getFtype(this.fileName);
    },
    sizeInfo() {
      const m = Math.pow(1024, 2);
      if (this.fileSize >= m) return (this.fileSize / m).toFixed(1) + "M";
      return (this.fileSize / 1024).toFixed(1) + "K";
    },
    isLarge() {
      return this.fileSize > 512 * 1024;
    },
    isImg() {
      return /ico|png|jpg|jpeg|gif|svg/.test(this.ftype);
    },
    isAudio() {
      return /mp3|wav/.test(this.ftype);
    },
    isVideo() {
      return /mp4|avi|rmvb|flv|mov/.test(this.ftype);
    },
    isMedia() {
      return this.isImg || this.isAudio || this.isVideo;
    },
  },
  watch: {
    buildInfo({ data }) {
      if (data.taskId == this.taskId && data.state == "SUCCESS") {
        this.initData();
      }
    },
    taskId() {
      this.initData();
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    getFtype(name) {
      const mat = /\.(\w+)$/.exec(name);
      return mat ? mat[1] : "";
    },
    async initData() {
      if (!this.taskId) return;
      try {
        this.initLoading = true;
        this.isEmpty = false;
        const { data } = await this.$http.get(
          `$hosting/project/task/object/${this.taskId}`,
          {
            noTip: 1,
          }
        );
        this.info = data.task;
        const { state } = data.task;
        if (state == "SUCCESS") {
          this.getFiles();
        } else {
          this.isEmpty = true;
        }
      } catch (error) {
        this.isEmpty = true;
      }
    },
    async onActive(it) {
      const [hash, name, dir, size] = it[0].split(",");
      try {
        this.fileName = name;
        this.loading = true;
        this.result = "";
        const url = `$hosting/artifact/deployment/${hash}/file/${name}`;
        this.fileSize = size;
        if (this.isMedia || this.isLarge) {
          await this.$sleep(500);
          this.result =
            "//" + this.info.domain + "/" + dir + "/" + this.fileName;
        } else {
          const { data } = await this.$http.get(url);
          // console.log(data)
          this.result = data;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async getFiles(item) {
      const params = {};
      if (item) {
        params.cid = item.hash;
      }
      const { data } = await this.$http.get(
        `$hosting/artifact/deployment/${this.taskId}/output`,
        {
          params,
          noTip: true,
        }
      );
      data.forEach((it) => {
        if (it.type == "Directory") {
          it.type = "dir";
          it.children = [];
          it.dir = it.name;
        } else {
          it.ftype = this.getFtype(it.name);
          it.dir = "";
        }
        if (item) {
          it.dir = item.dir + (it.dir ? "/" + it.dir : "");
        }
        it.id = [it.hash, it.name, it.dir, it.size].join(",");
      });
      // console.log(data);
      if (item) {
        item.children.push(...data);
      } else {
        this.dirList = data;
        this.initLoading = false;
      }
    },
  },
};
</script>