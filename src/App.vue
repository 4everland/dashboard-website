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
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
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
}
</style>