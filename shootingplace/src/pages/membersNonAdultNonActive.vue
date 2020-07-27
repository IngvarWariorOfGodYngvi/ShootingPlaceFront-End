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
          <q-item-label caption lines="2">Data zapisu {{members.joinDate}}</q-item-label>
          <q-item-label caption lines="2" :id="members.legitimationNumber">Numer legitymacji {{members.legitimationNumber}}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn color="primary" label="Dodaj do książki" @click="uuid=members.uuid,alert=true"/>
          </q-item-section>
          <q-item-section side top>
            <q-btn color="primary" label="Przedłuż składkę" @click="uuid=members.uuid,confirm=true"/>
          </q-item-section>
        </template>

        <q-card>
          <q-item  >
          <q-card-section class="col">
              <q-item-section v-if="members.shootingPatent.patentNumber!=null" >
                <q-item-label >Patent</q-item-label>
                <q-item-label caption lines="2" >Numer Patentu {{members.shootingPatent.patentNumber}}</q-item-label>
                <q-item-label caption lines="2" >Przyznany dnia {{members.shootingPatent.dateOfPosting}}</q-item-label>
                <q-item-label >Dyscypliny :</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.pistolPermission">P</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.riflePermission">K</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.shotgunPermission">S</q-item-label>
              </q-item-section>
             <q-item><q-item-label v-if="members.shootingPatent.pistolPermission
                &&members.shootingPatent.riflePermission
                &&members.shootingPatent.shotgunPermission">Klubowicz Posiada już cały patent</q-item-label></q-item>
              </q-card-section>
              <q-card-section class="col">
              <q-item-section v-if="members.license.number!=null&&!members.adult">
                <q-item-label >Licencja</q-item-label>
                <q-item-label caption lines="2">Numer Licencji {{members.license.number}}</q-item-label>
                <q-item-label caption lines="2">Ważna do {{members.license.validThru}}</q-item-label>
                <q-item-label >Dyscypliny :</q-item-label>
                <q-item-label caption lines="2" v-if="members.license.pistolPermission">P</q-item-label>
                <q-item-label caption lines="2" v-if="members.license.riflePermission">K</q-item-label>
                <q-item-label caption lines="2" v-if="members.license.shotgunPermission">S</q-item-label>
              </q-item-section>
              <q-item><q-item-label v-if="members.license.pistolPermission
                &&members.license.riflePermission
                &&members.license.shotgunPermission">Klubowicz Posiada już całą Licencję</q-item-label></q-item>
              <q-btn v-if="members.license.number!=null&&(members.license.pistolPermission||members.license.riflePermission||members.license.shotgunPermission)" color="primary" label="Przedłuż Licencję" @click="showloading(),prolongLicense(members.uuid)"/>
              </q-card-section>
              <q-card-section class="col">
              <q-item-section>
                <q-expansion-item label="Historia Składek" group="right-card">
                <q-item v-for="record in members.contribution.history.record" :key="record"><q-item-label>{{record}}</q-item-label></q-item>
                <q-item-section side top>
                <q-btn color="primary" label="Przedłuż składkę" @click="uuid=members.uuid,confirm=true"/>
                </q-item-section>
                </q-expansion-item>
                </q-item-section>
                <q-item-section>
                  <q-expansion-item label="Przenieś do grupy Dorosłej" group="right-card">
                    <q-item><q-item-label>Zmiana będzie trwała</q-item-label></q-item>
                <q-item><q-btn label="Przenieś" color="warning" @click="uuid=members.uuid,confirm2=true"/></q-item>
                  </q-expansion-item>
                </q-item-section>
                <q-item-section>
                  <q-expansion-item label="Skreśl z Listy Klubowiczów" group="right-card">
                  <q-item><q-item-label v-if="!members.erased">Czy napewno chcesz skreślić osobę?</q-item-label></q-item>
                <q-item><q-btn label="Przenieś" color="red" @click="uuid=members.uuid,confirm1=true"/></q-item>
                  </q-expansion-item>
                </q-item-section>
                <q-item-section>
                  <q-item><q-btn label="Pobierz Kartę członkowską" color="secondary" @click="showloading()"/></q-item>
                </q-item-section>
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
            <q-item-section side top>
            <q-expansion-item label="Zmień numer Dowodu">
                <q-item><q-input v-model="memberIdcard" hint="XXX000000" label="Numer Dowodu" placeholder="XXX000000"/></q-item>
                <q-item><q-input v-model="memberSecondName" label="Nazwisko" /></q-item>
                <q-item><q-btn label="Aktualizuj" color="primary" @click="updateIDCardAndName(members.uuid,memberIdcard,memberSecondName)"/></q-item>
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
                <q-item><q-input v-model="memberEmail" label="e-mail" /></q-item>
                <q-item><q-input v-model="memberPhoneNumber" hint="tylko cyfry" label="Numer Telefonu" placeholder="tylko cyfry" /></q-item>
                <q-item><q-input v-model="memberPostOfficeCity" label="Miasto" /></q-item>
                <q-item><q-input v-model="memberZipCode" hint="00-000" label="Kod Pocztowy" placeholder="00-000" /></q-item>
                <q-item><q-input v-model="memberStreet" label="Ulica" /></q-item>
                <q-item><q-input v-model="memberStreetnumber" label="Numer Ulicy" /></q-item>
                <q-item><q-input v-model="memberFlatNumber" label="Numer mieszkania" /></q-item>
                <q-item><q-btn label="Aktualizuj" color="primary" @click="updateMember(members.uuid, memberEmail, memberPhoneNumber),
                updateAddress(members.uuid, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber)
                "/></q-item>
            </q-expansion-item>
            </q-item-section>
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
          <span class="q-ml-sm">Czy przedłużyć składkę?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="przedłuż" color="primary" v-close-popup @click="prolongContribution(uuid),reload()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
<q-dialog v-model="confirm1" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno Skreślić z listy członków?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Skreśl" color="primary" v-close-popup @click="erase(uuid),alert4=true" />
        </q-card-actions>
      </q-card>
    </q-dialog>
<q-dialog v-model="confirm2" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno przenieść do Grupy dorosłych??</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Skreśl" color="primary" v-close-popup @click="changeAdult (uuid),alert1=true" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zapisany do książki pobytu</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),addMemberToEvidence(uuid)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert1">
      <q-card>
        <q-card-section>
          <div class="text-h6">Przeniesiono do Grupy Dorosłej</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert2">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zaktualizowano dane podstawowe</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert3">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zaktualizowano dane adresowe</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert4">
      <q-card>
        <q-card-section>
          <div class="text-h6">Przeniesiono do Skreślonych z listy</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
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
      alert: false,
      alert1: false,
      alert2: false,
      alert3: false,
      alert4: false,
      confirm: false,
      confirm1: false,
      confirm2: false,
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
      isExist: false,
      memberEmail: '',
      memberPhoneNumber: '',
      memberIdcard: '',
      memberSecondName: '',
      memberPostOfficeCity: '',
      memberZipCode: '',
      memberStreet: '',
      memberStreetnumber: '',
      memberFlatNumber: '',
      search: '',
      address: []
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
    addMemberToEvidence (uuid) {
      fetch('http://localhost:8080/evidence/' + uuid, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(members => {
          this.members = members
          this.reload()
        })
    },
    updateMember (uuid, email, phoneNumber, idcard) {
      var data = {
        email: email,
        phoneNumber: phoneNumber,
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
    updateIDCardAndName (uuid, idcard, secondName) {
      var data = {
        idcard: idcard,
        secondName: secondName
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
          this.alert4 = true
        })
    },
    updateAddress (uuid, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber) {
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
        .then(address => {
          this.address = address
          this.alert5 = true
        })
    },
    getListMembers () {
      fetch('http://localhost:8080/member/activelist?active=false&adult=false&erase=false', {
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
    changeAdult (uuid) {
      fetch('http://localhost:8080/member/adult/' + uuid, {
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
  name: 'members'
}
</script>
