<template>
  <v-tooltip v-bind="$attrs">
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on" class="lh-1">
        <slot name="ref"></slot>
      </span>
    </template>
    <span>
      <slot></slot>
    </span>
  </v-tooltip>
</template>
