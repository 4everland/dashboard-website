<template>
  <div style="height: 100%">
    <div class="breadcrumbs">
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <div v-if="!onChain" class="activate">
      <div class="empty">
        <div class="pa-3 mt-5 ta-c">
          <img src="/img/svg/gateway/lock.svg" width="180" />
        </div>
        <div class="d-flex f-center">
          <div style="max-width: 550px">
            Activate your account to unlock the Team Member.
          </div>
        </div>
        <div
          class="ta-c mt-8"
          :class="{
            hidden:
              teamInfo.isMember && teamInfo.access?.indexOf('RESOURCE') == -1,
          }"
        >
          <v-btn color="primary" width="120" @click="handleUpgrad"
            >Activate</v-btn
          >
        </div>
      </div>
    </div>

    <div v-else>
      <div class="main-wrap auto">
        <h3>Invite members</h3>
        <div class="gray fz-14 mt-2">
          You can invite up to 3 team members to this Beta version. Please,
          contact
          <a href="https://discord.gg/4everland" target="_blank">us</a>
          if you want to invite more.
        </div>
        <v-form ref="form">
          <v-row class="mt-3">
            <v-col cols="12" md="7">
              <h4>Members</h4>
              <div class="al-c">
                <v-select
                  :items="typeItems"
                  item-text="text"
                  item-value="value"
                  v-model="accBody.type"
                  @change="onSeleted"
                  outlined
                  dense
                  style="max-width: 140px"
                ></v-select>
                <v-text-field
                  v-model="accBody.target"
                  ref="targetIpt"
                  :placeholder="
                    accBody.type == 'EMAIL' ? 'Enter email' : 'Enter wallet'
                  "
                  outlined
                  :rules="[
                    (v) => (v && !!v.trim()) || 'Invalid Address',
                    (v) => {
                      if (accBody.type == 'EMAIL') {
                        return (
                          this.$regMap.email.test(accBody.target) ||
                          'Invalid Email Address'
                        );
                      }
                      return true;
                    },
                  ]"
                  dense
                  class="ml-4"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="5">
              <h4>Permissions</h4>
              <div>
                <v-text-field
                  placeholder="Set permissions"
                  outlined
                  dense
                  readonly
                  :rules="[
                    (v) =>
                      (v && !!v.trim()) ||
                      'The permissions for member are not configured',
                  ]"
                  :value="getText(accBody.access)"
                  @click="onAccess(accBody.access)"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-form>
        <div class="ta-r">
          <v-btn color="primary" width="100px" @click="addMember">Invite</v-btn>
        </div>
      </div>

      <v-dialog v-model="showPermission" max-width="700px" eager>
        <account-permission
          ref="permission"
          v-model="curAccess"
          @close="showPermission = false"
          @save="onSaveAccess"
        />
      </v-dialog>

      <div class="main-wrap auto mt-5">
        <h3>Members</h3>
        <v-data-table
          :loading="listLoading"
          :headers="headers"
          hide-default-footer
          :items="list"
        >
          <template v-slot:item.act="{ item }">
            <div v-if="item.role == 'OWNER'">
              <v-btn
                text
                color="primary"
                small
                :disabled="teamInfo.isMember"
                @click="onDisband"
                v-if="list.length > 1"
                >Disband</v-btn
              >
              <span v-else class="pl-3">--</span>
            </div>
            <div v-else>
              <v-btn
                text
                color="primary"
                small
                :disabled="
                  item.status == 'PENDING' ||
                  item.status == 'REJECT' ||
                  isMemberMe(item)
                "
                @click="onAccess(item.access, item.invitationId)"
                >Edit</v-btn
              >
              <v-btn text color="primary" small @click="onAct(item, 'REMOVE')"
                >Remove</v-btn
              >
              <v-btn text color="primary" small @click="onAct(item, 'note')"
                >Note</v-btn
              >
            </div>
          </template>
        </v-data-table>

        <e-empty v-if="!list.length" class="pt-6">No Invitations</e-empty>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/utils/bus";
import AccountPermission from "@/views/account/account-permission.vue";
import { mapGetters, mapState } from "vuex";

export default {
  components: {
    AccountPermission,
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      onChain: (s) => s.onChain,
    }),
    ...mapGetters(["teamInfo"]),
  },
  data() {
    return {
      showPermission: false,
      curId: null,
      curAccess: [],
      accBody: {
        type: "WALLET",
        target: "",
        access: [],
      },
      typeItems: [
        {
          text: "Wallet",
          value: "WALLET",
        },
        {
          text: "Email",
          value: "EMAIL",
        },
      ],
      listLoading: false,
      list: [],
      headers: [
        {
          text: "Members",
          value: "name",
        },
        {
          text: "Role",
          value: "roleTxt",
        },
        // {
        //   text: "Note",
        //   value: "note",
        //   width: "20%",
        // },
        {
          text: "Status",
          value: "staTxt",
        },
        {
          text: "Action",
          value: "act",
          width: "33%",
          class: ["text-indent-12"],
        },
      ],
      breadcrumbsItems: [
        {
          text: "Members",
          disabled: true,
        },
      ],
    };
  },
  watch: {
    curAccess() {
      console.log(this.curAccess);
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleUpgrad() {
      bus.$emit("showDialog");
    },
    isMemberMe(item) {
      return this.teamInfo.isMember && item.uid == this.userInfo.uid;
    },
    async addMember() {
      try {
        const valid = await this.$refs.form.validate();
        if (!valid) return;
        const body = this.accBody;
        this.$loading();
        await this.$http.post("$auth/cooperation/invitations", {
          invitation: body,
        });
        this.$loading.close();
        this.$refs.form.resetValidation();
        this.accBody.target = "";
        this.accBody.access = [];
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    onSeleted() {
      this.$refs.targetIpt.reset();
    },
    capTxt(txt) {
      if (/pending/i.test(txt)) return "Pending verification";
      return (txt || "").toLowerCase().capitalize();
    },
    statusFormat(status) {
      const Obj = {
        VALID: "Active",
        PENDING: "Invite Pending",
        REJECT: "Reject",
        DISABLED: "Disabled",
      };
      return Obj[status];
    },
    async getList() {
      try {
        this.listLoading = true;
        const { data } = await this.$http.get("$auth/cooperation/invitations");
        this.list = data.items.map((it) => {
          it.name = it.targetName.cutStr(6, 4);
          if (it.note) {
            it.name = `${it.note.cutStr(4, 3)}(${it.name})`;
          }
          if (it.invitationStatus) it.status = it.invitationStatus;
          it.roleTxt = this.capTxt(it.role);
          it.staTxt = this.statusFormat(it.status);
          return it;
        });
      } catch (error) {
        console.log(error);
      }
      this.listLoading = false;
    },
    async onDisband() {
      try {
        await this.$confirm(
          "The operation logs and all members will be deleted. Are you sure you want to proceed?"
        );
        this.$loading();
        for (const row of this.list) {
          if (row.role == "OWNER") continue;
          await this.saveMember({
            invitationId: row.invitationId,
            disband: true,
            status: "REMOVE",
          });
        }
        this.$loading.close();
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    async onAct(row, act, opts = {}) {
      const body = {
        invitationId: row.invitationId,
        ...opts.body,
      };
      if (act == "note") {
        const { value } = await this.$prompt("Enter note information", "Note", {
          defaultValue: row.note,
          inputAttrs: {
            counter: true,
            maxlength: 100,
            trim: true,
            required: true,
          },
        });
        body.note = value;
      } else if (["DISABLE", "ENABLE", "REMOVE"].includes(act)) {
        let tip = "";
        if (act == "DISABLE")
          tip =
            "Disable or remove the collaboration permission for the following user?";
        else if (act == "REMOVE")
          tip = `Remove the following member from the account?`;
        if (tip && !opts.noTip) {
          tip +=
            '<p class="mt-5 warn-1">' + row.targetName.cutStr(6, 4) + "</p>";
          await this.$confirm(tip);
        }
        body.status = act;
      }
      this.setMember(body, row);
    },
    saveMember(body) {
      return this.$http.put("$auth/cooperation/member", body);
    },
    async setMember(body, row) {
      console.log(body);
      try {
        this.$loading();
        await this.saveMember(body);
        this.$loading.close();
        this.getList();
      } catch (error) {
        console.log(error);
      }
      if (body.status == "REMOVE" && row && this.isMemberMe(row)) {
        location.href = "/";
      }
    },
    getText() {
      const el = this.$refs.permission;
      if (!el) return "";
      return el.getText(this.accBody.access);
    },
    onSaveAccess() {
      if (this.curId) {
        this.setMember({
          invitationId: this.curId,
          access: this.curAccess,
        });
      } else {
        this.accBody.access = [...this.curAccess];
      }
      this.showPermission = false;
    },
    onAccess(arr, id) {
      this.curId = id;
      this.curAccess = [...arr];
      this.showPermission = true;
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
.activate {
  height: 100%;
  position: relative;
  .empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -90%);
  }
}
</style>
