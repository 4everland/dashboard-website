<style lang="scss">
.referral-header {
  .title {
    font-size: 20px;
    color: #54576a;
    line-height: 23px;
  }
  ul,
  li {
    padding: 0;
    margin: 0;
  }
  .overview {
    box-sizing: border-box;
    font-size: 16px;
    color: #889ab3;
    .overview-list {
      width: 100%;
      .overview-item {
        width: 50%;
        display: flex;
        flex-direction: column;
        .num {
          font-size: 36px;
          color: #0b0817;
          line-height: 43px;
        }
      }
    }
  }
  .referral-link {
    .share-icon {
      cursor: pointer;
    }
    .share-icon + .share-icon {
      margin-left: 12px;
    }
    .share-input {
      flex: 1;
      padding: 9px 16px;
      color: #0b0817;
      line-height: 22px;
      border-radius: 2px;
      border: 1px solid #889ab3;
    }
    .share-link {
      color: #0b0817;
      line-height: 22px;
    }
    .share-btn {
      min-width: 155px;
      height: 48px;
      line-height: 48px;
      margin-left: 10px;
      color: #ffffff;
      text-align: center;
      border: 1px solid #889ab3;
      background: #775da6;
      border-radius: 2px;
      cursor: pointer;
    }
  }
  .overview,
  .referral-link {
    padding: 29px 33px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 0 6px rgb(205 205 205 / 50%);
  }
}

.refer-header {
  background: #2b0c74 url(https://static1.4everland.org/bg/referral-bg1.png)
    no-repeat;
  background-size: 100%;
  // .wrap-1 {
  //   background: url(/img/bg/user/refer-2.png) no-repeat 90% center;
  //   background-size: contain;
  // }
}
.refer-qr-img {
  right: 15px;
  bottom: 36px;
  $size: 53px;
  width: $size;
  height: $size;
}
.page-refer {
  table {
    border-spacing: 0;
    font-size: 15px;
    thead {
      background: #fafbfc;
    }
    tbody {
      font-size: 14px;
    }
    td {
      padding: 10px;
    }
    tr:nth-child(even) {
      background: #f9fbfc;
    }
  }
}
</style>

<template>
  <div class="page-refer">
    <iframe :src="frameSrc" frameborder="0" class="d-n"></iframe>
    <v-row class="referral-header al-c">
      <v-col md="5">
        <div class="overview">
          <h3 class="title pb-7">Overview</h3>
          <ul class="d-flex overview-list">
            <li class="overview-item">
              <span>Total Referrals</span>
              <span class="num">{{ overviewData.total }}</span>
            </li>
            <li class="overview-item">
              <span>Today Referrals</span>
              <span class="num">{{ overviewData.today }}</span>
            </li>
          </ul>
        </div>
      </v-col>
      <v-col md="7">
        <div class="referral-link flex-1">
          <div
            class="
              referral-link-header
              d-flex
              align-center
              justify-space-between
              mb-11
            "
          >
            <h3 class="title">Referrals Link</h3>
            <ul class="al-c">
              <li v-for="it in mLinks" :key="it.label" class="share-icon">
                <img
                  :src="`img/svg/drawer/social/${it.label.toLocaleLowerCase()}.svg`"
                  width="30"
                  @click="sharePlatForm(it.label)"
                />
              </li>
            </ul>
          </div>

          <div class="share-content al-c">
            <div class="share-input al-c line-1">
              <div class="pr-5 share-link line-1">{{ shareUrl }}</div>

              <v-btn
                icon
                small
                v-clipboard="shareUrl"
                @success="$toast('Copied to clipboard !')"
              >
                <img src="img/svg/copy.svg" width="12" />
              </v-btn>
            </div>
            <div class="share-btn" @click="onInvite">Invite Friend</div>
          </div>
        </div>
      </v-col>
    </v-row>
    <!-- referral table -->
    <div class="main-wrap mt-5">
      <div class="d-flex al-c">
        <span>Referrals details</span>
        <v-btn icon small class="ml-2" @click="getList" :loading="loading">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>
      <div>
        <div class="ov-a mt-5 bd-1b ov-h">
          <table class="w100p ta-c" style="min-width: 260px">
            <thead>
              <tr>
                <td>#</td>
                <td>Account</td>
                <td>CreatedAt</td>
              </tr>
            </thead>
            <tbody class="op-9">
              <tr v-for="(it, i) in list" :key="i">
                <td>{{ 1 + i }}</td>
                <td>{{ it.invitee }}</td>
                <td>{{ new Date(it.createdAt).format() }}</td>
              </tr>
            </tbody>
          </table>
          <div class="mt-15" v-if="!list.length">
            <e-empty :loading="loading">
              {{ loading ? "Loading..." : "No Referrals Now" }}
            </e-empty>
          </div>
        </div>

        <div class="mt-6" v-if="total > 1">
          <v-pagination
            @input="onPage"
            v-model="page"
            :length="pageLen"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            :total-visible="7"
          ></v-pagination>
        </div>
      </div>
    </div>

    <!-- share Img -->
    <v-dialog v-model="popInvite" max-width="450" v-if="code">
      <e-dialog-close @click="popInvite = false" />
      <div class="pd-30 mt-2">
        <div v-show="isBgLoad">
          <div class="d-flex f-center al-c">
            <div class="mt-3 bd-1 pos-r">
              <div class="pos-r" ref="imgWrap">
                <img
                  @load="isBgLoad = true"
                  src="img/bg/user/refer-share.png"
                  style="width: 220px"
                  class="ev-n"
                />
                <img v-if="qrImg" :src="qrImg" class="pos-a refer-qr-img" />
              </div>
              <div class="pos-mask share-img-wrap" v-if="shareImg">
                <img :src="shareImg" class="w100p" />
              </div>
            </div>
          </div>

          <div class="mt-5 gray ta-c" v-if="isTouch">
            Long press for Preservation
          </div>
          <div v-else class="mt-10 ta-c">
            <v-btn color="primary" @click="onSaveImg">Preservation</v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as clipboard from "clipboard-polyfill/text";
import html2canvas from "html2canvas";
import canvas2image from "@/plugins/canvas2image";
import qrcode from "qrcode";

export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    ...mapState({
      userInfo: (s) => s.userInfo,
      isTouch: (s) => s.isTouch,
      isFocus: (s) => s.isFocus,
    }),
    shareUrl() {
      return location.origin + "/#/?invite=" + this.code;
    },
    pageLen() {
      return Math.ceil(this.total / 10);
    },
  },
  data() {
    return {
      frameSrc: "",
      code: null,
      list: [],
      page: 1,
      total: 0,
      loading: false,
      popInvite: false,
      sharePre:
        "I am participating in 4EVERLAND  First Landing event. Deploying projects to win your share of 50 million 4EVER, come and join here: ",
      copyTxt: "",
      isBgLoad: false,
      qrImg: "",
      shareImg: "",
      mLinks: [
        {
          url: "https://twitter.com/4everland_org",
          label: "Twitter",
        },
        {
          url: "https://t.me/org_4everland",
          label: "Telegram",
        },
        {
          url: "https://discord.com/invite/4everland",
          label: "Discord",
        },
        {
          url: "https://4everland.medium.com/",
          label: "FaceBook",
        },
      ],
      overviewData: {
        today: "--",
        total: "--",
      },
    };
  },
  created() {
    this.getCode();
    this.getList();
  },
  watch: {
    userInfo() {
      this.getCode();
    },
    async code() {
      this.copyTxt = this.sharePre + this.shareUrl;
      const url = await qrcode.toDataURL(this.shareUrl);
      this.qrImg = url;
    },
    isBgLoad() {
      console.log("load");
      setTimeout(() => {
        this.genImg();
      }, 300);
    },
  },
  methods: {
    onPage(curPage) {
      this.page = curPage;
      this.getList();
    },
    async onCopy() {
      try {
        await clipboard.writeText(this.shareUrl);
        this.$toast("Copied to clipboard !");
      } catch (error) {
        this.$toast("Copied fail");
      }
    },
    onCopied() {
      this.$toast("Copied to clipboard !");
      this.popInvite = false;
    },
    onSaveImg() {
      this.genImg("save");
    },
    async genImg(act) {
      try {
        const el = this.$refs.imgWrap;
        let canvas = document.createElement("canvas");
        const scale = 3;
        const width = el.offsetWidth * scale;
        const height = el.offsetHeight * scale;
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.getContext("2d").scale(scale, scale);
        canvas = await html2canvas(el, {
          canvas,
          width,
          height,
          scale,
        });
        // console.log(canvas);
        if (act == "save") {
          canvas2image.saveAsImage(
            canvas,
            width,
            height,
            "jpeg",
            "4everland-" + this.code
          );
        }
        const img = canvas2image.convertToJPEG(canvas, width, height);
        this.shareImg = img.src;
      } catch (error) {
        console.log(error);
        this.$toast("fail to generate share image");
      }
    },
    onInvite() {
      if (!this.code) return;
      this.popInvite = true;
    },
    async getCode() {
      this.code = this.userInfo.inviteCode;
      if (this.code) return;
      const { data } = await this.$http2.get("$auth/invitation/code/");
      this.code = data;
    },

    async getOverview() {
      try {
        const dateStamp = new Date(new Date().toLocaleDateString()).getTime();
        const { data } = await this.$http.get("$auth/invitation/overview", {
          params: { startAt: dateStamp },
        });
        this.overviewData = data;
      } catch (error) {}
    },

    async getList() {
      try {
        await this.getOverview();
        this.loading = true;
        const { data } = await this.$http2.get(`$auth/invitation/${this.page}`);
        this.list = data.list;
        this.total = data.total;
      } catch (error) {
        //
      }
      this.loading = false;
    },
    openFrame(src, name) {
      this.frameSrc = src;
      setTimeout(() => {
        this.frameSrc = "";
        if (this.isFocus) this.$toast(name + " not installed");
      }, 300);
    },
    sharePlatForm(platForm) {
      switch (platForm) {
        case "Twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=Come join @4everland_org and explore infinite possibilities with products designed for sophisticated and dynamic&url=${encodeURIComponent(
              this.shareUrl
            )}  &hashtags=Tech,IPFS,decentralized,Storage`
          );
          break;
        case "Discord":
          this.openFrame("discord://", "Discord");
          break;
        case "Telegram":
          this.openFrame("tg://", "Telegram");
          break;
        case "FaceBook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              location.origin + "/index.html/#/?invite=" + this.code
            )}`
          );
          break;
        default:
          break;
      }
    },
  },
};
</script>