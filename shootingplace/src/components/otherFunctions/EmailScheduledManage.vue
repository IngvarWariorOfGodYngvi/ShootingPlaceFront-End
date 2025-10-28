<template>
  <div>
    <div class="q-pa-md text-center full-width no-outline text-h5 text-bold">Lista wiadomości e-mail zaplanowane do
      wysłania
    </div>
    <div class="row col bg-primary text-white text-left" style="border-radius: 2em;">
      <div class="text-center" style="width:3%">Lp</div>
      <div class="col">Odbiorca</div>
      <div class="col">Rodzaj wiadomości</div>
      <div class="col">Tytuł</div>
      <div class="col">Zaplanowane na</div>
    </div>
    <hr>
    <q-scroll-area class="full-width q-pa-none" style="height: 70vh;">
        <div v-for="(item, index) in emails" :key="index" class="hover1 text-positive items-center"
          style="cursor: pointer;" @dblclick="temp = item;emailInfo = true">
          <div class="text-positive row text-left">
            <Tooltip2clickTip />
            <div class="text-center" style="width:3%">{{ index + 1 }}</div>
            <div class="col">{{ item.recipient }} <br/> {{ item.memberName }}</div>
            <div class="col">{{ item.mailType }}</div>
            <div class="col">{{ item.subject }}</div>
            <div class="col">{{ item.scheduledFor.substring(0,19).replace('T', ' ') }}</div>
          </div>
        </div>
    </q-scroll-area>

    <q-dialog v-model="emailInfo" @hide="tempEditText = true">
      <q-card v-if="temp!=null" class="bg-dark text-positive" style="min-width: 60vw;">
        <q-card-actions align="right">
          <div class="col text-h6 text-bold text-center">Informacje o wiadomości</div>
          <q-btn icon="close" color="primary" round dense v-close-popup/>
        </q-card-actions>
        <q-card-section>
          <div class="row">
            <div class="col-2">Tytuł:</div>
            <div class="col">{{ temp.subject }}</div>
          </div>
          <div class="row">
            <div class="col-2">Odbiorca:</div>
            <div class="col">{{ temp.recipient }} ({{ temp.memberName }})</div>
          </div>
          <q-editor v-model="temp.htmlContent" :toolbar="toolbar" :fonts="fonts" class="bg-dark text-positive" :class="tempEditText?'':'border-positive'" :readonly="tempEditText" content-class="bg-dark text-positive"></q-editor>
        </q-card-section>
        <q-card-section align="right">
          <q-btn glossy class="q-ma-xs" color="red" label="usuń wiadomość" rounded @click="deleteScheduledEmails(temp.uuid)" v-close-popup/>
          <q-btn glossy class="q-ma-xs" v-if="!tempEditText" color="primary" label="zapisz" rounded @click="saveScheduledEmail(temp.htmlContent,temp.uuid)" v-close-popup/>
          <q-btn glossy class="q-ma-xs" color="secondary" label="edytuj wiadomość" rounded @click="tempEditText = !tempEditText"/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style src="../../style/style.scss" lang="scss"></style>
<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

export default {
  name: 'EmailScheduledManage.vue',
  created () {
    this.getScheduledEmails()
  },
  components: {
    Tooltip2clickTip: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickTip.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['unordered', 'ordered'],
        ['link', 'image'],
        ['left', 'center', 'right', 'justify'],
        ['undo', 'redo'],
        ['viewsource']
      ],
      fonts: {
        arial: 'Arial',
        verdana: 'Verdana',
        tahoma: 'Tahoma'
      },
      emails: [],
      emailInfo: false,
      tempEditText: true,
      temp: null,
      code: null,
      success: false,
      failure: false,
      message: null,
      local: App.host
    }
  },
  methods: {
    getScheduledEmails () {
      fetch(`${this.local}/email/scheduled`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    deleteScheduledEmails (uuid) {
      fetch(`${this.local}/email?uuid=${uuid}`, {
        method: 'DELETE'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.getScheduledEmails()
              this.autoClose()
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    saveScheduledEmail (content, uuid) {
      const data = {
        to: null,
        subject: null,
        htmlContent: content,
        attachments: null,
        inlineImages: null
      }
      fetch(`${this.local}/email/save?uuid=${uuid}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.getScheduledEmails()
              this.autoClose()
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    autoClose () {
      this.code = null
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>
