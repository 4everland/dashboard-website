<template>
  <div>
    <v-card outlined>
      <div class="card-head-1">Details</div>
      <div class="pa-4">
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
              <span class="gray-7 ml-1">{{ item.unit || "GB" }}</span>
            </template>
            <template v-slot:item.pay="{ item }">
              <span>{{ item.pay }}</span>
              <span class="gray-7 ml-1">USD</span>
            </template>
          </v-data-table>
        </e-kv>
        <e-kv class="mt-4" label="Amount">
          <span>{{ info.usdt }}</span>
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
          <a class="color-1 fz-14" target="_blank" href="/">{{
            info.hash.cutStr(6, 6)
          }}</a>
        </e-kv>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
    }),
    list() {
      const list = JSON.parse(this.info.contentJson || "[]");
      return list.map((it) => {
        if (it.cost) it.pay = (it.cost * 1).toFixed(4);
        it.time = "Until used up";
        if (it.effectiveTime) {
          it.time = "Until " + new Date(it.effectiveTime * 1000).format("date");
        }
        if (/build/i.test(it.type)) {
          it.amount = parseInt(it.amount / 60);
          it.unit = "Min";
        } else {
          const obj = this.$utils.getFileSize(it.amount, true);
          it.amount = obj.num;
          it.unit = obj.unit;
        }
        return it;
      });
    },
  },
  data() {
    return {
      headers: [
        {
          text: "Type",
          value: "type",
        },
        {
          text: "Amount",
          value: "amount",
        },
        {
          text: "Pay",
          value: "pay",
        },
        {
          text: "Effective Time",
          value: "time",
        },
      ],
      info: {},
    };
  },
  watch: {
    noticeMsg(obj) {
      if (obj.name == "billRow") {
        this.info = obj.data;
        console.log(this.info);
      }
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        const { id } = this.$route.query;
        this.$loading();
        const { data } = await this.$http.get("$v3/bill/capital/detail/" + id);
        console.log(data);
        data.time = new Date(data.paymentTime * 1000).format("date");
        data.amount = data.usdt;
        this.info = data;
        this.$loading.close();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>