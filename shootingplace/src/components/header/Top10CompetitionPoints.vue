<template>
  <q-avatar text-color="white" color="secondary" size="3.5em" rounded
            style="border: solid 1px white; border-radius: 50%" class="reverse pulsing"
            icon="scoreboard">
    <q-tooltip @show="getTop10CompetitionPoints()" class="bg-primary" content-class="bg-primary">
      <div class="text-h6 text-center">TOP 10 PUNKTY {{ new Date().getFullYear() }}</div>
      <div v-if="competitionPoints.length === 0 " class="text-center"><q-circular-progress color="white" indeterminate/> ładowanie</div>
      <div v-for="(item,id,index) in competitionPoints" :key="index" class="bg-secondary" style="width: 25vw">
        <div class="row full-width q-pa-xs"
             :class="index===0?'bg-amber-9':index===1?'bg-grey-6':index===2?'bg-brown':''">
          <div class="col-1 text-center">{{ index + 1 }}</div>
          <div class="col-8">{{ id }}</div>
          <div class="col-3 text-right">{{ item }} punktów</div>
        </div>
      </div>
    </q-tooltip>
  </q-avatar>
</template>
<script>
import App from 'src/App.vue'
export default {
  data () {
    return {
      competitionPoints: [],
      local: App.host,
      shootingPlace: App.shootingPlace
    }
  },
  methods: {
    getTop10CompetitionPoints () {
      if (this.competitionPoints.length < 1) {
        fetch(`${this.local}/statistics/highCompetitionPoints`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(response => {
            this.competitionPoints = response
          })
      }
    }

  }
}
</script>
