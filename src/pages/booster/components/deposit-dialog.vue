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
        <div class="first-dialog-title py-2 fz-20 text-center mb-2">
          Claim LAND
        </div>
        <div class="first-dialog-content">
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Amount</span>
            <span>50,000 LAND ($0.05)</span>
          </div>
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Network</span>
            <v-select
              style="max-width: 194px"
              class="hide-msg network-select"
              dense
              solo
              item-value="chain"
              :items="chainList"
              v-model="chain"
              :menu-props="{
                'offset-y': true,
                'content-class': 'select-menu',
              }"
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <img :src="item.img" width="20" alt="" />
                  <span class="ml-2" style="color: #fff">{{ item.name }}</span>
                </div>
              </template>
              <template v-slot:item="{ item }">
                <div class="d-flex align-center">
                  <img :src="item.img" width="20" alt="" />
                  <span class="ml-2" style="color: #fff">{{ item.name }}</span>
                </div>
              </template>
              <template v-slot:append>
                <img
                  :src="'/img/booster/svg/down-arrow.svg'"
                  width="16"
                  alt=""
                />
              </template>
            </v-select>
          </div>

          <div
            class="act-btn d-flex align-center justify-center mt-10"
            style="gap: 16px"
          >
            <v-btn
              outlined
              color="rgba(255, 255, 255, 0.60)"
              @click="$emit('input', false)"
              >Cancel</v-btn
            >
            <v-btn
              style="
                border: 1px solid #0e6cc6;
                background: linear-gradient(
                  180deg,
                  #00070c 0%,
                  #074178 113.39%
                );
                text-shadow: 0px 0px 8px #6172f3;
              "
              outlined
              color="#fff"
              >Claim</v-btn
            >
          </div>
        </div>
      </div>
    </v-overlay>

    <v-dialog
      v-else
      max-width="592px"
      :value="value"
      persistent
      content-class="booster-dialog"
      style="background-color: transparent; box-shadow: none; height: 524px"
    >
      <div class="booster-module-dialog">
        <div class="start-boosting-dialog">
          <div class="deposit-dialog-title text-center fz-20 mb-5">
            Claim LAND
          </div>
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Amount</span>
            <span>50,000 LAND ($0.05)</span>
          </div>
          <div class="paragraph d-flex align-center justify-space-between">
            <span>Network</span>
            <v-select
              style="max-width: 194px"
              class="hide-msg network-select"
              dense
              solo
              item-value="chain"
              :items="chainList"
              v-model="chain"
              :menu-props="{
                'offset-y': true,
                'content-class': 'select-menu',
              }"
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <img :src="item.img" width="20" alt="" />
                  <span class="ml-2" style="color: #fff">{{ item.name }}</span>
                </div>
              </template>
              <template v-slot:item="{ item }">
                <div class="d-flex align-center">
                  <img :src="item.img" width="20" alt="" />
                  <span class="ml-2" style="color: #fff">{{ item.name }}</span>
                </div>
              </template>
              <template v-slot:append>
                <img
                  :src="'/img/booster/svg/down-arrow.svg'"
                  width="16"
                  alt=""
                />
              </template>
            </v-select>
          </div>

          <div
            class="act-btn d-flex align-center justify-center mt-10"
            style="gap: 16px"
          >
            <v-btn
              outlined
              color="rgba(255, 255, 255, 0.60)"
              @click="$emit('input', false)"
              >Cancel</v-btn
            >
            <v-btn
              style="
                border: 1px solid #0e6cc6;
                background: linear-gradient(
                  180deg,
                  #00070c 0%,
                  #074178 113.39%
                );
                text-shadow: 0px 0px 8px #6172f3;
              "
              outlined
              color="#fff"
              >Claim</v-btn
            >
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      // overlay: false,
      chainList: [
        {
          label: "Polygon",
          name: "Polygon",
          img: "/img/svg/billing/ic-polygon-0.svg",
          chainId: this.$inDev ? 80001 : 137,
        },
        {
          label: "Ethereum",
          name: "Ethereum",
          img: "/img/svg/billing/ic-ethereum.svg",
          chainId: this.$inDev ? 11155111 : 1,
        },
        {
          Label: "opBNB",
          name: "opBNB",
          img: "/img/svg/billing/ic-opbnb-test.svg",
          chainId: this.$inDev ? 5611 : 204,
        },
        {
          label: "BSC",
          name: "BSC",
          img: "/img/svg/billing/ic-bsc.png",
          chainId: this.$inDev ? 97 : 56,
        },
        {
          label: "Arbitrum",
          name: "Arbitrum",
          img: "/img/svg/billing/ic-arbitrum.png",
          chainId: this.$inDev ? 421613 : 42161,
        },
        {
          label: "zkSync",
          name: "zkSync Era",
          img: "/img/svg/logo-no-letters.svg",
          chainId: this.$inDev ? 280 : 324,
        },
        {
          label: "Optimism",
          name: "Optimism",
          img: "/img/svg/billing/ic-optimism.svg",
          chainId: 10,
        },
        {
          label: "Scroll",
          name: "Scroll",
          img: "/img/svg/billing/ic-scroll.svg",
          chainId: 534352,
        },
        {
          label: "Blast",
          name: "Blast",
          img: "/img/svg/billing/ic-blast.svg",
          chainId: 81457,
        },
        {
          label: "Taiko",
          name: "Taiko",
          img: "/img/svg/billing/ic-taiko.svg",
          chainId: 167000,
        },
        {
          label: "ZksyncLite",
          name: "Zksync Lite",
          img: "/img/svg/logo-no-letters.svg",
          chainId: 1,
        },
      ],
      chain: null,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
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
    background: rgba(0, 129, 248, 0.1);
    text-shadow: 0px 0px 8px #6172f3;
  }
}

::v-deep .booster-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
  // backdrop-filter: blur(6.5px) !important;
}
.booster-module-dialog {
  padding: 13px;
  height: 420px;
  background: url("/img/booster/svg/dialog-bg.svg") no-repeat;
  background-size: contain;
}
.start-boosting-dialog {
  position: relative;
  height: 100%;
  padding: 20px 8px;
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
  .deposit-dialog-title {
    padding: 4px 60px;
    background: rgba(0, 129, 248, 0.1);
    text-shadow: 0px 0px 8px #6172f3;
  }
}

.paragraph {
  padding: 16px 24px;
  margin-bottom: 8px;
  background: url("/img/booster/svg/fringe-bg.svg");
}

.network-select {
  color: #fff;
  border-radius: 4px;
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  background: rgba(49, 49, 49, 0.9);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.35);
}
.select-menu {
  .v-list.v-select-list.v-sheet.theme--light.v-list--dense.theme--light {
    border-radius: 4px !important;
    border: 0.5px solid rgba(255, 255, 255, 0.3) !important;
    background: rgba(49, 49, 49, 0.9) !important;
  }
}
</style>
