<style lang="scss">
.qr-img {
  right: 10px;
  bottom: 10px;
  $size: 50px;
  width: $size;
  height: $size;
}
</style>

<template>
  <div class="act-invite">
    <v-dialog v-model="popInvite" max-width="450" v-if="code">
      <e-dialog-close @click="popInvite = false" />
      <div class="pd-30 mt-2">
        <div class="fz-14">
          <span>{{ sharePre }}</span>
          <span class="d-ib fz-13">
            <a :href="shareUrl" target="_blank">{{ shareUrl }}</a>
            <v-icon size="14" class="pa-1 hover-1 ml-2" @click="onCopy"
              >mdi-content-copy</v-icon
            >
          </span>
        </div>
        <div v-show="isBgLoad">
          <div class="d-flex f-center al-c">
            <div class="mt-3 bd-1 pos-r">
              <div class="pos-r" ref="imgWrap">
                <img
                  @load="isBgLoad = true"
                  src="https://static1.4everland.org/bg/act/act-share.png"
                  style="width: 200px"
                  class="ev-n"
                />
                <img v-if="qrImg" :src="qrImg" class="pos-a qr-img" />
              </div>
              <div class="pos-mask share-img-wrap" v-if="shareImg">
                <img :src="shareImg" class="w100p" />
              </div>
            </div>
          </div>

          <div class="mt-5 gray ta-c" v-if="isTouch">Long press to save</div>
          <div v-else class="mt-10 ta-c">
            <v-btn color="primary" @click="onSaveImg">Save Image</v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
    <div class="mt-10 d-flex al-c">
      <h3 class="pd-20 pr-2">My Invites</h3>
      <e-tooltip right max-width="300" v-if="tip">
        <v-icon slot="ref" color="#ddd" size="14" class="pa-1 d-ib mt-1"
          >mdi-help-circle-outline</v-icon
        >
        <span v-html="tip"></span>
      </e-tooltip>
      <span class="ml-auto gray fz-14">
        Valid invites: {{ totalEffective }}
      </span>
    </div>
    <div class="ov-a bg-white bdrs-5 bd-1b ov-h">
      <table class="w100p ta-c" style="min-width: 260px">
        <thead>
          <tr>
            <td>#</td>
            <td>E-mail</td>
            <td>CreatedAt</td>
            <td>Deployed</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody class="op-9">
          <tr v-for="(it, i) in list" :key="i">
            <td>{{ 1 + i }}</td>
            <td>{{ it.email }}</td>
            <td>{{ new Date(it.inviteAt).format() }}</td>
            <td>
              <act-e-link no-copy :domain="it.domain" />
            </td>
            <td>
              {{ it.valid ? "valid" : "invalid" }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pt-15 pb-15 ta-c" v-if="!list.length">
        <div class="gray fz-14 mt-5">No developers invited</div>
        <v-btn
          v-if="actStatus == 1"
          color="primary"
          :loading="!code"
          class="pl-6 pr-6 mt-5"
          @click="onInvite"
        >
          <v-icon size="18" class="mr-2">mdi-account-plus-outline</v-icon>
          <span>Invite Developers now</span>
        </v-btn>
      </div>
    </div>
    <div class="mt-6" v-if="pageLen > 1">
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
</template>

<script>
import { mapState } from "vuex";
import * as clipboard from "clipboard-polyfill/text";
import html2canvas from "html2canvas";
import canvas2image from "@/plugins/canvas2image";
import qrcode from "qrcode";

export default {
  props: {
    tip: String,
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      actStatus: (s) => s.actStatus,
      isTouch: (s) => s.isTouch,
    }),
    shareUrl() {
      return location.origin + "?invite=" + this.code;
    },
  },
  data() {
    return {
      code: null,
      list: [],
      page: 1,
      pageLen: 1,
      loading: false,
      popInvite: false,
      sharePre:
        "I am participating in 4EVERLAND  First Landing event. Deploying projects to win your share of 50 million 4EVER, come and join here: ",
      copyTxt: "",
      isBgLoad: false,
      qrImg: "",
      shareImg: "",
      totalEffective: 0,
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
    onPage() {
      this.getList();
    },
    async onCopy() {
      try {
        await clipboard.writeText(this.copyTxt);
        this.$toast("Copied!");
      } catch (error) {
        this.$toast("Copied fail");
      }
    },
    onCopied() {
      this.$toast("Copied!");
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
    async onInvite() {
      if (!this.code) return;
      this.popInvite = true;
    },
    async getCode() {
      this.code = this.userInfo.inviteCode;
      if (this.code) return;
      const { data } = await this.$http2.get("/invite/code");
      this.code = data;
    },
    async getList() {
      try {
        this.loading = true;
        const params = {
          page: this.page - 1,
          size: 10,
        };
        const { data } = await this.$http2.get("/invite/list", {
          params,
        });
        // console.log(data);
        this.list = data.page || [];
        this.totalEffective = data.totalEffective;
        this.pageLen = Math.max(1, Math.ceil(data.total / params.size));
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>