<template>
  <q-page padding>
    <div>
    <q-stepper
      header-nav
      v-model="step"
      ref="stepper"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Podstawowe dane"
        caption="Wymagane"
        icon="settings"
        :done="step > 1"
      >
      <q-card class="row">
      <q-card-section class="col-6 bg-grey-2">
      <div class="full-width">
        <q-form>
      <q-item><q-input class="full-width" color="red" v-model="memberFirstName" label="Imię*" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled/></q-item>
      <q-item><q-input class="full-width" color="red" v-model="memberSecondName" label="Nazwisko*" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 45" filled/></q-item>
      <q-item><q-input class="full-width" color="red" v-model="memberIDCard" label="Numer Dowodu*" filled placeholder="XXX 000000" mask="AAA ######"/></q-item>
      <q-item><q-input class="full-width" color="red" v-model="memberPesel" placeholder="tylko cyfry" label="Pesel*" mask="###########" filled/></q-item>
      <q-item><q-input class="full-width" color="red" type="tel" v-model="memberPhone" placeholder="tylko cyfry" label="Numer telefonu*" mask="### ### ###" filled/></q-item>
      <q-item><q-input class="full-width" filled color="green" type="email" v-model="memberEmail" label="email" /></q-item>
      <q-item><q-input class="full-width" filled color="green" v-model="memberLegitimation" label="Numer Legitymacji" /></q-item>
      <q-item><q-input class="full-width" filled v-model="memberJoinDate" mask="####/##/##" :rules="['date']" label="Data dołączenia do Klubu" hint="użyj kalendarza">
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="memberJoinDate">
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
        <q-radio v-model="memberAdult" :val="false" label="Grupa Młodzieżowa" color="secondary" />
        </div>
        <div class="col-6">
        <q-radio  v-model="memberAdult" :val="true" label="Grupa Powszechna" color="secondary" />
        </div>
      </div>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),addMember(memberLegitimation, memberFirstName,
      memberSecondName,
      memberIDCard,
      memberPesel,
      memberPhone,
      memberEmail,
      memberAdult)"/></q-item>
      </q-form>
      </div>
      </q-card-section>
      <q-card-section class="col-6">
      <div>
        <q-item>
          <q-field v-if="memberFirstName==''" class="full-width bg-red-2" standout label="Imię" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberFirstName}}</div>
            </template>
          </q-field>
          <q-field v-else class="full-width bg-green-2" standout label="Imię" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberFirstName}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field v-if="memberSecondName==''" class="full-width bg-red-2" standout label="Nazwisko" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberSecondName}}</div>
            </template>
          </q-field>
          <q-field v-else class="full-width bg-green-2" standout label="Nazwisko" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberSecondName}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field v-if="memberIDCard==''" class="full-width bg-red-2" standout label="Numer Dowodu Osobistego" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberIDCard}}</div>
            </template>
          </q-field>
          <q-field v-else class="full-width bg-green-2" standout label="Numer Dowodu Osobistego" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberIDCard}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field v-if="memberPesel==''" class="full-width bg-red-2" standout label="Numer PESEL" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberPesel}}</div>
            </template>
          </q-field>
          <q-field v-else class="full-width bg-green-2" standout label="Numer PESEL" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberPesel}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field v-if="memberPhone==''" class="full-width bg-red-2" standout label="Numer Telefonu" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">+48 {{memberPhone}}</div>
            </template>
          </q-field>
          <q-field v-else class="full-width bg-green-2" standout label="Numer Telefonu" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">+48 {{memberPhone}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" standout label="Adres E-mail" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberEmail}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" standout label="Numer Legitymacji Klubowej" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberLegitimation}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" standout label="Data dołączenia do Klubu" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberJoinDate}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" standout label="Grupa" stack-label>
            <template v-slot:control>
              <div v-if="memberAdult&&memberIDCard!=null" class="self-center full-width no-outline" tabindex="1">Grupa Dorosła</div>
              <div v-if="!memberAdult&&memberIDCard!=null" class="self-center full-width no-outline" tabindex="1">Grupa Młodzieżowa</div>
            </template>
          </q-field>
        </q-item>
      </div>
      </q-card-section>
      </q-card>
      </q-step>

      <q-step v-if="uuid!=null&&uuid!='' && !uuid.includes('Uwaga!')"
        :name="2"
        title="Dane Adresowe"
        caption="Opcjonalnie"
        icon="create_new_folder"
        :done="step > 2"
      >
      <q-card class="row">
      <q-card-section class="col-6 bg-grey-2">
      <div>
      <q-item><q-input class="full-width" filled v-model="memberPostOfficeCity" label="Miasto" /></q-item>
      <q-item><q-input class="full-width" filled v-model="memberZipCode" placeholder="00-000" label="Kod Pocztowy" mask="##-###" /></q-item>
      <q-item><q-input class="full-width" filled v-model="memberStreet" label="Ulica" /></q-item>
      <q-item><q-input class="full-width" filled v-model="memberStreetNumber" label="Numer Ulicy" /></q-item>
      <q-item><q-input class="full-width" filled v-model="memberFlatNumber" label="Numer Mieszkania"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),updateAddress(uuid, memberPostOfficeCity, memberZipCode, memberStreet, memberStreetNumber, memberFlatNumber)"/></q-item>
      </div>
      </q-card-section>
      <q-card-section class="col-6">
      <div>
        <q-item>
          <q-field class="full-width" standout label="Miasto" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberPostOfficeCity}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" standout label="Kod Pocztowy" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberZipCode}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" standout label="Ulica" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberStreet}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" standout label="Numer Ulicy" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberStreetNumber}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" standout label="Numer Mieszkania" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberFlatNumber}}</div>
            </template>
          </q-field>
        </q-item>
      </div>
      </q-card-section>
      </q-card>
      </q-step>

      <q-step v-if="memberAdultConfirm && (uuid!=null&&uuid!='' && !uuid.includes('Uwaga!'))"
        :name="3"
        title="Patent"
        caption="opcjonalnie"
        icon="assignment"
        :done="step > 3"
      >
      <q-card class="row">
      <q-card-section class="col-6 bg-grey-2">
      <div>
      <q-item><q-input class="full-width" v-model="patentNumber" mask="#####/AAA/##/####" label="Numer Patentu" filled/></q-item>
      <q-item><q-input class="full-width" filled v-model="patentDate" mask="####/##/##" :rules="['date']" label="Data Wydania Patenty">
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
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),addPatent(uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission,patentDate)"/></q-item>
      </div>
      </q-card-section>
      <q-card-section class="col-6">
      <div>
        <q-item>
          <q-field class="full-width" standout label="Numer Patentu" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{patentNumber}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" standout label="Data Nadania" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{patentDate}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <div class="col">
              <q-field class="col" standout label="Dyscypliny" stack-label>
                <template v-slot:control>
                  <q-field v-if="patentPistolPermission" class="col" standout>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Pistolet</div>
                    </template>
                  </q-field>
                  <q-field v-if="patentRiflePermission" class="col" standout>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Karabin</div>
                    </template>
                  </q-field>
                  <q-field v-if="patentShotgunPermission" class="col" standout>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Strzelba</div>
                    </template>
                  </q-field>
                </template>
              </q-field>
            </div>
        </q-item>
      </div>
      </q-card-section>
      </q-card>
      </q-step>

      <q-step v-if="(!memberAdultConfirm || (memberAdultConfirm && patentNumberConfirm)) && (uuid!=null&&uuid!='' && !uuid.includes('Uwaga!'))"
        :name="4"
        title="Licencja Zawodnicza"
        caption="opcjonalnie"
        icon="assignment"
        :done="step > 4"
      >
      <q-card class="row" v-if="(memberAdultConfirm&&patentNumber!=null)||!memberAdultConfirm">
      <q-card-section class="bg-grey-2 col-6">
      <div>
      <q-item><q-input class="full-width" v-model="licenseNumber" placeholder="tylko cyfry" label="Numer Licencji" filled/></q-item>
      <q-item><q-input class="full-width" filled v-model="licenseDate" mask="####/12/31" :rules="['date']" label="Ważna do" hint="użyj kalendarza">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="licenseDate">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Zamknij" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input></q-item>
      <q-item v-if="patentPistolPermission||!memberAdultConfirm"><q-checkbox v-model="licensePistolPermission"  label="Pistolet"/></q-item>
      <q-item v-if="patentRiflePermission||!memberAdultConfirm"><q-checkbox  v-model="licenseRiflePermission"  label="Karabin"/></q-item>
      <q-item v-if="patentShotgunPermission||!memberAdultConfirm"><q-checkbox v-model="licenseShotgunPermission"  label="Strzelba"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),addLicense(uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission, licenseDate)"/></q-item>
      </div>
      </q-card-section>
      <q-card-section class="col-6">
      <div>
            <q-item>
              <q-field class="full-width" standout label="Numer Licencji" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="1">{{licenseNumber}}</div>
                </template>
              </q-field>
            </q-item>
            <q-item>
              <q-field class="full-width" standout label="Data Ważności" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="1">{{licenseDate}}</div>
                </template>
              </q-field>
            </q-item>
            <q-item>
              <q-field class="col" standout label="Dyscypliny" stack-label>
                <template v-slot:control>
                  <q-field v-if="(licensePistolPermission&&patentPistolPermission)||(!memberAdult&licensePistolPermission)" class="col" standout>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Pistolet</div>
                    </template>
                  </q-field>
                  <q-field v-if="(licenseRiflePermission&&patentRiflePermission)||(!memberAdult&licenseRiflePermission)" class="col" standout>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Karabin</div>
                    </template>
                  </q-field>
                  <q-field v-if="(licenseShotgunPermission&&patentShotgunPermission)||(!memberAdult&licenseShotgunPermission)" class="col" standout>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Strzelba</div>
                    </template>
                  </q-field>
                </template>
              </q-field>
            </q-item>
      </div>
      </q-card-section>
      </q-card>
      </q-step>
      <q-step v-if="memberAdultConfirm && (uuid!=null&&uuid!='' && !uuid.includes('Uwaga!'))"
        :name="5"
        title="Uprawnienia"
        caption="opcjonalnie"
        icon="assignment"
        :done="step > 6"
      >
      <q-card class="row">
        <q-card-section class="col-4 bg-grey-2">
          <div>
            <q-item><q-item-label>Jeśli posiada pozwolenie na broń - wpisz numer</q-item-label></q-item>
            <q-item><q-input class="full-width" v-model="weaponPermissionNumber" label="Numer" filled/></q-item>
            <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),changeWeaponPermission(uuid, weaponPermissionNumber)"/></q-item>
          </div>
          <div>
            <q-item><q-item-label>Jeśli posiada uprawnienia prowadzącego - wpisz numer</q-item-label></q-item>
            <q-item><q-input class="full-width" v-model="permissionsShootingLeaderNumber" label="Numer" filled/></q-item>
            <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),updateMemberPermissions(uuid, permissionsShootingLeaderNumber),value=true"/></q-item>
          </div>
          <div>
            <q-item><q-item-label>Jeśli posiada uprawnienia instruktora - wpisz numer</q-item-label></q-item>
            <q-item><q-input class="full-width" v-model="permissionsInstructorNumber" label="Numer" filled/></q-item>
            <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),updateMemberPermissions(uuid, permissionsInstructorNumber), value1=true"/></q-item>
          </div>
        </q-card-section>
        <q-card-section class="col-4">
        <div class="col">
          <q-item><q-item-label>Jeśli posiada Licencję Sędziego - uzupełnij dane</q-item-label></q-item>
          <q-item><q-input class="full-width" v-model="permissionsArbiterNumber" filled label="Numer uprawnień" /></q-item>
          <q-item><q-input class="full-width" filled v-model="permissionsArbiterPermissionValidThru" mask="####/12/31" :rules="['date']" label="Ważne do" hint="użyj kalendarza">
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
                            </q-input></q-item>
          <q-item><q-radio v-model="ordinal" :val="1" label="Klasa 3" color="secondary" /></q-item>
          <q-item><q-radio v-model="ordinal" :val="2" label="Klasa 2" color="secondary" /></q-item>
          <q-item><q-radio v-model="ordinal" :val="3" label="Klasa 1" color="secondary" /></q-item>
          <q-item><q-radio v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" /></q-item>
          <q-item><q-radio v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" /></q-item>
          <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),updateMemberPermissions(uuid, permissionsArbiterNumber,permissionsArbiterPermissionValidThru, ordinal), value2=true"/></q-item>
        </div>
      </q-card-section>
      </q-card>
      </q-step>

      <template v-slot:navigation  >
        <q-stepper-navigation class="flex flex">
          <q-item v-if="(step<6&&(uuid!=null&&uuid!='' && !uuid.includes('Uwaga!')))"><q-btn @click="$refs.stepper.next()" color="primary" :label="step === 5 ? 'Zakończ' : 'Przejdź Dalej'" /></q-item>
          <q-item><q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Wróć" /></q-item>
          <q-item><q-btn v-if="step > 1" @click="redirect()" color="primary" label="Zakończ" /></q-item>
          <q-item><q-btn v-if="uuid!=null&&uuid!='' && !uuid.includes('Uwaga!')" color="secondary" @click="personalCardDownloadConfirm=true" label="Drukuj kartę" /></q-item>
          <q-item><q-btn v-if="uuid!=null&&uuid!='' && !uuid.includes('Uwaga!')" color="secondary" @click="contributionDownloadConfirm=true" label="Potwierdzenie opłacenia składki" /></q-item>
          <q-item v-if="uuid!=null"><q-item-label>Identyfikator : {{uuid}}</q-item-label></q-item>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
<q-dialog v-model="contributionDownloadConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="text-h6">Czy napewno chcesz pobrać potwierdzenie składki?</span>
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
          <span class="text-h6">Czy napewno chcesz pobrać kartę Klubowicza?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getPersonalCardPDF(),personalCardDownloadAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="memberAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Witamy w Klubie</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Od tej chwili jesteś skazany na przenoszenie szaf z piętra na parter.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addressAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zaktualizowano Adres</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Już nie mieszkasz w kartonie po bananach.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="licenseAndPatentAlert">
      <q-card>
        <q-card-section v-if="licenseNumber==null">
          <div class="text-h6">Uprawnienia patentu zostały nadane</div>
        </q-card-section>
        <q-card-section v-else>
          <div class="text-h6">Uprawnienia licencji zostały nadane</div>
        </q-card-section>

        <q-card-section v-if="licenseNumber==null" class="q-pt-none">
          Od tej chwili już nie jesteś gołowąsem i coś już umiesz.
        </q-card-section>
        <q-card-section v-else class="q-pt-none">
          Pniesz się do góry w karierze małej mróweczki
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="weaponAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Pozwolenie na Broń</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Teraz nie strzaszny Ci już RAMBO, TERMINATOR czy JOHN WICK.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="instructorAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Uprawnienia Instruktora</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Możesz już szkolić ludzi takich jak RAMBO.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="shootingLeaderAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Uprawnienia Prowadzącego Strzelanie</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Możesz już nadzorować wszystkich podczas strzelania z armat.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="arbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Licencję Sędziego</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Od dzisiaj wystawiasz oceny takim goścom jak RAMBO.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
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
<q-dialog v-model="failAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Coś poszło nie tak</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Upewnij się, że wszystkie wymagane pola są uzupełnione a wszystkie dane są podane prawidłowo
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
  </q-page>
</template>

<script >

import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      value: false,
      value1: false,
      value2: false,
      instructorAlert: false,
      shootingLeaderAlert: false,
      arbiterAlert: false,
      failAlert: false,
      memberAlert: false,
      addressAlert: false,
      licenseAndPatentAlert: false,
      weaponAlert: false,
      permissionsShootingLeaderNumber: null,
      permissionsInstructorNumber: null,
      permissionsArbiterNumber: null,
      permissionsArbiterPermissionValidThru: '',
      contributionDownloadConfirm: false,
      contributionConfirmDownloadAlert: false,
      personalCardDownloadConfirm: false,
      personalCardDownloadAlert: false,
      step: 1,
      number: '',
      validThru: '',
      member: [],
      patentNumber: null,
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
      memberSecondName: '',
      memberIDCard: '',
      memberPesel: '',
      memberPhone: '',
      memberEmail: '',
      memberAdult: true,
      memberAdultConfirm: false,
      memberLegitimation: '',
      memberJoinDate: '',
      memberZipCode: null,
      memberPostOfficeCity: null,
      memberStreet: null,
      memberStreetNumber: null,
      memberFlatNumber: null,
      active: true,
      uuid: null,
      ordinal: '',
      dateVar: /\//gi
    }
  },
  methods: {
    redirect () {
      window.location.href = 'https://localhost:8080/strzelnica/#/member'
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    addMember (memberLegitimation, memberFirstName, memberSecondName, memberIDCard, memberPesel, memberPhone, memberEmail, memberAdult) {
      var data = {
        legitimationNumber: memberLegitimation,
        firstName: memberFirstName,
        secondName: memberSecondName,
        idcard: memberIDCard,
        pesel: memberPesel,
        email: memberEmail,
        phoneNumber: memberPhone,
        adult: memberAdult,
        joinDate: this.memberJoinDate.replace(/\//gi, '-')
      }
      fetch('http://localhost:8080/shootingplace-1.0/member/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 400) {
          response.json().then(
            response => {
              this.uuid = response
              if (response.message === '') {
                this.uuid = 'Uwaga! Nie można wysyłać pustego formularza'
              }
              this.failAlert = true
            })
        }
        if (response.status === 201) {
          response.json().then(
            response => {
              this.uuid = response
              this.memberAdultConfirm = this.memberAdult
              this.memberAlert = true
            }
          )
        }
      })
    },
    updateAddress (uuid, memberPostOfficeCity, memberZipCode, memberStreet, memberStreetNumber, memberFlatNumber) {
      var data = {
        postOfficeCity: memberPostOfficeCity,
        zipCode: memberZipCode,
        street: memberStreet,
        streetNumber: memberStreetNumber,
        flatNumber: memberFlatNumber
      }
      fetch('http://localhost:8080/shootingplace-1.0/address/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addressAlert = true
        } else { this.failAlert = true }
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
      fetch('http://localhost:8080/shootingplace-1.0/patent/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.patentNumberConfirm = true
          this.licenseAndPatentAlert = true
        } else { this.failAlert = true }
      })
    },
    addLicense (uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission, licenseDate) {
      var data = {
        number: licenseNumber,
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission,
        validThru: licenseDate.replace(this.dateVar, '-')
      }
      fetch('http://localhost:8080/shootingplace-1.0/license/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.licenseAndPatentAlert = true
        } else { this.failAlert = true }
      })
    },
    changeWeaponPermission (uuid, weaponPermissionNumber, isExist) {
      var data = {
        number: weaponPermissionNumber,
        exist: isExist
      }
      fetch('http://localhost:8080/shootingplace-1.0/member/weapon/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.weaponAlert = true
        } else { this.failure = true }
      })
    },
    updateMemberPermissions (uuid, permissionsShootingLeaderNumber, permissionsInstructorNumber, permissionsArbiterNumber, permissionsArbiterPermissionValidThru) {
      var data = {
        shootingLeaderNumber: this.permissionsShootingLeaderNumber,
        instructorNumber: this.permissionsInstructorNumber,
        arbiterNumber: this.permissionsArbiterNumber,
        arbiterPermissionValidThru: this.permissionsArbiterPermissionValidThru.replace(/\//gi, '-')
      }
      fetch('http://localhost:8080/shootingplace-1.0/permissions/' + uuid + '?ordinal=' + this.ordinal, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => {
        response.json()
        if (response.status === 200) {
          if (this.value) { this.shootingLeaderAlert = true }
          if (this.value1) { this.instructorAlert = true }
          if (this.value2) { this.arbiterAlert = true }
          this.value = false
          this.value1 = false
          this.value2 = false
        } else { this.failAlert = true }
      })
    },
    getContributionPDF () {
      axios({
        url: 'http://localhost:8080/shootingplace-1.0/files/downloadContribution/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Składka_' + this.memberFirstName + '_' + this.memberSecondName + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    getPersonalCardPDF () {
      axios({
        url: 'http://localhost:8080/shootingplace-1.0/files/downloadPersonalCard/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Karta_Członkowska_' + this.memberFirstName + '_' + this.memberSecondName + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    }
  },
  name: 'addMember'
}
</script>
