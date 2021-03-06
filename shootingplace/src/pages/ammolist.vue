<template>
  <q-page padding class="row">
    <q-card class="col-10">
      <div>
        <q-btn class="col-1" style="text-8" label="dodaj do listy" icon="book" @click="getOther(),addAmmo=true" ></q-btn>
      </div>
      <div class="text-h5 text-bold" v-if="ammoList.length < 1">
        <q-item>
          <q-item-section>
            Brak aktywnej listy amunicji
          </q-item-section>
        </q-item>
      </div>
    <div v-if="ammoList.length >= 1" class="col">
      <q-item class="col">
        <q-item-section class="text-h5 text-bold">
          Lista Amunicji {{ammoList[0].date}} numer {{ammoList[0].number}}
        </q-item-section>
      <q-item-section side top>
      <q-btn color="primary" label="Zamknij listę" @click="uuid=ammoList[0].uuid,showloading(),closeEvidence (),getAmmoData(),getCLosedEvidence()"/>
      </q-item-section>
      <q-item-section side top>
      <q-btn color="primary" label="Pobierz listę" @click=" date = ammoList[0].date,uuid=ammoList[0].uuid,showloading(),getAmmoListPDF(),getAmmoData(),getCLosedEvidence()"/>
      </q-item-section>
      </q-item>
      <div v-for="(ammoList, uuid) in ammoList" :key="uuid">
            <div v-for="(ammoInEvidenceEntityList,uuid) in ammoList.ammoInEvidenceEntityList" :key="uuid">
              <q-item>
                <q-item-label class="text-h6">
                  kaliber {{ammoInEvidenceEntityList.caliberName}}
                </q-item-label>
              </q-item>
                <div class="col">
                  <div class="row" v-for="(ammoUsedToEvidenceEntityList,uuid) in ammoInEvidenceEntityList.ammoUsedToEvidenceEntityList" :key="uuid">
                    <q-field color="black" class="col-10" standout label="osoba" stack-label>
                      <template v-slot:control>
                        <div class="row">{{ammoUsedToEvidenceEntityList.name}}</div>
                      </template>
                    </q-field>
                    <q-field class="col-2" standout label="ilość" stack-label>
                      <template v-slot:control>
                        <div class="row">{{ammoUsedToEvidenceEntityList.counter}}</div>
                      </template>
                    </q-field>
                  </div>
                  <div class="row reverse">
                    <q-field class="col-2 bg-grey-4" standout label="suma" stack-label>
                      <template v-slot:control>
                        <div>{{ammoInEvidenceEntityList.quantity}}</div>
                      </template>
                    </q-field>
                  </div>
                </div>
            </div>
      </div>
    </div>
    </q-card>
    <q-card class="col-2">
      <div>
        <q-item>
          <q-item-label class="text-h5 text-bold">
            Zamknięte listy
          </q-item-label>
        </q-item>
        <q-scroll-area style="height: 550px;">
        <div v-for="(ammoListClose,id) in ammoListClose" :key="id">
          <q-item>
            <q-btn class="col-6" :label="ammoListClose.date" @click="date = ammoListClose.date,uuid= ammoListClose.evidenceUUID,getAmmoListPDF()"></q-btn>
            <q-btn class="col-6" label="otwórz listę" @click="uuid= ammoListClose.evidenceUUID,openList=true"></q-btn>
          </q-item>
        </div>
        </q-scroll-area>
      </div>
    </q-card>
<q-dialog v-model="ammunitionListAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano listę {{date}}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="fail" @keypress.enter="fail=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Wystąpił jakiś problem</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="failArmory" @keypress.enter="failArmory=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można wydać amunicji - Sprawdź stan magazynu</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addAmmo">
  <div class="bg-white">
    <div class="row">
      <q-select class="col" filled v-model="memberName" use-input hide-selected fill-input input-debounce="0" :options="options" @input="otherName='0 0'" @filter="filterFn" label="Dodaj osobę z klubu">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Brak wyników
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select class="col" filled v-model="otherName" use-input hide-selected fill-input input-debounce="0" :options="options" @input="memberName='0 0'" @filter="filterOther" label="Dodaj osobę spoza klubu">
        <template v-slot:no-option>
          <q-btn class="full-width" color="primary" label="dodaj nową osobę" @click="addNewOtherPerson = true"/>
        </template>
      </q-select>
    </div>
    <div class="row">
    <div class="full-width">
        <q-radio v-model="caliberUUID" v-for="(calibers,uuid) in calibers" :key="uuid" :val="calibers.uuid">
          <q-field borderless style="full-width">
           <template v-slot:control>
            <div class="full-width">{{calibers.name}}</div>
           </template>
          </q-field>
        </q-radio>
    </div>
    </div>
    <div class="col">
    <q-input type="number" @keypress.enter="addMemberAndAmmoToCaliber()" filled class="full-width col" v-model="ammoQuantity" placeholder="Tylko cyfry" onkeypress="return (event.charCode > 44 && event.charCode < 58)" label="Ilość Amunicji"></q-input>
    <q-card-actions class="row" align="right">
    <q-item><q-btn class="full-width col" color="primary" label="zamknij" v-close-popup></q-btn></q-item>
    <q-item><q-btn class="full-width col" color="primary" label="wydaj amunicję" @click="addMemberAndAmmoToCaliber()"></q-btn></q-item>
    </q-card-actions>
    </div>
  </div>
</q-dialog>
    <q-dialog v-model="addNewOtherPerson">
      <q-card class="full-width">
        <q-card-section>
          <div class="text-h6">Dodawanie nowej osoby spoza klubu</div>
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="otherFirstName" label="Imię"/></q-item>
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="otherSecondName" label="Nazwisko"/></q-item>
          <q-item class="col"><q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubName" :val="'BRAK'" label="Brak klubu"></q-checkbox>
          <q-input v-if="clubName!='BRAK'" class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="clubName" label="Nazwa Klubu"/>
          </q-item>
          <q-item><q-input class="full-width" mask="### ### ###" filled v-model="otherPhoneNumber" label="Numer telefonu"/></q-item>
          <q-item><q-input class="full-width" filled v-model="otherEmail" label="e-mail"/></q-item>
          <q-item><q-btn label="Zapisz do bazy" v-close-popup @click="addOtherPerson()" color="primary"/></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Zamknij" color="primary" v-close-popup @click="otherFirstName=null,otherSecondName=null,clubName=''"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
        <q-dialog v-model="addOtherAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zapisano do bazy</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="openList" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input @keypress.enter="openEvidence(),openList=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="otwórz" color="black" v-close-popup @click="openEvidence()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="forbidden" @keypress.enter="forbidden=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Niewłaściwy kod. Spróbuj ponownie.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

const stringOptions = []
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      uuid: null,
      ammunitionListAlert: false,
      listDate: null,
      ammoList: [],
      ammoListClose: [],
      date: '',
      fail: false,
      openList: false,
      forbidden: false,
      code: null,
      failArmory: false,
      otherName: null,
      ammoAdded: false,
      addAmmo: false,
      filters: [],
      filtersOther: [],
      calibers: [],
      caliberUUID: null,
      memberName: '',
      addNewOtherPerson: false,
      ammoQuantity: null,
      otherFirstName: null,
      otherSecondName: null,
      otherPhoneNumber: '',
      otherEmail: '',
      clubName: '',
      addOtherAlert: false,
      permissionsOtherArbiterNumber: '',
      ordinal: '',
      permissionsOtherArbiterPermissionValidThru: '',
      options: stringOptions,
      local: 'localhost:8080/shootingplace',
      local1: 'localhost:8080/shootingplace-1.0'
    }
  },
  created () {
    this.getAmmoData()
    this.getCLosedEvidence()
    this.getListCalibers()
    this.getOther()
    this.getMembersNames()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    getAmmoData () {
      fetch('http://' + this.local + '/ammoEvidence/evidence?state=true', {
        method: 'GET'
      }).then(response => {
        response.json().then(ammoList => {
          this.ammoList = ammoList
        })
      })
    },
    getCLosedEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/closedEvidences', {
        method: 'GET'
      }).then(response => {
        response.json().then(ammoListClose => {
          this.ammoListClose = ammoListClose
        })
      })
    },
    closeEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/ammo?evidenceUUID=' + this.uuid, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          this.getAmmoData()
          this.getCLosedEvidence()
        } else { this.fail = true }
      })
    },
    openEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/ammoOpen?evidenceUUID=' + this.uuid + '&pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          this.code = null
          this.getAmmoData()
          this.getCLosedEvidence()
        } else { this.fail = true }
      })
    },
    getMembersNames () {
      fetch('http://' + this.local + '/member/getAllNames', {
        method: 'GET'
      }).then(response => response.json())
        .then(filters => {
          this.filters = filters
        })
    },
    getAmmoListPDF () {
      axios({
        url: 'http://' + this.local + '/files/downloadAmmunitionList/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        this.ammunitionListAlert = true
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_Rozliczenia_Amunicji_' + this.date + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    addMemberAndAmmoToCaliber () {
      const memberNameWord = this.memberName.split(' ')
      var legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      const otherNameWord = this.otherName.split(' ')
      var idNumber = otherNameWord.length
      const otherNameID = otherNameWord[idNumber - 1]
      fetch('http://' + this.local + '/ammoEvidence/ammo?caliberUUID=' + this.caliberUUID + '&legitimationNumber=' + memberNameUUID + '&counter=' + this.ammoQuantity + '&otherID=' + otherNameID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.getAmmoData()
          this.showloading()
        }
        if (response.status === 400) {
          this.fail = true
        }
        if (response.status === 406) { this.failArmory = true }
      }
      )
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
      fetch('http://' + this.local + '/other/', {
        method: 'GET'
      }).then(response => response.json())
        .then(filtersOther => {
          this.filtersOther = filtersOther
        })
    },
    addOtherPerson () {
      var person = {
        firstName: this.otherFirstName,
        secondName: this.otherSecondName,
        phoneNumber: this.otherPhoneNumber,
        email: this.otherEmail
      }
      fetch('http://' + this.local + '/other?club=' + this.clubName + '&arbiterClass=' + this.ordinal + '&arbiterNumber=' + this.permissionsOtherArbiterNumber + '&arbiterPermissionValidThru=' + this.permissionsOtherArbiterPermissionValidThru.replace(/\//gi, '-'), {
        method: 'POST',
        body: JSON.stringify(person),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 201) {
          this.addOtherAlert = true
          this.getOther()
        } else { this.fail = true }
      })
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filters.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filters.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterOther (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filtersOther.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filtersOther.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>
