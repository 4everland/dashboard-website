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
    <div class="d-flex nowrap ov-a btn-wrap" v-if="!inUpload">
      <div v-show="inBucket">
        <v-btn color="primary" @click="addBucket">
          <!-- <v-icon size="15">mdi-folder-multiple-plus</v-icon> -->
          <img src="img/svg/add1.svg" width="12" />
          <span class="ml-2">New Bucket</span>
        </v-btn>
      </div>
      <div v-show="inFile">
        <v-btn
          color="primary"
          :href="fileUrl"
          target="_blank"
          :loading="!fileInfo"
          :download="fileName"
        >
          <img src="img/icon/download.svg" width="16" />
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
            <img src="img/icon/ic-ar-sync.svg" width="16" />
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
                @success="$toast('Copied to clipboard !')"
              >
                <img src="img/icon/copy.svg" width="14" class="mr-2" />
                <span class="gray-7">Copy Path</span>
              </v-list-item>
              <v-list-item link @click="onRename(fileName)">
                <img src="img/icon/ic-rename.svg" width="14" class="mr-2" />
                <span class="gray-7">Rename</span>
              </v-list-item>
              <v-list-item link @click="onDelFile">
                <img src="img/icon/ic-delete.svg" width="14" class="mr-2" />
                <span class="red-2">Delete</span>
              </v-list-item>
            </v-list>
          </e-menu>
        </template>
      </div>
      <!-- <div v-show="inFolder">
        <v-btn color="primary" @click="handleClickUpload">
          <img src="img/svg/upload.svg" width="16" />
          <span class="ml-2">Upload</span>
        </v-btn>
        <v-btn class="ml-5" outlined @click="drawer = true">
          <img src="img/svg/add0.svg" width="12" />
          <span class="ml-2">Parts</span>
        </v-btn>

        <v-btn
          class="ml-5"
          outlined
          :disabled="folderLen >= 20"
          @click="addFolder"
        >
          <img src="img/svg/add0.svg" width="12" />
          <span class="ml-2">New Folder</span>
        </v-btn>
        <v-btn class="ml-5" outlined @click="drawer = true">
          <v-icon size="15">mdi-folder-plus-outline</v-icon>
          <img src="img/svg/parts_icon.svg" width="12" />
          <span class="ml-2">Fragments</span>
        </v-btn>
        <bucket-parts-list
          v-model="drawer"
          :pathInfo="pathInfo"
        ></bucket-parts-list>
      </div> -->

      <e-menu
        offset-y
        open-on-hover
        :disabled="!selected.length"
        v-if="!inFolder"
      >
        <v-btn
          slot="ref"
          class="ml-5"
          outlined
          :disabled="!selected.length"
          v-if="!inFile"
        >
          <!-- <v-icon>mdi-dots-vertical</v-icon> -->
          <span>Actions</span>
          <v-icon size="18">mdi-chevron-down</v-icon>
        </v-btn>
        <v-list dense>
          <template v-if="selected.length == 1">
            <!-- <v-list-item :to="getPath(selected[0])"> Open </v-list-item> -->
            <template v-if="selected[0].isFile">
              <v-list-item :href="getViewUrl(selected[0])" target="_blank">
                <img src="img/icon/ic-download.svg" width="15" class="mr-2" />
                <span class="gray-7">Download</span>
              </v-list-item>
              <v-list-item
                link
                v-clipboard="getViewUrl(selected[0])"
                @success="onCopied"
              >
                <img src="img/icon/ic-copy.svg" width="14" class="mr-2" />
                <span class="gray-7">Copy Path</span>
              </v-list-item>
              <v-list-item link @click="onRename(selected[0].name)">
                <img src="img/icon/ic-rename.svg" width="14" class="mr-2" />
                <span class="gray-7">Rename</span>
              </v-list-item>
              <v-list-item
                link
                @click="onSyncAR(selected[0].name)"
                v-if="!bucketInfo.isAr && selectArStatus != 'synced'"
              >
                <img src="img/icon/ic-ar.svg" width="14" class="mr-2" />
                <span class="gray-7">Sync to AR</span>
              </v-list-item>
            </template>
            <template v-else-if="inBucket">
              <v-list-item :to="`/bucket/domains?bucket=${selected[0].name}`">
                <img src="img/icon/ic-domain.svg" width="14" class="mr-2" />
                <span class="gray-7">Add Domain</span>
              </v-list-item>
            </template>
          </template>
          <v-list-item link @click="onDelete()">
            <img src="img/icon/ic-delete.svg" width="14" class="mr-2" />
            <span class="red-2">Delete</span>
          </v-list-item>
        </v-list>
      </e-menu>

      <div
        :class="asMobile ? 'ml-5' : 'ml-auto'"
        v-if="!inFile && !inFolder"
        style="min-width: 150px"
      >
        <v-text-field
          class="hide-msg bd-1"
          dense
          rounded
          solo
          clearable
          label="Search"
          prepend-inner-icon="mdi-magnify"
          v-model="searchKey"
        ></v-text-field>
      </div>
    </div>

    <!-- padding layout -->
    <div class="pa-2" v-if="!inFolder"></div>

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
                  rounded
                  text
                  small
                  target="_blank"
                  :href="`https://${it.value}.ipfs.dweb.link`"
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
                    rounded
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
                    @click.stop="headObject"
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
                      @click="onSyncAR(fileName)"
                      >Retry</v-btn
                    >
                  </div>
                </template>
              </div>
              <div v-else-if="it.name == 'url'">
                <p v-for="(link, j) in it.value" :key="j">
                  <v-btn
                    rounded
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
    <div class="main-wrap" v-if="!inFile && !inUpload && !inFolder">
      <v-data-table
        class="hide-bdb"
        :headers="headers"
        :items="list"
        :loading="tableLoading"
        v-model="selected"
        :show-select="list.length > 0"
        item-key="name"
        no-data-text=""
        loading-text=""
        :checkbox-color="$color1"
        hide-default-footer
        disable-pagination
        @click:row="onRow"
      >
        <template v-slot:item.name="{ item }">
          <v-btn
            :color="inBucket ? 'primary' : '#000'"
            rounded
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
            icon
            small
            color="primary"
            v-if="item.isFile && bucketInfo.originList.length"
            @click.stop="onStop"
            :href="getViewUrl(item)"
            target="_blank"
          >
            <img src="img/svg/view.svg" width="14" />
          </v-btn>
        </template>
        <template v-slot:item.domain="{ item }">
          <div v-if="item.domainInfo">
            <span>{{ item.domainInfo.domain.cutStr(10, 20) }}</span>
          </div>
        </template>
        <template v-slot:item.hash="{ item }">
          <v-btn
            rounded
            color="primary"
            x-small
            text
            target="_blank"
            v-if="item.hash"
            @click.stop="onStop"
            :href="`https://${item.hash}.ipfs.dweb.link`"
          >
            <span class="d-ib" style="width: 80px">
              {{ item.hash.cutStr(5, 4) }}
            </span>
          </v-btn>
          <v-btn
            v-if="item.hash"
            icon
            small
            @click.stop="onStop"
            v-clipboard="item.hash"
            @success="$toast('Copied to clipboard !')"
          >
            <!-- <v-icon size="14" color="primary">mdi-content-copy</v-icon> -->
            <img src="img/svg/copy.svg" width="12" />
          </v-btn>
        </template>
        <template v-slot:item.arAct="{ item }">
          <div class="hide-msg d-flex al-c">
            <v-switch
              v-model="item.isAr"
              dense
              :loading="item.arLoading"
              :disabled="item.arLoading || item.arCancel"
              @click.stop.prevent="onSyncBucket(item)"
            ></v-switch>
            <e-tooltip top v-if="item.arCancel && !tableLoading">
              <v-btn slot="ref" plain x-small @click.stop="getList">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <span>Closing. Click to refresh.</span>
            </e-tooltip>
          </div>
        </template>
        <template v-slot:item.arStatus="{ item }">
          <sync-state :val="item.arStatus" v-if="item.isFile"></sync-state>
        </template>
      </v-data-table>
      <div
        class="ta-c"
        :class="tableLoading ? 'mt-10' : 'mt-15'"
        v-if="!list.length"
      >
        <img
          :src="`img/svg/common/empty${tableLoading ? 1 : 2}.svg`"
          :height="tableLoading ? 100 : 130"
        />
        <div class="mt-5 gray fz-17">
          {{
            tableLoading
              ? `${inBucket ? "Loading buckets" : "Loading files"}...`
              : `${inBucket ? "No buckets" : "No folders or files found"}`
          }}
        </div>
      </div>
    </div>
    <!-- Bucket-item -->

    <!-- v-intersect="onLoadMore" -->
    <div v-if="inFolder && !finished" class="pd-20 gray ta-c fz-16 mt-5">
      <v-btn outlined rounded v-if="list.length" @click="onLoadMore">{{
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
      finished: false,
      loadingMore: false,
      drawer: false,
      deleteFolder: false,
      deleteFoldersTasks: [],
      deleteFolderLimit: 2,
      uploadingTaskLength: 0,
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
          { text: "Domain", value: "defDomain" },
          { text: "CreateAt", value: "createAt" },
          { text: "Sync to AR", value: "arAct" },
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
  },
  watch: {
    path() {
      this.onRouteChange();
    },
  },
  methods: {
    onRouteChange() {
      if (!this.inStorage) return;
      this.selected = [];
      this.folderList = [];
      this.getList();
      this.checkNew();
    },
    onStop() {},
    onCopied() {
      this.$toast("Copied to clipboard !");
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
              await this.syncBucket(Bucket, true);
            }
            await this.$sleep(1000);
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
};
</script>
<style lang="scss" scoped>
.task-list {
  position: fixed;
  bottom: 80px;
  right: 20px;
  color: #34a9ff;
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
</style>
