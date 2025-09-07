<template>
  <div class="bg-dark text-positive">
    <q-card-section>
      <div class="row col">
        <div class="row items-center col text-positive text-bold text-body2 q-pa-xs">
          <div style="width: 3%;">Lp</div>
          <div class="col">Data i<br />Godzina Wydania</div>
          <div class="col">Marka i Model</div>
          <div class="col">Kaliber /<br />rok produkcji</div>
          <div class="col">Numer i Seria</div>
          <div class="col">Ilość Magazynków</div>
          <div class="col">Numer<br />Świadectwa Broni</div>
          <div class="col">Imię i Nazwisko<br />Pobierającego Broń</div>
          <div class="col">Imię i Nazwisko<br />Wydającego Broń</div>
          <div class="col">Podpis Zdającego Broń</div>
          <div class="col">Podpis Przyjmującego Broń</div>
        </div>
      </div>
      <div class="row col xyz1 items-center text-bold" v-for="(item, index) in gunsInUsed" :key="index"
        @dblclick="gunUsedUUID = item.uuid;temp = item; gunUsedInfo = true">
        <Tooltip2clickToShow />
        <div style="width: 3%;" class="text-center">{{ index + 1 }}</div>
        <div class="col">
          <div>{{ item.issuanceDate }}</div>
          <div>{{ item.issuanceTime }}</div>
        </div>
        <div class="col">{{ item.gun.modelName }}</div>
        <div class="col">
          <div>{{ item.gun.caliber }}</div>
          <div>{{ item.gun.productionYear }}</div>
        </div>
        <div class="col">{{ item.gun.serialNumber }}</div>
        <div class="col">{{ item.gun.numberOfMagazines }}</div>
        <div class="col">{{ item.gun.gunCertificateSerialNumber }}</div>
        <div class="col">{{ item.gunTakerName }}</div>
        <div class="col">{{ item.issuanceBy }}</div>
        <q-btn glossy v-if="item.gunReturnerSign == null" class="col" dense rounded color="secondary"
          @click="temp = item; singReturnerGunUsed = true">podpisz</q-btn>
          <div v-else class="col">{{ item.gunReturnerName }}</div>
        <q-btn glossy v-if="item.acceptanceSign == null" class="col" dense rounded color="primary"
          @click="temp = item; singAcceptanceGunUsed = true">podpisz</q-btn>
          <div v-else class="col">{{ item.acceptanceBy }}</div>
        <div class="line"></div>
      </div>
    </q-card-section>
    <q-dialog v-model="gunUsedInfo">
      <GunUsedInfo :uuid="gunUsedUUID"/>
    </q-dialog>
    <q-dialog v-model="singReturnerGunUsed" @hide="temp = null;" @show="getMembersNames()">
      <q-card class="bg-dark text-positive" style="min-width: 75vw;" v-if="temp != null">
        <q-card-actions align="right">
          <div class="text-h6 text-center text-bold col">Podpis Zdającego Broń</div>
          <q-btn dense color="primary" icon="close" round v-close-popup></q-btn>
        </q-card-actions>
        <q-card-section class="row">
          <div class="col-9"></div>
          <q-input v-model="cardNumber" dense class="col" label="Zeskanuj Kartę" type="password" inputmode="numeric" @input="find()" color="primary" bg-color="primary" label-color="white" rounded standout="">
          <template v-slot:append>
              <q-icon :color="fin?'secondary':'primary'" :name="fin?'done':'cancel'"></q-icon>
            </template>
          </q-input>
          <q-btn icon="arrow_right" round color="primary q-ml-md" @click="find()"><q-tooltip anchor="top middle" content-class="bg-secondary text-positive text-h6">wyszukaj</q-tooltip></q-btn>
        </q-card-section>
        <q-card-section>
          <div class="row items-center col text-positive text-bold text-body2 q-pa-xs">
            <div class="col">Data i<br />Godzina Wydania</div>
            <div class="col">Marka i Model</div>
            <div class="col">Kaliber /<br />rok produkcji</div>
            <div class="col">Numer i Seria</div>
            <div class="col">Ilość Magazynków</div>
            <div class="col">Numer<br />Świadectwa Broni</div>
          </div>
          <div class="row items-center col text-bold text-body2 q-pa-xs">
            <div class="col">
              <div>{{ temp.usedDate }}</div>
              <div>{{ temp.usedTime }}</div>
            </div>
            <div class="col">{{ temp.gunRepresentation.modelName }}</div>
            <div class="col">
              <div>{{ temp.gunRepresentation.caliber }}</div>
              <div>{{ temp.gunRepresentation.productionYear }}</div>
            </div>
            <div class="col">{{ temp.gunRepresentation.serialNumber }}</div>
            <div class="col">{{ temp.gunRepresentation.numberOfMagazines }}</div>
            <div class="col">{{ temp.gunRepresentation.gunCertificateSerialNumber }}</div>
          </div>
          <q-checkbox v-model="isMember" color="primary" keep-color label="Pobierający to Klubowicz"></q-checkbox>
          <q-select v-if="isMember" label="Wybierz osobę" color="primary" input-class="text-white" label-color="white"
          popup-content-class="bg-dark text-positive" rounded standout=""
          option-value="name"
          option-label="name"
          emit-value map-options options-dense options-selected-class="bg-negative text-positive" v-model="gunReturnerName"
          bg-color="primary" dense use-input hide-selected fill-input :options="options" @filter="filter">
          <template v-slot:option="option">
            <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']"
              v-on="option.itemEvents">
              <q-item-section style="padding: 0.5em; margin: 0;" :class="option.opt.active ? '' : 'bg-warning rounded'"
              @click="gunReturnerName = option.opt.name; memberLeg = option.opt.legitimationNumber">
                <div class="container">
                  <div class="background text-caption text-right">{{ !option.opt.declarationLOK && shootingPlace==='prod'?'Brak Podpisanej Deklaracji LOK':'' }}</div>
                  {{ option.opt.secondName }} {{ option.opt.firstName }}
                  {{ option.opt.legitimationNumber }} {{ option.opt.adult ? 'Ogólna' : 'Młodzież' }} {{ option.opt.active
                    ? '' : ' - BRAK SKŁADEK' }}
                </div>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Brak wyników - sprawdź w skreślonych
              </q-item-section>
            </q-item>
          </template>
        </q-select>
          <div class="text-positive">
            Pospis osoby pobierającej broń
          </div>
          <q-item>
            <VueSignaturePad id="canvas" ref="signaturePad1" height="25vh" style="background-color: white;"/>
          </q-item>
          <q-item>
            <q-btn glossy label="wyczyść" color="primary" @click="clear()"/>
          </q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn glossy label="anuluj" color="secondary" v-close-popup />
          <q-btn glossy label="potwierdź" :disable="gunReturnerName == ''" color="primary" @click="save1()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="singAcceptanceGunUsed" @hide="temp = null;" @show="temp.gunDate = acceptanceDate, temp.gunTimem = acceptanceTime">
      <q-card class="bg-dark text-positive" style="min-width: 75vw;" v-if="temp != null">
        <q-card-actions align="right">
          <div class="text-h6 text-center text-bold col">Podpis Wydającego Broń</div>
          <q-btn dense color="primary" icon="close" round v-close-popup></q-btn>
        </q-card-actions>
        <q-card-section>
          <div class="row items-center col text-positive text-bold text-body2 q-pa-xs">
            <div class="col">Data i<br />Godzina Wydania</div>
            <div class="col">Marka i Model</div>
            <div class="col">Kaliber /<br />rok produkcji</div>
            <div class="col">Numer i Seria</div>
            <div class="col">Ilość Magazynków</div>
            <div class="col">Numer<br />Świadectwa Broni</div>
          </div>
          <div class="row items-center col text-bold text-body2 q-pa-xs">
            <div class="col">
              <div>{{ temp.issuanceDate }}</div>
              <div>{{ temp.issuanceTime }}</div>
            </div>
            <div class="col">{{ temp.gun.modelName }}</div>
            <div class="col">
              <div>{{ temp.gun.caliber }}</div>
              <div>{{ temp.gun.productionYear }}</div>
            </div>
            <div class="col">{{ temp.gun.serialNumber }}</div>
            <div class="col">{{ temp.gun.numberOfMagazines }}</div>
            <div class="col">{{ temp.gun.gunCertificateSerialNumber }}</div>
          </div>
          <q-item>
            <q-input dense label-color="positive" input-class="text-positive" class="col" filled v-model="gunDate"
              mask="####-##-##" label="data">
              <template v-slot:append>
                <q-icon color="positive" name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="gunDate" no-unset mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input dense filled v-model="gunTime" label="czas" class="col" input-class="text-positive"
              label-color="positive">
              <template v-slot:append>
                <q-icon color="positive" name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="gunTime" now-btn with-seconds format24h class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="zamknij" color="primary" />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <div class="text-positive">
            Pospis osoby uprawnionej
          </div>
          <q-item>
            <VueSignaturePad id="canvas" ref="signaturePad1" height="25vh" style="background-color: white;"/>
          </q-item>
          <q-item>
            <q-btn glossy label="wyczyść" color="primary" @click="clear()"></q-btn>
          </q-item>
          <q-input dense label="kod potwierdzający" @keypress.enter="code == null || code.length <4?'':save()" rounded standout="" type="password"
            v-model="code" bg-color="warning" color="Yellow" class=" text-bold" mask="####" inputmode="numeric"/>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn glossy label="anuluj" color="secondary" v-close-popup />
          <q-btn glossy :disable="code == null || code.length <4" label="potwierdź" color="primary" @click="save()" v-close-popup />
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
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import Vue from 'vue'
import VueSignature from 'vue-signature-pad'
Vue.use(VueSignature)
export default {
  data () {
    return {
      member: null,
      temp: null,
      code: null,
      gunUsedUUID: null,
      gunsInUsed: null,
      acceptanceTime: null,
      acceptanceDate: null,
      gunReturnerName: '',
      fin: false,
      gunUsedInfo: false,
      singReturnerGunUsed: false,
      singAcceptanceGunUsed: false,
      gunDate: this.createTodayDate(),
      gunTime: this.createTodayTime(),
      memberLeg: '',
      isMember: true,
      options: [],
      members: [],
      message: null,
      success: false,
      failure: false,
      main: App.main,
      local: App.host
    }
  },
  components: {
    Tooltip2clickToShow: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickToShow.vue'),
      loading: SkeletonBox
    }),
    GunUsedInfo: lazyLoadComponent({
      componentFactory: () => import('./GunUsedInfo.vue'),
      loading: SkeletonBox
    })
  },
  created () {
    this.getAllGunUsed()
  },
  props: {
    load: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    load (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getAllGunUsed()
      }
    }
  },
  methods: {
    getAllGunUsed () {
      fetch(`${this.local}/armory/getAllGunUsedAcceptance`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunsInUsed = response
        })
    },
    find () {
      fetch(`${this.local}/barCode/?cardNumber=${this.cardNumber}`, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(response => {
            this.member = response
            this.gunReturnerName = response.name
            this.memberLeg = response.legitimationNumber
            this.fin = true
          })
        } else {
          this.member = null
          this.fin = false
        }
      })
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
        day = '0' + (date.getDate())
      } else {
        day = (date.getDate())
      }
      return date.getFullYear() + '-' + month + '-' + day
    },
    createTodayTime () {
      const date = new Date()
      let hours = date.getHours()
      hours = hours < 10 ? hours = '0' + hours : hours
      let minutes = date.getMinutes()
      minutes = minutes < 10 ? minutes = '0' + minutes : minutes
      let seconds = date.getSeconds()
      seconds = seconds < 10 ? seconds = '0' + seconds : seconds
      return `${hours}:${minutes}:${seconds}`
    },
    save () {
      const { data } = this.$refs.signaturePad1.saveSignature()
      const { isEmpty } = this.$refs.signaturePad1.saveSignature()
      const dat = {
        imageString: data
      }
      if (!isEmpty) {
        fetch(`${this.local}/armory/signAcceptanceGun?gunUsedUUID=${this.temp.uuid}&acceptanceDate=${this.gunDate.replace(/\//gi, '-')}&acceptanceTime=${this.gunTime}&pinCode=${this.code}`, {
          method: 'PUT',
          body: JSON.stringify(dat)
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              this.message = response
              this.success = true
              this.getAllGunUsed()
            })
          } else {
            response.text().then(response => {
              this.message = response
              this.failure = true
            })
          }
        })
      } else {
        this.message = 'Podpisz się'
        this.failure = true
      }
      this.autoClose()
    },
    save1 () {
      const name = this.memberLeg
      const { data } = this.$refs.signaturePad1.saveSignature()
      const { isEmpty } = this.$refs.signaturePad1.saveSignature()
      const dat = {
        imageString: data
      }
      if (!isEmpty) {
        fetch(`${this.local}/armory/signReturnerGun?gunUsedUUID=${this.temp.uuid}&memberLeg=${name}`, {
          method: 'PUT',
          body: JSON.stringify(dat)
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              this.message = response
              this.success = true
              this.getAllGunUsed()
            })
          } else {
            response.text().then(response => {
              this.message = response
              this.failure = true
            })
          }
        })
      } else {
        this.message = 'Podpisz się'
        this.failure = true
      }
      this.autoClose()
    },
    clear () {
      this.$refs.signaturePad1.clearSignature()
    },
    getMembersNames () {
      fetch(`${this.local}/member/getAllNames`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.members = response
        })
    },
    filter (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.members.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.members.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }

}
</script>
