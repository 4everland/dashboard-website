<template>
  <div class="creat-select-box">
    <div class="creat-select">
      <div class="box-left">
        <img
          src="@/assets/imgs/raas/empty.svg"
          alt=""
          width="160px"
          height="120px"
        />
      </div>
      <div class="box-right">
        <div class="tit-box">
          <span class="title-text">One-click Deployment</span>
          <span class="tips-text">Testnet</span>
        </div>
        <div class="tips-box">
          Utilize OP Stack + Ethereum Blobs DA. Just fll out the details and
          deploy with one click
        </div>
      </div>
    </div>
    <div class="creat-select mt-6">
      <div class="box-left">
        <img
          src="@/assets/imgs/raas/empty.svg"
          alt=""
          width="160px"
          height="120px"
        />
      </div>
      <div class="box-right">
        <div class="tit-box">
          <span class="title-text">Customize Rollup</span>
        </div>
        <div class="tips-box">
          Customize your Rollup Stack and DA. Following form submission, we'll
          be in touch for a personalized consultation
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardWebsiteCreatSelect",
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.creat-select-box {
  .creat-select {
    height: 120px;
    width: 512px;
    display: flex;
    padding-right: 16px;
    align-items: center;
    gap: 16px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background: #fff;
    margin: 0 auto;
    cursor: pointer;
    .box-left {
    }
    .box-right {
      text-align: left;
      .tit-box {
        display: flex;
        .title-text {
          color: #0f172a;
          font-family: "SF Pro Text";
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          margin-right: 8px;
        }
        .tips-text {
          display: flex;
          padding: 1px 4px;
          align-items: flex-start;
          border-radius: 2px;
          border: 1px solid #735ea1;
          color: #735ea1;
          font-family: "SF Pro Text";
          font-size: 11px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
      .tips-box {
        color: #475569;
        font-family: "SF Pro Text";
        font-size: 11px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        margin-top: 8px;
      }
    }
  }
}
</style>
