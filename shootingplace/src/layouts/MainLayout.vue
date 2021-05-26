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

       <div><q-avatar @click="$keycloak.loadUserProfile" clickable v-ripple color="secondary" text-color="white" icon="perm_identity" />
        <q-menu>
        <div class="col q-pa-md">
            <q-btn
              color="primary"
              label="Wyloguj"
              push
              size="s"
              v-close-popup
              @click="$keycloak.keycloak.logout"
            />
        </div>
        <div class="col q-pa-md">
            <q-btn
              color="primary"
              label="token"
              push
              size="s"
              v-close-popup
              @click="$keycloak.keycloak.updateToken"
            />
        </div>
      </q-menu>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
      style="width: 50px"
    >
      <q-list>
        <q-item-label header>
          <q-item class="flex flex-center" clickable tag="a" target="_self" :href="hrefTarget" width="max"><q-field class="full-width" standout><template v-slot:control><div class="fit flex flex-center text-center non-selectable q-pa-md">Strona główna</div></template></q-field></q-item>
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
      <div class="q-pa-sm" dense>
      <q-item-label class="text-bold" dense caption lines="3">Najwyższy numer legitymacji : {{number}}</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Licencje ważne : {{quantity[1]}}</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Licencje nieważne : {{quantity[0]}}</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Klubowiczów ogółem : {{quantities[0] + quantities[3]}} ({{quantities[0]}} + {{quantities[3]}})</q-item-label>
      <q-item-label class="text-bold" dense caption lines="3">Zapisów w aktualnym roku : {{members}}</q-item-label>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import keycloak from '@dsb-norge/vue-keycloak-js'
import Vue from 'vue'
import App from 'src/App.vue'
import router from 'src/router'

Vue.use(keycloak, {
  logout: {
    redirectUri: 'http://localhost:8180/auth'
  },
  onReady: (keycloak) => {
    this.userData = keycloak.loadUserInfo()
    keycloak.loadUserInfo().success((userData) => {
      new Vue({
        router,
        render: h => h(App)
      }).$mount('#app')
    })
  }
})
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
  },
  data () {
    return {
      leftDrawerOpen: false,
      number: null,
      members: null,
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
    }
  }
}
</script>
