<template>
  <q-page class="text-positive">
    <q-btn label="tryb prezentacji" dense unelevated :text-color="presentationMode ? 'dark' : 'white'"
      :color="presentationMode ? '' : 'primary'" v-if="main && !mobile && !presentationMode"
      @click="presentationMode = !presentationMode; presentationUUID()"></q-btn>
    <div v-if="!presentationMode">
      <div v-if="arbiter.length < 4" class="text-h6 q-pa-md">
          <q-input v-model="arbiterCode" @keypress.enter="checkArbiter(arbiterCode)" color="primary" type="password" label="Podaj pin" input-class="text-positive"
            label-color="positive"></q-input>
          <q-btn color="primary" label="zapisz" type="submit" @click="checkArbiter(arbiterCode)"></q-btn>
      </div>
      <div v-else>
        <div v-for="(comp, index) in tournament.competitionsList" :key="index">
          <SingleCompetitionJuryPanel :uuid="comp.uuid" :size="comp.scoreListSize"></SingleCompetitionJuryPanel>
        </div>
      </div>
    </div>
    <div v-else>
      <q-linear-progress :value="progress" class="q-mt-xs" size="0.5em" :color="color" instant-feedback
        track-color="secondary" dark />
      <SingleCompetitionJuryPanelPresentationModeComponent :uuid="uuid">
      </SingleCompetitionJuryPanelPresentationModeComponent>
    </div>
    <q-dialog position="top" v-model=" failure ">
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
import { isWindows } from 'mobile-device-detect'

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
    this.setColor()
  },
  data () {
    return {
      arbiter: window.localStorage.getItem('arbiter'),
      tournament: [],
      color: '',
      mobile: !isWindows,
      uuid: '',
      arbiterCode: '',
      progress: 1.0,
      time: 10000,
      vol: 0.0,
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
    setColor () {
      this.color = JSON.parse(window.localStorage.getItem('BackgroundDark')) ? 'positive' : 'primary'
    },
    presentationUUID () {
      let index = 0
      this.progressBar()
      setInterval(() => {
        if (this.tournament.competitionsList[index] == null) {
          index = 0
        }
        if (this.progress >= 1.1) {
          this.uuid = this.tournament.competitionsList[index].uuid
          index++
          this.progress = this.vol
        }
      }, this.time / 1000)
    },
    progressBar () {
      this.progress = 0.9
      setInterval(() => {
        this.setColor()
        this.progress = this.progress + 0.001
      }, this.time / (this.time / 10))
    },
    checkArbiter (code) {
      fetch(`http://${this.local}/permissions/checkArbiter?code=${code}`, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.arbiter = response
            window.localStorage.setItem('arbiter', response)
            window.localStorage.setItem('main', false)
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
