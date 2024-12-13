<template>
  <div>
    <div class="poolcontainer">
      <div class="item" v-for="(item, index) in newDataList">
        <img :src="item.img" width="32" alt="" />
        <div class="trigger-text fz-12 fw-b text-center">{{ item.points }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [
        {
          id: 3,
          img: "/img/booster/earnings/coin/icon_tomarket.png",
          points: 100,
          unlocked: true
        },
        {
          id: 3,
          img: "/img/booster/earnings/coin/icon_banana.png",
          points: 100,
          unlocked: true
        },
        {
          id: 1,
          img: "/img/booster/earnings/coin/icon_moss.png",
          points: 100,
          unlocked: true
        },
        {
          id: 2,
          img: "/img/booster/earnings/coin/icon_capy.png",
          points: 100,
          unlocked: true
        },
        {
          id: 3,
          img: "/img/booster/earnings/coin/icon_piggy.png",
          points: 100,
          unlocked: true
        },
        {
          id: 3,
          img: "/img/booster/earnings/coin/icon_cherry.png",
          points: 100,
          unlocked: true
        },
        {
          id: 3,
          img: "/img/booster/earnings/coin/icon_yes.png",
          points: 100,
          unlocked: true
        },
        {
          id: 3,
          img: "/img/booster/earnings/coin/icon_duck.png",
          points: 100,
          unlocked: true
        }
      ],
      newDataList: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const arrorder = [6, 4, 2, 0, 1, 3, 5, 7];
      this.newDataList = arrorder.map((index) => this.dataList[index]);
    }
  },
};
</script>

<style lang="scss" scoped>

.poolcontainer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  top: 210px;
  width: 100%;
}

.item {
  position: relative;
  transition: transform 0.5s;
}

.item:nth-child(1) {
  transform: translateX(0px) translateY(90px);
}

.item:nth-child(2) {
  transform:  translateY(60px);
}

.item:nth-child(3) {
  transform:  translateY(30px);
}

.item:nth-child(4) {
  transform:  translateY(0px);
}

.item:nth-child(5) {
  transform:  translateY(0px);
}

.item:nth-child(6) {
  transform:  translateY(30px);
}

.item:nth-child(7) {
  transform: translateY(60px);
}

.item:nth-child(8) {
  transform:  translateY(90px);
}
</style>
