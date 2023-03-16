<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold text-positive" >Pozostałe Funkcje</div>
        </q-item>
      </div>
      <q-expansion-item label="Lista osób spoza klubu" dense class="text-left text-h6 text-bold bg-grey-3 q-mb-md" group="list">
        <OtherList></OtherList>
      </q-expansion-item>
      <q-expansion-item label="Lista znanych klubów" dense class="text-left text-h6 text-bold bg-grey-3 q-mb-md" group="list">
        <Clubs></Clubs>
      </q-expansion-item>
      <q-expansion-item label="Lista Konkurencji" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <Competitions></Competitions>
      </q-expansion-item>
      <p></p>
    <div v-if="!access">
    <q-input dense input-class="text-positive" label-color="positive" color="positive" v-model="accessCode" label="Wprowadź kod" type="password" mask="####" @keypress.enter="getAccess(accessCode)" filled></q-input>
    <q-item dense>{{accessMessage}}</q-item>
      <q-btn color="primary" text-color="white" dense label="wprowadź" @click="getAccess(accessCode)"></q-btn>
    </div>
      <q-expansion-item v-if="access" label="Dodatkowe Funkcje" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2 text-positive bg-dark">
            <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold">Dodatkowe Funkcje</div>
          <div class="row">
            <q-select class="full-width text-h6"
                      options-dense :dark="darkSet()" filled fill-input
                      label-color="positive" color="positive" input-class="text-positive" popup-content-class="bg-dark text-positive" options-selected-class="bg-dark text-positive" :options-dark="darkSet()"
                      v-model="choose" :options="chooseSelect" @input="policeList=[];toEraseList=[]" label="Wybierz Opcję">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                      Brak wyników
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
              <div v-if="choose === chooseSelect[0]" class="q-pa-md">
                <div>
              <q-radio label="dorośli" v-model="tableCondition" :val="true"/>
              <q-radio label="młodzież" v-model="tableCondition" :val="false"/>
                </div>
                <q-btn color="primary" :label="tableCondition?'pobierz listę wszystkich klubowiczów dorosłych PDF':'pobierz listę wszystkich klubowiczów młodzieżowych PDF'" @click="showloading ();getAllMembersList()"/>
                <p></p>
                <q-btn color="green-3" text-color="black" :label="tableCondition?'pobierz listę wszystkich klubowiczów dorosłych XLSX':'pobierz listę wszystkich klubowiczów młodzieżowych XLSX'" @click="showloading ();getAllMembersListXLSXFile()"/>
                <p></p>
                <q-btn color="primary" label="wyświetl listę numerów telefonów" @click="showloading ();getMembersPhoneNumbers ();membersPhoneNumbers = true"/>
                <p></p>
                <q-btn color="primary" label="wyświetl listę email" @click="showloading ();getMembersEmails ();membersEmails = true"/>
              </div>
              <p></p>
              </div>
              <p></p>
              <div v-if="choose === chooseSelect[1]" class="row">
                <div class="row full-width">
                  <div class="q-pa-md col-6"><q-btn class="full-width" color="primary" label="wyświetl listę osób" @click="showloading ();getMembersToReportToThePolice()"/></div>
                  <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="pobierz listę .pdf" @click="showloading ();generateListOfMembersToReportToPolice()"/></div>
                </div>
                <div class="row full-width">
                  <div v-if="policeList.length>0" class="col-8">
                  <div class="row full-width">
                    <div class="col-1">Lp</div>
                    <div class="col-6">Nazwisko i Imię</div>
                    <div class="col text-center">Numer legitymacji</div>
                    <div class="col text-center">Numer licencji</div>
                    <div class="col text-center">Licencja ważna do</div>
                  </div>
                  <q-virtual-scroll :items="policeList" visible class="full-width q-pa-none">
                    <template v-slot="{ item, index }">
                      <div :key="index" class="row">
                        <div class="col-1">{{index+1}}</div>
                        <div class="col-6">{{item.secondName}} {{item.firstName}}</div>
                        <div class="col text-center">{{item.legitimationNumber}}</div>
                        <div class="col text-center">{{item.license.number}}</div>
                        <div class="col text-center">{{item.license.validThru}}</div>
                      </div>
                    </template>
                  </q-virtual-scroll>
                  </div>
                  <div v-if="policeList.length>0" class="col-4">
                    <div class="row full-width">
                      <div class="col-1"></div>
                      <div class="col">Numer Telefonu</div>
                      <div class="col">Email</div>
                    </div>
                    <q-virtual-scroll :items="policeList" visible class="full-width q-pa-none">
                      <template v-slot="{ item, index }">
                        <div :key="index" class="row">
                          <div class="col-1"></div>
                          <div class="col-4">{{item.phoneNumber}}</div>
                          <div class="col">{{item.email}}</div>
                        </div>
                      </template>
                    </q-virtual-scroll>
                  </div>
                </div>
              </div>
              <p></p>
              <div v-if="choose === chooseSelect[2]" class="row">
                <div class="row full-width">
                  <div class="q-pa-md col-6"><q-btn class="full-width" color="primary" label="wyświetl listę osób" @click="showloading ();getMembersToErase()"/></div>
                  <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="pobierz listę .pdf" @click="showloading ();getAllMembersToErase()"/></div>
                </div>
                <div class="row full-width">
                  <div v-if="toEraseList.length>0" class="col-8">
                  <div class="row full-width">
                    <div class="col-1">Lp</div>
                    <div class="col-6">Nazwisko i Imię</div>
                    <div class="col text-center">Numer legitymacji</div>
                    <div class="col text-center">Numer licencji</div>
                    <div class="col text-center">Licencja ważna do</div>
                  </div>
                  <q-virtual-scroll :items="toEraseList" visible class="full-width q-pa-none">
                    <template v-slot="{ item, index }">
                      <div :key="index" class="row">
                        <div class="col-1">{{index+1}}</div>
                        <div class="col-6">{{item.secondName}} {{item.firstName}}</div>
                        <div class="col text-center">{{item.legitimationNumber}}</div>
                        <div class="col text-center">{{item.license.number}}</div>
                        <div class="col text-center">{{item.license.validThru}}</div>
                      </div>
                    </template>
                  </q-virtual-scroll>
                  </div>
                  <div v-if="toEraseList.length>0" class="col-4">
                    <div class="row full-width">
                      <div class="col-1"></div>
                      <div class="col">Numer Telefonu</div>
                      <div class="col">Email</div>
                    </div>
                    <q-virtual-scroll :items="toEraseList" visible class="full-width q-pa-none">
                      <template v-slot="{ item, index }">
                        <div :key="index" class="row">
                          <div class="col-1"></div>
                          <div class="col-4">{{item.phoneNumber}}</div>
                          <div class="col">{{item.email}}</div>
                        </div>
                      </template>
                    </q-virtual-scroll>
                  </div>
                </div>
              </div>
              <div v-if="choose === chooseSelect[3]" class="row">
                <div class="row full-width">
                  <div class="q-pa-md col-6"><q-btn class="full-width" color="primary" label="wyświetl listę osób" @click="showloading ();getMembersErased()"/></div>
                  <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="pobierz listę .pdf" @click="showloading ();getErasedMembers ()"/></div>
                </div>
                <div class="row full-width">
                  <div v-if="erasedList.length>0" class="col-8">
                  <div class="row full-width">
                    <div class="col-1">Lp</div>
                    <div class="col-6">Nazwisko i Imię</div>
                    <div class="col text-center">Numer legitymacji</div>
                    <div class="col text-center">Data Usunięcia</div>
                    <div class="col text-center">Przyczyna</div>
                  </div>
                  <q-virtual-scroll :items="erasedList" visible class="full-width q-pa-none">
                    <template v-slot="{ item, index }">
                      <div :key="index" class="row">
                        <div class="col-1">{{index+1}}</div>
                        <div class="col-6">{{item.secondName}} {{item.firstName}}</div>
                        <div class="col text-center">{{item.legitimationNumber}}</div>
                        <div class="col text-center">{{item.erasedEntity.date}}</div>
                        <div class="col text-center">{{item.erasedEntity.erasedType}}</div>
                      </div>
                    </template>
                  </q-virtual-scroll>
                  </div>
                  <div v-if="erasedList.length>0" class="col-4">
                    <div class="row full-width">
                      <div class="col-1"></div>
                      <div class="col">Dodatkowy Opis</div>
                    </div>
                    <q-virtual-scroll :items="erasedList" visible class="full-width q-pa-none">
                      <template v-slot="{ item, index }">
                        <div :key="index" class="row">
                          <div class="col-1"></div>
                          <div class="col">{{item.erasedEntity.additionalDescription}}</div>
                        </div>
                      </template>
                    </q-virtual-scroll>
                  </div>
                </div>
              </div>
              <div v-if="choose === chooseSelect[4]" class="row">
                <div class="row full-width">
                 <div class="row">
                   <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę numerów telefonów klubowiczów bez patentu" @click="showloading ();getMembersPhoneNumbersWithNoPatent ();membersPhoneNumbers = true"/></div>
                   <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę email klubowiczów bez patentu" @click="showloading ();getMembersEmailsWithNoPatent ();membersEmails = true"/></div>
                 </div>
                </div>
              </div>
              <div v-if="choose === chooseSelect[5]" class="row">
                <div class="row full-width">
                  <div class="row">
                    <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę numerów telefonów nieaktywnych klubowiczów" @click="showloading ();getMembersPhoneNumbersNoActive ();membersPhoneNumbers = true"/></div>
                    <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę email nieaktywnych klubowiczów" @click="showloading ();getMembersEmailsNoActive ();membersEmails = true"/></div>
                  </div>
                </div>
              </div>
              <div v-if="choose === chooseSelect[6]" class="row">
                <div class="row full-width">
                  <div class="row">
                    <div class="q-pa-md col full-width"><q-btn color="primary" label="lista klubowiczów z aktualną licencją i bez składek" @click="showloading ();getAllMembersWithLicenseValidAndContributionNotValid()"/></div>
                  </div>
                </div>
              </div>
              <div v-if="choose === chooseSelect[7]" class="q-pa-md">
                <q-btn color="primary" label="pobierz listę obecności klubowiczów" @click="showloading ();getAllMembersListToElection()"/>
              </div>
              <div v-if="choose === chooseSelect[8]" class="q-pa-md">
                <JudgingReport></JudgingReport>
              </div>
              <div v-if="choose === chooseSelect[9]" class="q-pa-none row">
                <WorkTimeReport></WorkTimeReport>
            </div>
            <div v-if="choose === chooseSelect[10]" class="q-pa-md">
              <q-btn label="wyświetl książkę" @click="getRecordsFromBook(dateEvidence)"></q-btn>
              <div class="row text-bold">
                <div class="col-2">lp Nazwisko</div>
                <div class="col-2">Imię</div>
                <div class="col-3">Adres / Numer pozwolenia</div>
                <div class="col-2">zapoznanie się z regulaminem strzelnicy</div>
                <div class="col-3">podpis</div>
              </div>
              <q-virtual-scroll :items="evidenceBookList" visible class="q-pa-none text-black full-width">
                    <template v-slot="{ index, item }">
                    <div class="row">
                      <div class="col-2">{{index+1}} {{item.secondName}}</div>
                      <div class="col-2">{{item.firstName}}</div>
                      <div v-if="item.weaponPermission!=null" class="col-3">{{item.weaponPermission}}</div>
                      <div  v-else class="col-3">{{item.address}}</div>
                      <div v-if="item.statementOnReadingTheShootingPlaceRegulations" class="col-2">tak</div>
                      <div v-else class="col-2">nie</div>
                      <div class="col-3">{{item.imageUUID}} tutaj będzie podpis w formie obrazka</div>
                    </div>
                    </template>
              </q-virtual-scroll>
            </div>
            </q-card-section>
          </q-card>
      </q-expansion-item>
    <q-dialog v-model="failure">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{message}}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{message}}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="membersEmails">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Lista email wybranych klubowiczów</div>
        <div v-for="email in emails" :key="email">{{email}}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="membersPhoneNumbers">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Lista numerów telefonów wybranych klubowiczów</div>
        <div v-for="phone in phoneNumbers" :key="phone">{{phone}}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
<q-dialog position="top" v-model="listDownload">
  <q-card>
    <q-card-section class="col">
    <div class="self-center col full-width no-outline text-center text-h5 text-bold">Pobrano Listę</div>
  </q-card-section>
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
    })
  },
  data () {
    return {
      dateEvidence: this.createTodayDate(),
      code: null,
      toEraseList: [],
      erasedList: [],
      choose: null,
      chooseSelect: ['Listy Klubowiczów', 'Lista do zgłoszenia na Policję', 'Lista do skreślenia', 'Lista skreślonych', 'Osoby bez Patentu', 'Osoby nieaktywne', 'Lista Osób z Licencją i bez składek', 'Lista Obecności', 'Raport Sędziowania', 'Raport Czasu Pracy', 'Książka rejestru pobytu na strzelnicy'],
      access: false,
      accessCode: '',
      accessMessage: '',
      listDownload: false,
      policeList: [],
      evidenceBookList: [],
      condition: true,
      tableCondition: true,
      emails: null,
      phoneNumbers: null,
      membersEmails: false,
      membersPhoneNumbers: false,
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
      fetch('http://' + this.local + '/users/getAccess?pinCode=' + accessCode, {
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
    getRecordsFromBook (date) {
      fetch('http://' + this.local + '/evidence/?date=' + date, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.evidenceBookList = response
        })
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
    getMembersEmails () {
      fetch('http://' + this.local + '/member/membersEmails?condition=' + this.tableCondition, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersPhoneNumbers () {
      fetch('http://' + this.local + '/member/phoneNumbers?condition=' + this.tableCondition, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.phoneNumbers = response
        })
    },
    getMembersEmailsWithNoPatent () {
      fetch('http://' + this.local + '/member/membersEmailsNoPatent', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersPhoneNumbersWithNoPatent () {
      fetch('http://' + this.local + '/member/phoneNumbersNoPatent', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.phoneNumbers = response
        })
    },
    getMembersEmailsNoActive () {
      fetch('http://' + this.local + '/member/membersEmailsNoActive', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersPhoneNumbersNoActive () {
      fetch('http://' + this.local + '/member/phoneNumbersNoActive', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.phoneNumbers = response
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
