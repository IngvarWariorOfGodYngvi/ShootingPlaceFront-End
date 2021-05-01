<template>
  <q-page padding>
    <!-- <div>
      <q-item>
        <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">USTAWIENIA</div>
      </q-item>
    </div>
    <q-card >
      <q-card-section>
          <div>tutaj będą wszelkie pliki do ponownego pobrania</div>
          <div>tutaj będą ustawienia w formie steppera</div>
          <div>muszą się tu znaleźć takie rzeczy jak : </div>
          <div class="q-pa-md">PIERWSZY SUPER-UŻYTKOWNIK</div>
          <div class="q-pa-md">
              <div>nazwa usera</div>
              <div>pinCode usera</div>
              <div>superuser = true</div>
          </div>
          <div class="q-pa-md">PRZYDZIELANIE NOWYCH UŻYTKOWNIKÓW</div>
          <div class="q-pa-md">
              <div>nazwa usera</div>
              <div>pinCode usera</div>
          </div>
          <div class="q-pa-md">KLUB</div>
          <div class="q-pa-md">
              <div>nazwa / adres / numer licencji / strona itd</div>
          </div>
          <div class="q-pa-md">SKŁADKI</div>
          <div class="q-pa-md">
            <div>ustawienie wysokości składki dla dorosłych</div>
            <div>ustawienie wysokości składki dla młodzieży</div>
            <div>ustawienie składek : miesięczna / 2-miesięczna / kwartalna / półroczna / roczna</div>
            <div>do kiedy są ważne</div>
          </div>
      </q-card-section>
    </q-card> -->
    <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">USTAWIENIA</div>
        </q-item>
      </div>
    <div>
    <q-stepper
      header-nav
      v-model="step"
      ref="stepper"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Tworzenie Super-Użytkownika"
        icon="settings"
        :done="step > 1"
      >
        <div class="q-pa-md text-bold text-center text-h6">TWORZENIE SUPER-UŻYTKOWNIKA</div>
      <q-card class="row">
      <q-card-section class="col-6 bg-grey-2">
      <q-form>
        <q-item><q-input v-model="superUserName" class="full-width" label="Nazwa Użytkownika" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled/></q-item>
        <q-item><q-input v-model="superUserCode" @paste.prevent @copy.prevent class="full-width" mask="####" label="Kod PIN" type="password" filled/></q-item>
        <q-item><q-input v-model="superUserCodeConfirm" @paste.prevent @copy.prevent class="full-width" mask="####" label="Powtórz kod PIN" type="password" filled/></q-item>
        <q-item><q-btn @click="createSuperUser()" label="Dodaj" color="secondary"/></q-item>
      </q-form>
      </q-card-section>
      <q-card-section class="col-6">
        <q-item v-if="superUserMessage!=null" class="bg-red-3"><div class="full-width text-bold text-center">{{superUserMessage}}</div></q-item>
        <div class="q-pa-md">
            <div class="col q-pa-md text-bold text-h6">Super-Użytkownik :</div>
            <ol class="bg-grey-3">
            <li v-for="(superUser,id) in superUsers" :key="id" class="col text-bold bg-grey-3">
            <div class="row full-width">
              <div class="col full-width">{{superUser}}</div>
              <q-btn color="primary" class="col full-width">usuń</q-btn>
            </div>
          </li>
          </ol>
        </div>
      </q-card-section>
      </q-card>
      </q-step>

      <q-step
        :name="2"
        title="Tworzenie Użytkowników"
        icon="settings"
        :done="step > 2"
      >
        <div class="q-pa-md text-bold text-center text-h6">TWORZENIE UŻYTKOWNIKÓW</div>
      <q-card class="row">
      <q-card-section class="col-6 bg-grey-2">
      <q-form>
      <q-item><q-input v-model="userName" class="full-width" label="Nazwa Użytkownika" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled/></q-item>
      <q-item><q-input v-model="userCode" @paste.prevent @copy.prevent class="full-width" mask="####" label="Kod PIN" type="password" filled/></q-item>
      <q-item><q-input v-model="userCodeConfirm" @paste.prevent @copy.prevent class="full-width" mask="####" label="Powtórz kod PIN" type="password" filled/></q-item>
      <q-item><q-btn @click="acceptCodeUser = true" label="Dodaj" color="secondary"/></q-item>
      </q-form>
      </q-card-section>
      <q-card-section class="col-6">
        <q-item v-if="userMessage!=null" class="bg-red-3"><div class="full-width text-bold text-center">{{userMessage}}</div></q-item>
        <div class="q-pa-md">
            <div class="col q-pa-md text-bold text-h6">Użytkownicy :</div>
            <ol class="bg-grey-3">
            <li v-for="(user,id) in users" :key="id" class="col text-bold bg-grey-3">
            <div class="row full-width">
              <div class="col full-width">{{user}}</div>
              <q-btn color="primary" class=" col full-width">usuń</q-btn>
            </div>
          </li>
          </ol>
        </div>
      </q-card-section>
      </q-card>
      </q-step>

      <q-step
        :name="3"
        title="Tworzenie Klubu Macierzystego"
        icon="settings"
        :done="step > 3"
      >
        <div class="q-pa-md text-bold text-center text-h6">TWORZENIE KLUBU MACIERZYSTEGO</div>
      <q-card class="row">
      <q-card-section class="col-6 bg-grey-2">
        <q-item><q-input v-model="clubName" class="full-width" filled label="Nazwa"></q-input></q-item>
        <q-item><q-input v-model="clubFullName" class="full-width" filled label="Pełna nazwa do dokumentów"></q-input></q-item>
        <q-item><q-input v-model="clubLicenseNumber" class="full-width" filled label="Numer licencji Klubowej"></q-input></q-item>
        <q-item><q-input v-model="clubPhoneNumber" type="tel" class="full-width" mask="### ### ###" filled label="Telefon"></q-input></q-item>
        <q-item><q-input v-model="clubEmail" type="email" class="full-width" filled label="email"></q-input></q-item>
        <q-item><q-input v-model="clubAddress" type="address" class="full-width" filled label="Adres"></q-input></q-item>
        <q-item><q-input v-model="clubURL" type="url" class="full-width" filled label="Strona internetowa"></q-input></q-item>
        <q-item><q-btn @click="createMotherClub ()" label="Dodaj" color="secondary"/></q-item>
      </q-card-section>
      <q-card-section class="col-6">
        <q-item id="club" v-if="clubMessage!=null"><div class="full-width text-bold text-center">{{clubMessage}}</div></q-item>
      </q-card-section>
      </q-card>
      </q-step>

      <q-step
        :name="4"
        title="Składki"
        icon="settings"
        :done="step > 4"
      >
      <q-card class="row">
      <q-card-section class="bg-grey-2 col-4">
        <q-item>składki grupy dorosłej</q-item>
        <q-item><q-radio> składka 1 miesiąc</q-radio></q-item>
        <q-item><q-radio> składka 2 miesiące</q-radio></q-item>
        <q-item><q-radio> składka 3 miesiące</q-radio></q-item>
        <q-item><q-radio> składka 6 miesięcy</q-radio></q-item>
        <q-item><q-radio> składka 12 miesięcy</q-radio></q-item>
      </q-card-section>
      <q-card-section class="bg-grey-2 col-4">
        <q-item>składki grupy młodzieżowej</q-item>
        <q-item><q-radio> składka 1 miesiąc</q-radio></q-item>
        <q-item><q-radio> składka 2 miesiące</q-radio></q-item>
        <q-item><q-radio> składka 3 miesiące</q-radio></q-item>
        <q-item><q-radio> składka 6 miesięcy</q-radio></q-item>
        <q-item><q-radio> składka 12 miesięcy</q-radio></q-item>
      </q-card-section>
      <q-card-section class="col-4">
        coś innego
      </q-card-section>
      </q-card>
      </q-step>

      <q-step
        :name="5"
        title="Najbliższe WPA"
        icon="settings"
        :done="step > 5"
      >
      <q-card class="row">
      <q-card-section class="bg-grey-2 col-6">
        <div>"Komendant Wojewódzki Policji w Łodzi Wydział Postępowań Administracyjnych 90-144 Łódź, ul. Sienkiewicza 26</div>
      </q-card-section>
      <q-card-section class="col-6">
      </q-card-section>
      </q-card>
      </q-step>

      <template v-slot:navigation  >
        <q-stepper-navigation class="flex flex">
          <q-item><q-btn v-if="step < 5" @click="$refs.stepper.next()" color="primary" :label="step === 5 ? 'Przejdź do magazynu amunicji' : 'Przejdź Dalej'" /></q-item>
          <q-item><q-btn v-if="step == 5" @click="redirect()" color="primary" label="Przejdź do magazynu amunicji" /></q-item>
          <q-item><q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Wróć" /></q-item>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
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
  <q-dialog v-model="acceptCodeUser" persistent @keypress.enter="createUser (),acceptCodeUser=false,code=null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Dodaj" color="black" v-close-popup @click="createUser (),acceptCodeUser=false,code=null" />
        </q-card-actions>
      </q-card>
  </q-dialog>
  </q-page>
</template>

<script>

import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      step: 1,
      superUsers: [],
      users: [],
      acceptCodeUser: false,
      code: null,
      dataFail: false,
      superUserName: null,
      superUserCode: null,
      superUserCodeConfirm: null,
      userName: null,
      userCode: null,
      userCodeConfirm: null,
      superUserMessage: null,
      userMessage: null,
      clubMessage: null,
      clubName: null,
      clubFullName: null,
      clubLicenseNumber: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubAddress: null,
      clubURL: null,
      clubs: [],
      local: 'localhost:8080/shootingplace',
      local1: 'localhost:8080/shootingplace-1.0'
    }
  },
  created () {
    this.getAllClubs()
    this.getAllSuperUsers()
    this.getAllUsers()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    getAllClubs () {
      fetch('http://' + this.local + '/club/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubs = response
        })
    },
    getAllSuperUsers () {
      fetch('http://' + this.local + '/settings/superUserList/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.superUsers = response
        })
    },
    getAllUsers () {
      fetch('http://' + this.local + '/settings/userList/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.users = response
        })
    },
    createSuperUser () {
      if (this.superUserCode !== this.superUserCodeConfirm && this.superUsers.length > 0) {
        this.superUserMessage = 'Coś poszło nie tak'
      } else {
        fetch('http://' + this.local + '/settings/createSuperUser?name=' + this.superUserName + '&pinCode=' + this.superUserCode, {
          method: 'POST'
        }).then(response => {
          if (response.status === 201) {
            response.json().then(
              response => {
                this.superUserMessage = response
                this.getAllSuperUsers()
              }
            )
          }
          if (response.status === 400) {
            response.json().then(
              response => {
                this.superUserMessage = response
              }
            )
          }
          if (response.status === 403) {
            response.json().then(
              response => {
                this.superUserMessage = response
              }
            )
          }
          if (response.status === 406) {
            response.json().then(
              response => {
                this.superUserMessage = response
              }
            )
          }
          if (response.status === 409) {
            response.json().then(
              response => {
                this.superUserMessage = response
              }
            )
          }
        })
      }
    },
    createUser () {
      if (this.userCode !== this.userCodeConfirm) {
        this.dataFail = true
      } else {
        fetch('http://' + this.local + '/settings/createUser?name=' + this.userName + '&pinCode=' + this.userCode + '&superPinCode=' + this.code, {
          method: 'POST'
        }).then(response => {
          if (response.status === 201) {
            response.json().then(
              response => {
                this.userMessage = response
                this.getAllUsers()
              }
            )
          }
          if (response.status === 400) {
            response.json().then(
              response => {
                this.userMessage = response
              }
            )
          }
          if (response.status === 403) {
            response.json().then(
              response => {
                this.userMessage = response
              }
            )
          }
          if (response.status === 406) {
            response.json().then(
              response => {
                this.userMessage = response
              }
            )
          }
          if (response.status === 409) {
            response.json().then(
              response => {
                this.userMessage = response
              }
            )
          }
        })
      }
    },
    createMotherClub () {
      if (this.clubs.length > 0) {
        this.clubMessage = 'Nie można dodać więcej macierzystego Klubu'
      } else {
        var data = {
          name: this.clubName,
          fullName: this.clubFullName,
          licenseNumber: this.clubLicenseNumber,
          phoneNumber: this.clubPhoneNumber,
          email: this.clubEmail,
          address: this.clubAddress,
          url: this.clubURL
        }
        fetch('http://' + this.local + '/settings/createMotherClub', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.status === 200) {
            this.clubMessage = 'Utworzono Klub Macierzysty'
          }
          if (response.status === 400) {
            this.clubMessage = 'Sprawdź poprawność wszystkich danych'
          }
        })
      }
    },
    redirect () {
      window.location.href = 'http://localhost:8080/strzelnica/#/member'
    }
  },
  name: 'settings'
}
</script>
