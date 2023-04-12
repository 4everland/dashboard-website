<template>
  <div>
    <h3>Hash Deployment</h3>
    <v-row class="mt-3">
      <v-col :sm="3" :cols="12"
        ><v-select
          class="ipfs-input hide-msg"
          outlined
          :items="items"
          dense
          @change="onChange"
          v-model="seleted"
        ></v-select
      ></v-col>
      <v-col :sm="7" :cols="12" class="d-flex al-start">
        <v-text-field
          persistent-placeholder
          outlined
          class="hide-msg"
          dense
          label=""
          :placeholder="
            seleted == 'IPFS' ? 'Enter the IPFS CID' : 'Enter the IPNS'
          "
          v-model="ipfsPath"
        ></v-text-field>
      </v-col>
      <v-col :sm="2" :cols="12" class="d-flex al-start">
        <v-btn color="primary" @click="onStart">Start</v-btn>
      </v-col>
    </v-row>
    <div class="fz-14 gray mt-5">Deploy with IPFS, IPNS or ENS</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { namehash } from "@ensdomains/ensjs";
import { decode, getCodec } from "@ensdomains/content-hash";
import { getProvider, getENSRegistry, getResolver } from "@/plugins/ens";
export default {
  data() {
    return {
      items: ["IPFS", "IPNS", "ENS"],
      seleted: "IPFS",
      ipfsPath: "",
      provider: null,
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    walletObj() {
      const { walletType } = this.userInfo.wallet || {};
      return walletType == "OKX" ? window.okxwallet : window.ethereum;
    },
  },
  methods: {
    onChange() {
      console.log("onchange");
    },
    async onStart() {
      try {
        if (this.seleted == "ENS") {
          const { type, hash } = await this.getEnsIpns();
          console.log(type, hash);
          let html = `<div>Deploying with the following ${type}?</div><div>${hash}</div>`;
          await this.$confirm(html, "Resolved successfully");
          this.$emit("onHashStart", {
            hash,
            deployType: type,
          });
        } else {
          // resolve hash
          this.$emit("onHashStart", {
            hash: this.ipfsPath,
            deployType: this.seleted,
          });
        }
      } catch (error) {
        this.onErr(error);
      }
    },

    async getEnsIpns() {
      await this.checkNet();
      this.$loading();
      this.node = namehash(this.ipfsPath);
      this.provider = getProvider();
      const registry = getENSRegistry(this.provider);
      this.owner = await registry.owner(this.node);
      console.log(this.owner);

      this.resolver = await registry.resolver(this.node);
      let contentHash = await getResolver(
        this.resolver,
        this.provider
      ).contenthash(this.node);
      this.$loading.close();
      if (contentHash.substring(2)) {
        const hash = decode(contentHash);
        console.log(hash);
        let type = getCodec(contentHash);
        type = type == "ipns-ns" ? "IPNS" : "IPFS";
        return { hash, type };
      } else {
        throw new Error(
          "The Content Hash for this ENS is not IPFS or IPNS, please reenter."
        );
      }
    },
    async checkNet() {
      const chainId = this.walletObj.chainId;
      const finalChainId = this.$inDev ? "0x5" : "0x1";
      if (chainId != finalChainId) {
        await this.$alert(
          "Wrong network, please switch your wallet network to Ethereum mainnet."
        );
        await this.switchNet(finalChainId);
      }
    },
    async switchNet(id) {
      try {
        const res = await window.web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: id }],
        });
        if (res && res.error) {
          throw new Error(res.error);
        }
      } catch (error) {
        console.log("switch net error", error);
        throw new Error(error.message);
      }
    },
    onErr(e) {
      if (e) {
        this.$alert(e.message, "The ENS resolution result");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>