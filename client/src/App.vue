<template>
  <Navbar/>
  <router-view/>
  <Footer/>
</template>



<script lang='ts'>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

export default {
  components: { 
    Navbar: Navbar,
    Footer: Footer
  },
}
</script>



<style>
body {
  margin: auto;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
