<template>
  <div class="new-conversation">
    <h1>Start a new conversation</h1>
    <input v-model="userToSearch" placeholder="Search Username" class="search-input"/>
    <button v-if="!searchLoading" v-on:click="searchUsersClick" class="search-btn">Search</button>
    <Spinner v-if="searchLoading"/>
    <div v-if="userResults.length !== 0" class="search-results">
      <span v-for="user in userResults" :id="user._id" class="searched-user">
        <input type="radio" v-model="selectedUser" v-bind:value="user._id"/>
        <label>{{ user.username }}</label>
      </span>
      <button v-if="!createLoading" class="create-btn" v-on:click="createConversationClick">Create</button>
      <Spinner v-if="createLoading"/>
    </div>
  </div>
</template>



<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { store } from '@/store';
import { IUser } from '../../../../interfaces/interfaces'
import Spinner from '../../../../components/Spinner.vue'

export default defineComponent({
  name: 'NewConversation',
  components: {
    Spinner
  },
  data() {
    return {
      userToSearch: '',
      userResults: [] as Array<IUser>,
      selectedUser: '',
      searchLoading: false,
      createLoading: false
    }
  },
  methods: {
    // Function:    searchUsersClick()
    // Description: called upon when the user clicks on the "Search" button and will
    //              retrieve a list of users matching the search term passed in
    // Parameters:  N/A
    // Return:      N/A
    async searchUsersClick() {
      const searchData = {
        search: this.userToSearch
      }

      try {
        this.searchLoading = true

        // sends a request to retrieve a list of users that match the search 
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/users/search`, searchData, {
          headers: {
            'Authorization': `${localStorage.getItem('chatToken')}`
          }
        })

        this.searchLoading = false

        this.userResults = response.data
      }
      catch (e: any) {
        this.searchLoading = false
        alert("Unable to perform search. Please try again.")
      }
    },
    // Function:    createConversationClick()
    // Description: called upon when the user clicks the "Create" button and will create
    //              a conversation with the user selected
    // Parameters:  N/A
    // Return:      N/A
    async createConversationClick() {
      // if no user is selected, an alert is displayed to the user to select a user
      if (this.selectedUser === '') {
        return alert("Please select a user to create a conversation with.")
      }

      const conversationData = {
        recipientId: this.selectedUser
      }

      try {
        this.createLoading = true

        // sends request to create a new conversation with the user selected
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/conversations`, conversationData, {
          headers: {
            'Authorization': `${localStorage.getItem('chatToken')}`
          }
        })

        this.createLoading = false

        // emits an event to the socket server that a new conversation has been created
        store.state.socket.emit('newConversation', this.selectedUser)

        // redirects the user back to the home page
        this.$router.push({name: 'Home'})
      }
      // if an error has occurred, an alert is displayed indicating a new conversation could not be created
      catch (e: any) {
        this.createLoading = false
        alert("Unable to create conversation. Please try again.")
      }
    }
  }
});
</script>



<style scoped>
.new-conversation {
  height: 92vh;
  width: 100vw;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #111827;
  color: white;
  font-size: large;
  overflow: auto;
}

.search-input {
  border-radius: 5px;
  width: 20%;
  padding: 10px;
  margin-bottom: 1rem;
  font-size: medium;
}

.search-btn {
  padding: 5px;
  margin-bottom: 1rem;
}

.search-results {
  border: 1px solid;
  border-radius: 5px;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  max-height: 50%;
  overflow: auto;
}

.searched-user {
  display: block;
  margin: 1rem;
  width: 80%;
  text-align: left;
  border-bottom: 1px solid;
}

.searched-user input[type="radio"] {
  display: inline;
  width: fit-content;
}

.search-btn {
  padding: 7px;
  font-size: medium;
  border: none;
  border-radius: 5px;
  background-color: #1E40AF;
  color: white;
}

.search-btn:hover {
  background-color: #1E3A8A;
}

.create-btn {
  padding: 7px;
  font-size: medium;
  border: none;
  border-radius: 5px;
  background-color: #22C55E;
  margin-top: 0.5rem;
  color: white;
}

.create-btn:hover {
  background-color: #16A34A;
}

@media (max-width: 768px) {
  .search-input {
    width: 80%;
  }

  .search-results {
    width: 80%;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .search-input {
    width: 80%;
  }

  .search-results {
    width: 80%;
  }
}

@media (max-width: 850px) and (max-height: 450px) {
  .search-results {
    margin-bottom: 10px;
  }
}

@media (min-width: 2560px) {
  .search-results {
    font-size: x-large;
  }
}
</style>