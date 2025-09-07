<template>
  <div class="col">
      <q-card-section>
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
        <div class="q-pa-md">
          <q-btn glossy rounded class="q-mr-md" color="primary" @click="getRecordsFromBook(firstDate, secondDate)"
            label="Wyszukaj"/>
          <q-btn glossy rounded color="primary" label="pobierz listę" @click="getReport(firstDate, secondDate)"/>
        </div>
      </q-card-section>
      <q-card-section >
        <div class="row text-bold">
          <div class="q-pr-xs">lp</div>
          <div class="col-2">Nazwisko i Imię</div>
          <div class="col-2">Data i godzina przyjścia</div>
          <div class="col-3">Adres / Numer pozwolenia</div>
          <div class="col-1 text-left">zgoda na przetwarzanie danych</div>
          <div class="col-1 text-left">zapoznanie się z regulaminem strzelnicy</div>
          <div class="col text-center">podpis</div>
        </div>
        <q-virtual-scroll :items="evidenceBookList" visible class="q-pa-none full-width"
          style="height: 40vh">
          <template v-slot="{ index, item }">
            <div class="row text-positive">
              <div class="q-pr-xs">{{ index + 1 }}</div>
              <div class="col-2">{{ item.secondName }} {{ item.firstName }}</div>
              <div class="col-2"><div>{{ convertDateTime(item.dateTime).substring(0,10) }}<div>{{ convertDateTime(item.dateTime).substring(10,19) }}</div></div></div>
              <div class="col-3">{{ item.weaponPermission != null ? item.weaponPermission : item.address }}</div>
              <div class="col-1 text-center">{{ item.dataProcessingAgreement ? 'tak' : 'nie' }}</div>
              <div class="col-1 text-center">{{ item.statementOnReadingTheShootingPlaceRegulations ? 'tak' : 'nie' }}</div>
              <div class="col bg-white"><q-img contain height="8vh" spinner-color="white" class="flex-center"
              :src="(`${local}/files/getFile?uuid=${item.imageUUID}`)" /></div>
            </div>
          </template>
        </q-virtual-scroll>
      </q-card-section>
      <q-dialog position="top" v-model="success">
        <q-card>
          <q-card-section class="col">
            <div class="text-center text-h5 text-bold">Pobrano Listę</div>
          </q-card-section>
        </q-card>
      </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'
import axios from 'axios'

export default {
  name: 'EvidenceBook.vue',
  data () {
    return {
      firstDate: null,
      secondDate: this.createTodayDate(),
      evidenceBookList: [],
      success: false,
      message: null,
      local: App.host
    }
  },
  methods: {
    getRecordsFromBook (firstDate, secondDate) {
      fetch(`${this.local}/evidence/?firstDate=${firstDate}&secondDate=${secondDate}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.evidenceBookList = response
        })
    },
    getReport (firstDate, secondDate) {
      if (firstDate != null && secondDate != null) {
        axios({
          url: `${this.local}/files/downloadEvidenceBook?firstDate=${firstDate}&secondDate=${secondDate}`,
          method: 'GET',
          responseType: 'blob'
        }).then(response => {
          const fileURL = window.URL.createObjectURL(new Blob([response.data]))
          const fileLink = document.createElement('a')
          fileLink.href = fileURL
          fileLink.setAttribute('download', 'Książka rejestru pobytu na strzelnicy od ' + firstDate + ' do ' + secondDate + '.pdf')
          document.body.appendChild(fileLink)
          fileLink.click()
          this.success = true
          this.autoClose()
        })
      }
    },
    convertDateTime (dateTime) {
      return dateTime.replace('T', ' ').substring(0, 19)
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 2000)
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
        this.message = null
      }, 2000)
    }
  }
}
</script>

<style></style>
