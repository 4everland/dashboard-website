<template>
  <v-dialog v-model="showPop" max-width="600">
    <div class="pa-6 pt-5 domain-content">
      <h3 class="fz-30 mb-7">Add Domain</h3>
      <div class="pl-5">
        <div class="mb-4">
          <span class="tips">These domains are assigned to your gateway </span>
          <span class="tips-name">2gou.4everland.link.</span>
        </div>
        <div class="d-flex align-start">
          <!-- <div
            class="flex-1 mr-5 domain-input-container"
            :class="valid ? '' : 'not-valid'"
          >
            <input type="text" v-model="domain" class="domain-input" />
          </div> -->

          <v-text-field
            persistent-placeholder
            v-model="domain"
            outlined
            dense
            placeholder=""
            :rules="[
              (val) => ($regMap.domain.test(val) ? true : 'Invalid Domain'),
            ]"
          ></v-text-field>
          <!-- <v-btn color="primary" class="ml-4" @click="decodePrivateKey"
              >Decode</v-btn
            > -->

          <v-btn color="primary" width="91" class="ml-4" @click="addDomain"
            >Add</v-btn
          >
        </div>

        <div v-if="domainList.length" class="domain-list">
          <template v-for="item in domainList">
            <gateway-dns :ipns="curIpns" :item="item" :key="item.id" />
          </template>
        </div>
        <v-skeleton-loader type="article" v-else></v-skeleton-loader>
        <div class="fz-12 gray mt-5">
          Once you've entered your DNS records, you may need to wait up to 24
          hours.
        </div>
      </div>

      <div class="ta-c mt-9">
        <v-btn outlined @click="showPop = false" width="180">Cancel</v-btn>
        <v-btn color="primary" class="ml-6" width="180">Next</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import GatewayDns from "@/views/gateway/gateway-dns";
export default {
  components: {
    GatewayDns,
  },
  data() {
    return {
      showPop: false,
      domain: "",
      domainList: [
        { id: 111, name: "solid.tpp" },
        { id: 22, name: "solid.tpp" },
        { id: 33, name: "solid.tpp" },
        { id: 44, name: "solid.tpp" },
      ],
      curIpns: {},
      valid: true,
    };
  },
  methods: {
    show(item) {
      this.showPop = true;
      console.log(item);
      this.curIpns = item;
    },
    addDomain() {
      if (!this.$regMap.domain.test(this.domain)) return;
      // do something request
    },
  },
};
</script>

<style lang="scss" scoped>
.domain-content {
  font-family: "AppleSystemUIFont";
  .tips {
    color: #6c7789;
  }
  .tips-name {
    color: #775da6;
  }
  .domain-input-container {
    background: #f4f6f8;
    border-radius: 2px;
    height: 40px;
    box-sizing: border-box;
    transition: all 0.2s ease;
    > input {
      width: 100%;
      padding: 0 10px;
      height: 100%;
      box-sizing: border-box;
    }
  }
  .domain-list {
    max-height: 300px;
    overflow-y: auto;
  }
  .not-valid {
    border: 1px solid red;
  }
}
</style>