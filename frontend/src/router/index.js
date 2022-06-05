import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import StockRecieving from '../views/StockRecieving'
import BrewingRecord from '../views/BrewingRecord'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/brewing-record',
    name: 'BrewingRecord',
    component: BrewingRecord
  },
  {
    path: '/stocks/recieving',
    name: 'StockRecieving',
    component: StockRecieving
  },
  {
    path: '/master',
    name: 'Master',
    component: () => import('../views/MasterIndex.vue')
  },
  {
    path: '/master/unit-mst',
    name: 'UnitMaster',
    component: () => import('../views/MasterUnit.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
