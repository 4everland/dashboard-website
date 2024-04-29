<template>
  <div class="bnb-airdrop" ref="bnb">
    <div class="airdrop-header al-c space-btw">
      <a href="/" class="d-b">
        <img
          :src="`/img/airDrop/airdrop-logo.svg`"
          height="26"
          class="d-b m-auto"
        />
      </a>
      <v-btn type="primary">Login</v-btn>
    </div>
    <img width="100%" src="/img/airDrop/bnb-airdrop-bg.png" alt="" />

    <div class="airdrop-body">
      <div class="airdrop-intro al-c space-btw">
        <div class="airdrop-desc">
          <div class="mb-2 fw-b" style="font-size: 24px">
            4EVERLAND Elite Quest
          </div>
          <div class="fz-14">
            Welcome to the 4EVERLAND Elite Quest, your go-to destination for
            collaborative activities that reward you with 4EVERLAND Points! By
            working together with our esteemed alliance partners, we are excited
            to offer a series of enriching experiences designed to engage and
            reward our community members.
          </div>
        </div>

        <div class="airdrop-card-container">
          <div class="airdrop-card pa-6">
            <div class="card-title fw-b">MEMBERS PROFILE.</div>

            <div class="al-c space-btw">
              <div class="flex-1">
                <div class="fw-b" style="font-size: 24px">0×54...89a8</div>
                <div class="bind-type mt-3"></div>
                <div class="d-flex al-end space-btw">
                  <div>
                    <div class="fz-12">Points</div>
                    <div class="fw-b fz-20">5240</div>
                  </div>
                  <div>
                    <div class="fz-12">Points</div>
                    <div class="fw-b fz-20">5240</div>
                  </div>
                  <div>
                    <div class="fz-12">Points</div>
                    <div class="fw-b fz-20">5240</div>
                  </div>
                </div>
              </div>
              <div class="card-avatar ml-8">?</div>
            </div>
          </div>
        </div>
      </div>

      <div class="airdrop-task mt-10">
        <div class="fw-b" style="font-size: 24px">Campaigns</div>
        <div class="mt-2 fz-14">
          Check the campaign details, complete the corresponding tasks, and earn
          points!
        </div>
        <div class="task-list mt-6">
          <div class="task-item al-c">
            <div class="pa-6 task-img-wrap">
              <img
                src="/img/airDrop/bnb-airdrop-activity.png"
                height="192"
                alt=""
              />
            </div>
            <div class="pa-6 task-desc">
              <div class="fz-20 fw-b">BNB CHAIN AIRDROP ALLIANCE PROGRAM</div>
              <div class="fz-14 mt-4">
                The BNB Chain Airdrop Alliance Program serves as a gesture of
                gratitude towards the supportive BNB Chain community. Through
                this program, 4EVERLAND is partnering with BNB Chain to
                introduce exclusive rewards for retroactive users on BNB Smart
                Chain (BSC) and opBNB.
              </div>
              <div class="mt-auto al-c space-btw">
                <div class="reward fz-20 fw-b">5 million points reward</div>
                <v-btn color="primary">Let's Go </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {},
};
</script>

<style lang="scss" scoped>
.bnb-airdrop {
  width: 100vw;
  min-height: 100vh;
  background: #000;
  .airdrop-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 12px 48px;
    background: #111214;
  }
  .airdrop-body {
    background: #111214;
    color: #fff;
    padding: 0px 48px;
    .airdrop-intro {
      padding: 12px 0 64px 0;
      border-bottom: 1px solid #3a3d43;
      .airdrop-desc {
        flex: 1;
      }
      .airdrop-card-container {
        position: relative;
        width: 433px;
        .airdrop-card {
          width: 433px;
          position: absolute;
          top: -120px;
          width: 100%;
          height: 200px;
          background: url("/img/airDrop/airdrop-card.png") no-repeat 100%;

          .card-title {
            font-size: 28px;
          }
          .card-avatar {
            width: 88px;
            height: 88px;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #3a3d43;
          }
        }
      }
    }

    .task-list {
      .task-item {
        .task-img-wrap {
          border-radius: 16px;
          background: #1a1c21;
        }

        .reward {
          color: #ffce56;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .airdrop-header {
    padding: 12px 16px !important;
  }
  .airdrop-body {
    padding: 0px 16px !important;
  }
  .airdrop-intro {
    flex-direction: column;
    .airdrop-card {
      margin-top: 16px;
      position: static !important;
    }
  }
  .task-item {
    max-width: 100%;
    flex-direction: column;
    .task-img-wrap {
      width: 100%;
      padding: 12px !important;
      img {
        width: 100%;
      }
    }
    .task-desc {
      padding: 12px !important;
    }
  }
}
</style>
