<template>
  <div class="bg-dark">
    <div class="q-pa-md text-bold text-center text-h6 text-positive">TWORZENIE SUPER-UŻYTKOWNIKA</div>
    <q-card class="row bg-dark">
      <q-card-section :class="backgroundDark?'col-6 bg-dark':'col-6 bg-grey-3'">
        <q-form>
          <q-item>
            <q-input v-model="userFirstName" input-class="text-positive" label-color="positive" class="full-width" dense label="Imię"
                     onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32"
                     filled/>
          </q-item>
          <q-item>
            <q-input v-model="userSecondName" input-class="text-positive" label-color="positive" class="full-width" dense label="Nazwisko"
                     onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32"
                     filled/>
          </q-item>
          <q-item>
            <q-select class="full-width" v-model="userSubTypeSelect" dense options-dense :dark="darkSet()" filled fill-input
              label-color="positive" color="positive" input-class="text-positive"
              popup-content-class="bg-dark text-positive" options-selected-class="bg-dark text-positive"
              :options-dark="darkSet()" :options="userSubType"
                      label="Wybierz Rodzaj">
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
            <q-input v-model="userCode" input-class="text-positive" label-color="positive" @paste.prevent @copy.prevent class="full-width" dense mask="####"
                     label="Kod PIN" type="password" filled/>
          </q-item>
          <q-item>
            <q-input v-model="userCodeConfirm" input-class="text-positive" label-color="positive" @paste.prevent @copy.prevent class="full-width" dense mask="####"
                     label="Powtórz kod PIN" type="password" filled/>
          </q-item>
          <q-item>
            <q-input v-model="memberUUID" @input="otherID = ''" input-class="text-positive" label-color="positive" class="full-width" dense
                     label="Identyfikator Klubowicza" filled/>
          </q-item>
          <q-item>
            <q-input v-model="otherID" @input="memberUUID = ''" input-class="text-positive" label-color="positive" class="full-width" dense onkeypress="return (event.charCode > 47 && event.charCode < 58)"
                     label="Identyfikator Osoby spoza klubu" filled/>
          </q-item>
          <q-item>
            <q-btn @click="acceptCodeUser = true" label="Dodaj" type="submit" color="secondary"/>
          </q-item>
        </q-form>
      </q-card-section>
      <q-card-section class="col-6 text-positive">
        <div class="q-pa-md">
          <div class="col q-pa-md text-bold text-h6">Super-Użytkownik :</div>
          <ol>
            <li v-for="(superUser,id) in superUsers" :key="id" class="col text-bold">
              <div class="row full-width flex-center bg-grey-3 q-ma-sm">
                <div class="col full-width text-black" style="cursor: pointer;"
                     @dblclick="inputBarCode=true,userSubTypeBarCodeSelect = user.subType;">{{ superUser.firstName }}
                  {{ superUser.secondName }}
                </div>
                <q-btn color="primary" class="col full-width"
                       @click="uuid = superUser.uuid;getUserActions(superUser.uuid);userActions=true">wyświetl działania
                </q-btn>
              </div>
            </li>
          </ol>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="acceptCodeUser" persistent @keypress.enter="createSuperUser();acceptCodeUser=false;code=null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
                     mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Dodaj" color="black" v-close-popup
                 @click="createSuperUser ();acceptCodeUser=false;code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="inputBarCode">
      <q-card class="text-center bg-dark">
        <q-card-section class="text-positive">
          <q-item class="flex-center text-h6 text-bold">Przypisywanie Karty</q-item>
          <q-item>
            <q-input color="positive" label-color="positive" input-class="text-positive text-h6" class="full-width" filled v-model="barCode" type="password" label="zeskanuj kartę tutaj"
                     @input="getMasterCardCheck(barCode)"></q-input>
          </q-item>
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
          <q-checkbox style="display: none" v-model="master" dense disable></q-checkbox>
          <q-checkbox v-if="master===true" style="display: flex; font-size: 10px;" v-model="master" dense disable
                      label="potwierdzone przez Admina"></q-checkbox>
          <p></p>
          <q-btn text-color="white" color="secondary" v-close-popup @click="barCode=null; uuid = null;master=false">Anuluj</q-btn>
          <q-btn text-color="white" color="primary" v-close-popup @click="acceptCodeUser1=true">zatwierdź</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="userActions">
      <q-card class="text-center bg-dark text-positive" style="width: 60vw; max-width: 60vw">
        <q-card-section>
          <div class="text-h6">Akcje użytkownika</div>
          <q-virtual-scroll :items="actions" dense visible class="full-width" style="height: 80vh;">
            <template v-slot="{ item, index }">
              <div class="row">
                <q-field filled color="positive" class="col">
                  <div class="col-4">{{ index + 1 }} {{ item.classNamePlusMethod }}</div>
                  <div class="col-4">{{ item.belongsTo }}</div>
                  <div class="col-4">{{ item.timeNow }} {{ item.dayNow }}</div>
                </q-field>
              </div>
            </template>
          </q-virtual-scroll>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCodeUser1" persistent
              @keypress.enter="checkPinCode (code);addNewCardToUser(barCode,uuid,userSubTypeBarCodeSelect,code);code=null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający1</span></h3>
          <div>
            <q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
                     mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Dodaj" color="black" v-close-popup
                 @click="checkPinCode (code);addNewCardToUser(barCode,uuid,userSubTypeBarCodeSelect,code);code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="success" @keypress.enter="success=false">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="failure" :position="'top'" @keypress.enter="failure=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'

export default {
  name: 'SuperUser.vue',
  created () {
    this.getAllSuperUsers()
  },
  data () {
    return {
      uuid: '',
      actions: [],
      barCode: null,
      backgroundDark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      acceptCodeUser: false,
      acceptCodeUser1: false,
      master: false,
      userActions: false,
      inputBarCode: false,
      userFirstName: null,
      userSubTypeSelect: null,
      userSecondName: null,
      memberUUID: '',
      otherID: '',
      userCode: null,
      userCodeConfirm: null,
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
      fetch('http://' + this.local + '/users/superUserList/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.superUsers = response
        })
    },
    darkSet () {
      return JSON.parse(window.localStorage.getItem('BackgroundDark'))
    },
    createSuperUser () {
      if (this.userCode !== this.userCodeConfirm && this.superUsers.length > 0) {
        this.message = 'Coś poszło nie tak'
        this.failure = true
      } else {
        fetch(`http://${this.local}/users/createSuperUser?firstName=${this.userFirstName}&secondName=${this.userSecondName}&subType=${this.userSubTypeSelect}&pinCode=${this.userCode}&superPinCode=${this.code}&memberUUID=${this.memberUUID}&otherID=${this.otherID}`, {
          method: 'POST'
        }).then(response => {
          if (response.status === 201) {
            response.text().then(
              response => {
                this.message = response
                this.success = true
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
    getUserActions (uuid) {
      fetch('http://' + this.local + '/users/userActions?uuid=' + uuid, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.actions = response
        })
    },
    getMasterCardCheck (code) {
      if (code.length > 3) {
        fetch('http://' + this.local + '/barCode/?code=' + code, {
          method: 'GET'
        }).then(response => response.json())
          .then(response => {
            this.master = response
          })
      }
    },
    checkPinCode (code) {
      if (code.length > 3) {
        fetch('http://' + this.local + '/users/checkPinCode?pinCode=' + code, {
          method: 'GET'
        }).then(response => response.json())
          .then(response => {
            this.accept = response
          })
      }
    },
    addNewCardToUser (barCode, uuid, userSubType) {
      this.sleep(400).then(() => {
        if (barCode === null || barCode === '') {
          this.message = 'Nie podano numeru karty'
          this.failure = true
          return
        }
        const data = {
          barCode: barCode,
          isActive: true,
          belongsTo: uuid,
          subType: userSubType,
          isMaster: this.master
        }
        console.log(this.accept)
        if (this.accept) {
          fetch('http://' + this.local + '/barCode/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'Application/json' }
          }).then(response => {
            if (response.status === 200) {
              response.text().then(
                response => {
                  this.success = true
                  this.message = response
                }
              )
            }
            if (response.status === 400) {
              response.text().then(
                response => {
                  this.failure = true
                  this.message = response
                }
              )
            }
          })
        } else {
          this.failure = true
          this.message = 'Podano zły pin. Spróbuj ponownie'
        }
        this.autoClose()
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

<style scoped>

</style>
