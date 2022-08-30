<template>
  <div v-show="dialogFormVisible" id="Airdrop">
    <div class="airdrop-con box_36 flex-col">
      <div class="block_30 flex-col">
        <span class="text_67">FREE RESOURCE ALERT</span>
        <div
          class="block_31 flex-row"
          :class="airDropData.type == 1 ? 'justify-start' : 'justify-between'"
        >
          <template v-for="(item, index) in items">
            <div class="group_27 flex-col" v-if="item.value" :key="index">
              <div class="text-wrapper_17 flex-col justify-between">
                <span class="text_68">{{ item.name }}</span>
                <span class="text_69">{{ item.value }}</span>
              </div>
              <img :src="item.icon" alt="" class="icon" />
            </div>
          </template>
          <div class="partner" v-if="airDropData.type == 1">
            <span>From</span>
            <img :src="airDropData.pic" alt="" />
          </div>
        </div>
        <span class="paragraph_9"
          >Welcome to 4EVERLAND, and congratulations on getting free resources
          from 4EVERLAND,including
          <span v-if="items[0].value"> {{ items[0].value }} IPFS storage,</span>
          <span v-if="items[1].value">
            {{ items[1].value }} Arweave storage,</span
          >
          <span v-if="items[3].value"> {{ items[3].value }} bandwidth,</span>
          <span v-if="items[2].value">
            and {{ items[2].value }} build minutes.</span
          >
          In addition, you can get 5GB extra IPFS storage by sharing 4EVERLAND
          on Twitter.
          <div>{{ airDropData.extra }}</div>
          Enjoy your time at 4EVERLAND!</span
        >
        <div
          class="block_32 flex-row"
          :class="airDropData.canShare ? 'justify-between' : 'justify-center'"
        >
          <div class="text-wrapper_21 flex-col" @click="cancel">
            <span class="text_77">OK</span>
          </div>
          <div
            class="box_38 flex-col"
            v-if="airDropData.canShare"
            @click="share"
          >
            <div class="block_33 flex-row justify-between">
              <img
                class="label_6"
                referrerpolicy="no-referrer"
                src="img/airDrop/twitter.png"
                alt=""
              />
              <span class="text_78">Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    shareUrl() {
      return location.origin + "/?invite=" + this.code;
    },
  },
  data() {
    return {
      code: null,
      dialogFormVisible: false,
      popupImage: "",
      items: [
        {
          name: "IPFS Storage",
          value: null,
          icon: require("/public/img/airDrop/ipfs.png"),
        },
        {
          name: "Arweave Storage",
          value: null,
          icon: require("/public/img/airDrop/ar.png"),
        },
        {
          name: "Build Minutes",
          value: null,
          icon: require("/public/img/airDrop/minutes.png"),
        },
        {
          name: "Recharge Balance",
          value: null,
          icon: require("/public/img/airDrop/balance.png"),
        },
      ],
      airDropData: {},
    };
  },
  mounted() {
    this.getCode();
  },
  methods: {
    getAirDrop(data) {
      this.airDropData = data;
      if (data.ipfs != 0) {
        this.items[0].value = this.conver(data.ipfs);
      }
      if (data.ar != 0) {
        this.items[1].value = this.conver(data.ar);
      }
      if (data.buildTime != 0) {
        this.items[2].value = data.buildTime / 60 + "Min";
      }
      if (data.traffic != 0) {
        this.items[3].value = this.conver(data.traffic);
      }
      this.dialogFormVisible = true;
    },
    cancel() {
      this.dialogFormVisible = false;
    },
    share() {
      this.$http.post("$auth/events/airdrop/share");
      window.open(`https://twitter.com/intent/tweet?text=💠The &hashtags=Web3 product journey has begun for me at @4everland_org, and I have received free resources to help me along the way.
      🚀The best way to explore Web3 is to experience its products. Join us today and start your Web3 journey.
      ✅${encodeURIComponent(this.shareUrl)}`);
      this.cancel();
    },
    async getCode() {
      if (this.code) return;
      const { data } = await this.$http2.get("$auth/invitation/code");
      this.code = data;
    },
    conver(limit) {
      let size = "";
      if (limit < 0.1 * 1024) {
        size = limit.toFixed(2) + "B";
      } else if (limit < 0.1 * 1024 * 1024) {
        size = (limit / 1024).toFixed(2) + "KB";
      } else if (limit < 0.1 * 1024 * 1024 * 1024) {
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
      } else {
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }

      let sizestr = size + "";
      let len = sizestr.indexOf("\.");
      let dec = sizestr.substr(len + 1, 2);
      if (dec == "00") {
        //当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
      }
      return sizestr;
    },
  },
};
</script>
<style lang="scss" scoped>
#Airdrop {
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99999999;
  background-color: rgba(33, 33, 33, 0.45);
  .airdrop-con {
    background-color: #fff;
    position: absolute;
    left: 0;
    right: 0;
    top: -60px;
    bottom: 0;
    margin: auto;
  }
}
.flex-row {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.justify-start {
  justify-content: flex-start;
}
.justify-center {
  justify-content: center;
}
.box_36 {
  width: 920px;
  height: 470px;
  border-radius: 10px;
  position: relative;
  opacity: 1;
}

.block_30 {
  width: 840px;
  height: 397px;
  margin: 22px 0 0 40px;
}

.text_67 {
  width: 348px;
  height: 36px;
  display: inline-block;
  overflow-wrap: break-word;
  color: rgba(11, 8, 23, 1);
  font-size: 30px;
  font-family: Helvetica, "Microsoft YaHei", Arial, sans-serif;
  white-space: nowrap;
  line-height: 36px;
  text-align: left;
}

.block_31 {
  width: 840px;
  height: 110px;
  margin-top: 51px;
}

.group_27 {
  height: 110px;
  border-radius: 10px;
  border: 1px solid rgba(208, 218, 233, 1);
  background-color: rgba(249, 251, 252, 1);
  width: 195px;
  position: relative;
  .icon {
    width: 40px;
    position: absolute;
    left: 28px;
    top: -20px;
  }
}

.text-wrapper_17 {
  width: 88px;
  height: 53px;
  margin: 38px 0 0 28px;
}

.text_68 {
  width: 86px;
  height: 16px;
  display: inline-block;
  overflow-wrap: break-word;
  color: rgba(137, 137, 137, 1);
  font-size: 14px;
  font-family: Helvetica, "Microsoft YaHei", Arial, sans-serif;
  white-space: nowrap;
  line-height: 14px;
  text-align: left;
  margin-left: 2px;
}

.text_69 {
  width: 34px;
  height: 29px;
  display: inline-block;
  overflow-wrap: break-word;
  color: rgba(16, 13, 88, 1);
  font-size: 24px;
  font-family: Helvetica, "Microsoft YaHei", Arial, sans-serif;
  white-space: nowrap;
  line-height: 29px;
  text-align: left;
  margin-top: 8px;
}
.partner {
  display: flex;
  align-items: center;
  span {
    color: #0b0817;
    font-size: 18px;
    margin: 0 28px;
  }
  img {
    width: 195px;
    height: 110px;
    border-radius: 10px;
  }
}
.paragraph_9 {
  width: 818px;
  height: 104px;
  display: inline-block;
  overflow-wrap: break-word;
  color: rgba(108, 119, 137, 1);
  font-size: 14px;
  font-family: ArialMT;
  line-height: 26px;
  text-align: left;
  margin: 28px 0 0 6px;
}

.block_32 {
  width: 420px;
  height: 40px;
  margin: 28px 0 0 210px;
}

.text-wrapper_21 {
  height: 40px;
  border-radius: 2px;
  border: 1px solid rgba(119, 93, 166, 1);
  background-color: rgba(255, 255, 255, 1);
  width: 200px;
  cursor: pointer;
}

.text_77 {
  width: 27px;
  height: 25px;
  display: inline-block;
  overflow-wrap: break-word;
  color: rgba(119, 93, 166, 1);
  font-size: 18px;
  white-space: nowrap;
  line-height: 25px;
  text-align: left;
  margin: 7px 0 0 87px;
}

.box_38 {
  height: 40px;
  border-radius: 2px;
  background-color: rgba(119, 93, 166, 1);
  width: 200px;
  cursor: pointer;
}

.block_33 {
  width: 86px;
  height: 23px;
  margin: 9px 0 0 60px;
}

.label_6 {
  width: 28px;
  height: 23px;
}

.text_78 {
  width: 49px;
  height: 22px;
  display: inline-block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
  white-space: nowrap;
  line-height: 22px;
  text-align: left;
}
</style>
