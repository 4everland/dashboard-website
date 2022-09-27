<style lang="scss">
.radio-al-start {
  .v-radio {
    align-items: flex-start;
  }
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
        <h3>Create IPNS</h3>
        <div class="pa-5" v-if="stepIdx == 0">
          <v-radio-group v-model="type" mandatory class="radio-al-start">
            <v-radio
              class="mb-4"
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
          <div class="gray fz-13 mt-1">
            {{ options[type].label }}
          </div>
          <div class="pa-5">
            <v-text-field
              persistent-placeholder
              v-model="form.name"
              label="Set a Name"
              placeholder="Set a name for your IPNS"
            ></v-text-field>
            <template v-if="type == 0">
              <v-text-field
                persistent-placeholder
                v-model="form.cid"
                label="IPFS CID"
                placeholder=""
              ></v-text-field>
              <v-select
                v-model="form.period"
                :items="periodOpts"
                item-text="text"
                item-value="value"
                label="Refresh period"
              >
              </v-select>
            </template>
            <template v-else>
              <div class="d-flex">
                <v-text-field
                  persistent-placeholder
                  v-model="form.pkey"
                  label="Upload private key and sign it"
                  placeholder=""
                ></v-text-field>
                <v-btn color="primary" class="ml-5 mt-4" small>Decode</v-btn>
              </div>
            </template>
            <div class="mt-5 fz-14">
              <e-kv label="IPFS CID:">test123</e-kv>
              <e-kv class="mt-3" label="Refresh period:">24h</e-kv>
            </div>
          </div>
        </template>

        <div class="ta-c mt-5">
          <v-btn outlined width="100" @click="showPop = false">Cancel</v-btn>
          <v-btn color="primary" class="ml-6" width="100" @click="onNext">{{
            stepIdx == 0 ? "Next" : "Create"
          }}</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
const Day = 86400;
const initForm = {
  name: "",
  period: Day,
  cid: "",
  pkey: "",
};

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
        { text: "24h", value: Day },
        { text: "30d", value: Day * 30 },
        { text: "90d", value: Day * 90 },
        { text: "180d", value: Day * 180 },
      ],
      form: {
        ...initForm,
      },
    };
  },
  methods: {
    onShow() {
      this.stepIdx = 0;
      this.type = 0;
      this.form = {
        ...initForm,
      };
      this.showPop = true;
    },
    onNext() {
      if (this.stepIdx == 0) {
        this.stepIdx = 1;
      }
    },
  },
};
</script>