<template>
  <div>
    <div class="bdrs-10 ov-h mb-4 pos-r">
      <img
        src="/img/bg/user/reward-hub-bg.png"
        class="w100p img-cover d-b"
        style="max-height: 210px"
      />
      <div class="pos-center link-2 fw-b ta-c w100p" style="max-width: 450px">
        <h1 class="fz-40">Reward Hub</h1>
        <div class="fz-18">Enjoy free resources in 4EVERLAND Reward Hub.</div>
      </div>
    </div>
    <div class="main-wrap">
      <div class="al-c">
        <span class="fw-b mr-2">Ways for Reward</span>
        <e-tooltip top>
          <v-icon slot="ref" color="#888" size="15">mdi-alert-circle</v-icon>
          <span
            >Getting free resources by completing the following tasks and
            resources are valid for one year after completion of tasks.</span
          >
        </e-tooltip>
      </div>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="list"
        hide-default-footer
      >
        <template v-slot:item.status="{ item }">
          <v-btn color="primary" small @click="onAct(item)">To do</v-btn>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "TASK", value: "name" },
        { text: "REWARD", value: "reward" },
        { text: "STATUS", value: "status" },
      ],
      loading: false,
      list: [
        {
          name: "Follow Twitter",
          reward: "1GB IPFS for 12mon",
          status: 1,
        },
        {
          name: "Follow Twitter",
          reward: "1GB IPFS for 12mon",
          status: 1,
        },
      ],
    };
  },
  methods: {
    onAct(it) {
      console.log(it);
    },
  },
};
</script>