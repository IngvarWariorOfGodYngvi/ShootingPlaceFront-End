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
          <q-item-label caption lines="2">Data Zapisu {{members.joinDate}}</q-item-label>
          <q-item-label caption lines="2" :id="members.legitimationNumber">Numer Legitymacji {{members.legitimationNumber}}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn color="primary" label="Dodaj do książki" @click="uuid=members.uuid,alert=true"/>
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
                <q-item><q-btn color="primary" label="Dodaj rekord w historii" @click="addHistoryContributionRecord (members.uuid, HistoryContributionRecord), reload()"/></q-item>
                </q-item-section>
              </q-card-section>
              <q-card-section class="col">
              <q-item-section v-if="members.license.number!=null">
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
              <q-expansion-item v-if="members.shootingPatent.patentNumber!=null&&members.license.number==null" label="DODAJ LICENCJĘ">
                <q-item><q-input v-if="members.license.number==null" v-model="licenseNumber" label="Numer Licencji" hint="tylko cyfry" placeholder="tylko cyfry" filled lazy-rules
        :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/></q-item>
                <q-item v-if="members.shootingPatent.pistolPermission"><q-checkbox v-model="licensePistolPermission" label="Pistolet"/></q-item>
                <q-item v-if="members.shootingPatent.riflePermission"><q-checkbox  v-model="licenseRiflePermission" label="Karabin"/></q-item>
                <q-item v-if="members.shootingPatent.shotgunPermission"><q-checkbox  v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
                <q-btn color="secondary" label="Dodaj Licencję" v-if="members.license.number==null" @click="addLicense(members.uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/>
              </q-expansion-item>
                <q-item><q-btn color="secondary" label="opłać licencję" @click="uuid=members.uuid,licensePayment=true"></q-btn></q-item>
              <q-scroll-area v-if="members.license.number!=null" :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 100px; max-width: 300px;">
              <q-item v-for="licensePaymentHistory in members.history.licensePaymentHistory" :key="licensePaymentHistory" ><q-item-label>Opłacona dnia {{licensePaymentHistory}}</q-item-label></q-item>
              </q-scroll-area>
              <q-expansion-item v-if="members.license.number!=null&&(
                !members.license.pistolPermission
                ||!members.license.riflePermission
                ||!members.license.shotgunPermission)" label="Aktualizuj Licencję">
                <q-item v-if="!members.license.pistolPermission&&members.shootingPatent.pistolPermission"><q-checkbox v-model="licensePistolPermission" label="Pistolet"/></q-item>
                <q-item v-if="!members.license.riflePermission&&members.shootingPatent.riflePermission"><q-checkbox v-model="licenseRiflePermission" label="Karabin"/></q-item>
                <q-item v-if="!members.license.shotgunPermission&&members.shootingPatent.shotgunPermission"><q-checkbox v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
                <q-item><q-btn color="primary" label="Aktualizuj Licencję" @click="addLicense(members.uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/></q-item>
              </q-expansion-item>
              <q-item v-if="members.license.pistolPermission
                &&members.license.riflePermission
                &&members.license.shotgunPermission"><q-item-label >Klubowicz posiada już całą Licencję</q-item-label></q-item>
                <q-expansion-item  v-if="members.license.number!=null&&(members.license.pistolPermission||members.license.riflePermission||members.license.shotgunPermission)" label="przedłuż licencję">
                <q-item v-if="members.shootingPatent.pistolPermission"><q-checkbox v-model="licensePistolPermission" label="Pistolet"/></q-item>
                <q-item v-if="members.shootingPatent.riflePermission"><q-checkbox v-model="licenseRiflePermission" label="Karabin"/></q-item>
                <q-item v-if="members.shootingPatent.shotgunPermission"><q-checkbox v-model="licenseShotgunPermission" label="Strzelba"/></q-item>
                <q-item><q-btn v-if="members.license.number!=null
                &&(members.license.pistolPermission||members.license.riflePermission||members.license.shotgunPermission)"
                color="primary" label="Przedłuż Licencję" @click="showloading(),prolongLicense(members.uuid, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/></q-item>
              </q-expansion-item>
              </q-card-section>
              <q-card-section class="col">
                <q-item-section v-if="(members.memberPermissions.shootingLeaderNumber!=null&&members.memberPermissions.shootingLeaderNumber!='')
                ||(members.memberPermissions.instructorNumber!=null||members.memberPermissions.instructorNumber!='')
                ||(members.memberPermissions.arbiterNumber!=null&&members.memberPermissions.arbiterNumber!='')">
                <q-item><q-item-label>Informacje o Uprawnieniach</q-item-label></q-item>
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
                <q-expansion-item label="Patent" group="right-card">
                <q-item-section v-if="members.shootingPatent.patentNumber!=null" >
                <q-item-label >Patent</q-item-label>
                <q-item-label caption lines="2" >Numer Patentu {{members.shootingPatent.patentNumber}}</q-item-label>
                <q-item-label caption lines="2" >Przyznany dnia {{members.shootingPatent.dateOfPosting}}</q-item-label>
                <q-item-label >Dyscypliny :</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.pistolPermission">P {{members.history.patentDay[ 0 ]}}</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.riflePermission">K {{members.history.patentDay[ 1 ]}}</q-item-label>
                <q-item-label caption lines="2" v-if="members.shootingPatent.shotgunPermission">S {{members.history.patentDay[ 2 ]}}</q-item-label>
                </q-item-section>
              <q-expansion-item v-if="members.shootingPatent.patentNumber==null" label="DODAJ PATENT">
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
                &&members.shootingPatent.dateOfPosting!=null" label="AKTUALIZUJ PATENT">
                <q-item v-if="!members.shootingPatent.pistolPermission"><q-checkbox v-model="patentPistolPermission" label="Pistolet"/></q-item>
                <q-item v-if="!members.shootingPatent.riflePermission"><q-checkbox v-model="patentRiflePermission" label="Karabin"/></q-item>
                <q-item v-if="!members.shootingPatent.shotgunPermission"><q-checkbox v-model="patentShotgunPermission" label="Strzelba"/></q-item>
                <q-btn color="primary" label="Aktualizuj Patent" @click="addPatent(members.uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission)"/>
              </q-expansion-item>
              <q-item v-if="members.shootingPatent.pistolPermission
                &&members.shootingPatent.riflePermission
                &&members.shootingPatent.shotgunPermission"><q-item-label>Klubowicz posiada już cały Patent</q-item-label></q-item>
                </q-expansion-item >
                </q-item-section>
                  <q-expansion-item label="Pozwolenie na Broń" group="right-card">
                <q-item v-if="members.weaponPermission.number!=null&&members.weaponPermission.isExist" ><q-item-label>Numer Pozwolenia {{members.weaponPermission.number}}</q-item-label></q-item>                <q-item v-if="!members.license.isValid&&members.weaponPermission.isExist"><q-item-label >POSIADA NIE WAŻNĄ LICENCJĘ!!!</q-item-label></q-item>
                <q-item v-if="members.license.isValid&&members.weaponPermission.isExist"><q-item-label>Posiada ważną licencję</q-item-label></q-item>
                <q-item v-if="members.weaponPermission.number==null||!members.weaponPermission.isExist"><q-input v-model="weaponPermissionNumber" label="Numer pozwolenia"/></q-item>
                <q-item v-if="members.weaponPermission.number==null"><q-item-label  v-model="isExist">Dodaj pozwolenie</q-item-label></q-item>
                <q-item v-if="members.weaponPermission.isExist"><q-item-label >Usuń pozwolenie</q-item-label></q-item>
                <q-item v-if="(!members.weaponPermission.isExist)"><q-btn label="Dodaj" color="primary" @click="changeWeaponPermission(members.uuid, weaponPermissionNumber, isExist)"/></q-item>
                <q-item v-if="(members.weaponPermission.number!=null) && (members.weaponPermission.isExist)"><q-btn label="Usuń" color="primary" @click="uuid=members.uuid,eraseWeapon=true"/></q-item>
                </q-expansion-item>
                <q-expansion-item label="Dodatkowe uprawnienia" group="right-card">
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
                    <q-item><q-input v-model="permissionsArbiterNumber" label="Numer uprawnień" /></q-item>
                    <q-item><q-input v-model="permissionsArbiterPermissionValidThru" hint="YYYY-MM-DD" placeholder="YYYY-MM-DD" label="Data ważności" /></q-item>
                    <q-item><q-radio v-model="ordinal" :val="1" label="Klasa 3" color="secondary" /></q-item>
                    <q-item><q-radio v-model="ordinal" :val="2" label="Klasa 2" color="secondary" /></q-item>
                    <q-item><q-radio v-model="ordinal" :val="3" label="Klasa 1" color="secondary" /></q-item>
                    <q-item><q-radio v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" /></q-item>
                    <q-item><q-radio v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" /></q-item>
                    <q-item><q-btn label="Dodaj" color="secondary" @click="uuid=members.uuid,arbiterConfirm=true"/></q-item>
                    </q-expansion-item>
                </q-expansion-item>
                <q-expansion-item label="Przenieś do nieaktywnych" group="right-card">
                <q-item><q-item-label v-if="members.active">Czy napewno chcesz przenieść osobę?</q-item-label></q-item>
                <q-item><q-btn label="Przenieś" color="red" @click="uuid=members.uuid,deactivate=true"/></q-item>
                </q-expansion-item>
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
                <q-item><q-btn label="Aktualizuj" color="primary" @click="updateIDCardAndName(members.uuid,memberIdcard,memberSecondName)"/></q-item>
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
                <q-item><q-btn label="Aktualizuj" color="primary" @click="updateMember(members.uuid, memberEmail, memberPhoneNumber),
                updateAddress(members.uuid, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber)
                "/></q-item>
                </q-scroll-area>
            </q-expansion-item>
            </q-item-section>
            </q-item-section>
          </q-card-section>
          <q-card-section>
            <q-item-section>
                <q-item><q-btn label="Pobierz kartę Członkowską" color="secondary"/></q-item>
                <q-item><q-btn label="Pobierz ostatnie potwierdzenie składki" color="secondary"/></q-item>
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
          <q-btn flat label="przedłuż" color="primary" v-close-popup @click="prolongContribution(uuid),reload()" />
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
    <q-dialog v-model="instructorAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nadano uprawnienia Instruktora</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="shootingLeaderAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nadano uprawnienia Prowadzącego Strzelanie</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="patentAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Patent został zapisany</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
        </q-card-actions>
      </q-card>
</q-dialog>
    <q-dialog v-model="licenseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Licencja została zapisana</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="weapon">
      <q-card>
        <q-card-section>
          <div class="text-h6">Ustawiono pozwolenie na broń</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="basicData">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zaktualizowano dane podstawowe</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addressData">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zaktualizowano dane adresowe</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deactivateAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Przeniesiono do nieaktywnych</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),reload()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="arbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano sędziego</div>
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
      value: false,
      value1: false,
      value2: false,
      arbiterAlert: false,
      contributionRecord: '',
      HistoryContributionRecord: null,
      alert: false,
      patentAlert: false,
      licenseAlert: false,
      weapon: false,
      basicData: false,
      addressData: false,
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
    addHistoryContributionRecord (uuid, date) {
      fetch('http://localhost:8080/contribution/history' + uuid + '?date=' + date, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(members => {
          this.members = members
          this.reload()
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
          this.basicData = true
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
        })
    },
    getListMembers () {
      fetch('http://localhost:8080/member/activelist?active=true&adult=true&erase=false', {
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
      })
        .then(members => {
          this.members = members
          if (this.value) { this.instructorAlert = true }
          if (this.value1) { this.shootingLeaderAlert = true }
          if (this.value2) { this.arbiterAlert = true }
          this.value = false
          this.value1 = false
          this.value2 = false
          console.log('prowadzący ' + this.permissionsShootingLeaderNumber)
          console.log('instruktor ' + this.permissionsInstructorNumber)
          console.log('sędzia ' + this.permissionsArbiterNumber)
          console.log('sędzia ważny do ' + this.permissionsArbiterPermissionValidThru)
          console.log('ordinal ' + this.ordinal)
        })
    }
  },
  name: 'members'
}
</script>
