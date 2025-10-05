<template>
  <div>
    <div class="q-pa-md text-center full-width no-outline text-h5 text-bold">Lista wiadomości e-mail zaplanowane do
      wysłania
    </div>
    <q-card-section class="col-3">
      <q-item class="col">
        <q-input class="full-width" bg-color="primary" standout="" rounded input-class="text-positive" label-color="positive" dense
          v-model="firstDate" mask="####-##-##" label="Data początkowa">
          <template v-slot:append>
            <q-icon name="event" color="positive" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date no-unset @input="getSentEmails()" v-model="firstDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Zamknij" color="primary" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item>
      <q-item class="col">
        <q-input class="full-width" color="secondary" bg-color="secondary" standout="" rounded input-class="text-positive" label-color="positive" dense
          v-model="secondDate" mask="####-##-##" label="Data końcowa">
          <template v-slot:append>
            <q-icon name="event" color="positive" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date @input="getSentEmails()" v-model="secondDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Zamknij" color="primary" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item>
      <div>
        <q-btn glossy class="q-ma-md" color="primary" text-color="white" @click="getSum()">Wyszukaj</q-btn>
      </div>
    </q-card-section>
    <q-inner-loading :showing="visible" label="Przetwarzanie..." color="primary" />
    <div class="row col bg-primary text-white text-left" style="border-radius: 2em;">
      <div class="text-center" style="width:3%">Lp</div>
      <div class="col">Odbiorca</div>
      <div class="col">Rodzaj wiadomości</div>
      <div class="col">Tytuł</div>
      <div class="col">Data Wysłania</div>
    </div>
    <hr>
    <q-scroll-area class="full-width q-pa-none" style="height: 70vh;">
      <div v-for="(item, index) in emails" :key="index" class="hover1 text-positive items-center"
        style="cursor: pointer;" @dblclick="temp = item; emailInfo = true">
        <div class="text-positive row text-left">
          <Tooltip2clickTip />
          <div class="text-center" style="width:3%">{{ index + 1 }}</div>
          <div class="col">{{ item.recipient }}<br/>{{ item.memberName }}</div>
          <div class="col">{{ item.mailType }}</div>
          <div class="col">{{ item.subject }}</div>
          <div class="col">{{ item.sentAt.substring(0, 19).replace('T', ' ') }}</div>
        </div>
      </div>
    </q-scroll-area>

    <q-dialog v-model="emailInfo">
      <q-card v-if="temp != null" class="bg-dark text-positive" style="min-width: 60vw;">
        <q-card-actions align="right">
          <div class="col text-h6 text-bold text-center">Informacje o wiadomości</div>
          <q-btn icon="close" color="primary" round dense v-close-popup />
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
          <q-editor v-model="temp.content" :toolbar="[]" :fonts="[]" class="bg-dark text-positive" readonly
            content-class="bg-dark text-positive"></q-editor>
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
<style src="src/style/style.scss" lang="scss"></style>
<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

export default {
  name: 'EmailSentManage.vue',
  components: {
    Tooltip2clickTip: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickTip.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      emails: [],
      firstDate: null,
      secondDate: this.createTodayDate(),
      visible: false,
      emailInfo: false,
      loading: [false],
      temp: null,
      code: null,
      success: false,
      failure: false,
      message: null,
      local: App.host
    }
  },
  setup () {
    function simulateProgress () {
      this.loading[0] = true
      if (this.dis) {
        this.getXlsFile()
      }
      setTimeout(() => {
        this.loading[0] = false
      }, 500)
    }
    return {
      simulateProgress
    }
  },
  methods: {
    getSentEmails () {
      this.visible = true
      fetch(`${this.local}/email/sent?firstDate=${this.firstDate}&secondDate=${this.secondDate}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
          this.visible = false
        }).catch(() => {
          this.visible = false
        })
    },
    createTodayDate () {
      const date = new Date()
      let month = 0
      let day = 0
      if ((date.getMonth() + 1) < 10) {
        month = '0' + (date.getMonth() + 1)
      } else {
        month = (date.getMonth() + 1)
      }
      if (date.getDate() < 10) {
        day = '0' + (date.getDate())
      } else {
        day = (date.getDate())
      }
      return date.getFullYear() + '-' + month + '-' + day
    },
    autoClose () {
      setTimeout(() => {
        this.dis = true
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>
