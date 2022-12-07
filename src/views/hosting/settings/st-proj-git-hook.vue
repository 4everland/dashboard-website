<template>
  <div class="bd-1 mt-5">
    <div>
      <h3>Git Web Hooks</h3>
      <div class="gray mt-1 fz-14">
        Deploy hooks are unique URLs that allow you to trigger a deployment of a
        given branch.
      </div>

      <v-skeleton-loader type="article" v-if="loading"></v-skeleton-loader>
      <template v-else-if="list.length">
        <div class="bd-1 pa-3 al-c mt-4" v-for="it in list" :key="it.id">
          <div>
            <div>
              <span>{{ it.name }}</span>
              <span class="color-1 ml-4 mr-4">on</span>
              <span>{{ it.branch }}</span>
            </div>
            <div class="mt-1 gray fz-13">
              {{ it.url }}
            </div>
          </div>
          <v-btn
            color="primary"
            class="ml-auto"
            small
            v-clipboard="it.url"
            @success="$toast('Copied to clipboard !')"
            >Copy</v-btn
          >
          <v-btn
            outlined
            small
            class="ml-3"
            @click="onDelete(it)"
            :loading="deleting"
            >Delete</v-btn
          >
        </div>
      </template>
      <template v-else>
        <div class="mt-3 fz-14">
          This project does not have any deploy hooks.
        </div>
        <div class="gray-6 mt-4 mb-3 fz-14">Create Hook</div>
        <div class="al-c hide-msg">
          <div style="width: 300px">
            <v-text-field
              outlined
              dense
              solo
              placeholder="Name"
              v-model="form.name"
            ></v-text-field>
          </div>
          <span class="color-1 ml-5 mr-5">on</span>
          <!-- <span>{{ branch }}</span> -->
          <div style="width: 200px">
            <v-text-field
              v-model="branch"
              disabled
              outlined
              dense
            ></v-text-field>
          </div>
          <v-btn color="primary" class="ml-10" :loading="adding" @click="onAdd"
            >Create Hook</v-btn
          >
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: Object,
    branch: String,
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
      showPop: false,
      deleting: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async onDelete(it) {
      try {
        this.deleting = true;
        await this.$http2.delete(
          `/project/config/${it.id}/git/hooks/${it.name}`
        );
        this.$toast("Deleted successfully");
      } catch (error) {
        //
      }
      this.deleting = false;
      this.getList();
    },
    async onAdd() {
      try {
        const body = { ...this.form };
        body.name = body.name.trim().replace(/\s+/g, "_");
        let msg = "";
        if (!body.name) {
          msg = "Invalid Name";
        } else if (body.name.length > 30) {
          msg =
            "The name for your Deploy Hook cannot be longer than 30 characters.";
        }
        if (msg) return this.$toast(msg);
        body.branch = this.branch;
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