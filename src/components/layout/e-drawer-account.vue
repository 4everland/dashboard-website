<template>
  <div
    id="team-guide"
    class="pos-r"
    v-click-outside="onOut"
    v-if="teamInfo"
    style="background: #f2f4f7"
  >
    <div
      class="al-c space-btw ma-3 pa-1 hover-1"
      @click="showAccount = !showAccount"
    >
      <div class="al-c">
        <div class="header-icon-box">
          <v-avatar size="24">
            <img :src="avatar" />
          </v-avatar>
        </div>
        <div>
          <span class="mr-auto fz-14 line-1 textPrimary--text">{{
            teamInfo.name
          }}</span>
          <div class="fz-12 primary--text">
            {{ teamInfo.isOwner ? "Owner" : "Member" }}
          </div>
        </div>
      </div>
      <div>
        <img :src="`/img/svg/drawer/switch.svg`" height="16" />
      </div>
    </div>
    <div class="pos-a bg-white shadow-1 account-card pa-3" v-show="showAccount">
      <div v-if="showTip">
        <h3>Tip</h3>
        <div class="pa-2 fz-14">
          Switch your owner account and member account here.
        </div>
        <div class="ta-r">
          <v-btn small color="primary" @click="showTip = false">OK</v-btn>
        </div>
      </div>
      <template v-else>
        <div v-show="row.subs.length" v-for="(row, i) in list" :key="i">
          <div style="font-size: 12px; color: #667085">{{ row.title }}</div>
          <ul class="mt-2 ml-3">
            <li
              class="al-c hover-1 mb-2"
              @click="setTeam(it)"
              v-for="(it, j) in row.subs"
              :key="j"
            >
              <!-- <e-team-avatar
                :src="it.teamAvatar"
                :uid="it.teamId"
                :size="22"
              ></e-team-avatar> -->
              <span class="ml-2 line-1">{{ it.name }}</span>
              <!-- <v-icon
                v-if="it.teamId == teamInfo.teamId"
                color="success"
                size="18"
                class="ml-auto"
                >mdi-check-circle</v-icon
              > -->
            </li>
          </ul>
        </div>
        <e-link
          href="/account/member"
          class="al-c flex-center mt-6 hover-1"
          @click.native="onOut"
        >
          <v-icon color="primary" size="18">mdi-plus</v-icon>
          <span class="color-1 ml-1 fz-14">Invite members</span>
        </e-link>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      teamList: (s) => s.teamList,
      noticeMsg: (s) => s.noticeMsg,
      teamId: (s) => s.teamId,
    }),
    ...mapGetters(["teamInfo"]),
    list() {
      const list = this.teamList;
      return [
        {
          title: "Owner",
          subs: list.filter((it) => it.isOwner),
        },
        {
          title: "Member",
          subs: list.filter((it) => it.isMember),
        },
      ];
    },
    curUid() {
      return this.userInfo.uid;
    },
    avatar() {
      const info = this.userInfo;
      return info.avatar || "/img/bg/user/def-avatar.png";
    },
  },
  data() {
    return {
      showAccount: false,
      showTip: false,
    };
  },
  watch: {
    teamId(val) {
      localStorage.teamId = val || "";
    },
    noticeMsg({ name }) {
      if (name == "joinTeam") {
        setTimeout(() => {
          this.showTip = true;
          this.showAccount = true;
        }, 200);
      }
    },
  },
  methods: {
    onOut() {
      this.showAccount = false;
    },
    setTeam(it) {
      if (it.teamId != localStorage.teamId) {
        setTimeout(() => {
          localStorage.stsData1 = "";
          location.href = "/overview";
        }, 100);
      }
      this.$setState({
        teamId: it.teamId,
      });
      this.showAccount = false;
    },
  },
};
</script>
<style lang="scss">
.account-card {
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  bottom: 70px;
  left: 24px;
  width: 240px;
  min-height: 120px;
  border-radius: 4px;
  ul {
    padding: 0;
  }
}
.header-icon-box {
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 4px;
  background: #eaecf0;
  margin-right: 8px;
}
</style>
