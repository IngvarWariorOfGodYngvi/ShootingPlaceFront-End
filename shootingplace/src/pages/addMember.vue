<template>
  <q-page padding>
    <div>
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Podstawowe dane"
        caption="Wymagane"
        icon="settings"
        :done="step > 1"
      >
      <q-card class="row">
      <q-card-section>
      <div>
        <q-form>
      <q-item><q-input color="red" v-model="memberFirstName" label="*Imię" filled  lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']" /></q-item>
      <q-item><q-input color="red" v-model="memberSecondName" label="*Nazwisko" filled  lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-input color="red" v-model="memberIDCard" label="*Numer Dowodu" filled hint="XXX000000" placeholder="XXX000000" lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-input color="red" v-model="memberPesel" placeholder="tylko cyfry" label="*Pesel" filled  lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']" /></q-item>
      <q-item><q-input color="red" v-model="memberPhone" placeholder="tylko cyfry" label="*Numer telefonu" filled  lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-input color="green" v-model="memberEmail" label="email" /></q-item>
      <q-item><q-input color="green" v-model="memberLegitimation" label="Numer Legitymacji" /></q-item>
      <q-item><q-input color="green" hint="YYYY-MM-DD" placeholder="YYYY-MM-DD" v-model="memberJoinDate" label="Data dołączenia do klubu" /></q-item>
      <q-item><q-radio v-model="memberAdult" :val="true" label="Grupa Dorosła" color="secondary" /></q-item>
      <q-item><q-radio v-model="memberAdult" :val="false" label="Grupa Młodzieżowa" color="secondary" /></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),addMember(memberLegitimation, memberFirstName,
      memberSecondName,
      memberIDCard,
      memberPesel,
      memberPhone,
      memberEmail,
      memberAdult)"/></q-item>
      </q-form>
      </div>
      </q-card-section>
      <q-card-section>
      <div>
      <q-item><q-item-label>Imię : {{memberFirstName}}</q-item-label></q-item>
      <q-item><q-item-label>Nazwisko : {{memberSecondName}}</q-item-label></q-item>
      <q-item><q-item-label>Numer Dowodu Osobistego : {{memberIDCard}}</q-item-label></q-item>
      <q-item><q-item-label>Numer PESEL : {{memberPesel}}</q-item-label></q-item>
      <q-item><q-item-label>Numer Telefonu :{{memberPhone}}</q-item-label></q-item>
      <q-item><q-item-label>Adres E-mail : {{memberEmail}}</q-item-label></q-item>
      <q-item><q-item-label>Numer Legitymacji Klubowej : {{memberLegitimation}}</q-item-label></q-item>
      <q-item><q-item-label>Data dołączenia do Klubu : {{memberJoinDate}}</q-item-label></q-item>
      <q-item v-if="memberAdult&&memberIDCard!=null"><q-item-label >Grupa Dorosła</q-item-label></q-item>
      <q-item v-if="!memberAdult&&memberIDCard!=null"><q-item-label>Grupa Młodzieżowa</q-item-label></q-item>
      </div>
      </q-card-section>
      </q-card>
      </q-step>

      <q-step
        :name="2"
        title="Dane Adresowe"
        caption="Opcjonalnie"
        icon="create_new_folder"
        :done="step > 2"
      >
      <q-card class="row">
      <q-card-section>
      <div>
      <q-item><q-input v-model="memberPostOfficeCity" label="Miasto" /></q-item>
      <q-item><q-input v-model="memberZipCode" placeholder="00-000" label="Kod Pocztowy" /></q-item>
      <q-item><q-input v-model="memberStreet" label="Ulica" /></q-item>
      <q-item><q-input v-model="memberStreetNumber" label="Numer Ulicy" /></q-item>
      <q-item><q-input v-model="memberFlatNumber" label="Numer Mieszkania"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),updateAddress(uuid, memberPostOfficeCity, memberZipCode, memberStreet, memberStreetNumber, memberFlatNumber)"/></q-item>
      </div>
      </q-card-section>
      <q-card-section>
      <div>
      <q-item><q-item-label>Miasto : {{memberPostOfficeCity}}</q-item-label></q-item>
      <q-item><q-item-label>Kod Pocztowy : {{memberZipCode}}</q-item-label></q-item>
      <q-item><q-item-label>Ulica : {{memberStreet}}</q-item-label></q-item>
      <q-item><q-item-label>Numer Ulicy : {{memberStreetNumber}}</q-item-label></q-item>
      <q-item><q-item-label>Numer Mieszkania : {{memberFlatNumber}}</q-item-label></q-item>
      </div>
      </q-card-section>
      </q-card>
      </q-step>

      <q-step
        :name="3"
        title="Patent"
        caption="opcjonalnie"
        icon="assignment"
        :done="step > 3"
      >
      <q-card class="row" v-if="memberAdult">
      <q-card-section>
      <div>
      <q-item><q-input v-model="patentNumber" hint="tylko cyfry" placeholder="tylko cyfry" label="Numer Patentu" filled  lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-input v-model="patentDate" hint="YYYY-MM-DD" placeholder="YYYY-MM-DD" label="Data nadania" filled  lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-checkbox v-model="patentPistolPermission" label="Pistolet"/></q-item>
      <q-item><q-checkbox v-model="patentRiflePermission" label="Karabin"/></q-item>
      <q-item><q-checkbox v-model="patentShotgunPermission" label="Strzelba"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),addPatent(uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission)"/></q-item>
      </div>
      </q-card-section>
      <q-card-section>
      <div>
      <q-item><q-item-label>Numer Patentu : {{patentNumber}}</q-item-label></q-item>
      <q-item><q-item-label>Data Nadania : {{patentDate}}</q-item-label></q-item>
      <q-item><q-item-label>Dyscypliny :</q-item-label></q-item>
      <q-item><q-item-label v-if="patentPistolPermission">P</q-item-label></q-item>
      <q-item><q-item-label v-if="patentRiflePermission">K</q-item-label></q-item>
      <q-item><q-item-label v-if="patentShotgunPermission">S</q-item-label></q-item>
      </div>
      </q-card-section>
      </q-card>
      <div v-if="!memberAdult">Patent - Nie ma tu nic do pokazania
      </div>
      </q-step>

      <q-step
        :name="4"
        title="Licencja"
        caption="opcjonalnie"
        icon="assignment"
        :done="step > 4"
      >
      <q-card class="row" v-if="(memberAdult&&patentNumber!=null)||!memberAdult">
      <q-card-section>
      <div >
      <q-item><q-input v-model="licenseNumber" hint="tylko cyfry" placeholder="tylko cyfry" label="Numer Licencji" filled lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-input v-model="licenseDate" hint="YYYY-MM-DD" placeholder="YYYY-MM-DD" label="Ważna do" filled lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item v-if="patentPistolPermission||!memberAdult"><q-checkbox v-model="licensePistolPermission"  label="Pistolet"/></q-item>
      <q-item v-if="patentRiflePermission||!memberAdult"><q-checkbox  v-model="licenseRiflePermission"  label="Karabin"/></q-item>
      <q-item v-if="patentShotgunPermission||!memberAdult"><q-checkbox v-model="licenseShotgunPermission"  label="Strzelba"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),addLicense(uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/></q-item>
      </div>
      </q-card-section>
      <q-card-section>
      <div v-if="(memberAdult&&patentNumber!=null)||!memberAdult">
      <q-item><q-item-label>Numer Licencji : {{licenseNumber}}</q-item-label></q-item>
      <q-item><q-item-label>Data Ważności : {{licenseDate}}</q-item-label></q-item>
      <q-item><q-item-label>Dyscypliny :</q-item-label></q-item>
      <q-item v-if="(licensePistolPermission&&patentPistolPermission)||(!memberAdult&licensePistolPermission)"><q-item-label>P</q-item-label></q-item>
      <q-item v-if="(licenseRiflePermission&&patentRiflePermission)||(!memberAdult&licenseRiflePermission)"><q-item-label>K</q-item-label></q-item>
      <q-item v-if="(licenseShotgunPermission&&patentShotgunPermission)||(!memberAdult&licenseShotgunPermission)"><q-item-label>S</q-item-label></q-item>
      </div>
      </q-card-section>
      </q-card>
      <div v-if="(memberAdult&&patentNumber==null)">Licencja - Nie ma tu nic do pokazania
      </div>
      </q-step>

      <q-step
        :name="5"
        title="Pozwolenie na Broń"
        caption="opcjonalnie"
        icon="assignment"
        :done="step > 5"
      >
      <div v-if="(memberAdult&&patentNumber!=null&&licenseNumber!=null)">
      <q-item><q-item-label>Jeśli posiada pozwolenie - wpisz numer</q-item-label></q-item>
      <q-item><q-input v-model="weaponPermissionNumber" label="Numer" filled lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),changeWeaponPermission(uuid, weaponPermissionNumber)"/></q-item>
      </div>
      <div v-if="(memberAdult&&(patentNumber==null||licenseNumber==null)||!memberAdult)" >Pozwolenie na broń - Nie ma tu nic do pokazania</div>
      </q-step>
      <q-step
        :name="6"
        title="Prowadzący Strzelanie"
        caption="opcjonalnie"
        icon="assignment"
        :done="step > 6"
      >
      <div v-if="memberAdult">
      <q-item><q-item-label>Jeśli posiada uprawnienia - wpisz numer</q-item-label></q-item>
      <q-item><q-input v-model="permissionsShootingLeaderNumber" label="Numer" filled lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),updateMemberPermissions(uuid, permissionsShootingLeaderNumber),value=true"/></q-item>
      </div>
      <div v-if="!memberAdult" >Prowadzący strzelanie - Nie ma tu nic do pokazania</div>
      </q-step>
      <q-step
        :name="7"
        title="Instruktor"
        caption="opcjonalnie"
        icon="assignment"
        :done="step > 7"
      >
      <div v-if="memberAdult">
      <q-item><q-item-label>Jeśli posiada uprawnienia instruktora - wpisz numer</q-item-label></q-item>
      <q-item><q-input v-model="permissionsInstructorNumber" label="Numer" filled lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),updateMemberPermissions(uuid, permissionsInstructorNumber), value1=true"/></q-item>
      </div>
      <div v-if="!memberAdult" >Instruktor - Nie ma tu nic do pokazania</div>
      </q-step>
      <q-step
        :name="8"
        title="Sędzia"
        caption="opcjonalnie"
        icon="assignment"
      >
      <div v-if="memberAdult">
      <q-item><q-item-label>Jeśli posiada Licencję Sędziego - uzupełnij dane</q-item-label></q-item>
        <q-item><q-input v-model="permissionsArbiterNumber" filled label="Numer uprawnień" /></q-item>
        <q-item><q-input v-model="permissionsArbiterPermissionValidThru" filled hint="YYYY-MM-DD" placeholder="YYYY-MM-DD" label="Data ważności" /></q-item>
        <q-item><q-radio v-model="ordinal" :val="1" label="Klasa 3" color="secondary" /></q-item>
        <q-item><q-radio v-model="ordinal" :val="2" label="Klasa 2" color="secondary" /></q-item>
        <q-item><q-radio v-model="ordinal" :val="3" label="Klasa 1" color="secondary" /></q-item>
        <q-item><q-radio v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" /></q-item>
        <q-item><q-radio v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" /></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),updateMemberPermissions(uuid, permissionsArbiterNumber,permissionsArbiterPermissionValidThru, ordinal), value2=true"/></q-item>
      </div>
      <div v-if="!memberAdult">Sędzia - Nie ma tu nic do pokazania</div>
      </q-step>

      <template v-slot:navigation  >
        <q-stepper-navigation class="flex flex">
          <q-item v-if="step<8&&uuid!=null" ><q-btn @click="$refs.stepper.next()" color="primary" :label="step === 8 ? 'Zakończono' : 'Przejdź Dalej'" /></q-item>
          <q-item v-if="step==8" ><q-btn @click="redirect()" color="primary" label="Zakończ" /></q-item>
          <q-item><q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Wróć" /></q-item>
          <q-item><q-btn v-if="uuid!=null&&uuid!=''" color="secondary" @click="showloading()" label="Drukuj kartę" /></q-item>
          <q-item><q-btn v-if="uuid!=null&&uuid!=''" color="secondary" @click="showloading()" label="Potwierdzenie opłacenia składki" /></q-item>
          <q-item v-if="uuid!=null"><q-item-label>Identyfikator : {{uuid}}</q-item-label></q-item>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
  <q-dialog v-model="memberAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Witamy w Klubie</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Od tej chwili jesteś skazany na przenoszenie szaf z piętra na parter.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  <q-dialog v-model="addressAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zaktualizowano Adres</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Już nie mieszkasz w kartonie po bananach.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  <q-dialog v-model="licenseAndPatentAlert">
      <q-card>
        <q-card-section v-if="licenseNumber==null">
          <div class="text-h6">Uprawnienia patentu zostały nadane</div>
        </q-card-section>
        <q-card-section v-else>
          <div class="text-h6">Uprawnienia licencji zostały nadane</div>
        </q-card-section>

        <q-card-section v-if="licenseNumber==null" class="q-pt-none">
          Od tej chwili już nie jesteś gołowąsem i coś już umiesz.
        </q-card-section>
        <q-card-section v-else class="q-pt-none">
          Pniesz się do góry w karierze małej mróweczki
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  <q-dialog v-model="weaponAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Pozwolenie na Broń</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Teraz nie strzaszny Ci już RAMBO, TERMINATOR czy JOHN WICK.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  <q-dialog v-model="instructorAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Uprawnienia Instruktora</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Możesz już szkolić ludzi takich jak RAMBO.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  <q-dialog v-model="shootingLeaderAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Uprawnienia Prowadzącego Strzelanie</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Możesz już nadzorować wszystkich podczas strzelania z armat.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  <q-dialog v-model="arbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Licencję Sędziego</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Od dzisiaj wystawiasz oceny takim goścom jak RAMBO.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  <q-dialog v-model="failAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Coś poszło nie tak</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Upewnij się, że wszystkie wymagane pola są uzupełnione a wszystkie dane są podane prawidłowo
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script >

import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      fileuuid: null,
      value: false,
      value1: false,
      value2: false,
      instructorAlert: false,
      shootingLeaderAlert: false,
      arbiterAlert: false,
      failAlert: false,
      memberAlert: false,
      addressAlert: false,
      licenseAndPatentAlert: false,
      weaponAlert: false,
      permissionsShootingLeaderNumber: null,
      permissionsInstructorNumber: null,
      permissionsArbiterNumber: null,
      permissionsArbiterPermissionValidThru: null,
      step: 1,
      number: '',
      validThru: '',
      member: [],
      patentNumber: null,
      patentDate: null,
      patentPistolPermission: false,
      patentRiflePermission: false,
      patentShotgunPermission: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      licenseNumber: null,
      licenseDate: null,
      weaponPermissionNumber: '',
      isExist: false,
      memberFirstName: '',
      memberSecondName: '',
      memberIDCard: '',
      memberPesel: '',
      memberPhone: '',
      memberEmail: '',
      memberAdult: null,
      memberLegitimation: '',
      memberJoinDate: '',
      memberZipCode: null,
      memberPostOfficeCity: null,
      memberStreet: null,
      memberStreetNumber: null,
      memberFlatNumber: null,
      active: true,
      uuid: null,
      ordinal: '',
      returnAlert: false
    }
  },
  methods: {
    redirect () {
      window.location.href = 'https://localhost:8081/#/member/lista'
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    addMember (memberLegitimation, memberFirstName, memberSecondName, memberIDCard, memberPesel, memberPhone, memberEmail, memberAdult) {
      var data = {
        legitimationNumber: memberLegitimation,
        firstName: memberFirstName,
        secondName: memberSecondName,
        idcard: memberIDCard,
        pesel: memberPesel,
        email: memberEmail,
        phoneNumber: memberPhone,
        adult: memberAdult,
        active: this.active
      }
      fetch('http://localhost:8080/member/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(uuid => {
          this.uuid = uuid
          console.log(this.uuid)
          if (uuid != null) { this.returnAlert = true }
          this.updateJoinDate(uuid, this.memberJoinDate)
        })
    },
    updateJoinDate (uuid, memberJoinDate) {
      var data = {
        joinDate: memberJoinDate
      }
      fetch('http://localhost:8080/member/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        response.json()
      })
        .then(joinDate => {
          this.joinDate = memberJoinDate
          console.log(this.memberJoinDate)
          if (this.returnAlert) { this.memberAlert = true }
          if (!this.returnAlert) { this.failAlert = true }
          this.returnAlert = false
        })
    },
    updateAddress (uuid, memberPostOfficeCity, memberZipCode, memberStreet, memberStreetNumber, memberFlatNumber) {
      var data = {
        zipCode: memberZipCode,
        postOfficeCity: memberPostOfficeCity,
        street: memberStreet,
        streetNumber: memberStreetNumber,
        flatNumber: memberFlatNumber
      }
      fetch('http://localhost:8080/address/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(member => {
          this.member = member
          this.addressAlert = true
        })
    },
    addPatent (uuid, memberPatentNumber, memberPatentPistolPermission, memberPatentRiflePermission, memberPatentShotgunPermission) {
      var data = {
        patentNumber: memberPatentNumber,
        pistolPermission: memberPatentPistolPermission,
        riflePermission: memberPatentRiflePermission,
        shotgunPermission: memberPatentShotgunPermission
      }
      fetch('http://localhost:8080/patent/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(patentNumber => {
          if (patentNumber != null) { this.returnAlert = true }
          this.updatedateOfPosting(uuid, this.patentDate)
        })
    },
    updatedateOfPosting (uuid, patentDate) {
      var data = {
        dateOfPosting: patentDate
      }
      fetch('http://localhost:8080/patent/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(dateOfPosting => {
          this.dateOfPosting = patentDate
          if (this.returnAlert) { this.licenseAndPatentAlert = true }
          if (!this.returnAlert) {
            alert('Coś poszło nie tak - sprawdź czy wszystkie dane są wprowadzone poprawnie')
            this.returnAlert = false
          }
          this.returnAlert = false
        })
    },
    addLicense (uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      var data = {
        number: licenseNumber,
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission
      }
      fetch('http://localhost:8080/license/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(licenseNumber => {
          if (licenseNumber != null) { this.returnAlert = true }
          this.updateValidThru(uuid, this.licenseDate)
        })
    },
    updateValidThru (uuid, licenseDate) {
      var data = {
        validThru: licenseDate
      }
      fetch('http://localhost:8080/license/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(validThru => {
          this.validThru = licenseDate
          if (this.returnAlert) { this.licenseAndPatentAlert = true }
          if (!this.returnAlert) {
            alert('Coś poszło nie tak - sprawdź czy wszystkie dane są wprowadzone poprawnie')
            this.returnAlert = false
          }
          this.returnAlert = false
        })
    },
    changeWeaponPermission (uuid, weaponPermissionNumber) {
      var data = {
        number: weaponPermissionNumber
      }
      fetch('http://localhost:8080/member/weapon/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(number => {
          this.number = weaponPermissionNumber
          if (this.patentNumber != null && this.licenseNumber != null) { this.returnAlert = true }
          if (this.returnAlert) { this.weaponAlert = true }
          if (!this.returnAlert) { alert('Coś poszło nie tak - sprawdź czy wszystkie dane są wprowadzone poprawnie') }
          this.returnAlert = false
        })
    },
    updateMemberPermissions (uuid, permissionsShootingLeaderNumber, permissionsInstructorNumber, permissionsArbiterNumber, permissionsArbiterPermissionValidThru) {
      var data = {
        shootingLeaderNumber: this.permissionsShootingLeaderNumber,
        instructorNumber: this.permissionsInstructorNumber,
        arbiterNumber: this.permissionsArbiterNumber,
        arbiterPermissionValidThru: this.permissionsArbiterPermissionValidThru
      }
      fetch('http://localhost:8080/permissions/' + uuid + '?ordinal=' + this.ordinal, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => {
        response.json()
        if (response.ok) {
          if (this.value) { this.shootingLeaderAlert = true }
          if (this.value1) { this.instructorAlert = true }
          if (this.value2) { this.arbiterAlert = true }
        }
      })
        .then(members => {
          this.members = members
          this.value = false
          this.value1 = false
          this.value2 = false
          this.permissionsShootingLeaderNumber = null
          this.permissionsShootingLeaderNumber = null
          this.permissionsArbiterNumber = null
        })
    },
    getContributionPDF () {
      axios({
        url: 'http://localhost:8080/files/downloadContribution/' + this.fileuuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Składka_' + this.memberFirstName + '_' + this.memberSecondName + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    }
  },
  name: 'addMember'
}
</script>
