<template>
  <div class="bg-white">
    <div class="bd-1 mt-3">
      <div class="pd-20 pb-0 d-flex al-c flex-wrap">
        <div class="mr-auto">
          <div class="mr-auto fz-20 lh-1">{{ domain }}</div>
          <div class="d-flex al-c mt-3">
            <v-icon :color="success ? 'success' : 'error'" size="18">
              mdi-{{ success ? "check-circle" : "information" }}
            </v-icon>
            <span class="ml-1 fz-13" :class="success ? 'color-suc' : 'red-1'">
              {{
                success
                  ? "Valid Configuration"
                  : (validInfo && validInfo.message) || "Invalid Configuration"
              }}
            </span>
          </div>
        </div>
        <div class="mt-2">
          <v-btn
            v-if="!success"
            small
            icon
            class="mr-4"
            @click="getInfo"
            :loading="loading"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn small outlined @click="onRemove" :loading="deleting">
            Remove
          </v-btn>
        </div>
      </div>
      <div class="pd-20 pt-0" v-if="!success">
        <!-- <div class="fz-14">
            <b>Nameservers</b>
          </div> -->
        <template v-if="validInfo && validInfo.conflicts.length">
          <p class="gray mt-1 fz-14">
            Please remove the following conflicting DNS records from your DNS
            provider:
          </p>
          <div class="bg-f4 pd-10 fz-14 mt-3 mb-5">
            <table class="w100p">
              <tr class="gray">
                <td>Type</td>
                <td>Name</td>
                <td>Value</td>
              </tr>
              <tr v-for="(row, j) in validInfo.conflicts" :key="j">
                <td>{{ row.type }}</td>
                <td>{{ info.pre }}</td>
                <td class="wb-all">{{ row.value }}</td>
              </tr>
            </table>
          </div>
        </template>
        <p class="gray mt-4 fz-14">
          <span v-if="validInfo && validInfo.conflicts.length"
            >Afterwards,</span
          >
          Set the following record on your DNS provider to continue:
        </p>
        <div class="pd-10 fz-14 mt-3">
          <table class="w100p">
            <tr class="gray">
              <td>Type</td>
              <td>Name</td>
              <td>Value</td>
            </tr>
            <tr>
              <td>{{ isA ? "A" : "CNAME" }}</td>
              <td>{{ pre }}</td>
              <td>
                <p
                  class="hover-1 wb-all mb-0"
                  v-clipboard="isA ? info.ip : info.cname"
                  @success="$toast('Copied!')"
                >
                  {{ isA ? info.ip : info.cname }}
                  <v-icon size="14" class="ml-1">mdi-content-copy</v-icon>
                </p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      deleting: false,
      validInfo: null,
    };
  },
  computed: {
    domain() {
      return this.info.domain;
    },
    isA() {
      const arr = this.domain.split(".");
      arr.pop();
      arr.pop();
      return !arr.length;
    },
    pre() {
      const arr = this.domain.split(".");
      arr.pop();
      arr.pop();
      return this.isA ? "@" : arr.join(".");
    },
    success() {
      if (this.info.valid) return this.info.valid;
      if (!this.validInfo) return false;
      return this.validInfo.success;
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        this.loading = true;
        const { data } = await this.$http.get(
          `$bucektDomain/domain/bucket/${this.domain}/verify`
        );

        this.validInfo = data;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },

    async onRemove() {
      try {
        const domain = this.domain;
        let html = domain + " will be removed";
        if (this.success) {
          html = `<div class="fz-15">${domain} will no longer be a domain of your bucket.</div>`;
        }
        await this.$confirm(html, "Remove Domain", {
          confirmText: "Remove",
        });
        this.deleting = true;
        await this.$http.delete("$bucektDomain/domain/bucket/" + domain);
        this.$emit("getList");
        await this.$sleep(200);
        this.$toast(domain + " Removed successfully");
      } catch (error) {
        //
      }
      this.deleting = false;
    },
  },
};
</script>

<style scoped>
table td {
  padding: 5px 10px;
}
</style>
