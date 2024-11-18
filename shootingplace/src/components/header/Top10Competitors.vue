<template>
    <q-avatar text-color="white" color="secondary" size="3.5em" rounded
              style="border: solid 1px white; border-radius: 50%" class="reverse pulsing"
              icon="person">
      <q-tooltip @show="getTop10Competitors()" class="bg-primary" content-class="bg-primary">
        <div class="text-h6 text-center">TOP 10 STARTY {{ new Date().getFullYear() }}</div>
        <div v-if="competitors.length === 0 " class="text-center"><q-circular-progress color="white" indeterminate/> ładowanie</div>
        <div v-for="(item,id,index) in competitors" :key="index" class="bg-secondary" style="width: 25vw">
          <div class="row full-width q-pa-xs"
               :class="index===0?'bg-amber-9':index===1?'bg-grey-6':index===2?'bg-brown':''">
            <div class="col-1 text-center">{{ index + 1 }}</div>
            <div class="col-8">{{ id }}</div>
            <div class="col-3 text-right">{{ item }} starty</div>
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
      competitors: [],
      local: App.host,
      shootingPlace: App.shootingPlace
    }
  },
  methods: {
    getTop10Competitors () {
      if (this.competitors.length < 1) {
        fetch(`${this.local}/statistics/highStartsCompetitors`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(response => {
            this.competitors = response
          })
      }
    }

  }
}
</script>
