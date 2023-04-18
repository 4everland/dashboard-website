<style lang="scss">
.e-steps {
  .item {
    background: #e7edef;
    box-shadow: 0 0 2px rgb(136 136 136 / 30%);
    .num {
      padding: 8px 8px;
      border-radius: 4px 0 0 4px;
      $bg: #636f7e;
      background: $bg;
      color: #fff;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        border: 16px solid transparent;
        border-left-color: $bg;
        left: 100%;
        top: 0;
      }
    }
    $color1: #775da6;
    &.active {
      background: $color1;
      color: #fff;
      .num {
        background: #fff;
        color: $color1;
        &::after {
          border-left-color: #fff;
        }
      }
    }
    &.prev {
      background: #fff url(/img/svg/common/ic-check.svg) 98% center no-repeat;
      background-size: 18px;
      color: $color1;
      .num {
        background: $color1;
        color: #fff;
        &::after {
          border-left-color: $color1;
        }
      }
    }
  }
}
</style>

<template>
  <v-row class="e-steps">
    <v-col v-for="(it, i) in list" :key="i">
      <div
        class="item pa-1 lh-1 bdrs-4"
        :class="{ active: i == value, prev: i < value }"
      >
        <span class="num d-ib mr-8">Step {{ 1 + i }}</span>
        <span class="d-ib">{{ it.label }}</span>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    options: Array,
    value: Number,
  },
  computed: {
    list() {
      return this.options.map((it) => {
        if (typeof it == "string")
          return {
            label: it,
          };
        return it;
      });
    },
  },
  data() {
    return {};
  },
};
</script>