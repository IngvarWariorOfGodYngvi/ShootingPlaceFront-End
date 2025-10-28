<template>
  <q-page>
    <q-card class="bg-dark fit">
      <label class="text-positive">
        Chcesz mieć program u siebie? <a href="https://smartstrzelnica.pl/" target="_blank" style="text-decoration: none;" class="text-positive">smartstrzelnica.pl</a>
      </label>
      <q-card-section>
        <div class="row text-positive">
          <q-checkbox v-model="nonMember" dense class="text-positive self-center col"
          @input="pesel = '', member = null, phone = '', otherPerson = null, acceptNote = true"
          label="Nie Jestem Klubowiczem" />
          <ShootingPlaceStatutePanaszew v-if="shootingPlace === 'rcs'" class="q-pa-xs"></ShootingPlaceStatutePanaszew>
          <ShootingPlaceStatuteDziesiątka v-if="shootingPlace === 'prod'" class="q-pa-xs">
          </ShootingPlaceStatuteDziesiątka>
          <ShootingPlaceStatuteDziesiątka v-if="shootingPlace === 'test'" class="q-pa-xs">
          </ShootingPlaceStatuteDziesiątka>
          <RCSPanaszewRODO v-if="shootingPlace === 'rcs'" class="q-pa-xs"></RCSPanaszewRODO>
        </div>
        <div v-if="!nonMember" class="row q-mb-xs">
          <q-input v-model="pesel" label-color="white" standout="" bg-color="primary" rounded class="col"
            input-class="text-white text-body1" label="Wpisz numer PESEL" inputmode="numeric"
            :type="isPwd ? 'password' : 'text'" onkeypress="return (event.charCode > 47 && event.charCode < 58)"
            @input="pesel.length > 10 ? getMemberByPesel(pesel) : member = null;" mask="###########">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <q-btn-dropdown unelevated v-model="openKeyboard" class="q-mb-xs col-1" content-class="bg-dark rounded"
            content-style="border: none" color="primary" glossy rounded>
            <template v-slot:label>
              <div class="col items-left">
                <q-icon left name="keyboard" class="col" />
              </div>
            </template>
            <div class="row">
              <q-btn @click="addNumberToPesel(7)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">7</q-btn>
              <q-btn @click="addNumberToPesel(8)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">8</q-btn>
              <q-btn @click="addNumberToPesel(9)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">9</q-btn>
            </div>
            <div class="row">
              <q-btn @click="addNumberToPesel(4)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">4</q-btn>
              <q-btn @click="addNumberToPesel(5)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">5</q-btn>
              <q-btn @click="addNumberToPesel(6)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">6</q-btn>
            </div>
            <div class="row">
              <q-btn @click="addNumberToPesel(1)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">1</q-btn>
              <q-btn @click="addNumberToPesel(2)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">2</q-btn>
              <q-btn @click="addNumberToPesel(3)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">3</q-btn>
            </div>
            <div class="row">
              <q-btn @click="substractNumberFromPesel()" size="1.5em" color="red" glossy rounded style="width: 10vw"
                class="col q-ma-xs">C</q-btn>
              <q-btn @click="addNumberToPesel(0)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">0</q-btn>
              <q-btn @click="reset()" size="1.5em" color="secondary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">reset</q-btn>
            </div>
          </q-btn-dropdown>
          <q-btn glossy class="q-ml-xs text-body1" color="primary" rounded label="resetuj" @click="reset()"></q-btn>
        </div>
        <div v-if="nonMember" class="row q-mb-xs">
          <q-input v-model="phone" :disable="rememberMe" label-color="white" standout="" bg-color="secondary" rounded
            class="col" @input="phone.length > 10 ? getOtherbyPhone(phone) : otherPerson = null"
            input-class="text-white"
            :label="rememberMe ? 'Wypełnij pola poniżej' : 'Jeśli zostawiłeś nam numer telefonu to wpisz go tutaj'"
            mask="### ### ###" :type="isPwd ? 'password' : 'tel'"
            onkeypress="return (event.charCode > 47 && event.charCode < 58)">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <q-btn-dropdown unelevated v-model="openKeyboard" class="q-mb-xs col-1" content-class="bg-dark rounded"
            content-style="border: none" color="secondary" glossy rounded>
            <template v-slot:label>
              <div class="col items-left">
                <q-icon left name="keyboard" class="col" />
              </div>
            </template>
            <div class="row">
              <q-btn @click="addNumberToPhone(7)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">7</q-btn>
              <q-btn @click="addNumberToPhone(8)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">8</q-btn>
              <q-btn @click="addNumberToPhone(9)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">9</q-btn>
            </div>
            <div class="row">
              <q-btn @click="addNumberToPhone(4)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">4</q-btn>
              <q-btn @click="addNumberToPhone(5)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">5</q-btn>
              <q-btn @click="addNumberToPhone(6)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">6</q-btn>
            </div>
            <div class="row">
              <q-btn @click="addNumberToPhone(1)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">1</q-btn>
              <q-btn @click="addNumberToPhone(2)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">2</q-btn>
              <q-btn @click="addNumberToPhone(3)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">3</q-btn>
            </div>
            <div class="row">
              <q-btn @click="substractNumberFromPhone()" size="1.5em" color="red" glossy rounded style="width: 10vw"
                class="col q-ma-xs">C</q-btn>
              <q-btn @click="addNumberToPhone(0)" size="1.5em" color="primary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">0</q-btn>
              <q-btn @click="reset()" size="1.5em" color="secondary" glossy rounded style="width: 10vw"
                class="col q-ma-xs">reset</q-btn>
            </div>
          </q-btn-dropdown>
          <q-btn glossy class="q-ml-xs text-body1" color="primary" rounded label="resetuj" @click="reset()"></q-btn>
        </div>
        <div v-if="member != null && !nonMember" class="row rounded"
          :style="`background-image: linear-gradient(to right, var(--${member.active ? 'green' : 'red'}-10), var(--${member.license.number != null && !member.license.valid ? 'warning' : member.active ? 'green' : 'red'}-4), var(--${member.license.number != null && !member.license.valid ? 'warning' : member.active ? 'green' : 'red'}-10))`">
          <div style="min-height: 10vh;" @click="visible = false" class="col-3" v-if="member.image != null">
            <q-img contain fit=none style="max-height: 25vh;" class="text-body1" alt="zdjęcie profilowe"
              :src="(`${local}/files/getFile?uuid=${member.image}`)" />
          </div>
          <div class="col text-bold text-black" :class="member.active ? 'col' : 'col-5'">
            <div class="q-mt-xs q-pl-md text-h6">{{ member.firstName }} {{ member.secondName }}</div>
            <div class="q-mt-xs q-pl-md">Numer Legitymacji: {{ member.legitimationNumber }}</div>
            <div class="q-mt-xs q-pl-md" :class="member.active ? '' : 'text-bold text-h6 bg-warning rounded pulse'">
              Składka ważna do: {{
                convertDate(member.history.contributionList[0].validThru) }}</div>
            <div class="q-mt-xs q-pl-md" v-if="member.shootingPatent.patentNumber != null">Patent numer: {{
              member.shootingPatent.patentNumber }} {{ member.shootingPatent.pistolPermission ? 'P' : '' }}{{
                member.shootingPatent.riflePermission ? 'K' : '' }}{{ member.shootingPatent.shotgunPermission ? 'S' : ''
              }}
            </div>
            <div class="q-mt-xs q-pl-md" v-if="member.license.number != null"
              :class="member.license.valid ? '' : 'bg-red rounded pulse'">Licencja numer: {{ member.license.number }}
              Ważna do: {{
                convertDate(member.license.validThru) }}</div>
            <div class="q-mt-xs q-pl-md" v-if="member.weaponPermission.number != null">Pozwolenie numer: {{
              member.weaponPermission.number }}</div>
            <div class="q-mt-xs q-pl-md">Ilość startów: Pistolet: {{ member.history.pistolCounter }} Karabin: {{
              member.history.rifleCounter }} Strzelba: {{ member.history.shotgunCounter }}</div>
          </div>
          <div v-if="member != null" class="self-center text-left col-4">
            <div v-if="!member.active" class="text-bold text-h6" style="display: flex; justify-content: left;">
              - Ureguluj swoje składki członkowskie!</div>
            <div v-if="member.license.number != null && !member.license.valid" class="text-bold text-h6"
              style="display: flex; justify-content: left;">
              - Masz nieaktualną licencję zadowniczą!</div>
            <div v-if="member.note != null" class="text-bold text-h6 col" style="display: flex; justify-content: left;">
              <div class="col">
                <q-btn label="odczytaj notatkę" color="secondary" class="pulse" rounded @click="note = true" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="otherPerson != null">
          <div class="text-positive">
            <div dense class="q-mt-xs q-pl-md">Imię i Nazwisko: {{ otherPerson.firstName }} {{ otherPerson.secondName }}
            </div>
            <div dense class="q-mt-xs q-pl-md">Klub: {{ otherPerson.club.shortName }}</div>
            <div dense class="q-mt-xs q-pl-md" v-if="otherPerson.address != null">Address: {{
              otherPerson.address.postOfficeCity }} {{ otherPerson.address.zipCode }} {{ otherPerson.address.street }}
              {{ otherPerson.address.streetNumber }} {{ otherPerson.address.flatNumber }}</div>
            <div dense class="q-mt-xs q-pl-md" v-if="otherPerson.weaponPermissionNumber != ''">Pozwolenie na broń: {{
              otherPerson.weaponPermissionNumber }}</div>
          </div>
        </div>
        <div v-if="member == null && otherPerson == null && nonMember" class="col">
          <q-checkbox v-model="rememberMe"
            @input="nonMemberClubName = ''; nonMemberPhoneNumber = ''; getAllClubsToTournament()"
            class="text-positive full-width"
            label="Zapamiętaj Mnie - twoje dane będą przechowywane w celach rejestracji pobytu na strzelnicy i startu w zawodach klubowych" />
          <q-input class="rounded q-pl-md" v-model="nonMemberFirstName" filled label="Imię *" dense
            input-class="text-positive" label-color="positive"
            :style="`${nonMemberFirstName == '' ? 'border: 1px solid green;' : ''}`"
            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 45" />
          <q-input class="rounded q-pl-md" v-model="nonMemberSecondName" filled label="Nazwisko *" dense
            input-class="text-positive" label-color="positive"
            :style="`${nonMemberSecondName == '' ? 'border: 1px solid green;' : ''}`"
            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 45" />
          <q-checkbox v-model="rodo" class="text-positive full-width rounded"
            :style="`${!rodo ? 'border: 1px solid green;' : ''}`">Zgoda na przetwarzanie danych
            osobowych *</q-checkbox>
          <div v-if="rememberMe" class="row">
            <div class="col">
              <div class="row">
                <q-checkbox class="text-positive" left-label color="primary" false-value="" true-value="BRAK"
                  v-model="nonMemberClubName" :val="'BRAK'" label="Brak Klubu" />
                <q-select v-if="nonMemberClubName !== 'BRAK'" dense options-dense
                  popup-content-class="bg-dark text-positive" class="col rounded" input-class="text-positive"
                  label-color="positive" hide-selected use-chips filled v-model="nonMemberClubName" use-input fill-input
                  input-debounce="0" :options="filterOptions"
                  :style="`${nonMemberClubName == '' ? 'border: 1px solid green;' : ''}`" @filter="filterFna"
                  label="Wybierz Klub *">
                  <template v-slot:no-option>
                    <q-item dense>
                      <q-item-section class="text-grey">
                        Brak wyników
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <q-input v-model="nonMemberPhoneNumber" label="Numer Telefonu *" filled
                :style="`${nonMemberPhoneNumber == '' || nonMemberPhoneNumber.length < 11 ? 'border: 1px solid green;' : ''}`"
                dense input-class="text-positive" class="rounded" mask="### ### ###" label-color="positive" />
            </div>
            <div class="col self-center text-positive text-h6 text-bold q-pl-md"
              style="display: flex; justify-content: center;">Jeśli
              twojego klubu nie ma na wykazie poinformuj o tym obsługę</div>
          </div>
          <div class="row text-positive rounded">
            <q-radio v-model="address" @input="permission = false" val="true" color="primary"
              :style="`${!address && !permission ? 'border: 1px solid green;' : ''}`"
              class="text-positive self-center rounded q-pr-md q-pl-md">Adres zamieszkania *</q-radio>
            <div class="self-center text-white">&nbsp; / &nbsp;</div>
            <q-radio v-model="permission" @input="address = false" val="true" color="primary"
              :style="`${!address && !permission ? 'border: 1px solid green;' : ''}`"
              class="text-positive self-center rounded q-pr-md q-pl-md">Numer Pozwolenia na Broń *</q-radio>
          </div>
          <div v-if="address">
            <q-input class="rounded q-pl-md" filled v-model="nonMemberPostOfficeCity" label="Miasto *" dense
              input-class="text-positive" label-color="positive"
              :style="`${nonMemberPostOfficeCity == '' ? 'border: 1px solid green;' : ''}`" />
            <q-input class="rounded q-pl-md" filled v-model="nonMemberZipCode" label="Kod Pocztowy *" mask="##-###"
              dense input-class="text-positive" label-color="positive"
              :style="`${nonMemberZipCode == '' || nonMemberZipCode.length < 6 ? 'border: 1px solid green;' : ''}`" />
            <q-input class="rounded q-pl-md" filled v-model="nonMemberStreet" label="Ulica *" dense
              input-class="text-positive" label-color="positive"
              :style="`${nonMemberStreet == '' ? 'border: 1px solid green;' : ''}`" />
            <q-input class="rounded q-pl-md" filled v-model="nonMemberStreetNumber"
              @input="nonMemberStreetNumber.length === 0 ? nonMemberStreetNumber = '' : ''" label="Numer Ulicy *" dense
              input-class="text-positive" label-color="positive"
              :style="`${nonMemberStreetNumber == '' ? 'border: 1px solid green;' : ''}`" />
            <q-input class="rounded q-pl-md" filled v-model="nonMemberFlatNumber"
              @input="nonMemberFlatNumber.length === 0 ? nonMemberFlatNumber = '' : ''" label="Numer Mieszkania" dense
              input-class="text-positive" label-color="positive" />
          </div>
          <div v-if="permission">
            <q-input class="rounded q-pl-md" filled v-model="nonMemberWeaponPermissionNumber"
              :style="`${nonMemberWeaponPermissionNumber == '' ? 'border: 1px solid green;' : ''}`"
              @input="nonMemberWeaponPermissionNumber.length === 0 ? nonMemberWeaponPermissionNumber = '' : ''"
              label="Numer pozwolenia na Broń" dense input-class="text-positive" label-color="positive" />
          </div>
        </div>
      </q-card-section>
      <div
        v-if="member != null || otherPerson != null || (nonMemberFirstName != '' && nonMemberSecondName != '' && nonMemberZipCode != '' && nonMemberPostOfficeCity != '' && nonMemberStreet != '' && nonMemberStreetNumber != '') || (nonMemberWeaponPermissionNumber != '' && nonMemberWeaponPermissionNumber.length > 3)">
        <div class="text-positive col text-h6 text-center ">Podpisz poniżej</div>
        <q-card-section class="q-pa-none q-ma-none">
          <div style="padding-left: 12.5vw; padding-right: 12.5vw;" align="right">
            <VueSignaturePad id="canvas" ref="signaturePad" height="25vh" style="background-color: white;" />
            <q-btn glossy @click="clear()" class="q-mt-xs" label="wyczyść" color="secondary"></q-btn>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-none q-ma-none">
          <div class="row">
            <div class="full-width" align="right">
              <q-checkbox color="primary" keep-color left-label v-model="statementOnReadingTheShootingPlaceRegulations"
                class="text-positive q-mr-xl">Zapoznałem się z
                regulaminem strzelnicy i {{shootingPlace === 'rcs' ? 'RODO' : 'polityką prywatności'}}</q-checkbox>
            </div>
            <q-card-actions align="left" class="text-positive col-3">
              <label>
                Chcesz mieć program u siebie? <a href="https://smartstrzelnica.pl/" target="_blank">smartstrzelnica.pl</a>
              </label>
            </q-card-actions>
            <q-card-actions align="right" class="col text-right">
              <div class="col row text-positive">
                <div v-if="member != null && member.note != null && !acceptNote" class="text-caption text-center col">{{
                  !acceptNote ? 'Notatka'
                    : ''
                }}</div>
                <div class="text-caption text-center col">{{ !rodo ? 'RODO' :
                  '' }}
                </div>
                <div class="text-caption text-center col">{{
                  !statementOnReadingTheShootingPlaceRegulations ?
                    'Regulamin' : '' }}</div>
                <div class="col">
                  <q-btn glossy :loading="loading[0]" :disable="dis" class="q-mr-xl"
                    v-if="statementOnReadingTheShootingPlaceRegulations && acceptNote && rodo && (member != null || otherPerson != null || (nonMemberFirstName != '' && nonMemberSecondName != ''))"
                    @click="dis = true; simulateProgress()" label="zapisz" color="primary"></q-btn>
                  <q-btn glossy v-else label="zapisz" color="grey" class="q-mr-xl">
                    <q-tooltip
                      v-if="!statementOnReadingTheShootingPlaceRegulations || !rodo || !acceptNote || nonMemberClubName == ''"
                      content-class="text-h6 bg-primary" :offset="[0, 35]" self="bottom middle" anchor="top middle">
                      <div v-if="!statementOnReadingTheShootingPlaceRegulations">-> Zaakceptuj zapoznanie się z
                        regulaminem na strzelnicy</div>
                      <div v-if="!rodo">-> Zaakceptuj politykę prywatności</div>
                      <div v-if="nonMemberClubName == '' && nonMember && rememberMe">-> Wybierz Klub (Wybierz "BRAK"
                        jeśli nie
                        ma przynależności)</div>
                      <div v-if="member != null && member.note != null && !acceptNote">-> Potwierdź odczytanie notatki
                      </div>
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-actions>
          </div>

        </q-card-section>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 60]">
        <q-btn dense round icon="arrow_upward" color="primary" @click="scrollUpward()"><q-tooltip
            content-class="text-caption bg-secondary text-center" anchor="top middle" self="bottom middle">Przewiń do
            góry
            strony</q-tooltip></q-btn>
      </q-page-sticky>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn dense round icon="arrow_downward" color="primary" @click="scrollDownward()"><q-tooltip
            content-class="text-caption bg-secondary text-center" anchor="top middle" self="bottom middle">Przewiń do
            dołu
            strony</q-tooltip></q-btn>
      </q-page-sticky>
    </q-card>
    <q-dialog position="standard" v-model="failure" persistent>
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="note" :persistent="!acceptNote" v-if="member != null">
      <q-card class="bg-dark text-positive rounded" style="min-width: 50vw;">
        <q-card-actions align="right">
          <div class="text-h5 text-center text-bold col">Notatka dla Klubowicza</div>
          <q-btn v-if="!acceptNote" class="col-3" @click="reset()" label="zamknij i zresetuj" color="primary" rounded />
          <q-btn v-if="acceptNote" icon="close" @click="note = false" color="primary" round v-close-popup />
        </q-card-actions>
        <q-card-section>
          <div class="text-h6 text-center">{{ member.note }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn @click="acceptNote = true, note = false" glossy rounded :color="!acceptNote ? 'secondary' : 'green'"
            v-close-popup>
            <div>
              <div class="col">
                {{ !acceptNote ? 'Potwierdź odczytanie notatki' : 'Potwierdzono - Zamknij' }}
              </div>
            </div>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss"></style>
<script>

import Vue from 'vue'
import App from 'src/App'
import VueSignature from 'vue-signature-pad'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import { scroll } from 'quasar'
const { setVerticalScrollPosition } = scroll
Vue.use(VueSignature)
export default {
  components: {
    ShootingPlaceStatutePanaszew: lazyLoadComponent({
      componentFactory: () => import('components/statutes/ShootingPlaceStatutePanaszew'),
      loading: SkeletonBox
    }),
    ShootingPlaceStatuteDziesiątka: lazyLoadComponent({
      componentFactory: () => import('components/statutes/ShootingPlaceStatuteDziesiątka'),
      loading: SkeletonBox
    }),
    RCSPanaszewRODO: lazyLoadComponent({
      componentFactory: () => import('components/RODO/RCSPanaszewRODO'),
      loading: SkeletonBox
    })
  },
  setup () {
    function simulateProgress () {
      this.loading[0] = true
      if (this.dis) {
        if (this.nonMember) {
          this.saveNonMember()
        } else {
          this.save()
        }
      }
      setTimeout(() => {
        this.loading[0] = false
      }, 1000)
    }

    return {
      simulateProgress
    }
  },
  data () {
    return {
      loading: [false],
      acceptNote: false,
      note: false,
      openKeyboard: false,
      isPwd: true,
      dis: false,
      member: null,
      otherPerson: null,
      pesel: '',
      phone: '',
      nonMemberFirstName: '',
      nonMemberSecondName: '',
      nonMemberPhoneNumber: '',
      nonMemberZipCode: '',
      nonMemberPostOfficeCity: '',
      nonMemberStreet: '',
      nonMemberStreetNumber: '',
      nonMemberFlatNumber: '',
      nonMemberWeaponPermissionNumber: '',
      nonMemberClubName: '',
      filterOptions: [],
      clubs: [],
      statementOnReadingTheShootingPlaceRegulations: false,
      rememberMe: false,
      rodo: false,
      nonMember: false,
      address: false,
      permission: false,
      success: false,
      failure: false,
      message: null,
      shootingPlace: window.localStorage.getItem('shootingPlace'),
      local: App.host
    }
  },
  created () {
    window.localStorage.setItem('SiteName', 'Rejestr Pobytu na Strzelnicy')
    window.localStorage.setItem('drawer', 'false')
  },
  methods: {
    getMemberByPesel (PESEL) {
      fetch(`${this.local}/member/PESEL/${PESEL}`, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(response => {
            this.rodo = true
            this.member = response
            if (this.member.note == null) {
              this.acceptNote = true
            } else {
              this.note = true
            }
          })
        } else {
          response.text().then(response => {
            this.member = null
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    datePlusOneMonth () {
      const date = new Date()
      date.setMonth(date.getMonth() + 1)
      return date.toLocaleDateString().replaceAll('.', '-')
    },
    scrollUpward () {
      setVerticalScrollPosition(window, 0, 500)
    },
    scrollDownward () {
      setVerticalScrollPosition(window, window.outerHeight, 500)
    },
    reset () {
      this.nonMember = false
      this.acceptNote = false
      this.isPwd = true
      this.member = null
      this.otherPerson = null
      this.pesel = ''
      this.phone = ''
      this.nonMemberZipCode = ''
      this.nonMemberPostOfficeCity = ''
      this.nonMemberStreet = ''
      this.nonMemberStreetNumber = ''
      this.nonMemberFlatNumber = ''
      this.nonMemberWeaponPermissionNumber = ''
      this.nonMemberFirstName = ''
      this.nonMemberSecondName = ''
      this.nonMemberPhoneNumber = ''
      this.statementOnReadingTheShootingPlaceRegulations = false
      this.rememberMe = false
      this.address = false
      this.rodo = false
      this.permission = false
    },
    getOtherbyPhone (phone) {
      fetch(`${this.local}/other/getOhterByPhone/${phone}`, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(response => {
            this.acceptNote = true
            this.rodo = true
            this.otherPerson = response
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    getAllClubsToTournament () {
      fetch(`${this.local}/club/tournament`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubs = response
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
    filterFna (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.clubs
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.clubs.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    save () {
      const { data } = this.$refs.signaturePad.saveSignature()
      const { isEmpty } = this.$refs.signaturePad.saveSignature()
      const dat = {
        imageString: data
      }
      if (!isEmpty) {
        fetch(`${this.local}/evidence/?pesel=${this.pesel}`, {
          method: 'POST',
          body: JSON.stringify(dat)
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              if (this.member.note != null) {
                this.addNote(this.member.uuid, null)
              }
              this.reset()
              this.clear()
              this.message = response
              this.success = true
            })
          } else {
            response.text().then(response => {
              this.reset()
              this.clear()
              this.message = response
              this.failure = true
            })
          }
        })
      } else {
        this.message = 'Podpisz się'
        this.failure = true
      }
      this.autoClose()
    },
    saveNonMember () {
      const other = {
        id: this.otherPerson !== null ? this.otherPerson.id : null,
        firstName: this.nonMemberFirstName,
        secondName: this.nonMemberSecondName,
        phoneNumber: this.nonMemberPhoneNumber,
        weaponPermissionNumber: this.nonMemberWeaponPermissionNumber,
        address: {
          zipCode: this.nonMemberZipCode,
          postOfficeCity: this.nonMemberPostOfficeCity,
          street: this.nonMemberStreet,
          streetNumber: this.nonMemberStreetNumber,
          flatNumber: this.nonMemberFlatNumbenr
        },
        club: {
          shortName: this.nonMemberClubName
        }
      }
      const { data } = this.$refs.signaturePad.saveSignature()
      const { isEmpty } = this.$refs.signaturePad.saveSignature()
      const dat = {
        imageString: data,
        other: other
      }
      if (!isEmpty) {
        fetch(`${this.local}/evidence/other?phone=${this.phone}&rememberMe=${this.rememberMe}`, {
          method: 'POST',
          body: JSON.stringify(dat),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              this.reset()
              this.clear()
              this.message = response
              this.success = true
            })
          } else {
            response.text().then(response => {
              this.reset()
              this.clear()
              this.message = response
              this.failure = true
            })
          }
        })
      } else {
        this.message = 'Podpisz się'
        this.failure = true
      }
      this.autoClose()
    },
    clear () {
      this.$refs.signaturePad.clearSignature()
    },
    addNote (uuid, note) {
      fetch(`${this.local}/member/note?uuid=${uuid}&note=${note}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(note)
      })
    },
    addNumberToPesel (number) {
      this.pesel = this.pesel + number
      if (this.pesel.length > 10) {
        this.getMemberByPesel(this.pesel)
        this.openKeyboard = false
      } else {
        this.member = null
      }
    },
    substractNumberFromPesel () {
      if (this.pesel.length > 0) {
        this.pesel = this.pesel.substring(0, this.pesel.length - 1)
      }
      if (this.pesel.length < 11) {
        this.member = null
      }
    },
    addNumberToPhone (number) {
      this.phone = this.phone + number
      if (this.phone.length > 10) {
        this.getOtherbyPhone(this.phone)
        this.openKeyboard = false
      } else {
        this.other = null
      }
    },
    substractNumberFromPhone () {
      if (this.phone.length > 0) {
        this.phone = this.phone.substring(0, this.phone.length - 1)
      }
      if (this.phone.length < 11) {
        this.other = null
      }
    },
    autoClose () {
      setTimeout(() => {
        this.dis = false
        this.message = null
        this.success = false
        this.failure = false
      }, 2000)
    }
  }
}
</script>
