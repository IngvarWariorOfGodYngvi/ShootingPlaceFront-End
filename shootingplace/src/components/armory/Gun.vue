<template>
  <div v-if="gun != null && !close" style="min-width: 50vw;">
    <q-card class="bg-dark text-positive">
        <q-card-actions align="right">
          <div class="text-h6 text-center text-bold col">Informacje o Broni</div>
          <q-btn dense color="primary" icon="close" round v-close-popup></q-btn>
        </q-card-actions>
      <q-card-section class="col">
        <div class="col text-caption">
          <div class="row col">
            <div class="col">Identyfikator:</div>
            <div class="col">{{ gun.uuid }}</div>
          </div>
          <div class="row col">
            <div class="col">Nazwa:</div>
            <div class="col">{{ gun.modelName }}</div>
          </div>
          <div class="row col">
            <div class="col">Kaliber:</div>
            <div class="col">{{ gun.caliber }}</div>
          </div>
          <div class="row col">
            <div class="col">Rodzaj:</div>
            <div class="col">{{ gun.gunType }}</div>
          </div>
          <div class="row col">
            <div class="col">Numer seryjny:</div>
            <div class="col">{{ gun.serialNumber }}</div>
          </div>
          <div class="row col">
            <div class="col">Ilość magazynków:</div>
            <div class="col">{{ gun.numberOfMagazines }}</div>
          </div>
          <div class="row col">
            <div class="col">Numer Świadectwa:</div>
            <div class="col">{{ gun.gunCertificateSerialNumber }}</div>
          </div>
          <div class="row col">
            <div class="col">Pozycja w książce:</div>
            <div class="col">{{ gun.recordInEvidenceBook != null ? gun.recordInEvidenceBook : 'Brak' }}</div>
          </div>
          <div class="row col">
            <div class="col">Rok produkcji:</div>
            <div class="col">{{ gun.productionYear != null ? gun.productionYear : 'Nieznany' }}</div>
          </div>
          <div class="row col">
            <div class="col">Podstawa wpisu:</div>
            <div class="col">{{ gun.basisForPurchaseOrAssignment }}</div>
          </div>
          <div class="row col">
            <div class="col">Wyposażenie dodatkowe:</div>
            <div class="col">{{ gun.additionalEquipment != null ? gun.additionalEquipment : 'Brak' }}</div>
          </div>
          <div class="row col">
            <div class="col">Uwagi:</div>
            <div class="col">{{ gun.comment }}</div>
          </div>
          <div class="row col">
            <div class="col">Data wpisu:</div>
            <div class="col">{{ gun.addedDate }}</div>
          </div>
          <div class="row col">
            <div class="col">Wpisane przez:</div>
            <div class="col">{{ gun.addedBy != null ? gun.addedBy : 'Nie wskazano' }}</div>
          </div>
          <div class="row col" v-if="gun.removedBy!=null">
            <div class="col">Usunięte przez:</div>
            <div class="col">{{ gun.removedBy != null ? gun.removedBy : 'Nie wskazano' }}</div>
          </div>
        </div>
        <div class="col">
          <div>Podpis wprowadzającego broń:</div>
            <q-img contain style="max-height: 10vh; border-radius: 5px; border: 1px solid black; " class="bg-white"
            alt="Podpis wprowadzającego broń" :src="(`${local}/files/getFile?uuid=${gun.addedSign}`)" />
          <!-- <div>{{ gun.addedSign != null ? gun.addedSign : 'Brak podpisu' }}</div> -->
        </div>
        <div class="row col" v-if="gun.removedBy!=null">
          <div class="col">Data usunięcia:</div>
          <div class="col">{{ gun.removedDate }}</div>
        </div>
        <div class="row col" v-if="gun.removedBy!=null">
          <div class="col">Podstawa usunięcia:</div>
          <div class="col">{{ gun.basisOfRemoved }}</div>
        </div>
        <div class="col" v-if="gun.removedBy!=null">
          <div>Podpis usuwającego broń:</div>
          <q-img contain style="max-height: 10vh; border-radius: 5px; border: 1px solid black; " class="bg-white"
            alt="Podpis usuwającego broń" :src="(`${local}/files/getFile?uuid=${gun.removedSign}`)" />
          <!-- <div>{{ gun.removedSign != null ? gun.removedSign : 'Brak podpisu' }}</div> -->
        </div>
      </q-card-section>
      <q-card-section v-if="!close" class="col">
        <div v-if="!mobile" class="q-pa-md text-right">
          <q-btn dense glossy class="q-ma-xs" color="secondary" label="pokaż historię użycia" @click="gunUsedInfoDial=true"></q-btn>
          <q-btn dense glossy class="q-ma-xs" color="negative" label="usuń z ewidencji"
            @click=" gunUUID = gun.uuid; signRemoveGun = true" />
          <q-btn dense glossy class="q-ma-xs" color="primary" label="edytuj" @click="
            gunUUID = gun.uuid;
          gunModelName = gun.modelName;
          gunCaliber.name = gun.caliber;
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
    <q-dialog v-model="signRemoveGun" @keypress.enter=" removeGun(); signRemoveGun = false">
      <q-card class="bg-dark text-positive q-pa-xs" style="min-width: 70vw;">
        <q-card-section>
          <div class="text-h6 text-center">Podpis Usuwającego Broń</div>
          <q-input label="podstawa wykreślenia z ewidencji" label-color="white" filled v-model="basisOfRemoved"
            bg-color="primary" color="white" class="q-pa-xs text-bold" />
          <q-input label="kod potwierdzający" rounded standout="" type="password" v-model="code" bg-color="warning"
            color="Yellow" class=" text-bold" mask="####" inputmode="numeric" />
          <div class="text-positive">
            Pospis osoby uprawnionej
          </div>
          <VueSignaturePad id="canvas" ref="signaturePad" style="height: 25vh;background-color: white;">
          </VueSignaturePad>
          <q-btn label="wyczyść" color="primary" @click="clear()"></q-btn>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="potwierdź" color="primary" @click="removeGun()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editGun">
      <q-card style="min-width: 60vw;" class="bg-dark text-positive">
        <q-card-section class="col">
          <div class="self-center col full-width no-outline text-center text-h6 text-bold">Edytuj informacje o broni
          </div>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunModelName"
            label="nazwa i marka" />
          <q-select dense label-color="positive" filled v-model="gunCaliber" options-selected-class="text-positive"
            input-class="text-positive" use-input hide-selected fill-input :options="calibers" options-dense
            :option-value="opt => opt !== '' ? Object(opt.name).toString() : ''"
            :option-label="opt => opt !== '' ? Object(opt.name).toString() : ''"
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
            :option-value="opt => opt !== '' ? Object(opt.typeName).toString() : ''"
            :option-label="opt => opt !== '' ? Object(opt.typeName).toString() : ''"
            options-selected-class="text-positive" hide-selected fill-input :options="gunTypes" options-dense
            popup-content-class="bg-dark text-positive" label="typ">
          </q-select>
          <q-input dense label-color="positive" filled v-model="gunSerialNumber" input-class="text-positive"
            label="numer seryjny" />
          <q-input dense label-color="positive" filled onkeypress="return (event.charCode > 44 && event.charCode < 58)"
            mask="####" v-model="gunProductionYear" input-class="text-positive" label="rok produkcji" />
          <q-input dense label-color="positive" filled onkeypress="return (event.charCode > 44 && event.charCode < 58)"
            v-model="gunRecordInEvidenceBook" input-class="text-positive" label="pozycja z książki ewidencji" />
          <q-input dense label-color="positive" filled onkeypress="return (event.charCode > 44 && event.charCode < 58)"
            v-model="gunNumberOfMagazines" input-class="text-positive" label="ilość magazynków" />
          <q-input dense label-color="positive" filled v-model="gunCertificateSerialNumber" input-class="text-positive"
            fill-mask="X" label="numer świadectwa" />
          <q-input dense label-color="positive" filled v-model="gunBasisForPurchaseOrAssignment"
            input-class="text-positive" label="podstawa wpisu" />
          <q-input dense label-color="positive" filled v-model="gunAdditionalEquipment" input-class="text-positive"
            label="wyposażenie dodatkowe" />
          <q-input dense label-color="positive" filled v-model="gunComment" input-class="text-positive" label="uwagi" />
          <q-input dense label-color="positive" filled v-model="gunBarcode" input-class="text-positive"
            label="kod kreskowy" />
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
    <q-dialog v-model="gunUsedInfoDial">
      <q-card class="bg-dark text-positive" style="min-width: 75vw">
        <q-card-actions align="right">
          <div class="text-h6 text-center text-bold col">Historia Wydawania Broni</div>
          <q-btn dense color="primary" icon="close" round v-close-popup></q-btn>
        </q-card-actions>
        <q-card-section>
          <div class="row items-center col text-positive text-bold text-body2 q-pa-xs">
            <div style="width: 3%;">Lp</div>
            <div class="col">Data i<br />Godzina Wydania</div>
            <div class="col">Marka i Model</div>
            <div class="col">Numer i Seria</div>
            <div class="col">Numer<br />Świadectwa Broni</div>
            <div class="col">Imię i Nazwisko<br />Pobierającego Broń</div>
            <div class="col">Imię i Nazwisko<br />Wydającego Broń</div>
            <div class="col">Podpis Zdającego Broń</div>
            <div class="col">Podpis Przyjmującego Broń</div>
            <div class="col">Data i<br />Godzina Przyjęcia</div>
          </div>
          <div class="line"></div>
        <div class="row col xyz1 items-center text-bold" v-for="(item, index) in gun.gunUsedList" :key="index"
          @dblclick="gunUsedUUID = item.uuid; temp = item; gunUsedInfo = true">
          <Tooltip2clickToShow />
          <div style="width: 3%;" class="text-center">{{ index + 1 }}</div>
          <div class="col">
            <div>{{ item.issuanceDate }}</div>
            <div>{{ item.issuanceTime }}</div>
          </div>
          <div class="col">{{ gun.modelName }}</div>
          <div class="col">{{ gun.serialNumber }}</div>
          <div class="col">{{ gun.gunCertificateSerialNumber }}</div>
          <div class="col">{{ item.gunTakerName }}</div>
          <div class="col">{{ item.issuanceBy }}</div>
          <div class="col">{{ item.gunReturnerName }}</div>
          <div class="col">{{ item.acceptanceBy }}</div>
          <div class="col">
              <div>{{ item.acceptanceDate }}</div>
              <div>{{ item.acceptanceTime }}</div>
            </div>
          <div class="line"></div>
        </div>
        </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="gunUsedInfo">
        <GunUsedInfo :uuid="gunUsedUUID"/>
      </q-dialog>
  </div>
</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
export default {
  created () {
    this.getGun(this.uuid)
    this.getGunTypes()
    this.getListCalibers()
  },
  components: {
    Tooltip2clickToShow: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickToShow.vue'),
      loading: SkeletonBox
    }),
    GunUsedInfo: lazyLoadComponent({
      componentFactory: () => import('components/armory/GunUsedInfo.vue'),
      loading: SkeletonBox
    })
  },
  props: {
    uuid: {
      type: String,
      required: true
    },
    close: {
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
      gunUsedInfoDial: false,
      gunUsedInfo: false,
      gun: '',
      gunUsedUUID: '',
      basisOfRemoved: '',
      gunModelName: '',
      gunCaliber: {},
      gunType: '',
      gunSerialNumber: '',
      gunProductionYear: '',
      gunNumberOfMagazines: '',
      gunCertificateSerialNumber: '',
      gunAdditionalEquipment: '',
      gunRecordInEvidenceBook: '',
      gunComment: '',
      gunBarcode: '',
      gunBasisForPurchaseOrAssignment: '',
      gunDate: this.createTodayDate(),
      options: [],
      editGun: false,
      calibers: [],
      gunTypes: [],
      signRemoveGun: false,
      code: null,
      message: '',
      failure: false,
      success: false,
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
      fetch(`${this.local}/armory/getGun?gunUUID=${gunUUID}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gun = response
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
    getGunTypes () {
      fetch(`${this.local}/armory/gunType`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunTypes = response
        })
    },
    removeGun () {
      const { data } = this.$refs.signaturePad.saveSignature()
      const { isEmpty } = this.$refs.signaturePad.saveSignature()
      const dat = {
        imageString: data
      }
      if (!isEmpty) {
        fetch(`${this.local}/armory/remove?gunUUID=${this.gunUUID}&basisOfRemoved=${this.basisOfRemoved}&pinCode=${this.code}`, {
          method: 'PUT',
          body: JSON.stringify(dat),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              this.message = response
              this.success = true
              this.$emit('removeGun')
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
      fetch(`${this.local}/armory/editGun`, {
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
