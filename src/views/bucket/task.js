import Vue from "vue";
import { Upload } from "@4everland/s3-lib-storage";
import { pinningServiceApi } from "../../api";
export class TaskWrapper {
  static id = 0;
  constructor(s3, param, fileInfo, url) {
    this.id = TaskWrapper.id++;
    this.s3 = s3;
    this.status = 0; //waitingUpload
    this.param = param;
    this.fileInfo = fileInfo;
    this.url = url;
    this.uploadFileSize = 0;
    this.fileSize = 0;
    this.progress = 0;
    this.invalidAccessKey = false;
  }
  async startTask() {
    try {
      this.task = new Upload({
        client: this.s3,
        queueSize: 3,
        params: this.param,
        maxAttempts: 10,
      });
      this.fileSize = this.task.totalBytes;
      this.task.on("httpUploadProgress", (e) => {
        this.progress = (e.loaded / e.total) * 100;
        this.uploadFileSize = (this.fileSize * this.progress) / 100;
      });

      this.progress = 0;
      this.status = 1; // uploading
      await this.task.done();
      this.status = 3; // success
      //---------------------
    } catch (e) {
      console.log(e.Code);
      if (e.message == "Upload aborted.") {
        this.status = 2; // cancel/ stop
      } else {
        this.status = 4; // failed
        if (e.Code == "InvalidAccessKeyId") {
          this.invalidAccessKey = true;
        }
        throw new Error(e.Code);
      }
    }
  }
  async cancelTask() {
    if (this.task) {
      await this.task.abort();
    }
    console.log("abort");
    this.status = 2; //cancel/stop
  }
  // s3 accessKey expired or invalid
  updateS3Instance(s3) {
    this.s3 = s3;
  }
  resetStatus() {
    this.status = 0;
  }
}
export class DeleteTaskWrapper {
  static id = 0;
  constructor(that, param, s3m) {
    this.that = that;
    this.s3m = s3m;
    this.param = param;
    this.id = DeleteTaskWrapper.id++;
    this.status = 0; // pre delete
    this.deleteCount = 0;
  }
  async startTasks() {
    try {
      if (this.status !== 0 && this.status !== 1) return;
      this.status = 1; // deleting
      const listResultStream =
        this.s3m.extensions.listObjectsV2WithMetadataQuery(
          this.param.Bucket,
          this.param.Prefix,
          "",
          "",
          100,
          ""
        );
      const listResult = await new Promise((resolve, reject) => {
        listResultStream.on("data", resolve);
        listResultStream.on("error", reject);
      });
      if (!listResult.objects) {
        this.curFiles = [];
      } else {
        this.curFiles = listResult.objects.map((it) => {
          return it.name;
        });
      }
      if (this.curFiles.length && this.status == 1) {
        await new Promise((resolve, reject) => {
          this.s3m.removeObjects(this.param.Bucket, this.curFiles, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        for (let i = 0; i < listResult.objects.length; i++) {
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
      this.status = 4;
      console.log(error);
      throw new Error(error.code);
    }
  }
  stopTasks() {
    this.status = 2; //stop
  }
  updateS3mInstance(s3m) {
    this.s3m = s3m;
  }
  retryTasks() {
    this.status = 0; // retry
  }
}
export class PinCidTaskWrapper {
  static id = 0;
  constructor(form, s3, param) {
    this.form = form;
    this.s3 = s3;
    this.param = param;
    this.id = PinCidTaskWrapper.id++;
    this.file = null;
    this.status = 1; // Pinning
    this.progress = 0;
    this.abortAxiosFn = null;
    this.task = null;
    this.theFastGateWay = "https://ipfs.io/ipfs/";
    this.userCancel = false;
  }

  async overStorage() {
    try {
      const result = await Vue.prototype.$http({
        url: "/buckets/extra",
        methods: "get",
        params: {
          name: this.param.Bucket,
        },
      });
      let curBucketInfo = result.data.list[0];
      let isCurBucketAr = curBucketInfo.arweave.sync;
      let arStorageByte = null;
      const { data } = await Vue.prototype.$http.get(
        "$bill-consume/combo/usage/IPFS_STORAGE"
      );
      let ipfsStorageByte = data.size;
      if (isCurBucketAr) {
        const { data } = await Vue.prototype.$http.get(
          "$bill-consume/combo/usage/AR_STORAGE"
        );
        arStorageByte = data.size;
      }
      return { ipfsStorageByte, arStorageByte };
    } catch (err) {
      console.log(err);
    }
  }
  async generateGatewayPromise() {
    const gatewayList = [
      "https://ipfs.io/ipfs/",
      "https://ipfs.telos.miami/ipfs/",
      "https://gateway.ipfs.io/ipfs/",
      // "https://via0.com/ipfs/",
      "https://cloudflare-ipfs.com/ipfs/",
      "https://cf-ipfs.com/ipfs/",
      "https://dweb.link/ipfs/",
    ];
    const promiseList = gatewayList.map((it) => {
      return Vue.prototype.$axios({
        method: "head",
        url: `${it}${this.form.cid}`,
        responseType: "blob",
      });
    });
    const data = await Promise.any(promiseList);
    if (!data) throw new Error("Network Error");
    if (this.userCancel) throw new Error("Upload aborted.");
    this.theFastGateWay = data.config.url.replace(this.form.cid, "");
  }

  async getFile() {
    const { data } = await Vue.prototype.$axios({
      method: "get",
      // url: `https://${this.form.cid}.ipfs.dweb.link/`,
      url: `${this.theFastGateWay}${this.form.cid}`,
      // url: `https://${this.form.cid}.ipfs.4everland.xyz/`,
      responseType: "blob",
      cancelToken: new Vue.prototype.$axios.CancelToken((c) => {
        this.abortAxiosFn = c;
      }),
    });
    this.file = data;

    const { ipfsStorageByte, arStorageByte } = await this.overStorage();
    if (!arStorageByte) {
      if (data.size > ipfsStorageByte)
        throw Error(
          "Insufficient storage space is available to upload the file."
        );
    } else {
      if (data.size > ipfsStorageByte || data.size > arStorageByte)
        throw Error(
          "Insufficient storage space is available to upload the file."
        );
    }
    // if(data.size)
    this.status = 1; // searching  // pinning
    this.progress = 50;
  }

  async uploadToBucket() {
    this.task = new Upload({
      client: this.s3,
      queueSize: 3,
      params: {
        Bucket: this.param.Bucket,
        Key: this.param.Prefix + this.form.name,
        Body: this.file,
        ContentType: this.file.type,
      },
      maxAttempts: 10,
    });
    await this.task.done();
    this.status = 3; // upload success // pin success
    this.progress = 100;
  }

  async pin() {
    await this.getFile();
    if (this.userCancel) throw new Error("Upload aborted.");
    await this.uploadToBucket();
  }

  async aleadyPin() {
    try {
      this.userCancel = false;
      this.status = 1;
      await this.generateGatewayPromise();
      if (this.userCancel) throw new Error("Upload aborted.");
      await this.pin();
    } catch (error) {
      console.log(error);
      if (
        this.userCancel ||
        error.message == "Upload aborted." ||
        error.message.status == 2
      ) {
        this.status = 2;
      } else {
        if (
          error.message ==
          "Insufficient storage space is available to upload the file."
        ) {
          Vue.prototype.$utils.resourceInsufficient();
        } else if (error.message != "All promises were rejected") {
          Vue.prototype.$alert(error.message);
        }
        this.status = 4;
      }
    }
  }
  async abortPin() {
    try {
      this.userCancel = true;
      if (this.progress < 50) {
        if (this.abortAxiosFn) {
          await this.abortAxiosFn({ status: 2 });
        }
        throw new Error("errrrrrrr");
      } else {
        if (this.task) {
          await this.task.abort();
        }
      }
    } catch (error) {
      this.status = 2;
    }
    this.status = 2;
  }
}
export class PinningServiceTaskWrapper {
  static id = 0;
  constructor(params, accessToken, requestId = null) {
    this.id = PinningServiceTaskWrapper.id++;
    this.status = 0;
    this.params = params;
    this.accessToken = accessToken;
    this.abortAxiosFn = null;
    this.requestId = requestId;
  }
  async addPin() {
    try {
      this.status = 1;
      await Vue.prototype.$axios({
        method: "POST",
        url: pinningServiceApi + "/pins",
        data: this.params,
        headers: {
          Authorization: "Bearer " + this.accessToken,
        },
        cancelToken: new Vue.prototype.$axios.CancelToken((c) => {
          this.abortAxiosFn = c;
        }),
      });
      this.status = 3;
    } catch (error) {
      const { message } = error;
      if (message && message.status) {
        this.status = message.status;
      } else {
        console.log("status = 4");
        this.status = 4;
      }
    }
  }
  async replacePin() {
    try {
      this.status = 1;
      await Vue.prototype.$axios({
        method: "POST",
        url: pinningServiceApi + "/pins/" + this.requestId,
        data: this.params,
        headers: {
          Authorization: "Bearer " + this.accessToken,
        },
        cancelToken: new Vue.prototype.$axios.CancelToken((c) => {
          this.abortAxiosFn = c;
        }),
      });
      this.status = 3;
    } catch (error) {
      const { message } = error;
      if (message && message.status) {
        this.status = message.status;
      } else {
        this.status = 4;
      }
    }
  }
  async abortPin() {
    try {
      if (this.abortAxiosFn) {
        await this.abortAxiosFn({ status: 2 });
      }
      this.status = 2;
    } catch (error) {
      console.log(error);
    }
  }
  resetStatus() {
    this.status = 0;
  }
}

export class PinningServiceDeleteTaskWrapper {
  static id = 0;
  constructor(requestId, accessToken) {
    this.id = PinningServiceDeleteTaskWrapper.id++;
    this.status = 0;
    this.requestId = requestId;
    this.accessToken = accessToken;
    this.abortAxiosFn = null;
  }
  async startDelete() {
    try {
      this.status = 1;
      const { data } = await Vue.prototype.$axios({
        method: "DELETE",
        url: pinningServiceApi + "/pins/" + this.requestId,
        headers: {
          Authorization: "Bearer " + this.accessToken,
        },
        cancelToken: new Vue.prototype.$axios.CancelToken((c) => {
          this.abortAxiosFn = c;
        }),
      });
      console.log(data);
      this.status = 3;
    } catch (err) {
      const { data = {} } = err.response || {};
      if (data.error) {
        if (data.error.reason == "OBJECT_IS_PINNING") {
          Vue.prototype.$toast("Items in pinning cannot be deleted", "red");
        }
      }
      this.status = 4;
    }
  }
  async abortTask() {
    try {
      if (this.abortAxiosFn) {
        await this.abortAxiosFn({ status: 2 });
        this.status = 2;
      }
    } catch (error) {
      console.log(error);
    }
  }
  resetStatus() {
    this.status = 0;
  }
}
