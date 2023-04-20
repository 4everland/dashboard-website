<template>
  <div class="register-share-container pos-a">
    <v-dialog v-model="showDialog" max-width="1000" hide-overlay>
      <div class="share-container pos-r">
        <div class="pos-a share-content">
          <div class="wallet-input line-1 fz-14 gray">
            {{ userInfo.username }}
          </div>
          <div class="fz-14 mt-6 white-0">
            Congratulations on successfully minting 4EVERLAND's on-chain
            identity Enjoy more resources and enter the decentralized world of
            Web3
          </div>
          <div class="ta-c mt-3">
            <v-btn color="primary" @click="handleShare">Share</v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
    <e-animation-flowers ref="flowers"></e-animation-flowers>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      showDialog: false,
      code: null,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    shareUrl() {
      return location.origin + "?invite=" + this.code;
    },
  },
  created() {
    this.getCode();
  },
  watch: {
    userInfo() {
      this.getCode();
    },
    showDialog(val) {
      if (val) {
        this.$refs.flowers.showAnimation();
      }
    },
  },
  methods: {
    handleShare() {
      window.open(
        `https://twitter.com/intent/tweet?text=The %23Web3 product journey has begun for me at @4everland_org, and I have received free resources to help me along the way.%0A%0AThe best way to explore Web3 is to experience its products. Join us today and start your Web3 journey.%0A%0A✅${encodeURIComponent(
          this.shareUrl
        )}%0A&hashtags=IPFS,Arweave,Dfinity`
      );
    },
    async getCode() {
      if (!localStorage.token) return;
      this.code = this.userInfo.inviteCode;
      if (this.code) return;
      const { data } = await this.$http.get("$auth/invitation/code/");
      this.code = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.register-share-container {
  left: 0;
  top: 0;
  height: 100vh;
  width: 100%;
  pointer-events: none;
}
.share-container {
  background: url("/img/bg/share/share_bg.png") center/cover no-repeat;
  height: 500px;
  width: 100%;
  .share-content {
    left: 50%;
    top: 50%;
    width: 400px;
    transform: translate(-50%, -50%);
  }
  .wallet-input {
    width: 350px;
    padding: 10px;
    margin: 50px auto 0;
    border-radius: 6px;
    background: #fff;
  }
}
</style>