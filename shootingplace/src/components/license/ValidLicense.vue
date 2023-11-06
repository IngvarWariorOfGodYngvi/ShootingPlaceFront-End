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
      <q-scroll-area style="height: 50vh">
        <div v-show="!visible">
          <div v-for="(item, index) in list" :key="index" class="row hover1" @dblclick="legitimationNumber = item.legitimationNumber;memberDial=true">
            <Tooltip2clickToShow></Tooltip2clickToShow>
            <q-checkbox dense v-if="item.license.paid" v-model="licenseList" value="" :val="item.uuid" left-label>
              {{ index + 1 }}.
            </q-checkbox>
            <q-checkbox value="" dense color="grey" v-else disable left-label>{{ index + 1 }}.</q-checkbox>
            <div class="col">
              <div>
                <label>&nbsp;Nazwisko i Imię</label>
                  <div>&nbsp;{{ item.secondName }}
                    {{ item.firstName }}
                  </div>
              </div>
            </div>
            <div :class="item.active?'col-1':'col-1 bg-red-4'" style="border-radius: 2px">
              <label :class="item.active?'':'text-black'">Status</label>
              <div :class="item.active?'':'text-black'" >{{item.active?'Aktywny':'Nieaktywny'}}</div>
            </div>
            <div class="col-2">
              <label>Numer Licencji</label>
              <div>
                {{ item.license.number }}
              </div>
            </div>
            <div class="col-2">
              <label>Grupa</label>
              <div>{{item.adult?'Grupa Ogólna':'Grupa Młodzieżowa'}}
              </div>
            </div>
            <div class="col-2">
                <label>Ważność licencji</label>
                <div>
                  {{ convertDate(item.license.validThru) }}
                </div>
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
              label="Przetwarzanie..."
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
import { isWindows } from 'mobile-device-detect'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import Vue from 'vue'
import SmoothScrollbar from 'vue-smooth-scrollbar'
Vue.use(SmoothScrollbar)
export default {
  name: 'ValidLicense',
  data () {
    return {
      mobile: !isWindows,
      main: App.main,
      visible: true,
      list: [],
      licenseList: [],
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
      fetch('http://' + this.local + '/license/membersWithValidLicense', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.list = response
          setTimeout(() => {
            this.visible = false
          }, 2000)
        })
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
      fetch('http://' + this.local + '/license/' + uuid, {
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
      fetch('http://' + this.local + '/license/prolongAll?licenseList=' + this.licenseList + '&pinCode=' + pinCode, {
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
      fetch('http://' + this.local + '/license/history/' + uuid + '?pinCode=' + pinCode, {
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
