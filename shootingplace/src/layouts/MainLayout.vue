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
          link: 'https://localhost:8081/#/member/adult'
        },
        {
          title: 'Klubowicze - Grupa Młodzieżowa',
          caption: 'obsługa podstawowa',
          icon: 'perm_identity',
          link: 'https://localhost:8081/#/member/nonadult'
        },
        {
          title: 'Klubowicze Nieaktywni - Grupa Dorosła',
          caption: 'obsługa podstawowa',
          icon: 'person_remove',
          link: 'https://localhost:8081/#/member/adultnonactive'
        },
        {
          title: 'Klubowicze Nieaktywni - Grupa Młodzieżowa',
          caption: 'obsługa podstawowa',
          icon: 'person_remove',
          link: 'https://localhost:8081/#/member/nonadultnonactive'
        },
        {
          title: 'Klubowicze Skreśleni z Listy członków',
          caption: 'obsługa podstawowa',
          icon: 'person_remove',
          link: 'https://localhost:8081/#/member/erased'
        },
        {
          title: 'Dodaj nowego Klubowicza',
          caption: 'obsługa podstawowa',
          icon: 'add',
          link: 'https://localhost:8081/#/member/addmember'
        },
        {
          title: 'Wyszukaj',
          caption: 'obsługa podstawowa',
          icon: 'loupe',
          link: 'https://localhost:8081/#/member/'
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
    setTitile () {
    }
  }
}
</script>
