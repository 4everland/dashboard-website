import { mapState } from "vuex";
import debounce from "../../plugins/debounce";

const BasePath = "/bucket/storage/";

export default {
  data() {
    return {
      BasePath,
      tableLoading: true,
      bucketList: [],
      folderList: [],
      selected: [],
      deleting: false,
      searchKey: "",
      domainsMap: {},
      hasMore: false,
      curPage: 0,
      continuationTokenArr: [""],
    };
  },
  computed: {
    ...mapState({
      s3: (s) => s.s3,
      s3m: (s) => s.s3m,
      navItems: (s) => s.navItems,
    }),
    path() {
      return decodeURIComponent(this.$route.path);
    },
    fromHistory() {
      return /^\/bucket\/arweave/.test(this.path);
    },
    inStorage() {
      return /^\/bucket\/(storage|arweave)\//.test(this.path);
    },
    inBucket() {
      return this.path == BasePath || this.path == "/overview";
    },
    inFile() {
      return this.inStorage && !/\/$/.test(this.path);
    },
    inFolder() {
      return this.inStorage && !this.inBucket && !this.inFile;
    },
    fileName() {
      const arr = this.path.split("/");
      return arr[arr.length - 1];
    },
    folderLen() {
      if (this.inFolder) return this.pathInfo.Prefix.split("/").length - 1;
      return 0;
    },
    basePath() {
      return this.fromHistory ? "/bucket/arweave/" : BasePath;
    },
    selectArStatus() {
      if (this.inFolder && this.selected.length == 1) {
        return this.selected[0].arStatus;
      }
      return null;
    },
    fileArStatus() {
      if (this.inFile) {
        return this.fileInfo.arStatus;
      }
      if (this.inFolder) {
        return this.selectArStatus;
      }
      return null;
    },
    list() {
      let list = [];

      if (this.inBucket) {
        list = this.bucketList;
      } else if (this.inFolder) {
        list = this.folderList;
      }
      if (this.searchKey && !this.inFolder) {
        console.log("inSerarchKey");
        list = list.filter((it) => {
          return new RegExp(this.searchKey).test(it.name);
        });
      }
      return list;
    },
    pathInfo() {
      if (this.inBucket || !this.inStorage) return {};
      const arr = this.path.split("/").slice(3);
      const Key = arr.slice(1).join("/");
      const Bucket = arr[0];
      if (this.inFile)
        return {
          Bucket,
          Key,
        };
      return {
        Bucket,
        Prefix: Key,
        Delimiter: "/",
      };
    },
    defArStatus() {
      if (this.fromHistory) return "syncing";
      const { Bucket } = this.pathInfo;
      const curBucket = this.bucketList.filter((it) => {
        return it.name == Bucket;
      })[0];
      if (curBucket) {
        return curBucket.isAr ? "syncing" : "desynced";
      }
      return "unknown";
    },
    bucketInfo() {
      const { Bucket } = this.pathInfo;
      const item = this.bucketList.filter((it) => it.name == Bucket)[0];
      // console.log(item, "item-------");
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
  },
  watch: {
    searchKey() {
      if (this.inFolder) {
        debounce(this.getList);
      }
    },
    s3() {
      this.getList();
    },
  },

  mounted() {
    if (this.inFile && this.$route.query.ipfsHash) {
      this.getList(this.$route.query.ipfsHash);
    } else {
      this.getList();
    }
    this.checkNew();
  },
  methods: {
    checkNew() {
      if (this.$route.query.new == "bucket") {
        this.addBucket();
      }
    },
    onErr(err) {
      if (!err) return;
      let msg = err.message;
      if (!msg) return;
      if (msg.indexOf("Please select a different name") > -1) {
        msg =
          "This name already exists or is in use by another user. Bucket name will generate unique url to ensure global service uniqueness. No duplicate names will be allowed.";
      }
      if (["Failed to fetch"].includes(msg)) {
        this.$confirm(msg, "Network Error", {
          confirmText: "Retry",
        }).then(() => {
          console.log("onError.....");

          this.getList();
        });
        return;
      }
      return this.$alert(msg);
    },
    async getList(arg) {
      if (!this.s3) return;
      this.selected = [];
      if (this.inBucket || !this.bucketList.length) {
        await this.getBuckets();
      }

      if (this.inFile) {
        this.headObject(arg);
      } else if (this.inFolder) {
        this.getObjects();
      }
    },
    async onSyncBucket(it) {
      try {
        if (it.arLoading) return;
        if (!it.isAr) {
          await this.$confirm(
            "When you close sync to AR, it will become closing status, and you won't be able to properly close it until all your files have been synchronized. Are you sure you want to close it?"
          );
        } else {
          await this.beforeArSync();
        }
        this.$set(it, "arLoading", true);
        const { data } = await this.syncBucket(it.name, it.isAr);
        console.log(data);
        await this.$sleep(500);
        console.log(it, it.isAr);
        // throw new Error("test err");
      } catch (error) {
        console.log(error);
        this.$set(it, "isAr", !it.isAr);
      }
      this.$set(it, "arLoading", false);
      this.getBuckets();
    },
    async syncBucket(name, sync) {
      return this.$http.post("/arweave/buckets/" + name, {
        sync,
      });
    },
    async beforeArSync() {
      const skey = "arTipOff";
      if (localStorage[skey]) return;
      const html =
        `<ul>` +
        "<li>Supports all AR public gateway access</li>" +
        "<li class='mt-2'>Permanent storage is not removable, and file sizes are limited to 100M</li>" +
        "<li class='mt-2'>Consumes AR storage</li>" +
        "</ul>";
      const fn = (data) => {
        if (data.form1.noShow) localStorage[skey] = 1;
      };
      return this.$confirm(html, "Sync to AR", {
        comp1: "no-show-form",
      })
        .then((data) => {
          fn(data);
          return data;
        })
        .catch((data) => {
          fn(data);
          throw new Error();
        });
    },
    async onSyncAR(name, method = "post", ipfsHash) {
      console.log(name);
      if (this.selectArStatus == "syncing") {
        this.$alert("The file is being synced").then(() => {
          this.getList(ipfsHash);
        });
        return;
      }
      if (this.fileArStatus == "synced") {
        window.open(this.$arVerifyPre + this.fileInfo.arHash);
        return;
      }
      try {
        if (this.fileArStatus == "desynced") {
          await this.beforeArSync();
        }
        const { Bucket } = this.pathInfo;
        this.$loading();
        await this.$http[method]("/arweave/object", {
          bucket: Bucket,
          key: this.getFileKey(name),
        });
        // this.getList(ipfsHash);
        this.$setMsg({
          name: "updateUsage",
        });
      } catch (error) {
        //
        // this.getList(ipfsHash);
      }
      this.$loading.close();
    },
    getFileKey(name) {
      const { Prefix, Key } = this.pathInfo;
      return this.inFile ? Key : Prefix + name;
    },
    async onRename(srcName) {
      try {
        const { Prefix, Key } = this.pathInfo;
        let srcKey = this.inFile ? Key : Prefix + srcName;
        console.log(this.pathInfo);
        const { value: name } = await this.$prompt("", "Rename " + srcName, {
          hideIcon: true,
          defaultValue: srcName,
          inputAttrs: {
            label: "New Name",
            counter: true,
            maxlength: 60,
            trim: true,
            rules: [
              (v) => !!(v || "").trim() || "Invalid",
              (v) => !/\//.test(v) || "/ is not allowed.",
            ],
            required: true,
          },
        });
        if (srcName == name) {
          return;
        }
        this.$loading();
        const reg = /[^/]+$/;
        const newKey = this.inFile ? Key.replace(reg, name) : Prefix + name;
        await this.renameObject(srcKey, newKey);
        if (this.inFile) {
          this.$router.replace(
            encodeURIComponent(this.path).replace(reg, name)
          );
        } else {
          this.getList();
        }
        await this.$sleep(500);
        this.$toast("Renamed successfully");
        this.$loading.close();
      } catch (error) {
        console.log(error);
        if (error) this.onErr(error);
      }
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
    renameObject(srcKey, Key) {
      const { Bucket } = this.pathInfo;
      // console.log(srcKey, Key);
      return new Promise((resolve, reject) => {
        this.s3.copyObject(
          {
            Bucket,
            CopySource: encodeURIComponent(Bucket + "/" + srcKey),
            Key,
          },
          (err) => {
            if (err) return reject(err);
            this.s3.deleteObject(
              {
                Bucket,
                Key: srcKey,
              },
              () => {
                resolve();
              }
            );
          }
        );
      });
    },
    async headObject(arg) {
      this.fileLoading = true;
      this.fileInfo = null;
      console.log(this.pathInfo);
      this.s3.headObject({ ...this.pathInfo, IfMatch: arg }, (err, data) => {
        this.fileLoading = false;
        if (err) return this.onErr(err);
        // console.log(data);
        const meta = data.Metadata;
        let arStatus = meta["arweave-status"];
        if (!arStatus) {
          arStatus = this.defArStatus;
        }
        this.fileInfo = {
          size: data.ContentLength,
          type: data.ContentType,
          hash: this.$utils.getCidV1(data.ETag),
          updateAt: data.LastModified,
          url: this.$endpoint + this.path.replace(this.basePath, "/"),
          arStatus,
          arHash: meta["arweave-hash"],
          arFailReason: (meta["arweave-failed-reason"] || "").replaceAll(
            "-",
            " "
          ),
        };
      });
      this.onDomain(this.pathInfo.Bucket, true);
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
    onLoadMore() {
      if (this.tableLoading) return;
      this.selected = [];
      this.$loading();
      this.curPage++;
      this.getObjects("next");
    },
    onLoadPre() {
      if (this.tableLoading) return;
      this.selected = [];
      this.curPage--;
      this.$loading();
      this.getObjects("pre");
    },
    async getObjects(direction) {
      this.tableLoading = true;
      let { Bucket, Prefix, Delimiter } = this.pathInfo;
      let continuationToken = this.continuationTokenArr[this.curPage];
      let pre = Prefix;
      if (this.searchKey) {
        pre += this.searchKey;
      }
      const stream = this.s3m.extensions.listObjectsV2WithMetadataQuery(
        Bucket,
        pre,
        continuationToken,
        Delimiter,
        100,
        ""
      );
      stream.on("data", (data) => {
        this.tableLoading = false;
        data.objects.sort((a, b) => {
          return (b.prefix ? 1 : 0) - (a.prefix ? 1 : 0);
        });
        this.hasMore = data.isTruncated;
        let isExist = this.continuationTokenArr.includes(
          data.nextContinuationToken
        );
        if (this.hasMore && direction !== "pre" && !isExist) {
          this.continuationTokenArr.push(data.nextContinuationToken);
        }
        // if (direction == undefined) {
        //   this.continuationTokenArr = [""];
        // }
        let list = data.objects.map((it) => {
          // console.log(data);
          if (it.prefix)
            return {
              name: it.prefix.replace(Prefix, "").replace("/", ""),
              size: "--",
              hash: "--",
              updateAt: "--",
              arStatus: "--",
            };
          const meta = it.metadata || {};
          let arStatus = meta["X-Amz-Meta-Arweave-Status"];
          if (!arStatus) {
            arStatus = this.defArStatus;
          }
          return {
            Key: it.name,
            name: it.name.replace(Prefix, ""),
            updateAt: it.lastModified.format(),
            size: this.$utils.getFileSize(it.size),
            hash: this.$utils.getCidV1(it.etag),
            isFile: true,
            arStatus,
            arHash: meta["X-Amz-Meta-Arweave-Hash"],
          };
        });
        this.folderList = list;
        window.scrollTo(0, 0);
        this.$loading.close();
      });
      stream.on("error", (err) => {
        this.tableLoading = false;
        if (err) return this.onErr(err);
      });
      // this.s3.listObjectsV2(this.pathInfo, (err, data) => {
      //   // console.log(data, Prefix);
      // });
    },
    listBuckets() {
      return new Promise((resolve, reject) => {
        this.s3.listBuckets({}, (err, data) => {
          if (err) {
            this.onErr(err);
            reject(err);
          }
          const list = data.Buckets.map((it) => {
            return {
              name: it.Name,
              createAt: it.CreationDate.format(),
            };
          });
          resolve(list);
        });
      });
    },
    async getBuckets() {
      this.tableLoading = true;
      try {
        const list = await this.listBuckets();
        const { data } = await this.$http.get("/buckets/extra");
        // console.log(data);
        data.list.forEach((row) => {
          const item = list.filter((it) => it.name == row.bucket)[0];
          if (!item) {
            // console.log(row.bucket, "no bucket");
            return;
          }
          const ar = row.arweave || {};
          Object.assign(item, {
            isAr: row.arweave ? ar.sync : row.arweaveSync,
            arCancel: ar.status == "cancel",
            traffic: this.$utils.getFileSize(row.monthTraffic),
            usedStorage: this.$utils.getFileSize(row.usedStorage),
            arUsedStorage: this.$utils.getFileSize(row.arweave.usedStorage),
            visitChartData: row.monthVisit.map((item) => Number(item)),
            defDomain: row.domain,
          });
        });
        // console.log(list);
        this.bucketList = list;
      } catch (error) {
        console.log(error);
      }
      this.tableLoading = false;
    },
    delBucket(Bucket) {
      return new Promise((resolve, reject) => {
        this.s3.deleteBucket(
          {
            Bucket,
          },
          (err, data) => {
            if (err) reject(err);
            else resolve(data);
          }
        );
      });
    },
    async onDelFile() {
      try {
        let tip =
          "The file will be permanently deleted. Are you sure you want to continue ?";
        if (this.fileInfo.arStatus != "desynced") {
          tip = `The file will be permanently deleted, but can’t be deleted from the AR network, and your AR storage space will not increase. Would you like to continue?`;
        }
        await this.$confirm(tip);
        const { Key } = this.pathInfo;
        this.$loading();
        await this.delObjects([
          {
            Key,
          },
        ]);
        const navItem = this.navItems[this.navItems.length - 2];
        this.$router.replace(navItem.to);
        this.$toast("Deleted successfully");
      } catch (error) {
        //
      }
      this.$loading.close();
    },
    delObjects(Objects) {
      const { Bucket } = this.pathInfo;
      const params = {
        Bucket,
        Delete: {
          Objects,
          Quiet: false,
        },
      };
      // console.log(params);
      return new Promise((resolve, reject) => {
        this.s3.deleteObjects(params, (err, data) => {
          // console.log(err, data);
          if (err) reject(err);
          else resolve(data);
        });
      });
    },
    async onDelete() {
      try {
        this.tableLoading = true;
        this.curPage = 0;
        this.continuationTokenArr = [""];
        const target = this.inBucket ? "bucket" : "file";
        let html = `The following ${target}s will be permanently deleted. Are you sure you want to continue?`;

        if (this.inBucket) {
          await this.$confirm(html, `Remove ${target}`);
          let errArr = [];
          for (const row of this.selected) {
            try {
              await this.delBucket(row.name);
            } catch (error) {
              errArr.push(`${row.name}: ${error.message}`);
            }
          }
          if (errArr.length)
            setTimeout(() => {
              this.$alert(errArr.join("<br>"));
            }, 10);
        }
        if (this.inFolder) {
          let hasFile = this.selected.filter((it) => it.isFile);
          let hasFolder = this.selected.filter((it) => !it.isFile);
          if (hasFile.length && hasFolder.length) {
            //  file folder exsit
            if (hasFile.filter((it) => it.arStatus != "desynced").length) {
              html = `The following files will be permanently deleted, but files in AR can’t be deleted from the AR network, and your AR storage space will not increase. Would you like to continue?`;
              await this.$confirm(html, `Remove ${target}`);
            }

            this.deleteFolder = true;
            this.addDeleteFolderTask(2);
            this.processDeleteFolderTask();
            await this.delObjects(
              hasFile.map((it) => {
                return { Key: it.Key };
              })
            );
          } else if (hasFile.length && !hasFolder.length) {
            // only file
            if (hasFile.filter((it) => it.arStatus != "desynced").length) {
              html = `The following files will be permanently deleted, but files in AR can’t be deleted from the AR network, and your AR storage space will not increase. Would you like to continue?`;
              await this.$confirm(html, `Remove ${target}`);
            }
            await this.delObjects(
              hasFile.map((it) => {
                return { Key: it.Key };
              })
            );
            // this.getList();
          } else {
            // only folder
            this.deleteFolder = true;
            this.addDeleteFolderTask(2);
            this.processDeleteFolderTask();
          }
        }
      } catch (err) {
        if (err) this.onErr(err);
        else return;
      }
      this.selected = [];
      this.getList();
      // this.onUpdate();
    },
    async onUpdate(delay = 1000) {
      await this.$sleep(delay);
      this.$setMsg({
        name: "updateUsage",
      });
    },
    getPath(item) {
      return this.path + item.name + (item.isFile ? "" : "/");
    },
    getViewUrl(item) {
      const { Prefix } = this.pathInfo;
      let url = this.bucketInfo.originList[0] + "/" + Prefix + item.name;
      return url.encode();
    },
    onView(it) {
      window.open(this.getViewUrl(it));
    },
    onRow(it) {
      const url = this.getPath(it);
      if (this.selected.length > 1) {
        if (this.selected.includes(it)) {
          const i = this.selected.findIndex((item) => item == it);
          this.selected.splice(i, 1);
        } else {
          this.selected.push(it);
        }
      } else {
        this.selected = [];
        this.selected.push(it);
      }

      if (it.isFile) return;
      this.$router.push({
        path: encodeURI(url),
      });
    },
    async getSubObjects(folder) {
      const { Bucket, Prefix } = this.pathInfo;
      const folderKey = Prefix + folder + "/";
      const params = {
        Bucket,
        Prefix: folderKey,
      };
      return new Promise((resolve, reject) => {
        this.$loading();
        this.s3.listObjectsV2(params, (err, data) => {
          this.$loading.close();
          if (err) reject(err);
          else console.log(data);
          resolve([
            // {
            //   Key: folderKey,
            // },
            ...(data.Contents || []),
          ]);
        });
      });
    },
  },
};
