<template>
  <div class="col">
    <q-inner-loading :showing="visible" label="Przetwarzanie..." color="primary" />
    <q-card-section>
      <q-item class="col">
        <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled
          v-model="firstDate" mask="####-##-##" label="Data początkowa">
          <template v-slot:append>
            <q-icon name="event" color="positive" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="firstDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
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
        <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled
          v-model="secondDate" mask="####-##-##" label="Data końcowa">
          <template v-slot:append>
            <q-icon name="event" color="positive" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="secondDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Zamknij" color="primary" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item>
    </q-card-section>
    <div class="row full-width">
      <div class="q-pa-md col-6"><q-btn class="full-width" color="primary" label="wyświetl listę osób"
          @click="getMembersToReportToPoliceView(firstDate, secondDate)" /></div>
      <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="pobierz listę .pdf"
          @click="getMembersToReportToPolicePDF(firstDate, secondDate)" /></div>
      <div class="q-pa-md col"><q-btn class="full-width" color="green" label="pobierz listę .xlsx"
          @click="getMembersToReportToPoliceXLSX(firstDate, secondDate)" /></div>
    </div>
    <div>
      <div class="row full-width">
        <div class="q-pr-xs">Lp</div>
        <div class="col">Nazwisko i Imię</div>
        <div class="col-1 text-center">Numer legitymacji</div>
        <div class="col-1 text-center">Numer licencji</div>
        <div class="col-2 text-center">Licencja ważna do</div>
        <div class="col-2">Numer Telefonu</div>
        <div class="col-3">Email</div>
      </div>
      <q-scroll-area style="height: 50vh">
        <div v-for="(item, index) in list" :key="index" class="row hover1 items-center"
          @dblclick="legitimationNumber = item.legitimationNumber; memberDial = true">
          <Tooltip2clickToShow></Tooltip2clickToShow>
          <div :key="index" class="row col">
            <div class="q-pr-xs">{{ index + 1 }}</div>
            <div class="col">{{ item.secondName }} {{ item.firstName }}</div>
            <div class="col-1 text-center">{{ item.legitimationNumber }}</div>
            <div class="col-1 text-center">{{ item.license.number }}</div>
            <div class="col-2 text-center">{{ item.license.validThru }}</div>
            <div class="col-2">{{ item.phoneNumber }}</div>
            <div class="col-3">{{ item.email }}</div>
          </div>
        </div>
      </q-scroll-area>
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
      <q-dialog position="top" v-model="listDownload">
        <q-card>
          <q-card-section class="col">
            <div class="self-center col full-width no-outline text-center text-h5 text-bold">Pobrano Listę</div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import App from 'src/App'
import axios from 'axios'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'

export default {
  name: 'MembersToReportToPolice2.vue',
  data () {
    return {
      list: [],
      visible: false,
      memberDial: false,
      legitimationNumber: null,
      nowDate: this.createTodayDate(),
      firstDate: null,
      secondDate: this.createTodayDate(),
      listDownload: false,
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
    getMembersToReportToPoliceView (firstDate, secondDate) {
      this.visible = true
      fetch(`${this.local}/member/reportView?firstDate=${firstDate.replace(/\//gi, '-')}&secondDate=${secondDate.replace(/\//gi, '-')}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.list = response
          this.visible = false
        }).catch(() => {
          this.visible = false
        })
    },
    getErasedMembers () {
      this.visible = true
      axios({
        url: `${this.local}/files/downloadAllErasedMembers?firstDate=${this.firstDate.replace(/\//gi, '-')}&secondDate=${this.secondDate.replace(/\//gi, '-')}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Lista_klubowiczów_skreślonych_${this.nowDate}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.visible = false
        this.autoClose()
      })
    },
    getErasedMembersXlsx () {
      this.visible = true
      axios({
        url: `${this.local}/files/downloadAllErasedMembersXlsx?firstDate=${this.firstDate.replace(/\//gi, '-')}&secondDate=${this.secondDate.replace(/\//gi, '-')}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Lista_klubowiczów_skreślonych_${this.nowDate}.xlsx`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.visible = false
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.listDownload = false
      }, 2000)
    }
  }
}
</script>
