<template>
  <div class="bg-dark">
    <div class="q-pa-md text-bold text-center text-h6 text-positive">TWORZENIE SUPER-UŻYTKOWNIKA</div>
    <q-card class="row bg-dark text-positive">
      <q-card-section class="col-6">
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
            popup-content-class="bg-dark text-positive" :options="userSubType" label="Wybierz Rodzaj">
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
          <q-btn @click="acceptCodeUser = true" label="Dodaj" type="submit" color="secondary" />
        </q-item>
      </q-card-section>
      <q-card-section class="col-6 text-positive">
        <div class="q-pa-md">
          <div class="col q-pa-md text-bold text-h6">Super-Użytkownik :</div>
          <ol>
            <li v-for="(superUser, id) in superUsers" :key="id" class="col text-bold rounded">
              <div @dblclick="uuid = superUser.uuid;inputBarCode = true" style="cursor: pointer" class="row full-width flex-center bg-grey-3 q-ma-sm">
                <div class="col full-width text-black">{{ superUser.firstName }}
                  {{ superUser.secondName }}
                </div>
                <q-btn color="primary" class="col full-width"
                  @click="uuid = superUser.uuid; getUserActions(superUser.uuid); userActions = true">wyświetl działania
                </q-btn>
              </div>
            </li>
          </ol>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="acceptCodeUser" persistent @keypress.enter="createSuperUser(); acceptCodeUser = false; code = null">
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
            @click="createSuperUser(); acceptCodeUser = false; code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="inputBarCode">
      <q-card class="text-center bg-dark">
        <q-card-section class="text-positive">
          <q-item class="flex-center text-h6 text-bold">Przypisywanie Karty</q-item>
          <q-item>
            <q-input @keypress.enter="acceptCodeUser1 = true" color="positive" label-color="positive" input-class="text-positive text-h6" class="full-width"
              filled v-model="barCode" type="password" label="zeskanuj kartę tutaj"></q-input>
          </q-item>
          <q-btn text-color="white" color="secondary" v-close-popup
            @click="barCode = null; uuid = null;">Anuluj</q-btn>
          <q-btn text-color="white" color="primary" v-close-popup @click="acceptCodeUser1 = true">zatwierdź</q-btn>
          <!-- <q-item>
              <q-select
                class="full-width text-positive q-pb-md"
                color="positive"
                input-class="text-white" label-color="positive" popup-content-class="bg-dark text-positive"
                emit-value
                map-options
                options-dense
                v-model="userSubTypeBarCodeSelect"
                filled dense use-input hide-selected fill-input
                :options="userSubType"
                label="Wybierz Rodzaj">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Brak wyników
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item> -->
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
          <q-checkbox style="display: none" v-model="master" dense disable></q-checkbox>
          <q-checkbox v-if="master === true" style="display: flex; font-size: 10px;" v-model="master" dense disable
            label="potwierdzone przez Admina"></q-checkbox>
          <p></p>
        <q-card-actions align="right">
          <q-btn text-color="white" color="secondary" label="anuluj" v-close-popup
            @click="barCode = null; uuid = null; master = false; memberUUID1 = ''; otherID1 = ''; userFirstName1 = null; userSecondName1 = null; userCode1 = null; userCodeConfirm1 = null" />
          <q-btn text-color="white" color="primary" label="zapisz" v-close-popup @click="acceptCodeUser2 = true;" />
        </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="userActions" @hide="actions = null">
      <q-card class="text-center bg-dark text-positive" style="width: 60vw; max-width: 60vw">
        <CircularLoadingBox v-if="actions == null" />
        <q-card-section v-else>
          <div class="text-h6">Akcje użytkownika</div>
          <q-virtual-scroll v-if="actions != null" :items="actions" dense visible class="full-width"
            style="height: 80vh;">
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
    <q-dialog v-model="acceptCodeUser1" persistent
      @keypress.enter="addNewCardToUser(barCode, uuid, code); code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="addNewCardToUser(barCode, uuid, code)" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
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
    <q-dialog position="top" v-model="success" @keypress.enter="success = false">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="failure" position="standard" @keypress.enter="failure = false">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

export default {
  name: 'SuperUser.vue',
  components: {
    CircularLoadingBox: lazyLoadComponent({
      componentFactory: () => import('src/utils/CircularLoadingBox.vue'),
      loading: SkeletonBox
    })
  },
  created () {
    this.getAllSuperUsers()
  },
  data () {
    return {
      uuid: '',
      actions: null,
      barCode: null,
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
      master: false,
      userActions: false,
      inputBarCode: false,
      memberUUID: '',
      otherID: '',
      userSubType: ['Pracownik', 'Zarząd', 'Komisja Rewizyjna', 'Gość', 'Pracownik/Zarząd', 'Prezes/Zarząd'],
      userSubTypeBarCodeSelect: null,
      superUsers: [],
      accept: false,
      code: null,
      message: null,
      failure: false,
      success: false,
      local: App.host
    }
  },
  methods: {
    getAllSuperUsers () {
      fetch(`${this.local}/users/superUserList/`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.superUsers = response
        })
    },
    createSuperUser () {
      if (this.userCode !== this.userCodeConfirm && this.superUsers.length > 0) {
        this.message = 'Coś poszło nie tak'
        this.failure = true
      } else {
        fetch(`${this.local}/users/createSuperUser?firstName=${this.userFirstName}&secondName=${this.userSecondName}&subType=${this.userSubTypeSelect}&pinCode=${this.userCode}&superPinCode=${this.code}&memberUUID=${this.memberUUID}&otherID=${this.otherID}`, {
          method: 'POST'
        }).then(response => {
          if (response.status === 201) {
            response.text().then(
              response => {
                this.message = response
                this.success = true
                this.$emit('createSuperUser')
                this.getAllSuperUsers()
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
    getUserActions (uuid) {
      fetch(`${this.local}/users/userActions?uuid=${uuid}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.actions = response
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
