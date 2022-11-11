<template>
  <q-page padding>
    <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">USTAWIENIA {{respo}}</div>
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
        <q-item><q-input v-model="superUserFirstName" class="full-width" label="Nazwa Użytkownika" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled/></q-item>
        <q-item><q-input v-model="superUserSecondName" class="full-width" label="Nazwa Użytkownika" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled/></q-item>
        <q-item><q-input v-model="superUserCode" @paste.prevent @copy.prevent class="full-width" mask="####" label="Kod PIN" type="password" filled/></q-item>
        <q-item><q-input v-model="superUserCodeConfirm" @paste.prevent @copy.prevent class="full-width" mask="####" label="Powtórz kod PIN" type="password" filled/></q-item>
        <q-item><q-btn @click="createSuperUser()" label="Dodaj" color="secondary"/></q-item>
      </q-form>
      </q-card-section>
      <q-card-section class="col-6">
        <div class="q-pa-md">
            <div class="col q-pa-md text-bold text-h6">Super-Użytkownik :</div>
            <ol>
            <li v-for="(superUser,id) in superUsers" :key="id" class="col text-bold">
            <div class="row full-width flex-center bg-grey-3 q-ma-sm">
              <div class="col full-width" style="cursor: pointer;" @dblclick="uuid = superUser.uuid,inputBarCode=true">{{superUser.firstName}} {{superUser.secondName}}</div>
              <q-btn color="primary" class="col full-width" @click="uuid = superUser.uuid,getUserActions(uuid),userActions=true">wyświetl działania</q-btn>
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
      <q-item><q-input v-model="userFirstName" class="full-width" dense label="Imię" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled/></q-item>
      <q-item><q-input v-model="userSecondName" class="full-width" dense label="Nazwisko" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled/></q-item>
      <q-item><q-select class="full-width" filled v-model="userSubTypeSelect" use-input :options="userSubType" dense label="Wybierz Rodzaj">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Brak wyników
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select></q-item>
      <q-item><q-input v-model="userCode" @paste.prevent @copy.prevent class="full-width" dense mask="####" label="Kod PIN" type="password" filled/></q-item>
      <q-item><q-input v-model="userCodeConfirm" @paste.prevent @copy.prevent class="full-width" dense mask="####" label="Powtórz kod PIN" type="password" filled/></q-item>
      <q-item><q-btn @click="acceptCodeUser = true" label="Dodaj" color="secondary"/></q-item>
      </q-form>
      </q-card-section>
      <q-card-section class="col-6">
        <div class="q-pa-md">
            <div class="col q-pa-md text-bold text-h6">Użytkownicy :</div>
            <ol>
            <li v-for="(user,id) in users" :key="id" class="col text-bold">
            <div class="row full-width flex-center bg-grey-3 q-ma-sm">
              <div class="col full-width" style="cursor: pointer;" @dblclick="uuid = user.uuid,userSubTypeBarCodeSelect = user.subType,inputBarCode=true">{{user.firstName}} {{user.secondName}}</div>
              <q-btn color="primary" class=" col full-width" @click="uuid = user.uuid,getUserActions(uuid),userActions=true">wyświetl działania</q-btn>
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
        title="WPA KWP"
        icon="settings"
        :done="step > 5"
      >
      <div class="q-pa-md text-bold text-center text-h6">ADRES KWP WPA</div>
      <q-card class="row">
      <q-card-section class="bg-grey-2 col-3">
      <div class="col">
        <q-select v-if="!policeAddressError" class="q-pa-md" filled v-model="city" :options="cities" label="Miasto Wojewódzkie" @input="inputPoliceAddress(city)" />
        <q-checkbox @input="city = 'BRAK WYNIKÓW', policeCity=null,policeZipCode=null,policeStreet=null,policeStreetNumber=null" class="q-pa-md" v-model="policeAddressError" label="Brak mojego WPA lub błędny adres"></q-checkbox>
      </div>
      </q-card-section>
      <q-card-section v-if="!policeAddressError" class="bg-grey-2 col-9">
        <q-item class="q-pa-md">
          <q-field class="full-width" standout label="Adres WPA" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" >Komendant Wojewódzki Policji {{policeCity}}</div>
              <div class="self-center full-width no-outline" >Wydział Postępowań Administracyjnych</div>
              <div class="self-center full-width no-outline" >{{policeZipCode}}, {{ul_al}} {{policeStreet}} {{policeStreetNumber}}</div>
            </template>
          </q-field>
        </q-item>
      </q-card-section>
      <q-card-section v-else class="bg-grey-2 col-9">
        <q-item>
          <q-field class="full-width text-center" standout="bg-accent text-black" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline text-black text-center text-bold text-h6" >Wprowadź adres WPA</div>
            </template>
          </q-field>
         </q-item>
        <q-item>
          <q-field class="full-width" standout label="Nowy Adres WPA" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" >Komendant Wojewódzki Policji w {{policeCity}}</div>
              <div class="self-center full-width no-outline" >Wydział Postępowań Administracyjnych</div>
              <div class="self-center full-width no-outline" >{{policeZipCode}}, {{ul_al}} {{policeStreet}} {{policeStreetNumber}}</div>
            </template>
          </q-field>
        </q-item>
        <div>
          <q-item><q-input class="full-width" filled v-model="policeCity" label="Miasto" /></q-item>
          <q-item><q-input class="full-width" filled v-model="policeZipCode" placeholder="00-000" label="Kod Pocztowy" mask="##-###" /></q-item>
          <q-item><q-select label="Prefix" filled v-model="ul_al" :options="ulAl" class="col-2 bg-grey-5"></q-select><q-input class="full-width col" filled v-model="policeStreet" label="Ulica" /></q-item>
          <q-item><q-input class="full-width" filled v-model="policeStreetNumber" label="Numer Ulicy" /></q-item>
          <q-item><q-btn label="Dodaj" color="secondary"/></q-item>
        </div>
      </q-card-section>
      </q-card>
      </q-step>

      <template v-slot:navigation  >
        <q-stepper-navigation class="flex flex">
          <q-item><q-btn v-if="step < 5" @click="$refs.stepper.next()" color="primary" :label="step === 5 ? 'Przejdź do magazynu amunicji' : 'Przejdź Dalej'" /></q-item>
          <!-- <q-item><q-btn v-if="step == 5" color="primary" label="Przejdź do magazynu amunicji" /></q-item> -->
          <q-item><q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Wróć" /></q-item>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
  <div class="q-pa-md">
    <q-uploader multiple style="max-width: 400px" method="POST" :url="('http://' + local + '/files/upload')"
    label="Dodaj plik" accept=".jpg, image/*" @rejected="onRejected" field-name="file" @added="file_selected"/>
  </div>
  <div class="row full-width bg-grey-5">
    <div v-if="pageNumber<1" class="self-center text-center col-1"><q-btn icon="arrow_left" class="full-width text-black" color="grey" disable></q-btn></div>
      <div v-else class="self-center text-center col-1" @click="pageNumber=pageNumber-1,getAllFiles(pageNumber)"><q-btn icon="arrow_left" class="full-width text-black" color="white"></q-btn></div>
    <div class="self-center text-bold text-center col-10" >STRONA {{pageNumber+1}}</div>
      <div class="self-center text-center col-1" @click="pageNumber=pageNumber+1,getAllFiles(pageNumber)"><q-btn icon="arrow_right" class="full-width text-black" color="white"></q-btn></div>
      </div>
    <div class="row">
    <q-field color="black" class="self-center col full-width no-outline text-bold text-center" dense standout="bg-accent text-black" stack-label>
      <div class="col-4 self-center text-bold text-left">Nazwa pliku</div>
      <div class="col-1 self-center text-bold text-center">Data utworzenia</div>
      <div class="col-1 self-center text-bold text-center">Godzina utworzenia</div>
      <div class="col-1 self-center text-bold text-right">Rozmiar</div>
      <div class="col-2 self-center text-bold text-right">Typ</div>
      <div class="col-2 self-center text-right"><div>Pobierz plik</div></div>
    </q-field>
      </div>
    <q-virtual-scroll :items="files" dense visible class="full-width" style="height: 80vh;">
      <template v-slot="{ item, index }">
        <div :key="index" dense @click.left.ctrl="uuid=item.uuid,deleteConfirm=true">
          <q-field @click.left.ctrl="deleteConfirm=true" color="black" dense class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
            <q-tooltip v-if="item.type.includes('image')" :delay="750" @hide ="url = ''" @before-show ="getUrl (item.uuid)" anchor="center middle" self="center middle" transition-show="scale"
                transition-hide="scale" content-style="width: 30%; height: 70%"><q-img :src="url" spinner-color="white" style="height: 100%; width: 100%" /></q-tooltip>
            <div class="col-5 self-center text-bold text-justify">{{index+1}} {{item.name}}</div>
            <div class="col-1 self-center text-bold text-center">{{item.date}}</div>
            <div class="col-1 self-center text-bold text-center">{{item.time}}</div>
            <div class="col-1 self-center text-bold text-center">{{item.size}}</div>
            <div class="col-2 self-center text-bold text-center">{{item.type}}</div>
            <div class="col-2 q-pa-xs self-center text-center"><q-btn color="primary" dense @click="fileName = item.name,getFile (item.uuid)">pobierz plik</q-btn></div>
          </q-field>
        </div>
      </template>
    </q-virtual-scroll>
  <q-dialog v-model="inputBarCode" persistent>
      <q-card class="text-center">
        <q-card-section>
          <q-item class="flex-center text-h6 text-bold">Przypisywanie Karty</q-item>
          <q-item><q-input class="full-width" filled v-model="barCode" type="password" label="zeskanuj kartę tutaj" @input="getMasterCardCheck(barCode)"></q-input></q-item>
          <q-item><q-select class="full-width" filled v-model="userSubTypeBarCodeSelect" use-input :options="userSubType" dense label="Wybierz Rodzaj">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select></q-item>
          <q-checkbox style="display: none" v-model="master" dense disable></q-checkbox>
          <q-checkbox v-if="master==true" style="display: flex; font-size: 10px;" v-model="master" dense disable label="potrwierdzone przez Admina"></q-checkbox>
          <p></p>
          <q-btn v-close-popup @click="acceptCodeUser1=true">zatwierdź</q-btn>
          <q-btn v-close-popup @click="barCode=null, uuid = null,master=false">Anuluj</q-btn>
        </q-card-section>
      </q-card>
  </q-dialog>
    <q-dialog v-model="acceptCodeUser1" persistent @keypress.enter="checkPinCode (code, uuid),addNewCardToUser(barCode,uuid,userSubTypeBarCodeSelect,code),code=null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający1</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Dodaj" color="black" v-close-popup @click="checkPinCode (code, uuid),addNewCardToUser(barCode,uuid,userSubTypeBarCodeSelect,code),code=null" />
        </q-card-actions>
      </q-card>
  </q-dialog>
  <q-dialog v-model="userActions">
      <q-card class="text-center">
        <q-card-section>
          <div class="text-h6">Akcje użytkownika</div>
          <q-virtual-scroll :items="actions" dense visible class="full-width" style="height: 80vh;">
            <template v-slot="{ item, index }">
              <div class="row">
                <q-field filled color="black" class="col">{{index+1}} {{item.classNamePlusMethod}}</q-field>
                <q-field filled color="black" class="col">{{item.belongsTo}}</q-field>
                <q-field filled color="black" class="col">{{item.timeNow}} {{item.dayNow}}</q-field>
              </div>
            </template>
          </q-virtual-scroll>
        </q-card-section>
      </q-card>
  </q-dialog>
  <q-dialog :position="'top'" v-model="dataFail">
      <q-card class="bg-red-5 text-center">
        <q-card-section>
          <div class="text-h6">Coś poszło nie tak</div>
        </q-card-section>
      </q-card>
  </q-dialog>
<q-dialog :position="'top'" v-model="success" @keypress.enter="success=false">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{message}}</div>
        </q-card-section>

      </q-card>
</q-dialog>
    <q-dialog v-model="failure" :position="'top'" @keypress.enter="failure=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{message}}</div>
        </q-card-section>
      </q-card>
</q-dialog>
    <q-dialog v-model="deleteConfirm">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy na pewno usunąć plik?</div>
        </q-card-section>

        <q-card-section class="row">
          <q-btn class="col" v-close-popup color="red" @click="deleteFile(uuid),getAllFiles()">tak</q-btn>
          <q-btn class="col" v-close-popup>nie</q-btn>
        </q-card-section>
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
import App from 'src/App.vue'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      inputBarCode: false,
      userActions: false,
      actions: [],
      barCode: null,
      userSubType: ['Pracownik', 'Zarząd', 'Komisja Rewizyjna', 'Gość', 'Pracownik/Zarząd', 'Prezes/Zarząd'],
      userSubTypeSelect: null,
      userSubTypeBarCodeSelect: null,
      cities: ['Białystok', 'Bydgoszcz', 'Gdańsk', 'Gorzów Wielkopolski', 'Katowice', 'Kielce', 'Kraków', 'Lublin', 'Łódź', 'Olsztyn', 'Opole', 'Poznań', 'Rzeszów', 'Szczecin', 'Warszawa', 'Wrocław', 'BRAK WYNIKÓW'],
      ulAl: ['ul. ', 'al. '],
      ul_al: '',
      selected_file: '',
      step: 1,
      policeCity: '',
      policeZipCode: '',
      policeStreet: '',
      policeStreetNumber: '',
      policeAddressError: false,
      superUsers: [],
      users: [],
      acceptCodeUser: false,
      acceptCodeUser1: false,
      formData: null,
      code: null,
      respo: null,
      uuid: '',
      url: '',
      fileName: '',
      model: '',
      dataFail: false,
      city: null,
      superUserFirstName: null,
      superUserSecondName: null,
      superUserCode: null,
      superUserCodeConfirm: null,
      userFirstName: null,
      userSecondName: null,
      userCode: null,
      userCodeConfirm: null,
      message: null,
      failure: false,
      success: false,
      deleteConfirm: false,
      clubMessage: null,
      clubName: null,
      clubFullName: null,
      clubLicenseNumber: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubAddress: null,
      clubURL: null,
      clubs: [],
      files: [],
      pageNumber: 0,
      master: false,
      accept: false,
      local: App.host
    }
  },
  created () {
    this.getAllClubs()
    this.getAllSuperUsers()
    this.getAllUsers()
    this.getAllFiles(this.pageNumber)
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    file_selected (file) {
      this.selected_file = file[0]
    },
    getUserActions (uuid) {
      fetch('http://' + this.local + '/users/userActions?uuid=' + uuid, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.actions = response
        })
    },
    getAllFiles (pageNumber) {
      this.showloading()
      if (pageNumber < 0) { this.pageNumber = 0 }
      fetch('http://' + this.local + '/files/getAllFiles?page=' + pageNumber + '&size=100', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.files = response
        })
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
      fetch('http://' + this.local + '/users/superUserList/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.superUsers = response
        })
    },
    getAllUsers () {
      fetch('http://' + this.local + '/users/userList/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.users = response
        })
    },
    getMasterCardCheck (code) {
      if (code.length > 3) {
        fetch('http://' + this.local + '/barCode/?code=' + code, {
          method: 'GET'
        }).then(response => response.json())
          .then(response => {
            this.master = response
          })
      }
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    checkPinCode (code, uuid) {
      if (code.length > 3) {
        fetch('http://' + this.local + '/users/checkPinCode?pinCode=' + code + '&uuid=' + uuid, {
          method: 'GET'
        }).then(response => response.json())
          .then(response => {
            this.accept = response
          })
      }
    },
    addNewCardToUser (barCode, uuid, userSubType) {
      this.sleep(400).then(() => {
        if (barCode === null || barCode === '') {
          this.message = 'Nie podano numeru karty'
          this.failure = true
          return
        }
        const data = {
          barCode: barCode,
          isActive: true,
          belongsTo: uuid,
          subType: userSubType,
          isMaster: this.master
        }
        console.log('coś2')
        console.log(this.accept)
        if (this.accept) {
          fetch('http://' + this.local + '/barCode/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'Application/json' }
          }).then(response => {
            if (response.status === 200) {
              response.text().then(
                response => {
                  this.success = true
                  this.message = response
                }
              )
            }
            if (response.status === 400) {
              response.text().then(
                response => {
                  this.failure = true
                  this.message = response
                }
              )
            }
          })
        } else {
          this.failure = true
          this.message = 'Podano zły pin. Spróbuj ponownie'
        }
        this.autoClose()
      })
    },
    createSuperUser () {
      if (this.superUserCode !== this.superUserCodeConfirm && this.superUsers.length > 0) {
        this.message = 'Coś poszło nie tak'
        this.failure = true
      } else {
        fetch('http://' + this.local + '/users/createSuperUser?firstName=' + this.superUserFirstName + '&secondName=' + this.superUserSecondName + '&pinCode=' + this.superUserCode, {
          method: 'POST'
        }).then(response => {
          if (response.status === 201) {
            response.text().then(
              response => {
                this.message = response
                this.success = true
                this.getAllUsers()
              }
            )
          }
          if (response.status === 400) {
            response.text().then(
              response => {
                this.message = response
                this.failure = true
              }
            )
          }
          if (response.status === 403) {
            response.text().then(
              response => {
                this.message = response
                this.failure = true
              }
            )
          }
          if (response.status === 406) {
            response.text().then(
              response => {
                this.message = response
                this.failure = true
              }
            )
          }
          if (response.status === 409) {
            response.text().then(
              response => {
                this.message = response
                this.failure = true
              }
            )
          }
          this.autoClose()
        })
      }
    },
    createUser () {
      if (this.userCode !== this.userCodeConfirm) {
        this.message = 'Coś poszło nie tak'
        this.failure = true
      } else {
        fetch('http://' + this.local + '/users/createUser?firstName=' + this.userFirstName + '&secondName=' + this.userSecondName + '&subType=' + this.userSubTypeSelect + '&pinCode=' + this.userCode + '&superPinCode=' + this.code, {
          method: 'POST'
        }).then(response => {
          if (response.status === 201) {
            response.text().then(
              response => {
                this.message = response
                this.success = true
                this.getAllUsers()
              }
            )
          }
          if (response.status === 400) {
            response.text().then(
              response => {
                this.message = response
                this.failure = true
              }
            )
          }
          if (response.status === 403) {
            response.text().then(
              response => {
                this.message = response
                this.failure = true
              }
            )
          }
          if (response.status === 406) {
            response.text().then(
              response => {
                this.message = response
                this.failure = true
              }
            )
          }
          if (response.status === 409) {
            response.text().then(
              response => {
                this.message = response
                this.failure = true
              }
            )
          }
          this.autoClose()
        })
      }
    },
    createMotherClub () {
      if (this.clubs.length > 0) {
        this.clubMessage = 'Nie można dodać więcej macierzystego Klubu'
      } else {
        const data = {
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
    getFile (uuid) {
      axios({
        url: 'http://' + this.local + '/files/getFile?uuid=' + uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', this.fileName)
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    deleteFile (uuid) {
      fetch('http://' + this.local + '/files/deleteFile?uuid=' + uuid, {
        method: 'DELETE'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.showloading()
              this.message = response
              this.success = true
              this.getAllFiles()
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
    redirect () {
      window.location.href = 'http://localhost:8080/strzelnica/#/member'
    },
    getUrl (uuid) {
      axios({
        url: 'http://' + this.local + '/files/getFile?uuid=' + uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        this.url = fileURL
      })
    },
    onRejected () {
      this.dataFail = true
      this.autoClose()
    },
    autoClose () {
      setTimeout(() => {
        this.dataFail = false
        this.failure = false
        this.message = null
        this.success = false
        this.barCode = null
        this.code = null
        this.master = false
        this.acceptCodeUser1 = false
        this.accept = false
      }, 1500)
    },
    inputPoliceAddress (city) {
      if (city === 'Białystok') {
        this.policeCity = 'w Białymstoku'
        this.policeZipCode = '15-369'
        this.policeStreet = 'ul. Bema'
        this.policeStreetNumber = '4'
      }
      if (city === 'Bydgoszcz') {
        this.policeCity = 'w Bydgoszczy'
        this.policeZipCode = '85-090'
        this.policeStreet = 'al. Powstańców Wielkopolskich'
        this.policeStreetNumber = '7'
      }
      if (city === 'Gdańsk') {
        this.policeCity = 'w Gdańsku'
        this.policeZipCode = '80-298'
        this.policeStreet = 'ul. Harfowa'
        this.policeStreetNumber = '60'
      }
      if (city === 'Gorzów Wielkopolski') {
        this.policeCity = 'w Gorzowie Wielkopolskim'
        this.policeZipCode = '66-400'
        this.policeStreet = 'ul. Kwiatowa'
        this.policeStreetNumber = '10'
      }
      if (city === 'Katowice') {
        this.policeCity = 'w Katowicach'
        this.policeZipCode = '40-038'
        this.policeStreet = 'ul. Lompy'
        this.policeStreetNumber = '19'
      }
      if (city === 'Kielce') {
        this.policeCity = 'w Kielcach'
        this.policeZipCode = '25-366'
        this.policeStreet = 'ul. Śniadeckich'
        this.policeStreetNumber = '4'
      }
      if (city === 'Kraków') {
        this.policeCity = 'w Krakowie'
        this.policeZipCode = '31-571'
        this.policeStreet = 'ul. Mogilska'
        this.policeStreetNumber = '109'
      }
      if (city === 'Lublin') {
        this.policeCity = 'w Lublinie'
        this.policeZipCode = '20-213'
        this.policeStreet = 'ul. Gospodarcza'
        this.policeStreetNumber = '1b'
      }
      if (city === 'Łódź') {
        this.policeCity = 'w Łodzi'
        this.policeZipCode = '91-048'
        this.policeStreet = 'Lutomierska'
        this.policeStreetNumber = '108/112'
      }
      if (city === 'Olsztyn') {
        this.policeCity = 'w Olsztynie'
        this.policeZipCode = '10-049'
        this.policeStreet = 'ul. Wincentego Pstrowskiego'
        this.policeStreetNumber = '3'
      }
      if (city === 'Opole') {
        this.policeCity = 'w Opolu'
        this.policeZipCode = '46-020'
        this.policeStreet = 'ul. Powstańców Śląskich'
        this.policeStreetNumber = '20'
      }
      if (city === 'Poznań') {
        this.policeCity = 'w Poznaniu'
        this.policeZipCode = '60-844'
        this.policeStreet = 'ul. Kochanowskiego'
        this.policeStreetNumber = '2a'
      }
      if (city === 'Rzeszów') {
        this.policeCity = 'w Rzeszowie'
        this.policeZipCode = '35-036'
        this.policeStreet = 'ul. Dąbrowskiego'
        this.policeStreetNumber = '30'
      }
      if (city === 'Szczecin') {
        this.policeCity = 'w Szczecinie'
        this.policeZipCode = '71-710'
        this.policeStreet = 'ul. Bardzińska'
        this.policeStreetNumber = '1a'
      }
      if (city === 'Warszawa') {
        this.policeCity = 'w Warszawie'
        this.policeZipCode = '00-150'
        this.policeStreet = 'ul. Nowolipie'
        this.policeStreetNumber = '2'
      }
      if (city === 'Wrocław') {
        this.policeCity = 'we Wrocławiu'
        this.policeZipCode = '50-040'
        this.policeStreet = 'ul. Podwale'
        this.policeStreetNumber = '31/33'
      }
      if (city === 'BRAK WYNIKÓW') {
        this.policeCity = null
        this.policeZipCode = null
        this.policeStreet = null
        this.policeStreetNumber = null
      }
    }
  },
  name: 'settings'
}
</script>
