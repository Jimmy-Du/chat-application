import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Home from '../views/home/Home.vue'
import Register from '../views/auth/Register.vue'
import Login from '../views/auth/Login.vue'
import NewConversation from '../views/home/conversations/newConversation/NewConversation.vue'
import { store } from '../store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome,
    beforeEnter: (to, from, next) => {
      store.dispatch('checkIfLoggedIn')

      if (store.state.auth) {
        next('/home')
      }
      else {
        next()
      }
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      store.dispatch('checkIfLoggedIn')

      if (store.state.auth) {
        // if the socket has not been set, a connection to the server socket is made
        if (store.state.socket === null || !store.state.socket.connected) {
          store.dispatch('establishSocket')
        }

        // resets the selected conversation state
        store.dispatch('changeSelectedConversation', {conversationId: '', talkingToId: ''})

        next()
      }
      else {
        next('/login')
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: (to, from, next) => {
      store.dispatch('checkIfLoggedIn')

      if (store.state.auth) {
        next('/home')
      }
      else {
        next()
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      store.dispatch('checkIfLoggedIn')

      if (store.state.auth) {
        // resets the selected conversation state
        store.dispatch('changeSelectedConversation', {conversationId: '', talkingToId: ''})

        next('/home')
      }
      else {
        next()
      }
    }
  },
  {
    path: '/newConversation',
    name: 'NewConversation',
    component: NewConversation,
    beforeEnter: (to, from, next) => {
      store.dispatch('checkIfLoggedIn')

      if (store.state.auth) {
        // if the socket has not been set, a connection to the server socket is made
        if (store.state.socket === null || !store.state.socket.connected) {
          store.dispatch('establishSocket')
        }

        // resets the selected conversation state
        store.dispatch('changeSelectedConversation', {conversationId: '', talkingToId: ''})

        next()
      }
      else {
        next('/login')
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
