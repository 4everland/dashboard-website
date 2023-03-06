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
        <template v-if="item.type == 'CUSTOM'">
          <div class="notice-content al-c">
            <span class="fz-14 message">{{ item.message.title }}</span>
            <v-btn
              small
              width="100"
              light
              color="#FF994E"
              class="invitation-btn ml-auto mr-6"
              @click="handleDetail(item)"
              tile
              >Detail</v-btn
            >
          </div>
        </template>
      </v-carousel-item>
    </v-carousel>
    <v-icon size="20" color="#ff994e" @click="handleCloseNotice"
      >mdi-close</v-icon
    >
    <v-dialog v-model="showDialog" max-width="550">
      <div class="pa-5">
        <div class="al-c">
          <h3 class="fz-20">{{ dialogDetail.message.title }}</h3>
          <v-icon class="ml-auto" size="20" @click="showDialog = false"
            >mdi-close</v-icon
          >
        </div>
        <div class="my-6 fz-14" style="line-height: 30px">
          <div v-html="dialogDetail.message.message"></div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { bus } from "@/utils/bus";
export default {
  data() {
    return {
      noticeList: [],
      alert: false,
      showDialog: false,
      dialogDetail: {
        message: {},
      },
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
      if (!localStorage.getItem("custom-notice")) {
        this.noticeList.push({
          id: 9999,
          type: "CUSTOM",
          message: {
            title: "Notice of Arweave Service Suspension",
            message: `Due to the <a href="https://github.com/ArweaveTeam/arweave/releases" target="__blank">Arweave 2.6 upgrade</a>, Arweave related services will temporarily be suspended from 4:00pm 6 Mar to 7 Mar morning. The Arweave projects affected during the downtime will be implemented progressively when the service is restored!
          If you have any enquiries, please contact us at <a href="mailto:contact@4everland.org" target="__blank">contact@4everland.org</a>. We apologize for any inconvenience caused.`,
          },
          url: "",
        });
      }
    },
    handleCloseNotice() {
      this.noticeList = [];
      localStorage.removeItem("notice");
      localStorage.setItem("custom-notice", 1);
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
    handleDetail(item) {
      this.showDialog = true;
      this.dialogDetail = item;
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
