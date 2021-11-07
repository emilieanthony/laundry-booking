<template>
  <div id="app">
    <div id="nav">
   <!--    <router-link to="/register">Register</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/">Home</router-link>
       <router-link to="/bookings">View Bookings</router-link> -->
       <navbar />
    </div>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>

<script>
import navbar from './components/NavigationBar.vue'

export default {
  name: 'app',
  components: {
    navbar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
