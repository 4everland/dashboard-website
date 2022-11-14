<style lang="scss">
.ov-wrap-1 {
  padding: 30px 20px;
}
</style>

<template>
  <div>
    <v-carousel
      hide-delimiter-background
      :interval="5000"
      :show-arrows="false"
      :height="asMobile ? 100 : 160"
      class="bdrs-10 mb-4"
      cycle
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

    <div class="pos-r mb-5">
      <div>
        <h2>{{ uname }}</h2>
        <div class="gray-8 fz-14 mt-1">Welcome back to 4EVERLAND dashboard</div>
      </div>
      <e-right-opt-wrap>
        <v-btn color="primary" to="/bucket/storage/?new=bucket">
          <span class="fz-18">+</span>
          <span class="ml-1"> New Bucket </span>
        </v-btn>
        <v-btn color="primary" class="ml-5" to="/hosting/new">
          <span class="fz-18">+</span>
          <span class="ml-1"> New Project </span>
        </v-btn>
      </e-right-opt-wrap>
    </div>

    <v3-usage />

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
import { mapState } from "vuex";
import { newUserDrop } from "@/plugins/airDrop/index.js";

export default {
  data() {
    return {
      banners: [
        {
          img: "https://4ever-web.4everland.store/img/banner/20221103-115504.jpg",
          href: "https://forms.gle/CrCVBoWFaA4V3RiB6",
        },
        {
          img: "https://static1.4everland.org/img/banner/20221109-160329.png",
          to: "/reward-hub",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    uname() {
      const info = this.$store.state.userInfo;
      if (info.username) return "Hi " + info.username.cutStr(6, 4);
      return "Overview";
    },
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "close-new-drop") {
        this.checkReward();
      }
    },
  },
  async mounted() {
    try {
      const isPop = await newUserDrop();
      if (!isPop) {
        this.checkReward();
      }
    } catch (error) {
      //
    }
  },
  methods: {
    async checkReward() {
      try {
        const { data } = await this.$http.get("$auth/poster/rewardhub");
        if (data)
          this.$confirm(
            `<p>Dear 4EVERLAND user,</p><div class="lh-2 fz-14 mt-5 mb-5">We are launching Reward Hub to offer you a better experience with products and services. All new users can get free resources (storage, bandwidth, etc.) by completing the following tasks, while users who have already completed the tasks and received the free giveaway resources can simply go to Reward Hub to claim the resources. <p class="mt-2">Having fun while exploring 4EVERLAND! Please feel free to contact us in our communities if you have any questions. </p></div>`,
            "",
            {
              confirmText: "View",
              hideTitle: true,
            }
          ).then(() => {
            this.$navTo("/reward-hub");
          });
      } catch (error) {
        //
      }
    },
  },
};
</script>