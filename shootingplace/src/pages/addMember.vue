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
        title="Podstawoowe dane"
        caption="Wymagane"
        icon="settings"
        :done="step > 1"
      >
      <q-card class="row">
      <q-card-section>
      <div>
      <q-item><q-input color="red" v-model="memberFirstName" label="*Imię" :dense="dense" /></q-item>
      <q-item><q-input color="red" v-model="memberSecondName" label="*Nazwisko" :dense="dense" /></q-item>
      <q-item><q-input color="red" v-model="memberIDCard" label="*Numer Dowodu" :dense="dense" /></q-item>
      <q-item><q-input color="red" v-model="memberPesel" label="*Pesel" :dense="dense" /></q-item>
      <q-item><q-input color="red" v-model="memberPhone" label="*Numer telefonu - same cyfry" :dense="dense" /></q-item>
      <q-item><q-input color="green" v-model="memberEmail" label="email " :dense="dense" /></q-item>
      <q-item><q-input color="green" v-model="memberLegitimation" label="Numer Legitymacji" :dense="dense" /></q-item>
      <q-item><q-input color="green" v-model="memberJoinDate" label="Data dołączenia do klubu" :dense="dense" /></q-item>
      <q-item><q-item-label>Grupa Młodzieżowa</q-item-label><q-toggle v-model="memberAdult" color="secondary" /><q-item-label>Grupa Dorosła</q-item-label></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),addMember(memberLegitimation, memberFirstName,
      memberSecondName,
      memberIDCard,
      memberPesel,
      memberPhone,
      memberEmail)"/></q-item>
      </div>
      </q-card-section>
      <q-card-section>
      <div>
      <q-item><q-item-label>Imię : {{memberFirstName}}</q-item-label></q-item>
      <q-item><q-item-label>Nazwisko : {{memberSecondName}}</q-item-label></q-item>
      <q-item><q-item-label>Numer Dowodu Osobistego : {{memberIDCard}}</q-item-label></q-item>
      <q-item><q-item-label>Numer PESEL : {{memberPesel}}</q-item-label></q-item>
      <q-item><q-item-label>Numer Telefonu : +48 {{memberPhone}}</q-item-label></q-item>
      <q-item><q-item-label>Adres E-mail : {{memberEmail}}</q-item-label></q-item>
      <q-item><q-item-label>Numer Legitymacji Klubowej : {{memberLegitimation}}</q-item-label></q-item>
      <q-item><q-item-label v-if="memberAdult&&memberIDCard!=null">Grupa Dorosła</q-item-label></q-item>
      <q-item><q-item-label v-if="!memberAdult&&memberIDCard!=null">Grupa Młodzieżowa</q-item-label></q-item>
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
      <q-item><q-input v-model="zipCode" label="Miasto" :dense="dense" /></q-item>
      <q-item><q-input v-model="postOfficeCity" label="Kod Pocztowy" :dense="dense" /></q-item>
      <q-item><q-input v-model="street" label="Ulica" :dense="dense" /></q-item>
      <q-item><q-input v-model="streetNumber" label="Numer Ulicy" :dense="dense" /></q-item>
      <q-item><q-input v-model="flatNumber" label="Numer Mieszkania" :dense="dense"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),updateAddress(uuid, zipCode, postOfficeCity, street, streetNumber, flatNumber)"/></q-item>
      </div>
      </q-card-section>
      <q-card-section>
      <div>
      <q-item><q-item-label>Miasto : {{postOfficeCity}}</q-item-label></q-item>
      <q-item><q-item-label>Kod Pocztowy : {{zipCode}}</q-item-label></q-item>
      <q-item><q-item-label>Ulica : {{street}}</q-item-label></q-item>
      <q-item><q-item-label>Numer Ulicy : {{streetNumber}}</q-item-label></q-item>
      <q-item><q-item-label>Numer Mieszkania : {{flatNumber}}</q-item-label></q-item>
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
      <q-card class="row">
      <q-card-section>
      <div>
      <q-item><q-input v-model="patentNumber" label="Numer Patentu" :dense="dense"/></q-item>
      <q-item><q-toggle v-model="patentPistolPermission" label="Pistolet"/></q-item>
      <q-item><q-toggle v-model="patentRiflePermission" label="Karabin"/></q-item>
      <q-item><q-toggle v-model="patentShotgunPermission" label="Strzelba"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading()"/></q-item>
      </div>
      </q-card-section>
      <q-card-section>
      <div>
      <q-item><q-item-label>Numer Patentu : {{patentNumber}}</q-item-label></q-item>
      <q-item><q-item-label>Data Nadania : {{}}</q-item-label></q-item>
      <q-item><q-item-label>Dyscypliny :</q-item-label></q-item>
      <q-item><q-item-label v-if="patentPistolPermission">P</q-item-label></q-item>
      <q-item><q-item-label v-if="patentRiflePermission">K</q-item-label></q-item>
      <q-item><q-item-label v-if="patentShotgunPermission">S</q-item-label></q-item>
      </div>
      </q-card-section>
      </q-card>
      </q-step>

      <q-step
        :name="4"
        title="Licencja"
        caption="opcjonalnie"
        icon="assignment"
        :done="step > 4"
      >
      <q-card class="row">
      <q-card-section>
      <div>
   <q-item><q-input label="Numer Licencji" :dense="dense"/></q-item>
      <q-item><q-input label="Ważna do" :dense="dense"/></q-item>
      <q-item><q-toggle v-model="licensePistolPermission" label="Pistolet"/></q-item>
      <q-item><q-toggle v-model="licenseRiflePermission" label="Karabin"/></q-item>
      <q-item><q-toggle v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading()"/></q-item>
      </div>
      </q-card-section>
      <q-card-section>
      <div>
      <q-item><q-item-label>Numer Patentu : {{licenseNumber}}</q-item-label></q-item>
      <q-item><q-item-label>Data Nadania : {{}}</q-item-label></q-item>
      <q-item><q-item-label>Dyscypliny :</q-item-label></q-item>
      <q-item><q-item-label v-if="licensePistolPermission&&patentPistolPermission">P</q-item-label></q-item>
      <q-item><q-item-label v-if="licenseRiflePermission&&patentRiflePermission">K</q-item-label></q-item>
      <q-item><q-item-label v-if="licenseShotgunPermission&&patentShotgunPermission">S</q-item-label></q-item>
      </div>
      </q-card-section>
      </q-card>
      </q-step>

      <q-step
        :name="5"
        title="Pozwolenie na Broń"
        caption="opcjonalnie"
        icon="assignment"
      >
      <q-item><q-item-label>Posiada pozwolenie na Broń?</q-item-label></q-item>
      <q-item><q-input v-model="weaponPermissionNumber" label="Numer" :dense="dense" /></q-item>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn v-if="uuid!=null" @click="$refs.stepper.next()" color="primary" :label="step === 5 ? 'Zakończ' : 'Przejdź Dalej'" />
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Wróć" class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
  </q-page>
</template>

<script >
export default {
  data () {
    return {
      step: 1,
      number: '',
      patentNumber: '',
      licenseNumber: '',
      validThru: '',
      member: [],
      dateOfPosting: null,
      patentPistolPermission: false,
      patentRiflePermission: false,
      patentShotgunPermission: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      weponPermissionNumer: '',
      isExist: false,
      memberFirstName: '',
      memberSecondName: '',
      memberIDCard: null,
      memberPesel: '',
      memberPhone: '',
      memberEmail: '',
      memberAdult: true,
      memberLegitimation: '',
      memberJoinDate: '',
      zipCode: null,
      postOfficeCity: null,
      street: null,
      streetNumber: null,
      flatNumber: null,
      active: true,
      uuid: null,
      returnAlert: false
    }
  },
  methods: {
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
          if (this.returnAlert) { alert('Witamy w klubie') }
          if (!this.returnAlert) { alert('Coś poszło nie tak - sprawdź czy wszystkie dane są wprowadzone poprawnie') }
        })
    },
    updateAddress (uuid, zipCode, postOfficeCity, street, streetNumber, flatNumber) {
      var data = {
        zipCode: zipCode,
        postOfficeCity: postOfficeCity,
        street: street,
        streetNumber: streetNumber,
        flatNumber: flatNumber
      }
      fetch('http://localhost:8080/address/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    }
  },
  name: 'addMember'
}
</script>
