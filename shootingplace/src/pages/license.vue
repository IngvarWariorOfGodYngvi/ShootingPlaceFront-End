<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Licencje</div>
        </q-item>
      </div>
          <q-card>
            <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" >Lista osób z licencjami NIEWAŻNYMI - ilość osób {{members2.length}}</div>
            <q-scroll-area class="q-pa-none" style="height: 600px;">
            <ol>
            <li v-for="(member,uuid) in members2" :key="uuid">
              <div class="row">
           <q-field class="col" color="black" label="Nazwisko i Imię" standout="bg-accent text-black" stack-label>
                  <div>
                    <div class="self-center col full-width no-outline row text-black" tabindex="1">{{member.secondName}} {{member.firstName}}</div>
                  </div>
           </q-field>
           <q-field v-if="member.active" class="col" color="black" label="Status" standout="bg-accent text-black" stack-label>
                  <div>
                    <div class="self-center col full-width no-outline row text-black" tabindex="1">Aktywny</div>
                  </div>
           </q-field>
           <q-field v-if="!member.active" class="col bg-red-3" color="black" label="Status" standout="bg-accent text-black" stack-label>
                  <div>
                    <div class="self-center col full-width no-outline row text-black" tabindex="1">Nieaktywny</div>
                  </div>
           </q-field>
           <q-field class="col-2" label="Numer Licencji" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{member.license.number}}</div>
           </q-field>
           <q-field class="col-2" label="Grupa" standout="bg-accent text-black" stack-label>
                  <div v-if="member.adult" class="self-center col full-width no-outline row text-black" tabindex="1">Grupa Ogólna</div>
                  <div v-if="!member.adult" class="self-center col full-width no-outline row text-black" tabindex="1">Grupa Młodzieżowa</div>
           </q-field>
           <q-field class="col-2" label="Ważność licencji" standout="bg-accent text-black" stack-label>
                  <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{member.license.validThru}}</div>
                  </div>
           </q-field>
           <q-btn color="grey-5" v-if="!member.license.paid && !member.active" class="col-1" label="opłać licencję"><q-tooltip content-class="bg-red text-subtitle2" anchor="top middle" >UREGULUJ SKŁADKI</q-tooltip></q-btn>
           <q-btn color="grey-8" v-if="!member.license.paid && member.active" class="col-1" @click="memberName = member.firstName + member.secondName,memberUUID = member.uuid,paymentLicenseAlert = true">opłać licencję</q-btn>
           <q-btn color="primary" v-if="member.license.paid" class="col-1" @click="memberName = member.firstName + member.secondName ,licensePistolPermission = member.license.pistolPermission, licenseRiflePermission = member.license.riflePermission, licenseShotgunPermission = member.license.shotgunPermission,memberUUID = member.uuid, prolongLicenseAlert = true">przedłuż licencję</q-btn>
           </div>
           <p></p>
            </li>
            </ol>
            </q-scroll-area>
            </q-card-section>
          </q-card>
          <q-card>
            <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" >Lista osób z licencjami AKTUALNYMI  - ilość osób {{members.length}}</div>
            <q-scroll-area class=" q-pa-none" style="height: 600px;">
              <ol>
            <li v-for="(member,uuid) in members" :key="uuid">
              <div class="row">
           <q-field class="col" label="Nazwisko i Imię" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{member.secondName}} {{member.firstName}}</div>
                  </div>
           </q-field>
           <q-field v-if="member.active" class="col" label="Status" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">Aktywny</div>
                  </div>
           </q-field>
           <q-field v-if="!member.active" class="col bg-red-3" label="Status" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">Nieaktywny</div>
                  </div>
           </q-field>
           <q-field class="col-2" label="Numer Licencji" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{member.license.number}}</div>
           </q-field>
           <q-field class="col-2" label="Grupa" standout="bg-accent text-black" stack-label>
                  <div v-if="member.adult" class="self-center col full-width no-outline row text-black" tabindex="1">Grupa Ogólna</div>
                  <div v-if="!member.adult" class="self-center col full-width no-outline row text-black" tabindex="1">Grupa Młodzieżowa</div>
           </q-field>
           <q-field class="col-2" label="Ważność licencji" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{member.license.validThru}}</div>
                  </div>
           </q-field>
           <q-btn color="grey-5" v-if="!member.license.paid && !member.active" class="col-1" label="opłać licencję"><q-tooltip content-class="bg-red text-subtitle2" anchor="top middle" >UREGULUJ SKŁADKI</q-tooltip></q-btn>
           <q-btn color="grey-8" v-if="!member.license.paid && member.active" class="col-1" @click="memberName = member.firstName + member.secondName,memberUUID = member.uuid,paymentLicenseAlert = true">opłać licencję</q-btn>
           <q-btn color="primary" v-if="member.license.paid" class="col-1" @click="memberName = member.firstName + member.secondName ,licensePistolPermission = member.license.pistolPermission, licenseRiflePermission = member.license.riflePermission, licenseShotgunPermission = member.license.shotgunPermission,memberUUID = member.uuid, prolongLicenseAlert = true">przedłuż licencję</q-btn>
           </div>
            <p></p>
            </li>
            </ol>
            </q-scroll-area>
            </q-card-section>
          </q-card>
    <q-dialog position="top" v-model="dataFail">
      <q-card>
        <q-card-section>
          <div class="text-h6">Coś poszło nie tak</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="prolongFail">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można przedłużyć licencji</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="doneAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Wykonano żądanie</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="paymentLicenseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy opłacić licencję {{memberName}}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="Opłać" color="primary" v-close-popup @click="showloading (),addLicenseHistoryPayment (memberUUID)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="prolongLicenseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy przedłużyć licencję {{memberName}}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="Przedłuż" color="primary" v-close-popup @click="showloading (),prolongLicense (memberUUID, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import App from 'src/App.vue'

export default {
  data () {
    return {
      members: [],
      members2: [],
      quantity: [],
      doneAlert: false,
      dataFail: false,
      prolongFail: false,
      alert: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      prolongLicenseAlert: false,
      paymentLicenseAlert: false,
      memberName: null,
      memberUUID: null,
      local: App.host
    }
  },
  created () {
    this.getMembersWithLicense()
    this.getMembersWithLicenseNotValid()
    this.getMembersWithLicenseQuantity()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    getMembersWithLicense () {
      fetch('http://' + this.local + '/license/membersWithNotValidLicense', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.members2 = response
        })
    },
    getMembersWithLicenseNotValid () {
      fetch('http://' + this.local + '/license/membersWithValidLicense', {
        method: 'GET'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    getMembersWithLicenseQuantity () {
      fetch('http://' + this.local + '/license/membersQuantity', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.quantity = response
        })
    },
    prolongLicense (uuid, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      const data = {
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission
      }
      fetch('http://' + this.local + '/license/' + uuid, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.doneAlert = true
          this.licensePistolPermission = false
          this.licenseRiflePermission = false
          this.licenseShotgunPermission = false
          this.getMembersWithLicense()
          this.getMembersWithLicenseNotValid()
          this.getMembersWithLicenseQuantity()
          this.autoClose()
        } else {
          this.prolongFail = true
          this.autoClose()
        }
      })
    },
    addLicenseHistoryPayment (uuid) {
      fetch('http://' + this.local + '/license/history/' + uuid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.doneAlert = true
          this.getMembersWithLicense()
          this.getMembersWithLicenseNotValid()
          this.autoClose()
        } else {
          this.prolongFail = true
          this.autoClose()
        }
      })
    },
    autoClose () {
      setTimeout(() => {
        this.dataFail = false
        this.prolongFail = false
        this.alert = false
        this.doneAlert = false
      }, 2000)
    }
  },
  name: 'otherFunction'
}
</script>
