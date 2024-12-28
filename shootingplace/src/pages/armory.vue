<template>
  <q-page padding>
    <q-expansion-item label="Broń" dense class="text-left text-h6 text-bold bg-grey-3 q-mb-md" group="list"
      @show="getGunTypes(); getAllGuns()">
      <q-card class="bg-dark">
        <div v-if="!mobile" class="row q-pb-md full-width">
          <q-btn class="col" color="primary" @click="open = !open">{{ open ? 'zwiń' : 'rozwiń' }} wszystko</q-btn>
          <q-btn class="col" color="secondary" @click="gunAdding = true">wprowadź na stan</q-btn>
          <q-btn class="col" color="secondary"
            @click="transportCertificate = !transportCertificate; selection = []; date = null, date1 = null">wystaw list
            przewozowy</q-btn>
          <q-btn class="col" color="secondary" @click=" gunList = true">pobierz listę broni</q-btn>
          <q-btn class="col" color="secondary" @click=" newGunType = true">utwórz nowy typ Broni</q-btn>
        </div>
        <div v-if="transportCertificate">
          <div class="text-positive text-center">Wystawianie Listu Przewozowego</div>
          <div class="row">
            <q-input dense label-color="positive" input-class="text-positive" class="col-4" filled v-model="date"
              mask="####-##-##" label="data początkowa">
              <template v-slot:append>
                <q-icon color="positive" name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="date" no-unset mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input dense label-color="positive" input-class="text-positive" class="col-4" filled v-model="date1"
              mask="####-##-##" label="data końcowa">
              <template v-slot:append>
                <q-icon color="positive" name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date no-unset v-model="date1" mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-btn class="col-4" label="generuj dokument" color="primary"
              @click=" getGunTransportCertificate(); selection = []" />
          </div>
        </div>
        <div class="row items-center self-center full-width text-positive text-bold text-left text-body2 q-pa-xs">
          <div class="col-2 self-center">marka i model</div>
          <div class="col-1 self-center">kaliber</div>
          <div class="col-1 self-center">numer i seria</div>
          <div class="col-1 self-center">Poz. z książki ewidencji</div>
          <div class="col-1 self-center">ilość magazynków</div>
          <div class="col-1 self-center">
            <div>numer</div> świadectwa
          </div>
          <div class="col self-center text-bold text-left">podstawa wpisu</div>
          <div class="col-1 self-center text-bold text-left">data wpisu</div>
        </div>
        <q-expansion-item dense :value="open" v-for="(   gunType, id   ) in allGuns      " :key="id"
          :label="gunType.typeName + ' ' + gunType.gunList.length + ' sztuki'"
          class="full-width text-positive text-h6 text-center text-bold">
          <div v-for="(   item, index   ) in gunType.gunList      " :key="index"
            @dblclick=" gunUUID = item.uuid; gunInfo = true;" class="text-caption q-pl-sm q-pr-sm hover1"
            style="border-bottom: 0.1em solid #F1F1F1;" :class="item.available ? '' : 'bg-red'">
            <div class="row full-width text-bold text-left">
              <q-tooltip v-if="!mobile && shootingPlace === 'rcs' && item.imgUUID != null" :delay="500" content-style="width: 50%; height: 70%;
                background-image: url('./img/logo-panaszew.jpg');
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;" anchor="top middle" self="top middle" transition-show="scale"
                transition-hide="scale">
                <div style="height: 100%; width: 100%;opacity: 0.92;">
                  <q-img spinner-color="white" ratio="1" contain style="height: 100%; width: 100%;"
                    :src="(local + '/files/getGunImg?gunUUID=' + item.uuid)" />
                </div>
              </q-tooltip>
              <q-tooltip v-if="!mobile && shootingPlace === 'prod' && item.imgUUID != null" :delay="500" content-style="width: 50%; height: 70%;
                background-image: url(./img/logo.jpg);
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;" anchor="top middle" self="top middle" transition-show="scale"
                transition-hide="scale">
                <div style="height: 100%; width: 100%;opacity: 0.92;">
                  <q-img spinner-color="white" ratio="1" contain style="height: 100%; width: 100%;"
                    :src="(local + '/files/getGunImg?gunUUID=' + item.uuid)" />
                </div>
              </q-tooltip>
              <q-checkbox dense class="q-pr-xs" v-if="transportCertificate" color="primary" v-model="selection"
                :val="item.uuid" />
              <div class="self-center col-2">{{ index + 1 }} {{ item.modelName }}</div>
              <div class="self-center col-1">{{ item.caliber }}</div>
              <div class="self-center col-1">{{ item.serialNumber }}</div>
              <div class="self-center col-1">{{ item.recordInEvidenceBook }}</div>
              <div class="self-center col-1">{{ item.numberOfMagazines }}</div>
              <div class="self-center col-1">{{ item.gunCertificateSerialNumber }}</div>
              <div class="self-center col">{{ item.basisForPurchaseOrAssignment }}</div>
              <div class="self-center col-1">{{ item.addedDate }}</div>
            </div>
          </div>
        </q-expansion-item>
      </q-card>
    </q-expansion-item>
    <q-expansion-item v-if="!mobile" label="Amunicja" dense class="text-left text-bold text-h6 bg-grey-3 q-mb-md"
      group="list">
      <q-card>
        <q-card-section class="col bg-dark">
          <div class="row q-pa-md">
            <q-input dense v-model="caliberName" class="col-4" input-class="text-positive" placeholder="Nowy kaliber"
              filled></q-input>
            <q-btn color="primary" dense @click=" addCaliber = true">dodaj kaliber do bazy
              danych</q-btn>
          </div>
          <div class="col text-body2 text-bold">
            <q-item class="col text-positive">
              <div class="col text-left">KALIBER</div>
              <div class="col text-center">
                <div>ILOŚĆ NA STANIE<q-icon name="info"><q-tooltip anchor="top middle" content-style="width: 15vw;"
                      content-class="bg-primary text-caption">Ilość na stanie jest wyliczana na podstawie amunicji
                      wprowadzonej na stan i zejścia na podstawie list amunicyjnych</q-tooltip></q-icon></div>
                <div class="row items-center text-center">
                  <div class="col">{{ createTodayDate() }}</div>
                  <q-btn @click="refresh = !refresh" size="sm" color="blue" class="col text-positive"><q-tooltip
                      anchor="top middle" content-class="bg-blue text-caption">odśwież</q-tooltip><q-icon name="sync"
                      class="rotate"></q-icon></q-btn>
                </div>
              </div>
              <div class="col text-center">
                <div>STAN NA DZIEŃ</div>
                <div class="row items-center text-center">
                  <div class="col">{{ quantityOnDate }}</div>
                  <q-btn class="col" icon="event" color="primary" size="sm">
                    <q-tooltip anchor="top middle" content-class="bg-primary text-caption">wybierz datę</q-tooltip>
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date no-unset v-model="quantityOnDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-btn>
                </div>
              </div>
              <div class="col-4 text-center"></div>
            </q-item>
          </div>
          <div class="text-positive text-body1 col" v-for="(item, id) in calibers" :key="id">
            <div class="self-center">
              <div @dblclick=" caliberUUID = item.uuid; temp = item; caliberInfo = true"
                class="row items-center text-bold hover1">
                <Tooltip2clickTip></Tooltip2clickTip>
                <div class="col text-bold">{{ item.name }}</div>
                <QuantityOnDate :uuid="item.uuid" :date="quantityTodayDate" :refresh="refresh" class="col">
                </QuantityOnDate>
                <QuantityOnDate :uuid="item.uuid" :date="quantityOnDate" :refresh="refresh" class="col">
                </QuantityOnDate>
                <div class="col row">
                  <q-btn color="primary" no-caps dense @click=" caliberUUID = item.uuid; addCaliberDialog = true"
                    class="col round q-ma-xs text-caption">
                    <div class="col">
                      <div>Wprowadź na stan {{ item.name }}</div>
                    </div>
                  </q-btn>
                </div>
              </div>
            </div>
            <q-expansion-item :label="`HISTORIA ${item.name}`" dense header-class="text-center" style="border-top: solid 1px white"
              @click="caliberUUID = item.uuid; getCaliberHistory(item.uuid)" class="q-mb-xs">
              <q-card style="min-width: 50vw;" class="bg-dark text-positive">
                <q-card-section class="col">
                  <div class="row text-bold q-pa-xs">
                    <div class="self-center col-2">Data</div>
                    <div class="self-center col">Opis</div>
                    <div class="self-center col-2">Stan końcowy</div>
                    <div class="self-center col-2">Ilość</div>
                    <div class="self-center col-1">Poprzedni stan</div>
                  </div>
                  <div class="row hover2" v-for="(      caliber, uuid      ) in history      " :key="uuid">
                    <div class="self-center row col text-bold q-pa-xs">
                      <div class="self-center col-2">{{ convertDate(caliber.date) }}</div>
                      <div class="self-center col">{{ caliber.description }}</div>
                      <div class="self-center col-2">{{ caliber.finalStateForAddedDay }}</div>
                      <div class="self-center col-2">{{ caliber.ammoAdded }}</div>
                      <div class="self-center col-1">{{ caliber.stateForAddedDay }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-expansion-item label="Zużycie amunicji" dense class="text-left text-h6 text-bold bg-grey-3 q-mb-md" group="list">
      <AmmoUsed></AmmoUsed>
    </q-expansion-item>
    <q-dialog v-model="addCaliberDialog">
      <q-card class="bg-dark">
        <q-card-section>
          <div class="text-h6 text-positive">Dodawanie amunicji</div>
          <q-item><q-input filled class="full-width col" label-color="positive" input-class="text-positive"
              v-model="ammoQuantity" onkeypress="return (event.charCode > 44 && event.charCode < 58)"
              label="Ilość Amunicji"></q-input></q-item>
          <q-item><q-input filled class="full-width col" label-color="positive" input-class="text-positive"
              v-model="ammoDescription" label="opis"></q-input></q-item>
          <q-item>
            <q-input label-color="positive" input-class="text-positive" class="full-width" filled v-model="ammoDate"
              mask="####-##-##" label="data">
              <template v-slot:append>
                <q-icon color="positive" name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="ammoDate" no-unset mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup
            @click=" caliberUUID = null; ammoDate = null; ammoQuantity = null; ammoDescription = null" />
          <q-btn label="dodaj" color="primary" v-close-popup @click=" addAmmoToCaliber()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="gunList">
      <q-card class="bg-dark">
        <q-card-section class="text-positive">
          <div class="text-h6 text-center">Generuj listę dla wybranych rodzajów broni</div>
          <div v-for="( item, index) in gunTypes" :key="index" class="hover1 q-pa-xs">
            <div>
              <q-checkbox dense v-model="gunListSelect" :val="item.uuid" :label="item.typeName"
                @input="gunListSelect.length != gunTypes.length ? selectAllToGunList = false : selectAllToGunList = true" />
            </div>
          </div>
          <q-checkbox dense class="hover1 full-width" label="zaznacz wszystko" v-model="selectAllToGunList"
            @input="selectAllGunTypeToGenerate()" />
        </q-card-section>
        <q-card-cestion>
          <div class="q-pa-md">
            <q-btn-dropdown label="pobierz listę" color="primary" class="full-width"
              content-class="bg-dark text-positive col">
              <q-list>
                <q-btn dense rounded class="full-width q-ma-xs"
                  @click=" getGunRegistryPdf(); gunListSelect = []; selectAllToGunList = false" v-close-popup
                  color="primary" label="pobierz plik .pdf" />
                <q-btn dense rounded class="full-width q-ma-xs"
                  @click=" getGunRegistryXlsx(); gunListSelect = []; selectAllToGunList = false" v-close-popup
                  color="green-6" label="pobierz plik .xlsx" />
              </q-list>
            </q-btn-dropdown>
          </div>
        </q-card-cestion>

        <q-card-actions align="right">
          <q-btn label="Zamknij" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="gunInfo">
      <q-card class="bg-dark" style="min-width: 80vw">
        <q-card-section class="flex-center">
          <Gun :uuid="gunUUID" :armory="true" v-on:editingGun="getAllGuns()"></Gun>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="gunAdding">
      <q-card style="width: 600px;" class="bg-dark">
        <q-card-section class="col text-positive">
          <div class="self-center col full-width text-center text-h6 text-bold">Dodawanie broni do magazynu</div>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunModelName"
            label="nazwa i marka"></q-input>
          <q-select dense label-color="positive" options-selected-class="text-positive" input-class="text-positive"
            filled v-model="gunCaliber" use-input hide-selected fill-input options-dense
            popup-content-class="bg-dark text-positive" :options="options" @filter="filter" label="kaliber">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select dense label-color="positive" options-selected-class="text-positive" input-class="text-positive"
            filled v-model="gunType" use-input hide-selected fill-input options-dense
            :option-value="opt => opt !== '' ? Object(opt.typeName).toString() : ''"
            :option-label="opt => opt !== '' ? Object(opt.typeName).toString() : ''"
            popup-content-class="bg-dark text-positive" :options="options" @filter="filterGunTypes" label="typ">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunSerialNumber"
            label="numer seryjny"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled
            onkeypress="return (event.charCode > 44 && event.charCode < 58)" mask="####" v-model="gunProductionYear"
            label="rok produkcji"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled
            onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="gunRecordInEvidenceBook"
            label="pozycja z książki ewidencji"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled
            onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="gunNumberOfMagazines"
            label="ilość magazynków"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunCertificateSerialNumber"
            fill-mask="X" label="numer świadectwa"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled
            v-model="gunBasisForPurchaseOrAssignment" label="podstawa wpisu"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunAdditionalEquipment"
            label="wyposażenie dodatkowe"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunComment"
            label="uwagi"></q-input>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunBarcode"
            label="kod kreskowy" />
          <q-input label-color="positive" input-class="text-positive" class="full-width" filled v-model="gunDate"
            mask="####-##-##" label="data wprowadzenia na stan">
            <template v-slot:append>
              <q-icon color="positive" name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="gunDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="secondary" v-close-popup />
          <q-btn label="zapisz" color="primary" v-close-popup @click=" addGun()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="gunImage" @hide="gunUUID = null">
      <q-card style="width: 100%;height: 70%;" id="layout" class="bg-dark text-positive">
        <q-card-section>
          <q-img v-if="gunUUID != null" spinner-color="white" ratio="1" contain style="height: 100%; width: 100%;"
            :src="(local + '/files/getGunImg?gunUUID=' + gunUUID)" />
        </q-card-section>
        <q-card-section>
          <q-btn color="primary" label="zamknij" class="full-width" @click="gunUUID = null" v-close-popup></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
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
    <q-dialog v-model="newGunType">
      <q-card class="q-pa-md bg-dark text-positive">
        <div class="self-center col full-width no-outline text-center text-h5 text-bold">Nadawanie nowego Typu Broni
        </div>
        <div>
          <q-item><q-input label-color="positive" input-class="text-positive" filled class="full-width col"
              v-model="newGunTypeName" label="Nowa nazwa"></q-input></q-item>
        </div>
        <q-card-section class="col">
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Anuluj" color="secondary" v-close-popup />
          <q-btn label="Utwórz" color="primary" @click=" createNewGunTYpe()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addCaliber" @keypress.enter=" addNewCaliber(); code = null; addCaliber = false">
      <q-card class="bg-green-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input></div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn label="Dodaj" color="black" v-close-popup @click=" addNewCaliber(); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCodeCaliber" persistent
      @keypress.enter=" changeCaliberQuantity(caliberUUID, quantity, code); acceptCodeCaliber = false, code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn label="usuń" color="black" v-close-popup
            @click=" changeCaliberQuantity(caliberUUID, quantity, code); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCodePrice" persistent
      @keypress.enter=" changeCaliberUnitPrice(caliberUUID, unitPrice, code); acceptCodePrice = false, code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn label="usuń" color="black" v-close-popup
            @click=" changeCaliberUnitPrice(caliberUUID, unitPrice, code); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="acceptCodePriceForNotMember" persistent
      @keypress.enter=" changeCaliberUnitPriceForNotMember(caliberUUID, unitPriceForNotMember, code); acceptCodePriceForNotMember = false, code = null">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold"
              mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null" />
          <q-btn label="usuń" color="black" v-close-popup
            @click=" changeCaliberUnitPriceForNotMember(caliberUUID, unitPriceForNotMember, code); code = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="caliberInfo" @keypress.enter=" caliberInfo = false">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Caliber ID <q-btn @click=" copyClipboard()" borderless icon-right="content_copy">
              <div itemtype="text" id="copybtn">{{ caliberUUID }}</div>
            </q-btn></div>
          <div class="text-h6 full-width row">Wprowadź cenę dla klubowicza (aktualnie: {{ viewCurrency(temp.unitPrice)
            }})
          </div><q-input v-model="unitPrice" dense input-class="text-positive" label="tylko cyfry"
            label-color="positive" onkeypress="return (event.charCode > 44 && event.charCode < 58)"></q-input><q-btn
            color="primary" dense label="zapisz" @click="acceptCodePrice = true"></q-btn>
          <div class="text-h6 full-width row">Wprowadź cenę dla pozostałych (aktualnie: {{
            viewCurrency(temp.unitPriceForNotMember) }})</div><q-input v-model="unitPriceForNotMember" dense
            input-class="text-positive" label="tylko cyfry" label-color="positive"
            onkeypress="return (event.charCode > 44 && event.charCode < 58)"></q-input><q-btn color="primary" dense
            label="zapisz" @click="acceptCodePriceForNotMember = true"></q-btn>
        </q-card-section>

      </q-card>
    </q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss"></style>
<script>

import Vue from 'vue'
import axios from 'axios'
import App from 'src/App.vue'
// import { isWindows } from 'mobile-device-detect'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
Vue.prototype.$axios = axios

export default {
  components: {
    Gun: lazyLoadComponent({
      componentFactory: () => import('components/armory/Gun.vue'),
      loading: SkeletonBox
    }),
    AmmoUsed: lazyLoadComponent({
      componentFactory: () => import('components/armory/AmmoUsed.vue'),
      loading: SkeletonBox
    }),
    QuantityOnDate: lazyLoadComponent({
      componentFactory: () => import('components/armory/QuantityOnDate.vue'),
      loading: SkeletonBox
    }),
    Tooltip2clickTip: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickTip.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      caliberInfo: false,
      temp: {},
      mobile: App.mobile,
      gunImage: false,
      backgroundDark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      options: [],
      selection: [],
      gunListSelect: [],
      selectAllToGunList: false,
      gunList: false,
      addCaliber: false,
      success: false,
      gunInfo: false,
      quantity: null,
      // acceptCode: false,
      acceptCodeCaliber: false,
      acceptCodePrice: false,
      acceptCodePriceForNotMember: false,
      gunUUID: null,
      code: null,
      message: null,
      usedGunInfo: [],
      ammoList: null,
      newGunType: false,
      newGunTypeName: null,
      date: null,
      date1: null,
      caliberName: null,
      unitPrice: null,
      unitPriceForNotMember: null,
      ammoQuantity: null,
      ammoDate: null,
      ammoDescription: null,
      addCaliberDialog: false,
      caliberUUID: null,
      calibers: [],
      history: [],
      filters: [],
      gunTypes: [],
      allGuns: [],
      gunAdding: false,
      failure: false,
      barcode: null,
      gunModelName: null,
      gunCaliber: null,
      gunType: null,
      gunSerialNumber: null,
      gunProductionYear: null,
      gunNumberOfMagazines: '',
      gunCertificateSerialNumber: null,
      gunAdditionalEquipment: null,
      gunRecordInEvidenceBook: null,
      gunComment: '',
      gunBarcode: null,
      gunDate: this.createTodayDate(),
      quantityOnDate: this.createTodayDate(),
      quantityTodayDate: this.createTodayDate(),
      refresh: true,
      gunBasisForPurchaseOrAssignment: null,
      transportCertificate: false,
      open: false,
      shootingPlace: App.shootingPlace,
      local: App.host,
      prod: App.prod
    }
  },
  created () {
    this.getListCalibers()
    this.getListCalibersSelect()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
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
    viewCurrency (money) {
      if (money === undefined) { money = '0' }
      const formatterPL = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })
      const cash = formatterPL.format(money)
      return cash
    },
    onRejected () {
      this.failure = true
      this.message = 'Nie można dodać, sprawdź rozmiar pliku i jego typ'
      this.autoClose()
    },
    copyClipboard () {
      navigator.clipboard.writeText(this.caliberUUID)
    },
    createTodayDate () {
      const date = new Date()
      let month = 0
      let day = 0
      if ((date.getMonth() + 1) < 10) {
        month = '0' + (date.getMonth() + 1)
      } else {
        month = (date.getMonth() + 1)
      }
      if (date.getDate() < 10) {
        day = '0' + (date.getDate())
      } else {
        day = (date.getDate())
      }
      return date.getFullYear() + '-' + month + '-' + day
    },
    selectAllGunTypeToGenerate () {
      this.gunListSelect = []
      if (this.selectAllToGunList) {
        this.gunTypes.forEach(e => {
          this.gunListSelect.push(e.uuid)
        })
      }
    },
    changeCaliberUnitPrice (caliberUUID, price, pinCode) {
      fetch(`${this.local}/armory/changeCaliberUnitPrice?caliberUUID=${caliberUUID}&price=${price}&pinCode=${pinCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.getListCalibers()
            this.message = response
            this.success = true
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
    changeCaliberUnitPriceForNotMember (caliberUUID, price, pinCode) {
      fetch(`${this.local}/armory/changeCaliberUnitPriceForNotMember?caliberUUID=${caliberUUID}&price=${price}&pinCode=${pinCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.getListCalibers()
            this.message = response
            this.success = true
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
    addGun () {
      if (this.gunNumberOfMagazines === '' || this.gunNumberOfMagazines === 0) {
        this.gunNumberOfMagazines = 'BRAK'
      }
      const data = {
        modelName: this.gunModelName,
        caliber: this.gunCaliber,
        gunType: this.gunType.typeName,
        serialNumber: this.gunSerialNumber,
        productionYear: this.gunProductionYear,
        numberOfMagazines: this.gunNumberOfMagazines,
        gunCertificateSerialNumber: this.gunCertificateSerialNumber,
        additionalEquipment: this.gunAdditionalEquipment,
        recordInEvidenceBook: this.gunRecordInEvidenceBook,
        comment: this.gunComment,
        barcode: this.gunBarcode,
        basisForPurchaseOrAssignment: this.gunBasisForPurchaseOrAssignment,
        addedDate: this.gunDate
      }
      fetch(`${this.local}/armory/addGun`, {
        method: 'POST',
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
              this.showloading()
              this.getAllGuns()
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
    removeGun () {
      fetch(`${this.local}/armory/remove?gunUUID=${this.gunUUID}&pinCode=${this.code}`, {
        method: 'PUT'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.showloading()
              this.getAllGuns()
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
    removeGunImage (gunUUID) {
      fetch(`${this.local}/files/removeImg?gunUUID=${gunUUID}`, {
        method: 'DELETE'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
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
    createNewGunTYpe () {
      fetch(`${this.local}/armory/newGunTypeName?nameType=${this.newGunTypeName}`, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          this.success = true
          this.message = response
          this.getAllGuns()
          this.autoClose()
        } else {
          this.failure = true
          this.autoClose()
        }
      })
    },
    getGunTypes () {
      fetch(`${this.local}/armory/gunType`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunTypes = response
        })
    },
    getAllGuns () {
      fetch(`${this.local}/armory/getGuns`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.allGuns = response
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
    getCaliberHistory (caliber) {
      fetch(`${this.local}/armory/getHistory?caliberUUID=${caliber}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.history = response
        })
    },
    addAmmoToCaliber () {
      fetch(`${this.local}/armory/addAmmo?caliberUUID=${this.caliberUUID}&date=${this.ammoDate.replace(/\//gi, '-')}&count=${this.ammoQuantity}&description=${this.ammoDescription}`, {
        method: 'PUT'
      }).then(response => {
        if (response.status === 200) {
          this.success = true
          this.caliberUUID = null
          this.ammoDate = null
          this.ammoQuantity = null
          this.ammoDescription = null
          this.showloading()
          this.refresh = !this.refresh
          this.autoClose()
        } else {
          this.failure = true
          this.autoClose()
        }
      })
    },
    addUsedHistoryToGun (barcode) {
      fetch(`${this.local}/armory/addUsedHistoryToGun?barcode=${barcode}`, {
        method: 'PUT'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.showloading()
              this.getListCalibers()
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
    addImageToGun (gunUUID, uuid) {
      fetch(`${this.local}/armory/addImageToGun?gunUUID=${gunUUID}&fileUUID=${uuid}`, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          this.success = true
          this.getAllGuns()
          this.autoClose()
        } else {
          this.failure = true
          this.autoClose()
        }
      })
    },
    addNewCaliber () {
      fetch(`${this.local}/armory/calibers?caliber=${this.caliberName}&pinCode=${this.code}`, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.showloading()
              this.getListCalibers()
              this.getListCalibersSelect()
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
    getListCalibersSelect () {
      fetch(`${this.local}/armory/calibersList`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters = response
        })
    },
    getGunRegistryPdf () {
      axios({
        url: `${this.local}/files/downloadGunRegistry/?guns=${this.gunListSelect}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_broni_w_magazynie.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = 'pobrano dokument'
        this.success = true
        this.autoClose()
      })
    },
    getGunRegistryXlsx () {
      axios({
        url: `${this.local}/files/downloadGunRegistryXlsx/?guns=${this.gunListSelect}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_broni_w_magazynie.xlsx')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = 'pobrano dokument'
        this.success = true
        this.autoClose()
      })
    },
    getGunTransportCertificate () {
      axios({
        url: `${this.local}/files/downloadGunTransportCertificate/?guns=${this.selection}&date=${this.date.replace(/\//gi, '-')}&date1=${this.date1.replace(/\//gi, '-')}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'List_przewozowy.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = 'Wygenerowano dokument'
        this.success = true
        this.autoClose()
      })
    },
    filter (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filters.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filters.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterGunTypes (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.gunTypes.filter(v => v.typeName.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.gunTypes.filter(v => v.typeName.toLowerCase().indexOf(needle) > -1)
      })
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.addCaliber = false
        this.message = null
        this.barcode = null
        this.code = null
      }, 2000)
    }
  },
  name: 'armory'
}
</script>
