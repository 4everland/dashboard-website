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
      @input="handleToggle"
    >
      <v-container fluid style="padding: 24px 16px">
        <div class="drawer-title mb-6">Tools</div>

        <v-row v-show="loading">
          <v-col :cols="6" :md="4" v-for="item in 2" :key="item">
            <v-skeleton-loader
              height="240"
              dark
              type="article,list-item-two-line"
            ></v-skeleton-loader>
          </v-col>
        </v-row>

        <v-row v-show="!loading">
          <v-col
            :cols="6"
            :md="4"
            v-for="item in cardList"
            :key="item.cardName"
          >
            <ToolCard
              class="mx-auto"
              v-bind="item"
              @showBuy="handleBuy"
            ></ToolCard>
          </v-col>
        </v-row>
        <BuyCardDialog
          @getCards="getCards"
          v-model="showBuyDialog"
          v-bind="buyDialogObj"
        ></BuyCardDialog>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { fetchToolCards } from "@/api/booster";
import { mapState } from "vuex";
import ToolCard from "./tool-card.vue";
import BuyCardDialog from "./buy-card-dialog.vue";
export default {
  computed: {
    ...mapState({
      showToolDrawer: (s) => s.moduleBooster.showToolDrawer,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    cardList() {
      if (!this.types.length) {
        return [];
      }
      const cards = this.types.map((it) => {
        if (this.cards[it.name])
          return {
            ...this.cards[it.name],
            stock: it.stock == -1 ? 99 : it.stock,
            price: it.price,
            type: it.name,
          };
      });
      return cards;
    },
  },
  components: {
    ToolCard,
    BuyCardDialog,
  },
  data() {
    return {
      cards: {
        capacity: {
          cardName: "Capacity",
          cardDesc: "Capacity limit+10",
          cardImg: "/img/booster/drawer/capacity_card.png",
          price: 50000,
          stock: -1,
          buff: 10,
        },
        explore: {
          cardName: "Explore",
          cardDesc: "Explore time +1",
          cardImg: "/img/booster/drawer/explore_card.png",
          stock: 5,
          price: 50000,
          buff: 1,
        },
      },
      types: [],
      loading: false,
      showBuyDialog: false,
      buyDialogObj: {
        buyType: "",
        buyCount: 1,
        unitPrice: 50000,
        buff: 0,
      },
    };
  },
  methods: {
    async getCards() {
      this.loading = true;

      try {
        const { data } = await fetchToolCards();
        console.log(data);
        if (data && data.items) {
          this.types = data.items;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    handleToggle(val) {
      if (val) {
        this.getCards();
      } else {
        this.$store.commit("SET_TOOL_BAR", val);
      }
    },
    handleBuy({ type, count, price, buff }) {
      this.buyDialogObj = {
        buyType: type,
        buyCount: count,
        unitPrice: price,
        buff,
      };

      this.showBuyDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.tool-drawer-box {
  ::v-deep .tool-drawer {
    width: 100% !important;
    height: 80% !important;
    max-height: 100% !important;
    background-image: url("/img/booster/drawer/tools-bg.png");
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
  }
}

@media (min-width: 960px) {
  .tool-drawer-box {
    ::v-deep .tool-drawer {
      top: 74px !important;
      left: 24px !important;
      width: 558px !important;
      height: calc(100% - 74px - 64px - 24px) !important;
    }
  }
}
</style>
