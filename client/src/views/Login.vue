<template>
  <div class="content-login">
    <div class="login-form">
      <h1>Welcome</h1>
      <h3>Log in</h3>
    <b-form @submit="login">
      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>

     <div class ="button-container">
       <b-button type="login" variant="info">Log in</b-button>
       </div>
       <div class ="button-container">
      <router-link to="/register" >
    <b-button type="register" variant="outline-info">Register</b-button>
  </router-link>
  </div>
    </b-form>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login(event) {
      event.preventDefault()
      Api.post('login', this.form)
        .then(response => {
          localStorage.token = response.data.token
          localStorage.userId = response.data.user._id
          localStorage.name = response.data.user.name
          setTimeout(() => {
            this.$router.push('/')
          }, 200)
        })
        .catch(() => {
          this.$bvToast.toast('Wrong username or password. Please try again.', {
            title: 'Error',
            variant: 'danger',
            autoHideDelay: 3000,
            appendToast: true
          })
        })
    }
  }
}
</script>

<style>

.content-login{
width: 100vw;
height: 100vh;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url("../assets/img-3.jpg");
background-color: black;
background-repeat: no-repeat;

}

.button-container{
padding: 5%;
}

.login-form{
  background-color: white;
  padding: 56px;
  padding-left: 64px;
  padding-right: 64px;
  border-radius: 12px;
}

@media screen and (max-width: 400px) {
  .login-form {
    border-radius: 0;
  }
}
</style>
