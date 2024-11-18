<template>
  <q-page padding>
    <q-expansion-item label="Lista osób spoza klubu" dense class="text-left text-h6 text-bold bg-grey-3 q-mb-md"
      group="list">
      <OtherList class="bg-dark text-positive text-body2"></OtherList>
    </q-expansion-item>
    <q-expansion-item label="Lista znanych klubów" dense class="text-left text-h6 text-bold bg-grey-3 q-mb-md"
      group="list">
      <Clubs class="bg-dark text-positive text-body2"></Clubs>
    </q-expansion-item>
    <q-expansion-item label="Lista Konkurencji" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <Competitions class="bg-dark text-positive text-body2"></Competitions>
    </q-expansion-item>
    <p></p>
    <div v-if="!access">
      <q-input dense input-class="text-positive" label-color="positive" color="positive" v-model="accessCode"
        label="Wprowadź kod" type="password" mask="####" @keypress.enter="getAccess(accessCode)" filled></q-input>
      <q-item dense>{{ accessMessage }}</q-item>
      <q-btn color="primary" text-color="white" dense label="wprowadź" @click="getAccess(accessCode)"></q-btn>
    </div>
    <q-expansion-item v-if="access" label="Dodatkowe Funkcje" dense class="text-left text-h6 text-bold bg-grey-3"
      group="list">
      <q-card class="text-body2 text-positive bg-dark">
        <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold">Dodatkowe Funkcje</div>
          <q-select class="full-width" dense options-dense :dark="darkSet()" filled fill-input label-color="positive"
            color="positive" input-class="text-positive" popup-content-class="bg-dark text-positive"
            options-selected-class="bg-dark text-positive" :options-dark="darkSet()" v-model="choose"
            :options="chooseSelect" label="Wybierz Opcję">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <div v-if="choose === chooseSelect[0]" class="q-pa-md">
            <MembersLists></MembersLists>
          </div>
          <div v-if="choose === chooseSelect[1]">
            <MembersToReportOnPolice></MembersToReportOnPolice>
          </div>
          <div v-if="choose === chooseSelect[2]">
            <MembersToErase></MembersToErase>
          </div>
          <div v-if="choose === chooseSelect[3]" class="row">
            <MembersErasedList></MembersErasedList>
          </div>
          <div v-if="choose === chooseSelect[4]" class="q-pa-md">
            <q-btn color="primary" label="pobierz listę obecności klubowiczów" @click="getAllMembersListToElection()" />
          </div>
          <div v-if="choose === chooseSelect[5]" class="q-pa-md">
            <JudgingReport></JudgingReport>
          </div>
          <div v-if="choose === chooseSelect[6]" class="q-pa-none row">
            <WorkTimeReport></WorkTimeReport>
          </div>
          <div v-if="choose === chooseSelect[7]" class="q-pa-md">
            <EvidenceBook></EvidenceBook>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-dialog position="top" v-model="listDownload">
      <q-card>
        <q-card-section class="col">
          <div class="self-center col full-width no-outline text-center text-h5 text-bold">Pobrano Listę</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import axios from 'axios'
import App from 'src/App.vue'
export default {
  components: {
    OtherList: lazyLoadComponent({
      componentFactory: () => import('src/components/otherPerson/OthersList.vue'),
      loading: SkeletonBox
    }),
    Clubs: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/Clubs.vue'),
      loading: SkeletonBox
    }),
    Competitions: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/Competitions.vue'),
      loading: SkeletonBox
    }),
    WorkTimeReport: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/WorkTimeReport.vue'),
      loading: SkeletonBox
    }),
    JudgingReport: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/JudgingReport.vue'),
      loading: SkeletonBox
    }),
    EvidenceBook: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/EvidenceBook.vue'),
      loading: SkeletonBox
    }),
    MembersLists: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/MembersLists.vue'),
      loading: SkeletonBox
    }),
    MembersToReportOnPolice: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/MembersToReportOnPolice.vue'),
      loading: SkeletonBox
    }),
    MembersToErase: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/MembersToErase.vue'),
      loading: SkeletonBox
    }),
    MembersErasedList: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/MembersErasedList.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      choose: null,
      chooseSelect: ['Listy Klubowiczów', 'Lista do zgłoszenia na Policję', 'Lista do skreślenia', 'Lista skreślonych', 'Lista Obecności', 'Raport Sędziowania', 'Raport Czasu Pracy', 'Książka rejestru pobytu na strzelnicy'],
      access: false,
      accessCode: '',
      accessMessage: '',
      listDownload: false,
      nowDate: this.createTodayDate(),
      local: App.host
    }
  },
  methods: {
    darkSet () {
      return JSON.parse(window.localStorage.getItem('BackgroundDark'))
    },
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
        day = '0' + (date.getDate() + 1)
      } else {
        day = (date.getDate())
      }
      return date.getFullYear() + '-' + month + '-' + day
    },
    getAccess (accessCode) {
      fetch(`${this.local}/users/getAccess?pinCode=${accessCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.accessMessage = response
              this.access = true
            }
          )
        } else {
          response.text().then(
            response => {
              this.accessMessage = response
            }
          )
        }
      }
      )
    },
    getAllMembersListToElection () {
      axios({
        url: `${this.local}/files/downloadAllMembersToElection`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_obecności_klubowiczów.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.listDownload = false
        this.acceptWorkingTimeDial = false
        this.changeWorkingTimeDial = false
        this.code = null
      }, 2000)
    }
  },
  name: 'otherFunction'
}
</script>
