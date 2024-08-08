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
        <div class="first-dialog-title fz-16 mb-5">
          Hello fam! Welcome to 4EVER Boost, a thrilling adventure where you can
          earn and maximize $4EVER points! 🚀
        </div>
        <div class="first-dialog-content pt-5">
          <div class="paragraph-1 mb-4 fz-14">
            <div>
              Before we set off on this thrilling ride, let's calculate your
              initial $4EVER points. Here’s the deal:
            </div>
            <ul>
              <li>
                <b>{{ boosterInfo.taskHubPoints / 20 }} TaskHub Points: </b
                >Converted to $4EVER points at a rate of 1:20.
              </li>
              <li>
                <b>{{ boosterInfo.eqPoints / 10 }} Elite Quest Points: </b
                >Converted to $4EVER points at a rate of 1:10.
              </li>
            </ul>
            <div>So, your initial $4EVER points are:</div>
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

          <div class="first-dialog-title text-center fz-20 my-5">
            Hello fam! Welcome to 4EVER Boost, a thrilling adventure where you
            can earn and maximize $4EVER points! 🚀
          </div>
          <div class="first-dialog-content pt-5">
            <div class="paragraph-1 mb-4">
              <div>
                Before we set off on this thrilling ride, let's calculate your
                initial $4EVER points. Here’s the deal:
              </div>
              <ul>
                <li>
                  <b>{{ boosterInfo.taskHubPoints / 20 }} TaskHub Points: </b
                  >Converted to $4EVER points at a rate of 1:20.
                </li>
                <li>
                  <b>{{ boosterInfo.eqPoints / 10 }} Elite Quest Points: </b
                  >Converted to $4EVER points at a rate of 1:10.
                </li>
              </ul>
              <div>So, your initial $4EVER points are:</div>
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
ul,
li {
  list-style: outside;
}
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
        font-size: 30px;
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
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
  .first-dialog-title {
    padding: 16px 40px;
    line-height: 24px;
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
