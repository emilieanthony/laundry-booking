import axios from 'axios'

export const Api = axios.create({
  headers: {
    authorization: 'Bearer ' + localStorage.token
  },
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/'
})
