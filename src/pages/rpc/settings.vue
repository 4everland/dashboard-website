<template>
  <div class="settings-page">
    <div>
      <div class="d-flex al-c mb-4 justify-space-between">
        <span class="list-tit">General Settings</span>
      </div>
      <v-row>
        <v-col cols="12" md="6" class="py-0">
          <p class="int-name">API Key Name</p>
          <div class="mt-2">
            <v-text-field
              outlined
              dense
              counter="40"
              required
              :rules="rules.name"
              v-model.trim="newAPIData.name"
              placeholder="Type in a name for your API Key"
            >
            </v-text-field>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="py-0">
          <p class="int-name">Notes</p>
          <div class="mt-2">
            <v-text-field
              outlined
              dense
              counter="80"
              v-model.trim="newAPIData.notes"
              placeholder="E.g., chains, networks, etc."
            >
            </v-text-field>
          </div>
        </v-col>
        <v-col cols="12" class="py-0">
          <p class="int-name">API Key Status</p>
          <div class="mt-2" style="width: 220px">
            <e-radio-btn
              class="ml-auto"
              minWidth="110px"
              minHeight="32px"
              :options="typeList"
              v-model="typeIdx"
            ></e-radio-btn>
          </div>
        </v-col>
        <v-col cols="12">
          <v-btn color="primary" large> Save </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="mt-6">
      <div class="d-flex al-c mb-4 justify-space-between">
        <span class="list-tit">Secuity</span>
      </div>
      <v-row>
        <v-col cols="12" class="py-0">
          <p class="int-name">Enable JWT for ALL Requests</p>
        </v-col>
        <v-col cols="12" class="py-0" style="max-width: 560px">
          <p class="int-name">JWT Public Key Name</p>
          <div class="mt-2">
            <v-text-field
              outlined
              dense
              counter="80"
              v-model.trim="newAPIData.notes"
              placeholder="E.g., chains, networks, etc."
            >
            </v-text-field>
          </div>
        </v-col>
        <v-col cols="12" class="py-0">
          <p class="int-name">JWT Public Key</p>
          <div class="mt-2" style="width: 220px"></div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typeList: ["Active", "Inactive"],
      typeIdx: 0,
      rules: {
        name: [(val) => (val || "").length > 0 || "This field is required"],
      },
      newAPIData: {
        name: "",
        notes: "",
      },
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.settings-page {
  .list-tit {
    color: #000;
    font-size: 24px;
    font-weight: 400;
  }
  .int-name {
    color: #64748b;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
