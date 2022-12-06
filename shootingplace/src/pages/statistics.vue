<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Statystyki</div>
        </q-item>
      </div>
      <q-expansion-item label="Składki" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2">
            <div class="row">
        <q-card-section class="col-3">
            <q-item class="col">
              <q-input class="full-width" color="black" dense filled v-model="firstDate" mask="####-##-##" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date no-unset @input="getSum()" v-model="firstDate">
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
              <q-input class="full-width" color="black" dense filled v-model="secondDate" mask="####-##-##" label="Data końcowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date @input="getSum()" v-model="secondDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
           <div class="row-reverse">
             <div class="row-reverse">
              <q-radio @input="rearangeSumTable ()" class="q-pa-md" v-model="adultCondition" :val="false">
                młodzież
              </q-radio>
              <q-radio @input="rearangeSumTable ()" class="q-pa-md" v-model="adultCondition" :val="true">
                dorośli
              </q-radio>
             </div>
              <q-btn align=right @click="getSum();rearangeSumTable ()">Wyszukaj</q-btn>
              </div>
        </q-card-section>
        <q-card-section class="col">
            <div v-if="quantitySumRearangeTable.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Ilość Składek : {{quantitySumRearangeTable.length}}</div>
            <q-virtual-scroll v-if="quantitySumRearangeTable.length >0" :items="quantitySumRearangeTable" type="table" dense class="q-pa-none" style="height: 40vh;">
              <template v-slot:before>
        <thead class="thead-sticky text-left">
          <tr>
            <th class="text-left" ><div>{{quantitySumRearangeTable.length}} Nazwisko i Imię</div></th>
            <th class="text-left" style="width: 20%"><div>Numer</div><div>Legitymacji</div></th>
            <th class="text-left" style="width: 20%"><div>Numer</div><div>Licencji</div></th>
            <th class="text-left" style="width: 20%">Status</th>
          </tr>
        </thead>
          </template>
          <template v-slot="{ item, index }">
            <tr :key="index" class="rounded" style="cursor:pointer" @dblclick="legitimationNumber = item.legitimationNumber; memberDial=true">
              <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
              </q-tooltip>
              <td class="xyz"><b>{{index+1}}</b> {{item.secondName}} {{item.firstName}}</td>
              <td>nr. leg {{item.legitimationNumber}}</td>
              <td v-if="item.license.number != null" class="text-left">{{item.license.number}}</td>
              <td v-if="item.license.number == null" class="text-left text-grey-8"><div>Brak Licencji</div></td>
              <td v-if="item.active" class="bg-green-3 text-left"><div>Aktywny</div></td>
              <td v-if="!item.active" class="bg-warning text-left"><div>Nieaktywny</div></td>
            </tr>
          </template>
            </q-virtual-scroll>
        </q-card-section>
        </div>
        </q-card>
      </q-expansion-item>
      <p></p>
      <q-expansion-item label="Zapisy do klubu" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2">
            <div class="row">
        <q-card-section class="col-3">
            <q-item class="col">
              <q-input class="full-width" color="black" dense filled v-model="firstDateJoinDate" mask="####-##-##" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date @input="getSumJoinDate ()" v-model="firstDateJoinDate">
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
              <q-input class="full-width" color="black" dense filled v-model="secondDateJoinDate" mask="####-##-##" label="Data końcowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date @input="getSumJoinDate ()" v-model="secondDateJoinDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <div class="q-pa-md">
              <q-btn @click="getSumJoinDate ()">Wyszukaj</q-btn>
            </div>
        </q-card-section>
        <q-card-section class="col">
            <div v-if="quantitySumJoinDateRearangeTable.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">^ Brak wyników zapisów - Wybierz daty ^</div>
            <div v-if="quantitySumJoinDateRearangeTable.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Ilość Zapisów : {{quantitySumJoinDateRearangeTable.length}}</div>
        <q-virtual-scroll v-if="quantitySumJoinDateRearangeTable.length >0" :items="quantitySumJoinDateRearangeTable" type="table" dense class="row full-width" style="height: 50vh;">
          <template v-slot:before>
        <thead class="thead-sticky text-left">
          <tr>
            <th class="text-left"><div>{{quantitySumJoinDateRearangeTable.length}} Nazwisko i Imię</div></th>
            <th class="text-left" style="width: 15%"><div>Numer</div><div>Legitymacji</div></th>
            <th class="text-left" style="width: 15%"><div>Data dołączenia do</div><div>Klubu</div></th>
            <th class="text-left" style="width: 15%">Grupa</th>
            <th class="text-left" style="width: 15%">Status</th>
          </tr>
        </thead>
          </template>
    <template v-slot="{ item, index }">
      <tr :key="index" class="rounded" style="cursor:pointer" @dblclick="legitimationNumber = item.legitimationNumber; memberDial=true">
        <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
        </q-tooltip>
        <td class="text-left xyz"><b>{{index+1}}</b> {{item.secondName}} {{item.firstName}}</td>
        <td class="text-left">nr leg. {{item.legitimationNumber}}</td>
        <td class="text-left">{{item.joinDate}}</td>
        <td v-if="item.adult" class="text-left"><div>Ogólna</div></td>
        <td v-if="!item.adult" class="text-left"><div>Młodzieżowa</div></td>
        <td v-if="item.active" class="bg-green-3 text-left"><div>Aktywny</div></td>
        <td v-if="!item.active" class="bg-warning text-left"><div>Nieaktywny</div></td>
      </tr>
      </template>
      </q-virtual-scroll>
        </q-card-section>
        </div>
        </q-card>
      </q-expansion-item>
      <p></p>
      <q-expansion-item label="Opłaty za licencje" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2">
            <div class="row">
        <q-card-section class="col-3">
            <q-item class="col">
              <q-input class="full-width" color="black" dense filled v-model="firstDateLicense" mask="####-##-##" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date @input="getSumLicensed ()" v-model="firstDateLicense">
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
              <q-input class="full-width" color="black" dense filled v-model="secondDateLicense" mask="####-##-##" label="Data końcowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date @input="getSumLicensed ()" v-model="secondDateLicense">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <div class="q-pa-md">
              <q-btn @click="getSumLicensed ()" >Wyszukaj</q-btn>
            </div>
            <div class="row">
              <q-radio @input="paid = null; newLicense = null; getSumLicensed ()" v-model="allLicense" :val="true">Wszystkie</q-radio>
              <q-radio @input="allLicense = false; newLicense = null; rearangeSumLicensedTable()" v-model="paid" :val="true">Opłacone</q-radio>
              <q-radio @input="allLicense = false; newLicense = null; rearangeSumLicensedTable ()" v-model="paid" :val="false">Nieopłacone</q-radio>
              <q-radio @input="allLicense = false; paid = null; rearangeSumLicensedTable ()" v-model="newLicense" :val="true">Nowe</q-radio>
            </div>
            <div v-if="licenseArray.length > 0" class="row">
              <q-btn color="primary" @click="toggleLicenseAlert = true">Zatwierdź opłacenie zaznaczonych</q-btn>
            </div>
        </q-card-section>
        <q-card-section class="col">
            <div v-if="quantitySumLicenseRearangeTable.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">^ Brak wyników opłaconych licencji - Wybierz daty ^</div>
            <div v-if="quantitySumLicenseRearangeTable.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Ilość Licencji : {{quantitySumLicenseRearangeTable.length}}</div>
            <q-virtual-scroll v-if="quantitySumLicenseRearangeTable.length >0" :items="quantitySumLicenseRearangeTable" type="table" dense class="row full-width" style="height: 50vh;">
          <template v-slot:before>
        <thead class="thead-sticky text-left">
          <tr>
            <th class="text-left"><div>{{quantitySumLicenseRearangeTable.length}}Nazwisko i Imię</div></th>
            <th class="text-left" style="width: 10%;"><div>Numer</div><div>Legitymacji</div></th>
            <th class="text-left" style="width: 10%;">Grupa</th>
            <th class="text-left" style="width: 10%;">Status</th>
            <th class="text-left" style="width: 15%;">Data</th>
            <th class="text-left" style="width: 15%;"><div>Nowa /</div><div>Przedłużenie</div></th>
            <th class="text-left" style="width: 15%;"><div>Opłacone w</div><div>PZSS</div></th>
          </tr>
        </thead>
          </template>
    <template v-slot="{ item, index }">
      <tr :key="index" class="rounded" style="cursor:pointer" @dblclick="legitimationNumber = item.legitimationNumber; memberDial=true">
        <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
        </q-tooltip>
        <td v-if="!paid" class="text-left xyz"><q-checkbox dense v-model="licenseArray" :val="item.licenseUUID" :label="(index+1) + ' ' +item.secondName + ' ' + item.firstName "></q-checkbox></td>
        <td v-else class="text-left xyz"><b>{{index+1}}</b> {{item.secondName}} {{item.firstName}} </td>
        <td class="text-left">nr leg. {{item.legitimationNumber}}</td>
        <td v-if="item.adult" class="text-left"><div>Ogólna</div></td>
        <td v-if="!item.adult" class="text-left"><div>Młodzieżowa</div></td>
        <td v-if="item.active" class="bg-green-3 text-left"><div>Aktywny</div></td>
        <td v-if="!item.active" class="bg-warning text-left"><div>Nieaktywny</div></td>
        <td class="text-left">{{item.date}}</td>
        <td v-if="item.new" class="bg-warning">Nowa</td>
        <td v-if="!item.new" >Przedłużenie</td>
        <td v-if="item.payInPZSSPortal" class="bg-green-3">Opłacone</td>
        <td v-if="!item.payInPZSSPortal" class="bg-red-3">Nieopłacone</td>
      </tr>
      </template>
      </q-virtual-scroll>
        </q-card-section>
        </div>
        </q-card>
      </q-expansion-item>
      <p></p>
      <q-expansion-item label="Osoby skreślone" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2">
            <div class="row">
        <q-card-section class="col-3">
            <q-item class="col">
              <q-input class="full-width" color="black" dense filled v-model="firstDateErased" mask="####-##-##" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date @input="getSumErased ()" v-model="firstDateErased">
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
              <q-input class="full-width" color="black" dense filled v-model="secondDateErased" mask="####-##-##" label="Data końcowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date @input="getSumErased ()" v-model="secondDateErased">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
              <div class="q-pa-md">
                <q-btn @click="getSumErased ()">Wyszukaj</q-btn>
              </div>
        </q-card-section>
        <q-card-section class="col">
            <div v-if="quantitySumErased.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">^ Brak wyników skreślonych - Wybierz daty ^</div>
            <div v-if="quantitySumErased.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość skreślonych : {{quantitySumErased.length}}</div>
        <q-virtual-scroll v-if="quantitySumErased.length >0" :items="quantitySumErased" type="table" dense class="row full-width" style="height: 50vh;">
          <template v-slot:before>
        <thead class="thead-sticky text-left">
          <tr>
            <th class="text-left"><div>{{quantitySumErased.length}} Nazwisko i Imię</div></th>
            <th class="text-left" style="width:10%;">Powód</th>
            <th class="text-left" style="width:10%;"><div>Numer</div><div>Legitymacji</div></th>
            <th class="text-left" style="width:30%;"><div>Informacje</div><div>Dodatkowe</div></th>
          </tr>
        </thead>
          </template>
    <template v-slot="{ item, index }">
      <tr :key="index" style="cursor:pointer"  @dblclick="legitimationNumber = item.legitimationNumber; memberDial=true">
        <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
        </q-tooltip>
        <td class="text-left xyz"><b>{{index+1}} </b> {{item.secondName}} {{item.firstName}}</td>
        <td class="text-left"><div>{{item.erasedEntity.date}}</div><div>{{item.erasedEntity.erasedType}}</div></td>
        <td class="text-left">nr leg. {{item.legitimationNumber}}</td>
        <td v-if="item.erasedEntity.additionalDescription==null" class="text-left"><div>Brak dodatkowych informacji</div></td>
        <td v-if="item.erasedEntity.additionalDescription!=null" class="bg-warning self-center text-center"><div>{{item.erasedEntity.additionalDescription}}</div></td>
      </tr>
      </template>
      </q-virtual-scroll>
        </q-card-section>
        </div>
        </q-card>
      </q-expansion-item>
      <p></p>
      <q-expansion-item label="Klubowicze i amunicja" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2">
            <div class="row">
        <q-card-section class="col-3">
            <q-item class="col">
              <q-input class="full-width" color="black" dense filled v-model="firstDateAmmo" mask="####-##-##" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date @input="memberAmmoTakesInTime ()"  v-model="firstDateAmmo">
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
              <q-input class="full-width" color="black" dense filled v-model="secondDateAmmo" mask="####-##-##" label="Data końcowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date @input="memberAmmoTakesInTime ()" v-model="secondDateAmmo">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
              <div class="q-pa-md">
              <q-btn @click="memberAmmoTakesInTime ()">Wyszukaj</q-btn>
            </div>
        </q-card-section>
        <q-card-section class="col">
            <div v-if="quantityAmmo.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">^ Brak wyników - Wybierz daty ^</div>
            <q-virtual-scroll v-if="quantityAmmo.length >0" :items="quantityAmmo" type="table" dense class="row full-width" style="height: 50vh;">
          <template v-slot:before>
        <thead class="thead-sticky text-left">
          <tr>
            <th class="text-left" style="width: 25%"><div>{{quantityAmmo.length}} Nazwisko i Imię</div></th>
            <th class="text-left" style="width: 15%"><div>Numer</div><div>Legitymacji</div></th>
            <th class="text-left" style="width: 10%" >5,6mm</th>
            <th class="text-left" style="width: 10%">9x19mm</th>
            <th class="text-left" style="width: 10%">12/76</th>
            <th class="text-left" style="width: 10%">.38</th>
            <th class="text-left" style="width: 10%">.357</th>
            <th class="text-left" style="width: 10%">7,62x39mm</th>
          </tr>
        </thead>
          </template>
    <template v-slot="{ item, index }">
      <tr :key="index" style="cursor:pointer" @dblclick="legitimationNumber = item.legitimationNumber; memberDial=true">
        <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
        </q-tooltip>
        <td class="text-left xyz"><div><b>{{index+1}} </b>{{item.secondName}} {{item.firstName}}</div></td>
        <td class="text-left">nr leg. {{item.legitimationNumber}}</td>
        <td class="text-left"><div v-for="(caliber,id) in item.caliber" :key="id">
          <div v-if="caliber.name === '5,6mm'">{{caliber.quantity}} szt.</div></div></td>
        <td class="text-left"><div v-for="(caliber,id) in item.caliber" :key="id">
          <div v-if="caliber.name === '9x19mm'">{{caliber.quantity}} szt.</div></div></td>
        <td class="text-left"><div v-for="(caliber,id) in item.caliber" :key="id">
          <div v-if="caliber.name === '12/76'">{{caliber.quantity}} szt.</div></div></td>
        <td class="text-left"><div v-for="(caliber,id) in item.caliber" :key="id">
          <div v-if="caliber.name === '.38'">{{caliber.quantity}} szt.</div></div></td>
        <td class="text-left"><div v-for="(caliber,id) in item.caliber" :key="id">
          <div v-if="caliber.name === '.357'">{{caliber.quantity}} szt.</div></div></td>
        <td class="text-left"><div v-for="(caliber,id) in item.caliber" :key="id">
          <div v-if="caliber.name === '7,62x39mm'">{{caliber.quantity}} szt.</div></div></td>
      </tr>
      </template>
      </q-virtual-scroll>
        </q-card-section>
        </div>
        </q-card>
      </q-expansion-item>
      <p></p>
<q-dialog v-model="toggleLicenseAlert" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input @keypress.enter="toggleHistoryPayment();toggleLicenseAlert=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="Zatwierdź zmiany" color="black" v-close-popup @click="toggleHistoryPayment()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog :position="'top'" v-model="failure">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{message}}</div>
          <div v-else class="text-h6">Nie można wykonać żądania. Sprawdź poprawność danych.</div>
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
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card style="min-width: 80vw">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="legitimationNumber"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="black" v-close-popup @click="pinCode=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">

</style>
<script>

import { scroll } from 'quasar'
import App from 'src/App.vue'
import Member from 'components/Member.vue'

const { getScrollTarget, setScrollPosition } = scroll

export default {
  components: {
    Member
  },
  data () {
    return {
      memberDial: false,
      legitimationNumber: null,
      firstDate: null,
      secondDate: this.createTodayDate(),
      firstDateJoinDate: null,
      secondDateJoinDate: this.createTodayDate(),
      firstDateErased: null,
      secondDateErased: this.createTodayDate(),
      firstDateLicense: null,
      secondDateLicense: this.createTodayDate(),
      firstDateAmmo: null,
      secondDateAmmo: this.createTodayDate(),
      year: null,
      month: null,
      code: null,
      licenseArray: [],
      quantitySum: [],
      quantitySumRearangeTable: [],
      quantitySumJoinDate: [],
      quantitySumJoinDateRearangeTable: [],
      quantitySumErased: [],
      quantitySumLicense: [],
      quantitySumLicenseRearangeTable: [],
      quantitySumJoinDateByMonths: [],
      quantityAmmo: [],
      adultCondition: null,
      allLicense: true,
      toggleLicenseAlert: false,
      forbidden: false,
      failure: false,
      success: false,
      message: null,
      paid: null,
      newLicense: null,
      local: App.host
    }
  },
  created () {
    this.createTodayDate()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
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
      return date.getFullYear() + '/' + month + '/' + day
    },
    handleScroll (search) {
      const ele = document.getElementById(search)
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop - ele.scrollHeight
      const duration = 500
      setScrollPosition(target, offset, duration)
    },
    getSum () {
      fetch('http://' + this.local + '/statistics/contributionSum?firstDate=' + this.firstDate.replace(/\//gi, '-') + '&secondDate=' + this.secondDate.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySum = response
          this.quantitySumRearangeTable = response
        })
      })
    },
    getSumJoinDate () {
      fetch('http://' + this.local + '/statistics/joinDateSum?firstDate=' + this.firstDateJoinDate.replace(/\//gi, '-') + '&secondDate=' + this.secondDateJoinDate.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySumJoinDate = response
          this.quantitySumJoinDateRearangeTable = response
        })
      })
    },
    getSumErased () {
      fetch('http://' + this.local + '/statistics/erasedSum?firstDate=' + this.firstDateErased.replace(/\//gi, '-') + '&secondDate=' + this.secondDateErased.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySumErased = response
        })
      })
    },
    getSumLicensed () {
      fetch('http://' + this.local + '/statistics/licenseSum?firstDate=' + this.firstDateLicense.replace(/\//gi, '-') + '&secondDate=' + this.secondDateLicense.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySumLicense = response
          this.quantitySumLicenseRearangeTable = response
          this.allLicense = true
        })
      })
    },
    rearangeSumLicensedTable () {
      const arr = this.quantitySumLicense
      const arr1 = []
      if (this.paid !== null) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].payInPZSSPortal === this.paid) {
            arr1.push(arr[i])
          }
        }
      }
      if (this.newLicense === true) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].new === true) {
            arr1.push(arr[i])
          }
        }
      }
      this.quantitySumLicenseRearangeTable = arr1
    },
    rearangeSumTable () {
      const arr = this.quantitySum
      const arr1 = []
      if (this.adultCondition !== null) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].adult === this.adultCondition) {
            arr1.push(arr[i])
          }
        }
      }
      this.quantitySumRearangeTable = arr1
    },
    memberAmmoTakesInTime () {
      fetch('http://' + this.local + '/statistics/memberAmmoTakesInTime?firstDate=' + this.firstDateAmmo.replace(/\//gi, '-') + '&secondDate=' + this.secondDateAmmo.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantityAmmo = response
        })
      })
    },
    toggleHistoryPayment () {
      fetch('http://' + this.local + '/license/paymentToggleArray?paymentUUIDs=' + this.licenseArray + '&pinCode=' + this.code, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.allLicense = true
              this.paid = null
              this.quantitySumLicense = []
              this.licenseArray = []
              this.showloading()
              this.getSumLicensed()
              this.autoClose()
            })
        } if (response.status === 403) {
          this.forbidden = true
          this.autoClose()
        } if (response.status === 400) {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.success = false
        this.forbidden = false
        this.message = null
        this.code = null
      }, 2000)
    }
  },
  name: 'statistics'
}
</script>
