<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          class="q-pa-none text-h6 brand"
          :icon="icon"
          aria-label="Menu"
          :label="title"
          @click="leftDrawerOpen = !leftDrawerOpen"
          @mousemove="leftDrawerOpen?icon='arrow_left':icon='arrow_right'"
          @mouseleave="icon='menu'"
        />
        <q-toggle v-model="backgroundDark" :val="true" :value="true" color="dark" keep-color @input="changeColor()"></q-toggle>
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
      content-style="height:100vh;"
      style="width: 50px;"
    >
    <div class="full-height bg-secondary">
      <q-list class="bg-secondary">
          <q-item @click="showloading()" class="flex flex-center q-pa-md bg-primary text-white xyz1" clickable tag="a" target="_self" :href="hrefTarget" width="max">
            <div class="text-h6 text-bold text-center"><div>PROGRAM</div> STRONA GŁÓWNA</div>
          </q-item>
          <div @click="showloading()">
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :title="link.title"
          :visible="link.visible"
          />
        </div>
      </q-list>
      <members-quantities class="bg-secondary">
      </members-quantities>
      <WorkTimeList v-if="!mobile" style="margin: auto;height:auto">
      </WorkTimeList>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view/>
        <q-page-sticky :position="'top-right'" :offset="[30, 30]">
          <q-fab
            v-if="color!=='primary'||tournamentCheck"
            :color="color"
            glossy
            icon="keyboard_arrow_left"
            direction="left"
          >
            <q-fab-action v-if="color!=='primary'" external-label :label-position="'top'" color="primary" icon="book" @click="redirectToAmmoList()"><q-tooltip anchor="top middle" self="top middle" content-class="text-h6">Otwarta lista amunicyjna</q-tooltip></q-fab-action>
            <q-fab-action v-if="tournamentCheck" external-label :label-position="'top'" color="secondary" icon="people" @click="redirectToCompetitionList()"><q-tooltip anchor="top middle" self="top middle" content-class="text-h6">Otwarte zawody</q-tooltip></q-fab-action>
            <!-- <q-fab-action square external-label label-:position="'top'" color="orange" icon="airplay" label="Airplay" /> -->
            <!-- <q-fab-action square external-label label-:position="'top'" color="accent" icon="room" label="Map" /> -->
          </q-fab>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style src="../style/style.scss" lang="scss">
</style>

<script>
import { colors } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'
import membersQuantities from 'components/MembersQuantities.vue'
import WorkTimeList from 'components/WorkTimeList.vue'
import App from 'src/App.vue'
import { isWindows } from 'mobile-device-detect'
export default {
  name: 'MainLayout',
  visible2: false,
  components: {
    EssentialLink,
    membersQuantities,
    WorkTimeList
  },
  created () {
    if (window.localStorage.getItem('BackgroundDark') == null) {
      window.localStorage.setItem('BackgroundDark', false)
    } else {
      this.changeColor()
    }
    this.getActualYearMemberCounts()
  },
  data () {
    return {
      title: '',
      mobile: !isWindows,
      backgroundDark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      icon: 'menu',
      visible1: true,
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
      hrefTarget: 'http://' + location.hostname + ':8080/strzelnica/#/',
      local: App.host,
      essentialLinks: [
        {
          title: 'Lista Klubowiczów',
          icon: 'person',
          link: 'http://' + App.prod + 'member',
          visible: true
        },
        {
          title: 'Licencje',
          icon: 'person',
          link: 'http://' + App.prod + 'license',
          visible: true
        },
        {
          title: 'Dodaj Nowego Klubowicza',
          icon: 'person_add',
          link: 'http://' + App.prod + 'member/adding',
          visible: isWindows
        },
        {
          title: 'Lista Amunicyjna',
          icon: 'list_alt',
          link: 'http://' + App.prod + 'ammolist',
          visible: true
        },
        {
          title: 'Zawody',
          icon: 'book',
          link: 'http://' + App.prod + 'competition',
          visible: isWindows
        },
        {
          title: 'Lista Osób z Uprawnieniami',
          icon: 'book',
          link: 'http://' + App.prod + 'memberwithpermission',
          visible: isWindows
        },
        {
          title: 'Zbrojownia',
          icon: 'storage',
          link: 'http://' + App.prod + 'armory',
          visible: isWindows
        },
        {
          title: 'Statystyki',
          icon: 'bar_chart',
          link: 'http://' + App.prod + 'statistics',
          visible: true
        },
        {
          title: 'Pozostałe Funkcje',
          icon: 'menu',
          link: 'http://' + App.prod + 'otherFunctions',
          visible: isWindows
        },
        {
          title: 'Ustawienia',
          icon: 'settings',
          link: 'http://' + App.prod + 'settings',
          visible: isWindows
        },
        {
          title: 'Pliki',
          icon: 'download',
          link: 'http://' + App.prod + 'files',
          visible: isWindows
        },
        {
          title: 'Panel Sędziego',
          icon: 'done',
          link: 'http://' + App.prod + 'juryPanel',
          visible: true
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
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    redirectToAmmoList () {
      window.location.href = 'http://' + App.prod + 'ammolist'
    },
    redirectToCompetitionList () {
      window.location.href = 'http://' + App.prod + 'competition'
    },
    changeColor () {
      console.log(this.backgroundDark)
      if (this.backgroundDark) {
        window.localStorage.setItem('BackgroundDark', true)
        colors.setBrand('dark-separator', '$grey-6')
        colors.setBrand('primary', '#374550')
        colors.setBrand('secondary', '#871421')
        colors.setBrand('dark', '#1D1D1D')
        colors.setBrand('positive', '#FFFFFF')
        colors.setBrand('accent', '#A0A0A0')
      } else {
        window.localStorage.setItem('BackgroundDark', false)
        colors.setBrand('dark-separator', '$grey-2')
        colors.setBrand('primary', '#871421')
        colors.setBrand('secondary', '#374550')
        colors.setBrand('dark', '#FFFFFF')
        colors.setBrand('positive', '#000000')
        colors.setBrand('accent', '#f3f3f3')
      }
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
