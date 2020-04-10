import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/home',
    name: 'home',
    component:() => import('../views/Home.vue')
  },
  {
    path: '/drag',
    name: 'drag',
    component:() => import('../views/drag.vue')
  },
  {
    path: '/magnifier',
    name: 'magnifier',
    component:() => import('../views/magnifier.vue')
  },
  {
    path: '/imgLabel',
    name: 'imgLabel',
    component:() => import('../views/imgLabel.vue')
  },
  {
    path: '/slideCheck',
    name: 'slideCheck',
    component:() => import('../views/slideCheck.vue')
  },
  {
    path: '/imgCheck',
    name: 'imgCheck',
    component:() => import('../views/imgCheck.vue')
  },
  {
    path: '/canvasParticle1',
    name: 'canvasParticle1',
    component:() => import('../components/CanvasParticle/src/CanvasParticle1.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
