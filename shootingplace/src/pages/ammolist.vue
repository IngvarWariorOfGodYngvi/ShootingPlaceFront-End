<template>
  <q-page padding>
    <div>
      <q-item>
        <div class="text-center col full-width no-outline text-h4 text-bold text-positive">Lista
          Amunicyjna
        </div>
      </q-item>
    </div>
    <div class="row">
      <q-card class="col-9 bg-dark text-positive">
        <div class="row">
          <div class="col-3">
            <q-btn class="col-1 full-width full-height" icon="person_add_alt_1" color="primary"
                   @click="getOther();addAmmo=true">
              <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Dodaj do listy
              </q-tooltip>
            </q-btn>
          </div>
          <div v-if="ammoList!=null && ammoList.forceOpen" class="col-9">
            <div class=" q-pa-md bg-red-3 text-center text-black text-bold">UWAGA! LISTA OTWARTA PONOWNIE. NA KONIEC
              DNIA PAMIĘTAJ
              O JEJ ZAMKNIĘCIU!
            </div>
          </div>
        </div>
        <div class="text-h5 text-bold" v-if="ammoList.length<=0">
          <q-item>
            <q-item-section>
              Brak aktywnej listy amunicji
            </q-item-section>
          </q-item>
        </div>
        <div v-else class="col">
          <q-item class="col">
            <q-item-section class="text-h5 text-bold ">
              Lista Amunicji {{ convertDate(ammoList.date) }} numer {{ ammoList.number }}
            </q-item-section>
            <q-item-section side top>
              <q-btn color="primary" @click="uuid=ammoList.uuid;confirmation=true" icon="lock">
                <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Zamknij
                  listę
                </q-tooltip>
              </q-btn>
            </q-item-section>
            <q-item-section side top>
              <AmmoListDownloadBtn :uuid="ammoList.uuid" :date="ammoList.date"/>
            </q-item-section>
          </q-item>
          <div v-for="(ammoInEvidenceDTOList,uuid) in ammoList.ammoInEvidenceDTOList" :key="uuid">
            <q-item dense>
              <q-item-label class="text-h6">
                Kaliber {{ ammoInEvidenceDTOList.caliberName }}
              </q-item-label>
            </q-item>
            <div class="col">
              <div class="row"
                   v-for="(ammoUsedToEvidenceDTOList,uuid) in ammoInEvidenceDTOList.ammoUsedToEvidenceDTOList"
                   :key="uuid">
                <div class="row full-width"
                     @dblclick="legitimationNumber = ammoUsedToEvidenceDTOList.legitimationNumber;memberDial=legitimationNumber!=null">
                  <q-field color="positive" dense class="col-10 text-positive" standout="bg-accent text-positive"
                           label-color="positive" label="osoba"
                           stack-label>
                    <div class="row text-positive">{{ ammoUsedToEvidenceDTOList.name }}</div>
                  </q-field>
                  <q-field class="col-2" dense standout="bg-accent text-positive" label="ilość" label-color="positive"
                           stack-label>
                    <div class="row text-positive">{{ ammoUsedToEvidenceDTOList.counter }}</div>
                  </q-field>
                </div>
              </div>
              <div class="row reverse">
                <q-field class="col-2 bg-dark text-positive" dense standout="bg-accent text-positive"
                         label-color="positive" label="suma" stack-label>
                  <div class="text-positive">{{ ammoInEvidenceDTOList.quantity }}</div>
                </q-field>
              </div>
            </div>
          </div>
        </div>
      </q-card>
      <q-card class="col-3 bg-dark">
        <div>
          <q-item>
            <q-item-label class="text-h5 text-bold text-positive">
              Zamknięte listy
            </q-item-label>
          </q-item>
          <div class="row full-width bg-secondary">
            <q-btn icon="arrow_left" @click="pageNumber=pageNumber-1;getClosedEvidence(pageNumber)"
                   :disable="pageNumber===0" class="col-1" text-color="positive" color="primary"></q-btn>
            <div class="self-center text-bold text-center text-white col-10">STRONA {{ pageNumber + 1 }}</div>
            <q-btn icon="arrow_right"
                   @click="pageNumber=ammoListClose.length===50?pageNumber+1:pageNumber;getClosedEvidence(pageNumber)"
                   :disabled="ammoListClose.length!==50" class="col-1" text-color="positive"
                   color="primary"></q-btn>
          </div>
          <div v-for="(item,index) in ammoListClose" :key="index">
            <q-item :key="index" dense>
              <q-btn class="col" dense text-color="white" color="primary"
                     @click="date = item.date;number = item.number;uuid= item.evidenceUUID;getEvidence();ammunitionListInfo=true">
                <div class="col q-pa-none q-ma-none">
                  <div>{{ item.number + ' '}}</div>
                  <div>{{convertDate(item.date)}}</div>
                </div>
              </q-btn>
            </q-item>
          </div>

          <!--          <q-virtual-scroll :items="ammoListClose" visible class="full-width q-pa-none" style="height: 70vh;">-->
          <!--            <template v-slot="{ item, index }">-->
          <!--              <q-item :key="index" dense class="q-pa-none"-->
          <!--              >-->
          <!--                <q-btn class="col full-width full-height text-positive"-->
          <!--                       @click="date = item.date;number = item.number;uuid= item.evidenceUUID;getEvidence();ammunitionListInfo=true">-->
          <!--                  <div class="col">-->
          <!--                    <b>{{ item.number }}</b>-->
          <!--                    <div class="text-caption">{{ convertDate(item.date) }}</div>-->
          <!--                  </div>-->
          <!--                </q-btn>-->
          <!--              </q-item>-->
          <!--            </template>-->
          <!--          </q-virtual-scroll>-->
        </div>
      </q-card>
    </div>
    <q-dialog position="top" v-model="ammunitionListAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano listę z dnia {{ date }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="ammunitionListInfo">
      <q-card class="bg-dark text-positive">
        <q-card-section class="col">
          <div class="col q-pa-xs">
            <div class="text-h6">Informacje dla listy z dnia {{ date }}</div>
            <div class="text-h6">Lista numer {{ number }}</div>
          </div>
          <div class="col q-pa-md">
            <div class="row bg-accent">
              <div class="col h6 text-bold text-center">Kaliber</div>
              <div class="col h6 text-bold text-center">Suma</div>
            </div>
            <div v-for="(item,uuid) in ammunitionListEvidence.ammoInEvidenceEntityList" :key="uuid"
                 class="full-width col">
              <div class="row">
                <div class="col text-bold text-center">{{ item.caliberName }}</div>
                <div class="col text-bold text-center">{{ item.quantity }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <AmmoListDownloadBtn :uuid="uuid" :date="date" class="col full-height"/>
            <q-item></q-item>
            <q-btn color="primary" class="col full-width full-height" icon="lock_open" @click="openList=true">
              <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Otwórz listę
              </q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat icon="close" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addAmmo">
      <div class="bg-dark text-positive">
        <div class="row">
          <q-select label="Wybierz osobę z Klubu"
                    popup-content-class="bg-dark text-positive"
                    :option-value="opt => opt!==''? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
                    :option-label="opt => opt!==''? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
                    emit-value
                    map-options
                    color="positive" input-class="text-positive"
                    label-color="positive" dark v-model="memberName" fill-input filled dense use-input hide-selected
                    input-debounce="0" :options="options" @input="otherName='0 0'" @filter="filterFn">
            <template v-slot:option="option">
              <q-item class="rounded bg-dark text-positive" dense style="padding: 0; margin: 0;"
                      v-bind="option.itemProps"
                      v-on="option.itemEvents">
                <q-item-section v-if="option.opt.active" style="padding: 0.5em; margin: 0;"
                                @click="otherName='0 0';memberName = option.opt.secondName+' '+option.opt.firstName+' '+ option.opt.legitimationNumber">
                  <div v-if="option.opt.adult">{{ option.opt.secondName }} {{ option.opt.firstName }}
                    {{ option.opt.legitimationNumber }} Ogólna
                  </div>
                  <div v-else>{{ option.opt.secondName }} {{ option.opt.firstName }} {{ option.opt.legitimationNumber }}
                    Młodzież
                  </div>
                </q-item-section>
                <q-item-section v-else style="padding: 0.5em; margin: 0;" class="bg-warning rounded"
                                @click="otherName='0 0';memberName = option.opt.secondName+' '+option.opt.firstName+' '+ option.opt.legitimationNumber">
                  <div v-if="option.opt.adult">{{ option.opt.secondName }} {{ option.opt.firstName }}
                    {{ option.opt.legitimationNumber }} Ogólna - BRAK SKŁADEK
                  </div>
                  <div v-else>{{ option.opt.secondName }} {{ option.opt.firstName }} {{ option.opt.legitimationNumber }}
                    Młodzież - BRAK SKŁADEK
                  </div>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select class="col" dense filled v-model="otherName" use-input hide-selected fill-input input-debounce="0"
                    color="positive" input-class="text-positive" label-color="positive"
                    popup-content-class="bg-dark text-positive"
                    :options="options1" @input="memberName='0 0'" @filter="filterOther" label="Dodaj osobę spoza klubu">
            <template v-slot:no-option>
              <div class="bg-dark text-center text-bold text-positive">
                <div class="q-pa-md bg-dark text-center text-bold text-positive">Brak wyników - możesz dodać nową
                  osobę
                </div>
                <div class="q-pa-md bg-grey-5">
                  <q-btn class="full-width" color="primary" label="przejdź do formularza"
                         @click="addNewOtherPerson = true"/>
                </div>
              </div>
            </template>
          </q-select>
        </div>
        <div class="row">
          <div class="full-width">
            <q-radio v-model="caliberUUID" v-for="(calibers,uuid) in calibers" :key="uuid" :val="calibers.uuid">
              <div class="full-width text-positive text-left q-pa-md cursor-pointer">{{ calibers.name }}</div>
            </q-radio>
          </div>
        </div>
        <div class="col">
          <q-input v-model="ammoQuantity" class="full-width col" color="positive" label-color="positive"
                   input-class="text-positive" dense filled label="Ilość Amunicji"
                   onkeypress="return (event.charCode > 44 && event.charCode < 58)" placeholder="Tylko cyfry"
                   type="number" @keypress.enter="dis=true;simulateProgress(0)"></q-input>
          <q-card-actions class="row" align="right">
            <q-item>
              <q-btn class="full-width col" color="primary" icon="close" v-close-popup></q-btn>
            </q-item>
            <q-item>
              <q-btn class="full-width col" color="primary" :loading="loading[0]" icon="done"
                     :disable="dis||ammoQuantity.length===0||caliberUUID==null"
                     @click="dis=true;simulateProgress(0);"></q-btn>
            </q-item>
          </q-card-actions>
        </div>
      </div>
    </q-dialog>
    <q-dialog v-model="addNewOtherPerson">
      <q-card class="full-width">
        <q-card-section>
          <div class="text-h6">Dodawanie nowej osoby spoza klubu</div>
          <q-item>
            <q-input class="full-width"
                     onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 32"
                     filled v-model="otherFirstName" label="Imię *"/>
          </q-item>
          <q-item>
            <q-input class="full-width"
                     onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 32"
                     filled v-model="otherSecondName" label="Nazwisko *"/>
          </q-item>
          <q-item class="col">
            <q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubName" :val="'BRAK'"
                        label="Brak klubu"></q-checkbox>
            <q-item v-if="clubName!=='BRAK'" class="full-width">
              <q-select v-if="clubName!=='BRAK'" class="full-width" @new-value="createValue" hide-selected use-chips
                        filled v-model="clubName" use-input fill-input input-debounce="0" :options="filterOptions"
                        @filter="filterFna" label="Wybierz Klub">
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
          <q-item>
            <q-input class="full-width" mask="### ### ###" filled v-model="otherPhoneNumber" label="Numer telefonu"/>
          </q-item>
          <q-item>
            <q-input class="full-width" filled v-model="otherEmail" label="e-mail"/>
          </q-item>
          <q-item>
            <q-btn label="Zapisz do bazy" v-close-popup @click="addOtherPerson()" color="primary"/>
          </q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Zamknij" color="primary" v-close-popup
                 @click="otherFirstName=null;otherSecondName=null;clubName=''"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="openList" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="openEvidence();openList=false" autofocus type="password" v-model="code" filled
                     color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="otwórz" color="black" v-close-popup @click="openEvidence()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmation"
              @keypress.enter="showloading();closeEvidence ();getAmmoData();getClosedEvidence(pageNumber);confirmation=false">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Czy na pewno zamknąć listę amunicyjną</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" flat icon="cancel" color="primary" v-close-popup/>
          <q-btn text-color="white" icon="done" color="primary" v-close-popup
                 @click="showloading();closeEvidence ();getAmmoData();getClosedEvidence(pageNumber)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card style="min-width: 80vw" class="bg-dark">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="legitimationNumber"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup @click="code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">

</style>
<script>
import { ref } from 'vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'

const stringOptions = []
import App from 'src/App.vue'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

export default {
  setup () {
    const loading = ref([
      false
    ])
    const progress = ref(false)

    function simulateProgress (number) {
      loading.value[number] = true
      this.addMemberAndAmmoToCaliber()
      setTimeout(() => {
        loading.value[number] = false
      }, 0)
    }

    return {
      loading,
      progress,
      simulateProgress
    }
  },
  components: {
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    }),
    AmmoListDownloadBtn: lazyLoadComponent({
      componentFactory: () => import('components/ammoList/ammoListDownloadBtn.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      pageNumber: 0,
      memberDial: false,
      legitimationNumber: null,
      uuid: null,
      dis: false,
      ammunitionListAlert: false,
      ammunitionListInfo: false,
      number: null,
      ammunitionListEvidence: ['', []],
      ammoList: {
        ammoInEvidenceDTOList: [],
        forceOpen: false
      },
      ammoListClose: [],
      date: '',
      message: null,
      success: false,
      failure: false,
      openList: false,
      confirmation: false,
      code: null,
      otherName: '',
      addAmmo: false,
      filters: [],
      filtersOther: [],
      calibers: [],
      clubs: [],
      filterOptions: stringOptions,
      caliberUUID: null,
      memberName: '',
      addNewOtherPerson: false,
      ammoQuantity: '',
      otherFirstName: null,
      otherSecondName: null,
      otherPhoneNumber: '',
      otherEmail: '',
      clubName: '',
      permissionsOtherArbiterNumber: '',
      ordinal: '',
      permissionsOtherArbiterPermissionValidThru: '',
      gunBarcode: null,
      options: stringOptions,
      options1: stringOptions,
      local: App.host
    }
  },
  created () {
    this.getAmmoData()
    this.getClosedEvidence(0)
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
    convertDate (date) {
      const current = new Date(date)
      let month = current.getMonth() + 1
      let day = current.getDate()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + (month)
      }
      return day + '-' + (month) + '-' + current.getFullYear()
    },
    getAmmoData () {
      fetch('http://' + this.local + '/ammoEvidence/evidence', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.ammoList = response
          this.uuid = response.uuid
        })
    },
    getClosedEvidence (pageNumber) {
      fetch('http://' + this.local + '/ammoEvidence/closedEvidences?page=' + pageNumber + '&size=50', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.ammoListClose = response
        })
    },
    getEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/oneEvidence?uuid=' + this.uuid, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.ammunitionListEvidence = response
        })
    },
    closeEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/ammo?evidenceUUID=' + this.uuid, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.uuid = null
              this.getAmmoData()
              this.getClosedEvidence(this.pageNumber)
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
    openEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/ammoOpen?evidenceUUID=' + this.uuid + '&pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.code = null
            this.message = response
            this.success = true
            this.ammunitionListInfo = false
            this.getAmmoData()
            this.getClosedEvidence(this.pageNumber)
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          }
          )
        }
      })
    },
    getMembersNames () {
      fetch('http://' + this.local + '/member/getAllNames', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters = response
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
          response.text().then(response => {
            this.message = response
            this.success = true
            this.dis = false
            this.ammoQuantity = ''
            this.caliberUUID = null
            this.getAmmoData()
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.dis = false
            this.autoClose()
          })
        }
      })
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
        .then(response => {
          this.filtersOther = response
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
          this.message = response
          this.success = true
          this.getOther()
          this.autoClose()
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterOther (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options1 = this.filtersOther.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options1 = this.filtersOther.filter(v => v.toLowerCase().indexOf(needle) > -1)
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
        this.success = false
        this.failure = false
        this.message = null
        this.gunBarcode = null
      }, 2000)
    }
  }
}
</script>
