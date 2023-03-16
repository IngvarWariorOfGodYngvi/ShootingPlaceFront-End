<template>
  <q-page padding class="bg-dark">
    <div>
      <q-item>
        <div class="text-center col full-width no-outline text-h4 text-bold text-positive">USTAWIENIA</div>
      </q-item>
    </div>
    <div>
      <SuperUser></SuperUser>
      <Users></Users>
          <div class="q-pa-md text-bold text-center text-h6 text-positive">TWORZENIE KLUBU MACIERZYSTEGO</div>
          <q-card class="row">
            <q-card-section class="col-6 bg-grey-2">
              <q-item>
                <q-input v-model="clubName" class="full-width" filled label="Nazwa"></q-input>
              </q-item>
              <q-item>
                <q-input v-model="clubFullName" class="full-width" filled label="Pełna nazwa do dokumentów"></q-input>
              </q-item>
              <q-item>
                <q-input v-model="clubLicenseNumber" class="full-width" filled
                         label="Numer licencji Klubowej"></q-input>
              </q-item>
              <q-item>
                <q-input v-model="clubPhoneNumber" type="tel" class="full-width" mask="### ### ###" filled
                         label="Telefon"></q-input>
              </q-item>
              <q-item>
                <q-input v-model="clubEmail" type="email" class="full-width" filled label="email"></q-input>
              </q-item>
              <q-item>
                <q-input v-model="clubAddress" type="address" class="full-width" filled label="Adres"></q-input>
              </q-item>
              <q-item>
                <q-input v-model="clubURL" type="url" class="full-width" filled label="Strona internetowa"></q-input>
              </q-item>
              <q-item>
                <q-btn @click="createMotherClub ()" label="Dodaj" color="secondary"/>
              </q-item>
            </q-card-section>
            <q-card-section class="col-6 bg-dark">
              <q-item id="club" v-if="clubMessage!=null">
                <div class="full-width text-bold text-center text-positive">{{ clubMessage }}</div>
              </q-item>
            </q-card-section>
          </q-card>
          <div class="q-pa-md text-bold text-center text-h6 text-positive">ADRES KWP WPA</div>
          <q-card class="row">
            <q-card-section class="bg-grey-2 col-3">
              <div class="col">
                <q-select v-if="!policeAddressError" class="q-pa-md" filled v-model="city" :options="cities"
                          label="Miasto Wojewódzkie" @input="inputPoliceAddress(city)"/>
                <q-checkbox
                  @input="city = 'BRAK WYNIKÓW';policeCity=null;policeZipCode=null;policeStreet=null;policeStreetNumber=null"
                  class="q-pa-md" v-model="policeAddressError" label="Brak mojego WPA lub błędny adres"></q-checkbox>
              </div>
            </q-card-section>
            <q-card-section v-if="!policeAddressError" class="bg-grey-2 col-9">
              <q-item class="q-pa-md">
                <q-field class="full-width" standout label="Adres WPA" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">Komendant Wojewódzki Policji {{ policeCity }}</div>
                    <div class="self-center full-width no-outline">Wydział Postępowań Administracyjnych</div>
                    <div class="self-center full-width no-outline">{{ policeZipCode }}, {{ ul_al }} {{ policeStreet }}
                      {{ policeStreetNumber }}
                    </div>
                  </template>
                </q-field>
              </q-item>
            </q-card-section>
            <q-card-section v-else class="bg-grey-2 col-9">
              <q-item>
                <q-field class="full-width text-center" standout="bg-accent text-black" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline text-black text-center text-bold text-h6">Wprowadź
                      adres WPA
                    </div>
                  </template>
                </q-field>
              </q-item>
              <q-item>
                <q-field class="full-width" standout label="Nowy Adres WPA" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">Komendant Wojewódzki Policji w {{ policeCity }}</div>
                    <div class="self-center full-width no-outline">Wydział Postępowań Administracyjnych</div>
                    <div class="self-center full-width no-outline">{{ policeZipCode }}, {{ ul_al }} {{ policeStreet }}
                      {{ policeStreetNumber }}
                    </div>
                  </template>
                </q-field>
              </q-item>
              <div>
                <q-item>
                  <q-input class="full-width" filled v-model="policeCity" label="Miasto"/>
                </q-item>
                <q-item>
                  <q-input class="full-width" filled v-model="policeZipCode" placeholder="00-000" label="Kod Pocztowy"
                           mask="##-###"/>
                </q-item>
                <q-item>
                  <q-select label="Prefix" filled v-model="ul_al" :options="ulAl" class="col-2 bg-grey-5"></q-select>
                  <q-input class="full-width col" filled v-model="policeStreet" label="Ulica"/>
                </q-item>
                <q-item>
                  <q-input class="full-width" filled v-model="policeStreetNumber" label="Numer Ulicy"/>
                </q-item>
                <q-item>
                  <q-btn label="Dodaj" color="secondary"/>
                </q-item>
              </div>
            </q-card-section>
          </q-card>
    </div>
  </q-page>
</template>

<script>

// import axios from 'axios'
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
    })
  },
  data () {
    return {
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
      local: App.host
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
      fetch('http://' + this.local + '/club/', {
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
        fetch('http://' + this.local + '/settings/createMotherClub', {
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
        this.failure = false
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
