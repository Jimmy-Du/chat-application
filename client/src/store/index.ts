import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { io, Socket } from 'socket.io-client'
import { IToken, ISelectedConversation } from '../interfaces/interfaces'



// define your typings for the store state
export interface State {
  auth: boolean,
  conversationsDiv: HTMLDivElement,
  id: string,
  username: string,
  selectedConversation: ISelectedConversation,
  socket: Socket
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    auth: false,
    conversationsDiv: null as unknown as HTMLDivElement,
    id: '',
    username: '',
    selectedConversation: {
      conversationId: '', 
      talkingToId: '',
      talkingToUsername: ''
    },
    socket: null as unknown as Socket
  },
  mutations: {
    loginUser(state, {userId, username}) {
      state.auth = true
      state.id = userId
      state.username = username
    },
    logoutUser(state) {
      state.auth = false
      state.id = ''
      state.username = ''
      state.selectedConversation = {
        conversationId: '', 
        talkingToId: '',
        talkingToUsername: ''
      }

      if (state.socket) {
        state.socket.disconnect()
      }
    },
    setConversationsDiv(state, { conversationsDiv }) {
      state.conversationsDiv = conversationsDiv
    },
    setSelectedConversation(state, { conversationId, talkingToId, talkingToUsername }) {
      state.selectedConversation = {conversationId, talkingToId, talkingToUsername}
    },
    setSocket(state, socket) {
      state.socket = socket
    }
  },
  actions: {
    // Function:    loginHandler()
    // Description: attempts to login with the login data that is passed in
    //              and will set the auth state to true if successful
    // Parameters:  N/A
    // Return:      N/A
    async requestLogin({ commit }, loginData) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/users/login`, {
          email: loginData.email, 
          password : loginData.password 
        })
  
        // login token is stored into localstorage if successfully logged in
        localStorage.setItem('chatToken', response.data.token)

        const decoded = jwt_decode<IToken>(response.data.token)

        commit('loginUser', {userId: decoded.id, username: decoded.username})
      }
      catch (e: any) {
        throw new Error(e.response.data.error)
      }
    },
    // Function:    logout()
    // Description: logouts the user by removing the token from localStorage and
    //              setting the auth state to false
    // Parameters:  N/A
    // Return:      N/A
    logout({ commit }) {
      localStorage.removeItem('chatToken')

      commit('logoutUser')
    },
    // Function:    checkLoggedIn()
    // Description: checks localstorage for a valid token to determine
    //              if the user can successfully log in
    // Parameters:  N/A
    // Return:      N/A
    checkIfLoggedIn({ commit }) {
      let loggedIn = true
      let userId = ''
      let username = ''

      // if a login token is present in local storage, the expiration time will be checked
      if (localStorage.chatToken) {
        // decode token to access user info
        const decoded = jwt_decode<IToken>(localStorage.chatToken)

        userId = decoded.id
        username = decoded.username

        // check for expired token
        const currentTime = Date.now() / 1000

        // if the token has expired, the user will be set to logged out
        if (decoded.exp < currentTime) {
          loggedIn = false
        }
      }
      // if no login token is present, the user is set to be logged out
      else {
        loggedIn = false
      }

      // if the user is logged in, the auth state will be set to true
      if (loggedIn) {
        commit('loginUser', { userId, username})
      }
      // else, the auth state is set to false
      else {
        commit('logoutUser')
      }
    },
    // Function:    setConversationsDiv()
    // Description: stores the conversationsDiv
    // Parameters:  conversationsDiv: contains the div that corresponds with the list of conversations
    //              of a user
    // Return:      N/A
    setConversationsDiv({ commit }, { conversationsDiv }) {
      commit('setConversationsDiv', { conversationsDiv })
    },
    // Function:    changeSelectedConversation()
    // Description: changes the selected conversation of the application
    // Parameters:  conversationId: the conversationId of the selected conversation to be set to
    // Return:      N/A
    changeSelectedConversation({ commit }, { conversationId, talkingToId, talkingToUsername }) {
      commit('setSelectedConversation', { conversationId, talkingToId, talkingToUsername })
    },
    // Function:    establishSocket()
    // Description: setups a connection with the socket server
    // Parameters:  N/A
    // Return:      N/A
    establishSocket({ commit }) {
      const socket = io(`${process.env.VUE_APP_SOCKET_URL}`)

      socket.emit('addUser', store.state.id)

      commit('setSocket', socket)
    }
  }
})
