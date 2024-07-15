<template>
  <div class="booster-container">
    <Navbar class="nav" @open-drawer="drawer = true"></Navbar>

    <v-navigation-drawer
      color="#17191D"
      v-model="drawer"
      width="80%"
      right
      absolute
      temporary
    >
      <div class="drawer-header d-flex align-center justify-end px-2">
        <img src="/img/booster/svg/close.svg" width="24" alt="" />
      </div>
      <div class="drawer-content px-4">
        <div class="user-info d-flex align-center">
          <e-team-avatar
            :src="userInfo.avatar"
            :size="32"
            :uid="userInfo.uid"
          ></e-team-avatar>
          <div class="ml-1">
            <div class="fz-14 fw-b">0xdd3...3232</div>
            <div class="fz-12 balance">
              <span>LAND Balance:</span>
              <span class="ml-1">999999k LAND</span>
            </div>
          </div>
          <div class="pgb ml-auto">
            <img src="/img/booster/svg/pig_bank.svg" width="24" alt="" />
          </div>
        </div>

        <div class="menus my-4 py-4">
          <div>Menu</div>
          <div class="menu-item pa-2">
            <img class="mr-2" src="" width="24" alt="" />
            <span>Home</span>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Navbar from "./nav-bar.vue";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      drawer: false,
      group: null,
      menuList: [
        {
          icon: "",
          name: "Home",
          path: "/booster",
        },
        {
          icon: "",
          name: "Elite Quest",
          path: "/booster/quest",
        },
        {
          icon: "",
          name: "Leaderboard",
          path: "/booster/leaderboard",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
  },
};
</script>

<style lang="scss" scoped>
img {
  vertical-align: middle;
}
.booster-container {
  position: relative;
  height: 100%;
  color: #fff;
  .drawer-header {
    height: 64px;
  }
  .drawer-content {
    .user-info {
      padding: 16px 8px;
      border-radius: 8px;
      background: #000;
      .balance {
        color: #94a3b8;
      }
      .pgb {
        border-radius: 4px;
        background: #6172f3;
        padding: 4px;
      }
    }
    .menus {
      .menu-item {
        border-radius: 4px;
        background: #0d004d;
      }
    }
  }
}
</style>
