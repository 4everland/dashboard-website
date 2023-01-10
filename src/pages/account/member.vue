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
            <v-text-field outlined dense class="ml-4"></v-text-field>
          </div>
        </v-col>
        <v-col cols="12" md="5">
          <h4>Permission</h4>
          <div>
            <v-text-field
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
        <v-btn color="primary" width="100px">Invite</v-btn>
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
        :headers="headers"
        hide-default-footer
        :items="list"
      ></v-data-table>
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
          member: "0xdd...dddd",
          role: "Owner",
          status: "Valid",
        },
      ],
      headers: [
        {
          text: "Member",
          value: "member",
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
        },
      ],
    };
  },
  methods: {
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