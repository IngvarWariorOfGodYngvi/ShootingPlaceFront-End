<template>
<div>
  <div class="text-body2 bg-dark text-positive" style="border: 0">
    <div :class="mobile?'col':'row'">
      <q-card-section class="col-3">
        <q-item class="col">
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="firstDateLicense" mask="####-##-##" label="Data początkowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSumLicensed ()" v-model="firstDateLicense" mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary"/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <q-item class="col">
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="secondDateLicense" mask="####-##-##" label="Data końcowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSumLicensed ()" v-model="secondDateLicense" mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary"/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <div class="q-pa-md">
          <q-btn color="primary" text-color="positive" @click="getSumLicensed ()" >Wyszukaj</q-btn>
        </div>
        <div class="row">
          <q-radio @input="paid = null; newLicense = null; getSumLicensed ()" v-model="allLicense" :val="true">Wszystkie</q-radio>
          <q-radio @input="allLicense = false; newLicense = null; rearrangeSumLicensedTable()" v-model="paid" :val="true">Opłacone</q-radio>
          <q-radio @input="allLicense = false; newLicense = null; rearrangeSumLicensedTable ()" v-model="paid" :val="false">Nieopłacone</q-radio>
          <q-radio @input="allLicense = false; paid = null; rearrangeSumLicensedTable ()" v-model="newLicense" :val="true">Nowe</q-radio>
        </div>
        <div v-if="licenseArray.length > 0" class="row">
          <q-btn color="primary" @click="toggleLicenseAlert = true">Zatwierdź opłacenie zaznaczonych</q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col">
        <div v-if="quantitySumLicenseRearrangeTable.length <1" class="q-pa-md self-center no-outline text-bold text-center text-h6">Brak wyników opłaconych licencji - Wybierz daty</div>
        <div v-if="quantitySumLicenseRearrangeTable.length >0" class="q-pa-md self-center no-outline text-bold text-center text-h6">Ilość Opłat : {{quantitySumLicenseRearrangeTable.length}}</div>
        <q-virtual-scroll v-if="quantitySumLicenseRearrangeTable.length >0" :items="quantitySumLicenseRearrangeTable" type="table" dense class="row full-width bg-dark text-positive" style="height: 50vh;">
          <template v-slot:before>
            <thead class="thead-sticky text-left">
            <tr class="bg-primary text-white">
              <th class="text-left">{{quantitySumLicenseRearrangeTable.length}} Nazwisko i Imię</th>
              <th class="text-left" style="width: 10%;">Numer<br/>Legitymacji</th>
              <th class="text-left" style="width: 10%;">Grupa</th>
              <th class="text-left" style="width: 10%;">Status</th>
              <th class="text-left" style="width: 15%;">Data</th>
              <th class="text-left" style="width: 15%;">Nowa /<br/>Przedłużenie</th>
              <th class="text-left" style="width: 15%;">Opłacone w<br/>PZSS</th>
            </tr>
            </thead>
          </template>
          <template v-slot="{ item, index }">
            <tr :key="index" class="rounded" style="cursor:pointer" @dblclick="legitimationNumber = item.legitimationNumber; memberDial=true">
              <Tooltip2clickToShow></Tooltip2clickToShow>
              <td v-if="!item.payInPZSSPortal" class="text-left xyz"><b>{{index+1}}</b><q-checkbox color="primary" dense v-model="licenseArray" :val="item.licenseUUID" :label="item.secondName + ' ' + item.firstName "></q-checkbox></td>
              <td v-else class="text-left xyz"><b>{{index+1}}</b> {{item.secondName}} {{item.firstName}} </td>
              <td class="text-left">nr leg. {{item.legitimationNumber}}</td>
              <td class="text-left"><div>{{item.adult? 'Ogólna' : 'Młodzieżowa'}}</div></td>
              <td class="text-center text-black" :class="item.active?'bg-green-3':'bg-red'">{{item.active?'Aktywny':'Nieaktywny'}}</td>
              <td class="text-left">{{item.date}}</td>
              <td :class="item.new?'bg-warning text-black':''">{{item.new? 'Nowa': 'Przedłużenie'}}</td>
              <td v-if="item.payInPZSSPortal" class="bg-green-3 text-center text-black">Opłacone</td>
              <td v-if="!item.payInPZSSPortal" class="bg-red text-cente text-blackr">Nieopłacone</td>
            </tr>
          </template>
        </q-virtual-scroll>
      </q-card-section>
    </div>
  </div>
  <q-dialog v-model="memberDial">
    <q-card style="min-width: 80vw" class="bg-dark">
      <q-card-section class="flex-center">
        <Member :member-number-legitimation="legitimationNumber"></Member>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn text-color="white" label="zamknij" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="toggleLicenseAlert" persistent>
    <q-card class="bg-red-5 text-center">
      <q-card-section class="flex-center">
        <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
        <div><q-input @keypress.enter="toggleHistoryPayment();toggleLicenseAlert=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
        <q-btn id="3" label="Zatwierdź zmiany" color="black" v-close-popup @click="toggleHistoryPayment()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog position="standard" v-model="failure">
    <q-card class="bg-warning">
      <q-card-section>
        <div v-if="message!=null" class="text-h6">{{message}}</div>
      </q-card-section>

    </q-card>
  </q-dialog>
  <q-dialog position="top" v-model="success">
    <q-card>
      <q-card-section>
        <div v-if="message!=null" class="text-h6">{{message}}</div>
      </q-card-section>

    </q-card>
  </q-dialog>
</div>
</template>
<style src="src/style/style.scss" lang="scss">
</style>
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
    getSumLicensed () {
      fetch('http://' + this.local + '/statistics/licenseSum?firstDate=' + this.firstDateLicense.replace(/\//gi, '-') + '&secondDate=' + this.secondDateLicense.replace(/\//gi, '-'), {
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
      fetch('http://' + this.local + '/license/paymentToggleArray?paymentUUIDs=' + this.licenseArray + '&pinCode=' + this.code, {
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

<style scoped>

</style>
