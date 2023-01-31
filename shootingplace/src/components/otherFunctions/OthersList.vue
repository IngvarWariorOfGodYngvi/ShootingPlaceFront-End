<template>
  <div>
  <div class="row text-body2 bg-white">
    <q-card-section class="col">
      <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista osób spoza klubu</div>
      <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
        <ol>
          <li v-for="(others,id) in others" :key="id">
            <div class="row">
              <q-field dense class="col" label="Nazwisko" standout="bg-accent text-black" stack-label>
                <div>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{others.secondName}} {{others.firstName}}</div>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0"></div>
                </div>
              </q-field>
              <q-field dense class="col" label="Klub" standout="bg-accent text-black" stack-label>
                <div>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{others.club.name}}</div>
                </div>
              </q-field>
              <q-field dense class="col" label="telefon" standout="bg-accent text-black" stack-label>
                <div>
                  <div class="self-center col full-width no-outline text-left text-black row" tabindex="0">{{others.phoneNumber}}</div>
                </div>
              </q-field>
              <q-field dense class="col" label="email" standout="bg-accent text-black" stack-label>
                <div>
                  <div class="self-center col full-width no-outline text-left text-black row" tabindex="1">{{others.email}}</div>
                </div>
              </q-field>
              <q-btn dense class="col-1" color="primary" @click="othersID = others.id;alert=true" icon="delete"><q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Usuń</q-tooltip></q-btn>
              <q-btn dense class="col-1" color="secondary" @click="othersID = others.id;otherPersonFirstName = others.firstName;otherPersonSecondName = others.secondName;otherPersonPhoneNumber = others.phoneNumber;otherPersonEmail = others.email;clubNamePerson = others.club.name;getAllClubsToTournament();editOtherPerson=true" icon="edit"><q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Edytuj</q-tooltip></q-btn>
            </div>
            <p></p>
          </li>
        </ol>
      </q-scroll-area>
    </q-card-section>
  </div>
  <q-dialog :position="'top'" v-model="success">
    <q-card>
      <q-card-section>
        <div v-if="message!=null" class="text-h6">{{message}}</div>
      </q-card-section>

    </q-card>
  </q-dialog>
  <q-dialog v-model="failure">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{message}}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy na pewno usunąć? Zmiana będzie trwała.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat icon="cancel" color="primary" v-close-popup/>
          <q-btn flat icon="delete" color="primary" v-close-popup @click="deactivateOther()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  <q-dialog v-model="editOtherPerson">
    <q-card>
      <q-card-section>
        <q-item><q-input v-model="otherPersonFirstName" class="full-width" filled label="Imię"></q-input></q-item>
        <q-item><q-input v-model="otherPersonSecondName" class="full-width" filled label="Nazwisko"></q-input></q-item>
        <q-item><q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubNamePerson" :val="'BRAK'" label="Brak Klubu"></q-checkbox>
          <q-item v-if="clubNamePerson!=='BRAK'" class="full-width">
            <q-select v-if="clubNamePerson!=='BRAK'" class="full-width" @new-value="createValue" hide-selected use-chips filled v-model="clubNamePerson" use-input fill-input input-debounce="0" :options="filterOptions" @filter="filterFna" label="Wybierz Klub">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Brak wyników
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item>
        </q-item>
        <q-item><q-input v-model="otherPersonPhoneNumber" type="tel" class="full-width" mask="### ### ###" filled label="Telefon"></q-input></q-item>
        <q-item><q-input v-model="otherPersonEmail" type="email" class="full-width" filled label="email"></q-input></q-item>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat icon="close" color="primary" v-close-popup/>
        <q-btn flat icon="save" color="primary" v-close-popup @click="updateOtherPerson(othersID,otherPersonFirstName, otherPersonSecondName, otherPersonPhoneNumber,otherPersonEmail)"/>
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
      othersID: null,
      alert: false,
      success: false,
      failure: false,
      message: null,
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
    deactivateOther () {
      fetch('http://' + this.local + '/other/?id=' + this.othersID, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.othersID = null
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
    updateOtherPerson (id, first, second, phone, mail) {
      const data = {
        firstName: first,
        secondName: second,
        phoneNumber: phone,
        email: mail
      }
      fetch('http://' + this.local + '/other/?id=' + id + '&clubName=' + this.clubNamePerson, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.getOther()
          this.success = true
          this.autoClose()
        } else {
          this.failure = true
          this.autoClose()
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

<style scoped>

</style>
