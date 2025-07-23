<template>
  <div class="bg-dark text-positive">
    <q-card-section class="col bg-dark">
      <div class="text-bold text-center text-h5">
        Oczekujące na podpis
      </div>
      <div class="row col text-bold">
        <div class="col">
          Numer Listy Amunicyjnej
        </div>
        <div class="col">
          Data
        </div>
      </div>
      <div class="line text-primary"></div>
      <div class="line text-primary"></div>
      <div v-for="(item, index) in ammoEvidence" :key="index">
        <div class="row col q-pt-xs q-pb-xs">
          <div class="col">
            {{ item.number }}
          </div>
          <div class="col">
            {{ item.date }}
          </div>
        </div>
        <div class="row col text-bold">
          <div class="col">
            Kaiber
          </div>
          <div class="col">
            Ilość
          </div>
          <div class="col">
            Godzina
          </div>
          <div class="col-2">
          </div>
        </div>
        <div class="line text-secondary"></div>
        <div v-for="(item1, index1) in item.ammoInEvidenceDTOList" :key="index1">
          <div class="row col q-pt-xs q-pb-xs">
            <div class="col">
              {{ item1.caliberName }}
            </div>
            <div class="col">
              {{ item1.quantity }}
            </div>
            <div class="col">
              {{ item1.time.split(".")[0] }}
            </div>
            <q-btn v-if="!item1.locked" class="col-2" @click="caliberTemp = item1;ammoInEvidenceUUID = item1.uuid; signCaliber = true" label="podpisz" color="primary" rounded />
            <q-btn v-else class="col-2" disable label="zablokowane" color="secondary" rounded />
          </div>
        </div>
        <div class="line text-primary"></div>
        <div class="line text-primary"></div>
      </div>
      <q-expansion-item label="HISTORIA WPISÓW" dense header-class="text-center text-bold text-h6"
            class="q-mb-xs">
          <q-card-section>
              <q-expansion-item v-for="(item,index) in calibers" :key="index" :label="item.name" header-class="hover1 line">
                <AmmoInEvidenceList :uuid="item.uuid" class="hover"/>
              </q-expansion-item>
          </q-card-section>
        </q-expansion-item>
    </q-card-section>
    <q-dialog v-model="signCaliber" @keypress.enter="save(), signCaliber = false" @show="signCaliberTime = caliberTemp.time.split('.')[0]">
      <q-card class="bg-dark text-positive" style="min-width: 75vw;">
          <q-card-actions align="right">
            <div class="self-center col text-center text-h6 text-bold">Podpisywanie Wydawania amunicji</div>
            <q-btn icon="close" dense round color="primary" v-close-popup/>
          </q-card-actions>
        <q-card-section>
          <div class="row col text-bold text-h6">
            <div class="col row">
              <div class="col">Kaliber:</div>
              <div class="col">{{ caliberTemp.caliberName }}</div>
            </div>
            <div class="col row">
              <div class="col">Ilość:</div>
              <div class="col">{{ caliberTemp.quantity }} szt.</div>
            </div>
          </div>
          <div class="row col text-bold text-h6">
            <div class="col row">
              <div class="col">Data:</div>
              <div class="col">{{ convertDatToNative(caliberTemp.date) }}</div>
            </div>
            <div class="col row">
              <div class="col">Godzina:</div>
              <div class="col">{{ caliberTemp.time.split('.')[0] }}</div>
            </div>
          </div>
          <q-item>
          </q-item>
          <div class="text-positive">
            Pospis osoby uprawnionej
          </div>
          <q-item>
            <VueSignaturePad id="canvas" ref="signaturePad" height="20vh" style="background-color: white;"/>
          </q-item>
          <q-btn label="wyczyść" color="primary" @click="clear()"></q-btn>
          <q-input dense label="kod potwierdzający" @keypress.enter="save()" rounded standout="" type="password" inputmode="numeric"
            v-model="code" bg-color="warning" color="Yellow" class=" text-bold" mask="####" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="dodaj" color="primary" v-close-popup @click="save();" />
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

Vue.use(VueSignature)
export default {
  components: {
    AmmoInEvidenceList: lazyLoadComponent({
      componentFactory: () => import('components/armory/AmmoInEvidenceList.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      calibers: [],
      ammoEvidence: [],
      caliberTemp: { time: '' },
      signCaliber: false,
      signCaliberTime: this.createTodayTime(),
      ammoInEvidenceUUID: null,
      code: null,
      failure: false,
      success: false,
      message: null,
      local: App.host,
      prod: App.prod
    }
  },
  created () {
    this.getListCalibers()
    this.getEvidence()
  },
  methods: {
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
    getEvidence () {
      fetch(`${this.local}/ammoEvidence/notLockedEvidences`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.ammoEvidence = response
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
      const { data } = this.$refs.signaturePad.saveSignature()
      const { isEmpty } = this.$refs.signaturePad.saveSignature()
      const dat = {
        imageString: data
      }
      if (!isEmpty) {
        fetch(`${this.local}/armory/signUpkeepAmmo?ammoInEvidenceUUID=${this.ammoInEvidenceUUID}&pinCode=${this.code}`, {
          method: 'PUT',
          body: JSON.stringify(dat)
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              this.message = response
              this.success = true
              this.getEvidence()
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
    convertDatToNative (date) {
      const convertDate = new Date(date)
      let ret
      switch (convertDate.getMonth() + 1) {
        case 1:
          ret = convertDate.getDate() + ' stycznia ' + convertDate.getFullYear()
          return ret
        case 2:
          ret = convertDate.getDate() + ' lutego ' + convertDate.getFullYear()
          return ret
        case 3:
          ret = convertDate.getDate() + ' marca ' + convertDate.getFullYear()
          return ret
        case 4:
          ret = convertDate.getDate() + ' kwietnia ' + convertDate.getFullYear()
          return ret
        case 5:
          ret = convertDate.getDate() + ' maja ' + convertDate.getFullYear()
          return ret
        case 6:
          ret = convertDate.getDate() + ' czerwca ' + convertDate.getFullYear()
          return ret
        case 7:
          ret = convertDate.getDate() + ' lipca ' + convertDate.getFullYear()
          return ret
        case 8:
          ret = convertDate.getDate() + ' sierpnia ' + convertDate.getFullYear()
          return ret
        case 9:
          ret = convertDate.getDate() + ' września ' + convertDate.getFullYear()
          return ret
        case 10:
          ret = convertDate.getDate() + ' października ' + convertDate.getFullYear()
          return ret
        case 11:
          ret = convertDate.getDate() + ' listopada ' + convertDate.getFullYear()
          return ret
        case 12:
          ret = convertDate.getDate() + ' grudnia ' + convertDate.getFullYear()
          return ret
      }
      return date
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.message = null
        this.barcode = null
        this.code = null
      }, 2000)
    }
  }
}

</script>
