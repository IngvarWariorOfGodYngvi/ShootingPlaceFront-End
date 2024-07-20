<template>
  <q-layout class="bg-none" view="lHh Lpr lFf" :class="[funRotate?'fun2':'', this.funRotateCLicks > 8 ? 'fun': '']" >
    <q-header elevated>
      <q-page-sticky v-if="mobile" position="top-right" :offset="[5, -50]" style="z-index: 100">
        <q-icon class="fun" name="wifi" :color="networkStatusvar!=null?networkStatusvar?'green':'red':''"/>
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
                  <div :class="`text-center text-h5 text-bold ${networkStatusvar!=null && networkStatusvar?'':'bg-warning'}`">{{siteNameChange()}} {{ networkStatusvar!=null && networkStatusvar?'':'&nbsp; Brak Połączenia Z Bazą' }}</div>
         <div class="col row reverse">
          <div class="row">
        <q-avatar text-color="white" size="3.5em" color="secondary" rounded
          style="border: solid 1px white; border-radius: 50%" class="lighterbtn rotating"
          icon="settings" @click="openSettings=!openSettings" >
          <q-tooltip class="bg-primary" content-class="bg-primary text-h6 text-center">Ustawienia</q-tooltip>
          <q-popup-edit v-model="openSettings" :offset="[0,0]" content-class="bg-primary text-white" :cover="false" :content-style="mobile?'':'width:20vw'">
            <Experimental></Experimental>
          </q-popup-edit>
        </q-avatar>
      </div>
        <div v-if="main" class="row reverse">
          <q-icon class="fun" name="wifi" :color="networkStatusvar?'green':'red'" @click="funRotateCLicksIncrease()"></q-icon>
          <div v-if="shootingPlace === 'prod'">
          <q-tooltip content-class="bg-primary text-h6">Kalendarz</q-tooltip>
            <q-btn-dropdown class="fit" icon="calendar_month" rounded color="secondary" style="border: 1px solid white">
              <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FWarsaw&src=MTA0MjM0ZTI5MTEyZThiYTk0MzBmZWZmNDk5MjRhNmU0YzI4NzJlMzA3ODdhMzhjZjdmZmE2ZTE2MGEyNmNkNkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OTcwNXUwMTRuZXNicW05NGdiMWdkc3JvOGdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23F09300&color=%234285F4" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="no"></iframe></q-btn-dropdown>
          </div>
          <div>
            <q-tooltip content-class="bg-primary text-h6">Lista pobytu na strzelnicy</q-tooltip>
            <q-btn-dropdown class="fit" content-class="bg-primary text-white q-pa-xs" icon="groups" rounded color="secondary" style="border: 1px solid white" @click="getRecordsFromBook (today, today)">
              <div v-if="evidenceBookList.length>0" style="width:30vw;height:50vh;">
                <div class="row border1">
                  <div class="col">lp Nazwisko i Imię</div>
                  <div class="col">Godzina Wejścia</div>
                </div>
                <div v-for="(item, index) in evidenceBookList" :key="index" class="row border1">
                  <div class="col">{{index+1}} {{ item.nameOnRecord }}</div>
                  <div class="col">{{ item.dateTime.substring(11,19) }}</div>
                </div>
              </div>
              <div v-else class="bg-primary text-white text-h6">Nie ma nic do wyświetlenia</div>
            </q-btn-dropdown>
          </div>
          <div v-if="topTenTabExp">
          <q-avatar text-color="white" color="secondary" size="3.5em" rounded
                    style="border: solid 1px white; border-radius: 50%" class="reverse pulsing"
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
                    style="border: solid 1px white; border-radius: 50%" class="reverse pulsing"
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
                    style="border: solid 1px white; border-radius: 50%" class="reverse pulsing"
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
                    style="border: solid 1px white; border-radius: 50%" class="reverse pulsing"
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
    </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      class="bg-secondary"
      @hide="setDrawer(false)"
    >
      <div class="bg-secondary">
        <q-list>
          <q-item @click="showloading();changeTitle ('STRONA GŁÓWNA')" class="flex flex-center q-pa-md bg-primary text-white" clickable tag="a"
                  target="_self" :href="hrefTarget" width="max">
            <div class="text-h6 text-bold text-center">
              <div>PROGRAM</div>
              <div>STRONA GŁÓWNA</div>
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
          <MembersQuantities v-if="(main || !main) && main != null" class="bg-secondary">
          </MembersQuantities>
          <WeekBirthdayList>
          </WeekBirthdayList>
          <WorkTimeList v-if="!mobile&&main" style="margin: auto;height:auto">
          </WorkTimeList>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style src="../style/style.scss" lang="scss">
</style>

<script>
import { colors } from 'quasar'
import App from 'src/App.vue'
import { reactive } from 'vue'
import { useNetwork } from '@vueuse/core'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
export default {
  name: 'MainLayout',
  visible2: false,
  components: {
    EssentialLink: lazyLoadComponent({
      componentFactory: () => import('components/leftDrawer/EssentialLink.vue'),
      loading: SkeletonBox
    }),
    MembersQuantities: lazyLoadComponent({
      componentFactory: () => import('components/leftDrawer/MembersQuantities.vue'),
      loading: SkeletonBox
    }),
    WeekBirthdayList: lazyLoadComponent({
      componentFactory: () => import('components/leftDrawer/WeekBirthdayList.vue'),
      loading: SkeletonBox
    }),
    WorkTimeList: lazyLoadComponent({
      componentFactory: () => import('components/leftDrawer/WorkTimeList.vue'),
      loading: SkeletonBox
    }),
    Experimental: lazyLoadComponent({
      componentFactory: () => import('components/settings/Experimental.vue'),
      loading: SkeletonBox
    })
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
    this.createTodayDate()
  },
  data () {
    return {
      title: '',
      openSettings: false,
      siteName: 'Strona Główna',
      zero: 1,
      arbiter: window.localStorage.getItem('arbiter'),
      mobile: App.mobile,
      main: App.main,
      backgroundDark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      leftDrawerOpen: JSON.parse(window.localStorage.getItem('drawer')),
      topTenTabExp: JSON.parse(window.localStorage.getItem('TopTenTab')),
      icon: 'menu',
      distance: 1200000,
      number: null,
      barcode: null,
      color: 'primary',
      tournamentCheck: false,
      funRotateCLicks: 0,
      funRotate: false,
      evidenceBookList: [],
      today: new Date(),
      starts: [],
      competitors: [],
      contributors: [],
      competitionPoints: [],
      quantities: [],
      hrefTarget: App.prod,
      local: App.host,
      shootingPlace: App.shootingPlace,
      essentialLinks: [
        {
          title: 'Rejestr Pobytu na Strzelnicy',
          icon: 'person',
          link: App.prod + 'evidenceBook',
          visible: true
        },
        {
          title: 'Lista Klubowiczów',
          icon: 'person',
          link: App.prod + 'member',
          visible: (App.main || !App.main) && App.main != null
        },
        {
          title: 'Licencje',
          icon: 'person',
          link: App.prod + 'license',
          visible: App.main
        },
        {
          title: 'Dodaj Nowego Klubowicza',
          icon: 'person_add',
          link: App.prod + 'member/adding',
          visible: App.main
        },
        {
          title: 'Lista Amunicyjna',
          icon: 'list_alt',
          link: App.prod + 'ammolist',
          visible: (App.main || !App.main) && App.main != null
        },
        {
          title: 'Zawody',
          icon: 'book',
          link: App.prod + 'competition',
          visible: App.main
        },
        // {
        //   title: 'Lista Osób z Uprawnieniami',
        //   icon: 'book',
        //   link: App.prod + 'memberwithpermission',
        //   visible: App.main
        // },
        {
          title: 'Zbrojownia',
          icon: 'storage',
          link: App.prod + 'armory',
          visible: (App.main || !App.main) && App.main != null
        },
        {
          title: 'Statystyki',
          icon: 'bar_chart',
          link: App.prod + 'statistics',
          visible: App.main
        },
        {
          title: 'Pozostałe Funkcje',
          icon: 'menu',
          link: App.prod + 'otherFunctions',
          visible: App.main
        },
        // {
        //   title: 'Ustawienia',
        //   icon: 'settings',
        //   link: App.prod + 'settings',
        //   visible: true
        // },
        {
          title: 'Pliki',
          icon: 'download',
          link: App.prod + 'files',
          visible: App.main
        },
        {
          title: 'Panel Sędziego',
          icon: 'done',
          link: App.prod + 'juryPanel',
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
    getRecordsFromBook (firstDate, secondDate) {
      fetch(`${this.local}/evidence/?firstDate=${firstDate}&secondDate=${secondDate}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.evidenceBookList = response
        })
    },
    createTodayDate () {
      const date = new Date()
      let month = 0
      let day = 0
      if ((date.getMonth() + 1) < 10) {
        month = '0' + (date.getMonth() + 1)
      } else {
        month = (date.getMonth() + 1)
      }
      if (date.getDate() < 10) {
        day = '0' + (date.getDate())
      } else {
        day = (date.getDate())
      }
      this.today = date.getFullYear() + '-' + month + '-' + day
    },
    getEnv () {
      import('src/App.vue').then(App => {
        const local = App.default.host
        fetch(`${local}/conf/env`, {
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
      this.networkStatusFunction()
      setInterval(() => {
        this.networkStatusFunction()
      }, 100000)
    },
    networkStatusFunction () {
      fetch(`${this.local}/conf/ping`, {
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
    },
    siteNameChange () {
      return window.localStorage.getItem('SiteName')
    },
    changeTitle (title) {
      document.title = 'Strzelnica - ' + title
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
        fetch(`${this.local}/statistics/highStarts`, {
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
        fetch(`${this.local}/statistics/highStartsCompetitors`, {
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
        fetch(`${this.local}/statistics/highContributions`, {
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
        fetch(`${this.local}/statistics/highCompetitionPoints`, {
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
