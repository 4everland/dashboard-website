<template>
  <v-navigation-drawer
    color="#17191D"
    :value="value"
    class="booster-aside-drawer"
    overlay-opacity="0.7"
    @input="(val) => $emit('input', val)"
    width="80%"
    right
    fixed
    temporary
  >
    <!-- <div class="drawer-header d-flex align-center justify-end px-2">
      <img
        @click="$emit('input', false)"
        src="/img/booster/svg/close.svg"
        width="24"
        alt=""
      />
    </div> -->
    <div class="drawer-content px-4">
      <div class="user-info d-flex align-center">
        <e-team-avatar
          :src="userInfo.avatar"
          :size="32"
          :uid="userInfo.uid"
        ></e-team-avatar>
        <div class="ml-1">
          <div class="fz-14 fw-b">
            {{ (userInfo.username || "-").cutStr(6, 4) }}
          </div>
          <div class="fz-12 balance">
            <span>Balance:</span>
            <span class="ml-1">
              <span>{{ balance.land }}</span>
              <span>{{ balance.unit }}</span> LAND</span
            >
          </div>
        </div>
        <div class="pgb ml-auto" @click="handleToDeposit">
          <img
            style="display: block"
            src="/img/booster/svg/pig_bank.svg"
            width="24"
            alt=""
          />
        </div>
      </div>

      <div class="menus my-4 py-4">
        <div class="menus-title fz-12">Menu</div>
        <div
          class="menu-item d-flex align-center pa-2 mt-2 fz-14"
          :class="{ trigger: it.path == $route.path }"
          v-for="(it, i) in menuList"
          :key="i"
          @click="handleOpen(it)"
        >
          <img class="mr-2" :src="it.icon" width="24" alt="" />
          <span>{{ it.name }}</span>
        </div>
      </div>

      <div
        v-if="!isTgMiniApp"
        class="logout pa-2 fz-14 d-flex align-center"
        @click="handleLogout"
      >
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
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["notLogin", "balance"]),
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },

    menuList() {
      if (this.isTgMiniApp)
        return [
          {
            icon: "/img/booster/menu/home.svg",
            name: "Home",
            path: "/boost",
          },
          {
            icon: "/img/booster/menu/faq.svg",
            name: "FAQ",
            link: "https://4everland.org",
          },
          {
            icon: "/img/booster/menu/leaderboard.svg",
            name: "Leaderboard",
            path: "/boost/leaderboard",
          },
        ];
      return [
        {
          icon: "/img/booster/menu/home.svg",
          name: "Home",
          path: "/boost",
        },
        {
          icon: "/img/booster/menu/elite.svg",
          name: "Elite Quest",
          path: "/boost/quest",
        },
        {
          icon: "/img/booster/menu/leaderboard.svg",
          name: "Leaderboard",
          path: "/boost/leaderboard",
        },
      ];
    },
  },
  methods: {
    handleLogout() {
      localStorage.clear();
      localStorage.loginTo = location.pathname + location.search;
      location.reload();
    },
    handleToDeposit() {
      if (this.isTgMiniApp) {
        // window.open("https://dashboard.4everland.org/boost");
        return this.$toast2(
          "This feature is coming soon for the bot. Stay tuned!",
          "success"
        );
      }

      if (!this.notLogin) this.$router.push("/billing/deposit");
    },
    handleOpen(it) {
      if (it.path) {
        this.$router.push(it.path);
      } else {
        window.open(it.link);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-header {
  height: 64px;
}
.drawer-content {
  margin-top: 32px;
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
    .menus-title {
      color: #667085;
    }
    .menu-item {
      border-radius: 4px;
    }
    .trigger {
      font-weight: bold;
      background: #0d004d;
    }
  }
}
</style>
