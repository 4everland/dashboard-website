<template>
  <div>
    <v-skeleton-loader type="article" v-if="domainLoading" />
    <div v-else>
      <div class="bd-1 mb-5">
        <div class="d-flex justify-space-between">
          <h3>Decentralized Domains</h3>
          <span>
            <img
              class="mx-2"
              style="cursor: pointer"
              v-for="item in items"
              :key="item.key"
              :src="require(`@/assets/domain/icon/${item.key}.svg`)"
              @click="seleted = item.key"
            />
          </span>
        </div>
        <div class="mt-5">
          <div class="d-flex">
            <div class="mr-4" style="width: 200px">
              <v-select
                class="ipfs-input hide-msg"
                outlined
                :items="items"
                item-text="name"
                item-value="key"
                dense
                @change="handleChangeSelect"
                v-model="seleted"
              ></v-select>
            </div>
            <v-text-field
              outlined
              dense
              v-model.trim="domain"
              @keyup.enter="onAdd"
              :placeholder="`${seleted.toUpperCase()} Domain`"
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
      </div>
      <div class="bd-1 mb-5" v-for="item in domainList" :key="item.id">
        <template>
          <div class="mb-6 mt-3">
            <div class="d-flex al-c flex-wrap">
              <div class="mr-auto d-flex">
                <img
                  :src="require(`@/assets/domain/icon/${item.type}.svg`)"
                  class="mr-2"
                />
                <div class="mr-auto">
                  <a
                    v-if="item.type == 'ens' || item.type == 'sns'"
                    :class="
                      item.content == item.ipns ||
                      item.content == hashV0toV1(item.ipfs)
                        ? ''
                        : 'disabled'
                    "
                    :href="toHref(item)"
                    target="_blank"
                    >{{ item.domain }}</a
                  >
                  <a v-else :href="toHref(item)" target="_blank">{{
                    item.domain
                  }}</a>
                </div>
                <div
                  class="d-flex al-c ml-2"
                  v-if="item.type == 'ens' || item.type == 'sns'"
                >
                  <v-icon
                    v-if="
                      item.content == item.ipns ||
                      item.content == hashV0toV1(item.ipfs)
                    "
                    color="
                         success
                    "
                    size="18"
                  >
                    mdi-check-circle
                  </v-icon>
                  <v-tooltip bottom v-else>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="
                     
                             error
                        "
                        size="18"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-information
                      </v-icon>
                    </template>
                    <span>{{
                      `${
                        item.domain
                      } has the different hash on ${item.type.toUpperCase()}`
                    }}</span>
                  </v-tooltip>
                </div>
              </div>
              <div>
                <div class="text-center">
                  <v-menu offset-y open-on-hover>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <!-- <v-list-item
                        link
                        v-clipboard="info.cid"
                        @success="$toast('Copied!')"
                      >
                        <span>Copy CID</span>
                      </v-list-item> -->
                      <v-list-item
                        v-if="item.type == 'ens' || item.type == 'sns'"
                        link
                        @click="verifyConfiguration(item)"
                      >
                        <span>Verify Configuration</span>
                      </v-list-item>
                      <v-list-item link @click="onRemove(item)">
                        <span class="red-1">Remove</span>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              class="gray mt-1 fz-14"
              v-if="item.type == 'ens' || item.type == 'sns'"
            >
              Set the {{ item.type.toUpperCase() }} content hash by clicking
              on"Bind" or copying the hash to
              <a :href="getDomainByType(item.type).host" target="_blank">{{
                getDomainByType(item.type).host.replace("https://", "")
              }}</a
              >.
            </div>
            <div class="gray mt-1 fz-14" v-else>
              Copy the hash to
              <a :href="getDomainByType(item.type).host" target="_blank">{{
                getDomainByType(item.type).host.replace("https://", "")
              }}</a>
              for binding.
            </div>
            <div class="d-flex al-c mt-4">
              <div class="gray mt-1 fz-14">
                <span>IPNS:</span>
                <span>{{ item.ipns.cutStr(6, 4) }}</span>
                <img
                  src="/img/svg/copy.svg"
                  width="12"
                  class="ml-3 hover-1"
                  @success="$toast('Copied!')"
                  v-clipboard="item.ipns"
                />
                <v-btn
                  v-if="item.type == 'ens' || item.type == 'sns'"
                  @click="onBind(item, 'ipns')"
                  rounded
                  x-small
                  color="primary"
                  class="ml-4"
                  :disabled="item.content == item.ipns"
                >
                  {{ item.content == item.ipns ? "Bound" : "Bind" }}
                </v-btn>
              </div>
              <div class="gray mt-1 fz-14 ml-10">
                <span>IPFS:</span>
                <span>{{ item.ipfs.cutStr(6, 4) }}</span>
                <img
                  src="/img/svg/copy.svg"
                  width="12"
                  class="ml-3 hover-1"
                  @success="$toast('Copied!')"
                  v-clipboard="item.ipfs"
                />
                <v-btn
                  v-if="item.type == 'ens'"
                  @click="onBind(item, 'ipfs')"
                  rounded
                  x-small
                  color="primary"
                  class="ml-4"
                  :disabled="item.content == hashV0toV1(item.ipfs)"
                >
                  {{ item.content == hashV0toV1(item.ipfs) ? "Bound" : "Bind" }}
                </v-btn>
              </div>
            </div>
            <div class="d-flex al-c space-btw mt-2" v-if="item.owner">
              <div class="gray mt-1 fz-14">
                <span>Owner:</span>
                <span>{{ item.owner.cutStr(6, 4) }}</span>
              </div>
              <!-- <v-btn
              @click="setContentHash"
              color="primary"
              class="ml-4"
              style="margin-top: 2px"
            >
              Set content hash
            </v-btn> -->
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { namehash } from "@ensdomains/ensjs";
import { encode, decode, helpers } from "@ensdomains/content-hash";
import { getProvider, getENSRegistry, getResolver } from "@/plugins/ens";

import {
  getOwner,
  getConnect,
  getResolveData,
  domainUpdate,
  ipfsRecordUpdate,
  sendTransaction,
} from "@/plugins/sns";

const domainOptions = require("@/assets/domain/domainList.json");
export default {
  data() {
    return {
      domain: "",
      adding: false,
      info: null,
      domainLoading: false,
      domainList: [],
      resolveData: "",
      owner: "",
      seleted: "ens",
      items: domainOptions.list,
      showDialog: false,
      tempItem: null,
      tempType: "",
    };
  },
  computed: {
    ...mapState({
      connectAddr: (s) => s.connectAddr,
      userInfo: (s) => s.userInfo,
      projectInfo: (s) => s.projectInfo,
    }),
    walletObj() {
      const { walletType } = this.userInfo.wallet || {};
      return walletType == "OKX" ? window.okxwallet : window.ethereum;
    },
    baseHash() {
      if (this.hashDeploy) {
        return this.projectInfo.ipfsPath
          .replace("/ipfs/", "")
          .replace("/ipns/", "");
      } else {
        return this.projectInfo.hash;
      }
    },
    hashDeploy() {
      return (
        this.projectInfo.deployType == "CID" ||
        this.projectInfo.deployType == "IPNS"
      );
    },
  },
  watch: {
    connectAddr(val) {
      if (val) {
        if (this.tempItem) {
          this.setEnsContentHash(this.tempItem, this.tempType);
        }
      }
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        const { id } = this.$route.params;
        this.domainLoading = true;
        const { data } = await this.$http.get(
          "$hosting/project/decentralized/domain",
          {
            params: {
              projectId: id,
            },
          }
        );
        this.domainList = data.domainList;
        this.domainLoading = false;
      } catch (error) {
        //
      }
    },
    async setInfo(owner, content) {
      try {
        const { id } = this.$route.params;
        const type = this.seleted;
        let body = {
          projectId: id,
          domain: this.domain,
          content,
          type,
          owner,
        };
        await this.$http.post("$hosting/project/decentralized/domain", body);
        this.domain = "";
        this.getInfo();
      } catch (error) {
        //
      }
    },
    async updateInfo(obj) {
      try {
        await this.$http.put(
          `$hosting/project/decentralized/domain?id=${obj.id}&content=${obj.content}&owner=${obj.owner}`
        );
        // await this.$http.put("$hosting/project/decentralized/domain", body);
        this.getInfo();
      } catch (error) {
        //
      }
    },
    async verifyConfiguration(item) {
      if (item.type == "ens") {
        this.verifyEnsConfiguration(item);
      }
      if (item.type == "sns") {
        this.verifySnsConfiguration(item);
      }
    },
    async verifyEnsConfiguration(item) {
      // if (!this.connectAddr) {
      //   await this.showConnect();
      //   return;
      // }
      if (!this.checkNet()) {
        return;
      }
      this.$loading();
      const ensIpns = await this.getEnsIpns(item.domain);
      const owner = await this.verifyEnsOwner(item.domain);
      let Obj = {
        id: item.id,
        content: ensIpns ? ensIpns : "",
        owner: owner,
      };
      await this.updateInfo(Obj);
      this.$loading.close();
    },
    async verifySnsConfiguration(item) {
      this.$loading();
      const resolveData = await getResolveData(item.domain);
      const owner = await this.verifySnsOwner(item.domain);
      let Obj = {
        id: item.id,
        content: resolveData,
        owner: owner,
      };
      this.updateInfo(Obj);
      this.$loading.close();
    },
    async onRemove(item) {
      try {
        await this.$confirm(
          `${item.domain} will be removed. Are you sure you want to continue?`
        );
        this.$loading();
        await this.$http.delete("$hosting/project/decentralized/domain", {
          params: {
            ids: item.id,
          },
        });
        this.$toast("Removed successfully");
        this.getInfo();
      } catch (error) {
        //
      }
      this.$loading.close();
    },
    async onAdd() {
      if (this.projectInfo.state != "SUCCESS") {
        return this.$alert(
          "Domain can only be added when the project has been successfully deployed."
        );
      }
      const type = this.seleted;
      const domainObj = this.items.find((item) => {
        return item.key == type;
      });
      const reg = new RegExp(domainObj.rule);
      if (!reg.test(this.domain)) {
        return this.$alert("The domain name you entered is invalid.");
      }
      if (type == "ens") {
        this.onAddEns();
      } else if (type == "sns") {
        this.onAddSns();
      } else {
        this.setInfo();
      }
    },
    async onAddEns() {
      if (!this.checkNet()) {
        return;
      }
      const domain = this.domain;
      const owner = await this.verifyEnsOwner(domain);
      if (!owner || owner == 0) {
        return this.$alert("Invalid ETH Domain");
      }
      this.$confirm(
        `${owner.cutStr(6, 4)} is the owner of ${domain}. Is that you?`
      ).then(async () => {
        const resolveData = await this.getEnsIpns(domain);
        await this.setInfo(owner, resolveData);
      });
    },
    async onAddSns() {
      const domain = this.domain;
      let hostnameArray = domain.split(".");
      if (hostnameArray.length !== 2) {
        return this.$alert("The domain name you entered is invalid.");
      }
      const owner = await this.verifySnsOwner(domain);
      if (!owner) {
        return this.$alert("Invalid SNS Domain");
      }
      this.$confirm(
        `${owner.cutStr(6, 4)} is the owner of ${domain}. Is that you?`
      ).then(async () => {
        const resolveData = await getResolveData(domain);
        await this.setInfo(owner, resolveData);
      });
    },
    async verifyEnsOwner(domain) {
      if (!this.checkNet()) {
        return;
      }
      try {
        this.$loading();
        const node = namehash(domain);
        const provider = getProvider();
        const registry = getENSRegistry(provider);
        this.$loading.close();
        return await registry.owner(node);
      } catch (error) {
        this.onErr(error);
      }
    },
    async verifySnsOwner(domain) {
      try {
        this.$loading();
        const owner = await getOwner(domain);
        this.$loading.close();
        return owner;
      } catch (error) {
        this.onErr(error);
      }
    },
    async getEnsIpns(domain) {
      if (!this.checkNet()) {
        return;
      }
      try {
        this.$loading();
        const node = namehash(domain);
        const provider = getProvider();
        const registry = getENSRegistry(provider);
        // const owner = await registry.owner(node);
        const resolver = await registry.resolver(node);
        let contentHash = await getResolver(resolver, provider).contenthash(
          node
        );
        this.$loading.close();
        if (contentHash.substring(2)) {
          const res = decode(contentHash);
          return res;
        }
      } catch (error) {
        this.onErr(error);
      }
    },
    async onBind(item, type) {
      if (item.type == "ens") {
        this.setEnsContentHash(item, type);
      }
      if (item.type == "sns") {
        this.setSnsContentHash(item);
      }
    },
    async setEnsContentHash(item, type) {
      this.showDialog = false;
      this.tempItem = null;
      this.tempType = "";
      if (!this.connectAddr) {
        this.tempItem = item;
        this.tempType = type;
        await this.showConnect();
        return;
      }
      if (!this.checkNet()) {
        return false;
      }
      if (item.owner !== this.connectAddr) {
        return this.$alert(
          "Connected account is not the controller of the domain. "
        );
      }
      try {
        this.$loading();
        let Obj = {
          id: item.id,
          content: "",
          owner: "",
        };
        const provider = getProvider();
        const signer = provider.getSigner();
        let ipnsHashEncoded = "";
        if (type == "ipns") {
          ipnsHashEncoded = encode("ipns-ns", item.ipns);
          Obj.content = item.ipns;
        } else {
          ipnsHashEncoded = encode("ipfs-ns", item.ipfs);
          Obj.content = item.ipfs;
        }
        const node = namehash(item.domain);
        const registry = getENSRegistry(provider);
        const resolver = await registry.resolver(node);
        const data = getResolver(
          resolver,
          provider
        ).interface.encodeFunctionData("setContenthash", [
          node,
          `0x${ipnsHashEncoded}`,
        ]);
        const from = await signer.getAddress();
        const tx = await signer.sendTransaction({
          to: resolver,
          from,
          data,
        });

        this.$loading(`Transaction(${tx.hash.cutStr(4, 3)}) pending`);
        const receipt = await tx.wait();
        console.log(receipt);
        await this.updateInfo(Obj);
      } catch (error) {
        this.onErr(error);
      }
      this.$loading.close();
    },
    async setSnsContentHash(item) {
      this.$loading();
      try {
        const accountAddr = await getConnect();
        if (accountAddr != item.owner) {
          return this.$alert(
            "Connected account is not the controller of the domain. "
          );
        }
        const transaction = await ipfsRecordUpdate(item.domain, item.ipns);
        console.log(transaction);
        const result = await sendTransaction(transaction);
        console.log(result);
        if (result) {
          const resolveData = await getResolveData(item.domain);
          const owner = await this.verifySnsOwner(item.domain);
          let Obj = {
            id: item.id,
            content: resolveData,
            owner: owner,
          };
          this.updateInfo(Obj);
        }
      } catch (error) {
        console.log(error);
        return this.$alert(error.message);
      }
      this.$loading.close();
    },
    showConnect() {
      this.$setState({
        noticeMsg: {
          name: "showMetaConnect",
        },
      });
    },
    checkNet() {
      const chainId = this.walletObj.chainId;
      if (!chainId) return false;
      let msg = "";
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
    onErr(e) {
      console.log(e);
      if (e) this.$alert(e.message);
    },
    handleChangeSelect() {
      this.domain = "";
    },
    async toHref(domainObj) {
      let rule = {};
      rule = this.items.find((item) => {
        return domainObj.type == item.key;
      });
      const fn = eval("(" + rule?.network + ")");
      return fn(domainObj.domain);
    },
    getDomainByType(type) {
      return this.items.find((item) => {
        return item.key == type;
      });
    },
    hashV0toV1(baseHash) {
      const hash = /^Qm[a-zA-Z0-9]{44}/.test(baseHash)
        ? helpers.cidV0ToV1Base32(baseHash)
        : baseHash;
      return hash;
    },
  },
};
</script>
<style scoped>
a.disabled {
  pointer-events: none;
  color: #666;
  filter: alpha(opacity=50);
  -moz-opacity: 0.5;
  opacity: 0.5;
}
.ipfs-input ::v-deep .v-input__slot {
  background: #f7f7f7 !important;
  border-radius: 2px;
  box-shadow: none !important;
}
</style>
