<template>
  <div class="account-config-container">
    <div class="pa-5 config-item">
      <h3 class="fz-22">Collaboration account name</h3>
      <p class="fz-14 mb-6">
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
        <v-btn color="primary" width="120px" class="ml-3">Save</v-btn>
      </div>
    </div>
    <div class="pa-5 mt-5 config-item"></div>
    <div class="pa-5 mt-5 config-item"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teamName: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.config-item {
  background: #ffffff;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.11);
  border-radius: 10px;
}
</style>