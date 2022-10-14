<template>
  <div class="dns-container">
    <div class="mt-2 al-c justify-space-between">
      <div>ylq.com</div>
      <div>
        <v-btn small icon class="mr-4" @click="onRefresh" :loading="refreshing">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn small icon class="mr-1" @click="onDelete">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </div>
    </div>
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
        <td>www</td>
        <td>@</td>
        <td>sddd.foreverland.com</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      refreshing: false,
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
  methods: {
    onRefresh() {
      this.refreshing = true;
      setTimeout(() => {
        this.refreshing = false;
      }, 2000);
    },
    async onDelete() {
      console.log(11);
      try {
        let tip = `Would you like to remove the domain ${this.item.name} from your gateway ${this.ipns.name}?
                    After continuing, your gateway will no longer be accessible through this domain.`;
        await this.$confirm(tip, "Remove Domain from Gateway");
        // await this.$http2.delete(`/ipns/${item.key}`);
        this.getList();
      } catch (error) {
        //
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dns-container {
  font-family: "AppleSystemUIFont";
  padding: 30px 0 23px;
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