<template>
  <div class="register-share-container pos-a">
    <v-dialog v-model="showDialog" max-width="800" hide-overlay class="ov-h">
      <div class="share-container pos-r ov-h">
        <div class="bg pos-a"></div>
        <div class="pos-a close-btn cursor-p" @click="showDialog = false"></div>
        <div class="share-info pos-a">
          <h2 class="share-title">
            Congratulations on Minting Your On-chain Standard Identity
          </h2>
          <div class="fz-14 mt-3">
            {{ userInfo.username }}
          </div>
          <div class="mt-12">
            <h3 class="fz-18">- Unlock new benefits -</h3>
            <div class="d-flex flex-wrap">
              <div
                class="d-flex al-c pa-2"
                v-for="item in items"
                :key="item.name"
                style="width: 50%"
              >
                <img height="50" :src="item.img" alt="" />
                <span class="fz-12 ml-3">{{ item.name }}</span>
              </div>
            </div>
          </div>
          <div class="d-flex justify-center mt-10">
            <v-btn
              color="primary"
              width="300"
              min-width="80"
              class="btn"
              @click="handleStart"
              >START BENEFIT
            </v-btn>
            <v-btn
              color="primary"
              class="btn share-btn ml-4"
              outlined
              width="120"
              @click="handleShare"
              >SHARE

              <img
                height="10"
                class="ml-2"
                src="/img/svg/rewardHub/share_icon.svg"
                alt=""
              />
            </v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      showDialog: false,
      code: null,
      items: [
        {
          img: "/img/svg/rewardHub/web31.svg",
          name: "Web3 Identity",
        },
        {
          img: "/img/svg/rewardHub/ownership1.svg",
          name: "Ownership of data",
        },
        {
          img: "/img/svg/rewardHub/enhanced1.svg",
          name: "Enhanced product functionalities",
        },
        {
          img: "/img/svg/rewardHub/fee_resource1.svg",
          name: "Access to additional free resources",
        },
      ],
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
        // this.$refs.flowers.showAnimation();
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
    async getCode() {
      if (!localStorage.token) return;
      this.code = this.userInfo.inviteCode;
      if (this.code) return;
      const { data } = await this.$http.get("$auth/invitation/code/");
      this.code = data;
    },
    handleStart() {
      this.showDialog = false;
      this.$router.push("/overview");
    },
  },
};
</script>

<style lang="scss" scoped>
.register-share-container {
  left: 0;
  top: 0;
  width: 100%;
  pointer-events: none;
}
.share-container {
  width: 100%;
  height: 500px;
  .close-btn {
    right: 20px;
    top: 20px;
    width: 40px;
    height: 40px;
    padding: 10px;
    border: 1px solid rgba(140, 140, 161, 0.25);
    border-radius: 50%;
  }
  .close-btn::after {
    content: "";
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: url("/img/svg/close_icon.svg") no-repeat;
    background-size: 100%;
    width: 16px;
    height: 16px;
  }
  .bg {
    left: 0;
    top: 0;
    width: 60%;
    height: 100%;
    background: url("/img/bg/share/reward-share.png") no-repeat;
    background-size: 100%;
  }
  .share-info {
    padding: 10px;
    width: 480px;
    right: 40px;
    top: 60px;
    .share-title {
      color: #735ea1;
      font-size: 25px;
      line-height: 35px;
    }
  }
  .btn {
    font-size: 12px;
  }
  .share-btn {
    color: #000 !important;
    border-color: rgba(140, 140, 161, 0.25) !important;
  }
}
.row-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
