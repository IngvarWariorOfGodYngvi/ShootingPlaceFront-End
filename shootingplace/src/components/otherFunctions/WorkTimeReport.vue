<template>
  <div class="col">
    <div>
      <q-select filled v-model="yearSelect1" fill-input @input="monthSelect1=null;getAllWorkingMonthInYear(yearSelect1)"
                :options="workingYear" dense label="Wybierz Rok">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Brak wyników
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select v-if="yearSelect1 != null" filled v-model="monthSelect1" use-input :options="month" dense
                label="Wybierz Miesiąc">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Brak wyników
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select v-if="monthSelect1 != null" filled v-model="workTypeSelect1" use-input :options="workType1" dense
                label="Wybierz Rodzaj">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Brak wyników
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <div>
        <q-btn @click="getAllWorkingTimeEvidenceInMonth(yearSelect1,monthSelect1,workTypeSelect1)">wyświetl listę
          pracy
        </q-btn>
      </div>
    </div>
    <div class="col">
      <div v-if="workList.length>0" class="row bg-secondary text-white">
        <div class="text-right self-center q-pl-md" style="width: 2vw">lp</div>
        <div class="col-2 text-center self-center">Start</div>
        <div class="col-2 text-center self-center">Stop</div>
        <div class="col-1 text-left self-center">Rodzaj Pracy</div>
        <div class="col-2 text-center self-center">Czas Pracy</div>
        <div class="col text-center self-center">Nadgodziny</div>
        <div class="col text-center self-center">Zamknięte automatycznie</div>
        <div class="col text-center self-center">
          <div>
            <div>Zatwierdzone</div>
            <div class="bg-primary">
              <q-checkbox v-model="checked" color="secondary" dark keep-color
                          :label="!checked ? 'zaznacz wyszystko' : 'odznacz wszystko'"
                          @input="checkedAll(workList,checked)"></q-checkbox>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(item1) in workList" :key="item1" class="q-pa-none text-black full-width">
          <div class="row">
            <q-expansion-item class="col bg-grey-5"
                              :label="item1.secondName + ' ' + item1.firstName + ' ' + item1.subType + ' czas pracy: ' + item1.workTime">
              <q-field :key="index" v-for="(item, index) in item1.wtedtoList" dense class="bg-grey-2" color="black"
                       standout="bg-accent text-black">
                <div class="row full-width" @dblclick="uuid = item.uuid; editWorkTime=true">
                  <div class="text-left self-center text-bold" style="width: 2vw" @dblclick="editWorkTime=true">
                    {{ index + 1 }}
                  </div>
                  <div class="col-2 text-center self-center">{{ item.start.replace('T', ' ').substring(0, 19) }}
                  </div>
                  <div class="col-2 text-center self-center">{{ item.stop.replace('T', ' ').substring(0, 19) }}
                  </div>
                  <div class="col-1 text-left self-center">{{ item.workType }}</div>
                  <div class="col-2 text-center self-center">{{ item.workTime }}</div>
                  <div class="col text-center self-center bg-primary text-white">{{ item.toClarify ? 'TAK' : '' }}</div>
                  <div class="col text-center self-center bg-primary text-white">{{ item.automatedClosed ? 'TAK' : '' }}
                  </div>
                  <div class="col text-center self-center bg-green">{{ item.accepted ? 'ZATWIERDZONO' : '' }}
                    <q-checkbox v-if="!item.accepted" v-model="acceptedList" :val="item.uuid" label="zatwierdź"
                                @input="c = checkLength(workList)"/>
                  </div>
                </div>
              </q-field>
            </q-expansion-item>
          </div>
      </div>
      <div class="row q-pt-md q-pb-md">
        <div class="col">
          <q-btn dense @click="changeWorkingTimeDial=true" :disable="workTimeChangeArray.length<1"
                 label="wprowadź zmiany"></q-btn>
        </div>
        <div class="reverse">
          <q-btn dense label="zatwierdź czas pracy" @click="acceptWorkingTimeDial=true"></q-btn>
        </div>
      </div>
    </div>
    <q-select class="col-3 q-pa-none" filled v-model="workTypeSelect" use-input :options="workType" dense
              label="Wybierz Rodzaj" @input="getAllUsers(workTypeSelect); uuid=null">
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Brak wyników
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <p></p>
    <q-select v-if="workTypeSelect!=null" class="col-3 q-pa-none" filled v-model="uuid" use-input :options="usersList"
              dense label="Wybierz osobę" option-disable="false"
              :option-label="(item) => item === null ? 'Null value' : item.firstName + ' ' +  item.secondName">
    </q-select>
    <p></p>
    <q-select v-if="workTypeSelect!=null" class="col-3 q-pa-none" filled v-model="monthSelect" use-input
              :options="month" dense label="Wybierz Miesiąc">
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Brak wyników
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <p></p>
    <q-item v-if="monthSelect!=null&& workTypeSelect!=null">
      <q-toggle v-model="detailed">szczegółowy</q-toggle>
    </q-item>
    <q-item v-if="monthSelect===null|| workTypeSelect===null" class="col-4 q-pa-none">
      <q-btn class="q-pa-none" disable color="primary" label="Pobierz raport czasu pracy"/>
    </q-item>
    <q-item v-else class="col-4 q-pa-none">
      <q-btn class="q-pa-none" color="primary" label="Pobierz raport czasu pracy"
             @click="showloading();getWorkTimeReport (monthSelect, uuid.uuid, workTypeSelect, detailed,false)"/>
    </q-item>
    <q-dialog v-model="editWorkTime">
      <q-card style="width: 45vw; max-width: 45vw">
        <q-card-section>
          <div class="q-pa-md">
            <div class="row">
              <q-date flat today-btn v-model="workTimeStart" mask="YYYY-MM-DD HH:mm" color="primary"
                      name="start pracy"/>
              <q-time flat now-btn v-model="workTimeStart" mask="YYYY-MM-DD HH:mm" color="primary"/>
            </div>
          </div>
          <q-item>
            <q-input v-model="workTimeStart" class="full-width" filled label="Start Pracy"></q-input>
          </q-item>
          <div class="q-pa-md">
            <div class="row">
              <q-date flat today-btn v-model="workTimeStop" mask="YYYY-MM-DD HH:mm" color="secondary"/>
              <q-time flat now-btn v-model="workTimeStop" mask="YYYY-MM-DD HH:mm" color="secondary"/>
            </div>
          </div>
          <q-item>
            <q-input v-model="workTimeStop" class="full-width" filled label="Stop Pracy"></q-input>
          </q-item>
          <q-item class="full-width">
            <q-btn class="full-width" label="usuń wpis" color="red"></q-btn>
          </q-item>
        </q-card-section>
        <q-card-actions>
          <div class="row full-width">
            <div class="col">
              <q-btn flat label="zamknij" color="primary" v-close-popup/>
            </div>
            <div class="reverse">
              <q-btn label="zapisz *" color="primary" v-close-popup
                     @click="addRecordToWorkTimeArray (uuid, workTimeStart, workTimeStop)"/>
            </div>
          </div>
          <q-badge>* zamiany zostaną wprowadzone dopiero po zatwierdzeniu</q-badge>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptWorkingTimeDial" persistent
              @keypress.enter="acceptWorkingTime (acceptedList,code);acceptWorkingTimeDial=false;code=null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
                     mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Dodaj" color="black" v-close-popup
                 @click="acceptWorkingTime (workTimeChangeArray,code);acceptWorkingTimeDial=false;code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="changeWorkingTimeDial" persistent
              @keypress.enter="inputChangesToWorkTIme (workTimeChangeArray,code)">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
                     mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Dodaj" color="black" v-close-popup
                 @click="inputChangesToWorkTIme (workTimeChangeArray,code)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="failure" position="top">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="success" position="top">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import App from 'src/App'

export default {
  name: 'WorkTimeReport.vue',
  created () {
    this.getWorkingType()
    this.getAllWorkingYear()
  },
  data () {
    return {
      uuid: '',
      c: 0,
      code: null,
      editWorkTime: false,
      month: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
      monthSelect: null,
      monthSelect1: null,
      yearSelect1: null,
      workType: ['Pracownik', 'Zarząd'],
      workType1: ['Pracownik', 'Zarząd'],
      workTypeSelect: null,
      workTypeSelect1: null,
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
    getWorkingType () {
      fetch('http://' + this.local + '/work/workType', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.workType = response
          this.workType1 = response
        })
    },
    getAllWorkingTimeEvidenceInMonth (year, month, workType) {
      fetch('http://' + this.local + '/work/month?year=' + year + '&month=' + month + '&workType=' + workType, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(response => {
            this.workList = response
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    getAllWorkingYear () {
      fetch('http://' + this.local + '/work/getAllWorkingYear', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.workingYear = response
        })
    },
    getAllWorkingMonthInYear (year) {
      fetch('http://' + this.local + '/work/getAllWorkingMonthInYear?year=' + year, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.month = response
        })
    },
    getWorkTimeReport (month, uuid, workType, detailed, incrementVersion) {
      if (workType === null) {
        workType = 'Pracownik'
      }
      if (month !== null) {
        axios({
          url: 'http://' + this.local + '/files/downloadWorkReport?month=' + month + '&uuid=' + uuid + '&workType=' + workType + '&detailed=' + Boolean(detailed) + '&incrementVersion=' + incrementVersion,
          method: 'GET',
          responseType: 'blob'
        }).then(response => {
          const fileURL = window.URL.createObjectURL(new Blob([response.data]))
          const fileLink = document.createElement('a')
          fileLink.href = fileURL
          fileLink.setAttribute('download', 'raport_pracy_' + month + '.pdf')
          document.body.appendChild(fileLink)
          fileLink.click()
          this.autoClose()
        })
      }
    },
    getAllUsers (type) {
      fetch('http://' + this.local + '/users/allUsers?type=' + type, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.usersList = response
        })
    },
    addRecordToWorkTimeArray (uuid, start, stop) {
      const arr = this.workTimeChangeArray
      const e = uuid + ';' + start + ';' + stop
      arr.push(e)
      this.workTimeChangeArray = arr
      console.log(e)
      console.log(this.workTimeChangeArray)
      this.message = 'dodano do listy zmian - pamiętaj by przed opuszczeniem strony wysłać zmiany'
      this.success = true
      this.autoClose()
    },
    acceptWorkingTime (acceptedList, pinCode) {
      fetch('http://' + this.local + '/work/accept?uuidList=' + acceptedList + '&pinCode=' + pinCode, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.workTimeChangeArray = []
              this.getAllWorkingTimeEvidenceInMonth(this.monthSelect1)
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
      fetch('http://' + this.local + '/work/?list=' + list + '&pinCode=' + code, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.acceptedList = []
              this.getAllWorkingTimeEvidenceInMonth(this.monthSelect1)
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
          e.wtedtoList.forEach(g => {
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

<style scoped>

</style>
