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

       <q-toolbar-title >
          <div id="title">{{$keycloak.keycloak.clientId}} </div>
        </q-toolbar-title>

       <div><q-avatar v-ripple color="secondary" text-color="white" icon="perm_identity" />
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
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      show-if-above
      content-class="bg-grey-2 ecru full-height"
      style="width: 50px;"
    >
      <q-list>
          <q-item @click="leftDrawerOpen=false" class="flex flex-center q-pa-md" clickable tag="a" target="_self" :href="hrefTarget" width="max">
            <div class="text-h6 text-bold">STRONA GŁÓWNA</div>
          </q-item>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
      <div class="q-pa-sm ecru" style="height: 28%" dense>
      <q-item-label class="text-bold" dense caption lines="3">Najwyższy numer legitymacji : {{number}}</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Licencje ważne : {{quantity[1]}}</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Licencje nieważne : {{quantity[0]}}</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Klubowiczów ogółem : {{quantities[0] + quantities[3]}} ({{quantities[0]}} + {{quantities[3]}})</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Zapisów w aktualnym roku : {{members}}</q-item-label>
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
        <q-fab-action v-if="color!='primary'" external-label label-position="top" color="primary" icon="book" @click="redirectToAmmoList()"><q-tooltip anchor="top" content-class="text-h6">Otwarta lista amunicyjna</q-tooltip></q-fab-action>
        <q-fab-action v-if="tournamentCheck" external-label label-position="top" color="secondary" icon="people" @click="redirectToCompetitionList()"><q-tooltip anchor="top" content-class="text-h6">Otwarte zawody</q-tooltip></q-fab-action>
        <!-- <q-fab-action square external-label label-position="top" color="orange" icon="airplay" label="Airplay" /> -->
        <!-- <q-fab-action square external-label label-position="top" color="accent" icon="room" label="Map" /> -->
      </q-fab>
      <q-tooltip anchor="">Masz powiadomienia</q-tooltip>
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
    this.getNumber()
    this.getMembersWithLicenseQuantity()
    this.getMembersQuantity()
    this.getActualYearMemberCounts()
    this.check()
    this.logoutInterval()
  },
  data () {
    return {
      leftDrawerOpen: false,
      number: null,
      members: null,
      color: 'primary',
      tournamentCheck: false,
      quantity: [],
      quantities: [],
      hrefTarget: 'http://' + App.prod,
      local: App.host,
      essentialLinks: [
        {
          title: 'Lista Klubowiczów',
          caption: 'Obsługa podstawowa',
          icon: 'perm_identity',
          link: 'http://' + App.prod + 'member'
        },
        {
          title: 'Licencje',
          caption: 'Obsługa podstawowa',
          icon: 'perm_identity',
          link: 'http://' + App.prod + 'license'
        },
        {
          title: 'Dodaj Nowego Klubowicza',
          caption: 'obsługa podstawowa',
          icon: 'add',
          link: 'http://' + App.prod + 'member/adding'
        },
        {
          title: 'Lista Amunicyjna',
          caption: 'obsługa podstawowa',
          icon: 'book',
          link: 'http://' + App.prod + 'ammolist'
        },
        {
          title: 'Lista Zawodów',
          caption: 'obsługa podstawowa',
          icon: 'book',
          link: 'http://' + App.prod + 'competition'
        },
        {
          title: 'Lista Osób z Uprawnieniami',
          caption: 'obsługa dodatkowa',
          icon: 'book',
          link: 'http://' + App.prod + 'memberwithpermission'
        },
        {
          title: 'Magazyn Broni i Amunicji',
          caption: 'obsługa dodatkowa',
          icon: 'book',
          link: 'http://' + App.prod + 'armory'
        },
        {
          title: 'Statystyki i Wyliczenia',
          caption: 'obsługa dodatkowa',
          icon: 'book',
          link: 'http://' + App.prod + 'statistics'
        },
        {
          title: 'Pozostałe Funkcje',
          caption: 'obsługa dodatkowa',
          icon: 'menu',
          link: 'http://' + App.prod + 'otherFunctions'
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
      }, 1000)
    },
    redirectToAmmoList () {
      window.location.href = 'http://' + App.prod + 'ammolist'
    },
    redirectToCompetitionList () {
      window.location.href = 'http://' + App.prod + 'competition'
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
    getMembersWithLicenseQuantity () {
      fetch('http://' + this.local + '/license/membersQuantity', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.quantity = response
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
    logout () {
      this.$keycloak.keycloak.logout()
    },
    logoutInterval () {
      setInterval(() => {
        this.logout()
      }, 600000)
    }
  }
}
</script>
