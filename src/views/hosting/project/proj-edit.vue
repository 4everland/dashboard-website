<template>
  <div>
    <v-skeleton-loader
      v-if="JSON.stringify(configJson) == '{}'"
      type="article"
    ></v-skeleton-loader>
    <div v-else class="main-wrap">
      <v-row>
        <v-col cols="12" md="6" v-for="(it, i) of configJson" :key="i">
          <div>{{ i }}</div>
          <template v-for="(item, idx) in it">
            <v-text-field
              :key="idx"
              class="mt-4 hide-msg"
              persistent-placeholder
              outlined
              :placeholder="item.placeholder"
              v-model="item.value"
              dense
            ></v-text-field>
          </template>
        </v-col>
      </v-row>
      <div class="al-c justify-center mt-8">
        <v-btn
          width="100"
          color="primary"
          @click="handleDeploy"
          :disabled="canDeploy"
          >Deploy</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      configJson: {},
    };
  },
  props: {
    active: Boolean,
  },
  computed: {
    ...mapState({
      info: (s) => s.projectInfo,
      userInfo: (s) => s.userInfo,
    }),
    canDeploy() {
      return this.info.configJson == JSON.stringify(this.configJson);
    },
  },
  methods: {
    getConfigJson() {
      this.configJson = this.info.configJson;
    },
    async handleDeploy() {
      try {
        await this.$confirm(
          "The changes will take effect after redeployment. Are you sure you want to proceed?",
          "Tip"
        );
        this.$loading();
        const { data } = await this.$http.post(
          "$hosting/template/web3/project/redeploy",
          {
            web3TemplateId: this.info.web3TemplateId,
            configJson: JSON.stringify(this.configJson),
            projectId: this.info.id,
          }
        );
        this.$router.push(
          `/hosting/build/${this.info.name}/${this.info.id}/${data.taskId}`
        );
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
  },
  watch: {
    info: {
      handler(val) {
        this.configJson = JSON.parse(val.configJson);
      },
      immediate: true,
    },
    active(val) {
      if (val) this.configJson = JSON.parse(this.info.configJson);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>