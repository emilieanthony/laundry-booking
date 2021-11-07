<template>
  <div class="fluid">
    <div class="header0"></div>
    <div class ="container-booking">
      <div class="booking-form">
        <section>
          <h1>Create new booking</h1>
          <h6>Select a laundry room, date and start time. <br> * Each slot is three hours *</h6>
        </section>
      <b-form class="form" @submit="createBooking">
        <div class ="picker">
          <b-form-group label="Choose a laundry room: " v-slot="{ ariaDescribedby }">
            <b-form-radio-group
              id="radio-group-1"
              v-model="selectedLaundryRoom"
              :options="options"
              :aria-describedby="ariaDescribedby"
              name="radio-options"
            ></b-form-radio-group>
        </b-form-group>
        <div class="mt-3">Selected: <strong>{{ selectedLaundryRoom }}</strong></div>
        <div class ="date-picker">
          <label for="example-datepicker">Choose a date:</label>
          <b-form-datepicker id="example-datepicker" v-model="date_picker.value" class="mb-2"></b-form-datepicker>
        </div>
        <div class="time-picker">
          <label for="example-timepicker">Choose a starting time:</label>
          <b-form-timepicker v-bind:hour12="false" v-model="time_picker.value" locale="en"></b-form-timepicker>
        </div>
        </div>
        <div class="booking-button">
          <b-button type="submit" variant="info">Add new booking</b-button>
        </div>
      </b-form>
   </div>
   <div class="calendar-box">
     <h1> All bookings</h1>
     <p>Here is an overview of all bookings</p>
   <kalendar :configuration="calendar_settings" :events.sync="events" />
 </div>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import Vue from 'vue'
import PortalVue from 'portal-vue'
import { Kalendar } from 'kalendar-vue'
import { BNavbar } from 'bootstrap-vue'
Vue.use(PortalVue)
Vue.component('b-navbar', BNavbar)

export default {
  name: 'home',
  components: {
    Kalendar
  },
  data() {
    return {
      selectedLaundryRoom: '',
      options: [
        { text: 'North', value: 'North' },
        { text: 'East', value: 'East' },
        { text: 'South', value: 'South' },
        { text: 'West', value: 'West' }
      ],
      date_picker: {
        value: ''
      },
      time_picker: {
        value: ''
      },
      calendar_settings: {
        style: 'material_design',
        view_type: this.$isMobile() ? 'day' : 'week',
        cell_height: 10,
        scrollToNow: false,
        start_day: new Date().toISOString(),
        read_only: true,
        overlap: true,
        hide_days: [7],
        past_event_creation: true
      },
      events: []
    }
  },
  mounted() {
    setTimeout(() => {
      this.getAllBookings()
    }, 1000)
  },
  methods: {
    getAllBookings() {
      Api.get('/bookings')
        .then(response => {
          response.data.bookings.forEach(booking => { // Loop through all bookings from response from server
            const to = new Date(booking.date)
            to.setHours(to.getHours() + 3) // The slot becomes 3 hours
            this.$kalendar.addNewEvent(
              {
                from: new Date(booking.date).toISOString(),
                to: to.toISOString(),
                data: booking.laundryroom + ' not available'
              }
            )
          })
        })
        .catch(() => {
          this.$bvToast.toast('Something went wrong. Please try again.', {
            title: 'Error',
            variant: 'danger',
            autoHideDelay: 5000,
            appendToast: true
          })
        })
    },

    createBooking(event) {
      event.preventDefault()
      Api.post('users/' + localStorage.userId + '/bookings', {
        date: this.date_picker.value + 'T' + this.time_picker.value + 'Z',
        laundryroom: this.selectedLaundryRoom
      })
        .then(response => {
          this.createNotification()
          window.location.reload()
        })
        .catch(() => {
          this.$bvToast.toast('Something went wrong. Please try again.', {
            title: 'Error',
            variant: 'danger',
            autoHideDelay: 5000,
            appendToast: true
          })
        })
    },
    createNotification(event) {
      Api.post('users/' + localStorage.userId + '/notifications', {
        content: 'This is a reminder of your booked laundry time slot: ' + this.date_picker.value + ' ' + this.time_picker.value,
        laundryroom: this.selectedLaundryRoom
      })
    }
  }
}
</script>

<style>

.header0{
  background-image: linear-gradient(rgba(3, 3, 3, 0.7), rgba(3, 3, 3, 0.7)), url(../assets/img-15.jpg);
    background-size: cover;
    background-position: center;
    height: 50vh;
    background-attachment: fixed;
    color: white;
}

@media screen and (max-width: 768px) {
  .header0 {
    display: none;
  }
}

.container-booking{
display: flex;
justify-content: center;
flex-direction: column;
margin: 24px auto;
}

.booking-form{
  width: 100%;
  padding: 24px;
  background-color: rgb(254, 254, 254);
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

 @media screen and (max-width: 768px) {
  .booking-form{
    padding: 24px 0;
  }
}

.booking-button{
  margin: 24px;
}

.form{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  }

.date-picker{
  max-width: 185px;
}
.picker{
  width: 100%;
  display: flex;
  padding: 24px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f6fbfc;
  border-radius: 12px;
}

.calendar-box{
  margin: 36px auto 0;
  width: 90vw;
}

p {
font-family: Verdana;
}

</style>
