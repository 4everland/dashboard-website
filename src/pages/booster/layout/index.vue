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
        <img
          @click="drawer = false"
          src="/img/booster/svg/close.svg"
          width="24"
          alt=""
        />
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
            < img src="/img/booster/svg/pig_bank.svg" width="24" alt="" />
          </div>
        </div>

        <div class="menus my-4 py-4">
          <div>Menu</div>
          <div
            class="menu-item d-flex align-center pa-2 mt-2 fz-14"
            :class="{ trigger: it.path == $route.path }"
            v-for="(it, i) in menuList"
            :key="i"
          >
            < img class="mr-2" :src="it.icon" width="24" alt="" />
            <span>{{ it.name }}</span>
          </div>
        </div>

        <div class="logout pa-2 fz-14">
          <img
            class="mr-2"
            src="/img/booster/menu/logout.svg"
            width="24"
            alt=""
          />
          <span>Log out</span>
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
          icon: "/img/booster/menu/home.svg",
          name: "Home",
          path: "/booster",
        },
        {
          icon: "/img/booster/menu/elite.svg",

          name: "Elite Quest",
          path: "/booster/quest",
        },
        {
          icon: "/img/booster/menu/leaderboard.svg",

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
  created() {
    console.log(this.$route.path);
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
      border-top: 1px solid rgba(255, 255, 255, 0.25);
      border-bottom: 1px solid rgba(255, 255, 255, 0.25);

      .menu-item {
        border-radius: 4px;
      }
      .trigger {
        font-weight: bold;
        background: #0d004d;
      }
    }
  }
}
</style>
