<template>
  <q-page padding>
    <q-expansion-item label="Lista osób spoza klubu" dense class="text-left text-h6 text-bold bg-grey-3 q-mb-md"
      group="list">
      <OtherList class="bg-dark text-positive text-body2"></OtherList>
    </q-expansion-item>
    <q-expansion-item label="Lista znanych klubów" dense class="text-left text-h6 text-bold bg-grey-3 q-mb-md"
      group="list">
      <Clubs class="bg-dark text-positive text-body2"></Clubs>
    </q-expansion-item>
    <q-expansion-item label="Lista Konkurencji" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <Competitions class="bg-dark text-positive text-body2"></Competitions>
    </q-expansion-item>
    <p></p>
    <div v-if="!access">
      <q-input dense input-class="text-positive" label-color="positive" color="positive" v-model="accessCode"
        label="Wprowadź kod" type="password" mask="####" @keypress.enter="getAccess(accessCode)" filled></q-input>
      <q-item dense>{{ accessMessage }}</q-item>
      <q-btn color="primary" text-color="white" dense label="wprowadź" @click="getAccess(accessCode)"></q-btn>
    </div>
    <q-expansion-item v-if="access" label="Dodatkowe Funkcje" dense class="text-left text-h6 text-bold bg-grey-3"
      group="list">
      <q-card class="text-body2 text-positive bg-dark">
        <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold">Dodatkowe Funkcje</div>
          <div class="row">
            <q-select class="full-width" dense options-dense :dark="darkSet()" filled fill-input
              label-color="positive" color="positive" input-class="text-positive"
              popup-content-class="bg-dark text-positive" options-selected-class="bg-dark text-positive"
              :options-dark="darkSet()" v-model="choose" :options="chooseSelect"
              @input="policeList = []; toEraseList = []" label="Wybierz Opcję">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Brak wyników
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <div v-if=" choose === chooseSelect[0] " class="q-pa-md">
              <div>
                <q-radio label="dorośli" v-model=" tableCondition " :val=" true " />
                <q-radio label="młodzież" v-model=" tableCondition " :val=" false " />
              </div>
              <q-btn color="primary"
                :label=" tableCondition ? 'pobierz listę wszystkich klubowiczów dorosłych PDF' : 'pobierz listę wszystkich klubowiczów młodzieżowych PDF' "
                @click=" showloading(); getAllMembersList() " />
              <p></p>
              <q-btn color="green-3" text-color="black"
                :label=" tableCondition ? 'pobierz listę wszystkich klubowiczów dorosłych XLSX' : 'pobierz listę wszystkich klubowiczów młodzieżowych XLSX' "
                @click=" showloading(); getAllMembersListXLSXFile() " />
            </div>
            <p></p>
          </div>
          <div v-if=" choose === chooseSelect[1] ">
            <div class="row full-width">
              <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="wyświetl listę osób"
                  @click=" showloading(); getMembersToReportToThePolice() " /></div>
              <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="pobierz listę .pdf"
                  @click=" showloading(); generateListOfMembersToReportToPolice() " /></div>
            </div>
            <div v-if=" policeList.length > 0 ">
              <div class="row full-width">
                <div class="q-pr-xs">Lp</div>
                <div class="col">Nazwisko i Imię</div>
                <div class="col-1 text-center">Numer legitymacji</div>
                <div class="col-1 text-center">Numer licencji</div>
                <div class="col-2 text-center">Licencja ważna do</div>
                <div class="col-2">Numer Telefonu</div>
                <div class="col-3">Email</div>
              </div>
              <q-virtual-scroll :items=" policeList " visible class="full-width q-pa-none">
                <template v-slot=" { item, index } ">
                  <div :key=" index " class="row">
                    <div class="q-pr-xs">{{index+1}}</div>
                    <div class="col">{{item.secondName}} {{item.firstName}}</div>
                    <div class="col-1 text-center">{{item.legitimationNumber}}</div>
                    <div class="col-1 text-center">{{item.license.number}}</div>
                    <div class="col-2 text-center">{{item.license.validThru}}</div>
                    <div class="col-2">{{item.phoneNumber}}</div>
                    <div class="col-3">{{item.email}}</div>
                  </div>
                </template>
              </q-virtual-scroll>
            </div>
          </div>
          <div v-if=" choose === chooseSelect[2] ">
            <div class="row full-width">
              <div class="q-pa-md col-6"><q-btn class="full-width" color="primary" label="wyświetl listę osób"
                  @click=" showloading(); getMembersToErase() " /></div>
              <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="pobierz listę .pdf"
                  @click=" showloading(); getAllMembersToErase() " /></div>
            </div>
              <div v-if=" toEraseList.length > 0 ">
                <div class="row full-width">
                <div class="q-pr-xs">Lp</div>
                <div class="col">Nazwisko i Imię</div>
                <div class="col-1 text-center">Numer legitymacji</div>
                <div class="col-1 text-center">Numer licencji</div>
                <div class="col-2 text-center">Licencja ważna do</div>
                <div class="col-2">Numer Telefonu</div>
                <div class="col-3">Email</div>
              </div>
                <q-virtual-scroll :items=" toEraseList " visible class="full-width q-pa-none">
                  <template v-slot=" { item, index } ">
                  <div :key=" index " class="row hover1" @dblclick="legitimationNumber= item.legitimationNumber; memberDial=true">
                    <div class="q-pr-xs">{{index+1}}</div>
                    <div class="col">{{item.secondName}} {{item.firstName}}</div>
                    <div class="col-1 text-center">{{item.legitimationNumber}}</div>
                    <div class="col-1 text-center">{{item.license.number}}</div>
                    <div class="col-2 text-center">{{item.license.validThru}}</div>
                    <div class="col-2">{{item.phoneNumber}}</div>
                    <div class="col-3">{{item.email}}</div>
                  </div>
                </template>
                </q-virtual-scroll>
              </div>
          </div>
          <div v-if=" choose === chooseSelect[3] " class="row">
            <div class="row full-width">
              <div class="q-pa-md col-6"><q-btn class="full-width" color="primary" label="wyświetl listę osób"
                  @click=" showloading(); getMembersErased() " /></div>
              <div class="q-pa-md col"><q-btn class="full-width" color="primary"  label="pobierz listę .pdf"
                  @click=" showloading(); getErasedMembers() " /></div>
            </div>
            <div class="row full-width">
              <div v-if=" erasedList.length > 0 " class="col-8">
                <div class="row full-width">
                  <div class="col-1">Lp</div>
                  <div class="col-6">Nazwisko i Imię</div>
                  <div class="col text-center">Numer legitymacji</div>
                  <div class="col text-center">Data Usunięcia</div>
                  <div class="col text-center">Przyczyna</div>
                </div>
                <q-virtual-scroll :items=" erasedList " visible class="full-width q-pa-none">
                  <template v-slot=" { item, index } ">
                    <div :key=" index " class="row">
                      <div class="col-1">{{index+1}}</div>
                      <div class="col-6">{{item.secondName}} {{item.firstName}}</div>
                      <div class="col text-center">{{item.legitimationNumber}}</div>
                      <div class="col text-center">{{item.erasedEntity.date}}</div>
                      <div class="col text-center">{{item.erasedEntity.erasedType}}</div>
                    </div>
                  </template>
                </q-virtual-scroll>
              </div>
              <div v-if=" erasedList.length > 0 " class="col-4">
                <div class="row full-width">
                  <div class="col-1"></div>
                  <div class="col">Dodatkowy Opis</div>
                </div>
                <q-virtual-scroll :items=" erasedList " visible class="full-width q-pa-none">
                  <template v-slot=" { item, index } ">
                    <div :key=" index " class="row">
                      <div class="col-1"></div>
                      <div class="col">{{item.erasedEntity.additionalDescription}}</div>
                    </div>
                  </template>
                </q-virtual-scroll>
              </div>
            </div>
          </div>
          <div v-if=" choose === chooseSelect[4] " class="row">
            <div class="row full-width">
              <div class="row">
                <div class="q-pa-md col full-width"><q-btn color="primary"
                    label="lista klubowiczów z aktualną licencją i bez składek"
                    @click=" showloading(); getAllMembersWithLicenseValidAndContributionNotValid() " /></div>
              </div>
            </div>
          </div>
          <div v-if=" choose === chooseSelect[5] " class="q-pa-md">
            <q-btn color="primary" label="pobierz listę obecności klubowiczów"
              @click=" showloading(); getAllMembersListToElection() " />
          </div>
          <div v-if=" choose === chooseSelect[6] " class="q-pa-md">
            <JudgingReport></JudgingReport>
          </div>
          <div v-if=" choose === chooseSelect[7] " class="q-pa-none row">
            <WorkTimeReport></WorkTimeReport>
          </div>
          <div v-if=" choose === chooseSelect[8] " class="q-pa-md">
            <EvidenceBook></EvidenceBook>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-dialog position="standard" v-model=" failure ">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if=" message != null " class="text-h6">{{message}}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model=" success ">
      <q-card>
        <q-card-section>
          <div v-if=" message != null " class="text-h6">{{message}}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model=" listDownload ">
      <q-card>
        <q-card-section class="col">
          <div class="self-center col full-width no-outline text-center text-h5 text-bold">Pobrano Listę</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="memberDial" style="min-width: 80vw">
    <q-card style="min-width: 80vw" class="bg-dark">
      <q-card-section class="flex-center">
        <Member :member-number-legitimation="legitimationNumber"></Member>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="zamknij" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
  </q-page>
</template>

<script>
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import axios from 'axios'
import App from 'src/App.vue'
export default {
  components: {
    OtherList: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/OthersList.vue'),
      loading: SkeletonBox
    }),
    Clubs: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/Clubs.vue'),
      loading: SkeletonBox
    }),
    Competitions: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/Competitions.vue'),
      loading: SkeletonBox
    }),
    WorkTimeReport: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/WorkTimeReport.vue'),
      loading: SkeletonBox
    }),
    JudgingReport: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/JudgingReport.vue'),
      loading: SkeletonBox
    }),
    EvidenceBook: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/EvidenceBook.vue'),
      loading: SkeletonBox
    }),
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      memberDial: false,
      legitimationNumber: null,
      dateEvidence: this.createTodayDate(),
      code: null,
      toEraseList: [],
      erasedList: [],
      choose: null,
      chooseSelect: ['Listy Klubowiczów', 'Lista do zgłoszenia na Policję', 'Lista do skreślenia', 'Lista skreślonych', 'Lista Osób z Licencją i bez składek', 'Lista Obecności', 'Raport Sędziowania', 'Raport Czasu Pracy', 'Książka rejestru pobytu na strzelnicy'],
      access: false,
      accessCode: '',
      accessMessage: '',
      listDownload: false,
      policeList: [],
      condition: true,
      tableCondition: true,
      evidenceBookList: [],
      success: false,
      failure: false,
      message: null,
      nowDate: Date.now(),
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
        day = '0' + (date.getDate() + 1)
      } else {
        day = (date.getDate())
      }
      return date.getFullYear() + '-' + month + '-' + day
    },
    getAccess (accessCode) {
      fetch(`http://${this.local}/users/getAccess?pinCode=${accessCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.accessMessage = response
              this.access = true
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.accessMessage = response
            }
          )
        }
      }
      )
    },
    getMembersToReportToThePolice () {
      fetch('http://' + this.local + '/member/getMembersToReportToThePolice', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.policeList = response
        })
    },
    getMembersToErase () {
      fetch('http://' + this.local + '/member/getMembersToErase', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.toEraseList = response
        })
    },
    getMembersErased () {
      fetch('http://' + this.local + '/member/erased', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.erasedList = response
        })
    },
    getAllMembersList () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembers/?condition=' + this.tableCondition,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_na_dzień ' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllMembersListXLSXFile () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersXLSXFile/?condition=' + this.tableCondition,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_na_dzień ' + this.nowDate + '.xlsx')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllMembersListToElection () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersToElection',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_obecności_klubowiczów.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    generateListOfMembersToReportToPolice () {
      axios({
        url: 'http://' + this.local + '/files/generateListOfMembersToReportToPolice',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_do_zgłoszenia_na_policję.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllMembersWithLicenseValidAndContributionNotValid () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersWithValidLicenseNoContribution/',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_z_licencją_bez_składek_' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllMembersToErase () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersToErased/',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_do_skreślenia_' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getErasedMembers () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllErasedMembers',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_skreślonych_' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.message = null
        this.listDownload = false
        this.acceptWorkingTimeDial = false
        this.changeWorkingTimeDial = false
        this.code = null
      }, 2000)
    }
  },
  name: 'otherFunction'
}
</script>
