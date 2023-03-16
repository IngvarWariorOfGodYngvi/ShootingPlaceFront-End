<template>
  <div v-if="member!=null" :class="mobile?'full-width':'col full-width'">
    <q-card bordered :class="member.active?'row bg-green-3':'row bg-red-3'">
      <q-card-section v-if="member.imageUUID!=null" avatar :class="mobile?'col-4 q-pa-none q-ma-none':'col-2'" >
            <q-img fit=none height="100%" width="100%" class="text-body1" alt="zdjęcie profilowe"
                   :src="('http://' + local + '/files/getFile?uuid=' + member.imageUUID)"/>
      </q-card-section>
      <q-card-section v-else avatar :class="mobile?'col-4':'col-2'">
        <q-uploader style="width:100%;height:100%" method="POST"
                    :url="('http://' + local + '/files/member/' + member.uuid)"
                    label="Dodaj zdjęcie / max 400KB" max-file-size="409600" accept=".jpg, image/*"
                    @rejected="onRejected" field-name="file" @uploaded="getMemberByUUID(member.uuid)"/>
      </q-card-section>
      <q-card-section class="col-4">
        <q-item-label>{{ member.secondName }} {{ member.firstName }}</q-item-label>
        <q-item-label caption class="text-bold text-center bg-secondary text-white" style="border-radius: 1em;">{{member.club.name}}</q-item-label>
        <q-item-label caption lines="2">{{member.adult?'Grupa: Ogólna':'Grupa: Młodzieżowa'}}</q-item-label>
        <q-item-label caption lines="2">{{member.active?'Status: Aktywny':'Status: Nieaktywny'}}</q-item-label>
        <q-item-label v-if="member.history.contributionList.length > 0" caption lines="2">Składka ważna do:
          {{ convertDate(member.history.contributionList[0].validThru) }}
        </q-item-label>
        <q-item-label v-if="member.history.contributionList.length > 0" caption lines="2">Składka opłacona dnia:
          {{ convertDate(member.history.contributionList[0].paymentDay) }}
        </q-item-label>
        <div v-if="member.imageUUID!=null">
          <q-btn color="primary" label="zmień zdjęcie">
            <q-popup-edit>
              <q-uploader style="width:100%;height:100%" method="POST"
                          :url="('http://' + local + '/files/member/' + member.uuid)"
                          label="Dodaj zdjęcie / max 400KB" max-file-size="409600" accept=".jpg, image/*"
                          @rejected="onRejected" field-name="file" @uploaded="getMemberByUUID(member.uuid)"/>
            </q-popup-edit>
          </q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col-3">
        <q-item-label :id="member.legitimationNumber">Numer Legitymacji: {{ member.legitimationNumber }}</q-item-label>
        <q-item-label caption lines="2">Numer PESEL: {{ member.pesel }}</q-item-label>
        <q-item-label caption lines="2">Data Zapisu do Klubu: {{ convertDate(member.joinDate) }}</q-item-label>
      </q-card-section>
      <q-card-section class="col-4">
        <div v-if="member.erased">
          <q-item-label>Podstawa skreślenia z listy Klubowiczów</q-item-label>
          <q-item-label caption lines="2">{{ member.erasedEntity.erasedType }} {{ member.erasedEntity.date }}
          </q-item-label>
          <q-item-label v-if="member.erasedEntity.additionalDescription!=null" caption lines="2">
            {{ member.erasedEntity.additionalDescription }}
          </q-item-label>
        </div>
      </q-card-section>
    </q-card>
    <q-card bordered :class="mobile?'col bg-dark':'row bg-dark'" >
      <q-card-section class="col-3">
        <q-field dense class="col" standout="bg-accent text-positive" color="positive" label-color="positive" stack-label>
          <div class="self-center full-width text-center">Historia Składek</div>
        </q-field>
        <div v-if="!member.erased&&main&&!mobile">
          <div>
            <q-btn class="full-width" color="green" label="Przedłuż składkę"
                   @click="memberUUID = member.uuid;name = member.firstName;name2 = member.secondName;contribution=true"/>
          </div>
        </div>
        <q-expansion-item dense default-opened class="bg-dark full-width q-pa-none text-center text-positive" label="Daty Składek">
          <q-virtual-scroll class="full-width q-pa-none" :style="mobile?'':'height: 65vh;'" :items="member.history.contributionList">
            <template class="row" v-slot="{item}">
              <div class="row full-width"
                   @dblclick="!main&&!mobile?'':(contributionUUID = item.uuid,memberUUID = member.uuid,editContributionPaymentDate=item.paymentDay
                   ,editContributionValidThruDate=item.validThru,editContribution=true)">
                <q-field dense class="col-6" label="Opłacona dnia : " standout="bg-accent" color="positive" label-color="positive" stack-label>
                  <div class="self-center col full-width no-outline text-left">
                    {{ convertDate(item.paymentDay) }}
                  </div>
                </q-field>
                <div class="col-6">
                  <q-field dense class="col" standout="bg-accent"  color="positive" label-color="positive" label="Ważna do : " stack-label>
                    <div class="self-center col full-width no-outline text-left">
                      {{ convertDate(item.validThru) }}
                    </div>
                  </q-field>
                </div>
              </div>
            </template>
          </q-virtual-scroll>
        </q-expansion-item>
      </q-card-section>
      <MemberLicense :memberUUID="member.uuid"
                     :clubID="member.club.id"
                     :adult="member.adult"
                     :active="member.active"
                     :licenseUUID="member.license.uuid"
                     :shootingPatent="member.shootingPatent"
      ></MemberLicense>
      <q-card-section class="col-5 text-center">
        <q-item-section class="text-center text-positive">
          <q-expansion-item dense label="Informacje o Uprawnieniach" class="col items-center bg-dark text-positive'"
                            group="right-card">
            <q-field v-if="(member.memberPermissions.arbiterNumber!==null&&member.memberPermissions.arbiterNumber!=='')"
                     class="col" borderless color="positive" label-color="positive" label="Sędzia" stack-label>
              <q-field dense
                       v-if="(member.memberPermissions.arbiterNumber!==null&&member.memberPermissions.arbiterNumber!=='')"
                       class="col" standout="bg-accent text-positive" color="positive" label-color="positive" label="Numer" stack-label>
                <div class="self-center full-width no-outline text-left">
                  {{ member.memberPermissions.arbiterNumber }}
                </div>
              </q-field>
              <q-field dense
                       v-if="(member.memberPermissions.arbiterNumber!==null&&member.memberPermissions.arbiterNumber!=='')"
                       class="col" standout="bg-accent text-positive" color="positive" label-color="positive" label="Klasa" stack-label>
                <div class="self-center full-width no-outline text-left">
                  {{ member.memberPermissions.arbiterClass }}
                </div>
              </q-field>
              <q-field dense
                       v-if="(member.memberPermissions.arbiterNumber!==null&&member.memberPermissions.arbiterNumber!=='')"
                       class="col" standout="bg-accent text-positive" color="positive" label-color="positive" label="Ważna do" stack-label>
                <div class="self-center full-width no-outline text-left">
                  {{ convertDate(member.memberPermissions.arbiterPermissionValidThru) }}
                </div>
              </q-field>
            </q-field>
            <q-field v-if="member.shootingPatent.patentNumber!==null" class="col" borderless label="Patent"
                     color="positive" label-color="positive" stack-label>
              <div class="col">
                <div class="row">
                  <q-field dense class="col" standout="bg-accent text-positive" label-color="positive" color="positive" label="Numer" stack-label>
                    <div class="self-center full-width no-outline text-left text-positive">
                      {{ member.shootingPatent.patentNumber }}
                    </div>
                  </q-field>
                  <q-field dense class="col" standout="bg-accent text-positive" color="positive" label-color="positive" label="Nadany dnia"
                           stack-label>
                    <div class="self-center full-width no-outline text-left">
                      {{ convertDate(member.shootingPatent.dateOfPosting) }}
                    </div>
                  </q-field>
                </div>
                <q-field class="col" borderless label="Dyscypliny" color="positive" label-color="positive" stack-label>
                  <q-field dense v-if="member.shootingPatent.pistolPermission" class="col"
                           standout="bg-accent text-positive" color="positive" label-color="positive" label="Pistolet" stack-label>
                    <div class="self-center full-width no-outline text-left">
                      {{ convertDate(member.history.patentDay[0]) }}
                    </div>
                  </q-field>
                  <q-field dense v-if="member.shootingPatent.riflePermission" class="col"
                           standout="bg-accent text-positive" color="positive" label-color="positive" label="Karabin" stack-label>
                    <div class="self-center full-width no-outline text-left">
                      {{ convertDate(member.history.patentDay[1]) }}
                    </div>
                  </q-field>
                  <q-field dense v-if="member.shootingPatent.shotgunPermission" class="col"
                           standout="bg-accent text-positive" color="positive" label-color="positive" label="Strzelba" stack-label>
                    <div class="self-center full-width no-outline text-left">
                      {{ convertDate(member.history.patentDay[2]) }}
                    </div>
                  </q-field>
                </q-field>
              </div>
            </q-field>
            <q-field dense v-if="member.weaponPermission.number!=null&&member.weaponPermission.exist" class="col"
                     standout="bg-accent text-positive" color="positive" label-color="positive" label="Numer pozwolenia na broń" stack-label>
              <div class="self-center full-width no-outline text-left">
                {{ member.weaponPermission.number }}
              </div>
            </q-field>
            <q-field dense
                     v-if="member.weaponPermission.admissionToPossessAWeapon!=null&&member.weaponPermission.admissionToPossessAWeaponIsExist"
                     class="col" standout="bg-accent text-positive" color="positive" label-color="positive" label="Numer dopuszczenia do posiadania broni"
                     stack-label>
              <div class="self-center full-width no-outline text-left">
                {{ member.weaponPermission.admissionToPossessAWeapon }}
              </div>
            </q-field>
            <q-field dense
                     v-if="(member.memberPermissions.shootingLeaderNumber!=null&&member.memberPermissions.shootingLeaderNumber!=='')"
                     class="col" standout="bg-accent text-positive" color="positive" label-color="positive" label="Prowadzący Strzelanie" stack-label>
              <div class="self-center full-width no-outline text-left">
                {{ member.memberPermissions.shootingLeaderNumber }}
              </div>
            </q-field>
            <q-field dense
                     v-if="(member.memberPermissions.instructorNumber!=null&&member.memberPermissions.instructorNumber!=='')"
                     class="col" standout="bg-accent text-positive" color="positive" label-color="positive" label="Instruktor" stack-label>
              <div class="self-center full-width no-outline text-left">
                {{ member.memberPermissions.instructorNumber }}
              </div>
            </q-field>
          </q-expansion-item>
        </q-item-section>
        <q-expansion-item v-if="!member.erased&&main&&!mobile" dense label="Wydawanie Amunicji" class="col items-center bg-dark text-positive" group="right-card">
          <div>
            <div class="row">
              <q-field dense class="full-width col" standout="bg-accent text-positive" color="positive" label-color="positive" stack-label>
                <div class="self-center full-width no-outline text-center">Kaliber</div>
              </q-field>
              <q-field dense class="full-width col" standout="bg-accent text-positive" color="positive" label-color="positive" stack-label>
                <div class="self-center full-width no-outline text-center">Ilość wydanej
                  amunicji
                </div>
              </q-field>
            </div>
            <q-card flat class="row bg-dark">
              <q-card-section class="col q-pa-none">
                <div v-for="(calibers,uuid) in calibers" :key="uuid">
                  <q-radio dense v-model="caliberUUID" :val="calibers.uuid" class="col full-width">
                    <q-field dense borderless class="cursor-pointer" color="positive" label-color="positive">
                      <div class="self-center full-width no-outline text-center q-pa-xs">
                        {{ calibers.name }}
                      </div>
                    </q-field>
                  </q-radio>
                </div>
              </q-card-section>
              <q-card-section class="col q-pa-none">
                <div v-for="(counter,uuid) in member.personalEvidence.ammoList" :key="uuid">
                  <q-field dense class="col" standout="bg-accent text-positive" color="positive" label-color="positive" :label="counter.caliberName" stack-label>
                    <div class="self-center full-width no-outline text-center q-pa-xs">
                      {{ counter.counter }} sztuk
                    </div>
                  </q-field>
                </div>
              </q-card-section>
            </q-card>
              <div v-if="!member.erased" class="row">
              <q-input dense
                       @keypress.enter="memberUUID=member.uuid;legNumber=member.legitimationNumber; addAmmoConfirm=true"
                       filled class="full-width col" color="positive" label-color="positive" input-class="text-positive" v-model="quantity"
                       placeholder="Tylko cyfry" onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                       label="Ilość Amunicji"></q-input>
              <q-btn dense class="full-width col" color="primary" label="wydaj amunicję"
                     @click="memberUUID=member.uuid;legNumber=member.legitimationNumber; addAmmoConfirm=true"></q-btn>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item dense v-if="!member.erased&&main&&!mobile" label="Opcje Dodatkowe" group="right-card" class="bg-dark text-positive">
          <q-expansion-item dense v-if="!member.erased"
                            :label="member.shootingPatent.patentNumber!==null? (helpersDefault[0] + ': ' + member.shootingPatent.patentNumber):helpersDefault[0]"
                            group="right-right-card" class="text-positive">
            <q-btn class="full-width" color="primary" v-if="member.shootingPatent.patentNumber!==null"
                   label="AKTUALIZUJ PATENT"
                   @click="memberUUID=member.uuid;
                patentPistolPermission1=member.shootingPatent.pistolPermission;
                patentRiflePermission1=member.shootingPatent.riflePermission;
                patentShotgunPermission1=member.shootingPatent.shotgunPermission;
                patentConfirm2=true">
            </q-btn>
            <q-btn class="full-width" color="primary" v-else
                   label="DODAJ PATENT" @click="memberUUID=member.uuid;patentConfirm=true"></q-btn>
            <q-item v-if="member.shootingPatent.pistolPermission
                &&member.shootingPatent.riflePermission
                &&member.shootingPatent.shotgunPermission">
              <q-item-label class="text-center full-width self-center">Klubowicz posiada cały Patent</q-item-label>
            </q-item>
          </q-expansion-item>
          <q-expansion-item dense v-if="member.adult&&!member.erased"
                            :label="member.weaponPermission.exist?(helpersDefault[1] + ': '+member.weaponPermission.number):helpersDefault[1]"
                            group="right-right-card" >
            <div class="row">
              <q-input dense @keypress.enter="changeWeaponPermission(member.uuid, weaponPermissionNumber, isExist)"
                       filled class="col" bg-color="grey-3" v-if="member.weaponPermission.number==null||!member.weaponPermission.exist"
                       v-model="weaponPermissionNumber" label="Numer pozwolenia"/>
              <q-btn class="col" v-if="!member.weaponPermission.exist" label="Dodaj" color="primary"
                     @click="changeWeaponPermission(member.uuid, weaponPermissionNumber, isExist)"/>
              <q-btn class="col" v-if="member.weaponPermission.exist" label="Usuń pozwolenie" color="primary"
                     @click="memberUUID=member.uuid;permission = true;eraseWeapon=true"/>
            </div>
            <q-field dense v-if="!member.license.valid&&member.weaponPermission.exist" bg-color="red" class="col"
                     standout="bg-accent text-black" stack-label>
              <div class="self-center full-width no-outline text-center text-black">POSIADA NIE WAŻNĄ
                LICENCJĘ!!!
              </div>
            </q-field>
          </q-expansion-item>
          <q-expansion-item dense v-if="member.adult&&!member.erased"
                            :label="member.weaponPermission.admissionToPossessAWeaponIsExist?(helpersDefault[2] + ': '+member.weaponPermission.admissionToPossessAWeapon):helpers[2]"
                            group="right-right-card">
            <div class="row">
              <q-input dense
                       @keypress.enter="changeWeaponAdmission (member.uuid, admissionToPossess, admissionToPossessIsExist)"
                       filled class="col" bg-color="grey-3"
                       v-if="member.weaponPermission.admissionToPossessAWeapon==null||!member.weaponPermission.admissionToPossessAWeaponIsExist"
                       v-model="admissionToPossess" label="Numer Dopuszczenia"/>
              <q-btn class="col" v-if="!member.weaponPermission.admissionToPossessAWeaponIsExist" label="Dodaj"
                     color="primary"
                     @click="changeWeaponAdmission (member.uuid, admissionToPossess, admissionToPossessIsExist)"/>
              <q-btn class="col" v-if="member.weaponPermission.admissionToPossessAWeaponIsExist"
                     label="Usuń dopuszczenie" color="primary"
                     @click="memberUUID=member.uuid; admission = true;eraseAssest=true"/>
            </div>
            <q-field dense v-if="!member.license.valid&&member.weaponPermission.exist" class="col bg-red"
                     standout="bg-accent text-black" stack-label>
              <div class="self-center full-width no-outline text-center text-black">POSIADA NIE WAŻNĄ
                LICENCJĘ!!!
              </div>
            </q-field>
          </q-expansion-item>
          <q-expansion-item dense v-if="member.adult&&!member.erased" label="Uprawnienia" group="right-right-card">
            <q-expansion-item dense
                              :label="helpers[3] = member.memberPermissions.shootingLeaderNumber!=null?('Prowadzący Strzelanie: '+member.memberPermissions.shootingLeaderNumber):helpersDefault[3]"
                              group="qualifications">
              <div class="row">
                <q-input dense @keypress.enter="memberUUID=member.uuid;shootingLeaderConfirm=true" filled class="col" bg-color="grey-3"
                         v-model="permissionsShootingLeaderNumber" label="Numer Uprawnień"/>
                <q-btn class="col" label="Dodaj" color="primary"
                       @click="memberUUID=member.uuid;shootingLeaderConfirm=true"/>
              </div>
            </q-expansion-item>
            <q-expansion-item dense v-if="member.memberPermissions.instructorNumber==null"
                              :label="helpers[4] = member.memberPermissions.instructorNumber!=null?('Instruktor: '+member.memberPermissions.instructorNumber  ):helpersDefault[4]"
                              group="qualifications">
              <div class="row">
                <q-input dense @keypress.enter="memberUUID=member.uuid;instructorConfirm=true" filled class="col"
                         v-model="permissionsInstructorNumber" label="Numer Uprawnień" bg-color="grey-3"/>
                <q-btn class="col" label="Dodaj" color="primary"
                       @click="memberUUID=member.uuid;instructorConfirm=true"/>
              </div>
            </q-expansion-item>
            <q-expansion-item dense v-if="member.adult&&!member.erased"
                              :label="helpers[5] =member.memberPermissions.arbiterNumber!=null?('Sędzia: '+member.memberPermissions.arbiterNumber):helpersDefault[5]"
                              group="qualifications">
              <q-item class="full-width">
                <q-input dense outlined filled class="full-width col"
                         v-if="member.memberPermissions.arbiterNumber==null||member.memberPermissions.arbiterNumber===''"
                         v-model="permissionsArbiterNumber" label="Numer Uprawnień" bg-color="grey-3"/>
                <q-input dense class="col" outlined filled v-model="permissionsArbiterPermissionValidThru"
                         mask="####-12-31" label="Ważne do:" bg-color="grey-3">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="permissionsArbiterPermissionValidThru">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Zamknij" color="primary" flat/>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-btn class="col full-width" v-if="member.memberPermissions.arbiterNumber!=null" color="primary"
                       label="Przedłuż" @click="memberUUID=member.uuid;arbiterProlongConfirm=true"/>
              </q-item>
              <div class="col">
                <div class="col">
                  <q-radio dense class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal"
                           :val="1" label="Klasa 3" color="primary"/>
                  <q-radio dense class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal"
                           :val="2" label="Klasa 2" color="primary"/>
                  <q-radio dense class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal"
                           :val="3" label="Klasa 1" color="primary"/>
                  <q-radio dense class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal"
                           :val="4" label="Klasa Państwowa" color="primary"/>
                  <q-radio dense class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal"
                           :val="5" label="Klasa Międzynarodowa" color="primary"/>
                </div>
                <q-item v-if="member.memberPermissions.arbiterNumber!==null" class="full-width row">
                  <q-input dense outlined filled class="full-width col"
                           v-if="member.memberPermissions.arbiterNumber!=null" v-model="permissionsArbiterNumber"
                           label="Numer Uprawnień" bg-color="grey-3"/>
                  <q-btn class="full-width col" v-if="member.memberPermissions.arbiterNumber!=null"
                         label="Nadaj Nowy Numer" color="primary" @click="memberUUID=member.uuid;arbiterConfirm=true"/>
                </q-item>
                <q-item class="full-width">
                  <q-btn class="full-width col-1" v-if="member.memberPermissions.arbiterNumber!==null" color="primary"
                         label="Podnieś Klasę" @click="memberUUID=member.uuid;arbiterUpdateClassConfirm=true"/>
                  <q-btn class="full-width col-1"
                         v-if="member.memberPermissions.arbiterNumber===null||member.memberPermissions.arbiterNumber===''"
                         label="Dodaj" color="primary" @click="memberUUID=member.uuid;arbiterConfirm=true"/>
                </q-item>
              </div>
            </q-expansion-item>
          </q-expansion-item>
          <q-expansion-item dense v-if="!member.erased" label="Portal PZSS" group="right-right-card">
            <div class="row">
              <q-field dense v-if="member.pzss" class="col q-pa-md" bg-color="green-3" standout="bg-green-3 text-black"
                       stack-label>
                <div class="self-center full-width no-outline text-center text-black"
                     @dblclick="memberUUID=member.uuid;pzssPortal=true">Wprowadzony do portalu
                </div>
              </q-field>
              <q-field dense v-if="!member.pzss" class="col q-pa-md" bg-color="red-3" standout="bg-red-3 text-black"
                       stack-label>
                <div class="self-center full-width no-outline text-center text-black"
                     @dblclick="main&&!mobile?(memberUUID=member.uuid,pzssPortal=true):''">Nie Wprowadzony do Portalu
                </div>
              </q-field>
              <q-item v-if="main&&!mobile" class="q-pa-md">
                <CSVFile :uuid="member.uuid" :name="(member.firstName + ' ' + member.secondName)"></CSVFile>
              </q-item>
            </div>
            <q-item v-if="member.pzss">
              <q-btn class="full-width q-pa-none" type="a" href="https://portal.pzss.org.pl/CLub/Player" target="_blank"
                     label="Przejdź do portalu" color="primary"/>
            </q-item>
            <q-item v-if="!member.pzss">
              <q-btn class="full-width q-pa-none" type="a" href="https://portal.pzss.org.pl/CLub/Player" target="_blank"
                     label="Przejdź do portalu" color="primary" @click="memberUUID=member.uuid;pzssPortal = true"/>
            </q-item>
          </q-expansion-item>
          <q-expansion-item dense label="Pokaż statystyki" group="right-right-card"
                            @click="uuid = member.uuid;getPersonalStatistics(uuid)">
            <div v-if="personalStatisticsObject!=null" class="col text-left text-caption">
              <div class="row full-width" style="border-bottom: solid 1px;">
                <div class="col">Ilość wpłaconych składek:</div>
                <div class="col text-right">{{ personalStatisticsObject.contributionCounter }}</div>
              </div>
              <div class="row full-width" style="border-bottom: solid 1px;">
                <div class="col">Ilość startów:</div>
                <div class="col text-right">{{ personalStatisticsObject.competitionHistoryCounter }}</div>
              </div>
              <div class="row full-width" style="border-bottom: solid 1px;">
                <div class="col">Miesięcy w klubie:</div>
                <div class="col text-right">{{ personalStatisticsObject.monthsFromFirstVisit }}</div>
              </div>
              <div class="row full-width" style="border-bottom: solid 1px;">
                <div class="col">Ilość wizyt:</div>
                <div class="col text-right">{{ personalStatisticsObject.visitCounter }}</div>
              </div>
              <div>Pobranej amunicji:
                <div v-for="(item,uuid) in personalStatisticsObject.ammo.caliber" :key="uuid">
                  <div class="row full-width" style="border-bottom: solid 1px;">
                    <div class="col">{{ item.name }}:</div>
                    <div class="col text-right">{{ item.quantity }}szt.</div>
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
          <q-expansion-item dense v-if="member.active" label="Przenieś do Nieaktywnych" group="right-right-card"
                            class="bg-red">
            <div class="q-pa-md text-h6 text-bold text-center full-width bg-red-4">Czy na pewno chcesz przenieść
              osobę?
            </div>
            <div class="q-pa-md text-bold text-center full-width bg-red-4">
              <q-btn class="full-width" label="Przenieś" color="red" @click="memberUUID=member.uuid;deactivate=true"/>
            </div>
          </q-expansion-item>
          <q-expansion-item dense v-if="!member.adult&&member.active" label="Przenieś do Grupy Ogólnej"
                            group="right-right-card">
            <q-item>
              <q-item-label v-if="member.active">Czy na pewno chcesz przenieść osobę?</q-item-label>
            </q-item>
            <q-item>
              <q-btn class="full-width" label="Przenieś" color="red"
                     @click="memberUUID=member.uuid;changeAdultConfirm=true"/>
            </q-item>
          </q-expansion-item>
          <q-expansion-item dense @focus.stop="erasedReasonType=null;erasedDate=null" class="bg-red"
                            @click="getListErasedType()" v-if="!member.active&&!member.erased"
                            label="Skreśl z listy członków" group="right-right-card">
            <q-item class="bg-red-2 text-black">
              <q-item-label class="text-h6 text-bold text-center full-width">Czy na pewno chcesz usunąć osobę?
              </q-item-label>
            </q-item>
            <q-item class="bg-red-2 text-black">
              <q-select color="black" options-cover filled stack-label class="full-width" v-model="erasedReasonType"
                        :options="erasedTypes" label="wybierz przyczynę"></q-select>
              <q-input class="col-5" color="black" outlined filled v-model="erasedDate" mask="####-##-##"
                       label="w dniu:">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="erasedDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <q-item class="bg-red-2">
              <q-input @keypress.enter="memberUUID=member.uuid;eraseConfirm=true" v-model="reason" filled color="black"
                       class="col" stack-label label="Dodatkowe informacje"/>
            </q-item>
            <q-item class="bg-red-2" v-if="erasedReasonType!=null">
              <q-btn label="Usuń" color="red" @click="memberUUID=member.uuid;eraseConfirm=true"/>
            </q-item>
          </q-expansion-item>
          <q-expansion-item dense v-if="!member.active&&!member.erased" class="bg-green" label="Przywróć do Aktywnych"
                            group="right-right-card">
            <q-item class="bg-green-2 text-black">
              <q-item-label class="text-h6 text-bold text-center full-width">Czy na pewno chcesz przywrócić osobę?
              </q-item-label>
            </q-item>
            <q-item class="bg-green-2">
              <q-btn class="full-width" label="Przywróć" color="green-8"
                     @click="memberUUID=member.uuid;backConfirm=true"/>
            </q-item>
          </q-expansion-item>
          <q-expansion-item dense v-if="!member.active&&member.erased" class="bg-green" label="Przywróć Członka klubu"
                            group="right-right-card">
            <q-item class="bg-green-2 text-black">
              <q-item-label class="text-h6 text-bold text-center full-width">Czy na pewno chcesz przywrócić osobę?
              </q-item-label>
            </q-item>
            <q-item class="bg-green-2">
              <q-btn label="Przywróć" class="full-width" color="green-8"
                     @click="memberUUID=member.uuid;resurrectCode=true"/>
            </q-item>
          </q-expansion-item>
          <q-expansion-item dense label="Zmień klub macierzysty" @click="getAllClubs()" class="text-center">
            <div class="text-left">
              <q-checkbox :value="clubChoiceToggle" v-model="clubChoiceToggle" label="Inny Klub jest Klubem macierzystym" class="text-positive"></q-checkbox>
              <q-select v-if="clubChoiceToggle" dense options-dense bg-color="grey-3" :options="clubs" popup-content-class="bg-dark text-positive" v-model="clubChoice" filled fill-input label="wybierz Klub"></q-select>
              <q-btn v-if="clubChoice!==''&&clubChoiceToggle" color="primary" label="zmień klub macierzysty" @click="changeClub(member.uuid, clubChoice)"></q-btn>
            </div>
          </q-expansion-item>
          <q-expansion-item dense label="Przypisane dokumenty" class="text-center"
                            @click="personalFiles=[];getAllMemberFiles(member.uuid)">
            <q-virtual-scroll class="full-width q-pa-none" :items="personalFiles" style="height: 20vh;">
              <template v-slot="{ item }">
                <div @dblclick="showloading();getFile(item.uuid, item.name)" class="cursor-pointer full-width row text-center" style="padding-bottom: 3px;border: 1px solid; border-radius: 5px"><div class="col-10">{{item.name}}</div><div class="col-2">{{item.date}}</div>
                  <q-tooltip content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">Kliknij 2 razy aby pobrać plik
                  </q-tooltip>
                </div>
              </template>
            </q-virtual-scroll>
          </q-expansion-item>
        </q-expansion-item>
        <q-expansion-item dense label="Historia startów" group="right-card" class="text-positive" default-opened>
          <div>
            <q-field dense class="col" color="positive" standout="bg-accent text-positive" stack-label>
              <div class="self-center full-width no-outline text-center">Licznik startów</div>
            </q-field>
            <div class="row">
              <q-field dense class="col" color="positive" label-color="positive" standout="bg-accent text-positive" label="Pistolet" stack-label>
                <div class="self-center full-width no-outline text-left">
                  {{ member.history.pistolCounter }}
                </div>
              </q-field>
              <q-field dense class="col" color="positive" label-color="positive" standout="bg-accent text-positive" label="Karabin" stack-label>
                <div class="self-center full-width no-outline text-left">
                  {{ member.history.rifleCounter }}
                </div>
              </q-field>
              <q-field dense class="col" color="positive" label-color="positive" standout="bg-accent text-positive" label="Strzelba" stack-label>
                <div class="self-center full-width no-outline text-left">
                  {{ member.history.shotgunCounter }}
                </div>
              </q-field>
            </div>
          </div>
          <q-expansion-item dense label="Daty Startów" class="q-pa-none" default-opened>
            <q-virtual-scroll class="full-width q-pa-none" :items="member.history.competitionHistory" :style="member.memberPermissions.arbiterNumber!=null?'height: 46.8vh':'height: 51vh'">
              <template v-slot="{item}">
                <q-field dense class="full-width" color="positive" label-color="positive" standout="bg-accent text-positive" label="Nazwa" stack-label>
                  <div class="text-left">
                    {{ item.name }}
                  </div>
                </q-field>
                <div class="row full-width">
                <q-field dense class="col-3" color="positive" label-color="positive" standout="bg-accent text-positive" label="Data" stack-label>
                  <div class="text-left">
                    {{ convertDate(item.date) }}
                  </div>
                </q-field>
                <q-field dense v-if="item.discipline != null" class="col" color="positive" label-color="positive" standout="bg-accent text-positive"
                         label="Konkurencja" stack-label>
                  <div class="text-left">
                    {{ item.discipline }}
                  </div>
                </q-field>
                <q-field dense v-if="item.discipline == null" class="col" scolor="positive" label-color="positive" standout="bg-accent text-positive"
                         label="Konkurencje" stack-label>
                  <div v-for="(disc,id) in item.disciplines" :key="id"
                       class="text-left col">
                    <div class="col text-positive">{{disc}}</div>
                  </div>
                </q-field>
                <q-field dense class="col-3" color="positive" label-color="positive" standout="bg-accent text-positive text-center" label="WZSS" stack-label>
                  <q-icon :name="item.wzss?'done':'cancel'"/>
                </q-field>
                </div>
              </template>
            </q-virtual-scroll>
            <q-scroll-area v-if="member.history.competitionHistory.lenght<1" class="full-width q-pa-none"
                           style="height: 200px;">
              <div>
                <q-field dense class="col" color="positive" label-color="positive" standout="bg-accent text-positive" stack-label>
                  <div class="self-center full-width no-outline text-center">Brak</div>
                </q-field>
              </div>
            </q-scroll-area>
          </q-expansion-item>
        </q-expansion-item>
        <q-expansion-item dense v-if="member.memberPermissions.arbiterNumber!=null" label="Historia sędziowania"
                          group="right-card" class="text-positive">
          <q-virtual-scroll :items="member.history.judgingHistory" :style="mobile?'':'height: 52vh;'">
            <template v-slot="{ item }">
          <div class="row">
            <q-field dense class="col" color="positive" label-color="positive" standout="bg-accent text-positive" label="Nazwa" stack-label>
              <div class="self-center full-width no-outline text-left">
                {{ item.name }}
              </div>
            </q-field>
            <q-field dense class="col-3" color="positive" label-color="positive" standout="bg-accent text-positive" label="Data" stack-label>
              <div class="self-center full-width no-outline text-left">
                {{ convertDate(item.date) }}
              </div>
            </q-field>
            <q-field dense class="col" color="positive" label-color="positive" standout="bg-accent text-positive" label="Funkcja" stack-label>
              <div class="self-center full-width no-outline text-left">
                {{ item.judgingFunction }}
              </div>
            </q-field>
          </div>
            </template>
          </q-virtual-scroll>
        </q-expansion-item>
      </q-card-section>

    <q-card bordered :class="mobile?'col bg-dark text-positive':'row full-width bg-dark text-positive'">
      <q-card-section :class="main&&!mobile?'col-3':'col-6'" style="height:100%;">
        <div class="full-height text-positive" >
          <q-item-label>
            <q-icon name="person_search" size="1.5rem"/>
            Dane Podstawowe
          </q-item-label>
          <q-item-label class="text-positive" caption lines="2">Identyfikator:</q-item-label>
          <q-item-label class="text-positive" caption lines="2">{{ member.uuid }}</q-item-label>
          <q-item-label class="text-positive" caption lines="2">Imię: {{ member.firstName }}</q-item-label>
          <q-item-label class="text-positive" caption lines="2">Nazwisko: {{ member.secondName }}</q-item-label>
          <q-item-label class="text-positive" caption lines="2">Data Zapisu do Klubu: {{ convertDate(member.joinDate) }}</q-item-label>
          <q-item-label class="text-positive" caption lines="2">Pesel: {{ member.pesel }}</q-item-label>
          <q-item-label class="text-positive" caption lines="2">Numer Dowodu: {{ member.idcard }}</q-item-label>
          <p></p>
          <q-btn class="full-width" v-if="!member.erased" label="Zmień Dane Podstawowe" color="secondary"
                 @click="memberUUID=member.uuid;memberIdCard = member.idcard;memberFirstName = member.firstName;memberSecondName = member.secondName;basicDataConfirm=true"></q-btn>
        </div>
      </q-card-section>
      <q-card-section :class="main&&!mobile?'col-4':'col-6'">
        <q-item-section>
          <q-item-label>
            <q-icon name="contact_mail" size="1.5rem"/>
            Dane Kontaktowe
          </q-item-label>
          <q-item-label class="text-positive" caption lines="2">e-mail: {{ member.email }}</q-item-label>
          <q-item-label class="text-positive" caption lines="2">Numer Telefonu:
            {{ member.phoneNumber.toString().substring(0, 3) + ' ' + member.phoneNumber.toString().substring(3, 6) + ' ' + member.phoneNumber.toString().substring(6, 9) + ' ' + member.phoneNumber.substring(9, 12) }}
          </q-item-label>
          <q-item-label>
            <q-icon name="location_city" size="1.5rem"/>
            Adres
          </q-item-label>
          <q-item-label v-if="member.address.postOfficeCity!=null" class="text-positive" caption lines="2">Miasto:
            {{ member.address.postOfficeCity }}
          </q-item-label>
          <q-item-label v-if="member.address.zipCode!=null" class="text-positive" caption lines="2">Kod Pocztowy:
            {{ member.address.zipCode }}
          </q-item-label>
          <q-item-label v-if="member.address.street!=null" class="text-positive" caption lines="2">Ulica: {{ member.address.street }}
            {{ member.address.streetNumber }}
          </q-item-label>
          <q-item-label v-if="member.address.flatNumber!=null" class="text-positive" caption lines="2">Numer mieszkania:
            {{ member.address.flatNumber }}
          </q-item-label>
          <p></p>
          <q-btn v-if="!member.erased" class="full-width" label="Zmień Dane Kontaktowe" color="secondary"
                 @click="memberUUID=member.uuid;memberEmail = member.email;memberPhoneNumber = member.phoneNumber;memberPostOfficeCity = member.address.postOfficeCity;memberZipCode = member.address.zipCode;memberStreet = member.address.street;memberStreetNumber = member.address.streetNumber;memberFlatNumber=member.address.flatNumber;addressConfirm=true"></q-btn>
        </q-item-section>
      </q-card-section>
      <q-card-section v-if="!member.erased&&main&&!mobile" class="col-5">
        <q-item-section class="col full-width">
          <div class="q-pb-md">
            <q-tooltip v-if="member.club.id !== 1" content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">INNY KLUB MACIERZYSTY
            </q-tooltip>
            <DeklaracjaLOK :uuid="member.uuid" :name="(member.secondName + ' ' + member.firstName)" :disable="member.club.id !== 1"/>
          </div>
          <div class="q-pb-md">
            <personalCardPDF :uuid="member.uuid" :name="(member.secondName + ' ' + member.firstName)"/>
          </div>
          <div v-if="member.history.contributionList.length > 0" class="q-pb-md">
            <LastContributionPDF :uuid="member.uuid" :name="(member.secondName + ' ' + member.firstName)" :disable="member.history.contributionList.length < 1"/>
          </div>
          <div v-if="!member.erased" class="q-pb-md">
            <q-tooltip v-if="member.club.id !== 1" content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">INNY KLUB MACIERZYSTY
            </q-tooltip>
            <q-tooltip v-else-if="member.license.number===null" content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">BRAK
              LICENCJI
            </q-tooltip>
            <q-tooltip v-else-if="member.shootingPatent.patentNumber===null" content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">BRAK
              PATENTU
            </q-tooltip>
            <ExtensionApplicationFile :uuid="member.uuid" :name="(member.secondName + ' ' + member.firstName)" :disable="member.club.id !== 1|| member.license.number===null || member.shootingPatent.patentNumber===null "/>
          </div>
          <div v-if="!member.erased" class="q-pb-md">
            <q-tooltip v-if="member.club.id !== 1" content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">INNY KLUB MACIERZYSTY
            </q-tooltip>
            <q-tooltip v-else-if="!member.active" content-class="text-h6 bg-red" anchor="top middle"
                       self="bottom middle" :offset="[12, 12]">BRAK SKŁADEK
            </q-tooltip>
            <CertificateFile :uuid="member.uuid" :name="(member.secondName + ' ' + member.firstName)" :disable="member.club.id !== 1"/>
          </div>
        </q-item-section>
      </q-card-section>
    </q-card>
    </q-card>
    <q-dialog v-model="contribution" persistent>
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6">Czy przedłużyć składkę?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="positive" label="anuluj" color="secondary" v-close-popup/>
          <q-btn text-color="positive" label="przedłuż" color="primary" v-close-popup @click="contributionCode=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="contributionCode" persistent>
      <q-card class="bg-green-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="prolongContribution(memberUUID);contributionCode=false" autofocus type="password"
                   v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup @click="prolongContribution(memberUUID);code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="contributionHistoryCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input
            @keypress.enter="addHistoryContributionRecord (memberUUID, historyContributionRecord);contributionHistoryCode=false"
            autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
            mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="Przedłuż" color="black" v-close-popup
                 @click="addHistoryContributionRecord (memberUUID, historyContributionRecord);code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addressConfirm" persistent>
      <q-card>
        <q-card-section class="col items-center">
          <q-item>
            <q-input v-model="memberEmail" label="e-mail"/>
          </q-item>
          <q-item>
            <q-input @focus="memberPhoneNumber = null" prefix="+48" v-model="memberPhoneNumber" hint="tylko cyfry"
                     label="Numer Telefonu" placeholder="tylko cyfry" mask="### ### ###"/>
          </q-item>
          <q-item>
            <q-input v-model="memberPostOfficeCity" label="Miasto"/>
          </q-item>
          <q-item>
            <q-input v-model="memberZipCode" label="Kod Pocztowy" mask="##-###"/>
          </q-item>
          <q-item>
            <q-input v-model="memberStreet" label="Ulica"/>
          </q-item>
          <q-item>
            <q-input v-model="memberStreetNumber" label="Numer Ulicy"/>
          </q-item>
          <q-item>
            <q-input v-model="memberFlatNumber" label="Numer mieszkania"/>
          </q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup/>
          <q-btn text-color="white" label="zapisz" color="primary" v-close-popup @click="addressConfirm1=true"/>
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
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="zmień" color="primary" v-close-popup @click="updateMember(memberUUID, memberEmail, memberPhoneNumber);
                updateAddress(memberUUID, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="pzssPortal">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy Klubowicz został dodany do portalu?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="nie" color="primary" v-close-popup/>
          <q-btn label="tak" color="primary" v-close-popup @click="changePzss (memberUUID)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="basicDataConfirm" persistent>
      <q-card>
        <q-card-section class="col items-center">
          <q-item-label class="text-bold text-center text-h6">Zmień dane podstawowe</q-item-label>
          <q-item>
            <q-input v-model="memberIdCard" label="Numer Dokumentu"/>
          </q-item>
          <q-item>
            <q-input v-model="memberFirstName" label="Imię"
                     onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 45"/>
          </q-item>
          <q-item>
            <q-input v-model="memberSecondName" label="Nazwisko"
                     onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 45"/>
          </q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup/>
          <q-btn text-color="white" icon="done" color="primary" v-close-popup @click="basicDataConfirm1=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="basicDataConfirm1" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy na pewno zmienić dane podstawowe?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup/>
          <q-btn text-color="white" label="zapisz" color="primary" v-close-popup
                 @click="updateIDCardAndName(memberUUID,memberIdCard,memberFirstName,memberSecondName)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deactivate" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno przenieść do nieaktywnych?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="przenieś" color="primary" v-close-popup @click="activeCode=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="backConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning"/>
          <span class="q-ml-sm">Czy na pewno chcesz przywrócić Klubowicza?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="przywróć" color="primary" v-close-popup @click="activeCode=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="activeCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="changeActive (memberUUID);activeCode=false" autofocus type="password" v-model="code"
                   filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="Przenieś" color="black" v-close-popup @click="changeActive (memberUUID);code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="eraseWeapon" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno usunąć pozwolenie?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="usuń" color="primary" v-close-popup @click="removeWeaponPermissionOrAdmission()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="eraseAssest" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno usunąć dopuszczenie?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="usuń" color="primary" v-close-popup @click="removeWeaponPermissionOrAdmission()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="instructorConfirm" persistent @keypress.esc="instructorConfirm=false"
              @keypress.enter="updateMemberPermissions(memberUUID, permissionsInstructorNumber);instructorConfirm=false;value=true">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno chcesz nadać numer instruktora?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="Tak" color="primary" v-close-popup
                 @click="updateMemberPermissions(memberUUID, permissionsInstructorNumber);value=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="shootingLeaderConfirm" persistent @keypress.esc="shootingLeaderConfirm=false"
              @keypress.enter="updateMemberPermissions(memberUUID, permissionsShootingLeaderNumber);shootingLeaderConfirm=false;value1=true">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno chcesz nadać numer Prowadzącego strzelanie?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="Tak" color="primary" v-close-popup
                 @click="updateMemberPermissions(memberUUID, permissionsShootingLeaderNumber);value1=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="arbiterConfirm" persistent @keypress.esc="arbiterConfirm=false"
              @keypress.enter="updateMemberPermissions(memberUUID, permissionsArbiterNumber, permissionsArbiterPermissionValidThru);arbiterConfirm=false;value2=true">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno chcesz nadać numer Sędziego?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="Tak" color="primary" v-close-popup
                 @click="updateMemberPermissions(memberUUID, permissionsArbiterNumber, permissionsArbiterPermissionValidThru)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="arbiterProlongConfirm" persistent
              @keypress.enter="updateMemberPermissions(memberUUID, permissionsArbiterPermissionValidThru);value3=true;arbiterUpdateClassConfirm=false">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno chcesz przedłużyć licencję Sędziego?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="Przedłuż" color="primary" v-close-popup
                 @click="updateMemberPermissions(memberUUID, permissionsArbiterPermissionValidThru);value3=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="arbiterUpdateClassConfirm" persistent
              @keypress.enter="updateMemberArbiterClass(memberUUID);arbiterUpdateClassConfirm=false">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno chcesz podnieść klasę licencji Sędziego?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="podnieś" color="primary" v-close-popup @click="updateMemberArbiterClass(memberUUID)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="eraseConfirm" persistent @keypress.enter="eraseCode=true;eraseConfirm=false">
      <q-card class="bg-red">
        <q-card-section class="row items-center">
          <q-avatar icon="warning"/>
          <span class="q-ml-sm">Czy na pewno chcesz usunąć Klubowicza z listy członków klubu?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="white" v-close-popup/>
          <q-btn label="usuń" color="white" v-close-popup @click="eraseCode=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="eraseBackConfirm" persistent @keypress.enter="resurrectCode=true;eraseBackConfirm=false">
      <q-card class="bg-green">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy przywrócić Członka klubu?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="white" v-close-popup/>
          <q-btn label="przywróć" color="white" v-close-popup @click="eraseCode=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="eraseCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="eraseMember(memberUUID);eraseCode=false" autofocus type="password" v-model="code"
                   filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="skreśl" color="black" v-close-popup @click="eraseMember(memberUUID);code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="changeAdultConfirm" @keypress.enter="changeAdultCode=true;changeAdultConfirm=false">
      <q-card class="bg-dark text-positive text-body2">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy na pewno chcesz przenieść Klubowicza do grupy Ogólnej?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup/>
          <q-btn text-color="white" label="Przenieś" color="primary" v-close-popup @click="changeAdultCode=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="changeAdultCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="changeAdult(memberUUID);changeAdultCode=false" autofocus type="password"
                   v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn text-color="white" label="Przedłuż" color="black" v-close-popup @click="changeAdult(memberUUID);code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="contributionDownloadConfirm"
              @keypress.enter="contributionDownloadConfirm=false;getContributionPDF()">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-bold text-h6">Pobrać potwierdzenie składki?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="Pobierz" color="primary" v-close-popup @click="getContributionPDF()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addAmmoConfirm" persistent @keypress.enter="addMemberAndAmmoToCaliber();addAmmoConfirm=false">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy na pewno chcesz wydać amunicję?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="positive" label="anuluj" color="secondary" v-close-popup/>
          <q-btn text-color="positive" label="wydaj" color="primary" v-close-popup @click="addMemberAndAmmoToCaliber()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="patentConfirm" persistent>
      <q-card>
        <q-card-section>
          <div class="q-pa-xs text-h5 text-center text-bold">Dodawanie Patentu</div>
        </q-card-section>
        <q-card-section class="row">
          <div class="row full-width">
            <q-input v-model="patentNumber" dense class="col" mask="#####/AAA/##/####" label="Numer Patentu" filled/>
            <div class="col-1"></div>
            <q-input filled v-model="patentDate" dense class="col" mask="####-##-##" label="Wybierz datę">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="patentDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-item>
              <q-checkbox v-model="patentPistolPermission" label="Pistolet"/>
            </q-item>
            <q-item>
              <q-checkbox v-model="patentRiflePermission" label="Karabin"/>
            </q-item>
            <q-item>
              <q-checkbox v-model="patentShotgunPermission" label="Strzelba"/>
            </q-item>
          </div>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="Dodaj" color="primary" v-close-popup @click="patentConfirm1=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="patentConfirm2">
      <q-card class="bg-dark text-white">
        <q-card-section>
          <div class="q-pa-xs text-h5 text-center text-bold">Aktualizowanie Patentu</div>
        </q-card-section>
        <q-card-section class="row">
          <div class="row full-width">
            <q-input class="col" bg-color="grey-3" filled dense label="numer patentu" v-model="patentNumber"
                     mask="#####/AAA/##/####"></q-input>
            <div class="col-1"></div>
            <q-input class="col" bg-color="grey-3" filled dense v-model="patentDate" mask="####-##-##" label="Wybierz datę">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="patentDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-item v-if="!patentPistolPermission1">
              <q-checkbox v-model="patentPistolPermission" label="Pistolet" class="text-positive"/>
            </q-item>
            <q-item v-if="!patentRiflePermission1">
              <q-checkbox v-model="patentRiflePermission" label="Karabin" class="text-positive"/>
            </q-item>
            <q-item v-if="!patentShotgunPermission1">
              <q-checkbox v-model="patentShotgunPermission" label="Strzelba" class="text-positive"/>
            </q-item>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" flat label="anuluj" color="secondary" v-close-popup/>
          <q-btn text-color="white" label="Dodaj" color="primary" v-close-popup @click="patentConfirm1=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="patentConfirm1" persistent
              @keypress.enter="addPatent(memberUUID, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission,patentDate);patentConfirm1=false">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy na pewno chcesz dodać PATENT?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup/>
          <q-btn label="Dodaj" color="primary" v-close-popup
                 @click="addPatent(memberUUID, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission,patentDate)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="contributionAlert" position="top">
      <q-card>
        <q-card-section>
          <div class="text-h6">Składka została przedłużona</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="contributionRemoveRecordQuery" persistent
              @keypress.enter="contributionRemoveRecordQuery=false;contributionRemoveRecordQueryCode=true">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="row items-center">
          <h3><span class="q-ml-sm">Czy na pewno usunąć składkę?</span></h3>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup/>
          <q-btn label="Usuń" color="black" v-close-popup @click="contributionRemoveRecordQueryCode=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="contributionRemoveRecordQueryCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="removeContributionRecord();contributionRemoveRecordQueryCode=false" autofocus
                     type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
                     mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Usuń" color="black" v-close-popup @click="removeContributionRecord()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="failure">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="editContribution" @keypress.esc="editContribution=false">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h5 text-bold text-center">Edytuj Składkę</div>
          <div class="text-h6 text-center">Uwaga! Wprowadzając zmiany bądź pewny tego co robisz</div>
          <div class="text-h6 text-center">Pamiętaj! Składki dla młodzieży ustaw na 02/28 lub 08/31</div>
          <div class="text-h6 text-center">Pamiętaj! Składki dla dorosłych ustaw na 06/30 lub 12/31</div>
          <div class="row bg-grey-3">
            <div class="q-pa-md col-6">
              <q-input v-model="editContributionPaymentDate" filled standout="bg-accent text-black" stack-label
                       mask="####-##-##" label="Data Opłacenia Składki">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="editContributionPaymentDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="q-pa-md col-6">
              <q-input class="col-6" v-model="editContributionValidThruDate" filled standout="bg-accent text-black"
                       stack-label mask="####-##-##" label="Ważność Sładki">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="editContributionValidThruDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat/>
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
              <q-btn class="full-width" label="usuń Składkę" color="red"
                     @click="contributionRemoveRecordQuery=true;editContribution=false"></q-btn>
            </div>
            <div class="col-6 q-pa-md bg-grey-3">
              <q-btn class="full-width" label="wprowadź zmiany" color="primary" v-close-popup
                     @click="editContributionCode=true"/>
            </div>
          </div>
          <div class="col-6 q-pa-md bg-grey-3">
            <q-btn class="full-width" label="Wydrukuj potwierdzenie dla tej składki" color="primary" v-close-popup
                   @click="contributionDownloadConfirm=true"/>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="positive" flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editContributionCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="editContributionRecord();code=null;editContributionCode=false" autofocus
                     type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
                     mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup
                 @click="editContributionRecord(); code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import axios from 'axios'
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import { isWindows } from 'mobile-device-detect'
export default {
  name: 'Member',
  components: {
    PersonalCardPDF: lazyLoadComponent({
      componentFactory: () => import('components/member/PersonalCardPDF.vue'),
      loading: SkeletonBox
    }),
    DeklaracjaLOK: lazyLoadComponent({
      componentFactory: () => import('components/member/DeklaracjaLOK.vue'),
      loading: SkeletonBox
    }),
    LastContributionPDF: lazyLoadComponent({
      componentFactory: () => import('components/member/LastContributionPDF.vue'),
      loading: SkeletonBox
    }),
    MemberLicense: lazyLoadComponent({
      componentFactory: () => import('components/member/MemberLicense.vue'),
      loading: SkeletonBox
    }),
    CSVFile: lazyLoadComponent({
      componentFactory: () => import('components/member/MemberCSVFile.vue'),
      loading: SkeletonBox
    }),
    ExtensionApplicationFile: lazyLoadComponent({
      componentFactory: () => import('components/member/ExtensionApplicationFile.vue'),
      loading: SkeletonBox
    }),
    CertificateFile: lazyLoadComponent({
      componentFactory: () => import('components/member/CertificateFile.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      mobile: !isWindows,
      main: App.main,
      member: null,
      memberUUID: null,
      editContribution: false,
      editContributionPaymentDate: null,
      editContributionValidThruDate: null,
      editContributionCode: false,
      memberName: '',
      name: null,
      name2: null,
      value: false,
      value1: false,
      value2: false,
      value3: false,
      changeAdultConfirm: false,
      changeAdultCode: false,
      eraseConfirm: false,
      eraseBackConfirm: false,
      eraseCode: false,
      resurrectCode: false,
      backConfirm: false,
      activeCode: false,
      contributionUUID: null,
      basicDataConfirm: false,
      basicDataConfirm1: false,
      contributionAlert: false,
      contributionDownloadConfirm: false,
      addressConfirm: false,
      addressConfirm1: false,
      historyContributionRecord: Date.now,
      contributionRemoveRecordQuery: false,
      contributionRemoveRecordQueryCode: false,
      code: null,
      addAmmoConfirm: false,
      helpersDefault: ['Patent', 'Pozwolenie na Broń', 'Dopuszczenie do  Posiadania Broni', 'Prowadzący Strzelanie', 'Instruktor', 'Sędzia'],
      helpers: ['Patent', 'Pozwolenie na Broń', 'Dopuszczenie do  Posiadania Broni', 'Prowadzący Strzelanie', 'Instruktor', 'Sędzia'],
      patentConfirm: false,
      patentConfirm1: false,
      patentConfirm2: false,
      contribution: false,
      contributionCode: false,
      contributionHistoryCode: false,
      deactivate: false,
      eraseWeapon: false,
      eraseAssest: false,
      instructorConfirm: false,
      shootingLeaderConfirm: false,
      arbiterConfirm: false,
      arbiterProlongConfirm: false,
      arbiterUpdateClassConfirm: false,
      failure: false,
      success: false,
      message: null,
      barcode: null,
      legNumber: null,
      patentNumber: '',
      calibers: [],
      erasedTypes: [],
      erasedType: null,
      patentDate: null,
      patentPistolPermission: false,
      patentRiflePermission: false,
      patentShotgunPermission: false,
      patentPistolPermission1: false,
      patentRiflePermission1: false,
      patentShotgunPermission1: false,
      permissionsInstructorNumber: '',
      permissionsShootingLeaderNumber: '',
      permissionsArbiterNumber: '',
      permissionsArbiterPermissionValidThru: '',
      ordinal: '',
      reason: null,
      erasedReasonType: null,
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
      memberIdCard: '',
      memberSecondName: '',
      memberFirstName: '',
      memberPostOfficeCity: '',
      memberZipCode: '',
      memberStreet: '',
      memberStreetNumber: '',
      memberFlatNumber: '',
      caliberUUID: null,
      quantity: '',
      dateVar: /\//gi,
      pzssPortal: false,
      personalStatisticsObject: null,
      personalFiles: null,
      clubs: ['DZIESIĄTKA Łódź'],
      clubChoiceToggle: false,
      clubChoice: '',
      local: App.host
    }
  },
  props: {
    memberNumberLegitimation: {
      type: Number,
      required: true
    }
  },
  watch: {
    memberNumberLegitimation (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getMemberByLegitimationNumber(this.memberNumberLegitimation)
      }
    }
  },
  created () {
    this.getMemberByLegitimationNumber(this.memberNumberLegitimation)
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
    resetHelpers () {
      this.personalStatisticsObject = null
      this.helpers = this.helpersDefault
    },
    getPersonalStatistics (uuid) {
      fetch('http://' + this.local + '/statistics/personal?uuid=' + uuid, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.personalStatisticsObject = response
        })
    },
    getAllMemberFiles (uuid) {
      this.showloading()
      fetch('http://' + this.local + '/files/getAllMemberFiles?uuid=' + uuid, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.personalFiles = response
            })
        }
      })
    },
    convertDate (date) {
      const current = new Date(date)
      let month = current.getMonth() + 1
      let day = current.getDate()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + (month)
      }
      return day + '-' + (month) + '-' + current.getFullYear()
    },
    addHistoryContributionRecord (uuid, date) {
      fetch('http://' + this.local + '/contribution/history/' + uuid + '?date=' + date.replace(/\//gi, '-') + '&pinCode=' + this.code, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.code = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    getMemberByLegitimationNumber (number) {
      fetch('http://' + this.local + '/member/' + number, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.showloading()
          if (this.member !== null && this.member !== response) {
            this.resetHelpers()
          }
          this.member = response
        })
    },
    getMemberByUUID (uuid) {
      fetch('http://' + this.local + '/member/uuid/' + uuid, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json()).then(response => {
        this.showloading()
        if (this.member !== null && this.member !== response) {
          this.resetHelpers()
        }
        this.member = response
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
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.code = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
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
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.code = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    prolongContribution (uuid) {
      fetch('http://' + this.local + '/contribution/' + uuid + '?pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.contributionAlert = true
              this.showloading()
              this.getContributionPDF()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
              this.code = null
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    getContributionPDF () {
      axios({
        url: 'http://' + this.local + '/files/downloadContribution/' + this.memberUUID + '?contributionUUID=null',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Składka_' + this.name + '_' + this.name2 + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    updateMember (uuid, email, phoneNumber) {
      const phone = String(phoneNumber)
      phone.replace('+48', '')
      const data = {
        email: email,
        phoneNumber: phone.replace('+48', '')
      }
      fetch('http://' + this.local + '/member/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.memberEmail = ''
              this.memberPhoneNumber = ''
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    updateIDCardAndName (uuid, idCard, firstName, secondName) {
      const data = {
        idcard: idCard,
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
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.memberIdCard = ''
              this.memberSecondName = ''
              this.memberFirstName = ''
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    updateAddress (uuid, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber) {
      const data = {
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
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.memberZipCode = ''
              this.memberPostOfficeCity = ''
              this.memberStreet = ''
              this.memberStreetNumber = ''
              this.memberFlatNumber = ''
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.failure = true
              this.message = response
              this.autoClose()
            })
        }
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
      fetch('http://' + this.local + '/ammoEvidence/ammo?caliberUUID=' + this.caliberUUID + '&legitimationNumber=' + this.legNumber + '&counter=' + this.quantity + '&otherID=0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.getListCalibers()
            this.showloading()
            this.getMemberByUUID(this.memberUUID)
            this.autoClose()
          })
        }
        if (response.status === 400) {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.quantity = null
            this.autoClose()
          })
        }
        if (response.status === 406) {
          this.failure = true
          this.quantity = null
          this.autoClose()
        }
      })
    },
    addPatent (uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission, patentDate) {
      const data = {
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
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.patentNumber = ''
              this.patentPistolPermission = false
              this.patentRiflePermission = false
              this.patentShotgunPermission = false
              this.patentDate = ''
              this.showloading()
              this.getMemberByUUID(uuid)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    changeWeaponPermission (uuid, weaponPermissionNumber, isExist) {
      const data = {
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
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.weaponPermissionNumber = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    changeWeaponAdmission (uuid, admissionToPossess, admissionToPossessIsExist) {
      const data = {
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
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.admissionToPossess = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
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
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.admission = false
              this.permission = false
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    changeActive (uuid) {
      fetch('http://' + this.local + '/member/' + uuid + '?pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.code = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    updateMemberPermissions (uuid) {
      const data = {
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
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.permissionsShootingLeaderNumber = ''
              this.permissionsInstructorNumber = ''
              this.permissionsArbiterNumber = ''
              this.permissionsArbiterPermissionValidThru = ''
              this.ordinal = ''
              this.showloading()
              this.getMemberByUUID(uuid)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    updateMemberArbiterClass (uuid) {
      fetch('http://' + this.local + '/permissions/arbiter/' + uuid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    eraseMember (uuid) {
      fetch('http://' + this.local + '/member/erase/' + uuid + '?additionalDescription=' + this.reason + '&erasedDate=' + this.erasedDate.replace(/\//gi, '-') + '&erasedType=' + this.erasedReasonType + '&pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.reason = null
              this.code = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    changeAdult (uuid) {
      fetch('http://' + this.local + '/member/adult/' + uuid + '?pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.code = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    changePzss (uuid) {
      fetch('http://' + this.local + '/member/pzss/' + uuid, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    changeClub (uuid, clubName) {
      fetch('http://' + this.local + '/member/changeClub/' + uuid + '?clubName=' + clubName, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.showloading()
              this.getMemberByUUID(uuid)
              this.autoClose()
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    getAllClubs () {
      fetch('http://' + this.local + '/club/tournament', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          for (let i = 0; i < response.length; i++) {
            this.clubs.push(response[i])
          }
        })
    },
    getFile (uuid, name) {
      axios({
        url: 'http://' + this.local + '/files/getFile?uuid=' + uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', name)
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    addBarcodeToMember (uuid, barcode) {
      const data = {
        barCode: barcode,
        belongsTo: uuid
      }
      fetch('http://' + this.local + '/barCode/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.showloading()
              this.getMemberByUUID(uuid)
              this.autoClose()
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    onRejected () {
      this.failure = true
      this.message = 'Nie można dodać, sprawdź rozmiar pliku i jego typ'
      this.autoClose()
    },
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.success = false
        this.message = null
        this.barcode = null
        this.clubChoice = null
        this.clubChoiceToggle = false
        this.contributionAlert = false
        this.code = null
      }, 2000)
    }
  }
}
</script>
