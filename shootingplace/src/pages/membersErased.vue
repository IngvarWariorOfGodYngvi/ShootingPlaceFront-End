<template>
  <q-page padding>
    <div>
      <q-card class="row">
      <q-item-section class="col">
      <q-item><q-input v-model="search" placeholder="Nazwisko" label="Wyszukaj po Nazwisku"/></q-item>
      <q-item><q-btn color="primary" label="Wyszukaj" @click="handleScroll(search)"/></q-item>
      </q-item-section>
      <q-item-section class="col">
      <q-item><q-input v-model="search" placeholder="Numer" label="Wyszukaj po Legitymacji"/></q-item>
      <q-item><q-btn color="primary" label="Wyszukaj" @click="handleScroll(search)"/></q-item>
      </q-item-section>
      <q-item-section side top>
      <q-item><q-btn color="primary" label="Odświeź" @click="showloading(),reload()"/></q-item>
      </q-item-section>
      </q-card>
    </div>
      <div class="q-pa-md">
    <q-list>
      <q-expansion-item v-for="members in members" :key="members.uuid" group="somegroup" :id="members.secondName">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar icon="person_remove" color="brown" text-color="white" />
          </q-item-section>
          <q-item-section>
          <q-item-label>{{members.secondName}} {{members.firstName}}</q-item-label>
          <q-item-label caption lines="2">Składka ważna do {{members.contribution.contribution}}</q-item-label>
           <q-item-label caption lines="2">Składka opłacona dnia {{members.contribution.paymentDay}}</q-item-label>
          </q-item-section>
          <q-item-section>
          <q-item-label caption lines="2">Numer dowodu {{members.idcard}}</q-item-label>
          <q-item-label caption lines="2">Data zapisu {{members.joinDate}}</q-item-label>
           <q-item-label caption lines="2" :id="members.legitimationNumber">Numer legitymacji {{members.legitimationNumber}}</q-item-label>
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
              <q-item-label v-if="members.license.pistolPermission
                &&members.license.riflePermission
                &&members.license.shotgunPermission">Klubowicz Posiada już całą Licencję</q-item-label>
              </q-card-section>
              <q-card-section class="col">
              <q-item-section>
                <q-expansion-item label="Historia Składek" group="right-card">
                <q-item v-for="record in members.contribution.history.record" :key="record"><q-item-label>{{record}}</q-item-label></q-item>
                </q-expansion-item >
                </q-item-section>
                <q-item-section>
                  <q-expansion-item label="Pozwolenie na Broń" group="right-card">
                <q-item v-if="members.weaponPermission.number!=null&&members.weaponPermission.isExist" ><q-item-label>Numer Pozwolenia {{members.weaponPermission.number}}</q-item-label></q-item>
                <q-item v-if="!members.weaponPermission.isExist"><q-item-label >Nie posiada</q-item-label></q-item>
                  </q-expansion-item>
                </q-item-section>
                <q-item-section>
                  <q-expansion-item label="Przywróć do Łask Prezesa" group="right-card">
                  <q-item><q-item-label v-if="members.erased">Czy napewno chcesz Wskrzesić osobę?</q-item-label></q-item>
                  <q-item><q-item-label v-if="members.erased">Osoba będzie miała status nieaktywny</q-item-label></q-item>
                <q-item><q-btn label="Przenieś" color="red" @click="uuid=members.uuid,confirm=true"/></q-item>
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
            </q-item-section>
          </q-card-section>
          </q-item>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
  <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno chcesz by człowiek dalej nosił stalowe szafy z piętra na parter?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="przywróć" color="primary" v-close-popup @click=" erase(uuid),reload()" />
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
      uuid: null,
      confirm: false,
      number: '',
      patentNumber: '',
      licenseNumber: '',
      validThru: '',
      members: [],
      dateOfPosting: false,
      patentPistolPermission: false,
      patentRiflePermission: false,
      patentShotgunPermission: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      weaponPermission: true,
      search: ''
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
      fetch('http://localhost:8080/member/erased?erased=true', {
        method: 'GET'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    reload () {
      window.location.reload()
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
  name: 'members'
}
</script>
