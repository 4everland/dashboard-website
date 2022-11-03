<style lang="scss">
.ov-wrap-1 {
  padding: 30px 20px;
}
</style>

<template>
  <div>
    <v-carousel
      hide-delimiter-background
      :show-arrows="false"
      height="180"
      class="bdrs-10 mb-4"
      cycle
    >
      <v-carousel-item
        href="https://forms.gle/CrCVBoWFaA4V3RiB6"
        target="_blank"
      >
        <img
          src="https://4ever-web.4everland.store/img/banner/20221103-msp.jpg"
          alt=""
          class="w100p bdrs-10 d-b"
        />
      </v-carousel-item>
      <v-carousel-item to="/reward-hub">
        <div class="pos-r mb-3 ov-h">
          <img
            src="/img/bg/user/reward-hub-bg.png"
            class="w100p img-cover d-b"
            style="max-height: 180px"
          />
          <div
            class="pos-center link-2 fz-25 fw-b ta-c w100p"
            style="max-width: 500px"
          >
            Explore, Earn, and Enjoy Free Resources in 4EVERLAND Reward Hub
          </div>
        </div>
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
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
    }),
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