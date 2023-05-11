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
              lazy-src="/img/bg/empty/project.png"
              aspect-ratio="1"
              max-height="270"
            ></v-img>
          </e-link>
        </v-col>
        <v-col cols="12" md="6">
          <e-kv
            :label="
              info.platform == 'GREENFIELD'
                ? 'BNB Greenfield Testnet'
                : info.platform
            "
            style="min-width: 120px"
          >
            <e-tooltip
              top
              slot="sub"
              v-if="info.platform == 'GREENFIELD' && info.greenfield"
            >
              <v-icon slot="ref" color="#666" size="14" class="pa-1"
                >mdi-help-circle-outline</v-icon
              >
              <span
                >The file has been uploaded to the
                {{ info.greenfield.bucket }} greenfield bucket.
              </span>
            </e-tooltip>
            <div class="al-c" v-if="info.platform != 'GREENFIELD'">
              <e-link
                class="fz-14"
                :href="$utils.getCidLink(info.hash, info.platform, info.online)"
                v-if="info.hash"
              >
                {{ showHashVal(info.hash, info.platform) }}
              </e-link>
              <h-status v-if="!info.hash" :val="info.state"></h-status>
              <img
                v-if="info.hash"
                src="/img/svg/copy.svg"
                width="12"
                class="ml-3 hover-1"
                @success="$toast('Copied!')"
                v-clipboard="info.hash"
              />
            </div>

            <div class="al-c" v-else>
              <e-link
                class="fz-14"
                :href="$utils.getGreenfieldLink(info.greenfield.tx)"
                v-if="info.greenfield"
              >
                {{ showHashVal(greenfieldHash, info.platform) }}
              </e-link>
              <h-status v-if="!info.greenfield" :val="info.state"></h-status>
              <img
                v-if="info.greenfield"
                src="/img/svg/copy.svg"
                width="12"
                class="ml-3 hover-1"
                @success="$toast('Copied!')"
                v-clipboard="$utils.getGreenfieldLink(info.greenfield.tx)"
              />
            </div>
          </e-kv>
          <e-kv class="mt-9" label="IPNS" min-width="100px" v-if="showIpns">
            <e-tooltip top slot="sub">
              <v-icon slot="ref" color="#666" size="14" class="pa-1"
                >mdi-help-circle-outline</v-icon
              >
              <span
                >IPFS exclusive gateway is recommended for access since the IPNS
                broadcast mechanism may cause a 404 error.
              </span>
            </e-tooltip>

            <div class="al-c" v-if="info.ipns">
              <e-link
                class="fz-14"
                :href="$utils.getCidLink(info.ipns, 'IPNS', info.online)"
              >
                {{ showHashVal(info.ipns, "IPNS") }}
              </e-link>
              <img
                src="/img/svg/copy.svg"
                width="12"
                class="ml-3 hover-1"
                @success="$toast('Copied!')"
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
          <e-kv label="Domains" class="mt-9" v-if="info.domains">
            <e-tooltip top slot="sub" v-if="!info.online">
              <v-icon slot="ref" color="#666" size="14" class="pa-1"
                >mdi-alert-circle-outline</v-icon
              >
              <span>The domain can't be accessed. </span>
            </e-tooltip>
            <div class="d-flex al-c">
              <h-domain
                class="mr-6"
                :val="domains[0]"
                :disabled="!info.online"
              />
              <e-menu v-if="domains.length > 1" offset-y open-on-hover>
                <v-btn
                  slot="ref"
                  :color="info.online ? 'error' : 'gray'"
                  rounded
                  elevation="0"
                  x-small
                  >+{{ domains.length - 1 }}</v-btn
                >
                <div class="bg-white pd-10 fz-14">
                  <div
                    class="pd-5"
                    v-for="(row, j) in domains.slice(1)"
                    :key="j"
                  >
                    <h-domain :val="row" :disabled="!info.online" />
                  </div>
                </div>
              </e-menu>
            </div>
          </e-kv>
          <div class="mt-9 d-flex">
            <e-kv label="Status">
              <h-status :val="!info.online ? 'Removed' : info.state"></h-status>
            </e-kv>
            <e-kv class="ml-auto" label="Created" style="min-width: 195px">
              <e-time>{{ info.createAt }}</e-time>
            </e-kv>
          </div>
          <div
            class="mt-9"
            v-if="
              hashDeploy(info.deployType) &&
              info.platform != 'GREENFIELD' &&
              info.platform != 'AR'
            "
          >
            <msg-line-vertical
              label="Base IPFS"
              :content="showHashVal(info.ipfsPath, 'IPFS')"
              :state="info.state"
              :online="info.online"
              v-if="info.platform != 'IPFS' && info.deployType != 'IPNS'"
            ></msg-line-vertical>

            <msg-line-vertical
              label="Base IPFS"
              :content="showHashVal(info.cid, 'IPFS')"
              :state="info.state"
              :online="info.online"
              v-if="info.platform != 'IPFS' && info.deployType == 'IPNS'"
            ></msg-line-vertical>

            <msg-line-vertical
              class="mt-8"
              label="Base IPNS"
              :online="info.online"
              :content="showHashVal(info.ipfsPath, 'IPNS')"
              platForm="IPNS"
              :state="info.state"
              v-if="info.deployType == 'IPNS'"
            ></msg-line-vertical>
          </div>
          <div
            class="mt-9 d-flex"
            v-if="!hashDeploy(info.deployType) && !info.cli"
          >
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
import HDomain from "@/views/hosting/common/h-domain";
import HStatus from "@/views/hosting/common/h-status";
import HBranch from "@/views/hosting/common/h-branch";
import ECommit from "@/views/hosting/common/e-commit";
import ProjDeployments from "@/views/hosting/project/proj-deployments";
import MsgLineVertical from "@/views/hosting/common/msg-line-vertical";
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
    domains() {
      if (!this.info) return;
      let arr = this.info.domains.map((it) => it.domain);
      if (arr.includes(this.info.domain)) return arr;
      arr.push(this.info.domain);
      return arr;
    },
    showIpns() {
      return (
        this.info.platform != "IC" &&
        this.info.platform != "AR" &&
        this.info.platform != "GREENFIELD"
      );
    },
    hashDeploy() {
      return function (type) {
        return type == "CID" || type == "IPNS";
      };
    },
    transformIpfsPath() {
      return function (val) {
        return val.replace("/ipfs/", "").replace("/ipns/", "");
      };
    },
    greenfieldHash() {
      if (this.info.platform == "GREENFIELD" && this.info.greenfield) {
        return this.info.greenfield.bucket + "/" + this.info.greenfield.object;
      }
      return "";
    },
    showHashVal() {
      return function (val, plat) {
        if (!val) return undefined;
        if (plat == "IC") {
          return "ic://" + val;
        } else if (plat == "AR") {
          return "ar://" + val;
        } else if (plat == "GREENFIELD") {
          return "gnfs://" + val;
        } else if (plat == "IPNS") {
          return "ipns://" + val;
        } else {
          return "ipfs://" + val;
        }
      };
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
        await this.$http.get("$hosting/project/ipns/" + this.info.id, {
          cid: this.info.hash,
        });
        await this.$store.dispatch("getProjectInfo", this.info.id);
      } catch (error) {
        //
      }
      this.loadingIpns = false;
    },
  },
  components: {
    HDomain,
    HStatus,
    HBranch,
    ECommit,
    ProjDeployments,
    MsgLineVertical,
  },
};
</script>
