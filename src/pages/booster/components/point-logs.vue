<template>
  <v-menu
    offset-y
    content-class="logs-menu"
    :close-on-content-click="false"
    @input="handleInput"
  >
    <template v-slot:activator="{ on, attrs }">
      <img
        style="display: block"
        v-on="on"
        v-bind="attrs"
        srcset="/img/booster/svg/log.svg"
        width="24"
        src=""
        alt=""
      />
    </template>
    <div class="logs">
      <div class="empty text-center" v-if="!list.length">
        <img src="/img/booster/svg/empty.svg" width="200" alt="" />
        <div>Empty</div>
      </div>
      <div class="logs-content" v-else>
        <div class="log-list">
          <div
            class="log d-flex align-center justify-space-between mb-4 fz-14"
            v-for="it in list"
            :key="it.createdAt"
          >
            <div style="width: 300px; word-wrap: break-word">
              {{ it.log }}
            </div>
            <div>{{ new Date(it.createdAt * 1000).format() }}</div>
          </div>
        </div>
        <booster-pagination
          v-show="list.length != 0"
          :length="totalPages"
          class="mt-5"
          v-model="page"
          @input="onPage"
        ></booster-pagination>
      </div>
    </div>
  </v-menu>
</template>

<script>
import { fetchPointsHistory } from "@/api/booster";
import BoosterPagination from "./booster-pagination.vue";
export default {
  data() {
    return {
      page: 1,
      totalPages: 0,
      list: [],
      showLog: false,
    };
  },
  methods: {
    async getList() {
      try {
        const { data } = await fetchPointsHistory(this.page);
        if (data) {
          const list = data.content.map((it) => {
            switch (it.valueType) {
              case "initial":
                it.log = `I gained ${it.value} initial points.`;
                break;
              case "claim":
                it.log = `I collected ${it.value} points.`;
                break;
              case "activity":
                if (it.value > 0) {
                  it.log = `I won ${it.value} points in the raffle.`;
                } else {
                  it.log = `I consumed ${it.value} points for the raffle.`;
                }
                break;
              case "explorer":
                it.log = `I helped ${
                  it.explorerAddress.slice(0, 5) +
                  "..." +
                  it.explorerAddress.slice(-4)
                } collect points and received a ${it.value}-point commission.`;
                break;
              case "explored":
                it.log = `${
                  it.explorerAddress.slice(0, 5) +
                  "..." +
                  it.explorerAddress.slice(-4)
                } helped me collect ${it.value} points.`;
                break;
              case "invite":
                it.log = `I received ${it.value} points from my booster.`;
                break;
              case "(tg)Join telegram group":
                it.log = `Join Telegram group ${it.value} points.`;
                break;
              case "(tg)Subscribe telegram channel":
                it.log = `Subscribe Telegram channel ${it.value} points.`;
                break;
              case "visit_like":
                it.log = `Like @4everland_org Tweet ${it.value} points.`;
                break;
              case "visit_quote":
                it.log = `Quote the Tweet and mention 3 friends ${it.value} points.`;
                break;
              case "batching_ai":
                it.log = `Giveaway with Batching AI ${it.value} points.`;
                break;
              case "play_coco_park":
                it.log = `Play Coco Park ${it.value} points.`;
                break;
              case "play_capybara_bot":
                it.log = `Play Capybara MEME Bot ${it.value} points.`;
                break;
              case "invite_milestones_2":
                it.log = `Invite 2 new boosters ${it.value} points.`;
                break;
              case "invite_milestones_5":
                it.log = `Invite 5 new boosters ${it.value} points.`;
                break;
              case "invite_milestones_10":
                it.log = `Invite 10 new boosters ${it.value} points.`;
                break;
              case "(tg)Join Capybara Channel":
                it.log = `Join Capybara Channel ${it.value} points.`;
                break;
              case "(tg)Play Whycoin Bot":
                it.log = `Play Whycoin Bot ${it.value} points.`;
                break;
              case "(tg)Join Whycoin Channel":
                it.log = `Join Whycoin Channel ${it.value} points.`;
                break;
              case "space_id_white_list":
                it.log = `Space ID 2nd Anniversary ${it.value} points.`;
                break;
              case "(tg)Play Squirrel Legend Miner":
                it.log = `Play Squirrel Legend Miner ${it.value} points.`;
                break;
              case "(tg)Play StarAI bot":
                it.log = `Play StarAI bot ${it.value} points.`;
                break;
              case "(tg)Play Fantasy Olympics":
                it.log = `Play Fantasy Olympics ${it.value} points.`;
                break;
              case "(tg)Follow 4EVERLAND Twitter":
                it.log = `Follow 4EVERLAND Twitter ${it.value} points.`;
                break;
              case "collected":
                it.log = `Another Booster claimed your $4EVER points:-${it.value}.`;
                break;
              case "collect":
                it.log = `I just explored and snagged ${it.value} points from ${it.explorerAddress}!`;
                break;
              case "bnb_winner":
                it.log = `Vote for 4EVERLAND ${it.value} points.`;
                break;
              case "white_list_4":
                it.log = `VoteRaffle with Cellula ${it.value} points.`;
                break;
              case "quest":
                it.log = it.name + " " + it.value + " points.";
                break;
              case "white_list_5":
                it.log = `Dappbay Featured Activities: Live Guidance and Q&A! ${it.value} points.`;
                break;
              case "white_list_6":
                it.log = `Chinese AMA in the BNBCHAIN TG Group ${it.value} points.`;
                break;
              case "white_list_7":
                it.log = `Vietnamese AMA in BNBCHAIN TG Group ${it.value} points.`;
                break;
              default:
                break;
            }
            return it;
          });
          console.log(list);

          this.list = list;

          this.totalPages = data.totalPages;
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleInput(val) {
      if (val) {
        this.getList();
      }
    },
    onPage() {
      this.getList();
    },
  },
  components: {
    BoosterPagination,
  },
};
</script>

<style lang="scss" scoped>
::v-deep.logs-menu {
  height: 700px;
  border-radius: 0;
  right: 24px;
  top: 89px !important;
  left: initial !important;
}
.logs {
  position: relative;
  color: #fff;
  padding: 32px 20px;
  width: 518px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(54, 59, 64, 0.9);
  height: calc(100% - 72px - 64px - 32px) !important;
  .logs-content {
    height: 100%;
    .log-list {
      height: calc(100% - 70px);
      overflow: auto;
    }
  }
  .empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
