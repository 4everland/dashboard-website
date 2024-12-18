<template>
  <div class="elite-quest-container">
    <div>
      <div class="d-flex align-center">
        <img
          src="/img/booster/svg/back-arrow.svg"
          width="24"
          class="mr-1"
          alt=""
          v-if="asMobile"
          @click="$router.push('/boost')"
        />
        <h3 class="tit">Elite Quest</h3>
      </div>
      <div class="desc">
        Check the campaign details, complete the corresponding tasks, and earn
        points!
      </div>
    </div>
    <v-row class="quest-list mt-6" v-if="!boostLocked">
      <v-col :md="3" v-for="(item, i) in quests" :key="i" class="quest">
        <div class="pa-6">
          <img :src="item.image" width="100%" alt="" />
        </div>
        <div class="pa-6 content flex-1">
          <h3 class="tit">{{ item.title }}</h3>
          <div class="desc my-3 fz-14">
            {{ item.desc }}
          </div>
          <div
            class="quest-act d-flex align-center justify-space-between fz-14"
          >
            <div class="reward">{{ item.rewardStr }}</div>
            <div
              class="act-btn"
              :class="{ disabled: status(item) == 'Ended' }"
              @click="handleClaim(item)"
            >
              {{ status(item) }}
            </div>
          </div>
        </div>
        <div></div>
      </v-col>
    </v-row>
    
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { fetchEliteQuest, claimEliteQuest } from "@/api/booster";
export default {
  computed: {
    ...mapGetters([
      "boostLocked",
    ]),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    status() {
      return function ({ endAt, state }) {
        if (endAt && endAt < +new Date() / 1000 && state == 0) return "Ended";
        if (state == 0) return "Let's Go";
        if (state == 1) return "Claim";
        if (state == 2) return "Ended";
      };
    },
    isTgMiniApp() {
      return Object.keys(this.$tg.initDataUnsafe).length > 0;
    },

  },
  data() {
    return {
      quests: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      if(this.boostLocked) {
        this.$router.push("/boost");
        return
      } 
      try {
        const { data } = await fetchEliteQuest();
        console.log(data);
        this.quests = data;
      } catch (error) {
        console.log(error);
      }
    },

    async handleClaim(it) {
      try {
        if (it.endAt && it.endAt < +new Date() / 1000 && it.state == 0) return;
        if (it.state == 0) {
          if (this.isTgMiniApp) {
            this.$tg.openAuto(it.link);
          } else {
            this.asMobile ? (location.href = it.link) : window.open(it.link);
          }
        }
        if (it.state == 1) {
          const { data } = await claimEliteQuest(it.id);
          console.log(data);
          this.getList();
          this.$store.dispatch("getBoosterUserInfo");
          this.$toast2("Claim Successfully!");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .quest-list {
    gap: 12px;
  }
}
.elite-quest-container {
  padding: 96px 24px;
  background: #000;
  position: relative;
  width: 100%;
  height: 100%;
  .tit {
    font-size: 24px;
  }
  .desc {
    color: rgba(255, 255, 255, 0.6);
  }
  .quest-list {
    .quest {
      display: flex;
      flex-direction: column;

      height: 600px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      .content {
        display: flex;
        flex-direction: column;
        border-top: 1px solid rgba(255, 255, 255, 0.25);
        .tit {
          font-size: 18px;
        }
        .desc {
          color: #f1f5f9;
          line-height: 23.8px; /* 170% */
        }
      }
      .quest-act {
        margin-top: auto;
        .reward {
          color: #ffce56;
        }
        .act-btn {
          white-space: nowrap;
          padding: 6px 18px;
          border-radius: 4px;
          background: linear-gradient(97deg, #0fe1f8 -22.19%, #1102fc 99.83%);
          box-shadow: 0px 6px 8px 0px rgba(0, 50, 228, 0.4);
          cursor: pointer;
        }
        .act-btn.disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
