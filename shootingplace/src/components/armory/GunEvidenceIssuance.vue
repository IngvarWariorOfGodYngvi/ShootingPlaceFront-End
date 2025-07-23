<template>
  <div class="bg-dark text-positive">
    <q-card-section>
      <div class="col row">
        <q-btn class="col" dense rounded color="secondary" @click="open = !open">{{ open ? 'zwiń' : 'rozwiń' }}
          wszystko</q-btn>
        <div class="col"></div>
        <q-btn class="col" dense rounded color="primary" :disable="selection.length < 1" @click="addGuns = true">wydaj
          Broń
          <br />({{ selection.length }} szt.)</q-btn>
        <q-btn class="col" dense rounded color="primary" :disable="gunsInUsed.length < 1"
          @click="gunsList = true">podpisz wydaną broń<br />({{ gunsInUsed.length }} szt.)</q-btn>
      </div>
      <div class="row items-center col text-positive text-bold text-center text-body2 q-pa-xs">
        <div style="width: 3%;">Lp</div>
        <div class="col-3 text-left">marka i model</div>
        <div class="col">kaliber</div>
        <div class="col">numer i seria</div>
        <div class="col text-left">numer<br />świadectwa
        </div>
      </div>
      <q-expansion-item dense :value="open" v-for="(gunType, id) in allGuns" :key="id"
        :label="gunType.typeName + ' ' + gunType.gunList.length + ' sztuki'"
        class="full-width text-positive text-h6 text-center text-bold">
        <div v-for="(item, index) in gunType.gunList" :key="index" @dblclick=" gunUUID = item.uuid; gunInfo = true;"
          class="text-caption q-pl-sm q-pr-sm hover1" style="border-bottom: 0.1em solid white;"
          :class="item.available ? '' : 'bg-red'">
          <div class="row col text-bold text-center items-center">
            <q-checkbox dense class="q-pr-xs" keep-color color="primary" v-model="selection" :val="item.uuid" />
            <div style="width: 3%;;" class="self-center">{{ index + 1 }}</div>
            <div class="text-left col-3">{{ item.modelName }}</div>
            <div class="col">{{ item.caliber }}</div>
            <div class="col">{{ item.serialNumber }}</div>
            <div class="col text-left">{{ item.gunCertificateSerialNumber }}</div>
          </div>
        </div>
      </q-expansion-item>
    </q-card-section>
    <q-dialog v-model="addGuns" @show="gunDate = createTodayDate(); gunTime = createTodayTime()"
      @keypress.enter="AddListOfGunToList(selection, gunDate, gunTime)">
      <q-card class="bg-dark text-positive" style="min-width: 50vw">
        <q-card-actions align="right">
          <div class="text-center text-bold text-h6 col"> Wydaj Broń</div>
          <q-btn icon="close" dense round color="primary" v-close-popup />
        </q-card-actions>
        <q-card-section>
          <q-item>
            <q-input label-color="positive" input-class="text-positive" class="col" filled v-model="gunDate"
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
            <q-input filled v-model="gunTime" label="czas" class="col" input-class="text-positive"
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
        </q-card-section>
        <q-card-actions class="row" align="right">
          <q-btn color="secondary" label="anuluj" v-close-popup></q-btn>
          <q-btn color="primary" label="wydaj broń" @click="AddListOfGunToList(selection, gunDate, gunTime);"
            v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="gunsList">
      <q-card class="bg-dark text-positive" style="min-width: 80vw;">
        <q-card-actions align="right">
          <div class="text-bold text-h6 text-center col">Lista broni oczekującej na podpis</div>
          <q-btn dense color="primary" round icon="close" v-close-popup />
        </q-card-actions>
        <q-card-section>
          <div class="row items-center col text-positive text-bold text-body2 q-pa-xs">
            <div style="width: 3%;">Lp</div>
            <div class="col">Data i<br />Godzina Wydania</div>
            <div class="col">Marka i Model</div>
            <div class="col">Kaliber /<br />rok produkcji</div>
            <div class="col">Numer i Seria</div>
            <div class="col">Ilość Magazynków</div>
            <div class="col">Numer<br />Świadectwa Broni</div>
            <div class="col">Imię i Nazwisko<br />Wydającego Broń</div>
            <div class="col">Imię i Nazwisko<br />Pobierającego Broń</div>
          </div>
          <div class="row items-center col text-bold text-body2 q-pa-xs xyz1" v-for="(item, index) in gunsInUsed"
            :key="index" @dblclick="gunUsedUUID = item.uuid; gunUsedInfo = true">
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
            <q-btn v-if="item.issuanceSign == null" class="col" dense rounded color="primary"
              @click="temp = item; singIssuanceGunUsed = true">podpisz</q-btn>
            <div v-else class="col text-center">{{ item.issuanceBy }}</div>
            <q-btn v-if="item.gunTakerSign == null" class="col" dense rounded color="secondary"
              @click="temp = item; signTakerGunUsed = true">podpisz</q-btn>
            <div v-else class="col text-center">{{ item.gunTakerName }}</div>
            <div class="line"></div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="gunUsedInfo">
      <GunUsedInfo :uuid="gunUsedUUID" />
    </q-dialog>
    <q-dialog v-model="signTakerGunUsed" @hide="temp = null;" @show="getMembersNames()">
      <q-card class="bg-dark text-positive" style="min-width: 75vw;" v-if="temp != null">
        <q-card-actions align="right">
          <div class="text-h6 text-center text-bold col">Podpis Pobierającego Broń</div>
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
              <div>{{ temp.usedDate }}</div>
              <div>{{ temp.usedTime }}</div>
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
          <q-checkbox v-model="isMember" color="primary" keep-color label="Pobierający to Klubowicz"></q-checkbox>
          <q-select v-if="isMember" label="Wybierz osobę" color="primary" input-class="text-white" label-color="white"
            popup-content-class="bg-dark text-positive" rounded standout=""
            :option-value="opt => opt !== '' ? Object(opt.name).toString() : ''"
            :option-label="opt => opt !== '' ? Object(opt.name).toString() : ''" emit-value map-options options-dense
            options-selected-class="bg-negative text-positive" v-model="gunTakerName" bg-color="primary" dense use-input
            hide-selected fill-input :options="options" @filter="filter" @input="allMember = false">
            <template v-slot:option="option">
              <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']"
                v-on="option.itemEvents">
                <q-item-section style="padding: 0.5em; margin: 0;"
                  :class="option.opt.active ? '' : 'bg-warning rounded'"
                  @click="gunTakerName = option.opt.name; memberLeg = option.opt.legitimationNumber">
                  <div class="container">
                    <div class="background text-caption text-right">{{ !option.opt.declarationLOK &&
                      shootingPlace === 'prod' ?'Brak Podpisanej Deklaracji LOK':'' }}</div>
                    {{ option.opt.secondName }} {{ option.opt.firstName }}
                    {{ option.opt.legitimationNumber }} {{ option.opt.adult ? 'Ogólna' : 'Młodzież' }} {{
                      option.opt.active
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
          <VueSignaturePad id="canvas" ref="signaturePad1" height="20vh" style="background-color: white;"/>
          <q-btn label="wyczyść" color="primary" @click="clear()"></q-btn>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="potwierdź" :disable="gunTakerName == ''" color="primary" @click="save1()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="singIssuanceGunUsed" @hide="temp = null;"
      @show="temp.gunDate = gunDate, temp.gunTimem = gunTime">
      <q-card class="bg-dark text-positive" style="min-width: 75vw;" v-if="temp != null">
        <q-card-actions align="right">
          <div class="text-bold text-h6 text-center col">Podpis Wydającego Broń</div>
          <q-btn dense color="primary" round icon="close" v-close-popup />
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
          <q-input dense v-model="adnotation" bg-color="primary" label-color="white" label="uwagi" input-class="text-white"
            rounded standout=""></q-input>
            <div class="text-positive">
              Pospis osoby uprawnionej
            </div>
            <q-item>
              <VueSignaturePad id="canvas" ref="signaturePad1" height="25vh" style="background-color: white;"/>
            </q-item>
            <q-btn label="wyczyść" color="primary" @click="clear()"></q-btn>
            <q-input dense label="kod potwierdzający" rounded standout="" type="password" v-model="code" bg-color="warning"
              color="Yellow" class="text-bold" mask="####" inputmode="numeric" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="potwierdź" color="primary" @click="save()" v-close-popup />
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
import Vue from 'vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import VueSignature from 'vue-signature-pad'
Vue.use(VueSignature)
export default {
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
    this.getAllGuns()
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
  data () {
    return {
      open: false,
      addGuns: false,
      singIssuanceGunUsed: false,
      signTakerGunUsed: false,
      gunTakerName: '',
      adnotation: '',
      gunsList: false,
      gunUsedInfo: false,
      gunUsedUUID: false,
      isMember: true,
      memberLeg: '',
      temp: null,
      options: [],
      members: [],
      allGuns: [],
      gunsInUsed: [],
      selection: [],
      gunDate: this.createTodayDate(),
      gunTime: this.createTodayTime(),
      mobile: App.mobile,
      code: null,
      message: null,
      success: false,
      failure: false,
      local: App.host,
      prod: App.prod
    }
  },
  methods: {
    getAllGuns () {
      fetch(`${this.local}/armory/getGuns`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.allGuns = response
        })
    },
    AddListOfGunToList (selection, date, time) {
      fetch(`${this.local}/armory/addGunToList?date=${date}&time=${time}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selection)
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.selection = []
            this.$emit('addGunToList')
            this.getAllGunUsed()
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    getAllGunUsed () {
      fetch(`${this.local}/armory/getAllGunUsedIssuance`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunsInUsed = response
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
        fetch(`${this.local}/armory/signIssuanceGun?gunUsedUUID=${this.temp.uuid}&issuanceDate=${this.gunDate.replace(/\//gi, '-')}&issuanceTime=${this.gunTime}&pinCode=${this.code}`, {
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
              this.success = true
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
        fetch(`${this.local}/armory/signTakerGun?gunUsedUUID=${this.temp.uuid}&memberLeg=${name}`, {
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
              this.success = true
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
