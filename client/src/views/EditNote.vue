<template>
<div class="edit-container">
  <div class="edit-content">
    <div class="edit-form">
      <b-form @submit="updateNote">
        <h1 id="note"> Edit note </h1>
        <b-form-group id = "input-group-1" label ="Headline">
            <b-form-input id= "input-1" v-model="form.headline" type="text" placeholder="Enter a headline">
            </b-form-input>
        </b-form-group>
        <b-form-group id ="input-group-2" label ="Content">
            <b-form-textarea
            id="textarea"
            v-model="form.content"
            placeholder="Enter something..."
            rows="3"
            max-rows="6"
        ></b-form-textarea>
        </b-form-group>
        <b-form-group id="input-group-3" label="Name">
        <b-form-input v-model="form.writer" type="text" placeholder="Enter your name"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="info">Save</b-button>
      </b-form>
      </div>
      </div>
    </div>
</template>

<script>
import { Api } from '@/Api'
import Vue from 'vue'
import { LayoutPlugin } from 'bootstrap-vue'
Vue.use(LayoutPlugin)

export default {
  name: 'editNote',
  data() {
    return {
      form: {
        headline: '',
        content: '',
        writer: ''
      }
    }
  },
  methods: {
    getNote(id) {
      Api.get('notes/' + id)
        .then((response) => {
          this.form = response.data
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
    updateNote(event) {
      event.preventDefault()
      Api.put('notes/' + this.$route.params.id, this.form)
        .then(() => {
          this.$router.push('/notes')
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
  },
  created() {
    this.getNote(this.$route.params.id)
  }
}
</script>

<style>
#note{
 font-family: Verdana;
  color: black;
}

.edit-container{
  width: 100vw;
  height: 100vh;
  background:#94c9d2;
  overflow: hidden;
}

.edit-content{
  height: 80%;
  justify-content: center;
  align-content: center;
}

.edit-form{
  height: 100%;
  background: #fefefe;
  padding: 72px;
  margin: 36px;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  display: flex;
  border-radius: 24px;
}

@media screen and (max-width: 400px) {
  .edit-form {
    min-width: 300px;
  }
}

</style>
