<template>
  <div>
    <v-overlay :value="value" opacity="1" v-if="asMobile">
      <div class="buy-card d-flex flex-column justify-center">
        <img
          class="close-btn"
          @click="$emit('input', false)"
          src="/img/booster/svg/close.svg"
          width="18"
          alt=""
        />

        <div
          class="buy-card-content d-flex flex-column align-center justify-center justify-md-space-between text-center"
        >
          <div class="py-4">
            <div class="buy-card-title">{{ cardTitle }} Card</div>
            <div class="mt-6">{{ cardDesc }}</div>
            <div class="card-buff mt-2">{{ cardBuff }}</div>
          </div>

          <div class="d-flex align-center" style="gap: 30px">
            <v-btn
              outlined
              class="cancel-btn"
              color="#fff"
              width="120"
              height="48"
              @click="$emit('input', false)"
              >Cancel</v-btn
            >
            <v-btn
              class="buy-btn"
              @click="handleBuyCard"
              outlined
              :loading="loading"
              color="#fff"
              width="120"
              height="48"
              >Buy</v-btn
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
      style="background-color: transparent; box-shadow: none"
    >
      <div class="booster-module-dialog">
        <div
          class="buy-card-content d-flex flex-column align-center justify-space-between text-center"
        >
          <div class="py-4">
            <div class="buy-card-title">{{ cardTitle }} Card</div>
            <div class="mt-6">{{ cardDesc }}</div>
            <div class="card-buff mt-2">{{ cardBuff }}</div>
          </div>

          <div class="d-flex align-center" style="gap: 30px">
            <v-btn
              outlined
              class="cancel-btn"
              color="#fff"
              width="120"
              height="48"
              @click="$emit('input', false)"
              >Cancel</v-btn
            >
            <v-btn
              class="buy-btn"
              @click="handleBuyCard"
              outlined
              :loading="loading"
              color="#fff"
              width="120"
              height="48"
              >Buy</v-btn
            >
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { buyCard } from "@/api/booster";
export default {
  props: {
    value: Boolean,
    buyType: String,
    buyCount: Number,
    unitPrice: Number,
    buff: Number,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    cardTitle() {
      switch (this.buyType) {
        case "explore":
          return "Explore";
        default:
          return "Capacity";
      }
    },
    cardDesc() {
      return `Consume ${(
        this.buyCount * this.unitPrice
      ).toLocaleString()} LAND to enjoy`;
    },
    cardBuff() {
      switch (this.buyType) {
        case "explore":
          return "Explore time: +" + this.buyCount * this.buff;
        default:
          return "Capacity limit: +" + this.buyCount * this.buff;
      }
    },
  },

  methods: {
    async handleBuyCard() {
      this.loading = true;
      try {
        const data = await buyCard(this.buyType, this.buyCount);
        if (data) {
          if (this.buyType == "explore") {
            this.$store.dispatch("getExploreRemain");
          } else {
            this.$store.dispatch("getBoosterUserInfo");
          }
          this.$store.dispatch("getBalance");
          this.$toast2("buy successfully!!");
          this.$emit("getCards");
          this.$emit("input", false);
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.buy-card {
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
}

::v-deep .booster-dialog {
  background: transparent !important;
  box-shadow: none !important;
  overflow: initial !important;
}
.booster-module-dialog {
  padding: 13px;
  height: 273px;
  background: url("/img/booster/svg/buy-card-bg.svg") no-repeat;
  background-size: contain;
  background-position: center;
}
.buy-card-content {
  height: 100%;
  padding: 16px 8px;
  border-radius: 5px;
  background: linear-gradient(
      180deg,
      rgba(0, 10, 16, 0.5) 66.24%,
      rgba(0, 62, 112, 0.5) 100%
    ),
    rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(4px);
  color: #fff;

  .buy-card-title {
    padding: 8px;
    font-size: 24px;
    text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.25);
    background: rgba(0, 129, 248, 0.1);
  }
  .card-buff {
    color: #0fe1f8;
  }
  .cancel-btn {
    color: rgba(255, 255, 255, 0.8) !important;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(2px);
  }

  .buy-btn {
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #0e6cc6;
    background: linear-gradient(180deg, #00070c 0%, #074178 113.39%);
    box-shadow: 0px -4px 8px 0px rgba(0, 133, 195, 0.25),
      0px 4px 8px 0px rgba(0, 133, 195, 0.25);
  }
}
</style>
