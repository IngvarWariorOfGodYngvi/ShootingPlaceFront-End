<template>
  <q-page padding>
    <div>
      <q-card class="row">
      <q-item-section class="col">
      <q-item><q-input v-model="search" placeholder="Nazwisko" label="Wyszukaj po Nazwisku" /></q-item>
      <q-item><q-btn color="primary" label="Wyszukaj" @click="handleScroll(search)"/></q-item>
      </q-item-section>
      <q-item-section class="col">
      <q-item><q-input v-model="search" placeholder="Numer" label="Wyszukaj po Legitymacji" /></q-item>
      <q-item><q-btn color="primary" label="Wyszukaj" @click="handleScroll(search)"/></q-item>
      </q-item-section>
      </q-card>
    </div>
  <div class="q-pa-md">
    <q-list>
      <q-expansion-item v-for="members in members" :key="members.uuid" group="somegroup" :id="members.secondName">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar v-if="members.weaponPermission.isExist&&!members.license.isValid" icon="warning" color="red" text-color="white" />
            <q-avatar v-else-if="(members.email==null||members.email=='')
            ||(members.address.postOfficeCity===null||members.address.postOfficeCity==='')
            ||(members.address.street==null||members.address.street=='')" icon="warning" color="warning" text-color="white" />
            <q-avatar v-else icon="perm_identity" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
          <q-item-label>{{members.secondName}} {{members.firstName}}</q-item-label>
          <q-item-label caption lines="2">Składka ważna do {{members.contribution.contribution}}</q-item-label>
           <q-item-label caption lines="2">Składka opłacona dnia {{members.contribution.paymentDay}}</q-item-label>
          </q-item-section>
          <q-item-section>
          <q-item-label caption lines="2">Numer PESEL {{members.pesel}}</q-item-label>
          <q-item-label caption lines="2">Data Zapisu {{members.joinDate}}</q-item-label>
          <q-item-label caption lines="2" :id="members.legitimationNumber">Numer Legitymacji {{members.legitimationNumber}}</q-item-label>
          </q-item-section>
        </template>

        <q-card>
          <q-item>
              <q-card-section class="col">
                  <q-item><q-item-label>Historia Składek</q-item-label></q-item>
                  <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 230px; max-width: 300px;">
                <div class="q-pa-xs">
                 <q-item-section>
                <q-item v-for="contributionRecord in members.history.contributionRecord" :key="contributionRecord"><q-item-label>Opłacona dnia {{contributionRecord}}</q-item-label></q-item>
                </q-item-section>
                 </div>
                 </q-scroll-area>
              </q-card-section>
              <q-card-section class="col">
              <q-item-section v-if="!members.license.number!=null||members.adult">
                <q-item><q-item-label >Licencja</q-item-label></q-item>
                <q-item-label caption lines="2">Numer Licencji {{members.license.number}}</q-item-label>
                <q-item-label caption lines="2">Ważna do {{members.license.validThru}}</q-item-label>
                <q-item-label >Dyscypliny :</q-item-label>
                <q-item-label caption lines="2" v-if="members.license.pistolPermission">P</q-item-label>
                <q-item-label caption lines="2" v-if="!members.license.pistolPermission&&members.history.licenseHistory[ 0 ]=='Pistolet'">P Kiedyś posiadał licencję</q-item-label>
                <q-item-label caption lines="2" v-if="members.license.riflePermission">K</q-item-label>
                <q-item-label caption lines="2" v-if="!members.license.riflePermission&&members.history.licenseHistory[ 1 ]=='Karabin'">K Kiedyś posiadał licencję</q-item-label>
                <q-item-label caption lines="2" v-if="members.license.shotgunPermission">S</q-item-label>
                <q-item-label caption lines="2" v-if="!members.license.shotgunPermission&&members.history.licenseHistory[ 2 ]=='Strzelba'">S Kiedyś posiadał licencję</q-item-label>
              </q-item-section>
              <q-scroll-area v-if="members.history.licensePaymentHistory!=null" :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 100px; max-width: 300px;">
              <q-item v-for="licensePaymentHistory in members.history.licensePaymentHistory" :key="licensePaymentHistory" ><q-item-label>Opłacona dnia {{licensePaymentHistory}}</q-item-label></q-item>
              </q-scroll-area>
              <q-item v-if="members.license.pistolPermission
                &&members.license.riflePermission
                &&members.license.shotgunPermission"><q-item-label >Klubowicz posiada już całą Licencję</q-item-label></q-item>
              </q-card-section>
              <q-card-section class="col">
                <q-item-section>
                <q-item v-if="(members.memberPermissions.instructorNumber!=null&&members.memberPermissions.instructorNumber!='')
                ||(members.memberPermissions.shootingLeaderNumber!=null&&members.memberPermissions.shootingLeaderNumber!='')
                ||(members.memberPermissions.arbiterNumber!=null&&members.memberPermissions.arbiterNumber!='')
                ||(members.weaponPermission.number!=null&&members.weaponPermission.isExist)
                ||members.shootingPatent.patentNumber!=null"><q-item-label>Informacje o Uprawnieniach</q-item-label></q-item>
                  <q-item-label v-if="(members.weaponPermission.number!=null&&members.weaponPermission.isExist)">Numer Pozwolenia {{members.weaponPermission.number}}</q-item-label>
                  <q-item-label v-if="(members.memberPermissions.shootingLeaderNumber!=null&&members.memberPermissions.shootingLeaderNumber!='')" caption lines="2">Prowadzący Strzelanie {{members.memberPermissions.shootingLeaderNumber}}</q-item-label>
                  <q-item-label v-if="(members.memberPermissions.instructorNumber!=null&&members.memberPermissions.instructorNumber!='')" caption lines="2">Instruktor {{members.memberPermissions.instructorNumber}}</q-item-label>
                  <q-item-label v-if="(members.memberPermissions.arbiterNumber!=null&&members.memberPermissions.arbiterNumber!='')" caption lines="2">Sędzia</q-item-label>
                  <q-item-label v-if="(members.memberPermissions.arbiterNumber!=null&&members.memberPermissions.arbiterNumber!='')" caption lines="2">numer {{members.memberPermissions.arbiterNumber}}</q-item-label>
                  <q-item-label v-if="(members.memberPermissions.arbiterNumber!=null&&members.memberPermissions.arbiterNumber!='')" caption lines="2">{{members.memberPermissions.arbiterClass}}</q-item-label>
                  <q-item-label v-if="(members.memberPermissions.arbiterNumber!=null&&members.memberPermissions.arbiterNumber!='')" caption lines="2">Ważna do {{members.memberPermissions.arbiterPermissionValidThru}}</q-item-label>
                  <q-item-label v-if="members.shootingPatent.patentNumber!=null" caption lines="2" >Numer Patentu {{members.shootingPatent.patentNumber}}</q-item-label>
                  <q-item-label v-if="members.weaponPermission.number!=null&&members.weaponPermission.isExist">Numer Pozwolenia {{members.weaponPermission.number}}</q-item-label>
                 </q-item-section>
                <q-expansion-item label="Opcje Dodatkowe">
              <q-item-section class="text-justify">
                <q-item-section v-if="members.shootingPatent.patentNumber!=null" >
                <q-item-label >Patent</q-item-label>
                <q-item-label caption lines="2" >Numer Patentu {{members.shootingPatent.patentNumber}}</q-item-label>
                <q-item-label caption lines="2" >Przyznany dnia {{members.shootingPatent.dateOfPosting}}</q-item-label>
                <q-item-label >Dyscypliny :</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.pistolPermission">P {{members.history.patentDay[ 0 ]}}</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.riflePermission">K {{members.history.patentDay[ 1 ]}}</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.shotgunPermission">S {{members.history.patentDay[ 2 ]}}</q-item-label>
                </q-item-section>
              <q-item v-if="members.shootingPatent.pistolPermission
                &&members.shootingPatent.riflePermission
                &&members.shootingPatent.shotgunPermission"><q-item-label>Klubowicz posiada cały Patent</q-item-label></q-item>
                </q-item-section>
                <q-expansion-item label="Przywróć do łask Prezesa" group="right-card">
                <q-item class="bg-red" ><q-item-label>Czy napewno chcesz Wskrzesić osobę?</q-item-label></q-item>
                <q-item class="bg-red" ><q-btn label="Wskrześ" color="red" @click="uuid=members.uuid,resurectConfirm=true"/></q-item>
                </q-expansion-item>
                </q-expansion-item>
                <q-expansion-item label="Historia startów">
              <q-item><q-item-label>Tutaj będzie historia startów w zawodach</q-item-label></q-item>
                </q-expansion-item>
          </q-card-section>
          </q-item>
        </q-card>
        <q-card>
          <q-item>
          <q-card-section>
            <q-item-section class="col">
            <q-item-label>Dane Podstawowe</q-item-label>
            <q-item-label caption lines="2">Identyfikator : {{members.uuid}}</q-item-label>
            <q-item-label caption lines="2">Imię : {{members.firstName}}</q-item-label>
            <q-item-label caption lines="2">Nazwisko : {{members.secondName}}</q-item-label>
            <q-item-label caption lines="2">Data Zapisu do Klubu : {{members.joinDate}}</q-item-label>
            <q-item-label caption lines="2">Pesel : {{members.pesel}}</q-item-label>
            <q-item-label caption lines="2">Numer Dowodu : {{members.idcard}}</q-item-label>
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
            </q-item-section>
          </q-card-section>
          </q-item>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
<q-dialog v-model="resurectConfirm" persistent>
      <q-card class="bg-red">
        <q-card-section class="row items-center">
          <q-avatar icon="warning"/>
          <span class="q-ml-sm">Czy napewno chcesz przywrócić Klubowicza do listy członków klubu?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="white" v-close-popup />
          <q-btn flat label="usuń" color="white" v-close-popup @click="erase(uuid),resurectAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>

<q-dialog v-model="resurectAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Klubowicz Został Wskrzeszony</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
  </q-page>
</template>

<script>

import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll

export default {
  data () {
    return {
      active: true,
      adult: true,
      value: false,
      value1: false,
      value2: false,
      value3: false,
      value4: false,
      arbiterAlert: false,
      arbiterProlongAlert: false,
      arbiterUpdateClassAlert: false,
      changAdultConfirm: false,
      eraseAlert: false,
      eraseConfirm: false,
      contributionRecord: '',
      basicDataConfirm: false,
      contributionAlert: false,
      addressConfirm: false,
      HistoryContributionRecord: null,
      contributionRecordConfirm: false,
      contributionRecordAlert: false,
      alert: false,
      patentAlert: false,
      licenseAlert: false,
      weapon: false,
      basicDataAlert: false,
      addressDataAlert: false,
      deactivateAlert: false,
      instructorAlert: false,
      shootingLeaderAlert: false,
      contribution: false,
      deactivate: false,
      eraseWeapon: false,
      licensePayment: false,
      instructorConfirm: false,
      shootingLeaderConfirm: false,
      arbiterConfirm: false,
      arbiterProlongConfirm: false,
      arbiterUpdateClassConfirm: false,
      number: '',
      patentNumber: '',
      licenseNumber: '',
      validThru: '',
      members: [],
      resurectAlert: false,
      resurectConfirm: false,
      patentDate: null,
      patentPistolPermission: false,
      patentRiflePermission: false,
      patentShotgunPermission: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      permissionsInstructorNumber: '',
      permissionsShootingLeaderNumber: '',
      permissionsArbiterNumber: '',
      permissionsArbiterPermissionValidThru: '',
      ordinal: '',
      weaponPermissionNumber: '',
      secondName: '',
      isExist: false,
      memberEmail: '',
      memberPhoneNumber: '',
      memberIdcard: '',
      memberSecondName: '',
      memberPostOfficeCity: '',
      memberZipCode: '',
      memberStreet: '',
      memberStreetNumber: '',
      memberFlatNumber: '',
      search: '',
      address: [],
      uuid: null,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      }
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
    handleScroll (search) {
      const ele = document.getElementById(search)
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop - ele.scrollHeight
      const duration = 500
      setScrollPosition(target, offset, duration)
    },
    getListMembers () {
      fetch('http://localhost:8080/member/erased', {
        method: 'GET'
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
          this.eraseAlert = true
        })
    }
  },
  name: 'members'
}
</script>
