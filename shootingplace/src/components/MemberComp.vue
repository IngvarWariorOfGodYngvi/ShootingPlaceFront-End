<template>
  <div>
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
  </div>
</template>

<script></script>
