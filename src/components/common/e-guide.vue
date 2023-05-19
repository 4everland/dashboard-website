<template>
  <div>
    <e-claim-dialog
      ref="claimRef"
      @claimCompeleted="claimCompeleted"
    ></e-claim-dialog>
    <e-register-share ref="share"></e-register-share>
  </div>
</template>

<script>
import { bus } from "@/utils/bus";
import { mapState } from "vuex";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
import mixin from "@/pages/more/mixin-register";
import { airdropRequest } from "@/plugins/airDrop/api";

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
            if (!this.registerInfo.handled) {
              this.$refs.claimRef.showDialog = true;
              localStorage.setItem("unregister", "1");
            }
          },
        },
      ],
      stepCount: 0,
      accountExists: false,
      registerInfo: {},
      newUserInfo: null,
    };
  },
  async created() {
    if (localStorage.token) {
      await this.getNewUser();
      await this.getHandler();
    }
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
      userInfo: (s) => s.userInfo,
    }),
    uuid() {
      if (this.teamInfo.isMember) return this.teamInfo.teamOwnerEuid;
      return this.userInfo.euid;
    },
    showGuide() {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
  },
  watch: {
    "driver.isActivated"(val) {
      if (!val) {
        bus.$emit("guide");
        this.move();
      }
      if (this.stepCount != 5 && !val && !this.registerInfo.handled) {
        this.$refs.claimRef.showDialog = true;
        localStorage.setItem("unregister", "1");
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
    async getNewUser() {
      try {
        const data = await airdropRequest();
        this.newUserInfo = data;
        if (data && this.showGuide) {
          if (this.$route.path != "/overview" && this.$route.path != "/") {
            this.$router.replace("/");
          }
          setTimeout(() => {
            this.guide();
          }, 2000);
        }
        // setTimeout(() => {
        //   this.guide();
        // }, 2000);
      } catch (error) {
        console.log(error);
      }
    },
    async claimCompeleted() {
      await this.valid();
    },
    async valid() {
      try {
        const { data } = await this.$http.get(
          "$auth/self-handled-register-apply"
        );
        this.$setState({
          onChain: data.handled,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getHandler() {
      try {
        const { data } = await this.$http.get(
          "$auth/self-handled-register-apply"
        );
        this.registerInfo = data;
        if (!data.handled && localStorage.unregister != "1") {
          let days = (+new Date() - data.createdAt) / (864 * 10e4);
          if (days >= 15 && !this.newUserInfo) {
            this.$refs.claimRef.showDialog = true;
            localStorage.setItem("unregister", "1");
          }
        }
        this.$setState({
          onChain: data.handled,
        });
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
    height: 150px;
    color: #898989;
    background: #f9f9f9;
    box-sizing: border-box;
    border-radius: 15px;
  }
}
.item-title::after {
  content: "";
  display: block;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: rgba(200, 200, 200, 0.3);
}
</style>
