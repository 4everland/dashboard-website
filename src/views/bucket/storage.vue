<template>
  <div v-if="!s3">
    <v-skeleton-loader
      class="mt-2"
      type="article"
      max-width="500"
    ></v-skeleton-loader>
  </div>

  <div v-else>
    <!-- Operation tab -->
    <e-right-opt-wrap :top="-55">
      <div class="breadcrumbs" v-if="!showBreadcrumbs">
        <v-breadcrumbs :items="breadcrumbsItems">
          <template v-slot:item="{ item }">
            <router-link
              v-if="!item.disabled"
              :to="item.to"
              class="breadcrumb-link"
            >
              {{ item.text }}
            </router-link>
            <span v-else>
              {{ item.text }}
            </span>
          </template>
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </div>
      <div class="d-flex nowrap ov-a btn-wrap">
        <div v-show="inFile">
          <v-btn
            color="primary"
            :href="fileUrl"
            target="_blank"
            :loading="!fileInfo"
            :download="fileName"
          >
            <img src="/img/icon/download.svg" width="16" />
            <span class="ml-2">Download</span>
          </v-btn>

          <template v-if="fileInfo">
            <v-btn
              class="ml-5"
              outlined
              @click="onSyncAR(fileName)"
              :disabled="
                fileInfo && ['desynced', 'synced'].indexOf(fileArStatus) == -1
              "
              :color="fileArStatus == 'synced' ? 'success' : ''"
            >
              <img src="/img/icon/ic-ar-sync.svg" width="16" />
              <span class="ml-2">
                <span v-if="fileArStatus == 'synced'">Verify on AR</span>
                <span v-else>Sync to AR</span>
              </span>
            </v-btn>
            <e-menu offset-y open-on-hover v-if="!fromHistory">
              <v-btn slot="ref" class="ml-5" icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
              <v-list dense>
                <v-list-item
                  link
                  v-clipboard="fileUrl.encode()"
                  @success="$toast('Copied!')"
                >
                  <img src="/img/icon/copy.svg" width="14" class="mr-2" />
                  <span class="gray-7">Copy Path</span>
                </v-list-item>
                <v-list-item link @click="onRename(fileName)">
                  <img src="/img/icon/ic-rename.svg" width="14" class="mr-2" />
                  <span class="gray-7">Rename</span>
                </v-list-item>
                <v-list-item link @click="onDelFile">
                  <img src="/img/icon/ic-delete.svg" width="14" class="mr-2" />
                  <span class="red-2">Delete</span>
                </v-list-item>
              </v-list>
            </e-menu>
          </template>
        </div>
        <div
          class="ml-auto"
          :class="asMobile ? 'ml-5' : 'ml-auto'"
          v-if="!inFile && !inFolder"
          style="min-width: 150px"
        >
          <v-text-field
            class="hide-msg bd-1"
            dense
            solo
            clearable
            label="Search"
            prepend-inner-icon="mdi-magnify"
            v-model="searchKey"
          ></v-text-field>
        </div>
        <div v-show="inBucket" class="ml-5">
          <v-btn color="primary" @click="addBucket">
            <!-- <v-icon size="15">mdi-folder-multiple-plus</v-icon> -->
            <img src="/img/svg/add1.svg" width="12" />
            <span class="ml-2">New Bucket</span>
          </v-btn>
        </div>
      </div>
    </e-right-opt-wrap>

    <!-- padding layout -->
    <div class="pa-1" v-if="inBucket"></div>

    <!-- File Info -->
    <div v-if="inFile" class="mt-4">
      <v-card outlined>
        <div class="card-head-1">
          <span>File Info</span>
        </div>
        <div class="pd-15-20 bdt-1">
          <v-skeleton-loader
            v-if="fileLoading"
            type="article"
            max-width="500"
          ></v-skeleton-loader>
          <div v-else-if="!fileInfo">
            <span class="gray">Not Found</span>
          </div>
          <ul class="ls-none" v-else>
            <li
              class="mt-2 mb-2 fz-14 d-flex"
              v-for="(it, i) in fileInfoList"
              :key="i"
            >
              <span class="d-ib pa-1" style="min-width: 130px"
                >{{ it.label }}:</span
              >
              <div v-if="it.name == 'ipfs'">
                <v-btn
                  text
                  small
                  target="_blank"
                  :href="$utils.getCidLink(it.value)"
                >
                  {{ it.value }}
                </v-btn>
                <v-btn icon small v-clipboard="it.value" @success="onCopied">
                  <v-icon size="15" class="ml-auto">mdi-content-copy</v-icon>
                </v-btn>
              </div>
              <div v-else-if="it.name == 'arHash'" class="d-flex al-c f-wrap">
                <template v-if="fileArStatus == 'synced' && fileInfo.arHash">
                  <v-btn
                    text
                    small
                    target="_blank"
                    :href="$arHashPre + fileInfo.arHash"
                  >
                    {{ it.value }}
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
                      :val="fileArStatus"
                      style="border: 1px solid; padding: 3px 8px"
                      class="bdrs-3"
                    ></sync-state>
                  </v-btn>
                  <v-btn
                    slot="ref"
                    text
                    x-small
                    @click.stop="headObject(null)"
                    v-if="fileArStatus == 'syncing'"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                  <div
                    class="d-flex al-c f-wrap ml-2 fz-13"
                    v-if="['failure', 'timeout'].includes(fileArStatus)"
                  >
                    <span v-if="fileInfo.arFailReason" class="mr-2 fz-13">{{
                      fileInfo.arFailReason
                    }}</span>
                    <template v-if="!bucketInfo.isAr">
                      <v-btn small text @click="onSyncAR(fileName, 'put')"
                        >Cancel</v-btn
                      >
                      <span>or</span>
                    </template>
                    <v-btn
                      small
                      text
                      color="primary"
                      @click="onSyncAR(fileName, 'post')"
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
                    <v-icon size="15" class="ml-auto">mdi-content-copy</v-icon>
                  </v-btn>
                </p>
              </div>
              <span v-else class="gray pa-1 ml-2">{{ it.value }}</span>
            </li>
          </ul>
        </div>
      </v-card>
    </div>
    <!-- Bucket List -->
    <div class="main-wrap bucket-wrap" v-if="!inFile && !inFolder">
      <v-data-table
        class="hide-bdb"
        :headers="headers"
        :items="list"
        :loading="tableLoading"
        item-key="name"
        no-data-text=""
        loading-text=""
        hide-default-footer
        disable-pagination
        @click:row="onRow"
      >
        <template v-slot:item.name="{ item }">
          <v-btn
            class="e-btn-text"
            :color="inBucket ? 'primary' : '#000'"
            text
            x-small
            @click.stop="onRow(item)"
          >
            <v-icon v-if="inFolder && !item.isFile" size="18" class="mr-2"
              >mdi-{{ inBucket ? "folder-multiple" : "folder" }}</v-icon
            >
            <b>{{ item.name.cutStr(10, 10) }}</b></v-btn
          >
          <v-btn
            class="e-btn-text"
            icon
            small
            color="primary"
            v-if="item.isFile && bucketInfo.originList.length"
            @click.stop
            :href="getViewUrl(item)"
            target="_blank"
          >
            <img src="/img/svg/view.svg" width="14" class="ml-2" />
          </v-btn>
        </template>
        <template v-slot:item.domain="{ item }">
          <div v-if="item.domainInfo">
            <span>{{ item.domainInfo.domain.cutStr(10, 20) }}</span>
          </div>
        </template>
        <template v-slot:item.hash="{ item }">
          <v-btn
            class="e-btn-text item-hash"
            color="primary"
            x-small
            text
            target="_blank"
            v-if="item.hash"
            @click.stop
            :href="$utils.getCidLink(item.hash)"
          >
            <span class="d-ib" style="width: 80px">
              {{ item.hash.cutStr(5, 4) }}
            </span>
          </v-btn>
          <v-btn
            v-if="item.hash"
            class="e-btn-text ml-2"
            icon
            small
            @click.stop
            v-clipboard="item.hash"
            @success="$toast('Copied!')"
          >
            <img src="/img/svg/copy.svg" width="12" />
          </v-btn>
        </template>
        <template v-slot:item.arAct="{ item }">
          <div class="hide-msg d-flex al-c">
            <div class="type-icon al-c" :class="item.isAr ? 'arweave' : 'ipfs'">
              <img
                width="12"
                :src="
                  item.isAr
                    ? '/img/svg/hosting/h-ar.svg'
                    : '/img/svg/hosting/h-ipfs.svg'
                "
                alt=""
              />
              <span style="margin-left: 2px" class="fz-12">
                {{ item.isAr ? "Arweave" : "IPFS" }}
              </span>
            </div>
          </div>
        </template>
        <template v-slot:item.arStatus="{ item }">
          <sync-state :val="item.arStatus" v-if="item.isFile"></sync-state>
        </template>
        <template v-slot:item.arUsedStorage="{ item }">
          <span>{{ item.arUsedStorage }}</span>
        </template>
        <template v-slot:item.visitChartData="{ item }">
          <v-sparkline
            :gradient="['#3023AE', '#C86DD7']"
            :line-width="2"
            :padding="8"
            :smooth="false"
            :value="item.visitChartData"
            auto-draw
          ></v-sparkline>
        </template>
      </v-data-table>

      <e-empty v-if="!list.length" class="mt-6" :loading="tableLoading">
        {{
          tableLoading
            ? `${inBucket ? "Loading buckets" : "Loading files"}...`
            : `${inBucket ? "No buckets" : "No folders or files found"}`
        }}
      </e-empty>
    </div>
    <div v-if="inFolder && !finished" class="pd-20 gray ta-c fz-16 mt-5">
      <v-btn outlined v-if="list.length" @click="onLoadMore">{{
        loadingMore ? "Loading..." : "Load More"
      }}</v-btn>
    </div>
  </div>
</template>

<script>
import mixin from "./storage-mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      popUpload: false,
      fileLoading: true,
      fileInfo: null,
      drawer: false,
      deleteFolder: false,
      deleteFoldersTasks: [],
      deleteFolderLimit: 2,
      uploadingTaskLength: 0,
      breadcrumbsItems: [
        {
          text: "AI History",
          disabled: false,
          to: "/bucket/arweave/",
        },
        {
          text: "",
          disabled: true,
        },
      ],
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    headers() {
      if (this.inBucket)
        return [
          { text: "Bucket Name", value: "name" },
          { text: "Type", value: "arAct" },
          { text: "Storage Usage", value: "usedStorage" },
          { text: "AR Storage Usage", value: "arUsedStorage" },
          { text: "Traffic within 30 Days", value: "traffic" },
          { text: "Visits within 30 Days", value: "visitChartData" },
        ];
      return [
        { text: "Name", value: "name" },
        { text: "Size", value: "size" },
        { text: "IPFS Hash", value: "hash" },
        { text: "Last Modified", value: "updateAt" },
        { text: "AR Status", value: "arStatus" },
      ];
    },
    fileInfoList() {
      const info = this.fileInfo;
      if (!info) return [];
      return [
        {
          label: "Name",
          value: this.fileName,
        },
        {
          label: "Size",
          value: this.$utils.getFileSize(info.size),
        },
        {
          label: "Last Modified",
          value: info.updateAt.format(),
        },
        {
          label: "IPFS Hash",
          name: "ipfs",
          value: info.hash,
        },
        {
          label: "Object URL",
          name: "url",
          value: this.fileUrls,
        },
        {
          label: "AR Hash",
          name: "arHash",
          value: info.arHash,
        },
      ];
    },
    fileUrls() {
      if (!this.fileInfo || !this.inFile) return [];
      const { Key } = this.pathInfo;
      const list = this.bucketInfo.originList.map((origin) => {
        return origin + "/" + Key;
      });
      if (!list.length) list.push(this.fileInfo.url);
      return list;
    },
    fileUrl() {
      return this.fileUrls[0] || "";
    },
    lastPartOfPath() {
      const path = this.$route.path;
      const parts = path.split("/").filter(Boolean);
      return parts[parts.length - 1];
    },
    showBreadcrumbs() {
      return this.$route.path.indexOf("/bucket/arweave");
    },
  },
  mounted() {
    this.breadcrumbsItems[1].text = this.lastPartOfPath;
  },
  methods: {
    onRouteChange() {
      if (!this.inStorage) return;
      this.folderList = [];
      this.getList();
      this.checkNew();
    },
    onCopied() {
      this.$toast("Copied!");
    },
    async addBucket() {
      try {
        const msg1 = "Bucket names must be between 3 and 48 characters long.";
        const { value: Bucket, form1 } = await this.$prompt("", "New Bucket", {
          icon: "mdi-folder-multiple-plus",
          hideIcon: true,
          comp1: "new-bucket-form",
          inputAttrs: {
            label: "Bucket Name",
            // placeholder: "",
            counter: true,
            maxlength: 48,
            trim: true,
            rules: [
              (v) => !!(v || "").trim() || msg1,
              (v) =>
                /^[a-z\d-]+$/.test(v) ||
                "Bucket names can consist only of lowercase letters, numbers, and hyphens (-).",
              (v) =>
                (/^[a-z\d]/.test(v) && /[a-z\d]$/.test(v)) ||
                "Bucket names must begin and end with a letter or number.",
              (v) =>
                !/--/.test(v) || "Continuous use of hyphens(-) is not allowed",
            ],
            required: true,
          },
        });
        if (Bucket.length < 3) return this.$alert(msg1);
        this.$loading();
        this.s3.createBucket(
          {
            Bucket,
          },
          async (err) => {
            if (err) {
              await this.onErr(err);
              this.addBucket();
              return;
            }
            if (form1.isAr) {
              await this.$sleep(2000);
              await this.syncBucket(Bucket, true);
            }
            this.$loading.close();
            this.getBuckets();
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    handleClickUpload() {
      this.$router.push({
        path: this.$route.path,
        query: {
          action: "upload",
        },
      });
    },
  },
  watch: {
    path() {
      this.onRouteChange();
    },
    lastPartOfPath(newPart) {
      this.breadcrumbsItems[1].text = newPart;
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .breadcrumbs {
    position: static !important;
  }
  .v-breadcrumbs {
    padding: 0 0 16px 0;
    margin-top: -12px;
  }
}
.breadcrumbs {
  position: fixed;
  top: 0;
  left: 230px;
  z-index: 10;
}
.e-btn-text {
  padding: 0 !important;
  font-weight: normal !important;
  font-size: 14px !important;
}
.e-btn-text b {
  font-weight: 500 !important;
}
.e-btn-text::before {
  background: transparent !important;
}
.bucket-wrap {
  position: relative;
}
.task-list {
  position: fixed;
  bottom: 80px;
  right: 20px;
  color: var(--v-primary-base);
  font-size: 16px;
  cursor: pointer;
  .task-count {
    position: absolute;
    right: -2px;
    top: -2px;
    width: 30px;
    height: 30px;
    font-size: 20px;
    text-align: center;
    color: #fff;
    background: #ff6960;
    border-radius: 50%;
    transform: scale(0.7);
  }
}
.type-icon {
  padding: 2px 4px;
  border-radius: 38px;
}
.arweave {
  border: 0.25px solid #000;
  background: #fff;
}
.ipfs {
  background: linear-gradient(
      0deg,
      rgba(96, 204, 207, 0.75) 0%,
      rgba(96, 204, 207, 0.75) 100%
    ),
    #fff;
}
</style>
