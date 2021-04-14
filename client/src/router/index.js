import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import DatabaseUpdate from '../views/DatabaseUpdate.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/dashboard',
    name: 'Home',
    component: Home
  },
  {
    path: '/',
    name: 'Loading',
    component: DatabaseUpdate
  }
]

const router = new VueRouter({
  routes
})

export default router
