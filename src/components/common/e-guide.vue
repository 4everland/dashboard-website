<template>
  <div>
    <v-dialog v-model="showDialog" max-width="700" persistent>
      <div class="reward-hub-content pos-r">
        <h3>Thank You for Registering!</h3>
        <v-icon
          size="18"
          class="cursor-p"
          @click="showDialog = false"
          style="position: absolute; top: 30px; right: 30px"
          >mdi-close</v-icon
        >
        <div class="mt-4 fz-14 lh-2">
          4EVERLAND offers free resource packages that help you better
          experience its services. Claim them now.
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
        <div class="d-flex justify-center mt-8">
          <e-menu open-on-hover offset-y>
            <v-btn slot="ref" color="primary" dark width="500px">
              <span class="ml-2">Upgrade now</span>
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
            <v-list>
              <v-list-item link @click="handlePloygonClaim">
                <v-list-item-title class="fz-14 al-c justify-center">
                  <img
                    src="/img/svg/billing/ic-polygon-0.svg"
                    width="18"
                    alt=""
                  />
                  <span class="ml-3">Ploygon Claim</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item link @click="handleZkSyncClaim">
                <v-list-item-title class="fz-14 al-c justify-center">
                  <div class="al-c mx-auto">
                    <img src="/img/svg/logo-no-letters.svg" width="20" alt="" />
                    <span class="ml-3">zkSync Lite(V1) Claim</span>
                  </div>
                  <e-tooltip right>
                    <v-icon slot="ref" size="18" color="#333" class="pa-1 d-ib"
                      >mdi-alert-circle-outline</v-icon
                    >
                    <span
                      >Please ensure that you have sufficient ETH in zkSync
                      Lite. Interaction with the zkSync network will rely on
                      cross-chain communication services to complete on-chain
                      identity registration on Polygon.</span
                    >
                  </e-tooltip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </e-menu>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { bus } from "@/utils/bus";
import { mapState } from "vuex";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
import mixin from "@/pages/more/mixin-register";

export default {
  mixins: [mixin],
  data() {
    return {
      driver: new Driver({
        className: "guide-class",
        nextBtnText: "Next",
        closeBtnText: "Skip",
        // doneBtnText: "Get more",
        allowClose: false,
        padding: 0,
      }),
      steps: [
        {
          element: "#drawerList",
          popover: {
            title: "Menu bar",
            description: `<div class="description-content">In the 4EVERLAND world, you can experience project deployment services from 4EVER-Hosting, permanent storage services from 4EVER-Bucket, dedicated gateway and network resource services, as well as Dahboard's quick start operations and visualisation of project statistics.</div>
            <span class="paging">(1/7)</span>
            </div>`,
            position: "right",
          },
          onNext: () => {
            this.driver.preventMove();
            bus.$emit("sidebar-item", "group-1");
            setTimeout(() => {
              this.driver.refresh();
              this.driver.moveNext();
              this.stepCount += 1;
            }, 250);
          },
        },
        {
          element: "#group-1",
          popover: {
            title: "Hosting",
            description: `<div class="description-content">You can quickly host websites and applications on IPFS, Arweave or Dfinity via Git, Template or IPFS Path, review the UV, PV and other statistics of the hosted project.</div>
            <span class="paging">(2/7)</span>
            </div>`,
            position: "right",
          },
          onNext: () => {
            bus.$emit("sidebar-item", "group-2");
            this.driver.preventMove();
            setTimeout(() => {
              this.driver.refresh();
              this.driver.moveNext();
              this.stepCount += 1;
            }, 250);
          },
        },
        {
          element: "#group-2",
          popover: {
            title: "Storage",
            description: `<div class="description-content">4EVER Storage has s3-compatible IPFS and AR Bucket, as well as the 4EVER Pin service based on IPFS Pinning Service.</div>
            <span class="paging">(3/7)</span>
            </div>`,
            position: "right",
          },
          onNext: () => {
            bus.$emit("sidebar-item", "group-3");
            this.driver.preventMove();
            setTimeout(() => {
              this.driver.refresh();
              this.driver.moveNext();
              this.stepCount += 1;
            }, 250);
          },
        },
        {
          element: "#group-3",
          popover: {
            title: "Gateway",
            description: `<div class="description-content">In addition, within the Gataway service, 4EVERLAND offers a customised IPFS dedicated gateway with global acceleration, providing IPNS creation, publishing, keep-alive and other management functions to better help you improve access performance.</div>
            <span class="paging">(4/7)</span>
            </div>`,
            position: "right",
          },
          onNext: () => {
            bus.$emit("guide");
            this.driver.preventMove();
            setTimeout(() => {
              this.driver.refresh();
              this.driver.moveNext();
              this.stepCount += 1;
            }, 250);
          },
        },
        {
          element: "#team-guide",
          popover: {
            title: "Account",
            description: `<div class="description-content">Switch your owner account and member account here.</div>
            <span class="paging">(5/7)</span>
            </div>`,
            position: "top",
          },
          onNext: () => {
            bus.$emit("guide");
            this.driver.preventMove();
            setTimeout(() => {
              this.driver.refresh();
              this.driver.moveNext();
              this.stepCount += 1;
            }, 250);
          },
        },
        {
          element: "#resourse-guide",
          popover: {
            title: "Resource",
            description: `<div class="description-content">You can easily purchase resources and deposit your balance through other public chains such as Polygon, Ethereum, BSC, etc., and see clearly the balance of resources purchased and resources consumed.</div>
            <span class="paging">(6/7)</span>
            </div>`,
            position: "left",
          },
          onNext: () => {
            // this.driver.preventMove();
            // setTimeout(() => {
            //   this.driver.refresh();
            //   this.driver.moveNext();
            //   this.stepCount += 1;
            // }, 250);
            this.showDialog = true;
          },
        },
        // {
        //   element: "#reward-guide",
        //   popover: {
        //     className: "reward-guide-class",
        //     title: "Reward Hub",
        //     description: `<div class="airdrop-content">
        //         <div class=" mb-6 fz-14 lh-2">Thank You for Registering!
        //         We have free resource packages for you in the Reward Hub!</div>
        //       <div class="row mt-2">
        //       <div class="col-sm-6 col-12"><div class="resource-item al-c"><img width="28" src="img/airDrop/ipfs.png" alt=""><span class="resource-item-value ml-2">25GB</span><span class="resource-text fz-12">IPFS Storage</span></div>
        //       </div>
        //       <div class="col-sm-6 col-12"><div class="resource-item al-c"><img  width="28" src="/img/airDrop/ar.png" alt=""><span class="resource-item-value ml-2">100MB</span><span  class="resource-text fz-12">Arweave Storage</span></div>
        //       </div>
        //       <div class="col-sm-6 col-12"><div class="resource-item al-c"><img width="28" src="/img/airDrop/minutes.png" alt=""><span  class="resource-item-value ml-2">100Min</span><span class="resource-text fz-12">Build Minutes</span></div>
        //       </div>
        //       <div class="col-sm-6 col-12"><div class="resource-item al-c"><img width="28" src="/img/airDrop/balance.png" alt=""><span  class="resource-item-value ml-2">100</span><span class="resource-text fz-12">Recharge Balance</span>
        //       </div>
        //     </div>
        //     `,
        //     // showButtons: false,
        //     closeBtnText: "Start now",
        //     nextBtnText: "Get more",
        //     position: "left",
        //   },
        //   onNext: () => {
        //     this.$router.push("/reward-hub");
        //   },
        // },
      ],
      stepCount: 0,
      items: [
        {
          name: "IPFS Storage",
          value: "6GB",
          icon: require("/public/img/airDrop/ipfs.png"),
        },
        {
          name: "Arweave Storage",
          value: "100MB",
          icon: require("/public/img/airDrop/ar.png"),
        },
        {
          name: "Build Minutes",
          value: "250Min",
          icon: require("/public/img/airDrop/minutes.png"),
        },
        {
          name: "Bandwidth",
          value: "100GB",
          icon: require("/public/img/airDrop/balance.png"),
        },
      ],
      showDialog: false,
    };
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
    }),
  },
  watch: {
    "driver.isActivated"(val) {
      if (!val) {
        bus.$emit("guide");
        this.move();
      }
      if (this.stepCount != 5 && !val) {
        this.showDialog = true;
      }
    },
  },
  methods: {
    onGuide() {
      this.driver.start();
      this.stop();
    },
    guide() {
      this.driver.defineSteps(this.steps);
      this.onGuide();
    },
    stop() {
      let mo = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.addEventListener("touchmove", mo, false);
    },
    move() {
      let mo = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.removeEventListener("touchmove", mo, false);
    },
    async handlePloygonClaim() {
      try {
        const register = await this.isRegister();
        if (register) return (this.showDialog = false);
        const claimStatus = await this.handleClaim();
        if (claimStatus) {
          this.showDialog = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async handleZkSyncClaim() {
      try {
        const register = await this.isRegister();
        if (register) return (this.showDialog = false);
        const claimStatus = await this.handleZkClaim();
        if (claimStatus) {
          this.showDialog = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss">
div#driver-highlighted-element-stage,
div#driver-page-overlay {
  background: transparent !important;
  outline: 5000px solid rgba(0, 0, 0, 0.75);
  z-index: 100013 !important;
}
.driver-next-btn {
  border-radius: 4px !important;
}
.driver-close-btn {
  border-radius: 4px !important;
}
.guide-class {
  max-width: 400px !important;
  .driver-next-btn {
    background: #634695 !important;
    border: none !important;
    text-shadow: none !important;
    // border-radius: 0 !important;
    color: #fff !important;
    font-size: 14px !important;
    padding: 4px 20px !important;
  }
  .driver-prev-btn {
    display: none !important;
  }
  .driver-close-btn {
    padding: 3px !important;
    font-size: 14px !important;
    color: #889ab3 !important;
    background: #fff !important;
    border: none !important;
  }
}
.reward-guide-class {
  max-width: 600px !important;
  .driver-navigation-btns {
    margin: 20px 0 !important;
    .driver-next-btn {
      padding: 8px 20px !important;
      background: #fff !important;
      color: #634695 !important;
      border: 1px solid #634695 !important;
    }
  }
  .driver-close-btn {
    background: #634695 !important;
    border: none !important;
    text-shadow: none !important;
    color: #fff !important;
    font-size: 14px !important;
    padding: 8px 20px !important;
    margin-left: 20px !important;
  }
  .driver-popover-footer {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-direction: row-reverse;
  }
}
.paging {
  position: absolute;
  left: 50px;
  bottom: 19px;
  font-size: 12px;
  color: #889ab3;
}
.description-content {
  color: #6c7789;
  line-height: 28px;
}
.airdrop-content {
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  .text {
    margin-bottom: 10px;
    color: #0b0817;
    line-height: 30px;
  }
  .close-icon {
    position: absolute;
    top: 33px;
    right: 17px;
  }
  .resource-item {
    position: relative;
    padding: 5px 15px;
    height: 70px;
    color: #898989;
    box-sizing: border-box;
    background: #f9fbfc;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.11);
    border-radius: 10px;
    .resource-item-value {
      font-size: 18px;
      margin-left: 10px;
      color: #100d58;
    }
    .resource-text {
      margin-left: 16px;
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
  .claim-btn {
    display: block;
    width: 70%;
    margin: 20px auto;
    padding: 8px 5px;
    text-align: center;
    color: #fff;
    background: #634695;
    border-radius: 2px;
    text-decoration: none;
  }
}

.reward-hub-content {
  position: relative;
  padding: 30px;
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
