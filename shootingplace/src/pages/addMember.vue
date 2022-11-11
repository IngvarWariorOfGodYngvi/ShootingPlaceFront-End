<template>
  <q-page padding>
    <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">DODAJ NOWEGO KLUBOWICZA</div>
        </q-item>
    </div>
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
      <q-item><q-input class="full-width" @input="memberFirstNameC = memberFirstName.length===0? '':memberFirstNameC = memberFirstName.length<3 ? 'red-2':'green-2'" dense :bg-color="memberFirstNameC" v-model="memberFirstName" label="Imię *" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled/></q-item>
      <q-item><q-input class="full-width" @input="memberSecondNameC = memberSecondName.length===0? '':memberSecondNameC = memberSecondName.length<3 ? 'red-2':'green-2'" dense :bg-color="memberSecondNameC" v-model="memberSecondName" label="Nazwisko *" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 45" filled/></q-item>
      <q-item><q-input class="full-width" @input="memberIDCardC = memberIDCard.length===0? '' : checkIDCard(memberIDCard)" dense :bg-color="memberIDCardC" v-model="memberIDCard" :suffix="memberIDCardS" label="Numer Dokumentu *" filled/></q-item>
      <q-item><q-input class="full-width" @input="memberPeselC = memberPesel.length===0? '' : checkPESEL(memberPesel)" dense :bg-color="memberPeselC" v-model="memberPesel" :suffix="memberPeselS" placeholder="tylko cyfry" label="Pesel *" mask="###########" filled /></q-item>
      <q-item><q-input class="full-width" @input="memberPhoneC = memberPhone.length===0? '' : memberPhone.length<11? 'red-2' : 'green-2' " dense :bg-color="memberPhoneC" type="tel" v-model="memberPhone" placeholder="tylko cyfry" prefix="+48 " label="Numer telefonu *" mask="### ### ###" filled onkeypress="return (event.charCode > 47 && event.charCode < 58)"/></q-item>
      <q-item><q-input class="full-width" @input="memberEmailC = memberEmail.length===0? '' : checkEmail(memberEmail)" :bg-color="memberEmailC" dense filled color="green" type="email" v-model="memberEmail" :suffix="memberEmailS" label="email"/></q-item>
      <q-item><q-input class="full-width" dense filled color="green" v-model="memberLegitimation" label="Numer Legitymacji" onkeypress="return (event.charCode > 47 && event.charCode < 58)"/></q-item>
      <q-item><q-input class="full-width" dense filled v-model="memberJoinDate" mask="####-##-##" label="Data dołączenia do Klubu" hint="użyj kalendarza">
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
        <q-radio  v-model="memberAdult" :val="true" label="Grupa Ogólna" color="secondary" />
        </div>
        <div class="col-6">
        <q-radio v-model="memberAdult" :val="false" label="Grupa Młodzieżowa" color="secondary" />
        </div>
      </div>
      </q-form>
      </div>
      </q-card-section>
      <q-card-section class="col-6">
      <div>
      <q-item><q-input class="full-width" dense filled v-model="memberPostOfficeCity" label="Miasto" /></q-item>
      <q-item><q-input class="full-width" dense filled v-model="memberZipCode" placeholder="00-000" label="Kod Pocztowy" mask="##-###" /></q-item>
      <q-item><q-input class="full-width" dense filled v-model="memberStreet" label="Ulica" /></q-item>
      <q-item><q-input class="full-width" dense filled v-model="memberStreetNumber" label="Numer Ulicy" /></q-item>
      <q-item><q-input class="full-width" dense filled v-model="memberFlatNumber" label="Numer Mieszkania"/></q-item>
      <!-- <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),updateAddress(uuid, memberPostOfficeCity, memberZipCode, memberStreet, memberStreetNumber, memberFlatNumber)"/></q-item> -->
    </div>
    <q-item class="reverse self-end"><q-btn label="Dodaj" color="secondary" @click="acceptCode=true"/></q-item>
      <!-- <div>
        <q-item>
          <q-field dense v-if="memberFirstName.length<3" class="full-width bg-red-2" standout label="Imię" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberFirstName}}</div>
            </template>
          </q-field>
          <q-field dense v-else class="full-width bg-green-2" standout label="Imię" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberFirstName}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field dense v-if="memberSecondName.length<3" class="full-width bg-red-2" standout label="Nazwisko" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberSecondName}}</div>
            </template>
          </q-field>
          <q-field dense v-else class="full-width bg-green-2" standout label="Nazwisko" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberSecondName}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field dense v-if="memberIDCard.length<10" class="full-width bg-red-2" standout label="Numer Dokumentu" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberIDCard}}</div>
            </template>
          </q-field>
          <q-field dense v-if="memberIDCard.length>=10 && !isIDCard" class="full-width bg-green-2" standout label="Numer Dokumentu" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberIDCard}}</div>
            </template>
          </q-field>
          <q-field dense v-if="memberIDCard.length>=10 && isIDCard" class="full-width bg-warning" standout label="Numer Dokumentu" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">TAKI DOWÓD ISTNIEJE JUŻ W BAZIE</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field dense v-if="!peselValue" class="full-width bg-red-2" standout label="Numer PESEL" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberPesel}}</div>
            </template>
          </q-field>
          <q-field dense v-if="peselValue&&!isPresent" class="full-width bg-green-2" standout label="Numer PESEL" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberPesel}}</div>
            </template>
          </q-field>
          <q-field dense v-if="peselValue&&isPresent" class="full-width bg-warning" standout label="Numer PESEL" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">TAKI PESEL ISTNIEJE JUŻ W BAZIE</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field dense v-if="memberPhone.length<11" prefix="+48 " class="full-width bg-red-2" standout label="Numer Telefonu" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberPhone}}</div>
            </template>
          </q-field>
          <q-field dense v-else prefix="+48 " class="full-width bg-green-2" standout label="Numer Telefonu" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberPhone}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field dense v-if="(!memberEmail.includes('@') || !memberEmail.includes('.')) " class="full-width bg-red-2" standout label="Adres E-mail" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberEmail}}</div>
            </template>
          </q-field>
          <q-field dense v-if="(memberEmail.includes('@') && memberEmail.includes('.')) && !isEmail" class="full-width bg-green-2" standout label="Adres E-mail" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberEmail}}</div>
            </template>
          </q-field>
          <q-field dense v-if="(memberEmail.includes('@') && memberEmail.includes('.')) && isEmail" class="full-width bg-warning" standout label="Adres E-mail" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">TAKI EMAIL ISTNIEJE JUŻ W BAZIE</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field dense v-if="memberLegitimation.length<1" class="full-width" standout label="Numer Legitymacji Klubowej" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberLegitimation}}</div>
            </template>
          </q-field>
          <q-field dense v-else class="full-width bg-green-2" standout label="Numer Legitymacji Klubowej" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberLegitimation}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field dense class="full-width" standout label="Data dołączenia do Klubu" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberJoinDate}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field dense class="full-width" standout label="Grupa" stack-label>
            <template v-slot:control>
              <div v-if="memberAdult&&memberIDCard!=null" class="self-center full-width no-outline" tabindex="1">Grupa Dorosła</div>
              <div v-if="!memberAdult&&memberIDCard!=null" class="self-center full-width no-outline" tabindex="1">Grupa Młodzieżowa</div>
            </template>
          </q-field>
        </q-item>
      </div> -->
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
      <q-item><q-input class="full-width" dense filled v-model="memberPostOfficeCity" label="Miasto" /></q-item>
      <q-item><q-input class="full-width" dense filled v-model="memberZipCode" placeholder="00-000" label="Kod Pocztowy" mask="##-###" /></q-item>
      <q-item><q-input class="full-width" dense filled v-model="memberStreet" label="Ulica" /></q-item>
      <q-item><q-input class="full-width" dense filled v-model="memberStreetNumber" label="Numer Ulicy" /></q-item>
      <q-item><q-input class="full-width" dense filled v-model="memberFlatNumber" label="Numer Mieszkania"/></q-item>
      <q-item><q-btn label="Dodaj" color="secondary" @click="showloading(),updateAddress(uuid, memberPostOfficeCity, memberZipCode, memberStreet, memberStreetNumber, memberFlatNumber)"/></q-item>
      </div>
      </q-card-section>
      <q-card-section class="col-6">
      <div>
        <q-item>
          <q-field class="full-width" dense standout label="Miasto" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberPostOfficeCity}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" dense standout label="Kod Pocztowy" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberZipCode}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" dense standout label="Ulica" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberStreet}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" dense standout label="Numer Ulicy" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{memberStreetNumber}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" dense standout label="Numer Mieszkania" stack-label>
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
      <q-item><q-input class="full-width" dense v-model="patentNumber" mask="#####/AAA/##/####" label="Numer Patentu" filled/></q-item>
      <q-item><q-input class="full-width" dense filled v-model="patentDate" mask="####-##-##" :rules="['date']" label="Data Wydania Patentu">
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
          <q-field class="full-width" dense standout label="Numer Patentu" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{patentNumber}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <q-field class="full-width" dense standout label="Data Nadania" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="1">{{patentDate}}</div>
            </template>
          </q-field>
        </q-item>
        <q-item>
          <div class="col">
              <q-field class="col" standout label="Dyscypliny" dense stack-label>
                <template v-slot:control>
                  <q-field v-if="patentPistolPermission" class="col" dense standout>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Pistolet</div>
                    </template>
                  </q-field>
                  <q-field v-if="patentRiflePermission" class="col" dense standout>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Karabin</div>
                    </template>
                  </q-field>
                  <q-field v-if="patentShotgunPermission" class="col" dense standout>
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
      <q-item><q-input class="full-width" dense v-model="licenseNumber" placeholder="tylko cyfry" label="Numer Licencji" filled/></q-item>
      <q-item><q-input class="full-width" dense filled v-model="licenseDate" mask="####-12-31" :rules="['date']" label="Ważna do" hint="użyj kalendarza">
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
              <q-field class="full-width" dense standout label="Numer Licencji" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="1">{{licenseNumber}}</div>
                </template>
              </q-field>
            </q-item>
            <q-item>
              <q-field class="full-width" dense standout label="Data Ważności" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="1">{{licenseDate}}</div>
                </template>
              </q-field>
            </q-item>
            <q-item>
              <q-field class="col" standout label="Dyscypliny" dense stack-label>
                <template v-slot:control>
                  <q-field v-if="(licensePistolPermission&&patentPistolPermission)||(!memberAdult&&licensePistolPermission)" class="col" dense standout>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Pistolet</div>
                    </template>
                  </q-field>
                  <q-field v-if="(licenseRiflePermission&&patentRiflePermission)||(!memberAdult&&licenseRiflePermission)" class="col" dense standout>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Karabin</div>
                    </template>
                  </q-field>
                  <q-field v-if="(licenseShotgunPermission&&patentShotgunPermission)||(!memberAdult&&licenseShotgunPermission)" class="col" dense standout>
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
            <q-item dense><q-item-label>Jeśli posiada pozwolenie na broń - wpisz numer</q-item-label></q-item>
            <q-item><q-input @keypress.enter="showloading(),changeWeaponPermission(uuid, weaponPermissionNumber)" dense class="full-width" v-model="weaponPermissionNumber" label="Numer" filled/></q-item>
            <q-item dense><q-btn label="Dodaj" color="secondary" @click="showloading(),changeWeaponPermission(uuid, weaponPermissionNumber)"/></q-item>
          </div>
          <div>
            <q-item dense><q-item-label>Jeśli posiada uprawnienia prowadzącego - wpisz numer</q-item-label></q-item>
            <q-item><q-input @keypress.enter="showloading(),updateMemberPermissions(uuid, permissionsShootingLeaderNumber),value=true" dense class="full-width" v-model="permissionsShootingLeaderNumber" label="Numer" filled/></q-item>
            <q-item dense><q-btn label="Dodaj" color="secondary" @click="showloading(),updateMemberPermissions(uuid, permissionsShootingLeaderNumber),value=true"/></q-item>
          </div>
          <div>
            <q-item dense><q-item-label>Jeśli posiada uprawnienia instruktora - wpisz numer</q-item-label></q-item>
            <q-item><q-input @keypress.enter="showloading(),updateMemberPermissions(uuid, permissionsInstructorNumber), value1=true" dense class="full-width" v-model="permissionsInstructorNumber" label="Numer" filled/></q-item>
            <q-item dense><q-btn label="Dodaj" color="secondary" @click="showloading(),updateMemberPermissions(uuid, permissionsInstructorNumber), value1=true"/></q-item>
          </div>
        </q-card-section>
        <q-card-section class="col-4">
        <div class="col">
          <q-item><q-item-label>Jeśli posiada Licencję Sędziego - uzupełnij dane</q-item-label></q-item>
          <q-item><q-input class="full-width" dense v-model="permissionsArbiterNumber" filled label="Numer uprawnień" /></q-item>
          <q-item><q-input class="full-width" dense filled v-model="permissionsArbiterPermissionValidThru" mask="####-12-31" :rules="['date']" label="Ważne do" hint="użyj kalendarza">
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
          <q-item dense><q-radio dense v-model="ordinal" :val="1" label="Klasa 3" color="secondary" /></q-item>
          <q-item dense><q-radio dense v-model="ordinal" :val="2" label="Klasa 2" color="secondary" /></q-item>
          <q-item dense><q-radio dense v-model="ordinal" :val="3" label="Klasa 1" color="secondary" /></q-item>
          <q-item dense><q-radio dense v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" /></q-item>
          <q-item dense><q-radio dense v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" /></q-item>
          <q-item dense><q-btn label="Dodaj" color="secondary" @click="showloading(),updateMemberPermissions(uuid, permissionsArbiterNumber,permissionsArbiterPermissionValidThru, ordinal), value2=true"/></q-item>
        </div>
      </q-card-section>
      </q-card>
      </q-step>

      <template v-slot:navigation  >
        <q-stepper-navigation class="flex flex">
          <q-item clickable v-if="(step<5&&(uuid!=null&&uuid!=''))" @click="alertResponse=null"><q-btn v-if="step<5" @click="$refs.stepper.next()" color="primary" :label="step === 5 ? 'Zakończ' : 'Przejdź Dalej'" /></q-item>
          <q-item><q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Wróć" /></q-item>
          <q-item><q-btn v-if="step > 1" @click="redirect()" color="primary" label="Zakończ" /></q-item>
          <q-item><q-btn v-if="step > 1 && (uuid!=null&&uuid!='')" type="a" href="https://portal.pzss.org.pl/CLub/Player" target="_blank" label="Przejdź do portalu PZSS" color="primary" @click="pzssPortal=true"/></q-item>
          <q-item><q-btn v-if="step > 1 && (uuid!=null&&uuid!='')" label="potwierdź zapis do portalu pzss" color="primary" @click="pzssPortal=true"/></q-item>
          <q-item><q-btn v-if="uuid!=null&&uuid!=''" color="secondary" @click="personalCardDownloadConfirm=true" label="Drukuj kartę" /></q-item>
          <q-item><q-btn v-if="uuid!=null&&uuid!=''" color="secondary" @click="contributionDownloadConfirm=true" label="Potwierdzenie opłacenia składki" /></q-item>
          <q-item><q-btn v-if="uuid!=null&&uuid!=''" color="secondary" @click="getCSVFile()" label="Pobierz plik .CSV" /></q-item>
          <q-item v-if="uuid!=null"><q-item-label>Identyfikator : {{uuid}}</q-item-label></q-item>
          <q-item v-if="alertResponse!=null" class="bg-red-3"><q-item-label>Ostrzeżenie : {{alertResponse}}</q-item-label></q-item>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
<q-dialog v-model="contributionDownloadConfirm" persistent @keypress.enter="contributionDownloadConfirm=false,getContributionPDF()">
      <q-card>
        <q-card-section class="row items-center">
          <span class="text-h6">Czy napewno chcesz pobrać potwierdzenie składki?</span>
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
          <span class="text-h6">Czy napewno chcesz pobrać kartę Klubowicza?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getPersonalCardPDF()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="memberAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-bold">Osoba została dodana do bazy klubu</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="licenseAndPatentAlert">
      <q-card>
        <q-card-section v-if="licenseNumber==null">
          <div class="text-h6">Uprawnienia patentu zostały nadane</div>
        </q-card-section>
        <q-card-section v-else>
          <div class="text-h6">Uprawnienia licencji zostały nadane</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="weaponAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Pozwolenie na Broń</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="instructorAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Uprawnienia Instruktora</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="shootingLeaderAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Uprawnienia Prowadzącego Strzelanie</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="arbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Licencję Sędziego</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="contributionConfirmDownloadAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano potwierdzenie składki</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="personalCardDownloadAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano kartę Klubowicza</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="csvfile">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano plik .CSV</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="success">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">{{message}}</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="failure">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">{{message}}</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog v-model="pzssPortal" persistent @keypress.enter="changePzss (uuid),pzssPortal=false">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy Klubowicz został dodany do portalu?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="nie" color="primary" v-close-popup />
          <q-btn label="tak" color="primary" v-close-popup @click="changePzss (uuid)"/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="acceptCode" persistent @keypress.enter="addMember(memberLegitimation, memberFirstName,
      memberSecondName,
      memberIDCard,
      memberPesel,
      memberPhone,
      memberEmail,
      memberAdult),
      updateAddress(uuid, memberPostOfficeCity, memberZipCode, memberStreet, memberStreetNumber, memberFlatNumber),acceptCode=false">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Dodaj" color="black" v-close-popup @click="addMember(memberLegitimation, memberFirstName,
      memberSecondName,
      memberIDCard,
      memberPesel,
      memberPhone,
      memberEmail,
      memberAdult),
      updateAddress(uuid, memberPostOfficeCity, memberZipCode, memberStreet, memberStreetNumber, memberFlatNumber)" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="forbidden">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{message}}</div>
        </q-card-section>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="conflict">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">Wystąpił konflikt. Nie można wykonać żądania.</div>
        </q-card-section>
      </q-card>
</q-dialog>
  </q-page>
</template>

<script >

import Vue from 'vue'
import axios from 'axios'
import App from 'src/App.vue'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      peselValue: false,
      value: false,
      value1: false,
      value2: false,
      alert: false,
      pzss: false,
      csvfile: false,
      conflict: false,
      code: null,
      message: null,
      forbidden: false,
      acceptCode: false,
      alertResponse: null,
      instructorAlert: false,
      shootingLeaderAlert: false,
      arbiterAlert: false,
      success: false,
      failure: false,
      memberAlert: false,
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
      member: null,
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
      uuid: null,
      ordinal: '',
      dateVar: /\//gi,
      pzssPortal: false,
      isPresent: false,
      isIDCard: false,
      isEmail: false,
      local: App.host
    }
  },
  methods: {
    redirect () {
      window.location.href = 'http://localhost:8080/strzelnica/#/member'
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    addMember (memberLegitimation, memberFirstName, memberSecondName, memberIDCard, memberPesel, memberPhone, memberEmail, memberAdult) {
      const data = {
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
      fetch('http://' + this.local + '/member/?pinCode=' + this.code, {
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
              this.alertResponse = response
              if (response.message === '') {
                this.uuid = 'Uwaga! Nie można wysyłać pustego formularza'
              }
              this.failure = true
              this.autoClose()
            })
        }
        if (response.status === 406) {
          response.text().then(
            response => {
              this.code = null
              this.alertResponse = response
              if (response.message === '') {
                this.uuid = 'Uwaga! Nie można wysyłać pustego formularza'
              }
              this.failure = true
              this.autoClose()
            })
        }
        if (response.status === 201) {
          response.text().then(
            response => {
              this.uuid = response
              this.code = null
              this.alertResponse = null
              this.memberAdultConfirm = this.memberAdult
              this.memberAlert = true
              this.getMember(this.uuid)
              this.autoClose()
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
              this.conflict = true
              this.getMember(this.uuid)
              this.autoClose()
            }
          )
        }
        if (response.status === 403) {
          response.text().then(
            response => {
              this.message = response
              this.forbidden = true
              this.autoClose()
            })
        }
      })
    },
    updateAddress (uuid, memberPostOfficeCity, memberZipCode, memberStreet, memberStreetNumber, memberFlatNumber) {
      const data = {
        postOfficeCity: memberPostOfficeCity,
        zipCode: memberZipCode,
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
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.showloading()
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.failure = true
              this.message = response
              this.autoClose()
            })
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
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.patentNumberConfirm = true
              this.showloading()
              this.getMember(uuid)
              this.autoClose()
            })
        } else {
          response.json().then(
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
      fetch('http://' + this.local + '/license/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.autoClose()
            })
        } else {
          response.json().then(
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
      fetch('http://' + this.local + '/weapon/weapon/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.autoClose()
            })
        } else {
          response.json().then(
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
      fetch('http://' + this.local + '/member/pzss/' + uuid, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.getMembersNames()
              this.showloading()
              this.getMember(uuid)
              this.autoClose()
            }
          )
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    updateMemberPermissions (uuid, permissionsShootingLeaderNumber, permissionsInstructorNumber, permissionsArbiterNumber, permissionsArbiterPermissionValidThru) {
      const data = {
        shootingLeaderNumber: this.permissionsShootingLeaderNumber,
        instructorNumber: this.permissionsInstructorNumber,
        arbiterNumber: this.permissionsArbiterNumber,
        arbiterPermissionValidThru: this.permissionsArbiterPermissionValidThru.replace(/\//gi, '-')
      }
      fetch('http://' + this.local + '/permissions/' + uuid + '?ordinal=' + this.ordinal, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.showloading()
              this.getMember(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    getContributionPDF () {
      axios({
        url: 'http://' + this.local + '/files/downloadContribution/' + this.uuid + '?contributionUUID=null',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Składka_' + this.memberFirstName + '_' + this.memberSecondName + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.contributionConfirmDownloadAlert = true
        this.autoClose()
      })
    },
    getPersonalCardPDF () {
      axios({
        url: 'http://' + this.local + '/files/downloadPersonalCard/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Karta_Członkowska_' + this.memberFirstName + '_' + this.memberSecondName + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.personalCardDownloadAlert = true
        this.autoClose()
      })
    },
    getCSVFile () {
      axios({
        url: 'http://' + this.local + '/files/downloadCSVFile/' + this.uuid,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', this.memberFirstName + '_' + this.memberSecondName + '.csv')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.csvfile = true
        this.autoClose()
      })
    },
    getMember (uuid) {
      fetch('http://' + this.local + '/member/uuid/' + uuid, {
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
        await fetch('http://' + this.local + '/member/pesel?pesel=' + pesel, {
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
        await fetch('http://' + this.local + '/member/IDCard?IDCard=' + IDCard, {
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
      this.isPresentEmail(email).then(() => {
        const a = this.isEmail
        if (email.includes('@') && email.includes('.')) {
          color = a ? 'warning' : 'green-2'
          if (color === 'warning') {
            this.memberEmailS = 'TAKI EMAIL ISTNIEJE JUŻ W BAZIE'
          } else {
            this.memberEmailS = ''
          }
          this.memberEmailC = color
          return color
        } else {
          color = 'red-2'
          this.memberEmailC = color
          this.memberEmailS = ''
          return color
        }
      })
      return color
    },
    async isPresentEmail (email) {
      await fetch('http://' + this.local + '/member/email?email=' + email, {
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
    redirectToMemberList () {
      window.location.href = 'http://' + App.prod + 'member'
    },
    autoClose () {
      setTimeout(() => {
        this.memberAlert = false
        this.failure = false
        this.success = false
        this.licenseAndPatentAlert = false
        this.weaponAlert = false
        this.instructorAlert = false
        this.shootingLeaderAlert = false
        this.arbiterAlert = false
        this.contributionConfirmDownloadAlert = false
        this.personalCardDownloadAlert = false
        this.csvfile = false
        this.pzss = false
        this.forbidden = false
        this.conflict = false
        this.message = null
      }, 2000)
    }
  },
  name: 'addMember'
}
</script>
