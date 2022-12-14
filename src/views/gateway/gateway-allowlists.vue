<template>
  <div class="gateway-allowlists">
    <div>
      <div class="d-flex justify-space-between al-c">
        <span class="mr-auto">User Agent</span>
        <v-switch class="hide-msg" v-model="userAgent" dense></v-switch>
      </div>
      <div class="fz-14 tips mt-2" v-if="!userAgent">
        To limit access to your application to specific user agents, add them to
        the USER AGENTS allowlist. When you enable User-Agent Allowlist, any API
        requests originating from other platforms are rejected.
      </div>
      <div v-else>
        <div class="d-flex mt-5">
          <v-text-field
            class="post-input"
            persistent-placeholder
            outlined
            dense
            label=""
          ></v-text-field>
          <v-btn class="ml-5" color="primary" width="120">Add</v-btn>
        </div>
        <div class="fz-14 tips">
          Tips: The USER AGENTS allowlist utilizes partial string matching. If
          the allowlisted string is present in the request's full User-Agent, it
          is registered as a match.
        </div>
        <load-list :list="userAgentList">
          <template v-slot="{ item }">
            <div class="list-item al-c justify-space-between">
              <span>{{ item.name }}</span>
              <v-btn text color="primary">Remove</v-btn>
            </div>
          </template>
        </load-list>
      </div>
    </div>
    <div class="mt-15">
      <div class="d-flex justify-space-between al-c">
        <span class="mr-auto">Origins</span>
        <v-switch class="hide-msg" v-model="origins" dense></v-switch>
      </div>
      <div class="fz-14 tips mt-2" v-if="!origins">
        To limit access to your application to specific URLs, add them to the
        Origins allowlist. When you enable Origins Allowlist, any API requests
        originating from other platforms are rejected.
      </div>

      <div v-else>
        <div class="al-c">
          <span class="mr-5">Always allow access</span>
          <v-radio-group v-model="radioGroup" row>
            <v-radio
              v-for="n in allowAccess"
              :key="n.value"
              :label="n.text"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </div>
        <div class="d-flex mt-5">
          <v-text-field
            class="post-input"
            persistent-placeholder
            outlined
            dense
            label=""
          ></v-text-field>
          <v-btn class="ml-5" color="primary" width="120">Add</v-btn>
        </div>
        <div class="fz-14 tips">
          Tips: Origin allowlists support wildcard subdomain patterns.
        </div>
        <load-list
          :list="originsList"
          @packUp="handleOriginPackUp"
          @loadMore="handleOriginLoadMore"
        >
          <template v-slot="{ item }">
            <div class="list-item al-c justify-space-between">
              <span>{{ item.name }}</span>
              <v-btn text color="primary" @click="handleRemove(item, 'origin')"
                >Remove</v-btn
              >
            </div>
          </template>
        </load-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userAgent: false,
      origins: false,
      userAgentList: [
        { id: 1, name: "Chorme" },
        { id: 2, name: "Android" },
        { id: 3, name: "Ios" },
        { id: 4, name: "Mozilla" },
      ],
      originsList: [
        { id: 1, name: "nice.4everland.app" },
        { id: 2, name: "nice.4everland.app" },
        { id: 3, name: "nice.4everland.app" },
        { id: 4, name: "nice.4everland.app" },
        { id: 5, name: "nice.4everland.app" },
        { id: 6, name: "nice.4everland.app" },
        { id: 7, name: "nice.4everland.app" },
        { id: 8, name: "nice.4everland.app" },
        { id: 9, name: "nice.4everland.app" },
        { id: 10, name: "nice.4everland.app" },
        { id: 11, name: "nice.4everland.app" },
        { id: 12, name: "nice.4everland.app" },
        { id: 13, name: "nice.4everland.app" },
        { id: 14, name: "nice.4everland.app" },
        { id: 15, name: "nice.4everland.app" },
        { id: 16, name: "nice.4everland.app" },
        { id: 17, name: "nice.4everland.app" },
        { id: 18, name: "nice.4everland.app" },
        { id: 19, name: "nice.4everland.app" },
        { id: 20, name: "nice.4everland.app" },
      ],
      allowAccess: [
        {
          text: "Yes",
          value: true,
        },
        {
          text: "No",
          value: false,
        },
      ],
      radioGroup: false,
    };
  },
  methods: {
    handleOriginPackUp() {
      this.originsList = [];
    },
    handleRemove(item, type) {
      if (type == "origin") {
        this.originsList = this.originsList.filter((it) => it.id != item.id);
      } else {
        this.userAgentList = this.userAgentList.filter(
          (it) => it.id != item.id
        );
      }
    },
    handleOriginLoadMore() {
      this.$loading();
      setTimeout(() => {
        let arr = [];
        for (let i = 21; i < 41; i++) {
          arr.push({
            id: i,
            name: "nice.4everland.app",
          });
        }
        this.originsList = this.originsList.concat(arr);
        this.$loading.close();
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.tips {
  color: #889ab3;
}
.list-item {
  padding: 7px 0;
  border-bottom: 1px solid #d0dae9;
}
</style>