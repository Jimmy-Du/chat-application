import { Socket } from 'socket.io-client';
import { Store } from 'vuex'
import { ISelectedConversation } from './interfaces/interfaces'

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    auth: boolean,
    showMobileConversations: boolean,
    id: string,
    username: string,
    selectedConversation: ISelectedConversation,
    socket: Socket
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}