<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="list"
      hide-default-footer
      disable-pagination
    >
    </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
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
      list: [],
    };
  },
};
</script>