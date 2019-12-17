import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import * as functions from 'firebase-functions';

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// 本番環境（Firebase 環境変数を使用） = true
const isProd = false;
if (isProd) {
  const apiKey = encodeURIComponent(functions.config().config.app_id)
  const authDomain = encodeURIComponent(functions.config().config.authdomain)
  const databaseURL = encodeURIComponent(functions.config().config.database_url)
  const projectId = encodeURIComponent(functions.config().config.project_id)
  const storageBucket = encodeURIComponent(functions.config().config.storage_bucket)
  const messagingSenderId = encodeURIComponent(functions.config().config.messaging_sender_id)
  const appId = encodeURIComponent(functions.config().config.app_id)
  const measurementId = encodeURIComponent(functions.config().config.measurement_id)

  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId,
    timestampsInSnapshots: true,
  };
  firebase.initializeApp(firebaseConfig);
} else {
  const firebaseConfig = {
    apiKey: "api-key",
    authDomain: "project-id.firebaseapp.com",
    databaseURL: "https://project-id.firebaseio.com",
    projectId: "project-id",
    storageBucket: "project-id.appspot.com",
    messagingSenderId: "sender-id",
    appID: "app-id",
    timestampsInSnapshots: true,
  }; 
  firebase.initializeApp(firebaseConfig);
}

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  firebase,
  render: h => h(App),
}).$mount('#app')

