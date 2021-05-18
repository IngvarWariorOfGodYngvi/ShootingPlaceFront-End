<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Magazyn Broni i Amunicji</div>
        </q-item>
      </div>
      <q-card>
        <q-card-section class="col">
          <div class="q-pa-md self-center col full-width no-outline text-h5 text-center text-bold">POSIADANA AMUNICJA</div>
          <div class="row q-pa-md">
          <q-input v-model="caliberName" placeholder="Nowy kaliber" filled></q-input>
          <q-btn @click="addCaliber = true">dodaj kaliber do bazy danych</q-btn>
          </div>
          <div class="col">
              <q-item class="col">
                <div class="self-center col full-width no-outline text-center text-bold" style="text-center">KALIBER</div>
                <div class="self-center col full-width no-outline text-center text-bold" style="text-center">ILOŚĆ NA STANIE</div>
                <div class="self-center col full-width no-outline text-center text-bold" style="text-center"></div>
              </q-item>
          </div>
              <div class="row" v-for="(caliber,id) in calibers" :key="id">
              <q-item class="col">
                <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
                    <div class="self-center col full-width no-outline text-center text-bold" style="text-center">{{caliber.name}}</div>
                    <div class="self-center col full-width no-outline text-center text-bold" style="text-center">{{caliber.quantity}}</div>
                </q-field>
                <q-btn @click="caliberUUID = caliber.uuid, addCaliberDialog = true" class="col-2">aktualizuj stan {{caliber.name}}</q-btn>
                <q-btn @click="caliberUUID = caliber.uuid, caliberHistory = true, getCaliberHistory ()" class="col-2">historia dodawania</q-btn>
              </q-item>
            </div>
        </q-card-section>
        <q-card-section class="col">
          <div class="row">
            <div class="col">
              <q-item>
                <div class="q-pa-md self-center col full-width no-outline text-bold text-center bg-grey-3">ZUŻUCIE AMUNICJI W WYBRANYM OKRESIE</div>
              </q-item>
            </div>
            <q-item class="col">
              <q-input class="full-width" filled v-model="firstDate" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="firstDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <q-item class="col">
              <q-input class="full-width" filled v-model="secondDate" label="Data końcowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="secondDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <div @click="getSum()" class="q-pa-md" align="right"><q-btn>Wyszukaj</q-btn></div>
            </div>
            <div class="q-pa-md self-center col full-width no-outline text-bold text-center text-h4" v-if="quantitySum.length<1">Brak wyników - Wybierz daty</div>
            <div class="q-pa-md self-center col full-width no-outline text-bold text-center">
              <q-field v-if="quantitySum.length>0" color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-center text-bold">kaliber</div>
                  <div class="self-center col full-width no-outline text-center text-bold">ilość zużytej amunicji</div>
              </q-field>
            <p v-if="quantitySum.length>0"></p>
            <div v-for="(ammo,id) in quantitySum" :key="id">
              <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-center text-bold">{{ammo.name}}</div>
                  <div class="self-center col full-width no-outline text-center text-bold">{{ammo.quantity}}</div>
              </q-field>
            </div>
            </div>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section class="col">
            <div class="q-pa-md self-center col full-width no-outline text-h5 text-center text-bold">POSIADANA BROŃ</div>
          <div class="row q-pa-md">
          <div class="col" align="left">
            <q-btn color="grey-3" class="text-black" @click="gunAdding=true">wprowadź na stan</q-btn>
          </div>
          <div class="col" align="center">
            <q-btn color="grey-3" class="text-black" @click="transportCertificate=true" >wystaw list przewozowy</q-btn>
          </div>
          <div class="col" align="center">
            <q-btn color="grey-3" class="text-black" @click="openGunList = true">pobierz listę broni</q-btn>
          </div>
          <div class="col" align="right">
            <q-btn color="grey-3" class="text-black" @click="newGunType=true">utwórz nowy rodzaj Broni</q-btn>
          </div>
          </div>
                <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
                    <div class="col-3 self-center text-bold text-left">marka i model</div>
                    <div class="col-1 self-center text-bold text-left">kaliber</div>
                    <div class="col-2 self-center text-bold text-left">numer i seria</div>
                    <div class="col-1 self-center text-bold text-left">Poz. z książki ewidencji</div>
                    <div class="col-1 self-center text-bold text-left">ilość magazynków</div>
                    <div class="col-2 self-center text-bold text-left">numer świadectwa</div>
                    <div class="col-2 self-center text-bold text-left">podstawa wpisu</div>
                </q-field>
                <p></p>
                <q-expansion-item v-for="(gunType,id) in allGuns" :key="id" :label="gunType.typeName" class="bg-grey-4 col full-width no-outline text-h6 text-center text-bold">
                <div v-for="(gun,uuid) in gunType.gunEntityList" :key="uuid" @dblclick="gunInfo=true,usedGunInfo=gun" clickable class="bg-white">
                <q-field clickable color="black" class="bg-white" standout="bg-warning text-black" stack-label>
                    <div class="row full-width">
                    <div clickable class="col-3 self-center text-bold text-left">{{gun.modelName}}</div>
                    <div clickable class="col-1 self-center text-bold text-left">{{gun.caliber}}</div>
                    <div clickable class="col-2 self-center text-bold text-left">{{gun.serialNumber}}</div>
                    <div clickable class="col-1 self-center text-bold text-left">{{gun.recordInEvidenceBook}}</div>
                    <div clickable class="col-1 self-center text-bold text-left">{{gun.numberOfMagazines}}</div>
                    <div clickable class="col-2 self-center text-bold text-left">{{gun.gunCertificateSerialNumber}}</div>
                    <div clickable class="col-2 self-center text-bold text-left">{{gun.basisForPurchaseOrAssignment}}</div>
                    </div>
                </q-field>
                </div>
                </q-expansion-item>
        </q-card-section>
      </q-card>
<q-dialog v-model="addCaliberDialog">
<q-card>
  <q-card-section>
    <div class="text-h6">Dodawanie amunicji</div>
      <q-item><q-input filled class="full-width col" v-model="ammoQuantity" onkeypress="return (event.charCode > 44 && event.charCode < 58)" label="Ilość Amunicji"></q-input></q-item>
      <q-item><q-input filled class="full-width col" v-model="ammoDescription" label="opis"></q-input></q-item>
      <q-item>
        <q-input class="full-width" filled v-model="ammoDate" mask="####/##/##" label="data" hint="użyj kalendarza">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="ammoDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Zamknij" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item>
  </q-card-section>

  <q-card-actions align="right">
    <q-btn flat label="anuluj" color="primary" v-close-popup @click="caliberUUID = null, ammoDate = null, ammoQuantity = null, ammoDescription = null"/>
    <q-btn flat label="dodaj" color="primary" v-close-popup @click="addAmmoToCaliber ()" />
  </q-card-actions>
</q-card>
</q-dialog>
<q-dialog v-model="openGunList">
<q-card>
  <q-card-section>
    <div class="text-h6 text-center">Generuj listę dla wybranych rodzajów broni</div>
    <div v-for="(gunType,id) in allGuns" :key="id">
      <div>
        <q-checkbox v-model="gunListSelect" :val="gunType.uuid" :label="gunType.typeName"></q-checkbox>
      </div>
    </div>
  </q-card-section>

  <q-card-actions align="right">
    <q-btn flat label="Anuluj" color="primary" v-close-popup/>
    <q-btn flat label="Pobierz" color="primary" v-close-popup @click="getGunRegistry(),gunListSelect = []" />
  </q-card-actions>
</q-card>
</q-dialog>
<q-dialog v-model="gunInfo">
<q-card>
  <q-card-section>
    <div class="text-h6">Informacje dodatkowe o broni</div>
    <div>Rok produkcji : {{usedGunInfo.productionYear}}</div>
    <div>Wyposażenie dodatkowe : {{usedGunInfo.additionalEquipment}}</div>
    <div>Uwagi : {{usedGunInfo.comment}}</div>
  </q-card-section>
  <q-card-section>
    <q-btn color="red" @click="gunUUID = usedGunInfo.uuid, acceptCode=true">usuń z ewidencji</q-btn>
    <q-btn @click="gunUUID = usedGunInfo.uuid,
    gunModelName = usedGunInfo.modelName,
    gunCaliber = usedGunInfo.caliber,
    gunType = usedGunInfo.gunType,
    gunSerialNumber = usedGunInfo.serialNumber,
    gunProductionYear = usedGunInfo.productionYear,
    gunNumberOfMagazines = usedGunInfo.numberOfMagazines,
    gunCertificateSerialNumber = usedGunInfo.gunCertificateSerialNumber,
    gunAdditionalEquipment = usedGunInfo.additionalEquipment,
    gunRecordInEvidenceBook = usedGunInfo.recordInEvidenceBook,
    gunComment = usedGunInfo.comment,
    gunBasisForPurchaseOrAssignment = usedGunInfo.basisForPurchaseOrAssignment,
    editGun=true">edytuj</q-btn>
  </q-card-section>

  <q-card-actions align="right">
    <q-btn flat label="zamknij" color="primary" v-close-popup/>
  </q-card-actions>
</q-card>
</q-dialog>
<q-dialog v-model="transportCertificate" full-width>
<q-card>
  <q-card-actions align="right">
    <q-btn flat label="zamknij" color="primary" v-close-popup/>
    <q-btn label="pobierz" color="primary" v-close-popup @click="getGunTransportCertificate(),selection = []"/>
  </q-card-actions>
  <q-card-section>
    <div class="text-h6 text-center">Wystawianie listu przewozowego</div>
    <div class="row">
      <q-item>
        <q-input class="full-width" filled v-model="date" mask="####/##/##" label="data początkowa" hint="użyj kalendarza">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Zamknij" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item>
      <q-item>
        <q-input class="full-width" filled v-model="date1" mask="####/##/##" label="data końcowa" hint="użyj kalendarza">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="date1">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Zamknij" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item>
      </div>
        <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
            <div class="col-1 self-center text-bold text-left"></div>
            <div class="col-3 self-center text-bold text-left">marka i model</div>
            <div class="col-1 self-center text-bold text-left">kaliber</div>
            <div class="col-2 self-center text-bold text-left">numer i seria</div>
            <div class="col-1 self-center text-bold text-left">Poz. z książki ewidencji</div>
            <div class="col-1 self-center text-bold text-left">ilość magazynków</div>
            <div class="col-1 self-center text-bold text-left">numer świadectwa</div>
            <div class="col-2 self-center text-bold text-left">podstawa wpisu</div>
        </q-field>
        <p></p>
              <q-expansion-item v-for="(gunType,id) in allGuns" :key="id" :label="gunType.typeName" class="bg-grey-4 col full-width no-outline text-h6 text-center text-bold">
                <div v-for="(gun,uuid) in gunType.gunEntityList" :key="uuid" @dblclick="gunInfo=true,usedGunInfo=gun" clickable class="bg-white">
                <q-field clickable color="black" class="bg-white" standout="bg-accent text-black" stack-label>
                    <div class="row full-width">
                    <q-checkbox color="primary" v-model="selection" :val="gun.uuid" class="col-1"></q-checkbox>
                    <div clickable class="col-3 self-center text-bold text-left">{{gun.modelName}}</div>
                    <div clickable class="col-1 self-center text-bold text-left">{{gun.caliber}}</div>
                    <div clickable class="col-2 self-center text-bold text-left">{{gun.serialNumber}}</div>
                    <div clickable class="col-1 self-center text-bold text-left">{{gun.recordInEvidenceBook}}</div>
                    <div clickable class="col-1 self-center text-bold text-left">{{gun.numberOfMagazines}}</div>
                    <div clickable class="col-1 self-center text-bold text-left">{{gun.gunCertificateSerialNumber}}</div>
                    <div clickable class="col-2 self-center text-bold text-left">{{gun.basisForPurchaseOrAssignment}}</div>
                    </div>
                </q-field>
                </div>
                </q-expansion-item>
  </q-card-section>

  <q-card-actions align="right">
    <q-btn flat label="zamknij" color="primary" v-close-popup/>
    <q-btn label="pobierz" color="primary" v-close-popup @click="getGunTransportCertificate(),selection = []"/>
  </q-card-actions>
</q-card>
</q-dialog>
<q-dialog v-model="caliberHistory">
<q-card style="width: 600px;">
  <q-card-section class="col">
    <q-item class="col">
      <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
          <div class="self-center col full-width no-outline text-center" style="text-center">data</div>
      </q-field>
      <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
          <div class="self-center col full-width no-outline text-center" style="text-center">opis</div>
      </q-field>
      <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
          <div class="self-center col full-width no-outline text-center" style="text-center">stan końcowy</div>
      </q-field>
      <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
          <div class="self-center col full-width no-outline text-center" style="text-center">ilość</div>
      </q-field>
      <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
          <div class="self-center col full-width no-outline text-center" style="text-center">poprzedni stan</div>
      </q-field>
    </q-item>
      <div class="row" v-for="(caliber,uuid) in history" :key="uuid">
        <q-item class="col">
          <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
              <div class="self-center col full-width no-outline text-center" style="text-center">{{caliber.date}}</div>
          </q-field>
          <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
              <div class="self-center col full-width no-outline text-center" style="text-center">{{caliber.description}}</div>
          </q-field>
          <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
              <div class="self-center col full-width no-outline text-center" style="text-center">{{caliber.finalStateForAddedDay}}</div>
          </q-field>
          <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
              <div class="self-center col full-width no-outline text-center" style="text-center">{{caliber.ammoAdded}}</div>
          </q-field>
          <q-field color="black" class="self-center col full-width no-outline text-bold text-center" standout="bg-accent text-black" stack-label>
              <div class="self-center col full-width no-outline text-center" style="text-center">{{caliber.stateForAddedDay}}</div>
          </q-field>
        </q-item>
      </div>
  </q-card-section>

  <q-card-actions align="right">
    <q-btn flat label="zamknij" color="primary" v-close-popup @click="caliberUUID = null"/>
  </q-card-actions>
</q-card>
</q-dialog>
<q-dialog v-model="gunAdding">
<q-card style="width: 600px;">
  <q-card-section class="col">
    <div class="self-center col full-width no-outline text-center text-h6 text-bold">Dodawanie broni do magazynu</div>
    <q-item><q-input filled class="full-width col" v-model="gunModelName" label="nazwa i marka"></q-input></q-item>
    <q-item>
    <q-select class="full-width" filled v-model="gunCaliber" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filter" label="kaliber">
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Brak wyników
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    </q-item>
    <q-item>
    <q-select class="full-width" filled v-model="gunType" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterGunTypes" label="typ">
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Brak wyników
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    </q-item>
    <q-item><q-input filled class="full-width col" v-model="gunSerialNumber" label="numer seryjny"></q-input></q-item>
    <q-item><q-input filled class="full-width col" onkeypress="return (event.charCode > 44 && event.charCode < 58)" mask="####" v-model="gunProductionYear" label="rok produkcji"></q-input></q-item>
    <q-item><q-input filled class="full-width col" onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="gunRecordInEvidenceBook" label="pozycja z książki ewidencji"></q-input></q-item>
    <q-item><q-input filled class="full-width col" onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="gunNumberOfMagazines" label="ilość magazynków"></q-input></q-item>
    <q-item><q-input filled class="full-width col" v-model="gunCertificateSerialNumber" fill-mask="X" label="numer świadectwa"></q-input></q-item>
    <q-item><q-input filled class="full-width col" v-model="gunBasisForPurchaseOrAssignment" label="podstawa wpisu"></q-input></q-item>
    <q-item><q-input filled class="full-width col" v-model="gunAdditionalEquipment" label="wyposażenie dodatkowe"></q-input></q-item>
    <q-item><q-input filled class="full-width col" v-model="gunComment" label="uwagi"></q-input></q-item>
  </q-card-section>

  <q-card-actions align="right">
    <q-btn flat label="zamknij" color="primary" v-close-popup/>
    <q-btn label="Dodaj" color="primary" v-close-popup @click="addGun ()"/>
  </q-card-actions>
</q-card>
</q-dialog>
<q-dialog v-model="editGun">
<q-card style="width: 600px;">
  <q-card-section class="col">
    <div class="self-center col full-width no-outline text-center text-h6 text-bold">Edytuj informacje o broni</div>
    <q-item><q-input filled class="full-width col" v-model="gunModelName" label="nazwa i marka"></q-input></q-item>
    <q-item>
    <q-select class="full-width" filled v-model="gunCaliber" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filter" label="kaliber">
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Brak wyników
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    </q-item>
    <q-item>
    <q-select class="full-width" filled v-model="gunType" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterGunTypes" label="typ">
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Brak wyników
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    </q-item>
    <q-item><q-input filled class="full-width col" v-model="gunSerialNumber" label="numer seryjny"></q-input></q-item>
    <q-item><q-input filled class="full-width col" onkeypress="return (event.charCode > 44 && event.charCode < 58)" mask="####" v-model="gunProductionYear" label="rok produkcji"></q-input></q-item>
    <q-item><q-input filled class="full-width col" onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="gunRecordInEvidenceBook" label="pozycja z książki ewidencji"></q-input></q-item>
    <q-item><q-input filled class="full-width col" onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="gunNumberOfMagazines" label="ilość magazynków"></q-input></q-item>
    <q-item><q-input filled class="full-width col" v-model="gunCertificateSerialNumber" fill-mask="X" label="numer świadectwa"></q-input></q-item>
    <q-item><q-input filled class="full-width col" v-model="gunBasisForPurchaseOrAssignment" label="podstawa wpisu"></q-input></q-item>
    <q-item><q-input filled class="full-width col" v-model="gunAdditionalEquipment" label="wyposażenie dodatkowe"></q-input></q-item>
    <q-item><q-input filled class="full-width col" v-model="gunComment" label="uwagi"></q-input></q-item>
  </q-card-section>

  <q-card-actions align="right">
    <q-btn flat label="zamknij" color="primary" v-close-popup/>
    <q-btn label="Zmień informacje" color="primary" v-close-popup @click="editingGun ()"/>
  </q-card-actions>
</q-card>
</q-dialog>
<q-dialog position="top" v-model="success">
  <q-card >
    <q-card-section class="col">
    <div class="self-center col full-width no-outline text-center text-h5 text-bold">Wykonano żądanie</div>
  </q-card-section>

  </q-card>
</q-dialog>
<q-dialog v-model="newGunType">
  <q-card class="q-pa-md">
    <div class="self-center col full-width no-outline text-center text-h5 text-bold">Nadawanie nowego Typu Broni</div>
    <div>
      <q-item><q-input filled class="full-width col" v-model="newGunTypeName" label="Nowa nazwa"></q-input></q-item>
    </div>
    <q-card-section class="col">
  </q-card-section>

  <q-card-actions align="right">
    <q-btn label="Anuluj" color="primary" v-close-popup/>
    <q-btn label="Utwórz" color="primary" @click="createNewGunTYpe ()" v-close-popup/>
  </q-card-actions>
  </q-card>
</q-dialog>
<q-dialog position="top" v-model="fail">
  <q-card>
    <q-card-section class="col">
    <div class="self-center col full-width no-outline text-center text-h5 text-bold">Nie udało się wykonać żądania</div>
  </q-card-section>

  </q-card>
</q-dialog>
<q-dialog position="top" v-model="listDownload">
  <q-card>
    <q-card-section class="col">
    <div class="self-center col full-width no-outline text-center text-h5 text-bold">Pobrano Listę</div>
  </q-card-section>

  </q-card>
</q-dialog>
<q-dialog v-model="addCaliber">
  <q-card>
    <q-card-section class="col">
    <div class="self-center col full-width no-outline text-center text-h5 text-bold">Czy na pewno kaliber {{caliberName}} do bazy?</div>
  </q-card-section>
    <q-card-actions align="right">
      <q-btn label="anuluj" color="primary" flat v-close-popup/>
      <q-btn label="Dodaj" color="primary" v-close-popup @click="addNewCaliber()" />
    </q-card-actions>
  </q-card>
</q-dialog>
<q-dialog position="top" v-model="addedCaliber">
  <q-card>
    <q-card-section class="col">
    <div class="self-center col full-width no-outline text-center text-h5 text-bold">Dodano nowy kaliber do bazy</div>
  </q-card-section>

  </q-card>
</q-dialog>
<q-dialog v-model="acceptCode" persistent @keypress.enter="removeGun(),acceptCode=false">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="usuń" color="black" v-close-popup @click="removeGun(),code=null" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog position="top" v-model="forbidden" @keypress.enter="forbidden=false">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">Niewłaściwy kod. Spróbuj ponownie.</div>
        </q-card-section>

      </q-card>
</q-dialog>
  </q-page>
</template>

<script>

import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
const stringOptions = []
import Vue from 'vue'
import axios from 'axios'
import App from 'src/App.vue'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      options: stringOptions,
      selection: [],
      gunListSelect: [],
      listDownload: false,
      openGunList: false,
      addCaliber: false,
      addedCaliber: false,
      success: false,
      gunInfo: false,
      acceptCode: false,
      forbidden: false,
      gunUUID: null,
      code: null,
      usedGunInfo: [],
      ammoList: null,
      newGunType: false,
      newGunTypeName: null,
      date: null,
      date1: null,
      quantitySum: [],
      firstDate: null,
      secondDate: null,
      caliberName: null,
      ammoQuantity: null,
      ammoDate: null,
      ammoDescription: null,
      addCaliberDialog: false,
      caliberHistory: false,
      caliberUUID: null,
      calibers: [],
      history: [],
      filters: [],
      gunTypes: [],
      allGuns: [],
      gunAdding: false,
      editGun: false,
      fail: false,
      gunModelName: null,
      gunCaliber: null,
      gunType: null,
      gunSerialNumber: null,
      gunProductionYear: null,
      gunNumberOfMagazines: '',
      gunCertificateSerialNumber: null,
      gunAdditionalEquipment: '',
      gunRecordInEvidenceBook: null,
      gunComment: '',
      gunBasisForPurchaseOrAssignment: null,
      transportCertificate: false,
      local: App.host
    }
  },
  created () {
    this.getListCalibers()
    this.getListCalibersSelect()
    this.getGunType()
    this.getAllGuns()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    handleScroll (search) {
      const ele = document.getElementById(search)
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop - ele.scrollHeight
      const duration = 500
      setScrollPosition(target, offset, duration)
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
          this.success = true
          this.getAllGuns()
          this.autoClose()
        } else {
          this.fail = true
          this.autoClose()
        }
      })
    },
    removeGun () {
      fetch('http://' + this.local + '/armory/remove?gunUUID=' + this.gunUUID, {
        method: 'PUT'
      }).then(response => {
        if (response.status === 200) {
          this.success = true
          this.getAllGuns()
          this.autoClose()
        } else {
          this.fail = true
          this.autoClose()
        }
      })
    },
    createNewGunTYpe () {
      fetch('http://' + this.local + '/armory/newGunTypeName?nameType=' + this.newGunTypeName, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          this.success = true
          this.getAllGuns()
          this.autoClose()
        } else {
          this.fail = true
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
          this.gunBasisForPurchaseOrAssignment = null
          this.getAllGuns()
          this.autoClose()
        } else {
          this.fail = true
          this.autoClose()
        }
      })
    },
    getGunType () {
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
          this.fail = true
          this.autoClose()
        }
      })
    },
    addNewCaliber () {
      fetch('http://' + this.local + '/armory/calibers?caliber=' + this.caliberName, {
        method: 'POST'
      }).then(response => {
        if (response.status === 201) {
          this.addedCaliber = true
          this.getListCalibers()
          this.getListCalibersSelect()
          this.autoClose()
        } else {
          this.fail = true
          this.autoClose()
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
        this.listDownload = true
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
        this.listDownload = true
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
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.fail = false
        this.forbidden = false
        this.listDownload = false
        this.addedCaliber = false
      }, 2000)
    }
  },
  name: 'armory'
}
</script>
