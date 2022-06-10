<template>
  <v-skeleton-loader v-if="!info.id" type="article" />
  <v-row v-else>
    <v-col cols="12" md="4">
      <e-link :href="info.mainLink">
        <v-img
          class="bd-1 bdrs-5 w100p"
          :src="$getImgSrc(info.screenshot)"
          lazy-src="img/bg/empty/project.png"
          aspect-ratio="1"
          max-height="320"
        ></v-img>
      </e-link>
    </v-col>
    <v-col cols="12" md="6">
      <e-kv2 label="Deployment" class="mt-2">
        <a :href="'#' + buildPath">
          {{ info.domain }}
        </a>
      </e-kv2>

      <e-kv2
        label="Domains"
        class="mt-8"
        v-if="info.domains"
        :class="{
          'op-0 ev-n': info.platform != 'IPFS',
        }"
      >
        <div class="d-flex al-c">
          <h-domain class="mr-6" :val="info.domains[0].domain" />
          <e-menu v-if="info.domains.length > 1" offset-y open-on-hover>
            <v-btn slot="ref" color="warning" elevation="0" x-small rounded
              >+{{ info.domains.length - 1 }}</v-btn
            >
            <div class="bg-white pd-10 fz-14">
              <div
                class="pd-5"
                v-for="(row, j) in info.domains.slice(1)"
                :key="j"
              >
                <h-domain :val="info.domains[1 + j].domain" />
              </div>
            </div>
          </e-menu>
        </div>
      </e-kv2>

      <div class="mt-7 d-flex">
        <e-kv2 label="State">
          <h-status :val="info.state"></h-status>
        </e-kv2>
        <e-kv2 class="ml-auto" label="Created" style="min-width: 120px">
          <e-time>{{ info.repo.updateAt }}</e-time>
        </e-kv2>
      </div>

      <div class="mt-7 d-flex">
        <e-kv2 label="Branch">
          <div class="d-flex al-c f-wrap">
            <h-branch :info="info" class="fz-15" />
            <e-commit :info="info.commits" class="fz-14 ml-3"></e-commit>
          </div>
        </e-kv2>
        <e-kv2 class="ml-auto" :label="info.platform" style="min-width: 120px">
          <e-link
            class="fz-14"
            :href="$utils.getCidLink(info.hash, info.platform)"
          >
            {{ info.hash ? "Verify on " + info.platform : "Pending" }}
          </e-link>
        </e-kv2>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      userInfo: (s) => s.userInfo,
      info: (s) => s.projectInfo,
    }),
    buildPath() {
      const { name, id, taskId } = this.info;
      return `/hosting/build/${name}/${id}/${taskId}`;
    },
  },
};
</script>