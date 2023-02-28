<template>
  <div>
    <div class="main-wrap auto">
      <h3>Invite members</h3>
      <div class="gray fz-14 mt-2">
        You can invite up to 3 members for this Beta version. Please contact
        <a href="https://discord.gg/4everland" target="_blank">us</a>
        if you want to invite more.
      </div>
      <v-row class="mt-3">
        <v-col cols="12" md="7">
          <h4>Member</h4>
          <div class="al-c">
            <v-select
              :items="typeItems"
              item-text="text"
              item-value="value"
              v-model="accBody.type"
              outlined
              dense
              style="max-width: 140px"
            ></v-select>
            <v-text-field
              v-model="accBody.target"
              :placeholder="
                accBody.type == 'EMAIL' ? 'Enter email' : 'Enter wallet'
              "
              outlined
              dense
              class="ml-4"
            ></v-text-field>
          </div>
        </v-col>
        <v-col cols="12" md="5">
          <h4>Permission</h4>
          <div>
            <v-text-field
              placeholder="Set permissions"
              outlined
              dense
              readonly
              :value="getText(accBody.access)"
              @click="onAccess(accBody.access)"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>
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
            <span v-else>——</span>
          </div>
          <div v-else>
            <v-btn
              text
              color="primary"
              small
              @click="
                onAct(item, item.status == 'DISABLED' ? 'ENABLE' : 'DISABLE')
              "
              :disabled="
                item.status == 'PENDING' ||
                item.status == 'REJECT' ||
                isMemberMe(item)
              "
            >
              {{ item.status == "DISABLED" ? "Enable" : "Disable" }}
            </v-btn>
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
              >Permission</v-btn
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
</template>

<script>
import AccountPermission from "@/views/account/account-permission.vue";
import { mapGetters, mapState } from "vuex";

export default {
  components: {
    AccountPermission,
  },
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
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
    isMemberMe(item) {
      return this.teamInfo.isMember && item.uid == this.userInfo.uid;
    },
    async addMember() {
      try {
        const body = this.accBody;
        let msg = "";
        if (!body.target) msg = "Invalid Address";
        else if (
          body.type == "EMAIL" &&
          !this.$regMap.email.test(body.target)
        ) {
          msg = "Invalid email address";
        } else if (!body.access.length) {
          msg = "The permissions for member are not configured";
        }
        if (msg) {
          this.$toast(msg);
          return;
        }
        this.$loading();
        await this.$http.post("$auth/cooperation/invitations", {
          invitation: body,
        });
        this.$loading.close();
        this.accBody.target = "";
        this.accBody.access = [];
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    capTxt(txt) {
      if (/pending/i.test(txt)) return "Pending verification";
      return (txt || "").toLowerCase().capitalize();
    },
    async getList() {
      try {
        this.listLoading = true;
        const { data } = await this.$http.get("$auth/cooperation/invitations");
        this.list = data.items.map((it) => {
          it.name = it.targetName.cutStr(6, 4);
          if (it.invitationStatus) it.status = it.invitationStatus;
          it.roleTxt = this.capTxt(it.role);
          it.staTxt = this.capTxt(it.status);
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
            "Disable or remove the collaboration permission for the following users?";
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
