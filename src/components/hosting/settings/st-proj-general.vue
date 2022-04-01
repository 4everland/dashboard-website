<template>
  <div>
    <div class="bd-1">
      <h4>Project Name</h4>
      <div class="gray fz-14">
        Used to identify your Project in the Dashboard, 4everland CLI, and in
        the URL of your Deployments.
      </div>
      <v-text-field v-model="name" outlined dense />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
    };
  },
};
</script>