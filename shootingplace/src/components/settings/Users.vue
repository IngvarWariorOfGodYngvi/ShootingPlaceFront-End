<template>
  <div>
    <div class="q-pa-md text-bold text-center text-h6">TWORZENIE UŻYTKOWNIKÓW</div>
    <q-card class="row">
      <q-card-section class="col-6 bg-grey-2">
        <q-form>
          <q-item>
            <q-input v-model="userFirstName" class="full-width" dense label="Imię"
                     onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32"
                     filled/>
          </q-item>
          <q-item>
            <q-input v-model="userSecondName" class="full-width" dense label="Nazwisko"
                     onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32"
                     filled/>
          </q-item>
          <q-item>
            <q-select class="full-width" filled v-model="userSubTypeSelect" use-input :options="userSubType" dense
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
            <q-input v-model="userCode" @paste.prevent @copy.prevent class="full-width" dense mask="####"
                     label="Kod PIN" type="password" filled/>
          </q-item>
          <q-item>
            <q-input v-model="userCodeConfirm" @paste.prevent @copy.prevent class="full-width" dense mask="####"
                     label="Powtórz kod PIN" type="password" filled/>
          </q-item>
          <q-item>
            <q-input v-model="memberUUID" class="full-width" dense
                     label="Identyfikator Klubowicza" filled/>
          </q-item>
          <q-item>
            <q-btn @click="acceptCodeUser = true" label="Dodaj" color="secondary"/>
          </q-item>
        </q-form>
      </q-card-section>
      <q-card-section class="col-6">
          <div class="col q-pa-md text-bold text-h6">Użytkownicy :</div>
          <ol>
            <li v-for="(user,id) in users" :key="id" class="col text-bold">
              <div class="row full-width flex-center bg-grey-3 q-ma-sm">
                <div class="col full-width" style="cursor: pointer;" @click.ctrl="uuid = user.uuid;setSuperUserDialogConfirm=true"
                     @dblclick="uuid = user.uuid;userSubTypeBarCodeSelect = user.subType;inputBarCode=true">
                  {{ user.firstName }} {{ user.secondName }}
                </div>
                <q-btn color="primary" class=" col full-width"
                       @click="uuid = user.uuid;getUserActions(uuid);userActions=true">wyświetl działania
                </q-btn>
              </div>
            </li>
          </ol>
      </q-card-section>
    </q-card>
    <q-dialog v-model="inputBarCode" persistent>
      <q-card class="text-center">
        <q-card-section>
          <q-item class="flex-center text-h6 text-bold">Przypisywanie Karty</q-item>
          <q-item>
            <q-input class="full-width" filled v-model="barCode" type="password" label="zeskanuj kartę tutaj"
                     @input="getMasterCardCheck(barCode)"></q-input>
          </q-item>
          <q-item>
            <q-select class="full-width" filled v-model="userSubTypeBarCodeSelect" use-input :options="userSubType"
                      dense label="Wybierz Rodzaj">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Brak wyników
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item>
          <q-checkbox style="display: none" v-model="master" dense disable></q-checkbox>
          <q-checkbox v-if="master===true" style="display: flex; font-size: 10px;" v-model="master" dense disable
                      label="potwierdzone przez Admina"></q-checkbox>
          <p></p>
          <q-btn v-close-popup @click="acceptCodeUser1=true">zatwierdź</q-btn>
          <q-btn v-close-popup @click="barCode=null; uuid = null;master=false">Anuluj</q-btn>
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
    <q-dialog v-model="acceptCodeUser" persistent @keypress.enter="createUser();acceptCodeUser=false;code=null">
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
                 @click="createUser ();acceptCodeUser=false;code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="setSuperUserDialogConfirm" persistent @keypress.enter="setSuperUser(uuid, code);setSuperUserDialogConfirm=false;code=null">
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
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Dodaj" color="black" v-close-popup
                 @click="setSuperUser(uuid, code);setSuperUserDialogConfirm=false;code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="userActions">
      <q-card class="text-center">
        <q-card-section>
          <div class="text-h6">Akcje użytkownika</div>
          <q-virtual-scroll :items="actions" dense visible class="full-width" style="height: 80vh;">
            <template v-slot="{ item, index }">
              <div class="row">
                <q-field filled color="black" class="col">{{ index + 1 }} {{ item.classNamePlusMethod }}</q-field>
                <q-field filled color="black" class="col">{{ item.belongsTo }}</q-field>
                <q-field filled color="black" class="col">{{ item.timeNow }} {{ item.dayNow }}</q-field>
              </div>
            </template>
          </q-virtual-scroll>
        </q-card-section>
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
  name: 'Users.vue',
  data () {
    return {
      setSuperUserDialogConfirm: false,
      userFirstName: null,
      userSecondName: null,
      userCode: null,
      userCodeConfirm: null,
      userSubTypeSelect: null,
      acceptCodeUser: false,
      acceptCodeUser1: false,
      userSubType: ['Pracownik', 'Zarząd', 'Komisja Rewizyjna', 'Gość', 'Pracownik/Zarząd', 'Prezes/Zarząd'],
      users: [],
      memberUUID: '',
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
      fetch('http://' + this.local + '/users/userList/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.users = response
        })
    },
    getUserActions (uuid) {
      fetch('http://' + this.local + '/users/userActions?uuid=' + uuid, {
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
        fetch('http://' + this.local + '/users/createUser?firstName=' + this.userFirstName + '&secondName=' + this.userSecondName + '&subType=' + this.userSubTypeSelect + '&pinCode=' + this.userCode + '&superPinCode=' + this.code + '&memberUUID=' + this.memberUUID, {
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
    setSuperUser (uuid, code) {
      fetch('http://' + this.local + '/users/setSuperUser?uuid=' + uuid + '&pinCode=' + code, {
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
        console.log('coś2')
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
