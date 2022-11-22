<template>
  <v-dialog v-model="showPop" max-width="600">
    <div class="pa-6 pt-5">
      <h3 class="fz-20">Publish Access</h3>
      <v-form ref="form" v-model="valid" class="mt-4">
        <div class="mt-10">
          <v-text-field
            class="post-input"
            persistent-placeholder
            dense
            autofocus
            v-model="form.value"
            :placeholder="
              cidType == 1 ? 'Enter the IPFS CID' : 'Enter the IPNS'
            "
            :rules="[
              (v) => {
                return v ? true : 'Invalid Path';
              },
            ]"
          >
            <template #prepend>
              <v-select
                label="IPFS Path"
                class="post-input"
                dense
                v-model="cidType"
                :items="cidTypeOpts"
                item-text="text"
                item-value="value"
              >
              </v-select>
            </template>
          </v-text-field>
        </div>
        <div class="mt-5">
          <v-select
            class="post-input mt-5"
            dense
            v-model="form.lifetime"
            :items="periodOpts"
            item-text="text"
            item-value="value"
            label="End of Life"
          >
          </v-select>
        </div>
      </v-form>
      <div class="ta-c mt-5">
        <v-btn outlined width="100" @click="handleCancel">Cancel</v-btn>
        <v-btn
          color="primary"
          class="ml-6"
          width="100"
          @click="confirmPublish"
          :loading="publishLoading"
          >Publish</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {
        value: "",
        lifetime: 1,
      },
      curPublishData: {},
      showPop: false,
      valid: false,
      publishLoading: false,
      periodOpts: [
        { text: "24h", value: 1 },
        { text: "30d", value: 30 },
        { text: "90d", value: 90 },
        { text: "180d", value: 180 },
      ],
      cidType: 1,
      cidTypeOpts: [
        { text: "IPFS", value: 1 },
        { text: "IPNS", value: 2 },
      ],
    };
  },
  methods: {
    show(item) {
      this.curPublishData = item;
      this.showPop = true;
      if (item.value) {
        if (/^\/ipfs\//.test(item.value)) {
          this.cidType = 1;
        } else {
          this.cidType = 2;
        }

        this.form.value = item.value.replace(/^(\/ipfs\/)|(\/ipns\/)/, "");
      }
      this.form.lifetime = Number(item.lifetime);
    },
    async confirmPublish() {
      // console.log(this.form.value);
      try {
        const valid = this.$refs.form.validate();
        if (!valid) return;
        this.publishLoading = true;
        await this.$http2.put(`$ipns/names/${this.curPublishData.key}`, {
          value: (this.cidType == 1 ? "/ipfs/" : "/ipns/") + this.form.value,
          lifetime: this.form.lifetime,
        });
        this.$toast("Publish successfully！");
        this.$emit("getList");
      } catch (error) {
        console.log(error);
        this.$alert(error.message);
      }
      this.publishLoading = false;
      this.showPop = false;
    },
    handleCancel() {
      this.$refs.form.reset();
      this.showPop = false;
    },
  },
  watch: {
    showPop(val) {
      if (!val) {
        this.$refs.form.reset();
        setTimeout(() => {
          this.cidType = 1;
        }, 500);
        this.publishLoading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.post-input .v-input__prepend-outer {
  margin: 0 !important;
  margin-right: 5px !important;
  width: 100px !important;
}
</style>
<style lang="scss" scoped>
.post-input {
  font-size: 14px !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.post-input .v-input__prepend-outer::v-deep {
  margin: 0 !important;
}
</style>
