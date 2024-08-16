<template>
  <div class="notice-container al-c mx-6" v-if="noticeList.length">
    <img width="20" class="mr-4" src="/img/svg/new-billing/notice.svg" alt="" />
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
          <div class="notice-content al-c">
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
                class="invitation-btn primary"
                @click="handleInvitation(item.id, true)"
                >Join</v-btn
              >
              <v-btn
                small
                width="100"
                class="ml-4 primary--text"
                outlined
                @click="handleInvitation(item.id, false)"
                >Cancel</v-btn
              >
            </div>
          </div>
        </template>
        <template v-if="item.type == 'REMOVED_BY_TEAM_MANAGER'">
          <div class="notice-content al-c">
            <span class="fz-14 message">{{ item.message }}</span>
          </div>
        </template>
        <template v-if="item.type == 'POPUP'">
          <div
            class="notice-content cursor-p al-c"
            @click="handlePopup(item.url)"
          >
            <span class="fz-14 message">{{ item.message }}</span>
          </div>
        </template>
      </v-carousel-item>
    </v-carousel>
    <v-icon size="20" class="primary--text" @click="handleCloseNotice"
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
        const { data } = await this.$http.get("$auth/broadcast", { noTip: 1 });
        const historyNoticeList = JSON.parse(localStorage.getItem("notice"));
        this.noticeList = historyNoticeList
          ? historyNoticeList.concat(data.list)
          : data.list;
        let EmailJoinSuccess = this.noticeList.find(
          (it) => it.type == "SWITCH_TO_MEMBER"
        );

        if (EmailJoinSuccess) {
          this.noticeList = this.noticeList.filter(
            (it) => it.type != "SWITCH_TO_MEMBER"
          );
          let tip = `You have been granted edit access to the following accounts`;
          tip +=
            '<p class="mt-5 warn-1">' +
            EmailJoinSuccess.message.cutStr(6, 4) +
            "</p>";
          console.log(tip);
          await this.$alert(tip);
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
        this.getList();
        this.$loading.close();
        // this.noticeList = this.noticeList.filter((it) => it.id != id);
      } catch (error) {
        this.getList();
      }
    },

    handlePopup(type) {
      if (type == "claim") {
        bus.$emit("showDialog");
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
  background: var(--v-background2-base);
}
.notice-content {
  height: 100%;
  .message {
    color: var(--v-primary-base);
  }
}
// @media screen and (max-width: 600px) {
//   .message {
//     font-size: 12px;
//   }
// }

::v-deep .invitation-btn .v-btn__content {
  color: #fff;
}
</style>
