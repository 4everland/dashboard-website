<style lang="scss">
.st-domains {
  table {
    td {
      padding: 5px 10px;
    }
  }
  .bd-1 {
    padding: 20px;
  }
}
</style>

<template>
  <div class="st-domains hide-msg main-wrap">
    <div class="bd-1 mb-5">
      <h3>Domains</h3>
      <div class="gray fz-14">
        These domains are assigned to your production deployments.
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
      <div class="bd-1 mb-5" v-for="it in list" :key="it.id">
        <template v-if="it.isEdit">
          <h4>Domain</h4>
          <v-text-field
            :value="it.domain"
            dense
            disabled
            outlined
          ></v-text-field>
          <h4 class="mt-5">Redirect to</h4>
          <v-select
            :disabled="!selectRedirect"
            dense
            outlined
            :items="getRedirectItems(it)"
            item-text="domain"
            item-value="domainId"
            v-model="rediectForm.redirectTo"
            :menu-props="{ offsetY: true }"
          ></v-select>
          <template v-if="selectRedirect && rediectForm.redirectTo">
            <h4 class="mt-5">Status Code</h4>
            <v-select
              dense
              outlined
              :items="codeItems"
              v-model="rediectForm.code"
              :menu-props="{ offsetY: true }"
            ></v-select>
          </template>
          <div class="al-c mt-5">
            <v-btn icon @click="onRemove(it)" :loading="it.removing">
              <v-icon small>mdi-trash-can-outline</v-icon>
            </v-btn>
            <v-btn
              outlined
              width="90"
              class="ml-auto"
              small
              @click="setEdit(it, false)"
              >Cancel</v-btn
            >
            <v-btn
              color="primary"
              width="90"
              class="ml-5"
              small
              :disabled="!selectRedirect"
              :loading="it.saving"
              @click="saveRedirect(it)"
              >Save</v-btn
            >
          </div>
        </template>
        <template v-else>
          <div class="al-c flex-wrap">
            <div class="mr-auto">
              <div class="mr-auto fz-20 lh-1">{{ it.domain }}</div>
              <div class="al-c mt-3">
                <v-icon :color="it.valid ? 'success' : 'error'" size="18">
                  mdi-{{ it.valid ? "check-circle" : "information" }}
                </v-icon>
                <span
                  class="ml-1 fz-13"
                  :class="it.valid ? 'color-suc' : 'red-1'"
                >
                  {{
                    it.valid
                      ? "Valid Configuration"
                      : it.errMsg || "Invalid Configuration"
                  }}
                </span>
                <template v-if="it.redirectName && it.valid">
                  <v-icon color="success" size="18" class="ml-15"
                    >mdi-check-circle</v-icon
                  >
                  <span class="ml-1 fz-13"
                    >Redirect to {{ it.redirectName }}</span
                  >
                </template>
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
                color="primary"
                :loading="it.editing"
                @click="setEdit(it, true)"
              >
                Edit
              </v-btn>
            </div>
          </div>
          <div class="mt-5" v-if="!it.valid">
            <template v-if="it.conflicts.length">
              <p class="gray fz-14">
                Please remove the following conflicting DNS records from your
                DNS provider:
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
              Set the following record on your DNS provider to continue.
              <span v-if="it.createType < 2 && it.domainName == it.domain"
                >Before it takes effect, the
                <b class="gray-3">www.{{ it.domain }}</b> domain will be
                resolved to guarantee true ownership.</span
              >
            </p>
            <div class="fz-14 mt-5">
              <table class="w100p">
                <tr class="gray">
                  <td>Type</td>
                  <td>Name</td>
                  <td>Value</td>
                </tr>
                <tr class="fz-15" v-for="(row, j) in it.records" :key="j">
                  <td>{{ row.type }}</td>
                  <td>{{ row.name }}</td>
                  <td>
                    <p
                      class="hover-1 wb-all mb-0"
                      v-clipboard="row.value"
                      @success="$toast('Copied!')"
                    >
                      {{ row.value }}
                      <v-icon size="14" class="ml-1">mdi-content-copy</v-icon>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- <st-proj-domains-sol v-if="info.platform == 'IPFS'" />
    <st-proj-domains-ens v-if="info.platform == 'IPFS'" /> -->
    <st-proj-domains-mix v-if="info.platform == 'IPFS'" />
  </div>
</template>

<script>
// import StProjDomainsEns from "@/views/hosting/settings/st-proj-domains-ens";
// import StProjDomainsSol from "@/views/hosting/settings/st-proj-domains-sol";
import StProjDomainsMix from "@/views/hosting/settings/st-proj-domains-mix";

import { mapState } from "vuex";

export default {
  components: {
    // StProjDomainsEns,
    // StProjDomainsSol,
    StProjDomainsMix,
  },
  data() {
    const curPath = this.$route.path;
    return {
      curPath,
      domain: "",
      list: null,
      adding: false,
      hasRefresh: false,
      showType: false,
      rediectForm: {
        redirectTo: null,
        code: 301,
      },
      selectRedirect: true,
      codeItems: [
        { text: "301 Permanently Moved", value: 301 },
        { text: "302 Temporarily Moved", value: 302 },
      ],
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
        // this.setRefresh();
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async setEdit(it, val = true) {
      try {
        if (val) {
          this.$set(it, "editing", true);
          const { data } = await this.$http.get(
            `$hosting/domain/redirect/${it.domainId}`
          );
          this.selectRedirect = data.selectRedirect;
          this.rediectForm = {
            redirectTo: data.redirect || it.redirect || null,
            code: data.code || 301,
          };
          // console.log(data);
          for (const row of this.list) {
            if (row.isEdit) this.$set(row, "isEdit", false);
          }
        }
        this.$set(it, "isEdit", val);
      } catch (error) {
        //
      }
      if (val) this.$set(it, "editing", false);
    },
    async saveRedirect(it) {
      try {
        this.$set(it, "saving", true);
        await this.$http.put(
          `$hosting/domain/redirect/${it.domainId}`,
          this.rediectForm
        );
        await this.getList();
      } catch (error) {
        this.$set(it, "saving", false);
      }
    },
    getRedirectItems(it) {
      let arr = [
        {
          domain: !this.selectRedirect ? "No Redirect Possible" : "No Redirect",
          domainId: null,
        },
      ];
      if (this.selectRedirect) {
        arr = arr.concat(
          this.list.filter((p) => p.domain != it.domain && !p.redirect)
        );
      }
      return arr;
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
        const { data } = await this.$http.get("$hosting/domain/list", {
          params: {
            projectId: this.info.id,
          },
        });
        this.list = data.content.map((it) => {
          const arr = it.domain.split(".");
          arr.pop();
          arr.pop();
          const isA = !arr.length;
          it.pre = isA ? "@" : arr.join(".");
          it.records = [
            {
              type: it.type,
              name: it.pre,
              value: it.value,
            },
          ];

          if (isA) {
            switch (it.topLevel) {
              case 0:
                it.records[0].type = "A";
                it.records[0].value = it.ip;
                break;
              case 1:
                it.records[0].type = "A";
                it.records[0].value = it.ip;
                it.records.push({
                  type: "TXT",
                  name: "@",
                  value: it.txt,
                });
                break;
              case 2:
                it.records[0].type = "CNAME";
                it.records[0].value = it.cname;
                it.records.push({
                  type: "TXT",
                  name: "@",
                  value: it.txt,
                });
                break;
              default:
                break;
            }
          }

          it.conflicts = it.conflicts || [];
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
    async afterAdd() {
      const domain = this.domain;
      const { data } = await this.$http.get(`$hosting/domain/${domain}`);
      return data;
    },
    async onAdd() {
      try {
        if (!this.domain) return;
        if ((this.list || []).length >= 20) {
          return this.$alert("You can add 20 domains at maximum.");
        }
        if (!this.$regMap.domain.test(this.domain)) {
          return this.$alert(
            `The specified value "${this.domain}” is an unqualified domain name.`
          );
        }
        const isExist = await this.afterAdd();
        console.log(isExist);
        if (isExist) {
          await this.$confirm(
            "The domain name already occupied by another project, rebundle it to the current one?",
            "",
            {
              confirmText: "OK",
            }
          );
        }
        let type = 3;
        let domain = this.domain;
        let isWww = false;
        if (domain.split(".").length == 3) {
          domain = domain.replace(/^www\./, "");
          if (domain != this.domain) isWww = true;
        }
        if (domain.split(".").length == 2) {
          const { form1 } = await this.$confirm("", "Add Domains", {
            comp1: "domain-dns-type",
            comp1Props: {
              domain,
              isWww,
            },
          });
          type = form1.type || 0;
          if (isWww && type == 2) domain = "www." + domain;
        }
        this.adding = true;

        await this.$http.post("$hosting/domain", {
          domain,
          projectId: this.info.id,
          createType: type,
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
        let html = `${it.domain} will be removed from your project ${it.projectName}.`;
        if (it.valid) {
          html += `<p>After continuing, your project will no longer be accessible through this domain.</p>`;
        }
        await this.$confirm(html, "Remove Domain from Project", {
          confirmText: "Remove",
        });
        this.$set(it, "removing", true);
        await this.$http.delete("$hosting/domain/" + it.domainId);
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
        this.$set(it, "refreshing", true);
        const { data } = await this.$http.get(
          "$hosting/domain/verify/" + it.domainId,
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
        this.$set(it, "errMsg", data.message);
      } catch (error) {
        //
      }
      this.$set(it, "refreshing", false);
    },
  },
};
</script>
