<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="daily-boost-dialog headShake"
      v-model="value"
      persistent
    >
      <div class="daily-boost">
        <img
          class="lightning"
          src="/img/booster/spin/logomark.png"
          width="120"
          alt=""
        />
       <div class="pattern_light">
         <img
          src="/img/booster/spin/pattern_light.png"
          width="240"
          alt=""
        />
        
        <div class="reward-title">
          <div>
            🎉CONGRATS!
          </div>
          <div>
            YOU CAN WITHDRAW
          </div>
        </div>
       </div>
       <img
          src="/img/booster/spin/background.png"
          width="325"
          alt=""
        />
    
       <div class="spin-background">
        <div style="padding-top:100px;">
          <div class="">
            <div class="reward_points">
              <img
                src="/img/booster/spin/icon_points.png"
                width="32"
                alt=""
              />{{spinStartInfo.duration}}
            </div>
            <div class="reward_cashes">
              =${{spinStartInfo.cashValue}}
            </div>
            
            
          </div>
           <v-btn
              class="reward-btn point_pulse"
              style="width: 80%;"
              height="44"
              @click="handleStartGetReward()"
            >
              <div class="btn-text">Continue</div>
            </v-btn>
        </div>
       </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { onNext } from "@/api/booster";
import { bus } from "@/utils/bus";
import RewardDialog from "./reward-dialog.vue";

export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      list: [],
      checkinInfo: null,
      checkinLoading: false,
      showReward: false,
      today: 1,
    };
  },

  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      dailySign: (s) => s.moduleBooster.dailySign,
      spinStartInfo: (s) => s.moduleBooster.spinStartInfo,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: { 
    handleStartGetReward() {
      this.$router.push('/boost/spin');
    }
  },
  components: {
    RewardDialog,
  },
};
</script>
<style lang="scss" src="../spin.scss"></style>
<style lang="scss" scoped>
::v-deep .daily-boost-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}

@media screen and (max-width: 900px) {
  .daily-sign-footer {
    flex-direction: column-reverse;
  }
}
.daily-boost {
  position: relative;
  width: 100%;
  padding: 36px 16px 24px 16px;
  border-radius: 16px;
  text-align: center;
  .lightning {
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
  }
  .dialog-spin{
    position: absolute;
    top: 0;
    left: 8px;
  }
  .pattern_light{
    position: absolute;
    top: -54px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    .reward-title {
      font-family:  "Inter", sans-serif;
      font-size: 20px;
      font-style: italic;
      font-weight: 900;
      line-height: 24.21px;
      margin-top: -68px;
      color: #FFFFFF;
      text-align: center;
    }
    
    .reward-number{
      font-family: Inter;
      font-size: 40px;
      font-style: italic;
      font-weight: 700;
      line-height: 48.41px;
      text-align: center;
      margin-right:24px;
      color: #FFDE7F;
      margin-top: -68px;
    }
  }
  .spin-background{
    width:295px;
    height:280px;
    background: #121536;
    border-radius: 16px;
    margin: 0 auto;
    margin-top: -115px;
    .reward_points{
      font-family:  "Inter", sans-serif;
      font-size: 40px;
      font-style: italic;
      font-weight: 900;
      line-height: 48px;
      color: #6172F3;
      text-align: center;
    }
    .reward_cashes{
      font-family:  "Inter", sans-serif;
      font-size: 24px;
      font-style: italic;
      font-weight: 700;
      line-height: 24.21px;
      color: #FFDE7F;
      text-align: center;
    }
    .congratulations{
      font-family:  "Inter", sans-serif;
      font-size: 20px;
      font-style: italic;
      font-weight: 900;
      line-height: 24px;
      text-align: center;
      text-transform: uppercase;
      color: #FFF;
    }
    .swap{
      font-family: Inter;
      font-size: 14px;
      font-weight: 400;
      line-height: 16.94px;
      text-align: center;
      color: #0FE1F8;
      margin-top:8px;
    }
  }
}

.reward-btn {
  position: relative;
  color: #fff !important;
  padding: 0 !important;
  letter-spacing: 0;
  backdrop-filter: blur(2px);
  border-radius: 12px;
  margin-top: 20px;
  background: linear-gradient(180deg, #ffa927 0%, rgba(255, 169, 39, 0) 59.56%),
    linear-gradient(270deg, rgba(255, 114, 114, 0) 27%, #ff7272 100%),
    linear-gradient(327deg, #ff7c32 2.65%, rgba(255, 169, 39, 0) 33.12%),
    linear-gradient(to bottom right, rgba(199, 81, 255, 0) 0%, #c751ff 50%)
      bottom right / 50% 50% no-repeat,
    linear-gradient(to bottom left, rgba(199, 81, 255, 0) 0%, #c751ff 50%)
      bottom left / 50% 50% no-repeat,
    linear-gradient(to top left, rgba(199, 81, 255, 0) 0%, #c751ff 50%) top left /
      50% 50% no-repeat,
    linear-gradient(to top right, rgba(199, 81, 255, 0) 0%, #c751ff 50%) top
      right / 50% 50% no-repeat,
    linear-gradient(90deg, rgba(255, 53, 53, 0) 28%, #ff3535 100%), #ff35ba;
  .btn-text{
    font-family: Inter;
    font-size: 16px;
    font-weight: 700;
    line-height: 19px;
  }
}

.cancel-btn {
  color: #fff !important;
  font-weight: 500;
  font-family: Inter;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  background: transparent !important;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}
</style>
