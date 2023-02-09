<template>
  <div class="notice-container al-c" v-if="noticeList.length">
    <img width="20" class="mr-4" src="/img/svg/overview/notice.svg" alt="" />
    <v-carousel
      :show-arrows="false"
      vertical
      hide-delimiters
      :interval="2000"
      cycle
      height="40"
    >
      <v-carousel-item
        v-for="item in list"
        :reverse-transition="true"
        :key="item.key || item.id"
      >
        <template v-if="item.type == 'NORMAL'">
          <div class="notice-content">
            <a class="fz-14 message" :href="item.url">{{ item.message }}</a>
          </div>
        </template>
        <template v-if="item.type == 'COOPERATION_INVITATION'">
          <div class="notice-content al-c">
            <!-- COOPERATION_INVITATION -->
            <div class="fz-14 message flex-1">
              {{ item.message }}
            </div>
            <div class="ml-auto mr-3">
              <v-btn
                small
                width="100"
                light
                color="#FF994E"
                class="invitation-btn"
                tile
                @click="handleInvitation(item.id, true)"
                >Join</v-btn
              >
              <v-btn
                small
                width="100"
                class="ml-4"
                color="#FF994E"
                outlined
                tile
                @click="handleInvitation(item.id, false)"
                >Reject</v-btn
              >
            </div>
          </div>
        </template>
        <template v-if="item.type == 'REMOVED_BY_TEAM_MANAGER'">
          <div class="notice-content al-c">
            <span class="fz-14 message">{{ item.message }}</span>
          </div>
        </template>
      </v-carousel-item>
    </v-carousel>
    <v-icon size="20" color="#ff994e" @click="handleCloseNotice"
      >mdi-close</v-icon
    >
  </div>
</template>

<script>
import { bus } from "@/utils/bus";
export default {
  data() {
    return {
      noticeList: [],
      alert: false,
    };
  },
  created() {
    this.getList();
    bus.$on("broadcastNotice", () => {
      this.getList();
    });
  },
  computed: {
    list() {
      let list = this.noticeList;
      if (this.noticeList.length == 2) {
        let transformList = this.noticeList.map((it) => {
          return {
            id: it.id,
            key: it.id + "-",
            message: it.message,
            type: it.type,
            url: it.url,
          };
        });
        list = list.concat(transformList);
      }
      return list;
    },
  },
  methods: {
    async getList() {
      try {
        const { data } = await this.$http2.get("$auth/broadcast", { noTip: 1 });
        const historyNoticeList = JSON.parse(localStorage.getItem("notice"));
        this.noticeList = historyNoticeList
          ? historyNoticeList.concat(data.list)
          : data.list;
        let EmailJoinSuccess = this.noticeList.findIndex(
          (it) => it.type == "SWITCH_TO_MEMBER"
        );
        if (EmailJoinSuccess != -1) {
          this.noticeList = this.noticeList.filter(
            (it) => it.type != "SWITCH_TO_MEMBER"
          );
          await this.$alert(
            "You have successfully joined the following collaboration accounts"
          );

          if (this.alert) {
            this.$setMsg("joinTeam");
          } else {
            this.$setMsg("updateTeam");
          }
        }
        const normalNoticeList = this.noticeList.filter(
          (it) => it.type == "NORMAL" && it.type == "REMOVED_BY_TEAM_MANAGER"
        );
        localStorage.setItem("notice", JSON.stringify(normalNoticeList));
      } catch (error) {
        this.noticeList = JSON.parse(localStorage.getItem("notice"))
          ? JSON.parse(localStorage.getItem("notice"))
          : [];
      }
    },
    handleCloseNotice() {
      this.noticeList = [];
      localStorage.removeItem("notice");
    },
    async handleInvitation(id, accept) {
      try {
        this.$loading();
        const { data } = await this.$http.post(
          `$auth/cooperation/invitations/${id}`,
          {
            accept,
          }
        );
        this.alert = data.team.alert;
        await this.getList();
        this.$loading.close();
        this.noticeList = this.noticeList.filter((it) => it.id != id);
      } catch (error) {
        await this.getList();
        this.$loading.close();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.notice-container {
  height: 50px;
  padding: 0 20px;
  border-radius: 10px;
  background: #fff2e8;
  // box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
  //   0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}
.notice-content {
  height: 100%;
  .message {
    color: #ff994e;
  }
}
::v-deep .invitation-btn .v-btn__content {
  color: #fff;
}
</style>