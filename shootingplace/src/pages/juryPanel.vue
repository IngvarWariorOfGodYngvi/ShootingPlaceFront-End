<template>
  <q-page>
    <q-btn label="tryb prezentacji" dense unelevated :text-color="presentationMode ? 'dark' : 'white'"
      :color="presentationMode ? '' : 'primary'" v-if="main && !mobile && !presentationMode"
      @click="presentationMode = !presentationMode"></q-btn>
    <div v-if="!presentationMode">
      <div v-if="arbiter.length < 4" class="text-h6 q-pa-md">
        <q-form>
          <q-input v-model="arbiterCode" color="primary" type="password" label="Podaj pin" input-class="text-positive"
            label-color="positive"></q-input>
          <q-btn color="primary" label="zapisz" type="submit" @click="checkArbiter(arbiterCode)"></q-btn>
        </q-form>
      </div>
      <div v-else>
        <div v-for="(comp, uuid) in tournaments.competitionsList" :key="uuid">
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
    this.presentationUUID()
    this.setColor()
  },
  data () {
    return {
      arbiter: window.localStorage.getItem('arbiter'),
      tournaments: [],
      color: '',
      mobile: !isWindows,
      uuid: '',
      arbiterCode: '',
      progress: 1.0,
      time: 10000,
      vol: 0.0,
      presentationMode: false,
      main: App.main,
      local: App.host
    }
  },
  methods: {
    async getListTournaments () {
      await fetch('http://' + App.host + '/tournament/list', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.tournaments = response
        })
    },
    setColor () {
      this.color = JSON.parse(window.localStorage.getItem('BackgroundDark')) ? 'white' : 'primary'
    },
    presentationUUID () {
      let index = 0
      this.progressBar()
      setInterval(() => {
        if (this.tournaments != null) {
          if (this.tournaments.competitionsList[index] == null) {
            index = 0
          }
          if (this.progress >= 1.1) {
            this.uuid = this.tournaments.competitionsList[index].uuid
            index++
            this.progress = this.vol
          }
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
      fetch('http://' + App.host + '/permissions/checkArbiter?code=' + code, {
        method: 'GET'
      }).then(response => {
        response.text().then(response => {
          console.log(response)
          this.arbiter = response
          window.localStorage.setItem('arbiter', response)
        })
      })
    }
  }
}
</script>
