<template>
  <div>
    <div class="pos-r">
      <v-carousel
        v-model="carouselIdx"
        :interval="5000"
        :show-arrows="false"
        class="bdrs-10 mb-4"
        cycle
        height="100%"
        :style="{ 'min-height': carouselWidth / 6.24 + 'px' }"
        delimiter-icon="mdi-minus"
        hide-delimiters
        hide-delimiter-background
        ref="carouselRef"
      >
        <v-carousel-item
          v-for="(it, i) in banners"
          :key="i"
          :src="it.img"
          :to="it.to"
          :href="it.href"
          :target="it.href ? '_blank' : null"
        >
        </v-carousel-item>
      </v-carousel>

      <div class="delimiter-content al-c justify-center">
        <template v-for="(item, index) in banners">
          <div
            class="delimiter cursor-p"
            :class="{ active: carouselIdx == index }"
            :key="index"
            @click.stop="carouselIdx = index"
          ></div>
        </template>
      </div>
    </div>
    <div class="user-plate d-flex flex-column flex-md-row space-btw mb-6">
      <div class="left flex-1 mr-5">
        <div class="header">
          <p class="fz-12 mb-0 tips">Welcome to 4EVERLAND Dashboard</p>
          <h3 class="fz-20">Overview of 0x8807...f445</h3>
        </div>

        <div class="body">
          <div class="al-c space-btw mb-4">
            <h3 class="fz-20">LAND</h3>

            <div class="cursor-p fz-14">
              <span>More</span>
              <img src="" alt="" />
            </div>
          </div>
          <div class="d-flex space-btw" style="height: 100%">
            <div class="d-flex flex-column space-btw">
              <div>
                <p class="fw-b mb-2">balance</p>
                <div class="al-c">
                  <span class="balance fw-b ml-2">{{ balance.land }}</span>
                  <span class="fz-12 ml-2">{{ balance.unit }}</span>
                </div>
                <div class="fz-12 tips">Estimated depletion in 20 days</div>
              </div>
              <div class="al-c space-btw">
                <div class="deposite-btn mr-4" v-ripple>Deposite</div>
                <div class="conversion-btn" v-ripple>Conversion</div>
              </div>
            </div>

            <half-pie style="width: 50%"></half-pie>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="al-c space-btw">
          <h3 class="fz-20">Announcement</h3>
          <div class="al-c">
            <span class="fz-14">More</span>
            <img src="" alt="" />
          </div>
        </div>
      </div>
    </div>

    <div class="usage-plate pa-6">
      <h3 class="fz-20">Usage</h3>
      <div class="combo pa-2 al-c space-btw">
        <div class="combo-name">Standard</div>

        <div class="period">
          <span class="fw-b fz-14">Time period</span>:
          <span class="ml-1 fz-14">August 1, 2022 - September 1, 2022</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import halfPie from "./billing/component/half-pie.vue";
import { mapState } from "vuex";
export default {
  components: {
    halfPie,
  },
  data() {
    return {
      carouselIdx: 0,
      carouselWidth: 0,
    };
  },
  mounted() {
    this.carouselWidth = this.$refs.carouselRef.$el.offsetWidth;
    window.onresize = () => {
      this.carouselWidth = this.$refs.carouselRef.$el.offsetWidth;
    };
  },
  computed: {
    ...mapState({
      balance: (s) => s.moduleResource.balance,
    }),
    banners() {
      return [
        {
          img: "https://4ever-web.4everland.store/img/banner/20230721-174716.png",
          to: "/bucket/storage/",
        },
        {
          img: "https://4ever-web.4everland.store/img/banner/20230815-153912.png",
          href: "https://forms.gle/SAzZ2Sw31atnSSsB8",
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.delimiter-content {
  z-index: 100;
  width: 100%;
  height: 30px;
  position: absolute;
  left: 0;
  bottom: 0;
  .delimiter {
    width: 35px;
    height: 5px;
    border-radius: 10px;
    background: #fff;
  }
  .delimiter + .delimiter {
    margin-left: 20px;
  }
  .delimiter.active {
    background: #775da6;
  }
}

.user-plate {
  .left,
  .right {
    border-radius: 8px;
    background: #fff;
  }
  .left {
    .header {
      padding: 24px;
      border-bottom: 1px solid #cbd5e1;
      .tips {
        color: #64748b;
      }
    }
    .body {
      padding: 24px;
      .balance {
        color: #0f172a;
        font-family: "DIN Alternate";
        font-size: 32px;
      }
      .tips {
        color: #64748b;
      }
      .deposite-btn,
      .conversion-btn {
        border-radius: 4px;
        padding: 12px 32px;
      }
      .deposite-btn {
        color: #fff;
        background: #775da6;
      }
      .conversion-btn {
        color: #775da6;
        border: 1px solid #775da6;
      }
    }
  }
  .right {
    width: 368px;
    box-sizing: border-box;
  }
}

.usage-plate {
  border-radius: 8px;
  background: #fff;

  .combo {
    .combo-name {
      padding: 4px 16px;
      border-radius: 2px;
      background: linear-gradient(
          307deg,
          rgba(151, 71, 255, 0.8) 37.75%,
          rgba(115, 94, 161, 0.8) 93.02%
        ),
        #735ea1;
    }
  }
}
</style>
