<template>
  <div>
    <q-card class="text-body2 bg-dark">
      <div class="row">
        <div class="q-pa-md text-left col full-width no-outline text-h5 text-bold text-positive">Ilość osób {{ list.length }}
        </div>
        <div class="q-pa-md text-right">
          <q-btn v-if="!mobile" dense color="primary" @click="memberName='WSZYSCY - którzy mają zaznaczone opłacono w PZSS'; prolongLicenseAlertAll=true"
                 label="przedłuż zaznaczone">({{ licenseList.length }})
          </q-btn>
        </div>
      </div>
      <div class="row text-caption" style="cursor: pointer">
        <div class="col" @click="sortF('name')">lp <q-icon size="2em" :name="sortName ? 'arrow_drop_up' : 'arrow_drop_down'" />Nazwisko i imię</div>
        <div class="col-1" @click="sortF('status')"><q-icon size="2em" :name="sortStatus ? 'arrow_drop_up' : 'arrow_drop_down'" />Status</div>
        <div class="col-2 text-center" @click="sortF('license')"><q-icon size="2em" :name="sortLicense ? 'arrow_drop_up' : 'arrow_drop_down'" />Numer Licencji</div>
        <div class="col-2" @click="sortF('group')"><q-icon size="2em" :name="sortGroup ? 'arrow_drop_up' : 'arrow_drop_down'" />Grupa</div>
        <div class="col-2" @click="sortF('valid')"><q-icon size="2em" :name="sortValid ? 'arrow_drop_up' : 'arrow_drop_down'" />Ważność licencji</div>
        <div class="col-2">Czynności</div>
      </div>
      <q-scroll-area style="height: 50vh">
        <div v-show="!visible">
          <div v-for="(item, index) in list" :key="index" class="row hover1 items-center" @dblclick="legitimationNumber = item.legitimationNumber;memberDial=true">
            <Tooltip2clickToShow></Tooltip2clickToShow>
            <q-checkbox dense v-if="item.license.paid" v-model="licenseList" value="" :val="item.uuid" left-label>
              {{ index + 1 }}.
            </q-checkbox>
            <q-checkbox value="" dense color="grey" v-else disable left-label>{{ index + 1 }}.</q-checkbox>
            <div class="col">&nbsp;
              {{ item.secondName }} {{ item.firstName }}
            </div>
            <div :class="`col-1 ${item.active?'':'bg-red-4 text-black'}`" style="border-radius: 2px">
              {{ item.active?'Aktywny':'Nieaktywny'}}
            </div>
            <div class="col-2 text-center">
              {{ item.license.number }}
            </div>
            <div class="col-2">
              {{ item.adult?'Grupa Ogólna':'Grupa Młodzieżowa'}}
            </div>
            <div class="col-2">
              {{ convertDate(item.license.validThru) }}
            </div>
            <div class="col-2">
              <q-tooltip v-if="!item.license.paid && !item.active" content-class="bg-red text-subtitle2" anchor="top middle">UREGULUJ SKŁADKI</q-tooltip>
            <q-btn dense disable color="grey-8" v-if="!item.license.paid && !item.active" class="fit"
                   label="opłać licencję">
            </q-btn>
            <q-btn dense color="secondary" v-if="!item.license.paid && item.active" class="fit"
                   @click="memberName = item.firstName + item.secondName;memberUUID = item.uuid;paymentLicenseAlert = true">
              opłać licencję
            </q-btn>
            <div v-if="item.license.paid" class="col-2"></div>
            <q-btn dense color="primary" v-if="item.license.paid" disable label="opłacona" class="fit"/>
            </div>
          </div>
        </div>
            <q-inner-loading
              :showing="visible"
              label="Ładowanie..."
              color="primary"/>
      </q-scroll-area>
    </q-card>
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card style="min-width: 80vw" class="bg-dark">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="legitimationNumber" @hook:destroyed="getMembersWithLicense()"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup @click="pinCode=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="prolongLicenseAlert">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Czy przedłużyć licencję {{ memberName }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="primary" v-close-popup/>
          <q-btn text-color="white" label="Przedłuż" color="primary" v-close-popup
                 @click="prolongLicense (memberUUID, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="prolongLicenseAlertAll" @keypress.enter="pinWindow=true;prolongLicenseAlertAll=false">
      <q-card  class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Czy przedłużyć licencję {{ memberName }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="primary" v-close-popup/>
          <q-btn text-color="white" label="Przedłuż" color="primary" v-close-popup @click="pinWindow=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="pinWindow">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="prolongLicenseList(pinCode);pinWindow=false" autofocus type="password" v-model="pinCode"
                   filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="pinCode=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup @click="prolongLicenseList(pinCode);pinCode=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="paymentLicenseAlert">
      <q-card  class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Czy opłacić licencję {{ memberName }}?</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="primary" v-close-popup/>
          <q-btn text-color="white" label="Opłać" color="primary" v-close-popup
                 @click="pinPaymentLicense=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="pinPaymentLicense">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="addLicenseHistoryPayment (memberUUID, pinCode);pinPaymentLicense=false" autofocus type="password"
                   v-model="pinCode" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="pinCode=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup @click="addLicenseHistoryPayment (memberUUID, pinCode); pinCode=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
          <div v-else class="text-h6">Nie można wykonać żądania. Sprawdź poprawność danych.</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import Vue from 'vue'
import SmoothScrollbar from 'vue-smooth-scrollbar'
Vue.use(SmoothScrollbar)
export default {
  name: 'LicensesQualifyingToProlong',
  data () {
    return {
      mobile: App.mobile,
      main: App.main,
      visible: true,
      list: [],
      licenseList: [],
      sortName: false,
      sortStatus: false,
      sortGroup: false,
      sortLicense: false,
      sortValid: false,
      memberName: '',
      memberDial: false,
      memberUUID: false,
      legitimationNumber: null,
      pinCode: null,
      pinWindow: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      prolongLicenseAlert: false,
      prolongLicenseAlertAll: false,
      paymentLicenseAlert: false,
      pinPaymentLicense: false,
      search: null,
      success: false,
      failure: false,
      message: null,
      local: App.host
    }
  },
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
  created () {
    this.getMembersWithLicense()
  },
  methods: {
    getMembersWithLicense () {
      fetch(`${this.local}/license/LicensesQualifyingToProlong`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.list = response
          this.visible = false
        })
    },
    searchText (text) {
      console.log(text)
    },
    convertDate (date) {
      const current = new Date(date)
      let month = current.getMonth() + 1
      let day = current.getDate()
      if (day < 10) {
        day = '0' + day
      }
      if (month + 1 < 10) {
        month = '0' + (month + 1)
      }
      return day + '-' + (month) + '-' + current.getFullYear()
    },
    prolongLicense (uuid, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      const data = {
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission
      }
      fetch(`${this.local}/license/${uuid}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.licensePistolPermission = false
              this.licenseRiflePermission = false
              this.licenseShotgunPermission = false
              this.getMembersWithLicense()
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
    prolongLicenseList (pinCode) {
      fetch(`${this.local}/license/prolongAll?licenseList=${this.licenseList}&pinCode=${pinCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.licensePistolPermission = false
              this.licenseRiflePermission = false
              this.licenseShotgunPermission = false
              this.licenseList = []
              this.getMembersWithLicense()
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
    addLicenseHistoryPayment (uuid, pinCode) {
      fetch(`${this.local}/license/history/${uuid}?pinCode=${pinCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.getMembersWithLicense()
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
    sortF (type) {
      if (type === 'name') {
        if (!this.sortName) {
          this.list.sort((a, b) => ('' + b.secondName).localeCompare(a.secondName))
          this.sortName = !this.sortName
        } else {
          this.list.sort((a, b) => ('' + a.secondName).localeCompare(b.secondName))
          this.sortName = !this.sortName
        }
      }
      if (type === 'status') {
        if (!this.sortStatus) {
          this.list.sort((a, b) => b.active - a.active)
          this.sortStatus = !this.sortStatus
        } else {
          this.list.sort((a, b) => a.active - b.active)
          this.sortStatus = !this.sortStatus
        }
      }
      if (type === 'license') {
        if (!this.sortLicense) {
          this.list.sort((a, b) => b.license.number - a.license.number)
          this.sortLicense = !this.sortLicense
        } else {
          this.list.sort((a, b) => a.license.number - b.license.number)
          this.sortLicense = !this.sortLicense
        }
      }
      if (type === 'group') {
        if (!this.sortGroup) {
          this.list.sort((a, b) => b.adult - a.adult)
          this.sortGroup = !this.sortGroup
        } else {
          this.list.sort((a, b) => a.adult - b.adult)
          this.sortGroup = !this.sortGroup
        }
      }
      if (type === 'valid') {
        if (!this.sortDate) {
          this.list.sort((a, b) => new Date(b.license.validThru) - new Date(a.license.validThru))
          this.sortDate = !this.sortDate
        } else {
          this.list.sort((a, b) => new Date(a.license.validThru) - new Date(b.license.validThru))
          this.sortDate = !this.sortDate
        }
      }
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.message = null
        this.pinCode = null
      }, 2000)
    }
  }
}
</script>
