<template>
  <div>
    <q-btn class="full-width" color="primary" label="przejdź do formularza" @click="addNewOtherPerson = true" />
    <q-dialog v-model="addNewOtherPerson">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Dodawanie nowej osoby spoza klubu</div>
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive"
            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 32"
            v-model="otherFirstName" label="Imię *" />
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive"
            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 45"
            v-model="otherSecondName" label="Nazwisko *" />
          <div class="row"><q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubName" :val="'BRAK'"
              label="Brak Klubu"></q-checkbox>
            <q-select stack-label dense options-dense popup-content-class="bg-dark text-positive" class="col" input-class="text-positive" label-color="positive" v-if="clubName !== 'BRAK'" @new-value="createValue" hide-selected use-chips
              filled v-model="clubName" use-input fill-input input-debounce="0" :options="filterOptions"
              @filter="filterFna" label="Wybierz Klub">
              <template v-slot:no-option>
                <q-item dense>
                  <q-item-section class="text-grey">
                    Brak wyników
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <q-input dense class="full-width" color="positive" input-class="text-positive" label-color="positive" mask="### ### ###" filled v-model="otherPhoneNumber" label="Numer telefonu" />
          <q-input dense class="full-width" color="positive" input-class="text-positive" label-color="positive" filled v-model="otherEmail" label="e-mail" />
          <q-field color="positive" label-color="positive" class="full-width" standout="bg-accent text-positive" stack-label >
            <div class="self-center full-width col no-outline" >Uprawnienia Sędziowskie - można zostawić
              puste
            </div>
          </q-field>
          <div class="row">
            <q-item>
              <q-radio v-model="ordinal" :val="1" label="Klasa 3" color="secondary" />
            </q-item>
            <q-item>
              <q-radio v-model="ordinal" :val="2" label="Klasa 2" color="secondary" />
            </q-item>
            <q-item>
              <q-radio v-model="ordinal" :val="3" label="Klasa 1" color="secondary" />
            </q-item>
            <q-item>
              <q-radio v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" />
            </q-item>
            <q-item>
              <q-radio v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" />
            </q-item>
          </div>
          <q-input dense class="full-width" color="positive" input-class="text-positive" label-color="positive" v-model="permissionsOtherArbiterNumber" label="Numer uprawnień" />
          <q-input dense class="full-width" color="positive" input-class="text-positive" label-color="positive" filled v-model="permissionsOtherArbiterPermissionValidThru" mask="####/12/31"
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
import App from 'src/App.vue'
export default {
  data () {
    return {
      otherFirstName: '',
      otherSecondName: '',
      otherPhoneNumber: '',
      otherEmail: '',
      clubName: '',
      ordinal: '',
      permissionsOtherArbiterNumber: '',
      permissionsOtherArbiterPermissionValidThru: '',
      addNewOtherPerson: false,
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
        email: email
      }
      fetch('http://' + this.local + '/other?club=' + clubName + '&arbiterClass=' + ordinal + '&arbiterNumber=' + permissionsOtherArbiterNumber + '&arbiterPermissionValidThru=' + permissionsOtherArbiterPermissionValidThru.replace(/\//gi, '-'), {
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
      fetch(`http://${this.local}/club/tournament`, {
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
