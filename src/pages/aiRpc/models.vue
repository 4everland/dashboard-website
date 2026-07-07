<template>
  <div class="models-container mt-4">
    <div class="models-header al-c space-btw">
      <div style="width: 300px">
        <v-text-field
          style="background: #fff"
          class="hide-msg"
          prepend-inner-icon="mdi-magnify"
          dense
          outlined
          placeholder="Search"
          v-model="searchKey"
          @keydown.enter="getList"
        />
      </div>
      <div class="chat-btn al-c fz-14" @click="handleOpenChat">
        <img src="/img/svg/ai-rpc/chat.svg" width="24" height="24" alt="" />
        <span class="ml-1">Chat</span>
      </div>
    </div>

    <div class="model-list pos-r">
      <template v-if="searchList.length">
        <div
          class="model-item pa-4 al-c space-btw"
          v-for="(it, i) in searchList"
          :key="i"
        >
          <div>
            <div class="al-c model-title-row">
              <img
                :src="getProviderIcon(it)"
                class="provider-icon"
                @error="onProviderIconError"
                alt=""
              />
              <div class="fz-14 model-name fw-b">{{ it.displayName }}</div>
              <div
                class="ml-2 al-c modality-flow"
                :title="getModalityTitle(it)"
              >
                <div class="al-c">
                  <v-icon
                    v-for="(modality, idx) in it.inputModalities || []"
                    :key="`in-${modality}-${idx}`"
                    size="16"
                    :class="['modality-icon', getModalityClass(modality)]"
                  >
                    {{ getModalityIcon(modality) }}
                  </v-icon>
                </div>
                <v-icon size="16" class="mx-1">mdi-arrow-right</v-icon>
                <div class="al-c">
                  <v-icon
                    v-for="(modality, idx) in it.outputModalities || []"
                    :key="`out-${modality}-${idx}`"
                    size="16"
                    :class="['modality-icon', getModalityClass(modality)]"
                  >
                    {{ getModalityIcon(modality) }}
                  </v-icon>
                </div>
              </div>
            </div>
            <div class="fz-13 mt-1 al-c">
              <span>{{ it.name }}</span>
              <div class="ml-1 pa-1 hover-1" @click="$copy2(it.name)">
                <img src="img/svg/ai-rpc/copy.svg" width="14" class="d-b" />
              </div>
            </div>
            <div class="my-2 fz-12 model-desc">
              <div class="model-desc-wrap">
                <div
                  :ref="`desc-${getItemKey(it)}`"
                  :class="[
                    'model-desc-text',
                    { 'model-desc-expanded': isDescriptionExpanded(it) },
                  ]"
                >
                  {{ it.description }}
                </div>
                <div
                  v-if="it.description && shouldShowDescriptionToggle(it)"
                  class="model-desc-toggle"
                  @click="toggleDescription(it)"
                >
                  <v-icon size="16">
                    {{
                      isDescriptionExpanded(it)
                        ? "mdi-chevron-up"
                        : "mdi-chevron-down"
                    }}
                  </v-icon>
                </div>
              </div>
            </div>
            <div
              class="fz-12 py-2"
              style="color: #475569"
              v-show="it.id !== '4ever/auto'"
            >
              <span>{{ calcPrice(it.pricing.prompt) }} /Input Tokens </span>
              <span class="pl-2"
                >{{ calcPrice(it.pricing.completion) }} /Output Tokens</span
              >
              <span v-if="showCachePrice(it.pricing.cacheRead)" class="pl-2">
                {{ calcPrice(it.pricing.cacheRead) }} /Cache Read Tokens
              </span>
              <span v-if="showCachePrice(it.pricing.cacheWrite)" class="pl-2">
                {{ calcPrice(it.pricing.cacheWrite) }} /Cache Write Tokens
              </span>
            </div>
          </div>
          <!-- <img
            class="cursor-p"
            src="/img/svg/ai-rpc/chevron-right.svg"
            width="24"
            height="24"
            alt=""
            @click="$router.push('/ai-rpc/model/' + encodeURIComponent(it.name))"
          /> -->
        </div>
      </template>

      <div class="pos-a no-date h-flex al-c" v-else>
        <img src="/img/svg/new-billing/no-date.svg" width="240" alt="" />
        <span class="mt-3 fz-14">No Data</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      searchKey: "",
      list: [],
      expandedDescMap: {},
      overflowDescMap: {},
    };
  },

  created() {
    this.getList();
    this.searchKey = this.$route.query.searchKey;
    this.$router.replace("/ai-rpc?tab=Models");
  },
  computed: {
    searchList() {
      const list = this.searchKey
        ? this.list.filter(
            (it) =>
              new RegExp(this.searchKey, "ig").test(it.displayName) ||
              new RegExp(this.searchKey, "ig").test(it.name),
          )
        : this.list;
      return list;
    },
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
  },
  watch: {
    searchList() {
      this.$nextTick(() => {
        this.measureAllDescriptionOverflow();
      });
    },
  },
  methods: {
    async getList() {
      try {
        const { data } = await axios.get(
          "https://ai.api.4everland.org/api/v1/models",
          { params: { size: 200 } },
        );
        this.list = (data.data.items || []).map((it) => ({
          ...it,
          pricing: {
            prompt: it.priceInput,
            completion: it.priceOutput,
            cacheRead: it.priceCacheRead,
            cacheWrite: it.priceCacheCreate,
          },
        }));
        this.$nextTick(() => {
          this.measureAllDescriptionOverflow();
        });
      } catch (error) {
        console.log(error);
      }
    },

    calcPrice(val) {
      if (val == 0 || val == -1) {
        return "Free";
      }
      const amount = val * 1e6;
      const units = [
        { value: 1e9, suffix: "B" },
        { value: 1e6, suffix: "M" },
        { value: 1e3, suffix: "K" },
      ];
      for (const { value, suffix } of units) {
        if (Math.abs(amount) >= value) {
          const formatted = (amount / value).toFixed(2).replace(/\.?0+$/, "");
          return `${formatted}${suffix} LAND`;
        }
      }
      return `${Number(amount.toFixed(4))} LAND`;
    },
    showCachePrice(val) {
      return val !== 0 && val !== "0" && val !== null && val !== undefined;
    },
    getProviderIcon(it) {
      const provider = (it.provider || it.providerEndpoints?.name || "").trim();
      const providerMap = {
        anthropic: "Anthropic.svg",
        bedrock: "Bedrock.svg",
        cohere: "Cohere.png",
        cloudflare: "cloudflare.png",
        deepseek: "deepSeek.png",
        google: "GoogleGemini.svg",
        gemini: "GoogleGemini.svg",
        meta: "Meta.png",
        microsoft: "Microsoft.svg",
        minimax: "minimax.png",
        mistral: "Mistral.png",
        moonshot: "Moonshot.png",
        openai: "OpenAI.svg",
        perplexity: "Perplexity.svg",
        qwen: "Qwen.png",
        xai: "x-ai.png",
        "x-ai": "x-ai.png",
        zai: "z-ai.png",
        "z-ai": "z-ai.png",
        xiaomi: "xiaomi.png",
        kimi: "kimi.png",
      };
      const normalized = provider.toLowerCase().replace(/\s+/g, "");
      const fileName = providerMap[normalized] || "other.png";
      return `/img/models_icons/${fileName}`;
    },
    onProviderIconError(event) {
      event.target.src = "/img/models_icons/other.png";
    },
    getModalityIcon(modality) {
      const iconMap = {
        text: "mdi-format-text",
        image: "mdi-image-outline",
        audio: "mdi-music-note-outline",
        video: "mdi-video-outline",
        embedding: "mdi-vector-point",
        file: "mdi-file-outline",
      };
      return iconMap[(modality || "").toLowerCase()] || "mdi-shape-outline";
    },
    getModalityClass(modality) {
      const key = (modality || "").toLowerCase();
      const classMap = {
        text: "modality-text",
        image: "modality-image",
        audio: "modality-audio",
        video: "modality-video",
        embedding: "modality-embedding",
        file: "modality-file",
      };
      return classMap[key] || "modality-default";
    },
    getModalityTitle(it) {
      const input = (it.inputModalities || []).join(", ") || "-";
      const output = (it.outputModalities || []).join(", ") || "-";
      return `${input} -> ${output}`;
    },
    getItemKey(it) {
      return it.name || it.id;
    },
    isDescriptionExpanded(it) {
      return !!this.expandedDescMap[this.getItemKey(it)];
    },
    shouldShowDescriptionToggle(it) {
      const key = this.getItemKey(it);
      return this.isDescriptionExpanded(it) || !!this.overflowDescMap[key];
    },
    toggleDescription(it) {
      const key = this.getItemKey(it);
      this.$set(this.expandedDescMap, key, !this.expandedDescMap[key]);
    },
    measureAllDescriptionOverflow() {
      const nextMap = {};
      this.searchList.forEach((it) => {
        const key = this.getItemKey(it);
        if (this.isDescriptionExpanded(it)) {
          nextMap[key] = true;
          return;
        }
        const ref = this.$refs[`desc-${key}`];
        const el = Array.isArray(ref) ? ref[0] : ref;
        if (!el) return;
        nextMap[key] = el.scrollHeight - el.clientHeight > 1;
      });
      this.overflowDescMap = nextMap;
    },
    handleOpenChat() {
      this.$goChat("/login?t=" + encodeURIComponent(localStorage.token));
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep p {
  margin-bottom: 0 !important;
}
.models-container {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  overflow: hidden;

  .models-header {
    padding: 16px;
    background: #f8fafc;
    .chat-btn {
      padding: 8px 16px;
      color: #fff;
      border-radius: 4px;
      background: linear-gradient(
          307deg,
          rgba(110, 88, 242, 0.8) 37.75%,
          rgba(105, 65, 198, 0.8) 93.02%
        ),
        var(--color-font-brand, #6172f3);
      cursor: pointer;
    }
  }
  .model-list {
    min-height: 77vh;
    background: #fff;
    .model-item {
      border-top: 1px solid #cbd5e1;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
      .model-title-row {
        gap: 8px;
      }
      .provider-icon {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        object-fit: cover;
        flex: 0 0 auto;
      }
      .model-name {
        color: #0f172a;
      }
      .modality-flow {
        color: #64748b;
      }
      .modality-icon + .modality-icon {
        margin-left: 2px;
      }
      .modality-text {
        color: #3b82f6;
      }
      .modality-image {
        color: #a855f7;
      }
      .modality-audio {
        color: #f59e0b;
      }
      .modality-video {
        color: #ef4444;
      }
      .modality-embedding {
        color: #10b981;
      }
      .modality-file {
        color: #06b6d4;
      }
      .modality-default {
        color: #64748b;
      }
      .model-desc {
        color: #94a3b8;
        .model-desc-wrap {
          position: relative;
          padding-right: 18px;
        }
        .model-desc-text {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
          word-break: break-word;
        }
        .model-desc-expanded {
          -webkit-line-clamp: initial;
          line-clamp: initial;
          display: block;
        }
        .model-desc-toggle {
          color: #6172f3;
          cursor: pointer;
          user-select: none;
          position: absolute;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
        }
      }
      &:hover {
        box-shadow: inset 0 0 0 1px #6172f3;
        border-top-color: transparent;
        .model-desc {
          color: #0f172a;
        }
      }
    }
  }
  .no-date {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
