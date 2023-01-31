<template>
  <div class="col-4">
    <q-card-section class="items-center" style="height: 80vh">
      <q-item-section class="col" v-if="license.number===null||adult">
        <div v-if="shootingPatent.patentNumber!=null" class="col"
             @dblclick="editLicense=true">
          <q-field dense class="col" standout="bg-accent text-black" stack-label>
            <div class="self-center col full-width no-outline text-center text-black" tabindex="0">Licencja</div>
          </q-field>
        </div>
        <div v-if="shootingPatent.patentNumber==null"
             @dblclick="editLicense=true"
             class="col">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <div class="self-center col full-width no-outline text-center text-black" tabindex="0">Licencja</div>
            <q-tooltip v-if="adult" content-class="text-body2 text-center" self="top middle"
                       anchor="top middle" :offset="[12, 12]">Klubowicz nie ma patentu<p>wprowadź patent aby móc dodać
              licencję</p></q-tooltip>
          </q-field>
        </div>
        <div>
          <div class="row">
            <div class="col">
              <q-field dense class="col" v-if="license.number!=null" label="Numer Licencji"
                       standout="bg-accent text-black" stack-label>
                <div class="self-center col full-width no-outline text-left text-black" tabindex="0">
                  {{ license.number }}
                </div>
              </q-field>
            </div>
            <q-field dense class="col" v-if="license.validThru!=null" label="Ważna do :"
                     standout="bg-accent text-black" stack-label>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="0">
                {{ convertDate(license.validThru) }}
              </div>
            </q-field>
          </div>
          <div
            v-if="shootingPatent.pistolPermission === true || shootingPatent.riflePermission === true || shootingPatent.shotgunPermission === true"
            class="row">
            <q-field dense label="Dyscypliny" class="col" standout="bg-accent text-black" stack-label>
              <div v-if="shootingPatent.pistolPermission" class="self-center text-center col-4 no-outline text-black"
                   tabindex="0">Pistolet
              </div>
              <div v-if="shootingPatent.riflePermission" class="self-center text-center col-4 no-outline text-black"
                   tabindex="0">Karabin
              </div>
              <div v-if="shootingPatent.shotgunPermission" class="self-center text-center col-4 no-outline text-black"
                   tabindex="0">Strzelba
              </div>
            </q-field>
          </div>
        </div>
<!--        <q-item-label caption lines="2"-->
<!--                      v-if="!member.license.pistolPermission&&member.history.licenseHistory[ 0 ]==='Pistolet'">Kiedyś-->
<!--          posiadał licencję na Pistolet-->
<!--        </q-item-label>-->
<!--        <q-item-label caption lines="2"-->
<!--                      v-if="!member.license.riflePermission&&member.history.licenseHistory[ 1 ]==='Karabin'">Kiedyś-->
<!--          posiadał licencję na Karabin-->
<!--        </q-item-label>-->
<!--        <q-item-label caption lines="2"-->
<!--                      v-if="!member.license.shotgunPermission&&member.history.licenseHistory[ 2 ]==='Strzelba'">Kiedyś-->
<!--          posiadał licencję na strzelbę-->
<!--        </q-item-label>-->
      </q-item-section>
      <q-btn
        v-if="(shootingPatent.patentNumber!=null&&license.number==null&&license.paid)||(!adult&&license.number==null)"
        class="full-width" color="primary" label="WYDAJ LICENCJĘ" @click="
                patentPistolPermission1=shootingPatent.pistolPermission;
                patentRiflePermission1=shootingPatent.riflePermission;
                patentShotgunPermission1=shootingPatent.shotgunPermission;
                memberAdultConfirm=adult;
                licenseConfirm=true">
      </q-btn>
      <q-btn class="full-width" color="primary" v-if="license.number!=null&&(
                !shootingPatent.pistolPermission
                ||!shootingPatent.riflePermission
                ||!shootingPatent.shotgunPermission)&&clubID===1" label="Rozszerz Licencję" @click="
                patentPistolPermission1=shootingPatent.pistolPermission;
                patentRiflePermission1=shootingPatent.riflePermission;
                patentShotgunPermission1=shootingPatent.shotgunPermission;
                licensePistolPermission1=license.pistolPermission;
                licenseRiflePermission1=license.riflePermission;
                licenseShotgunPermission1=license.shotgunPermission;
                memberAdultConfirm=adult;
                updateLicenseConfirm=true"></q-btn>
      <div
        v-if="(license.number!=null&&(license.pistolPermission||license.riflePermission||license.shotgunPermission))&&clubID===1&&license.paid===true">
        <q-btn class="full-width" v-if="license.canProlong&&license.paid===true"
               label="przedłuż licencję" color="primary" @click="
                licensePistolPermission1=license.pistolPermission;
                licenseRiflePermission1=license.riflePermission;
                licenseShotgunPermission1=license.shotgunPermission;
                prolongLicenseConfirm=true"></q-btn>
        <q-btn class="full-width" v-else label="przedłuż licencję" color="primary" @click="
                licensePistolPermission1=license.pistolPermission;
                licenseRiflePermission1=license.riflePermission;
                licenseShotgunPermission1=license.shotgunPermission;
                noDomesticStarts=true"></q-btn>
      </div>
      <q-btn v-if="(((shootingPatent.patentNumber!==null&&license.paid===false&&clubID===1))) " :disable="!active" class="full-width"
             label="opłać licencję" @click="licensePayment=true"></q-btn>
      <q-expansion-item dense default-opened class="bg-grey-3 text-center"
                        v-if="licensePaymentHistory.length>0" label="Daty Opłacenia Licencji">
        <q-virtual-scroll class="full-width q-pa-none" :style="(!shootingPatent.pistolPermission
                ||!shootingPatent.riflePermission
                ||!shootingPatent.shotgunPermission)?'height: 44vh':'height: 54vh'" :items="licensePaymentHistory">
          <template v-slot="{ item }">
            <div v-if="item.new" class="full-width bg-warning">
              <q-field dense standout="bg-accent text-black" stack-label>
                <div class="self-center col full-width no-outline text-center text-black" tabindex="1">Licencja Nowa
                </div>
              </q-field>
              <div class="row full-width">
                <div class="col-5"
                     @dblclick="paymentUUID = item.uuid;editLicensePaymentDate = item.date; editLicensePaymentYear = item.validForYear; editLicensePayment=true">
                  <q-field dense label="Opłacona dnia : " standout="bg-accent text-black" stack-label>
                    <div class="self-center col full-width no-outline text-left text-black" tabindex="0">
                      {{ convertDate(item.date) }}
                    </div>
                  </q-field>
                </div>
                <div class="col-4"
                     @dblclick="paymentUUID = item.uuid;editLicensePaymentDate = item.date;editLicensePaymentYear = item.validForYear;editLicensePayment=true">
                  <q-field dense standout="bg-accent text-black" label="Na rok : " stack-label>
                    <div class="self-center col full-width no-outline text-left text-black" tabindex="1">
                      {{ item.validForYear }}
                    </div>
                  </q-field>
                </div>
                <div class="col-3"
                     @dblclick="paymentUUID = item.uuid;togglePaymentAlert = true">
                  <q-field dense v-if="item.payInPZSSPortal" standout="bg-accent text-black" label="PZSS : "
                           stack-label>
                    <div class="self-center col full-width no-outline text-left text-black">{{item.payInPZSSPortal?'Tak':'Nie'}}</div>
                  </q-field>
                </div>
              </div>
            </div>
            <div v-if="!item.new" class="row full-width">
              <div class="col-5"
                   @dblclick="paymentUUID=item.uuid;editLicensePaymentDate = item.date;editLicensePaymentYear = item.validForYear;editLicensePayment=true">
                <q-field dense label="Opłacona dnia : " standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="0">
                    {{ convertDate(item.date) }}
                  </div>
                </q-field>
              </div>
              <div class="col-4"
                   @dblclick="paymentUUID=item.uuid;editLicensePaymentDate = item.date;editLicensePaymentYear = item.validForYear;editLicensePayment=true">
                <q-field dense standout="bg-accent text-black" label="Na rok : " stack-label>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="1">
                    {{ item.validForYear }}
                  </div>
                </q-field>
              </div>
              <div class="col-3"
                   @dblclick="paymentUUID=item.uuid;togglePaymentAlert = true">
                <q-field dense :class="item.payInPZSSPortal?'':'bg-red-3'" :standout="item.payInPZSSPortal?'bg-accent text-black':'bg-red-4 text-balck'" label="PZSS : "
                         stack-label>
                  <div class="full-width text-center text-black" tabindex="1"><q-icon :name="item.payInPZSSPortal?'done':'cancel'"></q-icon></div>
                </q-field>
              </div>
            </div>
          </template>
        </q-virtual-scroll>
      </q-expansion-item>
    </q-card-section>
    <q-dialog v-model="editLicense" @keypress.esc="editLicense=false">
      <q-card>
        <q-card-section class="col">
          <div class="text-h5 text-bold text-center">Edytuj Licencje</div>
          <div class="text-h6">Uwaga! Wprowadzając zmiany bądź pewny tego co robisz</div>
          <div class="row bg-grey-3">
            <div class="q-pa-md col-6">
              <q-input filled standout="bg-accent text-black" stack-label v-model="editLicenseNumber"
                       label="Numer Licencji"></q-input>
            </div>
            <div class="q-pa-md col-6">
              <q-input filled standout="bg-accent text-black" stack-label v-model="editLicenseDate" mask="####-12-31"
                       label="Ważność licencji">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="editLicenseDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div>
              <q-checkbox value="" label="Oznacz jako opłacona"/>
            </div>
          </div>
          <div class="q-pa-md row full-width bg-grey-3">
            <q-btn class="full-width" label="wprowadź zmiany" color="primary" v-close-popup
                   @click="editLicenseCode=true"/>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="updateLicenseConfirm" persistent>
      <div>
        <q-card>
          <q-item>Aktualizuj licencję</q-item>
          <q-card-section class="col items-center">
            <q-item v-if="!licensePistolPermission1&&(patentPistolPermission1)||!memberAdultConfirm">
              <q-checkbox v-model="licensePistolPermission" label="Pistolet"/>
            </q-item>
            <q-item v-if="!licenseRiflePermission1&&(patentRiflePermission1)||!memberAdultConfirm">
              <q-checkbox v-model="licenseRiflePermission" label="Karabin"/>
            </q-item>
            <q-item v-if="!licenseShotgunPermission1&&(patentShotgunPermission1)||!memberAdultConfirm">
              <q-checkbox v-model="licenseShotgunPermission" label="Strzelba"/>
            </q-item>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat icon="cancel" color="primary" v-close-popup/>
            <q-btn flat label="Dodaj" color="primary" v-close-popup
                   @click="addLicense(memberUUID, licence.number, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/>
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog><q-dialog v-model="prolongLicenseConfirm" persistent>
    <div>
      <q-card>
        <q-item>Przedłuż licencję</q-item>
        <q-card-section class="col items-center">
          <q-item v-if="licensePistolPermission1">
            <q-checkbox v-model="licensePistolPermission" label="Pistolet"/>
          </q-item>
          <q-item v-if="licenseRiflePermission1">
            <q-checkbox v-model="licenseRiflePermission" label="Karabin"/>
          </q-item>
          <q-item v-if="licenseShotgunPermission1">
            <q-checkbox v-model="licenseShotgunPermission" label="Strzelba"/>
          </q-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat icon="cancel" color="primary" v-close-popup/>
          <q-btn label="Przedłuż" color="primary" v-close-popup
                 @click="prolongLicense(memberUUID, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/>
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
    <q-dialog v-model="licenseConfirm">
      <div>
        <q-card>
          <q-item class="flex-center text-bold full-width text-h5">Dodaj licencję</q-item>
          <q-card-section class="col items-center">
            <q-item>
              <q-input v-model="newLicenseNumber" label="Numer Licencji"
                       onkeypress="return (event.charCode > 47 && event.charCode < 58)" hint="tylko cyfry"
                       placeholder="tylko cyfry" filled lazy-rules
                       :rules="[ val => val && val.length > 0 || 'Pole nie może być puste']"/>
            </q-item>
            <q-item v-if="(patentPistolPermission1||!memberAdultConfirm)">
              <q-checkbox v-model="licensePistolPermission" label="Pistolet"/>
            </q-item>
            <q-item v-if="(patentRiflePermission1||!memberAdultConfirm)">
              <q-checkbox v-model="licenseRiflePermission" label="Karabin"/>
            </q-item>
            <q-item v-if="(patentShotgunPermission1||!memberAdultConfirm)">
              <q-checkbox v-model="licenseShotgunPermission" label="Strzelba"/>
            </q-item>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat icon="cancel" color="primary" v-close-popup/>
            <q-btn flat label="Dodaj" color="primary" v-close-popup
                   @click="addLicense(memberUUID, license.number, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission)"/>
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
    <q-dialog v-model="licensePayment" persistent
              @keypress.enter="licensePayment=false;licensePaymentCode=true">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy licencja została opłacona?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat icon="cancel" color="primary" v-close-popup/>
          <q-btn flat label="Tak" color="primary" v-close-popup @click="licensePaymentCode=true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="licensePaymentCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="licensePaymentCode=false;addLicenseHistoryPayment (memberUUID, code)" autofocus type="password" v-model="code" filled
                     color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn icon="cancel" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="OK" color="black" v-close-popup @click="licensePaymentCode=false;addLicenseHistoryPayment (memberUUID, code)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editLicensePayment" @keypress.esc="editLicensePayment=false">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-bold text-center">Edytuj Opłatę za Licencję {{paymentUUID}}</div>
          <div class="text-h6 text-center">Uwaga! Wprowadzając zmiany bądź pewny tego co robisz</div>
          <div class="row bg-grey-3">
            <div class="q-pa-md col-6">
              <q-input v-model="editLicensePaymentDate" filled standout="bg-accent text-black" stack-label
                       mask="####-##-##" label="Data Opłacenia Licencji">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="editLicensePaymentDate">
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
              <q-input class="col-6" v-model="editLicensePaymentYear" filled standout="bg-accent text-black" stack-label
                       mask="####" label="Opłacona na Rok"></q-input>
            </div>
          </div>
          <div class="row full-width bg-red-3">
            <div class="col q-pa-md bg-grey-3">
              <q-btn class="full-width" label="wprowadź zmiany" color="primary" v-close-popup
                     @click="editLicensePaymentCode=true"/>
            </div>
            <div class="col q-pa-md bg-red-3">
              <q-btn class="full-width" label="Usuń wpłatę" color="red" v-close-popup
                     @click="deleteLicensePaymentCode=true"/>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat icon="close" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="togglePaymentAlert" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6 text-justify text-center">Czy Licencja Klubowicza została opłacona w portalu PZSS?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="nie" color="primary" v-close-popup/>
          <q-btn label="tak" color="primary" v-close-popup @click="toggleHistoryPaymentCode = true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="toggleHistoryPaymentCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="toggleHistoryPayment(paymentUUID)" autofocus type="password" v-model="code" filled
                     color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn icon="cancel" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="OK" color="black" v-close-popup @click="toggleHistoryPayment(paymentUUID)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="failure">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="editLicenseCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="forceUpdateLicence();editLicenseCode=false" autofocus type="password"
                     v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn icon="cancel" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup @click="forceUpdateLicence()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editLicensePaymentCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="editLicenseHistoryPayment();code=null;editLicensePaymentCode=false" autofocus
                     type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
                     mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn icon="cancel" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup
                 @click="editLicenseHistoryPayment(); code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteLicensePaymentCode" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <h3><span class="q-ml-sm">Usuń wpłatę</span></h3>
          <div>
            <q-input @keypress.enter="deleteLicenseHistoryPayment(paymentUUID);code=null;deleteLicensePaymentCode=false" autofocus
                     type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
                     mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn icon="cancel" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup
                 @click="deleteLicenseHistoryPayment(paymentUUID); code=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'

export default {
  name: 'MemberLicense.vue',
  data () {
    return {
      license: '',
      licensePaymentHistory: [],
      code: null,
      paymentUUID: '',
      newLicenseNumber: '',
      editLicenseNumber: '',
      editLicenseDate: '',
      licensePaymentCode: false,
      editLicenseCode: false,
      togglePaymentAlert: false,
      editLicensePayment: false,
      toggleHistoryPaymentCode: false,
      editLicensePaymentCode: false,
      deleteLicensePaymentCode: false,
      editLicensePaymentDate: '',
      editLicensePaymentYear: '',
      editLicense: false,
      prolongLicenseConfirm: false,
      licenseConfirm: false,
      noDomesticStarts: false,
      licensePayment: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      patentPistolPermission1: false,
      patentRiflePermission1: false,
      patentShotgunPermission1: false,
      licensePistolPermission1: false,
      licenseRiflePermission1: false,
      licenseShotgunPermission1: false,
      memberAdultConfirm: false,
      updateLicenseConfirm: false,
      failure: false,
      success: false,
      message: null,
      local: App.host
    }
  },
  props: {
    memberUUID: {
      type: String,
      required: true
    },
    licenseUUID: {
      type: String,
      required: true
    },
    adult: {
      type: Boolean,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    },
    clubID: {
      type: Number,
      required: true
    },
    shootingPatent: {
      type: Object,
      required: true
    }
  },
  created () {
    this.getLicense(this.licenseUUID)
    this.getLicensePaymentHistory(this.memberUUID)
  },
  watch: {
    memberUUID (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getLicense(this.licenseUUID)
        this.getLicensePaymentHistory(this.memberUUID)
      }
    }
  },
  methods: {
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
    async getLicense (licenseUUID) {
      await fetch('http://' + this.local + '/license/getLicense?licenseUUID=' + licenseUUID, {
        method: 'GET'
      }).then(response => {
        response.json().then(
          response => {
            this.license = response
          })
      })
    },
    async getLicensePaymentHistory (memberUUID) {
      await fetch('http://' + this.local + '/license/getLicensePaymentHistory?memberUUID=' + memberUUID, {
        method: 'GET'
      }).then(response => {
        response.json().then(
          response => {
            this.licensePaymentHistory = response
          })
      })
    },
    addLicense (uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      const data1 = {
        number: licenseNumber,
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission
      }
      fetch('http://' + this.local + '/license/' + this.memberUUID, {
        method: 'PUT',
        body: JSON.stringify(data1),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.newLicenseNumber = ''
              this.licensePistolPermission = false
              this.licenseRiflePermission = false
              this.licenseShotgunPermission = false
              this.getLicense(this.license.uuid)
              this.getLicensePaymentHistory(this.memberUUID)
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
    prolongLicense (uuid, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      const data = {
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission
      }
      fetch('http://' + this.local + '/license/' + uuid, {
        method: 'PATCH',
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
              this.licensePistolPermission = false
              this.licenseRiflePermission = false
              this.licenseShotgunPermission = false
              this.getLicense(this.license.uuid)
              this.getLicensePaymentHistory(this.memberUUID)
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
    editLicenseHistoryPayment () {
      fetch('http://' + this.local + '/license/editPayment?memberUUID=' + this.memberUUID + '&paymentUUID=' + this.paymentUUID + '&paymentDate=' + this.editLicensePaymentDate.replace(/\//gi, '-') + '&year=' + this.editLicensePaymentYear + '&pinCode=' + this.code, {
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
              this.code = null
              this.getLicense(this.license.uuid)
              this.getLicensePaymentHistory(this.memberUUID)
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
    deleteLicenseHistoryPayment (uuid) {
      fetch('http://' + this.local + '/license/removePayment?paymentUUID=' + uuid + '&pinCode=' + this.code, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.code = null
              this.getLicense(this.license.uuid)
              this.getLicensePaymentHistory(this.memberUUID)
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
    addLicenseHistoryPayment (uuid, code) {
      fetch('http://' + this.local + '/license/history/' + uuid + '?pinCode=' + code, {
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
              this.getLicense(this.license.uuid)
              this.getLicensePaymentHistory(this.memberUUID)
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
    toggleHistoryPayment (uuid) {
      fetch('http://' + this.local + '/license/paymentToggle?paymentUUID=' + uuid + '&pinCode=' + this.code, {
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
              this.getLicense(this.license.uuid)
              this.getLicensePaymentHistory(this.memberUUID)
              this.autoClose()
            })
        }
        if (response.status === 400) {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    forceUpdateLicence () {
      fetch('http://' + this.local + '/license/forceUpdate?memberUUID=' + this.memberUUID + '&number=' + this.editLicenseNumber + '&date=' + this.editLicenseDate.replace(/\//gi, '-') + '&pinCode=' + this.code, {
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
              this.editLicenseNumber = null
              this.editLicenseDate = null
              this.code = null
              this.getLicense(this.license.uuid)
              this.getLicensePaymentHistory(this.memberUUID)
              this.autoClose()
            })
        }
        if (response.status === 400) {
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
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.success = false
        this.message = null
        this.licensePaymentCode = false
        this.toggleHistoryPaymentCode = false
        this.code = null
      }, 2000)
    }
  }
}
</script>
