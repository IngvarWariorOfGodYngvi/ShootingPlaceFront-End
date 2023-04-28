<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="full-width row">
        <q-btn
          flat
          dense
          class="q-pa-none text-h6 brand"
          :icon="icon"
          aria-label="Menu"
          :label="title"
          @click="setDrawer(!leftDrawerOpen)"
          @mousemove="leftDrawerOpen?icon='arrow_left':icon='arrow_right'"
          @mouseleave="icon='menu'"
        />
        <q-toggle v-model="backgroundDark" :val="true" :value="true" color="dark" keep-color
                  @input="changeColor()"></q-toggle>
<!--        <q-item>{{arbiter}}</q-item>-->
<!--        <q-btn @click="reset()" label="reset" color="secondary"></q-btn>-->
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
        <div v-if="main" class="full-width row reverse">
          <q-avatar text-color="white" color="secondary" size="3.5em" rounded
                    style="border: solid 1px white; border-radius: 50%" class="reverse"
                    icon="scoreboard">
            <q-tooltip @show="getTop10CompetitionPoints()" class="bg-primary" content-class="bg-primary">
              <div class="text-h6 text-center">TOP 10 PUNKTY {{ new Date().getFullYear() }}</div>
              <div v-for="(item,id,index) in competitionPoints" :key="index" class="bg-secondary" style="width: 25vw">
                <div class="row full-width q-pa-xs"
                     :class="index===0?'bg-amber-9':index===1?'bg-grey-6':index===2?'bg-brown':''">
                  <div class="col-1 text-center">{{ index + 1 }}</div>
                  <div class="col-8">{{ id }}</div>
                  <div class="col-3 text-right">{{ item }} punktów</div>
                </div>
              </div>
            </q-tooltip>
          </q-avatar>
          <q-avatar text-color="white" color="secondary" size="3.5em" rounded
                    style="border: solid 1px white; border-radius: 50%" class="reverse"
                    icon="person">
            <q-tooltip @show="getTop10Competitors()" class="bg-primary" content-class="bg-primary">
              <div class="text-h6 text-center">TOP 10 STARTY {{ new Date().getFullYear() }}</div>
              <div v-for="(item,id,index) in competitors" :key="index" class="bg-secondary" style="width: 25vw">
                <div class="row full-width q-pa-xs"
                     :class="index===0?'bg-amber-9':index===1?'bg-grey-6':index===2?'bg-brown':''">
                  <div class="col-1 text-center">{{ index + 1 }}</div>
                  <div class="col-8">{{ id }}</div>
                  <div class="col-3 text-right">{{ item }} starty</div>
                </div>
              </div>
            </q-tooltip>
          </q-avatar>
          <q-avatar text-color="white" color="secondary" size="3.5em" rounded
                    style="border: solid 1px white; border-radius: 50%" class="reverse"
                    icon="payments">
            <q-tooltip @show="getTop10MembersWithTheMostMembershipContributions()" class="bg-primary"
                       content-class="bg-primary">
              <div class="text-h6 text-center">TOP 10 ILOŚCI SKŁADEK {{ new Date().getFullYear() }}</div>
              <div v-for="(item,id,index) in contributors" :key="index" class="bg-secondary" style="width: 25vw">
                <div class="row full-width q-pa-xs"
                     :class="index===0?'bg-amber-9':index===1?'bg-grey-6':index===2?'bg-brown':''">
                  <div class="col-1 text-center">{{ index + 1 }}</div>
                  <div class="col-8">{{ id }}</div>
                  <div class="col-3 text-right">{{ item }} składki</div>
                </div>
              </div>
            </q-tooltip>
          </q-avatar>
          <q-avatar text-color="white" color="secondary" size="3.5em" rounded
                    style="border: solid 1px white; border-radius: 50%" class="reverse"
                    icon="analytics">
            <q-tooltip @show="getHighStarts()" class="bg-primary" content-class="bg-primary">
              <div class="text-h6 text-center">TOP 10 ZAWODÓW</div>
              <div v-for="(item,id,index) in starts" :key="id" class="bg-secondary" style="width: 25vw">
                <div class="row full-width q-pa-xs"
                     :class="index===0?'bg-amber-9':index===1?'bg-grey-6':index===2?'bg-brown':''">
                  <div class="col-1 text-center">{{ index + 1 }}</div>
                  <div class="col-8">{{ id }}</div>
                  <div class="col-3 text-right">{{ item }} osobostartów</div>
                </div>
              </div>
            </q-tooltip>
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      class="bg-secondary"
      @hide="setDrawer(false)"
    >
      <div class="bg-secondary full-height">
        <q-list>
          <q-item @click="showloading()" class="flex flex-center q-pa-md bg-primary text-white xyz1" clickable tag="a"
                  target="_self" :href="hrefTarget" width="max">
            <div class="text-h6 text-bold text-center">
              <div>PROGRAM</div>
              STRONA GŁÓWNA
            </div>
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
        <WorkTimeList v-if="!mobile&&main" style="margin: auto;height:auto">
        </WorkTimeList>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view/>
        <!--        <q-page-sticky :position="'top-right'" :offset="[30, 30]">-->
        <!--          <q-fab-->
        <!--            v-if="color!=='primary'||tournamentCheck"-->
        <!--            :color="color"-->
        <!--            glossy-->
        <!--            icon="keyboard_arrow_left"-->
        <!--            direction="left"-->
        <!--          >-->
        <!--            <q-fab-action v-if="color!=='primary'" external-label label-position="top" color="primary" icon="book" @click="redirectToAmmoList()"><q-tooltip anchor="top middle" self="top middle" content-class="text-h6">Otwarta lista amunicyjna</q-tooltip></q-fab-action>-->
        <!--            <q-fab-action v-if="tournamentCheck" external-label label-position="top" color="secondary" icon="people" @click="redirectToCompetitionList()"><q-tooltip anchor="top middle" self="top middle" content-class="text-h6">Otwarte zawody</q-tooltip></q-fab-action>-->
        <!--            &lt;!&ndash; <q-fab-action square external-label label-:position="'top'" color="orange" icon="airplay" label="Airplay" /> &ndash;&gt;-->
        <!--            &lt;!&ndash; <q-fab-action square external-label label-:position="'top'" color="accent" icon="room" label="Map" /> &ndash;&gt;-->
        <!--          </q-fab>-->
        <!--        </q-page-sticky>-->
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
      window.localStorage.setItem('BackgroundDark', 'false')
    } else {
      this.changeColor()
    }
    this.getActualYearMemberCounts()
  },
  data () {
    return {
      title: '',
      zero: 1,
      arbiter: window.localStorage.getItem('arbiter'),
      mobile: !isWindows,
      main: App.main,
      backgroundDark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      icon: 'menu',
      leftDrawerOpen: JSON.parse(window.localStorage.getItem('drawer')),
      distance: 1200000,
      number: null,
      members: null,
      barcode: null,
      color: 'primary',
      tournamentCheck: false,
      starts: [],
      competitors: [],
      contributors: [],
      competitionPoints: [],
      quantities: [],
      hrefTarget: 'http://' + App.prod,
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
          visible: App.main
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
          visible: App.main
        },
        // {
        //   title: 'Lista Osób z Uprawnieniami',
        //   icon: 'book',
        //   link: 'http://' + App.prod + 'memberwithpermission',
        //   visible: App.main
        // },
        {
          title: 'Zbrojownia',
          icon: 'storage',
          link: 'http://' + App.prod + 'armory',
          visible: App.main
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
          visible: App.main
        },
        {
          title: 'Ustawienia',
          icon: 'settings',
          link: 'http://' + App.prod + 'settings',
          visible: App.main
        },
        {
          title: 'Pliki',
          icon: 'download',
          link: 'http://' + App.prod + 'files',
          visible: App.main
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
    reset () {
      window.localStorage.setItem('arbiter', '000')
      this.arbiter = '000'
    },
    setDrawer (condition) {
      const b = String(condition)
      window.localStorage.setItem('drawer', b)
      this.leftDrawerOpen = JSON.parse(window.localStorage.getItem('drawer'))
    },
    getHighStarts () {
      if (this.starts.length < 1) {
        fetch('http://' + this.local + '/statistics/highStarts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(response => {
            this.starts = response
          })
      }
    },
    getTop10Competitors () {
      if (this.competitors.length < 1) {
        fetch('http://' + this.local + '/statistics/highStartsCompetitors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(response => {
            this.competitors = response
          })
      }
    },
    getTop10MembersWithTheMostMembershipContributions () {
      if (this.contributors.length < 1) {
        fetch('http://' + this.local + '/statistics/highContributions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(response => {
            this.contributors = response
          })
      }
    },
    getTop10CompetitionPoints () {
      if (this.competitionPoints.length < 1) {
        fetch('http://' + this.local + '/statistics/highCompetitionPoints', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(response => {
            this.competitionPoints = response
          })
      }
    },
    changeColor () {
      if (this.backgroundDark) {
        window.localStorage.setItem('BackgroundDark', 'true')
        colors.setBrand('dark-separator', '$grey-6')
        colors.setBrand('secondary', '#374550')
        colors.setBrand('primary', '#871421')
        colors.setBrand('dark', '#1D1D1D')
        colors.setBrand('positive', '#FFFFFF')
        colors.setBrand('accent', '#A0A0A0')
      } else {
        window.localStorage.setItem('BackgroundDark', 'false')
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
