<template>
  <q-page padding>
    <div>
      <Experimental class="col"></Experimental>
      <SuperUser v-if="main"></SuperUser>
      <Users v-if="main"></Users>
      <div v-if="main" class="q-pa-md text-bold text-center text-h6 text-positive bg-dark">TWORZENIE KLUBU MACIERZYSTEGO</div>
      <q-card v-if="main" class="row bg-dark text-positive">
            <q-card-section class="col-6">
              <q-item>
                <q-input v-model="clubName" dense class="full-width" input-class="text-positive" label-color="positive" filled label="Nazwa"/>
              </q-item>
              <q-item>
                <q-input v-model="clubFullName" dense class="full-width" input-class="text-positive" label-color="positive" filled label="Pełna nazwa do dokumentów"/>
              </q-item>
              <q-item>
                <q-input v-model="clubLicenseNumber" dense class="full-width" input-class="text-positive" label-color="positive" filled
                         label="Numer licencji Klubowej"/>
              </q-item>
              <q-item>
                <q-input v-model="clubPhoneNumber" dense type="tel" class="full-width" input-class="text-positive" label-color="positive" mask="### ### ###" filled
                         label="Telefon"/>
              </q-item>
              <q-item>
                <q-input v-model="clubEmail" dense type="email" class="full-width" input-class="text-positive" label-color="positive" filled label="email"/>
              </q-item>
              <q-item>
                <q-input v-model="clubAddress" dense type="address" class="full-width" input-class="text-positive" label-color="positive" filled label="Adres"/>
              </q-item>
              <q-item>
                <q-input v-model="clubURL" dense type="url" class="full-width" input-class="text-positive" label-color="positive" filled label="Strona internetowa"/>
              </q-item>
              <q-item>
                <q-btn @click="createMotherClub ()" label="Dodaj" color="secondary"/>
              </q-item>
            </q-card-section>
          </q-card>
    </div>
  </q-page>
</template>

<script>

import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
export default {
  components: {
    Users: lazyLoadComponent({
      componentFactory: () => import('components/settings/Users.vue'),
      loading: SkeletonBox
    }),
    SuperUser: lazyLoadComponent({
      componentFactory: () => import('components/settings/SuperUser.vue'),
      loading: SkeletonBox
    }),
    Experimental: lazyLoadComponent({
      componentFactory: () => import('components/settings/Experimental.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      mobile: App.mobile,
      cities: ['Białystok', 'Bydgoszcz', 'Gdańsk', 'Gorzów Wielkopolski', 'Katowice', 'Kielce', 'Kraków', 'Lublin', 'Łódź', 'Olsztyn', 'Opole', 'Poznań', 'Rzeszów', 'Szczecin', 'Warszawa', 'Wrocław', 'BRAK WYNIKÓW'],
      ulAl: ['ul. ', 'al. '],
      ul_al: '',
      policeCity: '',
      policeZipCode: '',
      policeStreet: '',
      policeStreetNumber: '',
      policeAddressError: false,
      acceptCodeUser1: false,
      code: null,
      url: '',
      fileName: '',
      city: null,
      clubMessage: null,
      clubName: null,
      clubFullName: null,
      clubLicenseNumber: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubAddress: null,
      clubURL: null,
      clubs: [],
      local: App.host,
      main: App.main
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
    getAllClubs () {
      fetch(`${this.local}/club/`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubs = response
        })
    },
    createMotherClub () {
      if (this.clubs.length > 0) {
        this.clubMessage = 'Nie można dodać więcej macierzystego Klubu'
      } else {
        const data = {
          name: this.clubName,
          fullName: this.clubFullName,
          licenseNumber: this.clubLicenseNumber,
          phoneNumber: this.clubPhoneNumber,
          email: this.clubEmail,
          address: this.clubAddress,
          url: this.clubURL
        }
        fetch(`${this.local}/settings/createMotherClub`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.status === 200) {
            this.clubMessage = 'Utworzono Klub Macierzysty'
          }
          if (response.status === 400) {
            this.clubMessage = 'Sprawdź poprawność wszystkich danych'
          }
        })
      }
    },
    autoClose () {
      setTimeout(() => {
        this.message = null
        this.success = false
        this.barCode = null
        this.code = null
        this.master = false
        this.acceptCodeUser1 = false
        this.accept = false
      }, 1500)
    },
    inputPoliceAddress (city) {
      if (city === 'Białystok') {
        this.policeCity = 'w Białymstoku'
        this.policeZipCode = '15-369'
        this.policeStreet = 'ul. Bema'
        this.policeStreetNumber = '4'
      }
      if (city === 'Bydgoszcz') {
        this.policeCity = 'w Bydgoszczy'
        this.policeZipCode = '85-090'
        this.policeStreet = 'al. Powstańców Wielkopolskich'
        this.policeStreetNumber = '7'
      }
      if (city === 'Gdańsk') {
        this.policeCity = 'w Gdańsku'
        this.policeZipCode = '80-298'
        this.policeStreet = 'ul. Harfowa'
        this.policeStreetNumber = '60'
      }
      if (city === 'Gorzów Wielkopolski') {
        this.policeCity = 'w Gorzowie Wielkopolskim'
        this.policeZipCode = '66-400'
        this.policeStreet = 'ul. Kwiatowa'
        this.policeStreetNumber = '10'
      }
      if (city === 'Katowice') {
        this.policeCity = 'w Katowicach'
        this.policeZipCode = '40-038'
        this.policeStreet = 'ul. Lompy'
        this.policeStreetNumber = '19'
      }
      if (city === 'Kielce') {
        this.policeCity = 'w Kielcach'
        this.policeZipCode = '25-366'
        this.policeStreet = 'ul. Śniadeckich'
        this.policeStreetNumber = '4'
      }
      if (city === 'Kraków') {
        this.policeCity = 'w Krakowie'
        this.policeZipCode = '31-571'
        this.policeStreet = 'ul. Mogilska'
        this.policeStreetNumber = '109'
      }
      if (city === 'Lublin') {
        this.policeCity = 'w Lublinie'
        this.policeZipCode = '20-213'
        this.policeStreet = 'ul. Gospodarcza'
        this.policeStreetNumber = '1b'
      }
      if (city === 'Łódź') {
        this.policeCity = 'w Łodzi'
        this.policeZipCode = '91-048'
        this.policeStreet = 'Lutomierska'
        this.policeStreetNumber = '108/112'
      }
      if (city === 'Olsztyn') {
        this.policeCity = 'w Olsztynie'
        this.policeZipCode = '10-049'
        this.policeStreet = 'ul. Wincentego Pstrowskiego'
        this.policeStreetNumber = '3'
      }
      if (city === 'Opole') {
        this.policeCity = 'w Opolu'
        this.policeZipCode = '46-020'
        this.policeStreet = 'ul. Powstańców Śląskich'
        this.policeStreetNumber = '20'
      }
      if (city === 'Poznań') {
        this.policeCity = 'w Poznaniu'
        this.policeZipCode = '60-844'
        this.policeStreet = 'ul. Kochanowskiego'
        this.policeStreetNumber = '2a'
      }
      if (city === 'Rzeszów') {
        this.policeCity = 'w Rzeszowie'
        this.policeZipCode = '35-036'
        this.policeStreet = 'ul. Dąbrowskiego'
        this.policeStreetNumber = '30'
      }
      if (city === 'Szczecin') {
        this.policeCity = 'w Szczecinie'
        this.policeZipCode = '71-710'
        this.policeStreet = 'ul. Bardzińska'
        this.policeStreetNumber = '1a'
      }
      if (city === 'Warszawa') {
        this.policeCity = 'w Warszawie'
        this.policeZipCode = '00-150'
        this.policeStreet = 'ul. Nowolipie'
        this.policeStreetNumber = '2'
      }
      if (city === 'Wrocław') {
        this.policeCity = 'we Wrocławiu'
        this.policeZipCode = '50-040'
        this.policeStreet = 'ul. Podwale'
        this.policeStreetNumber = '31/33'
      }
      if (city === 'BRAK WYNIKÓW') {
        this.policeCity = null
        this.policeZipCode = null
        this.policeStreet = null
        this.policeStreetNumber = null
      }
    }
  },
  name: 'settings'
}
</script>
