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
            <div class="fz-14 model-name fw-b">{{ it.name }}</div>
            <div class="my-2 fz-12 model-desc" v-html="it.markdown"></div>
            <div class="fz-12" style="color: #475569">
              <span class="py-2"
                >{{ calcPrice(it.pricing.prompt) }} /input tkns
              </span>
              <span class="pl-2"
                >{{ calcPrice(it.pricing.completion) }} /output tkns</span
              >
            </div>
          </div>
          <img
            class="cursor-p"
            src="/img/svg/ai-rpc/chevron-right.svg"
            width="24"
            height="24"
            alt=""
            @click="$router.push('/ai-rpc/model/' + encodeURIComponent(it.id))"
          />
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
import MarkdownIt from "markdown-it";
import { mapState } from "vuex";

export default {
  data() {
    return {
      searchKey: "",
      list: [],
    };
  },

  created() {
    this.getList();
    this.searchKey = this.$route.query.searchKey;
    this.$router.replace("/ai-rpc?tab=Models");
  },
  computed: {
    searchList() {
      if (this.searchKey) {
        return this.list
          .filter(
            (it) =>
              new RegExp(this.searchKey, "ig").test(it.name) ||
              new RegExp(this.searchKey, "ig").test(it.id)
          )
          .map((it) => {
            let md = new MarkdownIt();
            const str = this.transferDesc(it.description);
            it.markdown = md.render(str);
            return it;
          });
      }
      return this.list.map((it) => {
        let md = new MarkdownIt();
        const str = this.transferDesc(it.description);
        it.markdown = md.render(str);
        return it;
      });
    },
    ...mapState({
      userInfo: (s) => s.userInfo,
    }),
  },
  methods: {
    async getList() {
      try {
        const { data } = await axios.get(
          "https://ai.api.4everland.org/api/v1/models"
        );
        const arr = data.data
          .map((it) => {
            if (/openrouter\/auto/g.test(it.id)) {
              console.log(it);
              return {
                ...it,
                id: "4ever/auto",
              };
            }
            return it;
          })
          .filter((it) => !/openrouter/g.test(it.id));
        this.list = arr;
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
            "(/ai-rpc/model/" +
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
      return result.replace(/Read about rate limits.*/, "");
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
      background: linear-gradient(79deg, #775da6 0%, #9747ff 100%);
      cursor: pointer;
    }
  }
  .model-list {
    min-height: 77vh;
    background: #fff;
    .model-item {
      border-top: 1px solid #cbd5e1;
      .model-name {
        color: #0f172a;
      }
      .model-desc {
        color: #94a3b8;
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
