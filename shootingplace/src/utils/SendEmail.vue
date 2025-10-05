<template>
  <div>
    <q-btn-dropdown glossy dense label="wyślij mail" color="primary" rounded menu-self="center middle" content-class="border-positive bg-dark text-positive" content-style="border: 2px solid; border-radius: 2em;">
      <q-card class="bg-dark text-positive q-pa-md">
        <q-card-actions align="right" class="q-pa-xs q-ma-xs">
          <div class="col text-h6 text-bold text-center text-positive">Wyślij e-mail</div>
          <q-btn icon="close" color="primary" round dense v-close-popup />
        </q-card-actions>
        <q-card-section>
          <q-editor class="text-positive bg-dark" content-class="border-positive" v-model="editorContent" :definitions="definitions" :fonts="fonts"
          :toolbar="toolbar" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-xs q-ma-xs">
          <q-btn label="Wyślij" @click="sendEmail" color="primary" />
        </q-card-actions>
      </q-card>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const editorContent = ref('<p>Witaj!</p>')

const toolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  ['unordered', 'ordered'],
  ['link', 'image'],
  ['left', 'center', 'right', 'justify'],
  ['undo', 'redo'],
  ['viewsource']
]

const fonts = {
  arial: 'Arial',
  verdana: 'Verdana',
  tahoma: 'Tahoma'
}

const definitions = {
  // możesz rozszerzać funkcjonalność
}

function sendEmail () {
  console.log(editorContent.value)
  // Wyślij na backend jako HTML
}
</script>
