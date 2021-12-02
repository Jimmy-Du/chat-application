<template>
  <div class="conversations" ref="conversations">
    <button v-on:click="newConversationClick">New Conversation</button>
    <ul>
      <li
        v-for="conversation in conversationList" 
        :key="conversation._id"
        v-on:click="conversationClick(
          conversation._id, 
          conversation.members.find(member => member._id !== $store.state.id)!._id,
          conversation.members.find(member => member._id !== $store.state.id)!.username)"
        >
        {{ 
          conversation.members.filter(member => {
            return member._id !== $store.state.id
          })[0].username
        }}
      </li>
    </ul>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>



<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios'
import { store } from '../../../store/index';
import { IConversation } from '../../../interfaces/interfaces'


export default defineComponent({
  name: 'Conversations',
  data() {
    return {
      conversationList: [] as Array<IConversation>,
      error: ''
    }
  },
  async mounted() {
    await this.getConversations()

    // sets a listener on the socket to listen for new conversations 
    // including the user, and will refresh the conversations list
    store.state.socket.on('newConversation', async () => {
      await this.getConversations()
    })

    store.dispatch('setConversationsDiv', { conversationsDiv: this.$refs.conversations })
  },
  methods: {
    // Function:    getConversations()
    // Description: gets the list of conversations of the user
    // Parameters:  N/A
    // Return:      N/A
    async getConversations() {
      try {
        // retrieves the list of conversations that the user currently has
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/conversations`, {
          headers: {
            'Authorization': `${localStorage.getItem('chatToken')}`
          }
        })

        this.conversationList = response.data
      }
      catch (e: any) {
        this.error = 'Failed to load conversations. Please try again.'
      }
    },
    // Function:    conversationClick()
    // Description: called upon when the user clicks on a conversation and will set the
    //              selected conversation to the conversation clicked
    // Parameters:  id: a string containing the conversation id that was clicked
    // Return:      N/A
    conversationClick(conversationId: string, talkingToId: string, talkingToUsername: string) {
      store.dispatch('changeSelectedConversation', {conversationId, talkingToId, talkingToUsername})
    },
    // Function:    newConversationClick()
    // Description: called upon when the user clicks on the "New Conversation" button
    //              and will route the user to the newConversation page
    // Parameters:  N/A
    // Return:      N/A
    newConversationClick() {
      this.$router.push({name: 'NewConversation'})
    }
  }
});
</script>



<style scoped>
.conversations {
  width: 20%;
  background-color: #0F172A;
  overflow: auto;
}

li {
  list-style: none;
  margin-left: -45px;
  padding: 1rem;
  text-overflow: ellipsis;
  background-color: #EF4444;
  text-align: left;
  border-bottom: 1px solid black;
}

li:hover {
  background: #DC2626;
}

button {
  background-color: #22C55E;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 10px;
  margin: 10px;
}

button:hover {
  background-color: #16A34A;
}

.error {
  color: white;
}

@media (max-width: 768px) {
  .conversations {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .conversations {
    width: 30%;
  }
}

@media (max-width: 768px) and (max-height: 450px) {
  .auth {
    width: 50%;
  }
}

</style>