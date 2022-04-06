<template>
  <div class="bd-1 mb-5">
    <v-skeleton-loader type="article" v-if="!info" />
    <div v-else-if="!info.ens">
      <h3>ENS</h3>
      <div class="gray mt-1 fz-14">Add your ENS name to your site.</div>
      <div class="mt-5">
        <div class="d-flex">
          <v-text-field
            outlined
            dense
            v-model.trim="domain"
            @keyup.enter="onAdd"
            placeholder="ENS Domain"
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
    </div>
    <div v-else>
      <template>
        <div class="mb-6 mt-3">
          <div class="d-flex al-c flex-wrap">
            <div class="mr-auto">
              <h3 class="mr-auto">
                <a
                  :href="`https://app.ens.domains/name/${info.ens}/details`"
                  target="_blank"
                  >{{ info.ens }}</a
                >
              </h3>
              <div class="d-flex al-c mt-2">
                <v-icon :color="verify ? 'success' : 'error'" size="18">
                  mdi-{{ verify ? "check-circle" : "information" }}
                </v-icon>
                <span
                  class="ml-1 fz-13"
                  :class="verify ? 'color-suc' : 'red-1'"
                >
                  {{ verify ? "Valid Configuration" : "Invalid Configuration" }}
                </span>
              </div>
            </div>
            <div class="mt-2">
              <div class="text-center">
                <v-menu offset-y open-on-hover>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item
                      link
                      v-clipboard="info.ipns"
                      @success="$toast('Copied to clipboard !')"
                    >
                      <span>Copy IPNS</span>
                    </v-list-item>
                    <v-list-item
                      v-if="!info.verify"
                      link
                      @click="verifyConfiguration"
                    >
                      <span>Verify Configuration</span>
                    </v-list-item>
                    <v-list-item link @click="onRemove">
                      <span class="red-1">Remove</span>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!info.verify">
          <v-divider></v-divider>
          <div class="gray mt-1 fz-14">
            Set the content hash of your ENS domain and we will automatically
            update the site for all future site deployments. This operation is
            performed only once.
          </div>
          <div class="d-flex al-c space-btw">
            <div class="gray mt-1 fz-14">
              <span>Owner:</span>
              <span>{{ owner.cutStr(6, 4) }}</span>
            </div>
            <v-btn
              rounded
              @click="setContentHash"
              color="primary"
              class="ml-4"
              style="margin-top: 2px"
            >
              Set content hash
            </v-btn>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { namehash } from "@ensdomains/ensjs";
import { encode, decode } from "@ensdomains/content-hash";
import { getProvider, getENSRegistry, getResolver } from "@/plugins/ens";
const reg = /.+\.eth$/;

export default {
  data() {
    return {
      domain: "",
      adding: false,
      info: null,
      verify: false,
      owner: "",
    };
  },
  computed: {
    ...mapState({
      netType: (s) => s.netType,
      connectAddr: (s) => s.connectAddr,
    }),
  },

  created() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        const { id } = this.$route.params;
        const { data } = await this.$http2.put("/project/ipns/" + id);
        this.info = data;
        if (data.ens != "") {
          this.domain = data.ens;
          this.owner = await this.verifyOwner();
          this.ensIpns = await this.getEnsIpns(this.info.ens);
          if (this.ensIpns && this.ensIpns === this.info.ipns) {
            this.verify = true;
          } else {
            this.verify = false;
          }
        }
      } catch (error) {
        //
      }
    },
    async setInfo() {
      try {
        const { id } = this.$route.params;
        let body = {
          ens: this.domain,
        };
        const { data } = await this.$http2.put("/project/ipns/" + id, body);
        this.info = data;
      } catch (error) {
        //
      }
    },
    async onRemove() {
      try {
        await this.$confirm(
          `${this.info.ens} will be removed. Are you sure you want to continue?`
        );
        this.domain = "";
        this.$loading();
        await this.setInfo();
        this.$toast("Removed successfully");
      } catch (error) {
        //
      }
      this.$loading.close();
    },
    checkNet() {
      if (!this.netType) return false;
      let msg = "";
      if (this.$inDev) {
        // if (this.netType != "goerli") msg = "Dev: please connect to goerli";
      } else if (this.netType != "main") {
        msg = "Wrong network, please connect to Ethereum mainnet";
      }
      if (msg) {
        this.$alert(msg);
      }
      return !msg;
    },
    showConnect() {
      this.$setState({
        noticeMsg: {
          name: "showMetaConnect",
        },
      });
    },
    async onAdd() {
      if (!this.checkNet() || !this.connectAddr) {
        this.showConnect();
        return;
      }
      if (!reg.test(this.domain)) {
        return this.$alert("Invalid ETH Domain");
      }
      this.owner = await this.verifyOwner();
      if (!this.owner) {
        return this.$alert("Invalid ETH Domain");
      }
      this.$confirm(
        `${this.owner.cutStr(6, 4)} is the owner of ${
          this.domain
        }. Is that you?`
      ).then(async () => {
        this.setInfo();
      });
      // this.verify();
    },
    async verifyOwner() {
      try {
        this.$loading();
        this.node = namehash(this.domain);
        this.provider = getProvider();
        const registry = getENSRegistry(this.provider);
        this.$loading.close();
        return await registry.owner(this.node);
      } catch (error) {
        this.onErr(error);
      }
    },
    async verifyConfiguration() {
      this.$loading();
      this.ensIpns = await this.getEnsIpns(this.info.ens);
      if (this.ensIpns && this.ensIpns === this.info.ipns) {
        this.verify = true;
      } else {
        this.verify = false;
      }
      this.setInfo();
      this.$loading.close();
    },
    async getEnsIpns() {
      try {
        this.$loading();
        this.node = namehash(this.domain);
        this.provider = getProvider();
        const registry = getENSRegistry(this.provider);
        this.owner = await registry.owner(this.node);
        this.resolver = await registry.resolver(this.node);
        let contentHash = await getResolver(
          this.resolver,
          this.provider
        ).contenthash(this.node);
        this.$loading.close();
        if (contentHash.substring(2)) {
          const res = decode(contentHash);
          return res;
        }
      } catch (error) {
        this.onErr(error);
      }
    },
    async setContentHash() {
      if (this.owner !== this.connectAddr) {
        return this.$alert(
          "Connected account is not the controller of the domain. "
        );
      }
      try {
        this.$loading();
        const signer = this.provider.getSigner();
        const ipnsHashEncoded = encode("ipns-ns", this.info.ipns);
        const data = getResolver(
          this.resolver,
          this.provider
        ).interface.encodeFunctionData("setContenthash", [
          this.node,
          `0x${ipnsHashEncoded}`,
        ]);
        const from = await signer.getAddress();
        const tx = await signer.sendTransaction({
          to: this.resolver,
          from,
          data,
        });
        this.$loading(`Transaction(${tx.hash.cutStr(4, 3)}) pending`);
        const receipt = await tx.wait();
        console.log(receipt);
        this.getInfo(true);
      } catch (error) {
        this.onErr(error);
      }
      this.$loading.close();
    },
    onErr(e) {
      console.log(e);
      if (e) this.$alert(e.message);
    },
  },
};
</script>
