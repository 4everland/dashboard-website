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
  constructor(s3, param, id, fileInfo, url) {
    this.id = id;
    this.s3 = s3;
    this.status = 0; //waitingUpload
    this.param = param;
    this.fileInfo = fileInfo;
    this.url = url;
  }
  async startTask() {
    try {
      this.task = new Upload({
        client: this.s3,
        queueSize: 3,
        params: this.param,
      });
      this.task.on("httpUploadProgress", (e) => {
        this.progress = ((e.loaded / e.total) * 100) | 0;
      });
      this.progress = 0;
      this.status = 1; // uploading
      await this.task.done();
      this.status = 3; // success
    } catch (e) {
      // console.log(e);
      // console.log(e.message);
      if (e.message == "Upload aborted.") {
        this.status = 2; // cancel/ stop
      } else {
        this.status = 4; // failed
        Vue.prototype.$alert(e.message);
        this.failedMessage = e.message;
      }
    }
  }
  async cancelTask() {
    if (this.task) {
      await this.task.abort();
    }
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
