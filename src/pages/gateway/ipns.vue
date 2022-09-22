<template>
  <div>
    <e-right-opt-wrap :top="-74">
      <div class="al-c">
        <ipns-create />
        <v-btn color="primary" class="ml-3">
          <img src="/img/svg/gateway/auth.svg" width="12" />
          <span class="ml-1">Auth Token</span>
        </v-btn>
        <div class="ml-3">
          <v-text-field
            class="hide-msg bd-1"
            dense
            solo
            clearable
            label="Search"
            prepend-inner-icon="mdi-magnify"
            v-model="keyword"
          ></v-text-field>
        </div>
      </div>
    </e-right-opt-wrap>
    <v-data-table
      :loading="loading"
      item-key="id"
      :headers="headers"
      :items="list"
      hide-default-footer
    ></v-data-table>
  </div>
</template>

<script>
import IpnsCreate from "@/views/gateway/ipns-create";

export default {
  components: {
    IpnsCreate,
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Access", value: "access" },
        { text: "Past 30 days  of Bandwidth", value: "bandwidth" },
        { text: "Created", value: "created" },
        { text: "Action", value: "act" },
      ],
      list: [],
      loading: false,
      keyword: "",
    };
  },
};
</script>