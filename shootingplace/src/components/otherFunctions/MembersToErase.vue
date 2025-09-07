<template>
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
    <q-inner-loading :showing="visible" label="Przetwarzanie..." color="primary" />
    <div class="row full-width">
      <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="wyświetl listę osób"
          @click="getMembersToErase()" /></div>
      <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="pobierz listę .pdf"
          @click="getAllMembersToErase()" /></div>
      <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="pobierz listę .xls"
          @click="getAllMembersToEraseXls()" /></div>
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
          @click.ctrl="pushOrRemoveEmailToList(item.legitimationNumber)"
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
  name: 'contributions.vue',
  data () {
    return {
      list: [],
      mailingList: [],
      mailing: true,
      visible: false,
      memberDial: false,
      legitimationNumber: null,
      nowDate: this.createTodayDate(),
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
    getMembersToErase () {
      this.visible = true
      fetch(`${this.local}/member/getMembersToErase`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.list = response
          this.visible = false
        })
        .catch(() => {
          this.visible = false
        })
    },
    getAllMembersToEraseXls () {
      this.visible = true
      axios({
        url: `${this.local}/files/downloadAllMembersToErasedXlsx/`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Lista_klubowiczów_do_skreślenia_${this.nowDate}.xlsx`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.visible = false
        this.autoClose()
      })
    },
    getAllMembersToErase () {
      this.visible = true
      axios({
        url: `${this.local}/files/downloadAllMembersToErased/`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Lista_klubowiczów_do_skreślenia_${this.nowDate}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.visible = false
        this.autoClose()
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
    autoClose () {
      setTimeout(() => {
        this.listDownload = false
      }, 2000)
    }
  }
}
</script>
