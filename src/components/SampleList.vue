<template>
  <v-app id="inspire">
    <v-container>
      <v-data-iterator
        :items="items"
        :items-per-page.sync="itemsPerPage"
        :page="page"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
        hide-default-footer
        loading 
        loading-text="Loading... Please wait"
      >
        <template v-slot:header>
          <v-toolbar
            dark
            color="orange darken-1"
            class="mb-1"
          >
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="search"
              label="Search"
            ></v-text-field>
            <template v-if="$vuetify.breakpoint.mdAndUp">
              <div class="flex-grow-1"></div>
              <v-btn-toggle
                v-model="sortDesc"
                mandatory
              >
                <v-btn
                  large
                  depressed
                  color="orange darken-1"
                  :value="false"
                >
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn
                  large
                  depressed
                  color="orange darken-1"
                  :value="true"
                >
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-toolbar>
        </template>
  
        <template v-slot:default="props">
          <v-row 
          alignment='center'>
            <v-col
              v-for="item in props.items"
              :key="item.name"
              cols="12" sm="12" md="6" lg="6"
            >
                <v-list dense flat max-width="500px">
                  <a :href="item.url" target="brank">
                  <v-img
                        :src="getAssetsImage(item.src)"
                        eager
                        class="white--text align-end"
                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        height="450px"
                        width="500px"
                      >
                  </v-img>
                  </a>
                  <v-card-title class="subheading font-weight-bold">{{ item.name }}</v-card-title>
                  <v-list-item
                    v-for="(key, index) in filteredKeys"
                    :key="index"
                    :color="sortBy === key ? `blue lighten-4` : `white`"
                  >
                    
                    <v-list-item-content>
                      <v-list-item-title><v-icon>{{ getDisplayIcon(key) }}</v-icon>{{ getDisplay(key) }}</v-list-item-title>
                      <v-list-item-subtitle v-if="key == 'URL'">
                        <a :href="item[key.toLowerCase()]" target="brank">{{ item[key.toLowerCase()]}}</a>
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-else>
                        <pre style="white-space: pre-wrap">{{ item[key.toLowerCase()]}}</pre>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
            </v-col>
          </v-row>
        </template>
  
        <template v-slot:footer>
          <v-row class="mt-2" align="center" justify="center">
            <span class="grey--text">Items per page</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  dark
                  text
                  color="primary"
                  class="ml-2"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
  
            <div class="flex-grow-1"></div>
  
            <span
              class="mr-4
              grey--text"
            >
              Page {{ page }} of {{ numberOfPages }}
            </span>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="mr-1"
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="ml-1"
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
  </v-app>
</template>

<script>
import vuetify from '../plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import * as firebase from "firebase/app";

export default {
  vuetify,
  data () {
    return {
      itemsPerPageArray: [8, 16, 32, 64],
      search: '',
      filter: {},
      sortDesc: true,
      page: 1,
      itemsPerPage: 8,
      sortBy: 'Updateday',
      keys: [
        'Name',
        'URL',
        'Src',
        'Feature',
        'Author',
        'Createday',
        'Updateday',
      ],
      items:[],
    }
  },
  created() {
    var db = firebase.firestore();
    db.collection("serviceInfo").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            var docItem = doc.data()
            if (docItem.createday != null) docItem.createday = this.convertDate(docItem.createday.toDate())
            if (docItem.updateday != null) docItem.updateday = this.convertDate(docItem.updateday.toDate()) 
            console.log(docItem)
            this.items.push(docItem)
        });
    });
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key != 'Name' && key != 'Src')
    },
  },
  methods: {
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
      this.$router.replace('/list/' + this.page)
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
      this.$router.replace('/list/' + this.page)
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
    getDisplay(val) {
      switch(val) {
        case 'Feature': return "特徴"
        case 'Author': return "作者"
        case 'Createday': return "投稿日"
        case 'Updateday': return "更新日"
        default: return val
      }
    },
    getAssetsImage(val) {
      if (val == "noImage.png") {
        return require("../assets/src/noImage.png")
      }
      return val;
    },
    getDisplayIcon(val) {
      switch(val) {
        case 'URL': return "home"
        case 'Feature': return "check_circle_outline"
        case 'Author': return "face"
        case 'Createday': return "access_alarm"
        case 'Updateday': return "access_alarm"
        default: return "" 
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
  },
}
</script>
