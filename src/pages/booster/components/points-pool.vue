<template>
  <div>
    <div class="poolcontainer">
      <div class="itemone" v-if="dataList.length%2 == 1" v-for="(item, index) in newDataList" :key="'index'+index" @click="getProjectInfo(item, index)" :id="'partner_' + index">
        <div class="inneritem">
          <img :src="item?.projectLogoUrl" width="32" alt="" />
          <div class="trigger-text fz-10 fw-b text-center">{{ item?.points ? $utils.formatCompactNumbers(item?.points): item?.projectName }}</div>
        </div>
      </div>
      <div class="item" v-if="dataList.length%2 == 0" v-for="(item, index) in newDataList" :key="index" @click="getProjectInfo(item, index)" :id="'partner_' + index">
        <div class="inneritem">
          <img :src="item?.projectLogoUrl" v-if="item?.projectLogoUrl" width="32" alt="" />
          <div class="trigger-text fz-10 fw-b text-center">{{ item?.points ? $utils.formatCompactNumbers(item?.points): item?.projectName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchProjectPointsList, claimProjectPoints, fetchProjectInfo } from "@/api/booster";
import { coinMove } from "@/utils/animation";
import { bus } from "@/utils/bus";
export default {
  data() {
    return {
      dataList: [],
      newDataList: [],
      allPointsNumber: 0,
      claimed: 0,
    };
  },
  mounted() {
    bus.$on('initPointsPool', () => {
      this.init();
    })
    this.init();
  },
  beforeDestroy() {
    bus.$off('initPointsPool');
  },
  methods: {
    async init() {
      const { data } =  await fetchProjectPointsList()
      const list = data.list || [];
      const tasks = data.tasks || [];
      const arrorder = [8, 6, 4, 2, 0, 1, 3, 5, 7, 9];
      this.dataList = list.length === 0 ? tasks: list;
      this.allPointsNumber = list.length;

      
      this.newDataList = arrorder.map((index) => this.dataList[index]);
    },
    async getProjectInfo(item,index) {
      if(item.projectId) {
        const res = await claimProjectPoints(item.projectId, item.type)
        if(res.code === 200) {
          coinMove('partner_'+index, "activity_Account", item.projectLogoUrl, '64' )
          await this.$sleep(2000)
          this.claimed++
          if(this.claimed == this.allPointsNumber) {
            this.init();
          }
        } else {
          this.$toast2(res.msg, 'error')
        }
      } else {
        const { data } =  await fetchProjectInfo(item.id)
        if(data){
          bus.$emit('showPartnerInfoEvent', data)
        } else {
          this.$toast2('No data', 'error')
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

.poolcontainer {
  display: flex;
  justify-content: space-around;
  align-items: top;
  position: absolute;
  top: 180px;
  width: 100%;
}

.item, .itemone {
  position: relative;
  transition: transform 0.5s;
  text-align: center;
}
.trigger-text {
  max-width: 38px;
  overflow: hidden;

}

.itemone:nth-child(1) {
  transform: translateY(120px);
  .inneritem {
    animation: bounce 2s infinite linear;
  }
}

.itemone:nth-child(2) {
  transform:  translateY(90px);
  .inneritem {
    animation: bounceup 2s infinite linear;
  }
}

.itemone:nth-child(3) {
  transform:  translateY(60px);
  .inneritem {
    animation: bounce 2s infinite linear;
  }
}

.itemone:nth-child(4) {
  transform:  translateY(30px);
  .inneritem {
    animation: bounceup 2s infinite linear;
  }
}

.itemone:nth-child(5) {
  transform:  translateY(0px);
  .inneritem {
    animation: bounce 2s infinite linear;
  }
}

.itemone:nth-child(6) {
  transform:  translateY(30px);
  .inneritem {
    animation: bounceup 2s infinite linear;
  }
}

.itemone:nth-child(7) {
  transform: translateY(60px);
  .inneritem {
    animation: bounce 2s infinite linear;
  }
}

.itemone:nth-child(8) {
  transform:  translateY(90px);
  .inneritem {
    animation: bounceup 2s infinite linear;
  }
}
.itemone:nth-child(9) {
  transform:  translateY(120px);
  .inneritem {
    animation: bounceup 2s infinite linear;
  }
}


.item:nth-child(1) {
  transform: translateY(120px);
  .inneritem {
    animation: bounce 2s infinite linear;
  }
}

.item:nth-child(2) {
  transform:  translateY(90px);
  .inneritem {
    animation: bounceup 2s infinite linear;
  }
}

.item:nth-child(3) {
  transform:  translateY(60px);
  .inneritem {
    animation: bounce 2s infinite linear;
  }
}

.item:nth-child(4) {
  transform:  translateY(30px);
  .inneritem {
    animation: bounceup 2s infinite linear;
  }
}

.item:nth-child(5) {
  transform:  translateY(0px);
  .inneritem {
    animation: bounce 2s infinite linear;
  }
}

.item:nth-child(6) {
  transform:  translateY(0px);
  .inneritem {
    animation: bounceup 2s infinite linear;
  }
}

.item:nth-child(7) {
  transform: translateY(30px);
  .inneritem {
    animation: bounce 2s infinite linear;
  }
}

.item:nth-child(8) {
  transform:  translateY(60px);
  .inneritem {
    animation: bounceup 2s infinite linear;
  }
}

.item:nth-child(9) {
  transform:  translateY(90px);
  .inneritem {
    animation: bounce 2s infinite linear;
  }
}

.item:nth-child(10) {
  transform:  translateY(120px);
  .inneritem {
    animation: bounceup 2s infinite linear;
  }
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

.square-box {
  animation: bounce 2s infinite linear;
}
.square-box-up {
  animation: bounceup 2s infinite linear;
}
</style>
