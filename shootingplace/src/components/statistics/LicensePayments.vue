<template>
  <div>
    <div class="text-body2 bg-dark text-positive" style="border: 0">
      <div class="col">
        <q-card-section class="col-3">
          <q-item class="col">
            <q-input class="full-width" bg-color="primary" standout="" rounded input-class="text-positive"
              label-color="positive" dense v-model="firstDateLicense" mask="####-##-##" label="Data początkowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input="getSumLicensed()" v-model="firstDateLicense" mask="YYYY-MM-DD"
                      class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <q-item class="col">
            <q-input class="full-width" bg-color="secondary" standout="" rounded input-class="text-positive"
              label-color="positive" dense v-model="secondDateLicense" mask="####-##-##" label="Data końcowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input="getSumLicensed()" v-model="secondDateLicense" mask="YYYY-MM-DD"
                      class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <div class="q-pa-md">
            <q-btn glossy color="primary" text-color="positive" @click="getSumLicensed()">Wyszukaj</q-btn>
          </div>
          <div class="row">
            <q-radio @input="paid = null; newLicense = null; getSumLicensed()" v-model="allLicense"
              :val="true">Wszystkie</q-radio>
            <q-radio @input="allLicense = false; newLicense = null; rearrangeSumLicensedTable()" v-model="paid"
              :val="true">Opłacone</q-radio>
            <q-radio @input="allLicense = false; newLicense = null; rearrangeSumLicensedTable()" v-model="paid"
              :val="false">Nieopłacone</q-radio>
            <q-radio @input="allLicense = false; paid = null; rearrangeSumLicensedTable()" v-model="newLicense"
              :val="true">Nowe</q-radio>
          </div>
          <div v-if="licenseArray.length > 0" class="row">
            <q-btn glossy color="primary" @click="toggleLicenseAlert = true">Zatwierdź opłacenie zaznaczonych</q-btn>
          </div>
        </q-card-section>
        <q-card-section class="col">
          <div v-if="quantitySumLicenseRearrangeTable.length < 1"
            class="q-pa-md self-center no-outline text-bold text-center text-h6">Brak wyników opłaconych licencji -
            Wybierz daty
          </div>
          <div v-if="quantitySumLicenseRearrangeTable.length > 0"
            class="q-pa-md self-center no-outline text-bold text-center text-h6">Ilość Opłat :
            {{ quantitySumLicenseRearrangeTable.length }}</div>
          <div class="row text-caption items-center" style="cursor: pointer">
            <div class="col-3" @click="sortF('name')">lp <q-icon size="2em"
                :name="sortName ? 'arrow_drop_up' : 'arrow_drop_down'" />Nazwisko i imię</div>
            <div class="col text-center" @click="sortF('legitimation')"><q-icon size="2em"
                :name="sortLegitimation ? 'arrow_drop_up' : 'arrow_drop_down'" />Numer<br> Legitymacji</div>
            <div class="col" @click="sortF('group')"><q-icon size="2em"
                :name="sortGroup ? 'arrow_drop_up' : 'arrow_drop_down'" />Grupa</div>
            <div class="col" @click="sortF('status')"><q-icon size="2em"
                :name="sortStatus ? 'arrow_drop_up' : 'arrow_drop_down'" />Status</div>
            <div class="col" @click="sortF('date')"><q-icon size="2em"
                :name="sortDate ? 'arrow_drop_up' : 'arrow_drop_down'" />Data Opłaty</div>
            <div class="col-1 text-center" @click="sortF('payed')"><q-icon size="2em"
                :name="sortPayed ? 'arrow_drop_up' : 'arrow_drop_down'" />Opłacone w<br />PZSS</div>
            <div class="col text-center" @click="sortF('prolong')"><q-icon size="2em"
                :name="sortProlong ? 'arrow_drop_up' : 'arrow_drop_down'" />Nowa /<br />Przedłużenie</div>
          </div>
          <q-scroll-area style="height: 50vh">
            <div v-for="(item, index) in quantitySumLicenseRearrangeTable" :key="index"
              class="row hover1 items-center text-center"
              @dblclick="legitimationNumber = item.legitimationNumber; memberDial = true">
              <Tooltip2clickToShow></Tooltip2clickToShow>
              <div class="col-3 text-left">{{ index + 1 }}&nbsp;
                {{ item.secondName }} {{ item.firstName }}
              </div>
              <div class="col text-center">
                {{ item.legitimationNumber }}
              </div>
              <div class="col">
                {{ item.adult ? 'Grupa Ogólna' : ' Grupa Młodzieżowa' }}
              </div>
              <div :class="`col-2 ${item.active ? 'bg-green-4' : 'bg-red-4'} text-black text-center`"
                style="border-radius: 2px">
                {{ item.active ? 'Aktywny' : 'Nieaktywny' }}
              </div>
              <div class="col">
                {{ item.date }}
              </div>
              <div class="col-1 text-black" :class="item.payInPZSSPortal ? 'bg-green-3' : 'bg-red-3'">
                {{ item.payInPZSSPortal ? 'Opłacone' : 'Nieopłacone' }}
              </div>
              <div class="col" :class="item.new ? 'bg-warning text-black' : ''">
                {{ item.new ? 'Nowa' : 'Przedłużenie' }}
              </div>
            </div>
          </q-scroll-area>
        </q-card-section>
      </div>
    </div>
    <q-dialog v-model="memberDial">
      <q-card style="min-width: 80vw" class="bg-dark">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="legitimationNumber"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="toggleLicenseAlert" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input @keypress.enter="toggleHistoryPayment(); toggleLicenseAlert = false" autofocus type="password"
              v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn id="3" label="Zatwierdź zmiany" color="black" v-close-popup @click="toggleHistoryPayment()" />
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
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
export default {
  name: 'LicensePayments',
  components: {
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    }),
    Tooltip2clickToShow: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickToShow.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      memberDial: false,
      toggleLicenseAlert: false,
      legitimationNumber: null,
      firstDateLicense: null,
      paid: null,
      newLicense: null,
      allLicense: true,
      sortName: false,
      sortLegitimation: false,
      sortDate: false,
      sortStatus: false,
      sortGroup: false,
      sortPayed: false,
      sortProlong: false,
      secondDateLicense: this.createTodayDate(),
      quantitySumLicense: [],
      quantitySumLicenseRearrangeTable: [],
      licenseArray: [],
      failure: false,
      success: false,
      message: null,
      code: null,
      mobile: App.mobile,
      local: App.host
    }
  },
  methods: {
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
      return date.getFullYear() + '/' + month + '/' + day
    },
    sortF (type) {
      if (type === 'name') {
        if (!this.sortName) {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => ('' + b.secondName).localeCompare(a.secondName))
          this.sortName = !this.sortName
        } else {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => ('' + a.secondName).localeCompare(b.secondName))
          this.sortName = !this.sortName
        }
      }
      if (type === 'status') {
        if (!this.sortStatus) {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => b.active - a.active)
          this.sortStatus = !this.sortStatus
        } else {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => a.active - b.active)
          this.sortStatus = !this.sortStatus
        }
      }
      if (type === 'group') {
        if (!this.sortGroup) {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => b.adult - a.adult)
          this.sortGroup = !this.sortGroup
        } else {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => a.adult - b.adult)
          this.sortGroup = !this.sortGroup
        }
      }
      if (type === 'legitimation') {
        if (!this.sortLicense) {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => b.legitimationNumber - a.legitimationNumber)
          this.sortLicense = !this.sortLicense
        } else {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => a.legitimationNumber - b.legitimationNumber)
          this.sortLicense = !this.sortLicense
        }
      }
      if (type === 'date') {
        if (!this.sortDate) {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => new Date(b.date) - new Date(a.date))
          this.sortDate = !this.sortDate
        } else {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => new Date(a.date) - new Date(b.date))
          this.sortDate = !this.sortDate
        }
      }
      if (type === 'payed') {
        if (!this.sortPayed) {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => new Date(b.payInPZSSPortal) - new Date(a.payInPZSSPortal))
          this.sortPayed = !this.sortPayed
        } else {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => new Date(a.payInPZSSPortal) - new Date(b.payInPZSSPortal))
          this.sortPayed = !this.sortPayed
        }
      }
      if (type === 'prolong') {
        if (!this.sortProlong) {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => new Date(b.new) - new Date(a.new))
          this.sortProlong = !this.sortProlong
        } else {
          this.quantitySumLicenseRearrangeTable.sort((a, b) => new Date(a.new) - new Date(b.new))
          this.sortProlong = !this.sortProlong
        }
      }
    },
    getSumLicensed () {
      fetch(`${this.local}/statistics/licenseSum?firstDate=${this.firstDateLicense.replace(/\//gi, '-')}&secondDate=${this.secondDateLicense.replace(/\//gi, '-')}`, {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySumLicense = response
          this.quantitySumLicenseRearrangeTable = response
          this.allLicense = true
        })
      })
    },
    rearrangeSumLicensedTable () {
      const arr = this.quantitySumLicense
      const arr1 = []
      if (this.paid !== null) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].payInPZSSPortal === this.paid) {
            arr1.push(arr[i])
          }
        }
      }
      if (this.newLicense === true) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].new === true) {
            arr1.push(arr[i])
          }
        }
      }
      this.quantitySumLicenseRearrangeTable = arr1
    },
    toggleHistoryPayment () {
      fetch(`${this.local}/license/paymentToggleArray?paymentUUIDs=${this.licenseArray}&pinCode=${this.code}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.allLicense = true
              this.paid = null
              this.quantitySumLicense = []
              this.licenseArray = []
              this.getSumLicensed()
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.success = false
        this.message = null
        this.code = null
      }, 2000)
    }
  }
}
</script>

<style scoped></style>
