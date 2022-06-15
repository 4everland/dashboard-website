<template>
  <div>
    <div class="al-c ov-a pb-1">
      <v-icon color="#6e7787" size="18" class="mr-2">mdi-alert-circle</v-icon>
      <span class="gray-7 mr-3">Total balance:</span>
      <b class="fz-20 red-1">700</b>
      <span class="gray-6 fz-12 ml-2 mt-1">USDC</span>
      <v-btn color="primary" rounded class="ml-8" @click="showRecharge = true"
        >Recharge</v-btn
      >
      <v-btn outlined rounded class="ml-4">Withdraw</v-btn>
      <a class="ml-auto al-c" href="#/usage/billing/deduction">
        <img src="img/svg/billing/usage-list.svg" width="14" />
        <span class="ml-2 fz-14">Deduction details</span>
      </a>
    </div>

    <div class="mt-6">
      <v-data-table
        :headers="headers"
        :items="list"
        hide-default-footer
        disable-pagination
        @click:row="onItem"
      ></v-data-table>
    </div>

    <v-dialog v-model="showRecharge" max-width="500">
      <e-dialog-close @click="showRecharge = false" />
      <div class="pa-4 pos-r">
        <h3>Recharge</h3>
        <div class="mt-3 bd-1 bg-f8a pa-5 bdrs-8 d-flex al-start">
          <v-icon color="#ff8843" size="22">mdi-alert-circle</v-icon>
          <div class="ml-2">
            <p class="fz-15">
              Recharge will lock your funds. <br />
              When the account resource over used, the excess quantities will be
              deducted. <br />
              You can withdraw your balance at any time.
            </p>
            <div class="mt-4 gray-7 fz-13 lh-11">
              <p>
                * Currently, racharge are only supported on the Polygon network.
              </p>
              <p class="mt-2">* Only supports USDC recharge.</p>
            </div>
          </div>
        </div>
        <div class="mt-4 al-c gray-7">
          <span class="ml-2">Total Balance:</span>
          <b class="fz-20 red-1 mr-1 ml-2">0</b>
          <span class="fz-13 mt-1">USD</span>
          <span class="ml-auto">
            Wallet Banace: 200 <span class="fz-13">USDC</span>
          </span>
        </div>
        <div class="bd-1 mt-3 al-c bdrs-5">
          <div class="al-c bdr-1 pr-4 pl-2">
            <img src="img/svg/billing/ic-polygon.svg" width="26" />
            <span class="ml-2 fz-14">Polygon</span>
          </div>
          <input
            type="tel"
            class="input-1 flex- shrink-1 fz-18 pa-2 pl-4"
            style="width: auto"
          />
          <img src="img/svg/settings/c-usdc.svg" height="24" />
          <span class="ml-2 mr-2 fz-14">USDC</span>
          <v-btn color="primary" small class="mr-2">MAX</v-btn>
        </div>
        <div class="fz-14 mt-2 ml-2 gray-7">
          * Recharge at least 100 USDC
          <span class="red-1">（Insufficient balance）</span>
        </div>
        <div class="mt-4 pa-3">
          <v-btn color="primary" rounded block depressed @click="recharge"
            >Approve</v-btn
          >
          <v-btn class="mt-5" outlined rounded block>Confirm</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import dstcontracts from "@/plugins/pay/contracts/dst-chain-contracts";
export default {
  data() {
    return {
      showRecharge: false,
      headers: [
        {
          text: "Hash",
          value: "hash",
        },
        {
          text: "Content",
          value: "content",
        },
        {
          text: "Amount",
          value: "amount",
        },
        {
          text: "Payment Time",
          value: "time",
        },
        {
          text: "Status",
          value: "status",
        },
      ],
      list: [
        {
          hash: "test",
          content: "test cc",
          amount: 18.5,
          time: "2022",
          status: "success",
        },
      ],
      provider: this.$store.state.userInfo.uid,
      uuid: Buffer.alloc(32, 6),
      core: null,
    };
  },
  created() {},
  methods: {
    onItem(row) {
      this.$navTo(`/usage/billing/detail?hash=` + row.hash);
    },

    async recharge() {
      console.log(1);
      const from = this.$store.state.userInfo.uid;
      if (!from) {
        return;
      }
      console.log(this.provider);
      const isProvider = await dstcontracts.ProviderRegistry.isProvider(
        this.provider
      );

      console.log("isProvider", isProvider);
      // Recharge
      // address provider,
      // uint64 nonce,
      // address owner,
      // bytes32 account,
      // uint256 amount
      // Recharge(address provider,account,uint256 amount)
      const name = "FundPool";
      const version = "V1";
      const chainId = await dstcontracts.signer.getChainId();
      const verifyingContract = dstcontracts.FundPool.address;
      const amount = BigNumber.from((100e6).toString());
      const rechargeSig = await dstcontracts.signer._signTypedData(
        {
          name,
          version,
          chainId,
          verifyingContract,
        },
        {
          Recharge: [
            { name: "provider", type: "address" },
            { name: "account", type: "bytes32" },
            { name: "amount", type: "uint256" },
          ],
        },
        {
          provider: this.provider,
          account: this.uuid,
          amount,
        }
      );
      console.log("rechargeSig", rechargeSig);
      const doaminTypeHash = utils.keccak256(
        Buffer.from(
          "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        )
      );
      const domainStructHash = utils.keccak256(
        utils.defaultAbiCoder.encode(
          ["bytes32", "bytes32", "bytes32", "uint256", "address"],
          [
            doaminTypeHash,
            utils.keccak256(Buffer.from(name)),
            utils.keccak256(Buffer.from(version)),
            chainId,
            verifyingContract,
          ]
        )
      );
      const messageTypes =
        "Recharge(address provider,bytes32 account,uint256 amount)";
      const messageTypeHash = utils.keccak256(Buffer.from(messageTypes));
      const messageStructHash = utils.keccak256(
        utils.defaultAbiCoder.encode(
          ["bytes32", "address", "bytes32", "uint256"],
          [messageTypeHash, this.provider, this.uuid, amount]
        )
      );
      const hash = utils.keccak256(
        Buffer.concat([
          Buffer.from("1901", "hex"),
          Buffer.from(domainStructHash.substring(2), "hex"),
          Buffer.from(messageStructHash.substring(2), "hex"),
        ])
      );
      console.log("hash", hash);
      const cHash = await dstcontracts.FundPool.hashTypedDataV4ForRecharge(
        this.provider,
        this.uuid,
        amount
      );
      console.log("hashTypedDataV4ForRecharge", cHash);
      const sig = rechargeSig;
      const address = utils.recoverAddress(hash, sig);
      console.log("rechargeSig", rechargeSig, "recoverAddress", address);

      const data = dstcontracts.FundPool.interface.encodeFunctionData(
        "recharge",
        [this.provider, this.uuid, amount, sig]
      );
      const receipt = await dstcontracts.sendTransaction({
        to: dstcontracts.FundPool.address,
        data,
      });
      console.log("receipt", receipt);
      const balance = await dstcontracts.FundPool.balanceOf(
        this.provider,
        this.uuid
      );
      console.log("balance", balance.toString());
    },
  },
};
</script>