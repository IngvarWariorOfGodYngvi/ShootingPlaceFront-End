<template>
  <q-page padding>
    <div>
      <q-card class="row">
      <q-radio v-model="adult" :val="true" label="Grupa Powszechna"></q-radio>
      <q-radio v-model="adult" :val="false" label="Grupa Młodzieżowa"></q-radio>
      <q-radio color="green" v-model="active" :val="true" label="Aktywni"></q-radio>
      <q-radio color="warning" v-model="active" :val="false" label="Nieaktywni"></q-radio>
      <q-item-section class="col">
      </q-item-section>
      <q-item-section side top>
      <q-item><q-btn color="primary" label="Wybierz" @click="showloading(),getListMembers()"/></q-item>
      </q-item-section>
      </q-card>
    </div>
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
          <q-item-section side top>
            <q-btn color="primary" label="Przedłuż składkę" @click="uuid=members.uuid,contribution=true"/>
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
                <q-item-section side top>
                <q-item><q-btn color="primary" label="Przedłuż składkę" @click="uuid=members.uuid,contribution=true"/></q-item>
                <q-item><q-input v-model="HistoryContributionRecord" label="Dodaj datę" hint="YYYY-MM-DD" placeholder="YYYY-MM-DD"/></q-item>
                <q-item><q-btn color="primary" label="Dodaj rekord w historii" @click="uuid=members.uuid,contributionRecordConfirm=true"/></q-item>
                </q-item-section>
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
              <q-expansion-item v-if="(members.shootingPatent.patentNumber!=null&&members.license.number==null)||!members.adult" label="DODAJ LICENCJĘ">
                <q-item><q-input v-if="members.license.number==null" v-model="licenseNumber" label="Numer Licencji" hint="tylko cyfry" placeholder="tylko cyfry" filled lazy-rules
                :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
                <q-item v-if="members.shootingPatent.pistolPermission||!members.adult"><q-checkbox v-model="licensePistolPermission" label="Pistolet"/></q-item>
                <q-item v-if="members.shootingPatent.riflePermission||!members.adult"><q-checkbox  v-model="licenseRiflePermission" label="Karabin"/></q-item>
                <q-item v-if="members.shootingPatent.shotgunPermission||!members.adult"><q-checkbox  v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
                <q-btn color="secondary" label="Dodaj Licencję" v-if="members.license.number==null" @click="addLicense(members.uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/>
              </q-expansion-item>
                <q-item v-if="active"><q-btn color="secondary" label="opłać licencję" @click="uuid=members.uuid,licensePayment=true"></q-btn></q-item>
              <q-scroll-area v-if="members.history.licensePaymentHistory!=null" :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 100px; max-width: 300px;">
              <q-item v-for="licensePaymentHistory in members.history.licensePaymentHistory" :key="licensePaymentHistory" ><q-item-label>Opłacona dnia {{licensePaymentHistory}}</q-item-label></q-item>
              </q-scroll-area>
              <q-expansion-item v-if="members.license.number!=null&&(
                !members.license.pistolPermission
                ||!members.license.riflePermission
                ||!members.license.shotgunPermission)&&active" label="Aktualizuj Licencję">
                <q-item v-if="(!members.license.pistolPermission&&members.shootingPatent.pistolPermission)||!members.adult"><q-checkbox v-model="licensePistolPermission" label="Pistolet"/></q-item>
                <q-item v-if="(!members.license.riflePermission&&members.shootingPatent.riflePermission)||!members.adult"><q-checkbox v-model="licenseRiflePermission" label="Karabin"/></q-item>
                <q-item v-if="(!members.license.shotgunPermission&&members.shootingPatent.shotgunPermission)||!members.adult"><q-checkbox v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
                <q-item><q-btn color="primary" label="Aktualizuj Licencję" @click="addLicense(members.uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/></q-item>
              </q-expansion-item>
              <q-item v-if="members.license.pistolPermission
                &&members.license.riflePermission
                &&members.license.shotgunPermission"><q-item-label >Klubowicz posiada już całą Licencję</q-item-label></q-item>
                <q-expansion-item  v-if="members.license.number!=null&&(members.license.pistolPermission||members.license.riflePermission||members.license.shotgunPermission)&&active" label="przedłuż licencję">
                <q-item v-if="members.shootingPatent.pistolPermission||!members.adult"><q-checkbox v-model="licensePistolPermission" label="Pistolet"/></q-item>
                <q-item v-if="members.shootingPatent.riflePermission||!members.adult"><q-checkbox v-model="licenseRiflePermission" label="Karabin"/></q-item>
                <q-item v-if="members.shootingPatent.shotgunPermission||!members.adult"><q-checkbox v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
                <q-item><q-btn v-if="members.license.number!=null
                &&(members.license.pistolPermission||members.license.riflePermission||members.license.shotgunPermission)"
                color="primary" label="Przedłuż Licencję" @click="showloading(),prolongLicense(members.uuid, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/></q-item>
              </q-expansion-item>
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
                <q-expansion-item label="Opcje Dodatkowe"  group="right">
              <q-item-section class="text-justify">
                <q-expansion-item v-if="members.adult" label="Patent" group="right-card">
                <q-item-section v-if="members.shootingPatent.patentNumber!=null" >
                <q-item-label >Patent</q-item-label>
                <q-item-label caption lines="2" >Numer Patentu {{members.shootingPatent.patentNumber}}</q-item-label>
                <q-item-label caption lines="2" >Przyznany dnia {{members.shootingPatent.dateOfPosting}}</q-item-label>
                <q-item-label >Dyscypliny :</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.pistolPermission">P {{members.history.patentDay[ 0 ]}}</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.riflePermission">K {{members.history.patentDay[ 1 ]}}</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.shotgunPermission">S {{members.history.patentDay[ 2 ]}}</q-item-label>
                </q-item-section>
              <q-expansion-item v-if="members.shootingPatent.patentNumber==null&&active" label="DODAJ PATENT">
                <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 200px; max-width: 300px;">
                <q-item v-if="members.shootingPatent.patentNumber==null"><q-input v-model="patentNumber" hint="tylko cyfry" placeholder="tylko cyfry" label="Numer Patentu" filled lazy-rules
                 :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
                <q-item v-if="members.shootingPatent.dateOfPosting==null"><q-input v-model="patentDate" hint="YYYY-MM-DD" label="Data przyznania" placeholder="YYYY-MM-DD"/></q-item>
                <q-item v-if="!members.shootingPatent.pistolPermission"><q-checkbox v-model="patentPistolPermission" label="Pistolet"/></q-item>
                <q-item v-if="!members.shootingPatent.riflePermission"><q-checkbox v-model="patentRiflePermission" label="Karabin"/></q-item>
                <q-item v-if="!members.shootingPatent.shotgunPermission"><q-checkbox v-model="patentShotgunPermission" label="Strzelba"/></q-item>
                <q-btn color="secondary" label="Dodaj Patent" v-if="members.shootingPatent.patentNumber==null" @click="addPatent(members.uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission),patentAlert=true"/>
                </q-scroll-area>
              </q-expansion-item>
              <q-expansion-item v-if="members.shootingPatent.patentNumber!=null&&(
                !members.shootingPatent.pistolPermission
                ||!members.shootingPatent.riflePermission
                ||!members.shootingPatent.shotgunPermission)
                &&members.shootingPatent.dateOfPosting!=null&&active" label="AKTUALIZUJ PATENT">
                <q-item v-if="!members.shootingPatent.pistolPermission"><q-checkbox v-model="patentPistolPermission" label="Pistolet"/></q-item>
                <q-item v-if="!members.shootingPatent.riflePermission"><q-checkbox v-model="patentRiflePermission" label="Karabin"/></q-item>
                <q-item v-if="!members.shootingPatent.shotgunPermission"><q-checkbox v-model="patentShotgunPermission" label="Strzelba"/></q-item>
                <q-btn color="secondary" label="Aktualizuj Patent" @click="addPatent(members.uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission)"/>
              </q-expansion-item>
              <q-item v-if="members.shootingPatent.pistolPermission
                &&members.shootingPatent.riflePermission
                &&members.shootingPatent.shotgunPermission"><q-item-label>Klubowicz posiada cały Patent</q-item-label></q-item>
                </q-expansion-item >
                </q-item-section>
                <q-expansion-item v-if="members.adult" label="Pozwolenie na Broń" group="right-card">
                <q-item v-if="members.weaponPermission.number!=null&&members.weaponPermission.isExist" ><q-item-label>Numer Pozwolenia {{members.weaponPermission.number}}</q-item-label></q-item>
                <q-item v-if="!members.license.isValid&&members.weaponPermission.isExist"><q-item-label>POSIADA NIE WAŻNĄ LICENCJĘ!!!</q-item-label></q-item>
                <q-item v-if="members.license.isValid&&members.weaponPermission.isExist"><q-item-label>Posiada ważną licencję</q-item-label></q-item>
                <q-item v-if="(members.weaponPermission.number==null||!members.weaponPermission.isExist)&&active"><q-input v-model="weaponPermissionNumber" label="Numer pozwolenia"/></q-item>
                <q-item v-if="members.weaponPermission.number==null&&active"><q-item-label v-model="isExist">Dodaj pozwolenie</q-item-label></q-item>
                <q-item v-if="members.weaponPermission.isExist&&actvie"><q-item-label >Usuń pozwolenie</q-item-label></q-item>
                <q-item v-if="(!members.weaponPermission.isExist)&&active"><q-btn label="Dodaj" color="secondary" @click="changeWeaponPermission(members.uuid, weaponPermissionNumber, isExist)"/></q-item>
                <q-item v-if="(members.weaponPermission.number!=null) && (members.weaponPermission.isExist)&&active"><q-btn label="Usuń" color="secondary" @click="uuid=members.uuid,eraseWeapon=true"/></q-item>
                </q-expansion-item>
                <q-expansion-item v-if="members.adult&&active" label="Dodatkowe uprawnienia" group="right-card">
                    <q-expansion-item v-if="members.memberPermissions.shootingLeaderNumber==null" label="Prowadzący strzelanie" group="qualifications">
                    <q-item v-if="members.memberPermissions.shootingLeaderNumber!=null"><q-item-label>numer uprawnień {{members.memberPermissions.shootingLeaderNumber}}</q-item-label></q-item>
                    <q-item v-if="members.memberPermissions.shootingLeaderNumber==null"><q-input v-model="permissionsShootingLeaderNumber" label="numer uprawnienia"/></q-item>
                    <q-item v-if="members.memberPermissions.shootingLeaderNumber==null"><q-btn label="Dodaj" color="secondary" @click="uuid=members.uuid,shootingLeaderConfirm=true"/></q-item>
                    </q-expansion-item>
                    <q-expansion-item v-if="members.memberPermissions.instructorNumber==null" label="Instruktor" group="qualifications">
                      <q-item v-if="members.memberPermissions.instructorNumber!=null"><q-item-label>{{members.memberPermissions.instructorNumber}}</q-item-label></q-item>
                      <q-item v-if="members.memberPermissions.instructorNumber==null"><q-input v-model="permissionsInstructorNumber" label="Numer uprawnień" /></q-item>
                      <q-item v-if="members.memberPermissions.instructorNumber==null"><q-btn label="Dodaj" color="secondary" @click="uuid=members.uuid,instructorConfirm=true"/></q-item>
                    </q-expansion-item>
                    <q-expansion-item label="Sędzia" group="qualifications">
                    <q-item v-if="members.memberPermissions.arbiterNumber!=null"><q-item-label>{{members.memberPermissions.arbiterNumber}}</q-item-label></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber==null||members.memberPermissions.arbiterNumber==''"><q-input  v-model="permissionsArbiterNumber" label="Numer uprawnień" /></q-item>
                    <q-item><q-input v-model="permissionsArbiterPermissionValidThru" hint="YYYY-MM-DD" placeholder="YYYY-MM-DD" label="Data ważności" /></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber!=null"><q-btn color="secondary" label="Przedłuż" @click="uuid=members.uuid,arbiterProlongConfirm=true"/></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber==null"><q-radio v-model="ordinal" :val="1" label="Klasa 3" color="secondary" /></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber==null"><q-radio v-model="ordinal" :val="2" label="Klasa 2" color="secondary" /></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber==null"><q-radio v-model="ordinal" :val="3" label="Klasa 1" color="secondary" /></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber==null"><q-radio v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" /></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber==null"><q-radio v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" /></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber!=null&&members.memberPermissions.arbiterClass!='Klasa 3'&&members.memberPermissions.arbiterClass=='Brak'"><q-radio v-model="ordinal" :val="1" label="Klasa 3" color="secondary" /></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber!=null&&members.memberPermissions.arbiterClass!='Klasa 2'&&members.memberPermissions.arbiterClass=='Klasa 3'"><q-radio v-model="ordinal" :val="2" label="Klasa 2" color="secondary" /></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber!=null&&members.memberPermissions.arbiterClass!='Klasa 1'&&members.memberPermissions.arbiterClass=='Klasa 2'"><q-radio v-model="ordinal" :val="3" label="Klasa 1" color="secondary" /></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber!=null&&members.memberPermissions.arbiterClass!='Klasa Państwowa'&&members.memberPermissions.arbiterClass=='Klasa 1'"><q-radio v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" /></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber!=null&&members.memberPermissions.arbiterClass!='Klasa Międzynarodowa'&&members.memberPermissions.arbiterClass=='Klasa Państwowa'"><q-radio v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" /></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber!=null"><q-btn color="secondary" label="Podnieś klasę" @click="uuid=members.uuid,arbiterUpdateClassConfirm=true"/></q-item>
                    <q-item v-if="members.memberPermissions.arbiterNumber==null||members.memberPermissions.arbiterNumber==''"><q-btn label="Dodaj" color="secondary" @click="uuid=members.uuid,arbiterConfirm=true"/></q-item>
                    </q-expansion-item>
                </q-expansion-item>
                <q-expansion-item v-if="active" label="Przenieś do nieaktywnych" group="right-card">
                <q-item><q-item-label v-if="members.active">Czy napewno chcesz przenieść osobę?</q-item-label></q-item>
                <q-item><q-btn label="Przenieś" color="red" @click="uuid=members.uuid,deactivate=true"/></q-item>
                </q-expansion-item>
                <q-expansion-item v-if="!members.adult&&active" label="Przenieś do grupty Powszechnej" group="right-card">
                <q-item><q-item-label v-if="members.active">Czy napewno chcesz przenieść osobę?</q-item-label></q-item>
                <q-item><q-btn label="Przenieś" color="red" @click="uuid=members.uuid,changAdultConfirm=true"/></q-item>
                </q-expansion-item>
                <q-expansion-item v-if="!active" label="Skreśl z listy członków" group="right-card">
                <q-item class="bg-red" ><q-item-label>Czy napewno chcesz usunąć osobę?</q-item-label></q-item>
                <q-item class="bg-red" ><q-btn label="Usuń" color="red" @click="uuid=members.uuid,eraseConfirm=true"/></q-item>
                </q-expansion-item>
                </q-expansion-item>
                <q-expansion-item label="Historia startów" group="right">
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
            <q-item-section side top>
            <q-expansion-item label="Zmień numer Dowodu">
                <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 220px; max-width: 300px;">
                <q-item><q-input v-model="memberIdcard" hint="XXX000000" label="Numer Dowodu" placeholder="XXX000000"/></q-item>
                <q-item><q-input v-model="memberSecondName" label="Nazwisko" /></q-item>
                <q-item><q-btn label="Aktualizuj" color="primary" @click="uuid=members.uuid,basicDataConfirm=true"/></q-item>
                </q-scroll-area>
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
                <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 200px; max-width: 300px;">
                <q-item><q-input v-model="memberEmail" label="e-mail" /></q-item>
                <q-item><q-input v-model="memberPhoneNumber" hint="tylko cyfry" label="Numer Telefonu" placeholder="tylko cyfry" /></q-item>
                <q-item><q-input v-model="memberPostOfficeCity" label="Miasto" /></q-item>
                <q-item><q-input v-model="memberZipCode" hint="00-000" label="Kod Pocztowy" placeholder="00-000" /></q-item>
                <q-item><q-input v-model="memberStreet" label="Ulica" /></q-item>
                <q-item><q-input v-model="memberStreetNumber" label="Numer Ulicy" /></q-item>
                <q-item><q-input v-model="memberFlatNumber" label="Numer mieszkania" /></q-item>
                <q-item><q-btn label="Aktualizuj" color="primary" @click="uuid=members.uuid,addressConfirm=true"/></q-item>
                </q-scroll-area>
            </q-expansion-item>
            </q-item-section>
            </q-item-section>
          </q-card-section>
          <q-card-section>
            <q-item-section>
                <q-item><q-btn label="Pobierz kartę Członkowską" color="secondary" @click="uuid=members.uuid,name=members.firstName,name2=members.secondName,personalCardDownloadConfirm=true"/></q-item>
                <q-item><q-btn label="Pobierz ostatnie potwierdzenie składki" color="secondary" @click="uuid=members.uuid,name=members.firstName,name2=members.secondName,contributionDownloadConfirm=true"/></q-item>
            </q-item-section>
          </q-card-section>
          </q-item>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
<q-dialog v-model="contribution" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy przedłużyć składkę?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="przedłuż" color="primary" v-close-popup @click="prolongContribution(uuid),contributionAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addressConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno zmienić dane adresowe?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="zmień" color="primary" v-close-popup @click="updateMember(uuid, memberEmail, memberPhoneNumber),
                updateAddress(uuid, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber)
                ,addressDataAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="basicDataConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy na pewno zmienić dane adresowe?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="zmień" color="primary" v-close-popup @click="updateIDCardAndName(uuid,memberIdcard,memberSecondName),basicDataAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionRecordConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy dodać składkę?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="przedłuż" color="primary" v-close-popup @click="addHistoryContributionRecord (uuid, HistoryContributionRecord)" />
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
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="przenieś" color="primary" v-close-popup @click="changeActive(uuid)" />
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
          <q-btn flat label="usuń" color="primary" v-close-popup @click="changeWeaponPermission(uuid, weaponPermissionNumber, isExist)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="licensePayment" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno licencja została opłacona?</span>
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
          <span class="q-ml-sm">Czy napewno chcesz nadać numer Proadzącego strzelanie?</span>
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
      <q-card  class="bg-red">
        <q-card-section class="row items-center">
          <q-avatar icon="warning"/>
          <span class="q-ml-sm">Czy napewno chcesz usunąć Klubowicza z listy członków klubu?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="white" v-close-popup />
          <q-btn flat label="usuń" color="white" v-close-popup @click="erase(uuid),eraseAlert=true" />
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
          <q-btn flat label="Przenieś" color="primary" v-close-popup @click="changeAdult(uuid),changeAdultAlert=true" />
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
          <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getContributionPDF(),contributionConfirmDownloadAlert=true" />
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
<q-dialog v-model="instructorAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nadano uprawnienia Instruktora</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="shootingLeaderAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nadano uprawnienia Prowadzącego Strzelanie</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="patentAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Patent został zapisany</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="licenseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Licencja została zapisana</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="weapon">
      <q-card>
        <q-card-section>
          <div class="text-h6">Ustawiono pozwolenie na broń</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="basicDataAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zaktualizowano dane podstawowe</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addressDataAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zaktualizowano dane adresowe</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="deactivateAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Przeniesiono do nieaktywnych</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano sędziego</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterProlongAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Przedłużono datę ważności licencji Sędziego</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterUpdateClassAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Podniesiono klasę licencji Sędziego</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Składka została przedłużona</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Pobierz Potwierdzenie" color="primary" v-close-popup @click="getContributionPDF(),showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionRecordAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Rekord w historii został dodany</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="eraseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Klubowicz został skreślony z listy klubowiczów</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="changeAdultAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Klubowicz został przeniesiony do Grupy Powszechnej</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListMembers()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionConfirmDownloadAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Potwierdzenie Składki zostało pobrane</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
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
      name: null,
      name2: null,
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
      changeAdultAlert: false,
      eraseAlert: false,
      eraseConfirm: false,
      contributionRecord: '',
      basicDataConfirm: false,
      contributionAlert: false,
      contributionDownloadConfirm: false,
      contributionConfirmDownloadAlert: false,
      personalCardDownloadConfirm: false,
      personalCardDownloadAlert: false,
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
    addHistoryContributionRecord (uuid, date) {
      fetch('http://localhost:8080/contribution/history' + uuid + '?date=' + date, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(members => {
          this.members = members
          this.contributionRecordAlert = true
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
      }).then(response => response.json())
        .then(members => {
          this.members = members
          this.memberEmail = ''
          this.memberPhoneNumber = ''
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
          this.basicDataAlert = true
          this.memberIdcard = ''
          this.memberSecondName = ''
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
          this.addressData = true
          this.memberZipCode = ''
          this.memberPostOfficeCity = ''
          this.memberStreet = ''
          this.memberStreetNumber = ''
          this.memberFlatNumber = ''
        })
    },
    getListMembers () {
      fetch('http://localhost:8080/member/activelist?active=' + this.active + '&adult=' + this.adult + '&erase=false', {
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
          this.updatedateOfPosting(uuid, this.patentDate)
        })
    },
    updatedateOfPosting (uuid, patentDate) {
      var data = {
        dateOfPosting: patentDate
      }
      fetch('http://localhost:8080/patent/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(dateOfPosting => {
          console.log(uuid)
          this.dateOfPosting = patentDate
          this.patentAlert = true
          this.patentNumber = null
          this.patentPistolPermission = false
          this.patentRiflePermission = false
          this.patentShotgunPermission = false
          this.patentDate = null
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
          this.licenseAlert = true
          this.licenseNumber = ''
          this.licensePistolPermission = false
          this.licenseRiflePermission = false
          this.licenseShotgunPermission = false
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
        response.json()
      })
        .then(members => {
          this.members = members
          this.licenseAlert = true
          this.licensePistolPermission = false
          this.licenseRiflePermission = false
          this.licenseShotgunPermission = false
        })
    },
    addLicenseHistoryPayment (uuid) {
      fetch('http://localhost:8080/license/history' + uuid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        response.json()
      })
        .then(members => {
          this.members = members
          this.licenseAlert = true
        })
    },
    changeWeaponPermission (uuid, weaponPermissionNumber) {
      var data = {
        number: weaponPermissionNumber
      }
      fetch('http://localhost:8080/member/weapon/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(members => {
          this.members = members
          this.weapon = true
          this.weaponPermissionNumber = ''
        })
    },
    changeActive (uuid) {
      fetch('http://localhost:8080/member/' + uuid, {
        method: 'PATCH'
      }).then(response => response.json())
        .then(members => {
          this.members = members
          this.deactivateAlert = true
        })
    },
    updateMemberPermissions (uuid, permissionsShootingLeaderNumber, permissionsInstructorNumber, permissionsArbiterNumber, permissionsArbiterPermissionValidThru) {
      var data = {
        shootingLeaderNumber: this.permissionsShootingLeaderNumber,
        instructorNumber: this.permissionsInstructorNumber,
        arbiterNumber: this.permissionsArbiterNumber,
        arbiterPermissionValidThru: this.permissionsArbiterPermissionValidThru
      }
      fetch('http://localhost:8080/permissions/' + uuid + '?ordinal=' + this.ordinal, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => {
        response.json()
        if (response.ok) {
          if (this.value) { this.instructorAlert = true }
          if (this.value1) { this.shootingLeaderAlert = true }
          if (this.value2) { this.arbiterAlert = true }
          if (this.value3) { this.arbiterProlongAlert = true }
          if (this.value4) { this.arbiterUpdateClassAlert = true }
        }
      })
        .then(members => {
          this.members = members
          this.value = false
          this.value1 = false
          this.value2 = false
          this.value3 = false
          this.value4 = false
          this.permissionsShootingLeaderNumber = ''
          this.permissionsInstructorNumber = ''
          this.permissionsArbiterNumber = ''
          this.permissionsArbiterPermissionValidThru = ''
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
    },
    changeAdult (uuid) {
      fetch('http://localhost:8080/member/adult/' + uuid, {
        method: 'PATCH'
      }).then(response => response.json())
        .then(members => {
          this.members = members
          this.changeAdultAlert = true
        })
    }
  },
  name: 'members'
}
</script>
