<template>
  <div class="bg-dark">
    <q-card class="bg-dark text-positive">
      <div class="row q-pa-md col" v-if="!mobile">
        <q-btn dense class="col q-ma-xs" color="primary" glossy @click="open = !open" rounded>{{ open ? 'zwiń' : 'rozwiń' }} wszystko</q-btn>
        <q-btn dense class="col q-ma-xs" color="primary" glossy @click="removedGunsListDial = true" rounded>Wykaz broni wykreślonej</q-btn>
        <q-btn dense class="col q-ma-xs" color="secondary" glossy @click="gunAdding = true" rounded>wprowadź na stan</q-btn>
        <q-btn dense class="col q-ma-xs" color="secondary" glossy
          @click="transportCertificate = !transportCertificate; selection = []; date = null, date1 = null" rounded>wystaw list
          przewozowy</q-btn>
        <q-btn dense class="col q-ma-xs" color="secondary" glossy @click=" gunList = true" rounded>pobierz listę broni</q-btn>
        <q-btn dense class="col q-ma-xs" color="secondary" glossy @click=" newGunType = true" rounded>wprowadź nowy typ Broni</q-btn>
      </div>
      <div class="q-pa-md col" v-else>
        <div class="row col">
          <q-btn dense class="col q-ma-xs" color="primary" glossy @click="open = !open" rounded>{{ open ? 'zwiń' : 'rozwiń' }} wszystko</q-btn>
          <q-btn dense class="col q-ma-xs" color="primary" glossy @click="removedGunsListDial = true" rounded>Wykaz broni wykreślonej</q-btn>
          <q-btn dense class="col q-ma-xs" color="secondary" glossy @click="gunAdding = true" rounded>wprowadź na stan</q-btn>
        </div>
        <div class="row col">
          <q-btn dense class="col q-ma-xs" color="secondary" glossy
          @click="transportCertificate = !transportCertificate; selection = []; date = null, date1 = null" rounded>wystaw list
          przewozowy</q-btn>
          <q-btn dense class="col q-ma-xs" color="secondary" glossy @click=" gunList = true" rounded>pobierz listę broni</q-btn>
          <q-btn dense class="col q-ma-xs" color="secondary" glossy @click=" newGunType = true" rounded>wprowadź nowy typ Broni</q-btn>
        </div>
      </div>
      <div v-if="transportCertificate">
        <div class="text-positive text-center">Wystawianie Listu Przewozowego</div>
        <div class="row">
          <q-input dense label-color="positive" input-class="text-positive" class="col-4" filled v-model="date"
            mask="####-##-##" label="data początkowa">
            <template v-slot:append>
              <q-icon color="positive" name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="date" no-unset mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input dense label-color="positive" input-class="text-positive" class="col-4" filled v-model="date1"
            mask="####-##-##" label="data końcowa">
            <template v-slot:append>
              <q-icon color="positive" name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date no-unset v-model="date1" mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn class="col-4" label="generuj dokument" color="primary"
            @click=" getGunTransportCertificate(); selection = []" />
        </div>
      </div>
      <div class="row items-center col text-positive text-bold text-left text-body2 q-pa-xs">
        <div style="width: 3%;">Lp</div>
        <div class="col text-left">marka i model</div>
        <div class="col" v-if="!mobile">kaliber</div>
        <div class="col text-left">numer i seria</div>
        <div class="col text-left">numer<br />świadectwa
        </div>
        <div class="col" v-if="!mobile">podstawa wpisu</div>
        <div class="col text-right" v-if="!mobile">data wpisu</div>
      </div>
      <q-expansion-item dense :value="open" v-for="(gunType, id) in allGuns" :key="id"
        :label="gunType.typeName + ' ' + gunType.gunList.length + ' sztuki'" header-class="text-center"
        class="full-width text-positive text-h6 text-left text-bold">
        <div v-for="(item, index) in gunType.gunList" :key="index" @dblclick=" gunUUID = item.uuid; gunInfo = true;"
          class="text-caption q-pl-sm q-pr-sm hover1"
          :class="item.available ? '' : 'bg-red'">
          <div class="row col text-bold text-center items-center">
            <q-checkbox dense class="q-pr-xs" v-if="transportCertificate" color="primary" v-model="selection"
              :val="item.uuid" />
            <div style="width: 3%;" class="self-center">{{ index + 1 }}</div>
            <div class="text-left col">{{ item.modelName }}</div>
            <div class="col" v-if="!mobile">{{ item.caliber }}</div>
            <div class="col text-left">{{ item.serialNumber }}</div>
            <div class="col text-left">{{ item.gunCertificateSerialNumber }}</div>
            <div class="col text-left" v-if="!mobile">{{ item.basisForPurchaseOrAssignment }}</div>
            <div class="col text-right" v-if="!mobile">{{ item.addedDate }}</div>
            <div class="line"></div>
          </div>
        </div>
      </q-expansion-item>
    </q-card>
    <q-dialog v-model="gunList">
      <q-card class="bg-dark">
        <q-card-section class="text-positive">
          <div class="text-h6 text-center">Generuj listę dla wybranych rodzajów broni</div>
          <div v-for="(item, index) in gunTypes" :key="index" class="hover1 q-pa-xs">
            <div>
              <q-checkbox dense v-model="gunListSelect" :val="item.uuid" :label="item.typeName"
                @input="gunListSelect.length != gunTypes.length ? selectAllToGunList = false : selectAllToGunList = true" />
            </div>
          </div>
          <q-checkbox dense class="hover1 full-width" label="zaznacz wszystko" v-model="selectAllToGunList"
            @input="selectAllGunTypeToGenerate()" />
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md">
            <q-btn-dropdown label="pobierz listę" color="primary" class="full-width"
              content-class="bg-dark text-positive col">
              <q-list>
                <q-btn dense rounded class="full-width q-ma-xs"
                  @click=" getGunRegistryPdf(); gunListSelect = []; selectAllToGunList = false" v-close-popup
                  color="primary" label="pobierz plik .pdf" />
                <q-btn dense rounded class="full-width q-ma-xs"
                  @click=" getGunRegistryXlsx(); gunListSelect = []; selectAllToGunList = false" v-close-popup
                  color="green-6" label="pobierz plik .xlsx" />
              </q-list>
            </q-btn-dropdown>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Zamknij" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="removedGunsListDial" @show="getRemovedAllGuns()">
      <q-card class="bg-dark text-positive" style="min-width: 80vw">
        <q-card-actions align="right">
          <q-btn icon="close" color="primary" round v-close-popup />
        </q-card-actions>
        <div class="text-bold text-h6 text-center">Lista Broni Wykreślonej z Ewidencji</div>
        <q-card-section class="flex-center">
          <div class="row items-center col text-positive text-bold text-center text-body2 q-pa-xs">
        <div style="width: 3%;;">Lp</div>
        <div class="col-3 text-left">marka i model</div>
        <div class="col-1">kaliber</div>
        <div class="col-2">numer i seria</div>
        <div class="col-1 text-left">numer<br />świadectwa
        </div>
        <div class="col">podstawa wpisu</div>
        <div class="col-1 text-right">data wpisu</div>
      </div>
      <q-expansion-item dense v-for="(gunType, id) in allRemovedGuns" :key="id"
        :label="gunType.typeName + ' ' + gunType.gunRemovedList.length + ' sztuki'"
        class="full-width text-positive text-h6 text-center text-bold">
        <div v-for="(item, index) in gunType.gunRemovedList" :key="index" @dblclick=" gunUUID = item.uuid; gunInfo = true;"
          class="text-caption q-pl-sm q-pr-sm hover1">
          <div class="row col text-bold text-center items-center">
            <div style="width: 3%;;" class="self-center">{{ index + 1 }}</div>
            <div class="text-left col-3">{{ item.modelName }}</div>
            <div class="col-1">{{ item.caliber }}</div>
            <div class="col-2">{{ item.serialNumber }}</div>
            <div class="col-1 text-left">{{ item.gunCertificateSerialNumber }}</div>
            <div class="col text-left">{{ item.basisForPurchaseOrAssignment }}</div>
            <div class="col-1 text-right">{{ item.addedDate }}</div>
          </div>
          <div class="line"></div>
        </div>
      </q-expansion-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="gunInfo">
      <Gun :uuid="gunUUID" :close="false" v-on:removeGun="getAllGuns();gunInfo=false" v-on:editingGun="getAllGuns()"></Gun>
    </q-dialog>
    <q-dialog v-model="gunAdding">
      <q-card style="min-width: 60vw;" class="bg-dark text-positive">
        <q-card-actions align="right">
          <div class="self-center col text-center text-h6 text-bold">Dodawanie broni do magazynu</div>
          <q-btn color="primary" dense round icon="close" v-close-popup></q-btn>
        </q-card-actions>
        <q-card-section class="col text-positive">
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunModelName"
            label="marka i model*"/>
          <q-select dense label-color="positive" options-selected-class="text-positive" input-class="text-positive"
            filled v-model="gunCaliber" use-input hide-selected fill-input options-dense
            :option-value="opt => opt !== '' ? Object(opt.name).toString() : ''"
            :option-label="opt => opt !== '' ? Object(opt.name).toString() : ''"
            popup-content-class="bg-dark text-positive" :options="options" @filter="filter" label="kaliber*">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select dense label-color="positive" options-selected-class="text-positive" input-class="text-positive"
            filled v-model="gunType" use-input hide-selected fill-input options-dense
            :option-value="opt => opt !== '' ? Object(opt.typeName).toString() : ''"
            :option-label="opt => opt !== '' ? Object(opt.typeName).toString() : ''"
            popup-content-class="bg-dark text-positive" :options="options" @filter="filterGunTypes" label="typ*">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunSerialNumber"
            label="numer seryjny*"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled
            onkeypress="return (event.charCode > 44 && event.charCode < 58)" mask="####" v-model="gunProductionYear"
            label="rok produkcji"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled
            onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="gunRecordInEvidenceBook"
            label="pozycja z książki ewidencji"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled
            onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="gunNumberOfMagazines"
            label="ilość magazynków"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunCertificateSerialNumber"
            fill-mask="X" label="numer świadectwa"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled
            v-model="gunBasisForPurchaseOrAssignment" label="podstawa wpisu"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunAdditionalEquipment"
            label="wyposażenie dodatkowe"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunComment"
            label="uwagi"></q-input>
          <q-input label-color="positive" input-class="text-positive" class="full-width" filled v-model="gunDate"
            mask="####-##-##" label="data wprowadzenia na stan*">
            <template v-slot:append>
              <q-icon color="positive" name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="gunDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="secondary" v-close-popup />
          <q-btn label="zapisz" color="primary" v-close-popup @click="singAddGun = true" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="singAddGun" >
      <q-card class="bg-dark text-positive" style="min-width: 75vw;">
        <q-card-section>
          <div class="text-h6 text-center">Podpis Wprowadzającego Broń</div>
          <div class="text-positive">
            Pospis osoby uprawnionej
          </div>
          <q-item>
            <VueSignaturePad id="canvas" ref="signaturePad" height="20vh" style="background-color: white;"/>
          </q-item>
          <q-btn label="wyczyść" color="primary" @click="clear()"></q-btn>
          <q-input label="kod potwierdzający" rounded standout="" type="password"
            v-model="code" bg-color="warning" color="Yellow" class=" text-bold" mask="####" inputmode="numeric"/>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="potwierdź" color="primary" @click="addGun()" v-close-popup />
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
    <q-dialog v-model="newGunType">
      <q-card class="q-pa-md bg-dark text-positive">
        <div class="self-center col full-width no-outline text-center text-h5 text-bold">Nadawanie nowego Typu Broni
        </div>
        <div>
          <q-item><q-input label-color="positive" input-class="text-positive" filled class="full-width col"
              v-model="newGunTypeName" label="Nowa nazwa"></q-input></q-item>
        </div>
        <q-card-section class="col">
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Anuluj" color="secondary" v-close-popup />
          <q-btn label="Utwórz" color="primary" @click=" createNewGunTYpe()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import axios from 'axios'
import App from 'src/App.vue'
import Vue from 'vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import VueSignature from 'vue-signature-pad'
Vue.use(VueSignature)
export default {
  components: {
    Gun: lazyLoadComponent({
      componentFactory: () => import('components/armory/Gun.vue'),
      loading: SkeletonBox
    })
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
        this.getListCalibers()
        this.getGunTypes()
        this.getAllGuns()
      }
    }
  },
  created () {
    this.getListCalibers()
    this.getGunTypes()
    this.getAllGuns()
  },
  data () {
    return {
      mobile: App.mobile,
      selectAllToGunList: false,
      singAddGun: false,
      removedGunsListDial: false,
      gunList: false,
      gunInfo: false,
      gunUUID: null,
      newGunType: false,
      newGunTypeName: null,
      date: null,
      date1: null,
      calibers: [],
      options: [],
      gunListSelect: [],
      gunTypes: [],
      allRemovedGuns: [],
      allGuns: [],
      gunAdding: false,
      barcode: null,
      gunModelName: null,
      gunCaliber: null,
      gunType: null,
      gunSerialNumber: null,
      gunProductionYear: null,
      gunNumberOfMagazines: '',
      gunCertificateSerialNumber: null,
      gunAdditionalEquipment: null,
      gunRecordInEvidenceBook: null,
      gunComment: '',
      gunBarcode: null,
      gunDate: this.createTodayDate(),
      gunBasisForPurchaseOrAssignment: null,
      transportCertificate: false,
      open: false,
      shootingPlace: App.shootingPlace,
      code: null,
      failure: false,
      success: false,
      message: null,
      signature: null,
      local: App.host,
      prod: App.prod
    }
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
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
    selectAllGunTypeToGenerate () {
      this.gunListSelect = []
      if (this.selectAllToGunList) {
        this.gunTypes.forEach(e => {
          this.gunListSelect.push(e.uuid)
        })
      }
    },
    addGun () {
      if (this.gunNumberOfMagazines === '' || this.gunNumberOfMagazines === 0) {
        this.gunNumberOfMagazines = 'BRAK'
      }
      const gun = {
        modelName: this.gunModelName,
        caliber: this.gunCaliber.name,
        gunType: this.gunType.typeName,
        serialNumber: this.gunSerialNumber,
        productionYear: this.gunProductionYear,
        numberOfMagazines: this.gunNumberOfMagazines,
        gunCertificateSerialNumber: this.gunCertificateSerialNumber,
        additionalEquipment: this.gunAdditionalEquipment,
        recordInEvidenceBook: this.gunRecordInEvidenceBook,
        comment: this.gunComment,
        barcode: this.gunBarcode,
        basisForPurchaseOrAssignment: this.gunBasisForPurchaseOrAssignment,
        addedDate: this.gunDate
      }
      const { data } = this.$refs.signaturePad.saveSignature()
      const { isEmpty } = this.$refs.signaturePad.saveSignature()
      const dat = {
        imageString: data,
        gun: gun
      }
      if (!isEmpty) {
        fetch(`${this.local}/armory/addGun?pinCode=${this.code}`, {
          method: 'POST',
          body: JSON.stringify(dat),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              this.message = response
              this.success = true
              this.showloading()
              this.getAllGuns()
              this.autoClose()
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
    createNewGunTYpe () {
      fetch(`${this.local}/armory/newGunTypeName?nameType=${this.newGunTypeName}`, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          this.success = true
          this.message = response
          this.getAllGuns()
          this.autoClose()
        } else {
          this.failure = true
          this.autoClose()
        }
      })
    },
    getGunTypes () {
      fetch(`${this.local}/armory/gunType`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunTypes = response
        })
    },
    getAllGuns () {
      fetch(`${this.local}/armory/getGuns`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.allGuns = response
        })
    },
    getRemovedAllGuns () {
      fetch(`${this.local}/armory/getRemovedGuns`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.allRemovedGuns = response
        })
    },
    getListCalibers () {
      fetch(`${this.local}/armory/calibers`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.calibers = response
        })
    },
    getGunRegistryPdf () {
      axios({
        url: `${this.local}/files/downloadGunRegistry/?guns=${this.gunListSelect}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_broni_w_magazynie.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = 'pobrano dokument'
        this.success = true
        this.autoClose()
      })
    },
    getGunRegistryXlsx () {
      axios({
        url: `${this.local}/files/downloadGunRegistryXlsx/?guns=${this.gunListSelect}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_broni_w_magazynie.xlsx')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = 'pobrano dokument'
        this.success = true
        this.autoClose()
      })
    },
    getGunTransportCertificate () {
      axios({
        url: `${this.local}/files/downloadGunTransportCertificate/?guns=${this.selection}&date=${this.date.replace(/\//gi, '-')}&date1=${this.date1.replace(/\//gi, '-')}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'List_przewozowy.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = 'Wygenerowano dokument'
        this.success = true
        this.autoClose()
      })
    },
    filter (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.calibers.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.calibers.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterGunTypes (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.gunTypes.filter(v => v.typeName.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.gunTypes.filter(v => v.typeName.toLowerCase().indexOf(needle) > -1)
      })
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
