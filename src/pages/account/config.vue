<template>
  <div class="account-config-container">
    <div class="config-item">
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
    <div class="mt-5 config-item al-c">
      <div style="width: 60%" class="mr-auto">
        <h3 class="fz-20">Collaboration account profile</h3>
        <p class="fz-14 mb-6 mt-3 description">
          The profile picture of the collaboration account will be displayed
          when collaborating with several users. Click on the profile picture to
          change.
        </p>
      </div>
      <v-avatar
        color="primary"
        size="80"
        class="cursor-p"
        @click="$refs.uploadInput.onClick(false)"
      >
        <img :src="teamAvatar" alt="John"
      /></v-avatar>
      <input-upload @input="onInput" ref="uploadInput"></input-upload>
    </div>
    <div class="mt-5 config-item al-c">
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      teamName: "",
      file: null,
      teamAvatar: "https://cdn.vuetifyjs.com/images/john.jpg",
    };
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
  },
  mounted() {
    // console.log(this.userInfo);
  },
  methods: {
    async handleDelete() {
      try {
        await this.$confirm(
          "You are going to exit the collaborative account. Do you want to continue?",
          "Alert"
        );
        // do something
        await this.$http.post("$auth/cooperation/exit");
      } catch (error) {
        //
        console.log(error);
      }
    },
    async getAvatarSrc(file) {
      // console.log(file);
      // return new Promise((res, rej) => {
      //   let reader = new FileReader();
      //   reader.readAsDataURL(file);
      //   reader.onload = function () {
      //     res(reader.result);
      //   };
      //   reader.onerror = function (error) {
      //     rej(error);
      //   };
      // });
      console.log(URL.createObjectURL(file));
      this.teamAvatar = URL.createObjectURL(file);
    },
    async onInput(file) {
      this.file = file[0];
      this.getAvatarSrc(file[0]);
      // this.teamAvatar = src;
    },
    async handleSave() {
      try {
        const data = {
          teamName: this.teamName,
        };
        this.$loading();
        await this.$http.put("$auth/cooperation/teams", data);
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