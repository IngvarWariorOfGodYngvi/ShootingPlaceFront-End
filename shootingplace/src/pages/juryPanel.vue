<template>
  <q-page class="text-positive">
    <q-btn label="tryb prezentacji" dense unelevated :text-color="presentationMode ? 'dark' : 'white'"
      :color="presentationMode ? '' : 'primary'" v-if="main && !mobile && !presentationMode && tournamentCheck"
      @click="presentationMode = !presentationMode; presentationUUID()"></q-btn>
    <div v-if="!presentationMode && tournamentCheck">
      <div v-if="arbiter.length < 4" class="text-h6 q-pa-md">
          <q-input v-model="arbiterCode" @keypress.enter="checkArbiter(arbiterCode)" color="primary" type="password" label="Podaj pin" input-class="text-positive"
            label-color="positive"></q-input>
          <q-btn color="primary" label="zapisz" type="submit" @click="checkArbiter(arbiterCode)"></q-btn>
      </div>
      <div v-else>
        <div v-for="(comp, index) in tournament.competitionsList" :key="index">
          <q-expansion-item :label="comp.name" :header-class="index%2===0?'bg-grey text-black text-center text-h6 text-bold':'text-positive text-center text-h6 text-bold'" dense group="list" class="text-positive bg-dark">
            <SingleCompetitionJuryPanel :uuid="comp.uuid" :size="comp.scoreListSize"></SingleCompetitionJuryPanel>
          </q-expansion-item>
        </div>
      </div>
    </div>
    <div v-if="presentationMode && tournamentCheck">
      <q-page-sticky expand position="top">
      <q-linear-progress :value="progress" :color="color" instant-feedback
        track-color="secondary" dark/>
      </q-page-sticky>
      <SingleCompetitionJuryPanelPresentationModeComponent :uuid="uuid">
      </SingleCompetitionJuryPanelPresentationModeComponent>
    </div>
    <div v-if="!tournamentCheck">
      <div class="q-pa-md text-h6 text-center text-positive">Żadne zawody nie są otwarte</div>
    </div>
    <q-dialog position="standard" v-model=" failure ">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if=" message != null " class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model=" success ">
      <q-card>
        <q-card-section>
          <div v-if=" message != null " class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import App from 'src/App.vue'
// import { isWindows } from 'mobile-device-detect'
import { scroll } from 'quasar'
const { setVerticalScrollPosition } = scroll
export default {
  name: 'juryPanel.vue',
  components: {
    SingleCompetitionJuryPanel: lazyLoadComponent({
      componentFactory: () => import('components/tournament/SingleCompetitionJuryPanel.vue'),
      loading: SkeletonBox
    }),
    SingleCompetitionJuryPanelPresentationModeComponent: lazyLoadComponent({
      componentFactory: () => import('components/tournament/SingleCompetitionJuryPanelPresentationModeComponent.vue'),
      loading: SkeletonBox
    })
  },
  created () {
    this.getListTournaments()
    this.checkTournament()
    this.setColor()
  },
  data () {
    return {
      arbiter: window.localStorage.getItem('arbiter'),
      juryPanelCompetitionInExpansionItem: JSON.parse(window.localStorage.getItem('JuryPanelCompetitionInExpansionItem')),
      tournament: [],
      tournamentCheck: false,
      color: '',
      mobile: App.mobile,
      uuid: '',
      arbiterCode: '',
      progress: 1.0,
      time: 10000,
      timer: 12,
      vol: 0.0,
      interval: null,
      interval1: null,
      failure: false,
      success: false,
      message: null,
      presentationMode: false,
      main: App.main,
      local: App.host
    }
  },
  methods: {
    getListTournaments () {
      fetch('http://' + App.host + '/tournament/openTournament', {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(response => {
            this.tournament = response
          })
        } if (response.status === 418) {
          window.localStorage.setItem('arbiter', '000')
        }
      })
    },
    checkTournament () {
      fetch(`http://${this.local}/tournament/check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.tournamentCheck = response
          if (response === false) {
            window.localStorage.setItem('arbiter', '000')
          }
        })
    },
    setColor () {
      this.color = JSON.parse(window.localStorage.getItem('BackgroundDark')) ? 'positive' : 'primary'
    },
    presentationUUID () {
      let index = 0
      if (window.localStorage.getItem('SiteName') !== 'Panel Sędziego') {
        clearInterval(this.interval)
      }
      if (this.tournament.competitionsList[index].length > 15) {
        this.timer = this.tournament.competitionsList[index].length
      }
      this.progressBar()
      this.interval = setInterval(() => {
        if (window.localStorage.getItem('SiteName') !== 'Panel Sędziego') {
          clearInterval(this.interval)
        }
        if (this.tournament.competitionsList[index] == null) {
          this.getListTournaments()
          index = 0
        }
        this.uuid = ''
        if (this.progress >= 1.0) {
          this.uuid = this.tournament.competitionsList[index].uuid
          index++
          this.progress = this.vol
        }
      }, this.time / (this.time / this.timer))
    },
    progressBar () {
      this.progress = 0.9
      this.interval1 = setInterval(() => {
        if (window.localStorage.getItem('SiteName') !== 'Panel Sędziego') {
          clearInterval(this.interval1)
        }
        if (this.progress > 0.2) {
          // window.scrollTo(0, document.documentElement.clientHeight * (this.progress - 0.2))
          // scrollToElement(document.documentElement)
          setVerticalScrollPosition(document.documentElement, document.documentElement.clientHeight * (this.progress - 0.2), 0)
        }
        this.setColor()
        this.progress = this.progress + 0.001
      }, this.time / (this.time / this.timer))
    },
    checkArbiter (code) {
      fetch(`http://${this.local}/permissions/checkArbiter?code=${code}`, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.arbiter = response
            window.localStorage.setItem('arbiter', response)
          })
        } else {
          response.text().then(response => {
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
      }, 2000)
    }
  }
}
</script>
