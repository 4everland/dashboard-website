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
    <v-dialog v-model="showPop" max-width="600" persistent>
      <div class="pa-6 pt-5">
        <h3 class="fz-20">Create IPNS</h3>
        <div class="pa-3" v-show="stepIdx == 0">
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
          <!-- <div class="gray fz-13">
            API support is also available for managing IPNS.
            <a href="https://docs.4everland.org/">Click to learn more.</a>
          </div> -->
        </div>
        <div v-show="stepIdx !== 0">
          <div class="gray fz-13 mt-1 create-type">
            {{ options[type].label }}
          </div>
          <v-form ref="form" v-model="valid">
            <div class="pa-5">
              <template v-if="type == 0">
                <div class="mt-5">
                  <v-text-field
                    class="post-input"
                    persistent-placeholder
                    autofocus
                    v-model="form.name"
                    label="Set a Name"
                    placeholder="Set a name for your IPNS"
                    counter="30"
                    :rules="[
                      (v) =>
                        /^[a-z0-9A-Z]{1,30}$/.test(v) && v
                          ? true
                          : 'Invalid name',
                    ]"
                  ></v-text-field>
                </div>
                <div class="mt-5">
                  <v-text-field
                    class="post-input"
                    persistent-placeholder
                    dense
                    v-model="form.value"
                    :placeholder="
                      cidType == 1 ? 'Enter the IPFS CID' : 'Enter the IPNS'
                    "
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
                    class="post-input"
                    v-model="form.lifetime"
                    :items="periodOpts"
                    dense
                    item-text="text"
                    item-value="value"
                    label="End of Life"
                  >
                  </v-select>
                </div>
              </template>
              <template v-else>
                <div class="mt-5">
                  <v-text-field
                    class="post-input"
                    persistent-placeholder
                    dense
                    autofocus
                    v-model="form.name"
                    label="Decentration domain"
                    placeholder="Enter your ENS domain"
                    :rules="[
                      (v) => (/\.eth$/.test(v) && v ? true : 'Invalid name'),
                    ]"
                  ></v-text-field>
                </div>
                <div class="mt-5">
                  <v-text-field
                    class="post-input"
                    persistent-placeholder
                    dense
                    v-model="form.value"
                    :placeholder="
                      cidType == 1 ? 'Enter the IPFS CID' : 'Enter the IPNS'
                    "
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
                      </v-select> </template
                  ></v-text-field>
                </div>
                <div class="mt-5">
                  <v-select
                    class="post-input"
                    v-model="form.lifetime"
                    dense
                    :items="periodOpts"
                    item-text="text"
                    item-value="value"
                    label="End of Life"
                  >
                  </v-select>
                </div>
              </template>
            </div>
          </v-form>
        </div>

        <div class="ta-c mt-5">
          <v-btn
            color="primary"
            width="180"
            @click="onNext"
            :loading="createLoading"
            >{{ stepIdx == 0 ? "Next" : "Create" }}</v-btn
          >
          <v-btn outlined class="ml-6" width="180" @click="showPop = false"
            >Cancel</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPop: false,
      type: 0,
      stepIdx: 0,
      options: [
        {
          label: "Generate an IPNS with IPFS Path.",
          tip: "We'll publish the IPFS Path and generate an IPNS.",
          value: 0,
        },
        {
          label: "Create IPNS via decentralised domain.",
          tip: "Support for ENS authentication bindings.",
          value: 1,
        },
      ],
      periodOpts: [
        { text: "24h", value: 1 },
        { text: "30d", value: 30 },
        { text: "90d", value: 90 },
        { text: "180d", value: 180 },
      ],
      form: {
        name: null,
        value: "",
        lifetime: 1,
      },
      valid: false,
      createLoading: false,
      cidType: 1,
      cidTypeOpts: [
        { text: "IPFS", value: 1 },
        { text: "IPNS", value: 2 },
      ],
    };
  },
  methods: {
    onShow() {
      this.stepIdx = 0;
      this.type = 0;
      this.showPop = true;
    },
    async onNext() {
      if (this.stepIdx == 0) {
        this.stepIdx = 1;
      } else {
        let valid = this.$refs.form.validate();
        if (!valid) return;

        this.createIpns();
      }
    },
    async createIpns() {
      try {
        this.createLoading = true;

        const form = {
          name: this.form.name,
          value: (this.cidType == 1 ? "/ipfs/" : "/ipns/") + this.form.value,
          lifetime: this.form.lifetime,
        };
        if (!this.form.value) {
          form.value = "";
        }
        await this.$http2.post("$ipns/names", form);
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
        setTimeout(() => {
          this.form = {
            name: null,
            value: "",
            lifetime: 1,
          };
          this.cidType = 1;
        }, 500);
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
