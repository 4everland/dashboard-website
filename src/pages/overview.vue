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
              background: registerInfo.handled ? '#775da6' : '#999',
              color: registerInfo.handled ? '#fff' : '#000',
            }"
          >
            Pro
          </div>
          <!-- <div v-else class="ml-3">
            <span>normal user</span>
            <v-btn :loading="refreshLoading" icon @click="onCheckRegister">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </div> -->
        </div>
        <div class="gray-8 fz-14 mt-1">Welcome to 4EVERLAND Dashboard</div>
      </div>
      <e-right-opt-wrap v-if="!teamInfo.isMember">
        <v-btn class="mr-5" color="primary" to="/bucket/storage/?new=bucket">
          <!-- <span class="fz-18">+</span> -->
          <img src="/img/svg/add-circle.svg" width="14" alt="" />
          <span class="ml-2"> New Bucket </span>
        </v-btn>
        <!-- <v-btn color="primary" class="ml-5" to="/hosting/new">
          <span class="fz-18">+</span>
          <span class="ml-1"> New Project </span>
        </v-btn> -->

        <e-menu open-on-hover offset-y>
          <v-btn slot="ref" color="primary" dark>
            <img src="/img/svg/add1.svg" width="12" />
            <span class="ml-2">New Project</span>
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
          <v-list>
            <v-list-item
              v-for="(text, i) in projectTypeArr"
              :key="i"
              @click="onCreate(i)"
            >
              <v-list-item-title class="fz-15">{{ text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </e-menu>
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
    return {
      banners: [
        // {
        //   img: "https://4ever-web.4everland.store/img/banner/20221103-115504.jpg",
        //   href: "https://forms.gle/CrCVBoWFaA4V3RiB6",
        // },
        {
          img: "https://static1.4everland.org/img/banner/20221109-160329.png",
          to: "/reward-hub",
        },
      ],
      projectTypeArr: ["From Git / Template", "From IPFS Path"],
    };
  },
  created() {
    this.isRegister();
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["teamInfo"]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    uname() {
      const info = this.userInfo;
      if (this.teamInfo.name) return "Overview of " + this.teamInfo.name;
      if (info.username) return "Hi " + info.username.cutStr(6, 4);
      return "Overview";
    },
  },
  methods: {
    onCreate(i) {
      if (i == 0) return this.$router.push("/hosting/new");
      this.$router.push("/hosting/new-by-hash");
    },
    async onCheckRegister() {
      const register = await this.isRegister();
      if (register) {
        this.$refs.v3Usage.getUsageInfo();
      }
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
