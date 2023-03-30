<template>
  <div>
    <h3>Hash Deployment</h3>
    <v-row class="mt-3">
      <v-col :sm="3" :cols="12"
        ><v-select
          class="ipfs-input hide-msg"
          outlined
          :items="items"
          dense
          @change="onChange"
          v-model="seleted"
        ></v-select
      ></v-col>
      <v-col :sm="7" :cols="12" class="d-flex al-start">
        <v-text-field
          persistent-placeholder
          outlined
          dense
          label=""
          :placeholder="
            seleted == 'IPFS' ? 'Enter the IPFS CID' : 'Enter the IPNS'
          "
          v-model="ipfsPath"
        ></v-text-field>
      </v-col>
      <v-col :sm="2" :cols="12" class="d-flex al-start">
        <v-btn color="primary" @click="onStart">Start</v-btn>
      </v-col>
    </v-row>
    <div class="fz-14 gray">Deploy with IPFS, IPNS or ENS</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: ["IPFS", "IPNS", "ENS"],
      seleted: "IPFS",
      ipfsPath: "",
    };
  },
  methods: {
    onChange() {
      console.log("onchange");
    },
    onStart() {
      if (this.seleted == "ENS") {
        console.log(1);
      }
      // resolve hash
      this.$emit("onHashStart", {
        hash: this.ipfsPath,
        deployType: this.seleted,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>