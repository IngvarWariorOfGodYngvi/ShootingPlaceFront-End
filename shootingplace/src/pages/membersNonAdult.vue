<template>
  <q-page padding>
      <div class="q-pa-md">
    <q-list bordered class="rounded-borders">
      <q-expansion-item v-for="members in members" :key="members.uuid">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar v-if="members.weaponPermission&&!members.license.isValid" icon="warning" color="red" text-color="white" />
            <q-avatar v-if="members.email==null" icon="warning" color="warning" text-color="white" />
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

        <q-card>
          <q-item>
          <q-card-section class="col">
              <q-item-section >
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
                  <q-item-label>Grupa Młodzieżowa</q-item-label>
                <q-item-label v-if="!members.adult">TAK</q-item-label>
                <q-item-label v-else>NIE</q-item-label>
                  <q-item-label v-if="!members.license.isValid&&members.weaponPermission">POSIADA NIE WAŻNĄ LICENCJĘ!!!</q-item-label>
                  <q-expansion-item label="rozwiń">
                    <q-item-label v-if="members.license.isValid" >Posiada ważną licencję</q-item-label>
                <q-item><q-btn label="zmień" color="primary" @click="showloading(),changeAdult(members.uuid),reload()"/></q-item>
                  </q-expansion-item>
                </q-item-section>
          </q-card-section>
          </q-item>
        </q-card>
        <q-card>
          <q-item>
          <q-card-section >
            <q-item-section>
            <q-item-label>Dane Podstawowe</q-item-label>
            <q-item-label caption lines="2">Identyfikator {{members.uuid}}</q-item-label>
            <q-item-label caption lines="2">Imię {{members.firstName}}</q-item-label>
            <q-item-label caption lines="2">Nazwisko {{members.secondName}}</q-item-label>
            <q-item-label caption lines="2">Data Zapisu do Klubu {{members.joinDate}}</q-item-label>
            <q-item-label caption lines="2">Pesel {{members.pesel}}</q-item-label>
            <q-item-section side top>
            <q-btn color="primary"
            label="Aktualizuj dane podstawowe"
            @click="showloading()"/>
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
            <q-item-label caption lines="2">Mieszkania {{members.address.flatNumber}}</q-item-label>
            <q-item-section side top >
            <q-btn color="primary"
            label="Aktualizuj dane kontaktowe"
            @click="showloading()"/>
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
      weaponPermission: true
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
      fetch('http://localhost:8080/member/activelist?active=true&adult=false', {
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
    reload () {
      window.location.reload()
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
    changeAdult (uuid) {
      fetch('http://localhost:8080/member/adult/' + uuid, {
        method: 'PATCH'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    }
  },
  name: 'members'
}
</script>
