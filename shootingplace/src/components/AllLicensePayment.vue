<template>
  <div>
    <q-card class="text-body2">
      <div class="row">
        <div class="q-pa-md text-left col full-width no-outline text-h5 text-bold">Ilość osób
          {{ list.length }}
        </div>
        <div v-if="payPZSSList.length>0" class="q-pa-md text-right">
          <q-btn @click="paymentLicenseAlertPZSS=true" label="Oznacz wybrane jako opłacone w pzss">
            ({{ payPZSSList.length }})
          </q-btn>
        </div>
      </div>
      <q-virtual-scroll :items="list" virtual-scroll-slice-size="100" style="height: 50vh;">
        <template v-slot="{ item, index }">
          <div :key="index" class="row">
            <q-checkbox dense v-model="payPZSSList" :val="item.paymentUuid" left-label>{{ index + 1 }}.</q-checkbox>
            <div class="col" @dblclick="legitimationNumber = item.legitimationNumber;memberDial=true">
              <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
              </q-tooltip>
              <q-field dense class="col" label="Nazwisko i Imię" standout="bg-accent text-black" stack-label>
                <div @dblclick="legitimationNumber = item.legitimationNumber;memberDial=true">
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{ item.secondName }}
                    {{ item.firstName }}
                  </div>
                </div>
              </q-field>
            </div>
            <q-field dense class="col-2" label="Grupa" standout="bg-accent text-black" stack-label>
              <div class="self-center col full-width no-outline row text-black" tabindex="1">{{item.adult?'Grupa Ogólna':'Grupa Młodzieżowa'}}
              </div>
            </q-field>
            <q-field dense class="col-1" label="Status" standout="bg-accent text-black" stack-label>
              <div>
                <div class="self-center col full-width no-outline row text-black" tabindex="1">{{item.active?'Aktywny':'Nieaktywny'}}</div>
              </div>
            </q-field>
            <q-field dense class="col-2" label="Data wpłaty" standout="bg-accent text-black" stack-label>
              <div>
                <div class="self-center col full-width no-outline row text-black" tabindex="1">{{ item.date }}</div>
              </div>
            </q-field>
            <q-field dense class="col-1" label="Na Rok" standout="bg-accent text-black" stack-label>
              <div class="self-center col full-width no-outline row text-black" tabindex="1">{{ item.validForYear }}
              </div>
            </q-field>
            <q-field dense :class="item.new?'col-2 bg-warning':'col-2'" label="Rodzaj" :standout="item.new?'bg-warning text-black':'bg-accent'" stack-label>
              <div class="row text-black" tabindex="1">{{item.new?'Nowa':'Przedłużenie'}}</div>
            </q-field>
          </div>
        </template>
      </q-virtual-scroll>
    </q-card>
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card style="min-width: 80vw">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="legitimationNumber"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="black" v-close-popup @click="pinCode=null"/>
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
    <q-dialog v-model="paymentLicenseAlertPZSS">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy opłacić licencje</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="Opłać" color="primary" v-close-popup @click="pinWindowPZSS = true"/>
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

export default {
  name: 'AllLicencePayment',
  data () {
    return {
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
      componentFactory: () => import('components/Member.vue'),
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
      fetch('http://' + this.local + '/license/paymentToggleArray?paymentUUIDs=' + this.payPZSSList + '&pinCode=' + this.pinCode, {
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
