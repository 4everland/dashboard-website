<style lang="scss">
.account-card {
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  bottom: 0;
  left: 98%;
  width: 240px;
  min-height: 120px;
  ul {
    padding: 0;
  }
}
</style>

<template>
  <div class="pos-r" v-click-outside="onOut" v-if="teamInfo">
    <div
      class="bg-f9 al-c ma-3 pa-1 hover-1"
      @click="showAccount = !showAccount"
    >
      <span class="mr-auto fz-14">{{ teamInfo.name }}</span>
      <v-chip label small color="primary" class="ev-n">
        {{ teamInfo.type == "INDIVIDUAL" ? "Individual" : "Collaboration" }}
      </v-chip>
      <img :src="`/img/svg/drawer/up-down.svg`" height="30" class="d-b" />
    </div>
    <div class="pos-a bg-white shadow-1 account-card pa-3" v-show="showAccount">
      <div v-if="showTip">
        <h3>Tip</h3>
        <div class="pa-2 fz-14">
          Personal and collaborative accounts can be switched here.
        </div>
        <div class="ta-r">
          <v-btn small color="primary" @click="showTip = false">OK</v-btn>
        </div>
      </div>
      <template v-else>
        <div v-show="row.subs.length" v-for="(row, i) in list" :key="i">
          <h3>{{ row.title }}</h3>
          <ul class="mt-2 ml-3">
            <li
              class="al-c hover-1 mb-2"
              @click="setTeam(it)"
              v-for="(it, j) in row.subs"
              :key="j"
            >
              <span>{{ it.name }}</span>
              <v-icon
                v-if="it.teamId == teamInfo.teamId"
                color="success"
                size="18"
                class="ml-auto"
                >mdi-check-circle</v-icon
              >
            </li>
          </ul>
        </div>
        <e-link
          href="/account/member"
          class="al-c mt-6 hover-1"
          @click.native="onOut"
        >
          <v-icon color="primary" size="18">mdi-plus-circle</v-icon>
          <span class="color-1 ml-1">Collaboration invitation</span>
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
          title: "Individual account",
          subs: list.filter((it) => it.type == "INDIVIDUAL"),
        },
        {
          title: "Collaboration account",
          subs: list.filter((it) => it.type == "COLLABORATION"),
        },
      ];
    },
    curUid() {
      return this.userInfo.uid;
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