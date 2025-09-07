<template>
  <q-page>
    <q-stepper header-nav v-model="step" ref="stepper" active-color="primary" class="bg-dark" animated>
      <q-step :name="1" title="Podstawowe dane" caption="Wymagane" icon="settings" :done="step > 1">
        <q-card class="row bg-dark text-positive">
          <q-card-section class="col-6">
            <div class="full-width">
              <q-item><q-input class="full-width" :input-class="member.firstName.length == 0 ? 'text-positive' : ''"
                  @input="memberFirstNameC = member.firstName.length === 0 ? '' : memberFirstNameC = member.firstName.length < 3 ? 'red-2' : 'green-2'"
                  dense :bg-color="memberFirstNameC" :label-color="member.firstName.length == 0 ? 'positive' : 'black'"
                  v-model="member.firstName" label="Imię *"
                  onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 32"
                  filled /></q-item>
              <q-item><q-input class="full-width" :input-class="member.secondName.length == 0 ? 'text-positive' : ''"
                  @input="memberSecondNameC = member.secondName.length === 0 ? '' : memberSecondNameC = member.secondName.length < 3 ? 'red-2' : 'green-2'"
                  dense :bg-color="memberSecondNameC" :label-color="member.secondName.length == 0 ? 'positive' : 'black'"
                  v-model="member.secondName" label="Nazwisko *"
                  onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 45"
                  filled /></q-item>
              <q-item><q-input class="full-width" :input-class="member.IDCard.length == 0 ? 'text-positive' : ''"
                  @input="memberIDCardC = member.IDCard.length === 0 ? '' : checkIDCard(member.IDCard)" dense
                  :bg-color="memberIDCardC" v-model="member.IDCard" :suffix="memberIDCardS"
                  :label-color="member.IDCard.length == 0 ? 'positive' : 'black'" label="Numer Dokumentu *"
                  filled /></q-item>
              <q-item><q-input class="full-width" :input-class="member.pesel.length == 0 ? 'text-positive' : ''"
                  @input="memberPeselC = member.pesel.length === 0 ? '' : checkPESEL(member.pesel)" dense
                  :bg-color="memberPeselC" v-model="member.pesel" :suffix="memberPeselS"
                  :label-color="member.pesel.length == 0 ? 'positive' : 'black'" placeholder="tylko cyfry" label="Pesel *"
                  mask="###########" filled /></q-item>
              <q-item><q-input class="full-width" :input-class="member.phone.length == 0 ? 'text-positive' : ''"
                  @input="memberPhoneC = member.phone.length === 0 ? '' : member.phone.length < 11 ? 'red-2' : 'green-2'"
                  dense :bg-color="memberPhoneC" type="tel" v-model="member.phone"
                  :label-color="member.phone.length == 0 ? 'positive' : 'black'" placeholder="tylko cyfry" prefix="+48 "
                  label="Numer telefonu *" mask="### ### ###" filled
                  onkeypress="return (event.charCode > 47 && event.charCode < 58)" /></q-item>
              <q-item><q-input class="full-width" :input-class="member.email.length == 0 ? 'text-positive' : ''"
                  @input="memberEmailC = member.email.length === 0 ? '' : checkEmail(member.email)"
                  :bg-color="memberEmailC" dense filled type="email" v-model="member.email"
                  :label-color="member.email.length == 0 ? 'positive' : 'black'" :suffix="memberEmailS"
                  label="e-mail *" /></q-item>
              <div>
                <q-toggle dense v-model="selfSet" @input="memberLegitimation = ''; memberJoinDate=''"  label="ustaw ręcznie"></q-toggle>
                <q-item><q-input :disable="!selfSet" class="full-width" dense filled color="green" v-model="memberLegitimation"
                    :input-class="memberLegitimation.length == 0 ? '' : 'text-positive'" label-color="positive"
                    label="Numer Legitymacji"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58)" /></q-item>
                <q-item><q-input :disable="!selfSet" class="full-width" dense filled color="green" v-model="memberJoinDate"
                    :input-class="memberJoinDate.length == 0 ? '' : 'text-positive'" label-color="positive"
                    mask="####-##-##" label="Data dołączenia do Klubu">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer" color="positive">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date v-model="memberJoinDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Zamknij" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input></q-item>
              </div>
              <div class="row">
                <div class="col-6">
                  <q-radio v-model="memberAdult" :val="true" label="Grupa Ogólna" color="secondary" />
                </div>
                <div class="col-6">
                  <q-radio v-model="memberAdult" :val="false" label="Grupa Młodzieżowa" color="secondary" />
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="col">
            <div class="fit col">
              <div class="fit">
                <q-item><q-input class="full-width" dense filled color="primary" label-color="positive"
                    input-class="text-positive" v-model="address.postOfficeCity" label="Miasto *" /></q-item>
                <q-item><q-input class="full-width" dense filled color="primary" label-color="positive"
                    input-class="text-positive" v-model="address.zipCode" placeholder="00-000" label="Kod Pocztowy *"
                    mask="##-###" /></q-item>
                <q-item><q-input class="full-width" dense filled color="primary" label-color="positive"
                    input-class="text-positive" v-model="address.street" label="Ulica *" /></q-item>
                <q-item><q-input class="full-width" dense filled color="primary" label-color="positive"
                    input-class="text-positive" v-model="address.streetNumber" label="Numer Ulicy *" /></q-item>
                <q-item><q-input class="full-width" dense filled color="primary" label-color="positive"
                    input-class="text-positive" v-model="address.flatNumber" label="Numer Mieszkania" /></q-item>
                <q-item v-if="member.firstName.length >= 3
                  && member.secondName.length >= 3
                  && member.IDCard.length >= 3
                  && member.pesel.length === 11
                  && member.phone.length === 11
                  && member.email.length >= 3
                  && address.postOfficeCity != null
                  && address.zipCode != null
                  && address.street != null
                  && address.streetNumber != null" class="reverse">
                  <q-btn class="full-width text-bold" :loading="loading[0]"
                    style="font-weight: bold; font-size: medium; letter-spacing: 1em;" color="primary"
                    @click="acceptCode = true">dodaj do klubu</q-btn></q-item>
                <q-item v-else class="reverse"><q-btn class="full-width text-bold"
                    style="font-weight: bold; letter-spacing: 1em; font-size: medium;" color="secondary" disable>dodaj
                    do klubu</q-btn><q-tooltip content-class="bg-red text-subtitle2" anchor="top middle">Uzupełnij dane
                    z gwiazdką</q-tooltip></q-item>
                <q-checkbox v-if="isPresent" v-model="returningToClub" color="primary"
                  label="Przywróć do klubu"></q-checkbox>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-step>

      <q-step v-if="memberAdultConfirm && (uuid != null && uuid !== '' && !uuid.includes('Uwaga!'))" :name="2"
        title="Patent" caption="opcjonalnie" icon="assignment" :done="step > 2">
        <q-card class="row bg-dark">
          <q-card-section class="col-6">
            <div>
              <div class="row full-width">
                <q-input dense v-model="patentNumber" label-color="positive" input-class="text-positive" mask="#######"
                  label="Numer Patentu" class="col" filled />
                <div class="col-1 self-center text-possitive">/PAT/</div>
                <q-input dense v-model="patentNumber1" label-color="positive" input-class="text-positive" mask="##/####"
                  label="miesiąc i rok" class="col" filled />
              </div>
              <q-input class="full-width" dense filled v-model="patentDate" label-color="positive"
                input-class="text-positive" mask="####-##-##" label="Data Wydania Patentu">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer" color="positive">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="patentDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-item><q-checkbox v-model="patentPistolPermission" keep-color class="self-center" label="Pistolet"
                  dense /></q-item>
              <q-item><q-checkbox v-model="patentRiflePermission" keep-color class="self-center" label="Karabin"
                  dense /></q-item>
              <q-item><q-checkbox v-model="patentShotgunPermission" keep-color class="self-center" label="Strzelba"
                  dense /></q-item>
              <q-item><q-btn label="Dodaj" color="secondary"
                  @click="showloading(); addPatent(uuid, (patentNumber + '/PAT/' + patentNumber1), patentPistolPermission, patentRiflePermission, patentShotgunPermission, patentDate)" /></q-item>
            </div>
          </q-card-section>
          <q-card-section class="col-6">
            <div>
              <q-item>
                <div class="full-width">
                  <label>Numer Patentu</label>
                  <div class="self-center">{{ patentNumber }}/PAT/{{ patentNumber1 }}</div>
                </div>
              </q-item>
              <q-item>
                <div class="full-width">
                  <label>Data Nadania</label>
                  <div class="self-center">{{ patentDate }}</div>
                </div>
              </q-item>
              <q-item>
                <div class="full-width">
                  <label>Dyscypliny</label>
                  <div class="row full-width">
                    <q-item v-if="patentPistolPermission" dense class="self-center col-4">Pistolet</q-item>
                    <q-item v-else dense class="self-center col-4"></q-item>
                    <q-item v-if="patentRiflePermission" dense class="self-center col-4">Karabin</q-item>
                    <q-item v-else dense class="self-center col-4"></q-item>
                    <q-item v-if="patentShotgunPermission" dense class="self-center col-4">Strzelba</q-item>
                    <q-item v-else dense class="self-center col-4"></q-item>
                  </div>
                </div>
              </q-item>
            </div>
          </q-card-section>
        </q-card>
      </q-step>

      <q-step
        v-if="(!memberAdultConfirm || (memberAdultConfirm && patentNumberConfirm)) && (uuid != null && uuid !== '' && !uuid.includes('Uwaga!'))"
        :name="3" title="Licencja Zawodnicza" caption="opcjonalnie" icon="assignment" :done="step > 3">
        <!-- <q-card class="row" v-if=" (memberAdultConfirm && patentNumber != null) || !memberAdultConfirm "> -->
        <q-card class="row bg-dark">
          <q-card-section class="col-6">
            <div>
              <q-item><q-input class="full-width" label-color="positive"
                  :input-class="licenseNumber.length == 0 ? '' : 'text-positive'" dense v-model="licenseNumber"
                  placeholder="tylko cyfry" mask="########" label="Numer Licencji" filled /></q-item>
              <q-item><q-input class="full-width" label-color="positive"
                  :input-class="licenseDate.length == 0 ? '' : 'text-positive'" dense filled v-model="licenseDate"
                  mask="####-12-31" label="Ważna do">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" color="positive">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="licenseDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Zamknij" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input></q-item>
              <q-item v-if="patentPistolPermission || !memberAdultConfirm"><q-checkbox
                  v-model="licensePistolPermission" label="Pistolet" /></q-item>
              <q-item v-if="patentRiflePermission || !memberAdultConfirm"><q-checkbox
                  v-model="licenseRiflePermission" label="Karabin" /></q-item>
              <q-item v-if="patentShotgunPermission || !memberAdultConfirm"><q-checkbox
                  v-model="licenseShotgunPermission" label="Strzelba" /></q-item>
              <q-item><q-btn label="Dodaj" color="secondary"
                  @click=" showloading(); addLicense(uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission, licenseDate)" /></q-item>
            </div>
          </q-card-section>
          <q-card-section class="col-6">
            <div>
              <q-item>
                <div class="full-width" dense standout label-color="positive" label="Numer Licencji" stack-label>
                  <label>Numer Licencji</label>
                  <div class="self-center full-width text-positive">{{ licenseNumber }}</div>
                </div>
              </q-item>
              <q-item>
                <div class="full-width" dense standout label-color="positive" label="Numer Licencji" stack-label>
                  <label>Data Ważności</label>
                  <div class="self-center full-width text-positive">{{ licenseDate }}</div>
                </div>
              </q-item>
              <q-item>
                <div class="full-width">
                  <label>Dyscypliny</label>
                  <div class="row full-width">
                    <q-item
                      v-if="(licensePistolPermission && patentPistolPermission) || (!memberAdult && licensePistolPermission)"
                      dense class="self-center col-4">Pistolet</q-item>
                    <q-item v-else dense class="self-center col-4"></q-item>
                    <q-item
                      v-if="(licenseRiflePermission && patentRiflePermission) || (!memberAdult && licenseRiflePermission)"
                      dense class="self-center col-4">Karabin</q-item>
                    <q-item v-else dense class="self-center col-4"></q-item>
                    <q-item
                      v-if="(licenseShotgunPermission && patentShotgunPermission) || (!memberAdult && licenseShotgunPermission)"
                      dense class="self-center col-4">Strzelba</q-item>
                    <q-item v-else dense class="self-center col-4"></q-item>
                  </div>
                </div>
              </q-item>
            </div>
          </q-card-section>
        </q-card>
      </q-step>
      <q-step v-if="memberAdultConfirm && (uuid != null && uuid !== '' && !uuid.includes('Uwaga!'))" :name="4"
        title="Uprawnienia" caption="opcjonalnie" icon="assignment" :done="step > 4">
        <q-card class="row bg-dark">
          <q-card-section class="col-4">
            <div>
              <q-item dense><q-item-label>Jeśli posiada pozwolenie na broń - wpisz numer</q-item-label></q-item>
              <q-item><q-input @keypress.enter=" showloading(); changeWeaponPermission(uuid, weaponPermissionNumber)"
                  dense class="full-width" v-model="weaponPermissionNumber" input-class="positive"
                  label-color="positive" label="Numer" filled /></q-item>
              <q-item dense><q-btn label="Dodaj" color="secondary"
                  @click=" showloading(); changeWeaponPermission(uuid, weaponPermissionNumber)" /></q-item>
            </div>
            <div>
              <q-item dense><q-item-label>Jeśli posiada uprawnienia prowadzącego - wpisz numer</q-item-label></q-item>
              <q-item><q-input
                  @keypress.enter=" showloading(); updateMemberPermissions(uuid, permissionsShootingLeaderNumber)"
                  dense class="full-width" v-model="permissionsShootingLeaderNumber" input-class="positive"
                  label-color="positive" label="Numer" filled /></q-item>
              <q-item dense><q-btn label="Dodaj" color="secondary"
                  @click=" showloading(); updateMemberPermissions(uuid, permissionsShootingLeaderNumber)" /></q-item>
            </div>
            <div>
              <q-item dense><q-item-label>Jeśli posiada uprawnienia instruktora - wpisz numer</q-item-label></q-item>
              <q-item><q-input
                  @keypress.enter=" showloading(); updateMemberPermissions(uuid, permissionsInstructorNumber)" dense
                  class="full-width" v-model="permissionsInstructorNumber" input-class="positive"
                  label-color="positive" label="Numer" filled /></q-item>
              <q-item dense><q-btn label="Dodaj" color="secondary"
                  @click=" showloading(); updateMemberPermissions(uuid, permissionsInstructorNumber)" /></q-item>
            </div>
          </q-card-section>
          <q-card-section class="col-4">
            <div class="col">
              <q-item><q-item-label>Jeśli posiada Licencję Sędziego Statycznego PZSS - uzupełnij
                  dane</q-item-label></q-item>
              <q-item><q-input class="full-width" dense v-model="permissionsArbiterNumber" filled
                  label="Numer uprawnień" input-class="positive" label-color="positive" /></q-item>
              <q-item><q-input class="full-width" dense filled v-model="permissionsArbiterPermissionValidThru"
                  mask="####-12-31" label="Ważne do" input-class="positive" label-color="positive">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" color="positive">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="permissionsArbiterPermissionValidThru" mask="YYYY-MM-DD"
                          class="bg-dark text-positive">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Zamknij" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input></q-item>
              <q-item dense><q-radio dense v-model="ordinal" :val="1" label="Klasa 3" color="secondary" /></q-item>
              <q-item dense><q-radio dense v-model="ordinal" :val="2" label="Klasa 2" color="secondary" /></q-item>
              <q-item dense><q-radio dense v-model="ordinal" :val="3" label="Klasa 1" color="secondary" /></q-item>
              <q-item dense><q-radio dense v-model="ordinal" :val="4" label="Klasa Państwowa"
                  color="secondary" /></q-item>
              <q-item dense><q-radio dense v-model="ordinal" :val="5" label="Klasa Międzynarodowa"
                  color="secondary" /></q-item>
              <q-item dense><q-btn label="Dodaj" color="secondary"
                  @click=" showloading(); updateMemberPermissions(uuid, permissionsArbiterNumber, permissionsArbiterPermissionValidThru, ordinal)" /></q-item>
            </div>
          </q-card-section>
        </q-card>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="flex bg-dark">
          <q-item clickable v-if="(step < 5 && (uuid != null && uuid !== ''))" @click=" alertResponse = null">
            <q-btn v-if="step < 4" @click="$refs.stepper.next()" color="primary" label="Przejdź Dalej" />
            <q-btn v-else @click="memberDial = true" color="primary" label="wyświetl profil" />
          </q-item>
          <q-item v-if="step > 1"><q-btn flat color="primary" @click=" $refs.stepper.previous()"
              label="Wróć" /></q-item>
          <!-- <q-item><q-btn v-if=" step > 1 " @click=" redirect() " color="primary" label="Zakończ" /></q-item> -->
          <q-item><q-btn v-if="uuid != null && uuid !== ''" type="a" href="https://portal.pzss.org.pl/CLub/Player"
              target="_blank" label="Przejdź do portalu PZSS" color="primary" @click=" pzssPortal = true"><q-avatar>
                <img src="~assets/logo-PZSS.png">
              </q-avatar></q-btn></q-item>
          <q-item><q-btn v-if="uuid != null && uuid !== ''" label="potwierdź zapis do portalu pzss" color="primary"
              @click=" pzssPortal = true" /></q-item>
          <q-item>
            <PersonalCardPDF v-if="uuid != null && uuid !== ''" :uuid="uuid"
              :name="memberE != null ? (memberE.firstName + ' ' + memberE.secondName) : ''" />
          </q-item>
          <q-item>
            <LastContributionPDF v-if="uuid != null && uuid !== ''" :uuid="uuid"
              :title="'Pobierz Potwierdzenie opłacenia składki'"
              :name="memberE != null ? (memberE.firstName + ' ' + memberE.secondName) : ''" />
          </q-item>
          <q-item v-if="shootingPlace === 'prod'">
            <DeklaracjaLOK v-on:membershipDeclarationLOKPDF="declarationLOK = true" v-if="uuid != null && uuid !== ''"
              :uuid="uuid" :name="memberE != null ? (memberE.firstName + ' ' + memberE.secondName) : ''" />
          </q-item>
          <q-item>
            <CSVFile v-if="uuid != null && uuid !== ''" :uuid="uuid"
              :name="memberE != null ? (memberE.firstName + ' ' + memberE.secondName) : ''" />
          </q-item>
          <q-item v-if="uuid !== ''"><q-item-label>Identyfikator : {{ uuid }}</q-item-label></q-item>
          <q-item v-if="alertResponse != null" class="bg-red-3"><q-item-label>Ostrzeżenie :
              {{ alertResponse }}</q-item-label></q-item>
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <q-dialog v-model="declarationLOK">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy Klubowicz podpisał deklarację LOK?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="nie" color="secondary" v-close-popup @click=" toggleDeclarationLOK(uuid, false)" />
          <q-btn label="tak" color="primary" v-close-popup @click=" toggleDeclarationLOK(uuid, true)" />
          <q-btn label="anuluj" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6 text-center">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="pzssPortal">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy Klubowicz został dodany do portalu?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="nie" color="secondary" v-close-popup @click=" togglePzss(uuid, false)" />
          <q-btn label="tak" color="primary" v-close-popup @click=" togglePzss(uuid, true)" />
          <q-btn label="anuluj" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCode" persistent @keypress.enter="simulateProgress(0); acceptCode = false">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn id="3" label="Dodaj" color="black" v-close-popup @click="simulateProgress(0)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card style="min-width: 80vw" class="bg-dark">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="memberLegitimation"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup @click="code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
import { ref } from 'vue'
export default {
  components: {
    PersonalCardPDF: lazyLoadComponent({
      componentFactory: () => import('src/components/member/DownloadPersonalCardPDF.vue'),
      loading: SkeletonBox
    }),
    DeklaracjaLOK: lazyLoadComponent({
      componentFactory: () => import('src/components/member/DownloadDeklaracjaLOK.vue'),
      loading: SkeletonBox
    }),
    LastContributionPDF: lazyLoadComponent({
      componentFactory: () => import('src/components/member/DownloadLastContributionPDF.vue'),
      loading: SkeletonBox
    }),
    CSVFile: lazyLoadComponent({
      componentFactory: () => import('components/member/MemberCSVFile.vue'),
      loading: SkeletonBox
    }),
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    })
  },
  setup () {
    const loading = ref([
      false
    ])

    function simulateProgress (number) {
      loading.value[number] = true
      this.addMember(this.memberLegitimation,
        this.member.firstName,
        this.member.secondName,
        this.member.IDCard,
        this.member.pesel,
        this.member.phone,
        this.member.email,
        this.memberAdult,
        this.address.postOfficeCity,
        this.address.zipCode,
        this.address.street,
        this.address.streetNumber,
        this.address.flatNumber,
        this.returningToClub)
      setTimeout(() => {
        loading.value[number] = false
      }, 1500)
    }

    return {
      loading,
      simulateProgress
    }
  },
  data () {
    return {
      backgroundDark: this.darkSet(),
      selfSet: false,
      returningToClub: false,
      peselValue: false,
      pzss: false,
      code: null,
      message: null,
      acceptCode: false,
      alertResponse: null,
      success: false,
      failure: false,
      declarationLOK: false,
      permissionsShootingLeaderNumber: null,
      permissionsInstructorNumber: null,
      permissionsArbiterNumber: null,
      permissionsArbiterPermissionValidThru: '',
      step: 1,
      number: '',
      validThru: '',
      patentNumber: null,
      patentNumber1: null,
      patentNumberConfirm: false,
      patentDate: '',
      patentPistolPermission: false,
      patentRiflePermission: false,
      patentShotgunPermission: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      licenseNumber: null,
      licenseDate: '',
      weaponPermissionNumber: '',
      isExist: true,
      uuid: '',
      member: {
        firstName: '',
        secondName: '',
        IDCard: '',
        pesel: '',
        phone: '',
        email: ''
      },
      address: {
        postOfficeCity: '',
        zipCode: '',
        street: '',
        streetNumber: '',
        flatNumber: ''
      },
      memberDial: false,
      memberFirstNameC: '',
      memberSecondNameC: '',
      memberIDCardC: '',
      memberIDCardS: '',
      memberPeselC: '',
      memberPeselS: '',
      memberPhoneC: '',
      memberEmailC: '',
      memberEmailS: '',
      memberAdult: true,
      memberAdultConfirm: false,
      memberLegitimation: '',
      memberJoinDate: '',
      memberE: null,
      active: true,
      ordinal: '',
      dateVar: /\//gi,
      pzssPortal: false,
      isPresent: false,
      isIDCard: false,
      isEmail: false,
      shootingPlace: App.shootingPlace,
      prod: App.prod,
      local: App.host
    }
  },
  methods: {
    redirect () {
      window.location.href = `${this.local}/strzelnica/#/member`
    },
    darkSet () {
      return JSON.parse(window.localStorage.getItem('BackgroundDark'))
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    async addMember (legitimation, firstName, memberSecondName, IDCard, pesel, phone, email, adult, postOfficeCity, zipCode, street, streetNumber, flatNumber, returningToClub) {
      const data = {
        member: {
          legitimationNumber: legitimation,
          firstName: firstName,
          secondName: memberSecondName,
          idcard: IDCard,
          pesel: pesel,
          phoneNumber: phone,
          email: email,
          adult: adult,
          joinDate: this.memberJoinDate.replace(/\//gi, '-')
        },
        address: {
          postOfficeCity: postOfficeCity,
          zipCode: zipCode,
          street: street,
          streetNumber: streetNumber,
          flatNumber: flatNumber
        }
      }
      await fetch(`${this.local}/member/?returningToClub=${returningToClub}&pinCode=${this.code}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 400) {
          response.text().then(
            response => {
              this.code = null
              this.message = response
              this.alertResponse = response
              if (response.message === '') {
                this.uuid = 'Uwaga! Nie można wysyłać pustego formularza'
              }
              this.failure = true
              this.autoClose()
              return response
            })
        }
        if (response.status === 406) {
          response.text().then(
            response => {
              this.code = null
              this.alertResponse = response
              this.message = response
              if (response.message === '') {
                this.uuid = 'Uwaga! Nie można wysyłać pustego formularza'
              }
              this.failure = true
              this.autoClose()
              return response
            })
        }
        if (response.status === 201) {
          response.text().then(
            response => {
              this.uuid = response
              this.code = null
              this.alertResponse = null
              this.memberAdultConfirm = this.memberAdult
              this.message = response
              this.success = true
              this.getMember(this.uuid)
              this.autoClose()
              return response
            }
          )
        }
        if (response.status === 409) {
          response.text().then(
            response => {
              this.uuid = response
              this.code = null
              this.alertResponse = null
              this.memberAdultConfirm = this.memberAdult
              this.failure = true
              this.getMember(this.uuid)
              this.autoClose()
              return response
            }
          )
        }
        if (response.status === 403) {
          response.text().then(
            response => {
              this.code = null
              this.message = response
              this.failure = true
              this.autoClose()
              return response
            })
        }
      }).catch(() => {
        this.code = null
        this.loading.value[0] = false
        this.message = 'wystąpił błąd - nie można kontynuować'
        this.failure = true
        this.autoClose()
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
    addPatent (uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission, patentDate) {
      if (patentNumber.includes('null')) {
        patentNumber = null
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
              this.patentNumberConfirm = true
              this.showloading()
              this.getMember(uuid)
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
    addLicense (uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission, licenseDate) {
      const data = {
        number: licenseNumber,
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission,
        validThru: licenseDate.replace(this.dateVar, '-')
      }
      fetch(`${this.local}/license/${uuid}`, {
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
              this.autoClose()
            })
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
              this.success = true
              this.message = response
              this.autoClose()
            })
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
    updateMemberPermissions (uuid) {
      const data = {
        shootingLeaderNumber: this.permissionsShootingLeaderNumber,
        instructorNumber: this.permissionsInstructorNumber,
        arbiterNumber: this.permissionsArbiterNumber,
        arbiterPermissionValidThru: this.permissionsArbiterPermissionValidThru.replace(/\//gi, '-')
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
              this.showloading()
              this.getMember(this.memberUUID)
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
    getMember (uuid) {
      fetch(`${this.local}/member/uuid/${uuid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.memberE = response
        }).then(() => {
          this.memberLegitimation = this.memberE.legitimationNumber
          this.memberJoinDate = this.memberE.joinDate
        })
    },
    checkPESEL (pesel) {
      let color = 'red-2'
      this.isValidPesel(pesel).then(() => {
        if (this.peselValue) {
          this.isPresentPesel(pesel).then(() => {
            const b = this.isPresent
            if (b) {
              color = 'warning'
              this.memberPeselS = 'TAKI NUMER JUŻ ISTNIEJE W BAZIE'
            } if (b === false) {
              color = 'green-2'
            } if (b === null) {
              color = 'warning'
              this.memberPeselS = 'BŁĄD POŁACZENIA Z BAZĄ'
            }
            this.memberPeselC = color
          })
        } else {
          this.memberPeselS = ''
          color = 'red-2'
        }
      })
      return color
    },
    async isValidPesel (pesel) {
      if (typeof pesel !== 'string' || pesel.length < 11) {
        this.peselValue = false
      } else {
        const weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]
        let sum = 0
        const controlNumber = parseInt(pesel.substring(10, 11))

        for (let i = 0; i < weight.length; i++) {
          sum += (parseInt(pesel.substring(i, i + 1)) * weight[i])
        }
        sum = sum % 10
        this.peselValue = (10 - sum) % 10 === controlNumber

        let year = 1900 + Number(pesel[0] * 10) + Number(pesel[1])
        if (pesel[2] >= 2 && pesel[2] < 8) { year += Math.floor(pesel[2] / 2) * 100 }
        if (pesel[2] >= 8) { year -= 100 }

        const month = Number((pesel[2] % 2) * 10) + Number(pesel[3])
        const day = Number(pesel[4] * 10 + pesel[5])

        const enteredAge = this.getAge(year, month - 1, day)
        console.log(enteredAge)
        if (enteredAge > 18) {
          this.memberAdult = true
        } else {
          this.memberAdult = false
        }
      }
      return this.peselValue
    },
    async isPresentPesel (pesel) {
      if (pesel.length === 11 && this.peselValue) {
        await fetch(`${this.local}/member/pesel?pesel=${pesel}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(response => {
            this.isPresent = response
          }).catch(() => {
            this.isPresent = null
          })
      }
    },
    getAge (year, month, day) {
      const today = new Date()
      const birthDate = new Date(year, month, day)
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    },
    checkIDCard (number) {
      let color = 'red-2'
      this.isPresentIDCard(number).then(() => {
        const b = this.isIDCard
        if (number.length > 9) {
          if (b) {
            color = 'warning'
            this.memberIDCardS = 'TAKI NUMER JUŻ ISTNIEJE W BAZIE'
          } if (b === false) {
            color = 'green-2'
          } if (b === null) {
            color = 'warning'
            this.memberIDCardS = 'BŁĄD POŁACZENIA Z BAZĄ'
          }
        } else {
          this.memberIDCardS = ''
          color = 'red-2'
        }
        this.memberIDCardC = color
      })
      return color
    },
    async isPresentIDCard (IDCard) {
      if (IDCard.length > 9) {
        await fetch(`${this.local}/member/IDCard?IDCard=${IDCard}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(response => {
            this.isIDCard = response
          }).catch(() => {
            this.isIDCard = null
          })
      }
    },
    checkEmail (email) {
      let color = 'red-2'
      const z = email.includes('@')
      const x = email.includes('.com') || email.includes('.pl') || email.includes('.eu') || email.includes('.ua')
      if (z && x) {
        this.isPresentEmail(email).then(() => {
          const b = this.isEmail
          if (b) {
            color = 'warning'
            this.memberEmailS = 'TAKI EMAIL ISTNIEJE JUŻ W BAZIE'
          }
          if (b === false) {
            color = 'green-2'
            this.memberEmailS = ''
          }
          if (b === null) {
            color = 'warning'
            this.memberEmailS = 'BŁĄD POŁACZENIA Z BAZĄ'
          }
          this.memberEmailC = color
        })
      } else {
        this.memberEmailS = ''
        color = 'red-2'
      }
      this.memberEmailC = color
      return color
    },
    async isPresentEmail (email) {
      await fetch(`${this.local}/member/email?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.isEmail = response
        }).catch(() => {
          this.isEmail = null
        })
    },
    isMobile () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.success = false
        this.pzss = false
        this.message = null
      }, 2000)
    }
  },
  name: 'addMember'
}
</script>
