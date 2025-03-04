<template>
  
  <v-container class="airdrop-container">
    <div class="airdrop-in-container">
      <v-row>
        <v-col cols="12" md="6">
          <!-- 左侧空投信息列表 -->
          <v-list class="transparent">
            <v-list-item v-for="(item, index) in airdropItems" :key="index" class="airdrop-item">
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
                <v-card dark class="receipt-card">
                  <v-card-text>
                    <div class="d-flex justify-space-between align-center">
                      <div class="timeline-line"></div>
                      <div class="token-amount">$4EVER</div>
                    </div>
                  </v-card-text>
                </v-card>
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
  </v-container>

</template>

<script>
export default {
  name: 'Airdrop',
  data: () => ({
    canClaim: true,
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

<style scoped>
.airdrop-container {
  max-width: 1032px;
  padding-top: 140px;
}
.airdrop-in-container {
  border: 1px solid #0FE1F81A;
  background: linear-gradient(281.05deg, rgba(0, 62, 112, 0.5) 19.1%, rgba(0, 10, 16, 0.5) 100%);
  backdrop-filter: blur(8px);
  padding: 40px;

}
.img-right{
  position: absolute;
  right: -46px;
  top: -90px;
}
.right-content{
  margin-top: 95px;
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
