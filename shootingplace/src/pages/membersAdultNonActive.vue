<template>
  <q-page padding>
      <div class="q-pa-md">
    <q-list bordered class="rounded-borders">
      <q-expansion-item v-for="members in members" :key="members.uuid">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar v-if="members.weaponPermission.isExist&&!members.license.isValid" icon="warning" color="red" text-color="white" />
            <q-avatar v-else-if="members.email==null" icon="warning" color="warning" text-color="white" />
            <q-avatar v-else icon="perm_identity" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
          <q-item-label>{{members.secondName}} {{members.firstName}}</q-item-label>
          <q-item-label caption lines="2">Składka ważna do {{members.contribution.contribution}}</q-item-label>
           <q-item-label caption lines="2">Składka opłacona dnia {{members.contribution.paymentDay}}</q-item-label>
          </q-item-section>
          <q-item-section>
          <q-item-label caption lines="2">Numer dowodu {{members.idcard}}</q-item-label>
          <q-item-label caption lines="2">Data zapisu {{members.joinDate}}</q-item-label>
           <q-item-label caption lines="2">Numer legitymacji {{members.legitimationNumber}}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn color="primary"
            label="Przedłuż składkę"
            @click="showloading(),prolongContribution(members.uuid),reload()
            "/>
          </q-item-section>
        </template>
        <q-item><q-btn label="wyświetl" @click="openMember = !openMember"></q-btn></q-item>

        <q-card v-if="openMember">
          <q-item  >
          <q-card-section class="col">
              <q-item-section  >
                <q-item-label v-if="members.shootingPatent.patentNumber!=null">Patent</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.patentNumber!=null">Numer Patentu {{members.shootingPatent.patentNumber}}</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.patentNumber!=null">Przyznany dnia {{members.shootingPatent.dateOfPosting}}</q-item-label>
                <q-item-label v-if="members.shootingPatent.patentNumber!=null">Dyscypliny :</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.pistolPermission">P</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.riflePermission">K</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.shotgunPermission">S</q-item-label>
              </q-item-section>
              <q-expansion-item v-if="members.shootingPatent.patentNumber==null" label="DODAJ PATENT">
                <q-item><q-input v-if="members.shootingPatent.patentNumber==null" v-model="patentNumber" label="Numer Patentu - same cyfry" :dense="dense" id="number"/></q-item>
                <!-- <q-item><q-input v-model="dateOfPosting" label="Przyznany YYYY-MM-DD" :dense="dense" id="day"/></q-item> -->
                <q-item><q-toggle v-model="patentPistolPermission" label="Pistolet"/></q-item>
                <q-item><q-toggle v-model="patentRiflePermission" label="Karabin"/></q-item>
                <q-item><q-toggle v-model="patentShotgunPermission" label="Strzelba"/></q-item>
                <q-btn color="secondary" label="Dodaj Patent" v-if="members.shootingPatent.patentNumber==null" @click="showloading(),addPatent(members.uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission),reload()"/>
              </q-expansion-item>
              <q-expansion-item v-if="members.shootingPatent.patentNumber!=null&&(
                !members.shootingPatent.pistolPermission
                ||!members.shootingPatent.riflePermission
                ||!members.shootingPatent.shotgunPermission)" label="AKTUALIZUJ PATENT">
                <q-item><q-toggle v-if="!members.shootingPatent.pistolPermission" v-model="patentPistolPermission" label="Pistolet"/></q-item>
                <q-item><q-toggle v-if="!members.shootingPatent.riflePermission" v-model="patentRiflePermission" label="Karabin"/></q-item>
                <q-item><q-toggle v-if="!members.shootingPatent.shotgunPermission" v-model="patentShotgunPermission" label="Strzelba"/></q-item>
                <q-btn color="primary" label="Aktualizuj Patent" @click="showloading(),addPatent(members.uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission),reload()"/>
              </q-expansion-item>
              <q-item-label v-if="members.shootingPatent.pistolPermission
                &&members.shootingPatent.riflePermission
                &&members.shootingPatent.shotgunPermission">Klubowicz Posiada już cały patent</q-item-label>
              </q-card-section>
              <q-card-section class="col">
              <q-item-section>
                <q-item-label v-if="members.shootingPatent.patentNumber!=null">Licencja</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.patentNumber!=null">Numer Licencji {{members.license.number}}</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.patentNumber!=null">Ważna do {{members.license.validThru}}</q-item-label>
                <q-item-label v-if="members.license.number!=null">Dyscypliny :</q-item-label>
                <q-item-label caption lines="2" v-if="members.license.pistolPermission">P</q-item-label>
                <q-item-label caption lines="2" v-if="members.license.riflePermission">K</q-item-label>
                <q-item-label caption lines="2" v-if="members.license.shotgunPermission">S</q-item-label>
              </q-item-section>
              <q-expansion-item v-if="members.shootingPatent.patentNumber!=null&&members.license.number==null" label="DODAJ LICENCJĘ">
                <q-item><q-input v-if="members.license.number==null" v-model="licenseNumber" label="Numer Licencji - same cyfry" :dense="dense" id="number"/></q-item>
                <!-- <q-item><q-input v-model="dateOfPosting" label="Przyznany YYYY-MM-DD" :dense="dense" id="day"/></q-item> -->
                <q-item><q-toggle v-if="members.shootingPatent.pistolPermission" v-model="licensePistolPermission" label="Pistolet"/></q-item>
                <q-item><q-toggle v-if="members.shootingPatent.riflePermission" v-model="licenseRiflePermission" label="Karabin"/></q-item>
                <q-item><q-toggle v-if="members.shootingPatent.shotgunPermission" v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
                <q-btn color="secondary" label="Dodaj Licencję" v-if="members.license.number==null" @click="showloading(),addLicense(members.uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission),reload()"/>
              </q-expansion-item>
              <q-expansion-item v-if="members.license.number!=null&&(
                !members.license.pistolPermission
                ||!members.license.riflePermission
                ||!members.license.shotgunPermission)" label="Aktualizuj Licencję">
                <q-item><q-toggle v-if="!members.license.pistolPermission&&members.shootingPatent.pistolPermission" v-model="licensePistolPermission" label="Pistolet"/></q-item>
                <q-item><q-toggle v-if="!members.license.riflePermission&&members.shootingPatent.riflePermission" v-model="licenseRiflePermission" label="Karabin"/></q-item>
                <q-item><q-toggle v-if="!members.license.shotgunPermission&&members.shootingPatent.shotgunPermission" v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
                <q-btn color="primary" label="Aktualizuj Licencję" @click="showloading(),addLicense(members.uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission),reload()"/>
              </q-expansion-item>
              <q-item-label v-if="members.license.pistolPermission
                &&members.license.riflePermission
                &&members.license.shotgunPermission">Klubowicz Posiada już całą Licencję</q-item-label>
              <q-btn v-if="members.license.number!=null&&(members.license.pistolPermission||members.license.riflePermission||members.license.shotgunPermission)" color="primary" label="Przedłuż Licencję" @click="showloading(),prolongLicense(members.uuid),reload()"/>
              </q-card-section>
              <q-card-section class="col">
              <q-item-section>
                <q-item-label >Historia Składek</q-item-label>
                <q-expansion-item label="rozwiń">
                <q-item-label v-for="record in members.contribution.history.record" :key="record">{{record}}</q-item-label>
                <q-item/>
                </q-expansion-item >
                </q-item-section>
                <q-item-section>
                  <q-item-label>Pozwolenie na Broń</q-item-label>
                <q-item-label v-if="members.weaponPermission.isExist">TAK</q-item-label>
                <q-item-label v-else>NIE</q-item-label>
                  <q-item-label v-if="!members.license.isValid&&members.weaponPermission.isExist">POSIADA NIE WAŻNĄ LICENCJĘ!!!</q-item-label>
                  <q-item-label v-if="members.license.isValid&&members.weaponPermission.isExist" >Posiada ważną licencję</q-item-label>
                  <q-item-label v-if="members.weaponPermission.number!=null&&members.weaponPermission.isExist" >Numer Pozwolenia</q-item-label>
                  <q-item-label v-if="members.weaponPermission.number!=null&&members.weaponPermission.isExist" v-model="isExist">{{members.weaponPermission.number}}</q-item-label>
                  <q-expansion-item label="rozwiń">
                  <q-input v-if="members.weaponPermission.number==null||!members.weaponPermission.isExist" v-model="weaponPermissionNumber" label="Numer pozwolenia" :dense="dense"/>
                  <q-item-label v-if="members.weaponPermission.number==null" v-model="isExist">Dodaj pozwolenie</q-item-label>
                  <q-item-label v-else>Usuń pozwolenie</q-item-label>
                <q-item><q-btn label="zmień" color="primary" @click="showloading(),changeWeaponPermission(members.uuid, weaponPermissionNumber, isExist),reload()"/></q-item>
                  </q-expansion-item>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Przenieś do nieaktywnych</q-item-label>
                  <q-expansion-item label="rozwiń">
                  <q-item-label v-if="!members.weaponPermission.isExist">Czy napewno skreślić z listy?</q-item-label>
                <q-item><q-btn label="skreśl" color="red" @click="showloading(), erase(members.uuid), reload()"/></q-item>
                  </q-expansion-item>
                </q-item-section>
          </q-card-section>
          </q-item>
        </q-card>
        <q-card v-if="openMember">
          <q-item>
          <q-card-section>
            <q-item-section  class="col">
            <q-item-label>Dane Podstawowe</q-item-label>
            <q-item-label caption lines="2">Identyfikator : {{members.uuid}}</q-item-label>
            <q-item-label caption lines="2">Imię : {{members.firstName}}</q-item-label>
            <q-item-label caption lines="2">Nazwisko : {{members.secondName}}</q-item-label>
            <q-item-label caption lines="2">Data Zapisu do Klubu : {{members.joinDate}}</q-item-label>
            <q-item-label caption lines="2">Pesel : {{members.pesel}}</q-item-label>
            <q-item-label caption lines="2">Numer Dowodu : {{members.idcard}}</q-item-label>
            <q-item-section side top>
            <q-expansion-item label="Zmień numer Dowodu">
                <q-item><q-input v-model="idcard" label="Numer Dowodu" :dense="dense" /></q-item>
                <q-item><q-btn label="Aktualizuj" color="primary" @click="showloading(),updateIDCard (members.uuid, idcard),reload()"/></q-item>
            </q-expansion-item>
            </q-item-section>
            </q-item-section>
          </q-card-section>
          <q-card-section >
            <q-item-section >
            <q-item-label>Dane Kontaktowe</q-item-label>
            <q-item-label caption lines="2">e-mail {{members.email}}</q-item-label>
            <q-item-label caption lines="2">Numer Telefonu {{members.phoneNumber}}</q-item-label>
            <q-item-label>Adres</q-item-label>
            <q-item-label caption lines="2">Miasto {{members.address.postOfficeCity}}</q-item-label>
            <q-item-label caption lines="2">Kod Pocztowy {{members.address.zipCode}}</q-item-label>
            <q-item-label caption lines="2">Ulica {{members.address.street}} {{members.address.streetNumber}}</q-item-label>
            <q-item-label caption lines="2">Mieszkanie numer {{members.address.flatNumber}}</q-item-label>
            <q-item-section side top >
            <q-expansion-item label="Aktualizuj Dane Kontaktowe">
                <q-item><q-input v-model="email" label="e-mail" :dense="dense" /></q-item>
                <q-item><q-input v-model="phoneNumber" label="numer Telefonu - same cyfry" :dense="dense" /></q-item>
                <q-item><q-input v-model="postOfficeCity" label="Miasto" :dense="dense" /></q-item>
                <q-item><q-input v-model="zipCode" label="Kod Pocztowy - 00-000" :dense="dense" /></q-item>
                <q-item><q-input v-model="street" label="Ulica" :dense="dense" /></q-item>
                <q-item><q-input v-model="streetNumber" label="Numer Ulicy" :dense="dense" /></q-item>
                <q-item><q-input v-model="flatNumber" label="Numer mieszkania" :dense="dense" /></q-item>
                <q-item><q-btn label="Aktualizuj" color="primary" @click="showloading(),
                updateMember(members.uuid, email, phoneNumber),
                updateAddress(members.uuid, zipCode, postOfficeCity, street, streetNumber, flatNumber),
                reload()"/></q-item>
            </q-expansion-item>
            </q-item-section>
            </q-item-section>
          </q-card-section>
          </q-item>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      openMember: false,
      number: '',
      patentNumber: '',
      licenseNumber: '',
      validThru: '',
      members: [],
      // dateOfPosting: false,
      patentPistolPermission: false,
      patentRiflePermission: false,
      patentShotgunPermission: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      weponPermissionNumer: '',
      isExist: false
    }
  },
  created () {
    this.getListMembers()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    getListMembers () {
      fetch('http://localhost:8080/member/activelist?active=false&adult=true&erase=false', {
        method: 'GET'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    prolongContribution (uuid) {
      fetch('http://localhost:8080/contribution/' + uuid, {
        method: 'PATCH'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
      this.getListMembers()
    },
    getMember (uuid) {
      fetch('http://localhost:8080/member/' + uuid, {
        method: 'GET'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
      this.$router.push('/member/' + uuid)
    },
    reload () {
      window.location.reload()
    },
    refreshPage () {
      this.timer = setInterval(() => {
        window.location.reload()
      }, 10000)
    },
    addPatent (uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission) {
      var data = {
        patentNumber: patentNumber,
        pistolPermission: patentPistolPermission,
        riflePermission: patentRiflePermission,
        shotgunPermission: patentShotgunPermission
      }
      fetch('http://localhost:8080/patent/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    addLicense (uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      var data1 = {
        number: licenseNumber,
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission
      }
      fetch('http://localhost:8080/license/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data1),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    updateMember (uuid, email, phoneNumber) {
      var data = {
        email: email,
        phoneNumber: phoneNumber
      }
      fetch('http://localhost:8080/member/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    updateIDCard (uuid, idcard) {
      var data = {
        idcard: idcard
      }
      fetch('http://localhost:8080/member/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(members => {
          this.members = members
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
    },
    changeWeaponPermission (uuid) {
      fetch('http://localhost:8080/member/weapon/' + uuid, {
        method: 'PATCH'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    erase (uuid) {
      fetch('http://localhost:8080/member/erase/' + uuid, {
        method: 'PATCH'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    }
  },
  addMember (memberFirstName, memberSecondName, memberIDCard, memberPesel, memberPhone, memberEmail, memberAdult) {
    var data = {
      firstName: memberFirstName,
      secondName: memberSecondName,
      IDCard: memberIDCard,
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
      .then(member => {
        this.member = member
      })
  },
  name: 'members'
}
</script>
