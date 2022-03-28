<template>
  <div class="wrap-1">
    <div class="con-3">
      <v-dialog max-width="420" v-model="showPop">
        <div class="pd-10-20 bg-gray-e d-flex al-c">
          <b class="fz-14">{{ curItem.title }}</b>
          <div class="ml-auto pa-1 hover-1" @click="showPop = false">
            <v-icon size="20">mdi-close</v-icon>
          </div>
        </div>
        <div class="pd-20">
          <v-img :src="curItem.img" class="w100p d-b mb-3" max-height="360" />
          <v-row>
            <v-col cols="12" md="5">
              <h4>Description</h4>
              <div class="pa-1 mt-1 bg-f5 gray-3 fz-13">
                {{ curItem.desc }}
              </div>
            </v-col>
            <v-col cols="12" md="7">
              <h4>Details</h4>
              <div
                class="mt-2 d-flex al-c space-btw fz-12"
                v-for="(it, i) in introList"
                :key="i"
              >
                <span class="gray">{{ it.label }}</span>
                <span
                  class="color-1 hover-1"
                  v-clipboard="it.value"
                  @success="$toast('Copied')"
                  >{{ it.value.cutStr(6, 4) }}</span
                >
              </div>
            </v-col>
          </v-row>
        </div>
      </v-dialog>

      <v-alert
        border="bottom"
        colored-border
        type="error"
        elevation="2"
        v-if="walletTip"
      >
        {{ walletTip }}
      </v-alert>

      <div class="ta-c pa-10" v-if="!list.length">
        <e-empty title="No NFTs to display">
          <div>Please follow us for future limited NFT</div>
          <div class="mt-6" v-if="!connectAddr">
            <v-btn color="primary" small rounded @click="showConnect()"
              >Connect Wallet</v-btn
            >
          </div>
        </e-empty>
      </div>
      <div v-else class="pb-3">
        <p class="fz-14 fw-b mb-4">Total: {{ total }}</p>
        <v-row>
          <v-col cols="12" md="4" v-for="(it, i) in list" :key="i">
            <v-card @click="onItem(it)">
              <v-img :src="it.img" height="280"></v-img>
              <div class="pd-15-20">
                <p class="fz-15 gray-6">
                  <b>{{ it.title }}</b>
                  <span class="gray-6 ml-1 fz-12" v-if="it.num > 1"
                    >× {{ it.num }}</span
                  >
                </p>
                <!-- <p class="gray fz-12">{{ it.title }} #{{ it.id }}</p> -->
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      showPop: false,
      total: 0,
      list: [],
      curItem: {},
      contractAddr: "",
    };
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
      connectAddr: (s) => s.connectAddr,
      walletTip: (s) => s.walletTip,
    }),
    introList() {
      return [
        {
          label: "Owned by",
          value: this.connectAddr,
        },
        {
          label: "Contract Address",
          value: this.contractAddr,
        },
        {
          label: "Token Standard",
          value: "ERC-1155",
        },
        {
          label: "Blockchain",
          value: "Ethereum",
        },
      ];
    },
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "walletConntect") {
        this.onInit();
      }
    },
    walletTip(val) {
      if (!val) {
        this.onInit();
      }
    },
    "$route.path"(val) {
      if (val == "/dashboard/collections") {
        this.onInit();
      }
    },
  },
  created() {
    this.onInit();
  },
  methods: {
    showConnect() {
      this.$setMsg({
        name: "showMetaConnect",
      });
    },
    async onInit() {
      if (!this.connectAddr) {
        this.showConnect();
        this.list = [];
        return;
      }
      try {
        this.$loading();
        const { data } = await this.$http.get(
          "https://4ever-web.4everland.store/nft/tever-1155.json"
        );
        this.contractAddr = data.address;
        const contract = new window.web3.eth.Contract(data.abi, data.address);
        const nftId = 0;
        let num = await contract.methods.balanceOf(this.connectAddr, 0).call();
        console.log("balance of #" + nftId, num);
        this.total = num;
        let list = [];
        if (num > 0) {
          list.push({
            title: "Firstlanding",
            id: nftId,
            num,
            img: "https://4ever-web.4everland.store/nft/nft0.gif",
            desc: "NFT Firstlanding",
          });
        }
        this.list = list;
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
    onItem(it) {
      this.curItem = it;
      this.showPop = true;
    },
  },
};
</script>