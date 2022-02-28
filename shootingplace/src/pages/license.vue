<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Licencje</div>
        </q-item>
      </div>
      <q-expansion-item label="Licencje nieważne" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
          <q-card class="text-body2">
            <div class="row">
          <div class="q-pa-md text-left col full-width no-outline text-h5 text-bold" >Ilość osób {{members2.length}}</div>
          <div v-if="licenseList.length>0" class="q-pa-md text-right"><q-btn @click="memberName='WSZYSCY - którzy mają zaznaczone opłacono w PZSS', prolongLicenseAlertAll=true" label="przedłuż zaznaczone">({{licenseList.length}})</q-btn></div>
            </div>
            <q-virtual-scroll :items="members2" style="height: 600px;">
              <template v-slot="{ item, index }">
                <div :key="index" dense class="row">
            <div class="self-center text-center no-outline row text-black" tabindex="1">{{index+1}}.</div>
            <q-checkbox v-if="item.license.paid" v-model="licenseList" :val="item.uuid"/>
            <q-checkbox color="grey" v-else disable/>
           <q-field class="col" color="black" label="Nazwisko i Imię" standout="bg-accent text-black" stack-label>
                  <div>
                    <div class="self-center col full-width no-outline row text-black" tabindex="1">{{item.secondName}} {{item.firstName}}</div>
                  </div>
           </q-field>
           <q-field v-if="item.active" class="col" color="black" label="Status" standout="bg-accent text-black" stack-label>
                  <div>
                    <div class="self-center col full-width no-outline row text-black" tabindex="1">Aktywny</div>
                  </div>
           </q-field>
           <q-field v-if="!item.active" class="col bg-red-3" color="black" label="Status" standout="bg-accent text-black" stack-label>
                  <div>
                    <div class="self-center col full-width no-outline row text-black" tabindex="1">Nieaktywny</div>
                  </div>
           </q-field>
           <q-field class="col-2" label="Numer Licencji" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{item.license.number}}</div>
           </q-field>
           <q-field class="col-2" label="Grupa" standout="bg-accent text-black" stack-label>
                  <div v-if="item.adult" class="self-center col full-width no-outline row text-black" tabindex="1">Grupa Ogólna</div>
                  <div v-if="!item.adult" class="self-center col full-width no-outline row text-black" tabindex="1">Grupa Młodzieżowa</div>
           </q-field>
           <q-field class="col-2" label="Ważność licencji" standout="bg-accent text-black" stack-label>
                  <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{item.license.validThru}}</div>
                  </div>
           </q-field>
           <q-btn color="grey-5" v-if="!item.license.paid && !item.active" class="col-1" label="opłać licencję"><q-tooltip content-class="bg-red text-subtitle2" anchor="top middle" >UREGULUJ SKŁADKI</q-tooltip></q-btn>
           <q-btn color="grey-8" v-if="!item.license.paid && item.active" class="col-1" @click="memberName = item.firstName + item.secondName,memberUUID = item.uuid,paymentLicenseAlert = true">opłać licencję</q-btn>
           <q-btn color="primary" v-if="item.license.paid" class="col-1" @click="memberName = item.firstName + item.secondName ,licensePistolPermission = item.license.pistolPermission, licenseRiflePermission = item.license.riflePermission, licenseShotgunPermission = item.license.shotgunPermission,memberUUID = item.uuid, prolongLicenseAlert = true">przedłuż licencję</q-btn>
                </div>
              </template>
            </q-virtual-scroll>
          </q-card>
      </q-expansion-item>
      <p></p>
      <q-expansion-item label="Licencje ważne" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
          <q-card class="text-body2">
            <div class="row">
          <div class="q-pa-md text-left col full-width no-outline text-h5 text-bold" >Ilość osób {{members.length}}</div>
          <div v-if="licenseList.length>0" class="q-pa-md text-right"><q-btn @click="memberName='WSZYSCY - którzy mają zaznaczone opłacono w PZSS', prolongLicenseAlertAll=true" label="przedłuż zaznaczone">({{licenseList.length}})</q-btn></div>
            </div>
            <q-virtual-scroll :items="members" style="height: 600px;">
              <template v-slot="{ item, index }">
                <div :key="index" dense class="row">
           <div class="self-center text-center no-outline row text-black" tabindex="1">{{index+1}}.</div>
           <q-checkbox v-if="item.license.paid" v-model="licenseList" :val="item.uuid"/>
           <q-checkbox color="grey" v-else disable/>
           <q-field class="col" label="Nazwisko i Imię" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{item.secondName}} {{item.firstName}}</div>
                  </div>
           </q-field>
           <q-field v-if="item.active" class="col" label="Status" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">Aktywny</div>
                  </div>
           </q-field>
           <q-field v-if="!item.active" class="col bg-red-3" label="Status" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">Nieaktywny</div>
                  </div>
           </q-field>
           <q-field class="col-2" label="Numer Licencji" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{item.license.number}}</div>
           </q-field>
           <q-field class="col-2" label="Grupa" standout="bg-accent text-black" stack-label>
                  <div v-if="item.adult" class="self-center col full-width no-outline row text-black" tabindex="1">Grupa Ogólna</div>
                  <div v-if="!item.adult" class="self-center col full-width no-outline row text-black" tabindex="1">Grupa Młodzieżowa</div>
           </q-field>
           <q-field class="col-2" label="Ważność licencji" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{item.license.validThru}}</div>
                  </div>
           </q-field>
           <q-btn color="grey-5" v-if="!item.license.paid && !item.active" class="col-1" label="opłać licencję"><q-tooltip content-class="bg-red text-subtitle2" anchor="top middle" >UREGULUJ SKŁADKI</q-tooltip></q-btn>
           <q-btn color="grey-8" v-if="!item.license.paid && item.active" class="col-1" @click="memberName = item.firstName + item.secondName,memberUUID = item.uuid,paymentLicenseAlert = true">opłać licencję</q-btn>
           <q-btn color="primary" v-if="item.license.paid" class="col-1" @click="memberName = item.firstName + item.secondName ,licensePistolPermission = item.license.pistolPermission, licenseRiflePermission = item.license.riflePermission, licenseShotgunPermission = item.license.shotgunPermission,memberUUID = item.uuid, prolongLicenseAlert = true">przedłuż licencję</q-btn>
                </div>
              </template>
            </q-virtual-scroll>
          </q-card>
      </q-expansion-item>
      <p/>
      <q-expansion-item label="Licencje do opłacenia w PZSS" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
                  <q-card class="text-body2">
            <div class="row">
          <div class="q-pa-md text-left col full-width no-outline text-h5 text-bold" >Ilość osób {{quantitySumLicensePayment.length}}</div>
            <div v-if="payPZSSList.length>0" class="q-pa-md text-right"><q-btn @click="paymentLicenseAlertPZSS=true" label="Oznacz wybrane jako opłacone w pzss">({{payPZSSList.length}})</q-btn></div>
            </div>
            <q-virtual-scroll :items="quantitySumLicensePayment" style="height: 600px;">
              <template v-slot="{ item, index }">
                <div :key="index" dense class="row">
           <div class="self-center text-center no-outline row text-black" tabindex="1">{{index+1}}.</div>
           <q-checkbox v-model="payPZSSList" :val="item.paymentUuid"/>
           <q-field class="col" label="Nazwisko i Imię" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{item.firstName}} {{item.secondName}}</div>
                  </div>
           </q-field>
            <q-field class="col-2" label="Grupa" standout="bg-accent text-black" stack-label>
                  <div v-if="item.adult" class="self-center col full-width no-outline row text-black" tabindex="1">Grupa Ogólna</div>
                  <div v-if="!item.adult" class="self-center col full-width no-outline row text-black" tabindex="1">Grupa Młodzieżowa</div>
           </q-field>
           <q-field v-if="item.active" class="col" label="Status" standout="bg-accent text-black" stack-label>
                  <div>
                    <div class="self-center col full-width no-outline row text-black" tabindex="1">Aktywny</div>
                  </div>
           </q-field>
           <q-field v-if="!item.active" class="col bg-red-3" label="Status" standout="bg-accent text-black" stack-label>
                  <div>
                    <div class="self-center col full-width no-outline row text-black" tabindex="1">Nieaktywny</div>
                  </div>
           </q-field>
           <q-field class="col-2" label="Data wpłaty" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{item.date}}</div>
                  </div>
           </q-field>
           <q-field class="col-2" label="Na Rok" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">{{item.validForYear}}</div>
           </q-field>
           <q-field v-if="!item.new" class="col-2" label="Rodzaj" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">Przedłużenie</div>
           </q-field>
           <q-field v-if="item.new" class="col-2 bg-warning" label="Rodzaj" standout="bg-acceny text-black" stack-label>
                  <div class="self-center col full-width no-outline row text-black" tabindex="1">Nowa</div>
           </q-field>
                </div>
              </template>
            </q-virtual-scroll>
          </q-card>
      </q-expansion-item>
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
    <q-dialog v-model="paymentLicenseAlertPZSS">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy opłacić licencje</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="Opłać" color="primary" v-close-popup @click="pinWindowPZSS = true"/>
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
    <q-dialog v-model="prolongLicenseAlertAll" @keypress.enter="pinWindow=true, prolongLicenseAlertAll=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy przedłużyć licencję {{memberName}}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="Przedłuż" color="primary" v-close-popup @click="pinWindow=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="failure">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{message}}</div>
          <div v-else class="text-h6">Nie można wykonać żądania. Sprawdź poprawność danych.</div>
        </q-card-section>

      </q-card>
</q-dialog>
<q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{message}}</div>
        </q-card-section>

      </q-card>
</q-dialog>
<q-dialog v-model="pinWindow" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="prolongLicenseList(),pinWindow=false" autofocus type="password" v-model="pinCode" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="pinCode=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup @click="prolongLicenseList(), pinCode=null" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="pinWindowPZSS" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="toggleHistoryPayment(),pinWindowPZSS=false" autofocus type="password" v-model="pinCode" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="pinCode=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup @click="toggleHistoryPayment(), pinCode=null" />
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
      success: false,
      failure: false,
      message: null,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      prolongLicenseAlert: false,
      prolongLicenseAlertAll: false,
      paymentLicenseAlert: false,
      memberName: null,
      memberUUID: null,
      licenseList: [],
      quantitySumLicensePayment: [],
      payPZSSList: [],
      pinCode: null,
      pinWindow: false,
      pinWindowPZSS: false,
      paymentLicenseAlertPZSS: false,
      local: App.host
    }
  },
  created () {
    this.getMembersWithLicense()
    this.getMembersWithLicenseNotValid()
    this.getAllLicencePayment()
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
    getAllLicencePayment () {
      fetch('http://' + this.local + '/license/allLicencePayment', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.quantitySumLicensePayment = response
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
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.licensePistolPermission = false
              this.licenseRiflePermission = false
              this.licenseShotgunPermission = false
              this.getMembersWithLicense()
              this.getMembersWithLicenseNotValid()
              this.autoClose()
            }
          )
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    prolongLicenseList () {
      fetch('http://' + this.local + '/license/prolongAll?licenseList=' + this.licenseList + '&pinCode=' + this.pinCode, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.licensePistolPermission = false
              this.licenseRiflePermission = false
              this.licenseShotgunPermission = false
              this.licenseList = []
              this.getMembersWithLicense()
              this.getMembersWithLicenseNotValid()
              this.autoClose()
            }
          )
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
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
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.getMembersWithLicense()
              this.getMembersWithLicenseNotValid()
              this.getAllLicencePayment()
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    toggleHistoryPayment () {
      fetch('http://' + this.local + '/license/paymentToggleArray?paymentUUIDs=' + this.payPZSSList + '&pinCode=' + this.pinCode, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.payPZSSList = []
              this.getMembersWithLicense()
              this.getMembersWithLicenseNotValid()
              this.getAllLicencePayment()
              this.showloading()
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.message = null
        this.pinCode = null
      }, 2000)
    }
  },
  name: 'otherFunction'
}
</script>
