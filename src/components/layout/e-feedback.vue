<template>
  <v-dialog eager v-model="showPop" max-width="650">
    <div class="pa-6">
      <h3 class="mb-8">{{ title }}</h3>

      <v-text-field
        prepend-icon="mdi-email"
        class="mt-2"
        outlined
        persistent-placeholder
        v-model.trim="form.email"
        label="Email"
        placeholder="Your email"
      />
      <v-select
        label="Type"
        prepend-icon="mdi-label"
        class="mt-2"
        outlined
        persistent-placeholder
        v-model="form.feedbackType"
        :items="typeList"
      />
      <v-text-field
        v-if="form.feedbackType == 'BUG'"
        prepend-icon="mdi-wallet"
        class="mt-1 mb-4"
        outlined
        persistent-placeholder
        v-model.trim="form.ethAddress"
        label="Wallet Address"
        placeholder="Your wallet address"
        hint="Please enter your eth wallet address otherwise may not receive rewards"
        persistent-hint
      />
      <v-textarea
        prepend-icon="mdi-note-text-outline"
        outlined
        persistent-placeholder
        v-model="form.description"
        rows="3"
        label="Description"
        :placeholder="descHint"
      />
      <e-upload-img v-model="files" />

      <div class="ta-c mt-5">
        <v-btn outlined width="90" @click="showPop = false">Cancel</v-btn>
        <v-btn class="ml-6" color="primary" :loading="loading" @click="onSubmit"
          >Submit</v-btn
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
      typeList: ["BUG", "FEEDBACK"],
      form: {
        email: "",
        ethAddress: "",
        description: "",
        feedbackType: "FEEDBACK",
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
        let type = "FEEDBACK";
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