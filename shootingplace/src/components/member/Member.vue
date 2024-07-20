<template>
  <div v-if="member != null" class="full-width">
    <q-card-actions align="right" class="q-pa-xs q-ma-xs">
      <q-btn icon="close" color="primary" round dense v-close-popup />
    </q-card-actions>
    <div class="text-h6 text-center bg-warning" v-if="shootingPlace==='prod' && !member.declarationLOK">Brak Podpisanej Deklaracji LOK</div>
    <q-card bordered class="container round" :class="`row bg-${member.active ?'green' : 'red'}-3`" :style="`rotate: -${rotateFun}deg; height: ${mobile? '30vh' : ''}`" @dblclick="rotateFun+=0.25" @click.ctrl="rotateFun=0" @click.shift.left="rotateFun+=25">
      <q-card-section v-if="member.imageUUID != null" avatar :class="mobile ? 'col-3 q-pa-none q-ma-none' : 'col-3'">
        <q-img contain fit=none style="max-height: 40vh; border-radius: 5px" class="text-body1" alt="zdjęcie profilowe"
          :src="(`${local}/files/getFile?uuid=${member.imageUUID}`)" />
      </q-card-section>
      <q-card-section v-else avatar class="col-4">
        <q-uploader class="fit" method="POST"
          :url="(`${local}/files/member/${member.uuid}`)" label="Dodaj zdjęcie"
          max-file-size="40960000" accept=".jpg, image/*" @rejected="onRejected" field-name="file"
          @uploaded="getMemberByUUID(member.uuid)" />
      </q-card-section>
      <q-card-section class="col">
        <q-item-label class="text-h6">{{ member.secondName }} {{ member.firstName }}</q-item-label>
        <q-item-label class="text-bold text-center bg-secondary text-white" caption
          style="border-radius: 1em;">{{ member.club.name }}</q-item-label>
        <q-item-label style="border-radius: 1em;" :class="member.adult ?' bg-primary':' bg-secondary'" class="text-bold text-center text-white" caption>{{ member.adult ? 'Grupa: Ogólna' : 'Grupa: Młodzieżowa' }}</q-item-label>
        <q-item-label >{{ member.active ? 'Status: Aktywny' : 'Status: Nieaktywny' }}</q-item-label>
        <q-item-label v-if="member.history.contributionList.length > 0">Składka ważna do:
          {{ convertDate(member.history.contributionList[0].validThru) }}
        </q-item-label>
        <q-item-label v-if="member.history.contributionList.length > 0">Składka opłacona dnia:
          {{ convertDate(member.history.contributionList[0].paymentDay) }}
        </q-item-label>
        <div v-if="member.imageUUID != null">
          <q-btn color="primary" label="zmień zdjęcie">
            <q-popup-edit value="" content-class="bg-dark text-positive" >
              <q-uploader style="width:100%;height:100%" method="POST"
                :url="(`${local}/files/member/${member.uuid}`)" label="Dodaj zdjęcie"
                max-file-size="40960000" accept=".jpg, image/*" @rejected="onRejected" field-name="file"
                @uploaded="getMemberByUUID(member.uuid)" />
            </q-popup-edit>
          </q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col text-bold">
        <q-item-label class="text-h6" :id="member.legitimationNumber">Numer Legitymacji: {{ member.legitimationNumber }}</q-item-label>
        <q-item-label>Numer PESEL: {{ member.pesel }}</q-item-label>
        <q-item-label>Data Zapisu do Klubu: {{ convertDate(member.joinDate) }}</q-item-label>
        <q-item-label v-if="member.signBy != null">Zapisany do Klubu przez: {{ member.signBy }}</q-item-label>
      </q-card-section>
      <q-card-section v-if="member.erased" class="col-4">
        <div>
          <q-item-label>Podstawa skreślenia z listy Klubowiczów</q-item-label>
          <q-item-label caption lines="2">{{ member.erasedEntity.erasedType }} {{ member.erasedEntity.date }}
          </q-item-label>
          <q-item-label v-if="member.erasedEntity.additionalDescription != null" caption lines="2">
            {{ member.erasedEntity.additionalDescription }}
          </q-item-label>
        </div>
      </q-card-section>
    </q-card>
    <q-card bordered :style="`rotate: ${rotateFun}deg;`" :class="mobile ? 'col bg-dark' : 'row bg-dark'">
      <q-card-section class="col-3">
        <div class="col q-pa-md text-positive">
          <div class="self-center full-width text-center">Historia Składek</div>
        </div>
        <div v-if="shootingPlace === 'prod'" class="col q-pa-md text-positive">
          <div class="text-center text-positive">Ilość Składek</div>
          <div class="row col">
            <q-radio v-model="contributionCount" :val="1" label="1" color="primary" class="col"><q-tooltip content-class="bg-primary text-h6" :offset="[15,0]" anchor="top middle" self="bottom middle">3 miesiące</q-tooltip></q-radio>
            <q-radio v-model="contributionCount" :val="2" label="2" color="primary" class="col"><q-tooltip content-class="bg-primary text-h6" :offset="[15,0]" anchor="top middle" self="bottom middle">6 miesięcy</q-tooltip></q-radio>
            <q-radio v-model="contributionCount" :val="3" label="3" color="primary" class="col"><q-tooltip content-class="bg-primary text-h6" :offset="[15,0]" anchor="top middle" self="bottom middle">9 miesięcy</q-tooltip></q-radio>
            <q-radio v-model="contributionCount" :val="4" label="4" color="primary" class="col"><q-tooltip content-class="bg-primary text-h6" :offset="[15,0]" anchor="top middle" self="bottom middle">1 rok</q-tooltip></q-radio>
          </div>
        </div>
        <div v-if="!member.erased && main && !mobile">
          <div>
            <q-btn class="full-width round" color="green" label="Przedłuż składkę" :disable="contributionCount==0&&shootingPlace==='prod'"
              @click="memberUUID = member.uuid; name = member.secondName + ' ' + member.firstName; contribution = true; rotateFun+=0.125" :loading="loading[0]" />
          </div>
        </div>
        <q-expansion-item dense default-opened class="bg-dark full-width q-pa-none text-center text-positive"
          label="Daty Składek">
          <q-virtual-scroll class="full-width q-pa-none" :style=" mobile ? '' : 'height: 65vh;' "
            :items=" member.history.contributionList ">
            <template class="row" v-slot=" { item } ">
              <div class="row full-width hover1" @dblclick="contributionUUID = item.uuid, name = (member.secondName + ' ' + member.firstName);
                !main && !mobile ? '' : (contributionUUID = item.uuid, memberUUID = member.uuid, editContributionPaymentDate = item.paymentDay
                  , editContributionValidThruDate = item.validThru, editContribution = true)">
                <Tooltip2clickTip></Tooltip2clickTip>
                <div class="col text-left">
                  <label v-if="item.acceptedBy!=null" class="q-pa-xs">{{(item.edited?'Edytowano':'Zaakceptowano')}} przez: {{ item.acceptedBy }}</label>
                  <div class="row">
                    <div class="col-6 q-pl-xs text-left">
                      <label>Opłacona dnia</label>
                      <div>{{ convertDate(item.paymentDay) }}</div>
                    </div>
                    <div class="col-6 q-pl-xs text-left">
                      <label>Ważna do:</label>
                      <div>{{ convertDate(item.validThru) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </q-virtual-scroll>
        </q-expansion-item>
      </q-card-section>
      <MemberLicense :memberUUID=" member.uuid " :clubID=" member.club.id " :adult=" member.adult " :active=" member.active "
        :licenseUUID=" member.license.uuid " :shootingPatent=" member.shootingPatent "></MemberLicense>
      <q-card-section class="col-5 text-center">
        <q-item-section class="text-center text-positive">
          <q-expansion-item dense label="Informacje o Uprawnieniach" class="col bg-dark text-positive'"
            group="right-card">
            <div v-if=" (member.memberPermissions.arbiterNumber !== null && member.memberPermissions.arbiterNumber !== '') "
              class="col q-pl-xs text-left">
              <label class="">Sędzia</label>
              <div class="row">
                <div class="col q-pl-xs">
                  <label class="">Numer</label>
                  <div>
                    {{ member.memberPermissions.arbiterNumber }}
                  </div>
                </div>
                <div class="col q-pl-xs">
                  <label class="">Klasa</label>
                  <div>
                    {{ member.memberPermissions.arbiterClass }}
                  </div>
                </div>
                <div class="col q-pl-xs">
                  <label class="">Ważna do</label>
                  <div>
                    {{ convertDate(member.memberPermissions.arbiterPermissionValidThru) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if=" member.shootingPatent.patentNumber !== null " class="col q-pl-xs text-left">
              <label class="">Patent</label>
                <div class="row">
                  <div class="col q-pl-xs">
                    <label class="">Numer</label>
                    <div>
                      {{ member.shootingPatent.patentNumber }}
                    </div>
                  </div>
                  <div class="col q-pl-xs">
                    <label class="">Nadany dnia</label>
                    <div>
                      {{ convertDate(member.shootingPatent.dateOfPosting) }}
                    </div>
                  </div>
                </div>
              <label class="">Dyscypliny</label>
                <div class="row">
                  <div class="col q-pl-xs">
                    <label class="">Pistolet</label>
                    <div>
                      {{ convertDate(member.history.patentDay[0]) }}
                    </div>
                  </div>
                  <div class="col q-pl-xs">
                    <label class="">Karabin</label>
                    <div>
                      {{ convertDate(member.history.patentDay[1]) }}
                    </div>
                  </div>
                  <div class="col q-pl-xs">
                    <label class="">Strzelba</label>
                    <div>
                      {{ convertDate(member.history.patentDay[2]) }}
                    </div>
                  </div>
                </div>
            </div>
            <div v-if=" member.weaponPermission.number != null && member.weaponPermission.exist " class="col q-pl-xs text-left">
              <label class="">Numer pozwolenia na broń</label>
              <div>
                {{ member.weaponPermission.number }}
              </div>
            </div>
            <div v-if=" member.weaponPermission.admissionToPossessAWeapon != null && member.weaponPermission.admissionToPossessAWeaponIsExist " class="col text-left q-pl-xs">
              <label class="">Numer dopuszczenia do posiadania broni</label>
              <div>
                {{ member.weaponPermission.admissionToPossessAWeapon }}
              </div>
            </div>
            <div v-if=" (member.memberPermissions.shootingLeaderNumber != null && member.memberPermissions.shootingLeaderNumber !== '') " class="col text-left q-pl-xs">
              <label class="">Numer Legitymacji Prowadzącego Strzelanie</label>
                <div>
                  {{ member.memberPermissions.shootingLeaderNumber }}
                </div>
            </div>
            <div v-if=" (member.memberPermissions.instructorNumber != null && member.memberPermissions.instructorNumber !== '') " class="col text-left q-pl-xs">
              <label class="">Numer Legitymacji instruktora</label>
                <div>
                  {{ member.memberPermissions.instructorNumber }}
                </div>
            </div>
          </q-expansion-item>
        </q-item-section>
        <q-expansion-item v-if=" !member.erased && main && !mobile " dense label="Wydawanie Amunicji"
          class="col items-center bg-dark text-positive" group="right-card">
          <div>
            <div class="row noSelect">
              <div class="col text-center self-center q-pa-xs">
                <div>Kaliber</div>
              </div>
              <div class="col text-center self-center q-pa-xs">
                <div>Ilość wydanej amunicji</div>
              </div>
            </div>
            <q-card flat class="row bg-dark">
              <q-card-section class="col q-pa-none">
                <div v-for="( calibers, uuid ) in  calibers " :key=" uuid " class="q-pa-xs hover">
                  <q-radio dense v-model=" caliberUUID " :val=" calibers.uuid " class="full-width text-left" :label="calibers.name">
                  </q-radio>
                </div>
              </q-card-section>
              <q-card-section class="col q-pa-none">
                <div v-for="( counter, uuid ) in  member.personalEvidence.ammoList " :key=" uuid ">
                  <div class="col text-left q-pa-xs">
                    <label style="font-size: 0.75em">{{ counter.caliberName }}</label>
                    <div>
                      {{ counter.counter }} sztuk
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <div v-if=" !member.erased " class="row">
              <q-input dense
                @keypress.enter=" memberUUID = member.uuid; legNumber = member.legitimationNumber; addAmmoConfirm = true " filled
                class="full-width col" color="positive" label-color="positive" input-class="text-positive"
                v-model=" quantity " placeholder="Tylko cyfry"
                onkeypress="return (event.charCode > 44 && event.charCode < 58)" label="Ilość Amunicji"
                type="number"></q-input>
              <q-btn dense class="full-width col round" :disable=" caliberUUID == null || quantity.length === 0 " color="primary"
                label="wydaj amunicję"
                @click=" memberUUID = member.uuid; legNumber = member.legitimationNumber; addAmmoConfirm = true "></q-btn>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item icon dense v-if=" !member.erased && main && !mobile " :header-class="!headerColorChange?'':'bg-grey-3 text-black round'" @hide="headerColorChange=!headerColorChange" @show="headerColorChange=!headerColorChange" label="Opcje Dodatkowe" group="right-card" class="bg-dark text-positive">
          <template v-slot:header>
            <q-item-section v-if="(!member.pzss && member.club.id == 1) || (!member.declarationLOK && shootingPlace === 'prod')" class="text-left col-4">
              <q-icon name="warning" color="warning" size="5vh" class="pulse"/>
            </q-item-section>
            <q-item-section v-if="(!member.pzss && member.club.id == 1) || (!member.declarationLOK && shootingPlace === 'prod')" class="col text-left">
              Opcje Dodatkowe
            </q-item-section>
            <q-item-section v-else class="col text-center">
              Opcje Dodatkowe
            </q-item-section>
          </template>
          <q-expansion-item dense v-if=" !member.erased "
            :label=" member.shootingPatent.patentNumber !== null ? (helpersDefault[0] + ': ' + member.shootingPatent.patentNumber + ' Data: ' + member.shootingPatent.dateOfPosting) : helpersDefault[0] "
            group="right-right-card" class="text-positive">
            <q-btn class="full-width round" color="primary" v-if=" member.shootingPatent.patentNumber !== null "
              label="AKTUALIZUJ PATENT" @click="
                memberUUID = member.uuid;
                patentPistolPermission1 = member.shootingPatent.pistolPermission;
                patentRiflePermission1 = member.shootingPatent.riflePermission;
                patentShotgunPermission1 = member.shootingPatent.shotgunPermission;
                patentConfirm2 = true
              ">
            </q-btn>
            <q-btn class="full-width round" color="primary" v-else label="DODAJ PATENT"
              @click=" memberUUID = member.uuid; patentConfirm = true "></q-btn>
            <q-item v-if="
              member.shootingPatent.pistolPermission
              && member.shootingPatent.riflePermission
              && member.shootingPatent.shotgunPermission
            ">
              <q-item-label class="text-center full-width self-center">Klubowicz posiada cały Patent</q-item-label>
            </q-item>
          </q-expansion-item>
          <q-expansion-item dense v-if=" member.adult && !member.erased "
            :label=" member.weaponPermission.exist ? (helpersDefault[1] + ': ' + member.weaponPermission.number) : helpersDefault[1] "
            group="right-right-card">
            <div class="row">
              <q-input dense @keypress.enter=" changeWeaponPermission(member.uuid, weaponPermissionNumber, isExist) " filled
                class="col" bg-color="grey-3" v-if=" member.weaponPermission.number == null || !member.weaponPermission.exist "
                v-model=" weaponPermissionNumber " label="Numer pozwolenia" />
              <q-btn dense class="col round" v-if=" !member.weaponPermission.exist " label="Dodaj" color="primary"
                @click=" changeWeaponPermission(member.uuid, weaponPermissionNumber, isExist) " />
              <q-btn dense class="col round" v-if=" member.weaponPermission.exist " label="Usuń pozwolenie" color="primary"
                @click=" memberUUID = member.uuid; permission = true; eraseWeapon = true " />
            </div>
          </q-expansion-item>
          <q-expansion-item dense v-if=" member.adult && !member.erased "
            :label=" member.weaponPermission.admissionToPossessAWeaponIsExist ? (helpersDefault[2] + ': ' + member.weaponPermission.admissionToPossessAWeapon) : helpers[2] "
            group="right-right-card">
            <div class="row">
              <q-input dense
                @keypress.enter=" changeWeaponAdmission(member.uuid, admissionToPossess, admissionToPossessIsExist) "
                filled class="col" bg-color="grey-3"
                v-if=" member.weaponPermission.admissionToPossessAWeapon == null || !member.weaponPermission.admissionToPossessAWeaponIsExist "
                v-model=" admissionToPossess " label="Numer Dopuszczenia" />
              <q-btn dense class="col round" v-if=" !member.weaponPermission.admissionToPossessAWeaponIsExist " label="Dodaj"
                color="primary"
                @click=" changeWeaponAdmission(member.uuid, admissionToPossess, admissionToPossessIsExist) " />
              <q-btn dense class="col round" v-if=" member.weaponPermission.admissionToPossessAWeaponIsExist " label="Usuń dopuszczenie"
                color="primary" @click=" memberUUID = member.uuid; admission = true; eraseAssest = true " />
            </div>
          </q-expansion-item>
          <q-expansion-item dense v-if=" member.adult && !member.erased " label="Uprawnienia" :header-class="!headerColorChange2?'':'bg-grey-3 text-black round'" @hide="headerColorChange2=!headerColorChange2" @show="headerColorChange2=!headerColorChange2" group="right-right-card">
            <q-expansion-item dense
              :label=" helpers[3] = member.memberPermissions.shootingLeaderNumber != null ? ('Prowadzący Strzelanie: ' + member.memberPermissions.shootingLeaderNumber) : helpersDefault[3] "
              group="qualifications">
              <div class="row">
                <q-input dense @keypress.enter=" memberUUID = member.uuid; shootingLeaderConfirm = true " filled class="col"
                  bg-color="grey-3" v-model=" permissionsShootingLeaderNumber " label="Numer Uprawnień" />
                <q-btn dense class="col round" label="Dodaj" color="primary"
                  @click=" memberUUID = member.uuid; shootingLeaderConfirm = true " />
              </div>
            </q-expansion-item>
            <q-expansion-item dense
              :label=" helpers[4] = member.memberPermissions.instructorNumber != null ? ('Instruktor: ' + member.memberPermissions.instructorNumber) : helpersDefault[4] "
              group="qualifications">
              <div class="row">
                <q-input dense @keypress.enter=" memberUUID = member.uuid; instructorConfirm = true " filled class="col"
                  v-model=" permissionsInstructorNumber " label="Numer Uprawnień" bg-color="grey-3" />
                <q-btn dense class="col round" :label="member.memberPermissions.instructorNumber != null ? 'Nadaj nowy numer':'Dodaj'" color="primary" @click=" memberUUID = member.uuid; instructorConfirm = true " />
              </div>
            </q-expansion-item>
            <q-expansion-item dense v-if=" member.adult && !member.erased "
              :label=" helpers[5] = member.memberPermissions.arbiterNumber != null ? ('Sędzia: ' + member.memberPermissions.arbiterNumber) : helpersDefault[5] "
              group="qualifications">
              <q-item class="full-width">
                <q-input dense outlined filled class="full-width col"
                  v-if=" member.memberPermissions.arbiterNumber == null || member.memberPermissions.arbiterNumber === '' "
                  v-model=" permissionsArbiterNumber " label="Numer Uprawnień" bg-color="grey-3" />
                <q-input dense class="col" outlined filled v-model=" permissionsArbiterPermissionValidThru "
                  mask="####-12-31" label="Ważne do:" bg-color="grey-3">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model=" permissionsArbiterPermissionValidThru " mask="YYYY-MM-DD"
                          class="bg-dark text-positive">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Zamknij" color="primary" />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-btn dense class="col full-width round" v-if=" member.memberPermissions.arbiterNumber != null " color="primary"
                  label="Przedłuż" @click=" memberUUID = member.uuid; arbiterProlongConfirm = true " />
              </q-item>
              <div class="col">
                <div class="col">
                  <q-radio dense class="flex" v-if=" member.memberPermissions.arbiterNumber == null " v-model=" ordinal "
                    :val=" 1 " label="Klasa 3" color="primary" />
                  <q-radio dense class="flex" v-if=" member.memberPermissions.arbiterNumber == null " v-model=" ordinal "
                    :val=" 2 " label="Klasa 2" color="primary" />
                  <q-radio dense class="flex" v-if=" member.memberPermissions.arbiterNumber == null " v-model=" ordinal "
                    :val=" 3 " label="Klasa 1" color="primary" />
                  <q-radio dense class="flex" v-if=" member.memberPermissions.arbiterNumber == null " v-model=" ordinal "
                    :val=" 4 " label="Klasa Państwowa" color="primary" />
                  <q-radio dense class="flex" v-if=" member.memberPermissions.arbiterNumber == null " v-model=" ordinal "
                    :val=" 5 " label="Klasa Międzynarodowa" color="primary" />
                </div>
                <q-item v-if=" member.memberPermissions.arbiterNumber !== null " class="full-width row">
                  <q-input dense outlined filled class="full-width col"
                    v-if=" member.memberPermissions.arbiterNumber != null " v-model=" permissionsArbiterNumber "
                    label="Numer Uprawnień"/>
                  <q-btn dense class="full-width col round" v-if=" member.memberPermissions.arbiterNumber != null "
                    label="Nadaj Nowy Numer" color="primary" @click=" memberUUID = member.uuid; arbiterConfirm = true " />
                </q-item>
                <q-item class="full-width">
                  <q-btn dense class="full-width col-1 round" v-if=" member.memberPermissions.arbiterNumber !== null " color="primary"
                    label="Podnieś Klasę" @click=" memberUUID = member.uuid; arbiterUpdateClassConfirm = true " />
                  <q-btn dense class="full-width col-1 round"
                    v-if=" member.memberPermissions.arbiterNumber === null || member.memberPermissions.arbiterNumber === '' "
                    label="Dodaj" color="primary" @click=" memberUUID = member.uuid; arbiterConfirm = true " />
                </q-item>
              </div>
            </q-expansion-item>
          </q-expansion-item>
          <q-expansion-item dense v-if=" !member.erased " label="Portal PZSS" group="right-right-card">
            <template v-slot:header>
              <q-item-section class="col-4 text-left">
                <q-icon v-if="!member.pzss && member.club.id == 1" size="5vh" class="pulse" name="warning" color="warning"/>
                <q-icon v-else size="5vh">
                  <img src="~assets/logo-PZSS.png">
                </q-icon>
              </q-item-section>
              <q-item-section class="col text-left">
                Portal PZSS
              </q-item-section>
            </template>
            <div class="row">
              <q-tooltip content-class="bg-dark text-positive" anchor="top middle" :delay="750">kliknij aby edytować</q-tooltip>
              <q-btn dense class="col q-ma-md" text-color="black" @click=" main && !mobile ? (memberUUID = member.uuid, pzssPortal = true) : '' " :color="!member.pzss?'red-3':'green-3'" :label="!member.pzss?'Nie Wprowadzony do Portalu':'Wprowadzony do portalu'"/>
            </div>
            <q-item dense v-if=" main && !mobile " class="q-pa-md">
              <CSVFile :uuid=" member.uuid " :name=" (member.secondName + ' ' + member.firstName) "></CSVFile>
            </q-item>
            <q-item dense v-if=" member.pzss " class="rounded">
              <q-btn class="full-width q-pa-none" type="a" href="https://portal.pzss.org.pl/CLub/Player" target="_blank"
                label="Przejdź do portalu" color="primary" />
            </q-item>
            <q-item dense v-if=" !member.pzss " class="rounded">
              <q-btn class="full-width q-pa-none" type="a" href="https://portal.pzss.org.pl/CLub/Player" target="_blank"
                label="Przejdź do portalu" color="primary" @click=" memberUUID = member.uuid; pzssPortal = true " />
            </q-item>
          </q-expansion-item>
          <q-expansion-item dense v-if=" !member.erased && shootingPlace === 'prod'" label="Deklaracja LOK" group="right-right-card">
            <template v-slot:header>
              <q-item-section class="text-left col-4">
                <q-icon v-if="!member.declarationLOK" name="warning" size="5vh" color="warning" class="pulse"/>
                <q-icon v-else size="5vh">
                  <img src="~assets/logo_LOK.png">
                </q-icon>
              </q-item-section>
              <q-item-section class="col text-left">
                Deklaracja LOK
              </q-item-section>
            </template>
            <div class="row">
              <q-btn dense class="col q-ma-md" text-color="black" @click=" main && !mobile ? (memberUUID = member.uuid, declarationLOK = true) : '' " :color="!member.declarationLOK?'red-3':'green-3'" :label="!member.declarationLOK?'Brak podpisanej Deklaracji':'Deklaracja Podpisana'"/>
            </div>
              <q-item dense v-if=" main && !mobile " class="q-pa-md">
              <DeklaracjaLOK v-on:membershipDeclarationLOKPDF="declarationLOK=true , memberUUID=member.uuid" :uuid=" member.uuid " :name=" (member.secondName + ' ' + member.firstName) "
                :disable=" member.club.id !== 1 "/>
                </q-item>
          </q-expansion-item>
          <q-expansion-item dense label="Pokaż statystyki" group="right-right-card"
            @show=" uuid = member.uuid; getPersonalStatistics(uuid) ">
            <div v-if=" personalStatisticsObject != null " class="col text-left text-caption">
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
                <div v-for="( item, uuid ) in  personalStatisticsObject.ammo.caliber " :key=" uuid ">
                  <div class="row full-width" style="border-bottom: solid 1px;">
                    <div class="col">{{ item.name }}:</div>
                    <div class="col text-right">{{ item.quantity }}szt.</div>
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
          <q-expansion-item dense v-if=" member.active " label="Przenieś do Nieaktywnych" group="right-right-card"
            class="bg-red round">
            <div class="q-pa-md text-h6 text-bold text-center full-width bg-red-4">Czy na pewno chcesz przenieść
              osobę?
            </div>
            <div class="q-pa-md text-bold text-center full-width bg-red-4">
              <q-btn class="full-width round" label="Przenieś" color="red" @click=" memberUUID = member.uuid; deactivate = true " />
            </div>
          </q-expansion-item>
          <q-expansion-item dense v-if=" !member.active && !member.erased " class="bg-green round" label="Przywróć do Aktywnych"
            group="right-right-card">
            <q-item class="bg-green-2 text-black">
              <q-item-label class="text-h6 text-bold text-center full-width">Czy na pewno chcesz przywrócić osobę?
              </q-item-label>
            </q-item>
            <q-item class="bg-green-2">
              <q-btn class="full-width round" label="Przywróć" color="green-8"
                @click=" memberUUID = member.uuid; backConfirm = true " />
            </q-item>
          </q-expansion-item>
          <q-expansion-item dense v-if=" !member.adult" label="Przenieś do Grupy Ogólnej"
            group="right-right-card">
            <q-item class="text-left">
              <q-item-label>Aby przenieść osobę do Grupy Ogólnej wymaga się:<br/>
              1. minimum 1 rok stażu od daty zapisu do klubu <span class="round" :class="checkInternship(member.joinDate) ? 'bg-green-3' : 'bg-red-3'">{{ checkInternship(member.joinDate) ?  '(spełniony)' : '(niespełniony)' }}</span><br/>
              2. opłaconych składek na dzień zmiany grupy <span class="round" :class="member.active ? 'bg-green-3' : 'bg-red-3'">{{ member.active ?  '(spełniony)' : '(niespełniony)' }}</span><br/>
              3. ukończonych 18 lat na dzień zmiany grupy <span class="round" :class="checkAge(member.pesel) ? 'bg-green-3' : 'bg-red-3'">{{ checkAge(member.pesel) ?  '(spełniony)' : '(niespełniony)' }}</span><br/>
            </q-item-label>
            </q-item>
            <q-item>
              <q-btn :disable="!checkInternship(member.joinDate) || !member.active || !checkAge(member.pesel)" class="full-width round" label="Przenieś" color="red"
                @click=" memberUUID = member.uuid; changeAdultConfirm = true "/>
                <q-tooltip v-if="!checkInternship(member.joinDate) || !member.active || !checkAge(member.pesel)" content-class="text-h6 bg-red" anchor="top middle" self="bottom middle"
                    :offset=" [12, 12] ">Spełnij powyższe warunki</q-tooltip>
            </q-item>
          </q-expansion-item>
          <q-expansion-item dense @focus.stop=" erasedReasonType = null; erasedDate = null " class="bg-red round"
            @click=" getListErasedType() " v-if=" !member.active && !member.erased " label="Skreśl z listy członków"
            group="right-right-card">
            <q-item class="bg-red-2 text-black">
              <q-item-label class="text-h6 text-bold text-center full-width">Czy na pewno chcesz usunąć osobę?
              </q-item-label>
            </q-item>
            <q-item class="bg-red-2 text-black">
              <q-select color="black" options-cover filled stack-label class="full-width" v-model=" erasedReasonType "
                :options=" erasedTypes " label="wybierz przyczynę" @show="getListErasedType()"/>
              <q-input class="col-5" color="black" outlined filled v-model=" erasedDate " mask="####-##-##" label="w dniu:">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model=" erasedDate " mask="YYYY-MM-DD" class="bg-dark text-positive">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <q-item class="bg-red-2">
              <q-input @keypress.enter=" memberUUID = member.uuid; eraseConfirm = true " v-model=" reason " filled color="black"
                class="col" stack-label label="Dodatkowe informacje" />
            </q-item>
            <q-item class="bg-red-2" v-if=" erasedReasonType != null ">
              <q-btn class="round" label="Usuń" color="red" @click=" memberUUID = member.uuid; eraseConfirm = true " />
            </q-item>
          </q-expansion-item>
          <q-expansion-item dense label="Zmień klub macierzysty" @click=" getAllClubs() " class="text-center">
            <div class="text-left">
              <q-checkbox :value=" clubChoiceToggle " v-model=" clubChoiceToggle " label="Inny Klub jest Klubem macierzystym"
                class="text-positive"></q-checkbox>
              <q-select v-if=" clubChoiceToggle " dense options-dense bg-color="grey-3" :options=" clubs "
              emit-value map-options options-selected-class="bg-negative text-positive"
              :option-value="opt => opt !== '' ? Object(opt.id).toString() : ''"
              :option-label="opt => opt !== '' ? Object(opt.name).toString() : ''"
              popup-content-class="bg-dark text-positive" v-model=" clubChoice " filled fill-input
                label="wybierz Klub">
                <template v-slot:option="option">
            <q-item class="rounded" :class="option.opt.id===1 ? 'bg-green-5':''" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']"
              v-on="option.itemEvents">
              <q-item-section dense style="padding: 0.5em; margin: 0;">
                <div class="container" >
                  {{ option.opt.name }}
                </div>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
              <q-btn dense v-if=" clubChoice !== '' && clubChoiceToggle " class="full-width round" color="primary" label="zmień klub macierzysty"
                @click=" changeClub(member.uuid, clubChoice) "/>
            </div>
          </q-expansion-item>
          <q-expansion-item dense label="Przypisane dokumenty" class="text-center"
            @show=" personalFiles = []; getAllMemberFiles(member.uuid) ">
            <q-virtual-scroll class="full-width q-pa-none" :items=" personalFiles " style="height: 20vh;">
              <template v-slot=" { item } ">
                <div @dblclick=" showloading(); getFile(item.uuid, item.name) "
                  class="cursor-pointer full-width row text-center"
                  style="padding-bottom: 3px;border: 1px solid; border-radius: 5px">
                  <div class="col-10">{{item.name}}</div>
                  <div class="col-2">{{item.date}}</div>
                  <q-tooltip content-class="text-h6 bg-red" anchor="top middle" self="bottom middle"
                    :offset=" [12, 12] ">Kliknij 2 razy aby pobrać plik
                  </q-tooltip>
                </div>
              </template>
            </q-virtual-scroll>
          </q-expansion-item>
        </q-expansion-item>
        <q-expansion-item dense label="Historia startów" group="right-card" :header-class="!headerColorChange1?'':'bg-grey-3 text-black round'" @hide="headerColorChange1=false" @show="headerColorChange1=true" class="text-positive" default-opened>
            <div class="q-pa-xs">
              <div class="self-center full-width text-center">Licznik startów</div>
            </div>
            <div class="row">
              <div class="col text-left ">
                <label class="text-caption">Pistolet</label>
                <div class="self-center full-width text-left">
                  {{ member.history.pistolCounter }}
                </div>
              </div>
              <div class="col text-left ">
                <label class="text-caption">Karabin</label>
                <div class="self-center full-width text-left">
                  {{ member.history.rifleCounter }}
                </div>
              </div>
              <div class="col text-left ">
                <label class="text-caption">Strzelba</label>
                <div class="self-center full-width text-left">
                  {{ member.history.shotgunCounter }}
                </div>
              </div>
            </div>
          <q-expansion-item dense label="Daty Startów" class="q-pa-none" default-opened>
            <SmoothScrollbar class="full-width q-pa-none text-left"
              :style=" member.memberPermissions.arbiterNumber != null ? 'height: 46.8vh' : 'height: 51vh' ">
              <div v-for="( item, index ) in  member.history.competitionHistory " :key=" index " class="hover1" @dblclick="getMemberScores(item.attachedToList);tournament.name=item.name;tournament.date=item.date;showCompetition=true">
                <Tooltip2clickToShow></Tooltip2clickToShow>
                <div class="full-width ">
                  <label class="text-caption">Nazwa</label>
                  <div class="text-left">
                    {{ item.name }}
                  </div>
                </div>
                <div class="row full-width">
                  <div class="col-4 ">
                  <label class="text-caption">Data</label>
                    <div class="text-left">
                      {{ convertDate(item.date) }}
                    </div>
                  </div>
                  <div v-if=" item.discipline != null "  class="col-4 ">
                  <label class="text-caption">Konkurencja</label>
                    <div class="text-left">
                      {{ item.discipline }}
                    </div>
                  </div>
                  <div v-if="item.discipline == null " class="col-4 ">
                  <label class="text-caption full-width">Konkurencje</label><br/>
                    <span v-for="( disc, id ) in  item.disciplineList " :key=" id " class="text-left">
                      <span class="col">{{disc.substring(0,1)}} </span>
                    </span>
                  </div>
                  <div class="col-4 ">
                  <label class="text-caption">WZSS</label>
                    <div class="text-left">
                      <q-icon :name=" item.wzss ? 'done' : 'cancel' " />
                    </div>
                  </div>
                </div>
              </div>
            </SmoothScrollbar>
          </q-expansion-item>
        </q-expansion-item>
        <q-expansion-item dense v-if=" member.memberPermissions.arbiterNumber != null " label="Historia sędziowania"
          group="right-card" class="text-positive">
          <SmoothScrollbar style="height: 52vh">
            <div v-for="( item, index ) in  member.history.judgingHistory " :key=" index ">
              <div class="row">
                <div class="col-4  text-left">
                  <label class="text-caption">Nazwa</label>
                  <div class="self-center full-width">
                    {{ item.name }}
                  </div>
                </div>
                <div class="col  text-left">
                  <label>Data</label>
                  <div class="self-center full-width">
                    {{ convertDate(item.date) }}
                  </div>
                </div>
                <div class="col  text-left">
                  <label>Funkcja</label>
                  <div class="self-center full-width">
                    {{ item.judgingFunction }}
                  </div>
                </div>
              </div>
            </div>
          </SmoothScrollbar>
        </q-expansion-item>
      </q-card-section>

      <q-card bordered :class=" mobile ? 'col bg-dark text-positive' : 'row full-width bg-dark text-positive' ">
        <q-card-section :class="`col-${main && !mobile ?'3':'6'}`" style="height:100%;">
          <div class="full-height text-positive">
            <q-item-label>
              <q-icon name="person_search" size="1.5rem" />
              Dane Podstawowe
            </q-item-label>
            <q-item-label class="text-positive" caption lines="2">Identyfikator:</q-item-label>
            <q-item-label class="text-positive" caption lines="2">{{ member.uuid }}</q-item-label>
            <q-item-label class="text-positive" caption lines="2">Imię: {{ member.firstName }}</q-item-label>
            <q-item-label class="text-positive" caption lines="2">Nazwisko: {{ member.secondName }}</q-item-label>
            <q-item-label class="text-positive" caption lines="2">Data Zapisu do Klubu: {{ convertDate(member.joinDate)
              }}</q-item-label>
            <q-item-label class="text-positive" caption lines="2">Pesel: {{ member.pesel }}</q-item-label>
            <q-item-label class="text-positive" caption lines="2">Numer Dowodu: {{ member.idcard }}</q-item-label>
            <p></p>
            <div class="rounded">
              <q-btn class="full-width" square v-if=" !member.erased && !mobile" label="Zmień Dane Podstawowe" color="secondary"
              @click=" memberUUID = member.uuid; memberIdCard = member.idcard; memberFirstName = member.firstName; memberSecondName = member.secondName; basicDataConfirm = true "/>
            </div>
          </div>
        </q-card-section>
        <q-card-section :class="`col-${main && !mobile ?'4':'6'}`">
          <q-item-section>
            <q-item-label>
              <q-icon name="contact_mail" size="1.5rem" />
              Dane Kontaktowe
            </q-item-label>
            <q-item-label class="text-positive" caption lines="2">e-mail: {{ member.email }}</q-item-label>
            <q-item-label class="text-positive" caption lines="2">Numer Telefonu:
              {{ member.phoneNumber.toString().substring(0, 3) + ' ' + member.phoneNumber.toString().substring(3, 6) + ' '
              + member.phoneNumber.toString().substring(6, 9) + ' ' + member.phoneNumber.substring(9, 12) }}
            </q-item-label>
            <q-item-label>
              <q-icon name="location_city" size="1.5rem" />
              Adres
            </q-item-label>
            <q-item-label v-if=" member.address.postOfficeCity != null " class="text-positive" caption lines="2">Miasto:
              {{ member.address.postOfficeCity }}
            </q-item-label>
            <q-item-label v-if=" member.address.zipCode != null " class="text-positive" caption lines="2">Kod Pocztowy:
              {{ member.address.zipCode }}
            </q-item-label>
            <q-item-label v-if=" member.address.street != null " class="text-positive" caption lines="2">Ulica: {{
              member.address.street }}
              {{ member.address.streetNumber }}
            </q-item-label>
            <q-item-label v-if=" member.address.flatNumber != null " class="text-positive" caption lines="2">Numer mieszkania:
              {{ member.address.flatNumber }}
            </q-item-label>
            <p></p>
            <div class="rounded">
              <q-btn v-if=" !member.erased && !mobile" class="full-width" label="Zmień Dane Kontaktowe" color="secondary"
              @click=" memberUUID = member.uuid; memberEmail = member.email; memberPhoneNumber = member.phoneNumber; memberPostOfficeCity = member.address.postOfficeCity; memberZipCode = member.address.zipCode; memberStreet = member.address.street; memberStreetNumber = member.address.streetNumber; memberFlatNumber = member.address.flatNumber; addressConfirm = true "/>
            </div>
          </q-item-section>
        </q-card-section>
        <q-card-section v-if=" !member.erased && main && !mobile " class="col-5">
          <q-item-section class="col full-width">
            <div class="q-pb-md" v-if="shootingPlace === 'prod'">
              <q-tooltip v-if=" member.club.id !== 1" content-class="text-h6 bg-red" anchor="top middle"
                self="bottom middle" :offset=" [12, 12] ">INNY KLUB MACIERZYSTY
              </q-tooltip>
              <DeklaracjaLOK v-on:membershipDeclarationLOKPDF="declarationLOK=true, memberUUID=member.uuid" :uuid=" member.uuid " :name=" (member.secondName + ' ' + member.firstName) "
                :disable=" member.club.id !== 1 " />
            </div>
            <div class="q-pb-md">
              <personalCardPDF :uuid=" member.uuid " :name=" (member.secondName + ' ' + member.firstName) " />
            </div>
            <div v-if=" member.history.contributionList.length > 0 " class="q-pb-md">
              <LastContributionPDF :title="'Pobierz ostatnie potwierdzenie składki'" :uuid=" member.uuid " :name=" (member.secondName + ' ' + member.firstName) "
                :disable=" member.history.contributionList.length < 1 " />
            </div>
            <div v-if=" !member.erased " class="q-pb-md">
              <q-tooltip v-if=" member.club.id !== 1 " content-class="text-h6 bg-red" anchor="top middle"
                self="bottom middle" :offset=" [12, 12] ">INNY KLUB MACIERZYSTY
              </q-tooltip>
              <q-tooltip v-else-if=" member.license.number === null " content-class="text-h6 bg-red" anchor="top middle"
                self="bottom middle" :offset=" [12, 12] ">BRAK
                LICENCJI
              </q-tooltip>
              <q-tooltip v-else-if=" member.shootingPatent.patentNumber === null " content-class="text-h6 bg-red"
                anchor="top middle" self="bottom middle" :offset=" [12, 12] ">BRAK
                PATENTU
              </q-tooltip>
              <ExtensionApplicationFile :uuid=" member.uuid " :name=" (member.secondName + ' ' + member.firstName) "
                :disable=" member.club.id !== 1 || member.license.number === null || member.shootingPatent.patentNumber === null " />
            </div>
            <div v-if=" !member.erased " class="q-pb-md">
              <q-tooltip v-if=" !member.active " content-class="text-h6 bg-red" anchor="top middle"
                self="bottom middle" :offset=" [12, 12] ">BRAK SKŁADEK
              </q-tooltip>
              <CertificateFile :uuid=" member.uuid " :name=" (member.secondName + ' ' + member.firstName) "/>
            </div>
            <div v-if=" !member.erased " class="q-pb-md">
              <q-tooltip v-if=" member.club.id !== 1 " content-class="text-h6 bg-red" anchor="top middle"
                self="bottom middle" :offset=" [12, 12] ">INNY KLUB MACIERZYSTY
              </q-tooltip>
              <q-tooltip v-else-if=" !member.active " content-class="text-h6 bg-red" anchor="top middle"
                self="bottom middle" :offset=" [12, 12] ">BRAK SKŁADEK
              </q-tooltip>
              <ApplicationForFirearmsLicense :uuid=" member.uuid " :name=" (member.secondName + ' ' + member.firstName) "
                :disable=" member.club.id !== 1  " />
            </div>
          </q-item-section>
        </q-card-section>
      </q-card>
    </q-card>
    <q-dialog v-model=" contribution " persistent>
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6">Czy przedłużyć składkę?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="przedłuż" color="primary" v-close-popup @click=" contributionCode = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" contributionCode " persistent>
      <q-card class="bg-green-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter=" simulateProgress(0); contributionCode = false " autofocus type="password"
            v-model=" code " filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn label="Przedłuż" color="black" v-close-popup @click=" simulateProgress(0); code = null " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" contributionHistoryCode " persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input
            @keypress.enter=" addHistoryContributionRecord(memberUUID, historyContributionRecord); contributionHistoryCode = false "
            autofocus type="password" v-model=" code " filled color="Yellow" class="bg-yellow text-bold"
            mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn label="Przedłuż" color="black" v-close-popup
            @click=" addHistoryContributionRecord(memberUUID, historyContributionRecord); code = null " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" addressConfirm ">
      <q-card class="bg-dark text-positive">
        <q-card-section class="col items-center">
          <q-item-label class="text-bold text-center text-h6">Zmień dane adresowe</q-item-label>
          <q-item>
            <q-input v-model=" memberEmail " label-color="positive" input-class="text-positive" label="e-mail" />
          </q-item>
          <q-item>
            <q-input @focus=" memberPhoneNumber = null " prefix="+48" v-model=" memberPhoneNumber " label-color="positive" input-class="text-positive"
              label="Numer Telefonu" mask="### ### ###" />
          </q-item>
          <q-item>
            <q-input v-model=" memberPostOfficeCity " label-color="positive" input-class="text-positive" label="Miasto" />
          </q-item>
          <q-item>
            <q-input v-model=" memberZipCode " label-color="positive" input-class="text-positive" label="Kod Pocztowy" mask="##-###" />
          </q-item>
          <q-item>
            <q-input v-model=" memberStreet " label-color="positive" input-class="text-positive" label="Ulica" />
          </q-item>
          <q-item>
            <q-input v-model=" memberStreetNumber " label-color="positive" input-class="text-positive" label="Numer Ulicy" />
          </q-item>
          <q-item>
            <q-input v-model=" memberFlatNumber " label-color="positive" input-class="text-positive" label="Numer mieszkania" />
          </q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="zapisz" color="primary" v-close-popup @click=" addressConfirm1 = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" addressConfirm1 " persistent>
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy na pewno zmienić dane adresowe?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="zmień" color="primary" v-close-popup
            @click=" updateMemberCode = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" updateMemberCode " persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter="updateIDCardAndName (memberUUID, memberIdCard, memberFirstName, memberSecondName, code); updateMember(memberUUID, memberEmail, memberPhoneNumber,code);
              updateAddress(memberUUID, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber,code); updateMemberCode = false " autofocus type="password" v-model=" code "
            filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn label="Przenieś" color="black" v-close-popup @click="updateIDCardAndName (memberUUID, memberIdCard, memberFirstName, memberSecondName, code), updateMember(memberUUID, memberEmail, memberPhoneNumber,code);
              updateAddress(memberUUID, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber,code); code = null " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" pzssPortal ">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy Klubowicz został dodany do portalu?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="nie" color="secondary" v-close-popup @click=" togglePzss(memberUUID,false) " />
          <q-btn label="tak" color="primary" v-close-popup @click=" togglePzss(memberUUID,true) " />
          <q-btn label="anuluj" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" declarationLOK ">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy Klubowicz podpisał deklarację LOK?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="nie" color="secondary" v-close-popup @click=" toggleDeclarationLOK(memberUUID,false) " />
          <q-btn label="tak" color="primary" v-close-popup @click=" toggleDeclarationLOK(memberUUID,true) " />
          <q-btn label="anuluj" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" basicDataConfirm ">
      <q-card class="bg-dark text-positive">
        <q-card-section class="col items-center">
          <q-item-label class="text-bold text-center text-h6">Zmień dane podstawowe</q-item-label>
          <q-item>
            <q-input v-model=" memberIdCard " label-color="positive" input-class="text-positive" label="Numer Dokumentu" />
          </q-item>
          <q-item>
            <q-input v-model=" memberFirstName " label-color="positive" input-class="text-positive" label="Imię"
              onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 45" />
          </q-item>
          <q-item>
            <q-input v-model=" memberSecondName " label-color="positive" input-class="text-positive" label="Nazwisko"
              onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 45" />
          </q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="zapisz" color="primary" v-close-popup @click=" basicDataConfirm1 = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" basicDataConfirm1 " persistent>
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy na pewno zmienić dane podstawowe?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="zapisz" color="primary" v-close-popup
            @click=" updateMemberCode = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" deactivate " persistent>
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-h6 text-bold text-center">
          <span class="q-ml-sm">Czy na pewno przenieść do nieaktywnych?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="przenieś" color="primary" v-close-popup @click=" activeCode = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" backConfirm " persistent>
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-h6 text-bold text-center">
          <span class="q-ml-sm">Czy na pewno chcesz przywrócić Klubowicza?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="przywróć" color="primary" v-close-popup @click=" activeCode = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" activeCode " persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter=" changeActive(memberUUID); activeCode = false " autofocus type="password" v-model=" code "
            filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn label="Przenieś" color="black" v-close-popup @click=" changeActive(memberUUID); code = null " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" eraseWeapon " persistent>
      <q-card>
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy na pewno usunąć pozwolenie?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="usuń" color="primary" v-close-popup @click=" removeWeaponPermissionOrAdmission() " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" eraseAssest " persistent>
      <q-card>
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy na pewno usunąć dopuszczenie?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="usuń" color="primary" v-close-popup @click=" removeWeaponPermissionOrAdmission() " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" instructorConfirm " persistent @keypress.esc=" instructorConfirm = false "
      @keypress.enter=" updateMemberPermissions(memberUUID, permissionsInstructorNumber); instructorConfirm = false; value = true ">
      <q-card>
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy na pewno chcesz nadać numer instruktora?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="Tak" color="primary" v-close-popup
            @click=" updateMemberPermissions(memberUUID, permissionsInstructorNumber); value = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" shootingLeaderConfirm " persistent @keypress.esc=" shootingLeaderConfirm = false "
      @keypress.enter=" updateMemberPermissions(memberUUID, permissionsShootingLeaderNumber); shootingLeaderConfirm = false; value1 = true ">
      <q-card>
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy na pewno chcesz nadać numer Prowadzącego strzelanie?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="Tak" color="primary" v-close-popup
            @click=" updateMemberPermissions(memberUUID, permissionsShootingLeaderNumber); value1 = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" arbiterConfirm " persistent @keypress.esc=" arbiterConfirm = false "
      @keypress.enter=" updateMemberPermissions(memberUUID, permissionsArbiterNumber, permissionsArbiterPermissionValidThru); arbiterConfirm = false; value2 = true ">
      <q-card>
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy na pewno chcesz nadać numer Sędziego?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="Tak" color="primary" v-close-popup
            @click=" updateMemberPermissions(memberUUID, permissionsArbiterNumber, permissionsArbiterPermissionValidThru) " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" arbiterProlongConfirm " persistent
      @keypress.enter=" updateMemberPermissions(memberUUID, permissionsArbiterPermissionValidThru); value3 = true; arbiterUpdateClassConfirm = false ">
      <q-card>
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy na pewno chcesz przedłużyć licencję Sędziego?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="Przedłuż" color="primary" v-close-popup
            @click=" updateMemberPermissions(memberUUID, permissionsArbiterPermissionValidThru); value3 = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" arbiterUpdateClassConfirm " persistent
      @keypress.enter=" updateMemberArbiterClass(memberUUID); arbiterUpdateClassConfirm = false ">
      <q-card>
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy na pewno chcesz podnieść klasę licencji Sędziego?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="podnieś" color="primary" v-close-popup @click=" updateMemberArbiterClass(memberUUID) " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" eraseConfirm " persistent @keypress.enter=" eraseCode = true; eraseConfirm = false ">
      <q-card class="bg-warning">
        <q-card-section class="row">
          <span class="q-ml-sm text-h6 text-bold text-center">Czy na pewno chcesz usunąć Klubowicza <br/>z listy członków klubu?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="white" text-color="black" v-close-popup />
          <q-btn label="usuń" color="red" text-color="black" v-close-popup @click=" eraseCode = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" eraseCode " persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter=" eraseMember(memberUUID); eraseCode = false " autofocus type="password" v-model=" code "
            filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn label="skreśl" color="black" v-close-popup @click=" eraseMember(memberUUID); code = null " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" changeAdultConfirm " @keypress.enter=" changeAdultCode = true; changeAdultConfirm = false ">
      <q-card class="bg-dark text-positive text-h6">
        <q-card-section class="row text-center">
          <span class="q-ml-sm">Czy na pewno chcesz przenieść Klubowicza<br/> do Grupy Ogólnej?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="Przenieś" color="primary" v-close-popup @click=" changeAdultCode = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" changeAdultCode " persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input @keypress.enter=" changeAdult(memberUUID); changeAdultCode = false " autofocus type="password"
            v-model=" code " filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn text-color="white" label="Przedłuż" color="black" v-close-popup
            @click=" changeAdult(memberUUID); code = null " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" contributionDownloadConfirm "
      @keypress.enter=" contributionDownloadConfirm = false; getContributionPDF() ">
      <q-card class="bg-dark text-positive">
        <q-card-section class="col text-center text-h6">
          <div class="q-ml-sm text-bold text-h6">Pobrać potwierdzenie składki?</div>
          <q-checkbox val="" v-model="a5rotate" label="rozmiar A5"></q-checkbox>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="Pobierz" color="primary" v-close-popup @click=" getContributionPDF() " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" addAmmoConfirm " persistent @keypress.enter=" addMemberAndAmmoToCaliber(); addAmmoConfirm = false ">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy na pewno chcesz wydać amunicję?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="wydaj" color="primary" v-close-popup @click="showloading(); addMemberAndAmmoToCaliber() " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" patentConfirm " persistent>
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="q-pa-xs text-h5 text-center text-bold">Dodawanie Patentu</div>
        </q-card-section>
        <q-card-section>
          <div class="col">
          <div class="row">
            <q-input input-class="text-positive" label-color="positive" color="positive" filled dense label="numer patentu" v-model=" patentNumber "
              mask="######"></q-input>
            <div class="col-1 self-center">/PAT/</div>
            <q-input input-class="text-positive" label-color="positive" color="positive" filled dense label="miesiąc / rok" v-model=" patentNumber1 "
              mask="##/####"></q-input>
            </div>
            <q-input class="col" input-class="text-positive" label-color="positive" color="positive" filled dense v-model=" patentDate " mask="####-##-##"
              label="Wybierz datę">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" color="positive">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model=" patentDate " mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-item>
              <q-checkbox v-model=" patentPistolPermission " label="Pistolet" />
            </q-item>
            <q-item>
              <q-checkbox v-model=" patentRiflePermission " label="Karabin" />
            </q-item>
            <q-item>
              <q-checkbox v-model=" patentShotgunPermission " label="Strzelba" />
            </q-item>
          </div>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="Dodaj" color="primary" v-close-popup @click=" patentConfirm1 = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" patentConfirm2 ">
      <q-card class="bg-dark text-white">
        <q-card-section>
          <div class="q-pa-xs text-h5 text-center text-bold">Aktualizowanie Patentu</div>
        </q-card-section>
        <q-card-section class="row">
          <div class="col">
          <div class="row">
            <q-input input-class="text-positive" label-color="positive" color="positive" filled dense label="numer patentu" v-model=" patentNumber "
              mask="######"></q-input>
            <div class="col-1 self-center">/PAT/</div>
            <q-input input-class="text-positive" label-color="positive" color="positive" filled dense label="miesiąc / rok" v-model=" patentNumber1 "
              mask="##/####"></q-input>
            </div>
            <q-input class="col" input-class="text-positive" label-color="positive" color="positive" filled dense v-model=" patentDate " mask="####-##-##"
              label="Wybierz datę">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" color="positive">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model=" patentDate " mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-item v-if=" !patentPistolPermission1 ">
              <q-checkbox v-model=" patentPistolPermission " label="Pistolet" class="text-positive" />
            </q-item>
            <q-item v-if=" !patentRiflePermission1 ">
              <q-checkbox v-model=" patentRiflePermission " label="Karabin" class="text-positive" />
            </q-item>
            <q-item v-if=" !patentShotgunPermission1 ">
              <q-checkbox v-model=" patentShotgunPermission " label="Strzelba" class="text-positive" />
            </q-item>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="Dodaj" color="primary" v-close-popup @click=" patentConfirm1 = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" patentConfirm1 " persistent
      @keypress.enter=" addPatent(memberUUID, (patentNumber + '/PAT/' + patentNumber1), patentPistolPermission, patentRiflePermission, patentShotgunPermission, patentDate); patentConfirm1 = false ">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy na pewno chcesz dodać PATENT?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="Dodaj" color="primary" v-close-popup
            @click=" addPatent(memberUUID, (patentNumber + '/PAT/' + patentNumber1), patentPistolPermission, patentRiflePermission, patentShotgunPermission, patentDate) " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" contributionAlert " position="top">
      <q-card>
        <q-card-section>
          <div class="text-h6">Składka została przedłużona</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" contributionRemoveRecordQuery " persistent
      @keypress.enter=" contributionRemoveRecordQuery = false; contributionRemoveRecordQueryCode = true ">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="row text-center text-h6">
          <h3><span class="q-ml-sm">Czy na pewno usunąć składkę?</span></h3>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="black" v-close-popup />
          <q-btn label="Usuń" color="black" v-close-popup @click=" contributionRemoveRecordQueryCode = true " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" showCompetition ">
      <q-card class="text-center bg-dark text-positive" style="min-width: 60vw">
        <q-card-section class="row text-center">
          <div class="text-h5 text-bold text-center full-width">Starty zawodnika w {{tournament.name}} z {{tournament.date}}</div>
          <div v-for="(item, index) in test" :key="index" class="full-width">
          <div class="text-h6 text-bold">{{item.name}}</div>
          <div v-for="(item1, index1) in item.scoreList" :key="index1" class="text-left row full-width">
            <div class="full-width row" v-if="item1.member != null" :style="item1.member.uuid===member.uuid?'padding-left: 1em; padding-right: 1em;':''" :class="item1.member.uuid===member.uuid?'bg-warning round':''">
              <div class="col-1 text-center">
                {{index1 + 1}}
              </div>
              <div class="col">
                {{ item1.member.secondName + ' ' + item1.member.firstName }}
              </div>
              <div class="col">
                {{ item1.member.club.name }}
              </div>
              <div class="col text-right" v-if="item1.dnf">DNF</div>
              <div class="col text-right" v-if="item1.dsq">DSQ</div>
              <div class="col text-right" v-if="item1.dnf">PK</div>
              <div class="col text-right" v-else>{{item1.score}}</div>
            </div>
            <div class="full-width row" v-if="item1.otherPersonEntity != null">
              <div class="col-1 text-center">
                {{index1 + 1}}
              </div>
              <div class="col">
                {{ item1.otherPersonEntity.secondName + ' ' + item1.otherPersonEntity.firstName }}
              </div>
              <div class="col">
                {{ item1.otherPersonEntity.club.name }}
              </div>
              <div class="col text-right" v-if="item1.dnf">DNF</div>
              <div class="col text-right" v-if="item1.dsq">DSQ</div>
              <div class="col text-right" v-if="item1.dnf">PK</div>
              <div class="col text-right" v-else>{{item1.score}}</div>
            </div>
          </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" contributionRemoveRecordQueryCode " persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter=" removeContributionRecord(); contributionRemoveRecordQueryCode = false " autofocus
              type="password" v-model=" code " filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn id="3" label="Usuń" color="black" v-close-popup @click=" removeContributionRecord() " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model=" failure ">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if=" message != null " class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model=" success ">
      <q-card>
        <q-card-section>
          <div v-if=" message != null " class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model=" editContribution " @keypress.esc=" editContribution = false ">
      <q-card class="bg-dark text-positive">
        <q-card-actions align="right" class="q-pa-xs q-ma-xs row">
          <div class="text-h5 text-bold text-center col">Edytuj Składkę</div>
          <q-btn icon="close" color="primary" round dense v-close-popup @click="memberName = ''; otherName = ''"/>
        </q-card-actions>
        <q-card-section>
          <div class="row">
              <q-input class="col-6" dense v-model=" editContributionPaymentDate " input-class="text-positive" label-color="positive" filled standout="bg-accent text-black" stack-label
                mask="####-##-##" label="Data Opłacenia Składki">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer" color="positive">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model=" editContributionPaymentDate " mask="YYYY-MM-DD" class="bg-dark text-positive">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input class="col-6" dense v-model=" editContributionValidThruDate " input-class="text-positive" label-color="positive" filled standout="bg-accent text-black"
                stack-label mask="####-##-##" label="Ważność Sładki">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer" color="positive">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model=" editContributionValidThruDate " mask="YYYY-MM-DD" class="bg-dark text-positive">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          <div class="row full-width">
            <div class="col-6 q-pa-md">
              <q-btn dense class="full-width" label="usuń Składkę" color="red"
                @click=" contributionRemoveRecordQuery = true; editContribution = false "></q-btn>
            </div>
            <div class="col-6 q-pa-md">
              <q-btn dense class="full-width" label="wprowadź zmiany" color="primary" v-close-popup
                @click=" editContributionCode = true " />
            </div>
          </div>
          <div class="col-6 q-pa-md">
            <q-btn dense class="full-width" label="Wydrukuj potwierdzenie dla tej składki" color="primary" v-close-popup
              @click=" uuid = member.uuid;contributionDownloadConfirm = true " />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" editContributionCode " persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter=" editContributionRecord(); code = null; editContributionCode = false " autofocus
              type="password" v-model=" code " filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup
            @click=" editContributionRecord(); code = null " />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style src="src/style/style.scss" lang="scss">
#container {
   position: relative;
}

#background {
   position: absolute;
   padding: 50%;
   margin: 50%;
   z-index: -2;
}
</style>
<script src="print.js"></script>
<script>
import axios from 'axios'
import App from 'src/App.vue'
import Print from 'print-js'
import { ref } from 'vue'
import MemberLicense from 'components/member/MemberLicense.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import Vue from 'vue'
import SmoothScrollbar from 'vue-smooth-scrollbar'
import Tooltip2clickTip from 'src/utils/Tooltip2clickTip.vue'
Vue.use(SmoothScrollbar)
export default {
  name: 'Member',
  components: {
    MemberLicense,
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
    }),
    ApplicationForFirearmsLicense: lazyLoadComponent({
      componentFactory: () => import('components/member/ApplicationForFirearmsLicense.vue'),
      loading: SkeletonBox
    }),
    Tooltip2clickTip: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickTip.vue'),
      loading: SkeletonBox
    }),
    Tooltip2clickToShow: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickToShow.vue'),
      loading: SkeletonBox
    }),
    Tooltip2clickTip
  },
  data () {
    return {
      tournament: {
        name: '',
        date: ''
      },
      rotateFun: 0,
      showCompetition: false,
      a5rotate: true,
      updateMemberCode: false,
      headerColorChange: false,
      headerColorChange1: false,
      headerColorChange2: false,
      temp: 0,
      mobile: App.mobile,
      main: App.main,
      shootingPlace: App.shootingPlace,
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
      patentNumber: null,
      patentNumber1: null,
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
      contributionCount: 0,
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
      declarationLOK: false,
      personalStatisticsObject: null,
      personalFiles: null,
      clubs: [],
      clubChoiceToggle: false,
      clubChoice: '',
      test: [],
      visible: true,
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
  setup () {
    const loading = ref([
      false
    ])
    const progress = ref(false)

    function simulateProgress (number) {
      loading.value[number] = true
      this.prolongContribution(this.memberUUID)
      setTimeout(() => {
        loading.value[number] = false
      }, 0)
    }
    return {
      loading,
      progress,
      simulateProgress
    }
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      let time = 500
      this.timer = setTimeout(() => {
        if (!this.visible) {
          this.$q.loading.hide()
          this.timer = 0
        } else {
          time = 500
        }
      }, time)
    },
    checkAge (pesel) {
      const s = pesel
      const aInt = []
      for (let i = 0; i < 11; i++) {
        aInt[i] = parseInt(s.substring(i, i + 1))
      }
      let year = 1900 + aInt[0] * 10 + aInt[1]
      if (aInt[2] >= 2 && aInt[2] < 8) { year += Math.floor(aInt[2] / 2) * 100 }
      if (aInt[2] >= 8) { year -= 100 }

      const month = (aInt[2] % 2) * 10 + aInt[3]
      const day = aInt[4] * 10 + aInt[5]

      const date = new Date(year, month - 1, day)
      const dateNow = new Date(Date.now())
      date.setFullYear(date.getFullYear() + 18)
      return dateNow.getTime() > date.getTime()
    },
    checkInternship (joinDate) {
      const date = new Date(joinDate)
      const dateNow = new Date(Date.now())
      date.setFullYear(date.getFullYear() + 1)
      return dateNow.getTime() > date.getTime()
    },
    showNotify () {
      setTimeout(() => {
        this.$q.notify({
          progress: true,
          message: 'Lorem Ipsum',
          color: 'primary'
        })
      }, 2000)
    },
    getMemberScores (competitionMemberListUUID) {
      fetch(`${this.local}/competitionMembersList/memberScores?competitionMemberListUUID=${competitionMemberListUUID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.showloading()
          this.test = response
          this.visible = false
        })
    },
    getMemberByLegitimationNumber (number) {
      fetch(`${this.local}/member/${number}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.showloading()
          this.member = response
          this.resetHelpers()
          // if (this.member !== null && this.member !== response) {
          // }
        })
    },
    resetHelpers () {
      this.getPersonalStatistics(this.member.uuid)
      this.getAllMemberFiles(this.member.uuid)
      this.helpers = this.helpersDefault
      this.visible = false
    },
    getPersonalStatistics (uuid) {
      fetch(`${this.local}/statistics/personal?uuid=${uuid}`, {
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
      fetch(`${this.local}/files/getAllMemberFiles?uuid=${uuid}`, {
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
      fetch(`${this.local}/contribution/history/${uuid}?date=${date.replace(/\//gi, '-')}&pinCode=${this.code}`, {
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
    getMemberByUUID (uuid) {
      fetch(`${this.local}/member/uuid/${uuid}`, {
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
      fetch(`${this.local}/contribution/edit?memberUUID=${this.memberUUID}&contributionUUID=${this.contributionUUID}&paymentDay=${this.editContributionPaymentDate.replace(/\//gi, '-')}&validThru=${this.editContributionValidThruDate.replace(/\//gi, '-')}&pinCode=${this.code}`, {
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
      fetch(`${this.local}/contribution/remove/${this.memberUUID}?contributionUUID=${this.contributionUUID}&pinCode=${this.code}`, {
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
      fetch(`${this.local}/contribution/${uuid}?pinCode=${this.code}&contributionCount=${this.contributionCount}`, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.contributionAlert = true
              this.contributionCount = 0
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.getContributionPDF()
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
        url: `${this.local}/files/downloadContribution/${this.memberUUID}?contributionUUID=${this.contributionUUID}&a5rotate=${this.a5rotate}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Składka ${this.name}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        if (this.shootingPlace === 'prod') {
          printJS(fileURL)
        }
      })
    },
    updateMember (uuid, email, phoneNumber, code) {
      const phone = String(phoneNumber)
      phone.replace('+48', '')
      const data = {
        email: email,
        phoneNumber: phone.replace('+48', '')
      }
      fetch(`${this.local}/member/${uuid}?pinCode=${code}`, {
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
    updateIDCardAndName (uuid, idCard, firstName, secondName, code) {
      const data = {
        idcard: idCard,
        firstName: firstName,
        secondName: secondName
      }
      fetch(`${this.local}/member/${uuid}?pinCode=${code}`, {
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
    updateAddress (uuid, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber, code) {
      const data = {
        zipCode: memberZipCode,
        postOfficeCity: memberPostOfficeCity,
        street: memberStreet,
        streetNumber: memberStreetNumber,
        flatNumber: memberFlatNumber
      }
      fetch(`${this.local}/address/${uuid}?pinCode=${code}`, {
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
              this.getMemberByUUID(uuid)
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
      fetch(`${this.local}/armory/calibers`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.calibers = response
        })
    },
    getListErasedType () {
      fetch(`${this.local}/member/erasedType`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.erasedTypes = response
        })
    },
    addMemberAndAmmoToCaliber () {
      fetch(`${this.local}/ammoEvidence/ammo?caliberUUID=${this.caliberUUID}&legitimationNumber=${this.legNumber}&counter=${this.quantity}&otherID=0`, {
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
            this.quantity = ''
            this.autoClose()
          })
        }
        if (response.status === 406) {
          this.failure = true
          this.quantity = ''
          this.autoClose()
        }
      })
    },
    addPatent (uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission, patentDate) {
      if (patentNumber.includes('null')) {
        patentNumber = null
      }
      if (patentDate === null) {
        this.message = 'Sprawdź poprawność daty'
        this.failure = true
        this.autoClose()
      }
      const data = {
        patentNumber: patentNumber,
        pistolPermission: patentPistolPermission,
        riflePermission: patentRiflePermission,
        shotgunPermission: patentShotgunPermission,
        dateOfPosting: patentDate.replace(this.dateVar, '-')
      }
      fetch(`${this.local}/patent/${uuid}`, {
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
      }).catch(() => {
        this.message = 'Sprawdź poprawność danych'
        this.failure = true
        this.autoClose()
      })
    },
    changeWeaponPermission (uuid, weaponPermissionNumber, isExist) {
      const data = {
        number: weaponPermissionNumber,
        exist: isExist
      }
      fetch(`${this.local}/weapon/weapon/${uuid}`, {
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
      fetch(`${this.local}/weapon/weapon/${uuid}`, {
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
      fetch(`${this.local}/weapon/weapon/${this.memberUUID}?admission=${this.admission}&permission=${this.permission}`, {
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
      fetch(`${this.local}/member/${uuid}?pinCode=${this.code}`, {
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
      fetch(`${this.local}/permissions/${uuid}?ordinal=${this.ordinal}`, {
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
      fetch(`${this.local}/permissions/arbiter/${uuid}`, {
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
      fetch(`${this.local}/member/erase/${uuid}?additionalDescription=${this.reason}&erasedDate=${this.erasedDate.replace(/\//gi, '-')}&erasedType=${this.erasedReasonType}&pinCode=${this.code}`, {
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
      fetch(`${this.local}/member/adult/${uuid}?pinCode=${this.code}`, {
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
    togglePzss (uuid, state) {
      fetch(`${this.local}/member/togglePzss/${uuid}?isSignedTo=${state}`, {
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
    toggleDeclarationLOK (uuid, state) {
      fetch(`${this.local}/member/toggleDeclaration/${uuid}?isSigned=${state}`, {
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
    changeClub (uuid, clubID) {
      fetch(`${this.local}/member/changeClub/${uuid}?clubID=${clubID}`, {
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
      fetch(`${this.local}/club/member`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubs = response
          // for (let i = 0; i < response.length; i++) {
          //   this.clubs.push(response[i])
          // }
        })
    },
    getFile (uuid, name) {
      axios({
        url: `${this.local}/files/getFile?uuid=${uuid}`,
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
      fetch(`${this.local}/barCode/`, {
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
      this.message = 'Nie można dodać pliku, sprawdź jego rozmiar i typ'
      this.autoClose()
    },
    autoClose () {
      this.visible = false
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
