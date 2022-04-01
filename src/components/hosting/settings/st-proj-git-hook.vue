<template>
  <div class="bd-1 mt-5">
    <div>
      <h3>Deploy Hooks</h3>
      <!-- <div class="gray mt-1 fz-14">
        Deploy hooks are unique URLs that allow you to trigger a deployment of a
        given branch. This project does not have any deploy hooks.
      </div> -->

      <div class="mt-5">
        <v-btn
          small
          rounded
          color="primary"
          @click="showPop = true"
          min-width="70"
        >
          Add
        </v-btn>
        <v-btn
          small
          rounded
          color="error"
          class="ml-5"
          @click="onDelete"
          :loading="deleting"
          v-if="selected.length > 0"
        >
          Delete
        </v-btn>
      </div>

      <div class="mt-3">
        <v-data-table
          v-model="selected"
          :loading="loading"
          :show-select="list.length > 0"
          item-key="name"
          :headers="headers"
          :items="list"
          hide-default-footer
        ></v-data-table>
      </div>
    </div>

    <v-dialog v-model="showPop" max-width="500">
      <div class="pd-20">
        <h3>Add Hook</h3>
        <div class="mt-5">
          <v-text-field
            persistent-placeholder
            v-model="form.name"
            label="Name"
            placeholder="My Hook Name"
          />
          <!-- <v-text-field persistent-placeholder v-model="form.branch"
          label="Branch"
          placeholder="main"/> -->
          <v-select
            v-model="form.branch"
            :items="branches"
            placeholder="main"
            persistent-placeholder
            label="Branch"
          >
          </v-select>
        </div>
        <div class="mt-5 ta-r">
          <v-btn small @click="showPop = false"> Cancel </v-btn>
          <v-btn
            small
            color="primary"
            class="ml-5"
            :loading="adding"
            @click="onAdd"
          >
            Add
          </v-btn>
        </div>
      </div>
    </v-dialog>
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