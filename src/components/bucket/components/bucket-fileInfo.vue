<template>
  <Transition name="file" appear>
    <div class="nav" v-show="fileInfoDrawer">
      <div class="single-file" v-if="selected.length == 1">
        <v-img
          class="my-4"
          height="127"
          max-height="127"
          max-width="100%"
          :src="thumbnail"
        >
          <template #placeholder>
            <img src="/img/svg/bucketFileInfo/default-file-img.svg" alt="" />
          </template>
        </v-img>

        <v-skeleton-loader
          v-show="fileLoading"
          type="article"
        ></v-skeleton-loader>
        <ul class="ls-none" v-show="singleFile && !fileLoading">
          <p class="fz-16 fw-b">{{ selected[0].name }}</p>

          <template v-for="(it, i) in fileInfoList">
            <li class="mt-2 mb-2 fz-12 d-flex" :key="i">
              <span class="d-ib pa-1" style="min-width: 85px"
                >{{ it.label }}:</span
              >
              <div v-if="it.name == 'ipfs'">
                <v-btn
                  text
                  small
                  target="_blank"
                  :href="`https://${it.value}.ipfs.dweb.link`"
                >
                  {{ it.value.cutStr(5, 5) }}
                </v-btn>
                <v-btn icon small v-clipboard="it.value" @success="onCopied">
                  <v-icon size="15" class="ml-auto">mdi-content-copy</v-icon>
                </v-btn>
              </div>
              <div v-else-if="it.name == 'arHash'" class="d-flex al-c f-wrap">
                <template
                  v-if="fileInfo.arStatus == 'synced' && fileInfo.arHash"
                >
                  <v-btn
                    text
                    small
                    target="_blank"
                    :href="$arHashPre + fileInfo.arHash"
                  >
                    {{ it.value.cutStr(5, 5) }}
                  </v-btn>
                  <v-btn
                    icon
                    small
                    v-clipboard="fileInfo.arHash"
                    @success="onCopied"
                  >
                    <v-icon size="15" class="ml-auto">mdi-content-copy</v-icon>
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn small text disabled>
                    <sync-state
                      :val="fileInfo.arStatus"
                      style="border: 1px solid; padding: 3px 8px"
                      class="bdrs-3"
                    ></sync-state>
                  </v-btn>
                  <v-btn
                    slot="ref"
                    text
                    x-small
                    @click.stop="headObject"
                    v-if="fileInfo.arStatus == 'syncing'"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                  <div
                    class="d-flex al-c f-wrap ml-2 fz-13"
                    v-if="['failure', 'timeout'].includes(fileInfo.arStatus)"
                  >
                    <span v-if="fileInfo.arFailReason" class="mr-2 fz-13">{{
                      fileInfo.arFailReason
                    }}</span>
                    <template v-if="!isAr">
                      <v-btn small text @click="onSyncAR(fileName, 'put')"
                        >Cancel</v-btn
                      >
                      <span>or</span>
                    </template>
                    <v-btn
                      small
                      text
                      color="primary"
                      @click="onSyncAR(fileName, 'post', fileInfo.hash)"
                      >Retry</v-btn
                    >
                  </div>
                </template>
              </div>
              <div v-else-if="it.name == 'url'">
                <a
                  v-for="(link, j) in it.value"
                  class="pa-1 ml-2 file-link"
                  style="word-break: break-all"
                  :key="j"
                  :href="link"
                  target="_blank"
                >
                  {{ link }}
                </a>
              </div>
              <span v-else class="pa-1 ml-2">{{ it.value }}</span>
            </li>
          </template>
        </ul>
        <div v-show="singleDir && !fileLoading">
          <div class="fz-16 fw-b">
            <v-icon size="18">mdi-folder</v-icon>
            {{ selected[0].name }}
          </div>

          <p class="dir-file-name fz-12" v-for="(it, i) in dirFileArr" :key="i">
            {{ it.name }}
          </p>
          <p class="enter-folder fz-12" @click="handleEnterFolder">
            More files please view in the folder
          </p>
        </div>
      </div>

      <div
        v-else-if="selected.length == 0"
        style="height: 100%"
        class="d-flex flex-column justify-center align-center"
      >
        <img width="80%" src="img/svg/common/empty2.svg" />
        <p class="fz-12 mt-4" style="color: #6c7789">
          Select a file/folder to view details
        </p>
      </div>
      <div class="multifile" v-else>
        <v-img
          class="my-4"
          height="127"
          max-height="127"
          max-width="100%"
          src="/img/svg/bucketFileInfo/dir-file-img.svg"
        >
        </v-img>
      </div>
    </div>
  </Transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    selected: Array,
    fileInfoDrawer: Boolean,
    isAr: Boolean,
    bucketInfo: Object,
  },
  data() {
    return {
      drawer: true,
      fileLoading: false,
      fileInfo: null,
      thumbnail: null,
      dirFileArr: [],
      domains: [],
    };
  },
  computed: {
    ...mapState({
      s3: (s) => s.s3,
      s3m: (s) => s.s3m,
    }),
    singleFile() {
      if (this.selected.length == 1 && this.selected[0].isFile) return true;
      return false;
    },
    singleDir() {
      if (this.selected.length == 1 && !this.selected[0].isFile) return true;
      return false;
    },
    pathInfo() {
      const path = decodeURIComponent(this.$route.path);
      const arr = path.split("/").slice(3);
      const Key = arr.slice(1).join("/") + this.selected[0].name;
      const Bucket = arr[0];
      if (this.singleFile)
        return {
          Bucket,
          Key,
        };
      return {
        Bucket,
        Prefix: Key + "/",
        Delimiter: "/",
      };
    },
    fileInfoList() {
      const info = this.fileInfo;
      if (!info) return [];
      return [
        {
          label: "Last Modified",
          value: info.updateAt.format(),
        },
        {
          label: "Size",
          value: this.$utils.getFileSize(info.size),
        },
        {
          label: "IPFS Hash",
          name: "ipfs",
          value: info.hash,
        },
        {
          label: "AR Hash",
          name: "arHash",
          value: info.arHash,
        },
        {
          label: "Object URL",
          name: "url",
          value: this.fileUrls,
        },
      ];
    },
    fileUrls() {
      const { Key } = this.pathInfo;
      // const list = this.domains.map((it) => {
      //   return it.domain + "/" + Key;
      // });
      const list = this.bucketInfo.originList
        .concat(this.domains)
        .map((origin) => {
          return origin + "/" + Key;
        });
      // console.log(list);
      if (!list.length) list.push(this.fileInfo.url);
      return list;
    },
    fileUrl() {
      return this.fileUrls[0] || "";
    },
    notImg() {
      const reg = /.(png|jpg|gif|jpeg|webp)$/;
      return !reg.test(this.fileUrl);
    },
  },
  methods: {
    async headObject() {
      this.thumbnail = "";
      this.fileLoading = true;
      this.fileInfo = null;
      this.s3.headObject(
        { ...this.pathInfo, IfMatch: this.selected[0].hash },
        (err, data) => {
          this.fileLoading = false;
          if (err) console.log(err);
          console.log(data);
          const meta = data.Metadata;
          let arStatus = meta["arweave-status"]
            ? meta["arweave-status"]
            : "desynced";
          // if (!arStatus) {
          //   arStatus = this.defArStatus;
          // }
          this.fileInfo = {
            size: data.ContentLength,
            type: data.ContentType,
            hash: this.$utils.getCidV1(data.ETag),
            updateAt: data.LastModified,
            url: this.$endpoint,
            arStatus,
            arHash: meta["arweave-hash"],
            arFailReason: (meta["arweave-failed-reason"] || "").replaceAll(
              "-",
              " "
            ),
          };
          this.thumbnail = this.notImg
            ? "/img/svg/bucketFileInfo/file-not-img.svg"
            : this.fileUrl;
        }
      );
      this.getDomain();
    },

    async getObjects() {
      this.fileLoading = true;
      this.dirFileArr = [];
      let { Bucket, Prefix, Delimiter } = this.pathInfo;
      console.log(Bucket, Prefix, Delimiter);
      // bucketName, prefix, continuationToken, delimiter, maxKeys, startAfter
      const stream = this.s3m.extensions.listObjectsV2WithMetadataQuery(
        Bucket,
        Prefix,
        "",
        Delimiter,
        10,
        ""
      );
      stream.on("data", (data) => {
        this.fileLoading = false;
        console.log(data.objects);
        this.dirFileArr = data.objects;
        console.log(this.dirFileArr, "dirFile");
      });
    },
    handleEnterFolder() {
      const path = decodeURIComponent(this.$route.path);
      const finalPath =
        path + this.selected[0].name + (this.selected[0].isFile ? "" : "/");
      this.$router.push(finalPath);
    },
    onCopied() {
      this.$toast("Copied to clipboard !");
    },
    async getDomain() {
      const { Bucket } = this.pathInfo;
      try {
        const { data } = await this.$http.get("/domains", {
          params: { bucketName: Bucket },
        });
        this.domains = data.list
          .filter((it) => it.valid)
          .map((domain) => {
            return (this.$inDev ? "http:" : "https:") + "//" + domain.domain;
          });

        console.log(this.domains);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    selected: {
      handler(selectedArr) {
        if (selectedArr.length == 1) {
          if (selectedArr[0].isFile) {
            this.headObject();
          } else {
            this.thumbnail = "/img/svg/bucketFileInfo/dir-file-img.svg";
            this.getObjects();
          }
          console.log(selectedArr);
        } else if (selectedArr.length == 0) {
          console.log(">1");
          this.fileInfo = null;
          // this.file
          this.dirFileArr = [];
        } else {
          console.log(">1");
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.file-enter-active,
.file-leave-active {
  transition: all 0.5s ease;
}
.file-enter-to,
.file-leave-from {
  transform: translateX(0);
}

.file-enter,
.file-leave-to {
  transform: translateX(300px);
  opacity: 0;
}
.file-container {
  width: 100%;
}
.nav {
  position: relative;
  width: 25%;
  // padding: 0 16px;
  padding-left: 20px;
  border-left: 1px solid #d7dfeb;
  .no-file {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .pack-up {
    cursor: pointer;
  }
  .dir-file-name {
    color: #6c7789;
    line-height: 28px;
  }
  .enter-folder {
    cursor: pointer;
    color: #d0dae9;
    line-height: 28px;
  }
}
.file-link {
  display: block;
}
</style>