<template>
  <div class="nav-bar">
    <div class="nav d-none d-md-flex align-center">
      <div class="logo d-flex align-center">
        <img src="/img/booster/svg/logo.svg" width="157" alt="" />
      </div>
      <div class="router-link d-flex align-center">
        <div
          class="router-item"
          :class="{
            corner: currentHoverIdx == index,
            'corner trigger': $route.path == item.path,
          }"
          @mouseenter="currentHoverIdx = index"
          @mouseleave="currentHoverIdx = -1"
          v-for="(item, index) in routers"
          :key="index"
        >
          {{ item.name }}
          <span
            class="top-left"
            v-show="currentHoverIdx == index || $route.path == item.path"
          ></span>
          <span
            class="top-right"
            v-show="currentHoverIdx == index || $route.path == item.path"
          ></span>
          <span
            class="bottom-left"
            v-show="currentHoverIdx == index || $route.path == item.path"
          ></span>
          <span
            class="bottom-right"
            v-show="currentHoverIdx == index || $route.path == item.path"
          ></span>
        </div>
      </div>
      <div class="flex-1"></div>

      <div
        v-if="!notLogin"
        class="login-content user-info d-flex align-center justify-center px-4"
      >
        <e-team-avatar
          :src="userInfo.avatar"
          :size="32"
          :uid="userInfo.uid"
        ></e-team-avatar>
        <div class="info-content">
          <div class="d-flex align-center">
            <span class="fw-b fz-14"> 0xDD3..33e38 </span>
            <img
              class="cursor-p"
              src="/img/booster/svg/down-arrow.svg"
              width="12"
              alt=""
            />
          </div>
          <div class="balance fz-12">
            <span>LAND Balance:</span>
            <span class="ml-1">99999K LAND</span>
          </div>
        </div>
        <v-btn style="background: rgba(255, 255, 255, 0.1)">
          <img src="/img/booster/svg/invite-user.svg" width="16" alt="" />
          <span class="ml-1" style="color: #fff">Invite</span>
        </v-btn>
      </div>

      <div v-else class="login-content d-flex align-center justify-center">
        <v-btn style="background: rgba(255, 255, 255, 0.1)">
          <img src="/img/booster/svg/wallet.svg" width="16" alt="" />
          <span class="ml-1" style="color: #fff">Connect Wallet</span>
        </v-btn>
      </div>
    </div>

    <div
      class="nav-mobile px-2 d-flex align-center justify-space-between d-md-none"
    >
      <div class="logo d-flex align-center">
        <img src="/img/booster/svg/logo.svg" width="157" alt="" />
      </div>
      <div class="d-flex align-center">
        <div class="mobile-btn pa-1">
          <img src="/img/booster/svg/invite-user.svg" width="24" alt="" />
        </div>
        <div class="mobile-btn ml-1 pa-1" @click="$emit('open-drawer')">
          <img src="/img/booster/svg/mobile-draw-icon.svg" width="24" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      currentHoverIdx: -1,
      routers: [
        {
          name: "Home",
          path: "/booster",
        },
        {
          name: "Elite Quest",
          path: "/booster/quest",
        },
        {
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

    ...mapGetters(["notLogin"]),
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .nav-bar {
    top: 0 !important;
    height: 64px;
  }
}
.nav-bar {
  z-index: 2;
  position: fixed;
  width: 100%;
  top: 24px;
  .nav {
    height: 50px;
    margin: 0 24px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.05) 100%
      ),
      rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    > div {
      height: 100%;
    }
    .logo {
      padding: 0 59px 0 24px;
    }

    .router-link {
      border-left: 1px solid rgba(255, 255, 255, 0.25);

      .router-item {
        padding: 16px 0;
        width: 128px;
        text-align: center;
        border-right: 1px solid rgba(255, 255, 255, 0.25);
        line-height: 16px;
        box-sizing: border-box;
      }

      .router-item.trigger {
        font-weight: bold;
        background: radial-gradient(
            34.71% 14.84% at 50% 68.75%,
            rgba(97, 114, 243, 0.5) 0%,
            rgba(97, 114, 243, 0) 100%
          ),
          radial-gradient(
            50% 50% at 50% 50%,
            rgba(13, 13, 13, 0) 0%,
            #0d0d0d 100%
          ),
          url("/img/booster/header-link-shadow.png") 50% / cover no-repeat;
      }
    }

    .corner {
      position: relative;
      .top-left {
        position: absolute;
        left: -1px;
        top: -1px;
        padding: 4px;
        border-style: solid;
        border-color: #fff;
        border-width: 1px 0 0 1px;
      }
      .top-right {
        position: absolute;
        right: -1px;
        top: -1px;
        padding: 4px;
        border-style: solid;
        border-color: #fff;
        border-width: 1px 1px 0 0;
      }
      .bottom-left {
        position: absolute;
        right: -1px;
        bottom: -1px;
        padding: 4px;
        border-style: solid;
        border-color: #fff;
        border-width: 0 1px 1px 0;
      }
      .bottom-right {
        position: absolute;
        left: -1px;
        bottom: -1px;
        padding: 4px;
        border-style: solid;
        border-color: #fff;
        border-width: 0 0 1px 1px;
      }
    }

    .user-info {
      gap: 8px;
      .balance {
        color: #94a3b8;
      }
    }
    .login-content {
      width: 340px;
      border-left: 1px solid rgba(255, 255, 255, 0.25);
    }
  }
  .nav-mobile {
    height: 100%;

    .mobile-btn {
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      > img {
        vertical-align: middle;
      }
    }
  }
}
</style>
