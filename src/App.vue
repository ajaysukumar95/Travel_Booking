<template>
  <v-app>
     <v-img
          src="../src/assets/bg.jpg"
          aspect-ratio="1.7"
        >
    <v-container fluid fill-height class="mx-auto">
      <router-view></router-view>
    </v-container>

    </v-img>
  </v-app>
</template>
<script>

export default {

  
}
</script>