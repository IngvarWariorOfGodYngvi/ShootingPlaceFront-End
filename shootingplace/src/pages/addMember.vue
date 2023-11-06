<template>
  <q-page v-if="!isMobile()" padding class="bg-dark text-positive">
    <div class="bg-dark">
      <q-stepper header-nav v-model="step" ref="stepper" active-color="secondary" class="bg-dark" animated>
        <q-step :name="1" title="Podstawowe dane" caption="Wymagane" icon="settings"
          :done="step > 1">
          <q-card class="row bg-dark text-positive">
            <q-card-section class="col-6">
              <div class="full-width">
                <q-item><q-input class="full-width"
                    @input="memberFirstNameC = memberFirstName.length === 0 ? '' : memberFirstNameC = memberFirstName.length < 3 ? 'red-2' : 'green-2'"
                    dense :bg-color="memberFirstNameC" label-color="positive" v-model="memberFirstName" label="Imię *"
                    onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 32"
                    filled /></q-item>
                <q-item><q-input class="full-width"
                    @input="memberSecondNameC = memberSecondName.length === 0 ? '' : memberSecondNameC = memberSecondName.length < 3 ? 'red-2' : 'green-2'"
                    dense :bg-color="memberSecondNameC" label-color="positive" v-model="memberSecondName"
                    label="Nazwisko *"
                    onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 45"
                    filled /></q-item>
                <q-item><q-input class="full-width"
                    @input="memberIDCardC = memberIDCard.length === 0 ? '' : checkIDCard(memberIDCard)" dense
                    :bg-color="memberIDCardC" v-model="memberIDCard" :suffix="memberIDCardS" label-color="positive"
                    label="Numer Dokumentu *" filled /></q-item>
                <q-item><q-input class="full-width"
                    @input="memberPeselC = memberPesel.length === 0 ? '' : checkPESEL(memberPesel)" dense
                    :bg-color="memberPeselC" v-model="memberPesel" :suffix="memberPeselS" label-color="positive"
                    placeholder="tylko cyfry" label="Pesel *" mask="###########" filled /></q-item>
                <q-item><q-input class="full-width"
                    @input="memberPhoneC = memberPhone.length === 0 ? '' : memberPhone.length < 11 ? 'red-2' : 'green-2'" dense
                    :bg-color="memberPhoneC" type="tel" v-model="memberPhone" label-color="positive"
                    placeholder="tylko cyfry" prefix="+48 " label="Numer telefonu *" mask="### ### ###" filled
                    onkeypress="return (event.charCode > 47 && event.charCode < 58)" /></q-item>
                <q-item><q-input class="full-width"
                    @input="memberEmailC = memberEmail.length === 0 ? '' : checkEmail(memberEmail)" :bg-color="memberEmailC"
                    dense filled type="email" v-model="memberEmail" label-color="positive" :suffix="memberEmailS"
                    label="e-mail *" /></q-item>
                <q-item><q-input class="full-width" dense filled color="green" v-model="memberLegitimation"
                    input-class="text-positive" label-color="positive" label="Numer Legitymacji"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58)" /></q-item>
                <q-item><q-input class="full-width" dense filled color="green" v-model="memberJoinDate"
                    input-class="text-positive" label-color="positive" mask="####-##-##" label="Data dołączenia do Klubu">
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
                      input-class="text-positive" v-model="memberPostOfficeCity" label="Miasto *" /></q-item>
                  <q-item><q-input class="full-width" dense filled color="primary" label-color="positive"
                      input-class="text-positive" v-model="memberZipCode" placeholder="00-000" label="Kod Pocztowy *"
                      mask="##-###" /></q-item>
                  <q-item><q-input class="full-width" dense filled color="primary" label-color="positive"
                      input-class="text-positive" v-model="memberStreet" label="Ulica *" /></q-item>
                  <q-item><q-input class="full-width" dense filled color="primary" label-color="positive"
                      input-class="text-positive" v-model="memberStreetNumber" label="Numer Ulicy *" /></q-item>
                  <q-item><q-input class="full-width" dense filled color="primary" label-color="positive"
                      input-class="text-positive" v-model="memberFlatNumber" label="Numer Mieszkania" /></q-item>
                  <q-item v-if="memberFirstName.length >= 3
                    && memberSecondName.length >= 3
                    && memberIDCard.length >= 3
                    && memberPesel.length === 11
                    && memberPhone.length === 11
                    && memberEmail.length >= 3
                    && memberPostOfficeCity != null
                    && memberZipCode != null
                    && memberStreet != null
                    && memberStreetNumber != null" class="reverse"><q-btn class="full-width text-bold" :loading="loading[0]"
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

        <q-step v-if="memberAdultConfirm && (uuid != null && uuid !== '' && !uuid.includes('Uwaga!'))" :name="2" title="Patent"
          caption="opcjonalnie" icon="assignment" :done="step > 2">
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
                <q-input class="full-width" dense filled v-model="patentDate" label-color="positive" input-class="text-positive" mask="####-##-##"
                    label="Data Wydania Patentu">
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
                <q-item><q-checkbox v-model="patentPistolPermission" keep-color class="self-center" label="Pistolet" dense /></q-item>
                <q-item><q-checkbox v-model="patentRiflePermission" keep-color class="self-center" label="Karabin" dense /></q-item>
                <q-item><q-checkbox v-model="patentShotgunPermission" keep-color class="self-center" label="Strzelba" dense /></q-item>
                <q-item><q-btn label="Dodaj" color="secondary"
                    @click="showloading(); addPatent(uuid, (patentNumber + '/PAT/' + patentNumber1), patentPistolPermission, patentRiflePermission, patentShotgunPermission, patentDate)" /></q-item>
              </div>
            </q-card-section>
            <q-card-section class="col-6">
              <div>
                <q-item>
                  <div class="full-width">
                    <label>Numer Patentu</label>
                    <div class="self-center">{{patentNumber}}/PAT/{{ patentNumber1 }}</div>
                  </div>
                </q-item>
                <q-item>
                  <div class="full-width">
                    <label>Data Nadania</label>
                    <div class="self-center">{{patentDate}}</div>
                  </div>
                </q-item>
                <q-item>
                  <div class="full-width">
                    <label>Dyscypliny</label>
                    <div class="row full-width">
                      <q-item v-if=" patentPistolPermission " dense class="self-center col-4" >Pistolet</q-item>
                      <q-item v-else dense class="self-center col-4" ></q-item>
                      <q-item v-if=" patentRiflePermission " dense class="self-center col-4" >Karabin</q-item>
                      <q-item v-else dense class="self-center col-4" ></q-item>
                      <q-item v-if=" patentShotgunPermission " dense class="self-center col-4" >Strzelba</q-item>
                      <q-item v-else dense class="self-center col-4" ></q-item>
                    </div>
                  </div>
                </q-item>
              </div>
            </q-card-section>
          </q-card>
        </q-step>

        <q-step
          v-if=" (!memberAdultConfirm || (memberAdultConfirm && patentNumberConfirm)) && (uuid != null && uuid !== '' && !uuid.includes('Uwaga!')) "
          :name=" 3 " title="Licencja Zawodnicza" caption="opcjonalnie" icon="assignment" :done=" step > 3 ">
          <!-- <q-card class="row" v-if=" (memberAdultConfirm && patentNumber != null) || !memberAdultConfirm "> -->
          <q-card class="row bg-dark">
            <q-card-section class="col-6">
              <div>
                <q-item><q-input class="full-width" label-color="positive" input-class="text-positive" dense v-model=" licenseNumber " placeholder="tylko cyfry" mask="########"
                    label="Numer Licencji" filled /></q-item>
                <q-item><q-input class="full-width" label-color="positive" input-class="text-positive" dense filled v-model=" licenseDate " mask="####-12-31"
                    label="Ważna do">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer" color="positive">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date v-model=" licenseDate " mask="YYYY-MM-DD" class="bg-dark text-positive">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Zamknij" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input></q-item>
                <q-item v-if=" patentPistolPermission || !memberAdultConfirm "><q-checkbox v-model=" licensePistolPermission "
                    label="Pistolet" /></q-item>
                <q-item v-if=" patentRiflePermission || !memberAdultConfirm "><q-checkbox v-model=" licenseRiflePermission "
                    label="Karabin" /></q-item>
                <q-item v-if=" patentShotgunPermission || !memberAdultConfirm "><q-checkbox v-model=" licenseShotgunPermission "
                    label="Strzelba" /></q-item>
                <q-item><q-btn label="Dodaj" color="secondary"
                    @click=" showloading(); addLicense(uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission, licenseDate) " /></q-item>
              </div>
            </q-card-section>
            <q-card-section class="col-6">
              <div>
                <q-item>
                  <div class="full-width" dense standout label-color="positive" label="Numer Licencji" stack-label>
                    <label>Numer Licencji</label>
                    <div class="self-center full-width text-positive" >{{licenseNumber}}</div>
                  </div>
                </q-item>
                <q-item>
                  <div class="full-width" dense standout label-color="positive" label="Numer Licencji" stack-label>
                    <label>Data Ważności</label>
                    <div class="self-center full-width text-positive" >{{licenseDate}}</div>
                  </div>
                </q-item>
                <q-item>
                  <div class="full-width">
                      <label>Dyscypliny</label>
                      <div class="row full-width">
                        <q-item v-if=" (licensePistolPermission && patentPistolPermission) || (!memberAdult && licensePistolPermission) " dense class="self-center col-4" >Pistolet</q-item>
                        <q-item v-else dense class="self-center col-4" ></q-item>
                        <q-item v-if=" (licenseRiflePermission && patentRiflePermission) || (!memberAdult && licenseRiflePermission) " dense class="self-center col-4" >Karabin</q-item>
                        <q-item v-else dense class="self-center col-4" ></q-item>
                        <q-item v-if=" (licenseShotgunPermission && patentShotgunPermission) || (!memberAdult && licenseShotgunPermission) " dense class="self-center col-4" >Strzelba</q-item>
                        <q-item v-else dense class="self-center col-4" ></q-item>
                      </div>
                    </div>
                </q-item>
              </div>
            </q-card-section>
          </q-card>
        </q-step>
        <q-step v-if=" memberAdultConfirm && (uuid != null && uuid !== '' && !uuid.includes('Uwaga!')) " :name=" 4 "
          title="Uprawnienia" caption="opcjonalnie" icon="assignment" :done=" step > 4 ">
          <q-card class="row bg-dark">
            <q-card-section class="col-4">
              <div>
                <q-item dense><q-item-label>Jeśli posiada pozwolenie na broń - wpisz numer</q-item-label></q-item>
                <q-item><q-input @keypress.enter=" showloading(); changeWeaponPermission(uuid, weaponPermissionNumber) "
                    dense class="full-width" v-model=" weaponPermissionNumber " input-class="positive" label-color="positive" label="Numer" filled /></q-item>
                <q-item dense><q-btn label="Dodaj" color="secondary"
                    @click=" showloading(); changeWeaponPermission(uuid, weaponPermissionNumber) " /></q-item>
              </div>
              <div>
                <q-item dense><q-item-label>Jeśli posiada uprawnienia prowadzącego - wpisz numer</q-item-label></q-item>
                <q-item><q-input
                    @keypress.enter=" showloading(); updateMemberPermissions(uuid, permissionsShootingLeaderNumber) " dense
                    class="full-width" v-model=" permissionsShootingLeaderNumber " input-class="positive" label-color="positive" label="Numer" filled /></q-item>
                <q-item dense><q-btn label="Dodaj" color="secondary"
                    @click=" showloading(); updateMemberPermissions(uuid, permissionsShootingLeaderNumber) " /></q-item>
              </div>
              <div>
                <q-item dense><q-item-label>Jeśli posiada uprawnienia instruktora - wpisz numer</q-item-label></q-item>
                <q-item><q-input
                    @keypress.enter=" showloading(); updateMemberPermissions(uuid, permissionsInstructorNumber) " dense
                    class="full-width" v-model=" permissionsInstructorNumber " input-class="positive" label-color="positive" label="Numer" filled /></q-item>
                <q-item dense><q-btn label="Dodaj" color="secondary"
                    @click=" showloading(); updateMemberPermissions(uuid, permissionsInstructorNumber) " /></q-item>
              </div>
            </q-card-section>
            <q-card-section class="col-4">
              <div class="col">
                <q-item><q-item-label>Jeśli posiada Licencję Sędziego Statycznego PZSS - uzupełnij dane</q-item-label></q-item>
                <q-item><q-input class="full-width" dense v-model=" permissionsArbiterNumber " filled
                    label="Numer uprawnień" input-class="positive" label-color="positive"/></q-item>
                <q-item><q-input class="full-width" dense filled v-model=" permissionsArbiterPermissionValidThru "
                    mask="####-12-31" label="Ważne do" input-class="positive" label-color="positive">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer" color="positive">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date v-model=" permissionsArbiterPermissionValidThru " mask="YYYY-MM-DD" class="bg-dark text-positive">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Zamknij" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input></q-item>
                <q-item dense><q-radio dense v-model=" ordinal " :val=" 1 " label="Klasa 3" color="secondary" /></q-item>
                <q-item dense><q-radio dense v-model=" ordinal " :val=" 2 " label="Klasa 2" color="secondary" /></q-item>
                <q-item dense><q-radio dense v-model=" ordinal " :val=" 3 " label="Klasa 1" color="secondary" /></q-item>
                <q-item dense><q-radio dense v-model=" ordinal " :val=" 4 " label="Klasa Państwowa"
                    color="secondary" /></q-item>
                <q-item dense><q-radio dense v-model=" ordinal " :val=" 5 " label="Klasa Międzynarodowa"
                    color="secondary" /></q-item>
                <q-item dense><q-btn label="Dodaj" color="secondary"
                    @click=" showloading(); updateMemberPermissions(uuid, permissionsArbiterNumber, permissionsArbiterPermissionValidThru, ordinal) " /></q-item>
              </div>
            </q-card-section>
          </q-card>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation class="flex bg-dark">
            <q-item clickable v-if=" (step < 5 && (uuid != null && uuid !== '')) " @click=" alertResponse = null ">
              <q-btn @click=" step < 4? $refs.stepper.next(): redirect()" color="primary"
                :label=" step === 4 ? 'Zakończ' : 'Przejdź Dalej' " /></q-item>
            <q-item><q-btn v-if=" step > 1 " flat color="primary" @click=" $refs.stepper.previous() " label="Wróć" /></q-item>
            <!-- <q-item><q-btn v-if=" step > 1 " @click=" redirect() " color="primary" label="Zakończ" /></q-item> -->
            <q-item><q-btn v-if=" uuid != null && uuid !== '' " type="a" href="https://portal.pzss.org.pl/CLub/Player"
                target="_blank" label="Przejdź do portalu PZSS" color="primary" @click=" pzssPortal = true "><q-avatar>
              <img src="~assets/logo-PZSS.png">
            </q-avatar></q-btn></q-item>
            <q-item><q-btn v-if=" uuid != null && uuid !== '' " label="potwierdź zapis do portalu pzss" color="primary"
                @click=" pzssPortal = true " /></q-item>
            <q-item>
              <PersonalCardPDF v-if=" uuid != null && uuid !== '' " :uuid=" uuid "
                :name=" memberE != null ? (memberE.firstName + ' ' + memberE.secondName) : '' " />
            </q-item>
            <q-item>
              <LastContributionPDF v-if=" uuid != null && uuid !== '' " :uuid=" uuid "
                :name=" memberE != null ? (memberE.firstName + ' ' + memberE.secondName) : '' " />
            </q-item>
            <q-item v-if="shootingPlace === 'prod'">
              <DeklaracjaLOK v-on:membershipDeclarationLOKPDF="declarationLOK=true"  v-if=" uuid != null && uuid !== '' " :uuid=" uuid "
                :name=" memberE != null ? (memberE.firstName + ' ' + memberE.secondName) : '' " />
            </q-item>
            <q-item>
              <CSVFile v-if=" uuid != null && uuid !== '' " :uuid=" uuid "
                :name=" memberE != null ? (memberE.firstName + ' ' + memberE.secondName) : '' " />
            </q-item>
            <q-item v-if=" uuid !== '' "><q-item-label>Identyfikator : {{uuid}}</q-item-label></q-item>
            <q-item v-if=" alertResponse != null " class="bg-red-3"><q-item-label>Ostrzeżenie :
                {{alertResponse}}</q-item-label></q-item>
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>
    <q-dialog v-model=" declarationLOK ">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy Klubowicz podpisał deklarację LOK?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="nie" color="secondary" v-close-popup @click=" toggleDeclarationLOK(uuid,false) " />
          <q-btn label="tak" color="primary" v-close-popup @click=" toggleDeclarationLOK(uuid,true) " />
          <q-btn label="anuluj" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model=" success ">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">{{message}}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model=" failure ">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6 text-center">{{message}}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" pzssPortal " persistent @keypress.enter=" changePzss(uuid); pzssPortal = false ">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row text-center text-h6">
          <span class="q-ml-sm">Czy Klubowicz został dodany do portalu?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn text-color="white" label="nie" color="primary" v-close-popup />
          <q-btn text-color="white" label="tak" color="primary" v-close-popup @click=" changePzss(uuid) " />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" acceptCode " persistent @keypress.enter="simulateProgress(0);acceptCode = false">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model=" code " filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn id="3" label="Dodaj" color="black" v-close-popup @click="simulateProgress(0)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
  <q-page v-else class="text-positive text-center q-pa-md">
    Nie można wyświetlić zawartości
  </q-page>
</template>

<script >

import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
import { ref } from 'vue'
export default {
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
    CSVFile: lazyLoadComponent({
      componentFactory: () => import('components/member/MemberCSVFile.vue'),
      loading: SkeletonBox
    })
  },
  setup () {
    const loading = ref([
      false
    ])
    const progress = ref(false)

    function simulateProgress (number) {
      loading.value[number] = true
      this.addMember(this.memberLegitimation,
        this.memberFirstName,
        this.memberSecondName,
        this.memberIDCard,
        this.memberPesel,
        this.memberPhone,
        this.memberEmail,
        this.memberAdult,
        this.memberPostOfficeCity,
        this.memberZipCode,
        this.memberStreet,
        this.memberStreetNumber,
        this.memberFlatNumber,
        this.returningToClub)
      setTimeout(() => {
        loading.value[number] = false
      }, 1500)
    }

    return {
      loading,
      progress,
      simulateProgress
    }
  },
  data () {
    return {
      backgroundDark: this.darkSet(),
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
      member: null,
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
      memberFirstName: '',
      memberFirstNameC: '',
      memberSecondName: '',
      memberSecondNameC: '',
      memberIDCard: '',
      memberIDCardC: '',
      memberIDCardS: '',
      memberPesel: '',
      memberPeselC: '',
      memberPeselS: '',
      memberPhone: '',
      memberPhoneC: '',
      memberEmail: '',
      memberEmailC: '',
      memberEmailS: '',
      memberAdult: true,
      memberAdultConfirm: false,
      memberLegitimation: '',
      memberJoinDate: '',
      memberZipCode: null,
      memberPostOfficeCity: null,
      memberStreet: null,
      memberStreetNumber: null,
      memberFlatNumber: null,
      memberE: null,
      active: true,
      uuid: '',
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
      window.location.href = 'http://192.168.1.101:8080/strzelnica/#/member'
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
    async addMember (memberLegitimation, memberFirstName, memberSecondName, memberIDCard, memberPesel, memberPhone, memberEmail, memberAdult, memberPostOfficeCity, memberZipCode, memberStreet, memberStreetNumber, memberFlatNumber, returningToClub) {
      const data = {
        member: {
          legitimationNumber: memberLegitimation,
          firstName: memberFirstName,
          secondName: memberSecondName,
          idcard: memberIDCard,
          pesel: memberPesel,
          email: memberEmail,
          phoneNumber: memberPhone,
          adult: memberAdult,
          joinDate: this.memberJoinDate.replace(/\//gi, '-')
        },
        address: {
          postOfficeCity: memberPostOfficeCity,
          zipCode: memberZipCode,
          street: memberStreet,
          streetNumber: memberStreetNumber,
          flatNumber: memberFlatNumber
        }
      }
      await fetch(`http://${this.local}/member/?returningToClub=${returningToClub}&pinCode=${this.code}`, {
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
              this.message = response
              this.failure = true
              this.autoClose()
              return response
            })
        }
      }).catch(() => {
        this.message = 'wystąpił błąd - nie można kontynuować'
        this.failure = true
        this.autoClose()
      })
    },
    toggleDeclarationLOK (uuid, state) {
      fetch(`http://${this.local}/member/toggleDeclaration/${uuid}?isSigned=${state}`, {
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
      fetch(`http://${this.local}/patent/${uuid}`, {
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
      fetch(`http://${this.local}/license/${uuid}`, {
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
      fetch(`http://${this.local}/weapon/weapon/${uuid}`, {
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
    changePzss (uuid) {
      fetch(`http://${this.local}/member/pzss/${uuid}`, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.showloading()
              this.success = true
              this.message = response
              this.getMember(uuid)
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
      fetch(`http://${this.local}/permissions/${uuid}?ordinal=${this.ordinal}`, {
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
      fetch(`http://${this.local}/member/uuid/${uuid}`, {
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
      let a, b
      let color = ''
      this.isValidPesel(pesel).then(() => {
        this.isPresentPesel(pesel).then(() => {
          a = this.peselValue
          b = this.isPresent
          if (a) {
            color = 'green-2'
            this.memberPeselS = ''
            if (b) {
              this.memberPeselS = 'TAKI PESEL ISTNIEJE JUŻ W BAZIE'
              color = 'warning'
            }
          } else {
            this.memberPeselS = ''
            color = 'red-2'
          }
          this.memberPeselC = color
        })
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
        return this.peselValue
      }
    },
    async isPresentPesel (pesel) {
      if (pesel.length === 11 && this.peselValue) {
        await fetch(`http://${this.local}/member/pesel?pesel=${pesel}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(response => {
            this.isPresent = response
            return response
          })
      } else { return this.isPresent }
    },
    checkIDCard (number) {
      let color = ''
      this.isPresentIDCard(number).then(() => {
        const b = this.isIDCard
        if (number.length > 9) {
          if (b) {
            color = 'warning'
          } else { color = 'green-2' }
          if (color === 'warning') {
            this.memberIDCardS = 'TAKI NUMER JUŻ ISTNIEJE W BAZIE'
          } else { this.memberIDCardS = '' }
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
        await fetch(`http://${this.local}/member/IDCard?IDCard=${IDCard}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(response => {
            this.isIDCard = response
            return response
          })
      } else {
        return false
      }
    },
    checkEmail (email) {
      let color = ''
      const z = email.includes('@')
      const x = email.includes('.com') || email.includes('.pl') || email.includes('.eu') || email.includes('.ua')
      if (z && x) {
        this.isPresentEmail(email).then(() => {
          const a = this.isEmail
          color = a ? 'warning' : 'green-2'
          if (a) {
            this.memberEmailS = 'TAKI EMAIL ISTNIEJE JUŻ W BAZIE'
          } else {
            this.memberEmailS = ''
          }
          this.memberEmailC = color
          return color
        })
      } else {
        this.memberEmailS = ''
        color = 'red-2'
      }
      this.memberEmailC = color
      return color
    },
    async isPresentEmail (email) {
      await fetch(`http://${this.local}/member/email?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.isEmail = response
          return response
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
