<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Statystyki i Wyliczenia</div>
        </q-item>
      </div>
        <q-card>
        <q-card-section class="col">
            <q-item>
              <div class="q-pa-md self-center col full-width no-outline text-h5 text-bold text-center bg-grey-3">WPŁACONE SKŁADKI W WYBRANYM OKRESIE</div>
            </q-item>
            <div class="row">
            <q-item class="col">
              <q-input class="full-width" color="black" filled v-model="firstDate" label="Data początkowa">
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
              <q-input class="full-width" color="black" filled v-model="secondDate" label="Data końcowa">
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
            <div @click="getSum ()" class="q-pa-md" align="right">
              <q-radio class="q-pa-md" v-model="adultCondition" :val="true">
                dorośli
              </q-radio>
              <q-radio class="q-pa-md" v-model="adultCondition" :val="false">
                mołodzież
              </q-radio>
              <q-btn>Wyszukaj</q-btn>
              </div>
            </div>
            <div v-if="quantitySum.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h5">^ Brak wyników składek - Wybierz daty ^</div>
            <div v-if="quantitySum.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość składek : {{quantitySum.length}}</div>
            <q-scroll-area v-if="quantitySum.length >0" class="full-width q-pa-none" style="height: 500px;">
            <ol>
            <li v-for="(member,uuid) in quantitySum" :key="uuid" class="self-center col full-width no-outline text-center">
              <q-field color="black" class="self-center col full-width no-outline text-center" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                  <div class="self-center col full-width no-outline text-left">leg. {{member.legitimationNumber}}</div>
              </q-field>
              <p></p>
            </li>
            </ol>
            </q-scroll-area>
        </q-card-section>
        </q-card>
        <q-card>
        <q-card-section class="col">
          <q-item>
            <div class="q-pa-md self-center col full-width no-outline text-h5 text-bold text-center bg-grey-3">ILOŚĆ OSÓB SKREŚLONYCH W WYBRANYM OKRESIE</div>
          </q-item>
          <div class="row">
            <q-item class="col">
              <q-input class="full-width" color="black" filled v-model="firstDateErased" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="firstDateErased">
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
                      <q-date v-model="secondDateErased">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <div @click="getSumErased ()" class="q-pa-md" align="right">
              <q-btn>Wyszukaj</q-btn>
              </div>
            </div>
            <div v-if="quantitySumErased.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h5">^ Brak wyników skreślonych - Wybierz daty ^</div>
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
                  <div class="col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
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
        </q-card>
        <q-card>
        <q-card-section class="col">
          <q-item>
            <div class="q-pa-md self-center col full-width no-outline text-h5 text-bold text-center bg-grey-3">ILOŚĆ OPŁACONYCH LICENCJI W WYBRANYM OKRESIE</div>
          </q-item>
          <div class="row">
            <q-item class="col">
              <q-input class="full-width" color="black" filled v-model="firstDateLicense" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="firstDateLicense">
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
                      <q-date v-model="secondDateLicense">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <div @click="getSumLicensed ()" class="q-pa-md" align="right">
              <q-btn>Wyszukaj</q-btn>
              </div>
            </div>
            <div v-if="quantitySumLicense.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h5">^ Brak wyników opłaconych licencji - Wybierz daty ^</div>
            <div v-if="quantitySumLicense.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość licencji : {{quantitySumLicense.length}}</div>
            <q-scroll-area v-if="quantitySumLicense.length >0" class="full-width q-pa-none" style="height: 500px;">
              <q-field color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">Nazwisko i Imię</div>
                  <div class="self-center col full-width no-outline text-left">Numer legitymacji</div>
                  <div class="self-center col full-width no-outline text-left">Grupa</div>
                  <div class="self-center col full-width no-outline text-left">Status</div>
              </q-field>
            <ol>
            <li v-for="(member,uuid) in quantitySumLicense" :key="uuid" class="self-center col full-width no-outline">
              <q-field color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">{{member.secondName}} {{member.firstName}}</div>
                  <div class="self-center col full-width no-outline text-left">leg. {{member.legitimationNumber}}</div>
                  <div v-if="member.adult" class="self-center col full-width no-outline text-left">Ogólna</div>
                  <div v-if="!member.adult" class="self-center col full-width no-outline text-left">Młodzieżowa</div>
                  <div v-if="member.active" class="self-center col full-width no-outline text-left">Klubowicz aktywny</div>
                  <div v-if="!member.active" class="self-center col full-width no-outline text-left">Klubowicz nieaktywny</div>
              </q-field>
              <p></p>
            </li>
            </ol>
            </q-scroll-area>
        </q-card-section>
        </q-card>
        <q-card>
        <q-card-section class="col">
          <q-item>
            <div class="q-pa-md self-center col full-width no-outline text-h5 text-bold text-center bg-grey-3">ZAPISY DO KLUBU W WYBRANYM OKRESIE</div>
          </q-item>
          <div class="row">
            <q-item class="col">
              <q-input class="full-width" color="black" filled v-model="firstDateJoinDate" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="firstDateJoinDate">
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
                      <q-date v-model="secondDateJoinDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <div @click="getSumJoinDate ()" class="q-pa-md" align="right">
              <q-btn>Wyszukaj</q-btn>
              </div>
            </div>
            <div v-if="quantitySumJoinDate.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h5">^ Brak wyników zapisów - Wybierz daty ^</div>
            <div v-if="quantitySumJoinDate.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość zapisów : {{quantitySumJoinDate.length}}</div>
            <q-scroll-area v-if="quantitySumJoinDate.length >0" class="full-width q-pa-none" style="height: 500px;">
               <q-field color="black" class="self-center col full-width no-outline" standout="bg-accent text-black" stack-label>
                  <div class="self-center col full-width no-outline text-left">Nazwisko i Imię</div>
                  <div class="self-center col full-width no-outline text-left">Numer legitymacji</div>
                  <div class="self-center col full-width no-outline text-left">Data dołączenia do klubu</div>
                  <div class="self-center col full-width no-outline text-left">Grupa</div>
                  <div class="self-center col full-width no-outline text-left">Status</div>
              </q-field>
            <ol>
            <li v-for="(member,uuid) in quantitySumJoinDate" :key="uuid" class="text-bold text-h6">
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
            </li>
            </ol>
            </q-scroll-area>
        </q-card-section>
        </q-card>
        <q-card>
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
            <!-- <div v-if="quantitySumJoinDateByMonths.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość zapisów : {{month.length}}</div> -->
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
          <q-item>
            <div class="q-pa-md self-center col full-width no-outline text-h5 text-bold text-center bg-grey-3">KLUBOWICZE I AMUNICJA W WYBRANYM OKRESIE</div>
          </q-item>
          <div class="row">
            <q-item class="col">
              <q-input class="full-width" color="black"  filled v-model="firstDateAmmo" label="Data początkowa">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="firstDateAmmo">
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
                      <q-date v-model="secondDateAmmo">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Zamknij" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item>
            <div @click="memberAmmoTakesInTime ()" class="q-pa-md" align="right">
              <q-btn>Wyszukaj</q-btn>
              </div>
            </div>
            <div v-if="quantityAmmo.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h5">^ Brak wyników - Wybierz daty ^</div>
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
        </q-card>
        </q-card>
  </q-page>
</template>

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
      secondDate: null,
      firstDateJoinDate: null,
      secondDateJoinDate: null,
      firstDateErased: null,
      secondDateErased: null,
      firstDateLicense: null,
      secondDateLicense: null,
      firstDateAmmo: null,
      secondDateAmmo: null,
      year: null,
      month: null,
      quantitySum: [],
      quantitySumJoinDate: [],
      quantitySumErased: [],
      quantitySumLicense: [],
      quantitySumJoinDateByMonths: [],
      quantityAmmo: [],
      adultCondition: true,
      local: App.host
    }
  },
  created () {
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
    }
  },
  name: 'statistics'
}
</script>
