<template>
<div>
  <div class="text-body2 bg-dark text-positive" style="border: 0">
    <div class="col">
      <q-card-section class="col-3">
        <q-item class="col">
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="firstDateJoinDate" mask="####-##-##" label="Data początkowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSumJoinDate ()" v-model="firstDateJoinDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
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
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="secondDateJoinDate" mask="####-##-##" label="Data końcowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSumJoinDate ()" v-model="secondDateJoinDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary"/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
          <q-btn color="primary" text-color="positive" @click="getSumJoinDate()" label="Wyszukaj"></q-btn>
          <p></p>
          <q-btn v-if="firstDateJoinDate!=null&&secondDateJoinDate!=null" @click="getSumJoinDateXLSXFile()" label="pobierz plik xlsx" color="green-3" text-color="black"></q-btn>
          <q-btn v-else-if="!mobile" label="pobierz plik xlsx" color="green-3" disabled text-color="black"></q-btn>{{ loading }}
      </q-card-section>
      <q-inner-loading
              :showing="visible"
              label="Przetwarzanie..."
              color="primary"/>
      <q-card-section class="col">
        <div v-if="list.length < 1" class="q-pa-md self-center col full-width text-bold text-center text-h6">Brak wyników zapisów - Wybierz daty</div>
        <div v-if="list.length > 0" class="q-pa-md col text-bold text-center text-h6">Ilość Zapisów : {{list.length}}</div>
        <div class="row text-caption" style="cursor: pointer">
        <div class="col" @click="sortF('name')">lp <q-icon size="2em" :name="sortName ? 'arrow_drop_up' : 'arrow_drop_down'" />Nazwisko i imię</div>
        <div class="col-2 text-center" @click="sortF('legitimation')"><q-icon size="2em" :name="sortLegitimation ? 'arrow_drop_up' : 'arrow_drop_down'" />Numer<br> Legitymacji</div>
        <div class="col-2" @click="sortF('date')"><q-icon size="2em" :name="sortDate ? 'arrow_drop_up' : 'arrow_drop_down'" />Data Zapisu</div>
        <div class="col-2" @click="sortF('group')"><q-icon size="2em" :name="sortGroup ? 'arrow_drop_up' : 'arrow_drop_down'" />Grupa</div>
        <div class="col-2 text-center" @click="sortF('status')"><q-icon size="2em" :name="sortStatus ? 'arrow_drop_up' : 'arrow_drop_down'" />Status</div>
      </div>
      <q-scroll-area style="height: 50vh">
          <div v-for="(item, index) in list" :key="index" class="row hover1 items-center" @dblclick="legitimationNumber = item.legitimation_number;memberDial=true">
            <Tooltip2clickToShow></Tooltip2clickToShow>
            <div class="col">{{index + 1}}&nbsp;
              {{ item.second_name }} {{ item.first_name }}
            </div>
            <div class="col-2 text-center">
              {{ item.legitimation_number }}
            </div>
            <div class="col-2">
              {{ item.join_date }}
            </div>
            <div class="col-2">
              {{ item.adult?'Grupa Ogólna':'Grupa Młodzieżowa'}}
            </div>
            <div :class="`col-2 ${item.active?'bg-green-4':'bg-red-4'} text-black text-center`" style="border-radius: 2px">
              {{ item.active?'Aktywny':'Nieaktywny'}}
            </div>
          </div>
      </q-scroll-area>
      </q-card-section>
    </div>
  </div>
  <q-dialog v-model="memberDial">
    <q-card class="bg-dark" style="min-width: 80vw">
      <q-card-section class="flex-center">
        <Member :member-number-legitimation="legitimationNumber"></Member>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn text-color="white" label="zamknij" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</div>
</template>
<style src="src/style/style.scss" lang="scss">
</style>
<script>
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
import axios from 'axios'
import App from 'src/App'

export default {
  name: 'SignUps.vue',
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
      firstDateJoinDate: null,
      legitimationNumber: null,
      secondDateJoinDate: this.createTodayDate(),
      list: [],
      visible: false,
      sortName: false,
      sortLegitimation: false,
      sortDate: false,
      sortStatus: false,
      sortGroup: false,
      loading: null,
      success: false,
      message: null,
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
    getSumJoinDate () {
      fetch(`${this.local}/statistics/joinDateSum?firstDate=${this.firstDateJoinDate.replace(/\//gi, '-')}&secondDate=${this.secondDateJoinDate.replace(/\//gi, '-')}`, {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.list = response
        }).then(() => {
          this.visible = false
        })
      })
    },
    getSumJoinDateXLSXFile () {
      this.loading = 'pobieranie'
      axios({
        url: `${this.local}/files/joinDateSum?firstDate=${this.firstDateJoinDate.replace(/\//gi, '-')}&secondDate=${this.secondDateJoinDate.replace(/\//gi, '-')}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `lista zapisów od ${this.firstDateJoinDate.replace(/\//gi, '-')} do ${this.secondDateJoinDate.replace(/\//gi, '-')}.xlsx`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = 'Pobrano plik'
        this.success = true
        this.autoClose()
      }).catch(() => {
        this.loading = null
      })
    },
    sortF (type) {
      if (type === 'name') {
        if (!this.sortName) {
          this.list.sort((a, b) => ('' + b.second_name).localeCompare(a.second_name))
          this.sortName = !this.sortName
        } else {
          this.list.sort((a, b) => ('' + a.second_name).localeCompare(b.second_name))
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
      if (type === 'legitimation') {
        if (!this.sortLicense) {
          this.list.sort((a, b) => b.legitimation_number - a.legitimation_number)
          this.sortLicense = !this.sortLicense
        } else {
          this.list.sort((a, b) => a.legitimation_number - b.legitimation_number)
          this.sortLicense = !this.sortLicense
        }
      }
      if (type === 'date') {
        if (!this.sortDate) {
          this.list.sort((a, b) => new Date(b.join_date) - new Date(a.join_date))
          this.sortDate = !this.sortDate
        } else {
          this.list.sort((a, b) => new Date(a.join_date) - new Date(b.join_date))
          this.sortDate = !this.sortDate
        }
      }
    },
    convertDate (date) {
      const current = new Date(date)
      let month = current.getMonth() + 1
      let day = current.getDate()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + (month)
      }
      return day + '-' + (month) + '-' + current.getFullYear()
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.message = null
        this.loading = null
      }, 2000)
    }
  }
}
</script>

<style scoped>

</style>
