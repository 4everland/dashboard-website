<style lang="scss">
.st-domains {
  table {
    td {
      padding: 2px 10px;
    }
  }
}
</style>

<template>
  <div class="st-domains">
    <div class="bd-1 mb-5">
      <h3>Domains</h3>
      <div class="gray fz-14">
        These domains are assigned to your Production Deployments.
        <!-- Optionally, a different Git branch or a redirection to another domain can be configured
      for each one. -->
      </div>
      <div class="mt-5 d-flex">
        <v-text-field
          outlined
          dense
          v-model.trim="domain"
          @keyup.enter="onAdd"
          placeholder="mywebsite.com"
        >
        </v-text-field>
        <v-btn
          rounded
          min-width="100"
          @click="onAdd"
          :disabled="!domain"
          :loading="adding"
          color="primary"
          class="ml-4"
          style="margin-top: 2px"
        >
          Add
        </v-btn>
      </div>
    </div>

    <v-skeleton-loader type="article" v-if="!list" />
    <div v-else-if="list.length">
      <div class="bd-1 mb-5" v-for="(it, i) in list" :key="i">
        <div class="d-flex al-c flex-wrap">
          <div class="mr-auto">
            <div class="mr-auto fz-20 lh-1">{{ it.domain }}</div>
            <div class="d-flex al-c mt-3">
              <v-icon :color="it.valid ? 'success' : 'error'" size="18">
                mdi-{{ it.valid ? "check-circle" : "information" }}
              </v-icon>
              <span
                class="ml-1 fz-13"
                :class="it.valid ? 'color-suc' : 'red-1'"
              >
                {{ it.valid ? "Valid Configuration" : "Invalid Configuration" }}
              </span>
            </div>
          </div>
          <div class="mt-2">
            <v-btn
              v-if="!it.valid"
              small
              icon
              class="mr-4"
              @click="onRefresh(it)"
              :loading="it.refreshing"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn
              small
              rounded
              outlined
              @click="onRemove(it)"
              :loading="it.removing"
            >
              Remove
            </v-btn>
          </div>
        </div>
        <div class="mt-5" v-if="!it.valid">
          <template v-if="it.conflicts.length">
            <p class="gray fz-14">
              Please remove the following conflicting DNS records from your DNS
              provider:
            </p>
            <div class="fz-14 mt-3 mb-5">
              <table class="w100p">
                <tr class="gray">
                  <td>Type</td>
                  <td>Name</td>
                  <td>Value</td>
                </tr>
                <tr class="fz-16" v-for="(row, j) in it.conflicts" :key="j">
                  <td>{{ row.type }}</td>
                  <td>@</td>
                  <td class="wb-all color-1 fw-b">{{ row.value }}</td>
                </tr>
              </table>
            </div>
          </template>
          <p class="gray mt-3 fz-14">
            <span v-if="it.conflicts.length">Afterwards,</span>
            Set the following record on your DNS provider to continue:
          </p>
          <div class="fz-14 mt-5">
            <table class="w100p">
              <tr class="gray">
                <td>Type</td>
                <td>Name</td>
                <td>Value</td>
              </tr>
              <tr class="fz-16">
                <td>{{ it.isA ? "A" : "CNAME" }}</td>
                <td>{{ it.pre }}</td>
                <td>
                  <p
                    class="hover-1 wb-all color-1 fw-b"
                    v-clipboard="it.isA ? dns.ip : dns.cname"
                    @success="$toast('Copied to clipboard !')"
                  >
                    {{ it.isA ? dns.ip : dns.cname }}
                    <v-icon size="14" class="ml-1">mdi-content-copy</v-icon>
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <st-proj-domains-ens />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    const curPath = this.$route.path;
    return {
      curPath,
      domain: "",
      list: null,
      adding: false,
      dns: {
        cname: "-",
        ip: "",
      },
      hasRefresh: false,
    };
  },
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
      isFocus: (s) => s.isFocus,
    }),
    isCurPath() {
      return this.curPath == this.$route.path;
    },
  },
  watch: {
    isFocus(val) {
      if (val && this.isCurPath) {
        this.setRefresh();
      }
    },
  },
  mounted() {
    this.getList();
    this.getDnsName();
  },
  methods: {
    async getDnsName() {
      try {
        const { data } = await this.$http2.get("/domain/server");
        this.dns = data;
      } catch (error) {
        //
      }
    },
    onUpdate() {
      this.$setState({
        noticeMsg: {
          name: "updateProject",
        },
      });
    },
    async setRefresh() {
      const rows = this.list || []; //.filter((it) => !it.valid);
      for (const it of rows) {
        await this.onRefresh(it);
      }
    },
    async getList() {
      try {
        const { data } = await this.$http2.get("/domain/list", {
          params: {
            projectId: this.info.id,
          },
        });
        this.list = data.content.map((it) => {
          const arr = it.domain.split(".");
          arr.pop();
          arr.pop();
          it.isA = !arr.length;
          it.pre = it.isA ? "@" : arr.join(".");
          it.conflicts = it.conflicts || [];
          // it.valid = 1
          return it;
        });
        if (!this.hasRefresh) {
          this.setRefresh();
          this.hasRefresh = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async onAdd() {
      try {
        if (!this.domain) return;
        if (!this.$regMap.domain.test(this.domain)) {
          return this.$alert(
            `The specified value "${this.domain}” is not a fully qualified domain name.`
          );
        }
        this.adding = true;
        await this.$http2.post("/domain", {
          domain: this.domain,
          projectId: this.info.id,
        });
        this.domain = "";
        this.$toast("Added successfully");
        this.hasRefresh = false;
        await this.getList();
        // console.log(data)
        this.onUpdate();
      } catch (error) {
        console.log(error);
      }
      this.adding = false;
    },
    async onRemove(it) {
      try {
        if (it.valid) {
          let html = `<div class="fz-15">${it.domain} will no longer be a production domain of this project.</div>
              <ul class="mt-3 fz-14 gray-6"><li>The domain will not be used in future production deployments</li>
              <li>The domain will be removed from your latest production deployment</li>
              <li>The domain is still owned by you</li>
              <li>Existing deployments will not be affected</li></ul>`;
          await this.$confirm(html, "Remove Domain from Project", {
            confirmText: "Remove",
          });
        } else {
          await this.$confirm(it.domain + " will be removed");
        }
        this.$set(it, "removing", true);
        await this.$http2.delete("/domain/" + it.domainId);
        this.hasRefresh = false;
        await this.getList();
        this.$toast("Removed successfully");
        this.onUpdate();
      } catch (error) {
        //
      }
      this.$set(it, "removing", false);
    },
    async onRefresh(it) {
      try {
        this.$set(it, "refreshing1", true);
        const { data } = await this.$http2.get(
          "/domain/verify/" + it.domainId,
          {
            noTip: true,
          }
        );
        if (data.success != it.valid) {
          await this.getList();
          if (!it.valid) this.$toast(it.domain + " is valid now");
        }
        if (!data.success && data.conflicts) {
          this.$set(it, "conflicts", data.conflicts);
        }
      } catch (error) {
        //
      }
      this.$set(it, "refreshing", false);
    },
  },
};
</script>