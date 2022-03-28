<style lang="scss">
.statis-table {
  table {
    border-spacing: 0;
    thead {
      background: #e6e8eb;
      color: #888;
    }
    td {
      padding: 10px 5px;
    }
    tbody td {
      border-bottom: 1px solid #eee;
      color: #495667;
    }
    span.num {
      padding: 4px 8px;
      border-radius: 8px;
      &.v-1 {
        background: #c3e9fe;
      }
      &.v-5 {
        background: #84c2fc;
        // color: #fff;
      }
      &.v-10 {
        background: #419ff4;
        color: #fff;
      }
    }
  }
}
</style>

<template>
  <div class="statis-table mt-3">
    <div class="ov-a ov-h">
      <table class="w100p ta-c fz-14" style="min-width: 600px">
        <thead>
          <tr>
            <td>Time</td>
            <td>New Users</td>
            <td v-for="i in 7" :key="i">{{ i }}day</td>
          </tr>
        </thead>
        <tbody class="op-9">
          <tr v-for="(it, i) in list" :key="i">
            <td>{{ it.date }}</td>
            <td>{{ numberComma(it.newUsers) }}</td>
            <td v-for="j in 7" :key="j">
              <span class="d-ib num" :class="getCls(it['d' + j])">
                {{ it["d" + j] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
  },
  methods: {
    getCls(val) {
      const num = (val || "").replace("%", "");
      if (num > 10) return "v-10";
      if (num > 5) return "v-5";
      if (num > 0) return "v-1";
    },
    numberComma(source, length = 3) {
      source = String(source).split(".");
      source[0] = source[0].replace(
        new RegExp("(\\d)(?=(\\d{" + length + "})+$)", "ig"),
        "$1,"
      );
      return source.join(".");
    },
  },
};
</script>