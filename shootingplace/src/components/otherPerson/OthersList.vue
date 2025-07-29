<template>
  <div>
    <div class="col bg-dark text-positive" >
      <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold">Lista osób spoza klubu</div>
        <q-input debounce="500" v-model="searchName" class="col q-pb-xs q-pt-xs" @keypress.enter="getSearchName(searchName)"
            @input="getSearchName(searchName)"
            label="wyszukaj osobę spoza Klubu" color="white" bg-color="secondary"
            input-class="text-white" label-color="white" dense rounded standout="">
            <template v-slot:append>
              <q-icon v-if="searchName != ''" name="close" @click="searchName = ''; getSearchName(searchName)"
                class="cursor-pointer text-white" />
              <q-icon name="search" class="text-white" @click="getSearchName(searchName)" />
            </template>
        </q-input>
      <div class="row col bg-primary text-white" style="border-radius: 2em;">
        <div class="text-center" style="width:3%">Lp</div>
        <div class="col" @click="sortF('name')"><q-icon size="1.5em" :name="sortName ? 'arrow_drop_up' : 'arrow_drop_down'" />Nazwisko i imię</div>
        <div class="col-1 text-left" @click="sortF('id')"><q-icon size="1.5em" :name="sortId ? 'arrow_drop_up' : 'arrow_drop_down'" />ID</div>
        <div class="col-2 text-left" @click="sortF('club')"><q-icon size="1.5em" :name="sortClub ? 'arrow_drop_up' : 'arrow_drop_down'" />Klub</div>
        <div class="col-2">Telefon</div>
        <div class="col">e-mail</div>
      </div>
      <q-scroll-area class="full-width q-pa-none" style="height: 60vh;">
        <div v-for="(item, index) in others" :key="index" class="row hover1 items-center" @dblclick="getArbiterClasses();editOtherPerson=true;temp=item; id=item.id">
          <Tooltip2clickTip/>
          <div class="text-center" style="width:3%">{{index + 1 }}</div>
          <!-- <div class="self-center col-4 text-left text-bold">
            {{ item.secondName }} {{ item.firstName }}</div> -->
          <div class="col caption">
              <div class="text-bold">{{ item.secondName }} {{ item.firstName }}</div>
              <div class="text-caption" v-if="item.permissionsEntity!=null">{{ item.permissionsEntity.arbiterNumber }} {{ item.permissionsEntity.arbiterClass }} {{ item.permissionsEntity.arbiterPermissionValidThru }}</div>
          </div>
          <div class="col-1 text-left">{{ item.id }}</div>
          <div class="self-center col-2 text-left">{{ item.club.shortName }}</div>
          <div class="self-center col-2 text-left">{{ item.phoneNumber }}</div>
          <div class="self-center col text-left">{{ item.email }}</div>
        </div>
      </q-scroll-area>
    </div>
    <q-dialog v-model="editOtherPerson">
      <q-card class="bg-dark text-positive row" style="min-width: 50vw;">
        <q-card-section v-if="temp!=null" class="col">
          <div class="col text-caption text-bold">
            <div class="row"><div class="col">Nazwisko i imię:</div><div class="col text-left">{{ temp.fullName }}</div></div>
            <div class="row"><div class="col">Klub:</div><div class="col text-left">{{ temp.club.shortName }}</div></div>
            <div class="row"><div class="col">numer telefonu:</div><div class="col text-left">{{ temp.phoneNumber }}</div></div>
            <div class="row"><div class="col">e-mail:</div><div class="col text-left">{{ temp.email }}</div></div>
            <div v-if="temp.address!=null">
            <div class="row"><div class="col">Miasto:</div><div class="col text-left">{{ temp.address.postOfficeCity }}</div></div>
            <div class="row"><div class="col">Kod-pocztowy:</div><div class="col text-left">{{ temp.address.zipCode }}</div></div>
            <div class="row"><div class="col">Ulica:</div><div class="col text-left">{{ temp.address.street }}</div></div>
            <div class="row"><div class="col">Numer ulicy:</div><div class="col text-left">{{ temp.address.streetNumber }}</div></div>
            <div class="row"><div class="col">Numer mieszkania:</div><div class="col text-left">{{ temp.address.flatNumber }}</div></div>
            </div>
            <div v-if="temp.permissionsEntity!=null">
            <div class="row"><div class="col">Numer uprawnień sędziego:</div><div class="col text-left">{{temp.permissionsEntity.arbiterNumber}}</div></div>
            <div class="row"><div class="col">Klasa:</div><div class="col text-left">{{temp.permissionsEntity.arbiterClass}}</div></div>
            <div class="row"><div class="col">Ważne do:</div><div class="col text-left">{{temp.permissionsEntity.arbiterPermissionValidThru}}</div></div>
          </div>
          </div>
        </q-card-section>
        <q-card-section class="col">
          <q-input v-model="firstName" dense class="full-width" label-color="positive" input-class="text-positive"
            filled label="Imię"/>
          <q-input v-model="secondName" dense class="full-width" label-color="positive" input-class="text-positive"
            filled label="Nazwisko"/>
          <q-item dense>
            <q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubName"
              :val="'BRAK'" label="Brak Klubu"/>
            <q-select v-if="clubName !== 'BRAK'" dense options-dense popup-content-class="bg-dark text-positive"
              options-selected-class="bg-dark text-positive" input-class="text-positive"
              label-color="positive" class="full-width" @new-value="createValue" hide-selected use-chips filled
              v-model="clubName" use-input fill-input input-debounce="0" :options="filterOptions"
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
          <q-input v-model="phoneNumber" dense type="tel" label-color="positive" input-class="text-positive"
            class="col" mask="### ### ###" filled label="Telefon"/>
          <q-input v-model="email" dense type="email" label-color="positive" input-class="text-positive"
            class="full-width" filled label="Email"/>
          <div>
            <q-expansion-item dense dense-toggle label="Adres" style="border: 2px solid grey">
              <q-input filled dense v-model="postOfficeCity" label="Miasto" input-class="text-positive" label-color="positive"/>
              <q-input filled dense v-model="zipCode" label="Kod Pocztowy" mask="##-###" input-class="text-positive" label-color="positive"/>
              <q-input filled dense v-model="street" label="Ulica" input-class="text-positive" label-color="positive"/>
              <q-input filled dense v-model="streetNumber" label="Numer Ulicy" input-class="text-positive" label-color="positive"/>
              <q-input filled dense v-model="flatNumber" label="Mieszkania" input-class="text-positive" label-color="positive"/>
            </q-expansion-item>
            <q-expansion-item dense dense-toggle label="uprawnienia" style="border: 2px solid grey">
              <q-input v-model="weaponPermissionNumber" dense label-color="positive" input-class="text-positive"
            class="full-width" filled label="Numer pozwolenia na Broń"/>
            <q-input dense outlined filled label-color="positive" input-class="text-positive" class="full-width col" v-model=" arbiterNumber "
                    label="Numer Uprawnień Sędziego"/>
            <q-radio v-for="(item,index) in classes" :key="index" :label="item" :val="item" v-model="arbiterClass" :value="item"/>
            <q-input dense class="full-width" input-class="text-positive" label-color="positive" filled v-model="arbitervalidThru" mask="####-12-31"
            label="Ważne do:">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer text-positive">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="arbitervalidThru" mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
            </q-expansion-item>
          </div>
            <q-card-actions align="right">
              <q-btn label="usuń" color="red" v-close-popup @click="alertDial = true"/>
              <q-btn label="zapisz" color="primary" v-close-popup
              @click="updateOtherPerson()" />
              <q-btn label="anuluj" color="secondary" v-close-popup />
            </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" acceptCodeDial ">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="deactivateOther(id,code); code = null; acceptCodeDial = false " autofocus
              type="password" v-model=" code " filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup
            @click="deactivateOther(id,code); code = null " />
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
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
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
          <q-btn label="usuń" color="primary" v-close-popup @click="acceptCodeDial = true" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
export default {
  name: 'OthersList.vue',
  components: {
    Tooltip2clickTip: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickTip.vue'),
      loading: SkeletonBox
    })
  },
  created () {
    this.getOther()
    this.getAllClubsToTournament()
  },
  data () {
    return {
      temp: null,
      tempOthers: null,
      code: null,
      acceptCodeDial: false,
      searchName: '',
      others: [],
      clubNames: [],
      filterOptions: [],
      classes: [],
      id: null,
      sortName: false,
      sortId: false,
      sortClub: false,
      alertDial: false,
      success: false,
      failure: false,
      message: null,
      weaponPermissionNumber: null,
      postOfficeCity: null,
      zipCode: null,
      street: null,
      streetNumber: null,
      flatNumber: null,
      arbiterNumber: null,
      arbiterClass: null,
      arbitervalidThru: null,
      editOtherPerson: false,
      firstName: '',
      secondName: '',
      phoneNumber: '',
      email: '',
      clubName: '',
      local: App.host
    }
  },
  methods: {
    getOther () {
      fetch(`${this.local}/other/all`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.others = response
          this.tempOthers = response
        })
    },
    getAllClubsToTournament () {
      fetch(`${this.local}/club/tournament`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubNames = response
        })
    },
    getArbiterClasses () {
      fetch(`${this.local}/permissions/getArbiterClasses`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.classes = response
        })
    },
    deactivateOther (id, code) {
      fetch(`${this.local}/other/deactivatePerson?id=${id}&pinCode=${code}`, {
        method: 'DELETE'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.id = null
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
      }).catch(() => {
        this.message = 'coś poszło nie tak'
        this.success = true
        this.id = null
        this.getOther()
        this.autoClose()
      }
      )
    },
    updateOtherPerson () {
      const data = {
        firstName: this.firstName,
        secondName: this.secondName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        weaponPermissionNumber: this.weaponPermissionNumber,
        address: {
          zipCode: this.zipCode,
          postOfficeCity: this.postOfficeCity,
          street: this.street,
          streetNumber: this.streetNumber,
          flatNumber: this.flatNumber
        },
        memberPermissions: {
          arbiterNumber: this.arbiterNumber,
          arbiterClass: this.arbiterClass,
          arbiterPermissionValidThru: this.arbitervalidThru
        }
      }
      fetch(`${this.local}/other/?id=${this.id}&clubName=${this.clubName}`, {
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
    sortF (type) {
      if (type === 'name') {
        if (!this.sortName) {
          this.others.sort((a, b) => ('' + b.secondName).localeCompare(a.secondName))
          this.sortName = !this.sortName
        } else {
          this.others.sort((a, b) => ('' + a.secondName).localeCompare(b.secondName))
          this.sortName = !this.sortName
        }
      }
      if (type === 'id') {
        if (!this.sortId) {
          this.others.sort((a, b) => b.id - a.id)
          this.sortId = !this.sortId
        } else {
          this.others.sort((a, b) => a.id - b.id)
          this.sortId = !this.sortId
        }
      }
      if (type === 'club') {
        if (!this.sortClub) {
          this.others.sort((a, b) => (b.club.shortName).localeCompare(a.club.shortName))
          this.sortClub = !this.sortClub
        } else {
          this.others.sort((a, b) => (a.club.shortName).localeCompare(b.club.shortName))
          this.sortClub = !this.sortClub
        }
      }
    },
    getSearchName (val) {
      this.others = this.tempOthers
      if (val === '') {
        this.others = this.tempOthers
      } else {
        const needle = val.toLowerCase()
        this.others = this.others.filter(v => v.fullName.toLowerCase().indexOf(needle) > -1)
      }
    },
    onRejected () {
      this.failure = true
      this.message = 'Nie można dodać pliku, sprawdź jego rozmiar i typ'
      this.autoClose()
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

<style src="../../style/style.scss" lang="scss"></style>
