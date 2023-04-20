<template>
  <div>
    <div>
      <e-toggle-card
        class="mt-5"
        title="Building"
        :value="getOpen(0)"
        :icon="getIcon(0)"
      >
        <template #time v-if="info && info.endAt">
          <div class="fz-14 gray">
            <e-time :endAt="info.endAt">{{ info.createAt }}</e-time>
          </div>
        </template>
        <build-log v-if="info" :list="logs" :errMsg="errMsg" />
        <div class="fz-14 gray" v-else>Pending</div>
      </e-toggle-card>
      <e-toggle-card
        v-if="showHash"
        class="mt-5"
        :title="'Syncing to ' + info.platform"
        :value="getOpen(1)"
        :icon="getIcon(1)"
      >
        <e-kv
          min-width="70px"
          :label="`${info.platform} Hash:`"
          v-if="info && info.hash"
        >
          <a
            class="u"
            :href="$utils.getCidLink(info.hash, info.platform, projInfo.online)"
            target="_blank"
            >{{ info.hash }}</a
          >
        </e-kv>
        <div class="fz-14 gray" v-else>
          <div v-if="isSyncErr" class="red-1">Not synchronized</div>
          <div v-else-if="info && info.platform == 'IC'">
            Syncing to IC may take more time to complete,
            <e-link href="/hosting/projects">click here</e-link> for other
            operations without waiting.
          </div>
          <div v-else-if="info && info.platform == 'AR'">
            Syncing to AR may take more time to complete,
            <e-link href="/hosting/projects">click here</e-link> for other
            operations without waiting.
          </div>
          <span v-else>
            <h-status :val="state"></h-status>
          </span>
        </div>
      </e-toggle-card>
      <e-toggle-card
        v-if="showHash"
        class="mt-5"
        title="Assigning Domains"
        :value="getOpen(2)"
        :icon="getIcon(2)"
      >
        <div v-if="domains.length && isDone">
          <p v-for="(it, i) in domains" :key="i">
            <h-domain
              :val="it"
              class="fz-14"
              :disabled="!projInfo.online"
            ></h-domain>
          </p>
        </div>
        <div v-else class="fz-14 gray">
          <span>Pending</span>
        </div>
      </e-toggle-card>
    </div>

    <div>
      <template v-for="(item, index) in steps">
        <e-toggle-card
          class="mt-5"
          :title="item"
          :value="currentIdx == index"
          :key="index"
        >
          <template #time v-if="info && info.endAt">
            <div class="fz-14 gray">
              <e-time :endAt="info.endAt">{{ info.createAt }}</e-time>
            </div>
          </template>
          <build-log v-if="info" :list="logs" :errMsg="errMsg" />
          <div class="fz-14 gray" v-else>Pending</div>
        </e-toggle-card>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buildType: {
      type: String,
      default: "git",
    },
    platform: {
      type: String,
      default: "ipfs",
    },
  },
  data() {
    return {
      currentIdx: 0,
    };
  },
  computed: {
    steps() {
      if (this.buildType == "git") {
        // return ["Building", `Sync to ${this.platform}`, "Assigning Domains"];
        return [
          {
            title: "Building",
            slot: "",
          },
          {
            title: `Sync to ${this.platform}`,
            slot: "",
          },
          {
            title: "Assigning Domains",
            slot: "",
          },
        ];
      }

      // buildType == ipfs
      if (this.buildType == "ipfs") {
        if (this.platform == "ipfs") {
          return ["Pinning", "Assigning Domains"];
        }
        return ["Pinning", `Sync to ${this.platform}`, "Assigning Domains"];
      }

      // buildType == ipns
      if (this.buildType == "ipns") {
        if (this.platform == "ipfs") {
          return ["Resolving IPNS", "Pinning", "Assigning Domains"];
        }
        return [
          "Resolving IPNS",
          "Pinning",
          `Sync to ${this.platform}`,
          "Assigning Domains",
        ];
      }
      return [];
    },
  },
  methods: {
    next() {
      this.currentIdx++;
    },
    done() {
      this.currentIdx = this.steps.length - 1;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>