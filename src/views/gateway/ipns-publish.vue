<template>
  <v-dialog v-model="showPop" max-width="600">
    <div class="pa-6 pt-5">
      <h3 class="fz-30">Publish Access</h3>
      <v-form ref="form" v-model="valid" class="mt-4">
        <template v-if="curPublishData.ttl != 0">
          <v-text-field
            persistent-placeholder
            v-model="form.value"
            label="IPFS CID"
            placeholder=""
            :rules="[(v) => !!(v || '').trim() || 'Invalid CID']"
          ></v-text-field>
        </template>
        <template v-else>
          <div class="d-flex al-c">
            <v-text-field
              class="mt-4"
              persistent-placeholder
              v-model="form.value"
              label="Upload private key and sign it"
              placeholder=""
            ></v-text-field>
            <v-btn color="primary" class="ml-4" @click="decodePrivateKey"
              >Decode</v-btn
            >
          </div>
          <decode-status
            v-if="showDecodeStatus"
            :status="decodeState"
          ></decode-status>
          <div class="mt-8 fz-14">
            <e-kv label="IPFS CID:">{{
              decodeData.cid ? decodeData.cid : "/"
            }}</e-kv>
            <e-kv class="mt-3" label="Refresh period:">{{
              decodeData.period ? decodeData.period : "/"
            }}</e-kv>
          </div>
        </template>
      </v-form>

      <div class="ta-c mt-5">
        <v-btn outlined width="100" @click="showPop = false">Cancel</v-btn>
        <v-btn
          color="primary"
          class="ml-6"
          width="100"
          @click="confirmPublish"
          :disabled="curPublishData.ttl == 0 && decodeState != 2"
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
        key: "",
      },
      curPublishData: {},
      decodeData: {
        cid: "",
        period: "",
      },
      showPop: false,
      valid: false,
      decodeState: 1,
      showDecodeStatus: false,
    };
  },
  methods: {
    show(item) {
      this.curPublishData = item;
      this.showPop = true;
      if (item.cid && item.ttl != 0) {
        this.form.value = item.cid;
      }
      this.form.key = item.key;
    },
    async decodePrivateKey() {
      try {
        this.showDecodeStatus = true;
        this.decodeState = 1;
        const { data } = await this.$http2.post("/ipns/unmarshal", {
          key: this.form.key,
          value: this.form.value,
        });
        console.log(data);
        this.decodeState = 2;
        this.decodeData.cid = data.value;
        this.decodeData.period = data.ttl;
      } catch (error) {
        console.log(error);
        this.decodeState = 3;
      }
    },
    async confirmPublish() {
      try {
        const valid = this.$refs.form.validate();
        if (!valid) return;
        const { data } = await this.$http2.put(
          `/ipns/${this.form.key}`,
          this.form
        );
        console.log(data);
        this.$toast("Publish successfully！");
        this.$emit("getList");
      } catch (error) {
        console.log(error);
        this.$toast("Publish failure！");
      }
      this.showPop = false;
    },
  },
  watch: {
    showPop(val) {
      if (!val) {
        this.$refs.form.reset();
        this.showDecodeStatus = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>