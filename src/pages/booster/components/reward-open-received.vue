<template>
  <div>
    <v-dialog
      max-width="400"
      content-class="daily-boost-dialog coin_show"
      v-model="value"
      overlay-opacity="0.9"
      overlay-color="black"
      persistent
    >
      <div class="daily-boost " v-if="showNextSpinTime">
        <div v-show="showCard">
          <div class="pattern_light">
            <img
             class="light_img"
              src="/img/booster/spin/spin-light.png"
              width="240"
              alt=""
            />
            
          </div>
          <div class="d-flex align-center justify-center img_swap">
            <img
              class="img_card card_show"
              src="/img/booster/spin/swapcard.png"
              width="280"
              alt=""
            />
          </div>
        </div>
        <div v-show="showreward" class="daily-boost coin_show">
          <div class="d-flex align-center justify-center">
          <img
              src="/img/booster/spin/congratulations.png"
              width="24"
              alt=""
              />
            <div class="congratulations">Congratulations!</div>
          </div>
          <div class="received-text">Spin Times</div>
          <img
            class="lightning"
            src="/img/booster/spin/spin-times.png"
            width="120"
            alt=""
          />
        <div class="pattern_light">
          <img
            src="/img/booster/spin/pattern_light.png"
            width="240"
            alt=""
          />
          <div class="reward-number"><span style="font-size:30px">+</span>{{ spinStartInfo.remainSpins }}</div>
        </div>
          <div style="padding-top:60px;">
            <v-btn
                class="reward-btn"
                @click="handleShowNextStartSpin"
                style="width: 80%;"
                height="44"
              >
                <div class="btn-text">Continue(<span>{{ countdown }}</span>)</div>
              </v-btn>
          </div>
        </div>
      </div>

      <div class="daily-boost" v-if="!showNextSpinTime" >
        
        <div v-show="showCard">
          <div class="pattern_light">
            <img
             class="light_img"
              src="/img/booster/spin/spin-light.png"
              width="240"
              alt=""
            />
            
          </div>
          <div class="d-flex align-center justify-center img_swap">
            <img
              class="img_card card_show"
              src="/img/booster/spin/swapcard.png"
              width="280"
              alt=""
            />
          </div>
        </div>
        <div v-show="showreward" class="daily-boost" :class="currentclass">
          <div class="d-flex align-center justify-center">
          <img
              src="/img/booster/spin/congratulations.png"
              width="24"
              alt=""
              />
            <div class="congratulations">Congratulations!</div>
          </div>
          <div class="received-text">Points Quota</div>
          <img
            class="lightning "
            src="/img/booster/spin/points-quota.png"
            width="120"
            alt=""
          />
        <div class="pattern_light">
          <img
            class="light_img"
            src="/img/booster/spin/spin-light.png"
            width="240"
            alt=""
          />
          <div class="reward-number"><span style="font-size:30px">+</span>{{ current }}</div>
        </div>
          <div style="padding-top:60px;">
            <v-btn
                class="reward-btn"
                @click="handleQuoteNext"
                style="width: 80%;"
                height="44"
              >
                <div class="btn-text">Continue(<span>{{ countdown }}</span>)</div>
              </v-btn>
          </div>
      </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";


export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      list: [],
      checkinInfo: null,
      checkinLoading: false,
      countdown: 5,
      showDialog: false,
      countdownInterval: null,
      showNextSpinTime: false,
      showreward: false,
      showCard: false,
      spinList1:[
        50,30
      ],
      spinList2:[
        60,40
      ],
      spinList3:[
        100,100,50
      ],
      spinList4:[
        100,100,70,30
      ],
      spinList5:[
        70,40
      ],
      spinList6:[
        300,200,150,100
      ],
      spinList7:[
        400,200,100
      ],
      spinList8:[
        1000,1000,1000
      ],
      spinList9:[
        1500,1000,500,500
      ],
      spinList10:[
        3500,2000,1500,500
      ],
      spinList11:[
        2000,2000,2000
      ],
      spinList:[],
      current: "",
      activeIndex: 0,
      currentclass: "hideItem",

    };
  },
  watch: {
    value(newVal, oldVal) {
      if(newVal === true){
        this.startCountdown()
        if(!this.showNextSpinTime){
          this.showNext()
        }
      }

    },
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
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
    checkinDisabled() {
      if (!this.checkinInfo) return true;
      return this.checkinInfo.actStatus !== "CLAIM";
    },
    todayInfoReward() {
      const list = this.list.filter((it) => it.day == this.today);
      if (list.length > 0) {
        return list[0].reward;
      }
      return "10";
    },
  },
  mounted(){
    
  },
  methods: { 
    sleep(timestamp) {
      return new Promise((resolve) => {
        setTimeout(resolve, timestamp);
      });
    },
    startCountdown() {
      this.countdown = 5;
      this.countdownInterval = setInterval(async () => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.resetCountdown();
          this.showNextStep();
          console.log("showNextStep",this.activeIndex,this.spinList.length)
          if(!this.showNextSpinTime){
            if(this.activeIndex >= this.spinList.length){
              this.showNextSpinTime = true;
              this.$emit('input', false);
              await this.sleep(300);
              this.$emit('input', true);
            } else {
              this.startCountdown()
            }
          } else {
            this.handleShowNextStartSpin()
          }
        }
      }, 1000);
    },
    resetCountdown() {
      clearInterval(this.countdownInterval);
      this.countdown = 5;
    },
    async handleQuoteNext(){
      this.resetCountdown();
      this.currentclass = "";
         
      if(this.activeIndex <= this.spinList.length-1){
        
        await this.sleep(300);
       
          this.showreward = false;
          this.showCard = true;
          await this.sleep(1500);
          this.showCard = false;
          this.showreward = true;
          this.startCountdown()

        this.currentclass = "coin_show";
        this.current = this.spinList[this.activeIndex];
        this.activeIndex = this.activeIndex+1 ;
      } else {
        this.showNextSpinTime = true;
        this.$emit('input', false);
        await this.sleep(300);
        this.$emit('input', true);

        this.showreward = false;
        this.showCard = true;
        await this.sleep(1500);
        this.showCard = false;
        this.showreward = true;
      }
    },
    handleShowNextStartSpin() {
      this.resetCountdown();
      this.$emit('input', false);
      this.$emit('openStartNext')
    },
    async showNext() {
      let nextIndex = 1;
      this.spinList = this.spinList5;
      if(this.spinStartInfo.spinId == 'd16de24a-da99-40c8-897d-1dbba25f205a' || this.spinStartInfo.spinId == 'f4eff4ea-11a9-49ec-ae46-0392bc772aee'  || this.spinStartInfo.spinId == 'b37ed3c4-eb6b-4577-a218-056c1df57caa' ){
        this.spinList = this.spinList1;
      } else if(this.spinStartInfo.spinId == '77319c24-2816-47a0-bd91-25f7f8605e2d' || this.spinStartInfo.spinId == '6ae26d73-369e-475d-aa92-f400a8eda599' || this.spinStartInfo.spinId == '45e83b26-f41c-4175-af71-12a5dd3934d8' ){
        this.spinList = this.spinList2;
      } else if(this.spinStartInfo.spinId == '75809212-a816-43b8-8def-11927d45b7a3' || this.spinStartInfo.spinId == 'e7b59e3c-13da-45d5-8740-72f78caf3421'){
        this.spinList = this.spinList3;
      } else if(this.spinStartInfo.spinId == '5940e95c-ab34-4ec2-aa2e-861ff1a44b38' || this.spinStartInfo.spinId == '17ab01a2-115f-4462-b894-58b724df1d4f'){
        this.spinList = this.spinList4;
      } else if(this.spinStartInfo.spinId == 'b2492cf3-53ca-41ab-bb8c-c94880f964c1'){
        this.spinList = this.spinList5;
      } else if(this.spinStartInfo.spinId == '7ea15c37-8362-41b7-bc32-7b539e78b7bc'){
        this.spinList = this.spinList6;
      } else if(this.spinStartInfo.spinId == 'c7d7f472-377e-4229-ab60-7c468b5f3bbf'){
        this.spinList = this.spinList5
      } else if(this.spinStartInfo.spinId == '19f8eafa-c6e0-45ca-9d1c-d2ace8663b60'){
        this.spinList = this.spinList2
      } else if(this.spinStartInfo.spinId == '4b483e65-0229-4df3-ba01-d387ab668a18'){
        this.spinList = this.spinList3
      } else if(this.spinStartInfo.spinId == 'dbbb030c-7cf5-4b5d-adfe-83fe4c8e0382'){
        this.spinList = this.spinList4
      } else if(this.spinStartInfo.spinId == '17a97757-d191-4df7-b838-49e6c6abcce0'){
        this.spinList = this.spinList6
      } else if(this.spinStartInfo.spinId == '0c29e318-f971-4746-b211-c06f39ef5758'){
        this.spinList = this.spinList7
      } else if(this.spinStartInfo.spinId == '3db58d60-ba10-4039-841a-5dc4cc3c5dfd'){
        this.spinList = this.spinList8
      } else if(this.spinStartInfo.spinId == 'c85eaf5a-f0e9-45d1-91ea-bb0dfbc1dc0e'){
        this.spinList = this.spinList9
      } else if(this.spinStartInfo.spinId == 'cc1878f5-aef3-4787-9fd0-7aa168681fd7'){
        this.spinList = this.spinList10
      } else if(this.spinStartInfo.spinId == '8585ffd1-e206-4453-b425-ec5a3e14b169'){
        this.spinList = this.spinList11
      }
      this.showCard = true;
      await this.sleep(1500);
      this.showCard = false;
      this.showreward = true;
      this.currentclass = 'coin_show'
      this.current = this.spinList[this.activeIndex]
      this.activeIndex = nextIndex
    },
    async showNextStep(){
      this.currentclass = "";
      setTimeout(async () => {
          this.showreward = false;
          this.showCard = true;
          await this.sleep(1500);
          this.showCard = false;
          this.showreward = true;
          this.currentclass = "coin_show";
          this.current = this.spinList[this.activeIndex];
          this.activeIndex = this.activeIndex+1;
        }, 200);
    }

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
  .close-btn {
    position: absolute;
    right: 0;
    top: -40px;
    cursor: pointer;
  }
  .lightning {
    position: relative;
    top: 14px;
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
    top: 52px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    .reward-number{
      font-size: 40px;
      font-style: italic;
      font-weight: 700;
      line-height: 48px;
      text-align: center;
      margin-right:24px;
      color: #FFDE7F;
      margin-top: -58px;
    }
  }
  .light_img{
    animation: rotate 5s linear infinite;
  }
  .congratulations{
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;
      text-align: center;
      color: #FFF;
    }
  .received-text{
    font-size: 32px;
    font-style: italic;
    font-weight: 700;
    line-height: 39px;
    text-align: center;
    color: #FFF;
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
  margin-left: 10%;
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
  box-shadow: 0px 3px 1px 0px rgba(255, 255, 255, 0.4) inset,
    0px 4px 1px 0px rgba(255, 255, 255, 0.86) inset,
    0px 0px 6px 0px rgba(0, 0, 0, 0.2) inset,
    0px -2px 5px 0px rgba(0, 0, 0, 0.3) inset;
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
.img_card {
  position: relative;
  margin-top: 30px;
  z-index: 3;
}
@keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
</style>
