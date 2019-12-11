<template>
  <v-app id="inspire">
    <v-container fluid>
      <form>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="name"
              :error-messages="nameErrors"
              :counter="30"
              label="サービス名"
              required
              ref="name"
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="url"
              :error-messages="urlErrors"
              label="URL"
              required
              @input="$v.url.$touch()"
              @blur="$v.url.$touch()"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="author"
              :error-messages="authorErrors"
              label="作成者"
              placeholder="企業名または個人名"
              required
              @input="$v.author.$touch()"
              @blur="$v.author.$touch()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-textarea
          :counter="300"
          v-model="feature"
          outlined
          name="feature"
          label="サービス内容"
          placeholder="サービスの特徴を詳しく記入してください"
        ></v-textarea>
        
        <v-file-input
        :rules="rules"
        v-model="file1"
        accept="image/png, image/jpeg, image/bmp"
        placeholder="画像を選択してください"
        prepend-icon="mdi-camera"
        label="Avatar"
        @change="onFileChange"
        ></v-file-input>

        <v-img 
          v-show="uploadedImage"
          height="300px"
          width="350px" 
          :src="uploadedImage" />

        <v-checkbox
          v-model="checkbox"
          :error-messages="checkboxErrors"
          label="利用規約に同意する"
          required
          @change="$v.checkbox.$touch()"
          @blur="$v.checkbox.$touch()"
        ></v-checkbox>
        <v-btn color="primary" text href="../assets/html/kiyaku.html" target="blank"/>
    
        <v-btn v-if="isNewData"
          color="deep-purple accent-4"
          class="white--text" 
          @click="submit">登録</v-btn>
        <v-btn v-else
          color="deep-purple accent-4"
          class="white--text" 
          @click="update">更新</v-btn>
        <v-btn @click="clear">入力内容を初期化</v-btn>
        <v-overlay :value="overlay">
          <v-progress-circular indeterminate size="54"></v-progress-circular>
          <span>登録中</span>
        </v-overlay>
      </form>
    </v-container>
  </v-app>
</template>

<script>
import vuetify from '../plugins/vuetify';
import { required, maxLength} from 'vuelidate/lib/validators'
import loadImage from 'blueimp-load-image';
import * as firebase from "firebase/app";
import hub from '../EventBus';

const { validationMixin} = require('vuelidate')

export default {
  vuetify,
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(30) },
    url: {required},
    author:  {required},
    checkbox: {
      checked (val) {
        return val
      },
    },
  },

  data: () => ({
    name: '',
    url: '',
    feature: null,
    author: '',
    file1: null,
    uploadedImage: '',
    checkbox: false,
    overlay: false,
    isCheck: false,
    isNewData: true,
    //Max Upload Size
    rules: [
      value => !value || value.size < 10000000 || 'Avatar size should be less than 10 MB!',
    ],
  }),
  mounted() {
    this.openDialog(this.item)
    this.$nextTick(function () {
      hub.$on('open-modal', this.openDialog)
      hub.$on('close-modal', this.closeDialog)
      // hub.$on('close-modal', this.close);
    }.bind(this));
    // hub.$on('bus-event', this.openDialog)
  },
  props: [
    'user',
    'item',
  ],
  computed: {
    checkboxErrors () {
      const errors = []
      if (!this.$v.checkbox.$dirty) return errors
      !this.$v.checkbox.checked && errors.push('You must agree to continue!')
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength && errors.push('サービス名は３０文字以内で入力してください')
      !this.$v.name.required && errors.push('サービス名を入力してください')
      return errors
    },
    urlErrors () {
      const errors = []
      if (!this.$v.url.$dirty) return errors
      !this.$v.url.required && errors.push('URLを入力してください')
      return errors
    },
    authorErrors () {
      const errors = []
      if (!this.$v.author.$dirty) return errors
      !this.$v.author.required && errors.push('作成者を入力してください')
      return errors 
    }
  },
  methods: {
    async submit () {
      this.overlay = true
      this.$v.$touch()

      var path = "";
      var uoloadFileName = ""
      var storageRef = firebase.storage().ref();
      if (this.file1 != null) {
        console.log(this.file1)
        uoloadFileName = this.file1.name
        var mountainImagesRef = storageRef.child('images/' + uoloadFileName);
        var uploadResult = await mountainImagesRef.put(this.file1).then(snapshot => {
            return snapshot.ref.getDownloadURL()
        });
        path = uploadResult;
      } else {
        const noImage = "noImage.png"
        path = noImage
        uoloadFileName = noImage 
      }
      
      var db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp()
      db.collection("serviceInfo").add({
        uid: this.user.uid,
        name: this.name,
        url: this.url,
        feature: this.feature,
        author: this.author,
        src : path,
        imageFileName: uoloadFileName,
        createday: timestamp,
        updateday: timestamp,
        heartCnt:0,
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        location.href = '/index'
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
      this.overlay = false
    },
    async update() {
      console.log("更新処理")
      this.overlay = true

      var path = "";
      var fileName = ""
      if (this.file1 != null) {
        var storageRef = firebase.storage().ref();
        if (this.item.imageFileName != undefined && this.item.imageFileName != "noImage.png") {
          console.log(this.item.imageFileName)
          var mountainImagesRef = storageRef.child('images/' + this.item.imageFileName);
          mountainImagesRef.delete()
        }
        var mountainImagesRef1 = storageRef.child('images/' + this.file1.name);
        var uploadResult = await mountainImagesRef1.put(this.file1).then(snapshot => {
            return snapshot.ref.getDownloadURL()
        });
        console.log("upload -> " + uploadResult)
        path = uploadResult;
        fileName = this.file1.name
      } else {
        const noImage = "noImage.png"
        path = noImage
        fileName = noImage
      }
      var db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp()
      await db.collection("serviceInfo").doc(this.item.id).update({
        name: this.name,
        url: this.url,
        feature: this.feature,
        author: this.author,
        src : path,
        imageFileName: fileName,
        updateday: timestamp,
      });
      this.overlay = false
      this.$router.go({path: this.$router.currentRoute.path, force: true})
      
    },
    clear () {
      this.$v.$reset()
      this.name = ''
      this.url = ''
      this.feature = ''
      this.checkbox = false
      this.file1 = null
      this.uploadedImage = ''
    },
    onFileChange(e) {
      //multipleの場合は配列になる
      if (e == null) {
       this.uploadedImage = ""; 
      } else {
        let file = e;

        loadImage.parseMetaData(file, (data) => {
          const options = {
            maxHeight: 350,
            maxWidth: 400,
            canvas: true
          };
          if (data.exif) {
            options.orientation = data.exif.get('Orientation');
          }
          this.displayImage(file, options);
        });

      }
    },
    displayImage(file, options) {
      loadImage(
        file,
        async (canvas) => {
          const data = canvas.toDataURL(file.type);
          // data_url形式をblob objectに変換
          const blob = this.base64ToBlob(data, file.type);
          // objectのURLを生成
          const url = window.URL.createObjectURL(blob);

          this.uploadedImage = url;
          this.file1 = new File([blob], file.name);
        },
        options
      );
    },
    base64ToBlob(base64, fileType) {
      const bin = atob(base64.replace(/^.*,/, ''));
      const buffer = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }
      return new Blob([buffer.buffer], {
        type: fileType ? fileType : 'image/jpeg'
      });
    },
    openDialog(item) {
      if (item != undefined) {
        this.name = item.name
        this.url = item.url
        this.feature = item.feature
        this.author = item.author
        this.uploadedImage = item.src
        this.isNewData = false
      } else {
        this.name = "" 
        this.url = ""
        this.feature = ""
        this.author = ""
        this.uploadedImage = ""
        this.isNewData = true 
      }
    },
    closeDialog() {
      console.log("closeDialog")
    },
  },
}
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>