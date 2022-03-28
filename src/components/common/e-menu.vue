<template>
  <v-menu v-bind="$attrs" v-on="$listeners">
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on" class="lh-1">
        <slot name="ref"></slot>
      </span>
    </template>
    <span>
      <slot></slot>
    </span>
  </v-menu>
</template>
