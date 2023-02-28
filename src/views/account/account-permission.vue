<template>
  <div class="pa-6">
    <h2 class="mb-3">Account Permission</h2>
    <div
      class="al-c bg-f8 pa-2 mb-4 bdrs-10 hover-1"
      @click="onClick(it)"
      v-for="(it, i) in list"
      :key="i"
    >
      <img
        :src="`/img/svg/account/${
          val.includes(it.type) ? 'checked' : 'uncheck'
        }.svg`"
        width="20"
        class="ml-2"
      />
      <div class="ml-5">
        <h3>{{ it.title }}</h3>
        <div class="color-1 mt-1 fz-14">
          <span
            v-for="(txt, j) in it.subs"
            :key="j"
            class="d-ib mt-1"
            style="min-width: 180px"
          >
            · {{ txt }}
          </span>
        </div>
      </div>
    </div>
    <!-- <div class="el-label-1 fz-14 m-auto" style="max-width: 500px">
      Based on the corresponding permissions, the Hosting and Gateway functions
      are viewable or not viewable at all. Hosting and Bucket functions'
      viewability is based on the corresponding permissions.
    </div> -->
    <div class="ta-c mt-5">
      <v-btn
        color="primary"
        :disabled="saveDisabled"
        width="150px"
        @click="$emit('save')"
        class="mr-5"
        >Save</v-btn
      >
      <v-btn outlined width="150px" @click="$emit('close')">Cancel</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Array,
  },
  data() {
    return {
      val: this.value || [],
      list: [
        {
          title: "Hosting",
          type: "HOSTING",
          subs: [
            "GitHub Repository",
            "Project Management",
            "Project Deployment",
            "CDN Management",
            "Auth Token",
          ],
        },
        {
          title: "Gateway",
          type: "GATEWAY",
          subs: [
            "IPNS Management",
            "IPNS API Key",
            "Create a dedicated gateway",
            "Manage a dedicated gateway",
          ],
        },
        {
          title: "Resource",
          type: "RESOURCE",
          subs: [
            "Resource Statistics",
            "Billing Details",
            "Deposit",
            "Purchase",
          ],
        },
        {
          title: "Account",
          type: "MEMBER",
          subs: ["Members", "Permissions Setting"],
        },
      ],
    };
  },
  computed: {
    saveDisabled() {
      return this.list.filter((it) => this.val.includes(it.type)).length == 0;
    },
  },
  watch: {
    value(val) {
      this.val = val;
    },
  },
  methods: {
    getText(checked) {
      return this.list
        .filter((it) => checked.includes(it.type))
        .map((it) => it.title)
        .join(", ");
    },
    onClick(it) {
      const idx = this.val.indexOf(it.type);
      if (idx == -1) {
        this.val.push(it.type);
      } else {
        this.val.splice(idx, 1);
      }
      this.$emit("input", this.val);
    },
  },
};
</script>
