<template>
  <q-card class="bg-dark text-positive">
    <div class="col-4">
      <q-select class="col-4 q-mb-xs" dense options-dense filled label-color="positive" color="positive"
        input-class="text-positive" :dark="darkSet()" :options-dark="darkSet()" fill-input popup-content-class="bg-dark text-positive"
        options-selected-class="bg-dark text-positive" v-model="yearSelect1"
        :options="workingYear" label="Wybierz Rok" @input="monthSelect1 = null; getAllWorkingMonthInYear(yearSelect1)">
      </q-select>
      <q-select class="col-4 q-mb-xs" dense options-dense filled label-color="positive" color="positive"
        input-class="text-positive" fill-input popup-content-class="bg-dark text-positive"
        options-selected-class="bg-dark te  t-positive" :dark="darkSet()" :options-dark="darkSet()" v-if="yearSelect1 != null"
        v-model="monthSelect1" :options="month" @input="getAllWorkingTimeEvidenceInMonth(yearSelect1, monthSelect1)"
        label="Wybierz Miesiąc">
      </q-select>
      <q-btn color="primary" text-color="white" glossy rounded
        @click="getAllWorkingTimeEvidenceInMonth(yearSelect1, monthSelect1)" label="wyświetl listę pracy" />
    </div>
    <div v-if="workList.length > 0" class="col">
      <div class="row bg-secondary text-white">
        <div class="text-center self-center q-pl-md" style="width: 2vw">lp</div>
        <div class="col-2 text-center self-center">Start</div>
        <div class="col-2 text-center self-center">Stop</div>
        <div class="col-2 text-center self-center">Czas Pracy</div>
        <div class="col text-center self-center">Nadgodziny</div>
        <div class="col text-center self-center">Zamknięte automatycznie</div>
      </div>
      <div class="q-pa-none text-black full-width">
        <q-expansion-item dense class="col bg-grey-5" v-for="(i, index) in workList" :key="index"
          :label="i.secondName + ' ' + i.firstName + ' ' + i.subType + ' czas pracy: ' + i.workTime">
          <div :key="index" v-for="(item, index) in i.wtedtoList" class="bg-grey-2 row hover1">
            <div class="row full-width"
              @dblclick="uuid = item.uuid; workTimeStart = item.start.replace('T', ' ').substring(0, 16); workTimeStop = item.stop.replace('T', ' ').substring(0, 16); editWorkTime = true">
              <div class="text-center self-center text-bold" style="width: 2vw">
                {{ index + 1 }}
              </div>
              <div class="col-2 text-center self-center">{{ item.start.replace('T', ' ').substring(0, 19) }}
              </div>
              <div class="col-2 text-center self-center">{{ item.stop.replace('T', ' ').substring(0, 19) }}
              </div>
              <div class="col-2 text-center self-center">{{ item.workTime }}</div>
              <div class="col text-center self-center bg-primary text-white">{{ item.toClarify ? 'TAK' : '' }}</div>
              <div class="col text-center self-center bg-primary text-white">{{ item.automatedClosed ? 'TAK' : '' }}
              </div>
            </div>
          </div>
        </q-expansion-item>
      </div>
      <div class="row q-pt-md q-pb-md">
        <div class="col">
          <q-btn color="primary" text-color="white" dense @click="changeWorkingTimeDial = true"
            :disable="workTimeChangeArray.length < 1"
            :label="workTimeChangeArray.length > 0 ? 'wprowadź zmiany' : 'Brak Zmian'"></q-btn>
        </div>
        <div class="reverse">
          <q-btn color="secondary" text-color="white" dense label="zatwierdź czas pracy"
            :disable="acceptedList.length < 1" @click="acceptWorkingTimeDial = true"></q-btn>
        </div>
      </div>
    </div>
    <hr/>
    <q-select class="q-mb-xs" dense options-dense filled label-color="positive" color="positive"
        input-class="text-positive" :dark="darkSet()" :options-dark="darkSet()" fill-input popup-content-class="bg-dark text-positive"
        options-selected-class="bg-dark text-positive"
        :options="workingYear" label="Wybierz Rok" v-model="yearSelect"
      @input="monthSelect = null; getAllWorkingMonthInYear(yearSelect)">
    </q-select>
    <q-select class="q-mb-xs" dense options-dense  filled label-color="positive" color="positive"
      input-class="text-positive" fill-input popup-content-class="bg-dark text-positive"
      options-selected-class="bg-dark text-positive" :dark="darkSet()" :options-dark="darkSet()" v-if="yearSelect != null"
      v-model="monthSelect" @input="workTypeSelect = null; getAllWorkingTypeInMonthAndYear(yearSelect, monthSelect)"
      :options="month" label="Wybierz Miesiąc">
    </q-select>
    <q-item v-if="monthSelect != null && workTypeSelect != null">
      <q-toggle v-model="detailed">szczegółowy</q-toggle>
    </q-item>
    <q-item class="col-4 q-pa-none">
      <q-btn class="q-pa-none" color="primary" glossy rounded :disable="monthSelect === null "
        label="Pobierz raport czasu pracy"
        @click="showloading(); getWorkTimeReport(yearSelect, monthSelect,detailed)" />
    </q-item>
    <q-dialog v-model="editWorkTime">
      <q-card style="width: 45vw; max-width: 45vw" class="bg-dark text-positive">
        <q-card-section>
          <div class="q-pa-md">
            <div class="row">
              <q-date class="bg-dark" today-btn v-model="workTimeStart" mask="YYYY-MM-DD HH:mm" color="primary"
                name="start pracy" />
              <q-time class="bg-dark" now-btn v-model="workTimeStart" mask="YYYY-MM-DD HH:mm" color="primary" />
            </div>
          </div>
          <q-item>
            <q-input color="positive" label-color="positive" input-class="text-positive" v-model="workTimeStart"
              class="full-width" filled label="Start Pracy"></q-input>
          </q-item>
          <div class="q-pa-md">
            <div class="row">
              <q-date class="bg-dark" today-btn v-model="workTimeStop" mask="YYYY-MM-DD HH:mm" color="secondary" />
              <q-time class="bg-dark" now-btn v-model="workTimeStop" mask="YYYY-MM-DD HH:mm" color="secondary" />
            </div>
          </div>
          <q-item>
            <q-input color="positive" label-color="positive" input-class="text-positive" v-model="workTimeStop"
              class="full-width" filled label="Stop Pracy"></q-input>
          </q-item>
          <q-item class="full-width">
            <q-btn class="full-width" label="usuń wpis" color="red"></q-btn>
          </q-item>
        </q-card-section>
        <q-card-actions>
          <div class="row full-width">
            <div class="col">
              <q-btn text-color="white" label="zamknij" color="secondary" v-close-popup />
            </div>
            <div class="reverse">
              <q-btn label="zapisz *" color="primary" v-close-popup
                @click="addRecordToWorkTimeArray(uuid, workTimeStart, workTimeStop)" />
            </div>
          </div>
          <q-badge>* zamiany zostaną wprowadzone dopiero po zatwierdzeniu</q-badge>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptWorkingTimeDial" persistent
      @keypress.enter="acceptWorkingTime(acceptedList, code); acceptWorkingTimeDial = false; code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn id="3" label="Dodaj" color="black" v-close-popup
            @click="acceptWorkingTime(workTimeChangeArray, code); acceptWorkingTimeDial = false; code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="changeWorkingTimeDial" persistent
      @keypress.enter="inputChangesToWorkTIme(workTimeChangeArray, code)">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn id="3" label="Dodaj" color="black" v-close-popup
            @click="inputChangesToWorkTIme(workTimeChangeArray, code)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="failure" position="standard">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="success" position="top">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import axios from 'axios'
import App from 'src/App'

export default {
  name: 'WorkTimeReport.vue',
  created () {
    this.getAllWorkingYear()
  },
  data () {
    return {
      uuid: null,
      dark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      c: 0,
      code: null,
      editWorkTime: false,
      month: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
      monthSelect: null,
      monthSelect1: null,
      yearSelect: null,
      yearSelect1: null,
      workType: ['Pracownik', 'Zarząd'],
      workType1: ['Pracownik', 'Zarząd'],
      workTypeSelect: null,
      checked: false,
      acceptWorkingTimeDial: false,
      changeWorkingTimeDial: false,
      detailed: false,
      workTimeStart: null,
      workTimeStop: null,
      workTimeChangeArray: [],
      workList: [],
      workingYear: [],
      acceptedList: [],
      usersList: [],
      success: false,
      failure: false,
      message: null,
      local: App.host
    }
  },
  methods: {
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
    getAllWorkingTimeEvidenceInMonth (year, month) {
      fetch(`${this.local}/work/month?year=${year}&month=${month}`, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.workList = response
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
    getAllWorkingTypeInMonthAndYear (year, month) {
      fetch(`${this.local}/work/getAllWorkingTypeInMonthAndYear?year=${year}&month=${month}`, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.workType = response
              this.workType1 = response
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
    getAllWorkingYear () {
      fetch(`${this.local}/work/getAllWorkingYear`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.workingYear = response
        })
    },
    getAllWorkingMonthInYear (year) {
      fetch(`${this.local}/work/getAllWorkingMonthInYear?year=${year}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.month = response
        })
    },
    getWorkTimeReport (year, month, detailed) {
      if (month !== null) {
        axios({
          url: `${this.local}/files/downloadWorkReport?year=${year}&month=${month}&detailed=${Boolean(detailed)}`,
          method: 'GET',
          responseType: 'blob'
        }).then(response => {
          const fileURL = window.URL.createObjectURL(new Blob([response.data]))
          const fileLink = document.createElement('a')
          fileLink.href = fileURL
          fileLink.setAttribute('download', 'raport_pracy_' + month + '_' + year + '_' + '.pdf')
          document.body.appendChild(fileLink)
          fileLink.click()
          this.autoClose()
        })
      }
    },
    addRecordToWorkTimeArray (uuid, start, stop) {
      const arr = this.workTimeChangeArray
      const e = uuid + ';' + start + ';' + stop
      arr.push(e)
      this.workTimeChangeArray = arr
      this.message = 'dodano do listy zmian - pamiętaj by przed opuszczeniem strony wysłać zmiany'
      this.success = true
      this.autoClose()
    },
    acceptWorkingTime (acceptedList, pinCode) {
      fetch(`${this.local}/work/accept?uuidList=${acceptedList}&pinCode=${pinCode}`, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.acceptedList = []
              this.getAllWorkingTimeEvidenceInMonth(this.yearSelect1, this.monthSelect1)
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
    inputChangesToWorkTIme (list, code) {
      fetch(`${this.local}/work/?list=${list}&pinCode=${code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        this.showloading()
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.getAllWorkingTimeEvidenceInMonth(this.yearSelect1, this.monthSelect1)
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
    checkedAll (list, checked) {
      if (checked) {
        list.forEach(e => {
          e.wtedtoList.forEach(g => {
            if (!g.accepted) {
              this.acceptedList.push(g.uuid)
            }
          })
        })
      } else {
        list.forEach(e => {
          e.wtedtoList.forEach(() => {
            this.acceptedList = []
          })
        })
      }
    },
    checkLength (list) {
      let length = 0
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].wtedtoList.length; j++) {
          if (!list[i].wtedtoList[j].accepted) {
            length++
          }
        }
      }
      return length
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

<style scoped></style>
