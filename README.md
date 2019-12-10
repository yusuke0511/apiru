# apiru
アプリケーションをPRすることができるWebアプリケーション

## Firebaseの設定
main.jsにfirebaseConfigがあります。
適当な名前のプロジェクトを作ってWebアプリの登録を行えばConfigの構成を取得できるはずなので
ご自身のfirebase環境に合わせて書き換えてください。

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
npm install --save firebase
npm install firebaseui —-save
```

### firebaseConfigの設定
main.js内にfirebaseConfigがダミーになってます。
アプリケーションを動かすためにFirebaseプロジェクトを作成し、ご自身のConfigを設定してください


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
