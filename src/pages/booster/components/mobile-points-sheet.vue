<template>
  <div>
    <v-bottom-sheet v-model="sheet">
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
            <div class="user-card-item-title">Current Production Rate</div>
            <div class="linear-border mb-1"></div>
            <div class="user-card-item-content">
              <div
                class="content-rate d-flex align-center justify-space-between"
              >
                <img src="/img/booster/svg/union.svg" width="52" alt="" />
                <div>{{ Math.ceil(totalRate) }}/H</div>
              </div>
              <div class="content-detail pt-2 fz-12">
                <div class="d-flex align-center justify-space-between">
                  <span>Base Production Rate</span>
                  <span>{{ baseRate }}/H</span>
                </div>
                <div class="d-flex align-center justify-space-between mt-1">
                  <span>Boost Production Rate</span>
                  <span>+{{ boostRate }}/H</span>
                </div>
                <div class="d-flex align-center justify-space-between mt-1">
                  <span>Staking Weight</span>
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
                class="log-item mb-6 d-flex align-center justify-space-between"
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
  data() {
    return {
      sheet: false,
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
                it.log = `I collect ${it.value} points.`;
                break;
              case "activity":
                if (it.value > 0) {
                  it.log = `I won ${it.value} points in the raffle.`;
                } else {
                  it.log = `I consumed ${it.value} points for the raffle.`;
                }
                break;
              case "explorer":
                it.log = `I helped ${it.explorerAddress} collect points and received a ${it.value}-point commission.`;
                break;
              case "explored":
                it.log = `${it.explorerAddress} helped me collect ${it.value} points.`;
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
