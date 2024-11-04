<template>
  <div class="invite-drawer-box">
    <v-navigation-drawer
      class="invite-drawer"
      :absolute="!asMobile"
      :fixed="asMobile"
      bottom
      temporary
      :hide-overlay="!asMobile"
      color="#1E2234"
      :value="showInviteDrawer"
      @input="handleToggle"
      touchless
    >
      <v-container
        fluid
        class="d-flex flex-column"
        style="padding: 24px 16px; height: 100%"
      >
        <div class="drawer-title mb-6">Earn 5% Points for Every Invite!</div>

        <InviteDetail></InviteDetail>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import InviteDetail from "./invite-components/invite-detail.vue";
export default {
  computed: {
    ...mapState({
      showInviteDrawer: (s) => s.moduleBooster.showInviteDrawer,
      tonCount: (s) => s.moduleBooster.tonCount,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  components: {
    InviteDetail,
  },

  data() {
    return {};
  },
  methods: {
    handleToggle(val) {
      if (val) {
        this.$store.dispatch("getInviteInfo");
        this.$store.dispatch("getBoostTonCount");
        this.$store.dispatch("getInviteCount");
      } else {
        this.$store.commit("SET_INVITE_BAR", val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-drawer-box {
  ::v-deep .invite-drawer {
    width: 100% !important;
    height: 80% !important;
    max-height: 100% !important;
    background-image: url("/img/booster/drawer/invite-bg.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    overflow: scroll;
    .drawer-title {
      font-size: 20px;
      font-weight: 500;
      color: #fff;
      text-shadow: 0px 0px 8px #6172f3;
    }

    .usdt-withdraw {
      gap: 8px;
      width: 216px;
      padding: 8px;
      color: #000;
      border-radius: 16px 0px 0px 16px;
      background: linear-gradient(0deg, #fff 0%, #fff 100%),
        linear-gradient(99deg, #ffe205 35.35%, #ffc305 56.77%);

      .usdt-enabled {
        font-family: "DIN Alternate";
        font-weight: 700;
      }
      .withdraw-btn {
        letter-spacing: 0;
        padding: 8px;
        color: #fff;
        border-radius: 8px;
        background: #6172f3;
      }

      .withdraw-btn.v-btn--disabled {
        background: linear-gradient(0deg, #eaecf0 0%, #eaecf0 100%),
          linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%) !important;
      }
    }
  }
}

@media (min-width: 960px) {
  .invite-drawer-box {
    ::v-deep .invite-drawer {
      top: 74px !important;
      left: 24px !important;
      width: 558px !important;
      height: calc(100% - 74px - 64px - 24px) !important;
    }
  }
}
</style>
