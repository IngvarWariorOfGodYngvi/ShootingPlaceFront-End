<template>
  <q-page padding>
    <div>
      <q-item>
        <div class="text-center col full-width no-outline text-h4 text-bold text-positive">Zawody</div>
      </q-item>
    </div>
    <q-card class="row bg-dark text-positive">
      <q-card-section v-if="tournaments==null">
        <q-btn
          color="primary"
          label="dodaj zawody"
          @click="addNewTournament = true"
        ></q-btn>
      </q-card-section>
      <q-card-section>
        <q-btn
          color="secondary"
          label="Kreator konkurencji"
          @click=";createNewCompetiton = true"
        ></q-btn>
      </q-card-section>
    </q-card>
    <div class="row">
      <q-card class="col-10 bg-dark text-positive">
        <div v-if="tournaments!=null" class="row text-h6">
          <div class="col-6">
            <q-item-section class="col q-pa-md">
              <div class="col">
                <q-item-label>{{ tournaments.name }} {{ tournaments.date }}</q-item-label>
                <q-item-label v-if="tournaments.wzss" caption lines="2" class="text-positive">zawody wpisane do
                  kalendarza Wojewódzkiego Związku Strzelectwa Sportowego
                </q-item-label>
                <q-item-label v-if="!tournaments.wzss" caption lines="2">zawody nie wpisane do kalendarza Wojewódzkiego
                  związku
                </q-item-label>
              </div>
            </q-item-section>
          </div>
          <div class="col-3">
            <q-item>
              <q-btn-dropdown @click="tournamentUUID = tournaments.uuid;date= tournaments.date;name = tournaments.name"
                              align="center" content-class="bg-dark" class="full-width" label="pobierz komunikat"
                              color="primary">
                <q-list>
                  <q-item v-close-popup class="q-pa-none">
                    <q-item-section>
                      <q-btn @click="getAnnouncementFromCompetition()" class="full-width bg-red-6"
                             label="pobierz plik .pdf" color="secondary"></q-btn>
                    </q-item-section>
                  </q-item>
                  <q-item v-close-popup class="q-pa-none">
                    <q-item-section>
                      <q-btn @click="getAnnouncementFromCompetitionXLSX()" class="full-width bg-green-6"
                             label="pobierz plik .xslx" color="secondary"></q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item>
            <q-item>
              <q-btn color="primary" class="full-width" label="pobierz listę Sędziów"
                     @click="tournamentUUID = tournaments.uuid;name= tournaments.name;date = tournaments.date;getJudgeFromTournament ()"></q-btn>
            </q-item>
            <q-item>
              <q-btn color="white" class="text-black full-width" v-if="tournaments.open" label="dodaj sędziów"
                     @click="tournamentUUID = tournaments.uuid;addArbitersConfirmbtn = true"></q-btn>
            </q-item>
            <q-item v-if="tournaments.open">
              <q-btn color="white" class="text-black full-width" label="dodaj konkurencje"
                     @click="tournamentUUID = tournaments.uuid;addCompetitionConfirmbtn = true"></q-btn>
            </q-item>
            <q-dialog v-model="addCompetitionConfirmbtn">
              <q-card class="flex-center">
                <q-card class="col">
                  <q-card-section class="col">
                    <div class="text-center text-bold text-h5">Pistolet</div>
                    <div v-for="(item,uuid) in competitions" :key="uuid" class="col">
                      <div v-if="item.discipline === 'Pistolet'" class="bg-grey-2">
                        <q-checkbox v-if="item.countingMethod === 'COMSTOCK'" :val="item.uuid"
                                    v-model="competitionAddToTournamentList">{{ item.name }} ({{ item.countingMethod }})
                        </q-checkbox>
                        <q-checkbox v-else :val="item.uuid" v-model="competitionAddToTournamentList">{{ item.name }}
                        </q-checkbox>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-card class="col">
                  <q-card-section class="col">
                    <div class="text-center text-bold text-h5">Karabin</div>
                    <div v-for="(item,uuid) in competitions" :key="uuid" class="col">
                      <div v-if="item.discipline === 'Karabin'" class="bg-grey-4">
                        <q-checkbox v-if="item.countingMethod === 'COMSTOCK'" :val="item.uuid"
                                    v-model="competitionAddToTournamentList">{{ item.name }} ({{ item.countingMethod }})
                        </q-checkbox>
                        <q-checkbox v-else :val="item.uuid" v-model="competitionAddToTournamentList">{{ item.name }}
                        </q-checkbox>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-card class="col">
                  <q-card-section class="col">
                    <div class="text-center text-bold text-h5">Strzelba</div>
                    <div v-for="(item,uuid) in competitions" :key="uuid" class="col">
                      <div v-if="item.discipline === 'Strzelba'" class="bg-grey-5">
                        <q-checkbox v-if="item.countingMethod === 'COMSTOCK'" :val="item.uuid"
                                    v-model="competitionAddToTournamentList">{{ item.name }} ({{ item.countingMethod }})
                        </q-checkbox>
                        <q-checkbox v-else :val="item.uuid" v-model="competitionAddToTournamentList">{{ item.name }}
                        </q-checkbox>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-card class="col">
                  <q-card-section class="col">
                    <div class="text-center text-bold text-h5">Pozostałe</div>
                    <div v-for="(item,uuid) in competitions" :key="uuid" class="col">
                      <div v-if="item.discipline == null" class="bg-grey-5">
                        <q-checkbox v-if="item.countingMethod === 'COMSTOCK'" :val="item.uuid"
                                    v-model="competitionAddToTournamentList">{{ item.name }} ({{ item.countingMethod }})
                        </q-checkbox>
                        <q-checkbox v-else :val="item.uuid" v-model="competitionAddToTournamentList">{{ item.name }}
                        </q-checkbox>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-card-actions align="right">
                  <q-item>
                    <q-btn
                      label="Dodaj konkurencję"
                      color="primary"
                      @click="(addCompetitionConfirm = true)"
                    />
                  </q-item>
                  <q-btn flat label="zamknij" color="primary" v-close-popup @click="competitionAddToTournamentList=[]"/>
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <div class="col-3">
            <q-item>
              <q-btn class="full-width" color="primary" label="Aktualizuj"
                     @click="tournamentUUID = tournaments.uuid; (tournamentUpdateConfirm = true) "/>
            </q-item>
            <q-item>
              <q-btn class="full-width" color="primary" label="Statystyki"
                     @click="tournamentUUID = tournaments.uuid; getStatistics(); statistics=true"/>
            </q-item>
            <q-item
              v-if="(tournaments.mainArbiter!=null || tournaments.otherMainArbiter!=null)&&(tournaments.commissionRTSArbiter!=null || tournaments.otherCommissionRTSArbiter!=null)">
              <q-btn class="full-width" color="secondary" label="Zamknij zawody"
                     @click="tournamentUUID = tournaments.uuid; (tournamentCloseConfirm = true) "/>
            </q-item>
            <q-item v-else>
              <q-btn :ripple="false" class="full-width text-black" color="grey-9" label="Zamknij zawody">
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Nie można zamknąć zawodów: brak
                  ustawionych sędziów
                </q-tooltip>
              </q-btn>
            </q-item>
          </div>
          <div class="full-width row bg-dark">
            <div class="col">
              <div class="row">
                <div class="col">
                  <q-field standout="bg-accent text-positive" stack-label>
                    <div class="text-bold self-center full-width no-outline text-positive">Sędzia główny</div>
                  </q-field>
                  <q-field v-if="tournaments.mainArbiter!=null" class="col" standout="bg-accent text-positive">
                    <div class="self-center col full-width no-outline text-positive">
                      {{ tournaments.mainArbiter.firstName }} {{ tournaments.mainArbiter.secondName }}
                      {{ tournaments.mainArbiter.memberPermissions.arbiterClass }}
                    </div>
                  </q-field>
                  <q-field v-if="tournaments.otherMainArbiter!=null" class="col" standout="bg-accent text-positive">
                    <div class="self-center col full-width no-outline text-positive">
                      {{ tournaments.otherMainArbiter.firstName }} {{ tournaments.otherMainArbiter.secondName }}
                      {{ tournaments.otherMainArbiter.permissionsEntity.arbiterClass }}
                    </div>
                  </q-field>
                </div>
                <div class="col">
                  <q-field standout="bg-accent text-positive" stack-label>
                    <div class="text-bold self-center full-width no-outline text-positive">Sędziowie
                      stanowiskowi
                    </div>
                  </q-field>
                  <div v-if="tournaments.arbitersList.length>0">
                    <q-field v-for="(arbiters,uuid) in tournaments.arbitersList" :key="uuid"
                             standout="bg-accent text-positive">
                      <div class="self-center full-width no-outline text-positive">{{ arbiters.firstName }}
                        {{ arbiters.secondName }} {{ arbiters.memberPermissions.arbiterClass }}
                      </div>
                    </q-field>
                  </div>
                  <div v-if="tournaments.otherArbitersList.length>0">
                    <q-field v-for="(otherArbitersList,id) in tournaments.otherArbitersList" :key="id"
                             standout="bg-accent text-positive">
                      <div class="text-bold self-center full-width no-outline text-positive">
                        {{ otherArbitersList.firstName }} {{ otherArbitersList.secondName }}
                        {{ otherArbitersList.permissionsEntity.arbiterClass }}
                      </div>
                    </q-field>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <q-field standout="bg-accent text-positive" stack-label>
                    <div class="text-bold self-center full-width no-outline text-positive">Sędzia komisji
                      RTS
                    </div>
                  </q-field>
                  <q-field v-if="tournaments.commissionRTSArbiter!=null" class="col" standout="bg-accent text-positive">
                    <div class="self-center col full-width no-outline text-positive">
                      {{ tournaments.commissionRTSArbiter.firstName }} {{ tournaments.commissionRTSArbiter.secondName }}
                      {{ tournaments.commissionRTSArbiter.memberPermissions.arbiterClass }}
                    </div>
                  </q-field>
                  <q-field v-if="tournaments.otherCommissionRTSArbiter!=null" class="col"
                           standout="bg-accent text-positive">
                    <div class="self-center col full-width no-outline text-positive">
                      {{ tournaments.otherCommissionRTSArbiter.firstName }}
                      {{ tournaments.otherCommissionRTSArbiter.secondName }}
                      {{ tournaments.otherCommissionRTSArbiter.permissionsEntity.arbiterClass }}
                    </div>
                  </q-field>
                </div>
                <div class="col">
                  <q-field standout="bg-accent text-positive" stack-label>
                    <div class="text-bold self-center full-width no-outline text-positive">Sędziowie biura
                      obliczeń
                    </div>
                  </q-field>
                  <div v-if="tournaments.arbitersRTSList.length>0">
                    <q-field v-for="(arbitersRTSList,uuid) in tournaments.arbitersRTSList" :key="uuid"
                             standout="bg-accent text-positive">
                      <div class="self-center full-width no-outline text-positive">
                        {{ arbitersRTSList.firstName }} {{ arbitersRTSList.secondName }}
                        {{ arbitersRTSList.memberPermissions.arbiterClass }}
                      </div>
                    </q-field>
                  </div>
                  <div v-if="tournaments.otherArbitersRTSList.length>0">
                    <q-field v-for="(otherArbitersRTSList,id) in tournaments.otherArbitersRTSList" :key="id"
                             standout="bg-accent text-positive">
                      <div class="text-bold self-center full-width no-outline text-positive">
                        {{ otherArbitersRTSList.firstName }} {{ otherArbitersRTSList.secondName }}
                        {{ otherArbitersRTSList.permissionsEntity.arbiterClass }}
                      </div>
                    </q-field>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-5">
              <q-field standout="bg-accent text-positive" stack-label>
                <div class="text-bold self-center full-width no-outline text-positive">Lista Konkurencji</div>
              </q-field>
              <div class="row" v-for="(item,uuid) in tournaments.competitionsList" :key="uuid">
                <q-field class="col" standout="bg-accent text-positive" stack-label>
                  <div v-if="item.countingMethod === 'COMSTOCK'"
                       class="self-center full-width no-outline text-positive">{{ item.name }}
                    ({{ item.countingMethod }})
                  </div>
                  <div v-else class="self-center full-width no-outline text-positive">
                    {{ item.name }}
                  </div>
                </q-field>
                <q-btn v-if="item.scoreList<1" color="grey-8" text-color="white" class="col-2"
                       @click="competitionListUUID = item.uuid;tournamentUUID = tournaments.uuid;deleteListFromTournament()">
                  usuń
                </q-btn>
              </div>
            </div>
          </div>
          <q-card class="full-width bg-dark">
            <div class="row">
              <div class="text-h6 col-6 text-center self-center no-outline">Dodawanie zawodników</div>
              <!--              <div class="col">Wydaj Broń na zawody-->
              <!--                <div class="full-width bg-grey-1">-->
              <!--                  <q-input type="password" v-model="barcode" color="black" bg-color="grey-4" dense filled-->
              <!--                           label="zeskanuj kod tutaj"-->
              <!--                           @keypress.enter="tournamentUUID = tournaments.uuid; addGunToTournament(barcode)"></q-input>-->
              <!--                  <div>-->
              <!--                    <q-expansion-item exact label="Lista Broni Na Zawodach" dense-->
              <!--                                      class="text-left text-h6 text-bold bg-grey-3"-->
              <!--                                      @click="tournamentUUID = tournaments.uuid; getGunInTournament()">-->
              <!--                      <q-virtual-scroll :items="gunsUsed" visible class="full-width q-pa-none text-caption"-->
              <!--                                        style="height: 200px;">-->
              <!--                        <template v-slot="{ item, index }">-->
              <!--                          <q-item :key="index" dense>-->
              <!--                            <div class="col">{{ item.gunName }}</div>-->
              <!--                            <div class="col-4">{{ item.gunSerialNumber }}</div>-->
              <!--                          </q-item>-->
              <!--                        </template>-->
              <!--                      </q-virtual-scroll>-->
              <!--                    </q-expansion-item>-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--              </div>-->
            </div>
            <div class="row">
              <q-card-section class="col-6">
                <div class="col">
                  <q-select label="Wybierz osobę z Klubu" input-class="text-positive" label-color="positive"
                            popup-content-class="bg-dark text-positive" color="positive"
                            :option-value="opt => opt!=='0 0'? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : String('0 0')"
                            :option-label="opt => opt!=='0 0'? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : String('0 0')"
                            emit-value
                            map-options
                            v-model="memberName" filled dense use-input hide-selected fill-input
                            :options="options" @input="otherName='0 0'" @filter="filterFn">
                    <template v-slot:option="option">
                      <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option.itemProps"
                              v-on="option.itemEvents">
                        <q-item-section v-if="option.opt.active" style="padding: 0.5em; margin: 0;"
                                        @click="otherName='0 0';memberName = option.opt.secondName+' '+option.opt.firstName+' '+ option.opt.legitimationNumber">
                          <div v-if="option.opt.adult">{{ option.opt.secondName }} {{ option.opt.firstName }}
                            {{ option.opt.legitimationNumber }} Ogólna
                          </div>
                          <div v-else>{{ option.opt.secondName }} {{ option.opt.firstName }}
                            {{ option.opt.legitimationNumber }} Młodzież
                          </div>
                        </q-item-section>
                        <q-item-section v-else style="padding: 0.5em; margin: 0;" class="bg-warning rounded text-black"
                                        @click="otherName='0 0';memberName = option.opt.secondName+' '+option.opt.firstName+' '+ option.opt.legitimationNumber">
                          <div v-if="option.opt.adult">{{ option.opt.secondName }} {{ option.opt.firstName }}
                            {{ option.opt.legitimationNumber }} Ogólna - BRAK SKŁADEK
                          </div>
                          <div v-else>{{ option.opt.secondName }} {{ option.opt.firstName }}
                            {{ option.opt.legitimationNumber }} Młodzież - BRAK SKŁADEK
                          </div>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Brak wyników - sprawdź w nieaktywnych
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <q-select input-class="text-positive" label-color="positive"
                            popup-content-class="bg-dark text-positive" color="positive"
                            v-model="otherName" options-dense filled dense use-input hide-selected fill-input
                            :options="options" @input="memberName='0 0'" @filter="filterOther"
                            label="Wybierz osobę spoza klubu">
                    <template v-slot:no-option>
                      <div>
                        <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników - możesz dodać nową osobę
                        </div>
                        <div class="q-pa-md bg-grey-5">
                          <q-btn class="full-width" color="primary" label="przejdź do formularza"
                                 @click="addNewOtherPerson = true"/>
                        </div>
                      </div>
                    </template>
                  </q-select>
                </div>
              </q-card-section>
              <q-card-section class="col-6">
                <div class="col">
                  <q-btn v-if="memberName===''||otherName===''" color="grey-5" class="full-width"
                         label="Aby wybrać konkurencje najpierw wybierz osobę">
                    <q-tooltip :delay="1500" content-class="text-subtitle2" anchor="top middle" self="bottom middle"
                               :offset="[12, 12]">wybierz kogoś
                    </q-tooltip>
                    <q-tooltip :delay="4000" content-class="text-subtitle2" anchor="top middle" self="bottom middle"
                               :offset="[12, 12]">NO WYBIERZ
                    </q-tooltip>
                    <q-tooltip :delay="8000" content-class="bg-red text-h2 text-bold" anchor="top middle"
                               self="bottom middle" :offset="[12, 12]">WYBIERAJ!!!
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-else
                         @click="tournamentUUID = tournaments.uuid; getCompetitionsInTournament();competitionsInfo=true"
                         class="full-width" color="primary" text-color="white" label="wybierz konkurencje"/>
                </div>
                <div>
                  <div>
                    <p></p>
                    <q-btn v-if="memberName===''||otherName===''" class="col full-width" label="Drukuj metryki"
                           color="grey-5"/>
                    <q-btn v-else class="col full-width" label="Drukuj metryki" color="secondary"
                           @click="tournamentUUID = tournaments.uuid;getMemberUUIDFromLegitimationNumber ();getScoreInfoByLegitimation();getMetricNumber ()"/>
                  </div>
                </div>
              </q-card-section>
            </div>
            <q-item v-for="(comp,uuid) in tournaments.competitionsList" :key="uuid">
              <SingleCompetition :uuid="comp.uuid" :size="comp.scoreListSize"></SingleCompetition>
            </q-item>
          </q-card>
        </div>
      </q-card>
      <q-card class="col-2 bg-dark text-positive">
        <div>
          <q-item>
            <q-item-label class="text-h5 text-bold">
              Zamknięte Zawody
            </q-item-label>
          </q-item>
          <div class="row full-width bg-secondary">
              <q-btn icon="arrow_left" :disable="pageNumber===0" @click="showloading();pageNumber=pageNumber-1;getClosedTournaments(pageNumber)"
                     class="col-1" color="primary"></q-btn>
            <div class="self-center text-bold text-center text-white col-10">STRONA {{ pageNumber + 1 }}</div>
              <q-btn icon="arrow_right"
                     @click="showloading();pageNumber=tournamentsClosed.length===15?pageNumber+1:pageNumber;getClosedTournaments(pageNumber)"
                     :disabled="tournamentsClosed.length!==15" class="col-1" color="primary"></q-btn>
          </div>
          <div>
            <div v-for="(item,index) in tournamentsClosed" :key="index">
              <q-item :key="index" dense >
                <q-btn class="col" text-color="white" color="primary" :label="((index+1)+(pageNumber*15)) + ' ' +item.date"
                       @click="tournamentClosedName=item.name;tournamentUUID = item.tournamentUUID;name= item.name;date = item.date;closedTournamentInfo=true;getStatistics ()"><q-tooltip content-class="bg-primary text-h6 text-bold" anchor="top middle"><div>{{item.name}}</div></q-tooltip></q-btn>
              </q-item>
            </div>
          </div>
        </div>
      </q-card>
    </div>
    <q-dialog v-model="createNewCompetiton">
      <q-card>
        <q-card-section class="row items-center">
          <q-item-section v-if="!notUsed">
            <q-item-label class="text-h4 text-bold">Kreator Konkurencji</q-item-label>
            <q-item-label>Utworzenie nowej konkurencji da możliwość wybrania jej podczas kolejnych zawodów
            </q-item-label>
            <div class="row bg-grey-1">
              <q-radio class="col" color="orange" @input="meters = false" v-model="choice" :val="'10'"
                       label="10m"></q-radio>
              <q-radio class="col" color="orange" @input="meters = false" v-model="choice" :val="'25'"
                       label="25m"></q-radio>
              <q-radio class="col" color="orange" @input="meters = false" v-model="choice" :val="'50'"
                       label="50m"></q-radio>
              <q-checkbox class="col" color="orange" @input="choice = ''" v-model="meters" :val="false"
                          label="inne"></q-checkbox>
              <q-item class="col">
                <q-input onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                         class="bg-grey-4 center justify" filled v-if="meters" style="width: 100px" v-model="choice"
                         stack-label label="ilość metrów"></q-input>
              </q-item>
            </div>
            <div class="row bg-grey-2">
              <q-checkbox v-model="dynamic" label="konkurencja dynamiczna"></q-checkbox>
              <div v-if="!dynamic">
                <q-radio class="col" color="orange"
                         @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                         v-model="choice1" :val="'Pistolet'" label="Pistolet"></q-radio>
                <q-radio class="col" color="orange"
                         @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                         v-model="choice1" :val="'Karabin'" label="Karabin"></q-radio>
                <q-radio class="col" color="orange"
                         @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = ''; meters = false; choice = '' "
                         v-model="choice1" :val="'Strzelba'" label="Strzelba"></q-radio>
              </div>
              <div v-else>
                <q-checkbox class="col" color="orange"
                            @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                            v-model="dynamicChoice" :val="'Pistolet'" label="Pistolet"></q-checkbox>
                <q-checkbox class="col" color="orange"
                            @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                            v-model="dynamicChoice" :val="'Karabin'" label="Karabin"></q-checkbox>
                <q-checkbox class="col" color="orange"
                            @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = ''; meters = false; choice = '' "
                            v-model="dynamicChoice" :val="'Strzelba'" label="Strzelba"></q-checkbox>
              </div>
            </div>
            <div class="col bg-grey-2">
              <q-checkbox class="row" v-if="choice1 === 'Strzelba' " :val="''" true-value=" maszynowa" false-value=""
                          color="orange" v-model="choice2" label="maszynowa"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" maszynowy" false-value="" color="orange"
                          v-model="choice2" label="maszynowy"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 === 'Strzelba' " :val="''" true-value=" dynamiczna" false-value=""
                          color="orange" v-model="choice3" label="dynamiczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" dynamiczny" false-value="" color="orange"
                          v-model="choice3" label="dynamiczny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="choice1 === 'Strzelba' " :val="''"
                          true-value=" sportowa" false-value="" color="orange" v-model="choice5"
                          label="sportowa"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value=" sportowy" false-value=""
                          color="orange" v-model="choice5" label="sportowy"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 === 'Strzelba' " :val="''" true-value=" dowolna" false-value=""
                          color="orange" v-model="choice6" label="dowolna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" dowolny" false-value="" color="orange"
                          v-model="choice6" label="dowolny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="choice1 === 'Strzelba' " :val="''"
                          true-value=" pneumatyczna" false-value="" color="orange" v-model="choice7"
                          label="pneumatyczna"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value=" pneumatyczny" false-value=""
                          color="orange" v-model="choice7" label="pneumatyczny"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 === 'Strzelba' " :val="''" true-value=" statyczna" false-value=""
                          color="orange" v-model="choice8" label="statyczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" statyczny" false-value="" color="orange"
                          v-model="choice8" label="statyczny"></q-checkbox>
            </div>
            <div class="row bg-grey-3">
              <q-radio class="col" v-if="!choice7 && choice1 !== 'Strzelba' && !choice5" color="orange"
                       v-model="choice9"
                       :val="' centralnego zapłonu'" label="centralnego zapłonu"></q-radio>
              <q-radio class="col" v-if="!choice7 && choice1 !== 'Strzelba'" color="orange" v-model="choice9"
                       :val="' bocznego zapłonu'" label="bocznego zapłonu"></q-radio>
            </div>
            <div class="row bg-grey-4">
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 5'"
                       label="5 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 7'"
                       label="7 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 10'"
                       label="10 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 15'"
                       label="15 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 20'"
                       label="20 strzałów"></q-radio>
              <q-checkbox class="row" color="orange" @input="choice10 = []" v-model="quantity" :val="false"
                          label="inne"></q-checkbox>
              <q-item class="row">
                <q-input @focus="choice10 = []" onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                         class="full-width bg-grey-4 center justify" filled v-if="quantity" style="width: 100px"
                         v-model="choice10" stack-label label="Ilość strzałów"></q-input>
              </q-item>
            </div>
            <div class="row bg-grey-5">
              <q-radio color="orange" v-model="choice11" :val="' OPEN'" label="OPEN"></q-radio>
              <q-radio color="orange" v-model="choice11" :val="' Młodzieżowa'" label="Młodzieżowa"></q-radio>
            </div>
            <div class="row bg-grey-6">
              <q-item class="items-center">Metoda Liczenia :</q-item>
              <q-radio class="col" color="primary" v-model="choice12" :val="'NORMAL'" label="Normalnie"></q-radio>
              <q-radio class="col" color="primary" v-model="choice12" :val="'COMSTOCK'" label="Comstock"></q-radio>
            </div>
            <div class="row bg-grey-7">
              <q-item dense class="row justify-around">Kaliber :</q-item>
              <q-radio dense class="row justify-around q-pl-md" v-model="choice13" v-for="(calibers,uuid) in calibers"
                       :key="uuid" :val="calibers.uuid" :label="calibers.name">
              </q-radio>
            </div>
            <div class="row bg-grey-8">
              <q-item class="items-center">Ilość Strzałów próbnych :</q-item>
              <q-input onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                       class="full-width col center justify" filled v-model="choice14" stack-label></q-input>
            </div>
            <div class="row">
              <q-item-label class="text-h6">Nazwa konkurencji :</q-item-label>
              <q-item-label v-if="choice" class="text-h6"> {{ choice + 'm' }} {{ ' ' + choice1 }} {{ ' ' + choice2 }}
                {{ ' ' + choice3 }} {{ ' ' + choice4 }} {{ ' ' + choice5 }} {{ ' ' + choice6 }} {{ ' ' + choice7 }}
                {{ ' ' + choice8 }} {{ ' ' + choice9 }} {{ ' ' + choice10 }} {{ ' ' + choice11 }}
              </q-item-label>
              <q-item-label v-else class="text-h6"> {{ choice }} {{ ' ' + choice1 }} {{ ' ' + choice2 }}
                {{ ' ' + choice3 }}
                {{ ' ' + choice4 }} {{ ' ' + choice5 }} {{ ' ' + choice6 }} {{ ' ' + choice7 }} {{ ' ' + choice8 }}
                {{ ' ' + choice9 }} {{ ' ' + choice10 }} {{ ' ' + choice11 }}
              </q-item-label>
            </div>
          </q-item-section>
          <q-item-section v-if="notUsed">
            <q-item>
              <q-item-label class="text-h6 text-bold text-justify">Można nadać własną nazwę zawodów bez używania
                kreatora
              </q-item-label>
            </q-item>
            <div class="row bg-grey-2">
              <q-checkbox v-model="dynamic" @input="choice12 = 'COMSTOCK'" label="konkurencja dynamiczna"></q-checkbox>
              <div v-if="!dynamic">
                <q-radio class="col" color="orange"
                         @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                         v-model="choice1" :val="'Pistolet'" label="Pistolet"></q-radio>
                <q-radio class="col" color="orange"
                         @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                         v-model="choice1" :val="'Karabin'" label="Karabin"></q-radio>
                <q-radio class="col" color="orange"
                         @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = ''; meters = false; choice = '' "
                         v-model="choice1" :val="'Strzelba'" label="Strzelba"></q-radio>
              </div>
              <div v-else>
                <q-checkbox class="col" color="orange"
                            @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                            v-model="dynamicChoice" :val="'Pistolet'" label="Pistolet"></q-checkbox>
                <q-checkbox class="col" color="orange"
                            @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                            v-model="dynamicChoice" :val="'Karabin'" label="Karabin"></q-checkbox>
                <q-checkbox class="col" color="orange"
                            @input="choice2 = ''; choice3 = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = ''; meters = false; choice = '' "
                            v-model="dynamicChoice" :val="'Strzelba'" label="Strzelba"></q-checkbox>
              </div>
              <q-input v-if="!dynamic" @focus="choice10 = []"
                       onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                       class="full-width col center justify" filled style="width: 100px" v-model="choice10" stack-label
                       label="Ilość strzałów pistolet"></q-input>
              <div v-if="dynamic" class="row">
                <q-input v-if="dynamicChoice.includes('Pistolet')"
                         onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                         class="full-width col center justify" filled v-model="dynamicChoice1" stack-label
                         label="Ilość strzałów pistolet"></q-input>
                <q-input v-if="dynamicChoice.includes('Karabin')"
                         onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                         class="full-width col center justify" filled v-model="dynamicChoice2" stack-label
                         label="Ilość strzałów karabin"></q-input>
                <q-input v-if="dynamicChoice.includes('Strzelba')"
                         onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                         class="full-width col center justify" filled v-model="dynamicChoice3" stack-label
                         label="Ilość strzałów strzelba"></q-input>
                {{ dynamicChoice1 }}
                {{ dynamicChoice2 }}
                {{ dynamicChoice3 }}
              </div>
            </div>
            <div class="row">
              <q-item class="items-center">Metoda Liczenia :</q-item>
              <q-radio v-if="!dynamic" class="col" color="black" v-model="choice12" :val="'NORMAL'"
                       label="Normalnie"></q-radio>
              <q-radio class="col" color="black" v-model="choice12" :val="'COMSTOCK'" label="Comstock"></q-radio>
            </div>
            <q-input class="full-width bg-grey-4 center justify" filled v-model="competitionName " stack-label
                     label="wprowadź własną nazwę"></q-input>
          </q-item-section>
        </q-card-section>
        <div class="row">
          <q-card-actions class="col" align="left">
            <q-checkbox @input="competitionName = null" class="row text-grey-4" keep-color color="grey-4"
                        v-model="notUsed" :val="false" label="nie używaj kreatora"></q-checkbox>
          </q-card-actions>
          <q-card-actions class="row" align="right">
            <q-btn flat label="zamknij" color="primary" v-close-popup/>
            <q-btn label="utwórz" color="primary" v-close-popup @click="createCompetition()"/>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="tournamentUpdateConfirm" persistent>
      <q-card>
        <q-card-section class="col items-center">
          <q-item>
            <q-input v-model="tournamentName" hint="nazwa" label="Nowa nazwa zawodów" filled/>
          </q-item>
          <q-item>
            <q-input filled v-model="tournamentDate" mask="####-##-##" :rules="['date']" label="Wybierz datę"
                     hint="użyj kalendarza">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="tournamentDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="red" label="Usuń" v-close-popup @click="deleteTournamentAlert = true"></q-btn>
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="aktualizuj" color="primary" v-close-popup @click="tournamentConfirm = true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--Dodawanie sędziów-->
    <!--                 -->
    <!--                 -->
    <!--                 -->
    <!--                 -->
    <q-dialog v-model="addArbitersConfirmbtn">
      <q-card style="min-width: 60vw">
        <q-card-section style="min-width: 500px" class="row items-center">
          <div class="row full-width">
            <div class="q-pa-md bg-grey-2 col-6">
              <q-item>
                <div class="text-center full-width">Sędzia Główny</div>
              </q-item>
              <div>
                <q-input @input="otherMainArbiterName ='0 0' " color="secondary" class="full-width" filled
                         type="password"
                         v-model="mainArbiter" use-input hide-selected fill-input input-debounce="0" :options="options"
                         style="width: 350px" label="Zeskanuj Kartę"
                         @keypress.enter="addMainArbiterToTournament(mainArbiter)">
                </q-input>
                <q-select @input="mainArbiter =''" color="secondary" filled v-model="otherMainArbiterName" use-input
                          hide-selected fill-input input-debounce="0" :options="options" @filter="filterOtherArbiters"
                          label="Dodaj sędziego spoza klubu">
                  <template v-slot:no-option>
                    <div>
                      <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników - możesz dodać nową osobę</div>
                      <div class="q-pa-md bg-grey-5">
                        <q-btn class="full-width" color="primary" label="przejdź do formularza"
                               @click="addNewOtherPerson = true"/>
                      </div>
                    </div>
                  </template>
                </q-select>
              </div>
              <q-item v-if="mainArbiter !== '' || otherMainArbiterName !== '0 0'">
                <q-btn label="Dodaj" color="primary" @click="addMainArbiterToTournament(mainArbiter)"/>
              </q-item>
              <q-item v-else></q-item>
            </div>
            <div class="q-pa-md bg-grey-2 col-6">
              <q-item standout stack-label>
                <div class="text-center full-width">Sędzia RTS</div>
              </q-item>
              <div>
                <q-input @input="otherRTSArbiterName ='0 0'" class="full-width" color="secondary" filled type="password"
                         v-model="countArbiter" use-input hide-selected fill-input input-debounce="0"
                         style="width: 350px" label="Zeskanuj Kartę"
                         @keypress.enter="addRTSArbiterToTournament(countArbiter)">
                </q-input>
                <q-select @input="countArbiter =''" class="full-width" color="secondary" filled
                          v-model="otherRTSArbiterName" use-input hide-selected fill-input input-debounce="0"
                          :options="options" @filter="filterOtherArbiters" label="Dodaj sędziego spoza klubu">
                  <template v-slot:no-option>
                    <div>
                      <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników - możesz dodać nową osobę</div>
                      <div class="q-pa-md bg-grey-5">
                        <q-btn class="full-width" color="primary" label="przejdź do formularza"
                               @click="addNewOtherPerson = true"/>
                      </div>
                    </div>
                  </template>
                </q-select>
              </div>
              <q-item v-if="countArbiter !=='' || otherRTSArbiterName !== '0 0'">
                <q-btn label="Dodaj" color="primary" @click="addRTSArbiterToTournament(countArbiter)"/>
              </q-item>
              <q-item v-else>
              </q-item>
            </div>
          </div>
          <div class="row full-width">
            <div class="q-pa-md bg-grey-3 col-6">
              <q-item standout stack-label>
                <div class="text-center full-width">Sędziowie stanowiskowi</div>
              </q-item>
              <div>
                <q-input @input="otherArbitersList = '0 0'" color="secondary" class="full-width" filled type="password"
                         v-model="otherArbiter" use-input hide-selected fill-input input-debounce="0"
                         style="width: 350px" label="Zeskanuj Kartę"
                         @keypress.enter="addOtherArbiterToTournament(otherArbiter)">
                </q-input>
                <q-select @input="otherArbiter = ''" class="full-width" color="secondary" filled
                          v-model="otherArbitersList" use-input hide-selected fill-input input-debounce="0"
                          :options="options" @filter="filterOtherArbiters" label="Dodaj sędziego spoza klubu">
                  <template v-slot:no-option>
                    <div>
                      <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników - możesz dodać nową osobę</div>
                      <div class="q-pa-md bg-grey-5">
                        <q-btn class="full-width" color="primary" label="przejdź do formularza"
                               @click="addNewOtherPerson = true"/>
                      </div>
                    </div>
                  </template>
                </q-select>
              </div>
              <div class="col">
                <div>
                  <q-item v-if="otherArbiter!=='' || otherArbitersList!=='0 0'">
                    <q-btn class="full-width" label="Dodaj sędziego stanowiskowego" color="primary"
                           @click="addOtherArbiterToTournament(otherArbiter)"/>
                  </q-item>
                  <q-item v-else>
                  </q-item>
                </div>
                <div>
                  <q-item v-if="otherArbiter!=='' || otherArbitersList!=='0 0'">
                    <q-btn class="full-width" label="usuń sędziego stanowiskowego" color="primary"
                           @click="removeArbiter(otherArbiter)"/>
                  </q-item>
                  <q-item v-else>
                  </q-item>
                </div>
              </div>
            </div>
            <div class="q-pa-md bg-grey-3 col-6">
              <q-item standout stack-label>
                <div class="text-center full-width">Sędziowie biura obliczeń
                </div>
              </q-item>
              <div>
                <q-input @input="otherRTSArbitersList = '0 0'" color="secondary" class="full-width" filled
                         v-model="otherRTSArbiter"
                         use-input hide-selected fill-input input-debounce="0" type="password"
                         style="width: 350px" label="Zeskanuj kartę"
                         @keypress.enter="addOtherRTSArbiterToTournament(otherRTSArbiter)">
                </q-input>
                <q-select @input="otherRTSArbiter = ''" class="full-width" color="secondary" filled
                          v-model="otherRTSArbitersList" use-input hide-selected fill-input input-debounce="0"
                          :options="options" @filter="filterOtherArbiters" label="Dodaj sędziego spoza klubu">
                  <template v-slot:no-option>
                    <div>
                      <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników - możesz dodać nową osobę</div>
                      <div class="q-pa-md bg-grey-5">
                        <q-btn class="full-width" color="primary" label="przejdź do formularza"
                               @click="addNewOtherPerson = true"/>
                      </div>
                    </div>
                  </template>
                </q-select>
              </div>
              <div class="col">
                <div>
                  <q-item v-if="otherRTSArbiter!=='' || otherRTSArbitersList!=='0 0' ">
                    <q-btn class="full-width" label="Dodaj sędziego biura obliczeń" color="primary"
                           @click="addOtherRTSArbiterToTournament(otherRTSArbiter)"/>
                  </q-item>
                  <q-item v-else>
                  </q-item>
                </div>
                <div>
                  <q-item v-if="otherRTSArbiter!=='' || otherRTSArbitersList!=='0 0'">
                    <q-btn class="full-width" label="usuń sędziego biura obliczeń" color="primary"
                           @click="removeRTSArbiter(otherRTSArbiter)"/>
                  </q-item>
                  <q-item v-else>
                  </q-item>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="secondary" v-close-popup
                 @click="mainArbiter='';countArbiter='';otherArbiter='';otherRTSArbiter='';otherMainArbiterName='0 0';otherRTSArbiterName='0 0';otherArbitersList='0 0';otherRTSArbitersList='0 0'"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Koniec -->
    <q-dialog v-model="removeFromList">
      <q-card>
        <q-card-section>
          <div class="text-h6">Usunąć zawodnika z listy startujących w konkurencji?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn label="usuń" color="warning" v-close-popup @click="removeMemberFromCompetition();finder = null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="tournamentConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy zaktualizować zawody?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn
            flat
            label="Zmień"
            color="primary"
            v-close-popup
            @click="updateTournament()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="tournamentUpdated" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6 text-bold">Zaktualizowano</span>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="tournamentCloseConfirm" persistent>
      <q-card class="bg-warning">
        <q-card-section class="row items-center">
          <q-avatar icon="warning"/>
          <span class="q-ml-sm">Czy zamknąć zawody?</span>
          <span class="q-ml-sm">Nie będzie można już nic zmienić.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" v-close-popup/>
          <q-btn
            flat
            label="Zamknij"
            v-close-popup
            @click="closeTournament()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addCompetitionConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy dodać konkurencję do zawodów?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn
            flat
            label="Dodaj"
            color="primary"
            v-close-popup
            @click="addCompetitionToTournament()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addNewTournament" persistent>
      <q-card style="width: 400px">
        <q-card-section class="col items-center">
          <q-item>
            <q-item-label class="text-h6 text-center full-width">Nazwa zawodów</q-item-label>
          </q-item>
          <q-item
          >
            <q-input class="full-width" v-model="tournamentName" filled label="Nazwa"
            />
          </q-item>
          <q-item>
            <q-item-label class="text-h6 text-center full-width">Data zawodów</q-item-label>
          </q-item>
          <q-item>
            <q-input class="full-width" filled v-model="tournamentDate" mask="####-##-##" label="Wybierz datę"
                     hint="użyj kalendarza">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="tournamentDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <q-checkbox v-model="wzss" class="full-width">
            <div class="text-bold text-center text-h6">zawody wpisane do WZSS</div>
          </q-checkbox>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="Dodaj" color="primary" v-close-popup
                 @click=" createNewTournament(tournamentName,tournamentDate)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="tournamentAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano nowe zawody</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="tournamentCloseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zawody są już zamknięte</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="tournamentOpenAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zawody są otwarte</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="newCompetitionAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano nową konkurencję</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="failure" :position="'top'" @keypress.enter="failure=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addNewOtherPerson">
      <q-card class="full-width">
        <q-card-section>
          <div class="text-h6">Dodawanie nowej osoby spoza klubu</div>
          <q-item>
            <q-input class="full-width"
                     onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 32"
                     filled v-model="otherFirstName" label="Imię *"/>
          </q-item>
          <q-item>
            <q-input class="full-width"
                     onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode === 45"
                     filled v-model="otherSecondName" label="Nazwisko *"/>
          </q-item>
          <q-item>
            <q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubName" :val="'BRAK'"
                        label="Brak Klubu"></q-checkbox>
            <q-item v-if="clubName!=='BRAK'" class="full-width">
              <q-select v-if="clubName!=='BRAK'" class="full-width" @new-value="createValue" hide-selected use-chips
                        filled v-model="clubName" use-input fill-input input-debounce="0" :options="filterOptions"
                        @filter="filterFna" label="Wybierz Klub">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Brak wyników
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-item>
          </q-item>
          <q-item>
            <q-input class="full-width" mask="### ### ###" filled v-model="otherPhoneNumber" label="Numer telefonu"/>
          </q-item>
          <q-item>
            <q-input class="full-width" filled v-model="otherEmail" label="e-mail"/>
          </q-item>
          <q-item class="full-width">
            <q-field class="full-width" standout stack-label>
              <div class="self-center full-width col no-outline">Uprawnienia Sędziowskie - można zostawić
                puste
              </div>
            </q-field>
          </q-item>
          <div class="row">
            <q-item>
              <q-radio v-model="ordinal" :val="1" label="Klasa 3" color="secondary"/>
            </q-item>
            <q-item>
              <q-radio v-model="ordinal" :val="2" label="Klasa 2" color="secondary"/>
            </q-item>
            <q-item>
              <q-radio v-model="ordinal" :val="3" label="Klasa 1" color="secondary"/>
            </q-item>
            <q-item>
              <q-radio v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary"/>
            </q-item>
            <q-item>
              <q-radio v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary"/>
            </q-item>
          </div>
          <q-input outlined filled class="full-width" v-model="permissionsOtherArbiterNumber" label="Numer uprawnień"/>
          <q-input class="col-5" outlined filled v-model="permissionsOtherArbiterPermissionValidThru" mask="####/12/31"
                   label="Ważne do:">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="permissionsOtherArbiterPermissionValidThru">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div>* pole wymagane</div>
          <q-item>
            <q-btn label="Zapisz do bazy" v-close-popup
                   @click="addOtherPerson ();otherFirstName=null;otherSecondName=null;clubName=''" color="primary"/>
          </q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Zamknij" color="primary" v-close-popup
                 @click="otherFirstName=null;otherSecondName=null;clubName=''"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="gunAdded" persistent @keypress.enter="gunAdded=false">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6 text-bold">Broń została przydzielona</span>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteTournamentAlert" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm text-bold">UWAGA - Zmiana będzie nieodwracalna</span></h3>
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="deleteTournament();deleteTournamentAlert=false" autofocus type="password"
                     v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="otwórz" color="black" v-close-popup @click="deleteTournament()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="statistics">
      <q-card class="bg-dark text-positive">
        <q-card-section class="col items-center">
          <span class="q-ml-sm text-h6 text-bold">STATYSTYKI ZAWODÓW</span>
          <div class="text-bold">
            <div>ilość konkurencji : {{ statistic[0] }}</div>
            <div>ilość zawodników : {{ statistic[1] }}</div>
            <div>ilość osobostartów : {{ statistic[2] }}</div>
            <div>ile razy była pobrana amunicja : {{ statistic[3] }}</div>
            <div>ile razy była pobrana broń : {{ statistic[4] }}</div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="competitionsInfo">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div v-for="(item,id) in options2" :key="id">
            <div>
              <q-checkbox v-model="listOfCompetitions" :val="item" :label="item"></q-checkbox>
            </div>
          </div>
          <div class="row q-pa-md">
            <q-btn class="col full-width" color="red" label="Usuń z listy"
                   @click="removeMemberFromCompetition();finder = null"></q-btn>
            <q-btn class="col full-width" color="secondary" label="Dodaj do listy"
                   @click="addMemberToCompetition(memberName); (finder = null)"></q-btn>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="metricsInfo">
      <q-card class="bg-dark text-positive">
        <q-card-section class="col">
          <div class="q-ml-sm text-h6 text-center text-bold">POBIERZ METRYKI STARTOWE ZAWODNIKA</div>
          <div class="q-ml-sm text-h6 text-center text-bold">{{ name }}</div>
          <ol class="col">
            <li class="row" v-for="info in infoScore" :key="info">
              <q-checkbox color="secondary" class="col" v-model="compList" :val="info" :label="info"/>
            </li>
          </ol>
          <div>
            <q-checkbox v-model="a5rotate" :value="a5rotate" label="rozmiar A5"></q-checkbox>
          </div>
          <div class="row q-pa-xs">
            <q-btn @click="getMemberMetrics(compList);compList=[]" class="col q-pa-xs" color="secondary">
              wydrukuj wybrane metryki zawodnika
            </q-btn>
            <q-item></q-item>
            <q-btn @click="getMemberMetrics(infoScore);compList=[]" class="col q-pa-xs" color="primary">wydrukuj
              wszystkie metryki zawodnika
            </q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="compName='';compList=[]" label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="closedTournamentInfo">
      <q-card class="bg-dark text-positive">
        <q-card-section class="col">
          <div class="q-ml-sm text-h6 text-center text-bold">INFORMACJE O ZAMKNIĘTYCH ZAWODACH</div>
          <div class="q-ml-sm text-h6 text-center text-bold">{{ tournamentClosedName }} {{ date }}</div>
          <div class="q-ml-sm text-h6 text-center text-bold">STATYSTYKI ZAWODÓW</div>
          <div class="text-bold">
            <div>ilość konkurencji : {{ statistic[0] }}</div>
            <div>ilość zawodników : {{ statistic[1] }}</div>
            <div>ilość osobostartów : {{ statistic[2] }}</div>
            <div>ile razy była pobrana amunicja : {{ statistic[3] }}</div>
            <div>ile razy była pobrana broń : {{ statistic[4] }}</div>
          </div>
          <div>
            <q-item>
              <q-btn-dropdown align="center" class="full-width" label="pobierz komunikat" color="primary">
                <q-list dark>
                  <q-item v-close-popup class="q-pa-none">
                    <q-item-section>
                      <q-btn @click="getAnnouncementFromCompetition()" class="full-width bg-red-6"
                             label="pobierz plik .pdf" color="secondary"></q-btn>
                    </q-item-section>
                  </q-item>
                  <q-item v-close-popup class="q-pa-none">
                    <q-item-section>
                      <q-btn @click="getAnnouncementFromCompetitionXLSX()" class="full-width bg-green-6"
                             label="pobierz plik .xslx" color="secondary"></q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item>
          </div>
          <div>
            <q-item>
              <q-btn @click="getJudgeFromTournament ()" class="full-width" color="primary">pobierz listę sędziów</q-btn>
            </q-item>
          </div>
          <div v-if="tournaments==null">
            <q-item>
              <q-btn @click="openList=true" class="full-width" color="primary">otwórz zawody</q-btn>
            </q-item>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="listDownload">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pobrano Dokument</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="openList" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter="openTournament();openList=false" autofocus type="password" v-model="code" filled
                     color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn label="otwórz" color="black" v-close-popup @click="openTournament()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">
</style>
<script>
import axios from 'axios'
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

export default {
  components: {
    SingleCompetition: lazyLoadComponent({
      componentFactory: () => import('components/tournament/SingleCompetition.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      val: '',
      a5rotate: false,
      competitionsInfo: false,
      listOfCompetitions: [],
      pageNumber: 0,
      uuid: null,
      code: null,
      barcode: null,
      openList: false,
      listDownload: false,
      success: false,
      tournamentUUID: null,
      tournamentConfirm: false,
      tournamentAlert: false,
      tournamentCloseConfirm: false,
      tournamentCloseAlert: false,
      tournamentOpenAlert: false,
      tournamentUpdateConfirm: false,
      tournamentUpdated: false,
      addMemberConfirm: false,
      addNewTournament: false,
      addCompetitionConfirmbtn: false,
      addArbitersConfirmbtn: false,
      addCompetitionConfirm: false,
      newCompetitionAlert: false,
      createNewCompetiton: false,
      competitionName: null,
      failure: false,
      clubs: [],
      dynamicChoice: [],
      dynamicChoice1: '',
      dynamicChoice2: '',
      dynamicChoice3: '',
      choice: '',
      choice1: '',
      choice2: '',
      choice3: '',
      choice4: '',
      choice5: '',
      choice6: '',
      choice7: '',
      choice8: '',
      choice9: '',
      choice10: [],
      choice11: '',
      choice12: '',
      choice13: '',
      choice14: '',
      options2: [],
      competition: null,
      tournaments: { competitionsList: Object() },
      competitions: [],
      filters: [],
      filtersPermission: [],
      filtersOther: [],
      tournamentsClosed: [],
      calibers: [],
      statistic: [],
      infoScore: [],
      gunsUsed: [],
      dynamic: false,
      caliberUUID: null,
      tournamentName: '',
      tournamentDate: '',
      scoreUUID: null,
      options: [],
      options3: [],
      finder: '',
      mainArbiter: '',
      countArbiter: '',
      otherArbiter: '',
      otherRTSArbiter: '',
      competitionAddToTournamentList: [],
      removeFromList: false,
      memberName: null,
      otherName: null,
      addNewOtherPerson: false,
      otherFirstName: null,
      otherSecondName: null,
      otherPhoneNumber: '',
      otherEmail: '',
      clubName: '',
      meters: false,
      quantity: false,
      notUsed: false,
      gunAdded: false,
      statistics: false,
      metricsInfo: false,
      startNumber: '',
      compName: null,
      date: '',
      name: '',
      compList: [],
      otherID: '',
      memberUUID: null,
      filtersOtherArbiters: [],
      otherMainArbiterName: '0 0',
      otherRTSArbiterName: '0 0',
      otherArbitersList: '0 0',
      otherRTSArbitersList: '0 0',
      ordinal: '',
      permissionsOtherArbiterNumber: '',
      permissionsOtherArbiterPermissionValidThru: '',
      deleteTournamentAlert: false,
      closedTournamentInfo: false,
      tournamentClosedName: null,
      competitionListUUID: null,
      wzss: true,
      message: null,
      filterOptions: [],
      local: App.host
    }
  },
  created () {
    this.getListTournaments()
    this.getCompetitions()
    this.getClosedTournaments(this.pageNumber)
    this.getOther()
    this.getListCalibers()
    this.getOtherArbiters()
    this.getAllClubsToTournament()
  },
  methods: {
    getListTournaments () {
      this.getMembersNames()
      this.getMembersNamesWithPermissions()
      fetch('http://' + this.local + '/tournament/list', {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.tournaments = response
              this.getCompetitions()
            }
          )
        } else {
          console.log('nic nie ma do pokazania')
          this.tournaments = null
        }
      }
      )
    },
    getCompetitions () {
      fetch('http://' + this.local + '/competition/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.competitions = response
        })
    },
    getListCalibers () {
      fetch('http://' + this.local + '/armory/calibers', {
        method: 'GET'
      }).then(response => response.json())
        .then(calibers => {
          this.calibers = calibers
        })
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    getMembersNames () {
      fetch('http://' + this.local + '/member/getAllNames', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters = response
        })
    },
    getMembersNamesWithPermissions () {
      fetch('http://' + this.local + '/member/getArbiters', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filtersPermission = response
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
    getCompetitionsInTournament () {
      fetch('http://' + this.local + '/tournament/competitions?tournamentUUID=' + this.tournamentUUID, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.options2 = response
        })
    },
    getStatistics () {
      fetch('http://' + this.local + '/tournament/stat?tournamentUUID=' + this.tournamentUUID, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.statistic = response
        })
    },
    getMemberUUIDFromLegitimationNumber () {
      const memberNameWord = this.memberName.split(' ')
      const legNumber = memberNameWord.length
      const memberlegNumber = memberNameWord[legNumber - 1]
      fetch('http://' + this.local + '/member/ID/' + memberlegNumber, {
        method: 'GET'
      }).then(response => response.text())
        .then(response => {
          if (response.length > 0) {
            this.memberUUID = response
          } else {
            this.message = response
            this.failure = true
            this.autoClose()
          }
        })
    },
    getScoreInfoByLegitimation () {
      if (this.memberName === '' || this.otherName === '') {
        this.message = 'coś poszło nie tak'
        this.failure = true
        this.autoClose()
      } else {
        const memberNameWord = this.memberName.split(' ')
        const legNumber = memberNameWord.length
        const memberlegNumber = memberNameWord[legNumber - 1]
        const otherNameWord = this.otherName.split(' ')
        const idNumber = otherNameWord.length
        const otherNameID = otherNameWord[idNumber - 1]
        fetch('http://' + this.local + '/competitionMembersList/getMemberStartsByLegitimation?tournamentUUID=' + this.tournamentUUID + '&legNumber=' + memberlegNumber + '&otherID=' + otherNameID, {
          method: 'GET'
        }).then(response => response.json())
          .then(response => {
            if (response.length > 0) {
              this.infoScore = response
              this.otherID = otherNameID
              this.metricsInfo = true
            } else {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          })
      }
    },
    getMetricNumber () {
      if (this.memberName === '' || this.otherName === '') {
        this.message = 'coś jest nie tak - sprawdź poprawność danych'
        this.failure = true
        this.autoClose()
      } else {
        const memberNameWord = this.memberName.split(' ')
        const legNumber = memberNameWord.length
        const memberlegNumber = memberNameWord[legNumber - 1]
        const otherNameWord = this.otherName.split(' ')
        const idNumber = otherNameWord.length
        const otherNameID = otherNameWord[idNumber - 1]
        fetch('http://' + this.local + '/competitionMembersList/getMetricNumber?tournamentUUID=' + this.tournamentUUID + '&legNumber=' + memberlegNumber + '&otherID=' + otherNameID, {
          method: 'GET'
        }).then(response => response.json())
          .then(response => {
            if (response.length > 0) {
              this.startNumber = response
              this.otherID = otherNameID
            } else {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          })
      }
    },
    getOtherArbiters () {
      fetch('http://' + this.local + '/other/arbiters', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filtersOtherArbiters = response
        })
    },
    getGunInTournament () {
      fetch('http://' + this.local + '/tournament/getGunInTournament?tournamentUUID=' + this.tournamentUUID, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunsUsed = response
        })
    },
    addOtherPerson () {
      const person = {
        firstName: this.otherFirstName,
        secondName: this.otherSecondName,
        phoneNumber: this.otherPhoneNumber,
        email: this.otherEmail
      }
      fetch('http://' + this.local + '/other?club=' + this.clubName + '&arbiterClass=' + this.ordinal + '&arbiterNumber=' + this.permissionsOtherArbiterNumber + '&arbiterPermissionValidThru=' + this.permissionsOtherArbiterPermissionValidThru.replace(/\//gi, '-'), {
        method: 'POST',
        body: JSON.stringify(person),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 201) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.getOther()
              this.getOtherArbiters()
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
    createNewTournament (name, date) {
      const data = {
        name: name,
        date: date.replace(/\//gi, '-'),
        open: true,
        wzss: this.wzss
      }
      fetch('http://' + this.local + '/tournament/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 201) {
          this.tournamentAlert = true
          this.showloading()
          this.getListTournaments()
          this.autoClose()
        }
      })
    },
    createCompetition () {
      let name = null
      let numberOfManyShotsTable = null
      if (this.choice10 !== null && this.choice10.lenght > 1) {
        this.choice10 = this.choice10 + ' strzałów'
      } else {
        numberOfManyShotsTable = [this.dynamicChoice1, this.dynamicChoice2, this.dynamicChoice3]
        this.choice10 = this.choice10 + ' strzałów'
      }
      if (this.choice !== null && this.choice !== '') {
        this.choice = this.choice + 'm '
      } else {
        this.choice = ''
      }
      // if (this.choice === ' ') {
      //   this.choice = ''
      // }
      if (this.competitionName !== null) {
        name = this.competitionName
      } else {
        name =
          this.choice + this.choice1 + this.choice2 + this.choice3 + this.choice4 + this.choice5 + this.choice6 + this.choice7 + this.choice8 + this.choice9 + this.choice10 + this.choice11
      }
      if (this.choice11.replace(/ /, '') === '') {
        this.choice11 = 'OPEN'
      }
      const choice10 = this.choice10.replace(/ strzałów/g, '')
      const data = {
        name: name,
        discipline: this.choice1.replace(/ /g, ''),
        disciplines: this.dynamicChoice,
        numberOfShots: choice10,
        type: this.choice11.replace(/ /, ''),
        countingMethod: this.choice12,
        numberOfManyShots: numberOfManyShotsTable,
        caliberUUID: this.choice13,
        practiceShots: this.choice14
      }
      fetch('http://' + this.local + '/competition', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 201) {
          this.choice = ''
          this.choice1 = ''
          this.choice2 = ''
          this.choice3 = ''
          this.choice4 = ''
          this.choice5 = ''
          this.choice6 = ''
          this.choice7 = ''
          this.choice8 = ''
          this.choice9 = ''
          this.choice10 = []
          this.choice11 = ''
          this.choice12 = ''
          this.newCompetitionAlert = true
          this.competitionName = ''
          this.showloading()
          this.getListTournaments()
          this.getCompetitions()
          this.autoClose()
        }
        if (response.status === 409) {
          this.failure = true
          this.autoClose()
        }
      })
    },
    updateTournament () {
      const data = {
        name: this.tournamentName,
        date: this.tournamentDate.replace(/\//gi, '-')
      }
      fetch('http://' + this.local + '/tournament/' + this.tournamentUUID, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.tournamentName = ''
          this.tournamentDate = ''
          this.tournamentUpdated = true
          this.showloading()
          this.getListTournaments()
          this.autoClose()
        }
      })
    },
    addMemberToCompetition () {
      const memberNameWord = this.memberName.split(' ')
      const legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      const otherNameWord = this.otherName.split(' ')
      const idNumber = otherNameWord.length
      const otherNameID = otherNameWord[idNumber - 1]
      const list = []
      for (let i = 0; i < this.listOfCompetitions.length; i++) {
        list.push(this.listOfCompetitions[i].replaceAll(',', '.'))
      }
      fetch('http://' + this.local + '/competitionMembersList/addMember?tournamentUUID=' + this.tournamentUUID + '&competitionNameList=' + list + '&legitimationNumber=' + memberNameUUID + '&otherPerson=' + otherNameID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.showloading()
              this.getListTournaments()
              this.message = response
              this.success = true
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
    removeMemberFromCompetition () {
      const memberNameWord = this.memberName.split(' ')
      const legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      const otherNameWord = this.otherName.split(' ')
      const idNumber = otherNameWord.length
      const otherNameID = otherNameWord[idNumber - 1]
      const list = []
      for (let i = 0; i < this.listOfCompetitions.length; i++) {
        list.push(this.listOfCompetitions[i].replaceAll(',', '.'))
      }
      fetch('http://' + this.local + '/competitionMembersList/removeMember?tournamentUUID=' + this.tournamentUUID + '&competitionNameList=' + list + '&legitimationNumber=' + memberNameUUID + '&otherPerson=' + otherNameID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.showloading()
              this.getListTournaments()
              this.getCompetitions()
              this.message = response
              this.success = true
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
    addCompetitionToTournament () {
      fetch('http://' + this.local + '/tournament/addCompetition/' + this.tournamentUUID + '?competitionsUUID=' + this.competitionAddToTournamentList, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.showloading()
              this.getListTournaments()
              this.getCompetitions()
              this.message = response
              this.success = true
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
    closeTournament () {
      fetch('http://' + this.local + '/tournament/' + this.tournamentUUID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.tournamentCloseAlert = true
          this.tournaments = null
          this.code = null
          this.showloading()
          this.getListTournaments()
          this.getClosedTournaments()
          this.autoClose()
        }
      })
    },
    openTournament () {
      fetch('http://' + this.local + '/tournament/open/' + this.tournamentUUID + '?pinCode=' + this.code, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.code = null
              this.message = response
              this.success = true
              this.closedTournamentInfo = false
              this.showloading()
              this.getListTournaments()
              this.getClosedTournaments()
              this.autoClose()
            }
          )
        } else {
          response.text().then(
            response => {
              this.code = null
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    deleteTournament () {
      fetch('http://' + this.local + '/tournament/delete/' + this.tournamentUUID + '?pinCode=' + this.code, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.showloading()
              this.getListTournaments()
              this.getClosedTournaments()
              this.autoClose()
            })
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
    getClosedTournaments (pageNumber) {
      if (pageNumber < 0) {
        this.pageNumber = 0
      }
      fetch('http://' + this.local + '/tournament/closedList?page=' + pageNumber + '&size=15', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.tournamentsClosed = response
        })
    },
    removeArbiter (barcode) {
      const otherPersonArbiterWord = this.otherArbitersList.split(' ')
      const personLegNumber = otherPersonArbiterWord.length
      const otherPersonArbiterID = otherPersonArbiterWord[personLegNumber - 1]
      fetch('http://' + this.local + '/tournament/removeArbiter/' + this.tournamentUUID + '?barcode=' + barcode + '&id=' + otherPersonArbiterID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.otherArbiter = ''
              this.otherArbitersList = '0 0'
              this.showloading()
              this.getListTournaments()
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
    removeRTSArbiter (barcode) {
      const otherPersonArbiterWord = this.otherRTSArbitersList.split(' ')
      const personLegNumber = otherPersonArbiterWord.length
      const otherPersonArbiterID = otherPersonArbiterWord[personLegNumber - 1]
      fetch('http://' + this.local + '/tournament/removeRTSArbiter/' + this.tournamentUUID + '?barcode=' + barcode + '&id=' + otherPersonArbiterID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.otherRTSArbiter = ''
              this.otherRTSArbitersList = '0 0'
              this.showloading()
              this.getListTournaments()
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
    addMainArbiterToTournament (barcode) {
      const mainOtherArbiterWord = this.otherMainArbiterName.split(' ')
      const otherLegNumber = mainOtherArbiterWord.length
      const mainOtherArbiterID = mainOtherArbiterWord[otherLegNumber - 1]
      fetch('http://' + this.local + '/tournament/addMainArbiter/' + this.tournamentUUID + '?barcode=' + barcode + '&id=' + mainOtherArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.mainArbiter = ''
              this.otherMainArbiterName = '0 0'
              this.showloading()
              this.getListTournaments()
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
    addRTSArbiterToTournament (barcode) {
      const countOtherArbiterWord = this.otherRTSArbiterName.split(' ')
      const otherLegNumber = countOtherArbiterWord.length
      const countOtherArbiterID = countOtherArbiterWord[otherLegNumber - 1]
      fetch('http://' + this.local + '/tournament/addRTSArbiter/' + this.tournamentUUID + '?barcode=' + barcode + '&id=' + countOtherArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.countArbiter = ''
              this.otherRTSArbiterName = '0 0'
              this.showloading()
              this.getListTournaments()
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
    addOtherArbiterToTournament (barcode) {
      const otherPersonArbiterWord = this.otherArbitersList.split(' ')
      const personLegNumber = otherPersonArbiterWord.length
      const otherPersonArbiterID = otherPersonArbiterWord[personLegNumber - 1]
      fetch('http://' + this.local + '/tournament/addOthersArbiters/' + this.tournamentUUID + '?barcode=' + barcode + '&id=' + otherPersonArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.otherArbiter = ''
              this.otherArbitersList = '0 0'
              this.showloading()
              this.getListTournaments()
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
    addOtherRTSArbiterToTournament (barcode) {
      const otherPersonArbiterWord = this.otherRTSArbitersList.split(' ')
      const personLegNumber = otherPersonArbiterWord.length
      const otherPersonArbiterID = otherPersonArbiterWord[personLegNumber - 1]
      fetch('http://' + this.local + '/tournament/addOthersRTSArbiters/' + this.tournamentUUID + '?barcode=' + barcode + '&id=' + otherPersonArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.success = true
              this.message = response
              this.otherRTSArbiter = ''
              this.otherRTSArbitersList = '0 0'
              this.showloading()
              this.getListTournaments()
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
    deleteListFromTournament () {
      fetch('http://' + this.local + '/competitionMembersList/delete?tournamentUUID=' + this.tournamentUUID + '&competitionUUID=' + this.competitionListUUID, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.tournamentUUID = null
          this.competitionListUUID = null
          this.showloading()
          this.getListTournaments()
          this.autoClose()
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
          this.options = this.filtersOther.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filtersOther.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterOtherArbiters (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filtersOtherArbiters.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filtersOtherArbiters.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    createValue (val, done) {
      if (val.length > 0) {
        const model = (this.clubName || []).slice()

        val
          .split(/[,;|]+/)
          .map(v => v.trim())
          .filter(v => v.length > 0)
          .forEach(v => {
            if (this.clubs.includes(v) === false) {
              this.clubs.push(v)
            }
            if (model.includes(v) === false) {
              model.push(v)
            }
          })

        done(null)
        this.clubName = model
      }
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
    getAnnouncementFromCompetition () {
      this.showloading()
      axios({
        url: 'http://' + this.local + '/files/downloadAnnouncementFromCompetition/' + this.tournamentUUID,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'rezultatyDZIESIĄTKA' + this.date.replaceAll('-', '') + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAnnouncementFromCompetitionXLSX () {
      this.showloading()
      axios({
        url: 'http://' + this.local + '/files/downloadAnnouncementFromCompetitionXLSX/' + this.tournamentUUID,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'rezultatyDZIESIĄTKA' + this.date.replaceAll('-', '') + '.xlsx')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getJudgeFromTournament () {
      axios({
        url: 'http://' + this.local + '/files/downloadJudge/' + this.tournamentUUID,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_sędziów_na_zawodach_' + this.name + '_' + this.date + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getMemberMetrics (info) {
      axios({
        url: 'http://' + this.local + '/files/downloadMetric/' + this.tournamentUUID + '?otherID=' + this.otherID + '&memberUUID=' + this.memberUUID + '&competitions=' + info + '&startNumber=' + this.startNumber + '&a5rotate=' + this.a5rotate,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'metryki_' + this.name + '_' + this.date + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllClubsToTournament () {
      fetch('http://' + this.local + '/club/tournament', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubs = response
        })
    },
    addGunToTournament (barcode) {
      fetch('http://' + this.local + '/tournament/addGunToTournament?barcode=' + barcode + '&tournamentUUID=' + this.tournamentUUID, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.showloading()
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
    autoClose () {
      setTimeout(() => {
        this.tournamentAlert = false
        this.tournamentCloseAlert = false
        this.newCompetitionAlert = false
        this.failure = false
        this.gunAdded = false
        this.tournamentUpdated = false
        this.tournamentOpenAlert = false
        this.listDownload = false
        this.listOfCompetitions = []
        this.competitionAddToTournamentList = []
        this.deleteTournamentAlert = false
        this.message = null
        this.success = false
        this.barcode = null
      }, 2000)
    }
  },
  name: 'tournament'
}
</script>
