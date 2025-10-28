<template>
  <q-layout class="bg-dark" view="lHh LpR fFf"
    :class="[funRotate ? 'fun2' : '', this.funRotateCLicks > 3 ? 'fun' : '']">
    <SendEmail/>
    <q-header elevated>
      <q-page-sticky v-if="mobile" position="top-right" :offset="[5, -50]" style="z-index: 100">
        <q-icon class="fun" name="wifi" :color="networkStatusvar != null ? networkStatusvar ? 'green' : 'red' : ''" />
      </q-page-sticky>
      <q-toolbar class="full-width row">
        <q-btn flat dense class="q-pa-none text-h6 brand" :icon="icon" aria-label="Menu" :label="title"
          @click="setDrawer(!leftDrawerOpen)" @mousemove="leftDrawerOpen ? icon = 'arrow_left' : icon = 'arrow_right'"
          @mouseleave="icon = 'menu'" />
        <q-toggle v-model="backgroundDark" :val="true" :value="true" color="dark" keep-color
          :class="changesInfo[1] === false ? ' pulse' : ''" :icon="backgroundDark ? 'dark_mode' : 'light_mode'"
          @input="changeColor(); changesInfo[1] === false ? check(1) : ''"><q-tooltip
            content-class="bg-secondary text-body2">{{ backgroundDark ? 'Wyłącz' : 'Włącz' }} ciemny
            motyw</q-tooltip></q-toggle>
        <div style="border-radius: 2em; padding: 0 1em"
          :class="`text-center text-h5 text-bold ${networkStatusvar != null && networkStatusvar ? '' : 'bg-warning'}`">
          {{ siteNameChange() }} {{ networkStatusvar != null && networkStatusvar ? '' : '&nbsp; Brak Połączenia Z Bazą'
          }}</div>
        <div class="col row reverse">
          <div class="row" :class="changesInfo[0] === false ? ' pulse' : ''"
            @click="changesInfo[0] === false ? check(0) : ''">
              <q-tooltip class="bg-primary" content-class="bg-primary text-h6 text-center">Ustawienia</q-tooltip>
            <q-btn-dropdown dropdown-icon="settings" no-icon-animation content-class="bg-primary q-pa-xs" :content-style="mobile ? '' : 'width:20vw'" class="rotating" style="border: solid 1px white;width: 3.5em; height: 3.5em;border-radius: 50%;" rounded fab-mini color="secondary">
              <template v-slot:icon>
                <q-icon name="settings"></q-icon>
              </template>
              <Experimental v-if="main || main === false"/>
                <UpdateProgram v-if="main" class="q-pa-xs text-center"/>
                <OnOfMain class="q-pa-xs text-center"/>
                <SignInByPin v-if="mobile"/>
            </q-btn-dropdown>
            <!-- <q-avatar text-color="white" size="3.5em" color="secondary" rounded
              style="border: solid 1px white; border-radius: 50%" class="lighterbtn rotating bg-secondary" icon="settings"
              @click="openSettings = !openSettings">
              <q-tooltip class="bg-primary" content-class="bg-primary text-h6 text-center">Ustawienia</q-tooltip>
              <q-popup-edit v-model="openSettings" :offset="[0, 0]" content-class="bg-primary text-white col" :cover="false"
                :content-style="mobile ? '' : 'width:20vw'">
                <Experimental v-if="main || main === false"/>
                <UpdateProgram v-if="main" class="q-pa-xs text-center"/>
                <OnOfMain class="q-pa-xs text-center"/>
                <SignInByPin v-if="mobile"/>
              </q-popup-edit>
            </q-avatar> -->
          </div>
          <div v-if="main" class="row reverse">
            <q-icon class="fun" :class="networkStatusvar ? 'fun' : 'fun pulsing1'" name="wifi"
              :color="networkStatusvar ? 'green' : 'red'" @click="funRotateCLicksIncrease()"><q-tooltip
                content-class="text-white bg-primary">Kliknij mnie {{ 4 - funRotateCLicks }} razy</q-tooltip></q-icon>
            <div v-if="shootingPlace === 'prod'">
              <q-tooltip content-class="bg-primary text-h6">Kalendarz</q-tooltip>
              <q-btn-dropdown class="fit" icon="calendar_month" rounded color="secondary"
                style="border: 1px solid white">
                <iframe
                  src="https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FWarsaw&src=MTA0MjM0ZTI5MTEyZThiYTk0MzBmZWZmNDk5MjRhNmU0YzI4NzJlMzA3ODdhMzhjZjdmZmE2ZTE2MGEyNmNkNkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OTcwNXUwMTRuZXNicW05NGdiMWdkc3JvOGdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23F09300&color=%234285F4"
                  style="border:solid 1px #777" width="800" height="600" frameborder="0"
                  scrolling="no"></iframe></q-btn-dropdown>
            </div>
            <div>
              <q-tooltip content-class="bg-primary text-h6">Lista pobytu na strzelnicy</q-tooltip>
              <q-btn-dropdown class="fit" content-class="bg-primary text-white q-pa-xs" icon="groups" rounded
                color="secondary" style="border: 1px solid white" @click="getRecordsFromBook(today, today)">
                <div v-if="evidenceBookList.length > 0" style="width:30vw;height:50vh;">
                  <div class="row border1">
                    <div class="col">lp Nazwisko i Imię</div>
                    <div class="col">Godzina Wejścia</div>
                  </div>
                  <div v-for="(item, index) in evidenceBookList" :key="index" class="row border1">
                    <div class="col">{{ index + 1 }} {{ item.nameOnRecord }}</div>
                    <div class="col">{{ item.dateTime.substring(11, 19) }}</div>
                  </div>
                </div>
                <div v-else class="bg-primary text-white text-h6">Nie ma nic do wyświetlenia</div>
              </q-btn-dropdown>
            </div>
            <div v-if="topTenTabExp">
              <Top10CompetitionPoints></Top10CompetitionPoints>
              <Top10Competitors></Top10Competitors>
              <Top10Contributions></Top10Contributions>
              <Top10Competition></Top10Competition>
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-secondary" class="bg-secondary"
      @hide="setDrawer(false)">
      <q-item @click="showloading(); changeTitle('Strona Główna')" style="height: 20vh;"
        class="bg-primary text-white q-pa-none q-ma-none" clickable tag="a" target="_self" :href="hrefTarget"
        width="max">
          <q-img draggable="false" class="fit" alt="logo" :src="changeLong(shootingPlace)" loading="lazy" style="background-color: #4E607F;"/>
      </q-item>
      <div @click="showloading()">
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" :title="link.title"
          :visible="link.visible" />
      </div>
      <MembersQuantities v-if="main != null && main && MembersCounter" class="bg-secondary">
      </MembersQuantities>
      <WeekBirthdayList v-if="MembersBirthday" class="bg-secondary">
      </WeekBirthdayList>
      <WorkTimeList v-if="!mobile && main" style="margin: auto; height: auto" class="bg-secondary">
      </WorkTimeList>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style src="../style/style.scss" lang="scss"></style>
<script>
import App from 'src/App.vue'
import { reactive } from 'vue'
import { useNetwork } from '@vueuse/core'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
import { checking } from 'src/scripts/ChangesInfo.js'
import { changeColor } from 'src/scripts/ChangeColor'
import { changeImageLong } from 'src/scripts/ChangeImages'

export default {
  name: 'MainLayout',
  visible2: false,
  components: {
    Top10CompetitionPoints: lazyLoadComponent({
      componentFactory: () => import('components/header/Top10CompetitionPoints.vue'),
      loading: SkeletonBox
    }),
    Top10Contributions: lazyLoadComponent({
      componentFactory: () => import('components/header/Top10Contributions.vue'),
      loading: SkeletonBox
    }),
    Top10Competitors: lazyLoadComponent({
      componentFactory: () => import('components/header/Top10Competitors.vue'),
      loading: SkeletonBox
    }),
    Top10Competition: lazyLoadComponent({
      componentFactory: () => import('src/components/header/Top10Competitions.vue'),
      loading: SkeletonBox
    }),
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
    UpdateProgram: lazyLoadComponent({
      componentFactory: () => import('components/settings/UpdateProgram.vue'),
      loading: SkeletonBox
    }),
    SignInByPin: lazyLoadComponent({
      componentFactory: () => import('components/settings/SignInByPin.vue'),
      loading: SkeletonBox
    }),
    OnOfMain: lazyLoadComponent({
      componentFactory: () => import('components/settings/OnOfMain.vue'),
      loading: SkeletonBox
    }),
    SendEmail: lazyLoadComponent({
      componentFactory: () => import('src/utils/SendEmail.vue'),
      loading: SkeletonBox
    }),
    Experimental: lazyLoadComponent({
      componentFactory: () => import('components/settings/Experimental.vue'),
      loading: SkeletonBox
    })
  },
  beforeMount () {
    this.getFs()
    this.changeColor()
  },
  created () {
    if (window.sessionStorage.getItem('SiteName') == null) {
      window.sessionStorage.setItem('SiteName', 'Strona Główna')
    }
    if (window.localStorage.getItem('main') == null) {
      window.localStorage.setItem('main', false)
    }
    this.networkStatus()
    this.stata()
    this.createTodayDate()
  },
  data () {
    return {
      title: '',
      openSettings: false,
      siteName: App.siteName,
      zero: 1,
      arbiter: window.localStorage.getItem('arbiter'),
      mobile: App.mobile,
      main: App.main,
      backgroundDark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      leftDrawerOpen: JSON.parse(window.localStorage.getItem('drawer')),
      topTenTabExp: JSON.parse(window.localStorage.getItem('TopTenTab')),
      changesInfo: JSON.parse(window.localStorage.getItem('ChangesInfo')),
      MembersCounter: JSON.parse(window.localStorage.getItem('MembersCounter')),
      MembersBirthday: JSON.parse(window.localStorage.getItem('MembersBirthday')),
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
          title: 'Licencje Zawodnicze',
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
          visible: true
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
    changeLong (shootingPlace) {
      return changeImageLong(shootingPlace)
    },
    getFs () {
      fetch(`${this.local}/conf/fs`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          if (response === true) {
            this.essentialLinks = [{
              title: 'Pierwszy Start',
              icon: 'arrow_forward',
              link: App.prod + 'firstStart',
              visible: App.main
            }]
          }
        })
    },
    check (number) {
      checking(number)
      this.changesInfo = JSON.parse(window.localStorage.getItem('ChangesInfo'))
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
              console.log(response)
              this.shootingPlace = response[0]
              window.localStorage.setItem('shootingPlace', response[0])
              this.changeColor()
            })
          }
        }).catch(() => {
          this.shootingPlace = 'test'
          window.localStorage.setItem('shootingPlace', 'test')
          this.changeColor()
        })
      })
    },
    stata () {
      const network = reactive(useNetwork())
      return network.type
    },
    funRotateCLicksIncrease () {
      this.funRotateCLicks++
      if (this.funRotateCLicks % 4 === 0) {
        this.funRotate = !this.funRotate
      }
    },
    networkStatus () {
      this.networkStatusFunction()
      setInterval(() => {
        this.networkStatusFunction()
      }, 30000)
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
            response => {
              if (window.sessionStorage.getItem('buildDateTime') == null) {
                window.sessionStorage.setItem('buildDateTime', response)
              } else {
                if (window.sessionStorage.getItem('buildDateTime') !== response) {
                  window.sessionStorage.setItem('buildDateTime', response)
                  this.changeColor()
                  window.location.reload()
                }
              }
              if (window.localStorage.getItem('usrPerm') != null) {
                if (JSON.parse(window.localStorage.getItem('usrPermTime')) < new Date().getTime()) {
                  window.localStorage.removeItem('usrPerm')
                  window.localStorage.removeItem('usrPermTime')
                }
              }
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
      return window.sessionStorage.getItem('SiteName')
    },
    changeTitle (title) {
      document.title = 'Strzelnica - ' + title
      window.sessionStorage.setItem('SiteName', title)
    },
    reset () {
      window.localStorage.setItem('arbiter', '000')
      this.arbiter = '000'
    },
    setDrawer (condition) {
      window.localStorage.setItem('drawer', String(condition))
      this.leftDrawerOpen = JSON.parse(window.localStorage.getItem('drawer'))
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
      changeColor(this.backgroundDark, this.shootingPlace)
    }
  }
}

</script>
