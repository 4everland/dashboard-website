<template>
  <v-dialog v-model="showDialog" max-width="800">
    <div class="airdrop-content">
      <v-icon size="16" class="close-icon" @click="showDialog = false"
        >mdi-close</v-icon
      >
      <div class="mb-6 text">
        {{
          `Thank you for registering with 4EVERLAND!  You will get the free
        resources package and free airdrops of other resources that will also be
        available to help you better experience 4EVERLAND products. Come to
        Task Hub to get it now!`
        }}
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
        <v-btn color="primary" min-width="200" @click="handleClaim"
          >Claim</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script>
import router from "@/router.js";
export default {
  data() {
    return {
      showDialog: false,
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
          name: "Build Time",
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
    async getAirDrop(data) {
      try {
        await this.$sleep(10);
        this.$setMsg({
          name: "newUser",
          data: {
            tip: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    handleClaim() {
      router.push("/task-hub");
    },
  },
};
</script>

<style lang="scss" scoped>
.airdrop-content {
  position: relative;
  padding: 40px;
  box-sizing: border-box;
  .text {
    color: #0b0817;
    line-height: 36px;
  }
  .close-icon {
    position: absolute;
    top: 33px;
    right: 17px;
  }
  .resource-item {
    position: relative;
    padding: 10px 20px;
    height: 90px;
    color: #898989;
    box-sizing: border-box;
    background: #f9fbfc;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.11);
    border-radius: 10px;
    .resource-item-value {
      font-size: 20px;
      color: #100d58;
    }
  }
  .resource-item::after {
    content: "";
    display: block;
    position: absolute;
    right: 15px;
    top: 10px;
    width: 18px;
    height: 18px;
    background: url("/img/airDrop/check.svg") no-repeat;
  }
}
</style>
