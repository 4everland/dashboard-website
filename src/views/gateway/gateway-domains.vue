<template>
  <div class="domain-content">
    <div>
      <div class="mb-6">
        <span class="tips">These domains are assigned to your gateway </span>
        <span class="tips-name">{{ gatewayName }}.4everland.link.</span>
      </div>
      <div class="d-flex align-start" v-if="!domainList.length && !loading">
        <v-form ref="form" class="flex-1 al-c">
          <v-text-field
            persistent-placeholder
            v-model="domain"
            autofocus
            ref="domainIpt"
            label="Add domain"
            :rules="[
              (val) => ($regMap.domain.test(val) ? true : 'Invalid Domain'),
            ]"
          ></v-text-field>

          <v-btn
            class="ml-3"
            color="primary"
            width="180"
            @click="addDomain"
            :loading="addLoading"
            :disabled="domainList.length || disabled"
            >Add</v-btn
          >
        </v-form>
      </div>

      <v-skeleton-loader type="article" v-if="loading"></v-skeleton-loader>

      <div v-else class="domain-list">
        <!-- <template v-for="item in domainList"> -->
        <gateway-dns
          v-for="item in domainList"
          :name="gatewayName"
          :item="item"
          :key="item.id"
          @getList="getList"
        />
        <!-- </template> -->
      </div>
      <div class="fz-12 gray mt-3">
        Once you've entered your DNS records, you may need to wait up to 24
        hours.
      </div>
    </div>
  </div>
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
      domainList: [],
      valid: true,
      loading: true,
      addLoading: false,
      gatewayName: "",
    };
  },
  props: {
    active: Boolean,
  },
  computed: {
    disabled() {
      return !this.$regMap.domain.test(this.domain);
    },
  },
  created() {
    this.gatewayName = this.$route.params.name;
    this.getList();
  },
  methods: {
    // show(item) {
    //   this.showPop = true;
    //   this.curIpns = JSON.parse(JSON.stringify(item));
    // },
    async addDomain() {
      if (!this.$regMap.domain.test(this.domain)) return;
      try {
        this.addLoading = true;
        await this.$http.post("$hosting/domain/gateway/create", {
          businessId: this.gatewayName,
          domain: this.domain,
          createType: 3,
        });
        this.getList();
      } catch (error) {
        //
      }
      this.$refs.form.reset();
      this.addLoading = false;
    },
    async getList() {
      this.loading = true;
      this.domainList = [];
      const params = {
        businessId: this.gatewayName,
      };
      try {
        const { data } = await this.$http.get(`$hosting/domain/gateway/list`, {
          params,
        });

        if (data.content.length && !data.content[0].valid) {
          for (const domain of data.content) {
            await this.$http.get(`$hosting/domain/verify/${domain.id}`);
          }

          const res = await this.$http.get(`$hosting/domain/gateway/list`, {
            params,
          });
          this.domainList = res.data.content;
        } else {
          this.domainList = data.content;
        }
      } catch (error) {
        //
        console.log(error);
      }
      this.loading = false;
    },
  },
  watch: {
    showPop(val) {
      if (val) {
        this.getList();
      } else {
        if (!this.domainList.length) {
          this.$refs.form.reset();
        }
      }
    },
    active() {
      this.$refs.domainIpt.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
.domain-content {
  .tips {
    color: #6c7789;
  }
  .tips-name {
    color: var(--v-primary-base);
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
