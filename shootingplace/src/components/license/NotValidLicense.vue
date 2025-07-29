<template>
  <div>
    <div>
      <q-page-sticky v-if="mailingList.length > 0" position="top-right" expand :offset="[6, 6]" style="z-index: 10;">
        <q-tooltip anchor="center start" :hide-delay="200" class="bg-primary" content-class="bg-primary">
          <div class="text-h6 text-center">
            LISTA MAILINGOWA
          </div>
        </q-tooltip>
        <q-fab v-model="mailing" label-position="bottom" color="secondary" icon="email" direction="down"
          style="border: 2px solid white;">
          <div v-if="mailingList.length > 0" class="bg-secondary text-white"
            style="border-radius: 5% 5% 0 0; margin-right: 15vw; font-size: small; width: 18vw">
            <q-btn glossy dense class="text-caption full-width" align="center" label="wyczyść listę" color="primary"
              icon="delete" rounded @click="clearMailingList()" />
            <q-btn glossy dense class="text-caption full-width" align="center"
              :label="'kopiuj ' + mailingList.length + ' do schowka'" color="primary" icon="content_copy" rounded
              @click="unsecuredCopyToClipboard(mailingList)" />
            <q-virtual-scroll :items="mailingList" class="text-center" style="height: auto;max-height: 40vh;width: auto">
              <template v-slot="{ item, index }">
                <q-item dense style="padding: 0 10px 0 10px;margin: 0">
                  {{ index + 1 }} {{ item }}
                </q-item>
              </template>
            </q-virtual-scroll>
          </div>
        </q-fab>
      </q-page-sticky>
    </div>
    <q-card class="text-body2 bg-dark">
      <div class="row">
        <div class="q-pa-md text-left col full-width no-outline text-h5 text-bold text-positive">Ilość osób {{ list.length }}
        </div>
        <div class="q-pa-md text-right">
          <q-btn v-if="!mobile" :disable="licenseList.length<1" glossy dense color="primary" @click="prolongLicenseAlert=true" label="Przedłuż zaznaczone">
            ({{ licenseList.length }})
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
        <div v-if="!visible">
          <div v-for="(item, index) in list" :key="index" class="row hover1 items-center"
          @click.ctrl="pushOrRemoveEmailToList(item.legitimationNumber)"
          @dblclick="legitimationNumber = item.legitimationNumber;memberDial=true">
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
              {{item.adult?'Grupa Ogólna':'Grupa Młodzieżowa'}}
            </div>
            <div class="col-2">
              {{ convertDate(item.license.validThru) }}
            </div>
            <q-btn glossy dense color="grey-8" v-if="!item.license.paid && !item.active" class="col-2"
                   label="opłać licencję">
              <q-tooltip content-class="bg-red text-subtitle2" anchor="top middle">UREGULUJ SKŁADKI</q-tooltip>
            </q-btn>
            <q-btn glossy dense color="secondary" v-if="!item.license.paid && item.active" class="col-2"
                   @click="memberName = item.firstName + item.secondName;memberUUID = item.uuid;paymentLicenseAlert = true">
              opłać licencję
            </q-btn>
            <q-btn glossy dense color="primary" v-if="item.license.paid" disable class="col-2" label="opłacona"/>
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
          <Member :member-number-legitimation="legitimationNumber" @hook:destroyed="getMembersWithLicenseNotValid()"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" text-color="white" v-close-popup @click="pinCode=null"/>
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
    <q-dialog v-model="prolongLicenseAlert">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Czy przedłużyć licencje?</div>
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
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

export default {
  name: 'NotValidLicense',
  data () {
    return {
      mobile: App.mobile,
      main: App.main,
      visible: true,
      mailingList: JSON.parse(window.localStorage.getItem('mailingList')),
      mailing: true,
      list: [],
      licenseList: [],
      memberName: '',
      memberUUID: '',
      sortValid: false,
      sortGroup: false,
      sortLicense: false,
      sortStatus: false,
      sortName: false,
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
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    }),
    Tooltip2clickToShow: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickToShow.vue'),
      loading: SkeletonBox
    })
  },
  methods: {
    getMembersWithLicenseNotValid () {
      fetch(`${this.local}/license/membersWithNotValidLicense`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.list = response
          this.visible = false
        })
    },
    pushOrRemoveEmailToList (number) {
      console.log(number)
      fetch(`${this.local}/member/getMemberEmail?number=${number}`, {
        method: 'GET'
      }).then(response => response.text())
        .then(response => {
          console.log(response)
          const parse = JSON.parse(window.localStorage.getItem('mailingList'))
          if (!parse.includes(response)) {
            parse.push(response)
          } else {
            const number1 = this.mailingList.indexOf(response)
            parse.splice(number1, number1 + 1)
          }
          window.localStorage.setItem('mailingList', JSON.stringify(parse))
          this.mailingList = parse
        })
    },
    clearMailingList () {
      window.localStorage.setItem('mailingList', JSON.stringify([]))
      this.mailingList = []
    },
    copyClipboard (arr) {
      let s = arr[0]
      if (arr.length > 1) {
        for (let i = 1; i < arr.length; i++) {
          s = s + ';' + arr[i]
        }
      }
      window.isSecureContext = false
      navigator.clipboard.writeText(s)
      this.message = 'Skopiowano listę do schowka'
      this.success = true
      this.autoClose()
    },
    unsecuredCopyToClipboard (arr) {
      const textArea = document.createElement('textarea')
      let s = arr[0]
      if (arr.length > 1) {
        for (let i = 1; i < arr.length; i++) {
          s = s + ';' + arr[i]
        }
      }
      textArea.value = arr
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (err) {
        console.error('Unable to copy to clipboard', err)
      }
      document.body.removeChild(textArea)
      this.message = 'Skopiowano listę do schowka'
      this.success = true
      this.autoClose()
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
      fetch(`${this.local}/license/prolongAll?licenseList=${this.licenseList}&pinCode=${this.pinCode}`, {
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
      fetch(`${this.local}/license/history/${uuid}?pinCode=${this.pinCode}`, {
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
        if (!this.sortValid) {
          this.list.sort((a, b) => new Date(b.license.validThru) - new Date(a.license.validThru))
          this.sortValid = !this.sortValid
        } else {
          this.list.sort((a, b) => new Date(a.license.validThru) - new Date(b.license.validThru))
          this.sortValid = !this.sortValid
        }
      }
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
