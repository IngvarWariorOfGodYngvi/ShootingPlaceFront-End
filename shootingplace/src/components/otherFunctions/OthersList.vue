<template>
  <div>
    <q-card class="col bg-dark text-positive">
      <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold">Lista osób spoza klubu</div>
      <div class="row col">
        <div class="q-pr-md">lp</div>
        <div class="col row"><div class="col">Nazwisko i imię</div><div style="align-self: end" class="q-pr-xl">ID</div></div>
        <div class="col">Klub</div>
        <div class="col">Telefon</div>
        <div class="col">e-mail</div>
      </div>
      <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
        <div v-for="(item, index) in others" :key="index" class="row text-positive">
          <div class="self-center q-pr-md">{{ index + 1 }}</div>
          <div class="self-center col row text-left"><div class="col">{{ item.secondName }} {{ item.firstName }}</div><div style="align-self: end;" class="q-pr-md">ID: {{ item.id }}  </div></div>
          <div class="self-center col text-left">{{ item.club.name }}</div>
          <div class="self-center col-2 text-left">{{ item.phoneNumber }}</div>
          <div class="self-center col-2 text-left">{{ item.email }}</div>
          <q-btn dense class="col-1" color="primary" @click="otherID = item.id; alertDial = true" icon="delete"><q-tooltip
              anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Usuń</q-tooltip></q-btn>
          <q-btn dense class="col-1" color="secondary"
            @click="otherID = item.id; setOtherPersonParam (item);getAllClubsToTournament(); editOtherPerson = true"
            icon="edit"><q-tooltip anchor="top middle" :offset="[35, 35]"
              content-class="text-body1 bg-secondary">Edytuj</q-tooltip></q-btn>
        </div>
      </q-scroll-area>
    </q-card>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="failure">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alertDial">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Czy na pewno usunąć? Zmiana będzie trwała.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="usuń" color="primary" v-close-popup @click="deactivateOther()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editOtherPerson">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <q-input v-model="otherPersonFirstName" dense class="full-width" label-color="positive" input-class="text-positive"
            filled label="Imię"></q-input>
          <q-input v-model="otherPersonSecondName" dense class="full-width" label-color="positive" input-class="text-positive"
            filled label="Nazwisko"></q-input>
          <q-item dense><q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubNamePerson"
              :val="'BRAK'" label="Brak Klubu"></q-checkbox>
            <q-select v-if="clubNamePerson !== 'BRAK'" dense options-dense popup-content-class="bg-dark text-positive"
              options-selected-class="bg-dark text-positive" input-class="text-positive" color="positive"
              label-color="positive" class="full-width" @new-value="createValue" hide-selected use-chips filled
              v-model="clubNamePerson" use-input fill-input input-debounce="0" :options="filterOptions"
              @filter="filterFna" label="Wybierz Klub">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Brak wyników
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item>
          <q-input v-model="otherPersonPhoneNumber" dense type="tel" label-color="positive" input-class="text-positive"
            class="full-width" mask="### ### ###" filled label="Telefon"></q-input>
          <q-input v-model="otherPersonEmail" dense type="email" label-color="positive" input-class="text-positive"
            class="full-width" filled label="Email"></q-input>
          <q-input v-model="otherPersonWeaponPermissionNUmber" dense label-color="positive" input-class="text-positive"
            class="full-width" filled label="Numer pozwolenia na Broń"></q-input>
          <div >
            <q-input filled v-model="otherPersonPostOfficeCity" label="Miasto" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="otherPersonZipCode" label="Kod Pocztowy" mask="##-###" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="otherPersonStreet" label="Ulica" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="otherPersonStreetNumber" label="Numer Ulicy" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="otherPersonFlatNumber" label="Mieszkania" dense input-class="text-positive" label-color="positive"/>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="zapisz" color="primary" v-close-popup
            @click="updateOtherPerson(otherID)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'
export default {
  name: 'OthersList.vue',
  created () {
    this.getOther()
    this.getAllClubsToTournament()
  },
  data () {
    return {
      others: [],
      clubNames: [],
      filterOptions: [],
      otherID: null,
      alertDial: false,
      success: false,
      failure: false,
      message: null,
      otherPersonWeaponPermissionNUmber: null,
      otherPersonPostOfficeCity: null,
      otherPersonZipCode: null,
      otherPersonStreet: null,
      otherPersonStreetNumber: null,
      otherPersonFlatNumber: null,
      editOtherPerson: false,
      otherPersonFirstName: '',
      otherPersonSecondName: '',
      otherPersonPhoneNumber: '',
      otherPersonEmail: '',
      clubNamePerson: '',
      local: App.host
    }
  },
  methods: {
    getOther () {
      fetch('http://' + this.local + '/other/all', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.others = response
        })
    },
    getAllClubsToTournament () {
      fetch('http://' + this.local + '/club/tournament', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubNames = response
        })
    },
    setOtherPersonParam (otherPerson) {
      this.otherPersonFirstName = otherPerson.firstName
      this.otherPersonSecondName = otherPerson.secondName
      this.otherPersonPhoneNumber = otherPerson.phoneNumber
      this.otherPersonEmail = otherPerson.email
      this.otherPersonWeaponPermissionNUmber = otherPerson.weaponPermissionNumber
      this.clubNamePerson = otherPerson.club.name
      if (otherPerson.address != null) {
        this.otherPersonPostOfficeCity = otherPerson.address.postOfficeCity
        this.otherPersonZipCode = otherPerson.address.zipCode
        this.otherPersonStreet = otherPerson.address.street
        this.otherPersonStreetNumber = otherPerson.address.streetNumber
        this.otherPersonFlatNumber = otherPerson.address.flatNumber
      } else {
        this.otherPersonPostOfficeCity = null
        this.otherPersonZipCode = null
        this.otherPersonStreet = null
        this.otherPersonStreetNumber = null
        this.otherPersonFlatNumber = null
      }
    },
    deactivateOther () {
      fetch('http://' + this.local + '/other/?id=' + this.otherID, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.otherID = null
              this.getOther()
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
    updateOtherPerson (id) {
      const data = {
        firstName: this.otherPersonFirstName,
        secondName: this.otherPersonSecondName,
        phoneNumber: this.otherPersonPhoneNumber,
        email: this.otherPersonEmail,
        weaponPermissionNumber: this.otherPersonWeaponPermissionNUmber,
        address: {
          zipCode: this.otherPersonZipCode,
          postOfficeCity: this.otherPersonPostOfficeCity,
          street: this.otherPersonStreet,
          streetNumber: this.otherPersonStreetNumber,
          flatNumber: this.otherPersonFlatNumber
        }
      }
      fetch('http://' + this.local + '/other/?id=' + id + '&clubName=' + this.clubNamePerson, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.getOther()
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    createValue (val, done) {
      if (val.length > 0) {
        const model = (this.clubNames || []).slice()

        val
          .split(/[,;|]+/)
          .map(v => v.trim())
          .filter(v => v.length > 0)
          .forEach(v => {
            if (this.clubNames.includes(v) === false) {
              this.clubNames.push(v)
            }
            if (model.includes(v) === false) {
              model.push(v)
            }
          })

        done(null)
        this.clubNames = model
      }
    },
    filterFna (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.clubNames
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.clubNames.filter(
            v => v.toLowerCase().indexOf(needle) > -1
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
