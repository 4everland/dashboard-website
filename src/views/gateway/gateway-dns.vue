<template>
  <div class="dns-container fz-14">
    <div class="mt-2 al-c justify-space-between">
      <div>{{ item.domain }}</div>
      <div>
        <v-btn
          small
          icon
          class="mr-4"
          @click="onRefresh(item)"
          :loading="refreshing"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn
          small
          icon
          class="mr-1"
          @click="onDelete"
          :loading="deleteLoading"
        >
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </div>
    </div>
    <template v-if="!item.valid">
      <div class="tips">
        Set the following record on your DNS provider to continue:
      </div>
      <table class="w100p table-container">
        <tr class="gray">
          <td>Type</td>
          <td>Name</td>
          <td>Value</td>
        </tr>
        <tr>
          <td>{{ item.type }}</td>
          <td>
            {{ domainPre(item.domain) }}
          </td>
          <td>
            <p
              class="hover-1 wb-all mb-0"
              v-clipboard="() => item.value"
              @success="$toast('Copied to clipboard !')"
            >
              {{ item.value.cutStr(6, 10) }}
              <v-icon size="14" class="ml-1">mdi-content-copy</v-icon>
            </p>
          </td>
        </tr>
      </table>
    </template>
    <div v-else class="mt-4">
      <v-icon size="18" color="#00BD9A">mdi-check-circle-outline</v-icon>
      <span class="ml-2">Valid Configuration</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      refreshing: false,
      deleteLoading: false,
    };
  },
  props: {
    item: {
      type: Object,
    },
    ipns: {
      type: Object,
    },
  },
  computed: {
    domainPre() {
      return function (domain) {
        return domain.split(".").reverse().slice(2).reverse().join(".");
      };
    },
  },
  methods: {
    async onRefresh(item) {
      try {
        this.refreshing = true;
        await this.$http2.get(`/domain/verify/${item.id}`);
        await this.$parent.$parent.$parent.getList();
        this.refreshing = false;
      } catch (error) {
        console.log(error);
        this.refreshing = false;
      }
    },

    async onDelete() {
      try {
        let tip = `Would you like to remove the domain ${this.item.domain} from your gateway ${this.ipns.name}.4everland.link?
                    After continuing, your gateway will no longer be accessible through this domain.`;
        await this.$confirm(tip, "Remove Domain from Gateway");
        console.log(this.item);
        this.deleteLoading = true;
        await this.$http2.delete(`/domain/gateway/${this.item.id}`);
        this.$emit("getList");
      } catch (error) {
        //
      }
      this.deleteLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dns-container {
  font-family: "AppleSystemUIFont";
  padding: 0px 0 23px;
  border-bottom: 1px solid #e6e8eb;
  .tips {
    padding: 15px 0;
    color: #6c7789;
  }
  .table-container {
    width: 100%;
    padding: 10px 10px;
    box-sizing: border-box;
    background: #f4f6f8;
  }
}
</style>