<template>
  <div>
    <q-card class="text-body2">
      <q-card-section>
        <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista znanych klubów
        </div>
        <div class="q-pb-md">
          <q-btn @click="createClub=true" label="utwórz nowy klub"></q-btn>
        </div>
        <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
          <div v-for="(club,id) in clubs" :key="id">
            <div v-if="club.name!=='BRAK'" class="row">
              <div @dblclick="clubInfoModel=club;clubInfo=true" class="col-3">
                <q-field dense label="Klub" standout="bg-accent text-black" stack-label clickable>
                  <div class="self-center full-width no -outline text-left text-black" tabindex="1">
                    {{ club.name }}
                  </div>
                </q-field>
              </div>
              <div class="col-3">
                <a :href="club.url" target="_blank">
                  <q-field dense class="col" label="strona" standout="bg-accent text-black" stack-label>
                    <div class="self-center col full-width no-outline text-left text-black" tabindex="1">
                      {{ club.url }}
                    </div>
                  </q-field>
                </a>
              </div>
              <div class="col-3">
                <q-field dense label="adres" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="1">
                    {{ club.address }}
                  </div>
                </q-field>
              </div>
              <q-btn dense class="col-1" @click="clubID = club.id;editClub=true" icon="edit">
                <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Edytuj
                  {{ club.name }}
                </q-tooltip>
              </q-btn>
            </div>
            <p></p>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
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
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="createClub">
      <q-card>
        <q-card-section>
          <div class="text-h6" style="min-width: 500px">Utwórz nowy Klub</div>
        </q-card-section>
        <q-card-section>
          <q-item>
            <q-input v-model="clubName" class="full-width" filled label="Nazwa"></q-input>
          </q-item>
          <q-item>
            <q-input v-model="clubFullName" class="full-width" filled label="Pełna nazwa do dokumentów"></q-input>
          </q-item>
          <q-item v-if="clubID === 1">
            <q-input v-model="clubLicenseNumber" class="full-width" filled label="Numer licencji Klubowej"></q-input>
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
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat icon="cancel" color="primary" v-close-popup/>
          <q-btn icon="save" color="primary" v-close-popup @click="createNewClub()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editClub">
      <q-card>
        <q-card-section>
          <div class="text-h6" style="min-width: 500px">Zmień dane klubu</div>
        </q-card-section>
        <q-card-section>
          <q-item>
            <q-input v-model="clubName" class="full-width" filled label="Nazwa"></q-input>
          </q-item>
          <q-item>
            <q-input v-model="clubFullName" class="full-width" filled label="Pełna nazwa do dokumentów"></q-input>
          </q-item>
          <q-item v-if="clubID === 1">
            <q-input v-model="clubLicenseNumber" class="full-width" filled label="Numer licencji Klubowej"></q-input>
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
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat icon="cancel" color="primary" v-close-popup/>
          <q-btn icon="save" color="primary" v-close-popup @click="updateClub()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="failure">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
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

<style scoped>

</style>
