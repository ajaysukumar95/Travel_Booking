<template>
  <v-container>
    <v-row justify="center">
    <searchPanel/>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import searchPanel from '@/components/searchPanel.vue'

export default {
  name: 'Home',
  components: {
    searchPanel
  }
}
</script>
