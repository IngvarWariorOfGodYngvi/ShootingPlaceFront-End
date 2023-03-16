<template>
  <div>
    <div :class="mobile?'col':'row'">
      <q-card-section class="col-3">
        <q-item class="col">
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled
                   v-model="firstDate" mask="####-##-##" label="Data początkowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="firstDate" mask="YYYY-MM-DD" @input="getJudgingList(firstDate, secondDate)">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" flat/>
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
                  <q-date v-model="secondDate"  mask="YYYY-MM-DD" @input="getJudgingList(firstDate, secondDate)">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <div class="q-pa-md">
          <q-btn color="primary" text-color="positive" @click="getJudgingList(firstDate, secondDate)" label="Wyszukaj"></q-btn>
          <p></p>
          <q-btn v-if="firstDate!=null&&secondDate!=null" @click="getSumXLSXFile()"
                 label="pobierz plik xlsx" color="green-3" text-color="black"></q-btn>
          <q-btn v-else-if="!mobile" label="pobierz plik xlsx" color="green-3" disabled text-color="black"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col">
        <div v-if="quantitySum.length <1"
             class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">^ Brak wyników wpisów
          - Wybierz daty ^
        </div>
        <div v-if="quantitySum.length >0"
             class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Ilość Zapisów :
          {{ quantitySum.length }}
        </div>
        <q-virtual-scroll v-if="quantitySum.length >0" :items="quantitySum"
                          type="table" dense class="row full-width" style="height: 50vh;">
          <template v-slot:before>
            <thead class="thead-sticky text-left">
            <tr>
              <th class="text-left">
                <div class="row"><div style="width: 2vw">{{ quantitySum.length }}</div> Nazwisko i Imię</div>
              </th>
              <th>
                <div>Funkcja</div>
              </th>
              <th class="text-left" style="width: 15%">
                <div>Nazwa</div>
                <div>Zawodów</div>
              </th>
              <th class="text-left" style="width: 15%">
                <div>Data </div>
                <div>Zawodów</div>
              </th>
              <th class="text-left" style="width: 15%">
                <div>Godzina</div>
                <div>Przyjścia</div>
              </th>
            </tr>
            </thead>
          </template>
          <template v-slot="{ item, index }">
            <tr :key="index" class="rounded" style="cursor:pointer"
                @dblclick="legitimationNumber = item.legitimationNumber; memberDial=true">
              <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
              </q-tooltip>
              <td class="text-left xyz row"><div style="width: 1.5vw"><b>{{index +1}}</b></div> {{ item.secondName }} {{ item.firstName }}</td>
              <td class="text-left">{{ item.judgingFunction }}</td>
              <td class="text-left">{{ item.tournamentName }}</td>
              <td class="text-left">{{ convertDate(item.date) }}</td>
              <td class="text-left">
                <div>{{ item.time }}</div>
              </td>
            </tr>
          </template>
        </q-virtual-scroll>
      </q-card-section>
    </div>
    <q-btn color="primary" label="pobierz Raport Sędziowania" @click="showloading ();getJudgingReport()"/>
  </div>
</template>

<script>
import axios from 'axios'
import App from 'src/App'

export default {
  name: 'JudgingReport.vue',
  data () {
    return {
      firstDate: null,
      secondDate: this.createTodayDate(),
      quantitySum: [],
      mobile: App.mobile,
      local: App.host
    }
  },
  methods: {
    getJudgingList (firstDate, secondDate) {
      if (firstDate != null && secondDate != null) {
        fetch('http://' + this.local + '/tournament/getJudgingList?firstDate=' + firstDate.replace(/\//gi, '-') + '&secondDate=' + secondDate.replace(/\//gi, '-'), {
          method: 'GET'
        }).then(response => {
          response.json().then(response => {
            this.quantitySum = response
          })
        })
      }
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
    getJudgingReport () {
      axios({
        url: 'http://' + this.local + '/files/downloadJudgingReport',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Raport sędziowania.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
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
        this.acceptWorkingTimeDial = false
        this.changeWorkingTimeDial = false
        this.code = null
      }, 2000)
    }
  }
}
</script>

<style>

</style>
