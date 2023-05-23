<template>
  <div>
    <q-card class="col bg-dark text-positive">
      <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold">Lista osób spoza klubu</div>
      <div class="row col">
        <div class="q-pr-md">lp</div>
        <div class="col">Nazwisko i Imię</div>
        <div class="col">Klub</div>
        <div class="col">Telefon</div>
        <div class="col">e-mail</div>
      </div>
      <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
        <div v-for="(others, index) in others" :key="index" class="row text-positive">
          <div class="self-center q-pr-md">{{ index + 1 }}</div>
          <div class="self-center col text-left">{{ others.secondName }} {{ others.firstName }}</div>
          <div class="self-center col text-left">{{ others.club.name }}</div>
          <div class="self-center col-2 text-left">{{ others.phoneNumber }}</div>
          <div class="self-center col-2 text-left">{{ others.email }}</div>
          <q-btn dense class="col-1" color="primary" @click="othersID = others.id; alertDial = true" icon="delete"><q-tooltip
              anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Usuń</q-tooltip></q-btn>
          <q-btn dense class="col-1" color="secondary"
            @click="othersID = others.id; otherPersonFirstName = others.firstName; otherPersonSecondName = others.secondName; otherPersonPhoneNumber = others.phoneNumber; otherPersonEmail = others.email; clubNamePerson = others.club.name; getAllClubsToTournament(); editOtherPerson = true"
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
          <q-input v-model="otherPersonFirstName" class="full-width" label-color="positive" input-class="text-positive"
            filled label="Imię"></q-input>
          <q-input v-model="otherPersonSecondName" class="full-width" label-color="positive" input-class="text-positive"
            filled label="Nazwisko"></q-input>
          <q-item><q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubNamePerson"
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
          <q-input v-model="otherPersonPhoneNumber" type="tel" label-color="positive" input-class="text-positive"
            class="full-width" mask="### ### ###" filled label="Telefon"></q-input>
          <q-input v-model="otherPersonEmail" type="email" label-color="positive" input-class="text-positive"
            class="full-width" filled label="email"></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="zapisz" color="primary" v-close-popup
            @click="updateOtherPerson(othersID, otherPersonFirstName, otherPersonSecondName, otherPersonPhoneNumber, otherPersonEmail)" />
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
      alertDial: false,
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
