<template>
  <div>
    <div class="main-wrap auto">
      <h3>Add New</h3>
      <div class="gray fz-14 mt-2">
        Invite account collaborators. The beta version can only invite up to
        three people and can only join three collaborative accounts.
        <a href="">Please get in touch with us for more information.</a>
      </div>
      <v-row class="mt-3">
        <v-col cols="12" md="7">
          <h4>Address</h4>
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
                accBody.type == 'EMAIL' ? 'Email address' : 'Wallet address'
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
              placeholder="Select Permission"
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
              :disabled="item.status == 'PENDING'"
            >
              {{ item.status == "DISABLED" ? "Enable" : "Disable" }}
            </v-btn>
            <v-btn
              text
              color="primary"
              small
              :disabled="item.status == 'PENDING'"
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

export default {
  components: {
    AccountPermission,
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
          text: "Member",
          value: "name",
        },
        {
          text: "Role",
          value: "role",
        },
        {
          text: "Note",
          value: "note",
          width: "20%",
        },
        {
          text: "Status",
          value: "status",
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
          msg = "No permission selected.";
        }
        if (msg) {
          return this.$toast(msg);
        }
        this.$loading();
        await this.$http.post("$auth/cooperation/invitations", {
          invitation: body,
        });
        this.$loading.close();
        this.accBody.target = "";
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    async getList() {
      try {
        this.listLoading = true;
        const { data } = await this.$http.get("$auth/cooperation/invitations");
        this.list = data.items.map((it) => {
          it.name = it.targetName.cutStr(6, 4);
          if (it.invitationStatus) it.status = it.invitationStatus;
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
          "All collaborative accounts, members, and operation records will be deleted. Please confirm before proceeding."
        );
        this.$loading();
        for (const row of this.list) {
          if (row.role == "OWNER") continue;
          await this.onAct(row, "REMOVE", {
            noTip: true,
          });
        }
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    async onAct(row, act, opts = {}) {
      const body = {
        invitationId: row.invitationId,
      };
      if (act == "note") {
        const { value } = await this.$prompt("Enter note information", "Note", {
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
        if (act == "REMOVE")
          tip = `Are you sure to remove this member(${row.targetName}) ?`;
        if (tip && !opts.noTip) await this.$confirm(tip);
        body.status = act;
      }
      this.setMember(body);
    },
    async setMember(body) {
      console.log(body);
      try {
        this.$loading();
        await this.$http.put("$auth/cooperation/member", body);
        this.$loading.close();
        this.getList();
      } catch (error) {
        console.log(error);
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