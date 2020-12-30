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
          <div id="title">{{programName}} </div>
        </q-toolbar-title>

        <div><q-item clickable v-ripple><q-avatar color="secondary" text-color="white" icon="perm_identity" /></q-item></div>
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
        <q-item-label
          header
        ><q-item class="flex flex-center" clickable tag="a" target="_self" href="https://localhost:8081/#/" width="max">Strona Główna</q-item>
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
      <q-btn fab icon="add" color="accent" @click="showloading(), redirect()">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          <strong>Dodaj Klubowicza</strong>
        </q-tooltip>
    </q-btn>
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
          title: 'Lista Klubowiczów',
          caption: 'Obsługa podstawowa',
          icon: 'perm_identity',
          link: 'https://localhost:8081/#/member'
        },
        {
          title: 'Dodaj Nowego Klubowicza',
          caption: 'obsługa podstawowa',
          icon: 'add',
          link: 'https://localhost:8081/#/member/adding'
        },
        {
          title: 'Lista Amunicyjna',
          caption: 'obsługa podstawowa',
          icon: 'book',
          link: 'https://localhost:8081/#/ammolist'
        },
        {
          title: 'Lista Zawodów',
          caption: 'obsługa podstawowa',
          icon: 'book',
          link: 'https://localhost:8081/#/competition'
        },
        {
          title: 'Lista Osób z uprawnieniami',
          caption: 'obsługa dodatkowa',
          icon: 'book',
          link: 'https://localhost:8081/#/memberwithpermission'
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
      window.location.href = 'https://localhost:8081/#/member/dodawanie'
    }
  }
}
</script>
