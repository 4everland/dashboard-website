<template>
  <div class="tool-drawer-box">
    <v-navigation-drawer
      class="tool-drawer"
      :absolute="!asMobile"
      :fixed="asMobile"
      bottom
      temporary
      :hide-overlay="!asMobile"
      color="#1E2234"
      :value="showToolDrawer"
      @input="(val) => $store.commit('SET_TOOL_BAR', val)"
    >
      <v-container fluid style="padding: 24px 16px">
        <v-row>
          <v-col :cols="4" v-for="item in cardList" :key="item.cardName">
            <ToolCard v-bind="item"></ToolCard>
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import ToolCard from "./tool-card.vue";
export default {
  computed: {
    ...mapState({
      showToolDrawer: (s) => s.moduleBooster.showToolDrawer,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  components: {
    ToolCard,
  },
  data() {
    return {
      cardList: [
        {
          cardName: "Capacity",
          cardDesc: "Capacity limit+10",
          cardImg: "/img/booster/drawer/capacity_card.png",
          maxCount: 99,
          minCount: 0,
          unitPrice: 50000,
        },
        {
          cardName: "Explore",
          cardDesc: "Explore time +1",
          cardImg: "/img/booster/drawer/explore_card.png",
          maxCount: 5,
          minCount: 0,
          unitPrice: 50000,
        },
        {
          cardName: "Explore",
          cardDesc: "Explore time +1",
          cardImg: "/img/booster/drawer/explore_card.png",
          maxCount: 5,
          minCount: 0,
          unitPrice: 50000,
        },
      ],
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.tool-drawer-box {
  ::v-deep .tool-drawer {
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
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tool-drawer-top {
      // border-bottom: 1px solid rgba(255, 255, 255, 0.3);

      .daily-sign {
        margin-top: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .daily-sign-box {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: auto;
          .daily-sign-item {
            .daily-sign-item-top {
              display: flex;
              width: 44px;
              padding: 5px 8px 4px 6px;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 4px;
              border-radius: 100px;
              opacity: 0.8;
              background: rgba(97, 114, 243, 0.1);
              .point {
                color: #6172f3;
                text-align: center;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
              }
              img {
                width: 24px;
                height: 24;
              }
            }
            .daily-sign-item-bottom {
              font-size: 12px;
              opacity: 0.6;
              text-align: center;
              margin-top: 6px;
            }
          }
          .daily-signed {
            .daily-sign-item-top {
              opacity: 1;
              background: rgba(255, 255, 255, 0.1);

              .point {
                color: #fff;
              }
            }
            .daily-sign-item-bottom {
              opacity: 1;
            }
          }
          .daily-today {
            .daily-sign-item-top {
              opacity: 1;
              background: #6172f3;

              .point {
                color: #fff;
              }
            }
            .daily-sign-item-bottom {
              opacity: 1;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 960px) {
  .tool-drawer-box {
    ::v-deep .tool-drawer {
      top: 74px !important;
      left: 24px !important;
      width: 558px !important;
      height: calc(100% - 74px - 64px - 24px) !important;
      .tool-drawer-top {
        padding-bottom: 24px;
        // border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
  }
  .col-md-15 {
    width: 20%;
    max-width: 20%;
  }
}
</style>
