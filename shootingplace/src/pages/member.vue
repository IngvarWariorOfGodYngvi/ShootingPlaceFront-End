<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Lista Klubowiczów</div>
        </q-item>
      </div>
      <q-card class=" row">
        <div class="col-4">
          <q-item>
            <q-select class="full-width bg-green-3" filled v-model="memberName" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filter" @input="allMember = false,getMember(filter)" label="Nazwisko - Imię - nr Leg">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Brak wyników - sprawdź w nieaktywnych
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
          </q-item>
              <!-- aktywować gdy będą już karty z kodami kreskowymi -->
          <!-- <div class="q-pa-md col">
            <div class="row">
            <q-input class="col-9" filled label="numer karty"></q-input>
            <q-btn class="col-3">wyszukaj</q-btn>
            </div>
          </div> -->
        </div>
        <div class=" col-8">
          <q-card class="bg-grey-3 q-pa-md col">
            <div>
            <q-radio @input="memberName=null, member=null,getMembersNames (),getAllMemberDTOWithArgs()" v-model="allMember" :val="true" label="Wyświetl wszystkich"></q-radio>
            <q-radio @input="memberName=null, member=null,allMember=true,getMembersNames (),getAllMemberDTOWithArgs()" v-model="adult" :val="true" label="Grupa Powszechna"></q-radio>
            <q-radio @input="memberName=null, member=null,allMember=true,getMembersNames (),getAllMemberDTOWithArgs()" v-model="adult" :val="false" label="Grupa Młodzieżowa"></q-radio>
            <q-radio @input="memberName=null, member=null,allMember=true,erase=false, getMembersNames (),getAllMemberDTOWithArgs()" color="green" v-model="active" :val="true" label="Aktywni"></q-radio>
            <q-radio @input="memberName=null, member=null,allMember=true,getMembersNames (),getAllMemberDTOWithArgs()" color="warning" v-model="active" :val="false" label="Nieaktywni"></q-radio>
            </div>
            <div class="row">
            <q-checkbox @input="memberName=null, member=null,allMember=true,active = false, getMembersNames (),getAllMemberDTOWithArgs(),erasedType = erasedTypes[0]" color="red" v-model="erase" :val="false" label="Skreśleni"></q-checkbox>
            <div v-for="erased in erasedTypes" :key="erased">
              <div v-if="erase==true">
              <q-radio @input="allMember=true" color="red" v-model="erasedType" :val="erased" :true-value="erased" :label="erased"></q-radio>
              </div>
            </div>
            </div>
          <q-item-section class="col">
          </q-item-section>
          </q-card>
          <q-card>
          <div class="row text-bold">
            <q-item>Ilość klubowiczów</q-item>
            <q-item v-if="adult">Powszechna ogółem : {{quantities[0]}}</q-item>
            <q-item v-if="active&&adult">Powszechna Aktywni : {{quantities[1]}}</q-item>
            <q-item v-if="!active&&adult">Powszechna Nieaktywni : {{quantities[2]}}</q-item>
            <q-item v-if="!adult">Młodzieżowa ogółem : {{quantities[3]}}</q-item>
            <q-item v-if="active&&!adult">Młodzieżowa Aktywni : {{quantities[4]}}</q-item>
            <q-item v-if="!active&&!adult">Młodzieżowa Nieaktywni : {{quantities[5]}}</q-item>
            <q-item v-if="adult&&erase">Skreśleni : {{quantities[6]}}</q-item>
            <q-item v-if="!adult&&erase">Skreśleni : {{quantities[7]}}</q-item>
        </div>
          </q-card>
        </div>
      </q-card>
      <q-item></q-item>
      <div v-if="member!=null && allMember==false">
            <q-card bordered class="row">
          <q-card-section avatar class="col-1">
            <div>
              <q-tooltip v-if="(member.address.postOfficeCity===null||member.address.postOfficeCity==='')
                ||(member.address.street==null||member.address.street=='') || (member.weaponPermission.exist&&!member.license.valid) || (member.email==null||member.email=='') || (member.license.number!=null)&&(member.license.valid == false)" class="row" anchor="top middle" self="bottom middle" :offset="[12, 12]">
                <q-badge v-if="(member.address.postOfficeCity===null||member.address.postOfficeCity==='')
                ||(member.address.street==null||member.address.street=='')" transparent align="middle" color="orange" text-color="black">Brak Adresu</q-badge>
                <q-badge v-if="(member.weaponPermission.exist&&!member.license.valid)" transparent align="middle" color="red" text-color="black">Jest Broń i Brak Licencji</q-badge>
                <q-badge v-if="(member.email==null||member.email=='')" transparent align="middle" color="yellow" text-color="black">Brak E-mail</q-badge>
                <q-badge v-if="(member.license.number!=null)&&(member.license.valid == false)" transparent align="middle" color="yellow" text-color="black">Brak aktualnej licencji</q-badge>
              </q-tooltip>
            <q-avatar v-if="member.weaponPermission.exist&&!member.license.valid" icon="warning" color="red" text-color="white"/>
            <q-avatar v-else-if="member.license.number!=null&&!member.license.valid" icon="warning" color="yellow" text-color="white"/>
            <q-avatar v-else-if="(member.email==null||member.email=='')
            ||(member.address.postOfficeCity===null||member.address.postOfficeCity==='')
            ||(member.address.street==null||member.address.street=='')" icon="warning" color="warning" text-color="white" />
            <q-avatar v-else icon="perm_identity" color="green" text-color="white" />
            </div>
          </q-card-section>
          <q-card-section class="col-4">
          <q-item-label>{{member.secondName}} {{member.firstName}}</q-item-label>
          <q-item-label v-if="member.history.contributionList.length > 0" caption lines="2">Składka ważna do : {{member.history.contributionList[0].validThru}}</q-item-label>
          <q-item-label v-if="member.history.contributionList.length > 0" caption lines="2">Składka opłacona dnia : {{member.history.contributionList[0].paymentDay}}</q-item-label>
          </q-card-section>
          <q-card-section class="col-3">
          <q-item-label :id="member.legitimationNumber">Numer Legitymacji {{member.legitimationNumber}}</q-item-label>
          <q-item-label caption lines="2">Numer PESEL {{member.pesel}}</q-item-label>
          <q-item-label caption lines="2">Data Zapisu {{member.joinDate}}</q-item-label>
          </q-card-section>
          <q-card-section class="col-4">
            <div v-if="member.erased">
          <q-item-label>Podstawa skreślenia z listy Klubowiczów</q-item-label>
          <q-item-label caption lines="2">{{member.erasedEntity.erasedType}} {{member.erasedEntity.date}}</q-item-label>
          <q-item-label v-if="member.erasedEntity.additionalDescription!=null" caption lines="2">{{member.erasedEntity.additionalDescription}}</q-item-label>
            </div>
          </q-card-section>
            </q-card>

        <q-card bordered class="row">
              <q-card-section class="col-4">
                  <q-field class="col" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center col full-width no-outline text-center" tabindex="0">Historia Składek</div>
                    </template>
                  </q-field>
                  <div v-if="!member.erased">
                  <div><q-btn class="full-width" color="green" label="Przedłuż składkę" @click="memberUUID = member.uuid,name = member.firstName,name2 = member.secondName,contribution=true"/></div>
                  <div><q-btn class="full-width text-black" color="white" label="Dodaj historyczną składkę" @click="memberUUID = member.uuid,name  =member.firstName,name2 = member.secondName,contributionRecordConfirm=true"/></div>
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
                            <q-btn flat label="Dodaj rekord" color="primary" v-close-popup @click="contributionHistoryCode=true" />
                          </q-card-actions>
                      </q-card-section>
                    </q-card>
                  </div>
                </q-dialog>
                  <q-expansion-item class="bg-grey-3 full-width q-pa-none text-center" label="Daty Składek">
                    <q-scroll-area class="full-width q-pa-none" style="height: 375px;">
                          <div v-for="(contributionList,uuid) in member.history.contributionList" :key="uuid" class="row">
                              <div class="row full-width" @dblclick="contributionUUID = contributionList.uuid,memberUUID = member.uuid,editContributionPaymentDate=contributionList.paymentDay,editContributionValidThruDate=contributionList.validThru,editContribution=true">
                              <q-field class="col-6" label="Opłacona dnia : " standout stack-label>
                                <template v-slot:control>
                                  <div class="self-center col full-width no-outline" tabindex="0">{{contributionList.paymentDay}}</div>
                                </template>
                              </q-field>
                              <div class="col-6">
                                <q-field class="col" standout label="Ważna do : " stack-label>
                                  <template v-slot:control>
                                    <div class="self-center col full-width no-outline" tabindex="1">{{contributionList.validThru}}</div>
                                  </template>
                                </q-field>
                              </div>
                              </div>
                          </div>
                    </q-scroll-area>
                  </q-expansion-item>
              </q-card-section>
              <q-card-section class="col-3 items-center">
              <q-item-section class="col" v-if="!member.license.number!=null||member.adult">
                <div v-if="member.license.number!=null" class="col" clickable @dblclick="memberUUID = member.uuid,editLicenseNumber=member.license.number,editLicenseDate=member.license.validThru, editLicense=true">
                <q-field class="col" standout stack-label>
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline text-center" tabindex="0">Licencja</div>
                  </template>
                </q-field>
                </div>
                <div v-if="member.license.number==null" class="col">
                <q-field class="col" standout stack-label>
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline text-center" tabindex="0">Licencja</div>
                  </template>
                </q-field>
                </div>
                <div>
                  <div class="row">
                    <div class="col">
                      <q-field class="col" v-if="member.license.number!=null" label="Numer Licencji" standout stack-label>
                        <template v-slot:control>
                          <div class="self-center col full-width no-outline" tabindex="0">{{member.license.number}}</div>
                        </template>
                      </q-field>
                    </div>
                <q-field  class="col" v-if="member.license.validThru!=null" label="Ważna do :" standout stack-label>
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">{{member.license.validThru}}</div>
                  </template>
                </q-field>
                </div>
                <div v-if="member.license.pistolPermission == true || member.license.riflePermission == true || member.license.shotgunPermission == true" class="row">
                  <q-field  label="Dyscypliny" class="col" standout stack-label>
                    <template v-slot:control>
                      <div v-if="member.license.pistolPermission" class="text-left col-4 no-outline" tabindex="0">Pistolet</div>
                      <div v-if="member.license.riflePermission" class="text-left col-4 no-outline" tabindex="0">Karabin</div>
                      <div v-if="member.license.shotgunPermission" class="text-left col-4 no-outline" tabindex="0">Strzelba</div>
                    </template>
                  </q-field>
                </div>
                </div>
                <q-item-label caption lines="2" v-if="!member.license.pistolPermission&&member.history.licenseHistory[ 0 ]=='Pistolet'">Kiedyś posiadał licencję na Pistolet</q-item-label>
                <q-item-label caption lines="2" v-if="!member.license.riflePermission&&member.history.licenseHistory[ 1 ]=='Karabin'">Kiedyś posiadał licencję na Karabin</q-item-label>
                <q-item-label caption lines="2" v-if="!member.license.shotgunPermission&&member.history.licenseHistory[ 2 ]=='Strzelba'">Kiedyś posiadał licencję na strzelbę</q-item-label>
              </q-item-section>
                <q-btn v-if="(member.shootingPatent.patentNumber!=null&&member.license.number==null&&member.license.paid)||(!member.adult&&member.license.number==null)" class="full-width" color="primary" label="WYDAJ LICENCJĘ" @click="
                memberUUID=member.uuid,
                patentPistolPermission1=member.shootingPatent.pistolPermission,
                patentRiflePermission1=member.shootingPatent.riflePermission,
                patentShotgunPermission1=member.shootingPatent.shotgunPermission,
                memberAdultConfirm=member.adult,
                licenseConfirm=true">
                </q-btn>
                <q-btn class="full-width" color="primary" v-if="member.license.number!=null&&(
                !member.license.pistolPermission
                ||!member.license.riflePermission
                ||!member.license.shotgunPermission)&&member.active" label="Aktualizuj Licencję" @click="memberUUID=member.uuid,
                patentPistolPermission1=member.shootingPatent.pistolPermission,
                patentRiflePermission1=member.shootingPatent.riflePermission,
                patentShotgunPermission1=member.shootingPatent.shotgunPermission,
                licensePistolPermission1=member.license.pistolPermission,
                licenseRiflePermission1=member.license.riflePermission,
                licenseShotgunPermission1=member.license.shotgunPermission,
                memberAdultConfirm=member.adult,
                updateLicenseConfirm=true"></q-btn>
                <div v-if="(member.license.number!=null&&(member.license.pistolPermission||member.license.riflePermission||member.license.shotgunPermission)&&member.active)&&member.license.paid==true">
                 <q-btn class="full-width" v-if="member.license.canProlong&&member.license.paid==true" label="przedłuż licencję" color="primary" @click="memberUUID=member.uuid,
                licensePistolPermission1=member.license.pistolPermission,
                licenseRiflePermission1=member.license.riflePermission,
                licenseShotgunPermission1=member.license.shotgunPermission,
                prolongLicenseConfirm=true"></q-btn>
                <q-btn class="full-width" v-else label="przedłuż licencję" color="primary" @click="memberUUID=member.uuid,
                licensePistolPermission1=member.license.pistolPermission,
                licenseRiflePermission1=member.license.riflePermission,
                licenseShotgunPermission1=member.license.shotgunPermission,
                noDomesticStarts=true"></q-btn>
                </div>
                <q-btn v-if="((member.active&&(member.shootingPatent.patentNumber!=null&&member.license.paid==false))) " class="full-width" label="opłać licencję" @click="memberUUID=member.uuid,licensePayment=true"></q-btn>
              <q-expansion-item class="bg-grey-3" v-if="member.history.licensePaymentHistory!=null" label="Daty Opłacenia Licencji">
                <q-scroll-area class="full-width q-pa-none" style="height: 289px;">
                <div v-for="(licensePaymentHistory,uuid) in member.history.licensePaymentHistory" :key="uuid" class="row" @dblclick="memberUUID=member.uuid,paymentUUID = licensePaymentHistory.uuid,editLicensePaymentDate = licensePaymentHistory.date,editLicensePaymentYear = licensePaymentHistory.validForYear,editLicensePayment=true">
                  <q-field label="Opłacona dnia:" class="col" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center col full-width no-outline" tabindex="0">{{licensePaymentHistory.date}}</div>
                    </template>
                  </q-field>
                  <q-field label="Opłacona na rok:" class="col" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center col full-width no-outline" tabindex="0">{{licensePaymentHistory.validForYear}}</div>
                    </template>
                  </q-field>
                </div>
                </q-scroll-area>
              </q-expansion-item>
              </q-card-section>
              <q-card-section class="col-5 text-center">
                <q-item-section class="text-center">
                  <q-expansion-item default-opened label="Informacje o Uprawnieniach" class="col items-center bg-grey-3" group="right-card">
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
                  <q-field v-if="member.shootingPatent.patentNumber!=null" class="col" label-slot standout label="Patent" stack-label>
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
                      <q-field class="col q-pa-none" standout label="Dyscypliny" stack-label>
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
                  <q-field v-if="member.weaponPermission.admissionToPossessAWeapon!=null&&member.weaponPermission.admissionToPossessAWeaponIsExist" class="col" standout label="Numer dopuszczenia do posiadania broni" stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">{{member.weaponPermission.admissionToPossessAWeapon}}</div>
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
                  <q-card flat class="row">
                    <q-card-section class="col q-pa-none">
                    <div v-for="(calibers,uuid) in calibers" :key="uuid" :val="calibers.uuid">
                        <q-radio v-model="caliberUUID" :val="calibers.uuid" class="col full-width">
                          <q-field borderless>
                           <template v-slot:control>
                            <div class="full-width">{{calibers.name}}</div>
                           </template>
                          </q-field>
                        </q-radio>
                    </div>
                  </q-card-section>
                  <q-card-section class="col q-pa-none">
                    <div v-for="(counter,uuid) in member.personalEvidence.ammoList" :key="uuid">
                      <q-field class="col" standout :label="counter.caliberName" stack-label>
                      <template v-slot:control>
                        <div class="self-center full-width no-outline" tabindex="0">{{counter.counter}} sztuk</div>
                      </template>
                      </q-field>
                    </div>
                  </q-card-section>
                  </q-card>
                  <div v-if="!member.erased" class="row">
                  <q-input @keypress.enter="memberUUID=member.legitimationNumber, addAmmoConfirm=true" v-temp ref="search" filled class="full-width col" v-model="quantity" placeholder="Tylko cyfry" onkeypress="return (event.charCode > 44 && event.charCode < 58)" label="Ilość Amunicji"></q-input>
                  <q-btn class="full-width col" color="primary" label="wydaj amunicję" @click="memberUUID=member.legitimationNumber, addAmmoConfirm=true"></q-btn>
                  </div>
                </div>
</q-expansion-item>
<q-expansion-item v-if="!member.erased" label="Opcje Dodatkowe" group="right-card" class="bg-grey-3">
<q-expansion-item v-if="member.adult&&!member.erased" label="Patent" group="right-right-card" class="bg-white">
                <q-btn class="full-width" color="primary" v-if="member.shootingPatent.patentNumber==null" label="DODAJ PATENT" @click="memberUUID=member.uuid,patentConfirm=true"></q-btn>
                <q-btn class="full-width" color="primary" v-if="member.shootingPatent.patentNumber!=null&&(
                !member.shootingPatent.pistolPermission
                ||!member.shootingPatent.riflePermission
                ||!member.shootingPatent.shotgunPermission)
                &&member.shootingPatent.dateOfPosting!=null&&member.active" label="AKTUALIZUJ PATENT"
                @click="memberUUID=member.uuid,
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
<q-expansion-item v-if="member.adult&&!member.erased" label="Pozwolenie na Broń" group="right-right-card" class="bg-white">
                  <div class="row">
                    <q-input @keypress.enter="changeWeaponPermission(member.uuid, weaponPermissionNumber, isExist)" filled class="col" v-if="(member.weaponPermission.number==null||!member.weaponPermission.exist)&&member.active" v-model="weaponPermissionNumber" label="Numer pozwolenia"/>
                    <q-btn class="col" v-if="(!member.weaponPermission.exist)&&member.active" label="Dodaj" color="primary" @click="changeWeaponPermission(member.uuid, weaponPermissionNumber, isExist)"/>
                    <q-btn class="col" v-if="(member.weaponPermission.exist)&&active" label="Usuń pozwolenie" color="primary" @click="memberUUID=member.uuid,permission = true,eraseWeapon=true"/>
                  </div>
                  <q-field v-if="!member.license.valid&&member.weaponPermission.exist" class="col bg-red" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline " tabindex="0">POSIADA NIE WAŻNĄ LICENCJĘ!!!</div>
                    </template>
                  </q-field>
</q-expansion-item>
<q-expansion-item v-if="member.adult&&!member.erased" label="Dopuszczenie do Posiadania Broni" group="right-right-card" class="bg-white">
                  <div class="row">
                    <q-input @keypress.enter="changeWeaponAdmission (member.uuid, admissionToPossess, admissionToPossessIsExist)" filled class="col" v-if="(member.weaponPermission.admissionToPossessAWeapon==null||!member.weaponPermission.admissionToPossessAWeaponIsExist)&&member.active" v-model="admissionToPossess" label="Numer Dopuszczenia"/>
                    <q-btn class="col" v-if="(!member.weaponPermission.admissionToPossessAWeaponIsExist)&&member.active" label="Dodaj" color="primary" @click="changeWeaponAdmission (member.uuid, admissionToPossess, admissionToPossessIsExist)"/>
                    <q-btn class="col" v-if="(member.weaponPermission.admissionToPossessAWeaponIsExist)&&active" label="Usuń dopuszczenie" color="primary" @click="memberUUID=member.uuid, admission = true,eraseAssest=true"/>
                  </div>
                  <q-field v-if="!member.license.valid&&member.weaponPermission.exist" class="col bg-red" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline " tabindex="0">POSIADA NIE WAŻNĄ LICENCJĘ!!!</div>
                    </template>
                  </q-field>
</q-expansion-item>
<q-expansion-item v-if="member.adult&&!member.erased" label="Uprawnienia" group="right-right-card" class="bg-white">
<q-expansion-item v-if="member.memberPermissions.shootingLeaderNumber==null" label="Prowadzący Strzelanie" group="qualifications">
                  <div class="row">
                  <q-input @keypress.enter="memberUUID=member.uuid,shootingLeaderConfirm=true" filled class="col" v-if="member.memberPermissions.shootingLeaderNumber==null" v-model="permissionsShootingLeaderNumber" label="Numer Uprawnień"/>
                  <q-btn class="col" v-if="member.memberPermissions.shootingLeaderNumber==null" label="Dodaj" color="primary" @click="memberUUID=member.uuid,shootingLeaderConfirm=true"/>
                  </div>
</q-expansion-item>
<q-expansion-item v-if="member.memberPermissions.instructorNumber==null" label="Instruktor" group="qualifications">
                  <div class="row">
                    <q-input @keypress.enter="memberUUID=member.uuid,instructorConfirm=true" filled class="col" v-if="member.memberPermissions.instructorNumber==null" v-model="permissionsInstructorNumber" label="Numer Uprawnień" />
                    <q-btn class="col" v-if="member.memberPermissions.instructorNumber==null" label="Dodaj" color="primary" @click="memberUUID=member.uuid,instructorConfirm=true"/>
                  </div>
</q-expansion-item>
<q-expansion-item v-if="member.adult&&!member.erased" label="Sędzia" group="qualifications">
                    <q-item class="full-width col">
                      <q-input outlined filled class="full-width" v-if="member.memberPermissions.arbiterNumber==null||member.memberPermissions.arbiterNumber==''" v-model="permissionsArbiterNumber" label="Numer Uprawnień" />
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
                        <q-btn class="col" v-if="member.memberPermissions.arbiterNumber!=null" color="primary" label="Przedłuż" @click="memberUUID=member.uuid,arbiterProlongConfirm=true"/>
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
                    <q-btn class="full-width col-1" v-if="member.memberPermissions.arbiterNumber!=null" color="primary" label="Podnieś Klasę" @click="memberUUID=member.uuid,arbiterUpdateClassConfirm=true"/>
                    <q-btn class="full-width col-1" v-if="member.memberPermissions.arbiterNumber==null||member.memberPermissions.arbiterNumber==''" label="Dodaj" color="primary" @click="memberUUID=member.uuid,arbiterConfirm=true"/>
                    </q-item>
                      </div>
    </q-expansion-item>
    </q-expansion-item>
    <q-expansion-item v-if="!member.erased" label="Portal PZSS" group="right-right-card" class="bg-white">
      <div class="row">
        <q-field v-if="member.pzss" class="col" standout stack-label>
          <template v-slot:control>
            <div class="text-center full-width no-outline" tabindex="0">Wprowadzony do portalu</div>
          </template>
        </q-field>
        <q-field v-if="!member.pzss" class="col bg-red-3" standout stack-label>
          <template v-slot:control>
            <div class="text-center full-width no-outline" tabindex="0">Nie Wprowadzony do Portalu</div>
          </template>
        </q-field>
        <q-item v-if="member.pzss"><q-btn type="a" href="https://portal.pzss.org.pl/CLub/Player" target="_blank" label="Przejdź do portalu" color="primary"/></q-item>
        <q-item v-if="!member.pzss"><q-btn type="a" href="https://portal.pzss.org.pl/CLub/Player/Add" target="_blank" label="Przejdź do portalu" color="primary" @click="memberUUID=member.uuid,pzssPortal = true"/></q-item>
      </div>
    </q-expansion-item>
    <!-- aktywować gdy będą już karty z kodami kreskowymi -->
    <!-- <q-expansion-item v-if="!member.erased" label="Przydziel Numer Karty" group="right-right-card" class="bg-white">
      <div class="row">
            <q-input filled class="col bg-orange" dark label-color="white" stack-label color="white" label="Zeskanuj Kartę Tutaj"></q-input>
        <q-item><q-btn label="dodaj" color="primary"/></q-item>
      </div>
    </q-expansion-item> -->
    <q-expansion-item v-if="member.active" label="Przenieś do Nieaktywnych" group="right-right-card" class="bg-red">
                <div class="q-pa-md text-h6 text-bold text-center full-width bg-red-2">Czy napewno chcesz przenieść osobę?</div>
                <div class="q-pa-md text-bold text-center full-width bg-red-2"><q-btn class="full-width" label="Przenieś" color="red" @click="memberUUID=member.uuid,deactivate=true"/></div>
</q-expansion-item>
<q-expansion-item v-if="!member.adult&&active" label="Przenieś do Grupty Powszechnej" group="right-right-card">
                <q-item><q-item-label v-if="member.active">Czy napewno chcesz przenieść osobę?</q-item-label></q-item>
                <q-item><q-btn label="Przenieś" color="red" @click="memberUUID=member.uuid,changeAdultConfirm=true"/></q-item>
</q-expansion-item>
<q-expansion-item @focus.stop="erasedReasontype=null,erasedDate=null" class="bg-red" @click="getListErasedType()" v-if="!member.active&&!member.erased" label="Skreśl z listy członków" group="right-right-card">
                <q-item class="bg-red-2"><q-item-label class="text-h6 text-bold text-center full-width">Czy napewno chcesz usunąć osobę?</q-item-label></q-item>
                  <q-item class="bg-red-2">
                    <q-select color="black" options-cover filled stack-label class="full-width" v-model="erasedReasontype" :options="erasedTypes" label="wybierz przyczynę"></q-select>
                      <q-input class="col-5" color="black" outlined filled v-model="erasedDate" mask="####/##/##" label="w dniu:">
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="erasedDate">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Zamknij" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                  </q-item>
                <q-item class="bg-red-2">
                  <q-input @keypress.enter="memberUUID=member.uuid,eraseConfirm=true" v-model="reason" filled color="black" class="col" stack-label label="Dodatkowe informacje"/>
                  </q-item>
                <q-item class="bg-red-2" v-if="erasedReasontype!=null"><q-btn label="Usuń" color="red" @click="memberUUID=member.uuid,eraseConfirm=true"/></q-item>
</q-expansion-item>
<q-expansion-item v-if="!member.active&&!member.erased" class="bg-green" label="Przywróć do Aktywnych" group="right-right-card">
                <q-item class="bg-green-2"><q-item-label class="text-h6 text-bold text-center full-width">Czy napewno chcesz przywrócić osobę?</q-item-label></q-item>
                <q-item class="bg-green-2"><q-btn class="full-width" label="Przywróć" color="green-8" @click="memberUUID=member.uuid,backConfirm=true"/></q-item>
</q-expansion-item>
<q-expansion-item v-if="!member.active&&member.erased" class="bg-green" label="Przywróć Członka klubu" group="right-right-card">
                <q-item class="bg-green-2"><q-item-label class="text-h6 text-bold text-center full-width">Czy napewno chcesz przywrócić osobę?</q-item-label></q-item>
                <q-item class="bg-green-2"><q-btn label="Przywróć" class="full-width" color="green-8" @click="memberUUID=member.uuid,resurrectCode=true"/></q-item>
</q-expansion-item>
</q-expansion-item>
<q-expansion-item label="Historia startów" group="right-card" class="bg-grey-3">
              <div class="bg-white">
              <q-field class="col" standout stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline text-center" tabindex="0">Licznik startów</div>
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
  <q-expansion-item label="Daty Startów" class="bg-grey-3 q-pa-none">
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
                    <div class="self-center full-width no-outline" tabindex="2"> {{judgingHistory.judgingFunction}} </div>
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
            <p></p>
            <q-btn class="full-width" v-if="member.active&&!member.erased" label="Zmień Dane" color="secondary" @click="memberUUID=member.uuid,memberIdcard = member.idcard,memberFirstName = member.firstName,memberSecondName = member.secondName,basicDataConfirm=true"></q-btn>
            </q-item-section>
          </q-card-section>
          <q-card-section class="col-3">
            <q-item-section >
            <q-item-label>Dane Kontaktowe</q-item-label>
            <q-item-label caption lines="2">e-mail : {{member.email}}</q-item-label>
            <q-item-label caption lines="2">Numer Telefonu : {{member.phoneNumber}}</q-item-label>
            <q-item-label>Adres</q-item-label>
            <q-item-label caption lines="2">Miasto : {{member.address.postOfficeCity}}</q-item-label>
            <q-item-label caption lines="2">Kod Pocztowy : {{member.address.zipCode}}</q-item-label>
            <q-item-label caption lines="2">Ulica : {{member.address.street}} {{member.address.streetNumber}}</q-item-label>
            <q-item-label caption lines="2">Numer mieszkania : {{member.address.flatNumber}}</q-item-label>
            <p></p>
            <q-btn v-if="member.active&&!member.erased" class="full-width" label="Aktualizuj Dane Kontaktowe" color="secondary" @click="memberUUID=member.uuid,memberEmail = member.email,memberPhoneNumber = member.phoneNumber,memberPostOfficeCity = member.address.postOfficeCity,memberZipCode = member.address.zipCode,memberStreet = member.address.street,memberStreetNumber = member.address.streetNumber,memberFlatNumber=member.address.flatNumber,addressConfirm=true"></q-btn>
            </q-item-section>
          </q-card-section>
          <q-card-section class="col-5">
            <div class="col full-width">
                <q-item><q-btn class="full-width" label="Pobierz kartę Członkowską" color="secondary" @click="memberUUID=member.uuid,name=member.firstName,name2=member.secondName,personalCardDownloadConfirm=true"/></q-item>
                <q-item><q-btn class="full-width" label="Pobierz ostatnie potwierdzenie składki" color="secondary" @click="memberUUID=member.uuid,name=member.firstName,name2=member.secondName,contributionDownloadConfirm=true"/></q-item>
                <q-item v-if="member.active&&!member.erased&&member.license.number!=null"><q-btn class="full-width" label="Pobierz wniosek o licencję" color="secondary" @click="memberUUID=member.uuid,name=member.firstName,name2=member.secondName,getApplicationForExtensionOfTheCompetitorsLicense ()"/></q-item>
                <q-item v-if="member.active&&!member.erased&&member.adult"><q-btn class="full-width" label="Pobierz Zaświadczenie o przynależności" color="secondary" @click="memberUUID=member.uuid,name=member.firstName,name2=member.secondName,certificateDownload = true"/></q-item>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div v-if="allMember==true">
        <q-scroll-area class="full-width q-pa-none" style="height: 1000px;">
        <div v-for="(memberDTO,uuid) in memberDTOArg" :key="uuid" class="col">
          <div class="row">
            <div v-if="!memberDTO.erased" class="col" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field class="col full-width" align="left" standout stack-label>
              <template v-slot:control>
                <div>
                  <div class="self-center full-width no-outline" tabindex="0">{{memberDTO.secondName}} {{memberDTO.firstName}}</div>
                  <div v-if="!memberDTO.pzss" class="self-center full-width no-outline" tabindex="0">Nie wpisany do portalu PZSS</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="!memberDTO.erased" class="col" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field class="col full-width" align="left" standout stack-label>
              <template v-slot:control>
                <div class="row">
                  <div class="self-center full-width no-outline" tabindex="0">Numer leg. {{memberDTO.legitimationNumber}}</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="!memberDTO.erased && memberDTO.license.number!=null && memberDTO.license.valid" class="col" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field  class="col full-width" align="left" standout stack-label>
              <template v-slot:control>
                <div class="row">
                  <div class="self-center full-width no-outline" tabindex="0">Licencja jest ważna</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="memberDTO.license.number!=null && !memberDTO.license.valid && !memberDTO.erased" class="col" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field  class="col full-width bg-yellow-3" align="left" standout stack-label>
              <template v-slot:control>
                <div class="row">
                  <div class="self-center full-width no-outline" tabindex="0">Licencja jest nieważna</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="memberDTO.license.number==null && !memberDTO.erased" class="col" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field  class="col full-width" align="left" standout stack-label>
              <template v-slot:control>
                <div class="row">
                  <div class="self-center full-width no-outline" tabindex="0">Nie posiada licencji</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="memberDTO.active && !memberDTO.erased" class="col" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field class="col full-width bg-green-3" align="left" standout stack-label>
              <template v-slot:control>
                <div class="row">
                  <div class="text-center full-width no-outline" tabindex="0">Klubowicz Aktywny</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="!memberDTO.active && !memberDTO.erased"  class="col" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field class="col full-width bg-red-4" align="left" standout stack-label>
              <template v-slot:control>
                <div class="row">
                  <div class="self-center full-width no-outline" tabindex="0">Klubowicz Nieaktywny - Sprawdź składki</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="memberDTO.erased && memberDTO.erasedEntity.erasedType == erasedType" class="col-3" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field class="col full-width" align="left" standout stack-label>
              <template v-slot:control>
                <div>
                  <div class="self-center full-width no-outline" tabindex="0">{{memberDTO.secondName}} {{memberDTO.firstName}}</div>
                  <div v-if="!memberDTO.pzss" class="self-center full-width no-outline" tabindex="0">Nie wpisany do portalu PZSS</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="memberDTO.erased && memberDTO.erasedEntity.erasedType == erasedType" class="col-3" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field   class="col full-width" align="left" standout stack-label>
              <template v-slot:control>
                <div class="row">
                  <div class="self-center full-width no-outline" tabindex="0">Numer leg. {{memberDTO.legitimationNumber}}</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="memberDTO.erased && memberDTO.license.number!=null && memberDTO.license.valid && memberDTO.erasedEntity.erasedType == erasedType" class="col-3" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field  class="col full-width" align="left" standout stack-label>
              <template v-slot:control>
                <div class="row">
                  <div class="self-center full-width no-outline" tabindex="0">Licencja jest ważna</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="memberDTO.erased && memberDTO.license.number!=null && !memberDTO.license.valid && memberDTO.erasedEntity.erasedType == erasedType" class="col-3" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field  class="col full-width bg-yellow-3" align="left" standout stack-label>
              <template v-slot:control>
                <div class="row">
                  <div class="self-center full-width no-outline" tabindex="0">Licencja jest nieważna</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="memberDTO.erased && memberDTO.license.number==null && memberDTO.erasedEntity.erasedType == erasedType" class="col-3" @click="showloading(),allMember=false,memberName =memberDTO.secondName + ' '+memberDTO.firstName+' leg. '+memberDTO.legitimationNumber,getMemberFromList (memberDTO.legitimationNumber)">
            <q-field  class="col full-width" align="left" standout stack-label>
              <template v-slot:control>
                <div class="row">
                  <div class="self-center full-width no-outline" tabindex="0">Nie posiada licencji</div>
                </div>
              </template>
            </q-field>
            </div>
            <div v-if="memberDTO.erased && memberDTO.erasedEntity.erasedType == erasedType" class="col-3">
            <q-field class="col full-width bg-grey-4" align="left" standout stack-label>
              <template v-slot:control>
                <div class="row">
                  <div class="self-center full-width no-outline" tabindex="0">{{memberDTO.erasedEntity.erasedType}} {{memberDTO.erasedEntity.date}}</div>
                  <div v-if="memberDTO.erasedEntity.additionalDescription!=null" class="self-center full-width no-outline" tabindex="0">{{memberDTO.erasedEntity.additionalDescription}}</div>
                </div>
              </template>
            </q-field>
            </div>
            </div>
        </div>
        </q-scroll-area>
      </div>
      <q-dialog v-model="contribution" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy przedłużyć składkę?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="przedłuż" color="primary" v-close-popup @click="contributionCode=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="prolongContribution(memberUUID),contributionCode=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup @click="prolongContribution(memberUUID),code=null" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionHistoryCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="addHistoryContributionRecord (memberUUID, historyContributionRecord),contributionHistoryCode=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup @click="addHistoryContributionRecord (memberUUID, historyContributionRecord),code=null" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addressConfirm" persistent>
      <q-card>
        <q-card-section class="col items-center">
                <q-item><q-input v-model="memberEmail" label="e-mail" /></q-item>
                <q-item><q-input @focus="memberPhoneNumber = null" v-model="memberPhoneNumber" hint="tylko cyfry" label="Numer Telefonu" placeholder="tylko cyfry" mask="#########"/></q-item>
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
          <q-btn flat label="zmień" color="primary" v-close-popup @click="updateMember(memberUUID, memberEmail, memberPhoneNumber),
                updateAddress(memberUUID, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="pzssPortal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy Klubowicz został dodany do portalu?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="nie" color="primary" v-close-popup />
          <q-btn label="tak" color="primary" v-close-popup @click="changePzss (memberUUID)"/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="basicDataConfirm" persistent>
      <q-card>
        <q-card-section class="col items-center">
        <q-item-label class="text-bold text-center text-h6">Zmień dane podstawowe</q-item-label>
        <q-item><q-input v-model="memberIdcard" hint="XXX 000000" label="Numer Dowodu" placeholder="XXX 000000" mask="AAA ######"/></q-item>
        <q-item><q-input v-model="memberFirstName" label="Imię" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 45" /></q-item>
        <q-item><q-input v-model="memberSecondName" label="Nazwisko" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 45" /></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Aktualizuj" color="primary" v-close-popup  @click="basicDataConfirm1=true" />
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
          <q-btn flat label="zmień" color="primary" v-close-popup @click="updateIDCardAndName(memberUUID,memberIdcard,memberFirstName,memberSecondName)" />
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
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="addLicense(memberUUID, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)" />
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
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="addLicense(memberUUID, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)" />
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
          <q-btn flat label="Przedłuż" color="primary" v-close-popup @click="prolongLicense(memberUUID, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)" />
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
          <q-btn flat label="przenieś" color="primary" v-close-popup @click="activeCode=true" />
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
          <q-btn flat label="przywróć" color="primary" v-close-popup @click="activeCode=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="activeCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="changeActive (memberUUID),activeCode=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="Przenieś" color="black" v-close-popup @click="changeActive (memberUUID),code=null" />
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
          <q-btn flat label="usuń" color="primary" v-close-popup @click="removeWeaponPermissionOrAdmission()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="eraseAssest" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno usunąć dopuszczenie?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="usuń" color="primary" v-close-popup @click="removeWeaponPermissionOrAdmission()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="licensePayment" persistent @keypress.enter="addLicenseHistoryPayment (memberUUID),licensePayment=false">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy licencja została opłacona?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Tak" color="primary" v-close-popup @click="addLicenseHistoryPayment (memberUUID)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="instructorConfirm" persistent @keypress.esc="instructorConfirm=false" @keypress.enter="updateMemberPermissions(memberUUID, permissionsInstructorNumber),instructorConfirm=false,value=true">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno chcesz nadać numer instruktora?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Tak" color="primary" v-close-popup @click="updateMemberPermissions(memberUUID, permissionsInstructorNumber),value=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="shootingLeaderConfirm" persistent @keypress.esc="shootingLeaderConfirm=false" @keypress.enter="updateMemberPermissions(memberUUID, permissionsShootingLeaderNumber),shootingLeaderConfirm=false,value1=true">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno chcesz nadać numer Prowadzącego strzelanie?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Tak" color="primary" v-close-popup @click="updateMemberPermissions(memberUUID, permissionsShootingLeaderNumber),value1=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterConfirm" persistent @keypress.esc="arbiterConfirm=false" @keypress.enter="updateMemberPermissions(memberUUID, permissionsArbiterNumber, permissionsArbiterPermissionValidThru),arbiterConfirm=false,value2=true">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno chcesz nadać numer Sędziego?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Tak" color="primary" v-close-popup @click="updateMemberPermissions(memberUUID, permissionsArbiterNumber, permissionsArbiterPermissionValidThru),arbiterProlongConfirm=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterProlongConfirm" persistent @keypress.enter="updateMemberPermissions(memberUUID, permissionsArbiterPermissionValidThru),value3=true,arbiterUpdateClassConfirm=false">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno chcesz przedłużyć licencję Sędziego?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Przedłuż" color="primary" v-close-popup @click="updateMemberPermissions(memberUUID, permissionsArbiterPermissionValidThru),value3=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterUpdateClassConfirm" persistent @keypress.enter="updateMemberPermissions(memberUUID),value4=true,arbiterUpdateClassConfirm=false">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno chcesz podnieść klasę licencji Sędziego?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="podnieś" color="primary" v-close-popup @click="updateMemberPermissions(memberUUID),value4=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="eraseConfirm" persistent @keypress.enter="eraseCode=true,eraseConfirm=false">
      <q-card class="bg-red">
        <q-card-section class="row items-center">
          <q-avatar icon="warning"/>
          <span class="q-ml-sm">Czy napewno chcesz usunąć Klubowicza z listy członków klubu?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="white" v-close-popup />
          <q-btn flat label="usuń" color="white" v-close-popup @click="eraseCode=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="eraseBackConfirm" persistent @keypress.enter="resurrectCode=true,eraseBackConfirm=false">
      <q-card class="bg-green">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy przywrócić Członka klubu?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="white" v-close-popup />
          <q-btn flat label="przywróć" color="white" v-close-popup @click="eraseCode=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="eraseCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="eraseMember(memberUUID),eraseCode=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="skreśl" color="black" v-close-popup @click="eraseMember(memberUUID),code=null" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="changeAdultConfirm" persistent @keypress.enter="changeAdultCode=true,changeAdultConfirm=false">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning"/>
          <span class="q-ml-sm">Czy napewno chcesz przenieść Klubowicza do grupy powszechnej?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Przenieś" color="primary" v-close-popup @click="changeAdultCode=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="changeAdultCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="changeAdult(memberUUID),changeAdultCode=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup @click="changeAdult(memberUUID),code=null" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionDownloadConfirm" persistent @keypress.enter="contributionDownloadConfirm=false,getContributionPDF()">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Pobrać potwierdzenie składki?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getContributionPDF()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="personalCardDownloadConfirm" persistent @keypress.enter="personalCardDownloadConfirm=false,getPersonalCardPDF()">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Pobrać kartę Klubowicza?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getPersonalCardPDF()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="certificateDownload" persistent @keypress.enter="getdownloadCertificateOfClubMembership(),certificateDownload=false">
      <q-card>
        <q-card-section class="col items-center">
          <p class="q-ml-sm text-h6 text-bold">Pobrać zaświadczenie do policji dla Klubowicza?</p>
          <p class="q-ml-sm text-bold">Pamiętaj aby sprawdzić składki Klubowicza</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getdownloadCertificateOfClubMembership()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addAmmoConfirm" persistent @keypress.enter="addMemberAndAmmoToCaliber(),addAmmoConfirm=false">
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
<q-dialog v-model="patentConfirm1" persistent @keypress.enter="addPatent(memberUUID, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission,patentDate),patentConfirm1=false">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy napewno chcesz dodać PATENT?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="addPatent(memberUUID, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission,patentDate)"/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="instructorAlert" @keypress.enter="instructorAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nadano uprawnienia Instruktora</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="shootingLeaderAlert" @keypress.enter="shootingLeaderAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nadano uprawnienia Prowadzącego Strzelanie</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="patentAlert" @keypress.enter="patentAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Patent został zapisany</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="licenseAlert" @keypress.enter="licenseAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Licencja została zapisana</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="weapon" @keypress.enter="weapon=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Ustawiono pozwolenie/dopuszczenie</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="dataAlert" @keypress.enter="dataAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zaktualizowano</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="deactivateAlert" @keypress.enter="deactivateAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Przeniesiono</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterAlert" @keypress.enter="arbiterAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano sędziego</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterProlongAlert" @keypress.enter="arbiterProlongAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Przedłużono datę ważności licencji Sędziego</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterUpdateClassAlert" @keypress.enter="arbiterUpdateClassAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Podniesiono klasę licencji Sędziego</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionAlert" @keypress.enter="contributionAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Składka została przedłużona</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup />
          <q-btn flat label="Pobierz Potwierdzenie" color="primary" v-close-popup @click="getContributionPDF()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionRemoveRecordQuerry" persistent @keypress.enter="contributionRemoveRecordQuerry=false,contributionRemoveRecordQuerryCode=true">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="row items-center">
          <h3><span class="q-ml-sm">Czy na pewno usunąć składkę?</span></h3>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup />
          <q-btn label="Usuń" color="black" v-close-popup @click="contributionRemoveRecordQuerryCode=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionRemoveRecordQuerryCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input @keypress.enter="removeContributionRecord(),contributionRemoveRecordQuerryCode=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Usuń" color="black" v-close-popup @click="removeContributionRecord()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionRecordAlert" @keypress.enter="contributionRecordAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Rekord w historii został dodany</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionRemoveRecordAlert" @keypress.enter="contributionRemoveRecordAlert=false">
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
<q-dialog v-model="changeAdultAlert" @keypress.enter="changeAdultAlert=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Klubowicz został przeniesiony do Grupy Powszechnej</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="failure" @keypress.enter="failure=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można wykonać żądania. Sprawdź poprawność danych.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="forbidden" @keypress.enter="forbidden=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Niewłaściwy kod. Spróbuj ponownie.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="editLicense" @keypress.esc="editLicense=false">
      <q-card>
        <q-card-section class="col">
          <div class="text-h5 text-bold text-center">Edytuj Licencje</div>
          <div class="text-h6">Uwaga! Wprowadzając zmiany bądź pewny tego co robisz</div>
          <div class="row bg-grey-3">
            <div class="q-pa-md col-6">
              <q-input filled standout stack-label v-model="editLicenseNumber" label="Numer Licencji"></q-input>
            </div>
            <div class="q-pa-md col-6">
              <q-input filled standout stack-label v-model="editLicenseDate" mask="####/12/31" label="Ważność licencji">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="editLicenseDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
            <div class="q-pa-md row full-width bg-grey-3">
              <q-btn class="full-width" label="wprowadź zmiany" color="primary" v-close-popup @click="editLicenseCode=true"/>
            </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="editLicenseCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input @keypress.enter="forceUpdateLicence(),editLicenseCode=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup @click="forceUpdateLicence()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="editContribution" @keypress.esc="editContribution=false">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-bold text-center">Edytuj Składkę</div>
          <div class="text-h6 text-center">Uwaga! Wprowadzając zmiany bądź pewny tego co robisz</div>
          <div class="text-h6 text-center">Pamiętaj! Składki dla młodzieży ustaw na 02/28 lub 08/31</div>
          <div class="text-h6 text-center">Pamiętaj! Składki dla dorosłych ustaw na 06/30 lub 12/31</div>
          <div class="row bg-grey-3">
            <div class="q-pa-md col-6">
              <q-input  v-model="editContributionPaymentDate" filled standout stack-label mask="####/##/##" label="Data Opłacenia Składki">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="editContributionPaymentDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="q-pa-md col-6">
              <q-input class="col-6" v-model="editContributionValidThruDate" filled standout stack-label mask="####/##/##" label="Ważność Sładki">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="editContributionValidThruDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row full-width bg-red-3">
            <div class="col-6 q-pa-md">
              <q-btn class="full-width" label="usuń Składkę" color="red" @click="contributionRemoveRecordQuerry=true,editContribution=false"></q-btn>
            </div>
            <div class="col-6 q-pa-md bg-grey-3">
              <q-btn class="full-width" label="wprowadź zmiany" color="primary" v-close-popup @click="editContributionCode=true"/>
            </div>
          </div>
            <div class="col-6 q-pa-md bg-grey-3">
              <q-btn class="full-width" label="Wydrukuj potwierdzenie dla tej składki" color="primary" v-close-popup @click="contributionDownloadConfirm=true"/>
            </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="editContributionCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input @keypress.enter="editContributionRecord(),code=null,editContributionCode=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup @click="editContributionRecord(), code=null" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="editLicensePayment" @keypress.esc="editLicensePayment=false">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-bold text-center">Edytuj Opłatę za Licencję</div>
          <div class="text-h6 text-center">Uwaga! Wprowadzając zmiany bądź pewny tego co robisz</div>
          <div class="row bg-grey-3">
            <div class="q-pa-md col-6">
              <q-input  v-model="editLicensePaymentDate" filled standout stack-label mask="####/##/##" label="Data Opłacenia Licencji">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="editLicensePaymentDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="q-pa-md col-6">
              <q-input class="col-6" v-model="editLicensePaymentYear" filled standout stack-label mask="####" label="Opłacona na Rok"></q-input>
            </div>
          </div>
          <div class="row full-width bg-red-3">
            <!-- <div class="col-6 q-pa-md">
              <q-btn class="full-width" label="usuń wpłatę" color="red" @click="editLicensePaymentCode=true"></q-btn>
            </div> -->
            <div class="col q-pa-md bg-grey-3">
              <q-btn class="full-width" label="wprowadź zmiany" color="primary" v-close-popup @click="editLicensePaymentCode=true"/>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="editLicensePaymentCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input @keypress.enter="editLicenseHistoryPayment(),code=null,editLicensePaymentCode=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup @click="editLicenseHistoryPayment(), code=null" />
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
      editLicense: false,
      editLicenseDate: null,
      editLicenseNumber: null,
      editLicenseCode: false,
      editLicensePayment: false,
      editLicensePaymentDate: null,
      editLicensePaymentYear: null,
      editLicensePaymentCode: false,
      editContribution: false,
      editContributionPaymentDate: null,
      editContributionValidThruDate: null,
      editContributionCode: false,
      paymentUUID: null,
      member: null,
      con: false,
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
      changeAdultConfirm: false,
      changeAdultCode: false,
      changeAdultAlert: false,
      eraseAlert: false,
      backAlert: false,
      eraseConfirm: false,
      eraseBackConfirm: false,
      eraseCode: false,
      resurrectCode: false,
      backConfirm: false,
      activeCode: false,
      contributionRecord: '',
      contributionUUID: null,
      basicDataConfirm: false,
      basicDataConfirm1: false,
      contributionAlert: false,
      contributionDownloadConfirm: false,
      contributionConfirmDownloadAlert: false,
      personalCardDownloadConfirm: false,
      addressConfirm: false,
      addressConfirm1: false,
      historyContributionRecord: Date.now,
      contributionRecordConfirm: false,
      contributionRecordConfirm1: false,
      contributionRecordAlert: false,
      contributionRemoveRecordAlert: false,
      contributionRemoveRecordQuerry: false,
      contributionRemoveRecordQuerryCode: false,
      code: null,
      addAmmoConfirm: false,
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
      contributionCode: false,
      contributionHistoryCode: false,
      deactivate: false,
      eraseWeapon: false,
      eraseAssest: false,
      licenseConfirm: false,
      licensePayment: false,
      instructorConfirm: false,
      shootingLeaderConfirm: false,
      arbiterConfirm: false,
      arbiterProlongConfirm: false,
      arbiterUpdateClassConfirm: false,
      failure: false,
      number: '',
      legNumber: null,
      patentNumber: '',
      licenseNumber: '',
      validThru: '',
      members: [],
      memberDTOArg: [],
      calibers: [],
      ammos: [],
      quantities: [],
      erasedTypes: [],
      erasedType: null,
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
      erasedReasontype: null,
      erasedDate: null,
      weaponPermissionNumber: null,
      isExist: true,
      admissionToPossess: null,
      admissionToPossessIsExist: true,
      admission: false,
      permission: false,
      secondName: '',
      memberEmail: '',
      memberPhoneNumber: '',
      memberIdcard: '',
      memberSecondName: '',
      memberFirstName: '',
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
      memberUUID: null,
      caliberUUID: null,
      quantity: '',
      model: null,
      dateVar: /\//gi,
      contributionDate: Date.now,
      allMember: true,
      confirm: false,
      certificateDownload: false,
      pzssPortal: false,
      portal: false,
      forbidden: false,
      local: 'localhost:8080/shootingplace',
      local1: 'localhost:8080/shootingplace-1.0'
    }
  },
  created () {
    this.getMembersNames()
    this.getListCalibers()
    this.getMembersQuantity()
    this.getAllMemberDTOWithArgs()
    this.getListErasedType()
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
      fetch('http://' + this.local + '/contribution/history/' + uuid + '?date=' + date.replace(/\//gi, '-') + '&pinCode=' + this.code, {
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
          this.code = null
        }
        if (response.status === 403) {
          this.forbidden = true
          this.code = null
        }
        if (response.status === 409) {
          this.code = null
          this.failure = true
        }
      })
    },
    getMember (uuid) {
      const memberNameWord = this.memberName.split(' ')
      var legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      fetch('http://' + this.local + '/member/' + memberNameUUID, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json()).then(response => {
        this.showloading()
        this.member = response
      })
    },
    getMemberFromList (leg) {
      fetch('http://' + this.local + '/member/' + leg, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json()).then(response => {
        this.showloading()
        this.member = response
      })
    },
    getMembersQuantity () {
      fetch('http://' + this.local + '/member/membersQuantity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.quantities = response
        })
    },
    editContributionRecord () {
      fetch('http://' + this.local + '/contribution/edit?memberUUID=' + this.memberUUID + '&contributionUUID=' + this.contributionUUID + '&paymentDay=' + this.editContributionPaymentDate.replace(/\//gi, '-') + '&validThru=' + this.editContributionValidThruDate.replace(/\//gi, '-') + '&pinCode=' + this.code, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.dataAlert = true
          this.code = null
          this.getMembersNames()
          this.showloading()
          this.getMember(this.memberUUID)
          this.code = null
        }
        if (response.status === 403) {
          this.forbidden = true
          this.code = null
        }
        if (response.status === 409) {
          this.code = null
          this.failure = true
        }
      })
    },
    removeContributionRecord () {
      fetch('http://' + this.local + '/contribution/remove/' + this.memberUUID + '?contributionUUID=' + this.contributionUUID + '&pinCode=' + this.code, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.contributionRemoveRecordAlert = true
          this.code = null
          this.getMembersNames()
          this.showloading()
          this.getMember(this.legNumber)
          this.code = null
        }
        if (response.status === 403) {
          this.forbidden = true
          this.code = null
        }
        if (response.status === 409) {
          this.code = null
          this.failure = true
        }
      })
    },
    prolongContribution (uuid) {
      fetch('http://' + this.local + '/contribution/' + uuid + '?pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          this.contributionAlert = true
          this.getMembersNames()
          this.showloading()
          this.getMember(this.legNumber)
          this.code = null
        }
        if (response.status === 403) {
          this.forbidden = true
          this.code = null
        }
        if (response.status === 409) {
          this.code = null
          this.failure = true
        }
      })
    },
    updateMember (uuid, email, phoneNumber) {
      var data = {
        email: email,
        phoneNumber: phoneNumber
      }
      fetch('http://' + this.local + '/member/' + uuid, {
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
    updateIDCardAndName (uuid, idcard, firstName, secondName) {
      var data = {
        idcard: idcard,
        firstName: firstName,
        secondName: secondName
      }
      fetch('http://' + this.local + '/member/' + uuid, {
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
          this.memberFirstName = ''
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
      fetch('http://' + this.local + '/address/' + uuid, {
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
      fetch('http://' + this.local + '/member/getMembersNames?active=' + this.active + '&adult=' + this.adult + '&erase=' + this.erase, {
        method: 'GET'
      }).then(response => response.json())
        .then(filters => {
          this.filters = filters
        })
    },
    getAllMemberDTOWithArgs () {
      fetch('http://' + this.local + '/member/getAllMemberDTOWithArgs?active=' + this.active + '&adult=' + this.adult + '&erase=' + this.erase, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.memberDTOArg = response
        })
    },
    getListCalibers () {
      fetch('http://' + this.local + '/armory/calibers', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.calibers = response
        })
    },
    getListErasedType () {
      fetch('http://' + this.local + '/member/erasedType', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.erasedTypes = response
        })
    },
    addMemberAndAmmoToCaliber () {
      fetch('http://' + this.local + '/ammoEvidence/ammo?caliberUUID=' + this.caliberUUID + '&legitimationNumber=' + this.memberUUID + '&counter=' + this.quantity + '&otherID=0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.caliberUUID = null
          this.quantity = null
          this.showloading()
          this.getListCalibers()
          this.getMember(this.uuid)
        } else {
          this.quantity = null
          this.failure = true
        }
      }
      )
    },
    getContributionPDF () {
      axios({
        url: 'http://' + this.local + '/files/downloadContribution/' + this.memberUUID + '?contributionUUID=' + this.contributionUUID,
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
        url: 'http://' + this.local + '/files/downloadPersonalCard/' + this.memberUUID,
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
        url: 'http://' + this.local + '/files/downloadApplication/' + this.memberUUID,
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
    getdownloadCertificateOfClubMembership () {
      axios({
        url: 'http://' + this.local + '/files/downloadCertificateOfClubMembership/' + this.memberUUID,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Zaświadczenie_' + this.name + '_' + this.name2 + '.pdf')
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
      fetch('http://' + this.local + '/patent/' + uuid, {
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
      fetch('http://' + this.local + '/license/' + this.memberUUID, {
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
      fetch('http://' + this.local + '/license/' + uuid, {
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
    removeLicenseHistoryPayment () {
      fetch('http://' + this.local + '/license/editPayment?memberUUID=' + this.memberUUID + '&paymentUUID=' + this.paymentUUID + '&paymentDate=' + this.editLicensePaymentDate + '&year=' + this.editLicensePaymentYear + '&pinCode=' + this.code, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.licenseAlert = true
          this.showloading()
          this.getMember(this.memberUUID)
        } else { this.failure = true }
      })
    },
    editLicenseHistoryPayment () {
      fetch('http://' + this.local + '/license/editPayment?memberUUID=' + this.memberUUID + '&paymentUUID=' + this.paymentUUID + '&paymentDate=' + this.editLicensePaymentDate + '&year=' + this.editLicensePaymentYear + '&pinCode=' + this.code, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.licenseAlert = true
          this.showloading()
          this.getMember(this.memberUUID)
        } else { this.failure = true }
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
          this.licenseAlert = true
          this.showloading()
          this.getMember(uuid)
        } else { this.failure = true }
      })
    },
    forceUpdateLicence () {
      fetch('http://' + this.local + '/license/forceUpdate?memberUUID=' + this.memberUUID + '&number=' + this.editLicenseNumber + '&date=' + this.editLicenseDate.replace(/\//gi, '-') + '&pinCode=' + this.code, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.licenseAlert = true
          this.editLicenseNumber = null
          this.editLicenseDate = null
          this.code = null
          this.showloading()
          this.getMember(this.memberUUID)
        }
        if (response.status === 403) {
          this.forbidden = true
        }
        if (response.status === 400) {
          this.failure = true
        }
      })
    },
    changeWeaponPermission (uuid, weaponPermissionNumber, isExist) {
      var data = {
        number: weaponPermissionNumber,
        exist: isExist
      }
      fetch('http://' + this.local + '/weapon/weapon/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.weapon = true
          this.weaponPermissionNumber = null
          this.showloading()
          this.getMember(uuid)
        }
        if (response.status === 400) {
          this.failure = true
        }
      })
    },
    changeWeaponAdmission (uuid, admissionToPossess, admissionToPossessIsExist) {
      var data = {
        admissionToPossessAWeapon: admissionToPossess,
        admissionToPossessAWeaponIsExist: admissionToPossessIsExist
      }
      fetch('http://' + this.local + '/weapon/weapon/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.weapon = true
          this.admissionToPossess = null
          this.showloading()
          this.getMember(uuid)
        }
        if (response.status === 400) {
          this.failure = true
        }
      })
    },
    removeWeaponPermissionOrAdmission () {
      fetch('http://' + this.local + '/weapon/weapon/' + this.memberUUID + '?admission=' + this.admission + '&permission=' + this.permission, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.admission = false
          this.permission = false
          this.showloading()
          this.getMember(this.memberUUID)
        }
        if (response.status === 400) {
          this.failure = true
        }
      })
    },
    changeActive (uuid) {
      fetch('http://' + this.local + '/member/' + uuid + '?pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          this.showloading()
          this.reload()
        }
        if (response.status === 403) {
          this.forbidden = true
          this.code = null
        }
        if (response.status === 404) {
          this.failure = true
          this.code = null
        }
      })
    },
    updateMemberPermissions (uuid, permissionsShootingLeaderNumber, permissionsInstructorNumber, permissionsArbiterNumber, permissionsArbiterPermissionValidThru) {
      var data = {
        shootingLeaderNumber: this.permissionsShootingLeaderNumber,
        instructorNumber: this.permissionsInstructorNumber,
        arbiterNumber: this.permissionsArbiterNumber,
        arbiterPermissionValidThru: this.permissionsArbiterPermissionValidThru.replace(this.dateVar, '-')
      }
      fetch('http://' + this.local + '/permissions/' + uuid + '?ordinal=' + this.ordinal, {
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
          this.getMember(this.memberUUID)
        } else { this.failure = true }
      })
    },
    eraseMember (uuid) {
      fetch('http://' + this.local + '/member/erase/' + uuid + '?additionalDescription=' + this.reason + '&erasedDate=' + this.erasedDate.replace(/\//gi, '-') + '&erasedType=' + this.erasedReasontype + '&pinCode=' + this.code, {
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
      fetch('http://' + this.local + '/member/adult/' + uuid + '?pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        this.changeAdultAlert = true
        this.getMembersNames()
        this.showloading()
        this.getMember(uuid)
      })
    },
    changePzss (uuid) {
      fetch('http://' + this.local + '/member/pzss/' + uuid, {
        method: 'PATCH'
      }).then(response => {
        this.getMembersNames()
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
