<style lang="scss" scoped>
.radio-al-start {
  align-items: flex-start !important;
}
.create-type {
  color: #0b0817;
}
.private-title {
  color: #6c7789;
}
.pkey-input {
  background: #f4f6f8;
  border-radius: 2px;
}
.pkey-input > input {
  width: 100%;
  height: 100%;
  text-indent: 10px;
  font-size: 14px;
}
</style>

<template>
  <div>
    <v-btn color="primary" @click="onShow">
      <span class="fz-18">+</span>
      <span class="ml-1">Create</span>
    </v-btn>
    <v-dialog v-model="showPop" max-width="600">
      <div class="pa-6 pt-5">
        <h3 class="fz-30">Create IPNS</h3>
        <div class="pa-5" v-if="stepIdx == 0">
          <v-radio-group v-model="type" mandatory>
            <v-radio
              class="mb-4 radio-al-start"
              v-for="(it, i) in options"
              :key="i"
              :label="it.label"
              :value="it.value"
            >
              <template v-slot:label>
                <div class="fz-14">
                  <p>{{ it.label }}</p>
                  <p class="gray mt-1">
                    {{ it.tip }}
                  </p>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
          <div class="gray fz-13">
            API support is also available for managing IPNS.
            <a href="https://docs.4everland.org/">Click to learn more.</a>
          </div>
        </div>
        <template v-else>
          <div class="gray fz-13 mt-1 create-type">
            {{ options[type].label }}
          </div>
          <v-form ref="form" v-model="valid">
            <div class="pa-5">
              <v-text-field
                class="mt-4 name-input"
                persistent-placeholder
                v-model="form.name"
                label="Set a Name"
                placeholder="Set a name for your IPNS"
                counter="30"
                :rules="[
                  (v) =>
                    /^[a-z0-9A-Z]{1,30}$/.test(v) && v ? true : 'Invalid name',
                ]"
              ></v-text-field>
              <template v-if="type == 0">
                <v-text-field
                  class="mt-4"
                  persistent-placeholder
                  v-model="form.value"
                  label="IPFS CID"
                  :rules="[
                    (v) =>
                      /^[A-Za-z0-9]{46}|[A-Za-z0-9]{59}$/.test(v) || !v
                        ? true
                        : 'Invalid CID',
                  ]"
                  placeholder=""
                ></v-text-field>
                <v-select
                  class="mt-4"
                  v-model="form.ttl"
                  :items="periodOpts"
                  item-text="text"
                  item-value="value"
                  label="Time to Live"
                >
                </v-select>
              </template>
              <template v-else>
                <v-text-field
                  class="mt-4"
                  persistent-placeholder
                  v-model="form.key"
                  label="IPNS Key"
                  placeholder="IPNS"
                ></v-text-field>
                <div class="d-flex al-c">
                  <v-text-field
                    class="mt-4"
                    persistent-placeholder
                    v-model="form.value"
                    label="Upload private key and sign it"
                    placeholder="Upload base64 encoding"
                  ></v-text-field>
                  <v-btn color="primary" class="ml-4" @click="decodePrivateKey"
                    >Decode</v-btn
                  >
                </div>
                <decode-status v-if="showDecodeStatus" :status="decodeState" />
                <div class="mt-5 fz-14">
                  <e-kv label="IPFS CID:">{{ decodeData.cid }}</e-kv>
                  <e-kv class="mt-3" label="Time To Live:">{{
                    decodeData.period
                  }}</e-kv>
                </div>
              </template>
            </div>
          </v-form>
        </template>

        <div class="ta-c mt-5">
          <v-btn outlined width="180" @click="showPop = false">Cancel</v-btn>
          <v-btn
            color="primary"
            class="ml-6"
            width="180"
            @click="onNext"
            :loading="createLoading"
            >{{ stepIdx == 0 ? "Next" : "Create" }}</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import decodeStatus from "@/components/custom/decode-status";
export default {
  data() {
    return {
      showPop: false,
      type: 0,
      stepIdx: 0,
      options: [
        {
          label: "Generate an IPNS with CID.",
          tip: "We'll publish the CID and generate an IPNS.",
          value: 0,
        },
        {
          label: "Generate an IPNS by uploading the private key and signing.",
          tip: "Users can keep IPNS alive by periodically uploading the private key and signing it. ",
          value: 1,
        },
      ],
      periodOpts: [
        { text: "24h", value: 1 },
        { text: "30d", value: 2 },
        { text: "90d", value: 3 },
        { text: "180d", value: 4 },
      ],
      form: {
        name: null,
        key: "",
        value: null,
        ttl: 1,
      },
      decodeData: {
        cid: "",
        period: "",
      },
      valid: false,
      decodeState: 1,
      showDecodeStatus: false,
      createLoading: false,
    };
  },
  methods: {
    onShow() {
      this.stepIdx = 0;
      this.type = 0;
      this.showPop = true;
    },
    async decodePrivateKey() {
      try {
        this.showDecodeStatus = true;
        this.decodeState = 1;
        const { data } = await this.$http2.post("$ipns/ipns/unmarshal", {
          key: this.form.key,
          value: this.form.value,
        });
        console.log(data);
        this.decodeState = 2;
        this.decodeData.cid = data.value;
        this.decodeData.period = data.ttl;
      } catch (error) {
        this.decodeState = 3;
        console.log(error);
      }
    },
    onNext() {
      if (this.stepIdx == 0) {
        this.stepIdx = 1;
      } else {
        let valid = this.$refs.form.validate();
        console.log(valid);
        if (!valid) return;
        this.createIpns();
      }
    },
    async createIpns() {
      try {
        if (this.type != 0) {
          this.form.ttl = 0;
        }
        this.createLoading = true;
        const { data } = await this.$http2.post("$ipns/ipns", this.form);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      this.createLoading = false;
      this.showPop = false;
      this.$refs.form.reset();
      this.$emit("getList");
    },
  },
  watch: {
    showPop(newVal) {
      if (!newVal) {
        this.$refs.form.reset();
        this.form.ttl = 1;
      }
    },
  },
  components: {
    decodeStatus,
  },
};
</script>