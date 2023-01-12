<template>
  <div @click.stop="onGuide">guide11</div>
</template>

<script>
import { bus } from "@/utils/bus";
import { mapState } from "vuex";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
export default {
  data() {
    return {
      driver: new Driver({
        className: "guide-class",
        nextBtnText: "Next",
        closeBtnText: "Skip",
        padding: 0,
      }),
      steps: [
        {
          element: "#drawerList",
          popover: {
            title: "Menu bar",
            description: `<div class="description-content">In the 4EVERLAND world, you can experience project deployment services from 4EVER-Hosting, permanent storage services from 4EVER-Bucket, dedicated gateway and network resource services, as well as Dahboard's quick start operations and visualisation of project statistics.</div>
            <span class="paging">(1/6)</span>
            </div>`,
            position: "right",
          },
          onNext: () => {
            this.driver.preventMove();
            // this.$refs["group-1"][0].click();
            bus.$emit("sidebar-item", "group-1");
            setTimeout(() => {
              this.driver.refresh();
              this.driver.moveNext();
            }, 250);
          },
        },
        {
          element: "#group-1",
          popover: {
            title: "Hosting",
            description: `<div class="description-content">You can quickly host websites and applications on IPFS, Arweave or Dfinity via Git, Template or IPFS Path, review the UV, PV and other statistics of the hosted project.</div>
            <span class="paging">(2/6)</span>
            </div>`,
            position: "right",
          },
          onNext: () => {
            // this.$refs["group-2"][0].click();
            bus.$emit("sidebar-item", "group-2");
            this.driver.preventMove();
            setTimeout(() => {
              this.driver.refresh();
              this.driver.moveNext();
            }, 250);
          },
        },
        {
          element: "#group-2",
          popover: {
            title: "Bucket",
            description: `<div class="description-content">Use 4EVER-Bucket for faster file uploads and permanent file storage on IPFS and Arweave, observe storage capacity, traffic statistics, file access, etc.</div>
            <span class="paging">(3/6)</span>
            </div>`,
            position: "right",
          },
          onNext: () => {
            // this.$refs["group-3"][0].click();
            bus.$emit("sidebar-item", "group-3");
            this.driver.preventMove();
            setTimeout(() => {
              this.driver.refresh();
              this.driver.moveNext();
            }, 250);
          },
        },
        {
          element: "#group-3",
          popover: {
            title: "Gateway",
            description: `<div class="description-content">In addition, within the Gataway service, 4EVERLAND offers a customised IPFS dedicated gateway with global acceleration, providing IPNS creation, publishing, keep-alive and other management functions to better help you improve access performance.</div>
            <span class="paging">(4/6)</span>
            </div>`,
            position: "right",
          },
          onNext: () => {
            bus.$emit("guide");
            this.driver.preventMove();
            setTimeout(() => {
              this.driver.refresh();
              this.driver.moveNext();
            }, 250);
          },
        },
        {
          element: "#resourse-guide",
          popover: {
            title: "Resource",
            description: `<div class="description-content">You can easily purchase resources and deposit your balance through other public chains such as Polygon, ETHereum, BSC, etc., and see clearly the balance of resources purchased and resources consumed.</div>
            <span class="paging">(5/6)</span>
            </div>`,
            position: "left",
          },
          onNext: () => {
            this.driver.preventMove();
            setTimeout(() => {
              this.driver.refresh();
              this.driver.moveNext();
            }, 250);
          },
        },
        {
          element: "#reward-guide",
          popover: {
            className: "reward-guide-class",
            title: "Reward-hub",
            description: `<div class="airdrop-content"><div class="mb-6 text">Click on Reward Hub to claim your free new user resource package and get a better experience of 4EVERLAND products. More activities are available to earn more resources. Come and get your hands on!</div>
          <div class="row mt-2">
          <div class="col-sm-6 col-12"><div class="resource-item al-c"><img width="28" src="img/airDrop/ipfs.png" alt=""><span class="resource-item-value ml-2">25GB</span><span class="resource-text fz-12">IPFS Storage</span></div>
          </div>
          <div class="col-sm-6 col-12"><div class="resource-item al-c"><img  width="28" src="/img/airDrop/ar.png" alt=""><span class="resource-item-value ml-2">100MB</span><span  class="resource-text fz-12">Arweave Storage</span></div>
          </div>
          <div class="col-sm-6 col-12"><div class="resource-item al-c"><img width="28" src="/img/airDrop/minutes.png" alt=""><span  class="resource-item-value ml-2">100</span><span class="resource-text fz-12">Build Minutes</span></div>
          </div>
          <div class="col-sm-6 col-12"><div class="resource-item al-c"><img width="28" src="/img/airDrop/balance.png" alt=""><span  class="resource-item-value ml-2">100</span><span class="resource-text fz-12">Recharge Balance</span>
          </div>
          </div>
          <a class="claim-btn" href="/reward-hub">Let's start</a>
          `,
            showButtons: false,
            position: "left",
          },
        },
      ],
    };
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
    }),
  },
  mounted() {
    this.driver.defineSteps(this.steps);
    if (this.noticeMsg.data.tip) {
      console.log(111);
      this.onGuide();
    }
  },
  watch: {
    "driver.isActivated"(val) {
      if (!val) {
        this.move();
      }
    },
  },
  methods: {
    onGuide() {
      this.driver.start();
      this.stop();
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
  },
};
</script>

<style lang="scss" scoped>
</style>