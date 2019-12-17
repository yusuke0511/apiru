# apiru
アプリケーションをPRすることができるWebアプリケーション

## セッティング
### UIフレームワークの追加
```
vue add vuetify
```

### アイコンを使う
```
npm install material-design-icons-iconfont -D
```
※[Material Design Icons](https://materialdesignicons.com/)
```
npm install @mdi/font
```

### Vuelidateを使う
```
npm install vuelidate --save
```

### 画像を反転させるライブラリ
```
npm install --save blueimp-load-image
```

### router
```
npm install vue-router
```

### Firebaseを使う
```
npm install --save firebase
npm install -g firebase-tools
```

### Firebaseのホスティングにデプロイ
```
firebase login
firebase init
firebase deploy
```
### Firebaseのデプロイ先を切り替える
```
firebase use (プロジェクト名)
```

### 認証系（Firebase）
```
npm install --save dns http2
npm install --save firebase
npm install firebaseui —-save
```

## Firebaseの設定
main.jsにfirebaseConfigがあります。
適当な名前のプロジェクトを作ってWebアプリの登録を行えばConfigの構成を取得できるはずなので
ご自身のfirebase環境に合わせて書き換えてください。

firebaseの環境変数を使用すると便利です。

* 使用準備
```
npm install --save firebase-admin
npm install --save firebase-functions
```

* 環境変数の確認
firebase functions:config:get

* 環境変数の設定
firebase functions:config:set {key}={value}

本アプリで使用する設定は下記の通りになります。(値はご自身の環境に合わせて書き換えてください)
firebase functions:config:set config.apikey="####YOUR APP SETTING####"
firebase functions:config:set config.database_url="####YOUR APP SETTING####"
firebase functions:config:set config.authdomain="####YOUR APP SETTING####"
firebase functions:config:set config.storage_bucket="####YOUR APP SETTING####"
firebase functions:config:set config.app_id="####YOUR APP SETTING####"
firebase functions:config:set config.project_id="####YOUR APP SETTING####"
firebase functions:config:set config.measurement_id="####YOUR APP SETTING####"
firebase functions:config:set config.messaging_sender_id="####YOUR APP SETTING####"
firebase functions:config:set config.storage_bucket="####YOUR APP SETTING####"
firebase functions:config:set config.mode=""

* 環境変数の削除
firebase functions:config:unset {key}


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
