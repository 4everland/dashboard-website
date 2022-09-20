<template>
  <div class="bd-1 mt-5">
    <div>
      <h3>Git Web Hooks</h3>
      <div class="gray mt-1 fz-14">
        Deploy hooks are unique URLs that allow you to trigger a deployment of a
        given branch.
      </div>

      <div class="d-flex"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: Object,
    branches: Array,
  },
  data() {
    const form = {
      name: "",
      branch: "",
    };
    return {
      loading: false,
      selected: [],
      list: [],
      adding: false,
      form,
      initForm: {
        ...form,
      },
      headers: [
        { text: "Name", value: "name" },
        { text: "Branch", value: "branch" },
      ],
      showPop: false,
      deleting: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async onDelete() {
      try {
        this.deleting = true;
        for (const row of this.selected) {
          await this.$http2.delete(
            `/project/config/${this.info.id}/git/hooks/${row.name}`
          );
        }
        this.$toast("Deleted successfully");
      } catch (error) {
        //
      }
      this.selected = [];
      this.deleting = false;
      this.getList();
    },
    async onAdd() {
      try {
        const body = { ...this.form };
        if (!body.name) {
          return this.$toast("Invalid Name");
        }
        if (!body.branch) {
          return this.$toast("Invalid Branch");
        }
        this.adding = true;
        await this.$http2.post(
          `/project/config/${this.info.id}/git/hooks`,
          body
        );
        this.showPop = false;
        this.form = {
          ...this.initForm,
        };
        this.$toast("Added successfully");
        this.getList();
      } catch (error) {
        //
      }
      this.adding = false;
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http2.get(
          "/project/config/hooks/" + this.info.id
        );
        this.list = data;
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>