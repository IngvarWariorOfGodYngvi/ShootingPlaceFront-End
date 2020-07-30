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
          <div id="title">Program </div>
        </q-toolbar-title>

        <div><q-item clickable v-ripple><q-avatar color="secondary" text-color="white" icon="perm_identity" /></q-item></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
        ><q-item class="flex flex-center" clickable tag="a" target="_self" href="https://shootingplacetest.herokuapp.com//#/" width="max">Strona Główna</q-item>
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
    <q-page-sticky position="bottom-right" :offset="[18, 18]" >
            <q-btn fab icon="add" color="accent" @click="showloading()"></q-btn>
          </q-page-sticky>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

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
          title: 'Klubowicze - Grupa Dorosła',
          caption: 'Obsługa podstawowa',
          icon: 'perm_identity',
          link: 'https://shootingplacetest.herokuapp.com//#/member/adult'
        },
        {
          title: 'Temp Grupa Powszechna',
          caption: 'Obsługa podstawowa',
          icon: 'perm_identity',
          link: 'https://shootingplacetest.herokuapp.com//#/member/adulttemp'
        },
        {
          title: 'Klubowicze - Grupa Młodzieżowa',
          caption: 'obsługa podstawowa',
          icon: 'perm_identity',
          link: 'https://shootingplacetest.herokuapp.com//#/member/nonadult'
        },
        {
          title: 'Temp Klubowicze Nieaktywni - Grupa Powszechna',
          caption: 'obsługa podstawowa',
          icon: 'person_remove',
          link: 'https://shootingplacetest.herokuapp.com//#/member/adultnonactivetemp'
        },
        {
          title: 'Klubowicze Nieaktywni - Grupa Młodzieżowa',
          caption: 'obsługa podstawowa',
          icon: 'person_remove',
          link: 'https://shootingplacetest.herokuapp.com//#/member/nonadultnonactive'
        },
        {
          title: 'Klubowicze Skreśleni z Listy członków',
          caption: 'obsługa podstawowa',
          icon: 'person_remove',
          link: 'https://shootingplacetest.herokuapp.com//#/member/erased'
        },
        {
          title: 'Dodaj nowego Klubowicza',
          caption: 'obsługa podstawowa',
          icon: 'add',
          link: 'https://shootingplacetest.herokuapp.com//#/member/addmember'
        },
        {
          title: 'Książka pobytu na Strzelnicy - Lista dzienna',
          caption: 'obsługa podstawowa',
          icon: 'book',
          link: 'https://shootingplacetest.herokuapp.com//#/dailyevidence/'
        },
        {
          title: 'Lista wydawania amunicji',
          caption: 'obsługa podstawowa',
          icon: 'book',
          link: 'https://shootingplacetest.herokuapp.com//#/ammolist'
        },
        {
          title: 'Swagger',
          caption: 'Dostępne metody kontrolerów',
          icon: 'code',
          link: 'http://localhost:8080/swagger-ui.html'
        }
      ]
    }
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    }
  }
}
</script>
