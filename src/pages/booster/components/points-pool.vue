<template>
  <div>
    <div class="poolcontainer">
      <div
        v-for="(item, index) in newDataList"
        :key="index"
        @click="getProjectInfo(item, index)"
        :id="'partner_' + index"
        :class="{
          item: dataList.length % 2 === 0,
          itemone: dataList.length % 2 === 1
          
        }"
      >
        <div class="inneritem" :class="{fadeItem: item?.hidden}">
          <div
            :class="{ itemLocked: item?.type == 'locked' }"
            style="min-width: 45px"
          >
            <img
              :src="item?.projectLogoUrl"
              v-if="item?.projectLogoUrl"
              width="32"
              class="projectImg"
              alt=""
            />
            <div class="lockedWrap"></div>
          </div>
          <div class="trigger-text fz-10 fw-b text-center">
            <div class="projecttitle">
              {{
                item?.points
                  ? $utils.formatCompactNumbers(item?.points, item?.points>1?2:4)
                  : item?.projectName
              }}
            </div>
            <img
              v-if="item?.type == 'locked'"
              src="/img/booster/svg/right-arrow.svg"
              width="14"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioPlayer" src="/audio/collect.mp3" preload="auto"></audio>
    <audio ref="audioPlayer2" src="/audio/collect.mp3" preload="auto"></audio>
  </div>
</template>

<script>
import {
  fetchProjectPointsList,
  claimProjectPoints,
  fetchProjectInfo,
  fetchTonAdsLimit
} from "@/api/booster";
import { pointMove } from "@/utils/animation";
import { bus } from "@/utils/bus";
export default {
  data() {
    return {
      dataList: [],
      newDataList: [],
      allPointsNumber: 0,
      claimed: 0,
      loading: false,
      AdsLimit: {
      },
      AdController: null,
    };
  },
  computed: {
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },
  mounted() {
    bus.$on("initPointsPool", () => {
      this.init();
    });
    this.init();
  },
  beforeDestroy() {
    bus.$off("initPointsPool");
  },
  methods: {
    async init() {
      if(this.isTgMiniApp){
        this.AdController = window.Adsgram.init({ blockId: process.env.VUE_APP_ADS_REWARD_BLOCK_ID });
      }
      const curTimeStamp = +new Date() / 1e3;
      const { data } = await fetchProjectPointsList();
      const { data: limitdata } = await fetchTonAdsLimit();
        if (limitdata) {
          this.AdsLimit = limitdata;
        }
      const list = data.list || [];
      const _task = data.tasks || [];
      const tasks = _task?.filter((item) => {
        return item.endAt > curTimeStamp;
      });
      const arrorder = [6, 4, 2, 0, 1, 3, 5, 7];
      const arrorder2 = [5, 3, 1, 0, 2, 4, 6];
      this.dataList = list.length === 0 ? tasks : list;
      if(this.isTgMiniApp){

       
        let _limit = this.AdsLimit?.poolLimit - this.AdsLimit?.poolComplete;
        if(_limit==1){
          await this.$sleep(5000);
        }
        if(_limit > 0) {
          this.dataList.push({
            projectLogoUrl: "/img/booster/ton-invite-icon.png",
            type: "unlocked",
            projectType: "Ads",
            points: 0.002,
            idx: "ads1",
          });
        }
        this.dataList = this.dataList.slice(0, 8);
      }
      let adsList = this.dataList.filter((item) => {
        return item.projectType == "Ads";
      });
      this.allPointsNumber = list.length+adsList.length;
      this.claimed = 0;

      if (this.dataList.length % 2 === 1) {
        this.newDataList = arrorder2.map((index) => this.dataList[index]);
      } else {
        this.newDataList = arrorder.map((index) => this.dataList[index]);
      }
    },
    playaudio() {
      const audio = this.$refs.audioPlayer;
      audio.currentTime = 0;
      audio.play();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      
    },
    playaudio2() {
      const audio = this.$refs.audioPlayer2;
      audio.play();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      
    },
    async handleShadow() {
      const box = document.getElementById("navtop-mobile-points");
      box.classList.add('box-shadow-animate');
      await this.$sleep(500);
      box.classList.remove('box-shadow-animate');
    },
    async handleAccountShadow() {
      const box = document.getElementById("activity_Account_img");
      box.classList.add('box-scale-animate');
      await this.$sleep(500);
      box.classList.remove('box-scale-animate');
    },
    async getProjectInfo(item,index) {
      let self = this;
      if(!item) return;
      if(item.projectType == "Ads") {
        if(item.hidden) return;
        this.AdController.show().then(async (result) => {
              console.log(result);
              self.playaudio2();
              this.newDataList = this.newDataList.map((i, idx) => {
                if (idx === index) {
                  return {
                    ...i,
                    hidden: true,
                  };
                }
                return i;
              });
              
              pointMove('partner_'+index, "activity_Account_img", item.projectLogoUrl, '40', '60' )
              
              await this.$sleep(1500)
              this.handleAccountShadow();
              this.claimed++;
              if (this.claimed == this.allPointsNumber) {
                this.init();
              }
        }).catch((error) => {
            this.$toast2('Show Task error', "error");
            console.log('error',error);
        })
        return;
      }
      if(item.projectId) {
        if(item.hidden) return;
        this.playaudio();
        this.newDataList = this.newDataList.map((i, idx) => {
            if (idx === index) {
              return {
                ...i,
                hidden: true,
              };
            }
            return i;
          });
        pointMove('partner_'+index, "mobile-point-receive", item.projectLogoUrl, '64' )
        await this.$sleep(2000)
        this.handleShadow();
        
        const res = await claimProjectPoints(item.projectId, item.type)
        if(res.code === 200) {
          this.claimed++;
          if (this.claimed == this.allPointsNumber) {
            this.init();
          }
          // this.loading = false;
        } else {
          this.$toast2(res.msg, "error");
        }
      } else {
        if (item.type == "locked") {
          //this.$router.push('/boost/partner')
          this.$router.push({
            path: '/boost/partner',
            query: {
              id: item.id,
            }
          });
        } else {
          const { data } = await fetchProjectInfo(item.id);
          if (data) {
            bus.$emit("showPartnerInfoEvent", data);
          } else {
            this.$toast2("No data", "error");
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.poolcontainer {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  position: absolute;
  top: 21%;
  width: 100%;
  padding: 0 8px;
}

.item,
.itemone {
  position: relative;
  transition: transform 0.5s;
  text-align: center;
}
.trigger-text {
  max-width: 46px;
  line-height: 100%;
  position: relative;
  .projecttitle {
    max-width: 46px;
    overflow-wrap: break-word;
  }
  img {
    position: absolute;
    right: -11px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.itemLocked {
  position: relative;
  .lockedWrap {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 32px;
    border: solid 2px #667085;
    border-radius: 35px;
    background: #66708540 url("/img/booster/earnings/icon_lock.png") -3px -3px
      no-repeat;
  }
}
.right-arrow {
  background: url("/img/booster/svg/right-arrow.svg") right center no-repeat;
}

.itemone:nth-child(1) {
  transform: translateY(75px);
  .inneritem {
    animation: bounceup 4s infinite linear;
  }
}

.itemone:nth-child(2) {
  transform: translateY(45px);
  .inneritem {
    animation: bounce 4s infinite linear;
  }
}

.itemone:nth-child(3) {
  transform: translateY(15px);
  .inneritem {
    animation: bounceup 4s infinite linear;
  }
}

.itemone:nth-child(4) {
  transform: translateY(0px);
  .inneritem {
    animation: bounce 4s infinite linear;
  }
}

.itemone:nth-child(5) {
  transform: translateY(15px);
  .inneritem {
    animation: bounceup 4s infinite linear;
  }
}

.itemone:nth-child(6) {
  transform: translateY(45px);
  .inneritem {
    animation: bounce 4s infinite linear;
  }
}

.itemone:nth-child(7) {
  transform: translateY(75px);
  .inneritem {
    animation: bounceup 4s infinite linear;
  }
}

.item:nth-child(1) {
  transform: translateY(75px);
  .inneritem {
    animation: bounceup 4s infinite linear;
  }
}

.item:nth-child(2) {
  transform: translateY(45px);
  .inneritem {
    animation: bounce 4s infinite linear;
  }
}

.item:nth-child(3) {
  transform: translateY(15px);
  .inneritem {
    animation: bounceup 4s infinite linear;
  }
}

.item:nth-child(4) {
  transform: translateY(0px);
  .inneritem {
    animation: bounce 4s infinite linear;
  }
}

.item:nth-child(5) {
  transform: translateY(0px);
  .inneritem {
    animation: bounceup 4s infinite linear;
  }
}

.item:nth-child(6) {
  transform: translateY(15px);
  .inneritem {
    animation: bounce 4s infinite linear;
  }
}

.item:nth-child(7) {
  transform: translateY(45px);
  .inneritem {
    animation: bounceup 4s infinite linear;
  }
}

.item:nth-child(8) {
  transform: translateY(75px);
  .inneritem {
    animation: bounce 4s infinite linear;
  }
}

.projectImg {
  border-radius: 32px;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-10%);
  }
  50% {
    transform: translateY(0);
  }
}
@keyframes bounceup {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10%);
  }
}
.fadeItem {
  animation: fadeOut 0.5s ease-in forwards !important;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.square-box {
  animation: bounce 2s infinite linear;
}
.square-box-up {
  animation: bounceup 2s infinite linear;
}

</style>
