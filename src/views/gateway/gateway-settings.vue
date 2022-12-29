<template>
  <div class="gateway-settings">
    <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>
    <div v-else>
      <div class="al-start d-flex hide-msg">
        <div class="mr-auto h-flex mt-3">
          <span>Restricted Gateway</span>
          <span v-if="isPrivate" class="fz-14 tips mt-2"
            >Tips: When enabled, this dedicated gateway will only be able to
            access the IPFS files under the current Bucket account.</span
          >
          <span class="fz-14 tips mt-2" v-else
            >Tips: When disabled, all IPFS files are accessible through this
            dedicated gateway.</span
          >
        </div>
        <v-switch v-model="isPrivate" @change="onChange" dense></v-switch>
      </div>

      <div class="set-default-page mt-10">
        <div class="al-c">
          <span> Default Page for Gateway Domain</span>
          <e-tooltip right>
            <v-icon slot="ref" size="18" color="#333" class="pa-1 d-ib ml-2"
              >mdi-alert-circle-outline</v-icon
            >
            <span
              >Specifying a default page will make others access the contents
              you specify directly in their browsers by entering your gateway
              domain name.</span
            >
          </e-tooltip>
        </div>

        <v-row class="mt-4">
          <v-col :sm="3" :cols="12"
            ><v-select
              class="post-input"
              outlined
              :items="items"
              @change="handleSelected"
              dense
              v-model="seleted"
            ></v-select
          ></v-col>
          <v-col :sm="9" :cols="12" class="d-flex al-start">
            <v-text-field
              class="post-input"
              ref="defaultPageIpt"
              persistent-placeholder
              v-model="defaultPage"
              outlined
              dense
              :placeholder="label"
              :counter="100"
              :rules="rules"
            ></v-text-field>
            <v-btn
              class="ml-8"
              width="120"
              color="primary"
              @click="onSave"
              :loading="saveLoading"
              >Save</v-btn
            >
          </v-col>
        </v-row>
        <span class="fz-14 tips mt-2"
          >Tips: When using IPFS, there may be slow loading or fetching.
        </span>
      </div>
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
      items: ["IPFS", "URL"],
      seleted: "URL",
      defaultPage: "",
      rules: [
        (val) => {
          if (!val) return true;
          if (this.seleted == "URL") {
            return /^http:\/\/|https:\/\//.test(val)
              ? true
              : "Must be start with http:// or https://";
          } else {
            return /^ipfs:\/\//.test(val) ? true : "Must be start with ipfs://";
          }
        },
        (val) => {
          return val && val.length > 100
            ? "Must be a domain name with less than 100 characters"
            : true;
        },
      ],
      label: "http:// or https://",
      saveLoading: false,
    };
  },
  created() {
    this.gatewayName = this.$route.params.name;
  },
  methods: {
    async onChange() {
      try {
        await this.$http2.put(
          "$gateway/gateway/",
          {
            name: this.gatewayName,
            scope: this.isPrivate ? "private" : "public",
          },
          { noTip: 1 }
        );
        this.$emit("handleEvent");
      } catch (error) {
        console.log(error);
        if (error.code == "EXISTS_PRIVATE_GATEWAY") {
          await this.$alert("You reached your private gateways count limit.");
          this.isPrivate = !this.isPrivate;
        }
      }
    },
    async onSave() {
      try {
        if (!this.$refs.defaultPageIpt.valid) return;
        this.saveLoading = true;
        await this.$http2.put(
          `$gateway/gateway/${this.info.name}/index`,
          {
            indexPage: this.defaultPage,
          },
          {
            noTip: 1,
          }
        );
        this.$emit("handleEvent");
        this.$toast("Save Success!");
      } catch (error) {
        console.log(error);
        this.$alert("Please enter a valid ipfs hash");
      }
      this.saveLoading = false;
    },
    handleSelected(value) {
      console.log(value);
      if (value == "IPFS") {
        this.label = "ipfs://";
      } else {
        this.label = "http:// or https://";
      }
      this.$refs.defaultPageIpt.validate((val) => console.log(val));
    },
  },
  watch: {
    info() {
      this.isPrivate = this.info.scope == "private" ? true : false;
      this.defaultPage = this.info.indexPage;
      if (this.info.indexPage == "") {
        this.seleted = "URL";
      } else {
        this.seleted = /^ipfs:\/\//.test(this.info.indexPage) ? "IPFS" : "URL";
      }
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