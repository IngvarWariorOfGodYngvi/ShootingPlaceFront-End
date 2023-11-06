<template>
  <q-layout view="lHh Lpr lFf" :class="[funRotate?'fun2':'', this.funRotateCLicks > 8 ? 'fun': '']" >
    <q-header elevated>
      <q-page-sticky v-if="mobile" position="top-right" :offset="[5, -50]" style="z-index: 100">
           <q-icon class="fun" name="wifi" :color="networkStatusvar?'green':'red'"></q-icon>
           </q-page-sticky>
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
                  @input="changeColor()" class="fun"><q-tooltip content-class="bg-secondary text-body2">{{backgroundDark?'Wyłącz': 'Włącz' }} ciemny motyw</q-tooltip></q-toggle>
                  <div class="text-center text-h5 text-bold">{{siteNameChange()}}</div>
         <div v-if="main" class="row reverse col">
          <q-icon class="fun" name="wifi" :color="networkStatusvar?'green':'red'" @click="funRotateCLicksIncrease()"></q-icon>
          <q-btn-dropdown v-if="shootingPlace === 'prod'" icon="calendar_month" rounded color="secondary" style="border: 1px solid white">
            <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Europe%2FWarsaw&src=MTA0MjM0ZTI5MTEyZThiYTk0MzBmZWZmNDk5MjRhNmU0YzI4NzJlMzA3ODdhMzhjZjdmZmE2ZTE2MGEyNmNkNkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OTcwNXUwMTRuZXNicW05NGdiMWdkc3JvOGdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23F09300&color=%234285F4" style="width:40vw;height:50vh;" class="bg-secondary text-positive" frameborder="2" scrolling="no"/>
          </q-btn-dropdown>
          <div v-if="topTenTabExp">
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
          <q-item @click="showloading();changeTitle ('STRONA GŁÓWNA')" class="flex flex-center q-pa-md bg-primary text-white xyz1" clickable tag="a"
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
        <members-quantities v-if="(main || !main) && main != null" class="bg-secondary">
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
import { reactive } from 'vue'
import { useNetwork } from '@vueuse/core'
// import { VueIdentifyNetwork } from 'vue-identify-network'
export default {
  name: 'MainLayout',
  visible2: false,
  components: {
    EssentialLink,
    membersQuantities,
    WorkTimeList
  },
  beforeMount () {
    this.getEnv()
  },
  created () {
    if (window.localStorage.getItem('BackgroundDark') == null) {
      window.localStorage.setItem('BackgroundDark', 'false')
    } else {
      this.changeColor()
    }
    if (window.localStorage.getItem('SiteName') == null) {
      window.localStorage.setItem('SiteName', 'Strona Główna')
    }
    this.networkStatus()
    this.stata()
  },
  data () {
    return {
      title: '',
      siteName: 'Strona Główna',
      zero: 1,
      arbiter: window.localStorage.getItem('arbiter'),
      mobile: !isWindows,
      main: App.main,
      backgroundDark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      topTenTabExp: JSON.parse(window.localStorage.getItem('TopTenTab')),
      icon: 'menu',
      leftDrawerOpen: JSON.parse(window.localStorage.getItem('drawer')),
      distance: 1200000,
      number: null,
      barcode: null,
      color: 'primary',
      tournamentCheck: false,
      funRotateCLicks: 0,
      funRotate: false,
      starts: [],
      competitors: [],
      contributors: [],
      competitionPoints: [],
      quantities: [],
      hrefTarget: 'http://' + App.prod,
      local: App.host,
      shootingPlace: App.shootingPlace,
      essentialLinks: [
        {
          title: 'Rejestr Pobytu na Strzelnicy',
          icon: 'person',
          link: 'http://' + App.prod + 'evidenceBook',
          visible: true
        },
        {
          title: 'Lista Klubowiczów',
          icon: 'person',
          link: 'http://' + App.prod + 'member',
          visible: (App.main || !App.main) && App.main != null
        },
        {
          title: 'Licencje',
          icon: 'person',
          link: 'http://' + App.prod + 'license',
          visible: App.main
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
          visible: (App.main || !App.main) && App.main != null
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
          visible: (App.main || !App.main) && App.main != null
        },
        {
          title: 'Statystyki',
          icon: 'bar_chart',
          link: 'http://' + App.prod + 'statistics',
          visible: App.main
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
          visible: true
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
          visible: (App.main || !App.main) && App.main != null
        }
      ],
      networkStatusvar: null,
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
    getEnv () {
      import('src/App.vue').then(App => {
        fetch(`http://${App.default.host}/conf/env`, {
          method: 'GET'
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              window.localStorage.setItem('shootingPlace', response)
            })
          }
        })
      })
    },
    stata () {
      const network = reactive(useNetwork())

      return network.type
    },
    funRotateCLicksIncrease () {
      this.funRotateCLicks++
      console.log(this.funRotateCLicks)
      if (this.funRotateCLicks % 4 === 0) {
        this.funRotate = !this.funRotate
      }
    },
    networkStatus () {
      setInterval(() => {
        fetch(`http://${this.local}/conf/ping`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.status === 200) {
            response.text().then(
              () => {
                this.networkStatusvar = true
              })
          } else {
            this.networkStatusvar = false
          }
        }).catch(() => {
          this.networkStatusvar = false
        })
      }, 100000)
    },
    siteNameChange () {
      return window.localStorage.getItem('SiteName')
    },
    changeTitle (title) {
      window.localStorage.setItem('SiteName', title)
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
        fetch(`http://${this.local}/statistics/highStarts`, {
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
        fetch(`http://${this.local}/statistics/highStartsCompetitors`, {
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
        fetch(`http://${this.local}/statistics/highContributions`, {
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
        fetch(`http://${this.local}/statistics/highCompetitionPoints`, {
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
        this.shootingPlace === 'prod' ? colors.setBrand('primary', '#871421') : this.shootingPlace === 'rcs' ? colors.setBrand('primary', '#008000') : colors.setBrand('primary', '#008000')// Dziesiątka
        this.shootingPlace === 'prod' ? colors.setBrand('secondary', '#374550') : this.shootingPlace === 'rcs' ? colors.setBrand('secondary', '#A00000') : colors.setBrand('secondary', '#A00000')// Dziesiątka
        // colors.setBrand('primary', '#871421') // DZIESIĄTKA
        // colors.setBrand('primary', '#008000') // Panaszew
        // colors.setBrand('secondary', '#374550') // Dziesiątka
        // colors.setBrand('secondary', '#A00000') // Panaszew
        colors.setBrand('dark', '#1D1D1D')
        colors.setBrand('positive', '#FFFFFF')
        colors.setBrand('accent', '#A0A0A0')
      } else {
        window.localStorage.setItem('BackgroundDark', 'false')
        colors.setBrand('dark-separator', '$grey-2')
        this.shootingPlace === 'prod' ? colors.setBrand('primary', '#871421') : this.shootingPlace === 'rcs' ? colors.setBrand('primary', '#008000') : colors.setBrand('primary', '#008000')// Dziesiątka
        this.shootingPlace === 'prod' ? colors.setBrand('secondary', '#374550') : this.shootingPlace === 'rcs' ? colors.setBrand('secondary', '#A00000') : colors.setBrand('secondary', '#A00000')// Dziesiątka
        // colors.setBrand('primary', '#871421') // DZIESIĄTKA
        // colors.setBrand('primary', '#008000') // Panaszew
        // colors.setBrand('secondary', '#374550') // Dziesiątka
        // colors.setBrand('secondary', '#A00000') // Panaszew
        colors.setBrand('dark', '#FFFFFF')
        colors.setBrand('positive', '#000000')
        colors.setBrand('accent', '#f3f3f3')
      }
    }
  }
}

</script>
