<style lang="scss">
.ov-wrap-1 {
  padding: 30px 20px;
}
</style>

<template>
  <div>
    <div v-if="!teamInfo.isMember">
      <overview-notice class="mb-4" />
      <v-carousel
        hide-delimiter-background
        :interval="5000"
        :show-arrows="false"
        :height="asMobile ? 100 : 160"
        class="bdrs-10 mb-4"
        cycle
        hide-delimiters
      >
        <v-carousel-item
          v-for="(it, i) in banners"
          :key="i"
          :src="it.img"
          :to="it.to"
          :href="it.href"
          :target="it.href ? '_blank' : null"
        >
        </v-carousel-item>
      </v-carousel>
    </div>

    <div class="pos-r mb-5">
      <div>
        <div class="al-c">
          <v-btn icon v-if="asMobile" @click="$setMsg('showDrawer')">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          <h2>{{ uname }}</h2>
          <div
            class="ml-3 px-3 fz-12 user-tag"
            :style="{
              background: onChain ? '#775da6' : '#999',
              color: onChain ? '#fff' : '#000',
            }"
          >
            {{ onChain ? "Standard" : "Trial" }}
          </div>
        </div>
        <div class="gray-8 fz-14 mt-1">Welcome to 4EVERLAND Dashboard</div>
      </div>
      <e-right-opt-wrap v-if="!teamInfo.isMember">
        <v-btn color="primary" to="/bucket/storage/?new=bucket">
          <!-- <span class="fz-18">+</span> -->
          <img src="/img/svg/add-circle.svg" width="14" alt="" />
          <span class="ml-2"> New Bucket </span>
        </v-btn>
        <v-btn color="primary" class="ml-5" to="/hosting/new">
          <span class="fz-18">+</span>
          <span class="ml-1"> New Project </span>
        </v-btn>
      </e-right-opt-wrap>
    </div>

    <v3-usage ref="v3Usage" />

    <div class="mt-3">
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v3-uv />
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v3-stor />
          </v-card>
        </v-col>
      </v-row>

      <v-card class="mt-5">
        <v3-req />
      </v-card>
    </div>
    <new-user-tips />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
// import { newUserDrop } from "@/plugins/airDrop/index.js";
import mixin from "@/pages/more/mixin-register";

export default {
  mixins: [mixin],
  data() {
    return {};
  },
  created() {
    this.isRegister();
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
      userInfo: (s) => s.userInfo,
      onChain: (s) => s.onChain,
    }),
    ...mapGetters(["teamInfo"]),
    asMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    uname() {
      const info = this.userInfo;
      if (this.teamInfo.name) return "Overview of " + this.teamInfo.name;
      if (info.username) return "Hi " + info.username.cutStr(6, 4);
      return "Overview";
    },
    banners() {
      if (!this.onChain) {
        return [
          {
            img: "https://static1.4everland.org/img/banner/2023523-180202.jpg",
            href: "https://discord.com/channels/852482727164117022/1104253691676065893",
          },
          {
            img: "https://static1.4everland.org/img/banner/2023516-181010.jpg",
            href: "https://firstsowing.4everland.org",
          },
          {
            img: "https://static1.4everland.org/img/banner/20230420-173710.png",
            to: "/reward-hub",
          },
        ];
      }
      return [
        {
          img: "https://static1.4everland.org/img/banner/2023523-180202.jpg",
          href: "https://discord.com/channels/852482727164117022/1104253691676065893",
        },
        {
          img: "https://static1.4everland.org/img/banner/2023516-181010.jpg",
          href: "https://firstsowing.4everland.org",
        },
      ];
    },
  },
  watch: {
    onChain() {
      this.$refs.v3Usage.getUsageInfo();
    },
  },
};
</script>
<style lang="scss" scoped>
.user-tag {
  border-radius: 30px;
  background: #999;
}
</style>
