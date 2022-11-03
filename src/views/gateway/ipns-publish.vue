<template>
  <v-dialog v-model="showPop" max-width="600">
    <div class="pa-6 pt-5">
      <h3 class="fz-20">Publish Access</h3>
      <v-form ref="form" v-model="valid" class="mt-4">
        <v-text-field
          persistent-placeholder
          v-model="form.value"
          label="IPFS Path"
          placeholder=""
          :rules="[(v) => !!(v || '').trim() || 'Invalid Path']"
        ></v-text-field>
        <v-select
          v-model="form.lifetime"
          :items="periodOpts"
          item-text="text"
          item-value="value"
          label="End of Life"
        >
        </v-select>
      </v-form>

      <div class="ta-c mt-5">
        <v-btn outlined width="100" @click="showPop = false">Cancel</v-btn>
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
import decodeStatus from "@/components/custom/decode-status";

export default {
  components: {
    decodeStatus,
  },
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
    };
  },
  methods: {
    show(item) {
      console.log(item);
      this.curPublishData = item;
      this.showPop = true;
      this.form.value = item.value;
      this.form.lifetime = Number(item.lifetime);
    },
    async confirmPublish() {
      this.publishLoading = true;
      try {
        const valid = this.$refs.form.validate();
        if (!valid) return;
        await this.$http2.put(
          `$ipns/names/${this.curPublishData.key}`,
          this.form
        );
        this.$toast("Publish successfully！");
        this.$emit("getList");
      } catch (error) {
        console.log(error);
        this.$alert(error.message);
      }
      this.publishLoading = false;
      this.showPop = false;
    },
  },
  watch: {
    showPop(val) {
      if (!val) {
        console.log(this.$refs.form);

        this.$refs.form.reset();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>