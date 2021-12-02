<template>
  <div class="auth-wrapper">
    <div class="auth">
      <h1>Login</h1>
      <form v-on:submit.prevent="loginHandler">
        <span class="input-field">
          <label>Email:</label>
          <input type="email" required v-model="email"/>
        </span>
        <span class="input-field">
          <label>Password:</label>
          <input type="password" required v-model="password"/>
        </span>
        <p v-if="error" class="error">{{ error }}</p>
        <button v-if="!loading">Login</button>
        <Spinner v-if="loading"/>
      </form>
    </div>
  </div>
</template>



<script lang="ts">
import { defineComponent } from 'vue'
import { store } from '../../store/index';
import './auth.css'
import Spinner from '../../components/Spinner.vue'

export default defineComponent({
  name: 'Login',
  components: {
    Spinner
  },
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    }
  },
  methods: {
    // Function:    loginHandler()
    // Description: called upon when the user clicks the "Login" button and will
    //              send a request to log in with email and password entered
    // Parameters:  N/A
    // Return:      N/A
    async loginHandler(): Promise<void> {
      try {
        this.loading = true

        await store.dispatch('requestLogin', { email: this.email, password: this.password })

        this.loading = false

        // once logged in, redirects to the homepage
        this.$router.push({ name: 'Home' })
      }
      catch (e: any) {
        this.error = e.message
        this.loading = false
      }
    }
  }
});
</script>
