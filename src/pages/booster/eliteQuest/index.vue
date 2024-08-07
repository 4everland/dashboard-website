<template>
  <div class="elite-quest-container">
    <div>
      <h3 class="tit">Elite Quest</h3>
      <div class="desc">
        Check the campaign details, complete the corresponding tasks, and earn
        points!
      </div>
    </div>
    <v-row class="quest-list mt-6">
      <v-col :md="3" v-for="(item, i) in quests" :key="i" class="quest">
        <div class="pa-6">
          <img :src="item.img" width="100%" alt="" />
        </div>
        <div class="pa-6 content flex-1">
          <h3 class="tit">{{ item.title }}</h3>
          <div class="desc my-3 fz-14">
            {{ item.desc }}
          </div>
          <div
            class="quest-act d-flex align-center justify-space-between fz-14"
          >
            <div class="reward">{{ item.reward }}</div>
            <div class="act-btn" @click="handleToLink(item)">
              {{ item.link ? "Let's Go" : "Claim" }}
            </div>
          </div>
        </div>
        <div></div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quests: [
        {
          img: "/img/airDrop/elite-airdrop.png",
          title:
            "Dive into the AI World with Aperture Finance, Chainbase, and 4EVERLAND!",
          desc: "Seize the opportunity to win 600 USDT and 50,000 $4EVER Points in our exclusive giveaway. Only 100 lucky winners will take home these incredible rewards.",
          reward: "Shared Reward of 600 USDT & 50,000 $4EVER Points",
          link: "https://app.galxe.com/quest/4EVERLAND/GCKdetkwbs",
        },
        {
          img: "/img/airDrop/bountyBay-airdrop.png",
          title: "100,000 $4EVER Points Giveaway with BountyBay",
          desc: "We're thrilled to announce our partnership with BountyBay and introduce an exclusive giveaway, offering the chance to win a share of 100,000 $4EVER points!",
          reward: "Shared Reward of 100,000 Points",
          path: "/quest/bountybay",
        },
        {
          img: "/img/airDrop/tp-airdrop.png",
          title: "5M $4EVER Points Giveaway with TokenPocket",
          desc: "We are delighted to share our thrilling partnership with TokenPocket, offering you the opportunity to compete for a portion of 5,000,000 4EVER Points! Don't miss the chance to be one of 10,000 winners in this amazing opportunity!",
          reward: "Shared Reward of 5 Million Points",
          path: "/quest/tp",
        },
        {
          img: "/img/airDrop/okx-airdrop.png",
          title: "6M $4EVER Points Giveaway with OKX Wallet",
          desc: "We're thrilled to announce our exciting collaboration with OKX Wallet, bringing you a chance to win a share of 6,000,000 4EVER Points! Join us to become one of the 10,000 lucky winners with this incredible opportunity!",
          reward: "Shared Reward of 6 Million Points",
          path: "/quest/okx",
        },
        {
          img: "/img/airDrop/tge-airdrop.png",
          title: "4EVERLAND - TGE Party with SPACE ID",
          desc: "Join the Pre-TGE Party with SPACE ID & 4EVERLAND to win $4EVER points and snag upcoming airdrops! 1,000 OAT holders will be randomly selected to share 500,000 $4EVER Points!",
          reward: "Shared Reward of 500,000 Points",
          path: "/quest/tge",
        },
        {
          img: "/img/airDrop/bitget-airdrop.png",
          title: "4EVERLAND Bitget GetDrop",
          desc: "GetDrop is an exclusive airdrop platform for high-quality projects within Bitget Wallet Earning Center. 4EVERLAND is thrilled to collaborate with Bitget, providing up to 5,000,000 $4EVER points in rewards.",
          reward: "Shared Reward of 5 Million Points",
          path: "/quest/bitget",
        },
        {
          img: "/img/airDrop/bnb-airdrop-activity.png",
          title: "BNB CHAIN AIRDROP ALLIANCE PROGRAM",
          desc: "The BNB Chain Airdrop Alliance Program serves as a gesture of gratitude towards the supportive BNB Chain community. Through this program, 4EVERLAND is partnering with BNB Chain to introduce exclusive rewards for retroactive users on BNB Smart Chain (BSC) and opBNB.",
          reward: "Shared Reward of 15 Million Points",
          path: "/quest/bnb",
        },
      ],
    };
  },

  methods: {
    handleToLink(item) {
      if (item.path) {
        this.$router.push(item.path);
      } else {
        window.open(item.link);
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
      }
    }
  }
}
</style>
