<template>
  <div class="navbar">
    <router-link v-if="$store.state.auth" :to="{ name: 'Home' }">Home</router-link>
    <router-link v-if="!$store.state.auth" :to="{ name: 'Welcome' }">Welcome</router-link>
    <router-link v-if="!$store.state.auth" :to="{ name: 'Login' }">Login</router-link>
    <router-link v-if="!$store.state.auth" :to="{ name: 'Register' }">Register</router-link>
    <a href="#" v-if="$store.state.auth" v-on:click="logoutHandler">Logout</a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { store } from '../store/index'

export default defineComponent({
  name: 'Navbar',
  methods: {
    logoutHandler(): void {
      store.dispatch('logout')

      // once logged out, redirects to the Welcome page
      this.$router.push({ name: 'Welcome' })
    }
  }
});
</script>



<style scoped>
.navbar {
  background-color: #0C4A6E;
  padding: 0.5rem;
}

.navbar a {
  margin: 20px;
  font-size: 1.125rem;
  line-height: 1.75rem;
  text-decoration: none;
  color: white;
}

.navbar a.router-link-exact-active {
  text-decoration: underline;
}
</style>
