<template>
  <div class="bd-1">
    <div class="d-flex al-c">
      <div class="mr-5">
        <h3>Environment Variable</h3>
        <div class="gray fz-14">
          In order to provide your deployment with environment variables at
          build and runtime, you may enter them right here, for the environment
          of your choice.
        </div>
      </div>
    </div>

    <div class="mt-5">
      <v-btn small color="primary" @click="clickAdd" min-width="70">
        Add
      </v-btn>
      <v-btn
        small
        outlined
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
        item-key="id"
        :headers="headers"
        :items="list"
        :items-per-page="-1"
        hide-default-footer
      ></v-data-table>
    </div>

    <v-dialog v-model="showPop" max-width="500">
      <div class="pd-30">
        <h2>Add Environment Variable</h2>
        <div class="mt-5">
          <v-text-field
            persistent-placeholder
            v-model="form.key"
            label="Name"
            placeholder="Example_Name"
            autocomplte="off"
          />
          <v-text-field
            persistent-placeholder
            v-model="form.value"
            label="Value"
            placeholder="Example_Value"
            autocomplte="off"
          />
        </div>
        <div class="mt-5 ta-c">
          <v-btn outlined @click="showPop = false"> Cancel </v-btn>
          <v-btn color="primary" class="ml-5" :loading="adding" @click="onAdd">
            Add
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    info() {
      return this.$store.state.projectInfo;
    },
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: "Name", value: "key" },
        { text: "Value", value: "value" },
        { text: "CreateAt", value: "time" },
      ],
      list: [],
      selected: [],
      deleting: false,
      showPop: false,
      form: {
        key: "",
        value: "",
      },
      adding: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    clickAdd() {
      if (this.list.length >= 100)
        return this.$alert("You can add 100 variables at maximum.");
      this.showPop = true;
    },
    async onAdd() {
      try {
        if (!this.form.key) {
          return this.$toast("Invalid Name");
        }
        this.adding = true;
        await this.$http.post(
          "$hosting/project/env/" + this.info.id,
          this.form
        );
        this.showPop = false;
        this.form = {
          key: "",
          value: "",
        };
        this.$toast("Added successfully");
        this.getList();
      } catch (error) {
        //
      }
      this.adding = false;
    },
    async onDelete() {
      try {
        const suffix = this.selected.length > 1 ? "s" : "";
        let html = `The following Environment Variable${suffix} will be permanently deleted. Are you sure you want to continue?<ul class='mt-4'>`;
        for (const row of this.selected) {
          html += "<li>" + row.key + "</li>";
        }
        html += "</ul>";
        await this.$confirm(html, "Remove Environment Variable" + suffix);
        this.deleting = true;
        for (const row of this.selected) {
          await this.$http.delete("$hosting/project/env?id=" + row.id);
        }
        this.$toast("Deleted successfully");
      } catch (error) {
        //
      }
      this.selected = [];
      this.deleting = false;
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get(
          `$hosting/project/env/${this.info.id}`
        );
        // console.log(data)
        this.list = data.content.map((it) => {
          it.time = new Date(it.createAt).format();
          return it;
        });
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>
