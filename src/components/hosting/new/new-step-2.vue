<template>
  <div>
    <v-dialog v-if="info" v-model="isDone" max-width="650" persistent>
      <div class="pa-5 d-flex al-c">
        <!--  -->
        <v-img
          class="bd-1 bdrs-5 w100p"
          :src="$getImgSrc(info.screenshotPath)"
          lazy-src="img/bg/empty/project.png"
          aspect-ratio="1"
          width="160"
        ></v-img>
        <div class="ml-5">
          <h3 class="fz-20">Congratulations!</h3>
          <div class="fz-14 mt-5 gray-6">
            <p>Your project has been successfully deployed.</p>
            <p class="mt-2">
              We also offer CLI deployment methods. Click here to
              <a href="https://docs.hosting.4everland.org/cli/" target="_blank"
                >learn more</a
              >.
            </p>
          </div>
          <div class="mt-8">
            <v-btn
              :href="'//' + info.domain"
              target="_blank"
              color="primary"
              rounded
              small
              width="120"
            >
              <span>Visit</span>
              <img
                src="img/svg/hosting/share-open.svg"
                width="14"
                class="ml-2"
              />
            </v-btn>
            <v-btn
              to="/hosting/projects"
              @click="showPop = false"
              outlined
              rounded
              small
              min-width="130"
              class="ml-3"
            >
              Open Dashboard
            </v-btn>
          </div>
        </div>
      </div>
    </v-dialog>

    <div class="main-wrap">
      <h3>Deploy</h3>
      <div class="d-flex al-c" v-if="!isDone && info">
        <v-progress-circular
          :size="15"
          :width="1.5"
          color="#999"
          indeterminate
        />
        <div class="gray fz-15 ml-3">
          Deployment started <e-time>{{ info.createAt }}</e-time>
        </div>
      </div>
    </div>

    <build-overview-logs @done="isDone = true" @info="info = $event" />

    <div class="ta-r mt-4" v-if="!isDone">
      <v-btn rounded outlined @click="onCancel">Cancel</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDone: false,
      info: null,
      showPop: false,
    };
  },
  watch: {
    isDone(val) {
      if (val)
        setTimeout(() => {
          const { path, query } = this.$route;
          if (path == "/hosting/new" && query.taskId) this.showPop = true;
        }, 500);
    },
  },
  methods: {
    onCancel() {
      this.$confirm("", "Are you sure to quit this deployment ?").then(() => {
        this.$router.replace("/hosting/projects");
      });
    },
  },
};
</script>