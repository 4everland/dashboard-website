<template>
  <div class="account-config-container">
    <div class="config-item" v-if="hasAccess">
      <h3 class="fz-20">Collaboration account name</h3>
      <p class="fz-14 mb-6 mt-3 description">
        The name of the collaboration account will be displayed when
        collaborating with several users.
      </p>
      <div class="al-c">
        <v-text-field
          persistent-placeholder
          outlined
          class="hide-msg"
          dense
          label=""
          v-model="teamName"
        ></v-text-field>
        <v-btn
          color="primary"
          width="120px"
          class="ml-5"
          tile
          @click="handleSave"
          >Save</v-btn
        >
      </div>
    </div>
    <div class="mt-5 config-item al-c" v-if="hasAccess">
      <div style="width: 60%" class="mr-auto">
        <h3 class="fz-20">Collaboration account profile</h3>
        <p class="fz-14 mb-6 mt-3 description">
          The profile picture of the collaboration account will be displayed
          when collaborating with several users. Click on the profile picture to
          change.
        </p>
      </div>
      <v-avatar
        v-if="teamAvatar"
        color="primary"
        size="80"
        class="cursor-p"
        @click="$refs.uploadInput.onClick(false)"
      >
        <img :src="teamAvatar" alt="John"
      /></v-avatar>
      <e-avatar
        v-else
        :address="teamInfo.teamId"
        :diameter="80"
        @click.native="$refs.uploadInput.onClick(false)"
      ></e-avatar>
      <input-upload @input="onInput" ref="uploadInput"></input-upload>
    </div>
    <div
      class="mt-5 config-item al-c"
      v-if="teamInfo && teamInfo.type != 'INDIVIDUAL'"
    >
      <div style="width: 60%" class="mr-auto">
        <h3 class="fz-20">Exit collaboration</h3>
        <p class="fz-14 mb-6 mt-3 description">
          When you exit the collaboration, you will not be able to access the
          content and projects of the collaboration account and the
          collaboration account will no longer be displayed.
        </p>
      </div>
      <v-btn color="primary" outlined tile @click="handleDelete">Delete</v-btn>
    </div>
  </div>
</template>

<script>
import InputUpload from "@/views/bucket/components/input-upload";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      teamName: "",
      file: null,
      teamAvatar: "",
    };
  },
  watch: {
    teamInfo: {
      handler() {
        this.initInfo();
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["teamInfo"]),
    hasAccess() {
      if (this.teamInfo.type) {
        return (
          this.teamInfo.access.includes("MEMBER") ||
          this.teamInfo.type == "INDIVIDUAL"
        );
      }
      return false;
    },
  },
  methods: {
    async initInfo() {
      console.log(this.teamInfo);
      this.teamName = this.teamInfo.teamName;
      if (this.teamInfo.teamAvatar) {
        this.teamAvatar = this.teamInfo.teamAvatar;
      } else {
        this.teamAvatar = "";
      }
    },
    async handleDelete() {
      try {
        await this.$confirm(
          "You are going to exit the collaborative account. Do you want to continue?",
          "Alert"
        );
        // do something
        this.$loading();
        await this.$http.post("$auth/cooperation/exit");
        this.$loading.close();
        this.$setState({
          teamId: null,
        });
        location.href = "/overview";
      } catch (error) {
        //
        console.log(error);
      }
    },
    async getAvatarSrc(file) {
      try {
        this.teamAvatar = URL.createObjectURL(file);
        const formData = new FormData();
        formData.append("file", file);
        this.$loading();
        const { data } = await this.$http.post("$auth/media", formData);
        await this.$http.put("$auth/cooperation/teams", { teamAvatar: data });
        this.$setMsg("updateTeam");
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
    async onInput(file) {
      try {
        this.file = file[0];
        await this.getAvatarSrc(file[0]);
        // this.teamAvatar = src;
        // const data = { teamAvatar: this.teamAvatar };
        // await this.$http.put("$auth/cooperation/teams", data);

        // this.$setMsg({ name: "updateTeam" });
      } catch (error) {
        console.log(error);
      }
    },
    async handleSave() {
      try {
        const data = {
          teamName: this.teamName,
        };
        if (this.teamName == this.teamInfo.teamName) return;
        this.$loading();

        await this.$http.put("$auth/cooperation/teams", data);
        this.$setMsg({ name: "updateTeam" });
        this.$loading.close();
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {
    InputUpload,
  },
};
</script>

<style lang="scss" scoped>
.config-item {
  padding: 32px 28px;
  background: #ffffff;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.11);
  border-radius: 10px;
  .description {
    color: #6c7789;
  }
}
</style>