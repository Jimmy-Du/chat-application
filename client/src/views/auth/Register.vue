<template>
  <div class="auth-wrapper">
    <div class="auth">
      <form v-on:submit.prevent="registerHandler">
        <h1>Register</h1>
        <span class="input-field">
          <label>Email:</label>
          <input type="email" required v-model="email"/>
          <p v-if="error.email" class="error">{{ error.email }}</p>
        </span>
        <span class="input-field">
          <label>Username:</label>
          <input type="text" required maxlength="16" v-model="username"/>
          <p v-if="error.username" class="error">{{ error.username }}</p>
        </span>
        <span class="input-field">
          <label>Password:</label>
          <input type="password" required v-model="password"/>
          <p v-if="error.password" class="error">{{ error.password }}</p>
        </span>
        <button v-if="!loading">Create Account</button>
        <Spinner v-if="loading"/>
      </form>
    </div>
  </div>
</template>



<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import './auth.css'
import Spinner from '../../components/Spinner.vue'

interface IError {
  email?: string,
  username?: string,
  password?: string
}

export default defineComponent({
  name: 'Register',
  components: {
    Spinner
  },
  data() {
    return {
      email: '',
      username: '',
      password: '',
      error: {} as IError,
      loading: false
    }
  },
  methods: {
    // Function:    registerHandler()
    // Description: called upon when the user clicks the "Create Account" button and will
    //              send a request to create an account with the email and password entered
    // Parameters:  N/A
    // Return:      N/A
    async registerHandler(): Promise<void> {
      const registerData = { username: this.username, email: this.email, password: this.password }

      try {
        this.error = {}
        this.loading = true

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/users/register`, registerData)

        this.loading = false

        // routes the user to the login page to log in with the account they just created
        this.$router.push({ name: 'Login' })
      }
      catch (e: any) {
        this.loading = false
        this.error = e.response.data
      }
    }
  }
});
</script>
