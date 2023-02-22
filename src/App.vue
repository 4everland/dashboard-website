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
      <e-header></e-header>
      <e-drawer />
      <v-main>
        <e-nav></e-nav>
        <div class="pa-5" style="height: calc(100% - 37.5px)">
          <e-no-access v-if="isDisabled"></e-no-access>
          <e-wrap
            v-else
            :class="meta.wrapCls || (meta.isTab ? 'pa-0' : 'main-wrap mb-12')"
          >
            <keep-alive>
              <router-view name="cache"></router-view>
            </keep-alive>
            <router-view></router-view>
          </e-wrap>
        </div>
        <e-guide ref="guide" />
      </v-main>
    </template>

    <e-alert />
    <e-feedback />
    <e-meta-connect />
  </v-app>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { airdropRequest } from "@/plugins/airDrop/api";
export default {
  data() {
    return {
      loadedCount: 0,
      newUserData: null,
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
    showGuide() {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    isDisabled() {
      return (
        this.teamInfo.status == "DISABLED" &&
        !["/account/config"].includes(this.$route.path)
      );
    },
  },

  async mounted() {
    const token = localStorage.token;
    if (!token) return;
    await this.getNewUser();
    if (this.newUserData && this.showGuide) {
      if (this.$route.path != "/overview" && this.$route.path != "/") {
        this.$router.replace("/");
      }
      setTimeout(() => {
        this.$refs.guide.guide();
      }, 2000);
    }
  },
  methods: {
    async getNewUser() {
      try {
        const data = await airdropRequest();
        if (data) {
          this.newUserData = data;
        }
      } catch (error) {
        console.log(error);
      }
    },
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
</style>