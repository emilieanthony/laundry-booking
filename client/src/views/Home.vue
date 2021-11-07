<template>
  <div class ="container-home">
    <div class="header">
      <div class="text-box">
        <h1>{{welcomeMessage}}</h1>
          <div class="button-header">
            <router-link to="/bookings"><b-button type="submit" variant="info">New booking</b-button></router-link>
          </div>
      </div>
    </div>
    <div class="booking-box">
       <h2> Your bookings</h2>
       <p v-if="requestState === 'loading'">Loading...</p>
       <p v-else-if="bookings.length === 0">You have no current bookings</p>
      <b-card-group v-else deck v-for="booking in bookings" v-bind:key="booking._id">
            <div class="booking-card">
            <b-card border-variant="secondary"
                     align="center">
            <booking-item v-bind:booking="booking" v-on:del-booking="deleteBooking"/>
            <div id="card-text">
            <h3>Booking Nr: {{bookings.indexOf(booking) + 1 }}</h3>
               <h5>Date:</h5>
                <p>{{new Date(booking.date).toUTCString()}} </p>
               <h5> Laundry room: </h5>
                <p> {{booking.laundryroom}}</p>
            </div>
        </b-card>
        </div>
      </b-card-group>
      </div>
      </div>
</template>

<script>

import BookingItem from '../components/BookingItem.vue'
import { Api } from '@/Api'
import Vue from 'vue'
import { BCard, BNavbar } from 'bootstrap-vue'
Vue.component('b-card', BCard)
Vue.component('b-navbar', BNavbar)

export default {
  name: 'bookings',
  components: {
    'booking-item': BookingItem
  },
  mounted() {
    this.requestState = 'loading'
    setTimeout(() => {
      Api.get('users/' + localStorage.userId + '/bookings')
        .then(response => {
          this.bookings = response.data.bookings
          this.requestState = 'success'
        })
        .catch(() => {
          this.requestState = 'error'
          this.bookings = []
          this.$bvToast.toast('Something went wrong. Please try again.', {
            title: 'Error',
            variant: 'danger',
            autoHideDelay: 5000,
            appendToast: true
          })
        })
    }, 3000)
  },
  data() {
    return {
      requestState: '',
      bookings: [],
      name: localStorage.name,
      welcomeMessage: 'Hello, ' + localStorage.name + '!'
    }
  },
  methods: {
    deleteBooking(id) {
      console.log(`Delete booking with id ${id}`)
      Api.delete(`/bookings/${id}`)
        .then(response => {
          const index = this.bookings.findIndex(booking => booking._id === id)
          this.bookings.splice(index, 1)
        })
    },
    logout(event) {
      event.preventDefault()
        .then(response => {
          localStorage.token = null
        })
        .catch(() => {
          this.$bvToast.toast('Something went wrong. Please try again.', {
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
.container-home{
display: flex;
justify-content: center;
flex-direction: column;
}

.header{
  background-image: linear-gradient(rgba(2, 2, 2, 0.7), rgba(3, 3, 3, 0.7)), url(../assets/img-1.jpg);
  background-size: cover;
  background-position: center;
  height: 50vh;
  background-attachment: fixed;
  color: white;
}

@media screen and (max-width: 768px) {
  .header {
    height: 30vh;
  }
}

.text-box{
height: 100%;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
}

.booking-box{
margin: 64px 12px 64px 12px;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;

}

.booking-card{
width: 75vw;
margin: 24px;
text-align: left;
display: flex;
flex-direction: column;
}

.card-body{
  text-align: left;
  background-color: #fefefe;
  border-radius: 24px;
}

.button-header{
  margin-top: 24px;
}

#card-text{
  color: rgb(53, 52, 52);
}

h1 {
 font-family: Verdana;
}
</style>
