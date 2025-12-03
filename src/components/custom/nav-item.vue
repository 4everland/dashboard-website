<template>
  <div class="pa-6 nav-item">
    <div class="data d-flex">
      
      <img :src="info.icon" width="24" alt="" />
      <span class="fz-16 title-text ml-1">{{ info.title }}</span>
    </div>
    <div class="text fz-40 al-c justify-center" :class="info.link ? 'mt-7' : 'mt-8'">
      <div class="al-c">
        
        <div>
          <span class="value fw-b fz-40">{{ formatData.num }}</span>
          <span class="unit fz-14 ml-3">{{ formatData.unit }}</span>
        </div>
        
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          icon: "",
          title: "",
          value: "",
        };
      },
    },
    value: {
      type: String,
      default: "",
    },
  },

  computed: {
    formatData() {
      let arByte = this.value * 1024;
      if (arByte) {
        return this.$utils.getFileSize(arByte, true);
      }
      return {
        unit: "KB",
        num: 0,
      };
    },
  },
  methods: {
    handleLink(link) {
      window.open(link);
    },
  },
};
</script>
<style lang="scss" scoped>
.nav-item {
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.05);
  .value {
    color: #0b0817;
    font-size: 40px;
  }
  .unit {
    color: #232428;
  }
  .text {
    color: #54576a;
  }
  .title-text {
    color: #54576A;
  }
  .btn {
    padding: 4px 8px;
    color: #fff;
    border-radius: 4px;
    background: linear-gradient(355deg, #9747ff 0%, rgba(151, 71, 255, 0) 100%),
      #775da6;
  }
}
</style>
