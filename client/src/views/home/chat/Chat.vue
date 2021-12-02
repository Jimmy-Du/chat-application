<template>
  <div class="chat" ref="chat">
    <div v-if="!conversation" class="chat-prompt">
      <svg width=25 height=25 class="conversation-mobile-btn" v-on:click="displayMobileConversationClick">
        <path d="M0,5 30,5" stroke="#fff" stroke-width="3"/>
        <path d="M0,14 30,14" stroke="#fff" stroke-width="3"/>
        <path d="M0,23 30,23" stroke="#fff" stroke-width="3"/>
      </svg>
      <p>Click on a conversation to begin.</p>
    </div>
    <div class="chat-header" v-if="conversation">
      <svg width=25 height=25 class="conversation-mobile-btn" v-on:click="displayMobileConversationClick">
        <path d="M0,5 30,5" stroke="#fff" stroke-width="3"/>
        <path d="M0,14 30,14" stroke="#fff" stroke-width="3"/>
        <path d="M0,23 30,23" stroke="#fff" stroke-width="3"/>
      </svg>
      <h1 class="username-header">{{ $store.state.selectedConversation.talkingToUsername }}</h1>
    </div>
    <div v-if="conversation" class="messages">
      <Message 
        v-for="message in messages" 
        v-bind:messageText="message.content"
        v-bind:username="message.sender.username"
        v-bind:sender="message.sender._id === $store.state.id"
      />
    </div>
    <div v-if="conversation" class="message-input">
      <input v-model="messageToSend" placeholder="Type a message" v-on:keyup.enter="sendHandler"/>
      <button v-on:click="sendHandler">Send</button>
    </div>
  </div>
</template>



<script lang="ts">
import { defineComponent } from 'vue';
import Message from './message/Message.vue'
import axios from 'axios'
import { store } from '../../../store/index'
import { IMessage } from '../../../interfaces/interfaces'

export default defineComponent({
  name: 'Chat',
  components: {
    Message: Message
  },
  data() {
    return {
      messages: [] as Array<IMessage>,
      messageToSend: ''
    }
  },
  mounted() {
    store.state.socket.on('newMessage', ({senderUsername, conversationId, message}) => {
      const newMessage = {
        sender: {
          _id: '',
          email: '',
          username: senderUsername
        },
        _id: '',
        conversationId,
        content: message
      }

      // if the message being recieved is for the currently selected conversation, the message
      // is pushed into the array of messages
      if (conversationId === this.$store.state.selectedConversation.conversationId) {
        this.messages.unshift(newMessage)
      }
    })
  },
  computed: {
    conversation(){
      return this.$store.state.selectedConversation.conversationId
    }
  },
  watch: {
    async conversation(newConversationId: string) {
      // if the selected conversation is not blank, the messages of the conversation are retrieved
      if (newConversationId) {
        // retrieves the list of messages for the conversation selected
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/messages/${newConversationId}`, {
          headers: {
            'Authorization': `${localStorage.getItem('chatToken')}`
          }
        })
  
        this.messages = response.data.reverse()
      }
    }
  },
  methods: {
    // Function:    sendHandler()
    // Description: called upon when the user clicks the "send" button
    //              and will send the message inputted to the selected conversation
    // Parameters:  N/A 
    // Return:      N/A
    async sendHandler() {
      const messageData = {
        conversationId: this.conversation,
        content: this.messageToSend
      }

      // attempts to send a message to the server and adds the newly sent message to the list of messages
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/messages`, messageData, {
          headers: {
            'Authorization': `${localStorage.getItem('chatToken')}`
          }
        })

        // emits the message that was just sent to the database
        this.$store.state.socket.emit('sendMessage', {
          recieverId: this.$store.state.selectedConversation.talkingToId,
          senderUsername: this.$store.state.username,
          conversationId: this.$store.state.selectedConversation.conversationId,
          message: this.messageToSend
        })

        this.messageToSend = ''

        this.messages.unshift(response.data)
      }
      // if an error occurs, an alert indicating the message could not be sent is displayed
      catch (e: any) {
        alert("Unable to send message. Please try again.")
      }
    },
    // Function:    displayMobileConversationClick()
    // Description: called upon when the user clicks on the 3 lines svg while on
    //              a mobile device and will display to the list of conversations
    // Parameters:  N/A
    // Return:      N/A
    displayMobileConversationClick() {
      const chatDiv = this.$refs.chat as HTMLDivElement

      // if the conversations div is currently being displayed, the display property will be set to none
      if (store.state.conversationsDiv.style.display === "block") {
        store.state.conversationsDiv.style.display = "none"
        chatDiv.style.width = "100%"
      }
      // else, the conversations div will be displayed and the chat div will take 50% of the width
      else {
        store.state.conversationsDiv.style.display = "block"
        store.state.conversationsDiv.style.width = "50%"
        chatDiv.style.width = "50%"
      }
    }
  }
});
</script>



<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #334155;
}

.chat-prompt {
  color: white;
}

.chat-prompt p {
  display: inline;
  margin-left: 10px;
}

.username-header {
  color: white;
  display: inline;
  margin: 0px;
  margin-left: 10px;
}

.chat-header {
  background-color: #1E293B;
  text-align: left;
  padding: 10px 0 10px 0;
}

.conversation-mobile-btn {
  margin-left: 10px;
  display: none;
}

.messages {
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
}

.message-input {
  width: 80%;
  margin-bottom: 10px;
  padding: 10px;
  align-self: center;
}

.message-input input {
  width: 70%;
  font-size: 16px;
  margin-right: 10px;
  border-radius: 10px;
  padding: 10px;
}

.message-input button {
  padding: 10px;
  border-radius: 10px;
  font-size: 16px;
  background-color: #22C55E;
  border: none;
}

.message-input button:hover {
  background-color: #16A34A;
}

@media (max-width: 768px) {
  .username-header {
    font-size: medium;
  }

  .chat-prompt {
    text-align: left;
  }

  .conversation-mobile-btn {
    display: inline;
  }
}
</style>