<template>
  <div>
    <q-card-section class="col bg-dark">
      <div class="row q-pa-md">
        <q-input dense v-model="caliberName" label="Nowy Kaliber" label-color="white" bg-color="primary" standout=""
          rounded class="col-4" input-class="text-positive" />
        <q-btn glossy color="primary" dense @click=" addCaliber = true" class="q-ml-md q-pl-md q-pr-md" rounded
          label="dodaj kaliber do bazy" />
      </div>
      <div class="text-positive text-body1 col" v-for="(item, id) in calibers" :key="id">
        <hr />
        <div class="self-center">
          <div class="row items-center text-bold">
            <Tooltip2clickTip></Tooltip2clickTip>
            <div class="col text-bold">Kaliber: {{ item.name }}</div>
            <div class="col text-bold">Na stanie: {{ item.quantity }} szt.</div>
            <div class="col row">
              <q-btn glossy color="primary" no-caps dense @click=" caliberUUID = item.uuid; addCaliberDialog = true"
                class="col round q-ma-xs text-caption">
                <div class="col">
                  <div>Wprowadź na stan {{ item.name }}</div>
                </div>
              </q-btn>
            </div>
          </div>
        </div>
        <q-expansion-item :label="`HISTORIA WPISÓW ${item.name}`" dense header-class="text-center text-bold"
          @click="caliberUUID = item.uuid; getCaliberHistory(item.uuid)" class="q-mb-xs">
          <q-card style="min-width: 50vw;" class="bg-dark text-positive">
            <q-card-section class="col">
              <div class="row text-bold q-pa-xs">
                <div class="self-center col-2">Data</div>
                <div class="self-center col">Opis</div>
                <div class="self-center col-2">Poprzedni stan</div>
                <div class="self-center col-2">Ilość</div>
                <div class="self-center col-1">Stan końcowy</div>
              </div>
              <div class="row hover2" v-for="(caliber, uuid) in history" :key="uuid"
                @dblclick="recordObj = null; caliber.imageUUID != null ? getUrl(caliber.imageUUID) : url = null; recordObj = caliber; recordInfo = true"
                style="cursor: pointer;">
                <Tooltip2clickToShow />
                <div class="self-center row col text-bold q-pa-xs">
                  <div class="self-center col-2">{{ convertDate(caliber.date) }}</div>
                  <div class="self-center col">{{ caliber.description }}</div>
                  <div class="self-center col-2">{{ caliber.stateForAddedDay }}</div>
                  <div class="self-center col-2">{{ caliber.ammoAdded }}</div>
                  <div class="self-center col-1">{{ caliber.finalStateForAddedDay }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </q-card-section>
    <q-dialog v-model="recordInfo">
      <q-card class="bg-dark text-positive" style="min-width: 60vw">
        <q-card-actions align="right">
          <div class="self-center col text-center text-h6 text-bold">Szczegóły Wpisu</div>
          <q-btn icon="close" dense round color="primary" v-close-popup />
        </q-card-actions>
        <q-card-section>
          <div class="col">
            <div class="row col">
              <div class="col-3 text-bold">Nazwa</div>
              <div class="col text-bold">Opis</div>
              <div class="col-3 text-bold">Data i Godzina</div>
            </div>
            <div class="row col">
              <div class="col-3">
                {{ recordObj.caliberName }}
              </div>
              <div class="col">
                {{ recordObj.description }}
              </div>
              <div class="col-3">
                {{ recordObj.date }} {{ recordObj.time }}
              </div>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col text-bold">Stan przed zmianą</div>
            <div class="col text-bold">Ilość amunicji</div>
            <div class="col text-bold">Stan po zmianie</div>
            <div class="col text-bold">Dodane przez</div>
          </div>
          <div class="row">
            <div class="col">
              {{ recordObj.stateForAddedDay }}
            </div>
            <div class="col">
              {{ recordObj.ammoAdded }}
            </div>
            <div class="col">
              {{ recordObj.finalStateForAddedDay }}
            </div>
            <div class="col">
              {{ recordObj.addedBy }}
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col bg-white" v-if="url != null">
              <q-img :src="url" spinner-color="white" style="height: 100%; width: 100%" />
            </div>
            <div class="col text-positive" v-else>
              Brak Podpisu
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn glossy label="zamknij" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addCaliberDialog">
      <q-card class="bg-dark" style="min-width: 75vw;">
        <q-card-actions align="right">
          <div class="text-h6 text-positive text-center col">Dodawanie amunicji</div>
          <q-btn color="primary" dense round icon="close" v-close-popup></q-btn>
        </q-card-actions>
        <q-card-section>
          <q-item><q-input dense filled class="full-width col" label-color="positive" input-class="text-positive"
              v-model="ammoQuantity" onkeypress="return (event.charCode > 44 && event.charCode < 58)"
              label="Ilość Amunicji"></q-input></q-item>
          <q-item><q-input dense filled class="full-width col" label-color="positive" input-class="text-positive"
              v-model="ammoDescription" label="opis"></q-input></q-item>
          <q-item>
            <q-input dense label-color="positive" input-class="text-positive" class="col" filled v-model="ammoDate"
              mask="####-##-##" label="data">
              <template v-slot:append>
                <q-icon color="positive" name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="ammoDate" no-unset mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input dense filled v-model="ammoTime" label="czas" class="col" input-class="text-positive"
              label-color="positive">
              <template v-slot:append>
                <q-icon color="positive" name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="ammoTime" now-btn with-seconds format24h class="bg-dark text-positive">
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
            <VueSignaturePad id="canvas" ref="signaturePad" height="20vh" style="background-color: white;" />
          </q-item>
          <q-btn glossy label="wyczyść" color="primary" @click="clear()"></q-btn>
          <q-input dense label="kod potwierdzający" @keypress.enter="save()" rounded standout="" type="password"
            v-model="code" bg-color="warning" color="Yellow" class="q-ma-md text-bold" mask="####"
            inputmode="numeric" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn glossy label="anuluj" color="secondary" v-close-popup
            @click=" caliberUUID = null; ammoQuantity = null; ammoDescription = null" />
          <q-btn glossy label="dodaj" color="primary" v-close-popup @click="save();" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addCaliber" @keypress.enter=" addNewCaliber(); code = null; addCaliber = false">
      <q-card class="bg-green-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input></div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn glossy label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn glossy label="Dodaj" color="black" v-close-popup @click="addNewCaliber(); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import App from 'src/App'
import Vue from 'vue'
import VueSignature from 'vue-signature-pad'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import axios from 'axios'

Vue.use(VueSignature)
export default {
  components: {
    Tooltip2clickToShow: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickToShow.vue'),
      loading: SkeletonBox
    }),
    Tooltip2clickTip: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickTip.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      caliberName: null,
      url: null,
      addCaliberDialog: false,
      calibers: [],
      history: [],
      recordInfo: false,
      recordObj: [],
      caliberInfo: false,
      addCaliber: false,
      // temp: {},
      // caliberUUID: null,
      // unitPrice: null,
      // unitPriceForNotMember: null,
      // acceptCodePrice: false,
      // acceptCodePriceForNotMember: false,
      ammoQuantity: null,
      ammoDate: this.createTodayDate(),
      ammoTime: this.createTodayTime(),
      ammoDescription: null,
      failure: false,
      success: false,
      code: null,
      message: null,
      shootingPlace: App.shootingPlace,
      local: App.host,
      prod: App.prod
    }
  },
  created () {
    this.getListCalibers()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    copyClipboard () {
      navigator.clipboard.writeText(this.caliberUUID)
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
    getListCalibers () {
      fetch(`${this.local}/armory/calibers`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.calibers = response
        })
    },
    getCaliberHistory (caliber) {
      fetch(`${this.local}/armory/getHistory?caliberUUID=${caliber}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.history = response
        })
    },
    addAmmoToCaliber () {
      fetch(`${this.local}/armory/addAmmo?caliberUUID=${this.caliberUUID}&date=${this.ammoDate.replace(/\//gi, '-')}&count=${this.ammoQuantity}&description=${this.ammoDescription}&pinCode=${this.code}`, {
        method: 'PUT'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.caliberUUID = null
              this.ammoDate = null
              this.ammoQuantity = null
              this.ammoDescription = null
              this.showloading()
              this.refresh = !this.refresh
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
    addNewCaliber () {
      fetch(`${this.local}/armory/calibers?caliber=${this.caliberName}&pinCode=${this.code}`, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.showloading()
              this.getListCalibers()
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
    getUrl (uuid) {
      axios({
        url: `${this.local}/files/getFile?uuid=${uuid}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        this.url = window.URL.createObjectURL(new Blob([response.data]))
      })
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
      const { data } = this.$refs.signaturePad.saveSignature()
      const { isEmpty } = this.$refs.signaturePad.saveSignature()
      const dat = {
        imageString: data
      }
      if (!isEmpty) {
        fetch(`${this.local}/armory/addAmmo?caliberUUID=${this.caliberUUID}&date=${this.ammoDate.replace(/\//gi, '-')}&time=${this.ammoTime}&count=${this.ammoQuantity}&description=${this.ammoDescription}&pinCode=${this.code}`, {
          method: 'PUT',
          body: JSON.stringify(dat)
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              this.message = response
              this.success = true
              this.getListCalibers()
              this.getCaliberHistory(this.caliberUUID)
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
      this.$refs.signaturePad.clearSignature()
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.addCaliber = false
        this.message = null
        this.barcode = null
        this.code = null
      }, 2000)
    }
  }
}

</script>
