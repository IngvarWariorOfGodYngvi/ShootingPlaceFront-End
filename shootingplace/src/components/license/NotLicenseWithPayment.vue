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
            <q-btn dense class="text-caption full-width" align="center" label="wyczyść listę" color="primary"
              icon="delete" rounded @click="clearMailingList()" />
            <q-btn dense class="text-caption full-width" align="center"
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
      </div>
      <div class="row text-caption" style="cursor: pointer">
        <div class="col-4" @click="sortF('name')">lp <q-icon size="2em" :name="sortName ? 'arrow_drop_up' : 'arrow_drop_down'" />Nazwisko i imię</div>
        <div class="col-2" @click="sortF('status')"><q-icon size="2em" :name="sortStatus ? 'arrow_drop_up' : 'arrow_drop_down'" />Status</div>
        <div class="col-2" @click="sortF('group')"><q-icon size="2em" :name="sortGroup ? 'arrow_drop_up' : 'arrow_drop_down'" />Grupa</div>
        <div class="col-2" @click="sortF('date')"><q-icon size="2em" :name="sortDate ? 'arrow_drop_up' : 'arrow_drop_down'" />Data Wpłaty</div>
        <div class="col-2" @click="sortF('valid')"><q-icon size="2em" :name="sortValid ? 'arrow_drop_up' : 'arrow_drop_down'" />Ważność na Rok</div>
      </div>
      <q-scroll-area style="height: 50vh">
        <div v-if="!visible">
          <div v-for="(item, index) in list" :key="index" class="row hover1 items-center"
          @click.ctrl="pushOrRemoveEmailToList(item.legitimationNumber)"
          @dblclick="legitimationNumber = item.legitimationNumber;memberDial=true">
            <Tooltip2clickToShow></Tooltip2clickToShow>
            <div class="col-4">&nbsp;
              {{index + 1}} {{ item.secondName }} {{ item.firstName }}
            </div>
            <div :class="`col-2 ${item.active?'':'bg-red-4 text-black'}`" style="border-radius: 2px">
              {{ item.active?'Aktywny':'Nieaktywny'}}
            </div>
            <div class="col-2">
              {{item.adult?'Grupa Ogólna':'Grupa Młodzieżowa'}}
            </div>
            <div class="col-2">
              {{convertDate(item.history.licensePaymentHistory[0].date)}}
            </div>
            <div class="col-2">
              {{ item.history.licensePaymentHistory[0].validForYear }}
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
          <Member :member-number-legitimation="legitimationNumber" @hook:destroyed="getMembersWithLicenseNotValid()"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" text-color="white" v-close-popup/>
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

<style src="src\style\style.scss" lang="scss">
</style>
<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

export default {
  name: 'NoLicenseWithPayment',
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
      memberDial: false,
      legitimationNumber: null,
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
      fetch(`${this.local}/license/allNoLicenseWithPayment`, {
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
      let month = current.getMonth()
      let day = current.getDate()
      if (day < 10) {
        day = '0' + day
      }
      if (month + 1 < 10) {
        month = '0' + (month + 1)
      }
      return day + '-' + (month) + '-' + current.getFullYear()
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
      if (type === 'group') {
        if (!this.sortGroup) {
          this.list.sort((a, b) => b.adult - a.adult)
          this.sortGroup = !this.sortGroup
        } else {
          this.list.sort((a, b) => a.adult - b.adult)
          this.sortGroup = !this.sortGroup
        }
      }
      if (type === 'date') {
        if (!this.sortDate) {
          this.list.sort((a, b) => new Date(b.date) - new Date(a.date))
          this.sortDate = !this.sortDate
        } else {
          this.list.sort((a, b) => new Date(a.date) - new Date(b.date))
          this.sortDate = !this.sortDate
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
        this.message = null
      }, 2000)
    }
  }
}
</script>
