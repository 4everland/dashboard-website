<template>
  <div>
    <v-dialog v-model="showPop" max-width="800">
      <e-dialog-close @click="showPop = false" />
      <div class="pos-r">
        <h2 class="ta-c pd-15 fz-18">
          {{ steps[curStep].title }}
        </h2>
      </div>
      <div class="pd-10-20">
        <v-window v-model="curStep">
          <v-window-item :value="i" v-for="(it, i) in steps" :key="i">
            <div
              :ref="'con' + i"
              style="max-height: 50vh"
              class="ov-a bd-1 pd-20 fz-14"
            >
              <div v-html="getHtml(it.con)"></div>
            </div>
          </v-window-item>
        </v-window>
        <div class="mt-1 ml-2">
          <v-tooltip v-model="showTip" top>
            <template v-slot:activator="{ on, attrs }">
              <v-checkbox
                v-bind="attrs"
                v-on="on"
                v-model="isAgree"
                label="I have read carefully and agree to the above terms and conditions"
              ></v-checkbox>
            </template>
            <span>Please check the box and click confirm</span>
          </v-tooltip>
        </div>
        <div class="mt-2 ta-c pd-15">
          <v-btn
            color="primary"
            :disabled="downSec > 0"
            :loading="loading"
            @click="onConfirm"
          >
            <span v-html="btnTxt"></span>
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import TermTxt from "../../plugins/config/term";
import PrivacyTxt from "../../plugins/config/privacy";

export default {
  data() {
    return {
      showPop: false,
      isAgree: false,
      curStep: 0,
      steps: [
        {
          title: "Term Of Service",
          con: TermTxt,
        },
        {
          title: "Privacy Policy",
          con: PrivacyTxt,
        },
      ],
      loading: false,
      downSec: 0,
      showTip: false,
    };
  },
  computed: {
    noticeMsg() {
      return this.$store.state.noticeMsg;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    btnTxt() {
      if (this.downSec > 0) {
        return `Confirm after <b class="red-1">${this.downSec}</b> seconds`;
      }
      return "Confirm";
    },
  },
  watch: {
    isAgree(val) {
      if (val) this.showTip = false;
    },
    showPop(val) {
      if (val) this.downSec = 5;
      else {
        this.curStep = 0;
        this.downSec = 0;
      }
    },
    downSec(val, oldVal) {
      if (val > oldVal) {
        clearInterval(this.timing);
        this.timing = setInterval(() => {
          if (this.downSec > 0) this.downSec -= 1;
          else clearInterval(this.timing);
        }, 1e3);
      }
    },
    // noticeMsg({ name }) {
    //   if (name == "onInit") {
    //     this.checkStorage();
    //   }
    // },
  },
  methods: {
    onConfirm() {
      if (!this.isAgree) {
        this.showTip = true;
        return;
      }
      if (this.curStep == 0) {
        this.curStep = 1;
        this.downSec = 5;
        this.isAgree = false;
        const el = this.$refs.con1;
        if (el) el.scrollTo(0, 0);
      } else {
        this.addStorage();
      }
    },
    getHtml(con) {
      return con
        .split(/\n/)
        .map((txt) => {
          return `<p class="mt-2">${txt}</p>`;
        })
        .join("");
    },
    async addStorage() {
      try {
        this.loading = true;
        await this.$http2.post("/bill/pay", {
          storage: 40,
          amount: 50,
          pay: 0,
        });
        await this.$sleep();
        this.loading = false;
        this.showPop = false;
        let html =
          "In the Beta version, you can get a few free resources for depolyment .";
        html +=
          '<ul class="mt-4"><li>100GB Bandwidth</li><li>4GB Storage</li><li>250 Build Minutes</li></ul>';
        this.$alert(html, "Welcome to 4EVERLAND HOSTING.", {
          type: "success",
        }).then(() => {
          this.$router.push("/new");
        });
      } catch (error) {
        //
      }
      this.loading = false;
    },
    async checkStorage() {
      console.log("check stoarge");
      // if (Date.now) return (this.showPop = true);
      const skey = "got_storage_" + localStorage.token.substr(-5);
      if (localStorage[skey]) {
        return;
      }
      try {
        this.$loading();
        const { data } = await this.$http2.get("/bill/history");
        this.$loading.close();
        if (data.content.length) {
          localStorage[skey] = 1;
          return;
        }
        this.showPop = true;
        return true;
      } catch (error) {
        console.log(error);
      }
      return false;
    },
  },
};
</script>