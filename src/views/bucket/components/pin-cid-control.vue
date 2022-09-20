<template>
  <div v-show="isShow">
    <e-expansion-panel :length="pinCidList.length > 6 ? 6 : pinCidList.length">
      <template #header>
        <div class="control-header al-c">PIN CID CONTENT</div>
      </template>
      <template #control="{ handleClick, isShowBody }">
        <v-icon size="20" class="ml-2" @click="handleClick">{{
          isShowBody ? "mdi-chevron-down" : "mdi-chevron-up"
        }}</v-icon>
      </template>
      <div class="ml-auto">
        <v-icon size="22" v-if="hasPinning" @click="handleAllStop">
          mdi-pause</v-icon
        >
        <v-icon
          size="22"
          v-if="hasPause && !hasPinning"
          @click="handleAllStart"
        >
          mdi-play-outline</v-icon
        >
        <v-icon
          size="20"
          v-if="hasFailed && !hasPinning && !hasPause"
          @click="handleAllReload"
        >
          mdi-reload</v-icon
        >
        <v-icon size="20" class="ml-2" @click="handleAllClose"
          >mdi-close</v-icon
        >
      </div>
      <template #content>
        <ul class="control-content" ref="controlContent">
          <li class="file-item pos-r" v-for="item in pinCidList" :key="item.id">
            <div
              class="progress-bg"
              :style="{ width: item.progress + '%' }"
            ></div>
            <div class="file al-c mx-7">
              <div class="file-info">
                <span class="fz-14 gray">
                  {{ item.form.name.cutStr(5, 5) }}</span
                >
                <span class="fz-14 gray ml-2">
                  {{ item.form.cid.cutStr(5, 5) }}</span
                >
                <span class="fz-14 gray ml-2">{{ status(item.status) }}</span>
              </div>

              <div class="file-control ml-auto">
                <v-icon
                  size="20"
                  class="ml-2"
                  v-if="item.status == 1"
                  @click="handleStop(item.id)"
                  >mdi-pause</v-icon
                >
                <v-icon
                  size="20"
                  class="ml-2"
                  v-if="item.status == 2"
                  @click="handleStart(item.id)"
                  >mdi-play-outline</v-icon
                >
                <v-icon
                  size="22"
                  class="ml-2"
                  v-if="item.status == 4"
                  @click="handleStart(item.id)"
                >
                  mdi-reload</v-icon
                >
                <v-icon size="20" class="ml-2" @click="handleCancel(item.id)"
                  >mdi-close</v-icon
                >
              </div>
            </div>
          </li>
        </ul>
      </template>
    </e-expansion-panel>
  </div>
</template>

<script>
import { bus } from "../../../utils/bus";
export default {
  data() {
    return {
      isShow: false,
      pinCidList: [],
    };
  },
  computed: {
    status() {
      return function (status) {
        if (status == 1) {
          return "Pinning";
        } else if (status == 2) {
          return "Pin Cancel";
        } else if (status == 3) {
          return "Pin Success";
        } else {
          return "Pin Failed";
        }
      };
    },
    hasPinning() {
      return this.pinCidList.some((it) => it.status == 1);
    },
    hasPause() {
      return this.pinCidList.some((it) => it.status == 2);
    },
    hasFailed() {
      return this.pinCidList.some((it) => it.status == 4);
    },
  },
  mounted() {
    bus.$on("pinTask", (task) => {
      this.isShow = true;
      this.pinCidList.push(task);
    });
  },
  methods: {
    handleStop(id) {
      this.pinCidList.find((it) => it.id == id).abortPin();
    },
    handleCancel(id) {
      const index = this.pinCidList.findIndex((it) => it.id == id);
      this.pinCidList[index].abortPin();
      this.pinCidList.splice(index, 1);
    },
    handleStart(id) {
      this.pinCidList.find((it) => it.id == id).pin();
    },
    handleAllStop() {
      this.pinCidList.forEach((it) => it.abortPin());
    },
    handleAllStart() {
      this.pinCidList.forEach((it) => {
        if (it.status != 3) {
          it.pin();
        }
      });
    },
    handleAllReload() {
      this.pinCidList.forEach((it) => {
        if (it.status == 4) {
          it.pin();
        }
      });
    },
    handleAllClose() {
      this.pinCidList.forEach(async (it) => await it.abortPin());
      this.pinCidList = [];
    },
  },
  watch: {
    pinCidList: {
      handler(list) {
        if (list.every((it) => it.status == 3)) return bus.$emit("getList");

        if (list.some((it) => it.status != 2 && it.status != 1))
          return bus.$emit("getList");
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
.control-header {
  font-size: 14px;
  .dustbin-icon {
    animation: float 1s ease infinite;
  }
}

.control-content {
  list-style: none;
  margin: 0;
  padding: 0;
  .file-item {
    height: 50px;
    margin-bottom: 10px;
    box-sizing: border-box;
    .progress-bg {
      position: absolute;
      width: 0;
      height: 100%;
      background: #e0f2ff;
      transition: 1s all ease;
    }
    .progress-bg::after {
      content: "";
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      width: 2px;
      height: 100%;
      background: #5eb1ff;
    }
  }
  overflow: scroll;
  .file {
    position: relative;
    height: 100%;
    z-index: 2;
    padding: 5px 0;
    font-size: 14px;
    box-sizing: border-box;
    .file-info {
      font-size: 12px;
      color: #999;
      .file-name {
        width: 150px;
        color: #000;
        font-size: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .file-control {
      opacity: 0;
      transition: all 0.5s ease;
    }
  }
  .file:hover .file-control {
    opacity: 1;
  }
}
</style>