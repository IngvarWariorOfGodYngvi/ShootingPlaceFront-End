<template>
    <div :class="mobile?'q-pa-md full-width':'q-pa-md col-6'" :style="mobile?'opacity: 75%':''">
      <div @click="showloading();changeTitle ('Lista Klubowiczów')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'member'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="person" />
            <div class="self-center text-black">Lista Klubowiczów</div>
            </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitle ('Licencje')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'license'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="person" />
            <div class="self-center text-black">Licencje</div>
            </div>
        </q-item>
      </div>
      <div v-if="main" @click="showloading();changeTitle ('Dodaj Nowego Klubowicza')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'member/adding'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="person_add" />
            <div class="self-center text-black">Dodaj Nowego Klubowicza</div>
            </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitle ('Lista Amunicyjna')" class="q-pa-xs fun">
        <q-item v-if="color!=='primary'" class="q-pa-none xyz2 bg-secondary" clickable tag="a" target="_self" :href="app + 'ammolist'" width="max">
          <div class="row text-white full-width">
              <q-icon class="q-pa-md text-h5" name="list_alt" />
            <div class="self-center"><b class="self-center text-white text-right flex-end">OTWARTA </b> Lista Amunicyjna</div>
          </div>
        </q-item>
        <q-item v-else class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'ammolist'" width="max">
          <div class="row text-white full-width">
              <q-icon class="q-pa-md text-grey-7 text-h5" name="list_alt" />
            <div class="self-center text-black">Lista Amunicyjna</div>
          </div>
        </q-item>
      </div>
      <div v-if="main" @click="showloading();changeTitle ('Zawody')" class="q-pa-xs">
        <q-item v-if="tournamentCheck" class="q-pa-none xyz2 bg-secondary" clickable tag="a" target="_self" :href="app + 'competition'" width="max">
          <div class="row text-white full-width">
              <q-icon class="q-pa-md text-h5" name="book" />
            <div class="self-center"><b class="self-center text-white text-right flex-end">OTWARTE </b> Zawody</div>
          </div>
        </q-item>
        <q-item v-else class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'competition'" width="max">
          <div class="row text-white full-width">
              <q-icon class="q-pa-md text-grey-7 text-h5" name="book" />
            <div class="self-center text-black">Zawody</div>
          </div>
        </q-item>
      </div>
<!--      <div v-if="main" @click="showloading()" class="q-pa-xs">-->
<!--        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'memberwithpermission'" width="max">-->
<!--            <div class="row text-grey-7 text-left">-->
<!--              <q-icon class="q-pa-md text-h5" name="book" />-->
<!--            <div class="self-center text-black">Lista Osób z Uprawnieniami</div>-->
<!--            </div>-->
<!--        </q-item>-->
<!--      </div>-->
      <div @click="showloading();changeTitle ('Zbrojownia')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'armory'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="storage" />
            <div class="self-center text-black">Zbrojownia</div>
            </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitle ('Statystyki')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'statistics'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="bar_chart"/>
            <div class="self-center text-black">Statystyki</div>
            </div>
        </q-item>
      </div>
      <div v-if="main" @click="showloading();changeTitle ('Pozostałe Funkcje')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'otherFunctions'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="menu"/>
            <div class="self-center text-black">Pozostałe Funkcje</div>
            </div>
        </q-item>
      </div>
      <div v-if="main" @click="showloading();changeTitle ('Ustawienia')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'settings'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="settings"/>
            <div class="self-center text-black">Ustawienia</div>
            </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitle ('Panel Sędziego')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'juryPanel'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="done"/>
            <div class="self-center text-black">Panel Sędziego</div>
            </div>
        </q-item>
      </div>
      <!-- <div @click="showloading()" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="friend" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="settings"/>
            <div class="self-center text-black">Faktury STRONA GŁÓWNA</div>
            </div>
        </q-item>
      </div> -->
    </div>
</template>
<style src="../style/style.scss" lang="scss">

</style>

<script>
import App from 'src/App.vue'
export default {
  name: 'MainList',
  data () {
    return {
      app: 'http://' + App.prod,
      friend: 'http://' + App.friend,
      color: 'primary',
      tournamentCheck: false,
      mobile: App.mobile,
      main: App.main,
      title: '',
      local: App.host
    }
  },
  created () {
    this.check()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 500)
    },
    changeTitle (title) {
      window.localStorage.setItem('SiteName', title)
    },
    checkAnyOpenAmmoList () {
      fetch('http://' + this.local + '/ammoEvidence/checkAnyOpenEvidence', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.color = response
        })
    },
    checkTournament () {
      fetch('http://' + this.local + '/tournament/check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.tournamentCheck = response
        })
    },
    check () {
      this.checkAnyOpenAmmoList()
      this.checkTournament()
      setInterval(() => {
        this.checkAnyOpenAmmoList()
        this.checkTournament()
      }, 300000)
    }
  }
}

</script>
