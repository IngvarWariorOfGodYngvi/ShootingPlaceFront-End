<template>
  <div>
    <div class="text-body2 bg-dark text-positive" style="border: 0">
      <div class="col">
        <q-card-section class="col-3">
          <q-item class="col">
            <q-input class="full-width" bg-color="primary" standout="" rounded input-class="text-positive"
              label-color="positive" dense v-model="firstDate" mask="####-##-##" label="Data początkowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date no-unset @input="getSum()" v-model="firstDate" mask="YYYY-MM-DD"
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
              label-color="positive" dense v-model="secondDate" mask="####-##-##" label="Data końcowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input="getSum()" v-model="secondDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <div>
            <q-btn glossy color="primary" text-color="white" @click="getSum()">Wyszukaj</q-btn>
            <p></p>
            <q-btn glossy :disable="list.length < 1 || dis" :loading="loading[0]" color="green" text-color="white"
              @click="dis = true; simulateProgress()" label="pobierz plik .xls" />
          </div>
        </q-card-section>
        <q-inner-loading :showing="visible" label="Przetwarzanie..." color="primary" />
        <q-card-section class="col">
          <div v-if="list.length < 1" class="q-pa-md self-center col full-width text-bold text-center text-h6">Brak
            wyników
            zapisów - Wybierz daty</div>
          <div v-if="list.length > 0" class="q-pa-md col text-bold text-center text-h6">Ilość Składek : {{ list.length }}
          </div>
          <div class="row text-caption" style="cursor: pointer">
            <div class="col" @click="sortF('name')">lp <q-icon size="2em"
                :name="sortName ? 'arrow_drop_up' : 'arrow_drop_down'" />Nazwisko i imię</div>
            <div class="col-2 text-center" @click="sortF('legitimation')"><q-icon size="2em"
                :name="sortLegitimation ? 'arrow_drop_up' : 'arrow_drop_down'" />Numer<br> Legitymacji</div>
            <div class="col-2" @click="sortF('date')"><q-icon size="2em"
                :name="sortDate ? 'arrow_drop_up' : 'arrow_drop_down'" />Data Składki</div>
            <div class="col-2" @click="sortF('group')"><q-icon size="2em"
                :name="sortGroup ? 'arrow_drop_up' : 'arrow_drop_down'" />Grupa</div>
            <div class="col-2 text-center" @click="sortF('status')"><q-icon size="2em"
                :name="sortStatus ? 'arrow_drop_up' : 'arrow_drop_down'" />Status</div>
          </div>
          <q-scroll-area style="height: 50vh">
            <div v-for="(item, index) in list" :key="index" class="row hover1 items-center"
              @dblclick="legitimationNumber = item.member.legitimation_number; memberDial = true">
              <Tooltip2clickToShow></Tooltip2clickToShow>
              <div class="col">{{ index + 1 }}&nbsp;
                {{ item.member.second_name }} {{ item.member.first_name }}
              </div>
              <div class="col-2 text-center">
                {{ item.member.legitimation_number }}
              </div>
              <div class="col-2">
                {{ item.contribution.validThru }}
              </div>
              <div class="col-2">
                {{ item.member.adult ? 'Grupa Ogólna' : 'Grupa Młodzieżowa' }}
              </div>
              <div :class="`col-2 ${item.member.active ? 'bg-green-4' : 'bg-red-4'} text-black text-center`"
                style="border-radius: 2px">
                {{ item.member.active ? 'Aktywny' : 'Nieaktywny' }}
              </div>
            </div>
          </q-scroll-area>
        </q-card-section>
      </div>
    </div>
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card style="min-width: 80vw" class="bg-dark">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="legitimationNumber"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import App from 'src/App'
import axios from 'axios'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'

export default {
  name: 'contributions.vue',
  data () {
    return {
      memberDial: false,
      legitimationNumber: null,
      firstDate: null,
      secondDate: this.createTodayDate(),
      adultCondition: null,
      list: [],
      visible: false,
      sortName: false,
      sortLegitimation: false,
      sortDate: false,
      sortStatus: false,
      sortGroup: false,
      success: false,
      failure: false,
      dis: false,
      message: null,
      loading: [false],
      mobile: App.mobile,
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
  setup () {
    function simulateProgress () {
      this.loading[0] = true
      if (this.dis) {
        this.getXlsFile()
      }
      setTimeout(() => {
        this.loading[0] = false
      }, 500)
    }
    return {
      simulateProgress
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
    getSum () {
      this.visible = true
      fetch(`${this.local}/statistics/contributionSum?firstDate=${this.firstDate.replace(/\//gi, '-')}&secondDate=${this.secondDate.replace(/\//gi, '-')}`, {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.list = response
        })
      }).then(() => {
        this.visible = false
      }).catch(() => {
        this.visible = false
      })
    },
    getXlsFile () {
      axios({
        url: `${this.local}/files/contributions?firstDate=${this.firstDate.replace(/\//gi, '-')}&secondDate=${this.secondDate.replace(/\//gi, '-')}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `lista składek od ${this.firstDate.replace(/\//gi, '-')} do ${this.secondDate.replace(/\//gi, '-')}.xlsx`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = 'Pobrano plik'
        this.success = true
        this.autoClose()
      }).catch(() => {
        this.message = 'Coś poszło nie tak'
        this.failure = true
        this.autoClose()
      })
    },
    sortF (type) {
      if (type === 'name') {
        if (!this.sortName) {
          this.list.sort((a, b) => ('' + b.member.second_name).localeCompare(a.member.second_name))
          this.sortName = !this.sortName
        } else {
          this.list.sort((a, b) => ('' + a.member.second_name).localeCompare(b.member.second_name))
          this.sortName = !this.sortName
        }
      }
      if (type === 'status') {
        if (!this.sortStatus) {
          this.list.sort((a, b) => b.member.active - a.member.active)
          this.sortStatus = !this.sortStatus
        } else {
          this.list.sort((a, b) => a.member.active - b.member.active)
          this.sortStatus = !this.sortStatus
        }
      }
      if (type === 'group') {
        if (!this.sortGroup) {
          this.list.sort((a, b) => b.member.adult - a.member.adult)
          this.sortGroup = !this.sortGroup
        } else {
          this.list.sort((a, b) => a.member.adult - b.member.adult)
          this.sortGroup = !this.sortGroup
        }
      }
      if (type === 'legitimation') {
        if (!this.sortLicense) {
          this.list.sort((a, b) => b.member.legitimation_number - a.member.legitimation_number)
          this.sortLicense = !this.sortLicense
        } else {
          this.list.sort((a, b) => a.member.legitimation_number - b.member.legitimation_number)
          this.sortLicense = !this.sortLicense
        }
      }
      if (type === 'date') {
        if (!this.sortDate) {
          this.list.sort((a, b) => new Date(b.contribution.validThru) - new Date(a.contribution.validThru))
          this.sortDate = !this.sortDate
        } else {
          this.list.sort((a, b) => new Date(a.contribution.validThru) - new Date(b.contribution.validThru))
          this.sortDate = !this.sortDate
        }
      }
    },
    autoClose () {
      setTimeout(() => {
        this.dis = true
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>
