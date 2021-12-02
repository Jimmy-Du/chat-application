<template>
  <div class="welcome-wrapper">
    <div class="welcome">
      <h1>Welcome to Chat-App</h1>
      <p>
        Chat-App is a realtime chat application that enables users to communicate with one another in realtime.
      </p>
      <p>To begin:</p>
      <button class="login-btn" v-on:click="loginRegisterHandler('Login')">Login</button>
      <p>or</p>
      <button class="register-btn" v-on:click="loginRegisterHandler('Register')">Register</button>
    </div>
  </div>
</template>



<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Welcome',
  methods: {
    // Function:    loginRegisterHandler()
    // Description: called upon when the user clicks the "Login" or "Register" buttons
    //              and redirects to the corresponding route
    // Parameters:  route: a string containing the name of the route to be
    //              redirected to
    // Return:      N/A
    loginRegisterHandler(route: string): void {
      this.$router.push({name: route})
    }
  }
});
</script>



<style scoped>
.welcome-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 86vh;
  width: 100vw;
  max-width: 100%;
  overflow: auto;
}

.welcome {
  align-self: center;
  width: 50%;
  padding: 1rem;
  border: solid;
  border-width: 1px;
  box-shadow: 3px 3px #D1D5DB;
  border-radius: 10px;
  background-color: #111827;
  color: white;
}

.welcome p {
  font-size: large;
}

.welcome button {
  padding: 10px;
  font-size: large;
  border: none;
  border-radius: 5px;
  color: white;
}

.register-btn {
  background-color: #22C55E;
}

.register-btn:hover {
  background-color: #16A34A;
}

.login-btn {
  background-color: #1E40AF;
}

.login-btn:hover {
  background-color: #1E3A8A;
}

@media (max-width: 768px) {
  .welcome {
    width: 70%;
  } 
}

@media (max-height: 450px) {
  .welcome-wrapper {
    padding-top: 50px;
    padding-bottom: 50px;
  }
}
</style>
