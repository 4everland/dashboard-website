<template>
  <div>
    <v-card outlined>
      <div class="card-head-1">Details</div>
      <div class="pa-4" v-if="!info">
        <v-skeleton-loader type="article" />
      </div>
      <div class="pa-4" v-else>
        <e-kv label="Content">
          <p>{{ info.contentType }}</p>
          <v-data-table
            class="mt-4 mb-6"
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
              <span class="gray-7 ml-1">USD</span>
            </template>
          </v-data-table>
        </e-kv>
        <e-kv class="mt-4" label="Amount">
          <span>{{ info.cost }}</span>
          <span class="gray-7 ml-2">USD</span>
        </e-kv>
        <e-kv class="mt-4" label="Network">
          <span>Polygon</span>
        </e-kv>
        <e-kv class="mt-4" label="Status">
          <span>{{ info.status }}</span>
        </e-kv>
        <e-kv class="mt-4" label="Time">
          <span>{{ info.time }}</span>
        </e-kv>
        <e-kv class="mt-4" label="Hash">
          <a
            class="color-1 fz-14"
            target="_blank"
            :href="$getPolygonUrl(info.hash)"
            >{{ (info.hash || "").cutStr(6, 6) }}</a
          >
          <v-btn
            v-if="info.hash"
            class="ml-2 pos-r"
            style="top: -1px"
            icon
            x-small
            v-clipboard="info.hash"
            @success="$toast('Copied to clipboard !')"
          >
            <img src="img/svg/copy.svg" width="11" />
          </v-btn>
        </e-kv>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  computed: {
    list() {
      const list = JSON.parse(this.info.contentJson || "[]");
      return list.map((it) => {
        it.cost = this.$utils.getCost(it.cost);
        it.time = "Until used up";
        if (it.effectiveTime) {
          it.time = "Until " + new Date(it.effectiveTime * 1000).format("date");
        }
        let amount = it.overuse || it.amount;
        if (/ipfs/i.test(it.type)) {
          amount /= 3600;
        }
        const row = this.$utils.getPurchase(it.type, amount);
        Object.assign(it, row);
        return it;
      });
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
          text: "Amount",
          value: "amount",
        },
        {
          text: "Cost",
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
        const { data } = await this.$http.get("$v3/bill/capital/detail/" + id);
        console.log(data);
        data.time = new Date(data.paymentTime * 1000).format();
        data.cost = this.$utils.getCost(data.usdt);
        this.info = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>