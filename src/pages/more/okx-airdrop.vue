<template>
  <div id="airDropTge">
    <div class="tge-airdrop" @scroll="onScroll">
      <nav-header :scrollTop="scrollTop"></nav-header>
      <div class="bitget-body">
        <div class="mb-6 al-c">
          <div class="pa-2 back-arrow">
            <img
              class="cursor-p"
              src="/img/airDrop/back-arrow.svg"
              width="24"
              height="24"
              @click="$router.push('/quest')"
              alt=""
            />
          </div>
          <div class="fz-20 ml-2">Go Back</div>
        </div>

        <div class="task-item d-flex mb-10">
          <div class="pa-6 task-img-wrap al-c">
            <img src="/img/airDrop/okx-airdrop.png" width="100%" alt="" />
          </div>
          <div class="pa-6 task-desc flex-1 h-flex space-btw">
            <div>
              <div class="fz-20 fw-b">
                6M $4EVER Points Giveaway with OKX Wallet
              </div>
              <div class="fz-14 mt-4">
                We're thrilled to announce our exciting collaboration with OKX
                Wallet, bringing you a chance to win a share of 6,000,000 4EVER
                Points! Join us to become one of the 10,000 lucky winners with
                this incredible opportunity!
              </div>
            </div>
            <div class="link-btn">
              <v-btn
                height="40"
                outlined
                color="#fff"
                target="blank"
                href="https://okx.com/web3/giveaway"
              >
                Understand the details
                <img
                  class="ml-1"
                  src="/img/airDrop/link.svg"
                  width="18"
                  alt=""
                />
              </v-btn>
            </div>
          </div>
        </div>

        <div class="task-box">
          <div class="task-tit">Claim Your $4EVER Points!</div>
          <div class="task-item-step pa-6 al-c space-btw">
            <div>
              <div class="task-item-step-tit fw-b">
                Claim Your Share of 6M $4EVER Points!
              </div>
              <div class="task-item-step-desc fz-12 mt-2">
                Congratulations to all winners.
              </div>
              <div class="task-item-step-reward fz-12 mt-2">
                <span>Total </span>
                <span class="task-item-step-reward-amount"
                  >6 Million Points</span
                >
              </div>
            </div>

            <div class="al-c">
              <span
                class="mr-2 fw-b"
                style="color: #039cff"
                v-show="
                  bitgetStatus1.reward && bitgetStatus1.taskStatus !== 'UNDO'
                "
                >{{ bitgetStatus1.reward }} Points</span
              >
              <v-btn
                class="claim-btn"
                color="#039cff"
                :disabled="bitgetStatus1.taskStatus !== 'CLAIM'"
                :loading="bitgetLoading1"
                @click="handleClaim1"
              >
                <img
                  v-show="bitgetStatus1.taskStatus == 'DONE'"
                  class="mr-1"
                  width="16"
                  src="/img/airDrop/checked.svg"
                  alt=""
                />
                <span class="fw-b" style="color: #fff">{{
                  bitgetStatus1.buttonName
                }}</span>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navHeader from "./components/nav-header.vue";
import { fetchTaskStatus, fetchNext } from "@/api/airdrop";

export default {
  data() {
    return {
      scrollTop: 0,
      bitgetStatus1: {
        buttonName: "Not eligible",
        taskStatus: "UNDO",
        reward: "",
      },
      bitgetLoading1: false,
    };
  },
  components: { navHeader },
  created() {
    this.getBitgetInfo();
  },
  methods: {
    onScroll(e) {
      this.scrollTop = e.target.scrollTop;
    },
    async getBitgetInfo() {
      try {
        if (!localStorage.token) return;
        const { data } = await fetchTaskStatus(6674);
        this.bitgetStatus1 = data;
      } catch (error) {
        console.log(error);
      }
    },

    async handleClaim1() {
      this.bitgetLoading1 = true;
      try {
        await fetchNext(6674);
        await this.getBitgetInfo();
      } catch (error) {
        console.log(error);
      }
      this.bitgetLoading1 = false;
    },
  },
};
</script>

<style lang="scss" scoped>
#airDropTge {
  background: #111214;
  .tge-airdrop {
    max-width: 1440px;
    height: 100vh;
    margin: 0 auto;
    overflow: scroll;
  }
  .bitget-body {
    padding: 0 48px;
    margin-top: 78px;
    color: #fff;
    .back-arrow {
      width: 24px;
      height: 24px;
      box-sizing: content-box;
      border-radius: 50%;
      background: #1a1c21;
    }
    .task-item {
      border-radius: 16px;
      background: #15171a;
      overflow: hidden;
      .task-img-wrap {
        width: 432px;
        background: #1a1c21;
      }
    }
    .link-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
}

@media screen and (max-width: 768px) {
  .bitget-body {
    padding: 0 16px !important;
  }
  .task-item {
    max-width: 100%;
    flex-direction: column;
    .task-img-wrap {
      width: 100% !important;
      padding: 12px !important;
    }
    .task-desc {
      padding: 12px !important;
    }
  }
  .link-btn {
    margin-top: 20px;
  }
}
.task-box {
  color: #fff;
  .task-tit {
    color: #fff;
    font-size: 24px;
    font-weight: 700;
  }
  .task-tips {
    color: #f1f5f9;
    font-size: 14px;
    font-weight: 400;
    margin-top: 8px;
  }

  .task-item-step {
    border-radius: 16px;
    background: #15171a;

    .task-item-step-reward-amount {
      color: #ffce56;
      font-size: 16px;
      font-weight: 700;
    }
  }
}
</style>
