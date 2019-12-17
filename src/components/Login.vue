<template>
  <v-container>
    <div class="back">
    <form>
      <v-row justify="center">
        <v-col cols="6">
        <v-text-field
          v-model="email"
          :error-messages="emailErrors"
          label="連絡先E-mail"
          required
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          :error-messages="passwordErrors"
          @click:append="show1 = !show1"
          label="パスワード"
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
        ></v-text-field>
        </v-col>
      </v-row>
      <v-alert :value="dialog1" type="error">
        {{errorMsg}}
      </v-alert>
      <v-alert :value="dialog2" type="success">
        ユーザー登録が完了しました。
        「ログイン」ボタンを押下してご利用ください。
      </v-alert>
      
      <v-row justify="center">
        <v-btn class="mr-4" width="200px" color="success" large @click="createUser">新規ユーザー登録</v-btn>
        <v-btn class="mr-4" width="200px" color="success" large @click="signIn">ログイン</v-btn>
        <v-btn class="mr-4" width="200px" color="success" large @click="notSignIn">ログインせず利用する</v-btn>
      </v-row>
    </form>
    </div>
    <v-spacer></v-spacer>
  </v-container>
</template>

<script>
import vuetify from '../plugins/vuetify';
import { required, email } from 'vuelidate/lib/validators'
import * as firebase from "firebase/app";

const { validationMixin} = require('vuelidate')

export default {
  vuetify,
  mixins: [validationMixin],

  validations: {
    email: { required, email },
    password: {required},
  },

  data: () => ({
    email: '',
    password:'',
    errorCode:'',
    errorMsg: '',
    show1: false,
    dialog1: false,
    dialog2: false,
  }),

  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required')
      return errors
    },
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
      if (user) {
        // location.href = '/index'
        console.log("ユーザー情報取得OK");
      } else {
        console.log("ユーザー情報取得NG");
      }
    });
  },
  methods: {
    signIn() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(
        user => {
          console.log("Login OK:" + user.user.uid);
          location.href = '/index'
        }, 
        err => {
          var errorCode = err.code;
          console.log("Login Error:" + errorCode);
          this.dialog1 = true;
          
          if (errorCode == 'auth/user-not-found') {
            this.errorMsg = "ユーザーが登録されていないか、削除されています。再度登録してください"
          } else if (errorCode == 'auth/wrong-password') {
            this.errorMsg = "パスワードが間違っています"
          } else {
            this.errorMsg = "ユーザー情報が取得できませんでした。再度ユーザー登録を行ってください。"
          }
        }
      );
    },
    async createUser() {
      var result = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function(error) {
        var errorCode = error.code;
        console.log("Login Error:" + errorCode);
        return errorCode
      });

      if (result == 'auth/email-already-in-use') {
        this.dialog1 = true
        this.errorMsg = "既にユーザーが登録されています"
      } else {
        var sendResult = await firebase.auth().currentUser.sendEmailVerification({
          url: 'https://apiru-dev.firebaseapp.com/index',
          handleCodeInApp: false, 
        })
        .then(function() {
          console.log("Send Mail Success!!")
          return 0
        })
        .catch(function(error) {
          return error.message
        });
        if (sendResult != 0) {
          this.dialog1 = true
          this.errorMsg = sendResult
        } else {
          this.dialog2 = true
        }
        await firebase.auth().signOut()
      }
    },
    submit () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .then(function(success){
       console.log("ユーザー登録完了:" + success.additionalUserInfo);
       location.href='/index';
      })
      .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMsg = error.message;
      error.showAlert;
      console.log(errorCode + " : " + errorMsg);
      });
    },
    notSignIn() {
      this.$router.push('/index')
    },
  },
}
</script>