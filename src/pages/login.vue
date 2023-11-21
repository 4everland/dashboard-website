<template>
  <div class="page-login d-flex">
    <div class="login-left">
      <v-btn
        text
        color="transparent"
        href="https://4everland.org/"
        class="always-active mt-6 ml-10"
      >
        <logo />
      </v-btn>
      <v-img class="left-img" src="@/assets/imgs/login/left-img.png" />
    </div>
    <div class="right-main">
      <app-header />
      <div class="right-content">
        <v-container>
          <v-row>
            <v-col cols="12" class="ma-auto">
              <div
                class="text-left text-h4 font-bold font-weight-bold mb-6"
                style="color: #0e0e2c"
              >
                Connect your wallet
              </div>
              <login-choose />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import LoginChoose from "@/views/login/login-choose.vue";
import Logo from "@/views/login/Logo";
import AppHeader from "@/views/login/AppHeader.vue";
import AppFooter from "@/views/login/AppFooter.vue";

export default {
  components: {
    LoginChoose,
    Logo,
    AppHeader,
    AppFooter,
  },
};
</script>

<style lang="scss">
.page-login {
  background-color: #fff;
  height: 100%;

  .login-left {
    flex-grow: 0;
    position: relative;
    width: 512px;
    background-image: url("../assets/imgs/login/left-bg.png");
    background-size: 100% 100%;

    .left-img {
      width: 90%;
      position: absolute;
      right: 0;
      bottom: 40px;
    }
  }

  .right-main {
    height: calc(100% - 80px);
    flex-grow: 1;

    .right-content {
      max-width: 480px;
      height: 100%;
      display: flex;
      -ms-flex-positive: 1;
      flex-grow: 1;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      margin: 0 auto;
      padding: 0;
    }
  }
}

@media screen and (max-width: 960px) {
  .login-left {
    display: none;
  }
}
</style>
