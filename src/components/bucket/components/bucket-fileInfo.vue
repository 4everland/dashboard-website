<template>
  <Transition name="file" appear>
    <div class="nav" v-show="fileInfoDrawer">
      <div class="file-head d-flex align-center justify-space-between">
        <span>File Info</span>
        <span @click="$emit('update:fileInfoDrawer', false)" class="fz-12"
          >Pack up</span
        >
      </div>

      <div>
        <div class="single-file" v-if="selected.length == 1">
          <v-img
            class="my-4"
            lazy-src="https://picsum.photos/id/11/10/6"
            max-height="127"
            max-width="100%"
            src="https://picsum.photos/id/11/500/300"
          >
            <template #placeholder>
              <img src="/img/svg/bucketFileInfo/default-file-img.svg" alt="" />
            </template>
          </v-img>
          <p class="fz-16 fw-b">{{ selected[0].name }}</p>

          <ul class="ls-none">
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
                      <v-icon size="15" class="ml-auto"
                        >mdi-content-copy</v-icon
                      >
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
                  <p v-for="(link, j) in it.value" :key="j">
                    <v-btn
                      text
                      small
                      color="primary"
                      :href="link"
                      target="_blank"
                    >
                      {{ link }}
                    </v-btn>
                    <v-btn
                      icon
                      small
                      v-clipboard="link.encode()"
                      @success="onCopied"
                    >
                      <v-icon size="15" class="ml-auto"
                        >mdi-content-copy</v-icon
                      >
                    </v-btn>
                  </p>
                </div>
                <span v-else class="gray pa-1 ml-2">{{ it.value }}</span>
              </li>
            </template>
          </ul>
          <v-skeleton-loader
            v-show="fileLoading"
            type="article"
            max-width="500"
          ></v-skeleton-loader>
        </div>

        <e-empty
          :loading="false"
          class="empty-task"
          v-show="!fileLoading && !fileInfo"
        >
          {{
            false ? `Loading files...` : `Select a file/folder to view details`
          }}
        </e-empty>
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
    };
  },
  computed: {
    ...mapState({
      s3: (s) => s.s3,
    }),
    pathInfo() {
      const path = decodeURIComponent(this.$route.path);
      const arr = path.split("/").slice(3);
      const Key = arr.slice(1).join("/") + this.selected[0].name;
      const Bucket = arr[0];
      return {
        Bucket,
        Key,
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
      const list = this.bucketInfo.originList.map((origin) => {
        return origin + "/" + Key;
      });
      console.log(list);
      if (!list.length) list.push(this.fileInfo.url);
      return list;
    },
    fileUrl() {
      return this.fileUrls[0] || "";
    },
  },
  methods: {
    async headObject() {
      this.fileLoading = true;
      this.fileInfo = null;
      console.log(this.pathInfo);
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
        }
      );
    },
    onCopied() {
      this.$toast("Copied to clipboard !");
    },
  },
  watch: {
    selected: {
      handler(selectedArr) {
        if (selectedArr.length == 1) {
          this.headObject();
        } else if (selectedArr.length == 0) {
          console.log(">1");
          this.fileInfo = null;
          // this.file
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
  width: 25%;
  // padding: 0 16px;
  padding-left: 20px;
  border-left: 1px solid #d7dfeb;
}
</style>