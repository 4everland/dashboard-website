<template>
  <div v-show="isShow">
    <e-expansion-panel :length="pinCidList.length > 6 ? 6 : pinCidList.length">
      <template #header>
        <div class="control-header al-c">
          <div v-if="hasPinning || hasPause" class="al-c">
            <img
              width="15"
              class="mr-3 pid-icon"
              src="/img/svg/bucket/upload-icon.svg"
              alt=""
            />
            <span>Pinning ({{ PinningCount }})</span>
          </div>
          <div v-else-if="allPinned || allFailed" class="al-c">
            <v-icon size="20" :color="allPinned ? '#00BD9A' : 'red'">{{
              allPinned
                ? "mdi-check-circle-outline"
                : " mdi-close-circle-outline"
            }}</v-icon>
            <span class="ml-2"
              >Pin {{ allPinned ? "Successfully" : "Failed" }} ({{
                allPinned ? PinnedCount : FailedCount
              }})</span
            >
          </div>
          <div v-else class="al-c">
            <v-icon size="20" color="warning">mdi-alert-circle-outline</v-icon>
            <span class="ml-2"
              >Pinned ({{ PinnedCount }}), Pin failed ({{ FailedCount }})</span
            >
          </div>
        </div>
      </template>
      <template #control="{ handleClick, isShowBody }">
        <v-icon size="20" class="ml-2" @click="handleClick">{{
          isShowBody ? "mdi-chevron-down" : "mdi-chevron-up"
        }}</v-icon>
      </template>
      <div class="ml-auto">
        <!-- <v-icon size="22" v-if="hasPinning" @click="handleAllStop">
          mdi-pause</v-icon
        > -->
        <v-tooltip top v-if="hasPinning">
          <template v-slot:activator="{ on, attrs }">
            <v-icon size="22" v-bind="attrs" v-on="on" @click="handleAllStop">
              mdi-pause</v-icon
            >
          </template>
          <span>Suspend all</span>
        </v-tooltip>
        <!-- <v-icon
          size="22"
          v-if="hasPause && !hasPinning"
          @click="handleAllStart"
        >
          mdi-play-outline</v-icon
        > -->

        <v-tooltip top v-if="hasPause && !hasPinning">
          <template v-slot:activator="{ on, attrs }">
            <v-icon size="22" v-bind="attrs" v-on="on" @click="handleAllStart">
              mdi-play-outline</v-icon
            >
          </template>
          <span>Continue all </span>
        </v-tooltip>
        <!-- <v-icon
          size="20"
          v-if="hasFailed && !hasPinning && !hasPause"
          @click="handleAllReload"
        >
          mdi-reload</v-icon
        > -->

        <v-tooltip top v-if="hasFailed && !hasPinning && !hasPause">
          <template v-slot:activator="{ on, attrs }">
            <v-icon size="20" v-bind="attrs" v-on="on" @click="handleAllReload">
              mdi-reload</v-icon
            >
          </template>
          <span>Retry all</span>
        </v-tooltip>
        <!-- <v-icon size="20" class="ml-2" @click="handleAllClose"
          >mdi-close</v-icon
        > -->
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              size="20"
              class="ml-2"
              v-bind="attrs"
              v-on="on"
              @click="handleAllClose"
              >mdi-close</v-icon
            >
          </template>
          <span>{{ allPinned ? "Close" : "Cancel all" }} </span>
        </v-tooltip>
      </div>
      <template #content>
        <ul class="control-content" ref="controlContent">
          <li class="file-item pos-r" v-for="item in pinCidList" :key="item.id">
            <div
              class="progress-bg"
              :style="{ width: item.progress + '%' }"
            ></div>
            <div class="file al-c mx-7">
              <div class="file-info d-flex flex-column justify-space-between">
                <span class="fz-14"> {{ item.form.name.cutStr(5, 5) }}</span>
                <span class="fz-14 gray">
                  {{ item.form.cid.cutStr(5, 5) }}</span
                >
              </div>
              <div class="fz-14 gray">
                {{ status(item.status) }}
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
                <v-icon
                  size="20"
                  class="ml-2"
                  v-if="item.status != 3"
                  @click="handleCancel(item.id)"
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
    allPinned() {
      return this.pinCidList.every((it) => it.status == 3);
    },
    allFailed() {
      return this.pinCidList.every((it) => it.status == 4);
    },
    PinningCount() {
      return this.pinCidList.filter((it) => it.status == 1).length;
    },
    PinnedCount() {
      return this.pinCidList.filter((it) => it.status == 3).length;
    },
    FailedCount() {
      return this.pinCidList.filter((it) => it.status == 4).length;
    },
    watchPinCidList() {
      return JSON.parse(JSON.stringify(this.pinCidList));
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
      this.pinCidList.find((it) => it.id == id).aleadyPin();
    },
    handleAllStop() {
      this.pinCidList.forEach((it) => {
        if (it.status == 1) {
          it.abortPin();
        }
      });
    },
    async handleAllStart() {
      this.pinCidList.forEach((it) => {
        if (it.status != 3) {
          it.aleadyPin();
        }
      });
    },
    handleAllReload() {
      this.pinCidList.forEach((it) => {
        if (it.status == 4) {
          it.aleadyPin();
        }
      });
    },
    async handleAllClose() {
      // this.pinCidList.forEach(async (it) => await it.abortPin());
      // this.pinCidList = [];

      const list = this.pinCidList.map((it) => {
        return (async () => {
          console.log(it);
          if (it.status != 3) {
            await it.abortPin();
          }
        })();
      });
      // console.log(list);
      await Promise.all(list);
      // console.log(results, "result");
      // console.log(this.pinCidList);
      this.pinCidList = [];
      this.isShow = false;
    },
  },
  watch: {
    watchPinCidList: {
      handler(list, oldList) {
        const pinCidLength = list.filter((it) => it.status == 3).length;
        const oldPinCidLength = oldList.filter((it) => it.status == 3).length;
        if (pinCidLength > oldPinCidLength) {
          bus.$emit("getList");
        }
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
  .pid-icon {
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
      width: 200px;
      font-size: 12px;
      color: #999;
      // .file-name {
      //   color: #000;
      //   font-size: 14px;
      //   text-overflow: ellipsis;
      //   overflow: hidden;
      //   white-space: nowrap;
      // }
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