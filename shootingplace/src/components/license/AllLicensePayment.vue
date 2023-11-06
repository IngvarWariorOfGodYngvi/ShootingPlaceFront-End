<template>
  <div>
    <q-card class="text-body2 bg-dark" >
      <div class="row">
        <div class="q-pa-md text-left col full-width no-outline text-h5 text-bold">Ilość osób
          {{ list.length }}
        </div>
        <div class="q-pa-md text-right">
          <q-btn v-if="!mobile" dense color="primary" @click="paymentLicenseAlertPZSS=true" label="Oznacz wybrane jako opłacone w pzss">
            ({{ payPZSSList.length }})
          </q-btn>
        </div>
      </div>
      <q-scroll-area style="height: 50vh;">
        <div v-if="!visible">
          <div v-for="(item,index) in list" :key="index" class="row hover1">
            <Tooltip2clickToShow></Tooltip2clickToShow>
            <q-checkbox dense v-model="payPZSSList" :val="item.paymentUuid" left-label>{{ index + 1 }}.</q-checkbox>
            <div class="col" @dblclick="legitimationNumber = item.legitimationNumber;memberDial=true">
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
              <label>Grupa</label>
              <div>{{item.adult?'Grupa Ogólna':'Grupa Młodzieżowa'}}
              </div>
            </div>
            <div class="col-2">
              <label >Data wpłaty</label>
              <div>{{ item.date }}
              </div>
            </div>
            <div class="col-2">
              <label >Na Rok</label>
              <div>{{ item.validForYear }}
              </div>
            </div>
            <div class="col-2" :class="item.new?'bg-warning':''">
              <label>Nowa / Przedłużenie</label>
              <div>{{item.new?'Nowa':'Przedłużenie'}}
              </div>
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
          <Member :member-number-legitimation="legitimationNumber" @hook:destroyed="getAllLicencePayment()"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup @click="pinCode=null"/>
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
    <q-dialog v-model="paymentLicenseAlertPZSS">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Czy opłacić licencje?</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="primary" v-close-popup/>
          <q-btn text-color="white" label="Opłać" color="primary" v-close-popup @click="pinWindowPZSS = true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="pinWindowPZSS" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="toggleHistoryPayment();pinWindowPZSS=false" autofocus type="password"
                   v-model="pinCode" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="pinCode=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup @click="toggleHistoryPayment(); pinCode=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import { isWindows } from 'mobile-device-detect'

export default {
  name: 'AllLicencePayment',
  data () {
    return {
      mobile: !isWindows,
      main: App.main,
      visible: true,
      list: [],
      payPZSSList: [],
      memberName: '',
      memberDial: false,
      pinCode: null,
      legitimationNumber: null,
      paymentLicenseAlertPZSS: false,
      pinWindowPZSS: false,
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
    this.getAllLicencePayment()
  },
  methods: {
    getAllLicencePayment () {
      fetch('http://' + this.local + '/license/allLicencePayment', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          setTimeout(() => {
            this.list = response
            this.visible = false
          }, 1500)
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
    addLicenseHistoryPayment (uuid) {
      fetch('http://' + this.local + '/license/history/' + uuid, {
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
              this.getAllLicencePayment()
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
    toggleHistoryPayment () {
      fetch(`http://${this.local}/license/paymentToggleArray?paymentUUIDs=${this.payPZSSList}&pinCode=${this.pinCode}&condition=true`, {
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
              this.payPZSSList = []
              this.getAllLicencePayment()
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
