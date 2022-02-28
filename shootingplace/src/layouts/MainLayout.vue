<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

       <!-- <q-toolbar-title>
          <div class="row">
            <div class="col" id="title">{{$keycloak.keycloak.clientId}} </div>
            <div class="row reverse text-caption full-width">
              <a v-if="distance<1200000" class="text-caption text-red text-bold" style="padding-left: 10px; margin: 0px;cursor: pointer;" color="red" @click="clear()"> Odśwież sesję</a>
              <div id="timer"></div>
            </div>
          </div>
        </q-toolbar-title> -->

       <!-- <div><q-avatar v-ripple color="secondary" text-color="white" icon="perm_identity" />
        <q-menu>
        <div class="col q-pa-md">
            <q-btn
              color="primary"
              label="Wyloguj"
              push
              size="s"
              v-close-popup
              @click="logout()"
            />
        </div>
      </q-menu>
        </div> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      show-if-above
      content-style="height: 100vh"
      style="width: 50px;"
    >
      <q-list >
          <q-item @click="showloading(),clear()" class="flex flex-center q-pa-md" clickable tag="a" target="_self" :href="hrefTarget" width="max">
            <div class="text-h6 text-bold">STRONA GŁÓWNA</div>
          </q-item>
          <div @click="showloading(),clear()">
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        </div>
      </q-list>
      <div class="q-pa-sm" style="height: 28%" dense>
      <q-item-label v-if="quantities[8]>0" class="text-bold text-red" dense caption lines="3">Nieopłaconyh licencji : {{quantities[8]}}</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Najwyższy numer legitymacji : {{number}}</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Licencje ważne : {{quantities[1]}}</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Licencje nieważne : {{quantities[2]}}</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Klubowiczów ogółem : {{quantities[0] + quantities[3]}} ({{quantities[0]}} + {{quantities[3]}})</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Zapisów w aktualnym roku : {{members}}</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Nowych licencji w aktualnym roku : {{quantities[9]}}</q-item-label>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view/>
        <q-page-sticky position="top-right" :offset="[30, 30]">
          <q-fab
            v-if="color!='primary'||tournamentCheck"
            :color="color"
            glossy
            icon="keyboard_arrow_left"
            direction="left"
          >
            <q-fab-action v-if="color!='primary'" external-label label-position="top" color="primary" icon="book" @click="redirectToAmmoList()"><q-tooltip anchor="top middle" self="top middle" content-class="text-h6">Otwarta lista amunicyjna</q-tooltip></q-fab-action>
            <q-fab-action v-if="tournamentCheck" external-label label-position="top" color="secondary" icon="people" @click="redirectToCompetitionList()"><q-tooltip anchor="top middle" self="top middle" content-class="text-h6">Otwarte zawody</q-tooltip></q-fab-action>
            <!-- <q-fab-action square external-label label-position="top" color="orange" icon="airplay" label="Airplay" /> -->
            <!-- <q-fab-action square external-label label-position="top" color="accent" icon="room" label="Map" /> -->
          </q-fab>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
.ecru > * {
  background-color: #F5F5DC;
}
</style>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import App from 'src/App.vue'
export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },
  created () {
    this.clockTimer()
    this.getNumber()
    this.getMembersQuantity()
    this.getActualYearMemberCounts()
    this.check()
  },
  data () {
    return {
      leftDrawerOpen: false,
      interval: false,
      interval2: null,
      intervalTime: 1200000,
      distance: 1200000,
      number: null,
      members: null,
      barcode: null,
      color: 'primary',
      tournamentCheck: false,
      quantities: [],
      hrefTarget: 'http://' + App.prod,
      local: App.host,
      essentialLinks: [
        {
          title: 'Lista Klubowiczów',
          icon: 'perm_identity',
          link: 'http://' + App.prod + 'member'
        },
        {
          title: 'Licencje',
          icon: 'perm_identity',
          link: 'http://' + App.prod + 'license'
        },
        {
          title: 'Dodaj Nowego Klubowicza',
          icon: 'add',
          link: 'http://' + App.prod + 'member/adding'
        },
        {
          title: 'Lista Amunicyjna',
          icon: 'book',
          link: 'http://' + App.prod + 'ammolist'
        },
        {
          title: 'Zawody',
          icon: 'book',
          link: 'http://' + App.prod + 'competition'
        },
        {
          title: 'Lista Osób z Uprawnieniami',
          icon: 'book',
          link: 'http://' + App.prod + 'memberwithpermission'
        },
        {
          title: 'Zbrojownia',
          icon: 'book',
          link: 'http://' + App.prod + 'armory'
        },
        {
          title: 'Statystyki',
          icon: 'book',
          link: 'http://' + App.prod + 'statistics'
        },
        {
          title: 'Pozostałe Funkcje',
          icon: 'menu',
          link: 'http://' + App.prod + 'otherFunctions'
        },
        {
          title: 'Ustawienia',
          icon: 'settings',
          link: 'http://' + App.prod + 'settings'
        }
      ],
      programName: 'Program'
    }
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 500)
    },
    redirectToAmmoList () {
      window.location.href = 'http://' + App.prod + 'ammolist'
    },
    redirectToCompetitionList () {
      window.location.href = 'http://' + App.prod + 'competition'
    },
    redirectToMembersList () {
      window.location.href = 'http://' + App.prod + 'member'
    },
    onClick () {
      console.log('Clicked on a fab action')
    },
    getNumber () {
      fetch('http://' + this.local + '/statistics/maxLegNumber', {
        method: 'GET'
      }).then(response => response.json()).then(response => {
        this.number = response
      })
    },
    getMembersQuantity () {
      fetch('http://' + this.local + '/member/membersQuantity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.quantities = response
        })
    },
    getActualYearMemberCounts () {
      fetch('http://' + this.local + '/statistics/actualYearMemberCounts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.members = response
        })
    },
    check () {
      this.checkAnyOpenAmmoList()
      this.checkTournament()
      setInterval(() => {
        this.checkAnyOpenAmmoList()
        this.checkTournament()
      }, 120000)
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
    // logout () {
    //   this.$keycloak.keycloak.logout()
    // },
    clear () {
      this.interval = true
      this.distance = 1200000
    },
    clockTimer () {
      setInterval(() => {
        const minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((this.distance % (1000 * 60)) / 1000)
        document.getElementById('timer').innerHTML = 'Wylogowanie za: ' + minutes + 'm ' + seconds + 's '
        this.distance = this.distance - 1000
        if (this.distance < 0) {
          document.getElementById('timer').innerHTML = 'Wylogowywanie'
          this.logout()
        }
      }, 1000)
    }
  }
}
</script>
