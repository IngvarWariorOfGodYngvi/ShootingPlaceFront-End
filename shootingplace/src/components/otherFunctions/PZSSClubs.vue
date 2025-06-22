<template>
  <div>
    <div class="bg-dark text-positive">
      <q-card-section>
        <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista klubów PZSS <p
            class="text-caption">(na dzień: {{ updateDate }} )</p>
        </div>
        <div class="row">
          <q-input debounce="500" v-model="searchName" class="col" @keypress.enter="searchCity = ''; getSearchName(searchName)"
            @input="searchCity = ''; getSearchName(searchName)" label="wyszukaj po nazwie" color="white" bg-color="secondary"
            input-class="text-white" label-color="white" dense rounded standout="">
            <template v-slot:append>
              <q-icon v-if="searchName != ''" name="close" @click="searchName = ''; getSearchName(searchName)"
                class="cursor-pointer text-white" />
              <q-icon name="search" class="text-white" @click="searchCity = ''; getSearchName(searchName)" />
            </template>
          </q-input>
          <q-input debounce="500" v-model="searchCity" class="col" @keypress.enter="searchName = ''; getSearcCity(searchCity)"
            @input="searchName = ''; getSearcCity(searchCity)" label="wyszukaj po mieście" color="white" bg-color="secondary"
            input-class="text-white" label-color="white" dense rounded standout="">
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
          <div class="col" @click="sortF('WZSS')"><q-icon size="2em"
              :name="sortWZSS ? 'arrow_drop_up' : 'arrow_drop_down'" />WZSS</div>
        </div>
        <hr>
        <q-scroll-area class="full-width q-pa-none" style="height: 70vh;">
          <div v-for="(club, index) in clubs" :key="index" class="hover1 row text-positive items-center" style="cursor: pointer;"
            @dblclick="clubInfoModel = club; clubInfo = true">
            <div class="self-center q-pr-md">{{ index + 1 }}</div>
            <div class="col caption">
              <div class="text-bold">{{ club.ShortName }}</div>
              <div class="text-caption">{{ club.FullName }}</div>
            </div>
            <div class="col-3">{{ club.Phone }}</div>
            <div class="col">{{ club.WZSS }}</div>
            <q-btn rounded dense style="width:5%;" @click="clubID = club.id; importClub(club)" color="primary" icon="download">
              <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Importuj do bazy
                {{ club.name }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-scroll-area>
      </q-card-section>
    </div>
    <q-dialog v-model="clubInfo">
      <q-card class="bg-dark text-positive" style="min-width: 40vw;">
        <q-card-section>
          <div class="text-h6 text-bold text-center">Informacje dodatkowe o klubie</div>
          <div>Skrócona nazwa : {{ clubInfoModel.ShortName }}</div>
          <div>Pełna nazwa : {{ clubInfoModel.FullName }}</div>
          <div>Numer Licencji Klubowej : {{ clubInfoModel.LicenceNo }}</div>
          <div>email : {{ clubInfoModel.Email }}</div>
          <div>telefon : {{ clubInfoModel.Phone }}</div>
          <div>WZSS : {{ clubInfoModel.WZSS }}</div>
          <div>województwo : {{ clubInfoModel.VovoidershipName }}</div>
          <div>miasto : {{ clubInfoModel.City }}</div>
          <div>ulica : {{ clubInfoModel.Street }} {{ clubInfoModel.HouseNumber }}</div>
          <div>lokal : {{ clubInfoModel.AppartmentNumber }}</div>
        </q-card-section>
        <q-card-actions align="right">
           <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'
import Clubs from 'src/utils/PZSSClubsJS.json'

export default {
  name: 'PZSSClubs',
  data () {
    return {
      updateDate: Clubs.updateDate,
      clubs: Clubs.data,
      tempClubs: [],
      clubInfoModel: [],
      clubID: null,
      clubInfo: false,
      searchName: '',
      searchCity: '',
      sortShortName: false,
      sortWZSS: false,
      success: false,
      failure: false,
      message: null,
      local: App.host
    }
  },
  created () {
    this.getAllPZSSClubs()
  },
  methods: {
    getAllPZSSClubs () {
      this.clubs = Clubs.data
      this.tempClubs = Clubs.data
      this.clubs.sort((a, b) => a.ShortName.localeCompare(b.secondName))
    },
    importClub (club) {
      const data = {
        shortName: club.ShortName,
        fullName: club.FullName,
        licenseNumber: club.LicenceNo,
        appartmentNumber: club.AppartmentNumber,
        houseNumber: club.HouseNumber,
        vovoidership: club.VovoidershipName,
        phoneNumber: club.Phone,
        email: club.Email,
        wzss: club.WZSS,
        city: club.City,
        street: club.Street,
        url: club.www
      }
      fetch(`${this.local}/club/import`, {
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
              this.$emit('importClub')
              this.autoClose()
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
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>

<style scoped></style>
