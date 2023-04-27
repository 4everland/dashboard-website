<template>
  <div class="register-share-container pos-a">
    <v-dialog v-model="showDialog" max-width="1000" hide-overlay class="ov-h">
      <div class="share-container pos-r">
        <div class="pos-a share-content">
          <div class="white-0 ta-c fz-22">Congratulations</div>
          <div class="white-0 ta-c fz-18">
            Mint Your on-chain Standard Identity
          </div>
          <div class="wallet-input line-1 fz-14 gray ta-c">
            {{ userInfo.username }}
          </div>
        </div>
        <img
          class="pos-a cursor-p"
          style="right: 20px; top: 20px"
          width="20"
          src="/img/svg/rewardHub/share_icon.svg"
          alt=""
          @click="handleShare"
        />
      </div>
      <div style="background: #f7f9fb" class="py-10">
        <h3 class="ta-c fz-22">- Unlock new benefits -</h3>
        <div class="al-c mb-5">
          <div
            class="al-c flex-column pa-5"
            v-for="item in items"
            :key="item.name"
            style="width: 25%"
          >
            <img height="60" :src="item.img" alt="" />
            <span class="mt-6 ta-c fz-14">{{ item.name }}</span>
          </div>
        </div>
        <div class="d-flex justify-center">
          <v-btn
            color="primary"
            max-width="300"
            width="300"
            min-width="80"
            @click="handleStart"
            >Start Benefit
          </v-btn>
        </div>
      </div>
    </v-dialog>
    <!-- <e-animation-flowers ref="flowers"></e-animation-flowers> -->
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
          img: "/img/svg/rewardHub/web3.svg",
          name: "Web3 Identity",
        },
        {
          img: "/img/svg/rewardHub/ownership.svg",
          name: "Ownership of data",
        },
        {
          img: "/img/svg/rewardHub/enhanced.svg",
          name: "Enhanced product functionalities",
        },
        {
          img: "/img/svg/rewardHub/fee_resource.svg",

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
    handleStart() {
      this.$router.push("/overview");
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
  background: url("/img/bg/share/share_bg.png") center/contain no-repeat;
  height: 390px;
  width: 100%;
  .share-content {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .wallet-input {
    width: 350px;
    padding: 10px;
    margin: 30px auto 0;
    border-radius: 6px;
    background: #fff;
  }
}
.row-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>