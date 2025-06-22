<template>
  <div class="bg-dark">
    <div class="q-pa-md text-bold text-center text-h6 text-positive">TWORZENIE UŻYTKOWNIKÓW</div>
    <q-card class="row bg-dark">
      <q-card-section :class="backgroundDark ? 'col-6 bg-dark' : 'col-6 bg-grey-3'">
        <q-item>
          <q-input v-model="userFirstName" input-class="text-positive" label-color="positive" class="full-width" dense
            label="Imię"
            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32"
            filled />
        </q-item>
        <q-item>
          <q-input v-model="userSecondName" input-class="text-positive" label-color="positive" class="full-width" dense
            label="Nazwisko"
            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32"
            filled />
        </q-item>
        <q-item>
          <q-select class="full-width" v-model="userSubTypeSelect" dense options-dense filled fill-input
            label-color="positive" color="positive" input-class="text-positive" use-input hide-selected
            popup-content-class="bg-dark text-positive" options-selected-class="bg-dark text-positive"
            :options="userSubType" label="Wybierz Rodzaj">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item>
        <q-item>
          <q-input v-model="userCode" input-class="text-positive" label-color="positive" @paste.prevent @copy.prevent
            class="full-width" dense mask="####" label="Kod PIN" type="password" filled />
        </q-item>
        <q-item>
          <q-input v-model="userCodeConfirm" input-class="text-positive" label-color="positive" @paste.prevent
            @copy.prevent class="full-width" dense mask="####" label="Powtórz kod PIN" type="password" filled />
        </q-item>
        <q-item>
          <q-input v-model="memberUUID" @input="otherID = ''" input-class="text-positive" label-color="positive"
            class="full-width" dense label="Identyfikator Klubowicza" filled />
        </q-item>
        <q-item>
          <q-input v-model="otherID" @input="memberUUID = ''" input-class="text-positive" label-color="positive"
            class="full-width" dense onkeypress="return (event.charCode > 47 && event.charCode < 58)"
            label="Identyfikator Osoby spoza klubu" filled />
        </q-item>
        <q-item>
          <q-btn @click="acceptCodeUser = true" label="Dodaj" color="secondary" />
        </q-item>
      </q-card-section>
      <q-card-section class="col-6 text-positive">
        <div class="col q-pa-md text-bold text-h6">Użytkownicy :</div>
        <ol>
          <li v-for="(user, id) in users" :key="id" class="col text-bold rounded">
            <div @click.ctrl="uuid = user.uuid; setSuperUserDialogConfirm = true" style="cursor: pointer;"
                @dblclick="uuid = user.uuid; inputBarCode = true" class="row full-width flex-center bg-grey-3 q-ma-sm">
              <div class="col full-width text-black">
                {{ user.firstName }} {{ user.secondName }}
              </div>
              <q-btn color="primary" class=" col full-width"
                @click="uuid = user.uuid; getUserActions(uuid); userActions = true">wyświetl działania
              </q-btn>
            </div>
          </li>
        </ol>
      </q-card-section>
    </q-card>
    <q-dialog v-model="inputBarCode">
      <q-card class="text-center bg-dark" style="min-width: 30vw">
        <q-card-section>
          <q-item class="flex-center text-h6 text-bold text-positive">Edytuj</q-item>
          <div>
            <q-item-label class="text-positive text-body1">Przypisz numer karty</q-item-label>
            <q-input v-model="barCode" dense label-color="positive" input-class="text-positive" type="password"
              label="nadaj kartę tutaj" @input="getMasterCardCheck(barCode)" />
            <q-btn color="primary" class="q-ma-md" @click="acceptCodeUser1 = true" label="zatwierdź numer karty"></q-btn>
          </div>
          <q-input v-model="userFirstName1" input-class="text-positive" label-color="positive" dense label="Imię"
            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" />
          <q-input v-model="userSecondName1" input-class="text-positive" label-color="positive" dense label="Nazwisko"
            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" />
          <q-input v-model="memberUUID1" @input="otherID = ''" dense label-color="positive" input-class="text-positive"
            label="przypisz identyfikator Klubowicza" />
          <q-input v-model="otherID1" @input="memberUUID" dense label-color="positive" input-class="text-positive"
            label="przypisz identyfikator Osoby spoza Klubu" />
          <q-input v-model="userCode1" type="password" dense label-color="positive" input-class="text-positive"
            label="nadaj nowy PIN" mask="####" />
          <q-input v-model="userCodeConfirm1" type="password" dense label-color="positive" input-class="text-positive"
            label="powtórz nowy PIN" mask="####" />
          <q-select class="text-positive" input-class="text-positive" label-color="positive"
            popup-content-class="bg-dark text-positive" emit-value map-options options-dense
            v-model="userSubTypeSelect1" dense use-input hide-selected fill-input :options="userSubType"
            label="Wybierz Rodzaj">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-checkbox style="display: none" v-model="master" dense disable />
          <q-checkbox v-if="master === true" style="display: flex; font-size: 10px;" v-model="master" dense disable
            label="potwierdzone przez Admina" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn text-color="white" color="secondary" label="anuluj" v-close-popup
            @click="barCode = null; uuid = null; master = false; memberUUID1 = ''; otherID1 = ''; userFirstName1 = null; userSecondName1 = null; userCode1 = null; userCodeConfirm1 = null" />
          <q-btn text-color="white" color="primary" label="zapisz" v-close-popup @click="acceptCodeUser2 = true;" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCodeUser1" persistent
      @keypress.enter="addNewCardToUser(barCode, uuid, code); code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn id="3" label="Dodaj" color="black" v-close-popup
            @click="addNewCardToUser(barCode, uuid, code); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCodeUser" persistent @keypress.enter="createUser(); acceptCodeUser = false; code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn id="3" label="Dodaj" color="black" v-close-popup
            @click="createUser(); acceptCodeUser = false; code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCodeUser2" persistent @keypress.enter="editUser(); acceptCodeUser2 = false; code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn id="3" label="Dodaj" color="black" v-close-popup @click="editUser(); acceptCodeUser2 = false; code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="setSuperUserDialogConfirm" persistent
      @keypress.enter="setSuperUser(uuid, code); setSuperUserDialogConfirm = false; code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Ustawić jako Super Użytkownika?</span></h3>
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn id="3" label="Dodaj" color="black" v-close-popup
            @click="setSuperUser(uuid, code); setSuperUserDialogConfirm = false; code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="userActions">
      <q-card class="text-center bg-dark text-positive" style="width: 60vw; max-width: 60vw;">
        <q-card-section>
          <div class="text-h6">Akcje użytkownika</div>
          <q-virtual-scroll :items="actions" dense visible class="full-width" style="height: 80vh;">
            <template v-slot="{ item, index }">
              <div class="row">
                <div class="col row hover1">
                  <div class="col-4">{{ index + 1 }} {{ item.classNamePlusMethod }}</div>
                  <div class="col-4">{{ item.belongsTo }}</div>
                  <div class="col-4">{{ item.timeNow }} {{ item.dayNow }}</div>
                </div>
              </div>
            </template>
          </q-virtual-scroll>
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
import App from 'src/App'

export default {
  name: 'Users.vue',
  data () {
    return {
      setSuperUserDialogConfirm: false,
      backgroundDark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      userFirstName: null,
      userFirstName1: null,
      userSecondName: null,
      userSecondName1: null,
      userCode: null,
      userCodeConfirm: null,
      userCode1: null,
      userCodeConfirm1: null,
      userSubTypeSelect: null,
      userSubTypeSelect1: null,
      acceptCodeUser: false,
      acceptCodeUser1: false,
      acceptCodeUser2: false,
      userSubType: ['Pracownik', 'Zarząd', 'Komisja Rewizyjna', 'Gość', 'Pracownik/Zarząd', 'Prezes/Zarząd'],
      users: [],
      memberUUID: '',
      memberUUID1: '',
      otherID: '',
      otherID1: '',
      uuid: '',
      userSubTypeBarCodeSelect: null,
      inputBarCode: false,
      userActions: false,
      actions: [],
      barCode: null,
      master: false,
      accept: false,
      code: null,
      message: null,
      failure: false,
      success: false,
      local: App.host
    }
  },
  created () {
    this.getAllUsers()
  },
  methods: {
    getAllUsers () {
      fetch(`${this.local}/users/userList/`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.users = response
        })
    },
    getUserActions (uuid) {
      fetch(`${this.local}/users/userActions?uuid=${uuid}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.actions = response
        })
    },
    createUser () {
      if (this.userCode !== this.userCodeConfirm) {
        this.message = 'Coś poszło nie tak'
        this.failure = true
      } else {
        fetch(`${this.local}/users/createUser?firstName=${this.userFirstName}&secondName=${this.userSecondName}&subType=${this.userSubTypeSelect}&pinCode=${this.userCode}&superPinCode=${this.code}&memberUUID=${this.memberUUID}&otherID=${this.otherID}`, {
          method: 'POST'
        }).then(response => {
          if (response.status === 201) {
            response.text().then(
              response => {
                this.message = response
                this.success = true
                this.getAllUsers()
              }
            )
          } else {
            response.text().then(
              response => {
                this.message = response
                this.failure = true
              }
            )
          }
          this.autoClose()
        })
      }
    },
    editUser () {
      if (this.userCode1 !== this.userCodeConfirm1) {
        this.message = 'Coś poszło nie tak'
        this.failure = true
      } else {
        fetch(`${this.local}/users/editUser?firstName=${this.userFirstName1}&secondName=${this.userSecondName1}&subType=${this.userSubTypeSelect1}&pinCode=${this.userCode1}&superPinCode=${this.code}&memberUUID=${this.memberUUID1}&otherID=${this.otherID1}&userUUID=${this.uuid}`, {
          method: 'POST'
        }).then(response => {
          if (response.status === 200) {
            response.text().then(
              response => {
                this.message = response
                this.success = true
                this.memberUUID1 = ''
                this.otherID1 = ''
                this.userFirstName1 = null
                this.userSecondName1 = null
                this.userCode1 = null
                this.userCodeConfirm1 = null
                this.getAllUsers()
              }
            )
          } else {
            response.text().then(
              response => {
                this.message = response
                this.failure = true
              }
            )
          }
          this.autoClose()
        })
      }
    },
    setSuperUser (uuid, code) {
      fetch(`${this.local}/users/setSuperUser?uuid=${uuid}&pinCode=${code}`, {
        method: 'PUT'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.getAllUsers()
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
            }
          )
        }
        this.autoClose()
      })
    },
    checkPinCode (code) {
      if (code.length > 3) {
        fetch(`${this.local}/users/checkPinCode?pinCode=${code}`, {
          method: 'GET'
        }).then(response => response.json())
          .then(response => {
            this.accept = response
          })
      }
    },
    addNewCardToUser (barCode, userUUID, pinCode) {
      this.sleep(400).then(() => {
        if (barCode === null || barCode === '') {
          this.message = 'Nie podano numeru karty'
          this.failure = true
        } else {
          fetch(`${this.local}/barCode/?barCode=${barCode}&uuid=${userUUID}&pinCode=${pinCode}`, {
            method: 'POST',
            headers: { 'Content-Type': 'Application/json' }
          }).then(response => {
            if (response.status === 200) {
              response.text().then(
                response => {
                  this.success = true
                  this.message = response
                }
              )
            } else {
              response.text().then(
                response => {
                  this.failure = true
                  this.message = response
                }
              )
            }
          })
          this.autoClose()
        }
      })
    },
    getMasterCardCheck (code) {
      if (code.length > 3) {
        fetch(`${this.local}/barCode/?code=${code}`, {
          method: 'GET'
        }).then(response => response.json())
          .then(response => {
            this.master = response
          })
      }
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    autoClose () {
      setTimeout(() => {
        this.acceptCodeUser1 = false
        this.failure = false
        this.message = null
        this.success = false
        this.barCode = null
        this.code = null
        this.master = false
        this.accept = false
      }, 1500)
    }
  }
}
</script>

<style scoped></style>
