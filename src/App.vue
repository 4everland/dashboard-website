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
          <e-wrap
            :class="meta.wrapCls || (meta.isTab ? 'pa-0' : 'main-wrap mb-12')"
          >
            <keep-alive>
              <router-view name="cache"></router-view>
            </keep-alive>
            <router-view></router-view>
          </e-wrap>
        </div>
      </v-main>
    </template>

    <e-alert />
    <e-feedback />
    <e-meta-connect />
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      allowNoLogin: (s) => s.allowNoLogin,
    }),
    meta() {
      return this.$route.meta || {};
    },
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
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