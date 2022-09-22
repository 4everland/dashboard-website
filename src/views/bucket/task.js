import Vue from "vue";
import { Upload } from "@aws-sdk/lib-storage";
export class TaskWrapper {
  id;
  s3;
  status;
  param;
  progress;
  task;
  failedMessage;
  url;
  fileSize;
  constructor(s3, param, id, fileInfo, url) {
    this.id = id;
    this.s3 = s3;
    this.status = 0; //waitingUpload
    this.param = param;
    this.fileInfo = fileInfo;
    this.url = url;
    this.uploadFileSize = 0;
    this.fileSize = 0;
  }
  async startTask() {
    try {
      this.task = new Upload({
        client: this.s3,
        queueSize: 3,
        params: this.param,
      });
      this.fileSize = this.task.totalBytes;
      this.task.on("httpUploadProgress", (e) => {
        // let progress = (e.loaded / e.total) * 100 - this.progress;
        this.progress = ((e.loaded / e.total) * 100) | 0;
        this.uploadFileSize = (this.fileSize * this.progress) / 100;
      });

      this.progress = 0;
      this.status = 1; // uploading
      await this.task.done();
      this.status = 3; // success

      //---------------------
    } catch (e) {
      console.log(e.message);
      if (e.message == "Upload aborted.") {
        this.status = 2; // cancel/ stop
      } else {
        this.status = 4; // failed
        // Vue.prototype.$alert(e.message);
        this.failedMessage = e.message;
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
  resetStatus() {
    this.status = 0;
  }
}
export class DeleteTaskWrapper {
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
      const listResult = await this.s3.listObjectsV2({
        Bucket: this.param.Bucket,
        MaxKeys: 2,
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
      this.status = 4;
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
  async generateGatewayPromise() {
    const gatewayList = [
      "https://ipfs.io/ipfs/",
      "https://ipfs.telos.miami/ipfs/",
      "https://gateway.ipfs.io/ipfs/",
      "https://via0.com/ipfs/",
      "https://cloudflare-ipfs.com/ipfs/",
      "https://cf-ipfs.com/ipfs/",
      "https://dweb.link/ipfs/",
    ];
    const promiseList = gatewayList.map((it) => {
      return Vue.prototype.$axios({
        method: "head",
        url: `${it}${this.form.cid}`,
        responseType: "blob",
        // timeout: 10000,
      });
    });
    const data = await Promise.any(promiseList);
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
    });
    await this.task.done();
    this.status = 3; // upload success // pin success
    this.progress = 100;
  }

  async pin() {
    if (this.userCancel) throw new Error("Upload aborted.");
    await this.getFile();
    await this.uploadToBucket();
  }

  async aleadyPin() {
    try {
      this.userCancel = false;
      this.status = 1;
      await this.generateGatewayPromise();
      await this.pin();
    } catch (error) {
      if (
        this.userCancel ||
        error.message == "Upload aborted." ||
        error.message.status == 2
      ) {
        this.status = 2;
      } else {
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
