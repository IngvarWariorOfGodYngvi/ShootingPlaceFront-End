<template>
  <q-page padding>
    <div :class="!mobile ? 'row' : 'col'">
      <q-card class="col bg-dark text-positive">
        <div class="row">
          <div class="col row">
            <q-btn v-if="AddGroupAmmoExp" :class="mobile ? 'col-6' : 'col-4'" label="Dodaj Amunicję" color="primary" @click="open=!open"></q-btn>
            <q-btn v-if="AddSingleAmmoExp" :class="mobile ? 'col-6' : 'col-4'" label="Dodaj osobę do listy" color="primary"
              @click="getOther(); addAmmo = true">
            </q-btn>
            <q-btn v-if="GunListExp" :class="mobile ? 'col-6' : 'col-4'" label="Dodaj broń do listy" color="primary"
              @click="getOther(); addGun = true">
            </q-btn>
            <q-btn-dropdown v-if="AddShootingPacketExp" :class="mobile ? 'col-6' : 'col-4'" label="pakiety" color="primary" content-class="bg-dark">
              <div>
                <q-item>
                  <q-btn label="wydaj pakiet" @click="packet=true" color="primary" class="full-width"></q-btn>
                </q-item>
                <q-item v-if="main"><q-btn @click="createNewPacket=true" label="konfiguruj nowy pakiet"  color="primary" class="full-width"></q-btn></q-item>
              </div>
            </q-btn-dropdown>
          </div>
          <div v-if="ammoList != null && ammoList.forceOpen" class="col-9">
            <div class=" q-pa-md bg-red-3 text-center text-black text-bold">UWAGA! LISTA OTWARTA PONOWNIE. NA KONIEC
              DNIA PAMIĘTAJ
              O JEJ ZAMKNIĘCIU!
            </div>
          </div>
        </div>
        <div class="text-h5 text-bold" v-if="ammoList.length <= 0">
          <q-item>
            <q-item-section>
              Brak aktywnej listy amunicji
            </q-item-section>
          </q-item>
        </div>
        <div v-else class="col">
          <div class="row">
            <q-item class="text-h5 text-bold col">
              Lista Amunicji {{ convertDate(ammoList.date) }} numer {{ ammoList.number }}
            </q-item>
            <q-item v-if="main">
              <q-item-section side top>
                <q-btn color="primary" @click="uuid = ammoList.uuid; confirmation = true" icon="lock">
                  <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Zamknij
                    listę
                  </q-tooltip>
                </q-btn>
              </q-item-section>
              <q-item-section side top>
                <AmmoListDownloadBtn :uuid="ammoList.uuid" :date="ammoList.date" />
              </q-item-section>
            </q-item>
          </div>
          <div v-for="(ammoInEvidenceDTOList, uuid) in ammoList.ammoInEvidenceDTOList" :key="uuid">
            <q-item dense>
              <q-item-label class="text-h6">
                Kaliber {{ ammoInEvidenceDTOList.caliberName }}
              </q-item-label>
            </q-item>
            <div class="col">
              <div class="row"
                v-for="(ammoUsedToEvidenceDTOList, uuid) in ammoInEvidenceDTOList.ammoUsedToEvidenceDTOList" :key="uuid">
                <div class="row full-width"
                  @dblclick="legitimationNumber = ammoUsedToEvidenceDTOList.legitimationNumber; memberDial = legitimationNumber != null">
                  <q-tooltip v-if="!mobile" content-style="width: 20vw" :delay="1500" :hide-delay="500"
                    @hide="personalAmmoFromList = []"
                    @before-show="getPersonalAmmoFromList(ammoUsedToEvidenceDTOList.legitimationNumber, ammoUsedToEvidenceDTOList.idnumber, ammoList.uuid)"
                    content-class="bg-primary text-body2 text-bold" anchor="top middle">
                    <div v-if="personalAmmoFromList.length > 0" class="text-center">{{ personalAmmoFromList[0].name }}
                    </div>
                    <div class="row text-center">
                      <div class="col">Kaliber</div>
                      <div class="col">Ilość</div>
                    </div>
                    <div v-for="(item, index) in personalAmmoFromList" :key="index" class="row text-center">
                      <div class="col">{{ item.caliberName }}</div>
                      <div class="col">{{ item.counter }}szt.</div>
                    </div>
                  </q-tooltip>
                  <q-field color="positive" dense class="col-10 text-positive" standout="bg-accent text-positive"
                    label-color="positive" label="osoba" stack-label>
                    <div class="row text-positive">{{ ammoUsedToEvidenceDTOList.name }}</div>
                  </q-field>
                  <div class="col-2"
                    @click="mobile ? (getPersonalAmmoFromList(ammoUsedToEvidenceDTOList.legitimationNumber, ammoUsedToEvidenceDTOList.idnumber, ammoList.uuid), personalAmmoFromListInfo = true) : ''">
                    <q-field dense standout="bg-accent text-positive" label="ilość" label-color="positive" stack-label>
                      <div class="row text-positive">{{ ammoUsedToEvidenceDTOList.counter }}</div>
                    </q-field>
                  </div>
                </div>
              </div>
              <div class="row reverse">
                <q-field class="col-2 bg-dark text-positive" dense standout="bg-accent text-positive"
                  label-color="positive" label="suma" stack-label>
                  <div class="text-positive">{{ ammoInEvidenceDTOList.quantity }}</div>
                </q-field>
              </div>
            </div>
          </div>
        </div>
      </q-card>
      <q-card v-if="GunListExp" class="col-4 bg-dark">
        <div>
          <q-item>
            <q-item-label class="text-h5 text-bold text-positive">
              Lista Broni w Użyciu
            </q-item-label>
          </q-item>
          <q-btn v-if="gunsInUsed.length > 0" class="full-width" color="primary" @click="weaponConfirmation = true"
            label="Zwróć wszystko do magazynu">
          </q-btn>
          <div v-for="(item, index) in gunsInUsed" :key="index">
            <q-btn class="full-width q-ma-xs" dense color="primary"
              @dblclick="!mobile ? returnToStore(item.gunUUID) : (gunUUID = item.gunUUID, gunImage = true)"
              @click="gunUUID = item.gunUUID; gunImage = true">
              <q-tooltip :delay="500" content-style="width: 50%; height: 60%;background-image: url('img/logo-panaszew.jpg');
                background-repeat: no-repeat;
                background-position: center;
                background-attachment: fixed;" anchor="top middle" self="top middle" transition-show="scale"
                transition-hide="scale">
                <div style="height: 100%; width: 100%;opacity: 0.92;">
                  <q-img spinner-color="white" ratio="1" contain style="height: 100%; width: 100%;"
                    :src="('http://' + local + '/files/getGunImg?gunUUID=' + item.gunUUID)" />
                </div>
              </q-tooltip>
              <div class="col q-pa-none q-ma-none">
                <q-item-label>{{ item.gunName }}</q-item-label>
                <q-item-label>{{ item.gunSerialNumber }}</q-item-label>
                <q-item-label v-if="item.userName != null">{{ item.userName }}</q-item-label>
              </div>
            </q-btn>
          </div>
        </div>
      </q-card>
      <q-card v-if="!mobile" class="col-2 bg-dark">
        <div>
          <q-item>
            <q-item-label class="text-h5 text-bold text-positive">
              Zamknięte listy
            </q-item-label>
          </q-item>
          <div class="row full-width bg-secondary q-mb-xs">
            <q-btn icon="arrow_left" @click="pageNumber = pageNumber - 1; getClosedEvidence(pageNumber)"
              :disable="pageNumber === 0" class="col-2" text-color="positive" color="primary"></q-btn>
            <div class="self-center text-bold text-center text-white col">STRONA {{ pageNumber + 1 }}</div>
            <q-btn icon="arrow_right"
              @click="pageNumber = ammoListClose.length === 50 ? pageNumber + 1 : pageNumber; getClosedEvidence(pageNumber)"
              :disabled="ammoListClose.length !== 50" class="col-2" text-color="positive" color="primary"></q-btn>
          </div>
          <div v-for="(item, index) in ammoListClose" :key="index">
            <q-btn class="full-width q-mb-xs" dense text-color="white" color="primary"
              @click="date = item.date; number = item.number; uuid = item.evidenceUUID; getEvidence(); ammunitionListInfo = true">
              <div class="col q-pa-none q-ma-none">
                <q-item-label>{{ item.number + ' ' }}</q-item-label>
                <q-item-label class="text-white" caption>{{ convertDate(item.date) }}</q-item-label>
              </div>
            </q-btn>
          </div>
        </div>
      </q-card>
    </div>
    <q-dialog position="top" v-model="ammunitionListAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano listę z dnia {{ date }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="ammunitionListInfo">
      <q-card class="bg-dark text-positive">
        <q-card-section class="col">
          <div class="col q-pa-xs">
            <div class="text-h6">Informacje dla listy z dnia {{ date }}</div>
            <div class="text-h6">Lista numer {{ number }}</div>
          </div>
          <div class="col q-pa-md">
            <div class="row bg-accent">
              <div class="col h6 text-bold text-center">Kaliber</div>
              <div class="col h6 text-bold text-center">Suma</div>
            </div>
            <div v-for="(item, uuid) in ammunitionListEvidence.ammoInEvidenceEntityList" :key="uuid"
              class="full-width col">
              <div class="row">
                <div class="col text-bold text-center">{{ item.caliberName }}</div>
                <div class="col text-bold text-center">{{ item.quantity }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <AmmoListDownloadBtn :uuid="uuid" :date="date" class="col full-height" />
            <q-item></q-item>
            <q-btn color="primary" class="col full-width full-height" icon="lock_open" @click="openList = true">
              <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Otwórz listę
              </q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addAmmo">
      <div class="bg-dark text-positive">
        <div class="row">
          <q-select label="Wybierz osobę z Klubu" popup-content-class="bg-dark text-positive"
            :option-value="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
            :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
            emit-value map-options options-dense color="positive" input-class="text-positive" label-color="positive" dark
            v-model="memberName" fill-input filled dense use-input hide-selected input-debounce="0" :options="options"
            @input="otherName = '0 0'" @filter="filterFn" class="col">
            <template v-slot:option="option">
              <q-item class="rounded bg-dark text-positive" dense style="padding: 0; margin: 0;" v-bind="option.itemProps"
                v-on="option.itemEvents">
                <q-item-section dense style="padding: 0.5em; margin: 0;"
                  :class="option.opt.active ? '' : 'bg-warning rounded'"
                  @click="otherName = '0 0'; memberName = option.opt.secondName + ' ' + option.opt.firstName + ' ' + option.opt.legitimationNumber">
                  <div>{{ option.opt.secondName }} {{ option.opt.firstName }}
                    {{ option.opt.legitimationNumber }} {{ option.opt.adult ? 'Ogólna' : 'Młodzież' }} {{
                      option.opt.active ? '' : ' - BRAK SKŁADEK' }}
                  </div>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select @popup-show="getOther()" @popup-hide="getOther()" options-dense class="col" dense filled
            v-model="otherName" use-input hide-selected fill-input input-debounce="0" color="positive"
            input-class="text-positive" label-color="positive" popup-content-class="bg-dark text-positive"
            :options="options1" @input="memberName = '0 0'" @filter="filterOther" label="Dodaj osobę spoza klubu">
            <template v-slot:no-option>
              <div class="bg-dark text-center text-bold text-positive">
                <div class="q-pa-md bg-dark text-center text-bold text-positive">Brak wyników - możesz dodać nową
                  osobę
                </div>
                <AddNewOtherPerson></AddNewOtherPerson>
              </div>
            </template>
          </q-select>
        </div>
        <div class="row">
          <div class="full-width">
            <q-radio v-model="caliberUUID" v-for="(calibers, uuid) in calibers" :key="uuid" :val="calibers.uuid">
              <div class="full-width text-positive text-left q-pa-md cursor-pointer">{{ calibers.name }}</div>
            </q-radio>
          </div>
        </div>
        <div class="col">
          <q-input v-model="ammoQuantity" class="full-width col" color="positive" label-color="positive"
            input-class="text-positive" dense filled label="Ilość Amunicji"
            onkeypress="return (event.charCode > 44 && event.charCode < 58)" placeholder="Tylko cyfry" type="number"
            @keypress.enter="dis = true; simulateProgress(0)"></q-input>
          <q-card-actions class="row" align="right">
            <q-item>
              <q-btn class="full-width col" color="primary" icon="close" @click="memberName = ''; otherName = ''"
                v-close-popup></q-btn>
            </q-item>
            <q-item>
              <q-btn class="full-width col" color="primary" :loading="loading[0]" icon="done"
                :disable="dis || ammoQuantity.length === 0 || caliberUUID == null"
                @click="dis = true; simulateProgress(0);"></q-btn>
            </q-item>
          </q-card-actions>
        </div>
      </div>
    </q-dialog>
    <q-dialog v-model="packet">
      <AddShootingPacket @hook:destroyed="getAmmoData()"></AddShootingPacket>
    </q-dialog>
    <q-dialog v-model="addGun">
      <div class="bg-dark text-positive">
        <div class="row">
          <q-select label="Wybierz osobę z Klubu" popup-content-class="bg-dark text-positive"
            :option-value="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
            :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
            emit-value map-options options-dense color="positive" input-class="text-positive" label-color="positive" dark
            v-model="memberName" fill-input filled dense use-input hide-selected input-debounce="0" :options="options"
            @input="otherName = '0 0'" @filter="filterFn" class="col">
            <template v-slot:option="option">
              <q-item class="rounded bg-dark text-positive" dense style="padding: 0; margin: 0;" v-bind="option.itemProps"
                v-on="option.itemEvents">
                <q-item-section dense style="padding: 0.5em; margin: 0;"
                  :class="option.opt.active ? '' : 'bg-warning rounded'"
                  @click="otherName = '0 0'; memberName = option.opt.secondName + ' ' + option.opt.firstName + ' ' + option.opt.legitimationNumber">
                  <div>{{ option.opt.secondName }} {{ option.opt.firstName }}
                    {{ option.opt.legitimationNumber }} {{ option.opt.adult ? 'Ogólna' : 'Młodzież' }} {{
                      option.opt.active ? '' : ' - BRAK SKŁADEK' }}
                  </div>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select @popup-show="getOther()" @popup-hide="getOther()" options-dense class="col" dense filled
            v-model="otherName" use-input hide-selected fill-input input-debounce="0" color="positive"
            input-class="text-positive" label-color="positive" popup-content-class="bg-dark text-positive"
            :options="options1" @input="memberName = '0 0'" @filter="filterOther" label="Dodaj osobę spoza klubu">
            <template v-slot:no-option>
              <div class="bg-dark text-center text-bold text-positive">
                <div class="q-pa-md bg-dark text-center text-bold text-positive">Brak wyników - możesz dodać nową
                  osobę
                </div>
                <AddNewOtherPerson></AddNewOtherPerson>
              </div>
            </template>
          </q-select>
        </div>
        <div class="col">
          <q-input v-model="gunBarcode" autofocus class="full-width col" color="positive" label-color="positive"
            input-class="text-positive" dense filled label="Zeskanuj broń"
            @keypress.enter="dis = true; simulateProgressGun(0, ammoList.uuid, gunBarcode)"></q-input>
          <q-card-actions class="row" align="right">
            <q-item>
              <q-btn class="full-width col" color="primary" icon="close" @click="memberName = ''; otherName = ''"
                v-close-popup></q-btn>
            </q-item>
            <q-item>
              <q-btn class="full-width col" color="primary" :loading="loading[0]" icon="done"
                :disable="dis || addAmmo == null"
                @click="dis = true; simulateProgressGun(0, ammoList.uuid, gunBarcode);"></q-btn>
            </q-item>
          </q-card-actions>
        </div>
      </div>
    </q-dialog>
    <q-dialog v-model="openList" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="openEvidence(); openList = false" autofocus type="password" v-model="code" filled
              color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn id="3" label="otwórz" color="black" v-close-popup @click="openEvidence()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="personalAmmoFromListInfo">
      <q-card class="bg-primary text-body2 text-bold text-white">
        <q-card-section>
          <div v-if="personalAmmoFromList.length > 0" class="text-center">{{ personalAmmoFromList[0].name }}
          </div>
          <div class="row text-center">
            <div class="col">Kaliber</div>
            <div class="col">Ilość</div>
          </div>
          <div v-for="(item, index) in personalAmmoFromList" :key="index" class="row text-center">
            <div class="col">{{ item.caliberName }}</div>
            <div class="col">{{ item.counter }}szt.</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmation"
      @keypress.enter="showloading(); closeEvidence(); getAmmoData(); getClosedEvidence(pageNumber); confirmation = false">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Czy na pewno zamknąć listę amunicyjną</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup
            @click="showloading(); closeEvidence(); getAmmoData(); getClosedEvidence(pageNumber)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="weaponConfirmation"
      @keypress.enter="showloading(); returnToStore(returnToStoreHelper(gunsInUsed)); weaponConfirmation = false">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Czy na pewno oddać broń</div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="zwróć do magazynu" color="primary" v-close-popup
            @click="showloading(); returnToStore(returnToStoreHelper(gunsInUsed))" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="gunImage" @hide="gunUUID = null">
      <!-- <q-card class="bg-dark text-positive" style="width: 100%; height: 70%"> -->
      <!-- <q-card-section style="width: 100%; height: 70%;background-image: url('img/logo-panaszew.jpg');
                background-repeat: no-repeat;
                background-position: center;
                background-attachment: fixed;">
          <q-img v-if="gunUUID != null" spinner-color="white" ratio="1" contain style="height: 100%; width: 100%; opacity: 0.92;"
            :src="('http://' + local + '/files/getGunImg?gunUUID=' + this.gunUUID)" />
        </q-card-section> -->
      <q-card class="bg-dark" style="min-width: 80vw">
        <q-card-section class="flex-center">
          <Gun :uuid="gunUUID" :armory="false"></Gun>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="secondary" label="zwróć do magazynu" class="full-width q-mb-xs" @click="weaponConfirmation = true"
            v-close-popup></q-btn>
          <q-btn color="primary" label="zamknij" class="full-width" @click="gunUUID = null" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card style="min-width: 80vw" class="bg-dark">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="legitimationNumber"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup @click="code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="createNewPacket" style="min-width: 80vw">
      <AddNewShootingPacket></AddNewShootingPacket>
    </q-dialog>
    <q-dialog v-model="open" id="1">
      <AddAmmunition :open="open" @hook:destroyed="getAmmoData()"></AddAmmunition>
    </q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss"></style>
<script>
import { ref } from 'vue'
import { isWindows } from 'mobile-device-detect'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

const stringOptions = []
import App from 'src/App.vue'

export default {
  setup () {
    const loading = ref([
      false
    ])
    const progress = ref(false)

    function simulateProgress (number) {
      loading.value[number] = true
      this.addMemberAndAmmoToCaliber()
      setTimeout(() => {
        loading.value[number] = false
      }, 0)
    }
    function simulateProgressGun (number, evidenceUUID, barcode) {
      loading.value[number] = true
      this.addGunToList(evidenceUUID, barcode)
      setTimeout(() => {
        loading.value[number] = false
      }, 0)
    }

    return {
      loading,
      progress,
      simulateProgress,
      simulateProgressGun
    }
  },
  components: {
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    }),
    AmmoListDownloadBtn: lazyLoadComponent({
      componentFactory: () => import('components/ammoList/ammoListDownloadBtn.vue'),
      loading: SkeletonBox
    }),
    AddNewOtherPerson: lazyLoadComponent({
      componentFactory: () => import('components/AddNewOtherPerson.vue'),
      loading: SkeletonBox
    }),
    Gun: lazyLoadComponent({
      componentFactory: () => import('components/Gun.vue'),
      loading: SkeletonBox
    }),
    AddAmmunition: lazyLoadComponent({
      componentFactory: () => import('components/ammoList/AddAmmunition.vue'),
      loading: SkeletonBox
    }),
    AddNewShootingPacket: lazyLoadComponent({
      componentFactory: () => import('components/ammoList/AddNewShootingPacket.vue'),
      loading: SkeletonBox
    }),
    AddShootingPacket: lazyLoadComponent({
      componentFactory: () => import('components/ammoList/AddShootingPacket.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      pageNumber: 0,
      mobile: !isWindows,
      open: false,
      packet: false,
      AddShootingPacketExp: JSON.parse(window.localStorage.getItem('AddShootingPacket')),
      AddGroupAmmoExp: JSON.parse(window.localStorage.getItem('AddGroupAmmo')),
      AddSingleAmmoExp: JSON.parse(window.localStorage.getItem('AddSingleAmmo')),
      GunListExp: JSON.parse(window.localStorage.getItem('GunList')),
      memberDial: false,
      createNewPacket: false,
      legitimationNumber: null,
      uuid: '',
      gunsInUsed: [],
      personalAmmoFromListInfo: false,
      personalAmmoFromList: [],
      dis: false,
      ammunitionListAlert: false,
      ammunitionListInfo: false,
      number: null,
      ammunitionListEvidence: ['', []],
      ammoList: {
        ammoInEvidenceDTOList: [],
        forceOpen: false
      },
      ammoListClose: [],
      date: '',
      gunImage: false,
      message: null,
      success: false,
      failure: false,
      openList: false,
      confirmation: false,
      weaponConfirmation: false,
      code: null,
      otherName: '',
      addAmmo: false,
      addGun: false,
      gunUUID: null,
      filters: [],
      filtersOther: [],
      calibers: [],
      packets: [],
      caliberUUID: null,
      memberName: '',
      addNewOtherPerson: false,
      ammoQuantity: '',
      gunBarcode: null,
      options: stringOptions,
      options1: stringOptions,
      main: App.main,
      local: App.host
    }
  },
  created () {
    this.getAmmoData()
    this.getClosedEvidence(0)
    this.getListCalibers()
    this.getMembersNames()
    this.getOther()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    back () {
      this.gunImage = false
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
    getPersonalAmmoFromList (legitimationNumber, IDNumber, evidenceUUID) {
      fetch('http://' + this.local + '/ammoEvidence/personalAmmoFromList?legitimationNumber=' + legitimationNumber + '&IDNumber=' + IDNumber + '&evidenceUUID=' + evidenceUUID, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.personalAmmoFromList = response
        })
    },
    getAmmoData () {
      fetch('http://' + this.local + '/ammoEvidence/evidence', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.ammoList = response
          this.getGunInAmmoEvidenceList()
        })
    },
    getGunInAmmoEvidenceList () {
      if (this.GunListExp) {
        fetch('http://' + this.local + '/armory/getGunInAmmoEvidenceList', {
          method: 'GET'
        }).then(response => response.json())
          .then(response => {
            this.gunsInUsed = response
          })
      }
    },
    getClosedEvidence (pageNumber) {
      fetch('http://' + this.local + '/ammoEvidence/closedEvidences?page=' + pageNumber + '&size=50', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.ammoListClose = response
        })
    },
    getEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/oneEvidence?uuid=' + this.uuid, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.ammunitionListEvidence = response
        })
    },
    closeEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/ammo?evidenceUUID=' + this.uuid, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.uuid = null
              this.getAmmoData()
              this.getClosedEvidence(this.pageNumber)
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
    openEvidence () {
      fetch('http://' + this.local + '/ammoEvidence/ammoOpen?evidenceUUID=' + this.uuid + '&pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.code = null
            this.message = response
            this.success = true
            this.ammunitionListInfo = false
            this.getAmmoData()
            this.getClosedEvidence(this.pageNumber)
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.autoClose()
          }
          )
        }
      })
    },
    getMembersNames () {
      fetch('http://' + this.local + '/member/getAllNames', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters = response
        })
    },
    addMemberAndAmmoToCaliber () {
      const memberNameWord = this.memberName.split(' ')
      const legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      const otherNameWord = this.otherName.split(' ')
      const idNumber = otherNameWord.length
      const otherNameID = otherNameWord[idNumber - 1]
      fetch('http://' + this.local + '/ammoEvidence/ammo?caliberUUID=' + this.caliberUUID + '&legitimationNumber=' + memberNameUUID + '&counter=' + this.ammoQuantity + '&otherID=' + otherNameID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.dis = false
            this.ammoQuantity = ''
            this.caliberUUID = null
            this.getAmmoData()
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.dis = false
            this.autoClose()
          })
        }
      })
    },
    addGunToList (evidenceUUID, barcode) {
      const memberNameWord = this.memberName.split(' ')
      const legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      const otherNameWord = this.otherName.split(' ')
      const idNumber = otherNameWord.length
      const otherNameID = otherNameWord[idNumber - 1]
      if (evidenceUUID === 'undefined') {
        evidenceUUID = null
      }
      fetch('http://' + this.local + '/armory/addGunToList?evidenceUUID=' + evidenceUUID + '&barcode=' + barcode + '&legitimationNumber=' + memberNameUUID + '&IDNumber=' + otherNameID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.dis = false
            this.getAmmoData()
            this.autoClose()
          })
        } else {
          response.text().then(response => {
            this.message = response
            this.failure = true
            this.dis = false
            this.autoClose()
          })
        }
      })
    },
    returnToStore (gunUUID) {
      const list = [gunUUID]
      fetch('http://' + this.local + '/armory/returnToStore?gunsUUID=' + list, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.getGunInAmmoEvidenceList()
            this.autoClose()
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
    returnToStoreHelper (gunsInUsed) {
      const list = []
      for (let i = 0; i < gunsInUsed.length; i++) {
        list.push(gunsInUsed[i].gunUUID)
      }
      return list
    },
    getListCalibers () {
      fetch('http://' + this.local + '/armory/calibers', {
        method: 'GET'
      }).then(response => response.json())
        .then(calibers => {
          this.calibers = calibers
        })
    },
    getOther () {
      fetch('http://' + this.local + '/other/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filtersOther = response
        })
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterOther (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options1 = this.filtersOther.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options1 = this.filtersOther.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    autoClose () {
      setTimeout(() => {
        this.ammunitionListAlert = false
        this.success = false
        this.failure = false
        this.message = null
        this.gunBarcode = null
      }, 2000)
    }
  }
}
</script>
