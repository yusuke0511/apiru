import Vue from 'vue'
import Router from 'vue-router'
import App from './components/SampleList'
import TopPage from './components/TopPage'
import Login from './components/Login'
import MyPage from './components/MyPage'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: TopPage,
    },
    {
      path: '/list/:id',
      component: App,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/index',
      component: App,
    },
    {
      path: '/MyPage',
      component: MyPage,
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

/*
router.beforeEach((to, from, next) => {
  if (to.matched.some(page => page.meta.isPublic)) {
    next()
  } else {
    next('/login')
  }
})
*/

export default router