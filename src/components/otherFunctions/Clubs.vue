<template>
  <div>
    <div class="bg-dark text-positive">
      <q-card-section>
        <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista znanych klubów
        </div>
        <q-btn @click="createClub = true" color="primary" label="dodaj nowy klub"></q-btn>
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
        <div class="row col text-center">
          <div class="q-pr-md">lp</div>
          <div class="col" @click="sortF('name')"><q-icon size="2em"
              :name="sortShortName ? 'arrow_drop_up' : 'arrow_drop_down'" />Nazwa</div>
          <div class="col">Telefon</div>
          <div class="col-2">e-mail</div>
          <div class="col-2">WZSS</div>
          <div class="col-2">ID</div>
        </div>
        <hr>
        <q-scroll-area class="full-width q-pa-none" style="height: 70vh;">
          <div v-for="(club, index) in clubs" :key="index" class="hover1 text-positive items-center"
            style="cursor: pointer;" @dblclick="clubInfoModel = club; clubInfo = true; clubID = club.id">
            <div v-if="club.shortName !== 'BRAK'" class="text-positive row">
              <div class="self-center q-pr-md">{{ index + 1 }}</div>
              <div class="col caption">
                <div class="text-bold">{{ club.shortName }}</div>
                <div class="text-caption">{{ club.fullName }}</div>
              </div>
              <div class="col">{{ club.phoneNumber }}</div>
              <div class="col-2">{{ club.email }}</div>
              <div class="col-2 text-center">{{ club.wzss }}</div>
              <div class="col-2 text-center">{{ club.id }}</div>
            </div>
          </div>
        </q-scroll-area>
      </q-card-section>
    </div>
    <q-dialog v-model="clubInfo">
      <q-card class="bg-dark text-positive" style="min-width: 50vw;">
        <q-card-section>
          <div class="text-h6 text-bold text-center">Informacje dodatkowe o klubie</div>
          <div>ID : {{ clubInfoModel.id }}</div>
          <div>Skrócona nazwa : {{ clubInfoModel.shortName }}</div>
          <div>Pełna nazwa : {{ clubInfoModel.fullName }}</div>
          <div v-if="clubInfoModel.id === 1">Numer Licencji Klubowej : {{ clubInfoModel.licenseNumber }}</div>
          <div>email : {{ clubInfoModel.email }}</div>
          <div>telefon : {{ clubInfoModel.phoneNumber }}</div>
          <div>WZSS : {{ clubInfoModel.wzss }}</div>
          <div>województwo : {{ clubInfoModel.vovoidership }}</div>
          <div>miasto : {{ clubInfoModel.city }}</div>
          <div>ulica : {{ clubInfoModel.street }} {{ clubInfoModel.houseNumber }}</div>
          <div>lokal : {{ clubInfoModel.appartmentNumber }}</div>
          <div class="full-width row">
            <q-btn class="col" rounded dense @click="editClub = true" color="primary" icon="edit" label="edytuj">
              <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Edytuj
                {{ clubInfoModel.name }}
              </q-tooltip>
            </q-btn>
            <div class="col-2"></div>
            <q-btn class="col" rounded dense @click="getAllPZSSClubs(); editClubByImport = true" color="primary"
              icon="edit" label="Edytuj za pomocą importu z PZSS">
              <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Edytuj za pomocą
                importu z PZSS
              </q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Usuń Klub" color="primary" @click="deleteClub=true" v-close-popup />
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteClub"
      @keypress.enter="deleteClubCode = true; deleteClub = false">
      <q-card class="bg-dark text-positive">
        <q-card-section class="items-center">
          <p class="q-ml-sm text-h6 text-center col">Czy na pewno chcesz usunąć klub?</p>
          <p class="q-ml-sm text-h6 text-center col">Zmiana będzie nieodwracalna, a wszystkim osobom przypisanym do tego klubu, zostanie ustawiony "BRAK"</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="usuń" color="primary" v-close-popup
            @click="deleteClubCode=true" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" deleteClubCode ">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter=" deleteClubfunction(clubID, code); code = null; deleteClubCode = false " autofocus
              type="password" v-model=" code " filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup
            @click="deleteClubfunction(clubID, code); code = null; deleteClubCode = false; code = null " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="createClub">
      <q-card class="bg-dark text-positive" style="min-width: 50vw">
        <q-card-section>
          <div class="text-h4 text-center text-bold">DODAJ NOWY KLUB</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="clubFullName" dense class="full-width q-pa-xs" rounded standout="" bg-color="primary"
            input-class="text-white" label-color="white" label="Pełna nazwa do dokumentów" />
          <q-input v-model="clubShortName" dense class="full-width q-pa-xs" rounded standout="" bg-color="primary"
            input-class="text-white" label-color="white" label="Nazwa Skrócona" />
          <q-select v-model="clubWZSS" :options="wzss" dense class="full-width q-pa-xs" input-class="text-white"
            label-color="white" bg-color="primary" label="WZSS" popup-content-class="bg-dark text-positive" rounded standout=""
            options-dense options-selected-class="bg-negative text-white hover" use-input
            hide-selected fill-input />
          <q-select v-model="clubVovoidership" :options="vovoiderships" dense class="full-width q-pa-xs"
            input-class="text-white" label-color="white" bg-color="primary" label="Województwo"
            popup-content-class="bg-dark text-positive" rounded standout="" options-dense
            options-selected-class="bg-negative text-white hover" use-input hide-selected fill-input />
          <q-input v-model="clubCity" dense class="full-width q-pa-xs" rounded standout="" bg-color="primary"
            input-class="text-white" label-color="white" label="Miasto" />
          <q-input v-model="clubStreet" dense class="full-width q-pa-xs" rounded standout="" bg-color="primary"
            input-class="text-white" label-color="white" label="Ulica" />
          <q-input v-model="clubAppartmentNumber" dense class="full-width q-pa-xs" rounded standout=""
            bg-color="primary" input-class="text-white" label-color="white" label="Numer posesji" />
          <q-input v-model="clubHouseNumber" dense class="full-width q-pa-xs" rounded standout="" bg-color="primary"
            input-class="text-white" label-color="white" label="Numer lokalu" />
          <q-input v-model="clubPhoneNumber" dense type="tel" class="full-width q-pa-xs" rounded standout=""
            bg-color="primary" input-class="text-white" label-color="white" mask="### ### ###" label="Telefon" />
          <q-input v-model="clubEmail" dense type="email" class="full-width q-pa-xs" rounded standout=""
            bg-color="primary" input-class="text-white" label-color="white" label="email" />
          <q-input v-if="clubID === 1" v-model="clubLicenseNumber" dense class="full-width q-pa-xs" rounded standout=""
            bg-color="primary" input-class="text-white" label-color="white" label="Numer licencji Klubowej" />
          <q-input v-model="clubURL" dense type="url" class="full-width q-pa-xs" rounded standout="" bg-color="primary"
            input-class="text-white" label-color="white" label="Strona internetowa" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="zapisz" color="primary" v-close-popup @click="createNewClub(createClubDTO())" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editClub">
      <q-card class="bg-dark text-positive" style="min-width: 50vw">
        <q-card-actions align="right">
          <q-btn icon="close" round color="primary" v-close-popup />
        </q-card-actions>
        <q-card-section class="q-pa-none">
          <div class="text-h6 text-center">Zmień dane klubu</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="clubFullName" dense class="full-width" input-class="text-positive" label-color="positive"
            filled label="Pełna nazwa do dokumentów" />
          <q-input v-model="clubShortName" dense class="full-width" input-class="text-positive" label-color="positive"
            filled label="Nazwa Skrócona" />
          <q-select v-model="clubWZSS" :options="wzss" dense class="full-width" input-class="text-positive"
            label-color="positive" filled label="WZSS" popup-content-class="bg-dark text-positive" rounded standout=""
            emit-value map-options options-dense options-selected-class="bg-negative text-positive" use-input
            hide-selected fill-input />
          <q-select v-model="clubVovoidership" :options="vovoiderships" dense class="full-width"
            input-class="text-positive" label-color="positive" filled label="Województwo"
            popup-content-class="bg-dark text-positive" rounded standout="" emit-value map-options options-dense
            options-selected-class="bg-negative text-positive" use-input hide-selected fill-input />
          <q-input v-model="clubCity" dense class="full-width" input-class="text-positive" label-color="positive" filled
            label="Miasto" />
          <q-input v-model="clubStreet" dense class="full-width" input-class="text-positive" label-color="positive"
            filled label="Ulica" />
          <q-input v-model="clubAppartmentNumber" dense class="full-width" input-class="text-positive"
            label-color="positive" filled label="Numer posesji" />
          <q-input v-model="clubHouseNumber" dense class="full-width" input-class="text-positive" label-color="positive"
            filled label="Numer lokalu" />
          <q-input v-model="clubPhoneNumber" dense type="tel" class="full-width" input-class="text-positive"
            label-color="positive" mask="### ### ###" filled label="Telefon" />
          <q-input v-model="clubEmail" dense type="email" class="full-width" input-class="text-positive"
            label-color="positive" filled label="email" />
          <q-input v-if="clubID === 1" v-model="clubLicenseNumber" dense class="full-width" input-class="text-positive"
            label-color="positive" filled label="Numer licencji Klubowej" />
          <q-input v-model="clubURL" dense type="url" class="full-width" input-class="text-positive"
            label-color="positive" filled label="Strona internetowa" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="zapisz" color="primary" v-close-popup @click="updateClub(createClubDTO())" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editClubByImport">
      <q-card class="bg-dark text-positive" style="min-width: 60vw">
        <q-card-actions align="right">
          <q-btn icon="close" round color="primary" v-close-popup />
        </q-card-actions>
        <q-card-section>
          <div class="text-h6 text-center">Zmień dane klubu</div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <q-input debounce="500" v-model="searchName1" class="col"
              @keypress.enter="searchCity1 = ''; getSearchName1(getSearchName1)"
              @input="searchCity1 = ''; getSearchName1(searchName1)" label="wyszukaj po nazwie" color="white"
              bg-color="secondary" input-class="text-white" label-color="white" dense rounded standout="">
              <template v-slot:append>
                <q-icon v-if="searchName1 != ''" name="close" @click="searchName1 = ''; getSearchName1(searchName1)"
                  class="cursor-pointer text-white" />
                <q-icon name="search" class="text-white" @click="searchCity1 = ''; getSearchName1(searchName1)" />
              </template>
            </q-input>
            <q-input debounce="500" v-model="searchCity1" class="col"
              @keypress.enter="searchName1 = ''; getSearcCity1(searchCity1)"
              @input="searchName1 = ''; getSearcCity1(searchCity1)" label="wyszukaj po mieście" color="white"
              bg-color="secondary" input-class="text-white" label-color="white" dense rounded standout="">
              <template v-slot:append>
                <q-icon v-if="searchCity1 != ''" name="close" @click="searchCity1 = ''; getSearcCity1(searchCity1)"
                  class="cursor-pointer text-white" />
                <q-icon name="search" class="text-white" @click="searchName1 = ''; getSearcCity1(searchCity1)" />
              </template>
            </q-input>
          </div>
          <div class="row col">
            <div class="q-pr-md">lp</div>
            <div class="col">Nazwa</div>
            <div class="col-3">Telefon</div>
            <div class="col">WZSS</div>
          </div>
          <q-scroll-area class="full-width q-pa-none" style="height: 70vh;">
            <div v-for="(club, index) in clubsPZSS" :key="index" class="hover1 row text-positive items-center"
              style="cursor: pointer;">
              <div class="self-center q-pr-md">{{ index + 1 }}</div>
              <div class="col caption">
                <div class="text-bold">{{ club.ShortName }}</div>
                <div class="text-caption">{{ club.FullName }}</div>
              </div>
              <div class="col-3">{{ club.Phone }}</div>
              <div class="col">{{ club.WZSS }}</div>
              <q-btn rounded dense style="width:5%;" @click="updateClub(club)" color="primary" icon="download">
                <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Importuj z
                  bazy
                  {{ club.name }}
                </q-tooltip>
              </q-btn>
            </div>
          </q-scroll-area>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
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
import Vovoiderships from 'src/utils/VovoidersipsName.json'
import WZSS from 'src/utils/WZSS.json'

export default {
  name: 'Clubs',
  data () {
    return {
      clubs: [],
      vovoiderships: Vovoiderships,
      wzss: WZSS,
      clubsPZSS: Clubs.data,
      tempClubs: [],
      tempClubsPZSS: [],
      clubInfoModel: [],
      clubID: null,
      clubShortName: null,
      clubFullName: null,
      clubLicenseNumber: null,
      clubAppartmentNumber: null,
      clubHouseNumber: null,
      clubVovoidership: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubWZSS: null,
      clubCity: null,
      clubStreet: null,
      clubURL: null,
      clubInfo: false,
      code: null,
      searchName: '',
      searchCity: '',
      searchName1: '',
      searchCity1: '',
      sortShortName: false,
      editClub: false,
      editClubByImport: false,
      createClub: false,
      deleteClub: false,
      deleteClubCode: false,
      success: false,
      failure: false,
      message: null,
      local: App.host
    }
  },
  created () {
    this.getAllClubs()
  },
  methods: {
    getAllClubs () {
      fetch(`${this.local}/club/`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubs = response
          this.tempClubs = response
        })
    },
    getAllPZSSClubs () {
      this.clubsPZSS = Clubs.data
      this.tempClubsPZSS = Clubs.data
      this.clubsPZSS.sort((a, b) => a.ShortName.localeCompare(b.secondName))
    },
    createClubDTO () {
      return {
        ShortName: this.clubShortName,
        FullName: this.clubFullName,
        LicenceNo: this.clubLicenseNumber,
        AppartmentNumber: this.clubAppartmentNumber,
        HouseNumber: this.clubHouseNumber,
        VovoidershipName: this.clubVovoidership,
        Phone: this.clubPhoneNumber,
        Email: this.clubEmail,
        WZSS: this.clubWZSS,
        City: this.clubCity,
        Street: this.clubStreet,
        www: this.clubURL
      }
    },
    updateClub (club) {
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
      fetch(`${this.local}/club/${this.clubID}`, {
        method: 'PUT',
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
              this.clubInfoModel = data
              this.getAllClubs()
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    deleteClubfunction (id, code) {
      fetch(`${this.local}/club/delete?id=${id}&pinCode=${code}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.getAllClubs()
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      }).catch(() => {
        this.message = 'coś poszło nie tak'
        this.failure = true
        this.autoClose()
      })
    },
    createNewClub (club) {
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
      fetch(`${this.local}/club/create`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.clubShortName = null
              this.clubFullName = null
              this.clubLicenseNumber = null
              this.clubEmail = null
              this.clubAddress = null
              this.clubURL = null
              this.getAllClubs()
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
          this.clubs.sort((a, b) => b.shortName.localeCompare(a.shortName))
          this.sortShortName = !this.sortShortName
        } else {
          this.clubs.sort((a, b) => a.shortName.localeCompare(b.shortName))
          this.sortShortName = !this.sortShortName
        }
      }
    },
    getSearchName (val) {
      this.clubs = this.tempClubs
      if (val === '') {
        this.clubs = this.tempClubs
      } else {
        const needle = val.toLowerCase()
        this.clubs = this.clubs.filter(v => v.shortName.toLowerCase().indexOf(needle) > -1)
      }
    },
    getSearcCity (val) {
      this.clubs = this.tempClubs
      if (val === '') {
        this.clubs = this.tempClubs
      } else {
        const needle = val.toLowerCase()
        this.clubs = this.clubs.filter(v => v.city.toLowerCase().indexOf(needle) > -1)
      }
    },
    getSearchName1 (val) {
      this.getAllPZSSClubs()
      if (val === '') {
        this.clubsPZSS = this.tempClubsPZSS
      } else {
        const needle = val.toLowerCase()
        this.clubsPZSS = this.clubsPZSS.filter(v => v.ShortName.toLowerCase().indexOf(needle) > -1)
      }
    },
    getSearcCity1 (val) {
      this.getAllPZSSClubs()
      if (val === '') {
        this.clubsPZSS = this.tempClubsPZSS
      } else {
        const needle = val.toLowerCase()
        this.clubsPZSS = this.clubsPZSS.filter(v => v.City.toLowerCase().indexOf(needle) > -1)
      }
    },
    autoClose () {
      setTimeout(() => {
        this.clubShortName = null
        this.clubFullName = null
        this.clubLicenseNumber = null
        this.clubAppartmentNumber = null
        this.clubHouseNumber = null
        this.clubVovoidership = null
        this.clubPhoneNumber = null
        this.clubEmail = null
        this.clubWZSS = null
        this.clubCity = null
        this.clubStreet = null
        this.clubURL = null
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>

<style scoped></style>
