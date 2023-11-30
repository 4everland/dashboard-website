<template>
  <v-dialog v-model="showDialog" content-class="claim-dialog" max-width="920">
    <div class="share-container pos-r">
      <div class="pos-a congratulations">Congratulations!</div>
      <div class="share-info ml-auto">
        <div class="share-title ta-c">
          <div class="text fw-b">
            You have successfully activated your account.
          </div>
          <div class="mt-4">
            {{ userInfo.username }}
          </div>
        </div>

        <div class="d-flex justify-center mt-10">
          <div
            class="al-c justify-center share-btn cursor-p"
            v-ripple
            @click="handleShare"
          >
            <span class="mr-1 fz-14 fw-b">Share</span>
            <img src="/img/svg/new-user-activity/share.svg" width="16" alt="" />
          </div>
          <div
            class="flex-1 al-c justify-center start-btn ml-6 cursor-p"
            v-ripple
            @click="handleStart"
          >
            <span class="mr-1 fz-14 fw-b">Start Benefit</span>
            <img
              src="/img/svg/new-user-activity/right-circle.svg"
              width="16"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      showDialog: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      code: (s) => s.code,
    }),
    shareUrl() {
      return location.origin + "?invite=" + this.$store.state.code;
    },
  },
  watch: {
    showDialog(val) {
      if (val) {
        this.$flowersAnimation();
      }
    },
  },
  methods: {
    handleShare() {
      window.open(
        `https://twitter.com/intent/tweet?text=I successfully minted my on-chain identity on 4EVERLAND and received an additional 5GB of IPFS storage, 100MB of Arweave storage, 100GB of bandwidth, and 250 build minutes. Join and experience it now! %0A%0A${encodeURIComponent(
          this.shareUrl
        )}`
      );
    },
    handleStart() {
      this.showDialog = false;
      this.$router.push("/overview");
    },
  },
};
</script>

<style>
.v-dialog {
  overflow: initial !important;
}
</style>
<style lang="scss" scoped>
.register-share-container {
  left: 0;
  top: 0;
  width: 100%;
  pointer-events: none;
}
.share-container {
  padding: 40px;
  background: url("/img/bg/share/reward-share.png") no-repeat;
  .congratulations {
    top: -14px;
    right: 40px;
    font-size: 32px;
    font-weight: bold;
    color: #fff;
    border-radius: 4px;
    background: #fe69c7;
    padding: 32px 24px 16px 24px;
  }

  .share-info {
    width: 560px;
    .share-title {
      padding: 104px 0px 54px 0px;
      .text {
        color: #735ea1;
        font-size: 32px;
        line-height: 35px;
      }
    }
  }
  .btn {
    font-size: 12px;
  }
  .share-btn {
    width: 216px;
    padding: 16px 0;
    border-radius: 8px;
    border: 1px solid #735ea1;
    color: #735ea1;
  }
  .start-btn {
    border-radius: 8px;
    background: #735ea1;
    color: #fff;
  }
}
.row-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
