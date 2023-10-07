<template>
  <div>
    <e-right-opt-wrap :top="-74" :customStyle="{ right: '-20px' }">
      <div class="al-c ml-8">
        <div>
          <v-text-field
            class="hide-msg bd-1"
            dense
            solo
            clearable
            label="Search"
            prepend-inner-icon="mdi-magnify"
            v-model="keyword"
            @input="handleSearch"
          ></v-text-field>
        </div>
        <ipns-create class="ml-3" @getList="handleSearch" />
      </div>
    </e-right-opt-wrap>
    <v-data-table
      :loading="loading"
      item-key="key"
      :headers="headers"
      :items="list"
      disable-pagination
      hide-default-footer
    >
      <template #item.name="{ item }">
        <a
          :href="'https://' + item.name + '.limo'"
          target="_blank"
          v-if="item.isDomain && item.verify"
          >{{ item.name }}</a
        >
        <span v-else>{{ item.name }}</span>

        <e-tooltip top v-if="item.isDomain && !item.verify">
          <v-icon
            slot="ref"
            color="#333"
            size="18"
            class="pa-1 d-ib ml-2"
            @click="setContentHash(item)"
            >mdi-alert-circle-outline</v-icon
          >
          <span>Set content hash</span>
        </e-tooltip>
        <v-btn
          class="ml-2 action-btn-reload"
          text
          v-if="item.isDomain"
          :loading="item.verifyLoading"
          @click="verifyConfigure(item)"
        >
          <v-icon size="18" color="black">mdi-refresh</v-icon>
        </v-btn>
      </template>
      <template #item.key="{ item }">
        <span style="min-width: 120px; display: inline-block">{{
          item.key.cutStr(5, 8)
        }}</span>
        <v-btn
          v-if="item.key"
          class="e-btn-text ml-2"
          icon
          small
          @click.stop
          v-clipboard="item.key"
          @success="$toast('Copied!')"
        >
          <img src="/img/svg/copy.svg" width="12" />
        </v-btn>
      </template>
      <template #item.value="{ item }">
        <span style="min-width: 120px; display: inline-block">{{
          item.value
            ? item.value.replace(/^(\/ipfs\/)|(\/ipns\/)/, "").cutStr(5, 8)
            : "Nothing published"
        }}</span>
        <v-btn
          v-if="item.value"
          class="e-btn-text ml-2"
          icon
          small
          @click.stop
          v-clipboard="
            () => {
              return item.value.replace(/^(\/ipfs\/)|(\/ipns\/)/, '');
            }
          "
          @success="$toast('Copied!')"
        >
          <img src="/img/svg/copy.svg" width="12" />
        </v-btn>
        <!-- <span v-else></span> -->
      </template>

      <template #item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt * 1000).format() }}</span>
      </template>
      <template v-slot:item.act="{ item }">
        <span class="action-btn" @click="onPublish(item)">Publish</span>
        <span class="action-btn ml-3" @click="onDelete(item)">Delete</span>
      </template>
    </v-data-table>

    <div class="mt-8" v-if="!list.length">
      <e-empty :loading="loading">
        {{ loading ? "Loading..." : "No Data" }}
      </e-empty>
    </div>

    <bottom-detector
      :loadingMore="loadingMore"
      :noMore="!hasNext"
      @arriveBottom="onLoadMore"
    ></bottom-detector>
    <ipns-publish ref="ipnsPublish" @getList="getList(1)" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { namehash } from "@ensdomains/ensjs/dist/cjs/utils/normalise";
import publicResolver from "@ensdomains/ensjs/dist/cjs/contracts/publicResolver";
import { ENS } from "@ensdomains/ensjs/dist/cjs/index";
import { encode } from "@ensdomains/content-hash";
import { getProvider } from "@/plugins/ens";
import debounce from "../../plugins/debounce";
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
        { text: "IPFS Path Published", value: "value" },
        { text: "CreateAt", value: "createdAt" },
        { text: "Action", value: "act" },
      ],
      list: [],
      loading: false,
      keyword: "",
      cursor: 0,
      hasNext: true,
      loadingMore: false,
      total: 0,
      provider: null,
      node: null,
      ensIpns: null,
      curItem: {},
      ENSInstance: null,
    };
  },
  computed: {
    ...mapState({
      connectAddr: (s) => s.connectAddr,
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["walletObj"]),
  },
  created() {
    this.initEns();
  },
  mounted() {
    this.getList();
  },
  methods: {
    async initEns() {
      try {
        const provider = getProvider();
        this.ENSInstance = new ENS();
        await this.ENSInstance.setProvider(provider);
      } catch (error) {
        console.log(error);
      }
    },
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
          "The following IPNS will be deleted irrecoverably. Are you sure you want to proceed?";
        tip += `<p class="mt-4" style="color:#775DA6">${item.name}</p>`;
        await this.$confirm(tip, "Delete IPNS");
        await this.$http.delete(`$ipns/names/${item.key}`);
        this.getList(1);
      } catch (error) {
        //
      }
    },
    async getList(type) {
      if (type) {
        this.cursor = 0;
        this.hasNext = false;
        this.list = [];
      }
      try {
        this.initLocalEns();
        let params = {
          cursor: this.cursor,
          keyword: this.keyword,
        };
        this.loading = true;
        const { data } = await this.$http.get("$ipns/names", {
          params,
        });

        for (const it of data.list) {
          if (/.+\.eth$/.test(it.name)) {
            it.verifyLoading = false;
            it.isDomain = "eth";
            let ensArr = JSON.parse(this.localEnsList()).arr;
            let index = ensArr.findIndex((item) => item.domain == it.name);

            if (index == -1 || this.isExpired()) {
              if (this.isExpired()) {
                localStorage.removeItem("ens-list");
                this.initLocalEns();
              }
              const ensIpns = await this.getEnsIpns(it.name);
              console.log(ensIpns);
              if (ensIpns && ensIpns == it.key) {
                it.verify = true;
              } else {
                it.verify = false;
              }
              this.setLocalEns(it, ensIpns);
            } else {
              it.verify = ensArr[index].verify;
            }
          }
        }

        this.list = this.list.concat(data.list);
        this.cursor = data.page.next;
        this.hasNext = data.page.hasNext;
        this.total = Number(data.page.total);
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
      this.loadingMore = false;
    },
    onLoadMore() {
      if (this.loading) return;
      this.loadingMore = true;
      this.getList();
    },
    async setContentHash(item) {
      this.curItem = item;
      if (!this.connectAddr) {
        return this.showConnect();
      }
      if (!this.checkNet()) return;
      const verify = await this.verifyConfigure(item);
      if (verify) return;
      this.owner = await this.verifyOwner(item.name);
      await this.getEnsIpns(item.name);
      try {
        await this.$confirm(
          `${this.owner.cutStr(6, 4)} is the owner of ${
            item.name
          }. Is that you?`,
          null,
          {
            confirmText: "Yes",
            cancelText: "No",
          }
        );
        if (this.owner !== this.connectAddr) {
          return this.$alert(
            "Connected account is not the controller of the domain. "
          );
        }
        this.$loading();
        const provider = getProvider();
        const signer = provider.getSigner();
        const ipnsHashEncoded = encode("ipns-ns", item.key);
        const node = namehash(item.name);
        const profile = await this.ENSInstance.getProfile(item.name);
        const resolver = profile.resolverAddress;
        const tx = await publicResolver(signer, resolver).setContenthash(
          node,
          `0x${ipnsHashEncoded}`
        );

        this.$loading(`Transaction(${tx.hash.cutStr(4, 3)}) pending`);
        const receipt = await tx.wait();
        console.log(receipt);

        this.ensIpns = await this.getEnsIpns(item.name);
        this.setLocalEns(item, this.ensIpns);
        this.getList(1);
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
      const chainId = this.walletObj.chainId;
      // if (chainId !== "0x1" && chainId !== "0x5") return;

      if (chainId !== "0x1") return;
      try {
        this.$loading();
        const data = await this.ENSInstance.getProfile(domain);
        this.$loading.close();
        console.log(data);
        return data.records.contentHash.decoded;
      } catch (error) {
        this.onErr(error);
      }
    },
    async verifyOwner(domain) {
      if (!this.checkNet()) {
        return;
      }
      try {
        this.$loading();
        const profile = await this.ENSInstance.getOwner(domain);
        this.$loading.close();
        return profile.owner;
      } catch (error) {
        this.onErr(error);
      }
    },
    async verifyConfigure(item) {
      if (!this.checkNet()) {
        return;
      }
      try {
        item.verifyLoading = true;
        const ensIpns = await this.getEnsIpns(item.name);
        let ensObj = JSON.parse(this.localEnsList());
        let index = ensObj.arr.findIndex((it) => it.domain == item.name);
        let listIndex = this.list.findIndex((it) => it.name == item.name);

        if (item.key == ensIpns) {
          ensObj.arr[index].verify = true;
          this.list[listIndex].verify = true;
        } else {
          ensObj.arr[index].verify = false;
          this.list[listIndex].verify = false;
        }

        localStorage.setItem("ens-list", JSON.stringify(ensObj));
        item.verifyLoading = false;
        if (item.key == ensIpns) return true;
        return false;
      } catch (error) {
        console.log(error);
        item.verifyLoading = false;
      }
    },
    checkNet() {
      const chainId = this.walletObj.chainId;
      if (!chainId) return false;
      let msg = "";
      // if (chainId != "0x1" && chainId != "0x5") {
      if (chainId != "0x1") {
        msg =
          "Wrong network, please switch your wallet network to Ethereum mainnet.";
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
        const res = await window.web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
        this.getList(1);
        if (res && res.error) {
          throw new Error(res.error);
        }
      } catch (error) {
        console.log("switch net error");
        this.loading = false;

        this.onErr(error).then(() => {
          if (error.code === 4902) {
            this.switchNet(id);
          }
        });
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

      let index = ensObj.arr.findIndex((it) => it.domain == item.name);
      if (index == -1) {
        ensObj.arr.push({
          domain: item.name,
          ipns: item.key,
          verify: item.key == ipns,
        });
      } else {
        ensObj.arr[index] = {
          domain: item.name,
          ipns: item.key,
          verify: item.key == ipns,
        };
      }

      localStorage.setItem("ens-list", JSON.stringify(ensObj));
    },
    handleSearch() {
      debounce(() => {
        this.getList(1);
      });
    },
  },
  watch: {
    connectAddr(val) {
      if (val) {
        this.setContentHash(this.curItem);
      }
    },
  },
};
</script>
<style lang="scss" scpoed>
$color1: #775da6;
.action-btn {
  cursor: pointer;
  color: $color1;
  padding: 0 !important;
  letter-spacing: 0;
}
.action-btn-reload {
  width: 18px !important;
  min-width: 18px !important;
  padding: 0 !important;
}
.action-btn-reload .v-btn__loader {
  width: 18px;
}
</style>
