<template>
  <div v-if="!s3">
    <v-skeleton-loader
      class="mt-2"
      type="article"
      max-width="500"
    ></v-skeleton-loader>
  </div>

  <div v-else>
    <!-- <storage-upload
      ref="upload"
      :info="pathInfo"
      @uploaded="getList"
      :tableList="list"
    ></storage-upload> -->
    <div @click="$refs.navDrawers.drawer = true" class="task-list">
      TaskList
    </div>

    <div class="d-flex nowrap ov-a btn-wrap mt-5" v-if="!inUpload">
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

        <bucket-parts-list
          :drawer.sync="drawer"
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
    <div class="pa-2" v-if="!inFolder"></div>

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

    <div v-if="inUpload">
      <bucket-upload
        ref="bucketUpload"
        :info="pathInfo"
        :baseUrl="bucketInfo.originList[0]"
      ></bucket-upload>
    </div>

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
    <div v-if="inFolder">
      <bucket-item
        :list="list"
        :pathInfo="pathInfo"
        :bucketInfo="bucketInfo"
        :folderLen="folderLen"
        @addFolder="addFolder"
        @getViewUrl="getViewUrl"
        @onDelete="onDelete"
      ></bucket-item>
    </div>
    <!-- v-intersect="onLoadMore" -->
    <div v-if="inFolder && !finished" class="pd-20 gray ta-c fz-16 mt-5">
      <v-btn outlined rounded v-if="list.length" @click="onLoadMore">{{
        loadingMore ? "Loading..." : "Load More"
      }}</v-btn>
    </div>

    <navigation-drawers
      ref="navDrawers"
      :deleteFolder.sync="deleteFolder"
      :deleteFolderTasks="deleteFoldersTasks"
      @handlePasueDeleteFolder="handlePasueDeleteFolder"
      @handleStartDeleteFolder="handleStartDeleteFolder"
      @handleRemoveDeleteFolder="handleRemoveDeleteFolder"
      @handleDeleteFolderStartAll="handleDeleteFolderStartAll"
      @handleDeleteFolderPauseAll="handleDeleteFolderPauseAll"
      @handleDeleteFolderRemoveAll="handleDeleteFolderRemoveAll"
    ></navigation-drawers>
  </div>
</template>

<script>
// import { DeleteTaskWrapper } from "../../components/bucket/task";
import Vue from "vue";
class DeleteTaskWrapper {
  that;
  s3;
  param;
  id;
  marker;
  lastMarker;
  deleteCount;
  status;
  curFiles;

  constructor(that, s3, param, id) {
    this.that = that;
    this.s3 = s3;
    this.param = param;
    this.id = id;
    this.status = 0; // pre delete
    this.deleteCount = 0;
  }

  async startTasks() {
    try {
      if (this.status !== 0 && this.status !== 1) return;

      this.status = 1; // deleteing

      console.log(this.param.Prefix, this.param.Bucket);
      const listResult = await this.s3.listObjectsV2({
        Bucket: this.param.Bucket,
        MaxKeys: 100,
        Delimiter: "",
        Prefix: this.param.Prefix,
      });
      if (!listResult.Contents) {
        this.curFiles = [];
      } else {
        this.curFiles = listResult.Contents.map((it) => {
          return { Key: it.Key };
        });
      }

      if (this.curFiles.length && this.status == 1) {
        const deleteResult = await this.s3.deleteObjects({
          Bucket: this.param.Bucket,
          Delete: {
            Objects: this.curFiles,
            Quiet: false,
          },
        });
        // console.log(deleteResult);
        for (let i = 0; i < deleteResult.Deleted.length; i++) {
          this.deleteCount += 1;
          await Vue.prototype.$sleep(20);
        }
        await this.startTasks();
      } else if (!this.curFiles.length) {
        this.status = 3; // success
        this.that.selected = [];
        this.that.getList();
      } else {
        console.log("here");
      }
    } catch (error) {
      console.log(error);
    }
  }
  stopTasks() {
    this.status = 2; //stop
  }
  retryTasks() {
    this.status = 0; // retry
  }
}

import mixin from "./storage-mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      popUpload: false,
      fileLoading: true,
      fileInfo: null,
      domainsMap: {},
      finished: false,
      loadingMore: false,
      drawer: false,
      isDrawers: false,
      deleteFolder: false,
      deleteFoldersTasks: [],
      deleteFolderLimit: 2,
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
    bucketInfo() {
      const { Bucket } = this.pathInfo;
      const item = this.bucketList.filter((it) => it.name == Bucket)[0];
      let list = (this.domainsMap[Bucket] || [])
        .filter((it) => it.valid)
        .map((it) => it.name);
      if (item && !list.includes(item.defDomain)) list.push(item.defDomain);
      return {
        ...item,
        originList: list.map((domain) => {
          return (this.$inDev ? "http:" : "https:") + "//" + domain;
        }),
      };
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
    "$route.query"(_, oldVal) {
      if (oldVal.action == "upload") {
        this.onRouteChange();
      }
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
    addDeleteFolderTask(limit) {
      this.deleteFolderLimit = limit;
      let arr = this.$route.path.split("/");
      let index = arr.findIndex((it) => it == "storage");
      const Prefix = arr.slice(index + 2).join("/");
      const deleteFoldersArr = this.selected.filter((it) => {
        const currentFolderName = Prefix + it.name + "/";
        let isExist = this.deleteFoldersTasks.findIndex((item) => {
          return item.param.Prefix == currentFolderName;
        });
        if (isExist !== -1) {
          let arr = this.deleteFoldersTasks.filter((item) => item.status == 0);
          this.deleteFoldersTasks[isExist].retryTasks();

          if (!arr.length) {
            this.processDeleteFolderTask();
          }
        }
        return !it.isFile && isExist == -1;
      });
      console.log(deleteFoldersArr);

      const deleteFoldersTask = deleteFoldersArr.map((it) => {
        return new DeleteTaskWrapper(
          this,
          this.s3,
          {
            Bucket: this.pathInfo.Bucket,
            Prefix: Prefix + it.name + "/",
          },
          this.genID()
        );
      });
      this.deleteFoldersTasks = deleteFoldersTask.concat(
        this.deleteFoldersTasks
      );
    },
    async startDeleteFolder(task) {
      await task.startTasks();
      this.processDeleteFolderTask();
    },
    async processDeleteFolderTask() {
      let processing = this.deleteFoldersTasks.filter(
        (item) => item.status == 1
      );
      console.log(processing);
      if (processing.length >= this.deleteFolderLimit) return;
      const idles = this.deleteFoldersTasks.filter((item) => item.status == 0);
      console.log(idles, "idles");
      if (!idles.length) return;
      const fill = this.deleteFolderLimit - processing.length;
      console.log(fill);
      const min = idles.length <= fill ? idles.length : fill;
      for (let i = 0; i < min; i++) {
        this.startDeleteFolder(idles[i]);
      }
    },
    onStop() {},
    onCopied() {
      this.$toast("Copied to clipboard !");
    },
    async onDomain(bucketName, isOpen) {
      if (!isOpen || this.loadingDomains) return;
      try {
        this.loadingDomains = true;
        const { data } = await this.$http.get("/domains", {
          params: { bucketName },
        });
        this.$set(
          this.domainsMap,
          bucketName,
          data.list.map((it) => {
            return {
              name: it.domain,
              valid: it.valid,
              to: "/domain/" + it.domain,
            };
          })
        );
      } catch (error) {
        //
      }
      this.loadingDomains = false;
    },
    async addFolder() {
      try {
        const { value: name } = await this.$prompt("", "New Folder", {
          icon: "mdi-folder-plus",
          hideIcon: true,
          inputAttrs: {
            label: "Folder Name",
            counter: true,
            maxlength: 60,
            trim: true,
            rules: [
              (v) => !!(v || "").trim() || "Invalid",
              (v) =>
                /^[a-z\d-_]+$/.test(v) ||
                "Folder names can consist only of lowercase letters, numbers, underscode (_), and hyphens (-).",
            ],
            required: true,
          },
        });
        // this.$router.push(this.path + name + "/");
        const { Prefix } = this.pathInfo;
        this.tableLoading = true;
        await this.putObject(Prefix + name + "/");
        await this.getList();
        await this.$sleep(200);
        this.$toast(`${name} created successfully`);
      } catch (error) {
        console.log(error);
      }
      this.tableLoading = false;
    },
    async putObject(Key) {
      const { Bucket } = this.pathInfo;
      return new Promise((resolve, reject) => {
        this.s3.putObject(
          {
            Bucket,
            Key,
          },
          (err, data) => {
            if (err) {
              this.onErr(err);
              reject(err);
            } else resolve(data);
          }
        );
      });
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
    genID(length) {
      return Number(
        Math.random().toString().substr(3, length) + Date.now()
      ).toString(36);
    },
    handlePasueDeleteFolder(id) {
      const index = this.deleteFoldersTasks.findIndex((it) => it.id == id);
      this.deleteFoldersTasks[index].stopTasks();
    },
    handleStartDeleteFolder(id) {
      const index = this.deleteFoldersTasks.findIndex((it) => it.id == id);
      let arr = this.deleteFoldersTasks.filter((item) => item.status == 0);
      this.deleteFoldersTasks[index].retryTasks();
      if (!arr.length) {
        this.processDeleteFolderTask();
      }
    },
    handleRemoveDeleteFolder(id) {
      let index = this.deleteFoldersTasks.findIndex((it) => it.id == id);
      this.deleteFoldersTasks.splice(index, 1);
    },

    handleDeleteFolderStartAll() {
      let arr = this.deleteFoldersTasks.filter((item) => item.status == 0);
      this.deleteFoldersTasks.forEach((it) => {
        if (it.status !== 2) return;
        it.retryTasks();
      });
      if (!arr.length) {
        this.processDeleteFolderTask();
      }
    },
    handleDeleteFolderPauseAll() {
      this.deleteFoldersTasks.forEach((item) => {
        if (item.status == 3) return;
        item.stopTasks();
      });
    },
    handleDeleteFolderRemoveAll() {
      this.deleteFoldersTasks = [];
    },
  },
};
</script>
<style lang="scss" scoped>
.task-list {
  position: absolute;
  right: 20px;
  top: 25px;
  text-align: right;
  color: #34a9ff;
  font-size: 16px;
  cursor: pointer;
}
</style>
