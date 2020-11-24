<template>
  <v-container>
    <v-card  class="mx-auto px-7 py-5 elevation-8">
      <v-row justify="left">
       <router-link to="/"> <v-btn small color="primary" class="mx-2">Back</v-btn></router-link>
      </v-row>
      <v-row>
        <flightList />
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import flightList from "@/components/flightList.vue";
export default {
  name:'flightDetails',
  components: {
    flightList
  }
};
</script>
