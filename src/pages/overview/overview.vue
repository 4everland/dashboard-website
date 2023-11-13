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
      <div class="left flex-1 mr-6">
        <div class="header">
          <p class="fz-12 mb-0 tips">Welcome to 4EVERLAND Dashboard</p>
          <h3 class="fz-20">{{ uname }}</h3>
        </div>
        <div class="body">
          <div class="al-c space-btw mb-4">
            <h3 class="fz-20">LAND</h3>
            <div class="cursor-p fz-14 al-c" @click="$router.push('/billing')">
              <span>More</span>
              <img
                src="/img/svg/new-billing/right-arrow.svg"
                width="24"
                alt=""
              />
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
                <div
                  class="deposite-btn mr-4"
                  @click="$router.push('/billing/deposite')"
                  v-ripple
                >
                  Deposite
                </div>
                <div
                  class="conversion-btn"
                  v-ripple
                  @click="showTransform = true"
                >
                  Conversion
                </div>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="ml-4" size="18" v-bind="attrs" v-on="on"
                      >mdi-alert-circle-outline</v-icon
                    >
                  </template>
                  <span
                    >Conversion will convert LAND into various resources at the
                    full amount, for reference purposes only</span
                  >
                </v-tooltip>
              </div>
            </div>

            <half-pie style="width: 50%"></half-pie>
          </div>
        </div>
      </div>
      <div class="right mt-4 mt-md-0">
        <div class="al-c space-btw">
          <h3 class="fz-20">Announcement</h3>
          <div class="al-c cursor-p" @click="$router.push('/changelog')">
            <span class="fz-14">More</span>
            <img src="/img/svg/new-billing/right-arrow.svg" width="24" alt="" />
          </div>
        </div>

        <div class="log-list">
          <div
            class="log-item my-4 px-4 py-2 al-c cursor-p"
            v-for="(item, index) in changeLogList"
            :key="index"
            @click="$router.push('/changelog')"
          >
            <img
              src="img/svg/overview/circle.svg"
              class="mr-2"
              width="12"
              alt=""
            />
            <div class="h-flex space-btw">
              <h4 class="fz-14">{{ item.title }}</h4>
              <div class="fz-12 date">
                {{ item.time.toDate().format("date") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="usage-plate pa-6">
      <h3 class="fz-20">Usage</h3>
      <div class="combo pa-2 al-c space-btw my-4">
        <div class="combo-name fz-12">{{ onChain ? "Standard" : "Trial" }}</div>
        <div class="period">
          <span class="fw-b fz-14">Time period</span>:
          <span class="ml-1 fz-14"
            >{{ efficientAt ? new Date(efficientAt).format("date") : "--" }} -
            {{ invalidAt ? new Date(invalidAt).format("date") : "--" }}
          </span>
        </div>
      </div>

      <v-row>
        <v-col v-for="item in resourceList" :key="item.type">
          <resource-view
            :view="item"
            :showTransform="showTransform"
            :transformDate="landToResource[item.type]"
          ></resource-view>
        </v-col>
      </v-row>
    </div>

    <div class="trends-plate pa-6 mt-6">
      <h3 class="fz-20">Usage</h3>
      <trends-line></trends-line>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { BigNumber } from "ethers";
import axios from "axios";

import resourceView from "./component/resource-view.vue";
import trendsLine from "./component/trends-line.vue";
import halfPie from "../billing/component/half-pie.vue";

export default {
  components: {
    halfPie,
    resourceView,
    trendsLine,
  },
  data() {
    return {
      carouselIdx: 0,
      carouselWidth: 0,
      resourceLoading: false,
      invalidAt: null,
      efficientAt: null,
      resourceList: [],
      changeLogList: [],
      showTransform: false,
    };
  },
  created() {
    this.$store.dispatch("getBalance");
    this.$store.dispatch("getPrice");
    this.getUserResource();
    this.getList();
  },

  mounted() {
    this.carouselWidth = this.$refs.carouselRef.$el.offsetWidth;
    window.onresize = () => {
      this.carouselWidth = this.$refs.carouselRef.$el.offsetWidth;
    };
  },
  destroyed() {
    window.onresize = () => {};
  },
  computed: {
    ...mapGetters(["teamInfo", "balance", "landToResource"]),
    ...mapState({
      onChain: (s) => s.onChain,
      userInfo: (s) => s.userInfo,
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
    uname() {
      const info = this.userInfo;
      if (this.teamInfo.name) return "Overview of " + this.teamInfo.name;
      if (info.username) return "Hi " + info.username.cutStr(6, 4);
      return "Overview";
    },
  },
  methods: {
    async getUserResource() {
      this.resourceLoading = true;
      try {
        const { data } = await this.$http.get("$bill-consume/combo/user/list");
        const comboItem = data.combo;
        this.invalidAt = Number(comboItem.invalidAt) * 1e3;
        this.efficientAt = Number(comboItem.efficientAt) * 1e3;
        this.resourceList = comboItem.resourceItems.map((it, i) => {
          let total = BigNumber.from(it.size);
          let used = BigNumber.from(comboItem.consumeItems[i].size).add(
            BigNumber.from(data.realTimeItems[i].size)
          );
          if (it.resourceType == "BUILD_TIME") {
            return {
              type: it.resourceType,
              total: BigNumber.from(it.size),
              used: BigNumber.from(comboItem.consumeItems[i].size).add(
                BigNumber.from(data.realTimeItems[i].size)
              ),
            };
          }
          if (it.resourceType == "IPFS_STORAGE") {
            used = BigNumber.from(comboItem.consumeItems[i].size).add(
              BigNumber.from(data.totalIpfsStorage)
            );
          }
          if (it.resourceType == "AR_STORAGE") {
            used = BigNumber.from(comboItem.consumeItems[i].size).add(
              BigNumber.from(data.totalArStorage)
            );
          }
          return {
            type: it.resourceType,
            total,
            used,
          };
        });
      } catch (error) {
        console.log(error);
      }
      this.resourceLoading = false;
    },
    async getList() {
      try {
        const { data } = await axios.get(
          "https://4ever-web.4everland.store/config/changelog.json"
        );
        this.changeLogList = data.splice(0, 4);
      } catch (error) {
        console.log(error);
      }
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
        cursor: pointer;
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
    padding: 24px;
    width: 368px;
    box-sizing: border-box;

    .log-item {
      border-radius: 4px;
      background: #f8fafc;
      .date {
        color: #64748b;
      }
    }
  }
}

.usage-plate {
  border-radius: 8px;
  background: #fff;

  .combo {
    border-radius: 4px;
    background: #f3e8ff;
    .combo-name {
      color: #fff;
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
.trends-plate {
  mt-6border-radius: 8px;
  background: #fff;
}
</style>
