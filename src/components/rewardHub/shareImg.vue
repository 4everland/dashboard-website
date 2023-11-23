<template>
  <div>
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
                  src="/img/bg/user/refer-share.png"
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
            <v-btn color="primary" @click="onSaveImg">Download</v-btn>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import html2canvas from "html2canvas";
import canvas2image from "@/plugins/canvas2image";
import qrcode from "qrcode";
export default {
  computed: {
    ...mapState({
      isTouch: (s) => s.isTouch,
      code: (s) => s.code,
    }),
    shareUrl() {
      return location.origin + "?invite=" + this.$store.state.code;
    },
  },
  data() {
    return {
      popInvite: false,
      isBgLoad: false,
      qrImg: "",
      shareImg: "",
    };
  },
  mounted() {},
  watch: {
    async code() {
      const url = await qrcode.toDataURL(this.shareUrl);
      this.qrImg = url;
    },
    isBgLoad() {
      setTimeout(() => {
        this.genImg();
      }, 300);
    },
  },
  methods: {
    onShow() {
      this.popInvite = true;
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
  },
};
</script>

<style lang="scss" scoped>
.refer-qr-img {
  right: 15px;
  bottom: 36px;
  $size: 53px;
  width: $size;
  height: $size;
}
</style>
