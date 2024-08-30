<template>
  <v-navigation-drawer
    color="#17191D"
    :value="value"
    class="booster-aside-drawer"
    overlay-opacity="0.7"
    @input="handleOpenDrawer"
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
      <div class="user-info">
        <div class="d-flex align-center user-info-header">
          <e-team-avatar
            :src="userInfo.avatar"
            :size="32"
            :uid="userInfo.uid"
          ></e-team-avatar>
          <div class="fz-14 fw-b ml-1">
            {{ (userInfo.username || "-").cutStr(6, 4) }}
          </div>
        </div>
        <div class="d-flex align-center mt-3">
          <div class="fz-12 balance">
            <div>Balance:</div>
            <div class="d-flex align-center">
              <div style="color: #fff">
                <span>{{ balance.land }}</span>
                <span>{{ balance.unit }}</span> LAND
              </div>
              <v-btn
                class="ml-1"
                x-small
                color="#fff"
                icon
                :loading="reloadBalance"
                @click="handleGetBalance"
              >
                <v-icon size="18" color="#fff">mdi-refresh</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="d-flex align-center pgb ml-auto" @click="handleToDeposit">
            <img
              style="display: block"
              src="/img/booster/svg/pig_bank.svg"
              width="16"
              alt=""
            />
            <span class="fz-12 ml-1">Deposit</span>
          </div>
        </div>
      </div>

      <div class="menus my-4 py-4">
        <div class="menus-title fz-12">Menu</div>
        <div
          class="menu-item d-flex align-center pa-2 mt-2 fz-14 cursor-p"
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
import { bus } from "@/utils/bus";

export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      reloadBalance: false,
    };
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
            link: "https://link.medium.com/TONm0rEzbMb",
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
      // return bus.$emit("showDepositDialog", { report: true, land: 50000 });

      if (this.isTgMiniApp) {
        // window.open("https://dashboard.4everland.org/boost");
        // return this.$toast2(
        //   "This feature is coming soon for the bot. Stay tuned!",
        //   "info"
        // );

        bus.$emit("showDepositDialog", { land: 0 });
        return this.$emit("input", false);
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
    handleOpenDrawer(val) {
      this.$emit("input", val);

      if (val) {
        this.$store.dispatch("getBalance");
      }
    },

    async handleGetBalance() {
      try {
        this.reloadBalance = true;
        await this.$store.dispatch("getBalance");
        this.reloadBalance = false;
      } catch (error) {
        console.log(error);
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
    .user-info-header {
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    }
    .balance {
      color: #94a3b8;
    }
    .pgb {
      padding: 8px 16px;
      border-radius: 4px;
      background: #6172f3;
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
