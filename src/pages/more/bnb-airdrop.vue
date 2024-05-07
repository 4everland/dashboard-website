<template>
  <div id="airDropBnb">
    <div class="bnb-airdrop" @scroll="onScroll">
      <nav-header :scrollTop="scrollTop"></nav-header>
      <div class="bnb-body">
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
            <img
              src="/img/airDrop/bnb-airdrop-activity.png"
              width="100%"
              alt=""
            />
          </div>
          <div class="pa-6 task-desc flex-1 h-flex space-btw">
            <div>
              <div class="fz-20 fw-b">BNB CHAIN AIRDROP ALLIANCE PROGRAM</div>
              <div class="fz-14 mt-4">
                Introducing the BNB Chain Airdrop Alliance Program, tailored for
                retroactive users on BSC and opBNB! Get set to enjoy the
                benefits!
              </div>
            </div>
            <div class="link-btn">
              <v-btn
                height="40"
                outlined
                color="#fff"
                target="blank"
                href="https://medium.com/4everland/up-for-grabs-15-000-000-4ever-points-allocated-for-the-bnb-chain-airdrop-alliance-program-192a0153de9a"
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
        <bnb-task />
      </div>
    </div>
  </div>
</template>

<script>
import BnbTask from "./components/bnb/bnb-task.vue";
import navHeader from "./components/nav-header.vue";
export default {
  data() {
    return {
      scrollTop: 0,
    };
  },
  components: { BnbTask, navHeader },
  methods: {
    onScroll(e) {
      this.scrollTop = e.target.scrollTop;
    },
  },
};
</script>

<style lang="scss" scoped>
#airDropBnb {
  background: #111214;
  .bnb-airdrop {
    max-width: 1440px;
    height: 100vh;
    margin: 0 auto;
    overflow: scroll;
  }
  .bnb-body {
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
      justify-content: end;
    }
  }
}

@media screen and (max-width: 768px) {
  .bnb-body {
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
</style>
