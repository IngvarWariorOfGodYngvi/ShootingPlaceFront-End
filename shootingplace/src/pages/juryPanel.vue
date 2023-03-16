<template>
<q-page>
  <div v-for="(comp,uuid) in tournaments.competitionsList" :key="uuid">
    <SingleCompetitionJuryPanel :uuid="comp.uuid" :size="comp.scoreListSize"></SingleCompetitionJuryPanel>
  </div>
</q-page>
</template>

<script>
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import App from 'src/App.vue'

export default {
  name: 'juryPanel.vue',
  components: {
    SingleCompetitionJuryPanel: lazyLoadComponent({
      componentFactory: () => import('components/tournament/SingleCompetitionJuryPanel.vue'),
      loading: SkeletonBox
    })
  },
  created () {
    this.getListTournaments()
  },
  data () {
    return {
      tournaments: null,
      local: App.host
    }
  },
  methods: {
    getListTournaments () {
      fetch('http://' + App.host + '/tournament/list', {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.tournaments = response
            }
          )
        } else {
          console.log('nic nie ma do pokazania')
          this.tournaments = null
        }
      }
      )
    }
  }
}
</script>
