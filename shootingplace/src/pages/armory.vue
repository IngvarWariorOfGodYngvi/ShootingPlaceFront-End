<template>
  <q-page padding>
    <q-expansion-item label="Broń" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <q-card class="bg-dark">
        <div v-if="!mobile" class="row q-pb-md full-width">
          <q-btn class="col" color="primary" @click="open = !open">{{ open ? 'zwiń' : 'rozwiń' }} wszystko</q-btn>
          <q-btn class="col" color="secondary" @click="gunAdding = true">wprowadź na stan</q-btn>
          <q-btn class="col" color="secondary"
            @click="transportCertificate = !transportCertificate; selection = []; date = null, date1 = null">wystaw list
            przewozowy</q-btn>
          <q-btn class="col" color="secondary" @click=" openGunList = true">pobierz listę broni</q-btn>
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
        <div class="row items-center self-center full-width text-positive text-bold text-center text-body2 q-pb-xs">
          <div class="col self-center text-bold text-left">marka i model</div>
          <div class="col-1 self-center text-bold text-left">kaliber</div>
          <div class="col-2 self-center text-bold text-left">numer i seria</div>
          <div class="col-1 self-center text-bold text-left">Poz. z książki ewidencji</div>
          <div class="col-1 self-center text-bold text-left">ilość magazynków</div>
          <div class="col-2 self-center text-bold text-left">
            <div>numer</div> świadectwa
          </div>
          <div class="col-2 self-center text-bold text-left">podstawa wpisu</div>
        </div>
        <q-expansion-item dense :value="open" v-for="(   gunType, id   ) in       allGuns      " :key="id"
          :label="gunType.typeName + ' ' + gunType.gunList.length + ' sztuki'"
          class="bg-grey-4 col full-width no-outline text-h6 text-center text-bold">
          <div v-for="(   gun, uuid   ) in       gunType.gunList      " :key="uuid"
            @dblclick=" gunUUID = gun.uuid; getGun(gun.uuid); gunInfo = true;">
            <q-field dense clickable color="positive" class="bg-dark text-caption" :class="gun.available ? '' : 'bg-red'"
              :standout="gun.available ? 'bg-accent text-black' : 'bg-warning text-black'" stack-label>
              <div class="row full-width">
                <q-tooltip v-if="!mobile && shootingPlace === 'rcs'" :delay="500" content-style="width: 50%; height: 70%;
                background-image: url('img/logo-panaszew.jpg');
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;" anchor="top middle" self="top middle" transition-show="scale"
                  transition-hide="scale">
                  <div style="height: 100%; width: 100%;opacity: 0.92;">
                    <q-img spinner-color="white" ratio="1" contain style="height: 100%; width: 100%;"
                      :src="('http://' + local + '/files/getGunImg?gunUUID=' + gun.uuid)" />
                  </div>
                </q-tooltip>
                <q-tooltip v-if="!mobile && shootingPlace === 'prod'" :delay="500" content-style="width: 50%; height: 70%;background-image: url('img/logo.png');
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;" anchor="top middle" self="top middle" transition-show="scale"
                  transition-hide="scale">
                  <div style="height: 100%; width: 100%;opacity: 0.92;">
                    <q-img spinner-color="white" ratio="1" contain style="height: 100%; width: 100%;"
                      :src="('http://' + local + '/files/getGunImg?gunUUID=' + gun.uuid)" />
                  </div>
                </q-tooltip>
                <q-tooltip v-if="!mobile && shootingPlace === 'rcs'" :delay="500" content-style="width: 50%; height: 70%;background-image: url('img/logo-panaszew.jpg');
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;" anchor="top middle" self="top middle" transition-show="scale"
                  transition-hide="scale">
                  <div style="height: 100%; width: 100%;opacity: 0.92;">
                    <q-img spinner-color="white" ratio="1" contain style="height: 100%; width: 100%;"
                      :src="('http://' + local + '/files/getGunImg?gunUUID=' + gun.uuid)" />
                  </div>
                </q-tooltip>
                <div v-if="!gun.available" class="background text-white self-center text-h6 text-center full-width">
                  ZABLOKOWANO</div>
                <q-checkbox v-if="transportCertificate" color="primary" v-model="selection"
                  :val="gun.uuid"></q-checkbox>
                <div class="col self-center text-bold text-left">{{ gun.modelName }}</div>
                <div class="col-1 self-center text-bold text-left">{{ gun.caliber }}</div>
                <div class="col-2 self-center text-bold text-left">{{ gun.serialNumber }}</div>
                <div class="col-1 self-center text-bold text-left">{{ gun.recordInEvidenceBook }}</div>
                <div class="col-1 self-center text-bold text-left">{{ gun.numberOfMagazines }}</div>
                <div class="col-2 self-center text-bold text-left">{{ gun.gunCertificateSerialNumber }}</div>
                <div class="col-2 self-center text-bold text-left">{{ gun.basisForPurchaseOrAssignment }}</div>
              </div>
            </q-field>
          </div>
        </q-expansion-item>
      </q-card>
    </q-expansion-item>
    <q-card>
    </q-card>
    <p></p>
    <q-expansion-item v-if="!mobile" label="Amunicja" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
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
              <div class="col-3 text-left">KALIBER</div>
              <div class="col-3 text-left">ILOŚĆ NA STANIE</div>
              <div class="col text-center"></div>
            </q-item>
          </div>
          <div class="row" v-for="(      item, id      ) in       calibers      " :key="id">
            <q-field dense color="positive" class="col-6 text-bold" standout="bg-accent text-black" stack-label>
              <div @dblclick=" caliberUUID = item.uuid;temp=item; caliberInfo = true" class="row col">
                <div class="self-center col-6">{{ item.name }}</div>
                <div class="self-center col-6">{{ item.quantity }}</div>
              </div>
            </q-field>
            <q-btn color="primary" dense @click=" caliberUUID = caliber.uuid; addCaliberDialog = true"
              class="col">aktualizuj stan {{ item.name }}</q-btn>
            <q-btn color="secondary" dense
              @click=" caliberUUID = item.uuid; caliberHistory = true; getCaliberHistory()" class="col">historia
              dodawania</q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <p></p>
    <q-expansion-item label="Zużycie amunicji" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <q-card :class="mobile ? 'col' : 'row'">
        <q-card-section class="col-4 bg-dark">
          <q-item class="col text-positive">
            <q-input dense class="full-width" label-color="positive" input-class="text-positive" color="positive"
              mask="####-##-##" filled v-model="firstDate" label="Data początkowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date no-unset @input=" getSum()" v-model="firstDate" mask="YYYY-MM-DD"
                      class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <q-item class="col">
            <q-input dense class="full-width" label-color="positive" input-class="text-positive" color="positive"
              mask="####-##-##" filled v-model="secondDate" label="Data końcowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input=" getSum()" v-model="secondDate" no-unset mask="YYYY-MM-DD"
                      class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <div @click=" getSum()" class="q-pa-md" align="right">
            <q-btn color="primary">Wyszukaj</q-btn>
          </div>
        </q-card-section>
        <q-card-section class="col-8 bg-dark text-positive">
          <div class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6"
            v-if="quantitySum.length < 1">Brak wyników - Wybierz daty</div>
          <div class="q-pa-md self-center col full-width no-outline text-bold text-center">
            <q-field v-if="quantitySum.length > 0" color="positive"
              class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black"
              stack-label>
              <div class="self-center col full-width no-outline text-center text-bold">kaliber</div>
              <div class="self-center col full-width no-outline text-center text-bold">ilość zużytej amunicji</div>
            </q-field>
            <p v-if="quantitySum.length > 0"></p>
            <div v-for="(      ammo, id      ) in       quantitySum      " :key="id">
              <q-field color="positive" class="self-center col full-width no-outline text-bold text-center"
                standout="bg-accent text-black" stack-label>
                <div class="self-center col full-width no-outline text-center text-bold">{{ ammo.name }}</div>
                <div class="self-center col full-width no-outline text-center text-bold">{{ ammo.quantity }}</div>
              </q-field>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <p></p>
    <p></p>
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
              mask="####-##-##" label="data" hint="użyj kalendarza">
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
    <q-dialog v-model="openGunList">
      <q-card class="bg-dark">
        <q-card-section class="text-positive">
          <div class="text-h6 text-center">Generuj listę dla wybranych rodzajów broni</div>
          <div v-for="(      gunType, id      ) in       allGuns      " :key="id">
            <div>
              <q-checkbox v-model="gunListSelect" :val="gunType.uuid" :label="gunType.typeName"></q-checkbox>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Anuluj" color="secondary" v-close-popup />
          <q-btn label="Pobierz" color="primary" v-close-popup @click=" getGunRegistry(); gunListSelect = []" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="gunInfo">
        <q-card class="bg-dark" style="min-width: 80vw">
        <q-card-section class="flex-center">
          <Gun :uuid="gunUUID" :armory="true" @hook:destroyed="getAllGuns()"></Gun>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="caliberHistory">
      <q-card style="width: 600px;" class="bg-dark text-positive">
        <q-card-section class="col">
          <div class="row text-body2">
            <div class="self-center col no-outline text-center">Data</div>
            <div class="self-center col no-outline text-center">Opis</div>
            <div class="self-center col no-outline text-center">Stan końcowy</div>
            <div class="self-center col no-outline text-center">Ilość</div>
            <div class="self-center col no-outline text-center">Poprzedni stan</div>
          </div>
          <div class="row" v-for="(      caliber, uuid      ) in       history      " :key="uuid">
            <q-field filled color="positive" class="self-center row col text-bold text-center"
              standout="bg-accent text-black">
              <div class="self-center col no-outline text-left">{{ caliber.date }}</div>
              <div class="self-center col no-outline text-left">{{ caliber.description }}</div>
              <div class="self-center col no-outline text-left">{{ caliber.finalStateForAddedDay }}</div>
              <div class="self-center col no-outline text-left">{{ caliber.ammoAdded }}</div>
              <div class="self-center col no-outline text-left">{{ caliber.stateForAddedDay }}</div>
            </q-field>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup @click=" caliberUUID = null" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="gunAdding">
      <q-card style="width: 600px;" class="bg-dark">
        <q-card-section class="col text-positive">
          <div class="self-center col full-width text-center text-h6 text-bold">Dodawanie broni do magazynu</div>
          <q-input dense label-color="positive" input-class="text-positive" filled v-model="gunModelName"
            label="nazwa i marka"></q-input>
          <q-select dense label-color="positive" options-selected-class="text-positive" input-class="text-positive" filled
            v-model="gunCaliber" use-input hide-selected fill-input options-dense
            popup-content-class="bg-dark text-positive" :options="options" @filter="filter" label="kaliber">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Brak wyników
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select dense label-color="positive" options-selected-class="text-positive" input-class="text-positive" filled
            v-model="gunType" use-input hide-selected fill-input options-dense
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
            label="kod kreskowy"></q-input>
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
            :src="('http://' + local + '/files/getGunImg?gunUUID=' + gunUUID)" />
        </q-card-section>
        <q-card-section>
          <q-btn color="primary" label="zamknij" class="full-width" @click="gunUUID = null" v-close-popup></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="failure">
      <q-card>
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
        <div class="self-center col full-width no-outline text-center text-h5 text-bold">Nadawanie nowego Typu Broni</div>
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
          <div class="text-h6 full-width row">Popraw ilość na stanie</div> <q-input v-model="quantity" dense
              input-class="text-positive" label="wprowadź ilość" label-color="positive"
              mask="###########"></q-input><q-btn color="primary" dense label="zapisz"
              @click="acceptCodeCaliber = true"></q-btn>
          <div class="text-h6 full-width row">Wprowadź cenę dla klubowicza (aktualnie: {{ viewCurrency(temp.unitPrice) }}) </div><q-input v-model="unitPrice" dense
              input-class="text-positive" label="tylko cyfry" label-color="positive"
              onkeypress="return (event.charCode > 44 && event.charCode < 58)"></q-input><q-btn color="primary" dense label="zapisz"
              @click="acceptCodePrice = true"></q-btn>
          <div class="text-h6 full-width row">Wprowadź cenę dla pozostałych (aktualnie: {{ viewCurrency(temp.unitPriceForNotMember) }})</div><q-input v-model="unitPriceForNotMember" dense
              input-class="text-positive" label="tylko cyfry" label-color="positive"
              onkeypress="return (event.charCode > 44 && event.charCode < 58)"></q-input><q-btn color="primary" dense label="zapisz"
              @click="acceptCodePriceForNotMember = true"></q-btn>
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
import { isWindows } from 'mobile-device-detect'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
Vue.prototype.$axios = axios

export default {
  components: {
    Gun: lazyLoadComponent({
      componentFactory: () => import('components/Gun.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      caliberInfo: false,
      temp: {},
      mobile: !isWindows,
      gunImage: false,
      backgroundDark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      options: [],
      selection: [],
      gunListSelect: [],
      openGunList: false,
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
      fileUUID: null,
      usedGunInfo: [],
      ammoList: null,
      newGunType: false,
      newGunTypeName: null,
      date: null,
      date1: null,
      quantitySum: [],
      firstDate: null,
      secondDate: this.createTodayDate(),
      firstDateHistory: null,
      secondDateHistory: this.createTodayDate(),
      caliberName: null,
      unitPrice: null,
      unitPriceForNotMember: null,
      ammoQuantity: null,
      ammoDate: null,
      ammoDescription: null,
      addCaliberDialog: false,
      caliberHistory: false,
      caliberUUID: null,
      calibers: [],
      history: [],
      filters: [],
      filters1: [],
      gunTypes: [],
      allGuns: [],
      gunUsedInfo: [],
      gunAdding: false,
      // editGun: false,
      failure: false,
      barcode: null,
      nameOrCard: false,
      memberName: null,
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
      gunBasisForPurchaseOrAssignment: null,
      transportCertificate: false,
      gunsHistory: [],
      open: false,
      shootingPlace: App.shootingPlace,
      local: App.host,
      prod: App.prod
    }
  },
  created () {
    this.getListCalibers()
    this.getListCalibersSelect()
    this.getGunTypes()
    this.getAllGuns()
    this.getMembersNames()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
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
        day = '0' + (date.getDate() + 1)
      } else {
        day = (date.getDate())
      }
      const today = date.getFullYear() + '/' + month + '/' + day
      return today
    },
    getSum () {
      fetch('http://' + this.local + '/armory/quantitySum?firstDate=' + this.firstDate.replace(/\//gi, '-') + '&secondDate=' + this.secondDate.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySum = response
        })
      })
    },
    changeCaliberUnitPrice (caliberUUID, price, pinCode) {
      fetch(`http://${this.local}/armory/changeCaliberUnitPrice?caliberUUID=${caliberUUID}&price=${price}&pinCode=${pinCode}`, {
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
      fetch(`http://${this.local}/armory/changeCaliberUnitPriceForNotMember?caliberUUID=${caliberUUID}&price=${price}&pinCode=${pinCode}`, {
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
    changeCaliberQuantity (caliberUUID, quantity, pinCode) {
      fetch('http://' + this.local + '/armory/changeCaliberQuantity?caliberUUID=' + caliberUUID + '&quantity=' + quantity + '&pinCode=' + pinCode, {
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
      if (this.gunNumberOfMagazines === '') {
        this.gunNumberOfMagazines = 'BRAK'
      }
      const data = {
        modelName: this.gunModelName,
        caliber: this.gunCaliber,
        gunType: this.gunType,
        serialNumber: this.gunSerialNumber,
        productionYear: this.gunProductionYear,
        numberOfMagazines: this.gunNumberOfMagazines,
        gunCertificateSerialNumber: this.gunCertificateSerialNumber,
        additionalEquipment: this.gunAdditionalEquipment,
        recordInEvidenceBook: this.gunRecordInEvidenceBook,
        comment: this.gunComment,
        barcode: this.gunBarcode,
        basisForPurchaseOrAssignment: this.gunBasisForPurchaseOrAssignment
      }
      fetch('http://' + this.local + '/armory/addGun', {
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
      fetch('http://' + this.local + '/armory/remove?gunUUID=' + this.gunUUID + '&pinCode=' + this.code, {
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
      fetch('http://' + this.local + '/files/removeImg?gunUUID=' + gunUUID, {
        method: 'DELETE'
      }).then(response => {
        if (response.status === 200) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.getGun(gunUUID)
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
      fetch('http://' + this.local + '/armory/newGunTypeName?nameType=' + this.newGunTypeName, {
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
    editingGun () {
      if (this.gunNumberOfMagazines === '') {
        this.gunNumberOfMagazines = 'BRAK'
      }
      const data = {
        uuid: this.gunUUID,
        modelName: this.gunModelName,
        caliber: this.gunCaliber,
        gunType: this.gunType,
        serialNumber: this.gunSerialNumber,
        productionYear: this.gunProductionYear,
        numberOfMagazines: this.gunNumberOfMagazines,
        gunCertificateSerialNumber: this.gunCertificateSerialNumber,
        additionalEquipment: this.gunAdditionalEquipment,
        recordInEvidenceBook: this.gunRecordInEvidenceBook,
        comment: this.gunComment,
        barcode: this.gunBarcode,
        basisForPurchaseOrAssignment: this.gunBasisForPurchaseOrAssignment
      }
      fetch('http://' + this.local + '/armory/editGun', {
        method: 'POST',
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
              this.gunAdding = false
              this.gunModelName = null
              this.gunCaliber = null
              this.gunType = null
              this.gunSerialNumber = null
              this.gunProductionYear = null
              this.gunNumberOfMagazines = ''
              this.gunCertificateSerialNumber = null
              this.gunAdditionalEquipment = ''
              this.gunRecordInEvidenceBook = null
              this.gunComment = ''
              this.gunBarcode = null
              this.gunBasisForPurchaseOrAssignment = null
              this.showloading()
              this.getAllGuns()
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
    getGunTypes () {
      fetch('http://' + this.local + '/armory/gunType', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunTypes = response
        })
    },
    getAllGuns () {
      fetch('http://' + this.local + '/armory/getGuns', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.allGuns = response
        })
    },
    getGun (gunUUID) {
      fetch('http://' + this.local + '/armory/getGun?gunUUID=' + gunUUID, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.usedGunInfo = response
        })
    },
    getListCalibers () {
      fetch('http://' + this.local + '/armory/calibers', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.calibers = response
        })
    },
    getCaliberHistory () {
      fetch('http://' + this.local + '/armory/getHistory?caliberUUID=' + this.caliberUUID, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.history = response
        })
    },
    getUsedGunHistory () {
      fetch('http://' + this.local + '/armory/getHistoryGuns?firstDate=' + this.firstDateHistory.replace(/\//gi, '-') + '&secondDate=' + this.secondDateHistory.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunsHistory = response
        })
    },
    addAmmoToCaliber () {
      fetch('http://' + this.local + '/armory/addAmmo?caliberUUID=' + this.caliberUUID + '&date=' + this.ammoDate.replace(/\//gi, '-') + '&count=' + this.ammoQuantity + '&description=' + this.ammoDescription, {
        method: 'PUT'
      }).then(response => {
        if (response.status === 200) {
          this.success = true
          this.caliberUUID = null
          this.ammoDate = null
          this.ammoQuantity = null
          this.ammoDescription = null
          this.showloading()
          this.getListCalibers()
          this.autoClose()
        } else {
          this.failure = true
          this.autoClose()
        }
      })
    },
    addUsedHistoryToGun (barcode) {
      fetch('http://' + this.local + '/armory/addUsedHistoryToGun?barcode=' + barcode, {
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
      fetch('http://' + this.local + '/armory/addImageToGun?gunUUID=' + gunUUID + '&fileUUID=' + uuid, {
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
      fetch('http://' + this.local + '/armory/calibers?caliber=' + this.caliberName + '&pinCode=' + this.code, {
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
      fetch('http://' + this.local + '/armory/calibersList', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters = response
        })
    },
    getGunRegistry () {
      axios({
        url: 'http://' + this.local + '/files/downloadGunRegistry/?guns=' + this.gunListSelect,
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
    getGunTransportCertificate () {
      axios({
        url: 'http://' + this.local + '/files/downloadGunTransportCertificate/?guns=' + this.selection + '&date=' + this.date.replace(/\//gi, '-') + '&date1=' + this.date1.replace(/\//gi, '-'),
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
          this.options = this.gunTypes.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.gunTypes.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    getMembersNames () {
      fetch('http://' + this.local + '/member/getAllNames', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters1 = response
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
