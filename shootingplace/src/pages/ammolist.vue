<template>
  <q-page padding >
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Lista Amunicyjna</div>
        </q-item>
      </div>
      <div class="row">
    <q-card class="col-10">
      <div class="row">
        <div class="col-3">
          <q-btn class="col-1 full-width full-height" style="text-8" label="dodaj do listy" icon="book" @click="getOther(),addAmmo=true" ></q-btn>
        </div>
        <div v-if="ammoList.length >= 1 && ammoList[0].forceOpen==true" class="col-9">
          <div class=" q-pa-md bg-red-3 text-center text-bold">UWAGA! LISTA OTWARTA PONOWNIE. NA KONIEC DNIA PAMIĘTAJ O JEJ ZAMKNIĘCIU!</div>
        </div>
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
      <q-btn color="primary" label="Zamknij listę" @click="uuid=ammoList[0].uuid,confirmation=true"/>
      </q-item-section>
      <q-item-section side top>
      <q-btn color="primary" label="Pobierz listę" @click="date=ammoList[0].date,uuid=ammoList[0].uuid,showloading(),getAmmoListPDF(),getAmmoData(),getCLosedEvidence()"/>
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
                    <q-field color="black" class="col-10" standout="bg-accent text-black" label="osoba" stack-label>
                        <div class="row text-black">{{ammoUsedToEvidenceEntityList.name}}</div>
                    </q-field>
                    <q-field class="col-2" standout="bg-accent text-black" label="ilość" stack-label>
                        <div class="row text-black">{{ammoUsedToEvidenceEntityList.counter}}</div>
                    </q-field>
                  </div>
                  <div class="row reverse">
                    <q-field class="col-2 bg-grey-4" standout="bg-accent text-black" label="suma" stack-label>
                        <div class="text-black">{{ammoInEvidenceEntityList.quantity}}</div>
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
            <q-btn class="col full-width full-height" @click="date = ammoListClose.date,ammunitionListNumber = ammoListClose.number,uuid= ammoListClose.evidenceUUID,getEvidence(),ammunitionListInfo=true">
              <div>{{ammoListClose.number}}</div>
              <div>{{ammoListClose.date}}</div>
              </q-btn>
          </q-item>
        </div>
        </q-scroll-area>
      </div>
    </q-card>
    </div>
<q-dialog position="top" v-model="ammunitionListAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano listę z dnia {{date}}</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog v-model="ammunitionListInfo">
      <q-card>
        <q-card-section class="col">
          <div class="col q-pa-xs">
            <div class="text-h6">Informacje dla listy z dnia {{date}}</div>
            <div class="text-h6">Lista numer {{ammunitionListNumber}}</div>
          </div>
          <div class="col q-pa-md">
                <div class="row bg-accent">
                    <div class="col h6 text-bold text-center">Kaliber</div>
                    <div class="col h6 text-bold text-center">Suma</div>
                </div>
              <div v-for="(ammo,uuid) in ammunitionListEvidence.ammoInEvidenceEntityList" :key="uuid" class="full-width col">
                <div class="row">
                    <div class="col text-bold text-center">{{ammo.caliberName}}</div>
                    <div class="col text-bold text-center">{{ammo.quantity}}</div>
                </div>
              </div>
            </div>
          <div class="row">
            <q-btn color="secondary" class="col full-width full-height" label="pobierz listę" @click="getAmmoListPDF()"></q-btn>
            <q-item></q-item>
            <q-btn color="primary" class="col full-width full-height" label="otwórz listę" @click="openList=true"></q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog position="top" v-model="fail">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">Wystąpił jakiś problem</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog position="top" v-model="failArmory">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">Nie można wydać amunicji - Sprawdź stan magazynu</div>
        </q-card-section>
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
          <div>
            <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników  - możesz dodać nową osobę</div>
            <div class="q-pa-md bg-grey-5"><q-btn class="full-width" color="primary" label="przejdź do formularza" @click="addNewOtherPerson = true"/></div>
          </div>
        </template>
      </q-select>
    </div>
    <div class="row">
    <div class="full-width">
        <q-radio v-model="caliberUUID" v-for="(calibers,uuid) in calibers" :key="uuid" :val="calibers.uuid">
          <q-field borderless class="full-width cursor-pointer">
            <div class="full-width text-black text-left q-pa-md">{{calibers.name}}</div>
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
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="otherFirstName" label="Imię *"/></q-item>
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="otherSecondName" label="Nazwisko *"/></q-item>
          <q-item class="col"><q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubName" :val="'BRAK'" label="Brak klubu"></q-checkbox>
          <!-- <q-input v-if="clubName!='BRAK'" class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="clubName" label="Nazwa Klubu"/> -->
          <q-item v-if="clubName!='BRAK'" class="full-width">
            <q-select v-if="clubName!='BRAK'" class="full-width" @new-value="createValue" hide-selected use-chips filled v-model="clubName" use-input fill-input input-debounce="0" :options="filterOptions" @filter="filterFna" label="Wybierz Klub">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Brak wyników
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
          </q-item>
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
        <q-dialog position="top" v-model="addOtherAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zapisano do bazy</div>
        </q-card-section>
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
    <q-dialog position="top" v-model="forbidden">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">Niewłaściwy kod. Spróbuj ponownie.</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmation" @keypress.enter="showloading(),closeEvidence (),getAmmoData(),getCLosedEvidence(),confirmation=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy na pewno zamknąć listę amunicyjną</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn label="Zamknij" color="primary" v-close-popup @click="showloading(),closeEvidence (),getAmmoData(),getCLosedEvidence()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="closeList">
      <q-card>
        <q-card-section>
          <div class="text-h6">Lista została zamknięta</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="openListAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Lista została otwarta</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="listAdded">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano do listy</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

const stringOptions = []
import Vue from 'vue'
import axios from 'axios'
import App from 'src/App.vue'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      uuid: null,
      ammunitionListAlert: false,
      ammunitionListInfo: false,
      ammunitionListNumber: null,
      ammunitionListEvidence: ['', []],
      listDate: null,
      ammoList: [],
      ammoListClose: [],
      date: '',
      listAdded: false,
      fail: false,
      openList: false,
      openListAlert: false,
      closeList: false,
      forbidden: false,
      confirmation: false,
      code: null,
      failArmory: false,
      otherName: null,
      ammoAdded: false,
      addAmmo: false,
      filters: [],
      filtersOther: [],
      calibers: [],
      clubs: [],
      filterOptions: stringOptions,
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
      local: App.host
    }
  },
  created () {
    this.getAmmoData()
    this.getCLosedEvidence()
    this.getListCalibers()
    this.getOther()
    this.getMembersNames()
    this.getAllClubsToTournament()
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
    getEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/oneEvidence?uuid=' + this.uuid, {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.ammunitionListEvidence = response
        })
      })
    },
    closeEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/ammo?evidenceUUID=' + this.uuid, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          this.closeList = true
          this.getAmmoData()
          this.getCLosedEvidence()
          this.autoClose()
        } else {
          this.fail = true
          this.autoClose()
        }
      })
    },
    openEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/ammoOpen?evidenceUUID=' + this.uuid + '&pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(response => {
            this.ammoList = response
          })
          this.code = null
          this.openListAlert = true
          this.ammunitionListInfo = false
          this.getAmmoData()
          this.getCLosedEvidence()
          this.autoClose()
        }
        if (response.status === 403) {
          this.forbidden = true
          this.autoClose()
        }
        if (response.status === 400) {
          this.fail = true
          this.autoClose()
        }
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
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_Rozliczenia_Amunicji_' + this.date + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.autoClose()
      })
    },
    addMemberAndAmmoToCaliber () {
      const memberNameWord = this.memberName.split(' ')
      const legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      const otherNameWord = this.otherName.split(' ')
      const idNumber = otherNameWord.length
      const otherNameID = otherNameWord[idNumber - 1]
      fetch('http://' + this.local + '/ammoEvidence/ammo?caliberUUID=' + this.caliberUUID + '&legitimationNumber=' + memberNameUUID + '&counter=' + this.ammoQuantity + '&otherID=' + otherNameID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.listAdded = true
          this.getAmmoData()
          this.getCLosedEvidence()
          this.showloading()
          this.autoClose()
        }
        if (response.status === 400) {
          this.fail = true
          this.ammoQuantity = null
          this.autoClose()
        }
        if (response.status === 406) {
          this.failArmory = true
          this.ammoQuantity = null
          this.autoClose()
        }
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
      const person = {
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
          this.autoClose()
        } else {
          this.fail = true
          this.autoClose()
        }
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
    },
    getAllClubsToTournament () {
      fetch('http://' + this.local + '/club/tournament', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubs = response
        })
    },
    createValue (val, done) {
      if (val.length > 0) {
        const model = (this.clubName || []).slice()

        val
          .split(/[,;|]+/)
          .map(v => v.trim())
          .filter(v => v.length > 0)
          .forEach(v => {
            if (this.clubs.includes(v) === false) {
              this.clubs.push(v)
            }
            if (model.includes(v) === false) {
              model.push(v)
            }
          })

        done(null)
        this.clubName = model
      }
    },
    filterFna (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.clubs
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.clubs.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    autoClose () {
      setTimeout(() => {
        this.ammunitionListAlert = false
        this.fail = false
        this.closeList = false
        this.forbidden = false
        this.openListAlert = false
        this.failArmory = false
        this.addOtherAlert = false
        this.listAdded = false
      }, 2000)
    }
  }
}
</script>
