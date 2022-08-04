<template>
  <v-skeleton-loader v-if="!info.id" type="article" />
  <div v-else>
    <div class="main-wrap auto">
      <v-row>
        <v-col cols="12" md="4">
          <e-link :href="info.mainLink">
            <v-img
              class="bd-1 bdrs-5 w100p"
              :src="$getImgSrc(info.screenshot)"
              lazy-src="img/bg/empty/project.png"
              aspect-ratio="1"
              max-height="270"
            ></v-img>
          </e-link>
        </v-col>
        <v-col cols="12" md="6">
          <e-kv label="Deployment" class="mt-2">
            <a :href="'#' + buildPath">
              {{ info.domain }}
            </a>
          </e-kv>

          <e-kv
            label="Domains"
            class="mt-9"
            v-if="info.domains"
            :class="{
              'op-0 ev-n': info.platform != 'IPFS',
            }"
          >
            <div class="d-flex al-c">
              <h-domain class="mr-6" :val="info.domains[0].domain" />
              <e-menu v-if="info.domains.length > 1" offset-y open-on-hover>
                <v-btn slot="ref" color="warning" elevation="0" x-small
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
          </e-kv>

          <div class="mt-9 d-flex">
            <e-kv :label="info.platform" style="min-width: 120px">
              <div class="al-c">
                <e-link
                  class="fz-14"
                  :href="$utils.getCidLink(info.hash, info.platform)"
                >
                  {{ info.hash ? info.hash.cutStr(4, 4) : "Pending" }}
                </e-link>
                <img
                  v-if="info.hash"
                  src="img/svg/copy.svg"
                  width="12"
                  class="ml-3 hover-1"
                  @success="$toast('Copied to clipboard !')"
                  v-clipboard="info.hash"
                />
              </div>
            </e-kv>
            <e-kv class="ml-auto" label="IPNS" min-width="90px">
              <e-tooltip top slot="sub">
                <v-icon slot="ref" color="#666" size="14" class="pa-1"
                  >mdi-help-circle-outline</v-icon
                >
                <span
                  >IPFS exclusive gateway is recommended for access since the
                  IPNS broadcast mechanism may cause a 404 error.
                </span>
              </e-tooltip>

              <div class="al-c" v-if="info.ipns">
                <e-link
                  class="fz-14"
                  :href="$utils.getCidLink(info.ipns, 'IPNS')"
                >
                  {{ info.ipns.cutStr(4, 4) }}
                </e-link>
                <img
                  src="img/svg/copy.svg"
                  width="12"
                  class="ml-3 hover-1"
                  @success="$toast('Copied to clipboard !')"
                  v-clipboard="info.ipns"
                />
              </div>
              <v-btn
                v-else
                x-small
                color="primary"
                :loading="loadingIpns"
                @click="getIpns"
                >Get IPNS</v-btn
              >
            </e-kv>
          </div>

          <div class="mt-9 d-flex">
            <e-kv label="State">
              <h-status :val="info.state"></h-status>
            </e-kv>
            <e-kv class="ml-auto" label="Created" style="min-width: 195px">
              <e-time>{{ info.repo.updateAt }}</e-time>
            </e-kv>
          </div>

          <div class="mt-9 d-flex">
            <e-kv label="Branch">
              <div class="d-flex al-c f-wrap">
                <h-branch :info="info" class="fz-15" />
                <e-commit :info="info.commits" class="fz-14 ml-3"></e-commit>
              </div>
            </e-kv>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="mt-5">
      <!-- <h4 class="mb-5">Preview Deployments</h4> -->
      <proj-deployments :limit="5" />
    </div>
  </div>
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
  data() {
    return {
      loadingIpns: false,
    };
  },
  methods: {
    async getIpns() {
      try {
        this.loadingIpns = true;
        await this.$http2.put("/project/ipns/sns/" + this.info.id, {
          cid: this.info.hash,
        });
        await this.$store.dispatch("getProjectInfo", this.info.id);
      } catch (error) {
        //
      }
      this.loadingIpns = false;
    },
  },
};
</script>