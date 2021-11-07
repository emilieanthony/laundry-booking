<template>
<div class="container-note">
  <div class="header3">
    <div class="header3-text">
    <h1>Community Board</h1>
    <p id="share">Share your thoughts with your neighbours!</p>
    </div>
    </div>
    <h1 class="desktop-hidden">Community Board</h1>
    <div class ="note-form">
     <b-form @submit="addNote">
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
    <b-button type="submit" variant="info">Add new note</b-button>
  </b-form>
  </div>
  <div class="container-cards">
  <b-card-group v-for="(note, index) in notes" :key="note._id">
    <b-card v-bind:title="note.headline">
      <b-icon-pencil-square v-on:click="setNoteEditMode(index)"></b-icon-pencil-square>
      <!-- Show form if note.edit is true -->
      <b-form @submit="editNote(note._id, note.content, index)" v-if="note.edit === true">
        <b-form-textarea
        id="textarea"
        v-model="note.content"
        placeholder="Enter something..."
        rows="3"
        max-rows="6"
        ></b-form-textarea>
        <b-button type="submit" variant="info">Save</b-button>
      </b-form>
       <!-- if note.edit is false, show simple content -->
      <b-card-text v-else> {{ note.content }}</b-card-text>
      <b-card-text>{{ note.writer }}</b-card-text>
      <div class="button-form">
      <router-link v-bind:to="'notes/' + note._id">
        <b-button type ="submit" variant="outline-info">Edit note</b-button>
      </router-link>
      <b-form @submit="deleteNoteById(note._id, index)">
    <b-button id="delete" type ="submit" variant="danger">Delete</b-button>
    </b-form>
      </div>
    </b-card>
  </b-card-group>
  </div>
  <div class="button-form">
    <b-form @submit="deleteNotes">
    <b-button type="submit" variant="danger">Delete all notes</b-button>
    </b-form>
  </div>
</div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'note',
  data() {
    return {
      notes: [],
      form: {
        headline: '',
        content: '',
        writer: ''
      }
    }
  },
  methods: {
    addNote(event) {
      event.preventDefault()
      Api.post('notes', this.form)
        .then(() => {
          this.getAllNotes()
        })
        .catch(() => {
          this.$bvToast.toast('Something went wrong. Please try again.', {
            title: 'Error',
            variant: 'danger',
            autoHideDelay: 5000,
            appendToast: true
          })
        })
      this.form.headline = ''
      this.form.content = ''
      this.form.writer = ''
    },
    deleteNotes() {
      Api.delete('notes')
        .then(() => {
          this.getAllNotes()
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
    deleteNoteById(id) {
      Api.delete('notes/' + id)
        .then(() => {
          const index = this.notes.findIndex(note => note._id === id)
          this.notes.splice(index, 1)
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
    editNote(id, content, index) {
      Api.patch('notes/' + id, { content })
        .catch(() => {
          this.$bvToast.toast('Something went wrong. Please try again.', {
            title: 'Error',
            variant: 'danger',
            autoHideDelay: 5000,
            appendToast: true
          })
        })
      // Hide form for note
      this.$set(this.notes[index], 'edit', false)
    },
    getAllNotes() {
      Api.get('notes')
        .then((response) => {
          // map each note from backend to also have edit = false property after fetching them
          this.notes = response.data.notes.map((note) => ({ ...note, edit: false }))
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
    // set a note to edit mode (show form for a note. Toggle UI)
    setNoteEditMode(index) {
      this.$set(this.notes[index], 'edit', !this.notes[index].edit)
    }
  },
  mounted() {
    this.getAllNotes()
  }
}

</script>

<style>
.header3{
   background-image: linear-gradient(rgba(3, 3, 3, 0.7), rgba(3, 3, 3, 0.7)), url(../assets/img-14.jpg);
    background-size: cover;
    background-position: center;
    height: 50vh;
    background-attachment: fixed;
    color: white;
}

@media screen and (max-width: 768px) {
  .header3 {
    display: none;
  }
}

@media screen and (min-width: 768px) {
  .desktop-hidden{
    display: none;
  }
}

.header3-text{
height: 100%;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
}

.container-note{
display: flex;
justify-content: center;
flex-direction: column;
margin: 12px;
}

.note-form{
  margin: 64px;
}

.button-form{
margin: 24px 0 auto;
padding: 8px;
display: flex;
justify-content: center;
align-items: center;
flex-direction: row;
}

#delete{
  margin: 12px;
}

.container-cards{
  display: flex;
  flex-direction: row;
  justify-self: flex-start, space-evenly;
  flex-wrap: wrap;
  align-items: stretch;
  align-content: flex-start;
  row-gap: 20px;
  column-gap: 20px;
}

.card-group{
width: 32%;
}

@media screen and (max-width: 1050px) {
  .container-cards {
    flex-direction: column;
  }
  .card-group {
    width: 100%;
  }
}
</style>
