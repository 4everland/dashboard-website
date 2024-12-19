<template>
  <div>
    <v-overlay
      :value="value"
      class="withdraw-log-overlay"
      opacity="1"
      v-if="asMobile"
    >
      <div class="withdraw-overlay">
        <div class="withdraw-title mt-5 pos-r">
          <img
            class="pos-a cursor-p"
            src="/img/booster/svg/back-arrow.svg"
            width="24"
            alt=""
            style="left: 20px; top: 50%; transform: translateY(-50%)"
            @click="$emit('input', false)"
          />
          <span> Balance History</span>
        </div>
        <div class="empty text-center" v-if="!historyList.length">
          <img src="/img/booster/svg/empty.svg" width="200" alt="" />
          <div>Empty</div>
        </div>
        <v-simple-table class="withdraw-log-table mt-4">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">Type</th>
                <th class="text-center">Amount</th>
                <th class="text-center">CreateAt</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in historyList"
                :key="index"
                class="text-white"
              >
                <td>{{ item.from }}</td>
                <td>
                  {{ Number(item.value) > 0 ? "+" + item.value : item.value }}
                </td>
                <td>{{ new Date(item.createdAt).format() }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <booster-pagination
          v-show="historyList.length != 0"
          :length="totalPages"
          class="mt-5"
          v-model="page"
        ></booster-pagination>
      </div>
    </v-overlay>

    <v-dialog
      v-else
      max-width="592px"
      persistent
      content-class="booster-dialog"
      style="background-color: transparent; box-shadow: none"
    >
      <div class="booster-module-dialog">
        <div class="withdraw-content">
          <img
            class="close-btn"
            @click="$emit('input', false)"
            src="/img/booster/svg/close.svg"
            width="18"
            alt=""
          />
          <div class="withdraw-title">Balance History</div>
          <div class="empty text-center" v-if="!historyList.length">
            <img src="/img/booster/svg/empty.svg" width="200" alt="" />
            <div>Empty</div>
          </div>
          <v-simple-table
            v-else
            class="withdraw-log-table mt-4"
            style="max-height: 500px; overflow: scroll"
          >
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">Type</th>
                  <th class="text-center">Amount</th>
                  <th class="text-center">CreateAt</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in historyList"
                  :key="index"
                  class="text-white"
                >
                  <td>{{ item.from }}</td>
                  <td>
                    {{ Number(item.value) > 0 ? "+" + item.value : item.value }}
                  </td>
                  <td>{{ new Date(item.createdAt).format() }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <booster-pagination
            v-show="historyList.length != 0"
            :length="totalPages"
            class="mt-5"
            v-model="page"
          ></booster-pagination>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
  
  <script>
import { fetchTokenBalanceLog } from "@/api/booster";
import BoosterPagination from "./booster-pagination.vue";

export default {
  props: {
    value: Boolean,
    projectId: String,
  },
  components: {
    BoosterPagination,
  },
  data() {
    return {
      size: 10,
      page: 1,
      historyList: [],
      loading: false,
      totalPages: 0,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    logStatus() {
      return function (item) {
        if (item.from == "boottickettowithdraw") return "Withdrawing";
        if (Number(Number(item.value)) < 0) {
          if (item.txs) return "Success";
          return "Pending";
        }
        return "Success";
      };
    },

    logTxs() {
      return function (item) {
        if (item.txs) {
          return item.txs.slice(0, 4) + "..." + item.txs.slice(-4);
        }
      };
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },

    logType() {
      return function (type) {
        switch (type) {
          case "withdraw":
            return "Withdraw Ton";
          case "SPIN":
            return "Points Withdraw";
          case "boottickettowithdraw":
            return "Points Withdraw";
          default:
            return "Invite Reward";
        }
      };
    },
  },
  mounted() {},
  methods: {
    async getHistoryList() {
      try {
        const { data } = await fetchTokenBalanceLog(
          this.projectId,
          this.page,
          this.size
        );
        // if (data) {
        this.historyList = data.content;
        // }
      } catch (error) {
        console.log(error);
      }
      this.totalPages = this.historyList.totalPages;
      // console.log("historyList", this.historyList, this.projectId);
    },

    handleOpenTxs(item) {
      if (!item.txs) return;
      if (this.$inDev) {
        if (this.isTgMiniApp)
          return this.$tg.openAuto(
            "https://testnet.tonviewer.com/transaction/" + item.txs
          );
        window.open("https://testnet.tonviewer.com/transaction/" + item.txs);
      } else {
        if (this.isTgMiniApp)
          return this.$tg.openAuto(
            "https://tonviewer.com/transaction/" + item.txs
          );
        window.open("https://tonviewer.com/transaction/" + item.txs);
      }
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.getHistoryList();
      }
    },
  },
};
</script>
  
  <style>
.withdraw-log-overlay .v-overlay__content {
  width: 100%;
  height: 675px !important;
}
</style>
  <style lang="scss" scoped>
.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
.withdraw-overlay {
  position: fixed;
  width: 100vw;
  height: 675px;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  .close-btn {
    position: absolute;
    right: 20px;
    top: 105px;
    cursor: pointer;
  }
}

::v-deep .booster-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}
.booster-module-dialog {
  padding: 13px;
  height: 489px;
  background: url("/img/booster/svg/withdraw-dialog-bg.svg") no-repeat;
  background-size: contain;
  background-position: center;

  .withdraw-content {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 8px;
    color: #fff;
    border-radius: 5px;
    background: linear-gradient(
        180deg,
        rgba(0, 10, 16, 0.5) 66.24%,
        rgba(0, 62, 112, 0.5) 100%
      ),
      rgba(5, 5, 5, 0.8);
    backdrop-filter: blur(4px);
  }
}
.withdraw-title {
  padding: 8px 64px;
  background: transparent;
  text-align: center;
  text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.25);
  font-size: 20px;
}
.withdraw-amount-paragraph {
  padding: 0 24px;
  height: 55px;
  background: linear-gradient(
      270deg,
      rgba(0, 114, 248, 0) 0.18%,
      rgba(0, 114, 248, 0.2) 100.11%
    ),
    url("/img/booster/svg/fringe-bg.svg");
}

.withdraw-log {
  padding: 0 8px;
  margin: 24px 0;
  width: 100%;
  font-weight: 400;
  .withdraw-log-title {
    color: #a4bcfd;
    line-height: normal;
    margin-bottom: 12px;
  }
  .withdraw-log-text {
    color: rgba(255, 255, 255, 0.75);
  }
  .withdraw-log-created {
    color: rgba(255, 255, 255, 0.5);
  }
}
.withdraw-tips {
  width: 100%;
  padding: 2px 8px;
  color: rgba(255, 255, 255, 0.75);
  border-radius: 80px;
  background: rgba(97, 114, 243, 0.25);
}
.withdraw-btn {
  font-size: 16px;
  letter-spacing: 0;
  border-radius: 4px;
  color: #fff !important;
  text-shadow: 0px 0px 8px #6172f3;
  border: 1px solid #0e6cc6;
  background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
  box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
    0px 4px 8px 0px rgba(0, 133, 195, 0.25);
}
.cancel-btn {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}

.withdraw-log-table {
  width: 100%;
  color: #fff !important;
  background: transparent;
  height: calc(100% - 58px);
  overflow: scroll;
  padding-bottom: 30px;
  :deep th {
    border-bottom: 1px solid rgba(255, 255, 255, 0.25) !important;
    font-size: 12px !important;
    color: rgba(255, 255, 255, 0.75) !important;
  }
  :deep td {
    font-size: 12px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25) !important;
    white-space: nowrap !important;
  }

  :deep tbody tr.trigger {
    font-weight: bold;
    background: linear-gradient(
        rgba(97, 114, 243, 0) 19.38%,
        rgba(97, 114, 243, 0.25) 84.92%
      ),
      #121536 !important;
    td {
      border-bottom: 1px solid rgba(97, 114, 243, 0.5) !important;
    }
  }
  :deep tbody tr:hover {
    background: linear-gradient(
        rgba(97, 114, 243, 0) 19.38%,
        rgba(97, 114, 243, 0.25) 84.92%
      ),
      #121536 !important;
  }
  :deep tbody tr:hover td {
    border-bottom: 1px solid rgba(97, 114, 243, 0.5) !important;
  }
}

.empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
  