<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Pozostałe Funkcje</div>
        </q-item>
      </div>
      <q-card class="row">
        <q-card-section class="col">
      <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista osób spoza klubu</div>
          <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
            <ol>
        <li v-for="(others,id) in others" :key="id">
          <div class="row">
           <q-field class="col" label="Nazwisko" standout="bg-accent text-black" stack-label>
                    <div>
                        <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{others.secondName}} {{others.firstName}}</div>
                        <div class="self-center col full-width no-outline text-left text-black" tabindex="0"></div>
                    </div>
           </q-field>
           <q-field class="col" label="Klub" standout="bg-accent text-black" stack-label>
                    <div>
                      <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{others.club.name}}</div>
                    </div>
           </q-field>
           <q-field class="col" label="telefon" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline text-left text-black row" tabindex="0">{{others.phoneNumber}}</div>
                  </div>
           </q-field>
           <q-field class="col" label="email" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline text-left text-black row" tabindex="1">{{others.email}}</div>
                  </div>
           </q-field>
           <q-btn class="col-1" @click="othersID = others.id,alert=true">usuń</q-btn>
           <q-btn class="col-1" @click="othersID = others.id,otherPersonFirstName = others.firstName,otherPersonSecondName = others.secondName,otherPersonPhoneNumber = others.phoneNumber,otherPersonEmail = others.email,club = others.club.name,editOtherPerson=true">Edytuj</q-btn>
           </div>
           <p></p>
        </li>
        </ol>
           </q-scroll-area>
    </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista znanych klubów</div>
            <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
            <div v-for="(club,id) in clubs" :key="id">
              <div v-if="club.name!='BRAK'" class="row">
                <div @dblclick="clubInfoModel=club,clubInfo=true" class="col-2">
                  <q-field label="Klub" standout="bg-accent text-black" stack-label clickable>
                      <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{club.name}}</div>
                  </q-field>
                </div>
                <div class="col">
                  <a :href="club.url" target="_blank">
                    <q-field class="col" label="strona" standout="bg-accent text-black" stack-label>
                        <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{club.url}}</div>
                    </q-field>
                  </a>
                </div>
                <div class="col-4">
                  <q-field label="adres" standout="bg-accent text-black" stack-label>
                    <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{club.address}}</div>
                  </q-field>
                </div>
                  <q-btn class="col-2" @click="clubID = club.id,editClub=true">edytuj dane {{club.name}}</q-btn>
           </div>
            <p></p>
            </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista Konkurencji</div>
            <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
            <div v-for="(comp,uuid) in competitions" :key="uuid">
              <div v-if="comp.name!='BRAK'" class="col">
                <div class="row">
                  <q-field class="col" label="Konkurencja" standout="bg-accent text-black" stack-label clickable>
                      <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{comp.name}}</div>
                  </q-field>
                  <q-field class="col-2" label="Kolejność na listach" standout="bg-accent text-black" stack-label clickable>
                      <div class="self-center col full-width no-outline text-center text-black" tabindex="1">{{comp.ordering}}</div>
                  </q-field>
                  <q-btn class="col-4" @click="competition=comp,competitionInfo=true">edytuj dane {{comp.name}}</q-btn>
                </div>
           </div>
            <p></p>
            </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
        <q-card>
            <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold">Dodatkowe Funkcje</div>
              <q-item>
                <q-btn color="primary" label="pobierz listę wszystkich klubowiczów" @click="showloading (),getAllMembersList()"/>
              <q-radio v-model="tableCondition" :val="true">
                dorośli
              </q-radio>
              <q-radio v-model="tableCondition" :val="false">
                mołodzież
              </q-radio>
              </q-item>
              <p></p>
              <div class="row bg-red-4">
                <div class="q-pa-md col"><q-btn class="full-width full-height" color="primary" label="lista klubowiczów do zgłoszenia na policję" @click="showloading (),getAllMembersWithLicenseNotValidAndContributionNotValid()"/></div>
                <div class="q-pa-md col"><q-btn class="full-width full-height" color="primary" label="wyświetl listę numerów telefonów klubowiczów do zgłoszenia na policję" @click="showloading (),getMembersToPolicePhoneNumbers (),membersPhoneNumbers = true"/></div>
                <div class="q-pa-md col"><q-btn class="full-width full-height" color="primary" label="wyświetl listę email klubowiczów do zgłoszenia na policję" @click="showloading (),getMembersToPoliceEmails (),membersEmails = true"/></div>
              </div>
              <p></p>
              <div class="row bg-yellow-4">
                <div class="q-pa-md col"><q-btn class="full-width full-height" color="primary" label="lista klubowiczów do skreślenia" @click="showloading (),getAllMembersToErase ()"/></div>
                <div class="q-pa-md col"><q-btn class="full-width full-height" color="primary" label="wyświetl listę numerów telefonów klubowiczów do skreślenia" @click="showloading (),getMembersToErasePhoneNumbers(),membersPhoneNumbers = true"/></div>
                <div class="q-pa-md col"><q-btn class="full-width full-height" color="primary" label="wyświetl listę email klubowiczów do skreślenia" @click="showloading (),getMembersToEraseEmails (),membersEmails = true"/></div>
              </div>
              <p></p>
              <q-item class="q-pa-md">
                <q-btn color="primary" label="lista klubowiczów z aktualną licencją i bez składek" @click="showloading (),getAllMembersWithLicenseValidAndContributionNotValid()"/>
              </q-item>
              <q-item class="q-pa-md">
                <q-btn color="primary" label="lista klubowiczów skreślonych" @click="showloading (),getAllErasedMembers ()"/>
              </q-item>
              <div class="row">
                <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę numerów telefonów klubowiczów bez patentu" @click="showloading (),getMembersPhoneNumbersWithNoPatent (),membersPhoneNumbers = true"/></div>
                <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę email klubowiczów bez patentu" @click="showloading (),getMembersEmailsWithNoPatent (),membersEmails = true"/></div>
              </div>
              <div class="row">
                <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę numerów telefonów nieaktywnych klubowiczów" @click="showloading (),getMembersPhoneNumbersNoActive (),membersPhoneNumbers = true"/></div>
                <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę email nieaktywnych klubowiczów" @click="showloading (),getMembersEmailsNoActive (),membersEmails = true"/></div>
              </div>
              <div class="row">
                  <div class="q-pa-md"><q-btn color="primary" label="wyświetl listę numerów telefonów" @click="showloading (),getMembersPhoneNumbers (),membersPhoneNumbers = true"/></div>
                  <div class="q-pa-md"><q-btn color="primary" label="wyświetl listę email" @click="showloading (),getMembersEmails (),membersEmails = true"/></div>
              <q-radio v-model="condition" :val="true">
                dorośli
              </q-radio>
              <q-radio v-model="condition" :val="false">
                mołodzież
              </q-radio>
              </div>
              <!-- <div class="q-pa-md"><q-btn color="primary" label="mejla ślij" @click="sendMail ()"/></div> -->
            </q-card-section>
          </q-card>
    <q-dialog v-model="dataFail">
      <q-card>
        <q-card-section>
          <div class="text-h6">Coś poszło nie tak</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy na pewno usunąć? Zmiana będzie trwała.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="Usuń" color="primary" v-close-popup @click="deactivateOther()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editOtherPerson">
      <q-card>
        <q-card-section>
                <q-item><q-input v-model="otherPersonFirstName" class="full-width" filled label="Imię"></q-input></q-item>
                <q-item><q-input v-model="otherPersonSecondName" class="full-width" filled label="Nazwisko"></q-input></q-item>
                <q-item><q-input v-model="otherPersonPhoneNumber" type="tel" class="full-width" mask="### ### ###" filled label="Telefon"></q-input></q-item>
                <q-item><q-input v-model="otherPersonEmail" type="email" class="full-width" filled label="email"></q-input></q-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
          <q-btn flat label="edytuj" color="primary" v-close-popup @click="updateOtherPerson(othersID,otherPersonFirstName, otherPersonSecondName, otherPersonPhoneNumber,otherPersonEmail)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="doneAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Wykonano żądanie</div>
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
    <q-dialog v-model="clubInfo">
      <q-card>
        <q-card-section class="text-bold">
          <div class="text-h6">Informacje dodatkowe o klubie {{clubInfoModel.name}}</div>
        <div>ID : {{clubInfoModel.id}}</div>
        <div v-if="clubInfoModel.id == 1">Pełna nazwa : {{clubInfoModel.fullName}}</div>
        <div v-if="clubInfoModel.id == 1">Numer Licencji Klubowej : {{clubInfoModel.licenseNumber}}</div>
        <div>email : {{clubInfoModel.email}}</div>
        <div>telefon : {{clubInfoModel.phoneNumber}}</div>
        <div>adres : {{clubInfoModel.address}}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="competitionInfo">
      <q-card>
        <q-card-section class="text-bold">
          <div class="text-h6">{{competition.name}}</div>
        <div>ID: {{competition.uuid}}</div>
        <div>Dyscyplina: {{competition.discipline}}</div>
        <div>Ilość Strzałów: {{competition.numberOfShots}}</div>
        <div>Rodzaj: {{competition.type}}</div>
        <div class="row">Metoda Liczenia <div v-if="competition.countingMethod == 'NORMAL'">: Normalnie</div><div v-else>{{competition.countingMethod}}</div></div>
        <div>Numer Kolejności na Listach: {{competition.ordering}}</div>
        <q-field class="col-2 cursor-pointer" standout="bg-accent text-black" label="ZMIEŃ NUMER KOLEJNOŚCI NA LISTACH">
            <q-popup-edit :cover="false" @keypress.enter="compID=competition.uuid,updateOrderingCompetition()">
                <q-input v-model="orderNumber" input-class="text-center" dense autofocus stack-label label="zmień na inny numer" onkeypress="return (event.charCode > 47 && event.charCode < 58)" @keypress.enter="compID=competition.uuid,updateOrderingCompetition()"/>
                <div class="q-pa-xs">
                  <q-btn align="left" color="primary" label="Anuluj" v-close-popup></q-btn>
                  <q-btn align="right" color="primary" label="Zmień" v-close-popup @click="compID=competition.uuid,updateOrderingCompetition()"></q-btn>
                </div>
            </q-popup-edit>
        </q-field>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editClub">
      <q-card>
        <q-card-section>
          <div class="text-h6" style="min-width: 500px">Zmień dane klubu</div>
        </q-card-section>
        <q-card-section>
                <q-item><q-input v-model="clubName" class="full-width" filled label="Nazwa"></q-input></q-item>
                <q-item><q-input v-model="clubFullName" class="full-width" filled label="Pełna nazwa do dokumentów"></q-input></q-item>
                <q-item v-if="clubID == 1"><q-input v-model="clubLicenseNumber" class="full-width" filled label="Numer licencji Klubowej"></q-input></q-item>
                <q-item><q-input v-model="clubPhoneNumber" type="tel" class="full-width" mask="### ### ###" filled label="Telefon"></q-input></q-item>
                <q-item><q-input v-model="clubEmail" type="email" class="full-width" filled label="email"></q-input></q-item>
                <q-item><q-input v-model="clubAddress" type="address" class="full-width" filled label="Adres"></q-input></q-item>
                <q-item><q-input v-model="clubURL" type="url" class="full-width" filled label="Strona internetowa"></q-input></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="ok" color="primary" v-close-popup @click="updateClub()"/>
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

import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
import Vue from 'vue'
import axios from 'axios'
import App from 'src/App.vue'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      others: [],
      clubs: [],
      othersID: null,
      otherPerson: [],
      club: '',
      competitions: null,
      competition: [],
      copmID: null,
      competitionInfo: false,
      listDownload: false,
      orderNumber: null,
      clubID: null,
      clubName: null,
      clubFullName: null,
      clubLicenseNumber: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubAddress: null,
      clubURL: null,
      clubInfo: false,
      clubInfoModel: [],
      doneAlert: false,
      editClub: false,
      dataFail: false,
      alert: false,
      editOtherPerson: false,
      otherPersonFirstName: null,
      otherPersonSecondName: null,
      otherPersonPhoneNumber: null,
      otherPersonEmail: null,
      condition: true,
      tableCondition: true,
      emails: null,
      phoneNumbers: null,
      membersEmails: false,
      membersPhoneNumbers: false,
      memberName: null,
      memberUUID: null,
      nowDate: Date.now(),
      local: App.host
    }
  },
  created () {
    this.getOther()
    this.getAllClubs()
    this.getCompetitions()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    handleScroll (search) {
      const ele = document.getElementById(search)
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop - ele.scrollHeight
      const duration = 500
      setScrollPosition(target, offset, duration)
    },
    getOther () {
      fetch('http://' + this.local + '/other/all', {
        method: 'GET'
      }).then(response => response.json())
        .then(others => {
          this.others = others
        })
    },
    getAllClubs () {
      fetch('http://' + this.local + '/club/', {
        method: 'GET'
      }).then(response => response.json())
        .then(clubs => {
          this.clubs = clubs
        })
    },
    getMembersEmails () {
      fetch('http://' + this.local + '/member/membersEmails?condition=' + this.condition, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersPhoneNumbers () {
      fetch('http://' + this.local + '/member/phoneNumbers?condition=' + this.condition, {
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
    getMembersToEraseEmails () {
      fetch('http://' + this.local + '/member/membersToEraseEmails', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersToErasePhoneNumbers () {
      fetch('http://' + this.local + '/member/membersToErasePhoneNumbers', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.phoneNumbers = response
        })
    },
    getMembersToPoliceEmails () {
      fetch('http://' + this.local + '/member/membersToPoliceEmails', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersToPolicePhoneNumbers () {
      fetch('http://' + this.local + '/member/membersToPolicePhoneNumbers', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.phoneNumbers = response
        })
    },
    getCompetitions () {
      fetch('http://' + this.local + '/competition/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.competitions = response
        })
    },
    sendMail () {
      fetch('http://' + this.local + '/email/', {
        method: 'POST'
      }).then(response => response.json())
    },
    updateClub () {
      var data = {
        name: this.clubName,
        fullName: this.clubFullName,
        licenseNumber: this.clubLicenseNumber,
        phoneNumber: this.clubPhoneNumber,
        email: this.clubEmail,
        address: this.clubAddress,
        url: this.clubURL
      }
      fetch('http://' + this.local + '/club/' + this.clubID, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.doneAlert = true
          this.clubName = null
          this.clubFullName = null
          this.clubLicenseNumber = null
          this.clubEmail = null
          this.clubAddress = null
          this.clubURL = null
          this.getOther()
          this.getAllClubs()
          this.autoClose()
        } else {
          this.dataFail = true
          this.autoClose()
        }
      })
    },
    updateOrderingCompetition () {
      fetch('http://' + this.local + '/competition/ordering?uuid=' + this.compID + '&orderNumber=' + this.orderNumber, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.competition.ordering = this.orderNumber
          this.doneAlert = true
          this.orderNumber = null
          this.compID = null
          this.getCompetitions()
          this.autoClose()
        } else {
          this.dataFail = true
          this.autoClose()
        }
      })
    },
    updateOtherPerson (id, first, second, phone, mail) {
      var data = {
        firstName: first,
        secondName: second,
        phoneNumber: phone,
        email: mail
      }
      fetch('http://' + this.local + '/other/?id=' + id, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.getOther()
          this.doneAlert = true
          this.autoClose()
        } else {
          this.dataFail = true
          this.autoClose()
        }
      })
    },
    deactivateOther () {
      fetch('http://' + this.local + '/other/?id=' + this.othersID, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          this.doneAlert = true
          this.othersID = null
          this.getOther()
          this.getAllClubs()
          this.autoClose()
        } else {
          this.dataFail = true
          this.autoClose()
        }
      })
    },
    getAllMembersList () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembers/?condition=' + this.tableCondition,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_na_dzień ' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllMembersWithLicenseNotValidAndContributionNotValid () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersWithNoValidLicenseNoContribution/',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_z_licencją_bez_składek_' + this.nowDate + '.pdf')
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
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
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
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_do_skreślenia_' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllErasedMembers () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllErasedMembers',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
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
        this.doneAlert = false
        this.dataFail = false
        this.listDownload = false
      }, 2000)
    }
  },
  name: 'otherFunction'
}
</script>
