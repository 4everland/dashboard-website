<template>
  <v-menu offset-y v-bind="$attrs" v-on="$listeners">
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on" class="d-ib">
        <slot name="ref"></slot>
      </span>
    </template>
    <div>
      <slot></slot>
    </div>
  </v-menu>
</template>

