<template>
    <div class="q-pa-md col-6">
      <div @click="showloading();changeTitleInMainLayout('Lista Klubowiczów')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'member'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="person" />
            <div class="self-center text-black" tabindex="1">Lista Klubowiczów</div>
            </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitleInMainLayout('Licencje')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'license'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="person" />
            <div class="self-center text-black" tabindex="1">Licencje</div>
            </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitleInMainLayout('Dodaj Nowego Klubowicza')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'member/adding'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="person_add" />
            <div class="self-center text-black" tabindex="1">Dodaj Nowego Klubowicza</div>
            </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitleInMainLayout('Lista Amunicyjna')" class="q-pa-xs fun">
        <q-item v-if="color!=='primary'" class="q-pa-none xyz2 bg-secondary" clickable tag="a" target="_self" :href="app + 'ammolist'" width="max">
          <div class="row text-white full-width">
              <q-icon class="q-pa-md text-h5" name="list_alt" />
            <div class="self-center" tabindex="1"><b class="self-center text-white text-right flex-end">OTWARTA </b> Lista Amunicyjna</div>
          </div>
        </q-item>
        <q-item v-else class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'ammolist'" width="max">
          <div class="row text-white full-width">
              <q-icon class="q-pa-md text-grey-7 text-h5" name="list_alt" />
            <div class="self-center text-black" tabindex="1">Lista Amunicyjna</div>
          </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitleInMainLayout('Zawody')" class="q-pa-xs">
        <q-item v-if="tournamentCheck" class="q-pa-none xyz2 bg-secondary" clickable tag="a" target="_self" :href="app + 'competition'" width="max">
          <div class="row text-white full-width">
              <q-icon class="q-pa-md text-h5" name="book" />
            <div class="self-center" tabindex="1"><b class="self-center text-white text-right flex-end">OTWARTE </b> Zawody</div>
          </div>
        </q-item>
        <q-item v-else class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'competition'" width="max">
          <div class="row text-white full-width">
              <q-icon class="q-pa-md text-grey-7 text-h5" name="book" />
            <div class="self-center text-black" tabindex="1">Zawody</div>
          </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitleInMainLayout('Lista Osób z Uprawnieniami')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'memberwithpermission'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="book" />
            <div class="self-center text-black" tabindex="1">Lista Osób z Uprawnieniami</div>
            </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitleInMainLayout('Zbrojownia')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'armory'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="storage" />
            <div class="self-center text-black" tabindex="1">Zbrojownia</div>
            </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitleInMainLayout('Statystyki')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'statistics'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="bar_chart"/>
            <div class="self-center text-black" tabindex="1">Statystyki</div>
            </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitleInMainLayout('Pozostałe Funkcje')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'otherFunctions'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="menu"/>
            <div class="self-center text-black" tabindex="1">Pozostałe Funkcje</div>
            </div>
        </q-item>
      </div>
      <div @click="showloading();changeTitleInMainLayout('Ustawienia')" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="app + 'settings'" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="settings"/>
            <div class="self-center text-black" tabindex="1">Ustawienia</div>
            </div>
        </q-item>
      </div>
      <!-- <div @click="showloading()" class="q-pa-xs">
        <q-item class="q-pa-none xyz2" clickable tag="a" target="_self" :href="friend" width="max">
            <div class="row text-grey-7 text-left">
              <q-icon class="q-pa-md text-h5" name="settings"/>
            <div class="self-center text-black" tabindex="1">Faktury STRONA GŁÓWNA</div>
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
