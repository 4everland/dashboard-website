<template>
  <div>
    <e-right-opt-wrap :top="-74">
      <div class="al-c">
        <ipns-create @getList="getList" />
        <!-- <v-btn color="primary" class="ml-3">
          <img src="/img/svg/gateway/auth.svg" width="12" />
          <span class="ml-1">Auth Token</span>
        </v-btn> -->
        <div class="ml-3">
          <v-text-field
            class="hide-msg bd-1"
            dense
            solo
            clearable
            label="Search"
            prepend-inner-icon="mdi-magnify"
            v-model="keyword"
            @input="getList"
          ></v-text-field>
        </div>
      </div>
    </e-right-opt-wrap>
    <v-data-table
      :loading="loading"
      item-key="id"
      :headers="headers"
      :items="list"
      hide-default-footer
    >
      <template #item.name="{ item }">
        <span>{{ item.name }}</span>
        <!-- <v-icon
          size="22"
          color="#ff6d24"
          class="d-ib mx-3"
          v-if="item.isDomain"
          @click="setContentHash(item)"
          >mdi-alert-circle-outline</v-icon
        > -->

        <!-- <e-tooltip top v-if="item.isDomain">
          <v-icon slot="ref" color="#333" size="18" class="pa-1 d-ib ml-2"
            >mdi-alert-circle-outline</v-icon
          >
          <span>setContentHash</span>
        </e-tooltip> -->

        <v-menu top open-on-hover offset-y v-if="item.isDomain && !item.verify">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              slot="ref"
              color="#333"
              size="18"
              class="pa-1 d-ib ml-2"
              v-bind="attrs"
              v-on="on"
              >mdi-alert-circle-outline</v-icon
            >
          </template>
          <v-list>
            <v-list-item @click="setContentHash(item)">
              <span class="fz-14">Set content hash</span>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-icon size="18" class="d-ib ml-2" v-if="item.isDomain && item.verify"
          >mdi-share-circle</v-icon
        >

        <v-btn
          class="ml-2 action-btn-reload"
          text
          v-if="item.isDomain"
          :loading="verifyLoading"
          @click="verifyConfigure(item)"
        >
          <v-icon size="18" color="black">mdi-refresh</v-icon>
        </v-btn>
      </template>
      <template #item.key="{ item }">
        <span>{{ item.key.cutStr(5, 8) }}</span>
        <v-btn
          v-if="item.key"
          class="e-btn-text ml-2"
          icon
          small
          @click.stop
          v-clipboard="item.key"
          @success="$toast('Copied to clipboard !')"
        >
          <img src="/img/svg/copy.svg" width="12" />
        </v-btn>
      </template>
      <template #item.value="{ item }">
        <span>{{ item.value.cutStr(5, 8) }}</span>
        <v-btn
          v-if="item.value"
          class="e-btn-text ml-2"
          icon
          small
          @click.stop
          v-clipboard="item.value"
          @success="$toast('Copied to clipboard !')"
        >
          <img src="/img/svg/copy.svg" width="12" />
        </v-btn>
        <span v-else>--</span>
      </template>

      <template #item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt * 1000).format() }}</span>
      </template>
      <template v-slot:item.act="{ item }">
        <v-btn class="action-btn" text color="primary" @click="onPublish(item)"
          >Publish</v-btn
        >
        <v-btn class="action-btn" text color="#999" @click="onDelete(item)"
          >Delete</v-btn
        >
      </template>
    </v-data-table>

    <div class="mt-8" v-if="!list.length">
      <e-empty :loading="loading">
        {{ loading ? "Loading..." : "No Data" }}
      </e-empty>
    </div>
    <ipns-publish ref="ipnsPublish" @getList="getList" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { namehash } from "@ensdomains/ensjs";
import { encode, decode } from "@ensdomains/content-hash";
import { getProvider, getENSRegistry, getResolver } from "@/plugins/ens";
import IpnsCreate from "@/views/gateway/ipns-create";
import IpnsPublish from "@/views/gateway/ipns-publish";
export default {
  components: {
    IpnsCreate,
    IpnsPublish,
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "IPNS", value: "key" },
        { text: "IPFS CID Published", value: "value" },
        { text: "Created", value: "createdAt" },
        { text: "Action", value: "act" },
      ],
      list: [],
      loading: false,
      keyword: "",
      cursor: 0,
      provider: null,
      node: null,
      ensIpns: null,
      verifyLoading: false,
    };
  },
  computed: {
    ...mapState({
      connectAddr: (s) => s.connectAddr,
    }),
  },
  mounted() {
    this.getList();
  },
  methods: {
    localEnsList() {
      return localStorage.getItem("ens-list");
    },
    isExpired() {
      if (this.localEnsList()) {
        return JSON.parse(localStorage.getItem("ens-list")).expire < Date.now();
      }
      return false;
    },
    onPublish(item) {
      this.$refs.ipnsPublish.show(item);
    },
    async onDelete(item) {
      try {
        let tip =
          "The following IPNS will be deleted, Are you sure you want to continue?";
        tip += `<p class="mt-4">${item.name}</p>`;
        await this.$confirm(tip, "Delete IPNS");
        await this.$http2.delete(`$ipns/ipns/${item.key}`);
        this.getList();
      } catch (error) {
        //
      }
    },
    async getList() {
      try {
        this.initLocalEns();
        let params = {
          cursor: this.cursor,
          keyword: this.keyword,
        };
        this.loading = true;
        const { data } = await this.$http2.get("$ipns/ipns", {
          params,
        });

        for (const it of data.list) {
          if (/.+\.eth$/.test(it.name)) {
            it.isDomain = "eth";
            const chainId = window.ethereum.chainId;
            if (chainId != "0x1") {
              return;
            }
            let ensArr = JSON.parse(this.localEnsList()).arr;
            let index = ensArr.findIndex((item) => item.domain == it.name);
            if (index == -1 || this.isExpired()) {
              if (this.isExpired()) {
                localStorage.removeItem("ens-list");
                this.initLocalEns();
              }
              const ensIpns = await this.getEnsIpns(it.name);
              console.log(ensIpns);
              if (ensIpns && ensIpns === it.key) {
                it.verify = true;
              } else {
                it.verify = false;
              }
              this.setLocalEns(it, ensIpns);
              console.log();
            } else {
              it.verify = ensArr[index].verify;
            }
          }
        }
        this.list = data.list;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async setContentHash(item) {
      if (!this.connectAddr) {
        this.showConnect();
        return;
      }
      if (!this.checkNet()) {
        return false;
      }
      this.owner = await this.verifyOwner(item.name);
      console.log(this.owner);
      await this.$confirm(
        `${this.owner.cutStr(6, 4)} is the owner of ${item.name}. Is that you?`
      );
      if (this.owner !== this.connectAddr) {
        return this.$alert(
          "Connected account is not the controller of the domain. "
        );
      }

      // this.ensIpns = await this.getEnsIpns(item.name);
      try {
        this.$loading();
        const signer = this.provider.getSigner();
        const ipnsHashEncoded = encode("ipns-ns", item.key);
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

        this.ensIpns = await this.getEnsIpns(item.name);
        this.setLocalEns(item, this.ensIpns);
      } catch (error) {
        this.onErr(error);
      }
      this.$loading.close();
    },
    onErr(e) {
      console.log(e);
      if (e) this.$alert(e.message);
    },
    async getEnsIpns(domain) {
      if (!this.checkNet()) {
        return;
      }
      try {
        this.$loading();
        this.node = namehash(domain);
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
    async verifyOwner(domain) {
      if (!this.checkNet()) {
        return "";
      }
      try {
        this.$loading();
        console.log(domain);
        this.node = namehash(domain);
        this.provider = getProvider();
        const registry = getENSRegistry(this.provider);
        this.$loading.close();
        return await registry.owner(this.node);
      } catch (error) {
        // this.onErr(error);
        console.log(error);
      }
    },
    async verifyConfigure(item) {
      try {
        this.verifyLoading = true;
        const ensIpns = await this.getEnsIpns(item.name);
        let ensObj = JSON.parse(this.localEnsList());
        let index = ensObj.arr.findIndex((it) => it.domain == item.name);
        let listIndex = this.list.findIndex((it) => it.name == item.name);

        // if (item.key == ensIpns) {
        //   ensObj.arr[index].verify = true;
        // } else {
        //   ensObj.arr[index].verify = false;
        // }

        ensObj.arr[index].verify = true;
        localStorage.setItem("ens-list", JSON.stringify(ensObj));
        this.list[listIndex].verify = true;
      } catch (error) {
        console.log(error);
      }
      this.verifyLoading = false;
    },
    checkNet() {
      const chainId = window.ethereum.chainId;
      if (!chainId) return false;
      let msg = "";
      if (chainId != "0x1") {
        msg = "Wrong network, please connect to Ethereum mainnet";
      }
      if (msg) {
        this.$alert(msg).then(() => {
          this.switchNet(1);
        });
      }
      return !msg;
    },
    async switchNet(id) {
      try {
        const chainId = "0x" + id.toString(16);
        // await this.addChain(chainId, id);
        const res = await window.web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
        if (res && res.error) {
          throw new Error(res.error);
        }
      } catch (error) {
        console.log("switch net error");
        // this.onErr(error).then(() => {
        //   if (error.code === 4902) {
        //     this.switchNet(id);
        //   }
        // });
      }
    },
    showConnect() {
      this.$setState({
        noticeMsg: {
          name: "showMetaConnect",
        },
      });
    },
    initLocalEns() {
      if (!this.localEnsList()) {
        let ensObj = {
          arr: [],
          expire: Date.now() + 3 * 24 * 3600 * 1000,
        };
        localStorage.setItem("ens-list", JSON.stringify(ensObj));
      }
    },
    setLocalEns(item, ipns) {
      let ensObj = JSON.parse(this.localEnsList());
      ensObj.arr.push({
        domain: item.name,
        ipns: item.key,
        verify: item.key == ipns,
      });
      localStorage.setItem("ens-list", JSON.stringify(ensObj));
    },
  },
};
</script>
<style lang="scss" scpoed>
.action-btn {
  padding: 0 !important;
  letter-spacing: 0;
}
.action-btn-reload {
  width: 18px !important;
  min-width: 18px !important;
}
.action-btn-reload .v-btn__loader {
  width: 18px;
}
</style>