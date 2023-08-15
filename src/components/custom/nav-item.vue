<template>
  <div class="pa-6 nav-item">
    <div class="data d-flex space-btw">
      <div>
        <span class="value fw-b">{{ formatData.num }}</span>
        <span class="unit fz-14 ml-3">{{ formatData.unit }}</span>
      </div>
      <img :src="info.icon" width="24" alt="" />
    </div>
    <div class="text fz-16 al-c space-btw" :class="info.link ? 'mt-7' : 'mt-8'">
      <div>
        <span class="fz-16">{{ info.title }}</span>
        <v-tooltip top v-if="info.tips" max-width="300">
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="ml-2" size="18" v-bind="attrs" v-on="on"
              >mdi-alert-circle-outline</v-icon
            >
          </template>
          <span>{{ info.tips }}</span>
        </v-tooltip>
      </div>
      <div
        class="btn cursor-p al-c"
        v-if="info.link"
        @click="handleLink(info.link)"
      >
        <span class="fw-b fz-14">Apply</span>
        <img
          class="ml-1"
          width="14"
          src="/img/svg/ar-sync/arrow-circle-right.svg"
        />
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
    font-size: 24px;
  }
  .unit {
    color: #232428;
  }
  .text {
    color: #54576a;
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
