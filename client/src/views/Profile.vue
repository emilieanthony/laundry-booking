<template>
  <div class="fluid">
    <div class="header4">
      <div class="text-box">
          <h1 id="profileHeader">Profile</h1>
          <b-avatar icon="people-fill" variant="info" size ="lg"></b-avatar>
        </div>
    </div>
    <div class="content-profile">
       <b-card  border-variant="light"
             header= "User"
             header-bg-variant="light"
             header-text-variant="info"
             align="center"
             style="width: 40rem;">
             <p id="details" align="center"> Name: {{user.name}} <br> Email: {{user.email}} </p>
       </b-card>
    </div>

    <div style="font-size: 4rem;">
    <b-icon icon="bell-fill" class="border border-info rounded p-2" variant="info"> </b-icon>
  </div>
    <div class="notification" align="center">
      <b-card-group v-for="notification in notifications" :key="notification._id">
        <div class="notification-card">
          <b-card border-variant="secondary"
                  align="center">
                  <notification-item v-bind:notification="notification" v-on:del-notification="deleteNotification"/>
          <!-- if note.edit is false, show simple content -->
          <b-card-text> {{ notification.content }}</b-card-text>
            <router-link v-bind:to="'notifications/' + notification._id">
            </router-link>
          </b-card>
        </div>
      </b-card-group>
    </div>
    </div>
</template>

<script>

import { Api } from '@/Api'
import NotificationItem from '../components/NotificationItem.vue'
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
export default {
  name: 'profile',
  components: {
    'notification-item': NotificationItem
  },

  mounted() {
    this.getNotifications()
    Api.get('users/' + localStorage.userId)
      .then(response => {
        console.log(response)
        console.log('user id: ', localStorage.userId)
        this.user = response.data
      })
      .catch(error => {
        console.log(error)
        this.$bvToast.toast('Something went wrong. Please try again.', {
          title: 'Error',
          variant: 'danger',
          autoHideDelay: 5000,
          appendToast: true
        })
      })
      .then(() => {
        console.log('This runs every time after success or error.')
      })
  },
  methods: {
    getNotifications() {
      Api.get('users/' + localStorage.userId + '/notifications')
        .then(response => {
          console.log(response)
          this.notifications = response.data.notifications
        })
        .catch(error => {
          console.log(error)
          this.$bvToast.toast('Something went wrong. Please try again.', {
            title: 'Error',
            variant: 'danger',
            autoHideDelay: 5000,
            appendToast: true
          })
        })
        .then(() => {
          console.log('This runs every time after success or error.')
        })
    },
    deleteNotification(id) {
      console.log(`Delete notification with id ${id}`)
      Api.delete(`/notifications/${id}`)
        .then(response => {
          const index = this.notifications.findIndex(notification => notification._id === id)
          this.notifications.splice(index, 1)
        })
    }
  },
  data() {
    return {
      user: {},
      notifications: []
    }
  }
}
</script>

<style scoped>
#details{
  font-family: Verdana;
}

.header4{
  background-image: linear-gradient(rgba(3, 3, 3, 0.7), rgba(3, 3, 3, 0.7)), url(../assets/img-6.jpg);
    background-size: cover;
    background-position: center;
    height: 50vh;
    background-attachment: fixed;
    color: white;
}

.content-profile{
  width: 100vw;
  height: 25vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

* {
  font-family: Verdana;
}
#details {
  color: black;
}
#profileHeader{
  color: floralwhite;
}

</style>
