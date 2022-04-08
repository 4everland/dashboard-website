<template>
  <div>
    <div v-if="!info">
      <v-skeleton-loader type="article" max-width="600" />
    </div>
    <div class="bg-white" style="max-width: 600px" v-else>
      <div class="bd-1 mt-3">
        <div class="pd-20 d-flex al-c flex-wrap">
          <div class="mr-auto">
            <h3 class="mr-auto">{{ domain }}</h3>
            <div class="d-flex al-c">
              <v-icon :color="info.success ? 'success' : 'error'" size="18">
                mdi-{{ info.success ? "check-circle" : "information" }}
              </v-icon>
              <span
                class="ml-1 fz-13"
                :class="info.success ? 'color-suc' : 'red-1'"
              >
                {{
                  info.success ? "Valid Configuration" : "Invalid Configuration"
                }}
              </span>
            </div>
          </div>
          <div class="mt-2">
            <v-btn
              v-if="!info.success"
              small
              icon
              class="mr-4"
              @click="getInfo"
              :loading="loading"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn small outlined rounded @click="onRemove" :loading="deleting">
              Remove
            </v-btn>
          </div>
        </div>
        <div class="pd-20 bdt-1" v-if="!info.success">
          <!-- <div class="fz-14">
            <b>Nameservers</b>
          </div> -->
          <template v-if="info.conflicts.length">
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
                <tr v-for="(row, j) in info.conflicts" :key="j">
                  <td>{{ row.type }}</td>
                  <td>@</td>
                  <td class="wb-all">{{ row.value }}</td>
                </tr>
              </table>
            </div>
          </template>
          <p class="gray mt-3 fz-14">
            <span v-if="info.conflicts.length">Afterwards,</span>
            Set the following record on your DNS provider to continue:
          </p>
          <div class="bg-f4 pd-10 fz-14 mt-3">
            <table class="w100p">
              <tr class="gray">
                <td>Type</td>
                <td>Name</td>
                <td>Value</td>
              </tr>
              <tr>
                <td>{{ info.isA ? "A" : "CNAME" }}</td>
                <td>{{ info.pre }}</td>
                <td>
                  <p
                    class="hover-1 wb-all"
                    v-clipboard="info.isA ? dns.ip : dns.cname"
                    @success="$toast('Copied to clipboard !')"
                  >
                    {{ info.isA ? dns.ip : dns.cname }}
                    <v-icon size="14" class="ml-1">mdi-content-copy</v-icon>
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      deleting: false,
      info: null,
      dns: {
        cname: "-",
        ip: "",
      },
    };
  },
  computed: {
    domain() {
      const { name } = this.$route.params;
      return name;
    },
  },
  watch: {
    domain() {
      this.info = null;
      this.getInfo();
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      if (!this.domain) return;
      try {
        this.loading = true;
        if (!this.dns.ip) {
          const { data } = await this.$http.get("/domains/resolve");
          console.log(data);
          this.dns = data;
        }
        const { data: info } = await this.$http.get(
          `/domains/${this.domain}/verify`
        );
        console.log(info);
        const arr = this.domain.split(".");
        arr.pop();
        arr.pop();
        info.isA = !arr.length;
        info.pre = info.isA ? "@" : arr.join(".");
        this.info = info;
      } catch (error) {
        //
      }
      this.loading = false;
    },
    async onRemove() {
      try {
        const domain = this.domain;
        let html = domain + " will be removed";
        if (this.info.success) {
          html = `<div class="fz-15">${domain} will no longer be a domain of your bucket.</div>`;
        }
        await this.$confirm(html, "Remove Domain", {
          confirmText: "Remove",
        });
        this.deleting = true;
        await this.$http.delete("/domains/" + domain);
        // await this.getInfo();
        this.$router.push("/domain");
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