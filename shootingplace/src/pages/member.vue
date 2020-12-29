<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="self-center col full-width no-outline text-h3 text-bold" tabindex="0"> Wybierz Klubowicza</div>
        </q-item>
      </div>
      <q-card class="row">
        <div class="col-5">
          <q-item>
            <q-select filled v-model="memberName" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filter" @input="getMember(filter)" class="full-width" style="padding-bottom: 32px" label="Nazwisko - Imię - nr Leg">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
          </q-item>
        </div>
        <div class="col-7">
          <q-card class="q-pa-md row">
            <q-radio @input="getMembersNames ()" v-model="adult" :val="true" label="Grupa Powszechna"></q-radio>
            <q-radio @input="getMembersNames ()" v-model="adult" :val="false" label="Grupa Młodzieżowa"></q-radio>
            <q-radio @input="erase=false,getMembersNames ()" color="green" v-model="active" :val="true" label="Aktywni"></q-radio>
            <q-radio @input="getMembersNames ()" color="warning" v-model="active" :val="false" label="Nieaktywni"></q-radio>
            <q-checkbox @input="active = false,getMembersNames ()" color="red" v-model="erase" :val="false" label="Skreśleni"></q-checkbox>
          <q-item-section class="col">
          </q-item-section>
          </q-card>
        </div>
      </q-card>
      <div v-if="member!=null">
            <q-card bordered class="row">
          <q-card-section avatar class="col-1">
            <div class="row">
              <q-tooltip class="row" anchor="top middle" self="bottom middle" :offset="[12, 12]">
                <q-badge v-if="(member.address.postOfficeCity===null||member.address.postOfficeCity==='')
                ||(member.address.street==null||member.address.street=='')" transparent align="middle" color="orange" text-color="black">Brak Adresu</q-badge>
                <q-badge v-if="member.weaponPermission.exist&&!member.license.valid" transparent align="middle" color="red" text-color="black">Jest Broń i Brak Licencji</q-badge>
                <q-badge v-if="(member.email==null||member.email=='')" transparent align="middle" color="yellow" text-color="black">Brak E-mail</q-badge>
                <q-badge v-if="(member.license.number!=null)&&(member.license.valid == false)" transparent align="middle" color="yellow" text-color="black">Brak aktualnej licencji</q-badge>
                <q-badge v-else>Brak Uwag</q-badge>
              </q-tooltip>
            <q-avatar v-if="member.weaponPermission.exist&&!member.license.valid" icon="warning" color="red" text-color="white"/>
            <q-avatar v-if="member.license.number!=null&&!member.license.valid" icon="warning" color="yellow" text-color="white"/>
            <q-avatar v-else-if="(member.email==null||member.email=='')
            ||(member.address.postOfficeCity===null||member.address.postOfficeCity==='')
            ||(member.address.street==null||member.address.street=='')" icon="warning" color="warning" text-color="white" />
            <q-avatar v-else icon="perm_identity" color="primary" text-color="white" />
            </div>
          </q-card-section>
          <q-card-section class="col-4">
          <q-item-label>{{member.secondName}} {{member.firstName}}</q-item-label>
          <q-item-label v-if="member.history.contributionList.length > 0" caption lines="2">Składka ważna do {{member.history.contributionList[0].validThru}}</q-item-label>
          <q-item-label v-if="member.history.contributionList.length > 0" caption lines="2">Składka opłacona dnia {{member.history.contributionList[0].paymentDay}}</q-item-label>
          </q-card-section>
          <q-card-section class="col-3">
          <q-item-label :id="member.legitimationNumber">Numer Legitymacji {{member.legitimationNumber}}</q-item-label>
          <q-item-label caption lines="2">Numer PESEL {{member.pesel}}</q-item-label>
          <q-item-label caption lines="2">Data Zapisu {{member.joinDate}}</q-item-label>
          </q-card-section>
          <q-card-section class="col-4">
            <div v-if="member.erasedReason!=null">
          <q-item-label>Podstawa skreślenia z listy Klubowiczów</q-item-label>
          <q-item-label caption lines="2">{{member.erasedReason}}</q-item-label>
            </div>
          </q-card-section>
            </q-card>

        <q-card bordered class="row">
              <q-card-section class="col-4">
                  <q-field class="col" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center col full-width no-outline" tabindex="0">Historia Składek</div>
                    </template>
                  </q-field>
                  <div v-if="!member.erased">
                  <div><q-btn class="full-width" color="primary" label="Przedłuż składkę" @click="uuid = member.uuid,name = member.firstName,name2 = member.secondName,contribution=true"/></div>
                  <div><q-btn class="full-width text-black" color="white" label="Dodaj rekord" @click="uuid = member.uuid,name  =member.firstName,name2 = member.secondName,contributionRecordConfirm=true"/></div>
                  </div>
                <q-dialog v-model="contributionRecordConfirm">
                  <div>
                    <q-card>
                      <q-card-section class="col items-center">
                        <p><span class="q-ml-sm">Możesz dodać ręcznie składkę</span></p>
                        <p><span class="q-ml-sm"> PAMIĘTAJ !!!</span></p>
                        <p><span class="q-ml-sm">Nie można dodawać składek z przyszłości</span></p>
                          <q-card-actions align="right">
                            <q-item>
                              <q-input filled v-model="historyContributionRecord" mask="####/##/##" label="Wybierz datę" hint="użyj kalendarza">
                                <template v-slot:append>
                                  <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                      <q-date v-model="historyContributionRecord">
                                        <div class="row items-center justify-end">
                                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                                        </div>
                                      </q-date>
                                    </q-popup-proxy>
                                  </q-icon>
                                </template>
                              </q-input>
                            </q-item>
                          </q-card-actions>
                          <q-card-actions align="right">
                            <q-btn flat label="zamknij" color="primary" v-close-popup />
                            <q-btn flat label="Dodaj rekord" color="primary" v-close-popup @click="addHistoryContributionRecord (uuid, historyContributionRecord)" />
                          </q-card-actions>
                      </q-card-section>
                    </q-card>
                  </div>
                </q-dialog>
                  <q-expansion-item class="bg-grey-2 full-width q-pa-none" label="Daty składek">
                    <q-scroll-area class="full-width q-pa-none" style="height: 200px;">
                          <div v-for="(contributionList,contributionUUID) in member.history.contributionList" :key="contributionUUID" class="row">
                              <q-field class="col" standout label="Opłacona dnia" stack-label>
                                <template v-slot:control>
                                  <div class="self-center col full-width no-outline" tabindex="0">{{contributionList.paymentDay}}</div>
                                </template>
                              </q-field>
                              <q-field class="col" standout label="Ważna do" stack-label>
                                <template v-slot:control>
                                  <div class="self-center col full-width no-outline" tabindex="1">{{contributionList.validThru}}</div>
                                </template>
                              </q-field>
                                  <q-btn  v-if="!member.erased" label="usuń" @click="uuid = member.uuid,contributionUUID = contributionList.uuid,removeContributionRecord(uuid,contributionUUID)"></q-btn>
                          </div>
                    </q-scroll-area>
                  </q-expansion-item>
              </q-card-section>
              <q-card-section class="col-3 items-center">
              <q-item-section class="col" v-if="!member.license.number!=null||member.adult">
                <q-field class="col" standout stack-label>
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">Licencja</div>
                  </template>
                </q-field>
                <div>
                  <div class="row">
                <q-field class="col" v-if="member.license.number!=null" label="Numer Licencji" standout stack-label>
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">{{member.license.number}}</div>
                  </template>
                </q-field>
                <q-field class="col" v-if="member.license.validThru!=null" label="Ważna do" standout stack-label>
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">{{member.license.validThru}}</div>
                  </template>
                </q-field>
                </div>
                <div class="row">
                  <q-field v-if="member.license.pistolPermission" label="Dyscyplina" class="col" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center col full-width no-outline" tabindex="0">Pistolet</div>
                    </template>
                  </q-field>
                  <q-field v-if="member.license.riflePermission" label="Dyscyplina" class="col" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center col full-width no-outline" tabindex="0">Karabin</div>
                    </template>
                  </q-field>
                  <q-field v-if="member.license.shotgunPermission" label="Dyscyplina" class="col" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center col full-width no-outline" tabindex="0">Strzelba</div>
                    </template>
                  </q-field>
                </div>
                </div>
                <q-item-label caption lines="2" v-if="!member.license.pistolPermission&&member.history.licenseHistory[ 0 ]=='Pistolet'">Kiedyś posiadał licencję na Pistolet</q-item-label>
                <q-item-label caption lines="2" v-if="!member.license.riflePermission&&member.history.licenseHistory[ 1 ]=='Karabin'">Kiedyś posiadał licencję na Karabin</q-item-label>
                <q-item-label caption lines="2" v-if="!member.license.shotgunPermission&&member.history.licenseHistory[ 2 ]=='Strzelba'">Kiedyś posiadał licencję na strzelbę</q-item-label>
              </q-item-section>
                <q-btn v-if="((member.shootingPatent.patentNumber!=null&&member.license.number==null)||!member.adult)&&member.license.paid==true" class="full-width" color="primary" label="DODAJ LICENCJĘ" @click="
                uuid=member.uuid,
                patentPistolPermission1=member.shootingPatent.pistolPermission,
                patentRiflePermission1=member.shootingPatent.riflePermission,
                patentShotgunPermission1=member.shootingPatent.shotgunPermission,
                memberAdultConfirm=member.adult,
                licenseConfirm=true">
                </q-btn>
                <q-btn class="full-width" color="primary" v-if="member.license.number!=null&&(
                !member.license.pistolPermission
                ||!member.license.riflePermission
                ||!member.license.shotgunPermission)&&member.active" label="Aktualizuj Licencję" @click="uuid=member.uuid,
                patentPistolPermission1=member.shootingPatent.pistolPermission,
                patentRiflePermission1=member.shootingPatent.riflePermission,
                patentShotgunPermission1=member.shootingPatent.shotgunPermission,
                licensePistolPermission1=member.license.pistolPermission,
                licenseRiflePermission1=member.license.riflePermission,
                licenseShotgunPermission1=member.license.shotgunPermission,
                memberAdultConfirm=member.adult,
                updateLicenseConfirm=true"></q-btn>
                <div v-if="(member.license.number!=null&&(member.license.pistolPermission||member.license.riflePermission||member.license.shotgunPermission)&&member.active)&&member.license.paid==true">
                 <q-btn class="full-width" v-if="member.license.canProlong&&member.license.paid==true" label="przedłuż licencję" color="primary" @click="uuid=member.uuid,
                licensePistolPermission1=member.license.pistolPermission,
                licenseRiflePermission1=member.license.riflePermission,
                licenseShotgunPermission1=member.license.shotgunPermission,
                prolongLicenseConfirm=true"></q-btn>
                <q-btn class="full-width" v-else label="przedłuż licencję" color="primary" @click="uuid=member.uuid,
                licensePistolPermission1=member.license.pistolPermission,
                licenseRiflePermission1=member.license.riflePermission,
                licenseShotgunPermission1=member.license.shotgunPermission,
                noDomesticStarts=true"></q-btn>
                </div>
                <q-btn v-if="((member.active&&!member.adult) || (member.active&&(member.shootingPatent.patentNumber!=null))) &&member.license.paid==false" class="full-width" label="opłać licencję" @click="uuid=member.uuid,licensePayment=true"></q-btn>
              <q-expansion-item class="bg-grey-3" v-if="member.history.licensePaymentHistory!=null" label="Daty opłacenia licencji">
                <q-scroll-area class="full-width q-pa-none" style="height: 200px;">
                <q-field v-for="(licensePaymentHistory,uuid) in member.history.licensePaymentHistory" :key="uuid" label="Opłacona dnia" class="col" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center col full-width no-outline" tabindex="0">{{licensePaymentHistory}}</div>
                    </template>
                  </q-field>
                </q-scroll-area>
              </q-expansion-item>
              </q-card-section>
              <q-card-section class="col-5 items-center">
                <q-item-section>
                  <q-expansion-item label="Informacje o Uprawnieniach" class="col items-center bg-grey-3" group="right-card">
                    <q-field v-if="(member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterNumber!='')" class="col" standout label="Sędzia" stack-label>
                    <template v-slot:control>
                      <q-field v-if="(member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterNumber!='')" class="col" standout label="Numer" stack-label>
                        <template v-slot:control>
                         <div class="self-center full-width no-outline" tabindex="0">{{member.memberPermissions.arbiterNumber}}</div>
                        </template>
                      </q-field>
                      <q-field v-if="(member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterNumber!='')" class="col" standout label="Klasa" stack-label>
                        <template v-slot:control>
                         <div class="self-center full-width no-outline" tabindex="0">{{member.memberPermissions.arbiterClass}}</div>
                        </template>
                      </q-field>
                      <q-field v-if="(member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterNumber!='')" class="col" standout label="Ważna do" stack-label>
                        <template v-slot:control>
                         <div class="self-center full-width no-outline" tabindex="0">{{member.memberPermissions.arbiterPermissionValidThru}}</div>
                        </template>
                      </q-field>
                    </template>
                  </q-field>
                  <q-field v-if="member.shootingPatent.patentNumber!=null" class="col" standout label="Patent" stack-label>
                    <template v-slot:control>
                    <div class="col">
                      <div class="row">
                      <q-field class="col" standout label="Numer" stack-label>
                        <template v-slot:control>
                         <div class="self-center full-width no-outline" tabindex="0">{{member.shootingPatent.patentNumber}}</div>
                        </template>
                      </q-field>
                      <q-field class="col" standout label="Nadany dnia" stack-label>
                        <template v-slot:control>
                         <div class="self-center full-width no-outline" tabindex="0">{{member.shootingPatent.dateOfPosting}}</div>
                        </template>
                      </q-field>
                      </div>
                      <q-field class="col" standout label="Dyscypliny" stack-label>
                        <template v-slot:control>
                          <q-field v-if="member.shootingPatent.pistolPermission" class="col" standout label="Pistolet" stack-label>
                            <template v-slot:control>
                              <div class="self-center full-width no-outline" tabindex="0">{{member.history.patentDay[ 0 ]}}</div>
                            </template>
                          </q-field>
                          <q-field v-if="member.shootingPatent.riflePermission" class="col" standout label="Karabin" stack-label>
                            <template v-slot:control>
                              <div class="self-center full-width no-outline" tabindex="0">{{member.history.patentDay[ 1 ]}}</div>
                            </template>
                          </q-field>
                          <q-field v-if="member.shootingPatent.shotgunPermission" class="col" standout label="Strzelba" stack-label>
                            <template v-slot:control>
                              <div class="self-center full-width no-outline" tabindex="0">{{member.history.patentDay[ 2 ]}}</div>
                            </template>
                          </q-field>
                        </template>
                      </q-field>
                    </div>
                    </template>
                  </q-field>
                  <q-field v-if="member.weaponPermission.number!=null&&member.weaponPermission.exist" class="col" standout label="Numer pozwolenia na broń" stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">{{member.weaponPermission.number}}</div>
                    </template>
                  </q-field>
                  <q-field v-if="(member.memberPermissions.shootingLeaderNumber!=null&&member.memberPermissions.shootingLeaderNumber!='')" class="col" standout label="Prowadzący Strzelanie" stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">{{member.memberPermissions.shootingLeaderNumber}}</div>
                    </template>
                  </q-field>
                  <q-field v-if="(member.memberPermissions.instructorNumber!=null&&member.memberPermissions.instructorNumber!='')" class="col" standout label="Instruktor" stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">{{member.memberPermissions.instructorNumber}}</div>
                    </template>
                  </q-field>
                  </q-expansion-item>
                </q-item-section>
<q-expansion-item  label="Wydawanie Amunicji" class="col items-center bg-grey-3" group="right-card">
                <div class="bg-white">
                  <div class="row">
                    <q-field class="full-width col" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Kaliber</div>
                    </template>
                    </q-field>
                    <q-field class="full-width col" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Ilość wydanej amunicji</div>
                    </template>
                    </q-field>
                  </div>
                  <div class="row">
                  <q-item-section v-if="member.active" class="full-width">
                      <q-radio v-model="caliberUUID" v-for="(calibers,uuid) in calibers" :key="uuid" :val="calibers.uuid">
                        <q-field borderless style="full-width">
                         <template v-slot:control>
                          <div class="full-width">{{calibers.name}}</div>
                         </template>
                        </q-field>
                      </q-radio>
                  </q-item-section>
                  <q-item-section>
                    <div>
                    <q-field v-for="(counter,uuid) in member.personalEvidence.ammoList" :key="uuid"  class="col" standout :label="counter.caliberName" stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">{{counter.counter}} sztuk</div>
                    </template>
                    </q-field>
                    </div>
                  </q-item-section>
                  </div>
                  <div v-if="member.active" class="row">
                  <q-input @keypress.enter="uuid=member.uuid, addAmmoConfirm=true" v-temp ref="search" filled class="full-width col" v-model="quantity" placeholder="Tylko cyfry" onkeypress="return (event.charCode > 44 && event.charCode < 58)" label="Ilość Amunicji"></q-input>
                  <q-btn class="full-width col" color="primary" label="wydaj amunicję" @click="uuid=member.uuid, addAmmoConfirm=true"></q-btn>
                  </div>
                </div>
</q-expansion-item>
<q-expansion-item label="Opcje Dodatkowe" group="right-card" class="bg-grey-3">
<q-expansion-item v-if="member.adult&&active&&!member.erased" label="Patent" group="right-right-card" class="bg-white">
                <q-btn class="full-width" color="primary" v-if="member.shootingPatent.patentNumber==null&&member.active" label="DODAJ PATENT" @click="uuid=member.uuid,patentConfirm=true"></q-btn>
                <q-btn class="full-width" color="primary" v-if="member.shootingPatent.patentNumber!=null&&(
                !member.shootingPatent.pistolPermission
                ||!member.shootingPatent.riflePermission
                ||!member.shootingPatent.shotgunPermission)
                &&member.shootingPatent.dateOfPosting!=null&&member.active" label="AKTUALIZUJ PATENT"
                @click="uuid=member.uuid,
                patentPistolPermission1=member.shootingPatent.pistolPermission,
                patentRiflePermission1=member.shootingPatent.riflePermission,
                patentShotgunPermission1=member.shootingPatent.shotgunPermission,
                memberAdultConfirm=member.adult,
                patentConfirm2=true">
                </q-btn>
              <q-item v-if="member.shootingPatent.pistolPermission
                &&member.shootingPatent.riflePermission
                &&member.shootingPatent.shotgunPermission"><q-item-label>Klubowicz posiada cały Patent</q-item-label></q-item>
</q-expansion-item >
<q-expansion-item v-if="member.adult&&active&&!member.erased" label="Pozwolenie na Broń" group="right-right-card" class="bg-white">
                  <div class="row">
                    <q-input filled class="col" v-if="(member.weaponPermission.number==null||!member.weaponPermission.exist)&&active" v-model="weaponPermissionNumber" label="Numer pozwolenia"/>
                    <q-btn class="col" v-if="(!member.weaponPermission.exist)&&member.active" label="Dodaj" color="primary" @click="changeWeaponPermission(member.uuid, weaponPermissionNumber, isExist)"/>
                    <q-btn class="col" v-if="(member.weaponPermission.exist)&&active" label="Usuń pozwolenie" color="primary" @click="uuid=member.uuid,eraseWeapon=true"/>
                  </div>
                  <q-field v-if="!member.license.valid&&member.weaponPermission.exist" class="col bg-red" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline " tabindex="0">POSIADA NIE WAŻNĄ LICENCJĘ!!!</div>
                    </template>
                  </q-field>
</q-expansion-item>
<q-expansion-item v-if="member.adult&&active&&!member.erased" label="Uprawnienia" group="right-right-card" class="bg-white">
<q-expansion-item v-if="member.memberPermissions.shootingLeaderNumber==null" label="Prowadzący strzelanie" group="qualifications">
                  <div class="row">
                  <q-input filled class="col" v-if="member.memberPermissions.shootingLeaderNumber==null" v-model="permissionsShootingLeaderNumber" label="numer uprawnienia"/>
                  <q-btn class="col" v-if="member.memberPermissions.shootingLeaderNumber==null" label="Dodaj" color="primary" @click="uuid=member.uuid,shootingLeaderConfirm=true"/>
                  </div>
</q-expansion-item>
<q-expansion-item v-if="member.memberPermissions.instructorNumber==null" label="Instruktor" group="qualifications">
                  <div class="row">
                    <q-input filled class="col" v-if="member.memberPermissions.instructorNumber==null" v-model="permissionsInstructorNumber" label="Numer uprawnień" />
                    <q-btn class="col" v-if="member.memberPermissions.instructorNumber==null" label="Dodaj" color="primary" @click="uuid=member.uuid,instructorConfirm=true"/>
                  </div>
</q-expansion-item>
<q-expansion-item v-if="member.adult&&active&&!member.erased" label="Sędzia" group="qualifications">
                    <q-item class="full-width col">
                      <q-input outlined filled class="full-width" v-if="member.memberPermissions.arbiterNumber==null||member.memberPermissions.arbiterNumber==''" v-model="permissionsArbiterNumber" label="Numer uprawnień" />
                        <q-input class="col-5" outlined filled v-model="permissionsArbiterPermissionValidThru" mask="####/12/31" label="Ważne do:">
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="permissionsArbiterPermissionValidThru">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Zamknij" color="primary" flat />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                        <q-btn class="col" v-if="member.memberPermissions.arbiterNumber!=null" color="primary" label="Przedłuż" @click="uuid=member.uuid,arbiterProlongConfirm=true"/>
                      </q-item>
                      <div class="col">
                    <div class="col">
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal" :val="1" label="Klasa 3" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal" :val="2" label="Klasa 2" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal" :val="3" label="Klasa 1" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterClass!='Klasa 3'&&member.memberPermissions.arbiterClass=='Brak'" v-model="ordinal" :val="1" label="Klasa 3" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterClass!='Klasa 2'&&member.memberPermissions.arbiterClass=='Klasa 3'" v-model="ordinal" :val="2" label="Klasa 2" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPerarbiterNumber!=null&&member.memberPermissions.arbiterClass!='Klasa 1'&&member.memberPermissions.arbiterClass=='Klasa 2'" v-model="ordinal" :val="3" label="Klasa 1" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterClass!='Klasa Państwowa'&&member.memberPermissions.arbiterClass=='Klasa 1'" v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterClass!='Klasa Międzynarodowa'&&member.memberPermissions.arbiterClass=='Klasa Państwowa'" v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" />
                    </div>
                    <q-item class="full-width col">
                    <q-btn class="full-width col-1" v-if="member.memberPermissions.arbiterNumber!=null" color="primary" label="Podnieś klasę" @click="uuid=member.uuid,arbiterUpdateClassConfirm=true"/>
                    <q-btn class="full-width col-1" v-if="member.memberPermissions.arbiterNumber==null||member.memberPermissions.arbiterNumber==''" label="Dodaj" color="primary" @click="uuid=member.uuid,arbiterConfirm=true"/>
                    </q-item>
                      </div>
    </q-expansion-item>
    </q-expansion-item>
    <q-expansion-item v-if="member.active" label="Przenieś do nieaktywnych" group="right-right-card" class="bg-red">
                <q-item><q-item-label v-if="member.active">Czy napewno chcesz przenieść osobę?</q-item-label></q-item>
                <q-item><q-btn label="Przenieś" color="red" @click="uuid=member.uuid,deactivate=true"/></q-item>
</q-expansion-item>
<q-expansion-item v-if="!member.adult&&active" label="Przenieś do grupty Powszechnej" group="right-right-card">
                <q-item><q-item-label v-if="member.active">Czy napewno chcesz przenieść osobę?</q-item-label></q-item>
                <q-item><q-btn label="Przenieś" color="red" @click="uuid=member.uuid,changAdultConfirm=true"/></q-item>
</q-expansion-item>
<q-expansion-item v-if="!member.active&&!member.erased" label="Skreśl z listy członków" group="right-right-card" class="bg-red">
                <q-item class="bg-red" ><q-item-label>Czy napewno chcesz usunąć osobę?</q-item-label></q-item>
                <q-item class="bg-red" >
                  <q-input v-model="reason" filled color="black" class="col" label="Podaj przyczynę usunięcia oraz podstawę"/>
                  </q-item>
                <q-item v-if="reason!=null" class="bg-red" ><q-btn label="Usuń" color="red" @click="uuid=member.uuid,eraseConfirm=true"/></q-item>
</q-expansion-item>
<q-expansion-item v-if="!member.active&&!member.erased" class="bg-green" label="Przywróć członka klubu" group="right-right-card">
                <q-item ><q-item-label>Czy napewno chcesz przywrócić osobę?</q-item-label></q-item>
                <q-item ><q-btn label="Przywróć" color="green-8" @click="uuid=member.uuid,backConfirm=true"/></q-item>
</q-expansion-item>
<q-expansion-item v-if="!member.active&&member.erased" class="bg-green" label="Przywróć członka klubu" group="right-right-card">
                <q-item ><q-item-label>Czy napewno chcesz przywrócić osobę?</q-item-label></q-item>
                <q-item ><q-btn label="Przywróć" color="green-8" @click="uuid=member.uuid,eraseBackConfirm=true"/></q-item>
</q-expansion-item>
</q-expansion-item>
<q-expansion-item label="Historia startów" group="right-card" class="bg-grey-3">
              <div class="bg-white">
              <q-field class="col" standout stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">Licznik startów</div>
                  </template>
                </q-field>
              <div class="row">
                <q-field class="col" standout label="Pistolet" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{member.history.pistolCounter}}</div>
                  </template>
                </q-field>
                <q-field class="col" standout label="Karabin" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="1">{{member.history.rifleCounter}}</div>
                  </template>
                </q-field>
                <q-field class="col" standout label="Strzelba" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="2"> {{member.history.shotgunCounter}} </div>
                  </template>
                </q-field>
              </div>
            </div>
  <q-expansion-item label="Daty startów" class="bg-white q-pa-none">
    <q-scroll-area class="full-width q-pa-none" style="height: 200px;">
              <div class="row" v-for="(competitionHistory,uuid) in member.history.competitionHistory" :key="uuid">
                <q-field class="col" standout label="Nazwa" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{competitionHistory.name}}</div>
                  </template>
                </q-field>
                <q-field class="col-3" standout label="Data" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="1">{{competitionHistory.date}}</div>
                  </template>
                </q-field>
                <q-field class="col" standout label="Konkurencja" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="2"> {{competitionHistory.discipline}} </div>
                  </template>
                </q-field>
              </div>
    </q-scroll-area>
    <q-scroll-area v-if="member.history.competitionHistory.lenght<1" class="full-width q-pa-none" style="height: 200px;">
              <div>
                <q-field class="col" standout stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">Brak</div>
                  </template>
                </q-field>
              </div>
    </q-scroll-area>
  </q-expansion-item >
</q-expansion-item>
<q-expansion-item v-if="member.memberPermissions.arbiterNumber!=null" label="Historia sędziowania" group="right-card" class="bg-grey-3">
              <div class="row" v-for="(judgingHistory,uuid) in member.history.judgingHistory" :key="uuid">
                <q-field class="col" standout label="Nazwa" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{judgingHistory.name}}</div>
                  </template>
                </q-field>
                <q-field class="col-3" standout label="Data" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="1">{{judgingHistory.date}}</div>
                  </template>
                </q-field>
                <q-field class="col" standout label="Funkcja" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="2"> {{judgingHistory.function}} </div>
                  </template>
                </q-field>
              </div>
</q-expansion-item>
          </q-card-section>
        </q-card>
        <q-card bordered class="row bg-grey-2">
          <q-card-section class="col-4">
            <q-item-section class="col">
            <q-item-label>Dane Podstawowe</q-item-label>
            <q-item-label caption lines="2">Identyfikator : {{member.uuid}}</q-item-label>
            <q-item-label caption lines="2">Imię : {{member.firstName}}</q-item-label>
            <q-item-label caption lines="2">Nazwisko : {{member.secondName}}</q-item-label>
            <q-item-label caption lines="2">Data Zapisu do Klubu : {{member.joinDate}}</q-item-label>
            <q-item-label caption lines="2">Pesel : {{member.pesel}}</q-item-label>
            <q-item-label caption lines="2">Numer Dowodu : {{member.idcard}}</q-item-label>
            <q-btn class="full-width" v-if="member.active&&!member.erased" label="Zmień Dane" color="secondary" @click="uuid=member.uuid,basicDataConfirm=true"></q-btn>
            </q-item-section>
          </q-card-section>
          <q-card-section class="col-3">
            <q-item-section >
            <q-item-label>Dane Kontaktowe</q-item-label>
            <q-item-label caption lines="2">e-mail {{member.email}}</q-item-label>
            <q-item-label caption lines="2">Numer Telefonu {{member.phoneNumber}}</q-item-label>
            <q-item-label>Adres</q-item-label>
            <q-item-label caption lines="2">Miasto {{member.address.postOfficeCity}}</q-item-label>
            <q-item-label caption lines="2">Kod Pocztowy {{member.address.zipCode}}</q-item-label>
            <q-item-label caption lines="2">Ulica {{member.address.street}} {{member.address.streetNumber}}</q-item-label>
            <q-item-label caption lines="2">Mieszkanie numer {{member.address.flatNumber}}</q-item-label>
            <q-btn v-if="member.active&&!member.erased" class="full-width" label="Aktualizuj Dane Kontaktowe" color="secondary" @click="uuid=member.uuid,addressConfirm=true"></q-btn>
            </q-item-section>
          </q-card-section>
          <q-card-section class="col-5">
            <div class="col full-width">
                <q-item><q-btn class="full-width" label="Pobierz kartę Członkowską" color="secondary" @click="uuid=member.uuid,name=member.firstName,name2=member.secondName,personalCardDownloadConfirm=true"/></q-item>
                <q-item><q-btn class="full-width" label="Pobierz ostatnie potwierdzenie składki" color="secondary" @click="uuid=member.uuid,name=member.firstName,name2=member.secondName,contributionDownloadConfirm=true"/></q-item>
                <q-item v-if="member.active&&member.adult&&!member.erased&&member.license.number!=null"><q-btn class="full-width" label="Pobierz wniosek o licencję" color="secondary" @click="uuid=member.uuid,name=member.firstName,name2=member.secondName,getApplicationForExtensionOfTheCompetitorsLicense ()"/></q-item>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <q-dialog v-model="contribution" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy przedłużyć składkę?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="przedłuż" color="primary" v-close-popup @click="prolongContribution(uuid)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addressConfirm" persistent>
      <q-card>
        <q-card-section class="col items-center">
                <q-item><q-input v-model="memberEmail" label="e-mail" /></q-item>
                <q-item><q-input v-model="memberPhoneNumber" hint="tylko cyfry" label="Numer Telefonu" placeholder="tylko cyfry" mask="#########"/></q-item>
                <q-item><q-input v-model="memberPostOfficeCity" label="Miasto" /></q-item>
                <q-item><q-input v-model="memberZipCode" hint="00-000" label="Kod Pocztowy" placeholder="00-000" mask="##-###" /></q-item>
                <q-item><q-input v-model="memberStreet" label="Ulica" /></q-item>
                <q-item><q-input v-model="memberStreetNumber" label="Numer Ulicy" /></q-item>
                <q-item><q-input v-model="memberFlatNumber" label="Numer mieszkania" /></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Aktualizuj" color="primary" v-close-popup @click="addressConfirm1=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addressConfirm1" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno zmienić dane adresowe?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="zmień" color="primary" v-close-popup @click="updateMember(uuid, memberEmail, memberPhoneNumber),
                updateAddress(uuid, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="basicDataConfirm" persistent>
      <q-card>
        <q-card-section class="col items-center">
        <q-item-label>Zmień dane podstawowe</q-item-label>
        <q-item><q-input v-model="memberIdcard" hint="XXX000000" label="Numer Dowodu" placeholder="XXX000000" mask="AAA######"/></q-item>
        <q-item><q-input v-model="memberSecondName" label="Nazwisko" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 45" /></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Aktualizuj" color="primary" v-close-popup @click="basicDataConfirm1=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="basicDataConfirm1" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno zmienić dane podstawowe?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="zmień" color="primary" v-close-popup @click="updateIDCardAndName(uuid,memberIdcard,memberSecondName)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="licenseConfirm" persistent>
  <div>
      <q-card>
        <q-item>Dodaj licencję</q-item>
        <q-card-section class="col items-center">
          <q-item><q-input v-model="licenseNumber" label="Numer Licencji" onkeypress="return (event.charCode > 47 && event.charCode < 58)" hint="tylko cyfry" placeholder="tylko cyfry" filled lazy-rules
                :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
                <q-item v-if="(patentPistolPermission1||!memberAdultConfirm)"><q-checkbox v-model="licensePistolPermission" label="Pistolet"/></q-item>
                <q-item v-if="(patentRiflePermission1||!memberAdultConfirm)"><q-checkbox  v-model="licenseRiflePermission" label="Karabin"/></q-item>
                <q-item v-if="(patentShotgunPermission1||!memberAdultConfirm)"><q-checkbox  v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="addLicense(uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)" />
        </q-card-actions>
      </q-card>
  </div>
</q-dialog>
<q-dialog v-model="updateLicenseConfirm" persistent>
  <div>
      <q-card>
        <q-item>Aktualizuj licencję</q-item>
        <q-card-section class="col items-center">
              <q-item v-if="!licensePistolPermission1&&(patentPistolPermission1)||!memberAdultConfirm"><q-checkbox v-model="licensePistolPermission" label="Pistolet"/></q-item>
              <q-item v-if="!licenseRiflePermission1&&(patentRiflePermission1)||!memberAdultConfirm"><q-checkbox v-model="licenseRiflePermission" label="Karabin"/></q-item>
              <q-item v-if="!licenseShotgunPermission1&&(patentShotgunPermission1)||!memberAdultConfirm"><q-checkbox v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="addLicense(uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)" />
        </q-card-actions>
      </q-card>
  </div>
</q-dialog>
<q-dialog v-model="noDomesticStarts">
    <q-card>
      <h4>Klubowicz nie ma zaliczonej wymaganej ilości startów </h4>
      <h4>Upewnij się, że klubowicz może udokumentować swoje starty</h4>
      <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup @click="prolongLicenseConfirm=true"/>
        </q-card-actions>
    </q-card>
</q-dialog>
<q-dialog v-model="prolongLicenseConfirm" persistent>
  <div>
      <q-card>
        <q-item>Przedłuż licencję</q-item>
        <q-card-section class="col items-center">
              <q-item v-if="licensePistolPermission1"><q-checkbox v-model="licensePistolPermission" label="Pistolet"/></q-item>
              <q-item v-if="licenseRiflePermission1"><q-checkbox v-model="licenseRiflePermission" label="Karabin"/></q-item>
              <q-item v-if="licenseShotgunPermission1"><q-checkbox v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="prolongLicense(uuid, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)" />
        </q-card-actions>
      </q-card>
  </div>
</q-dialog>
<q-dialog v-model="deactivate" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno przenieść do nieaktywnych?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="przenieś" color="primary" v-close-popup @click="changeActive(uuid),deactivateAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="backConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning"/>
          <span class="q-ml-sm">Czy napewno chcesz przywrócić Klubowicza?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="przywróć" color="primary" v-close-popup @click="changeActive (uuid),backAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="eraseWeapon" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno usunąć pozwolenie?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="usuń" color="primary" v-close-popup @click="changeWeaponPermission(uuid, weaponPermissionNumber, !isExist)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="licensePayment" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy licencja została opłacona?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Tak" color="primary" v-close-popup @click="addLicenseHistoryPayment (uuid)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="instructorConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno chcesz nadać numer instruktora?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Tak" color="primary" v-close-popup @click="updateMemberPermissions(uuid, permissionsInstructorNumber),value=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="shootingLeaderConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno chcesz nadać numer Prowadzącego strzelanie?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Tak" color="primary" v-close-popup @click="updateMemberPermissions(uuid, permissionsShootingLeaderNumber),value1=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno chcesz nadać numer Sędziego?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Tak" color="primary" v-close-popup @click="updateMemberPermissions(uuid, permissionsArbiterNumber, permissionsArbiterPermissionValidThru),value2=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterProlongConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno chcesz przedłużyć licencję Sędziego?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Przedłuż" color="primary" v-close-popup @click="updateMemberPermissions(uuid, permissionsArbiterPermissionValidThru),value3=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterUpdateClassConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno chcesz podnieść klasę licencji Sędziego?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="podnieś" color="primary" v-close-popup @click="updateMemberPermissions(uuid),value4=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="eraseConfirm" persistent>
      <q-card class="bg-red">
        <q-card-section class="row items-center">
          <q-avatar icon="warning"/>
          <span class="q-ml-sm">Czy napewno chcesz usunąć Klubowicza z listy członków klubu?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="white" v-close-popup />
          <q-btn flat label="usuń" color="white" v-close-popup @click="eraseMember(uuid)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="eraseBackConfirm" persistent>
      <q-card class="bg-green">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy przywrócić Członka klubu?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="white" v-close-popup />
          <q-btn flat label="przywróć" color="white" v-close-popup @click="eraseMember(uuid)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="changAdultConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning"/>
          <span class="q-ml-sm">Czy napewno chcesz przenieść Klubowicza do grupy powszechnej?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Przenieś" color="primary" v-close-popup @click="changeAdult(uuid)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionDownloadConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy napewno chcesz pobrać potwierdzenie składki?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getContributionPDF()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="personalCardDownloadConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy napewno chcesz pobrać kartę Klubowicza?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getPersonalCardPDF(),personalCardDownloadAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addAmmoConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy napewno chcesz Dodać amunicję?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="addMemberAndAmmoToCaliber()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="patentConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-item><q-input v-model="patentNumber" hint="tylko cyfry" mask="#####/AAA/##/####" label="Numer Patentu" filled /></q-item>
          <q-item><q-input filled v-model="patentDate" mask="####/##/##" :rules="['date']" label="Wybierz datę" hint="użyj kalendarza">
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="patentDate">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Zamknij" color="primary" flat />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input></q-item>
          <q-item><q-checkbox v-model="patentPistolPermission" label="Pistolet"/></q-item>
          <q-item><q-checkbox v-model="patentRiflePermission" label="Karabin"/></q-item>
          <q-item><q-checkbox v-model="patentShotgunPermission" label="Strzelba"/></q-item>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="patentConfirm1=true"/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="patentConfirm2" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-item><q-input filled v-model="patentDate" mask="date" :rules="['date']" label="Wybierz datę" hint="użyj kalendarza">
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="patentDate">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Zamknij" color="primary" flat />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input></q-item>
                <q-item v-if="!patentPistolPermission1"><q-checkbox v-model="patentPistolPermission" label="Pistolet"/></q-item>
                <q-item v-if="!patentRiflePermission1"><q-checkbox v-model="patentRiflePermission" label="Karabin"/></q-item>
                <q-item v-if="!patentShotgunPermission1"><q-checkbox v-model="patentShotgunPermission" label="Strzelba"/></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="patentConfirm1=true"/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="patentConfirm1" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy napewno chcesz dodać PATENT?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="addPatent(uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission,patentDate)"/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="instructorAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nadano uprawnienia Instruktora</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="shootingLeaderAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nadano uprawnienia Prowadzącego Strzelanie</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="patentAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Patent został zapisany</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="licenseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Licencja została zapisana</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="weapon">
      <q-card>
        <q-card-section>
          <div class="text-h6">Ustawiono pozwolenie na broń</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="dataAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zaktualizowano</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="deactivateAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Przeniesiono</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano sędziego</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterProlongAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Przedłużono datę ważności licencji Sędziego</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterUpdateClassAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Podniesiono klasę licencji Sędziego</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Składka została przedłużona</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Pobierz Potwierdzenie" color="primary" v-close-popup @click="getContributionPDF()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionRecordAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Rekord w historii został dodany</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionRemoveRecordAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Rekord w historii został usunięty</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup  />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="eraseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Wykonano. Nastąpi przeładowanie</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="backAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Klubowicz został przywrócony</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="changeAdultAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Klubowicz został przeniesiony do Grupy Powszechnej</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="personalCardDownloadAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano kartę Klubowicza</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model=addAmmoAlert>
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Amunicję</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="failure">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można wykonać żądania. Sprawdź poprawność danych.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
  </q-page>
</template>

<script>

import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
const stringOptions = []
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios
Vue.directive('temp', function (el) {
  el.focus()
})

export default {
  data () {
    return {
      member: null,
      filters: [],
      options: stringOptions,
      memberName: null,
      memberWord: null,
      name: null,
      name2: null,
      active: true,
      adult: true,
      erase: false,
      value: false,
      value1: false,
      value2: false,
      value3: false,
      value4: false,
      arbiterAlert: false,
      arbiterProlongAlert: false,
      arbiterUpdateClassAlert: false,
      changAdultConfirm: false,
      changeAdultAlert: false,
      eraseAlert: false,
      backAlert: false,
      eraseConfirm: false,
      eraseBackConfirm: false,
      backConfirm: false,
      contributionRecord: '',
      basicDataConfirm: false,
      basicDataConfirm1: false,
      contributionAlert: false,
      contributionDownloadConfirm: false,
      contributionConfirmDownloadAlert: false,
      personalCardDownloadConfirm: false,
      personalCardDownloadAlert: false,
      addressConfirm: false,
      addressConfirm1: false,
      historyContributionRecord: Date.now,
      contributionRecordConfirm: false,
      contributionRecordConfirm1: false,
      contributionRecordAlert: false,
      contributionRemoveRecordAlert: false,
      contributionUUID: '',
      addAmmoConfirm: false,
      addAmmoAlert: false,
      alert: false,
      patentConfirm: false,
      patentConfirm1: false,
      patentConfirm2: false,
      patentAlert: false,
      licenseAlert: false,
      weapon: false,
      dataAlert: false,
      deactivateAlert: false,
      instructorAlert: false,
      shootingLeaderAlert: false,
      contribution: false,
      deactivate: false,
      eraseWeapon: false,
      licenseConfirm: false,
      licensePayment: false,
      instructorConfirm: false,
      shootingLeaderConfirm: false,
      arbiterConfirm: false,
      arbiterProlongConfirm: false,
      arbiterUpdateClassConfirm: false,
      failure: false,
      number: '',
      patentNumber: '',
      licenseNumber: '',
      validThru: '',
      members: [],
      calibers: [],
      ammos: [],
      patentDate: Date.now,
      patentPistolPermission: false,
      patentRiflePermission: false,
      patentShotgunPermission: false,
      patentPistolPermission1: false,
      patentRiflePermission1: false,
      patentShotgunPermission1: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      licensePistolPermission1: false,
      licenseRiflePermission1: false,
      licenseShotgunPermission1: false,
      updateLicenseConfirm: false,
      prolongLicenseConfirm: false,
      noDomesticStarts: false,
      permissionsInstructorNumber: '',
      permissionsShootingLeaderNumber: '',
      permissionsArbiterNumber: '',
      permissionsArbiterPermissionValidThru: '',
      ordinal: '',
      reason: null,
      weaponPermissionNumber: '',
      secondName: '',
      isExist: true,
      memberEmail: '',
      memberPhoneNumber: '',
      memberIdcard: '',
      memberSecondName: '',
      memberPostOfficeCity: '',
      memberZipCode: '',
      memberStreet: '',
      memberStreetNumber: '',
      memberFlatNumber: '',
      memberAdultConfirm: null,
      showStartsHistory: false,
      showJudgesHistory: false,
      btn: false,
      search: '',
      finder: '',
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
      },
      caliberUUID: null,
      quantity: '',
      model: null,
      dateVar: /\//gi,
      contributionDate: Date.now,
      confirm: false
    }
  },
  created () {
    this.getMembersNames()
    this.getListCalibers()
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
      const word = search.split(' ')
      const ele = document.getElementById(word[0])
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop - ele.scrollHeight
      const duration = 500
      setScrollPosition(target, offset, duration)
    },
    addHistoryContributionRecord (uuid, date) {
      fetch('http://localhost:8080/contribution/history/' + uuid + '?date=' + date.replace(/\//gi, '-'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.contributionRecordAlert = true
          this.historyContributionRecord = Date.now
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
      })
    },
    getMember (uuid) {
      const memberNameWord = this.memberName.split(' ')
      var legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      fetch('http://localhost:8080/member/' + memberNameUUID, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json()).then(response => {
        this.member = response
      })
    },
    removeContributionRecord (uuid, contributionUUID) {
      fetch('http://localhost:8080/contribution/remove/' + uuid + '?contributionUUID=' + contributionUUID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.contributionRemoveRecordAlert = true
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
      })
    },
    prolongContribution (uuid) {
      fetch('http://localhost:8080/contribution/' + uuid, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          this.contributionAlert = true
          this.showloading()
          this.getMember(uuid)
        }
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
      }).then(response => {
        if (response.status === 200) {
          this.dataAlert = true
          this.memberEmail = ''
          this.memberPhoneNumber = ''
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
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
      }).then(response => {
        if (response.status === 200) {
          this.dataAlert = true
          this.memberIdcard = ''
          this.memberSecondName = ''
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
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
      }).then(response => {
        if (response.status === 200) {
          this.dataAlert = true
          this.memberZipCode = ''
          this.memberPostOfficeCity = ''
          this.memberStreet = ''
          this.memberStreetNumber = ''
          this.memberFlatNumber = ''
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
      })
    },
    getMembersNames () {
      fetch('http://localhost:8080/member/getMembersNames?active=' + this.active + '&adult=' + this.adult + '&erase=' + this.erase, {
        method: 'GET'
      }).then(response => response.json())
        .then(filters => {
          this.filters = filters
        })
    },
    getListCalibers () {
      fetch('http://localhost:8080/ammoEvidence/calibers', {
        method: 'GET'
      }).then(response => response.json())
        .then(calibers => {
          this.calibers = calibers
        })
    },
    addMemberAndAmmoToCaliber () {
      fetch('http://localhost:8080/ammoEvidence/ammo?caliberUUID=' + this.caliberUUID + '&memberUUID=' + this.uuid + '&counter=' + this.quantity, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addAmmoAlert = true
          this.caliberUUID = null
          this.quantity = null
          this.showloading()
          this.getListCalibers()
          this.getMember(this.uuid)
        } else { this.failure = true }
      }
      )
    },
    getContributionPDF () {
      axios({
        url: 'http://localhost:8080/files/downloadContribution/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Składka_' + this.name + '_' + this.name2 + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    getPersonalCardPDF () {
      axios({
        url: 'http://localhost:8080/files/downloadPersonalCard/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Karta_Członkowska_' + this.name + '_' + this.name2 + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    getApplicationForExtensionOfTheCompetitorsLicense () {
      axios({
        url: 'http://localhost:8080/files/downloadApplication/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Wniosek_' + this.name + '_' + this.name2 + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    addPatent (uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission, patentDate) {
      var data = {
        patentNumber: patentNumber,
        pistolPermission: patentPistolPermission,
        riflePermission: patentRiflePermission,
        shotgunPermission: patentShotgunPermission,
        dateOfPosting: patentDate.replace(this.dateVar, '-')
      }
      fetch('http://localhost:8080/patent/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.patentAlert = true
          this.patentNumber = null
          this.patentPistolPermission = false
          this.patentRiflePermission = false
          this.patentShotgunPermission = false
          this.patentDate = null
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
      })
    },
    addLicense (uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      var data1 = {
        number: licenseNumber,
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission
      }
      fetch('http://localhost:8080/license/' + this.uuid, {
        method: 'PUT',
        body: JSON.stringify(data1),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.licenseAlert = true
          this.licenseNumber = ''
          this.licensePistolPermission = false
          this.licenseRiflePermission = false
          this.licenseShotgunPermission = false
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
      })
    },
    prolongLicense (uuid, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      var data = {
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission
      }
      fetch('http://localhost:8080/license/' + uuid, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.licenseAlert = true
          this.licensePistolPermission = false
          this.licenseRiflePermission = false
          this.licenseShotgunPermission = false
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
      })
    },
    addLicenseHistoryPayment (uuid) {
      fetch('http://localhost:8080/license/history/' + uuid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.licenseAlert = true
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
      })
    },
    changeWeaponPermission (uuid, weaponPermissionNumber, isExist) {
      var data = {
        number: weaponPermissionNumber,
        exist: isExist
      }
      fetch('http://localhost:8080/member/weapon/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.weapon = true
          this.weaponPermissionNumber = ''
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
      })
    },
    changeActive (uuid) {
      fetch('http://localhost:8080/member/' + uuid, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 204) {
          this.showloading()
          this.reload()
        } else { this.failure = true }
      })
    },
    updateMemberPermissions (uuid, permissionsShootingLeaderNumber, permissionsInstructorNumber, permissionsArbiterNumber, permissionsArbiterPermissionValidThru) {
      var data = {
        shootingLeaderNumber: this.permissionsShootingLeaderNumber,
        instructorNumber: this.permissionsInstructorNumber,
        arbiterNumber: this.permissionsArbiterNumber,
        arbiterPermissionValidThru: this.permissionsArbiterPermissionValidThru.replace(this.dateVar, '-')
      }
      fetch('http://localhost:8080/permissions/' + uuid + '?ordinal=' + this.ordinal, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => {
        if (response.status === 200) {
          if (this.value) { this.instructorAlert = true }
          if (this.value1) { this.shootingLeaderAlert = true }
          if (this.value2) { this.arbiterAlert = true }
          if (this.value3) { this.arbiterProlongAlert = true }
          if (this.value4) { this.arbiterUpdateClassAlert = true }
          this.value = false
          this.value1 = false
          this.value2 = false
          this.value3 = false
          this.value4 = false
          this.permissionsShootingLeaderNumber = ''
          this.permissionsInstructorNumber = ''
          this.permissionsArbiterNumber = ''
          this.permissionsArbiterPermissionValidThru = ''
          this.ordinal = ''
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
      })
    },
    eraseMember (uuid) {
      fetch('http://localhost:8080/member/erase/' + uuid + '?reason=' + this.reason, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 204) {
          this.eraseAlert = true
          this.reason = null
          this.showloading()
          this.reload()
        } else { this.failure = true }
      })
    },
    changeAdult (uuid) {
      fetch('http://localhost:8080/member/adult/' + uuid, {
        method: 'PATCH'
      }).then(response => {
        this.changeAdultAlert = true
        this.showloading()
        this.getMember(uuid)
      })
    },
    filter (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filters.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filters.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    reload () {
      window.location.reload()
    }
  },
  name: 'member'
}
</script>
