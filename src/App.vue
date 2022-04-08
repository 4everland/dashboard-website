<template>
  <v-app
    :class="{
      mobile: asMobile,
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
        <div class="pa-5">
          <e-wrap :class="meta.wrapCls || (meta.isTab ? 'pa-0' : 'main-wrap')">
            <router-view v-if="!meta.keepAlive"></router-view>
            <keep-alive v-else>
              <router-view></router-view>
            </keep-alive>
          </e-wrap>
        </div>
      </v-main>
    </template>

    <e-alert />
    <e-feedback />
    <e-meta-connect />

    <a
      class="pos-f z-10"
      href="https://discord.com/invite/Cun2VpsdjF"
      target="_blank"
      style="right: 20px; bottom: 20px"
    >
      <img src="img/svg/common/m-discord.svg" width="42" />
    </a>
  </v-app>
</template>

<script>
export default {
  computed: {
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
  background: #fff;
  box-shadow: 0 0 6px rgb(205 205 205 / 50%);
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