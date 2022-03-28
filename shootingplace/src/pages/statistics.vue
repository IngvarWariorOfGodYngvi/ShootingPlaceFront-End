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
        <q-card-section class="col-4">
            <q-item class="col">
              <q-input class="full-width" color="black" filled v-model="firstDate" label="Data początkowa">
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
              <q-input class="full-width" color="black" filled v-model="secondDate" label="Data końcowa">
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
           <div class="q-pa-md row-reverse" align="right">
             <div class="row-reverse">
              <q-radio @input="getSum()" class="q-pa-md" v-model="adultCondition" :val="false">
                mołodzież
              </q-radio>
              <q-radio @input="getSum()" class="q-pa-md" v-model="adultCondition" :val="true">
                dorośli
              </q-radio>
             </div>
              <q-btn @click="getSum ()" align="rigth">Wyszukaj</q-btn>
              </div>
        </q-card-section>
        <q-card-section class="col-8">
            <div v-if="quantitySum.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Ilość składek : {{quantitySum.length}}</div>
            <q-virtual-scroll :items="quantitySum" type="table" class="full-width q-pa-none" style="height: 500px;">
              <template v-slot:before>
        <thead class="thead-sticky text-left">
          <tr>
            <th class="text-center full-width">Imię i nazwisko</th>
            <th class="text-left full-width">Numer Legitymacji</th>
            <th class="text-center full-width">Licencja</th>
            <th class="text-center full-width">Status</th>
          </tr>
        </thead>
          </template>
          <template v-slot="{ item, index }">
            <tr :key="index" dense class="rounded" style="cursor:pointer">
              <td>{{item.secondName}} {{item.firstName}}</td>
              <td>{{item.legitimationNumber}}</td>
              <td>{{item.license.number}}</td>
              <td v-if="item.active">Aktywny</td>
              <td v-else>Nieaktywny</td>
            </tr>
          </template>
            <ol>
            <li v-for="(member,uuid) in quantitySum" :key="uuid" class="self-center col full-width no-outline text-center">
              <q-field color="black" class="self-center col full-width no-outline text-center" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                  <div class="self-center col full-width no-outline text-left">leg. {{member.legitimationNumber}}</div>
              </q-field>
              <p></p>
            </li>
            </ol>
            </q-virtual-scroll>
        </q-card-section>
        </div>
        </q-card>
      </q-expansion-item>
      <p></p>
      <q-expansion-item label="Zapisy do klubu" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2">
            <div class="row">
        <q-card-section class="col-4">
            <q-item class="col">
              <q-input class="full-width" color="black" filled v-model="firstDateJoinDate" label="Data początkowa">
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
              <q-input class="full-width" color="black" filled v-model="secondDateJoinDate" label="Data końcowa">
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
            <div class="q-pa-md" align="right">
              <q-btn @click="getSumJoinDate ()">Wyszukaj</q-btn>
            </div>
        </q-card-section>
        <q-card-section class="col-8">
            <div v-if="quantitySumJoinDate.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">^ Brak wyników zapisów - Wybierz daty ^</div>
            <div v-if="quantitySumJoinDate.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość zapisów : {{quantitySumJoinDate.length}}</div>
            <q-scroll-area v-if="quantitySumJoinDate.length >0" class="full-width q-pa-none" style="height: 500px;">
               <q-field color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">Nazwisko i Imię</div>
                  <div class="self-center col full-width no-outline text-left">Numer legitymacji</div>
                  <div class="self-center col full-width no-outline text-left">Data dołączenia do klubu</div>
                  <div class="self-center col full-width no-outline text-left">Grupa</div>
                  <div class="self-center col full-width no-outline text-left">Status</div>
              </q-field>
            <div v-for="(member,uuid) in quantitySumJoinDate" :key="uuid" >
              <p></p>
              <q-field v-if="!member.erased&&member.active" color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                  <div class="self-center col full-width no-outline text-left">leg. {{member.legitimationNumber}}</div>
                  <div class="self-center col full-width no-outline text-left">{{member.joinDate}}</div>
                  <div v-if="member.adult" class="self-center col full-width no-outline text-left">Ogólna</div>
                  <div v-if="!member.adult" class="self-center col full-width no-outline text-left">Młodzieżowa</div>
                  <div class="self-center col full-width no-outline text-left">Klubowicz aktywny</div>
              </q-field>
              <q-field v-if="!member.erased&&!member.active" color="black" class="self-center col full-width no-outline bg-yellow-3" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                  <div class="self-center col full-width no-outline text-left">leg. {{member.legitimationNumber}}</div>
                  <div class="self-center col full-width no-outline text-left">{{member.joinDate}}</div>
                  <div v-if="member.adult" class="self-center col full-width no-outline text-left">Ogólna</div>
                  <div v-if="!member.adult" class="self-center col full-width no-outline text-left">Młodzieżowa</div>
                  <div class="self-center col full-width no-outline text-left">Klubowicz aktywny</div>
              </q-field>
              <q-field v-if="member.erased" color="black" class="self-center col full-width no-outline bg-red-3" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                  <div class="self-center col full-width no-outline text-left">leg. {{member.legitimationNumber}}</div>
                  <div class="self-center col full-width no-outline text-left">{{member.joinDate}}</div>
                  <div v-if="member.adult" class="self-center col full-width no-outline text-left">Ogólna</div>
                  <div v-if="!member.adult" class="self-center col full-width no-outline text-left">Młodzieżowa</div>
                  <div class="self-center col full-width no-outline text-left">Klubowicz aktywny</div>
              </q-field>
              <p></p>
            </div>
            </q-scroll-area>
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
              <q-input class="full-width" color="black" filled v-model="firstDateLicense" label="Data początkowa">
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
              <q-input class="full-width" color="black" filled v-model="secondDateLicense" label="Data końcowa">
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
            <div class="q-pa-md" align="right">
              <q-btn @click="getSumLicensed ()" >Wyszukaj</q-btn>
            </div>
            <div class="row" align="right">
              <q-radio @input="paid = null, newLicense = null" v-model="allLicense" :val="true">Wszystkie</q-radio>
              <q-radio @input="allLicense = false, newLicense = null" v-model="paid" :val="true">Opłacone</q-radio>
              <q-radio @input="allLicense = false, newLicense = null" v-model="paid" :val="false">Nieopłacone</q-radio>
              <q-radio @input="allLicense = false, paid = null" v-model="newLicense" :val="true">Nowe</q-radio>
            </div>
            <div v-if="licenseArray.length > 0" class="row" align="right">
              <q-btn color="primary" @click="toggleLicenseAlert = true">Zatwierdź opłacenie zaznaczonych</q-btn>
            </div>
        </q-card-section>
        <q-card-section class="col">
            <div v-if="quantitySumLicense.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">^ Brak wyników opłaconych licencji - Wybierz daty ^</div>
            <div v-if="quantitySumLicense.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Ilość licencji : {{quantitySumLicense.length}}</div>
            <q-scroll-area v-if="quantitySumLicense.length >0" class="full-width q-pa-none" style="height: 500px;">
              <q-field color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                  <div class="self-center col no-outline text-left">Nazwisko i Imię</div>
                  <div class="self-center col no-outline text-right">Numer legitymacji</div>
                  <div class="self-center col no-outline text-center">Grupa</div>
                  <div class="self-center col no-outline text-center">Status</div>
                  <div class="self-center col-2 no-outline text-center">Data</div>
                  <div class="self-center col no-outline text-center">Nowa</div>
                  <div class="self-center col-1 no-outline text-left">Opłacone w PZSS</div>
              </q-field>
              <div v-if="paid==null&&allLicense" class="self-center col full-width no-outline">
                <div v-for="(member,uuid) in quantitySumLicense" :key="uuid">
                  <p></p>
                  <div>
                    <q-field color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                        <div class="self-center col no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                        <div class="self-center col no-outline text-center">leg. {{member.legitimationNumber}}</div>
                        <div v-if="member.adult" class="self-center col-2 no-outline text-center">Ogólna</div>
                        <div v-if="!member.adult" class="self-center col-2 no-outline text-center">Młodzieżowa</div>
                        <div v-if="member.active" class="self-center col no-outline text-center">Aktywny</div>
                        <div v-if="!member.active" class="self-center col no-outline text-center">Nieaktywny</div>
                        <div class="self-center col-2 no-outline text-center">{{member.date}}</div>
                        <div v-if="member.new" class="self-center col no-outline text-center bg-warning">Tak</div>
                        <div v-if="!member.new" class="self-center col no-outline text-center">Nie</div>
                        <div v-if="!member.payInPZSSPortal" @dblclick="paid=false,allLicense=false" class="self-center col-1 no-outline text-center bg-red-3">Nie</div>
                        <div v-if="member.payInPZSSPortal" @dblclick="paid=true,allLicense=false" class="self-center col-1 no-outline text-center bg-green-3">Tak</div>
                    </q-field>
                  </div>
                  <p></p>
                </div>
              </div>
              <div v-if="paid&&!allLicense" class="self-center col full-width no-outline">
                <div v-for="(member,uuid) in quantitySumLicense" :key="uuid">
                  <p></p>
                  <q-field v-if="member.payInPZSSPortal" color="black" class="self-center col full-width no-outline bg-green-2" standout="bg-accent text-black" stack-label>
                      <div class="self-center col no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                      <div class="self-center col no-outline text-center">leg. {{member.legitimationNumber}}</div>
                      <div v-if="member.adult" class="self-center col-2 no-outline text-center">Ogólna</div>
                      <div v-if="!member.adult" class="self-center col-2 no-outline text-center">Młodzieżowa</div>
                      <div v-if="member.active" class="self-center col no-outline text-center">Aktywny</div>
                      <div v-if="!member.active" class="self-center col no-outline text-center">Nieaktywny</div>
                      <div class="self-center col no-outline text-center">{{member.date}}</div>
                      <div v-if="member.new" class="self-center col no-outline text-center bg-warning">Tak</div>
                      <div v-if="!member.new" class="self-center col no-outline text-center">Nie</div>
                      <div v-if="member.payInPZSSPortal" class="self-center col-1 no-outline text-center">Tak</div>
                  </q-field>
                  <p></p>
                </div>
              </div>
              <div v-if="!paid&&!allLicense&&!newLicense" class="self-center col full-width no-outline">
                <div v-for="(member,uuid) in quantitySumLicense" :key="uuid">
                  <p></p>
                  <q-field v-if="!member.payInPZSSPortal" color="black" class="self-center col full-width no-outline bg-red-2" standout="bg-accent text-black" stack-label>
                      <q-checkbox v-model="licenseArray" :val="member.licenseUUID"></q-checkbox>
                      <div class="self-center col no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                      <div class="self-center col no-outline text-center">leg. {{member.legitimationNumber}}</div>
                      <div v-if="member.adult" class="self-center col-2 no-outline text-center">Ogólna</div>
                      <div v-if="!member.adult" class="self-center col-2 no-outline text-center">Młodzieżowa</div>
                      <div v-if="member.active" class="self-center col no-outline text-center">Aktywny</div>
                      <div v-if="!member.active" class="self-center col no-outline text-center">Nieaktywny</div>
                      <div class="self-center col no-outline text-left">{{member.date}}</div>
                      <div v-if="member.new" class="self-center col no-outline text-center bg-warning">Tak</div>
                      <div v-if="!member.new" class="self-center col no-outline text-center">Nie</div>
                      <div v-if="!member.payInPZSSPortal" class="self-center col-1 text-center">Nie</div>
                  </q-field>
                  <p></p>
                </div>
              </div>
              <div v-if="newLicense==true" class="self-center col full-width no-outline">
                <div v-for="(member,uuid) in quantitySumLicense" :key="uuid">
                  <p></p>
                    <q-field v-if="member.new" color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                        <div class="self-center col no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                        <div class="self-center col no-outline text-center">leg. {{member.legitimationNumber}}</div>
                        <div v-if="member.adult" class="self-center col-2 no-outline text-center">Ogólna</div>
                        <div v-if="!member.adult" class="self-center col-2 no-outline text-center">Młodzieżowa</div>
                        <div v-if="member.active" class="self-center col no-outline text-center">Aktywny</div>
                        <div v-if="!member.active" class="self-center col no-outline text-center">Nieaktywny</div>
                        <div class="self-center col-2 no-outline text-center">{{member.date}}</div>
                        <div v-if="member.new" class="self-center col no-outline text-center bg-warning">Tak</div>
                        <div v-if="!member.payInPZSSPortal" @dblclick="paid=false,allLicense=false" class="self-center col-1 no-outline text-center bg-red-3">Nie</div>
                        <div v-if="member.payInPZSSPortal" @dblclick="paid=true,allLicense=false" class="self-center col-1 no-outline text-center bg-green-3">Tak</div>
                    </q-field>
                  <p></p>
                </div>
              </div>
            </q-scroll-area>
        </q-card-section>
        </div>
        </q-card>
      </q-expansion-item>
      <p></p>
      <q-expansion-item label="Osoby skreślone" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2">
            <div class="row">
        <q-card-section class="col-4">
            <q-item class="col">
              <q-input class="full-width" color="black" filled v-model="firstDateErased" label="Data początkowa">
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
              <q-input class="full-width" color="black" filled v-model="secondDateErased" label="Data końcowa">
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
              <div class="q-pa-md" align="right">
                <q-btn @click="getSumErased ()">Wyszukaj</q-btn>
              </div>
        </q-card-section>
        <q-card-section class="col-8">
            <div v-if="quantitySumErased.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">^ Brak wyników skreślonych - Wybierz daty ^</div>
            <div v-if="quantitySumErased.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość skreślonych : {{quantitySumErased.length}}</div>
            <q-scroll-area v-if="quantitySumErased.length >0" class="full-width q-pa-none" style="height: 500px;">
              <q-field color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">Nazwisko i Imię</div>
                  <div class="self-center col full-width no-outline text-center">Powód</div>
                  <div class="self-center col full-width no-outline text-left">Numer legitymacji</div>
                  <div class="self-center col full-width no-outline text-left">Informacje dodatkowe </div>
              </q-field>
            <ol>
            <li v-for="(member,uuid) in quantitySumErased" :key="uuid" class="self-center col full-width no-outline text-center">
              <q-field color="black" class="self-center col full-width no-outline text-center" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                  <div class="self-center col full-width no-outline text-left">{{member.erasedEntity.date}} {{member.erasedEntity.erasedType}}</div>
                  <div class="self-center col full-width no-outline text-left">leg. {{member.legitimationNumber}}</div>
                  <div v-if="member.erasedEntity.additionalDescription==null" class="self-center col full-width no-outline text-left">Brak dodatkowych informacji</div>
                  <div v-if="member.erasedEntity.additionalDescription!=null" class="self-center col full-width no-outline text-left">{{member.erasedEntity.additionalDescription}}</div>
              </q-field>
              <p></p>
            </li>
            </ol>
            </q-scroll-area>
        </q-card-section>
        </div>
        </q-card>
      </q-expansion-item>
      <p></p>
      <q-expansion-item label="Klubowicze i amunicja" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2">
            <div class="row">
        <q-card-section class="col-4">
            <q-item class="col">
              <q-input class="full-width" color="black"  filled v-model="firstDateAmmo" label="Data początkowa">
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
              <q-input class="full-width" color="black" filled v-model="secondDateAmmo" label="Data końcowa">
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
              <div class="q-pa-md" align="right">
              <q-btn @click="memberAmmoTakesInTime ()">Wyszukaj</q-btn>
            </div>
        </q-card-section>
        <q-card-section class="col-8">
            <div v-if="quantityAmmo.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">^ Brak wyników - Wybierz daty ^</div>
            <q-scroll-area v-if="quantityAmmo.length >0" class="full-width q-pa-none" style="height: 500px;">
            <ol>
            <li v-for="(member,uuid) in quantityAmmo" :key="uuid" class="text-bold text-h6">
              <q-field color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                  <div class="self-center col full-width no-outline text-left">leg. {{member.legitimationNumber}}</div>
              </q-field>
              <p></p>
              <q-field color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                 <div class="self-center col full-width no-outline text-left">kaliber</div>
                 <div class="self-center col full-width no-outline text-left">Ilość</div>
              </q-field>
              <div v-for="(caliber,id) in member.caliber" :key="id">
                  <q-field color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                     <div class="self-center col full-width no-outline text-left">{{caliber.name}}</div>
                     <div class="self-center col full-width no-outline text-left">{{caliber.quantity}}</div>
                  </q-field>
              </div>
            <p></p>
            </li>
            </ol>
            </q-scroll-area>
        </q-card-section>
        </div>
        </q-card>
      </q-expansion-item>
      <p></p>
<!--        <q-card>
        <q-card-section class="col">
          <q-item>
            <div class="q-pa-md self-center col full-width no-outline text-h5 text-bold text-center bg-grey-3">OSOBY ZAPISANE W WYBRANYM ROKU</div>
          </q-item>
          <div class="row">
            <q-item class="col">
              <q-input @keypress.enter="getMembersInMonths ()" class="full-width" color="black" filled v-model="year" label="wybierz rok" mask="####/12/31">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="year">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <div @click="getMembersInMonths ()" class="q-pa-md" align="right">
              <q-btn>Wyszukaj</q-btn>
              </div>
            </div>
            <div v-if="quantitySumJoinDateByMonths.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h5">^ Brak wyników zapisów - Wybierz daty ^</div>
            <q-scroll-area v-if="quantitySumJoinDateByMonths.length >0" class="full-width q-pa-none" style="height: 500px;">
              <q-field color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">Nazwisko i Imię</div>
                  <div class="self-center col full-width no-outline text-left">Numer legitymacji</div>
                  <div class="self-center col full-width no-outline text-left">Data dołączenia do klubu</div>
                  <div class="self-center col full-width no-outline text-left">Grupa</div>
                  <div class="self-center col full-width no-outline text-left">Status</div>
              </q-field>
            <div v-for="(months,id) in quantitySumJoinDateByMonths" :key="id" class="self-center col full-width no-outline">
            <ol>
                <li v-for="(member,id) in months" :key="id" class="text-bold text-h6">
                    <q-field v-if="!member.erased&&member.active" color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                        <div class="self-center col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                        <div class="self-center col full-width no-outline text-left">leg. {{member.legitimationNumber}}</div>
                        <div class="self-center col full-width no-outline text-left">{{member.joinDate}}</div>
                        <div v-if="member.adult" class="self-center col full-width no-outline text-left">Ogólna</div>
                        <div v-if="!member.adult" class="self-center col full-width no-outline text-left">Młodzieżowa</div>
                        <div class="self-center col full-width no-outline text-left">Klubowicz aktywny</div>
                    </q-field>
                    <q-field v-if="!member.erased&&!member.active" color="black" class="self-center col full-width no-outline bg-yellow-3" standout="bg-accent text-black" stack-label>
                        <div class="self-center col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                        <div class="self-center col full-width no-outline text-left">leg. {{member.legitimationNumber}}</div>
                        <div class="self-center col full-width no-outline text-left">{{member.joinDate}}</div>
                        <div v-if="member.adult" class="self-center col full-width no-outline text-left">Ogólna</div>
                        <div v-if="!member.adult" class="self-center col full-width no-outline text-left">Młodzieżowa</div>
                        <div class="self-center col full-width no-outline text-left">Klubowicz nieaktywny</div>
                    </q-field>
                    <q-field v-if="member.erased" color="black" class="self-center col full-width no-outline bg-red-3" standout="bg-accent text-black" stack-label>
                        <div class="self-center col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                        <div class="self-center col full-width no-outline text-left">leg. {{member.legitimationNumber}}</div>
                        <div class="self-center col full-width no-outline text-left">{{member.joinDate}}</div>
                        <div v-if="member.adult" class="self-center col full-width no-outline text-left">Ogólna</div>
                        <div v-if="!member.adult" class="self-center col full-width no-outline text-left">Młodzieżowa</div>
                        <div class="self-center col full-width no-outline text-left">Klubowicz skreślony</div>
                    </q-field>
                    <p></p>
                </li>
            </ol>
            </div>
            </q-scroll-area>
        </q-card-section>
        </q-card>
        <q-card>
          <q-card>
        <q-card-section class="col">

          <div class="row">

            </div>
        </q-card-section>
        </q-card>
        </q-card> -->
<q-dialog v-model="toggleLicenseAlert" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input @keypress.enter="toggleHistoryPayment(),toggleLicenseAlert=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
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
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">

</style>
<script>

import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
import Vue from 'vue'
import axios from 'axios'
import App from 'src/App.vue'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
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
      quantitySumJoinDate: [],
      quantitySumErased: [],
      quantitySumLicense: [],
      quantitySumJoinDateByMonths: [],
      quantityAmmo: [],
      adultCondition: true,
      allLicense: false,
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
      const today = date.getFullYear() + '/' + month + '/' + day
      return today
    },
    handleScroll (search) {
      const ele = document.getElementById(search)
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop - ele.scrollHeight
      const duration = 500
      setScrollPosition(target, offset, duration)
    },
    getSum () {
      fetch('http://' + this.local + '/statistics/contributionSum?firstDate=' + this.firstDate.replace(/\//gi, '-') + '&secondDate=' + this.secondDate.replace(/\//gi, '-') + '&condition=' + this.adultCondition, {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySum = response
        })
      })
    },
    getSumJoinDate () {
      fetch('http://' + this.local + '/statistics/joinDateSum?firstDate=' + this.firstDateJoinDate.replace(/\//gi, '-') + '&secondDate=' + this.secondDateJoinDate.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySumJoinDate = response
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
          this.allLicense = true
        })
      })
    },
    getMembersInMonths () {
      fetch('http://' + this.local + '/statistics/joinMonthSum?year=' + this.year.replace(/\//gi, '-'), {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySumJoinDateByMonths = response
        })
      })
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
        this.downloaded = false
        this.message = null
        this.code = null
      }, 2000)
    }
  },
  name: 'statistics'
}
</script>
