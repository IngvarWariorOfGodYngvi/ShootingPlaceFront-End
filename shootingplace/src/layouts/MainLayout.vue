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
          <q-item class="flex flex-center" clickable tag="a" target="_self" href="http://localhost:8080/strzelnica/#/" width="max"><q-field class="full-width" standout><template v-slot:control><div class="fit flex flex-center text-center non-selectable q-pa-md">Strona główna</div></template></q-field></q-item>
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
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
    keycloak.loadUserInfo().success((data) => {
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

  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Lista Klubowiczów',
          caption: 'Obsługa podstawowa',
          icon: 'perm_identity',
          link: 'http://localhost:8080/strzelnica/#/member'
        },
        {
          title: 'Dodaj Nowego Klubowicza',
          caption: 'obsługa podstawowa',
          icon: 'add',
          link: 'http://localhost:8080/strzelnica/#/member/adding'
        },
        {
          title: 'Lista Amunicyjna',
          caption: 'obsługa podstawowa',
          icon: 'book',
          link: 'http://localhost:8080/strzelnica/#/ammolist'
        },
        {
          title: 'Lista Zawodów',
          caption: 'obsługa podstawowa',
          icon: 'book',
          link: 'http://localhost:8080/strzelnica/#/competition'
        },
        {
          title: 'Lista Osób z Uprawnieniami',
          caption: 'obsługa dodatkowa',
          icon: 'book',
          link: 'http://localhost:8080/strzelnica/#/memberwithpermission'
        },
        {
          title: 'Pozostałe funkcje',
          caption: 'obsługa dodatkowa',
          icon: 'book',
          link: 'http://localhost:8080/strzelnica/#/otherFunctions'
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
    redirect () {
      window.location.href = 'http://localhost:8080/strzelnica/#/member/adding'
    }
  }
}
</script>
