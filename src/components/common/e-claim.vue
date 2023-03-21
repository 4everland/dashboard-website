<template>
  <v-dialog v-model="showDialog" max-width="800">
    <div class="reward-hub-content">
      <v-icon
        size="16"
        class="close-icon"
        @click="$emit('update:showDialge', false)"
        >mdi-close</v-icon
      >
      <div class="text">Thank you for registering 4EVERLAND!</div>
      <div class="mb-6 text">
        You have received the following free resource packages which will help
        you better experience 4EVERLAND service. For more free resources? Claim
        them now in Reward Hub!
      </div>
      <v-row class="mt-2">
        <v-col :sm="6" :cols="12" v-for="item in items" :key="item.name">
          <div class="resource-item al-c">
            <img width="28" :src="item.icon" alt="" />
            <span class="resource-item-value ml-2">{{ item.value }}</span>
            <span class="ml-2 fz-12">{{ item.name }}</span>
          </div>
        </v-col>
      </v-row>
      <div class="d-flex justify-center mt-10">
        <v-btn outlined color="primary" min-width="200" @click="handleClaim"
          >Get more</v-btn
        >
        <v-btn
          class="ml-6"
          color="primary"
          min-width="200"
          @click="showDialog = false"
          >Start now</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [
        {
          name: "IPFS Storage",
          value: "25GB",
          icon: require("/public/img/airDrop/ipfs.png"),
        },
        {
          name: "Arweave Storage",
          value: "100MB",
          icon: require("/public/img/airDrop/ar.png"),
        },
        {
          name: "Build Minutes",
          value: "100",
          icon: require("/public/img/airDrop/minutes.png"),
        },
        {
          name: "Recharge Balance",
          value: "100",
          icon: require("/public/img/airDrop/balance.png"),
        },
      ],
    };
  },
  methods: {
    handleClaim() {
      // do some thing request
      console.log(1);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>