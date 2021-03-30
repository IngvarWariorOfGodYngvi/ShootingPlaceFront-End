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
           <q-field class="col" label="Nazwisko" standout stack-label>
                <template v-slot:control>
                    <div>
                        <div class="self-center col full-width no-outline" tabindex="0">{{others.secondName}} {{others.firstName}}</div>
                        <div class="self-center col full-width no-outline" tabindex="0"></div>
                    </div>
                </template>
           </q-field>
           <q-field class="col" label="Klub" standout stack-label>
                <template v-slot:control>
                    <div>
                      <div class="self-center col full-width no-outline" tabindex="0">{{others.club.name}}</div>
                    </div>
                </template>
           </q-field>
           <q-field class="col" label="telefon" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="0">{{others.phoneNumber}}</div>
                  </div>
                </template>
           </q-field>
           <q-field class="col" label="email" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{others.email}}</div>
                  </div>
                </template>
           </q-field>
           <q-btn class="col-1" @click="othersID = others.id,alert=true">usuń</q-btn>
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
                <div  @click="clubInfoModel=club,clubInfo=true" class="col-3">
           <q-field label="Klub" standout stack-label clickable>
                <template v-slot:control>
                  <div v-if="club.id != 1" class="self-center col no-outline row" tabindex="1">{{club.name}}</div>
                  <div v-if="club.id == 1" class="self-center col no-outline row" tabindex="1">{{club.name}} {{club.licenseNumber}}</div>
                </template>
           </q-field>
           </div>
           <div class="col">
           <a :href="club.url" target="_blank">
           <q-field class="col" label="strona" standout stack-label>
                <template v-slot:control>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{club.url}}</div>
                </template>
           </q-field>
           </a>
           </div>
           <q-field class="col" label="adres" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{club.address}}</div>
                  </div>
                </template>
           </q-field>
           <q-btn class="col-2" @click="clubID = club.id,editClub=true">edytuj dane {{club.name}}</q-btn>
           </div>
            <p></p>
            </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
        <q-card>
            <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold">Sekcja Magicznych Przycisków</div>
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
                <div class="q-pa-md col"><q-btn color="primary" label="lista klubowiczów do zgłoszenia na policję" @click="showloading (),getAllMembersWithLicenseNotValidAndContributionNotValid()"/></div>
                <div class="q-pa-md col"><q-btn color="primary" label="wyświetl listę numerów telefonów klubowiczów do zgłoszenia na policję" @click="showloading (),getMembersToPolicePhoneNumbers (),membersPhoneNumbers = true"/></div>
                <div class="q-pa-md col"><q-btn color="primary" label="wyświetl listę email klubowiczów do zgłoszenia na policję" @click="showloading (),getMembersToPoliceEmails (),membersEmails = true"/></div>
              </div>
              <p></p>
              <div class="row bg-yellow-4">
                <div class="q-pa-md col"><q-btn class=" full-width" color="primary" label="lista klubowiczów do skreślenia z listy klubowiczów" @click="showloading (),getAllMembersToErase ()"/></div>
                <div class="q-pa-md col"><q-btn color="primary" label="wyświetl listę numerów telefonów klubowiczów do skreślenia" @click="showloading (),getMembersToErasePhoneNumbers(),membersPhoneNumbers = true"/></div>
                <div class="q-pa-md col"><q-btn color="primary" label="wyświetl listę email klubowiczów do skreślenia" @click="showloading (),getMembersToEraseEmails (),membersEmails = true"/></div>
              </div>
              <p></p>
              <q-item class="q-pa-md">
                <q-btn color="primary" label="lista klubowiczów z aktualną licencją i bez składek" @click="showloading (),getAllMembersWithLicenseValidAndContributionNotValid()"/>
              </q-item>
              <q-item class="q-pa-md">
                <q-btn color="primary" label="lista klubowiczów skreślonych" @click="showloading (),getAllErasedMembers ()"/>
              </q-item>
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
    <q-dialog v-model="doneAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Wykonano żądanie</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="ok" color="primary" v-close-popup/>
        </q-card-actions>
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
        <div>email : {{clubInfoModel.email}}</div>
        <div>telefon : {{clubInfoModel.phoneNumber}}</div>
        <div>adres : {{clubInfoModel.address}}</div>
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
  </q-page>
</template>

<script>

import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      others: [],
      clubs: [],
      othersID: null,
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
      condition: true,
      tableCondition: true,
      emails: null,
      phoneNumbers: null,
      membersEmails: false,
      membersPhoneNumbers: false,
      memberName: null,
      memberUUID: null,
      nowDate: Date.now(),
      local: 'localhost:8080/shootingplace',
      local1: 'localhost:8080/shootingplace-1.0'
    }
  },
  created () {
    this.getOther()
    this.getAllClubs()
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
        } else { this.dataFail = true }
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
        } else { this.dataFail = true }
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
      })
    }
  },
  name: 'otherFunction'
}
</script>
