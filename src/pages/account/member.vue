<template>
  <div>
    <div class="main-wrap auto">
      <h3>Add New</h3>
      <div class="gray fz-14 mt-2">
        nvite account collaborators. The beta version can only invite up to
        three people and can only join three collaborative accounts.
        <a href="">Please get in touch with us for more information.</a>
      </div>
      <v-row>
        <v-col>
          <h4>Address</h4>
          <div class="al-c">
            <!-- <v-select :items="['Email', 'Wallet']" v-model="accType"></v-select> -->
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accType: "Email",
    };
  },
};
</script>