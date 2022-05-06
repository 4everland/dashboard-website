<template>
  <div>
    <v-card outlined>
      <div class="card-head-1">Details</div>
      <div class="pa-4">
        <e-kv label="Content">
          <p class="mb-4">Purchased</p>
          <v-data-table
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
        <e-kv class="mt-6" label="Amount">
          <span>17.5</span>
          <span class="gray-7 ml-2">USD</span>
        </e-kv>
        <e-kv class="mt-4" label="Network">
          <span>Polygon</span>
        </e-kv>
        <e-kv class="mt-4" label="Status">
          <span>Pending</span>
        </e-kv>
        <e-kv class="mt-4" label="Time">
          <span>2022</span>
        </e-kv>
        <e-kv class="mt-4" label="Hash">
          <a class="color-1 fz-14" target="_blank" href="/">xxx...xxx</a>
        </e-kv>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
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
      list: [
        {
          type: "Build Minutes",
          amount: 100,
          pay: 18,
        },
      ],
    };
  },
};
</script>