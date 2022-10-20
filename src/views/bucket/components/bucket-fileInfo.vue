<template>
  <Transition name="file" appear>
    <div class="nav mt-3" v-show="fileInfoDrawer">
      <div class="single-file" v-if="selected.length == 1">
        <v-img
          v-show="!notImg"
          class="my-4 bdrs-4"
          min-width="100%"
          height="200"
          contain
          :src="thumbnail"
        >
          <template #placeholder>
            <div class="default-img al-c justify-center" v-show="!thumbnail">
              <img
                class="default-img-content"
                src="/img/svg/bucketFileInfo/img_icon.svg"
                alt=""
              />
            </div>
          </template>
        </v-img>
        <div class="default-img al-c justify-center" v-show="notImg">
          <img class="default-img-content" :src="fileTypeImg" alt="" />
        </div>
        <v-skeleton-loader
          v-show="fileLoading"
          type="article"
        ></v-skeleton-loader>
        <ul class="ls-none mt-3" v-show="singleFile && !fileLoading">
          <p class="fz-16 fw-b file-name">{{ selected[0].name }}</p>
          <template v-for="(it, i) in fileInfoList">
            <li class="mt-2 mb-2 fz-12 d-flex align-center" :key="i">
              <span class="d-ib pa-1" style="min-width: 85px"
                >{{ it.label }}:</span
              >
              <div v-if="it.name == 'ipfs'" class="pa-1 ml-2 al-c">
                <a
                  class="link"
                  target="_blank"
                  :href="$utils.getCidLink(it.value)"
                  >{{ it.value.cutStr(5, 5) }}</a
                >
                <v-btn icon small v-clipboard="it.value" @success="onCopied">
                  <img src="/img/svg/copy.svg" width="12" />
                </v-btn>
              </div>
              <div
                v-else-if="it.name == 'arHash'"
                class="d-flex al-c f-wrap pa-1 ml-2"
              >
                <template
                  v-if="fileInfo.arStatus == 'synced' && fileInfo.arHash"
                >
                  <a
                    class="link"
                    target="_blank"
                    :href="$arHashPre + fileInfo.arHash"
                    >{{ it.value.cutStr(5, 5) }}</a
                  >
                  <v-btn
                    icon
                    small
                    v-clipboard="fileInfo.arHash"
                    @success="onCopied"
                  >
                    <img src="/img/svg/copy.svg" width="12" />
                  </v-btn>
                </template>
                <template v-else>
                  <sync-state
                    :val="fileInfo.arStatus"
                    class="bdrs-3"
                  ></sync-state>
                  <v-btn
                    slot="ref"
                    text
                    color="#999999"
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
                      <v-btn small text @click="onSyncAR('put')">Cancel</v-btn>
                      <span>or</span>
                    </template>
                    <v-btn small text color="primary" @click="onSyncAR('post')"
                      >Retry</v-btn
                    >
                  </div>
                </template>
              </div>
              <div v-else-if="it.name == 'url'">
                <div v-for="(link, j) in it.value" :key="j" class="al-c">
                  <a
                    :href="link"
                    class="pa-1 ml-2 file-link"
                    target="_blank"
                    style="word-break: break-all"
                  >
                    {{ link }}</a
                  >
                  <v-btn icon small v-clipboard="link" @success="onCopied">
                    <img src="/img/svg/copy.svg" width="12" />
                  </v-btn>
                </div>
              </div>

              <span v-else class="pa-1 ml-2">{{ it.value }}</span>
            </li>
          </template>
        </ul>
        <div class="mt-3" v-show="singleDir && !fileLoading">
          <div class="fz-16 fw-b d-flex">
            <v-icon size="18">mdi-folder</v-icon>

            <span class="ml-3 dir-name">
              {{ selected[0].name }}
            </span>
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
        class="no-file ta-c loading-img mt-15"
        style="width: 90%"
        v-else-if="selected.length == 0"
      >
        <img :src="`/img/svg/common/empty2.svg`" style="width: 100%" />
        <div class="mt-5 gray fz-17">Select a file/folder to view details</div>
      </div>

      <div v-else class="default-img al-c justify-center" v-show="notImg">
        <img
          class="default-img-content"
          src="/img/svg/bucketFileInfo/folder_icon.svg"
          alt=""
        />
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
      isLoading: true,
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
      let Key = "";
      if (this.selected.length) {
        Key = arr.slice(1).join("/") + this.selected[0].name;
      }
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
          label: "IPFS CID",
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
      const list = this.bucketInfo.originList
        .concat(this.domains)
        .map((origin) => {
          return origin + "/" + Key;
        });
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
    fileTypeImg() {
      const ImgReg = /.(png|jpg|gif|jpeg|webp)$/;
      const excelReg = /.(xls|xlsx)$/;
      const pdfReg = /.pdf$/;
      const ziplReg = /.(RAR|ZIP|ARJ|Z|LZH|JAR)$/;
      const musicReg =
        /.(WAVE|CD|AIFF|MP3|MPEG4|MIDI|WMA|RealAudio|VQF|OggVorbis|AMR|APE|FLAC|AAC)$/;
      const videoReg = /.(avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv|mp4)$/;
      const wordReg = /.(doc|docx)$/;
      if (ImgReg.test(this.fileUrl)) {
        return "/img/svg/bucketFileInfo/img_icon.svg";
      } else if (excelReg.test(this.fileUrl)) {
        return "/img/svg/bucketFileInfo/excel_icon.svg";
      } else if (wordReg.test(this.fileUrl)) {
        return "/img/svg/bucketFileInfo/word_icon.svg";
      } else if (pdfReg.test(this.fileUrl)) {
        return "/img/svg/bucketFileInfo/pdf_icon.svg";
      } else if (ziplReg.test(this.fileUrl)) {
        return "/img/svg/bucketFileInfo/zip_icon.svg";
      } else if (musicReg.test(this.fileUrl)) {
        return "/img/svg/bucketFileInfo/music_icon.svg";
      } else if (videoReg.test(this.fileUrl)) {
        return "/img/svg/bucketFileInfo/video_icon.svg";
      } else if (!this.selected[0].isFile) {
        return "/img/svg/bucketFileInfo/folder_icon.svg";
      } else {
        return "/img/svg/bucketFileInfo/unknow_icon.svg";
      }
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
          if (this.selected.length) {
            this.$emit("update:selected", [{ ...this.selected[0], arStatus }]);
          }
          this.$emit("getFileInfo", this.fileInfo);
          this.thumbnail = this.fileUrl;
        }
      );
      this.getDomain();
    },
    async getObjects() {
      this.fileLoading = true;
      this.dirFileArr = [];
      let { Bucket, Prefix, Delimiter } = this.pathInfo;
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
        this.dirFileArr = data.objects;
      });
    },
    async onSyncAR(method = "post") {
      try {
        const { Bucket, Key } = this.pathInfo;
        await this.$http[method]("/arweave/object", {
          bucket: Bucket,
          key: Key,
        });
        await this.headObject();
      } catch (error) {
        //
        console.log(error);
      }
    },
    handleEnterFolder() {
      const path = decodeURIComponent(this.$route.path);
      const finalPath =
        path + this.selected[0].name + (this.selected[0].isFile ? "" : "/");
      this.$router.push({
        path: finalPath,
        query: {
          tab: "files",
        },
      });
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
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    selected: {
      handler(selectedArr, oldSelectedArr) {
        if (
          selectedArr.length &&
          oldSelectedArr.length &&
          oldSelectedArr[0].hash == selectedArr[0].hash
        )
          return;
        if (selectedArr.length == 1) {
          if (selectedArr[0].isFile) {
            this.headObject();
          } else {
            this.thumbnail = "/img/svg/bucketFileInfo/dir-file-img.svg";
            this.getObjects();
          }
        } else {
          this.fileInfo = null;
          this.dirFileArr = [];
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.v-btn {
  padding: 0;
}
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
  .default-img {
    width: 100%;
    height: 200px;
    background: #f7f9fb;
    border-radius: 6px;
    .default-img-content {
      width: 20%;
    }
  }
  .no-file {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .link {
    color: #0b0817;
  }
  .dir-name,
  .file-name {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .dir-file-name {
    color: #6c7789;
    line-height: 28px;
    word-break: break-all;
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
.ls-none > li:last-of-type {
  align-items: flex-start !important;
}
</style>