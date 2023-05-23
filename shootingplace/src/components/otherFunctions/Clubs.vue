<template>
  <div>
    <div class="bg-dark text-positive">
      <q-card-section>
        <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista znanych klubów
        </div>
        <q-btn @click="createClub = true" color="primary" label="dodaj nowy klub"></q-btn>
        <div class="row col">
          <div class="q-pr-md">lp</div>
          <div class="col">Nazwa</div>
          <div class="col">Strona</div>
          <div class="col">Telefon</div>
          <div class="col">e-mail</div>
          <div class="col">adres</div>
        </div>
        <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
          <div v-for="(club, index) in clubs" :key="index">
            <div v-if="club.name !== 'BRAK'" class="row text-positive">
              <div class="self-center q-pr-md">{{ index + 1 }}</div>
              <div @dblclick="clubInfoModel = club; clubInfo = true" class=" col self-center">{{ club.name }}</div>
              <div class="col self-center"><a :href="club.url" target="_blank">{{ club.url }}</a></div>
              <div class="col self-center">{{ club.phoneNumber }}</div>
              <div class="col self-center">{{ club.email }}</div>
              <div class="col self-center">{{ club.address }}</div>
              <q-btn dense class="col-1" @click="clubID = club.id; editClub = true" color="primary" icon="edit">
                <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Edytuj
                  {{ club.name }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-scroll-area>
      </q-card-section>
    </div>
    <q-dialog v-model="clubInfo">
      <q-card>
        <q-card-section class="text-bold">
          <div class="text-h6">Informacje dodatkowe o klubie {{ clubInfoModel.name }}</div>
          <div>ID : {{ clubInfoModel.id }}</div>
          <div v-if="clubInfoModel.id === 1">Pełna nazwa : {{ clubInfoModel.fullName }}</div>
          <div v-if="clubInfoModel.id === 1">Numer Licencji Klubowej : {{ clubInfoModel.licenseNumber }}</div>
          <div>email : {{ clubInfoModel.email }}</div>
          <div>telefon : {{ clubInfoModel.phoneNumber }}</div>
          <div>adres : {{ clubInfoModel.address }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="createClub">
      <q-card class="bg-dark text-positive" style="min-width: 50vw">
        <q-card-section>
          <div class="text-h6">Dodaj nowy Klub</div>
        </q-card-section>
        <q-card-section>
            <q-input v-model="clubName" dense class="full-width" input-class="text-positive" label-color="positive" filled label="Nazwa"></q-input>
            <q-input v-model="clubFullName" dense class="full-width" input-class="text-positive" label-color="positive" filled label="Pełna nazwa do dokumentów"></q-input>
            <q-input v-if="clubID === 1" v-model="clubLicenseNumber" dense class="full-width" input-class="text-positive" label-color="positive" filled label="Numer licencji Klubowej"></q-input>
            <q-input v-model="clubPhoneNumber" type="tel" dense class="full-width" input-class="text-positive" label-color="positive" mask="### ### ###" filled
              label="Telefon"></q-input>
            <q-input v-model="clubEmail" type="email" dense class="full-width" input-class="text-positive" label-color="positive" filled label="email"></q-input>
            <q-input v-model="clubAddress" type="address" dense class="full-width" input-class="text-positive" label-color="positive" filled label="Adres"></q-input>
            <q-input v-model="clubURL" type="url" dense class="full-width" input-class="text-positive" label-color="positive" filled label="Strona internetowa"></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="zapisz" color="primary" v-close-popup @click="createNewClub()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editClub">
      <q-card class="bg-dark text-positive" style="min-width: 50vw">
        <q-card-section>
          <div class="text-h6" >Zmień dane klubu</div>
        </q-card-section>
        <q-card-section>
            <q-input v-model="clubName" dense class="full-width" input-class="text-positive" label-color="positive" filled label="Nazwa"></q-input>
            <q-input v-model="clubFullName" dense class="full-width" input-class="text-positive" label-color="positive" filled label="Pełna nazwa do dokumentów"></q-input>
            <q-input v-if="clubID === 1" v-model="clubLicenseNumber" dense class="full-width" input-class="text-positive" label-color="positive" filled label="Numer licencji Klubowej"></q-input>
            <q-input v-model="clubPhoneNumber" dense type="tel" class="full-width" input-class="text-positive" label-color="positive" mask="### ### ###" filled
              label="Telefon"></q-input>
            <q-input v-model="clubEmail" dense type="email" class="full-width" input-class="text-positive" label-color="positive" filled label="email"></q-input>
            <q-input v-model="clubAddress" dense type="address" class="full-width" input-class="text-positive" label-color="positive" filled label="Adres"></q-input>
            <q-input v-model="clubURL" dense type="url" class="full-width" input-class="text-positive" label-color="positive" filled label="Strona internetowa"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="zapisz" color="primary" v-close-popup @click="updateClub()" />
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
    <q-dialog position="top" v-model="failure">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'

export default {
  name: 'Clubs',
  data () {
    return {
      clubs: [],
      clubInfoModel: [],
      clubID: null,
      clubName: null,
      clubFullName: null,
      clubLicenseNumber: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubAddress: null,
      clubURL: null,
      clubInfo: false,
      editClub: false,
      createClub: false,
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
      fetch('http://' + this.local + '/club/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubs = response
        })
    },
    updateClub () {
      const data = {
        name: this.clubName,
        fullName: this.clubFullName,
        licenseNumber: this.clubLicenseNumber,
        phoneNumber: this.clubPhoneNumber,
        email: this.clubEmail,
        address: this.clubAddress,
        url: this.clubURL
      }
      fetch('http://' + this.local + '/club/' + this.clubID, {
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
              this.clubName = null
              this.clubFullName = null
              this.clubLicenseNumber = null
              this.clubEmail = null
              this.clubAddress = null
              this.clubURL = null
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
    createNewClub () {
      const data = {
        name: this.clubName,
        fullName: this.clubFullName,
        licenseNumber: this.clubLicenseNumber,
        phoneNumber: this.clubPhoneNumber,
        email: this.clubEmail,
        address: this.clubAddress,
        url: this.clubURL
      }
      fetch('http://' + this.local + '/club/create', {
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
              this.clubName = null
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
