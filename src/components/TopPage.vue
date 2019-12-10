<template>
    <v-container fluid>
      <div class="top">
        <v-img src="../assets/src/top/media-2082641_1280.jpg"
        max-height="1280px"
        aspect-ratio="1"> 
        </v-img>
      </div>
      <div class="login">
          <Login/>
      </div>
    </v-container>
</template>

<script>
import vuetify from '../plugins/vuetify';
import Login from '../components/Login'

export default {
  vuetify,

  components: {
    Login
  },
  data: () => ({
  }),
}
</script>
<style>
.top {
  position: relative;
}
.login{
  position: absolute;
  top: 5%;
  right: 15px;
}

</style>