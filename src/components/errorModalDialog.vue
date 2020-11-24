<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="390"
    >
      <v-card>
        <v-card-text class="pt-5 text-center"><h3>{{errorMessage}}</h3></v-card-text>
        <v-card-actions class="text-center justify-center py-5">
          <router-link to="/"><v-btn
            color="primary"
            @click="dialog = false"
          >
            Ok
          </v-btn></router-link>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { eventBus } from "@/eventBus";
  export default {
      name:'errorModalDialog',
    data () {
      return {
        dialog: false,
        errorMessage:''
      }
    },
    created(){
       eventBus.$on('errorMessageTrigger', (data) =>{
           this.errorMessage = data;
           this.dialog= true;
       })
    },
  }
</script>

<style>

</style>