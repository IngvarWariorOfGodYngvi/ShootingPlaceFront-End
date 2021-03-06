<template>
  <q-page padding>
      <q-card class="row">
        <q-card-section class="col">
      <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista osób spoza klubu</div>
          <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
            <ol>
        <li v-for="(others,id) in others" :key="id">
          <div class="row">
           <q-field class="col" label="Nazwisko" standout stack-label>
                <template v-slot:control>
                    <div>
                        <div class="self-center col full-width no-outline" tabindex="0">{{others.secondName}} {{others.firstName}}</div>
                        <div class="self-center col full-width no-outline" tabindex="0"></div>
                    </div>
                </template>
           </q-field>
           <q-field class="col" label="Klub" standout stack-label>
                <template v-slot:control>
                    <div>
                      <div class="self-center col full-width no-outline" tabindex="0">{{others.club.name}}</div>
                    </div>
                </template>
           </q-field>
           <q-field class="col" label="telefon" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="0">{{others.phoneNumber}}</div>
                  </div>
                </template>
           </q-field>
           <q-field class="col" label="email" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{others.email}}</div>
                  </div>
                </template>
           </q-field>
           <q-btn class="col-1" @click="othersID = others.id,alert=true">usuń</q-btn>
           </div>
           <p></p>
        </li>
        </ol>
           </q-scroll-area>
    </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista znanych klubów</div>
            <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
            <div v-for="(club,id) in clubs" :key="id">
              <div v-if="club.name!='BRAK'" class="row">
                <div  @click="clubInfoModel=club,clubInfo=true" class="col-3">
           <q-field label="Klub" standout stack-label clickable>
                <template v-slot:control>
                  <div v-if="club.id != 1" class="self-center col no-outline row" tabindex="1">{{club.name}}</div>
                  <div v-if="club.id == 1" class="self-center col no-outline row" tabindex="1">{{club.name}} {{club.licenseNumber}}</div>
                </template>
           </q-field>
           </div>
           <div class="col">
           <a :href="club.url" target="_blank">
           <q-field class="col" label="strona" standout stack-label>
                <template v-slot:control>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{club.url}}</div>
                </template>
           </q-field>
           </a>
           </div>
           <q-field class="col" label="adres" standout stack-label>
                <template v-slot:control>
                    <div>
                  <div class="self-center col full-width no-outline row" tabindex="1">{{club.address}}</div>
                  </div>
                </template>
           </q-field>
           <q-btn class="col-2" @click="clubID = club.id,editClub=true">edytuj dane {{club.name}}</q-btn>
           </div>
            <p></p>
            </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
        <q-card>
        <q-card-section class="col">
          <div class="row">
            <div class="col">
              <q-item>
                <div class="q-pa-md self-center col full-width no-outline text-bold text-center bg-grey-3">WPŁACONE SKŁADKI W WYBRANYM OKRESIE</div>
              </q-item>
            </div>
            <q-item class="col">
              <q-input class="full-width" filled v-model="firstDate" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="firstDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <q-item class="col">
              <q-input class="full-width" filled v-model="secondDate" label="Data końcowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="secondDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <div @click="getSum ()" class="q-pa-md" align="right">
              <q-radio class="q-pa-md" v-model="adultCondition" :val="true">
                dorośli
              </q-radio>
              <q-radio class="q-pa-md" v-model="adultCondition" :val="false">
                mołodzież
              </q-radio>
              <q-btn>Wyszukaj</q-btn>
              </div>
            </div>
            <div v-if="quantitySum.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h5">Brak wyników składek - Wybierz daty</div>
            <div v-if="quantitySum.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość składek {{quantitySum.length}}</div>
            <ol>
            <li v-for="(member,uuid) in quantitySum" :key="uuid" class="self-center col full-width no-outline text-center">
              <q-field color="black" class="self-center col full-width no-outline text-center" standout stack-label>
                <template v-slot:control>
                  <div class="self-center col full-width no-outline text-center">{{member.secondName}} {{member.firstName}}</div>
                  <div class="self-center col full-width no-outline text-center">leg. {{member.legitimationNumber}}</div>
                </template>
              </q-field>
              <p></p>
            </li>
            </ol>
        </q-card-section>
        </q-card>
        <q-card>
        <q-card-section class="col">
          <div class="row">
            <div class="col">
              <q-item>
                <div class="q-pa-md self-center col full-width no-outline text-bold text-center bg-grey-3">ZAPISY DO KLUBU W WYBRANYM OKRESIE</div>
              </q-item>
            </div>
            <q-item class="col">
              <q-input class="full-width" filled v-model="firstDateJoinDate" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="firstDateJoinDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <q-item class="col">
              <q-input class="full-width" filled v-model="secondDateJoinDate" label="Data końcowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="secondDateJoinDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <div @click="getSumJoinDate ()" class="q-pa-md" align="right">
              <q-btn>Wyszukaj</q-btn>
              </div>
            </div>
            <div v-if="quantitySumJoinDate.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h5">Brak wyników zapisów - Wybierz daty</div>
            <div v-if="quantitySumJoinDate.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość zapisów {{quantitySumJoinDate.length}}</div>
            <ol>
            <li v-for="(member,uuid) in quantitySumJoinDate" :key="uuid" class="self-center col full-width no-outline text-center">
              <q-field color="black" class="self-center col full-width no-outline text-center" standout stack-label>
                <template v-slot:control>
                  <div class="self-center col full-width no-outline text-center">{{member.secondName}} {{member.firstName}}</div>
                  <div class="self-center col full-width no-outline text-center">leg. {{member.legitimationNumber}}</div>
                </template>
              </q-field>
              <p></p>
            </li>
            </ol>
        </q-card-section>
        </q-card>
        <q-card>
        <q-card-section class="col">
          <div class="row">
            <div class="col">
              <q-item>
                <div class="q-pa-md self-center col full-width no-outline text-bold text-center bg-grey-3">ILOŚĆ OSÓB SKREŚLONYCH W WYBRANYM OKRESIE</div>
              </q-item>
            </div>
            <q-item class="col">
              <q-input class="full-width" filled v-model="firstDateErased" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="firstDateErased">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <q-item class="col">
              <q-input class="full-width" filled v-model="secondDateErased" label="Data końcowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="secondDateErased">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <div @click="getSumErased ()" class="q-pa-md" align="right">
              <q-btn>Wyszukaj</q-btn>
              </div>
            </div>
            <div v-if="quantitySumErased.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h5">Brak wyników skreślonych - Wybierz daty</div>
            <div v-if="quantitySumErased.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość skreślonych {{quantitySumErased.length}}</div>
            <ol>
            <li v-for="(member,uuid) in quantitySumErased" :key="uuid" class="self-center col full-width no-outline text-center">
              <q-field color="black" class="self-center col full-width no-outline text-center" standout stack-label>
                <template v-slot:control>
                  <div class="self-center col full-width no-outline text-center">{{member.secondName}} {{member.firstName}}</div>
                  <div class="self-center col full-width no-outline text-center">{{member.erasedEntity.date}} {{member.erasedEntity.erasedType}}</div>
                  <div v-if="member.erasedEntity.additionalDescription==null" class="self-center col full-width no-outline text-center">Brak dodatkowych informacji</div>
                  <div v-if="member.erasedEntity.additionalDescription!=null" class="self-center col full-width no-outline text-center">{{member.erasedEntity.additionalDescription}}</div>
                </template>
              </q-field>
              <p></p>
            </li>
            </ol>
        </q-card-section>
        </q-card>
          <q-card>
            <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold">Sekcja Magicznych Przycisków</div>
              <q-item>
                <q-btn color="primary" label="pobierz listę wszystkich klubowiczów" @click="showloading (),getAllMembersList()"/>
              <q-radio v-model="tableCondition" :val="true">
                dorośli
              </q-radio>
              <q-radio v-model="tableCondition" :val="false">
                mołodzież
              </q-radio>
              </q-item>
              <q-item class="q-pa-md">
                <q-btn color="primary" label="pobierz listę klubowiczów do zgłoszenia na policję" @click="showloading (),getAllMembersWithLicenseNotValidAndContributionNotValid()"/>
              </q-item>
              <q-item class="q-pa-md">
                <q-btn color="primary" label="pobierz listę klubowiczów z aktualną licencją i bez składek" @click="showloading (),getAllMembersWithLicenseValidAndContributionNotValid()"/>
              </q-item>
              <q-item class="q-pa-md">
                <q-btn color="primary" label="pobierz listę klubowiczów do skreślenia" @click="showloading (),getAllMembersToErase ()"/>
              </q-item>
              <q-item class="q-pa-md">
                <q-btn color="primary" label="pobierz listę klubowiczów skreślonych" @click="showloading (),getAllErasedMembers ()"/>
              </q-item>
              <div class="row">
                  <div class="q-pa-md"><q-btn color="primary" label="wyświetl listę numerów telefonów" @click="showloading (),getMembersPhoneNumbers (),membersPhoneNumbers = true"/></div>
                  <div class="q-pa-md"><q-btn color="primary" label="wyświetl listę email" @click="showloading (),getMembersEmails (),membersEmails = true"/></div>
              <q-radio v-model="condition" :val="true">
                dorośli
              </q-radio>
              <q-radio v-model="condition" :val="false">
                mołodzież
              </q-radio>
              </div>
            </q-card-section>
          </q-card>
    <q-dialog v-model="dataFail">
      <q-card>
        <q-card-section>
          <div class="text-h6">Coś poszło nie tak</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="prolongFail">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można przedłużyć licencji</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy na pewno usunąć? Zmiana będzie trwała.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="Usuń" color="primary" v-close-popup @click="deactivateOther()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="doneAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Wykonano żądanie</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="ok" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="caliberAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano nowy rodzaj amunicji</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="ok" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="membersEmails">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Lista email wybranych klubowiczów</div>
        <div v-for="email in emails" :key="email">{{email}}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="membersPhoneNumbers">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Lista numerów telefonów wybranych klubowiczów</div>
        <div v-for="phone in phoneNumbers" :key="phone">{{phone}}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="clubInfo">
      <q-card>
        <q-card-section class="text-bold">
          <div class="text-h6">Informacje dodatkowe o klubie {{clubInfoModel.name}}</div>
        <div>ID : {{clubInfoModel.id}}</div>
        <div>email : {{clubInfoModel.email}}</div>
        <div>telefon : {{clubInfoModel.phoneNumber}}</div>
        <div>adres : {{clubInfoModel.address}}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editClub">
      <q-card>
        <q-card-section>
          <div class="text-h6" style="min-width: 500px">Zmień dane klubu</div>
        </q-card-section>
        <q-card-section>
                <q-item><q-input v-model="clubName" class="full-width" filled label="Nazwa"></q-input></q-item>
                <q-item v-if="clubID == 1"><q-input v-model="clubLicenseNumber" class="full-width" filled label="Numer licencji Klubowej"></q-input></q-item>
                <q-item><q-input v-model="clubPhoneNumber" type="tel" class="full-width" mask="+48 ### ### ###" filled label="Telefon"></q-input></q-item>
                <q-item><q-input v-model="clubEmail" type="email" class="full-width" filled label="email"></q-input></q-item>
                <q-item><q-input v-model="clubAddress" type="address" class="full-width" filled label="Adres"></q-input></q-item>
                <q-item><q-input v-model="clubURL" type="url" class="full-width" filled label="Strona internetowa"></q-input></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="ok" color="primary" v-close-popup @click="updateClub()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      calibers: [],
      others: [],
      clubs: [],
      members: [],
      members2: [],
      quantity: [],
      firstDate: null,
      secondDate: null,
      firstDateJoinDate: null,
      secondDateJoinDate: null,
      firstDateErased: null,
      secondDateErased: null,
      quantitySum: [],
      quantitySumJoinDate: [],
      quantitySumErased: [],
      othersID: null,
      clubID: null,
      clubName: null,
      clubLicenseNumber: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubAddress: null,
      clubURL: null,
      clubInfo: false,
      clubInfoModel: [],
      doneAlert: false,
      caliberAlert: false,
      editClub: false,
      dataFail: false,
      prolongFail: false,
      alert: false,
      condition: true,
      adultCondition: true,
      adultConditionJoinDate: true,
      tableCondition: true,
      emails: null,
      phoneNumbers: null,
      membersEmails: false,
      membersPhoneNumbers: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      prolongLicenseAlert: false,
      paymentLicenseAlert: false,
      memberName: null,
      memberUUID: null,
      nowDate: Date.now(),
      local: 'localhost:8080/shootingplace',
      local1: 'localhost:8080/shootingplace-1.0'
    }
  },
  created () {
    this.getListCalibers()
    this.getOther()
    this.getAllClubs()
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
    handleScroll (search) {
      const ele = document.getElementById(search)
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop - ele.scrollHeight
      const duration = 500
      setScrollPosition(target, offset, duration)
    },
    getListCalibers () {
      fetch('http://' + this.local + '/armory/calibers', {
        method: 'GET'
      }).then(response => response.json())
        .then(calibers => {
          this.calibers = calibers
        })
    },
    getOther () {
      fetch('http://' + this.local + '/other/all', {
        method: 'GET'
      }).then(response => response.json())
        .then(others => {
          this.others = others
        })
    },
    getMember () {
      this.$router.push({ path: 'member', params: { options: this.memberUUID } })
    },
    getAllClubs () {
      fetch('http://' + this.local + '/club/', {
        method: 'GET'
      }).then(response => response.json())
        .then(clubs => {
          this.clubs = clubs
        })
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
    getMembersEmails () {
      fetch('http://' + this.local + '/member/membersEmails?condition=' + this.condition, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersPhoneNumbers () {
      fetch('http://' + this.local + '/member/phoneNumbers?condition=' + this.condition, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.phoneNumbers = response
        })
    },
    updateClub () {
      var data = {
        name: this.clubName,
        licenseNumber: this.clubLicenseNumber,
        phoneNumber: this.clubPhoneNumber,
        eamil: this.clubEmail,
        address: this.clubAddress,
        url: this.clubURL
      }
      fetch('http://' + this.local + '/club/' + this.clubID, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.doneAlert = true
          this.getListCalibers()
          this.getOther()
          this.getAllClubs()
        } else { this.dataFail = true }
      })
    },
    deactivateOther () {
      fetch('http://' + this.local + '/other/?id=' + this.othersID, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          this.doneAlert = true
          this.othersID = null
          this.getListCalibers()
          this.getOther()
          this.getAllClubs()
        } else { this.dataFail = true }
      })
    },
    prolongLicense (uuid, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      var data = {
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
        } else { this.prolongFail = true }
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
        } else { this.prolongFail = true }
      })
    },
    getSum () {
      fetch('http://' + this.local + '/contribution/contributionSum?firstDate=' + this.firstDate.replace(/\//gi, '-') + '&secondDate=' + this.secondDate.replace(/\//gi, '-') + '&condition=' + this.adultCondition, {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySum = response
        })
      })
    },
    getSumJoinDate () {
      fetch('http://' + this.local + '/contribution/joinDateSum?firstDate=' + this.firstDateJoinDate.replace(/\//gi, '-') + '&secondDate=' + this.secondDateJoinDate.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySumJoinDate = response
        })
      })
    },
    getSumErased () {
      fetch('http://' + this.local + '/contribution/erasedSum?firstDate=' + this.firstDateErased.replace(/\//gi, '-') + '&secondDate=' + this.secondDateErased.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySumErased = response
        })
      })
    },
    getAllMembersList () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembers/?condition=' + this.tableCondition,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_na_dzień ' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    getAllMembersWithLicenseNotValidAndContributionNotValid () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersWithNoValidLicenseNoContribution/',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_z_licencją_bez_składek_' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    getAllMembersWithLicenseValidAndContributionNotValid () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersWithValidLicenseNoContribution/',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_z_licencją_bez_składek_' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    getAllMembersToErase () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersToErased/',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_do_skreślenia_' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    getAllErasedMembers () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllErasedMembers',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_skreślonych_' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    }
  },
  name: 'otherFunction'
}
</script>
