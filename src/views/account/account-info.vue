<template>
  <div>
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <v-card class="user-info d-flex al-c pa-8">
      <div>
        <div class="avatar-box" @click="$refs.uploadInput.onClick(false)">
          <e-team-avatar
            class="cursor-p"
            :src="teamAvatar"
            :uid="teamInfo.teamId"
            :size="100"
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
      <div class="ml-8">
        <div>
          <div v-if="!isEdit" class="al-c">
            <span> {{ teamName }}</span>
            <v-icon
              color="primary"
              class="cursor-p ml-3"
              size="20"
              @click="onEdit"
              >mdi-pencil-outline</v-icon
            >
          </div>
          <div v-else class="al-c" style="width: 400px">
            <v-text-field
              v-model="teamName"
              maxlength="70"
              counter="70"
            ></v-text-field>
            <v-icon
              color="primary"
              class="cursor-p ml-3"
              size="20"
              @click="handleSave"
              >mdi-check</v-icon
            >
          </div>
        </div>

        <div class="al-c mt-6 gray">
          <div>
            <div>DID</div>
            <div class="mt-3 fz-14 al-c">
              <span>{{ onChain ? userInfo.euid.cutStr(6, 4) : "--" }}</span>
              <img
                class="ml-2 cursor-p"
                v-if="onChain"
                src="/img/icon/copy.svg"
                width="16"
                v-clipboard="userInfo.euid"
                @success="$toast('Copied!')"
              />
            </div>
          </div>
          <div class="ml-15">
            <div>
              <span class="ml-2">User Type</span>
              <v-icon
                class="ml-2"
                size="20"
                color="gray"
                @click="showStep = true"
                >mdi-alert-circle-outline</v-icon
              >
            </div>
            <div
              class="identification-tag px-3 al-c fz-14 mt-3 cursor-p d-ib"
              :style="{
                background: onChain ? '#6172F3' : '#dbdbdb',
              }"
              @click="$router.push('/billing/records?tab=Deposit History')"
            >
              <span class="fz-14"> {{ onChain ? "Standard" : "Trial" }}</span>
              <v-icon class="ml-3" size="16" color="#fff"
                >mdi-arrow-right-circle-outline</v-icon
              >
            </div>
          </div>
        </div>
      </div>
    </v-card>
    <v-dialog max-width="650" v-model="showStep">
      <div class="pa-7">
        <h3 class="fz-22 ta-c">User Type</h3>
        <div class="step-title">
          <v-icon color="#f49e28" size="20">mdi-check-circle</v-icon>
          <span class="ml-2 compeleted-status">Trial</span>
        </div>
        <div class="step-content-compeleted px-4 py-2 mx-2 mt-3">
          <div>
            You are in a trial status and can only access limited product
            functionalities.
          </div>
          <div class="gray fz-14 mt-3">Equity:</div>
          <ul class="gray fz-14 pl-3">
            <li>5 GB IPFS storage</li>
            <li>20 MB Arweave storage</li>
            <li>10 GB bandwidth</li>
            <li>100 build time</li>
          </ul>
        </div>
        <div class="step-title mt-4">
          <v-icon :color="onChain ? '#f49e28' : '#BDBDBD'" size="20"
            >mdi-check-circle</v-icon
          >
          <span class="ml-2" :class="{ 'compeleted-status': onChain }"
            >Standard</span
          >
        </div>
        <div
          class="step-content px-4 py-2 mx-2 mt-3"
          :class="{ 'step-content-compeleted': onChain }"
        >
          <div>
            Web3 decentralized on-chain identity, fully experience all the
            functionalities available.
          </div>
          <div class="al-c">
            <div>
              <div class="gray fz-14 mt-3">Advantage:</div>
              <ul class="gray fz-14 pl-3">
                <li>Web3 Identity</li>
                <li>Ownership of data</li>
                <li>Enhanced product functionalities</li>
                <li>Access to additional free resources</li>
              </ul>
            </div>
            <div class="ml-5">
              <div class="gray fz-14 mt-3">Equity:</div>
              <ul class="gray fz-14 pl-3">
                <li>6 GB IPFS storage</li>
                <li>100 MB Arweave storage</li>
                <li>100 GB bandwidth</li>
                <li>250 build time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import InputUpload from "@/views/bucket/components/input-upload";
import { mapGetters, mapState } from "vuex";

export default {
  components: {
    InputUpload,
  },
  data() {
    return {
      teamName: "",
      file: null,
      teamAvatar: "",
      showStep: false,
      isEdit: false,
      breadcrumbsItems: [
        {
          text: "Configurations",
          disabled: true,
        },
      ],
    };
  },
  created() {
    this.initInfo();
  },
  computed: {
    ...mapState({
      onChain: (s) => s.onChain,
      userInfo: (s) => s.userInfo,
    }),
    ...mapGetters(["teamInfo"]),
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
    async getAvatarSrc(file) {
      try {
        this.teamAvatar = URL.createObjectURL(file);
        const formData = new FormData();
        formData.append("file", file);
        this.$loading();
        const { data } = await this.$http.post("$auth/media", formData);
        await this.$http.put("$auth/cooperation/teams", { teamAvatar: data });
        this.$setMsg("updateTeam");
        this.$setMsg("updateUser");
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
        this.$loading();
        await this.$http.put("$auth/cooperation/teams", data);
        this.$setMsg("updateTeam");
        this.$setMsg("updateUser");
        this.$loading.close();
        await this.$toast("Save successfully");
        this.isEdit = false;
      } catch (error) {
        console.log(error);
        this.$refs.teamNameRef.onFocus();
      }
    },
    onLimitSize() {
      this.$alert("The uploaded image shouldn't be larger than 280KB.");
    },
    onEdit() {
      this.isEdit = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .breadcrumbs {
    position: static !important;
  }
  .v-breadcrumbs {
    padding: 0 0 16px 0;
    margin-top: -12px;
  }
}
.breadcrumbs {
  position: fixed;
  top: 0;
  left: 230px;
  z-index: 10;
}
.identification-tag {
  color: #fff;
  line-height: 24px;
  background: #dbdbdb;
  border-radius: 12px;
}
.avatar-box {
  position: relative;
  .avatar-mask {
    width: 100px;
    height: 100px;
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

.step-title {
  color: #bdbdbd;
}
.step-content {
  border-left: 2px solid #dbdbdb;
}
.step-content-compeleted {
  border-left: 2px solid #f49e28 !important;
}
.compeleted-status {
  color: #f49e28;
}
ul,
li {
  list-style: disc;
}
</style>
