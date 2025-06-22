<template>
  <q-page>
    <q-card class="bg-dark">
      <q-card-section>
        <div class="row">
          <q-checkbox v-model="nonMember" class="text-positive self-center col" @input="pesel='', member=null, phone='', otherPerson=null, getAllClubsToTournament()">Nie Jestem Klubowiczem</q-checkbox>
          <ShootingPlaceStatutePanaszew v-if="shootingPlace === 'rcs'" class="q-pa-md"></ShootingPlaceStatutePanaszew>
          <ShootingPlaceStatuteDziesiątka v-if="shootingPlace === 'prod'" class="q-pa-md"></ShootingPlaceStatuteDziesiątka>
          <RCSPanaszewRODO v-if="shootingPlace === 'rcs'" class="q-pa-md"></RCSPanaszewRODO>
        </div>
        <div v-if="!nonMember" class="row q-mb-xs">
          <q-input v-model="pesel" class="col" dense input-class="text-positive" label="Wpisz numer PESEL" label-color="positive" filled type="text" inputmode="numeric" @input="pesel.length>10?getMemberByPesel(pesel): member=null" mask="###########" onkeypress="return (event.charCode > 47 && event.charCode < 58)"></q-input>
          <q-btn color="primary" label="resetuj" @click="reset()"></q-btn>
        </div>
        <div v-if="nonMember" class="row q-mb-xs">
          <q-input v-model="phone" class="col" @input="phone.length > 10? getOtherbyPhone(phone) : otherPerson = null" dense filled input-class="text-positive" label="Jeśli zostawiłeś nam numer telefonu to wpisz go tutaj" type="tel" label-color="positive" mask="### ### ###" onkeypress="return (event.charCode > 47 && event.charCode < 58)"></q-input>
          <q-btn color="primary" label="resetuj" @click="reset()"></q-btn>
        </div>
        <div v-if="member!=null && !nonMember" class="row round" :class="member.active?'bg-green':'bg-red'">
          <div style="min-height: 10vh;" @click="visible=false" class="col-3" v-if="member.image!=null">
            <q-img contain fit=none style="max-height: 40vh; border-radius: 5px" class="text-body1" alt="zdjęcie profilowe"
          :src="(`${local}/files/getFile?uuid=${member.image}`)" />
          </div>
          <div class="col" :class="member.active?'col':'col-6'">
            <div dense class="q-mt-xs q-pl-md" >Imię i Nazwisko: {{ member.firstName }} {{ member.secondName }}</div>
            <div dense class="q-mt-xs q-pl-md" >Numer Legitymacji: {{ member.legitimationNumber }}</div>
            <div dense class="q-mt-xs q-pl-md" :class="member.active?'':'text-bold text-h6'">Składka ważna do: {{ convertDate(member.history.contributionList[0].validThru) }}</div>
            <div dense class="q-mt-xs q-pl-md" v-if="member.shootingPatent.patentNumber!=null">Patent numer: {{ member.shootingPatent.patentNumber }} {{ member.shootingPatent.pistolPermission? 'P' : '' }}{{ member.shootingPatent.riflePermission? 'K' : '' }}{{ member.shootingPatent.shotgunPermission? 'S' : '' }}</div>
            <div dense class="q-mt-xs q-pl-md" v-if="member.license.number!=null" :class="member.license.valid?'':'bg-red round'">Licencja numer: {{ member.license.number }} Ważna do: {{ convertDate(member.license.validThru) }}</div>
            <div dense class="q-mt-xs q-pl-md" v-if="member.weaponPermission.number!=null">Licencja numer: {{ member.weaponPermission.number }}</div>
            <div dense class="q-mt-xs q-pl-md" >Ilość startów: Pistolet: {{ member.history.pistolCounter }} Karabin: {{ member.history.rifleCounter }} Strzelba: {{ member.history.shotgunCounter }}</div>
          </div>
          <div v-if="member!=null" class="self-center" :class="member.active?'':'col-3'">
            <div v-if="!member.active" class="text-bold text-h6" style="display: flex; justify-content: center;">Ureguluj Swoje Składki Członkowskie !</div>
          </div>
        </div>
        <div v-if="otherPerson!=null">
          <div class="text-positive">
            <div dense class="q-mt-xs q-pl-md" >Imię i Nazwisko: {{ otherPerson.firstName }} {{ otherPerson.secondName }}</div>
            <div dense class="q-mt-xs q-pl-md" >Klub: {{ otherPerson.club.name }}</div>
            <div dense class="q-mt-xs q-pl-md" v-if="otherPerson.address.zipCode!=null">Address: {{ otherPerson.address.postOfficeCity }} {{ otherPerson.address.zipCode }} {{ otherPerson.address.street }} {{ otherPerson.address.streetNumber }} {{ otherPerson.address.flatNumber }}</div>
            <div dense class="q-mt-xs q-pl-md" v-if="otherPerson.weaponPermissionNumber!=null">Pozwolenie na broń: {{ otherPerson.weaponPermissionNumber }}</div>
          </div>
        </div>
        <div v-if="member==null && otherPerson==null && nonMember" class="col">
          <q-input v-model="nonMemberFirstName" filled label="imię *" dense input-class="text-positive" label-color="positive"/>
          <q-input v-model="nonMemberSecondName" filled label="Nazwisko *" dense input-class="text-positive" label-color="positive"/>
          <q-checkbox v-model="rememberMe" @input="nonMemberClubName=null;nonMemberPhoneNumber=null" class="text-positive full-width">Zapamiętaj Mnie - twoje dane będą przechowywane w celach rejestracji pobytu na strzelnicy i startu w zawodach klubowych</q-checkbox>
          <q-checkbox v-model="rodo" class="text-positive full-width">zgoda na przetwarzanie danych osobowych</q-checkbox>
          <div v-if="rememberMe" class="row">
          <div class="col">
            <q-select v-model="nonMemberClubName" style="border: 1px solid green" filled label="Wybierz Klub" @popup-hide="getAllClubsToTournament()" dense options-dense popup-content-class="bg-dark text-positive" class="col" input-class="text-positive" label-color="positive" @new-value="createValue" hide-selected use-chips
            use-input fill-input input-debounce="0" :options="filterOptions"
            @filter="filterFna">
          <template v-slot:no-option>
            <q-item dense>
              <q-item-section class="text-grey">
                Brak wyników
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input v-model="nonMemberPhoneNumber" label="Numer Telefonu" filled style="border: 1px solid green" dense input-class="text-positive" mask="### ### ###" label-color="positive"/>
      </div>
      <div class="col self-center text-positive text-h6 text-bold" style="display: flex; justify-content: center;">Jeśli twojego klubu nie ma na wykazie poinformuj o tym obsługę</div>
    </div>
          <div class="row">
            <q-radio v-model="address" @input="permission = false" val="true" color="primary" class="text-positive self-center">Adres zamieszkania</q-radio>
            <q-radio v-model="permission" @input="address = false" val="true" color="primary" class="text-positive self-center">Numer Pozwolenia na Broń</q-radio>
          </div>
          <div v-if="address">
            <q-input filled v-model="nonMemberPostOfficeCity" label="Miasto *" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="nonMemberZipCode" label="Kod Pocztowy *" mask="##-###" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="nonMemberStreet" label="Ulica *" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="nonMemberStreetNumber" @input="nonMemberStreetNumber.length===0?nonMemberStreetNumber=null:''" label="Numer Ulicy *" dense input-class="text-positive" label-color="positive"/>
            <q-input filled v-model="nonMemberFlatNumber" @input="nonMemberFlatNumber.length===0?nonMemberFlatNumber=null:''" label="Numer Mieszkania" dense input-class="text-positive" label-color="positive"/>
          </div>
          <div v-if="permission">
            <q-input filled v-model="nonMemberWeaponPermissionNumber" @input="nonMemberWeaponPermissionNumber.length===0?nonMemberWeaponPermissionNumber=null:''" label="Numer pozwolenia na Broń" dense input-class="text-positive" label-color="positive"/>
          </div>
        </div>
      </q-card-section>
      <div v-if="member != null || phone.length > 10 || (nonMemberFirstName!=null&&nonMemberSecondName!=null&&nonMemberZipCode!=null&&nonMemberPostOfficeCity!=null&&nonMemberStreet!=null&&nonMemberStreetNumber!=null)|| (nonMemberWeaponPermissionNumber!=null&&nonMemberWeaponPermissionNumber.length>8)">
      <div class="text-positive full-width text-h6 text-center ">Podpisz poniżej</div>
      <q-card-section>
        <div style="padding-left: 12.5vw; padding-right: 12.5vw;">
          <VueSignaturePad id="canvas" ref="signaturePad" style="height: 25vh;background-color: white;"></VueSignaturePad>
        </div>
        <q-checkbox v-model="statementOnReadingTheShootingPlaceRegulations" class="text-positive col">Zapoznałem się z regulaminem strzelnicy</q-checkbox>
      </q-card-section>
      <div>
        <div class="row">
        <q-card-actions align="left" class="text-positive col">
          <label>
              Chcesz mieć program u siebie? Napisz do mnie: i.zebrowski.ul@gmail.com
          </label>
        </q-card-actions>
          <q-card-actions align="right col">
            <q-btn @click="clear()" label="wyczyść" color="secondary"></q-btn>
            <q-btn v-if="statementOnReadingTheShootingPlaceRegulations && (shootingPlace==='rcs' && rodo) && (member!=null || otherPerson!=null || (nonMemberFirstName!=null&&nonMemberSecondName))" @click="nonMember?saveNonMember():save()" label="zapisz" color="primary"></q-btn>
            <q-btn v-else label="zapisz" color="grey"><q-tooltip v-if="!statementOnReadingTheShootingPlaceRegulations" content-class="text-h6 bg-primary" :offset="[10,50]" anchor="top middle">Zaakceptuj zapoznanie się z regulaminem na strzelnicy</q-tooltip></q-btn>
          </q-card-actions>
        </div>

      </div>
    </div>
    </q-card>
    <q-dialog position="standard" v-model=" failure ">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if=" message != null " class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model=" success ">
      <q-card>
        <q-card-section>
          <div v-if=" message != null " class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss"></style>
<script>

import Vue from 'vue'
import App from 'src/App'
import VueSignature from 'vue-signature-pad'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
Vue.use(VueSignature)
export default {
  components: {
    ShootingPlaceStatutePanaszew: lazyLoadComponent({
      componentFactory: () => import('components/statutes/ShootingPlaceStatutePanaszew'),
      loading: SkeletonBox
    }),
    ShootingPlaceStatuteDziesiątka: lazyLoadComponent({
      componentFactory: () => import('components/statutes/ShootingPlaceStatuteDziesiątka'),
      loading: SkeletonBox
    }),
    RCSPanaszewRODO: lazyLoadComponent({
      componentFactory: () => import('components/RODO/RCSPanaszewRODO'),
      loading: SkeletonBox
    })

  },
  data () {
    return {
      member: null,
      otherPerson: null,
      pesel: '',
      phone: '',
      nonMemberFirstName: null,
      nonMemberSecondName: null,
      nonMemberPhoneNumber: null,
      nonMemberZipCode: null,
      nonMemberPostOfficeCity: null,
      nonMemberStreet: null,
      nonMemberStreetNumber: null,
      nonMemberFlatNumber: null,
      nonMemberWeaponPermissionNumber: null,
      nonMemberClubName: null,
      filterOptions: [],
      clubs: [],
      statementOnReadingTheShootingPlaceRegulations: false,
      rememberMe: false,
      rodo: false,
      nonMember: false,
      address: false,
      permission: false,
      success: false,
      failure: false,
      message: null,
      shootingPlace: App.shootingPlace,
      local: App.host
    }
  },
  created () {
    window.localStorage.setItem('SiteName', 'Rejestr Pobytu na Strzelnicy')
    window.localStorage.setItem('drawer', 'false')
  },
  methods: {
    getMemberByPesel (PESEL) {
      fetch(`${this.local}/member/PESEL/${PESEL}`, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(response => {
            this.rodo = true
            this.member = response
          })
        } else {
          response.text().then(response => {
            this.member = null
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    reset () {
      this.member = null
      this.otherPerson = null
      this.pesel = ''
      this.phone = ''
      this.nonMemberZipCode = null
      this.nonMemberPostOfficeCity = null
      this.nonMemberStreet = null
      this.nonMemberStreetNumber = null
      this.nonMemberFlatNumber = null
      this.nonMemberWeaponPermissionNumber = null
      this.nonMemberFirstName = null
      this.nonMemberSecondName = null
      this.nonMemberPhoneNumber = null
      this.statementOnReadingTheShootingPlaceRegulations = false
      this.nonMember = false
      this.rememberMe = false
      this.address = false
      this.rodo = false
      this.permission = false
    },
    getOtherbyPhone (phone) {
      fetch(`${this.local}/other/getOhterByPhone/${phone}`, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(response => {
            this.rodo = true
            this.otherPerson = response
          })
        } else {
          response.text().then(response => {
            this.otherPerson = null
            this.message = response
            this.failure = true
            this.autoClose()
          })
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
    convertDate (date) {
      const current = new Date(date)
      let month = current.getMonth() + 1
      let day = current.getDate()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + (month)
      }
      return day + '-' + (month) + '-' + current.getFullYear()
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
    save () {
      const { data } = this.$refs.signaturePad.saveSignature()
      const { isEmpty } = this.$refs.signaturePad.saveSignature()
      const dat = {
        imageString: data
      }
      if (!isEmpty) {
        fetch(`${this.local}/evidence/?pesel=${this.pesel}`, {
          method: 'POST',
          body: JSON.stringify(dat)
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              this.reset()
              this.clear()
              this.message = response
              this.success = true
            })
          } else {
            response.text().then(response => {
              this.message = response
              this.success = true
            })
          }
        })
      } else {
        this.message = 'Podpisz się'
        this.failure = true
      }
      this.autoClose()
    },
    saveNonMember () {
      const other = {
        firstName: this.nonMemberFirstName,
        secondName: this.nonMemberSecondName,
        phoneNumber: this.nonMemberPhoneNumber,
        weaponPermissionNumber: this.nonMemberWeaponPermissionNumber,
        address: {
          zipCode: this.nonMemberZipCode,
          postOfficeCity: this.nonMemberPostOfficeCity,
          street: this.nonMemberStreet,
          streetNumber: this.nonMemberStreetNumber,
          flatNumber: this.nonMemberFlatNumbenr
        },
        club: {
          name: this.nonMemberClubName
        }
      }
      const { data } = this.$refs.signaturePad.saveSignature()
      const { isEmpty } = this.$refs.signaturePad.saveSignature()
      const dat = {
        imageString: data,
        other: other
      }
      if (!isEmpty) {
        fetch(`${this.local}/evidence/other?phone=${this.phone}&club=${this.nonMemberClubName}&rememberMe=${this.rememberMe}`, {
          method: 'POST',
          body: JSON.stringify(dat),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              this.reset()
              this.clear()
              this.message = response
              this.success = true
            })
          } else {
            response.text().then(response => {
              this.message = response
              this.failure = true
            })
          }
        })
      } else {
        this.message = 'Podpisz się'
        this.failure = true
      }
      this.autoClose()
    },
    clear () {
      this.$refs.signaturePad.clearSignature()
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
