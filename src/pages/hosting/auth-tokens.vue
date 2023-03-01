<template>
  <div>
    <e-right-opt-wrap :top="-65">
      <v-btn color="primary" @click="clickAdd">
        <span class="fz-18">+</span>
        <span class="ml-1">Create</span>
      </v-btn>
      <v-btn
        outlined
        width="120"
        class="ml-5"
        @click="onDelete"
        :loading="deleting"
        v-if="selected.length > 0"
      >
        <img src="/img/svg/delete.svg" width="12" />
        <span class="ml-2">Delete</span>
      </v-btn>
    </e-right-opt-wrap>
    <div class="main-wrap">
      <v-data-table
        v-model="selected"
        :loading="loading"
        :show-select="list.length > 0"
        item-key="id"
        :headers="headers"
        :items="list"
        hide-default-footer
      ></v-data-table>
    </div>

    <v-dialog v-model="popNew" max-width="500">
      <div class="pd-30">
        <h2>Create Token</h2>
        <div class="gray mt-2 fz-14">
          Give a distinguished name for your token.
        </div>
        <div class="mt-5">
          <v-text-field
            persistent-placeholder
            v-model="form.name"
            placeholder="Token Name"
            autocomplte="off"
            autofocus
          />
        </div>
        <div class="mt-5 ta-c">
          <v-btn outlined @click="popNew = false"> Cancel </v-btn>
          <v-btn color="primary" class="ml-5" :loading="adding" @click="onAdd">
            Create
          </v-btn>
        </div>
      </div>
    </v-dialog>

    <v-dialog v-model="popCopy" max-width="500">
      <div class="pd-30">
        <h2>Token Created</h2>
        <div class="mt-2 fz-14">
          Please copy your token and store it in a safe place.
          <p>
            <b>For security reasons we cannot show it again.</b>
          </p>
        </div>
        <div
          class="pd-10 bd-1 bdrs-3 mt-8 d-flex al-c hover-1"
          v-clipboard="newToken"
          @success="onCopied"
        >
          <span class="el-label-1 fz-14">{{ newToken.cutStr(20, 10) }}</span>
          <v-icon size="16" class="ml-auto">mdi-content-copy</v-icon>
        </div>
        <div class="mt-8 ta-c">
          <v-btn color="primary" @click="popCopy = false" :disabled="!copied"
            >Done</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Last Active", value: "actime" },
        { text: "CreateAt", value: "time" },
      ],
      list: [],
      selected: [],
      deleting: false,
      popNew: false,
      form: {
        name: "",
      },
      adding: false,
      newToken: "",
      popCopy: false,
      copied: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    onCopied() {
      this.copied = true;
      this.$toast("Copied!");
    },
    clickAdd() {
      if (this.list.length >= 10)
        return this.$alert("You can add 10 tokens at maximum.");
      this.popNew = true;
    },
    async onAdd() {
      try {
        if (!this.form.name) {
          return this.$toast("Invalid Name");
        }
        this.adding = true;
        const { data } = await this.$http.post(
          "$hosting/user/token/new",
          this.form
        );
        this.newToken = data.token;
        this.popNew = false;
        this.popCopy = true;
        this.copied = false;
        this.form = {
          name: "",
        };
        // this.$toast("Added successfully");
        this.getList();
      } catch (error) {
        //
      }
      this.adding = false;
    },
    async onDelete() {
      try {
        const suffix = this.selected.length > 1 ? "s" : "";
        let html = `The following token${suffix} will be permanently deleted, are you sure you want to continue?<ul class='mt-4'>`;
        for (const row of this.selected) {
          html += "<li>" + row.name + "</li>";
        }
        html += "</ul>";
        await this.$confirm(html, "Delete token" + suffix);
        this.deleting = true;
        for (const row of this.selected) {
          await this.$http.delete("$hosting/user/token/" + row.id);
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
        const { data } = await this.$http.get(`$hosting/user/token/list`);
        // console.log(data)
        this.list = data.list.map((it) => {
          it.time = new Date(it.createAt).format();
          it.actime = new Date(it.usedAt).format();
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
