<template>
  <div class="explore-bar py-2 d-flex align-center">
    <div
      class="px-2 px-md-6 flex-1 d-flex align-center cursor-p"
      @click="$router.push('/boost')"
    >
      <img
        src="/img/booster/explore/back.svg"
        :width="asMobile ? 24 : 36"
        alt=""
      />
      <div class="back-content flex-1 text-right">Back</div>
    </div>
    <div class="user-container px-3 flex-2" v-show="uid">
      <e-team-avatar :size="asMobile ? 30 : 42" :uid="uid"></e-team-avatar>
      <span>{{
        address ? address.slice(0, 4) + "..." + address.slice(-4) : ""
      }}</span>

      <div class="d-flex align-center">
        <img width="16" src="/img/booster/4ever-point-icon.png" alt="" />

        <ICountUp
          class="points mx-1"
          :delay="1000"
          :endVal="totalPoint"
          :options="{
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.',
            prefix: '',
            suffix: '',
          }"
        />
      </div>
    </div>
    <div
      class="px-2 px-md-6 flex-1 d-flex align-center cursor-p"
      @click="handleExplore"
    >
      <div class="pos-r">
        <img
          src="/img/booster/svg/explore.svg"
          :width="asMobile ? 24 : 36"
          alt=""
        />
        <div class="count pos-a">x{{ exploreRemain }}</div>
      </div>
      <div class="explore-content flex-1 text-right">Explore</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ICountUp from "vue-countup-v2";

export default {
  props: {
    address: {
      type: String,
      default: "",
    },
    uid: {
      type: String,
      default: "",
    },
    totalPoint: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState({
      exploreRemain: (s) => s.moduleBooster.exploreRemain,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    handleExplore() {
      if (this.exploreRemain < 1)
        return this.$toast2(
          "Whoops, you've used all your exploration times. Try again tomorrow!",
          "error"
        );
      this.$emit("onExplore");
    },
  },
  components: {
    ICountUp,
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .explore-bar {
    width: calc(100% - 20px) !important;
  }
  .user-container {
    font-size: 14px !important;
  }
  .back-content,
  .explore-content {
    font-size: 14px !important;
  }
  .points {
    font-size: 14px !important;
  }
}
.explore-bar {
  width: 740px;
  border-radius: 85px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  .user-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 8px;
    height: 48px;
    font-family: "DIN Alternate";
    font-size: 20px;
    background: linear-gradient(
      90deg,
      rgba(97, 114, 243, 0) 0%,
      rgba(97, 114, 243, 0.5) 50.5%,
      rgba(97, 114, 243, 0) 100%
    );

    border-left: 0.5px solid rgba(255, 255, 255, 0.25);
    border-right: 0.5px solid rgba(255, 255, 255, 0.25);
  }

  .back-content,
  .explore-content {
    height: 32px;
    line-height: 32px;
    background: url("/img/booster/explore/btn-bg.png") no-repeat;
    background-size: 100% 100%;
  }

  .count {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 10px;
    height: 12px;
    line-height: 9px;
    padding: 2px 3px;
    background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
    box-shadow: 0px 1.582px 4.746px 0px rgba(0, 50, 228, 0.4);
    border-radius: 6px;
  }
  .points {
    color: #6172f3;
    font-family: "DIN Alternate";
    font-size: 20px;
    font-weight: 700;
    line-height: 24px; /* 120% */
  }
}
</style>
