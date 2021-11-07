import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Booking from './views/BookingsView.vue'
import Note from './views/Note.vue'
import Profile from '@/views/Profile'
import EditNote from '@/views/EditNote'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/bookings',
      name: 'booking',
      component: Booking
    },
    {
      path: '/notes',
      name: 'note',
      component: Note
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/notes/:id',
      name: 'editNote',
      component: EditNote
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && to.name !== 'register' && !localStorage.token) next({ name: 'login' })
  else next()
})
export default router
