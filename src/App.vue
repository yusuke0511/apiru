<template>
  <v-app>
    <v-app-bar
      app
      color="#424242"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </div>
      <h1>あぴる</h1>

      <v-spacer></v-spacer>
      <div v-if="!$vuetify.breakpoint.xs">
        <div v-cloak v-if="isLogin" key="login">
          <v-btn v-if="!isMyPage" @click="sendMyPage" text>
            <span class="mr-2">MyPage</span>
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
          <v-btn v-else @click="sendIndex" text>
            <span class="mr-2">一覧画面へ戻る</span>
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
          <v-btn text dark @click="logout">ログアウト</v-btn>
          <v-dialog v-if="!isMyPage" v-model="dialog" persistent max-width="850px">
            <template v-slot:activator="{ on }">
              <v-btn text dark v-on="on">投稿する</v-btn>
            </template>

              <v-card flat>
                <v-card-title>アプリ情報登録</v-card-title>
                <Registor v-bind:user="user"/>
                <v-btn color="green darken-1" text @click="dialog = false">close</v-btn>
              </v-card>
          </v-dialog>
          <v-btn text href="https://forms.gle/Hkp1Q5Gqf9mtkyFeA" target="brank">問合せ</v-btn>
        </div>
        <div v-cloak v-else key="logout">
          <v-btn text to="/login" dark>ユーザー登録</v-btn>
          <v-btn text href="https://forms.gle/Hkp1Q5Gqf9mtkyFeA" target="brank">問合せ</v-btn>
        </div>
      </div>
      <div v-else>
        <!-- 小さい画面のメニュー -->
        <v-menu offset-y transition="slide-y-transition">
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">Menu</v-btn>
          </template>
          <div style="background-color:black">
            <div v-cloak v-if="isLogin" key="login">
              <v-btn v-if="!isMyPage" @click="sendMyPage" text dark>
                <span class="mr-2">MyPage</span>
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
              <v-btn v-else @click="sendIndex" dark text>
                <span class="mr-2">一覧画面へ戻る</span>
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
              <v-btn text dark @click="logout">ログアウト</v-btn>
            <v-btn text dark href="https://forms.gle/Hkp1Q5Gqf9mtkyFeA" target="brank">問合せ</v-btn>
              
            </div>
            <div v-cloak v-else key="logout">
              <v-btn text to="/login" dark>ユーザー登録</v-btn>
              <v-btn text dark href="https://forms.gle/Hkp1Q5Gqf9mtkyFeA" target="brank">問合せ</v-btn>
            </div>
          </div>
        </v-menu>
        <v-dialog v-if="!isMyPage && isLogin" v-model="dialog" persistent max-width="850px">
            <template v-slot:activator="{ on }">
              <v-btn text dark v-on="on">投稿する</v-btn>
            </template>

            <v-card flat>
              <v-card-title>アプリ情報登録</v-card-title>
              <Registor v-bind:user="user"/>
              <v-btn color="green darken-1" text @click="dialog = false">close</v-btn>
            </v-card>
          </v-dialog>
      </div>
      
      
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Registor from './components/Registor';
import * as firebase from "firebase/app";

export default {
  name: 'App',

  components: {
    Registor,
  },

  data: () => ({
    user: {}, //ユーザー情報
    dialog: false,
    isLogin: false,
    isMyPage: false,
    drawer: false,
  }),
  created() {
    console.log("path -> " + this.$route.path)
    if (this.$route.path == '/MyPage') {
      this.isMyPage = true
    } else {
      this.isMyPage = false
    }
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
      if (user) {
        this.isLogin = true
      }
    });
  },
  methods: {
    sendMyPage() {
      this.isMyPage = true
      this.$router.push('/MyPage')
    },
    sendIndex() {
      this.isMyPage = false
      this.$router.push('/index')
    },
    logout() {
      firebase.auth().onAuthStateChanged( (user) => {
        if (user) {
          firebase.auth().signOut().then(()=>{
           console.log("ログアウトしました:" + user.displayName);
           location.href = "/"
          })
          .catch( (error)=>{
            console.log(`ログアウト時にエラーが発生しました (${error})`);
          });
        }
      });
    },
  },
};
</script>
