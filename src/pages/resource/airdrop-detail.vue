<template>
  <div>
    <h3>Details</h3>
    <div v-if="!info">
      <v-skeleton-loader type="article" />
    </div>
    <div v-else>
      <div class="d-flex">
        <e-kv class="flex-1" label="Type">
          <span>{{ info.airdropType }}</span>
        </e-kv>
        <e-kv class="flex-2 ml-2" label="Time">
          <span>{{ info.time }}</span>
        </e-kv>
      </div>

      <div class="d-flex mt-6">
        <e-kv class="flex-1" label="Amount">
          <span>{{ info.cost }}</span>
          <span class="gray-7 ml-2">USDC</span>
        </e-kv>
        <e-kv v-if="info.voucherInfo" class="flex-2 ml-2" label="Credit">
          <span>{{ info.voucherInfo }}</span>
          <span class="gray-7 ml-2">USDC</span>
        </e-kv>
      </div>
      <e-kv class="mt-6 e-table-head-1" label="Resource">
        <div v-if="info.resource">
          {{ info.resource }}
        </div>
        <v-data-table
          class="mb-6"
          v-if="list.length"
          :headers="headers"
          :items="list"
          hide-default-footer
          disable-pagination
        >
          <template v-slot:item.amount="{ item }">
            <span>{{ item.amount }}</span>
            <span class="gray-7 ml-1">{{ item.unit || "" }}</span>
          </template>
          <template v-slot:item.cost="{ item }">
            <span>{{ item.cost }}</span>
            <span class="gray-7 ml-1">USDC</span>
          </template>
        </v-data-table>
      </e-kv>
      <e-kv class="mt-6" label="Status">
        <span>{{ info.status }}</span>
      </e-kv>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    list() {
      const resourceRecord = JSON.parse(this.info.resourceRecord || "{}");
      let arr = [];
      for (const key in resourceRecord) {
        if (key == "IPFS_EFFECTIVE_TIME") continue;
        let resource = {};
        resource.amount = resourceRecord[key];
        resource.cost = "0.00";
        if (key == "IPFS_STORAGE") {
          resource.time =
            "Until " +
            new Date(resourceRecord["IPFS_EFFECTIVE_TIME"] * 1000).format(
              "date"
            );
        }
        resource.type = key;
        const row = this.$utils.getPurchase(resource.type, resource.amount);
        Object.assign(resource, row);
        arr.push(resource);
      }
      console.log(arr);
      return arr;
    },
  },
  data() {
    return {
      headers: [
        {
          text: "Type",
          value: "name",
        },
        {
          text: "Specification",
          value: "amount",
        },
        {
          text: "Amount",
          value: "cost",
        },
        {
          text: "Effective Time",
          value: "time",
        },
      ],
      info: null,
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        const { id } = this.$route.query;
        const { data } = await this.$http.get("$v3/airdrop/" + id);
        data.time = new Date(data.createdAt * 1000).format();
        data.cost = this.$utils.getCost(0);
        data.voucherInfo * 1 > 0
          ? (data.voucherInfo = (data.voucherInfo * 1).toFixed(2))
          : (data.voucherInfo = null);
        data.status = "Success";
        console.log(data);
        // this.setData(data);
        this.info = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>