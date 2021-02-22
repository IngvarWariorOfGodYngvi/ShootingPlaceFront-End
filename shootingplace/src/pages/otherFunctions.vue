<template>
  <q-page padding>
      <q-card class="row">
        <q-card-section class="col">
    <div>
      <div class="self-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista osób spoza klubu</div>
          <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
        <div v-for="(others,id) in others" :key="id" class="row">
           <q-field class="col" label="Nazwisko" standout stack-label>
                <template v-slot:control>
                    <div>
                        <div class="self-center col full-width no-outline" tabindex="0">{{others.secondName}}</div>
                        <div class="self-center col full-width no-outline" tabindex="0">{{others.firstName}}</div>
                    </div>
                </template>
           </q-field>
           <q-field class="col" label="Klub" standout stack-label>
                <template v-slot:control>
                    <div>
                      <div class="self-center col full-width no-outline" tabindex="0">{{others.club.name}}</div>
                      <div class="self-center col full-width no-outline" tabindex="0">ID {{others.club.id}}</div>
                    </div>
                </template>
           </q-field>
           <q-field class="col" label="kontakt" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="0">{{others.phoneNumber}}</div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{others.email}}</div>
                  </div>
                </template>
           </q-field>
           <q-btn @click="othersID = others.id,alert=true">usuń</q-btn>
        </div>
           </q-scroll-area>
    </div>
    </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
            <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
          <div class="self-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista znanych klubów</div>
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
            <q-scroll-area class="q-pa-none" style="height: 600px;">
          <div class="self-center col full-width no-outline text-h5 text-bold" >Lista osób z licencjami NIEWAŻNYMI - ilość osób {{quantity[0]}}</div>
            <div v-for="member in members2" :key="member">
              <div class="row">
           <q-field class="col" label="osoba" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{member.secondName}} {{member.firstName}}</div>
                  </div>
                </template>
           </q-field>
           <q-field class="col-2" label="Numer Licencji" standout stack-label>
                <template v-slot:control>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{member.license.number}}</div>
                </template>
           </q-field>
           <q-field class="col-2" label="grupa" standout stack-label>
                <template v-slot:control>
                  <div v-if="member.adult" class="self-center col full-width no-outline row" tabindex="1">Grupa Powszechna</div>
                  <div v-if="!member.adult" class="self-center col full-width no-outline row" tabindex="1">Grupa Młodzieżowa</div>
                </template>
           </q-field>
           <q-field class="col-2" label="Ważność licencji" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{member.license.validThru}}</div>
                  </div>
                </template>
           </q-field>
           <q-btn color="grey-8" v-if="!member.license.paid" class="col-1" @click="memberName = member.firstName + member.secondName,memberUUID = member.uuid,paymentLicenseAlert = true">opłać licencję</q-btn>
           <q-btn color="primary" v-if="member.license.paid" class="col-1" @click="memberName = member.firstName + member.secondName ,licensePistolPermission = member.license.pistolPermission, licenseRiflePermission = member.license.riflePermission, licenseShotgunPermission = member.license.shotgunPermission,memberUUID = member.uuid, prolongLicenseAlert = true">przedłuż licencję</q-btn>
           </div>
           <q-item></q-item>
            </div>
            </q-scroll-area>
</q-card-section>
          </q-card>
          <q-card>
            <q-card-section>
            <q-scroll-area class=" q-pa-none" style="height: 600px;">
          <div class="self-center col full-width no-outline text-h5 text-bold" >Lista osób z licencjami AKTUALNYMI  - ilość osób {{quantity[1]}}</div>
            <div v-for="member in members" :key="member">
              <div class="row">
           <q-field class="col" label="osoba" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{member.secondName}} {{member.firstName}}</div>
                  </div>
                </template>
           </q-field>
           <q-field class="col-2" label="Numer Licencji" standout stack-label>
                <template v-slot:control>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{member.license.number}}</div>
                </template>
           </q-field>
           <q-field class="col-2" label="grupa" standout stack-label>
                <template v-slot:control>
                  <div v-if="member.adult" class="self-center col full-width no-outline row" tabindex="1">Grupa Powszechna</div>
                  <div v-if="!member.adult" class="self-center col full-width no-outline row" tabindex="1">Grupa Młodzieżowa</div>
                </template>
           </q-field>
           <q-field class="col-2" label="Ważność licencji" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{member.license.validThru}}</div>
                  </div>
                </template>
           </q-field>
           <q-btn color="grey-8" v-if="!member.license.paid" class="col-1" @click="memberName = member.firstName + member.secondName,memberUUID = member.uuid,paymentLicenseAlert = true">opłać licencję</q-btn>
           <q-btn color="primary" v-if="member.license.paid" class="col-1" @click="memberName = member.firstName + member.secondName ,licensePistolPermission = member.license.pistolPermission, licenseRiflePermission = member.license.riflePermission, licenseShotgunPermission = member.license.shotgunPermission,memberUUID = member.uuid, prolongLicenseAlert = true">przedłuż licencję</q-btn>
           </div>
           <q-item></q-item>
            </div>
            </q-scroll-area>
            </q-card-section>
          </q-card>
          <q-card>
            <q-card-section>
          <div class="self-center col full-width no-outline text-h5 text-bold" >Sekcja Magicznych Przycisków</div>
              <q-item>
                <q-btn color="primary" label="pobierz listę wszystkich klubowiczów" @click="getAllMembersList()"/>
              <q-radio v-model="tableCondition" :val="true">
                dorośli
              </q-radio>
              <q-radio v-model="tableCondition" :val="false">
                mołodzież
              </q-radio>
              </q-item>
              <q-item>
                <q-btn color="primary" label="pobierz listę klubowiczów do zgłoszenia na policję" @click="getAllMembersWithLicenseNotValidAndContributionNotValid()"/>
              </q-item>
              <q-item>
                <q-btn color="primary" label="pobierz listę klubowiczów z aktualną licencją i bez składek" @click="getAllMembersWithLicenseValidAndContributionNotValid()"/>
              </q-item>
              <q-item>
                <q-btn color="primary" label="pobierz listę klubowiczów do skreślenia" @click="getAllMembersToErase ()"/>
              </q-item>
              <q-item>
                <q-btn color="primary" label="wyświetl listę email" @click="getMembersEmails (),membersEmails = true"/>
              <q-radio v-model="condition" :val="true">
                dorośli
              </q-radio>
              <q-radio v-model="condition" :val="false">
                mołodzież
              </q-radio>
              </q-item>
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
    <q-dialog v-model="prolongFail">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można przedłużyć licencji - sprawdź składki</div>
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
    <q-dialog v-model="paymentLicenseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy opłacić licencję {{memberName}}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="Opłać" color="primary" v-close-popup @click="addLicenseHistoryPayment (memberUUID)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="prolongLicenseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy przedłużyć licencję {{memberName}}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="Przedłuż" color="primary" v-close-popup @click="prolongLicense (memberUUID, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="caliberAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano nowy rodzaj amunicji</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="ok" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="membersEmails">
      <q-card>
        <q-card-section>
          <div class="text-h6">Lista email wybranych klubowiczów</div>
        <div v-for="email in emails" :key="email">{{email}}</div>
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
                <q-item v-if="clubID == 1"><q-input v-model="clubLicenseNumber" class="full-width" filled label="Numer licencji Klubowej"></q-input></q-item>
                <q-item><q-input v-model="clubPhoneNumber" type="tel" class="full-width" mask="+48 ### ### ###" filled label="Telefon"></q-input></q-item>
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
      calibers: [],
      others: [],
      clubs: [],
      members: [],
      members2: [],
      quantity: [],
      othersID: null,
      clubID: null,
      clubName: null,
      clubLicenseNumber: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubAddress: null,
      clubURL: null,
      clubInfo: false,
      clubInfoModel: [],
      doneAlert: false,
      caliberAlert: false,
      editClub: false,
      dataFail: false,
      prolongFail: false,
      alert: false,
      condition: true,
      tableCondition: true,
      emails: null,
      membersEmails: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      prolongLicenseAlert: false,
      paymentLicenseAlert: false,
      memberName: null,
      memberUUID: null,
      nowDate: Date.now(),
      local1: 'localhost:8080/shootingplace',
      local: 'localhost:8080/shootingplace-1.0'
    }
  },
  created () {
    this.getListCalibers()
    this.getOther()
    this.getAllClubs()
    this.getMembersWithLicense()
    this.getMembersWithLicenseNotValid()
    this.getMembersWithLicenseQuantity()
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
    getListCalibers () {
      fetch('http://' + this.local + '/armory/calibers', {
        method: 'GET'
      }).then(response => response.json())
        .then(calibers => {
          this.calibers = calibers
        })
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
    getMembersWithLicense () {
      fetch('http://' + this.local + '/license/membersWithNotValidLicense', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.members2 = response
        })
    },
    getMembersWithLicenseNotValid () {
      fetch('http://' + this.local + '/license/membersWithValidLicense', {
        method: 'GET'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    getMembersWithLicenseQuantity () {
      fetch('http://' + this.local + '/license/membersQuantity', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.quantity = response
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
    updateClub () {
      var data = {
        name: this.clubName,
        licenseNumber: this.clubLicenseNumber,
        phoneNumber: this.clubPhoneNumber,
        eamil: this.clubEmail,
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
          this.getListCalibers()
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
          this.getListCalibers()
          this.getOther()
          this.getAllClubs()
        } else { this.dataFail = true }
      })
    },
    prolongLicense (uuid, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      var data = {
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission
      }
      fetch('http://' + this.local + '/license/' + uuid, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.doneAlert = true
          this.licensePistolPermission = false
          this.licenseRiflePermission = false
          this.licenseShotgunPermission = false
          this.getMembersWithLicense()
          this.getMembersWithLicenseNotValid()
        } else { this.prolongFail = true }
      })
    },
    addLicenseHistoryPayment (uuid) {
      fetch('http://' + this.local + '/license/history/' + uuid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.doneAlert = true
          this.getMembersWithLicense()
          this.getMembersWithLicenseNotValid()
        } else { this.prolongFail = true }
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
    }
  },
  name: 'otherFunction'
}
</script>
