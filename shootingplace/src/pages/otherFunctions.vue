<template>
  <q-page padding>
      <q-card bordered class="row">
          <q-card-section bordered class="col-4">
    <div>
      <div class="self-center col full-width no-outline text-h5 text-bold" tabindex="0"> Dodawanie nowego kalibru do bazy danych</div>
        <div v-for="(caliber,uuid) in calibers" :key="uuid">
            <q-item>{{caliber.name}}</q-item>
        </div>
    </div>
    <q-item><q-input v-model="caliberName" placeholder="Nowy kaliber" class="full-width" filled></q-input></q-item>
        <q-item><q-btn class="full-width" label="dodaj nowy kaliber" color="primary" @click="addNewCaliber()"></q-btn></q-item>
        </q-card-section>
        <q-card-section bordered class="col-8">
    <div>
      <div class="self-center col full-width no-outline text-h5 text-bold" tabindex="0">Usuwanie osób spoza klubu</div>
        <div v-for="(others,id) in others" :key="id" class="row">
           <q-field class="col" label="Imię i Nazwisko" standout stack-label>
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
           <q-btn label="usuń" color="primary" @click="othersID = others.id,alert=true"></q-btn>
        </div>
    </div>
    </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
          <div class="self-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista znanych klubów</div>
            <div v-for="(club,id) in clubs" :key="id" class="row">
           <q-field class="col-1" label="ID" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{club.id}}</div>
                  </div>
                </template>
           </q-field>
           <q-field class="col-3" label="Nazwa Klubu" standout stack-label>
                <template v-slot:control>
                  <div v-if="club.id != 1" class="self-center col full-width no-outline row" tabindex="1">{{club.name}}</div>
                  <div v-if="club.id == 1" class="self-center col full-width no-outline row" tabindex="1">{{club.name}} {{club.licenseNumber}}</div>
                </template>
           </q-field>
           <q-field class="col-2" label="Kontakt" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{club.email}}</div>
                  <div v-if="club.phoneNumber!=null" class="self-center col full-width no-outline row" tabindex="1">tel {{club.phoneNumber}}</div>
                  </div>
                </template>
           </q-field>
           <q-field class="col" label="strona" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{club.url}}</div>
                  <div class="self-center col full-width no-outline row" tabindex="1"><a :href="club.url"></a></div>
                  </div>
                </template>
           </q-field>
           <q-btn class="col-4" @click="clubID = club.id,editClub=true">edytuj dane {{club.name}}</q-btn>
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
          <q-btn flat label="Usuń" color="primary" v-close-popup @click="deleteOther()"/>
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
    <q-dialog v-model="editClub">
      <q-card>
        <q-card-section>
          <div class="text-h6" style="min-width: 500px">Zmień dane klubu</div>
        </q-card-section>
        <q-card-section>
                <q-item><q-input v-model="clubName" class="full-width" filled label="nazwa"></q-input></q-item>
                <q-item v-if="clubID == 1"><q-input v-model="clubLicenseNumber" class="full-width" filled label="Numer licencji Klubowej"></q-input></q-item>
                <q-item><q-input v-model="clubPhoneNumber" class="full-width" filled label="Telefon"></q-input></q-item>
                <q-item><q-input v-model="clubEmail" class="full-width" filled label="email"></q-input></q-item>
                <q-item><q-input v-model="clubAddress" class="full-width" filled label="Adres"></q-input></q-item>
                <q-item><q-input v-model="clubURL" class="full-width" filled label="Adres internetowy"></q-input></q-item>
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
      othersID: null,
      clubID: null,
      clubName: null,
      clubLicenseNumber: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubAddress: null,
      clubURL: null,
      doneAlert: false,
      caliberName: null,
      caliberAlert: false,
      editClub: false,
      dataFail: false,
      alert: false
    }
  },
  created () {
    this.getListCalibers()
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
    getListCalibers () {
      fetch('http://localhost:8080/shootingplace-1.0/ammoEvidence/calibers', {
        method: 'GET'
      }).then(response => response.json())
        .then(calibers => {
          this.calibers = calibers
        })
    },
    getOther () {
      fetch('http://localhost:8080/shootingplace-1.0/other/all', {
        method: 'GET'
      }).then(response => response.json())
        .then(others => {
          this.others = others
        })
    },
    getAllClubs () {
      fetch('http://localhost:8080/shootingplace-1.0/club/', {
        method: 'GET'
      }).then(response => response.json())
        .then(clubs => {
          this.clubs = clubs
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
      fetch('http://localhost:8080/shootingplace-1.0/club/' + this.clubID, {
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
    addNewCaliber () {
      fetch('http://localhost:8080/shootingplace-1.0/ammoEvidence/calibers?caliber=' + this.caliberName, {
        method: 'POST'
      }).then(response => {
        if (response.status === 201) {
          this.caliberAlert = true
          this.getListCalibers()
          this.getOther()
          this.getAllClubs()
        } else { this.dataFail = true }
      })
    },
    deleteOther () {
      fetch('http://localhost:8080/shootingplace-1.0/other/?id=' + this.othersID, {
        method: 'DELETE'
      }).then(response => {
        if (response.status === 200) {
          this.doneAlert = true
          this.othersID = null
        } else { this.dataFail = true }
      })
      this.getListCalibers()
      this.getOther()
      this.getAllClubs()
    }
  },
  name: 'otherFunction'
}
</script>
