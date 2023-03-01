<template>
  <div class="account-config-container">
    <div class="config-item" v-if="hasAccess">
      <h3 class="fz-20">Account name</h3>
      <p class="fz-14 mb-6 mt-3 description">
        The name will be displayed when members are invited to manage your
        4EVERLAND account.
      </p>
      <div class="d-flex">
        <v-text-field
          persistent-placeholder
          outlined
          dense
          label=""
          maxlength="70"
          counter="70"
          v-model="teamName"
        ></v-text-field>
        <v-btn
          color="primary"
          width="120px"
          class="ml-5"
          :disabled="!teamName"
          @click="handleSave"
          >Save</v-btn
        >
      </div>
    </div>
    <div class="mt-5 config-item al-c" v-if="hasAccess">
      <div style="width: 60%" class="mr-auto">
        <h3 class="fz-20">Account photo</h3>
        <p class="fz-14 mb-6 mt-3 description">
          The photo will be displayed when members are invited to manage your
          4EVERLAND account. File types supported: JPG, JPEG, PNG, WEBP. Max
          file size: 280 KB
        </p>
      </div>
      <div class="avatar-box" @click="$refs.uploadInput.onClick(false)">
        <e-team-avatar
          class="cursor-p"
          :src="teamAvatar"
          :uid="teamInfo.teamId"
        ></e-team-avatar>
        <div class="avatar-mask">
          <img :src="`/img/svg/account/upload.svg`" height="20" />
        </div>
      </div>

      <input-upload
        @input="onInput"
        accept="image/jpg, image/jpeg, image/png, image/webp"
        ref="uploadInput"
        :limitSize="29 * 1e4"
        @onLimitSize="onLimitSize"
      ></input-upload>
    </div>
    <div class="mt-5 config-item al-c" v-if="teamInfo.isMember">
      <div style="width: 60%" class="mr-auto">
        <h3 class="fz-20">Leave Account</h3>
        <p class="fz-14 mb-6 mt-3 description">
          You won't be able to manage the account's projects or content when you
          leave the account, and the account will be hidden.
        </p>
      </div>
      <v-btn color="primary" width="120px" outlined @click="handleDelete"
        >Exit</v-btn
      >
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
      if (this.teamInfo.type && this.teamInfo.status !== "DISABLED") {
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
          "Are you sure you want to leave the account?",
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
        await this.$toast("Save successfully");
      } catch (error) {
        console.log(error);
      }
      this.$loading.close();
    },
    async onInput(file) {
      try {
        this.file = file[0];
        await this.getAvatarSrc(file[0]);
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
        await this.$toast("Save successfully");
      } catch (error) {
        console.log(error);
      }
    },
    onLimitSize() {
      this.$alert("The uploaded image shouldn't be larger than 280KB.");
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
.avatar-box {
  position: relative;
  .avatar-mask {
    width: 80px;
    height: 80px;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
