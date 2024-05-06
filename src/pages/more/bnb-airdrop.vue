<template>
  <div id="airDropBnb">
    <div class="container">
      <nav-header></nav-header>
      <div class="bnb-body mb-10">
        <div class="mb-6 al-c">
          <div class="pa-2 back-arrow">
            <img
              class="cursor-p"
              src="/img/airDrop/back-arrow.svg"
              width="24"
              height="24"
              @click="$router.back()"
              alt=""
            />
          </div>
          <div class="fz-20 ml-2">Go Back</div>
        </div>

        <div class="task-item d-flex">
          <div class="pa-6 task-img-wrap">
            <img
              src="/img/airDrop/bnb-airdrop-activity.png"
              width="100%"
              alt=""
            />
          </div>
          <div class="pa-6 task-desc flex-1">
            <div class="fz-20 fw-b">BNB CHAIN AIRDROP ALLIANCE PROGRAM</div>
            <div class="fz-14 mt-4">
              Introducing the BNB Chain Airdrop Alliance Program, tailored for
              retroactive users on BSC and opBNB! Get set to enjoy the benefits!
            </div>
            <div class="mt-10 link-btn">
              <v-btn
                outlined
                color="#fff"
                target="blank"
                href="https://www.baidu.com"
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
      </div>
      <bnb-task />
    </div>
  </div>
</template>

<script>
import BnbTask from "./components/bnb/bnb-task.vue";
import navHeader from "./components/nav-header.vue";
export default {
  components: { BnbTask, navHeader },
};
</script>

<style lang="scss" scoped>
#airDropBnb {
  background: #111214;
  .container {
    height: 100vh;
  }

  .bnb-body {
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
}
</style>
