<template>
  <div class="keys-container mt-4">
    <div class="keys-header pa-4 al-c">
      <h3>My API Keys</h3>
      <div class="ml-auto">
        <v-btn
          outlined
          target="blank"
          href="https://docs.4everland.org/ai/ai-rpc/quick-start"
          >API Examples
          <img
            class="ml-2"
            src="/img/svg/ai-rpc/link.svg"
            width="24"
            height="24"
            alt=""
        /></v-btn>
        <v-btn color="primary" class="ml-4" @click="showCreate = true">
          <img
            class="mr-2"
            src="/img/svg/ai-rpc/key.svg"
            width="24"
            height="24"
            alt=""
          />
          Create New key</v-btn
        >
      </div>
    </div>

    <div class="keys-body pos-r">
      <v-simple-table v-if="list.length">
        <template v-slot:default>
          <thead>
            <tr style="background: #f8fafc">
              <th class="text-left">Name</th>
              <th class="text-left">Status</th>
              <th class="text-left">Limits</th>
              <th class="text-left">Used</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in list" :key="item.id" @click="handleRow(item)">
              <td class="fw-b">{{ item.name }}</td>
              <td>
                <div class="status-tag d-ib">
                  <span
                    class="dot d-ib"
                    :class="{ active: item.isActive }"
                  ></span>
                  <span class="ml-1 fz-12">
                    {{ item.isActive ? "Active" : "Inactive" }}</span
                  >
                </div>
              </td>
              <td>
                {{
                  item.limit
                    ? $utils.formatLand(item.limit, false, false)
                    : "--"
                }}
                LAND
              </td>
              <td>{{ $utils.formatLand(item.used, false, false) }} LAND</td>
              <td>
                <img
                  class="cursor-p"
                  src="/img/svg/ai-rpc/chevron-right.svg"
                  width="24"
                  height="24"
                  alt=""
                />
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <div class="pos-a no-date h-flex al-c" v-else>
        <img src="/img/svg/new-billing/no-date.svg" width="240" alt="" />
        <span class="mt-3 fz-14">No Data</span>
      </div>
    </div>

    <v-dialog v-model="showCreate" persistent max-width="500">
      <div class="pa-6 create-keys">
        <div class="al-c space-btw mb-6">
          <h3 class="fz-16">Create An APl Key</h3>
          <img
            @click="reset"
            class="cursor-p"
            src="/img/svg/ai-rpc/close.svg"
            width="24"
            height="24"
            alt=""
          />
        </div>

        <div class="mb-4">
          <div class="ipt-label mb-2">
            API Key Name <span style="color: red">*</span>
          </div>
          <div class="al-c limit-ipt pa-2">
            <input class="flex-1" placeholder="" v-model="name" />
          </div>
        </div>
        <div>
          <div class="ipt-label mb-2">Monthly Limits (Optionals)</div>
          <div class="al-c limit-ipt">
            <input
              class="flex-1 px-2"
              placeholder=""
              v-model="limit"
              @input="handleLimitInput"
            />
            <div class="land">LAND</div>
          </div>
        </div>

        <div class="mt-6 al-c justify-end">
          <v-btn text @click="reset">Cancel</v-btn>
          <v-btn
            color="primary"
            class="ml-2"
            :disabled="!name"
            @click="handleCreate"
            :loading="createLoading"
            >Create</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
        },
        {
          name: "Eclair",
          calories: 262,
        },
        {
          name: "Cupcake",
          calories: 305,
        },
        {
          name: "Gingerbread",
          calories: 356,
        },
        {
          name: "Jelly bean",
          calories: 375,
        },
        {
          name: "Lollipop",
          calories: 392,
        },
        {
          name: "Honeycomb",
          calories: 408,
        },
        {
          name: "Donut",
          calories: 452,
        },
        {
          name: "KitKat",
          calories: 518,
        },
      ],
      showCreate: false,
      name: "",
      limit: "",
      list: [],
      createLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleRow(item) {
      this.$router.push(`/ai-rpc/key/${item.name}/${item.id}`);
    },
    reset() {
      this.name = "";
      this.limit = "";
      this.showCreate = false;
    },
    async getList() {
      try {
        const { data } = await this.$http.get("$rpc/rpc/ai/manager/keys");
        this.list = data.items;
      } catch (error) {
        console.log(error);
      }
    },
    handleLimitInput() {
      this.limit = this.limit.replace(/[^\d]/g, "").replace(/^0+/, "");
    },

    async handleCreate() {
      try {
        if (this.list.length >= 10) {
          return this.$alert(
            "Please note that currently, only 10 API Key can be created per account.If you need to create more, please contact us. Thank you!"
          );
        }
        this.createLoading = true;
        await this.$http.post("$rpc/rpc/ai/manager/keys", {
          name: this.name,
          limit: this.limit,
        });
        this.reset();
        this.$toast("Create successfully.");
        this.getList();
      } catch (error) {
        console.log(error);
      }
      this.createLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.keys-container {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #fff;

  .keys-header {
    border-bottom: 1px solid #cbd5e1;
  }

  .keys-body {
    min-height: 77vh;
    .status-tag {
      padding: 4px 8px;
      border-radius: 4px;
      color: #334155;

      border: 1px solid #cbd5e1;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #cbd5e1;
    }
    .dot.active {
      background: #00bd9a;
    }

    .no-date {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.create-keys {
  .ipt-label {
    color: #64748b;
    font-size: 14px;
  }
  .limit-ipt {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    overflow: hidden;
    .land {
      padding: 8px 16px;
      border-left: 1px solid #cbd5e1;
      background: #f8fafc;
    }
  }
}
</style>
