<template>
  <q-page padding>
  <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Lista Klubowiczów</div>
        </q-item>
      </div>
      <q-card class="row">
        <div class="col-4">
          <q-item>
            <q-select dense class="full-width" label-color="white" bg-color="primary" filled v-model="memberName" use-input hide-selected fill-input input-debounce="0" input-class="text-white" :options="options" @filter="filter" @input="allMember = false,getMemberByLegitimationNumber()" label="Nazwisko - Imię - nr Leg">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Brak wyników - sprawdź w nieaktywnych
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
          </q-item>
          <q-item>
            <div class="col-9 bg-grey-1"><q-input type="password" v-model="barcode" dense class="full-width" filled label="numer karty" @keypress.enter="findMemberByBarCode(),allMember = false,memberName=null"></q-input></div>
            <div class="col-3 text-grey"><q-btn class="text-black full-width full-height" label="wyszukaj" @click="findMemberByBarCode(),allMember = false,memberName=null"/></div>
          </q-item>
        </div>
        <div class=" col-8">
          <q-card class="bg-grey-3 q-pa-xs col">
            <div class="row">
            <q-checkbox dense @input="memberName=null, member=null,adult=null,active=null,erase=false,getMembersNames (),getAllMemberDTO()" v-model="allMember" label="Wyświetl wszystkich"></q-checkbox>
            <div class="col full-width">
              <div class="row flex flex-left full-width">
                <q-radio @input="member=null,allMember=false,getMembersNames (),rearangeMemberDTO ()" color="green" v-model="adult" :val="true" label="Grupa Ogólna"></q-radio>
                <q-radio @input="member=null,allMember=false,getMembersNames (),rearangeMemberDTO ()" color="warning" v-model="adult" :val="false" label="Grupa Młodzieżowa"></q-radio>
              </div>
              <div class="row flex flex-left full-width">
                <q-radio @input="member=null,allMember=false,erase=false, getMembersNames (),rearangeMemberDTO ()" color="green" v-model="active" :val="true" label="Aktywni"></q-radio>
                <q-radio @input="member=null,allMember=false,getMembersNames (),rearangeMemberDTO ()" color="warning" v-model="active" :val="false" label="Nieaktywni"></q-radio>
              </div>
            </div>
            </div>
            <div class="row">
            <q-checkbox dense @input="memberName=null, member=null,allMember=!erase,active = false, getMembersNames (),getAllMemberDTOWithArgs(),erasedType = erasedTypes[0]" color="red" v-model="erase" :val="false" label="Skreśleni"></q-checkbox>
            </div>
          </q-card>
          <q-card>
          <div class="row text-bold text-center text-caption">
            <q-item dense class="bg-accent">Ilość klubowiczów</q-item>
            <q-item dense v-if="allMember||allMember==null">Ogółem : {{quantities[0] + quantities[3]}} ({{quantities[0]}} + {{quantities[3]}})</q-item>
            <q-item dense v-if="allMember||allMember==null">Aktywni : {{quantities[10]+quantities[4]}} ({{quantities[10]}} + {{quantities[4]}})</q-item>
            <q-item dense v-if="allMember||allMember==null">Nieaktywni : {{quantities[11]+quantities[5]}} ({{quantities[11]}} + {{quantities[5]}})</q-item>
            <q-item dense v-if="(adult!=null&&adult)&&!erase">Gr. Ogólna ogółem : {{quantities[0]}}</q-item>
            <q-item dense v-if="(adult!=null&&adult)&&!erase">Aktywni : {{quantities[10]}}</q-item>
            <q-item dense v-if="(adult!=null&&adult)&&!erase">Nieaktywni : {{quantities[11]}}</q-item>
            <q-item dense v-if="(adult!=null&&!adult)&&!erase">Gr. Młodzieżowa ogółem : {{quantities[3]}}</q-item>
            <q-item dense v-if="(adult!=null&&!adult)&&!erase">Aktywni : {{quantities[4]}}</q-item>
            <q-item dense v-if="(adult!=null&&!adult)&&!erase">Nieaktywni : {{quantities[5]}}</q-item>
            <q-item dense v-if="erase">Skreśleni ogółem : {{quantities[6] + quantities[7]}}</q-item>
            <q-item dense v-if="adult&&erase">Skreśleni Gr. Ogólna : {{quantities[6]}}</q-item>
            <q-item dense v-if="!adult&&erase">Skreśleni Gr. Młodzieżowa : {{quantities[7]}}</q-item>
        </div>
          </q-card>
        </div>
      </q-card>
      <q-item></q-item>
      <div v-if="member!=null">
            <q-card v-if="member.active" bordered class="row bg-green-3">
          <q-card-section v-if="member.imageUUID!=null" avatar class="col-2">
            <div style="width:25vh;height:15vw">
              <q-tooltip v-if="(member.address.postOfficeCity===null||member.address.postOfficeCity==='')
                ||(member.address.street==null||member.address.street=='') || (member.weaponPermission.exist&&!member.license.valid) || (member.email==null||member.email=='') || (member.license.number!=null)&&(member.license.valid == false)" class="row" anchor="top middle" self="bottom middle" :offset="[12, 12]">
                <q-badge v-if="(member.address.postOfficeCity===null||member.address.postOfficeCity==='')
                ||(member.address.street==null||member.address.street=='')" transparent align="middle" color="orange" text-color="black">Brak Adresu</q-badge>
                <q-badge v-if="(member.weaponPermission.exist&&!member.license.valid)" transparent align="middle" color="red" text-color="black">Jest Broń i Brak Licencji</q-badge>
                <q-badge v-if="(member.email==null||member.email=='')" transparent align="middle" color="yellow" text-color="black">Brak E-mail</q-badge>
                <q-badge v-if="(member.license.number!=null)&&(member.license.valid == false)" transparent align="middle" color="yellow" text-color="black">Brak aktualnej licencji</q-badge>
              </q-tooltip>
            <q-avatar v-if="member.weaponPermission.exist&&!member.license.valid" class="full" square color="red" text-color="white"><q-img fit=none height="100%" width="100%" img-style="width:100%;height:100%" class="text-body1" alt="zdęcie profilowe" :src="('http://' + local + '/files/getFile?uuid=' + member.imageUUID)"/></q-avatar>
            <q-avatar v-else-if="member.license.number!=null&&!member.license.valid" class="full" square color="yellow" text-color="white"><q-img fit=none height="100%" width="100%" img-style="width:100%;height:100%" class="text-body1" alt="zdęcie profilowe" :src="('http://' + local + '/files/getFile?uuid=' + member.imageUUID)"/></q-avatar>
            <q-avatar v-else-if="(member.email==null||member.email=='')
            ||(member.address.postOfficeCity===null||member.address.postOfficeCity==='')
            ||(member.address.street==null||member.address.street=='')" class="full" square color="warning" text-color="white"><q-img fit=none height="100%" width="100%" img-style="width:100%;height:100%" class="text-body1" alt="zdęcie profilowe" :src="('http://' + local + '/files/getFile?uuid=' + member.imageUUID)"/></q-avatar>
            <q-avatar v-else-if="!member.active" class="full" square color="red" text-color="white"><q-img fit=none height="100%" width="100%" img-style="width:100%;height:100%" class="text-body1" alt="zdęcie profilowe" :src="('http://' + local + '/files/getFile?uuid=' + member.imageUUID)"/></q-avatar>
            <q-avatar v-else class="full" square >
              <q-img fit=none height="100%" width="100%" img-class="full" class="text-body1" alt="zdęcie profilowe" :src="('http://' + local + '/files/getFile?uuid=' + member.imageUUID)"/>
            </q-avatar>
            </div>
          </q-card-section>
          <q-card-section v-else avatar class="col-2">
            <q-uploader style="width:100%;heigth:100%" method="POST" :url="('http://' + local + '/files/member/' + member.uuid)"
    label="Dodaj zdjęcie / max 400KB" max-file-size="409600" accept=".jpg, image/*" @rejected="onRejected" field-name="file" @uploaded="getMemberByUUID(member.uuid)"/>
          </q-card-section>
          <q-card-section class="col-4">
          <q-item-label>{{member.secondName}} {{member.firstName}}</q-item-label>
          <q-item-label v-if="member.adult" caption lines="2">Grupa: Ogólna</q-item-label>
          <q-item-label v-if="!member.adult" caption lines="2">Grupa: Młodzieżowa</q-item-label>
          <q-item-label v-if="member.history.contributionList.length > 0" caption lines="2">Składka ważna do: {{convertDate(member.history.contributionList[0].validThru)}}</q-item-label>
          <q-item-label v-if="member.history.contributionList.length > 0" caption lines="2">Składka opłacona dnia: {{convertDate(member.history.contributionList[0].paymentDay)}}</q-item-label>
          <q-item-label v-if="member.active" caption lines="2">Status: Aktywny</q-item-label>
          <q-item-label v-if="!member.active" caption lines="2">Status: Nieaktywny</q-item-label>
          <div v-if="member.imageUUID!=null"><q-btn color="primary" label="zmień zdjęcie"><q-popup-edit v-model="picture"><q-uploader style="width:100%;heigth:100%" method="POST" :url="('http://' + local + '/files/member/' + member.uuid)"
    label="Dodaj zdjęcie / max 400KB" max-file-size="409600" accept=".jpg, image/*" @rejected="onRejected" field-name="file" @uploaded="getMemberByUUID(member.uuid)"/></q-popup-edit></q-btn></div>
          </q-card-section>
          <q-card-section class="col-3">
          <q-item-label :id="member.legitimationNumber">Numer Legitymacji: {{member.legitimationNumber}}</q-item-label>
          <q-item-label caption lines="2">Numer PESEL: {{member.pesel}}</q-item-label>
          <q-item-label caption lines="2">Data Zapisu: {{convertDate(member.joinDate)}}</q-item-label>
          </q-card-section>
          <q-card-section class="col-4">
            <div v-if="member.erased">
          <q-item-label>Podstawa skreślenia z listy Klubowiczów</q-item-label>
          <q-item-label caption lines="2">{{member.erasedEntity.erasedType}} {{member.erasedEntity.date}}</q-item-label>
          <q-item-label v-if="member.erasedEntity.additionalDescription!=null" caption lines="2">{{member.erasedEntity.additionalDescription}}</q-item-label>
            </div>
          </q-card-section>
            </q-card>
            <q-card v-if="!member.active" bordered class="row bg-red-3">
          <q-card-section v-if="member.imageUUID!=null" avatar class="col-2">
            <div style="width:25vh;height:15vw">
              <q-tooltip v-if="(member.address.postOfficeCity===null||member.address.postOfficeCity==='')
                ||(member.address.street==null||member.address.street=='') || (member.weaponPermission.exist&&!member.license.valid) || (member.email==null||member.email=='') || (member.license.number!=null)&&(member.license.valid == false)" class="row" anchor="top middle" self="bottom middle" :offset="[12, 12]">
                <q-badge v-if="(member.address.postOfficeCity===null||member.address.postOfficeCity==='')
                ||(member.address.street==null||member.address.street=='')" transparent align="middle" color="orange" text-color="black">Brak Adresu</q-badge>
                <q-badge v-if="(member.weaponPermission.exist&&!member.license.valid)" transparent align="middle" color="red" text-color="black">Jest Broń i Brak Licencji</q-badge>
                <q-badge v-if="(member.email==null||member.email=='')" transparent align="middle" color="yellow" text-color="black">Brak E-mail</q-badge>
                <q-badge v-if="(member.license.number!=null)&&(member.license.valid == false)" transparent align="middle" color="yellow" text-color="black">Brak aktualnej licencji</q-badge>
              </q-tooltip>
            <q-avatar v-if="member.weaponPermission.exist&&!member.license.valid" class="full" square color="red" text-color="white"><q-img fit=none height="100%" width="100%" img-style="width:100%;height:100%" class="text-body1" alt="zdęcie profilowe" :src="('http://' + local + '/files/getFile?uuid=' + member.imageUUID)"/></q-avatar>
            <q-avatar v-else-if="member.license.number!=null&&!member.license.valid" class="full" square color="yellow" text-color="white"><q-img fit=none height="100%" width="100%" img-style="width:100%;height:100%" class="text-body1" alt="zdęcie profilowe" :src="('http://' + local + '/files/getFile?uuid=' + member.imageUUID)"/></q-avatar>
            <q-avatar v-else-if="(member.email==null||member.email=='')
            ||(member.address.postOfficeCity===null||member.address.postOfficeCity==='')
            ||(member.address.street==null||member.address.street=='')" class="full" square color="warning" text-color="white"><q-img fit=none height="100%" width="100%" img-style="width:100%;height:100%" class="text-body1" alt="zdęcie profilowe" :src="('http://' + local + '/files/getFile?uuid=' + member.imageUUID)"/></q-avatar>
            <q-avatar v-else-if="!member.active" class="full" square color="red" text-color="white"><q-img fit=none height="100%" width="100%" img-style="width:100%;height:100%" class="text-body1" alt="zdęcie profilowe" :src="('http://' + local + '/files/getFile?uuid=' + member.imageUUID)"/></q-avatar>
            <q-avatar v-else class="full" square color="green" text-color="white"><q-img fit=none height="100%" width="100%" img-style="width:100%;height:100%" class="text-body1" alt="zdęcie profilowe" :src="('http://' + local + '/files/getFile?uuid=' + member.imageUUID)"/></q-avatar>
            </div>
          </q-card-section>
          <q-card-section v-else avatar class="col-2">
            <q-uploader style="width:100%;heigth:100%" method="POST" :url="('http://' + local + '/files/member/' + member.uuid)"
    label="Dodaj zdjęcie / max 400KB" max-file-size="409600" accept=".jpg, image/*" @rejected="onRejected" field-name="file" @uploaded="getMemberByUUID(member.uuid)"/>
          </q-card-section>
          <q-card-section class="col-4">
          <q-item-label>{{member.secondName}} {{member.firstName}}</q-item-label>
          <q-item-label v-if="member.history.contributionList.length > 0" caption lines="2">Składka ważna do: {{convertDate(member.history.contributionList[0].validThru)}}</q-item-label>
          <q-item-label v-if="member.history.contributionList.length > 0" caption lines="2">Składka opłacona dnia: {{convertDate(member.history.contributionList[0].paymentDay)}}</q-item-label>
          <q-item-label v-if="member.active" caption lines="2">Status: Aktywny</q-item-label>
          <q-item-label v-if="!member.active" caption lines="2">Status: Nieaktywny</q-item-label>
          <div v-if="member.imageUUID!=null"><q-btn color="primary" label="zmień zdjęcie"><q-popup-edit v-model="picture"><q-uploader style="width:100%;heigth:100%" method="POST" :url="('http://' + local + '/files/member/' + member.uuid)"
    label="Dodaj zdjęcie / max 400KB" max-file-size="409600" accept=".jpg, image/*" @rejected="onRejected" field-name="file" @uploaded="getMemberByUUID(member.uuid)"/></q-popup-edit></q-btn></div>
          </q-card-section>
          <q-card-section class="col-3">
          <q-item-label :id="member.legitimationNumber">Numer Legitymacji: {{member.legitimationNumber}}</q-item-label>
          <q-item-label caption lines="2">Numer PESEL: {{member.pesel}}</q-item-label>
          <q-item-label caption lines="2">Data Zapisu: {{convertDate(member.joinDate)}}</q-item-label>
          </q-card-section>
          <q-card-section class="col-4">
            <div v-if="member.erased">
          <q-item-label>Podstawa skreślenia z listy Klubowiczów</q-item-label>
          <q-item-label caption lines="2">{{member.erasedEntity.erasedType}} {{convertDate(member.erasedEntity.date)}}</q-item-label>
          <q-item-label v-if="member.erasedEntity.additionalDescription!=null" caption lines="2">{{member.erasedEntity.additionalDescription}}</q-item-label>
            </div>
          </q-card-section>
            </q-card>

        <q-card bordered class="row">
              <q-card-section class="col-3">
                  <q-field class="col" standout="bg-accent text-black" stack-label>
                      <div class="self-center col full-width no-outline text-center text-black" tabindex="0">Historia Składek</div>
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
                              <q-input filled v-model="historyContributionRecord" mask="####-##-##" label="Wybierz datę" hint="użyj kalendarza">
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
                  <q-expansion-item default-opened class="bg-grey-3 full-width q-pa-none text-center" label="Daty Składek">
                    <q-scroll-area class="full-width q-pa-none" style="height: 375px;">
                          <div v-for="(contributionList,uuid) in member.history.contributionList" :key="uuid" class="row">
                              <div class="row full-width" @dblclick="contributionUUID = contributionList.uuid,memberUUID = member.uuid,editContributionPaymentDate=contributionList.paymentDay,editContributionValidThruDate=contributionList.validThru,editContribution=true">
                              <q-field class="col-6" label="Opłacona dnia : " standout="bg-accent text-black" stack-label>
                                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{convertDate(contributionList.paymentDay)}}</div>
                              </q-field>
                              <div class="col-6">
                                <q-field class="col" standout="bg-accent text-black" label="Ważna do : " stack-label>
                                    <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{convertDate(contributionList.validThru)}}</div>
                                </q-field>
                              </div>
                              </div>
                          </div>
                    </q-scroll-area>
                  </q-expansion-item>
              </q-card-section>
              <q-card-section class="col-4 items-center">
              <q-item-section class="col" v-if="!member.license.number!=null||member.adult">
                <div v-if="member.shootingPatent.patentNumber!=null" class="col" clickable @dblclick="memberUUID = member.uuid,editLicenseNumber=member.license.number,editLicenseDate=member.license.validThru, editLicense=true">
                <q-field class="col" standout="bg-accent text-black" stack-label>
                    <div class="self-center col full-width no-outline text-center text-black" tabindex="0">Licencja</div>
                </q-field>
                </div>
                <div v-if="member.shootingPatent.patentNumber==null" @dblclick="memberUUID = member.uuid,editLicenseNumber=member.license.number,editLicenseDate=member.license.validThru, editLicense=true" class="col">
                <q-field class="col" standout="bg-accent text-black" stack-label>
                    <div class="self-center col full-width no-outline text-center text-black" tabindex="0">Licencja</div>
                    <q-tooltip v-if="member.adult" content-class="text-body2 text-center" self="top middle" anchor="top middle" :offset="[12, 12]">Klubowicz nie ma patentu<p>wprowadź patent aby móc dodać licencję</p></q-tooltip>
                </q-field>
                </div>
                <div>
                <div class="row">
                  <div class="col">
                    <q-field class="col" v-if="member.license.number!=null" label="Numer Licencji" standout="bg-accent text-black" stack-label>
                      <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{member.license.number}}</div>
                    </q-field>
                  </div>
                    <q-field  class="col" v-if="member.license.validThru!=null" label="Ważna do :" standout="bg-accent text-black" stack-label>
                      <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{convertDate(member.license.validThru)}}</div>
                    </q-field>
                </div>
                <div v-if="member.license.pistolPermission == true || member.license.riflePermission == true || member.license.shotgunPermission == true" class="row">
                  <q-field  label="Dyscypliny" class="col" standout="bg-accent text-black" stack-label>
                      <div v-if="member.license.pistolPermission" class="self-center text-center col-4 no-outline text-black" tabindex="0">Pistolet</div>
                      <div v-if="member.license.riflePermission" class="self-center text-center col-4 no-outline text-black" tabindex="0">Karabin</div>
                      <div v-if="member.license.shotgunPermission" class="self-center text-center col-4 no-outline text-black" tabindex="0">Strzelba</div>
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
                ||!member.license.shotgunPermission)" label="Aktualizuj Licencję" @click="memberUUID=member.uuid,
                patentPistolPermission1=member.shootingPatent.pistolPermission,
                patentRiflePermission1=member.shootingPatent.riflePermission,
                patentShotgunPermission1=member.shootingPatent.shotgunPermission,
                licensePistolPermission1=member.license.pistolPermission,
                licenseRiflePermission1=member.license.riflePermission,
                licenseShotgunPermission1=member.license.shotgunPermission,
                memberAdultConfirm=member.adult,
                updateLicenseConfirm=true"></q-btn>
                <div v-if="(member.license.number!=null&&(member.license.pistolPermission||member.license.riflePermission||member.license.shotgunPermission))&&member.license.paid==true">
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
                <q-btn v-if="(((member.shootingPatent.patentNumber!=null&&member.license.paid==false))) " class="full-width" label="opłać licencję" @click="memberUUID=member.uuid,licensePayment=true"></q-btn>
              <q-expansion-item default-opened class="bg-grey-3 text-center" v-if="member.history.licensePaymentHistory.length>0" label="Daty Opłacenia Licencji">
                    <q-scroll-area class="full-width q-pa-none" style="height: 375px;">
                          <div v-for="(licensePayment,uuid) in member.history.licensePaymentHistory" :key="uuid" class="row">
                              <div dense v-if="licensePayment.new" class="full-width bg-warning">
                                  <q-field dense standout="bg-accent text-black" stack-label>
                                    <div class="self-center col full-width no-outline text-center text-black" tabindex="1">Licencja Nowa</div>
                                  </q-field>
                              <div class="row full-width">
                                <div class="col-5" @dblclick="memberUUID=member.uuid,paymentUUID = licensePayment.uuid,editLicensePaymentDate = licensePayment.date,editLicensePaymentYear = licensePayment.validForYear,editLicensePayment=true">
                                  <q-field label="Opłacona dnia : " standout="bg-accent text-black" stack-label>
                                      <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{convertDate(licensePayment.date)}}</div>
                                  </q-field>
                                </div>
                                <div class="col-4"  @dblclick="memberUUID=member.uuid,paymentUUID = licensePayment.uuid,editLicensePaymentDate = licensePayment.date,editLicensePaymentYear = licensePayment.validForYear,editLicensePayment=true">
                                  <q-field standout="bg-accent text-black" label="Na rok : " stack-label>
                                      <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{licensePayment.validForYear}}</div>
                                  </q-field>
                                </div>
                                <div class="col-3" @dblclick="memberUUID=member.uuid,paymentUUID = licensePayment.uuid,togglePaymentAlert = true">
                                  <q-field v-if="licensePayment.payInPZSSPortal" standout="bg-accent text-black" label="PZSS : " stack-label>
                                      <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Tak</div>
                                  </q-field>
                                  <q-field v-if="!licensePayment.payInPZSSPortal" class="bg-red-3" standout="bg-accent text-black" label="PZSS : " stack-label>
                                      <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Nie</div>
                                  </q-field>
                                </div>
                              </div>
                              </div>
                              <div v-if="!licensePayment.new" class="row full-width">
                                <div class="col-5" @dblclick="memberUUID=member.uuid,paymentUUID = licensePayment.uuid,editLicensePaymentDate = licensePayment.date,editLicensePaymentYear = licensePayment.validForYear,editLicensePayment=true">
                                  <q-field label="Opłacona dnia : " standout="bg-accent text-black" stack-label>
                                      <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{convertDate(licensePayment.date)}}</div>
                                  </q-field>
                                </div>
                                <div class="col-4"  @dblclick="memberUUID=member.uuid,paymentUUID = licensePayment.uuid,editLicensePaymentDate = licensePayment.date,editLicensePaymentYear = licensePayment.validForYear,editLicensePayment=true">
                                  <q-field standout="bg-accent text-black" label="Na rok : " stack-label>
                                      <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{licensePayment.validForYear}}</div>
                                  </q-field>
                                </div>
                                <div class="col-3" @dblclick="memberUUID=member.uuid,paymentUUID = licensePayment.uuid,togglePaymentAlert = true">
                                  <q-field v-if="licensePayment.payInPZSSPortal" standout="bg-accent text-black" label="PZSS : " stack-label>
                                      <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Tak</div>
                                  </q-field>
                                  <q-field v-if="!licensePayment.payInPZSSPortal" class="bg-red-3" standout="bg-accent text-black" label="PZSS : " stack-label>
                                      <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Nie</div>
                                  </q-field>
                                </div>
                              </div>
                          </div>
                    </q-scroll-area>
              </q-expansion-item>
              </q-card-section>
              <q-card-section class="col-5 text-center">
                <q-item-section class="text-center">
                  <q-expansion-item default-opened label="Informacje o Uprawnieniach" class="col items-center bg-grey-3" group="right-card">
                    <q-field v-if="(member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterNumber!='')" class="col q-pa-md" borderless color="black" label="Sędzia" stack-label>
                      <q-field v-if="(member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterNumber!='')" class="col" standout="bg-accent text-black" color="black" label="Numer" stack-label>
                         <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{member.memberPermissions.arbiterNumber}}</div>
                      </q-field>
                      <q-field v-if="(member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterNumber!='')" class="col" standout="bg-accent text-black" color="black" label="Klasa" stack-label>
                         <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{member.memberPermissions.arbiterClass}}</div>
                      </q-field>
                      <q-field v-if="(member.memberPermissions.arbiterNumber!=null&&member.memberPermissions.arbiterNumber!='')" class="col" standout="bg-accent text-black" color="black" label="Ważna do" stack-label>
                         <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{convertDate(member.memberPermissions.arbiterPermissionValidThru)}}</div>
                      </q-field>
                  </q-field>
                  <q-field v-if="member.shootingPatent.patentNumber!=null" class="col q-pa-md" borderless label="Patent" color="black" stack-label>
                    <div class="col">
                      <div class="row">
                      <q-field class="col" standout="bg-accent text-black" color="black" label="Numer" stack-label>
                         <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{member.shootingPatent.patentNumber}}</div>
                      </q-field>
                      <q-field class="col" standout="bg-accent text-black" color="black" label="Nadany dnia" stack-label>
                         <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{convertDate(member.shootingPatent.dateOfPosting)}}</div>
                      </q-field>
                      </div>
                      <q-field class="col" borderless label="Dyscypliny" color="black" stack-label>
                          <q-field v-if="member.shootingPatent.pistolPermission" class="col" color="black" standout="bg-accent text-black" label="Pistolet" stack-label>
                              <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{convertDate(member.history.patentDay[ 0 ])}}</div>
                          </q-field>
                          <q-field v-if="member.shootingPatent.riflePermission" class="col" color="black" standout="bg-accent text-black" label="Karabin" stack-label>
                              <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{convertDate(member.history.patentDay[ 1 ])}}</div>
                          </q-field>
                          <q-field v-if="member.shootingPatent.shotgunPermission" class="col" color="black" standout="bg-accent text-black" label="Strzelba" stack-label>
                              <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{convertDate(member.history.patentDay[ 2 ])}}</div>
                          </q-field>
                      </q-field>
                    </div>
                  </q-field>
                  <q-field v-if="member.weaponPermission.number!=null&&member.weaponPermission.exist" class="col" standout="bg-accent text-black" label="Numer pozwolenia na broń" stack-label>
                      <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{member.weaponPermission.number}}</div>
                  </q-field>
                  <q-field v-if="member.weaponPermission.admissionToPossessAWeapon!=null&&member.weaponPermission.admissionToPossessAWeaponIsExist" class="col" standout="bg-accent text-black" label="Numer dopuszczenia do posiadania broni" stack-label>
                      <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{member.weaponPermission.admissionToPossessAWeapon}}</div>
                  </q-field>
                  <q-field v-if="(member.memberPermissions.shootingLeaderNumber!=null&&member.memberPermissions.shootingLeaderNumber!='')" class="col" standout="bg-accent text-black" label="Prowadzący Strzelanie" stack-label>
                      <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{member.memberPermissions.shootingLeaderNumber}}</div>
                  </q-field>
                  <q-field v-if="(member.memberPermissions.instructorNumber!=null&&member.memberPermissions.instructorNumber!='')" class="col" standout="bg-accent text-black" label="Instruktor" stack-label>
                      <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{member.memberPermissions.instructorNumber}}</div>
                  </q-field>
                  </q-expansion-item>
                </q-item-section>
<q-expansion-item  label="Wydawanie Amunicji" class="col items-center bg-grey-3" group="right-card">
                <div class="bg-white">
                  <div class="row">
                    <q-field class="full-width col" standout="bg-accent text-black" stack-label>
                      <div class="self-center full-width no-outline text-center text-black" tabindex="0">Kaliber</div>
                    </q-field>
                    <q-field class="full-width col" standout="bg-accent text-black" stack-label>
                      <div class="self-center full-width no-outline text-center text-black" tabindex="0">Ilość wydanej amunicji</div>
                    </q-field>
                  </div>
                  <q-card flat class="row">
                    <q-card-section class="col q-pa-none">
                    <div v-for="(calibers,uuid) in calibers" :key="uuid" :val="calibers.uuid">
                        <q-radio v-model="caliberUUID" :val="calibers.uuid" class="col full-width">
                          <q-field borderless class="cursor-pointer">
                            <div class="self-center full-width no-outline text-center text-black q-pa-xs">{{calibers.name}}</div>
                          </q-field>
                        </q-radio>
                    </div>
                  </q-card-section>
                  <q-card-section class="col q-pa-none">
                    <div v-for="(counter,uuid) in member.personalEvidence.ammoList" :key="uuid">
                      <q-field class="col" standout="bg-accent text-black" :label="counter.caliberName" stack-label>
                        <div class="self-center full-width no-outline text-center text-black q-pa-xs" tabindex="0">{{counter.counter}} sztuk</div>
                      </q-field>
                    </div>
                  </q-card-section>
                  </q-card>
                  <div v-if="!member.erased" class="row">
                  <q-input @keypress.enter="memberUUID=member.uuid,legNumber=member.legitimationNumber, addAmmoConfirm=true" ref="search" filled class="full-width col" color="black" v-model="quantity" placeholder="Tylko cyfry" onkeypress="return (event.charCode > 44 && event.charCode < 58)" label="Ilość Amunicji"></q-input>
                  <q-btn class="full-width col" color="primary" label="wydaj amunicję" @click="memberUUID=member.uuid,legNumber=member.legitimationNumber, addAmmoConfirm=true"></q-btn>
                  </div>
                </div>
</q-expansion-item>
<q-expansion-item v-if="!member.erased" label="Opcje Dodatkowe" group="right-card" class="bg-grey-3">
<q-expansion-item v-if="member.adult&&!member.erased" label="Patent" group="right-right-card" class="bg-white">
                <q-btn class="full-width" color="primary" v-if="member.shootingPatent.patentNumber==null" label="DODAJ PATENT" @click="memberUUID=member.uuid,patentConfirm=true"></q-btn>
                <q-btn class="full-width" color="primary" v-if="member.shootingPatent.patentNumber!=null" label="AKTUALIZUJ PATENT"
                @click="memberUUID=member.uuid,
                patentPistolPermission1=member.shootingPatent.pistolPermission,
                patentRiflePermission1=member.shootingPatent.riflePermission,
                patentShotgunPermission1=member.shootingPatent.shotgunPermission,
                memberAdultConfirm=member.adult,
                patentConfirm2=true">
                </q-btn>
              <q-item v-if="member.shootingPatent.pistolPermission
                &&member.shootingPatent.riflePermission
                &&member.shootingPatent.shotgunPermission"><q-item-label class="text-center full-width self-center">Klubowicz posiada cały Patent</q-item-label></q-item>
</q-expansion-item >
<q-expansion-item v-if="member.adult&&!member.erased" label="Pozwolenie na Broń" group="right-right-card" class="bg-white">
                  <div class="row">
                    <q-input @keypress.enter="changeWeaponPermission(member.uuid, weaponPermissionNumber, isExist)" filled class="col" v-if="member.weaponPermission.number==null||!member.weaponPermission.exist" v-model="weaponPermissionNumber" label="Numer pozwolenia"/>
                    <q-btn class="col" v-if="!member.weaponPermission.exist" label="Dodaj" color="primary" @click="changeWeaponPermission(member.uuid, weaponPermissionNumber, isExist)"/>
                    <q-btn class="col" v-if="member.weaponPermission.exist" label="Usuń pozwolenie" color="primary" @click="memberUUID=member.uuid,permission = true,eraseWeapon=true"/>
                  </div>
                  <q-field v-if="!member.license.valid&&member.weaponPermission.exist" class="col bg-red" standout="bg-accent text-black" stack-label>
                      <div class="self-center full-width no-outline text-center text-black" tabindex="0">POSIADA NIE WAŻNĄ LICENCJĘ!!!</div>
                  </q-field>
</q-expansion-item>
<q-expansion-item v-if="member.adult&&!member.erased" label="Dopuszczenie do Posiadania Broni" group="right-right-card" class="bg-white">
                  <div class="row">
                    <q-input @keypress.enter="changeWeaponAdmission (member.uuid, admissionToPossess, admissionToPossessIsExist)" filled class="col" v-if="member.weaponPermission.admissionToPossessAWeapon==null||!member.weaponPermission.admissionToPossessAWeaponIsExist" v-model="admissionToPossess" label="Numer Dopuszczenia"/>
                    <q-btn class="col" v-if="!member.weaponPermission.admissionToPossessAWeaponIsExist" label="Dodaj" color="primary" @click="changeWeaponAdmission (member.uuid, admissionToPossess, admissionToPossessIsExist)"/>
                    <q-btn class="col" v-if="member.weaponPermission.admissionToPossessAWeaponIsExist" label="Usuń dopuszczenie" color="primary" @click="memberUUID=member.uuid, admission = true,eraseAssest=true"/>
                  </div>
                  <q-field v-if="!member.license.valid&&member.weaponPermission.exist" class="col bg-red" standout="bg-accent text-black" stack-label>
                      <div class="self-center full-width no-outline text-center text-black" tabindex="0">POSIADA NIE WAŻNĄ LICENCJĘ!!!</div>
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
                    <q-item class="full-width">
                      <q-input outlined filled class="full-width col" v-if="member.memberPermissions.arbiterNumber==null||member.memberPermissions.arbiterNumber==''" v-model="permissionsArbiterNumber" label="Numer Uprawnień" />
                        <q-input class="col" outlined filled v-model="permissionsArbiterPermissionValidThru" mask="####-12-31" label="Ważne do:">
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
                        <q-btn class="col full-width" v-if="member.memberPermissions.arbiterNumber!=null" color="primary" label="Przedłuż" @click="memberUUID=member.uuid,arbiterProlongConfirm=true"/>
                      </q-item>
                      <div class="col">
                    <div class="col">
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal" :val="1" label="Klasa 3" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal" :val="2" label="Klasa 2" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal" :val="3" label="Klasa 1" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" />
                    <q-radio class="flex" v-if="member.memberPermissions.arbiterNumber==null" v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" />
                    </div>
                    <q-item v-if="member.memberPermissions.arbiterNumber!=null" class="full-width row">
                      <q-input outlined filled class="full-width col" v-if="member.memberPermissions.arbiterNumber!=null" v-model="permissionsArbiterNumber" label="Numer Uprawnień" />
                      <q-btn class="full-width col" v-if="member.memberPermissions.arbiterNumber!=null" label="Nadaj Nowy Numer" color="primary" @click="memberUUID=member.uuid,arbiterConfirm=true"/>
                    </q-item>
                    <q-item class="full-width">
                      <q-btn class="full-width col-1" v-if="member.memberPermissions.arbiterNumber!=null" color="primary" label="Podnieś Klasę" @click="memberUUID=member.uuid,arbiterUpdateClassConfirm=true"/>
                      <q-btn class="full-width col-1" v-if="member.memberPermissions.arbiterNumber==null||member.memberPermissions.arbiterNumber==''" label="Dodaj" color="primary" @click="memberUUID=member.uuid,arbiterConfirm=true"/>
                    </q-item>
                    </div>
    </q-expansion-item>
    </q-expansion-item>
    <q-expansion-item v-if="!member.erased" label="Portal PZSS" group="right-right-card" class="bg-white">
      <div class="row">
        <q-field v-if="member.pzss" class="col q-pa-md" bg-color="green-3" standout="bg-green-3 text-black" stack-label>
            <div class="self-center full-width no-outline text-center text-black" tabindex="0" @dblclick="memberUUID=member.uuid,pzssPortal=true">Wprowadzony do portalu</div>
        </q-field>
        <q-field v-if="!member.pzss" class="col q-pa-md" bg-color="red-3" standout="bg-red-3 text-black" stack-label>
            <div class="self-center full-width no-outline text-center text-black" tabindex="0" @dblclick="memberUUID=member.uuid,pzssPortal=true">Nie Wprowadzony do Portalu</div>
        </q-field>
        <q-item class="q-pa-md"><q-btn label="pobierz plik .csv" @click="name = member.firstName, name2 = member.secondName,memberUUID = member.uuid, getCSVFile()"></q-btn></q-item>
      </div>
        <q-item v-if="member.pzss"><q-btn class="full-width q-pa-none" type="a" href="https://portal.pzss.org.pl/CLub/Player" target="_blank" label="Przejdź do portalu" color="primary"/></q-item>
        <q-item v-if="!member.pzss"><q-btn class="full-width q-pa-none" type="a" href="https://portal.pzss.org.pl/CLub/Player" target="_blank" label="Przejdź do portalu" color="primary" @click="memberUUID=member.uuid,pzssPortal = true"/></q-item>
    </q-expansion-item>
    <q-expansion-item disable label="Praca na rzecz Klubu" group="right-right-card" class="bg-white">
      <div class="col">
        <div><q-radio v-model="socialWork" :val="false" label="opłata"></q-radio><q-radio v-model="socialWork" :val="true" label="praca"></q-radio></div>
        <div>tutaj będzie lista</div>
        <q-item><q-btn label="dodaj" color="primary"/></q-item>
      </div>
    </q-expansion-item>
    <q-expansion-item label="Przydziel Numer Karty" group="right-right-card" class="bg-white">
      <div v-if="member.barCodeCardList.length > 0">
          <div>Przypisane Karty</div>
        <div v-for="(item, id) in member.barCodeCardList" :key="id" class="row text-bold" style="font-size: smaller;">
          <div v-if="item.active" class="row text-left">{{item.barCode}} Aktywna</div>
          <div v-if="!item.active" class="row text-left">{{item.barCode}} Nieaktywna</div>
        </div>
      </div>
      <div v-if="!member.erased&&member.clubCardBarCode==null" class="row">
        <q-input v-model="barcode" type="password" filled class="col bg-orange" dark label-color="white" stack-label color="white" label="Zeskanuj Kartę Tutaj" @keypress.enter="uuid = member.uuid,addBarcodeToMember(uuid, barcode)"></q-input>
        <q-item><q-btn label="dodaj" color="primary" @click="uuid = member.uuid,addBarcodeToMember(uuid, barcode)"/></q-item>
      </div>
      <div v-else class="full-width text-center">
        <q-item class="full-width text-center">
          <div>Klubowicz ma przypisany numer karty</div>
        </q-item>
        <q-input v-model="barcode" type="password" filled class="col bg-orange" dark label-color="white" stack-label color="white" label="Zeskanuj Kartę Tutaj" @keypress.enter="uuid = member.uuid,addBarcodeToMember(uuid, barcode)"></q-input>
        <q-item class="full-width"><q-btn label="Przydziel Nowy numer" color="primary" @click="uuid = member.uuid,addBarcodeToMember(uuid, barcode)"/></q-item>
      </div>
    </q-expansion-item>
    <q-expansion-item v-if="member.active" label="Przenieś do Nieaktywnych" group="right-right-card" class="bg-red">
                <div class="q-pa-md text-h6 text-bold text-center full-width bg-red-2">Czy na pewno chcesz przenieść osobę?</div>
                <div class="q-pa-md text-bold text-center full-width bg-red-2"><q-btn class="full-width" label="Przenieś" color="red" @click="memberUUID=member.uuid,deactivate=true"/></div>
</q-expansion-item>
<q-expansion-item v-if="!member.adult&&member.active" label="Przenieś do Grupty Powszechnej" group="right-right-card">
                <q-item><q-item-label v-if="member.active">Czy na pewno chcesz przenieść osobę?</q-item-label></q-item>
                <q-item ><q-btn class="full-width" label="Przenieś" color="red" @click="memberUUID=member.uuid,changeAdultConfirm=true"/></q-item>
</q-expansion-item>
<q-expansion-item @focus.stop="erasedReasontype=null,erasedDate=null" class="bg-red" @click="getListErasedType()" v-if="!member.active&&!member.erased" label="Skreśl z listy członków" group="right-right-card">
                <q-item class="bg-red-2"><q-item-label class="text-h6 text-bold text-center full-width">Czy na pewno chcesz usunąć osobę?</q-item-label></q-item>
                  <q-item class="bg-red-2">
                    <q-select color="black" options-cover filled stack-label class="full-width" v-model="erasedReasontype" :options="erasedTypes" label="wybierz przyczynę"></q-select>
                      <q-input class="col-5" color="black" outlined filled v-model="erasedDate" mask="####-##-##" label="w dniu:">
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
                <q-item class="bg-green-2"><q-item-label class="text-h6 text-bold text-center full-width">Czy na pewno chcesz przywrócić osobę?</q-item-label></q-item>
                <q-item class="bg-green-2"><q-btn class="full-width" label="Przywróć" color="green-8" @click="memberUUID=member.uuid,backConfirm=true"/></q-item>
</q-expansion-item>
<q-expansion-item v-if="!member.active&&member.erased" class="bg-green" label="Przywróć Członka klubu" group="right-right-card">
                <q-item class="bg-green-2"><q-item-label class="text-h6 text-bold text-center full-width">Czy na pewno chcesz przywrócić osobę?</q-item-label></q-item>
                <q-item class="bg-green-2"><q-btn label="Przywróć" class="full-width" color="green-8" @click="memberUUID=member.uuid,resurrectCode=true"/></q-item>
</q-expansion-item>
</q-expansion-item>
<q-expansion-item label="Historia startów" group="right-card" class="bg-grey-3">
              <div class="bg-white">
              <q-field class="col" standout="bg-accent text-black" stack-label>
                    <div class="self-center full-width no-outline text-center text-black" tabindex="0">Licznik startów</div>
                </q-field>
              <div class="row">
                <q-field class="col" standout="bg-accent text-black" label="Pistolet" stack-label>
                    <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{member.history.pistolCounter}}</div>
                </q-field>
                <q-field class="col" standout="bg-accent text-black" label="Karabin" stack-label>
                    <div class="self-center full-width no-outline text-left text-black" tabindex="1">{{member.history.rifleCounter}}</div>
                </q-field>
                <q-field class="col" standout="bg-accent text-black" label="Strzelba" stack-label>
                    <div class="self-center full-width no-outline text-left text-black" tabindex="2"> {{member.history.shotgunCounter}} </div>
                </q-field>
              </div>
            </div>
  <q-expansion-item label="Daty Startów" class="bg-grey-3 q-pa-none">
    <q-scroll-area class="full-width q-pa-none" style="height: 200px;">
              <div class="row" v-for="(competitionHistory,uuid) in member.history.competitionHistory" :key="uuid">
                <q-field class="col" standout="bg-accent text-black" label="Nazwa" stack-label>
                    <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{competitionHistory.name}}</div>
                </q-field>
                <q-field class="col-3" standout="bg-accent text-black" label="Data" stack-label>
                    <div class="self-center full-width no-outline text-left text-black" tabindex="1">{{convertDate(competitionHistory.date)}}</div>
                </q-field>
                <q-field v-if="competitionHistory.discipline != null" class="col" standout="bg-accent text-black" label="Konkurencja" stack-label>
                    <div class="self-center full-width no-outline text-left text-black" tabindex="2"> {{competitionHistory.discipline}} </div>
                </q-field>
                <q-field v-if="competitionHistory.discipline == null" class="col" standout="bg-accent text-black" label="Konkurencje" stack-label>
                    <div v-for="(disc,id) in competitionHistory.disciplines" :key="id" class="self-center full-width no-outline text-left text-black" tabindex="2">
                      <div>{{disc[0]}}</div>
                    </div>
                </q-field>
                <q-field v-if="competitionHistory.wzss" class="col" standout="bg-accent text-black" label="WZSS" stack-label>
                    <div class="self-center full-width no-outline text-left text-black" tabindex="2">Tak</div>
                </q-field>
                <q-field v-if="!competitionHistory.wzss" class="col" standout="bg-accent text-black" label="WZSS" stack-label>
                    <div class="self-center full-width no-outline text-left text-black" tabindex="2">Nie</div>
                </q-field>
              </div>
    </q-scroll-area>
    <q-scroll-area v-if="member.history.competitionHistory.lenght<1" class="full-width q-pa-none" style="height: 200px;">
              <div>
                <q-field class="col" standout="bg-accent text-black" stack-label>
                    <div class="self-center full-width no-outline text-center text-black" tabindex="0">Brak</div>
                </q-field>
              </div>
    </q-scroll-area>
  </q-expansion-item >
</q-expansion-item>
<q-expansion-item v-if="member.memberPermissions.arbiterNumber!=null" label="Historia sędziowania" group="right-card" class="bg-grey-3">
              <div class="row" v-for="(judgingHistory,uuid) in member.history.judgingHistory" :key="uuid">
                <q-field class="col" standout="bg-accent text-black" label="Nazwa" stack-label>
                    <div class="self-center full-width no-outline text-left text-black" tabindex="0">{{judgingHistory.name}}</div>
                </q-field>
                <q-field class="col-3" standout="bg-accent text-black" label="Data" stack-label>
                    <div class="self-center full-width no-outline text-left text-black" tabindex="1">{{convertDate(judgingHistory.date)}}</div>
                </q-field>
                <q-field class="col" standout="bg-accent text-black" label="Funkcja" stack-label>
                    <div class="self-center full-width no-outline text-left text-black" tabindex="2"> {{judgingHistory.judgingFunction}} </div>
                </q-field>
              </div>
</q-expansion-item>
          </q-card-section>
        </q-card>
        <q-card bordered class="row bg-grey-2">
          <q-card-section class="col-4">
            <q-item-section >
            <q-item-label>Dane Podstawowe</q-item-label>
            <q-item-label caption lines="2">Identyfikator: {{member.uuid}}</q-item-label>
            <q-item-label caption lines="2">Imię: {{member.firstName}}</q-item-label>
            <q-item-label caption lines="2">Nazwisko: {{member.secondName}}</q-item-label>
            <q-item-label caption lines="2">Data Zapisu do Klubu: {{convertDate(member.joinDate)}}</q-item-label>
            <q-item-label caption lines="2">Pesel: {{member.pesel}}</q-item-label>
            <q-item-label caption lines="2">Numer Dowodu: {{member.idcard}}</q-item-label>
            <p></p>
            <q-btn class="full-width" v-if="!member.erased" label="Zmień Dane Podstawowe" color="secondary" @click="memberUUID=member.uuid,memberIdcard = member.idcard,memberFirstName = member.firstName,memberSecondName = member.secondName,basicDataConfirm=true"></q-btn>
            </q-item-section>
          </q-card-section>
          <q-card-section class="col-3">
            <q-item-section>
            <q-item-label>Dane Kontaktowe</q-item-label>
            <q-item-label caption lines="2">e-mail: {{member.email}}</q-item-label>
            <q-item-label caption lines="2">Numer Telefonu: {{member.phoneNumber.toString().substr(0,3) + ' ' + member.phoneNumber.toString().substring(3,6) + ' ' + member.phoneNumber.toString().substring(6,9) + ' ' + member.phoneNumber.substring(9,12)}}</q-item-label>
            <q-item-label>Adres</q-item-label>
            <q-item-label v-if="member.address.postOfficeCity!=null" caption lines="2">Miasto: {{member.address.postOfficeCity}}</q-item-label>
            <q-item-label v-if="member.address.zipCode!=null" caption lines="2">Kod Pocztowy: {{member.address.zipCode}}</q-item-label>
            <q-item-label v-if="member.address.street!=null" caption lines="2">Ulica: {{member.address.street}} {{member.address.streetNumber}}</q-item-label>
            <q-item-label v-if="member.address.flatNumber!=null" caption lines="2">Numer mieszkania: {{member.address.flatNumber}}</q-item-label>
            <p></p>
            <q-btn v-if="!member.erased" class="full-width" label="Zmień Dane Kontaktowe" color="secondary" @click="memberUUID=member.uuid,memberEmail = member.email,memberPhoneNumber = member.phoneNumber,memberPostOfficeCity = member.address.postOfficeCity,memberZipCode = member.address.zipCode,memberStreet = member.address.street,memberStreetNumber = member.address.streetNumber,memberFlatNumber=member.address.flatNumber,addressConfirm=true"></q-btn>
            </q-item-section>
          </q-card-section>
          <q-card-section class="col-5">
            <div class="col full-width">
                <q-item><q-btn class="full-width" label="Pobierz kartę Członkowską" color="secondary" @click="memberUUID=member.uuid,name=member.firstName,name2=member.secondName,personalCardDownloadConfirm=true"/></q-item>
                <q-item v-if="member.history.contributionList.length > 0"><q-btn class="full-width" label="Pobierz ostatnie potwierdzenie składki" color="secondary" @click="memberUUID=member.uuid,name=member.firstName,name2=member.secondName,contributionDownloadConfirm=true"/></q-item>
                <q-item v-else><q-btn disable class="full-width" label="Pobierz ostatnie potwierdzenie składki" color="secondary" /><q-tooltip content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">BRAK SKŁADEK</q-tooltip></q-item>
                <q-item v-if="!member.erased&&member.license.number!=null&&member.adult"><q-btn class="full-width" label="Pobierz wniosek o licencję" color="secondary" @click="memberUUID=member.uuid,name=member.firstName,name2=member.secondName,getApplicationForExtensionOfTheCompetitorsLicense ()"/></q-item>
                <q-item v-if="!member.erased&&member.license.number==null"><q-btn disable class="full-width" label="Pobierz wniosek o licencję" color="secondary"/><q-tooltip content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">BRAK LICENCJI</q-tooltip></q-item>
                <q-item v-if="!member.erased&&member.license.number!=null&&!member.adult"><q-btn disable class="full-width" label="Pobierz wniosek o licencję" color="secondary"/><q-tooltip content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">BRAK DRUKU DLA MŁODZIEŻY</q-tooltip></q-item>
                <q-item v-if="!member.erased"><q-btn class="full-width" label="Pobierz Zaświadczenie o przynależności" color="secondary" @click="memberUUID=member.uuid,name=member.firstName,name2=member.secondName,certificates=true"/><q-tooltip v-if="!member.active&&!member.erased" content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">BRAK SKŁADEK</q-tooltip></q-item>
                <!-- <q-item v-if="!member.active&&!member.erased"><q-btn disable class="full-width" label="Pobierz Zaświadczenie o przynależności" color="secondary"/><q-tooltip content-class="text-h6 bg-red" anchor="top middle" self="bottom middle" :offset="[12, 12]">BRAK SKŁADEK</q-tooltip></q-item> -->
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div v-if="member==null" class="full-width">
        <div v-if="memberDTOArg.length<1" class="text-center text-bold text-h5">
          Brak Wyników
        </div>
            <q-virtual-scroll :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32" dense :items="memberDTOArgRearangeTable"  type="table" visible class="row full-width q-pa-none" style="height: 90vh;">
          <template v-slot:before>
        <thead class="thead-sticky text-left">
          <tr>
            <th class="text-left" style="width: 20%" @click="sort='name',sortF (sort)">{{memberDTOArgRearangeTable.length}} <q-icon size="2em" v-if="!sortName" name="arrow_drop_down"></q-icon><q-icon size="2em" v-if="sortName" name="arrow_drop_up"></q-icon>Imię i nazwisko</th>
            <th v-if="!erase" style="width: 18%" class="text-left">Wpis do portalu PZSS</th>
            <th v-if="!erase" style="width: 10%" class="text-left">Zdjęcie</th>
            <th class="text-left" style="width: 5%" @click="sort='numberLeg',sortF (sort)" ><q-icon size="2em" v-if="!sortLegitimation" name="arrow_drop_down"></q-icon><q-icon size="2em" v-if="sortLegitimation" name="arrow_drop_up"></q-icon>Numer Legitymacji</th>
            <th class="text-center" style="width: 15%" @click="sort='numberLicense',sortF (sort)"><q-icon size="2em" v-if="!sortLicense" name="arrow_drop_down"></q-icon><q-icon size="2em" v-if="sortLicense" name="arrow_drop_up"></q-icon>Licencja</th>
            <th v-if="!erase" class="text-center">Status</th>
            <th v-else class="text-center">podstawa skreślenia</th>
          </tr>
        </thead>
          </template>
    <template v-slot="{ item, index }">
      <tr v-if="!item.erased" :key="index" dense class="rounded" style="cursor:pointer" @click="showloading(),allMember=false,memberName =item.secondName + ' '+item.firstName+' leg. '+item.legitimationNumber,getMemberFromList (item.legitimationNumber)">
        <td style="width: 22%" class="xyz"><b>{{index +1}}</b> {{item.secondName}} {{item.firstName}}</td>
        <td v-if="!item.pzss" class="bg-warning">Brak wpisu</td>
        <td v-else></td>
        <td v-if="item.image===null" class="bg-warning">brak zdjęcia</td>
        <td v-if="item.image!=null" class="bg-green-3">zdjęcie wgrane</td>
        <td class="text-center">nr leg. {{item.legitimationNumber}}</td>
        <td v-if="!item.erased && item.license.number!=null && item.license.valid" class="bg-green-3 text-center"><div>Aktualna nr {{item.license.number}}</div></td>
        <td v-if="item.license.number!=null && !item.license.valid && !item.erased" class="bg-warning text-center"><div>Nieaktualna nr {{item.license.number}}</div></td>
        <td v-if="item.license.number==null && !item.erased" class="text-center">BRAK</td>
        <td v-if="item.active && !item.erased" class="bg-green-3">Klubowicz Aktywny</td>
        <td v-if="!item.active && !item.erased" class="bg-red-3"><div>Klubowicz Nieaktywny - Sprawdź składki</div></td>
      </tr>
      <tr v-if="item.erased" :key="index" dense style="cursor:pointer" class="full-width" @click="showloading(),allMember=false,memberName =item.secondName + ' '+item.firstName+' leg. '+item.legitimationNumber,getMemberFromList (item.legitimationNumber)">
        <td class="xyz">{{item.secondName}} {{item.firstName}}</td>
        <td class="text-left">nr leg. {{item.legitimationNumber}}</td>
        <td v-if="item.license.number!=null && item.license.valid" class="bg-green-3 text-center"><div>Aktualna nr {{item.license.number}}</div></td>
        <td v-if="item.license.number!=null && !item.license.valid" class="bg-warning text-center"><div>Nieaktualna nr {{item.license.number}}</div></td>
        <td v-if="item.license.number==null" class="text-center">BRAK</td>
        <td class="bg-grey-3"><div class="self-center full-width no-outline text-center text-black" tabindex="0">{{item.erasedEntity.erasedType}} {{convertDate(item.erasedEntity.date)}}</div>
                  <div v-if="item.erasedEntity.additionalDescription!=null" class="self-center full-width no-outline text-left text-black" tabindex="0">{{item.erasedEntity.additionalDescription}}</div></td>
      </tr>
    </template>
        </q-virtual-scroll>
      </div>
<q-dialog v-model="contribution" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm h6">Czy przedłużyć składkę?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="przedłuż" color="primary" v-close-popup @click="contributionCode=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="certificates" persistent>
      <q-card style="width: 400px;">
        <q-card-section class="row items-center">
          <div class="q-ml-sm full-width text-h5 text-bold text-center">Wybierz zaświadczenie</div>
        </q-card-section>
        <q-card-section>
          <q-select class="full-width" filled v-model="certificateChoice" label-color="secondary" label="Wybierz rodzaj zaświadczenia" use-input hide-selected fill-input input-debounce="0" :options="certificateChoices"></q-select>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-select v-if="certificateChoice==='ZAŚWIADCZENIE DO POLICJI'" class="full-width" v-model="city" filled use-input hide-selected fill-input input-debounce="0" :options="cities" label-color="secondary" label="wybierz miasto"></q-select>
          <div v-if="certificateChoice!=null" class="q-pa-md full-width"><q-btn color="primary" class="items-center full-width" :label="certificateChoice" @click="certificateDownload = true"></q-btn></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Anuluj" color="primary" v-close-popup @click="certificateChoice = null"/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="contributionCode" persistent>
      <q-card class="bg-green-5 text-center">
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
                <q-item><q-input @focus="memberPhoneNumber = null"  prefix="+48" v-model="memberPhoneNumber" hint="tylko cyfry" label="Numer Telefonu" placeholder="tylko cyfry" mask="### ### ###"/></q-item>
                <q-item><q-input v-model="memberPostOfficeCity" label="Miasto" /></q-item>
                <q-item><q-input v-model="memberZipCode" label="Kod Pocztowy" mask="##-###" /></q-item>
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
<q-dialog v-model="pzssPortal">
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
<q-dialog v-model="togglePaymentAlert" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6 text-justify text-center">Czy Licencja Klubowicza została opłacona w portalu PZSS?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="nie" color="primary" v-close-popup />
          <q-btn label="tak" color="primary" v-close-popup @click="toggleHistoryPaymentCode = true"/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="basicDataConfirm" persistent>
      <q-card>
        <q-card-section class="col items-center">
        <q-item-label class="text-bold text-center text-h6">Zmień dane podstawowe</q-item-label>
        <q-item><q-input v-model="memberIdcard" label="Numer Dokumentu"/></q-item>
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
<q-dialog v-model="licenseConfirm">
  <div>
      <q-card>
        <q-item class="flex-center text-bold full-width text-h5">Dodaj licencję</q-item>
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
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="addLicense(memberUUID, member.license.licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)" />
        </q-card-actions>
      </q-card>
  </div>
</q-dialog>
<q-dialog v-model="noDomesticStarts">
    <q-card>
      <h4 class="text-bold text-center">Klubowicz nie ma zaliczonej wymaganej ilości startów </h4>
      <h4 class="text-bold text-center">Upewnij się, że klubowicz może udokumentować swoje starty</h4>
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
          <span class="q-ml-sm">Czy na pewno chcesz przywrócić Klubowicza?</span>
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
          <q-btn flat label="Tak" color="primary" v-close-popup @click="updateMemberPermissions(memberUUID, permissionsArbiterNumber, permissionsArbiterPermissionValidThru)" />
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
<q-dialog v-model="arbiterUpdateClassConfirm" persistent @keypress.enter="updateMemberArbiterClass(memberUUID),arbiterUpdateClassConfirm=false">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy napewno chcesz podnieść klasę licencji Sędziego?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="podnieś" color="primary" v-close-popup @click="updateMemberArbiterClass(memberUUID)" />
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
          <span class="q-ml-sm text-bold text-h6">Pobrać potwierdzenie składki?</span>
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
          <span class="q-ml-sm text-bold text-h6">Pobrać kartę Klubowicza?</span>
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
          <p class="q-ml-sm text-h6 text-bold">Pobrać zaświadczenie dla Klubowicza?</p>
          <p class="q-ml-sm text-h6 text-bold">Pamiętaj aby sprawdzić składki</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup @click="certificateChoice = null"/>
          <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getdownloadCertificateOfClubMembership(),certificates=false" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addAmmoConfirm" persistent @keypress.enter="addMemberAndAmmoToCaliber(),addAmmoConfirm=false">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy napewno chcesz wydać amunicję?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="wydaj" color="primary" v-close-popup @click="addMemberAndAmmoToCaliber()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="patentConfirm" persistent>
      <q-card>
        <q-card-section >
          <div class="q-pa-xs text-h5 text-center text-bold">Dodawanie Patentu</div>
        </q-card-section>
        <q-card-section class="row">
          <div class="row full-width">
          <q-input v-model="patentNumber" dense class="col" mask="#####/AAA/##/####" label="Numer Patentu" filled />
          <div class="col-1"></div>
          <q-input filled v-model="patentDate" dense class="col" mask="####-##-##" label="Wybierz datę">
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
          </q-input>
          </div>
          <div class="row">
          <q-item><q-checkbox v-model="patentPistolPermission" label="Pistolet"/></q-item>
          <q-item><q-checkbox v-model="patentRiflePermission" label="Karabin"/></q-item>
          <q-item><q-checkbox v-model="patentShotgunPermission" label="Strzelba"/></q-item>
          </div>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="patentConfirm1=true"/>
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="patentConfirm2" persistent>
      <q-card>
        <q-card-section>
          <div class="q-pa-xs text-h5 text-center text-bold">Aktualizowanie Patentu</div>
        </q-card-section>
        <q-card-section class="row">
          <div class="row full-width">
            <q-input class="col" filled dense label="numer patentu" v-model="patentNumber" mask="#####/AAA/##/####"></q-input>
            <div class="col-1"></div>
            <q-input class="col" filled dense v-model="patentDate" mask="####-##-##" label="Wybierz datę">
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
            </q-input>
         </div>
         <div class="row">
         <q-item v-if="!patentPistolPermission1"><q-checkbox v-model="patentPistolPermission" label="Pistolet"/></q-item>
         <q-item v-if="!patentRiflePermission1"><q-checkbox v-model="patentRiflePermission" label="Karabin"/></q-item>
         <q-item v-if="!patentShotgunPermission1"><q-checkbox v-model="patentShotgunPermission" label="Strzelba"/></q-item>
         </div>
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
<q-dialog :position="'top'" v-model="downloaded">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano</div>
        </q-card-section>
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
<q-dialog v-model="toggleHistoryPaymentCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input @keypress.enter="toggleHistoryPayment(paymentUUID)" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="OK" color="black" v-close-popup @click="toggleHistoryPayment(paymentUUID)" />
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
<q-dialog :position="'top'" v-model="failure">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{message}}</div>
        </q-card-section>

      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{message}}</div>
        </q-card-section>

      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="forbidden">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">Niewłaściwy kod. Spróbuj ponownie.</div>
        </q-card-section>

      </q-card>
</q-dialog>
<q-dialog v-model="editLicense" @keypress.esc="editLicense=false">
      <q-card>
        <q-card-section class="col">
          <div class="text-h5 text-bold text-center">Edytuj Licencje</div>
          <div class="text-h6">Uwaga! Wprowadzając zmiany bądź pewny tego co robisz</div>
          <div class="row bg-grey-3">
            <div class="q-pa-md col-6">
              <q-input filled standout="bg-accent text-black" stack-label v-model="editLicenseNumber" label="Numer Licencji"></q-input>
            </div>
            <div class="q-pa-md col-6">
              <q-input filled standout="bg-accent text-black" stack-label v-model="editLicenseDate" mask="####-12-31" label="Ważność licencji">
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
            <div>
              <q-checkbox label="Oznacz jako opłacona" />
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
              <q-input  v-model="editContributionPaymentDate" filled standout="bg-accent text-black" stack-label mask="####-##-##" label="Data Opłacenia Składki">
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
              <q-input class="col-6" v-model="editContributionValidThruDate" filled standout="bg-accent text-black" stack-label mask="####-##-##" label="Ważność Sładki">
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
              <q-input  v-model="editLicensePaymentDate" filled standout="bg-accent text-black" stack-label mask="####-##-##" label="Data Opłacenia Licencji">
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
              <q-input class="col-6" v-model="editLicensePaymentYear" filled standout="bg-accent text-black" stack-label mask="####" label="Opłacona na Rok"></q-input>
            </div>
          </div>
          <div class="row full-width bg-red-3">
            <div class="col q-pa-md bg-grey-3">
              <q-btn class="full-width" label="wprowadź zmiany" color="primary" v-close-popup @click="editLicensePaymentCode=true"/>
            </div>
            <div class="col q-pa-md bg-red-3">
              <q-btn class="full-width" label="Usuń wpłatę" color="red" v-close-popup @click="deleteLicensePaymentCode=true"/>
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
<q-dialog v-model="deleteLicensePaymentCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <h3><span class="q-ml-sm">Usuń wpłatę</span></h3>
          <div><q-input @keypress.enter="deleteLicenseHistoryPayment(),code=null,deleteLicensePaymentCode=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup @click="deleteLicenseHistoryPayment(), code=null" />
        </q-card-actions>
      </q-card>
</q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">

</style>

<script src="../scripts/member.js">
</script>
