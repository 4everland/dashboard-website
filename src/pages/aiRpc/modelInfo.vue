<template>
  <div class="model-info">
    <div class="model-intro pa-4">
      <div v-if="modelInfo">
        <div class="al-c space-btw">
          <div>
            <h3 class="fz-16">{{ modelInfo.name }}</h3>
            <div class="al-c mt-3">
              <div class="fz-16">{{ modelInfo.id }}</div>
              <img
                src="/img/svg/ai-rpc/copy.svg"
                class="ml-2 cursor-p"
                width="16"
                height="16"
                alt=""
                v-clipboard="modelInfo.id"
                @success="$toast('Copied!')"
              />
            </div>
          </div>
          <div class="al-c">
            <div
              class="al-c flex-col fz-12"
              v-show="modelInfo.id !== '4ever/auto'"
            >
              <span
                >{{ calcPrice(modelInfo.pricing.prompt) }} / input tkns</span
              >
              <span
                >{{ calcPrice(modelInfo.pricing.completion) }} / output
                tkns</span
              >
            </div>
            <div class="chat-btn al-c fz-14 ml-2" @click="handleOpenChat">
              <img
                src="/img/svg/ai-rpc/chat.svg"
                width="24"
                height="24"
                alt=""
              />
              <span class="ml-1">Chat</span>
            </div>
            <!-- <v-btn class="ml-2" outlined
            >Model weights

            <img
              src="/img/svg/ai-rpc/link.svg"
              class="ml-2"
              width="24"
              height="24"
              alt=""
            />
          </v-btn> -->
          </div>
        </div>

        <div class="model-desc pa-4 mt-4" v-html="html"></div>
      </div>
      <v-skeleton-loader type="article" v-else />
    </div>

    <div class="model-parameters mt-4">
      <div class="pa-4 fw-b fz-16">Parameters</div>

      <v-expansion-panels flat>
        <v-expansion-panel v-for="(item, i) in parameters" :key="i">
          <div style="width: 100%; height: 1px; background: #cbd5e1"></div>

          <v-expansion-panel-header>
            <div class="al-c">
              <div class="fz-14">{{ item.name }}</div>
              <div class="fz-12 ml-4">
                <span
                  class="px-2 tags"
                  v-for="it in item.paramsInfoTags"
                  :key="it"
                  >{{ it }}</span
                >
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="fz-14 desc">
            {{ item.desc }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MarkdownIt from "markdown-it";

export default {
  data() {
    return {
      modelId: "",
      modelInfo: null,
      html: "",
      parameters: [
        {
          name: "temperature",
          paramsInfoTags: ["Optional", "float 0.0 to 2.0", "Defalut 1.0"],
          desc: `This setting influences the variety in the model's responses. Lower values lead to more predictable and typical responses, while higher values encourage more diverse and less common responses. At 0, the model always gives the same response for a given input.`,
        },
        {
          name: "top_p",
          paramsInfoTags: ["Optional", "float 0.0 to 1.0", "Defalut 1.0"],
          desc: `This setting limits the model's choices to a percentage of likely tokens: only the top tokens whose probabilities add up to P. A lower value makes the model's responses more predictable, while the default setting allows for a full range of token choices. Think of it like a dynamic Top-K.`,
        },
        {
          name: "top_k",
          paramsInfoTags: ["Optional", "integer 0 or above"],
          desc: `This limits the model's choice of tokens at each step, making it choose from a smaller set. A value of 1 means the model will always pick the most likely next token, leading to predictable results. By default this setting is disabled, making the model to consider all choices.`,
        },
        {
          name: "frequency_penalty",
          paramsInfoTags: ["Optional", "float -2.0 to 2.0", "Defalut 0.0"],
          desc: `This setting aims to control the repetition of tokens based on how often they appear in the input. It tries to use less frequently those tokens that appear more in the input, proportional to how frequently they occur. Token penalty scales with the number of occurrences. Negative values will encourage token reuse.`,
        },
        {
          name: "presence_penalty",
          paramsInfoTags: ["Optional", "float -2.0 to 2.0", "Defalut 0.0"],
          desc: `Adjusts how often the model repeats specific tokens already used in the input. Higher values make such repetition less likely, while negative values do the opposite. Token penalty does not scale with the number of occurrences. Negative values will encourage token reuse.`,
        },
        {
          name: "repetition_penalty",
          paramsInfoTags: ["Optional", "float 0.0 to 2.0", "Defalut 1.0"],
          desc: `Helps to reduce the repetition of tokens from the input. A higher value makes the model less likely to repeat tokens, but too high a value can make the output less coherent (often with run-on sentences that lack small words). Token penalty scales based on original token's probability.`,
        },
        {
          name: "min_p",
          paramsInfoTags: ["Optional", "float 0.0 to 1.0", "Defalut 0.0"],
          desc: `Represents the minimum probability for a token to be considered, relative to the probability of the most likely token. (The value changes depending on the confidence level of the most probable token.) If your Min-P is set to 0.1, that means it will only allow for tokens that are at least 1/10th as probable as the best possible option.`,
        },
        {
          name: "top_a",
          paramsInfoTags: ["Optional", "float 0.0 to 1.0", "Defalut 0.0"],
          desc: `Consider only the top tokens with "sufficiently high" probabilities based on the probability of the most likely token. Think of it like a dynamic Top-P. A lower Top-A value focuses the choices based on the highest probability token but with a narrower scope. A higher Top-A value does not necessarily affect the creativity of the output, but rather refines the filtering process based on the maximum probability.`,
        },
        {
          name: "seed",
          paramsInfoTags: ["Optional", "integer"],
          desc: `If specified, the inferencing will sample deterministically, such that repeated requests with the same seed and parameters should return the same result. Determinism is not guaranteed for some models.`,
        },
        {
          name: "max_tokens",
          paramsInfoTags: ["Optional", "integer 1 or above"],
          desc: `This sets the upper limit for the number of tokens the model can generate in response. It won't produce more than this limit. The maximum value is the context length minus the prompt length.`,
        },
        {
          name: "logit_bias",
          paramsInfoTags: ["Optional", "map"],
          desc: `Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.`,
        },
        {
          name: "logprobs",
          paramsInfoTags: ["Optional", "boolean"],
          desc: `Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned.`,
        },
        {
          name: "top_logprobs",
          paramsInfoTags: ["Optional", "integer"],
          desc: `An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. logprobs must be set to true if this parameter is used.`,
        },
        {
          name: "response_format",
          paramsInfoTags: ["Optional", "map"],
          desc: `Forces the model to produce specific output format. Setting to { "type": "json_object" } enables JSON mode, which guarantees the message the model generates is valid JSON. Note: when using JSON mode, you should also instruct the model to produce JSON yourself via a system or user message.`,
        },
        {
          name: "stop",
          paramsInfoTags: ["Optional", "array"],
          desc: `Stop generation immediately if the model encounter any token specified in the stop array.

`,
        },
      ],
    };
  },
  created() {
    this.getItems();
  },
  watch: {
    ["modelInfo.description"](val) {
      const md = new MarkdownIt();
      const str = this.transferDesc(val);
      this.html = md.render(str);
    },
  },

  methods: {
    async getItems() {
      try {
        const { data } = await axios.get(
          "https://ai.api.4everland.org/api/v1/models"
        );

        const arr = data.data.map((it) => {
          if (/openrouter\/auto/g.test(it.id)) {
            console.log(it);
            return {
              ...it,
              id: "4ever/auto",
            };
          }
          return it;
        });
        this.modelInfo = arr.find((it) => it.id == this.$route.params.id);
      } catch (error) {
        console.log(error);
      }
    },
    calcPrice(val) {
      if (val == 0 || val == -1) {
        return "Free";
      }
      return (val * 1e6).toFixed(4) + " LAND";
    },
    transferDesc(str) {
      var result = str.replace(/\[(.*?)\]\((.*?)\)/g, function (match, p1, p2) {
        if (p2.includes("/models/")) {
          return (
            "[" +
            p1 +
            "]" +
            "(" +
            encodeURIComponent(p2.replace("/models/", "")) +
            ")"
          );
        } else if (p2 == "/activity") {
          return "[" + p1 + "]" + "(" + "/ai-rpc?tab=Keys" + ")";
        } else if (p2.includes("/models?q")) {
          return (
            "[" +
            p1 +
            "]" +
            "(" +
            "/ai-rpc?tab=Models&searchKey=" +
            p2.replace("/models?q=", "") +
            ")"
          );
        } else {
          return match;
        }
      });
      console.log(result);

      return result;
    },
    handleOpenChat() {
      this.$goChat(
        `/login?model=${this.$route.params.id}&t=${encodeURIComponent(
          localStorage.token
        )}`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.model-info {
  .model-intro {
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    background: #fff;
    .model-desc {
      border-radius: 8px;
      background: #f8fafc;
      color: #94a3b8;
      font-size: 12px;
    }
  }

  .model-parameters {
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    background: #fff;
    overflow: hidden;

    .desc {
      color: #94a3b8;
      font-size: 12px;
    }
    .tags {
      color: #475569;
    }
    .tags + .tags {
      border-left: 1px solid #000;
    }
  }
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
</style>
