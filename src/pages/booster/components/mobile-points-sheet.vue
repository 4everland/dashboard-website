<template>
  <div>
    <v-bottom-sheet :value="value" @input="$emit('input', false)">
      <div class="sheet-content">
        <div class="user-card" v-show="!showLog">
          <div class="user-card-item fz-12">
            <div class="user-card-item-title d-flex justify-space-between align-center mb-2">Total $4EVER Points
              <div
                class="spin-rules d-flex  align-center fz-12"
                @click="showRule = true"
              >
                <img src="/img/booster/spin/rules-icon.svg" width="16" alt="" />
                &nbsp;Rules
              </div>
            </div>
            <div class="user-card-item-content">
              <div class="content-rate">
                <div class="d-flex align-center justify-space-between px-2">
                  <div>
                    <ICountUp
                      class="points mx-1"
                      :delay="1000"
                      :endVal="boosterInfo.totalPoint"
                      :options="{
                        useEasing: true,
                        useGrouping: true,
                        separator: ',',
                        decimal: '.',
                        prefix: '',
                        suffix: '',
                      }"
                    />
                  </div>
                  <div class="fz-14 point-right d-flex align-center" @click="handleShowLog">
                    <span>Details</span>
                    <img
                      
                      class="ml-1"
                      width="24"
                      src="/img/booster/svg/right-arrow.svg"
                      alt=""
                    />
                  </div>
                </div>
                <div class="content-rate-tips mt-1 mb-2 d-flex align-center">
                  <img src="/img/booster/airdrop.png" width="20" alt="" />
                  <span class="fz-12"
                    >$4EVER Points will be converted into $4EVER Tokens.</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="user-card-item fz-12 mt-4">
            <div class="user-card-item-title mb-2">Earning Rate</div>
            <div class="user-card-item-content user-card-item-content-total pb-2">
              <div
                class="content-rate d-flex align-center justify-space-between content-rate-total"
              >
                <div>{{ Math.ceil(totalRate) }} pts/h</div>
                <div class="user-card-more d-flex align-center justify-center"
                  @click="
                  () =>
                    this.$emit('input', false) &&
                    this.$store.dispatch('TaskDrawerToggle')
                  ">
                  <img
                      
                      class="mr-1"
                      width="16"
                      src="/img/booster/earnings/icon_plus.png"
                      alt=""
                    />
                  More
                </div>
              </div>
              <div class="content-detail pt-2 fz-12 d-flex align-center justify-start">
                <div class="content-detail-item">
                  <div>Base Rate</div>
                  <div class="rate-item">{{ baseRate }} pts/h</div>
                </div>
                <div class="mt-1">
                  <div>Boost Rate</div>
                  <div class="rate-item">+{{ boostRate }} pts/h</div>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between">
                <div class="mt-1 content-detail-item">
                  <div>Earning Rate Multiplier</div>
                  <div class="rate-item">{{ boosterInfo.rateBuff }}%</div>
                </div>
                <div class="mt-1 content-detail-item-right">
                <v-btn
                  class="staking-btn"
                  width="86"
                  height="27"
                  @click="
                    () =>
                    this.$emit('input', false) &&
                    this.$store.dispatch('HoldProveToggle')
                  "
                >
                  <img src="/img/booster/icon_tg_new.png" width="24" alt=""  style="right: -7px;top: -5px;position: absolute;" />
                  <img src="/img/booster/icon_stake_4ever.png" alt="" width="24" />
                  Staking</v-btn
                >
                </div>
              </div>
            </div>
          </div>

          <div class="user-card-item fz-12 mt-4">
            <div class="user-card-item-title">Mining Balance</div>
            <div class="mb-4"></div>
            <div v-if="!showPointsBalance" v-for="(item, index) in tokenList" :key="index">
              <div
                class="d-flex align-center justify-space-between assets-item"
                @click="showBalance(item.projectId)"
              >
                <div class="d-flex align-center" style="gap: 8px">
                  <img :src="item.logoUrl" width="40" class="projectImg" alt="" />

                  <div class="d-flex flex-column">
                    <div class="d-flex align-center">
                      <span class="fz-16">{{ item.name }}</span>
                    </div>
                    
                  </div>
                </div>
                <div class="balance-number d-flex align-center fz-14">
                      {{ Number(item.balance).toFixed(2) }}
                  <img
                    class="cursor-p"
                    src="/img/booster/svg/right-arrow.svg"
                    width="24"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <booster-pagination
              v-show="tokenList.length != 0"
              :length="totalPages2"
              class="mt-5"
              v-model="page2"
              @input="getTokenList"
            ></booster-pagination>
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
        <points-balance
          v-model="showPointsBalance"
          :projectId="projectId"
        ></points-balance>
      </div>
    </v-bottom-sheet>
    <points-rules-dialog v-model="showRule"></points-rules-dialog>
   
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { fetchPointsHistory,fetchTokenList } from "@/api/booster";
import BoosterPagination from "./booster-pagination.vue";
import pointsRulesDialog from "./points-rules-dialog.vue";
import PointsBalance from "./points-balance-history.vue";
import ICountUp from "vue-countup-v2";

export default {
  props: {
    value: {
      type: Boolean,
    },
  },
  data() {
    return {
      showLog: false,
      showRule: false,
      list: [],
      page: 1,
      totalPages: 0,
      tokenList: [],
      totalPages2: 0,
      page2: 1,
      showPointsBalance: false,
      projectId: "",
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
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },
  },
  components: {
    BoosterPagination,
    pointsRulesDialog,
    PointsBalance,
    ICountUp
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal === true) {
        this.getTokenList();
      }
    },
  },
  mounted() {
    this.getTokenList();
  },
  methods: {
    async getTokenList() {
      try {
        const { data } = await fetchTokenList('all',this.page2,this.size);
        this.tokenList = data.content;
        this.totalPages2 = data.totalPages;
      } catch (error) {
        console.log(error);
      }
    },
    showBalance(projectId) {
      this.projectId = projectId;
      this.showPointsBalance = true;
    },
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
              case "bnb_winner":
                it.log = `Vote for 4EVERLAND ${it.value} points.`;
                break;
              case "white_list_4":
                it.log = `VoteRaffle with Cellula ${it.value} points.`;
                break;
              case "spin":
                it.log = `Points Withdrew ${it.value} Points`;
                break;
              case "quest":
                it.log = it.name + it.value;
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
              case "bind_exchange_address":
                it.log = `Bind exchange to claim 4EVERLAND airdrop ${it.value} points.`;
                break;
              case "first_snapshot":
                it.log = `Airdrop Snapshot Settlement: Points reduced by ${it.value} Points.`;
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
  overflow: auto;
  .spin-rules {
    background-color: #000;
    border-radius: 100px;
    padding: 4px 12px;
    height: 24px;
    line-height: 16px;

  }
  .point-right{
    font-family: Inter;
    font-weight: 400;
  }
  .user-card-more{
    width: 78px;
    height: 32px;
    background: linear-gradient(96.98deg, #0FE1F8 -22.19%, #1102FC 99.83%);
    border-radius: 4px;
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 32px;
  }
  .rate-item {
    font-family: "DIN Alternate";
    font-size: 16px;
    color: #A4BCFD;
    font-weight: 700;
  }
  .user-card {
    .user-card-item {
      .user-card-item-content {
        padding: 8px 8px;
        background: linear-gradient(
          90deg,
          rgba(97, 114, 243, 0.5) 0%,
          rgba(97, 114, 243, 0.05) 100%
        );
        backdrop-filter: blur(2px);

        .content-rate {
          font-family: "DIN Alternate";
          font-size: 20px;
          font-weight: 700;

          .content-rate-tips {
            color: #000;
            font-family: Inter;
            font-weight: 500;
            padding: 2px 4px 2px 4px;
            border-radius: 40px;
            background: #ffe205;
          }
        }
        .content-detail-item{
          width: 50%;
        }
        .content-rate-total {
          height: 40px;
          margin: 12px 0px;
        }
        .content-detail {
          border-top: 1px solid rgba(164, 188, 253, 0.25);
        }
      }
      .user-card-item-content-total{
        padding: 4px 16px;
      }
      .user-card-item-title {
        font-size: 16px;
        font-family: Inter;
        font-weight: 500;
        text-shadow: 0px 0px 8px #6172F3;
      }
    }
    .linear-border {
      width: 100%;
      height: 1px;
      background: linear-gradient(
        to right,
        rgba(164, 188, 253, 0),
        rgba(164, 188, 253, 1) 50%
      );
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

  .concepts {
    color: #d0d5dd;

    ul,
    li {
      list-style: disc;
    }
  }
  .assets-item {
    padding-bottom: 12px;
    margin-bottom: 8px;
  }
  .balance-number {
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    color: #A4BCFD;
  }
  .projectImg {
    border-radius: 40px;
  }
  .staking-btn {
    letter-spacing: 0;
    font-style: italic;
    font-size: 12px;
    font-weight: bold;
    color: #06090F;
    border-radius: 4px;
    background: linear-gradient(155.14deg, #C0833E 9.04%, #FFDE7F 88.73%);
    position: relative;
    
  }
}
</style>
