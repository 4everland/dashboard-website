<template>
  <v-app
    :class="{
      mobile: asMobile,
      'no-drawer': allowNoLogin,
    }"
  >
    <v-main v-if="meta.noLogin">
      <router-view></router-view>
    </v-main>
    <template v-else>
      <e-drawer />
      <e-header></e-header>
      <v-main>
        <v-container fluid style="height: 100%">
          <e-no-access v-if="isDisabled"></e-no-access>
          <template v-else>
            <keep-alive>
              <router-view name="cache"></router-view>
            </keep-alive>
            <router-view></router-view>
          </template>
        </v-container>
      </v-main>
    </template>
    <e-claim-dialog></e-claim-dialog>
    <e-animation-flowers></e-animation-flowers>
    <e-alert />
    <e-feedback />
    <!-- <e-meta-connect /> -->
  </v-app>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      loadedCount: 0,
    };
  },
  computed: {
    ...mapState({
      allowNoLogin: (s) => s.allowNoLogin,
    }),
    ...mapGetters(["teamInfo"]),
    meta() {
      return this.$route.meta || {};
    },
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    isDisabled() {
      return (
        this.teamInfo.status == "DISABLED" &&
        !["/account/config"].includes(this.$route.path)
      );
    },
  },

  async created() {
    if (localStorage.token) await this.$store.dispatch("getCode");
  },
};
</script>

<style lang="scss">
.main-wrap {
  min-height: 77vh;
  padding: 26px 32px;
  border-radius: 10px;
  &.auto {
    min-height: auto;
  }
  background: #fff;
  box-shadow: 0 1px 3px rgb(205 205 205 / 50%);
  h3 {
    margin-bottom: 20px;
    font-size: 20px;
    line-height: 1;
  }
  h4 {
    margin-bottom: 10px;
    line-height: 1;
    font-size: 15px;
    font-weight: normal;
  }
}
.points-swap {
  .v-progress-linear__determinate {
    background: linear-gradient(
      90deg,
      #ff35ba 27.76%,
      #fff6b6 73.98%
    ) !important;
    border-radius: 16px !important;
    height: 8px !important;
  }
}
.earn-list,
.assets-tab {
  .v-slide-group__wrapper {
    height: 28px !important;
  }
}
.select-confirm {
  .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
    > .v-input__control
    > .v-input__slot {
    box-shadow: none !important;
    border: 1px solid #ffffff40 !important;
  }
  .theme--light.v-icon {
    color: #fff;
  }
  .v-input__slot {
    border-radius: 4px !important;
    border: 1px solid #ffffff40 !important;
    padding: 2px 12px !important;
    background: #ffffff0d !important;
  }
  .theme--light.v-text-field:not(.v-input--has-state):hover
    > .v-input__control
    > .v-input__slot:before {
    border: none !important;
  }
.theme--light.v-input input, .theme--light.v-input textarea{
    color: #FFF !important;
}
}
</style>
