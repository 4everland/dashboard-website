<template>
  <v-dialog eager v-model="showPop" max-width="650">
    <div class="px-15 py-8">
      <h3 class="mb-8" style="font-size: 30px">{{ title }}</h3>
      <!-- prepend-icon="mdi-email" -->
      <div>
        <p class="al-c">
          <v-icon>mdi-email</v-icon>
          <span class="ops-item ml-2">Email</span>
        </p>
        <v-text-field
          class="mt-2 feed-input"
          solo
          dense
          filled
          persistent-placeholder
          v-model.trim="form.email"
          label="Email"
          placeholder="Your email"
        />
      </div>
      <div>
        <p class="al-c">
          <v-icon>mdi-label</v-icon>
          <span class="ops-item ml-2">Type</span>
        </p>
        <v-select
          label="Type"
          class="mt-2 feed-input"
          dense
          filled
          solo
          persistent-placeholder
          v-model="form.feedbackType"
          :items="typeList"
        />
      </div>

      <div v-if="form.feedbackType == 'BUG'">
        <p class="al-c">
          <v-icon>mdi-wallet</v-icon>
          <span class="ops-item ml-2">Wallet Address</span>
        </p>
        <v-text-field
          class="mt-1 mb-4 feed-input"
          dense
          filled
          solo
          persistent-placeholder
          v-model.trim="form.ethAddress"
          label="Wallet Address"
          placeholder="Your wallet address"
          hint="Please enter your eth wallet address otherwise may not receive rewards"
          persistent-hint
        />
      </div>
      <div>
        <p class="al-c">
          <v-icon>mdi-label</v-icon>
          <span class="ops-item ml-2">Description</span>
        </p>
        <!-- <v-textarea
          filled
          solo
          persistent-placeholder
          v-model="form.description"
          rows="3"
          label="Description"
        /> -->

        <v-text-field
          class="mt-2 feed-input"
          solo
          dense
          filled
          persistent-placeholder
          v-model="form.description"
          label="Description"
          :placeholder="descHint"
        />
      </div>
      <e-upload-img v-model="files" />

      <div class="ta-c mt-5">
        <v-btn
          color="primary"
          tile
          width="120"
          :loading="loading"
          @click="onSubmit"
          >Reback</v-btn
        >
        <v-btn class="ml-6" tile outlined width="120" @click="showPop = false"
          >Cancel</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      noticeMsg: (s) => s.noticeMsg,
    }),
  },
  data() {
    return {
      showPop: false,
      title: "Feedback",
      typeList: ["BUG", "PAY", "OPINION", "OTHER"],
      form: {
        email: "",
        ethAddress: "",
        description: "",
        feedbackType: "",
      },
      files: [],
      fileList: [],
      loading: false,
      descHint: "",
    };
  },
  watch: {
    noticeMsg({ name, data }) {
      if (name == "feedback" && !this.showPop) {
        this.showPop = true;
        this.title = data ? data.label : "Feedback";
        let type = "BUG";
        let hint = "Your feedback";
        if (/bug/i.test(this.title)) {
          type = "BUG";
          hint = "Your report for bug";
        } else if (/report/i.test(this.title)) {
          type = "REPORT";
          hint = "Your report";
        }
        // console.log(type);
        this.form.feedbackType = type;
        this.descHint = hint + " ...";
      }
    },
    showPop(val) {
      if (val) {
        this.form.email = this.userInfo.email;
        this.form.description = "";
        this.form.ethAddress = "";
        this.files = [];
      }
    },
  },
  methods: {
    async onSubmit() {
      const body = { ...this.form };
      let msg = "";
      if (!this.$regMap.email.test(body.email)) {
        msg = "Invalid Email";
      } else if (body.ethAddress && !this.$regMap.eth.test(body.ethAddress)) {
        msg = "Invalid Wallet Address";
      } else if (!body.description) {
        msg = "No Description";
      } else if (body.description.length > 1e4) {
        msg = "Description: 10000 chars at maximum";
      }
      if (msg) {
        return this.$toast(msg);
      }

      const form = new FormData();
      for (const key in body) {
        form.append(key, body[key]);
      }
      for (const file of this.files) {
        form.append("files", file);
      }
      try {
        this.loading = true;
        await this.$http2.post("/feedback/upload", form);
        this.$toast("Your feedback is received.", 1);
        this.showPop = false;
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>
<style >
.ops-item {
  color: #6c7789;
}
.feed-input .v-input__slot {
  background: #f7f7f7 !important;
  border-radius: 2px;
  box-shadow: none !important;
}
</style>
<style lang="scss" scoped>
</style>