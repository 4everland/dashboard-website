<template>
  <div>
    <v-bottom-sheet :value="value" @input="$emit('input', false)">
      <div class="sheet-content">
        <div class="user-card" v-show="!showLog">
          <div class="user-card-item fz-12">
            <div class="user-card-item-title">Total $4EVER points</div>
            <div class="linear-border mb-1"></div>
            <div class="user-card-item-content">
              <div
                class="content-rate d-flex align-center justify-space-between"
              >
                <img src="/img/booster/svg/union.svg" width="52" alt="" />
                <div>
                  <span>{{ boosterInfo.totalPoint }}</span>
                  <img
                    @click="handleShowLog"
                    class="ml-1"
                    width="16"
                    src="/img/booster/svg/log.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="user-card-item fz-12 mt-2">
            <div class="user-card-item-title">Earning Rate</div>
            <div class="linear-border mb-1"></div>
            <div class="user-card-item-content">
              <div
                class="content-rate d-flex align-center justify-space-between"
              >
                <img src="/img/booster/svg/union.svg" width="52" alt="" />
                <div>{{ Math.ceil(totalRate) }} pts/h</div>
              </div>
              <div class="content-detail pt-2 fz-12">
                <div class="d-flex align-center justify-space-between">
                  <span>Base Rate</span>
                  <span>{{ baseRate }} pts/h</span>
                </div>
                <div class="d-flex align-center justify-space-between mt-1">
                  <span>Boost Rate</span>
                  <span>+{{ boostRate }} pts/h</span>
                </div>
                <div class="d-flex align-center justify-space-between mt-1">
                  <span>Staking Yield</span>
                  <span>{{ boosterInfo.rateBuff }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="showLog">
          <img
            class="mb-4"
            src="/img/booster/svg/back-arrow.svg"
            width="24"
            alt=""
            @click="showLog = false"
          />

          <div class="log-list">
            <div class="empty text-center" v-if="!list.length">
              <img src="/img/booster/svg/empty.svg" width="150" alt="" />
              <div>Empty</div>
            </div>
            <div v-else>
              <div
                class="log-item mb-6 d-flex align-center justify-space-between fz-12"
                v-for="(it, i) in list"
                :key="i"
              >
                <div style="word-wrap: break-word; width: 230px">
                  {{ it.log }}
                </div>
                <div>
                  {{ new Date(it.createdAt * 1000).format() }}
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
        </div>
      </div>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { fetchPointsHistory } from "@/api/booster";
import BoosterPagination from "./booster-pagination.vue";

export default {
  props: {
    value: {
      type: Boolean,
    },
  },
  data() {
    return {
      showLog: false,
      list: [],
      page: 1,
      totalPages: 0,
    };
  },
  computed: {
    ...mapState({
      boosterInfo: (s) => s.moduleBooster.boosterInfo,
    }),
    ...mapGetters(["boostLocked", "baseRate", "boostRate"]),
    totalRate() {
      return (
        (this.baseRate + this.boostRate) * (1 + this.boosterInfo.rateBuff / 100)
      );
    },
  },
  components: {
    BoosterPagination,
  },
  methods: {
    async handleShowLog() {
      this.showLog = true;
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

              default:
                break;
            }
            return it;
          });
          this.list = list;
          this.totalPages = data.totalPages;
        }
      } catch (error) {
        console.log(error);
      }
    },
    onPage() {
      this.handleShowLog();
    },
  },
};
</script>

<style lang="scss" scoped>
.sheet-content {
  height: 600px;
  padding: 24px 16px;
  color: #fff;
  background: linear-gradient(0deg, #4c5277 0%, #4c5277 100%),
    linear-gradient(
      180deg,
      rgba(57, 59, 62, 0.9) 25.52%,
      rgba(36, 39, 42, 0.9) 100%
    );
  background-blend-mode: overlay, normal;
  backdrop-filter: blur(19.75px);

  .user-card {
    .user-card-item {
      .user-card-item-content {
        padding: 4px 16px;
        background: linear-gradient(
          90deg,
          rgba(97, 114, 243, 0.05) 0%,
          rgba(97, 114, 243, 0.5) 100%
        );
        backdrop-filter: blur(2px);

        .content-rate {
          font-family: "DIN Alternate";
          font-size: 20px;
          font-weight: 700;
        }
        .content-detail {
          border-top: 1px solid rgba(164, 188, 253, 0.25);
        }
      }
    }
  }

  .log-list {
    position: relative;
    height: 500px;
    font-size: 14px;
    overflow: auto;
    .empty {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
