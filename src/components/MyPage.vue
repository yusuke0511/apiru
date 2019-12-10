<template>
  <v-app id="inspire">
    <v-container fluid>
      <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      item-key="name"
      class="elevation-1"
      >
      <template v-slot:item.src="{ item }">
        <v-img
            :src="item.src"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="55px"
            width="80px"
          >
        </v-img>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon class="mr-2" @click="editItem(item)"> edit
        </v-icon>
        
        <v-icon
          @click="deleteItem(item)"
        >
          delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <span>現在登録しているデータはありません</span>
      </template>
      </v-data-table>
      <v-dialog v-model="dialog" persistent max-width="850px">
            <v-card flat:ture>
              <v-card-title>アプリ情報登録</v-card-title>
              <Registor v-bind:user="user" v-bind:item="item" ref="registor"/>
              <v-btn color="green darken-1" text @click="closeModal">close</v-btn>
            </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import Registor from './Registor';
import vuetify from '../plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import * as firebase from "firebase/app";
import hub from '../EventBus';

export default {
  vuetify,
  components: {
    Registor,
  },
  data () {
    return {
      user: [],
      selected: [],
      headers: [
        { text: '画像', align: 'center', value: 'src', sortable: false },
        { text: 'サービス名', align: 'center', sortable: false, value: 'name'},
        { text: 'URL', value: 'url' },
        { text: '作者', value: 'author' },
        { text: '登録日', value: 'createday' },
        { text: '更新日', value: 'updateday' },
        { text: '操作', align: 'center', value: 'action', sortable: false },
      ],
      dialog: false,
      item: null,
      items:[],
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
      if (user) {
        console.log("ユーザー情報取得OK:" + user.email)
        var db = firebase.firestore();
        console.log(this.user.uid)
        db.collection("serviceInfo").where("uid", "==", this.user.uid).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var docItem = doc.data()
                docItem.id = doc.id
                if (docItem.createday != null) docItem.createday = this.convertDate(docItem.createday.toDate())
                if (docItem.updateday != null) docItem.updateday = this.convertDate(docItem.updateday.toDate()) 
                this.items.push(docItem)
            });
        });
      } else {
        console.log("ユーザー情報取得NG");
      }
    });
    
  },
  methods: {
    getDisplay(val) {
      switch(val) {
        case 'Feature': return "特徴"
        case 'Author': return "作者"
        case 'Createday': return "投稿日"
        case 'Updateday': return "更新日"
        default: return val
      }
    },
    convertDate(d) {
      var year  = d.getFullYear();
      var month = d.getMonth() + 1;
      var day  = d.getDate();
      var hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
      var min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
      var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
      return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    },
    editItem(item) {
      this.dialog = true
      this.item = item
      hub.$emit('open-modal', this.item);
    },
    async deleteItem(item) {
      if (item.imageFileName != undefined) {
        var storageRef = firebase.storage().ref();
        var mountainImagesRef = storageRef.child('images/' + item.imageFileName);
        mountainImagesRef.delete()
      }
      var db = firebase.firestore();
      console.log(item.id)
      await db.collection("serviceInfo").doc(item.id).delete()
      this.$router.go({path: this.$router.currentRoute.path, force: true})
    },
    closeModal() {
      this.dialog = false
      hub.$emit('close-modal', null);
      // this.$refs.registor.closeScreen()
    },
  },
}
</script>
