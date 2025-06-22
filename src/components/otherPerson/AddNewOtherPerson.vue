<template>
  <div>
    <q-btn class="full-width" color="primary" label="dodaj nową osobę - formularz" @click="addNewOtherPerson = true" />
    <q-dialog v-model="addNewOtherPerson">
      <q-card class="bg-dark text-positive" style="min-width: 40vw;">
        <q-card-section>
          <div class="text-h6">Dodawanie nowej osoby spoza klubu</div>
          <q-input dense input-class="text-positive" label-color="positive"
            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 32"
            v-model="otherFirstName" label="Imię *" />
          <q-input dense input-class="text-positive" label-color="positive"
            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 45"
            v-model="otherSecondName" label="Nazwisko *" />
            <hr>
            <div class="self-center full-width">poniżej można zostawić puste</div>
          <div class="row"><q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubName" :val="'BRAK'"
              label="Brak Klubu"/>
            <q-select stack-label dense options-dense popup-content-class="bg-dark text-positive" class="col" input-class="text-positive" label-color="positive" v-if="clubName !== 'BRAK'" new-value-mode="add-uniqe" hide-selected use-chips
              filled v-model="clubName" use-input fill-input input-debounce="0" :options="filterOptions"
              @filter="filterFna" label="Wybierz Klub" @input.stop="getAllClubsToTournament()">
              <template v-slot:no-option>
                <q-item dense>
                  <q-item-section class="text-grey">
                    Brak wyników
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-btn color="primary" label="importuj klub z bazy PZSS" @click="importClub = true"/>
          </div>
          <q-expansion-item label="informacje dodatkowe">
          <q-input dense input-class="text-positive" label-color="positive" mask="### ### ###" filled v-model="otherPhoneNumber" label="Numer telefonu" />
          <q-input dense input-class="text-positive" label-color="positive" filled v-model="otherEmail" label="e-mail" />
          <div>
            <q-input filled v-model="nonMemberPostOfficeCity" label="Miasto" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="nonMemberZipCode" label="Kod Pocztowy" mask="##-###" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="nonMemberStreet" label="Ulica" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="nonMemberStreetNumber" @input="nonMemberStreetNumber.length===0?nonMemberStreetNumber=null:''" label="Numer Ulicy" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="nonMemberFlatNumber" @input="nonMemberFlatNumber.length===0?nonMemberFlatNumber=null:''" label="Mieszkania" dense input-class="text-positive" label-color="positive"/>
          </div>
          <div>
            <q-input filled v-model="nonMemberWeaponPermissionNumber" @input="nonMemberWeaponPermissionNumber.length===0?nonMemberWeaponPermissionNumber=null:''" label="Numer pozwolenia na Broń" dense input-class="text-positive" label-color="positive"/>
          </div>
          <q-input dense class="full-width" input-class="text-positive" label-color="positive" v-model="permissionsOtherArbiterNumber" label="Numer uprawnień" />
          <div class="row">
            <q-item dense>
              <q-radio dense v-model="ordinal" :val="1" label="Klasa 3" color="secondary" />
            </q-item>
            <q-item dense>
              <q-radio dense v-model="ordinal" :val="2" label="Klasa 2" color="secondary" />
            </q-item>
            <q-item dense>
              <q-radio dense v-model="ordinal" :val="3" label="Klasa 1" color="secondary" />
            </q-item>
            <q-item dense>
              <q-radio dense v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" />
            </q-item>
            <q-item dense>
              <q-radio dense v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" />
            </q-item>
          </div>
          <q-input dense class="full-width" input-class="text-positive" label-color="positive" filled v-model="permissionsOtherArbiterPermissionValidThru" mask="####/12/31"
            label="Ważne do:">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer text-positive">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="permissionsOtherArbiterPermissionValidThru" no-unset mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-expansion-item>
          <div>* pole wymagane</div>
          <q-item>
            <q-btn label="Zapisz do bazy" v-close-popup
              @click="addOtherPerson(otherFirstName, otherSecondName, otherPhoneNumber, otherEmail, clubName, ordinal, permissionsOtherArbiterNumber, permissionsOtherArbiterPermissionValidThru)"
              color="primary" />
          </q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="importClub">
      <q-card style="min-width: 70vw;" class="bg-dark">
        <q-card-actions align="right">
          <q-btn icon="close" round color="primary" v-close-popup />
        </q-card-actions>
        <q-card-section>
          <PZSSClubs v-on:importClub="getAllClubsToTournament()"/>
        </q-card-section>
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
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import App from 'src/App.vue'
export default {
  props: {
    nameForm: {
      type: String,
      default: '',
      required: false
    }
  },
  components: {
    PZSSClubs: lazyLoadComponent({
      componentFactory: () => import('components/otherFunctions/PZSSClubs.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      otherFirstName: '',
      otherSecondName: this.nameForm,
      otherPhoneNumber: '',
      otherEmail: '',
      clubName: '',
      ordinal: '',
      nonMemberPostOfficeCity: null,
      nonMemberZipCode: null,
      nonMemberStreet: null,
      nonMemberStreetNumber: null,
      nonMemberFlatNumber: null,
      nonMemberWeaponPermissionNumber: null,
      permissionsOtherArbiterNumber: '',
      permissionsOtherArbiterPermissionValidThru: '',
      addNewOtherPerson: false,
      importClub: false,
      success: false,
      failure: false,
      message: null,
      clubs: [],
      filterOptions: [],
      local: App.host
    }
  },
  created () {
    this.getAllClubsToTournament()
  },
  destroyed () {
    this.clubs = []
  },
  methods: {
    addOtherPerson (firstName, secondName, phoneNumber, email, clubName, ordinal, permissionsOtherArbiterNumber, permissionsOtherArbiterPermissionValidThru) {
      const person = {
        firstName: firstName,
        secondName: secondName,
        phoneNumber: phoneNumber,
        email: email,
        weaponPermissionNumber: this.nonMemberWeaponPermissionNumber,
        address: {
          zipCode: this.nonMemberZipCode,
          postOfficeCity: this.nonMemberPostOfficeCity,
          street: this.nonMemberStreet,
          streetNumber: this.nonMemberStreetNumber,
          flatNumber: this.nonMemberFlatNumbenr
        }
      }
      fetch(`${this.local}/other?club=${clubName}&arbiterClass=${ordinal}&arbiterNumber=${permissionsOtherArbiterNumber}&arbiterPermissionValidThru=${permissionsOtherArbiterPermissionValidThru.replace(/\//gi, '-')}`, {
        method: 'POST',
        body: JSON.stringify(person),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 201) {
          response.text().then(
            response => {
              this.message = response
              this.$emit('addOtherPerson')
              this.success = true
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
    getAllClubsToTournament () {
      fetch(`${this.local}/club/tournament`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubs = response
        })
    },
    filterFna (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.clubs
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.clubs.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    createValue (val, done) {
      if (val.length > 0) {
        const model = (this.clubName || []).slice()

        val
          .split(/[,;|]+/)
          .map(v => v.trim())
          .filter(v => v.length > 0)
          .forEach(v => {
            if (this.clubs.includes(v) === false) {
              this.clubs.push(v)
            }
            if (model.includes(v) === false) {
              model.push(v)
            }
          })

        done(null)
        this.clubName = model
      }
      this.message = 'dodano do listy'
      this.success = true
      this.autoClose()
    },
    autoClose () {
      setTimeout(() => {
        this.message = null
        this.success = false
        this.failure = false
      }, 2000)
    }
  }
}
</script>
