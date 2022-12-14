<template>
  <div class="gateway-settings">
    <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>
    <div class="al-start d-flex hide-msg" v-else>
      <div class="mr-auto h-flex">
        <span>Restricted Gateway</span>
        <span class="fz-14 tips mt-2"
          >Tips: When enabled, this dedicated gateway will only be able to
          access the IPFS files in the Bucket under the current account.</span
        >
      </div>
      <v-switch v-model="isPrivate" @change="onSave" dense></v-switch>
    </div>

    <div class="set-default-page mt-10">
      <div class="al-c">
        <span> Default Page for Gateway Domain</span>
        <e-tooltip right>
          <v-icon slot="ref" size="18" color="#333" class="pa-1 d-ib ml-2"
            >mdi-alert-circle-outline</v-icon
          >
          <span
            >Specifying a default page will make others access the contents you
            specify directly in their browsers by entering your gateway domain
            name.</span
          >
        </e-tooltip>
      </div>

      <v-row class="mt-4">
        <v-col :md="3" :cols="12"
          ><v-select
            class="post-input"
            outlined
            :items="items"
            dense
            v-model="seleted"
          ></v-select
        ></v-col>
        <v-col :md="9" :cols="12" class="d-flex al-start">
          <v-text-field
            class="post-input"
            persistent-placeholder
            outlined
            dense
            label=""
          ></v-text-field>
          <v-btn class="ml-8" width="120" color="primary">Save</v-btn>
        </v-col>
      </v-row>
      <span class="fz-14 tips mt-2"
        >Tips: When enabled, this dedicated gateway will only be able to access
        the IPFS files in the Bucket under the current account.</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          name: "",
          scope: "",
        };
      },
    },
  },
  data() {
    return {
      isPrivate: false,
      loading: true,
      gatewayName: null,
      items: ["IPFS", "IPNS"],
      seleted: "IPFS",
    };
  },
  created() {
    this.gatewayName = this.$route.params.name;
  },
  methods: {
    async onSave() {
      try {
        await this.$http2.put(
          "$gateway/gateway/",
          {
            name: this.gatewayName,
            scope: this.isPrivate ? "private" : "public",
          },
          { noTip: 1 }
        );
      } catch (error) {
        console.log(error);
        if (error.code == "EXISTS_PRIVATE_GATEWAY") {
          await this.$alert("You reached your private gateways count limit.");
          this.isPrivate = !this.isPrivate;
        }
      }
    },
  },
  watch: {
    info() {
      this.isPrivate = this.info.scope == "private" ? true : false;
      this.loading = false;
    },
  },
};
</script>


<style lang="scss" scoped>
.post-input ::v-deep .v-input__prepend-outer {
  margin: 0 !important;
  margin-right: 5px !important;
  width: 100px !important;
}
.post-input {
  font-size: 14px !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.post-input .v-input__prepend-outer::v-deep {
  margin: 0 !important;
}
.gateway-settings {
  .tips {
    color: #889ab3;
  }
}
</style>