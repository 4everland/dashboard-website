<template>
  <div class="billing-monthly-bill-container">
    <div>select</div>

    <div class="d-flex">
      <v-simple-table class="flex-1">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Calories</th>
              <th class="text-left">Calories</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in desserts" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.calories }}</td>
              <td>{{ item.calories }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <div class="pie-info flex-1 ml-6">
        <BillingMonthlyPie />
      </div>
    </div>
  </div>
</template>

<script>
import BillingMonthlyPie from "./billing-monthly-pie.vue";
export default {
  components: {
    BillingMonthlyPie,
  },
  name: "billing-monthly-bill",
  data() {
    return {
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
        },
        {
          name: "Eclair",
          calories: 262,
        },
        {
          name: "Cupcake",
          calories: 305,
        },
        {
          name: "Gingerbread",
          calories: 356,
        },
        {
          name: "Jelly bean",
          calories: 375,
        },
        {
          name: "Lollipop",
          calories: 392,
        },
        {
          name: "Honeycomb",
          calories: 408,
        },
        {
          name: "Donut",
          calories: 452,
        },
        {
          name: "KitKat",
          calories: 518,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.pie-info {
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}
</style>
