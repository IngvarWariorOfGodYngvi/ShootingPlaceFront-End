<template>
  <div class="row">
      <q-card-section class="col-3">
        <q-item class="col">
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled
            v-model="firstDate" mask="####-##-##" label="Data początkowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="firstDate" @input="getRecordsFromBook(firstDate, secondDate)" mask="YYYY-MM-DD"
                    class="bg-dark text-positive">
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
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled
            v-model="secondDate" mask="####-##-##" label="Data końcowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="secondDate" @input="getRecordsFromBook(firstDate, secondDate)" mask="YYYY-MM-DD"
                    class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <div class="q-pa-md">
          <q-btn color="primary" @click="getRecordsFromBook(firstDate, secondDate)"
            label="Wyszukaj"></q-btn>
          <p></p>
        </div>
      </q-card-section>
      <q-card-section class="col">
        <div class="row text-bold">
          <div class="q-pr-xs">lp</div>
          <div class="col-2">Nazwisko i Imię</div>
          <div class="col-2">Data</div>
          <div class="col-4">Adres / Numer pozwolenia</div>
          <div class="col-1 text-left">zapoznanie się z regulaminem strzelnicy</div>
          <div class="col-2 text-center">podpis</div>
        </div>
        <q-virtual-scroll :items="evidenceBookList" visible class="q-pa-none full-width"
          style="height: 40vh">
          <template v-slot="{ index, item }">
            <div class="row text-positive">
              <div class="q-pr-xs">{{ index + 1 }}</div>
              <div class="col-2">{{ item.secondName }} {{ item.firstName }}</div>
              <div class="col-2">{{ item.date.replace('T',' ') }}</div>
              <div class="col-4">{{ item.weaponPermission != null ? item.weaponPermission : item.address }}</div>
              <div class="col-1 text-left">{{ item.statementOnReadingTheShootingPlaceRegulations ? 'tak' : 'nie' }}</div>
              <div class="col-2">{{ item.imageUUID }} tutaj będzie podpis w formie obrazka</div>
            </div>
          </template>
        </q-virtual-scroll>
      </q-card-section>
  </div>
</template>

<script>
import App from 'src/App'

export default {
  name: 'EvidenceBook.vue',
  data () {
    return {
      firstDate: null,
      secondDate: this.createTodayDate(),
      evidenceBookList: [],
      success: false,
      failure: false,
      message: null,
      local: App.host
    }
  },
  methods: {
    getRecordsFromBook (firstDate, secondDate) {
      fetch('http://' + this.local + '/evidence/?firstDate=' + firstDate + '&secondDate=' + secondDate, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.evidenceBookList = response
        })
    },
    convertDate (date) {
      const current = new Date(date)
      let month = current.getMonth() + 1
      let day = current.getDate()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + (month)
      }
      return day + '-' + (month) + '-' + current.getFullYear()
    },
    getSumXLSXFile (firstDate, secondDate) {

    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 2000)
    },
    darkSet () {
      return JSON.parse(window.localStorage.getItem('BackgroundDark'))
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
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>

<style></style>
