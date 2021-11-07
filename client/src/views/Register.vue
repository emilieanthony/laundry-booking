<template>
  <div class="content-register background">
    <div class="register-form">
      <h1>Register</h1>
    <b-form @submit="registerUser">
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
      <b-form-group id="input-group-3" label="Password:" label-for="input-3">

         <b-form-input
          id="input-3"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">

        <b-form-input
          id="input-2"
          v-model="form.name"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>
    <b-button type="register" variant="info">Register</b-button>
    </b-form>
    </div>
  </div>
</template>

<script>

// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'register',
  data() {
    return {
      form: {
        email: '',
        name: '',
        password: ''
      }
    }
  },
  methods: {
    registerUser(event) {
      event.preventDefault()
      Api.post('users', this.form)
        .then(() => {
          this.$bvToast.toast('You have successfully registered! Redirecting to login...', {
            title: 'Success',
            variant: 'success',
            autoHideDelay: 5000,
            appendToast: true
          })
          setTimeout(() => {
            this.$router.push('/login')
          }, 3000)
        })
        .catch(() => {
          this.$bvToast.toast('Something went wrong. Please try again.', {
            title: 'Error',
            variant: 'danger',
            autoHideDelay: 5000,
            appendToast: true
          })
        })
    }
  }
}
</script>

<style>

.background{
  background: linear-gradient(#97d1da, #ffffff);
}

.content-register{
width: 100vw;
height: 100vh;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
}

.register-form{
  background-color: white;
  padding: 56px;
  padding-left: 64px;
  padding-right: 64px;
  border-radius: 12px;
}

@media screen and (max-width: 600px) {
  .register-form {
    border-radius: 0;
  }
}
</style>
