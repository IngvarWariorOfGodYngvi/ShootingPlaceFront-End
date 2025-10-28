<template>
  <div class="col" v-if="main">
    <q-page-sticky v-if="mailingList.length > 0" position="top-right" expand :offset="[6, 6]" style="z-index: 5;">
      <q-fab v-model="mailing" label-position="bottom" color="secondary" direction="down" glossy padding="0.7em"
        style="border: 2px solid white;">
        <template v-slot:icon>
          <q-icon name="email"/>
          <q-badge rounded floating>{{ mailingList.length }}</q-badge>
        </template>
        <div v-if="mailingList.length > 0" class="bg-secondary text-white"
          style="border-radius: 5% 5% 0 0; margin-right: 15vw; font-size: small; width: 18vw">
          <q-btn glossy dense class="text-caption full-width" align="center" label="wyczyść listę" color="primary"
            icon="delete" rounded @click="clearMailingList()" />
          <q-btn glossy dense class="text-caption full-width" align="center"
            :label="'kopiuj ' + mailingList.length + ' do schowka'" color="primary" icon="content_copy" rounded
            @click="unsecuredCopyToClipboard(mailingList)" />
          <q-btn glossy dense label="wyślij wiadomości e-mail" color="primary" rounded class="text-caption full-width" @click="email=true"/>
          <q-virtual-scroll :items="mailingList" class="text-center" style="height: auto;max-height: 40vh;width: auto">
            <template v-slot="{ item, index }">
              <q-item dense style="padding: 0 10px 0 10px;margin: 0">
                {{ index + 1 }} {{ item }}
              </q-item>
            </template>
          </q-virtual-scroll>
        </div>
      </q-fab>
    </q-page-sticky>
    <q-dialog v-model="email">
      <q-card class="bg-dark text-positive q-pa-md" style="min-width: 60vw;">
        <q-card-actions align="right" class="q-pa-xs q-ma-xs">
          <div class="col text-h6 text-bold text-center text-positive">Wyślij e-mail pod wybrane adresy</div>
          <q-btn icon="close" color="primary" round dense v-close-popup />
        </q-card-actions>
        <q-card-section>
          <div class="row items-center">
            <div class="col-2">Tytuł: </div>
            <q-input v-model="subject" dense bg-color="primary" rounded standout="" input-class="text-white" class="text-white col" label-color="white"></q-input>
          </div>
          <div class="row items-center">
            <div class="col-2">Odbiorcy: </div>
            <div v-for="(item, index) in mailingList" :key="index">
              <div class="border-positive q-pa-xs" @click="unsecuredCopyEmail(item)" style="cursor: pointer;">{{ item }} &nbsp;</div>
            </div>
          </div>
          <q-editor class="text-positive bg-dark border-positive" v-model="editorContent"
            :fonts="fonts" :toolbar="toolbar" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-xs q-ma-xs">
          <q-btn glossy :disable="subject.length < 1 || editorContent.length < 1" rounded label="Wyślij" @click="sendEmails ()" color="primary" />
          <q-btn glossy :disable="subject.length < 1 || editorContent.length < 1" rounded label="Wyślij i wyczyść listę" @click="sendEmails (), clearMailingList()" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">
            {{ message }}
          </div>
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
  </div>
</template>
<style src="../style/style.scss" lang="scss"></style>
<script>
import App from 'src/App.vue'
import EventBus from 'src/event-bus.js'

export default {
  created () {
    this.getMailingList()
    EventBus.$on('emailUpdate', this.getMailingList)
  },
  onBeforeUnmount () {
    EventBus.$off('emailUpdate', this.getMailingList)
  },
  data () {
    return {
      mailing: true,
      email: false,
      editorContent: '',
      subject: '',
      success: false,
      failure: false,
      message: null,
      mailingList: JSON.parse(window.localStorage.getItem('mailingList')),
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
      main: App.main,
      local: App.host
    }
  },
  methods: {
    getMailingList () {
      this.mailingList = JSON.parse(window.localStorage.getItem('mailingList'))
    },
    clearMailingList () {
      window.localStorage.setItem('mailingList', JSON.stringify([]))
      this.mailingList = []
      EventBus.$emit('clearMailingList')
    },
    unsecuredCopyToClipboard (arr) {
      const textArea = document.createElement('textarea')
      let s = arr[0]
      if (arr.length > 1) {
        for (let i = 1; i < arr.length; i++) {
          s = s + ';' + arr[i]
        }
      }
      textArea.value = arr
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (err) {
        console.error('Unable to copy to clipboard', err)
      }
      document.body.removeChild(textArea)
      this.message = 'Skopiowano'
      this.success = true
      this.autoClose()
    },
    unsecuredCopyEmail (email) {
      const textArea = document.createElement('textarea')
      textArea.value = email
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (err) {
        console.error('Unable to copy to clipboard', err)
      }
      document.body.removeChild(textArea)
      this.message = 'Skopiowano email'
      this.success = true
      this.autoClose()
    },
    sendEmails () {
      const data = {
        to: '',
        subject: this.subject,
        htmlContent: this.editorContent,
        attachments: [],
        inlineImages: []
      }
      fetch(`${this.local}/email/sendEmails?emailList=${this.mailingList}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.message = response
          this.success = true
          this.autoClose()
        }).catch(() => {
          this.message = 'coś poszło nie tak'
          this.failure = true
          this.autoClose()
        })
    },
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.success = false
        this.message = null
      }, 1000)
    }
  }
}
</script>
