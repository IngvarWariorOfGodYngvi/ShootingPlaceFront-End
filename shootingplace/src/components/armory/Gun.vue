<template>
  <div v-if="gun!=null" class="full-width">
  <q-card class="bg-dark">
        <div :class="!mobile ? 'col' : 'col'" >
          <q-card-section v-if="gun.imgUUID != null" id="layout" style="display: flex; justify-content: center;">
            <q-img spinner-color="white" style="max-height: 50%; max-width: 50%;opacity:0.92" class="flex-center"
              :src="('http://' + local + '/files/getGunImg?gunUUID=' + gun.uuid)" />
          </q-card-section>
          <q-card-section v-if="gun.imgUUID == null && mobile" avatar :class="mobile ? 'col-4' : 'col-2'">
            <q-uploader style="width:100%;height:100%" method="POST" max-file-size="10240000"
              :url="('http://' + local + '/files/addImageToGun?gunUUID=' + gun.uuid)" label="Dodaj zdjęcie"
              accept=".jpg, image/*" @rejected="onRejected" field-name="file" @uploaded="getGun(gun.uuid)" />
          </q-card-section>
          <q-card-section :class="!mobile ? 'row full-width' : 'col'" class="text-positive">
            <div class="col">
            <div class="text-h6 text-center">Informacje o broni</div>
            <div>
              <div class="row"><div class="col-3">Identyfikator:</div><div>{{ gun.uuid }}</div></div>
              <div class="row"><div class="col-3">Dostępność:</div><div>{{ (gun.available ? 'tak' : 'nie') }}</div></div>
              <div class="row"><div class="col-3">Nazwa:</div><div>{{ gun.modelName }}</div></div>
              <div class="row"><div class="col-3">Kaliber:</div><div>{{ gun.caliber }}</div></div>
              <div class="row"><div class="col-3">Rodzaj:</div><div>{{ gun.gunType }}</div></div>
              <div class="row"><div class="col-3">Numer seryjny:</div><div>{{ gun.serialNumber }}</div></div>
              <div class="row"><div class="col-3">Ilość magazynków:</div><div>{{ gun.numberOfMagazines }}</div></div>
              <div class="row"><div class="col-3">Numer Świadectwa:</div><div>{{ gun.gunCertificateSerialNumber }}</div></div>
              <div class="row"><div class="col-3">Pozycja w książce:</div><div>{{ gun.recordInEvidenceBook }}</div></div>
              <div class="row"><div class="col-3">Rok produkcji:</div><div>{{ gun.productionYear }}</div></div>
              <div class="row"><div class="col-3">Podstawa <br/> wpisu:</div><div>{{ gun.basisForPurchaseOrAssignment }}</div></div>
              <div class="row"><div class="col-3">Wyposażenie dodatkowe:</div><div>{{ gun.additionalEquipment }}</div></div>
              <div class="row"><div class="col-3">Uwagi:</div><div>{{ gun.comment }}</div></div>
              <div class="row"><div class="col-3">Numer Kodu Kreskowego:</div><div>{{ gun.barcode }}</div></div>
              <div class="row"><div class="col-3">Data wpisu:</div><div>{{ gun.addedDate }}</div></div>
            </div>
          </div>
          <div class="col">
            <div class="text-h6 text-center">Wydarzenia broni</div>
            <div class="row">
              <div class="col text-bold">Data</div>
              <div class="col text-bold">Rodzaj użycia</div>
              <div class="col text-bold">Dla kogo wydana</div>
            </div>
            <q-virtual-scroll class="full-height" :items="gun.usedHistoryEntityList" style="max-height: 40vh">
              <template class="row" v-slot="{ item }">
                <div class="row col" :style="backgroundDark ? 'border: 1px solid white;' : 'border: 1px solid black;'">
                  <div class="col text-left">{{ convertDateTime(item.dateTime) }}</div>
                  <div class="col text-left">{{ item.usedType }}</div>
                  <div class="col text-left">{{ (item.userName != null ? item.userName : '') }}</div>
                </div>
              </template>
            </q-virtual-scroll>
          </div>
          </q-card-section>
        </div>
        <q-card-section v-if="armory" class="col">
          <div v-if="!mobile" class="q-pa-md text-right">
            <q-btn class="q-ma-xs" color="secondary" :label="gun.available ? 'wydaj do naprawy' : 'odblokuj'"
              @click="(gun.available ? addGunToRepair(gun.uuid) : returnToStore(gun.uuid))"/>
            <q-btn class="q-ma-xs" color="negative" label="usuń z ewidencji"
              @click=" gunUUID = gun.uuid; acceptCode = true" />
            <q-btn class="q-ma-xs" color="primary" label="edytuj" @click="
              gunUUID = gun.uuid;
            gunModelName = gun.modelName;
            gunCaliber = gun.caliber;
            gunType = gun.gunType;
            gunSerialNumber = gun.serialNumber;
            gunProductionYear = gun.productionYear;
            gunNumberOfMagazines = gun.numberOfMagazines;
            gunCertificateSerialNumber = gun.gunCertificateSerialNumber;
            gunAdditionalEquipment = gun.additionalEquipment;
            gunRecordInEvidenceBook = gun.recordInEvidenceBook;
            gunComment = gun.comment;
            gunBasisForPurchaseOrAssignment = gun.basisForPurchaseOrAssignment;
            gunBarcode = gun.barcode;
            gunDate = gun.addedDate;
            editGun = true" />
          </div>
        </q-card-section>
      </q-card>
      <q-dialog v-model="acceptCode" persistent @keypress.enter=" removeGun(); acceptCode = false">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"/></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn label="usuń" color="black" v-close-popup @click=" removeGun(); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editGun">
      <q-card style="width: 600px;" class="bg-dark text-positive">
        <q-card-section class="col">
          <div class="self-center col full-width no-outline text-center text-h6 text-bold">Edytuj informacje o broni</div>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunModelName"
            label="nazwa i marka"/>
          <q-select dense label-color="positive" filled v-model="gunCaliber" options-selected-class="text-positive"
            input-class="text-positive" use-input hide-selected fill-input :options="calibers" options-dense
            popup-content-class="bg-dark text-positive" @filter="filter" label="kaliber">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select dense label-color="positive" input-class="text-positive" filled v-model="gunType"
            options-selected-class="text-positive" use-input hide-selected fill-input :options="options" options-dense
            popup-content-class="bg-dark text-positive" @filter="filterGunTypes" label="typ">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input dense label-color="positive" filled v-model="gunSerialNumber" input-class="text-positive"
            label="numer seryjny"/>
          <q-input dense label-color="positive" filled onkeypress="return (event.charCode > 44 && event.charCode < 58)"
            mask="####" v-model="gunProductionYear" input-class="text-positive" label="rok produkcji"/>
          <q-input dense label-color="positive" filled onkeypress="return (event.charCode > 44 && event.charCode < 58)"
            v-model="gunRecordInEvidenceBook" input-class="text-positive" label="pozycja z książki ewidencji"/>
          <q-input dense label-color="positive" filled onkeypress="return (event.charCode > 44 && event.charCode < 58)"
            v-model="gunNumberOfMagazines" input-class="text-positive" label="ilość magazynków"/>
          <q-input dense label-color="positive" filled v-model="gunCertificateSerialNumber" input-class="text-positive"
            fill-mask="X" label="numer świadectwa"/>
          <q-input dense label-color="positive" filled v-model="gunBasisForPurchaseOrAssignment"
            input-class="text-positive" label="podstawa wpisu"/>
          <q-input dense label-color="positive" filled v-model="gunAdditionalEquipment" input-class="text-positive"
            label="wyposażenie dodatkowe"/>
          <q-input dense label-color="positive" filled v-model="gunComment" input-class="text-positive"
            label="uwagi"/>
          <q-input dense label-color="positive" filled v-model="gunBarcode" input-class="text-positive"
            label="kod kreskowy"/>
          <q-input label-color="positive" input-class="text-positive" class="full-width" filled v-model="gunDate"
            mask="####-##-##" label="data wprowadzenia na stan">
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

        <q-card-actions align="center">
          <q-btn label="usuń zdjęcie" color="secondary" v-close-popup @click="removeGunImage(usedGunInfo.uuid)" />
          <q-btn label="zapisz" color="secondary" v-close-popup @click=" editingGun()" />
          <q-btn label="zamknij" color="primary" v-close-popup />
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
// import { isWindows } from 'mobile-device-detect'
export default {
  created () {
    this.getGun(this.uuid)
    this.getGunTypes()
    this.getListCalibersSelect()
  },
  props: {
    uuid: {
      type: String,
      required: true
    },
    armory: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    uuid (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getGun(this.uuid)
      }
    }
  },
  data () {
    return {
      mobile: App.mobile,
      backgroundDark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      gun: '',
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
      gunBasisForPurchaseOrAssignment: null,
      gunDate: this.createTodayDate(),
      options: [],
      editGun: false,
      calibers: [],
      gunTypes: [],
      code: null,
      message: '',
      failure: false,
      success: false,
      acceptCode: false,
      local: App.host
    }
  },
  methods: {
    convertDateTime (dateTime) {
      if (dateTime !== null) {
        dateTime = dateTime.replace('T', ' ')
        dateTime = dateTime.substring(0, 19)
        return dateTime
      }
    },
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
    getGun (gunUUID) {
      fetch(`http://${this.local}/armory/getGun?gunUUID=${gunUUID}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gun = response
        })
    },
    getListCalibersSelect () {
      fetch(`http://${this.local}/armory/calibersList`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.calibers = response
        })
    },
    getGunTypes () {
      fetch(`http://${this.local}/armory/gunType`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunTypes = response
        })
    },
    onRejected () {
      this.message = 'Nie można dodać, sprawdź rozmiar pliku i jego typ'
      this.failure = true
      this.autoClose()
    },
    removeGun () {
      fetch(`http://${this.local}/armory/remove?gunUUID=${this.gunUUID}&pinCode=${this.code}`, {
        method: 'PUT'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.showloading()
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
    editingGun () {
      if (this.gunNumberOfMagazines === '' || this.gunNumberOfMagazines === 0) {
        this.gunNumberOfMagazines = 'BRAK'
      }
      const data = {
        uuid: this.gunUUID,
        modelName: this.gunModelName,
        caliber: this.gunCaliber,
        gunType: this.gunType,
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
      fetch(`http://${this.local}/armory/editGun`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.gunAdding = false
              this.gunModelName = null
              this.gunCaliber = null
              this.gunType = null
              this.gunSerialNumber = null
              this.gunProductionYear = null
              this.gunNumberOfMagazines = ''
              this.gunCertificateSerialNumber = null
              this.gunAdditionalEquipment = ''
              this.gunRecordInEvidenceBook = null
              this.gunComment = ''
              this.gunBarcode = null
              this.gunBasisForPurchaseOrAssignment = null
              this.$emit('editingGun')
              this.getGun(this.uuid)
              this.showloading()
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
    returnToStore (gunUUID) {
      const list = [gunUUID]
      fetch(`http://${this.local}armory/returnToStore?gunsUUID=${list}`, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.getGun(gunUUID)
            this.message = response
            this.success = true
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
    addGunToRepair (gunUUID) {
      fetch(`http://${this.local}/armory/addGunToRepair?gunUUID=${gunUUID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.getGun(gunUUID)
            this.message = response
            this.success = true
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
    filter (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.calibers.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.calibers.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterGunTypes (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.gunTypes.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.gunTypes.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    autoClose () {
      setTimeout(() => {
        this.ammunitionListAlert = false
        this.success = false
        this.failure = false
        this.message = null
        this.gunBarcode = null
        this.code = null
      }, 2000)
    }
  }
}
</script>
