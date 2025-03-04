<template>
  
  <div class="airdrop-container">
    <div class="airdrop-in-container">
      <v-row>
        <v-col cols="12" md="6">
          <!-- 左侧空投信息列表 -->
          <v-list class="transparent">
            <v-list-item v-for="(item, index) in airdropItems" :key="index" class="airdrop-item content-bg">
              <v-list-item-avatar size="40">
                <v-icon size="30" color="white">{{ item.icon }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="white--text font-weight-bold">{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle class="grey--text text--lighten-1">{{ item.subtitle }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon color="cyan">mdi-check-circle</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="12" md="6">
          <!-- 右侧代币展示 -->
          <v-card class="transparent" flat>
            <v-card-text class="text-center position-relative">
              <v-img
                src="/img/booster/icon_fourever.png"
                max-width="200"
                class="mx-auto mb-4 img-right"
              ></v-img>
              <div class="right-content">
                <div class="white--text mb-4 text-left">You will receive:</div>
                <div class="d-flex justify-center">
                  <div class="light-btn d-flex justify-center align-center">
                    <div class="light-span">
                      <v-btn class="submit-btn">
                        <span class="number">
                          <ICountUp
                            class="points"
                            :delay="1000"
                            :endVal="shortPoint"
                            :options="{
                              useEasing: true,
                              useGrouping: true,
                              decimalPlaces: 0,
                              separator: ',',
                              decimal: '.',
                              prefix: '',
                              suffix: '',
                            }"
                          />
                        </span>
                        <span class="btn-text"> $4EVER </span>
                      </v-btn>
                    </div>
                  </div>
                </div>
                <v-btn
                  block
                  color="grey darken-3"
                  class="mt-6"
                  height="48"
                  :disabled="!canClaim"
                >
                  Claim Now
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-caption grey--text text--lighten-1 text-center mt-4">
            This airdrop claim will be conducted on BSC MainNet, with a deadline of 8:00 UTC on March 14. Eligible users, please complete your airdrop claim as soon as possible.
          </div>
        </v-col>
      </v-row>
    </div>
  </div>

</template>

<script>
import ICountUp from "vue-countup-v2";
import starrise from "../components/star-rise.vue";
export default {
  name: 'Airdrop',
  components: {
    ICountUp,
    starrise,
  },
  data: () => ({
    canClaim: true,
    shortPoint: 0,
    airdropItems: [
      {
        icon: 'mdi-diamond-stone',
        title: 'Staked T4EVER',
        subtitle: '0.5% of tokens for 1:1 T4EVER exchange.'
      },
      {
        icon: 'mdi-medal',
        title: '$4EVER Points',
        subtitle: '3% of tokens for users with $4EVER Points.'
      },
      {
        icon: 'mdi-account-group',
        title: 'Product Interaction',
        subtitle: '1% of tokens for early users who engage with products and on-chain activities.'
      },
      {
        icon: 'mdi-account-clock',
        title: 'Early Contributors',
        subtitle: '0.5% of tokens for 1:1 T4EVER exchange.'
      }
    ]
  })
}
</script>

<style scoped lang="scss">
.airdrop-container {
  width: 100%;
  height: 100%;
  padding-top: 140px;
  background: url("/img/booster/bg_airdrop_second.svg") repeat #000000;
}
.airdrop-in-container {
  max-width: 1032px;
  padding-top: 140px;
  margin: 0 auto;
  border: 1px solid #0FE1F81A;
  background: linear-gradient(281.05deg, rgba(0, 62, 112, 0.5) 19.1%, rgba(0, 10, 16, 0.5) 100%);
  backdrop-filter: blur(8px);
  padding: 40px;

}
.content-bg{
  background: url("/img/booster/svg/fringe-bg.svg") !important;
}
.img-right{
  position: absolute;
  right: -46px;
  top: -90px;
}
.right-content{
  margin-top: 95px;
  .submit-btn {
    width: 286px;
    height: 53px;
    border-radius: 16px;
    padding: 0 !important;
    .number {
      font-family: DIN Alternate;
      font-size: 32px;
      font-weight: 700;
      line-height: 37.25px;
      color: #40e8ff;
    }
    .btn-text {
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      color: #fff;
      margin-top: 8px;
    }
    background: url("/img/booster/earnings/grid.png") no-repeat #000000;
    background-size: contain;
  }
}


.light-btn {
  position: relative;
  padding: 2px;
  border: 0;
  border-radius: 16px;
  overflow: hidden;
  z-index: 1;
}
.light-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: conic-gradient(
    from var(--rotation),
    transparent,
    #0fe1f8 60deg,
    transparent 61deg
  );
  animation: spin 4s infinite linear;
}
@property --rotation {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0deg;
}
@keyframes spin {
  0% {
    --rotation: 0deg;
  }
  100% {
    --rotation: 360deg;
  }
}
.light-btn::after {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: 999px;
  background: var(--bg);
}
.light-span {
  padding: 2px;
  border-radius: 16px;
  background: #000000;
  position: relative;
  z-index: 2;
}
#starRise {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 0;
}
.btnWrap {
  position: relative;
  z-index: 1;
}

.airdrop-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 12px;
}

.receipt-card {
  background: rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px;
  height: 100px;
}

.timeline-line {
  height: 2px;
  flex-grow: 1;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 16px;
  position: relative;
}

.timeline-line::before {
  content: '';
  position: absolute;
  left: 30%;
  width: 20%;
  height: 100%;
  background: cyan;
}

.token-amount {
  font-size: 20px;
  font-weight: bold;
  color: white;
}
</style>
