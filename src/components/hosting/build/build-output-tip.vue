<template>
  <e-tooltip top max-width="300">
    <v-icon slot="ref" size="16" class="ml-2" :color="$color1">
      mdi-help-circle-outline
    </v-icon>
    <p>The directory in which your compiled frontend will be located.</p>
    <p>
      If you want to serve everything instead of a sub directory, leave this
      field empty.
    </p>
  </e-tooltip>
</template>