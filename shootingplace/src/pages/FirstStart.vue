<template>
  <q-page class="bg-dark text-positive">
    <q-stepper header-nav v-model="step" ref="stepper" active-color="secondary" class="bg-dark" animated>
      <q-step :name="1" title="Tworzenie Klubu Macierzystego " caption="Wymagane" icon="settings" :done="step > 1"
        :disable="isMotherClubExistVar == true">
        <div v-if="main" class="q-pa-md text-bold text-center text-h6 text-positive bg-dark">WYBIERZ SWÓJ KLUB Z LISTY
          PZSS
        </div>
        <div class="row">
          <q-input debounce="500" v-model="searchName" class="col"
            @keypress.enter="searchCity = ''; getSearchName(searchName)"
            @input="searchCity = ''; getSearchName(searchName)" label="wyszukaj po nazwie" color="white"
            bg-color="secondary" input-class="text-white" label-color="white" dense rounded standout="">
            <template v-slot:append>
              <q-icon v-if="searchName != ''" name="close" @click="searchName = ''; getSearchName(searchName)"
                class="cursor-pointer text-white" />
              <q-icon name="search" class="text-white" @click="searchCity = ''; getSearchName(searchName)" />
            </template>
          </q-input>
          <q-input debounce="500" v-model="searchCity" class="col"
            @keypress.enter="searchName = ''; getSearcCity(searchCity)"
            @input="searchName = ''; getSearcCity(searchCity)" label="wyszukaj po mieście" color="white"
            bg-color="secondary" input-class="text-white" label-color="white" dense rounded standout="">
            <template v-slot:append>
              <q-icon v-if="searchCity != ''" name="close" @click="searchCity = ''; getSearcCity(searchCity)"
                class="cursor-pointer text-white" />
              <q-icon name="search" class="text-white" @click="searchName = ''; getSearcCity(searchCity)" />
            </template>
          </q-input>
        </div>
        <div class="row col">
          <div class="q-pr-md">lp</div>
          <div class="col" @click="sortF('name')"><q-icon size="2em"
              :name="sortShortName ? 'arrow_drop_up' : 'arrow_drop_down'" />Nazwa</div>
          <!-- <div class="col-2">Strona</div> -->
          <div class="col-3">Telefon</div>
          <div class="col-2">e-mail</div>
          <div class="col-2" @click="sortF('WZSS')"><q-icon size="2em"
              :name="sortWZSS ? 'arrow_drop_up' : 'arrow_drop_down'" />WZSS</div>
        </div>
        <q-scroll-area class="full-width q-pa-none" style="height: 70vh;">
          <div v-for="(club, index) in clubs" :key="index" class="hover1 col" style="cursor: pointer;"
            @dblclick="clubInfoModel = club; clubInfo = true">
            <div class="row">
              <div class="self-center q-pr-md">{{ index + 1 }}</div>
              <div class="col caption">
                <div class="text-bold">{{ club.ShortName }}</div>
                <div class="text-caption">{{ club.FullName }}</div>
              </div>
              <div class="col-3">{{ club.Phone }}</div>
              <div class="col-2">{{ club.Email }}</div>
              <div class="col-2 text-center">{{ club.WZSS }}</div>
              <q-btn dense style="width:5%;" @click="clubID = club.id; createMotherClub(club)" color="primary"
                icon="download">
                <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Importuj do
                  bazy
                  {{ club.name }}
                </q-tooltip>
              </q-btn>
            </div>
            <hr>
          </div>
        </q-scroll-area>
      </q-step>
      <q-step :name="2" title="Tworzenie Super Użytkownika" caption="Wymagane" icon="settings" :done="step > 2">
        <SuperUser v-if="main" v-on:createSuperUser="step = 3"></SuperUser>
      </q-step>
      <q-step :name="3" title="Tworzenie Użytkowników" caption="Wymagane" icon="settings" :done="step > 3">
        <Users v-if="main"></Users>
      </q-step>
    </q-stepper>
    <q-dialog v-model="clubInfo">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-bold">Informacje dodatkowe o klubie {{ clubInfoModel.ShortName }}</div>
          <div>Pełna nazwa : {{ clubInfoModel.FullName }}</div>
          <div>Numer Licencji Klubowej : {{ clubInfoModel.LicenceNo }}</div>
          <div>Strona www : {{ clubInfoModel.www }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import Clubs from 'src/utils/PZSSClubsJS.json'
export default {
  data () {
    return {
      updateDate: Clubs.updateDate,
      clubs: Clubs.data,
      tempClubs: [],
      step: 1,
      clubInfoModel: [],
      clubInfo: false,
      isMotherClubExistVar: null,
      city: null,
      clubName: null,
      clubFullName: null,
      clubLicenseNumber: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubAddress: null,
      clubURL: null,
      searchName: '',
      searchCity: '',
      sortShortName: false,
      sortWZSS: false,
      failure: false,
      success: false,
      message: null,
      shootingPlace: App.shootingPlace,
      allMember: true,
      main: App.main,
      local: App.host
    }
  },
  created () {
    this.isMotherClubExist()
    this.getAllPZSSClubs()
  },
  components: {
    SuperUser: lazyLoadComponent({
      componentFactory: () => import('components/settings/SuperUser.vue'),
      loading: SkeletonBox
    }),
    Users: lazyLoadComponent({
      componentFactory: () => import('components/settings/Users.vue'),
      loading: SkeletonBox
    })
  },
  methods: {
    createMotherClub (club) {
      const data = {
        shortName: club.ShortName,
        fullName: club.FullName,
        licenseNumber: club.LicenceNo,
        phoneNumber: club.Phone,
        email: club.Email,
        wzss: club.WZSS,
        city: club.City,
        houseNumber: club.AouseNumber,
        appartmentNumber: club.AouseNumberppartmentNumber,
        vovoidership: club.VovoidershipName,
        url: club.www
      }
      fetch(`${this.local}/settings/createMotherClub`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.autoClose()
              this.step++
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    getAllPZSSClubs () {
      this.clubs = Clubs.data
      this.tempClubs = Clubs.data
      this.clubs.sort((a, b) => a.ShortName.localeCompare(b.secondName))
    },
    isMotherClubExist () {
      fetch(`${this.local}/club/isMotherClubExist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.text())
        .then(response => {
          this.isMotherClubExistVar = response
          response === 'false' ? this.step = 1 : this.step = 2
        })
    },
    sortF (type) {
      if (type === 'name') {
        if (!this.sortShortName) {
          this.clubs.sort((a, b) => b.ShortName.localeCompare(a.secondName))
          this.sortShortName = !this.sortShortName
        } else {
          this.clubs.sort((a, b) => a.ShortName.localeCompare(b.secondName))
          this.sortShortName = !this.sortShortName
        }
      }
      if (type === 'WZSS') {
        if (!this.sortWZSS) {
          this.clubs.sort((a, b) => b.WZSS.localeCompare(a.WZSS))
          this.sortWZSS = !this.sortWZSS
        } else {
          this.clubs.sort((a, b) => a.WZSS.localeCompare(b.WZSS))
          this.sortWZSS = !this.sortWZSS
        }
      }
    },
    getSearchName (val) {
      this.clubs = this.tempClubs
      if (val === '') {
        this.clubs = this.tempClubs
      } else {
        const needle = val.toLowerCase()
        this.clubs = this.clubs.filter(v => v.FullName.toLowerCase().indexOf(needle) > -1)
      }
    },
    getSearcCity (val) {
      this.clubs = this.tempClubs
      if (val === '') {
        this.clubs = this.tempClubs
      } else {
        const needle = val.toLowerCase()
        this.clubs = this.clubs.filter(v => v.City.toLowerCase().indexOf(needle) > -1)
      }
    },
    autoClose () {
      setTimeout(() => {
        this.message = null
        this.failure = false
        this.success = false
        this.code = null
        this.master = false
        this.acceptCodeUser1 = false
        this.accept = false
      }, 1500)
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    }
  },
  name: 'member'
}
</script>
