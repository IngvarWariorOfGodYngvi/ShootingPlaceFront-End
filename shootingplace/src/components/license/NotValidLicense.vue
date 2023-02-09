<template>
  <div>
    <q-card class="text-body2 bg-dark">
      <div class="row">
        <div class="q-pa-md text-left col full-width no-outline text-h5 text-bold text-positive">Ilość osób {{ list.length }}
        </div>
        <div v-if="licenseList.length>0" class="q-pa-md text-right">
          <q-btn @click="prolongLicenseAlert=true" label="Przedłuż wybrane Licencje">
            ({{ licenseList.length }})
          </q-btn>
        </div>
      </div>
      <q-virtual-scroll :items="list" virtual-scroll-slice-size="100" style="height: 50vh">
        <template v-slot="{ item, index }">
          <div :key="index" class="row">
            <q-checkbox dense v-if="item.license.paid" v-model="licenseList" value="" :val="item.uuid" left-label>
              {{ index + 1 }}.
            </q-checkbox>
            <q-checkbox value="" dense color="grey" v-else disable left-label>{{ index + 1 }}.</q-checkbox>
            <div class="col" @dblclick="legitimationNumber = item.legitimationNumber;memberDial=true">
              <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
              </q-tooltip>
              <q-field dense class="col" color="positive" label-color="positive" label="Nazwisko i Imię" standout="bg-accent text-positive"
                       stack-label>
                <div>
                  <div class="self-center col full-width no-outline row text-positive" tabindex="1">{{ item.secondName }}
                    {{ item.firstName }}
                  </div>
                </div>
              </q-field>
            </div>
            <q-field dense :class="item.active?'col-1':'col-1 bg-red-4'" color="positive" :label-color="item.active?'positive':'black'" label="Status"
                     standout="bg-accent text-positive" stack-label>
              <div>
                <div :class="item.active?'row text-positive':'row text-black'" tabindex="1">{{item.active?'Aktywny':'Nieaktywny'}}</div>
              </div>
            </q-field>
            <q-field dense class="col-1" label="Numer Licencji" color="positive" label-color="positive" standout="bg-accent text-positive" stack-label>
              <div class="self-center col full-width no-outline row" tabindex="1">
                {{ item.license.number }}
              </div>
            </q-field>
            <q-field dense class="col-2" label="Grupa" color="positive" label-color="positive" standout="bg-accent text-positive" stack-label>
              <div class="self-center col full-width no-outline row" tabindex="1">{{item.adult?'Grupa Ogólna':'Grupa Młodzieżowa'}}
              </div>
            </q-field>
            <q-field dense class="col-2" label="Ważność licencji" color="positive" label-color="positive" standout="bg-accent text-positive" stack-label>
              <div>
                <div class="row" tabindex="1">{{ convertDate(item.license.validThru) }}</div>
              </div>
            </q-field>
            <q-btn dense color="grey-5" v-if="!item.license.paid && !item.active" class="col-2"
                   label="opłać licencję">
              <q-tooltip content-class="bg-red text-subtitle2" anchor="top middle">UREGULUJ SKŁADKI</q-tooltip>
            </q-btn>
            <q-btn dense color="grey-8" v-if="!item.license.paid && item.active" class="col-2"
                   @click="memberName = item.firstName + item.secondName;memberUUID = item.uuid;paymentLicenseAlert = true">
              opłać licencję
            </q-btn>
            <q-btn dense color="primary" v-if="item.license.paid" class="col-2"
                   @click="memberName = item.firstName + item.secondName ;licensePistolPermission = item.license.pistolPermission; licenseRiflePermission = item.license.riflePermission; licenseShotgunPermission = item.license.shotgunPermission;memberUUID = item.uuid; prolongLicenseAlert = true">
              przedłuż licencję
            </q-btn>
          </div>
        </template>
      </q-virtual-scroll>
    </q-card>
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card style="min-width: 80vw" class="bg-dark text-positive">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="legitimationNumber"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" text-color="white" v-close-popup @click="pinCode=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="failure">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
          <div v-else class="text-h6">Nie można wykonać żądania. Sprawdź poprawność danych.</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="prolongLicenseAlert">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Czy przedłużyć licencje</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="primary" v-close-popup/>
          <q-btn text-color="white" label="Przedłuż" color="primary" v-close-popup @click="pinProlongLicense = true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="pinProlongLicense">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="prolongLicenseList();pinProlongLicense=false" autofocus type="password"
                   v-model="pinCode" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="pinCode=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup @click="prolongLicenseList(); pinCode=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="paymentLicenseAlert">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Czy opłacić licencję {{ memberName }}</div>
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
          <q-input @keypress.enter="addLicenseHistoryPayment (memberUUID);pinPaymentLicense=false" autofocus type="password"
                   v-model="pinCode" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="pinCode=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup @click="addLicenseHistoryPayment (memberUUID); pinCode=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Member from 'components/member/Member.vue'
import App from 'src/App.vue'

export default {
  name: 'NotValidLicense',
  data () {
    return {
      list: [],
      licenseList: [],
      memberName: '',
      memberUUID: '',
      prolongLicenseAlert: false,
      pinProlongLicense: false,
      paymentLicenseAlert: false,
      pinPaymentLicense: false,
      memberDial: false,
      legitimationNumber: null,
      pinCode: null,
      success: false,
      failure: false,
      message: null,
      local: App.host
    }
  },
  created () {
    this.getMembersWithLicenseNotValid()
  },
  components: {
    Member
  },
  methods: {
    getMembersWithLicenseNotValid () {
      fetch('http://' + this.local + '/license/membersWithNotValidLicense', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.list = response
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
    prolongLicenseList () {
      fetch('http://' + this.local + '/license/prolongAll?licenseList=' + this.licenseList + '&pinCode=' + this.pinCode, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.licenseList = []
              this.getMembersWithLicenseNotValid()
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
    addLicenseHistoryPayment (uuid) {
      fetch('http://' + this.local + '/license/history/' + uuid + '?pinCode=' + this.pinCode, {
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
              this.getMembersWithLicenseNotValid()
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
        this.pinProlongLicense = false
        this.pinPaymentLicense = false
        this.message = null
        this.pinCode = null
      }, 2000)
    }
  }
}
</script>
