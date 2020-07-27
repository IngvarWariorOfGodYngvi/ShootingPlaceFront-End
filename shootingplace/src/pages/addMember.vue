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
      <q-item><q-item-label>Numer Telefonu : +48 {{memberPhone}}</q-item-label></q-item>
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
      <q-card class="row">
      <q-card-section>
      <div>
      <q-item><q-input v-model="patentNumber" hint="tylko cyfry" placeholder="tylko cyfry" label="Numer Patentu" filled  lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-input v-model="patentDate" hint="YYYY-MM-DD" placeholder="YYYY-MM-DD" label="Data nadania" filled  lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-checkbox v-model="patentPistolPermission"  label="Pistolet"/></q-item>
      <q-item><q-checkbox v-model="patentRiflePermission"  label="Karabin"/></q-item>
      <q-item><q-checkbox v-model="patentShotgunPermission"  label="Strzelba"/></q-item>
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
      <div v-if="(memberAdult&&patentNumber!=null)||!memberAdult">
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
      >
      <div v-if="(memberAdult&&patentNumber!=null&&licenseNumber!=null)">
      <q-item><q-item-label>Jeśli posiada pozwolenie wpisz numer</q-item-label></q-item>
      <q-item><q-input v-model="weaponPermissionNumber" label="Numer" filled lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),changeWeaponPermission(uuid, weaponPermissionNumber)"/></q-item>
      </div>
      <div v-if="(memberAdult&&(patentNumber==null||licenseNumber==null))" >Pozwolenie na broń - Nie ma tu nic do pokazania</div>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="row">
          <q-item><q-btn v-if="uuid!=null&&uuid!=''" @click="$refs.stepper.next()" color="primary" :label="step === 5 ? 'Zakończono' : 'Przejdź Dalej'" /></q-item>
          <q-item><q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Wróć" /></q-item>
          <q-item><q-btn v-if="uuid!=null&&uuid!=''" color="secondary" @click="showloading()" label="Drukuj kartę" /></q-item>
          <q-item v-if="uuid!=null"><q-item-label>Identyfikator : {{uuid}}</q-item-label></q-item>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
  <q-dialog v-model="alert">
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
  <q-dialog v-model="alert1">
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
  <q-dialog v-model="alert2">
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
    <q-dialog v-model="alert3">
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
  </q-page>
</template>

<script >
export default {
  data () {
    return {
      alert: false,
      alert1: false,
      alert2: false,
      alert3: false,
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
          if (this.returnAlert) { this.alert = true }
          if (!this.returnAlert) { alert('Coś poszło nie tak - sprawdź czy wszystkie dane są wprowadzone poprawnie') }
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
          this.alert1 = true
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
          if (this.returnAlert) { this.alert2 = true }
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
          if (this.returnAlert) { this.alert2 = true }
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
          if (this.returnAlert) { this.alert3 = true }
          if (!this.returnAlert) { alert('Coś poszło nie tak - sprawdź czy wszystkie dane są wprowadzone poprawnie') }
          this.returnAlert = false
        })
    }
  },
  name: 'addMember'
}
</script>
