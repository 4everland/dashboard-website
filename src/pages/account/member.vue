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
                accBody.type == 'EMAIL' ? 'Email adress' : 'Wallet address'
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
      <v-data-table :headers="headers" hide-default-footer :items="list">
        <template v-slot:item.act="{ item }">
          <div v-if="item.role == 'Owner'">
            <v-btn text color="primary" small>Disband</v-btn>
          </div>
          <div v-else>
            <v-btn
              text
              color="primary"
              small
              @click="
                onAct(item, item.status == 'DISABLED' ? 'ENABLE' : 'DISABLE')
              "
            >
              {{ item.status == "DISABLED" ? "Enable" : "Disable" }}
            </v-btn>
            <v-btn text color="primary" small @click="onAct(item, 'access')"
              >Permission</v-btn
            >
            <v-btn text color="primary" small @click="onAct(item, 'REMOVE')"
              >Remove</v-btn
            >
            <v-btn text color="primary" small>Note</v-btn>
          </div>
        </template>
      </v-data-table>
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
      list: [
        {
          targetName: "0xdd...dddd",
          role: "Owner",
          status: "Valid",
        },
        {
          targetName: "0xdd...dddd",
          role: "Member",
          status: "Valid",
          access: ["HOSTING"],
        },
      ],
      headers: [
        {
          text: "Member",
          value: "targetName",
        },
        {
          text: "Role",
          value: "role",
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
        await this.$http.post("{auth}/cooperation/invitations", body);
        this.$toast("Inviting member successfully.");
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    async getList() {
      if (Date) return;
      try {
        const { data } = await this.$http.get("{auth}/cooperation/invitations");
        this.list = data.items;
      } catch (error) {
        console.log(error);
      }
    },
    async setMember(body) {
      try {
        this.$loading();
        await this.$http.put("{auth}/cooperation/member", body);
        this.getList();
      } catch (error) {
        console.log(error);
      }
    },
    onAct(row, act) {
      const body = {
        invitationId: row.invitationId,
      };
      if (act == "access") {
        this.onAccess(row.access, row.invitationId);
      } else if (["DISABLE", "ENABLE", "REMOVE"].includes(act)) {
        body.status = act;
      }
    },
    getText() {
      const el = this.$refs.permission;
      if (!el) return "";
      return el.getText(this.accBody.access);
    },
    onSaveAccess() {
      if (this.curId) {
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