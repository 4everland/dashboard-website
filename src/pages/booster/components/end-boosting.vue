<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile">
      <div class="start-boosting d-flex flex-column justify-center">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="18"
          alt=""
        />
        <div class="first-dialog-title fz-20 mb-5">
          As we gear up for 4EVER Node Boosting, we're in the midst of
          calculating your initial $4EVER points...
        </div>
        <div class="first-dialog-content pt-5">
          <div class="paragraph-1">
            A journey that began with 88,822 Points in Dashboard Taskhub,
            converting into 1,000 4EVER points.
          </div>
          <div class="paragraph-2 py-4">
            And further enriched by an extra 888 $4EVER points from the Elite
            Quest.
          </div>
          <div class="panel-box d-flex align-center justify-center">
            <img width="28" src="/img/booster/4ever-point-icon.png" alt="" />
            <ICountUp
              class="panel-text ml-2"
              :delay="1000"
              :endVal="boosterInfo.totalPoint"
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
      </div>
    </v-overlay>

    <v-dialog
      v-else
      max-width="738px"
      :value="value"
      persistent
      content-class="booster-dialog"
      style="background-color: transparent; box-shadow: none; height: 524px"
    >
      <div class="booster-module-dialog">
        <div class="start-boosting-dialog">
          <img
            class="close-btn"
            @click="$emit('input', false)"
            src="/img/booster/svg/close.svg"
            width="18"
            alt=""
          />

          <div class="first-dialog-title text-center fz-20 mb-5">
            As we gear up for 4EVER Node Boosting, we're in the midst of
            calculating your initial $4EVER points...
          </div>
          <div class="first-dialog-content pt-5">
            <div class="paragraph-1">
              A journey that began with 88,822 Points in Dashboard Taskhub,
              converting into 1,000 4EVER points.
            </div>
            <div class="paragraph-2 py-4">
              And further enriched by an extra 888 $4EVER points from the Elite
              Quest.
            </div>
            <div class="panel-box d-flex align-center justify-center">
              <img width="28" src="/img/booster/4ever-point-icon.png" alt="" />
              <ICountUp
                class="panel-text ml-2"
                :delay="1000"
                :endVal="boosterInfo.totalPoint"
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
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import ICountUp from "vue-countup-v2";
import { mapState } from "vuex";
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      // overlay: false,
    };
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  components: {
    ICountUp,
  },
};
</script>

<style lang="scss" scoped>
.start-boosting {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .first-dialog-title {
    padding: 4px 12px;
    background: rgba(0, 129, 248, 0.1);
    text-shadow: 0px 0px 8px #6172f3;
  }
  .first-dialog-content {
    border-top: 1px solid #3e4043;

    .paragraph-1,
    .paragraph-2 {
      padding: 0 12px;
    }
    .paragraph-1 {
      color: #40e8ff;
    }
    .panel-box {
      margin: 0 auto;
      width: 100%;
      max-width: 380px;
      height: 167px;
      border-radius: 16px;
      background: url("/img/booster/4ever-point-bg.png") no-repeat;
      .panel-text {
        color: #40e8ff;
        font-family: "DIN Alternate";
        font-size: 50px;
        font-weight: 700;
        line-height: normal;
      }
    }
  }
}

::v-deep .booster-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}
.booster-module-dialog {
  padding: 13px;
  height: 524px;
  background: url("/img/booster/svg/dialog-bg.svg") no-repeat;
  background-size: contain;
}
.start-boosting-dialog {
  position: relative;
  height: 100%;
  padding: 26px 7px 20px 7px;
  color: #fff;
  border-radius: 5px;
  border-radius: 5px;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);

  .close-btn {
    position: absolute;
    right: 10px;
    top: 5px;
    cursor: pointer;
  }
  .first-dialog-title {
    padding: 4px 60px;
    background: rgba(0, 129, 248, 0.1);
    text-shadow: 0px 0px 8px #6172f3;
  }
  .first-dialog-content {
    border-top: 1px solid #3e4043;

    .paragraph-1,
    .paragraph-2 {
      padding-left: 64px;
      padding-right: 64px;
    }
    .paragraph-1 {
      color: #40e8ff;
    }
    .panel-box {
      margin: 0 auto;
      width: 380px;
      height: 167px;
      border-radius: 16px;
      background: url("/img/booster/4ever-point-bg.png") no-repeat;

      .panel-text {
        color: #40e8ff;
        font-family: "DIN Alternate";
        font-size: 50px;
        font-weight: 700;
        line-height: normal;
      }
    }
  }
}
</style>
