<template>
  <div>
    <q-btn dense glossy color="primary" class="q-mt-xs" rounded label="wyślij wiadomość e-mail" @click="email=true"/>
    <q-dialog v-model="email">
      <q-card class="bg-dark text-positive" style="min-width: 60vw;">
        <q-card-actions align="right" class="q-pa-xs q-ma-xs">
          <div class="col text-h6 text-bold text-center text-positive">Wyślij wiadomość e-mail do {{ name }}</div>
          <q-btn icon="close" color="primary" round dense v-close-popup />
        </q-card-actions>
        <q-card-section>
          <div class="row items-center">
            <div class="col-2">Tytuł: </div>
            <q-input v-model="subject" dense bg-color="primary" rounded standout="" input-class="text-white" class="text-white col" label-color="white"></q-input>
          </div>
          <div class="row items-center">
            <div class="col-2">Odbiorca: </div>
            <div>{{ recipient }}</div>
          </div>
          <q-editor class="text-positive bg-dark border-positive" v-model="editorContent"
            :fonts="fonts" :toolbar="toolbar" />
          <q-card-actions align="right" class="q-pa-xs q-ma-xs">
          <q-btn rounded :disable="subject.length < 1 || editorContent.length < 1" glossy label="Wyślij" @click="sendEmail()" color="primary" v-close-popup/>
        </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
        <q-dialog position="standard" v-model=" failure ">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if=" message != null " class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model=" success ">
      <q-card>
        <q-card-section>
          <div v-if=" message != null " class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>
<style src="../style/style.scss" lang="scss"></style>
<script>
import App from 'src/App.vue'
export default {
  props: {
    name: {
      type: String,
      require: true
    },
    recipient: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      email: false,
      editorContent: '',
      subject: '',
      fonts: {
        arial: 'Arial',
        verdana: 'Verdana',
        tahoma: 'Tahoma'
      },
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['unordered', 'ordered'],
        ['link', 'image'],
        ['left', 'center', 'right', 'justify'],
        ['undo', 'redo'],
        ['viewsource']
      ],
      failure: false,
      success: false,
      message: null,
      local: App.host
    }
  },
  methods: {
    sendEmail () {
      const data = {
        to: this.recipient,
        subject: this.subject,
        htmlContent: this.editorContent,
        attachments: [],
        inlineImages: []
      }
      fetch(`${this.local}/email/sendSingleEmail`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      }).catch(() => {
        this.message = 'coś poszło nie tak'
        this.failure = true
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>
