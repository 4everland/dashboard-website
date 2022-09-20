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
  }
  async getFile() {
    // try {
    //   const { data } = await Vue.prototype.$axios({
    //     method: "get",
    //     url: `https://${this.form.cid}.ipfs.dweb.link/`,
    //     // url: `https://${this.form.cid}.ipfs.4everland.xyz/`,
    //     responseType: "blob",
    //     cancelToken: new Vue.prototype.$axios.CancelToken((c) => {
    //       this.abortAxiosFn = c;
    //     }),
    //   });
    //   this.file = data;
    //   this.status = 1; // searching  // pinning
    //   this.progress = 50;
    // } catch (error) {
    //   console.log(error.message.status, error);
    //   if (error.message.status == 2) {
    //     console.log("123");
    //     this.status = 2;
    //   } else {
    //     console.log(444);
    //     this.status = 4; // searching failed   // pin failed
    //   }
    // }
    const { data } = await Vue.prototype.$axios({
      method: "get",
      url: `https://${this.form.cid}.ipfs.dweb.link/`,
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
    // try {

    // } catch (error) {
    //   console.log("upload catch error");
    //   console.log(error);
    //   if (error.message == "Upload aborted." || error.message.status == 2) {
    //     console.log("zheli");
    //     this.status = 2; // cancel/ stop
    //   } else {
    //     console.log("nali");
    //     this.status = 4; // upload failed // pin failed
    //   }
    // }

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
    try {
      this.status = 1;
      await this.getFile();
      await this.uploadToBucket();
    } catch (error) {
      console.log(error);
      if (error.message == "Upload aborted." || error.message.status == 2) {
        this.status = 2;
      } else {
        this.status = 4;
      }
    }
  }
  async abortPin() {
    try {
      if (this.progress < 50) {
        await this.abortAxiosFn({ status: 2 });
      } else {
        if (this.task) {
          await this.task.abort();
        }
      }
    } catch (error) {
      console.log(error);
      this.status = 2; // upload cancel
    }
  }
}
