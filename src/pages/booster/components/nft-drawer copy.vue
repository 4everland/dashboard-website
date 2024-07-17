<template>
  <div class="nft-drawer-box">
    <v-navigation-drawer
      class="nft-drawer"
      v-model="drawer"
      absolute
      bottom
      temporary
      hide-overlay
      color="#1E2234"
      width="558"
      height="100%"
    >
      <v-container fluid>
        <div>
          <div>T4EVER STAKING</div>
          <div>Received a 10% bonus on staking yield.</div>
          <div>
            <div>
              <img src="/favicon.ico" alt="" />
            </div>
            <div><v-btn>Stake</v-btn></div>
          </div>
        </div>
        <v-row no-gutters>
          <v-col v-for="(n, i) in 13" :key="n" cols="4" md="15">
            <div class="nft-item-box">
              <img
                class="nft-item-image"
                :src="`/img/booster/nft/badge_${i}_1.png`"
                alt=""
              />
              <!-- <img
                class="nft-item-image"
                :src="`/img/booster/nft/badge_${i}_2.png`"
                alt=""
              />
              <img
                class="nft-item-image"
                :src="`/img/booster/nft/badge_${i}_3.png`"
                alt=""
              /> -->
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      drawer: true,
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard" },
        { title: "Photos", icon: "mdi-image" },
        { title: "About", icon: "mdi-help-box" },
      ],
      right: null,
    };
  },
};
</script>
<style lang="scss" scoped>
.nft-drawer-box {
  // position: relative;
  // top: -714px;
  .nft-drawer {
    // width: 558px;
    // height: 648px;
    background-image: url("/img/booster/drawer/bg.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .nft-item-box {
    width: 100px;
    .nft-item-image {
      width: 100%;
    }
  }
}

@media (min-width: 960px) {
  .col-md-15 {
    width: 20%;
    max-width: 20%;
  }
}
</style>
