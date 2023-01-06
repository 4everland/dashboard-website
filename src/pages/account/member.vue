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
        <v-col md="6">
          <h4>Address</h4>
          <div class="al-c">
            <v-select
              :items="['Email', 'Wallet']"
              v-model="accType"
              outlined
              dense
              style="max-width: 140px"
            ></v-select>
            <v-text-field outlined dense class="ml-4"></v-text-field>
          </div>
        </v-col>
      </v-row>
    </div>

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
export default {
  data() {
    return {
      accType: "Email",
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
};
</script>