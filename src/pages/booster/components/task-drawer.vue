<template>
  <div class="task-drawer-box">
    <v-navigation-drawer
      class="task-drawer"
      absolute
      bottom
      temporary
      hide-overlay
      right
      color="#1E2234"
      :value="showTaskDrawer"
      @input="stateTaskDrawerShow"
    >
      <v-container fluid style="padding: 24px 16px">
        <div class="task-drawer-top">
          <div class="drawer-title task-drawer-title">
            Daily Task: Claim LAND
          </div>
          <div class="daily-sign-box">
            <div v-for="n in 7" :key="n" class="daily-sign-item">
              <div class="daily-sign-item-top">
                <div>+1/H</div>
                <div>
                  <img src="/img/booster/drawer/coin.png" alt="" />
                </div>
              </div>
              <div class="daily-sign-item-bottom">Day 1</div>
            </div>

            <v-btn class="drawer-btn"> Claim LAND </v-btn>
          </div>
        </div>
        <div class="task-box">
          <v-row no-gutters style="gap: 18px 0">
            <v-col v-for="(n, i) in 13" :key="n" cols="12">
              <div class="task-item-box">
                <div class="task-item-left">
                  <img
                    class="task-item-image"
                    :src="`/img/booster/nft/badge_${i}_1.png`"
                    alt=""
                  />
                  <div class="task-text-box">
                    <div class="task-name">Invite a new booster</div>
                    <div class="task-desc">+3/H, valid for 24 hours</div>
                  </div>
                </div>

                <div class="task-item-right">
                  <v-btn class="drawer-btn">Claim</v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapGetters(["showTaskDrawer"]),
  },
  data() {
    return {};
  },
  methods: {
    stateTaskDrawerShow(state) {
      this.$store.dispatch("TaskDrawerState", { state });
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-btn {
  background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
  box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
  color: #fff !important;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
}
.task-drawer-box {
  ::v-deep .task-drawer {
    width: 100% !important;
    height: 80% !important;
    max-height: 100% !important;
    background-image: url("/img/booster/drawer/task-bg.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    overflow: scroll;
    .drawer-title {
      font-size: 24px;
      font-weight: 500;
      color: #fff;
      text-shadow: 0px 0px 8px #6172f3;
    }
    .task-drawer-top {
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);

      .daily-sign-box {
        display: flex;
        align-items: center;
        gap: 10px;
        .daily-sign-item {
          .daily-sign-item-top {
            display: flex;
            padding: 7px 7.5px 10px 7.5px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 5px;
            border-radius: 100px;
            background: rgba(255, 255, 255, 0.1);
            img {
              width: 24px;
              height: 24px;
            }
          }
          .daily-sign-item-bottom {
          }
        }
      }
    }
  }
  .task-box {
    padding: 24px 0;
    .task-item-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .task-item-left {
        display: flex;
        align-items: center;
        gap: 12px;
        .task-item-image {
          width: 44px;
        }
        .task-text-box {
          .task-text {
            font-size: 16px;
            font-weight: 400;
            color: #fff;
          }
          .task-desc {
            font-size: 12px;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }
    }
  }
}

@media (min-width: 960px) {
  .task-drawer-box {
    ::v-deep .task-drawer {
      top: 74px !important;
      right: 24px !important;
      width: 558px !important;
      height: calc(100% - 74px - 64px) !important;
      .task-drawer-top {
        padding-bottom: 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
  }
  .col-md-15 {
    width: 20%;
    max-width: 20%;
  }
}
</style>
