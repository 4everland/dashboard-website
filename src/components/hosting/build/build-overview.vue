<template>
  <div>
    <v-skeleton-loader type="article" v-if="!info" />
    <v-row v-else class="mb-5">
      <v-col cols="12" md="4">
        <e-link :href="info.domain">
          <v-img
            class="bd-1 bdrs-5 w100p"
            :src="$getImgSrc(info.screenshotPath)"
            lazy-src="img/bg/empty/project.png"
            aspect-ratio="1"
            max-height="240"
          ></v-img>
        </e-link>
      </v-col>
      <v-col cols="12" md="6">
        <v-row class="pt-1">
          <v-col>
            <e-kv2 label="Status">
              <h-status :val="state"></h-status>
            </e-kv2>
          </v-col>
          <v-col>
            <e-kv2 label="Environment"> Production </e-kv2>
          </v-col>
          <v-col>
            <e-kv2 label="Duration">
              <e-time :endAt="info.endAt || nowDate">{{
                info.createAt
              }}</e-time>
            </e-kv2>
          </v-col>
          <v-col>
            <e-kv2 label="Created">
              <e-time>{{ info.createAt }}</e-time>
            </e-kv2>
          </v-col>
        </v-row>

        <e-kv2 label="Domain" class="mt-7">
          <e-link :href="info.domain">
            {{ info.domain }}
          </e-link>
        </e-kv2>

        <div class="mt-7 d-flex">
          <e-kv2 label="Branch">
            <div class="d-flex al-c f-wrap">
              <h-branch :info="info" class="fz-15" />
              <e-commit :info="info.commits" class="fz-14 ml-3"></e-commit>
            </div>
          </e-kv2>
          <e-kv2
            class="ml-auto"
            label="IPFS"
            style="min-width: 120px"
            v-if="info.cid"
          >
            <e-link class="fz-14" :href="$utils.getCidLink(info.cid)">
              {{ info.cid ? "Verify on IPFS" : "Pending" }}
            </e-link>
          </e-kv2>
        </div>
      </v-col>
    </v-row>

    <build-overview-logs @info="info = $event" @state="state = $event" />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      info: null,
      state: "Init",
    };
  },
  computed: {
    ...mapState({
      nowDate: (s) => s.nowDate,
    }),
  },
};
</script>