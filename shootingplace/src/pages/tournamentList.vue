<template>
  <q-page padding class="q-pa-md">
      <q-card class="row">
        <q-card-section>
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
                @click="createNewCompetiton = true"
              ></q-btn>
        </q-card-section>
      </q-card>
      <div class="row">
      <q-card class="col-10">
      <div v-for="(tournaments,uuid) in tournaments" :key="uuid" class="row bg-grey-2 text-h6">
        <div class="col-6">
          <q-item-section>
            <q-item>
              {{ tournaments.name }} {{ tournaments.date }}
            </q-item>
          </q-item-section>
        </div>
        <div class="col-3">
          <q-item><q-btn color="white" class="text-black full-width" label="pobierz komunikat" @click="tournamentUUID = tournaments.uuid,date= tournaments.date,name = tournaments.name,getAnnouncementFromCompetition()"></q-btn></q-item>
          <q-item><q-btn color="white" class="text-black full-width" v-if="tournaments.open" label="dodaj sędziów" @click="tournamentUUID = tournaments.uuid,addArbitersConfirmbtn = true"></q-btn></q-item>
          <q-item v-if="tournaments.open"><q-btn color="white" class="text-black full-width" label="dodaj konkurencje" @click="tournamentUUID = tournaments.uuid,addCompetitionConfirmbtn = true"></q-btn></q-item>
    <q-dialog v-model="addCompetitionConfirmbtn" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-item-section v-if="tournaments.open">
            <q-item-label>Dodaj Konkurencje</q-item-label>
            <q-item
              v-for="(competitions,uuid) in competitions" :key="uuid"
              ><q-radio
                :label="competitions.name"
                :val="competitions.uuid"
                v-model="competitionRadio"
            /></q-item>
            <q-item
              ><q-btn
                label="Dodaj konkurencję"
                color="primary"
                @click="(addCompetitionConfirm = true)"
            /></q-item>
          </q-item-section>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup @click="competitionRadio=''"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
        </div>
        <div class="col-3">
              <q-item ><q-btn class="full-width" color="primary" label="Aktualizuj" @click="tournamentUUID = tournaments.uuid, (tournamentUpdateConfirm = true) "/></q-item>
              <q-item v-if="tournaments.mainArbiter!=null && tournaments.otherMainArbiter!=null" ><q-btn class="full-width" color="secondary" label="Zamknij zawody" @click="tournamentUUID = tournaments.uuid, (tournamentCloseConfirm = true) "/></q-item>
              <q-item v-else><q-btn :ripple="false" class="full-width text-black" color="grey-9" label="Zamknij zawody"><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Nie można zamknąć zawodów: brak ustawionych sędziów</q-tooltip></q-btn></q-item>
        </div>
            <div class="full-width row bg-grey-2">
              <div class="col">
                <q-field standout stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">Funkcje kierownicze</div>
                  </template>
                </q-field>
                <q-field v-if="tournaments.mainArbiter!=null" class="col" standout stack-label label="Sędzia Główny Zawodów">
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">{{tournaments.mainArbiter.firstName}} {{tournaments.mainArbiter.secondName}} {{tournaments.mainArbiter.memberPermissions.arbiterClass}}</div>
                  </template>
                </q-field>
                <q-field v-if="tournaments.otherMainArbiter!=null" class="col" standout stack-label label="Sędzia Główny Zawodów">
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">{{tournaments.otherMainArbiter.firstName}} {{tournaments.otherMainArbiter.secondName}} {{tournaments.otherMainArbiter.permissionsEntity.arbiterClass}}</div>
                  </template>
                </q-field>
                <q-field v-if="tournaments.commissionRTSArbiter!=null" class="col" standout stack-label label="Przewodniczący Komisji RTS">
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">{{tournaments.commissionRTSArbiter.firstName}} {{tournaments.commissionRTSArbiter.secondName}} {{tournaments.commissionRTSArbiter.memberPermissions.arbiterClass}}</div>
                  </template>
                </q-field>
                <q-field v-if="tournaments.otherCommissionRTSArbiter!=null" class="col" standout stack-label label="Przewodniczący Komisji RTS">
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">{{tournaments.otherCommissionRTSArbiter.firstName}} {{tournaments.otherCommissionRTSArbiter.secondName}} {{tournaments.otherCommissionRTSArbiter.permissionsEntity.arbiterClass}}</div>
                  </template>
                </q-field>
              </div>
              <div class="col" >
                <q-field standout stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">Sędziowie stanowiskowi</div>
                  </template>
                </q-field>
                <div v-if="tournaments.arbitersList.length>0">
                <q-field v-for="(arbiters,uuid) in tournaments.arbitersList" :key="uuid" standout stack-label label="Sędzia Stanowiskowy">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{arbiters.firstName}} {{arbiters.secondName}} {{arbiters.memberPermissions.arbiterClass}}</div>
                  </template>
                </q-field>
                </div>
                <div v-if="tournaments.otherArbitersList.length>0">
                <q-field v-for="(otherArbitersList,id) in tournaments.otherArbitersList" :key="id" standout stack-label label="Sędzia Stanowiskowy spoza klubu">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{otherArbitersList.firstName}} {{otherArbitersList.secondName}} {{otherArbitersList.permissionsEntity.arbiterClass}}</div>
                  </template>
                </q-field>
                </div>
              </div>
            </div>
        <q-card class="full-width">
              <q-expansion-item expand-separator group="tournament-competition" v-for="(competitionsList,uuid) in tournaments.competitionsList" :key="uuid" :label="competitionsList.name">
                <div class="row">
                <q-card-section class="col-3">
                  <q-field class="col" standout stack-label>
                    <template v-slot:control>
                      <div class="text-h6 self-center col full-width no-outline" tabindex="0">Dodawnie zawodników</div>
                    </template>
                  </q-field>
                <q-select v-if="tournaments.open" filled v-model="memberName" use-input hide-selected fill-input input-debounce="0" :options="options" @input="otherName='0 0'" @filter="filterFn" label="Dodaj osobę z klubu">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Brak wyników
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select v-if="tournaments.open" filled v-model="otherName" use-input hide-selected fill-input input-debounce="0" :options="options" @input="memberName='0 0'" @filter="filterOther" label="Dodaj osobę spoza klubu">
                  <template v-slot:no-option>
                    <q-btn class="full-width" color="primary" label="dodaj nową osobę" @click="addNewOtherPerson = true"/>
                  </template>
                </q-select>
                <div class="row">
                  <q-btn class="col" v-if="tournaments.open" label="Usuń z listy" @click="(competitionUUID = competitionsList.uuid),removeFromList=true"></q-btn>
                  <q-btn class="col" v-if="tournaments.open" label="Dodaj do listy" @click="(competitionUUID = competitionsList.uuid),(addMemberConfirm = true)"></q-btn>
                </div>
                </q-card-section>
                <q-card-section class="col-9">
                  <div class="full-width" default-opened> Lista startujących
                      <div class="row">
                        <q-field class="col-1" standout stack-label>
                          <template v-slot:control>
                            <div class="siz self-center full-width col no-outline" tabindex="0">amunicja</div>
                          </template>
                        </q-field>
                        <q-btn @click="state = true,(competitionUUID = competitionsList.uuid),sortArray()" label="sortuj wg nazwisk" class="col-7" />
                        <q-btn @click="state = false,(competitionUUID = competitionsList.uuid),sortArray()" label="sortuj wg wyników" class="col-4" />
                      </div>
                  <div class="text-body2" v-for="(scoreList,uuid) in competitionsList.scoreList" :key="uuid">
                    <div class="row">
                      <q-btn v-if="scoreList.ammunition == false && scoreList.member!=null" class="col-1" style="text-8" icon="book" @click="scoreUUID = scoreList.uuid,memberLeg = scoreList.member.legitimationNumber,otherID = 0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">wydaj Amunicję {{scoreList.member.secondName}}</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == true  && scoreList.member!=null" class="col-1" style="text-8" icon="book" color="green" @click="scoreUUID = scoreList.uuid,memberLeg = scoreList.member.legitimationNumber, otherID = 0,getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">wydaj Amunicję {{scoreList.member.secondName}}</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == false && scoreList.otherPersonEntity!=null" class="col-1" style="text-8" icon="book" @click="scoreUUID = scoreList.uuid,otherID = scoreList.otherPersonEntity.id,memberLeg =0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">wydaj Amunicję {{scoreList.otherPersonEntity.secondName}}</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == true && scoreList.otherPersonEntity!=null" class="col-1" style="text-8" icon="book" color="green" @click="scoreUUID = scoreList.uuid,otherID = scoreList.otherPersonEntity.id,memberLeg=0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">wydaj Amunicję {{scoreList.otherPersonEntity.secondName}}</q-tooltip></q-btn>
                    <q-field class="col-3" standout stack-label>
                      <template v-slot:control>
                        <div v-if="scoreList.otherPersonEntity == null" class="self-center full-width col no-outline" tabindex="0">{{scoreList.member.secondName}} {{scoreList.member.firstName}} {{scoreList.member.club.name}}</div>
                        <div v-if="scoreList.member == null" class="self-center full-width col no-outline" tabindex="0">{{scoreList.otherPersonEntity.secondName}} {{scoreList.otherPersonEntity.firstName}} {{scoreList.otherPersonEntity.club.name}}</div>
                      </template>
                    </q-field>
                    <q-input class="col-1" @keypress.enter="scoreUUID = scoreList.uuid, onEnter(scoreUUID)" stack-label onkeypress="return (event.charCode > 47 && event.charCode < 58)" filled v-model="outerTen" label="10"/>
                    <q-input class="col-1" @keypress.enter="scoreUUID = scoreList.uuid, onEnter(scoreUUID)" stack-label onkeypress="return (event.charCode > 47 && event.charCode < 58)" filled v-model="innerTen" label="10W"/>
                    <q-input class="box col-2" @keypress.enter="scoreUUID = scoreList.uuid, onEnter(scoreUUID)" color="black" stack-label onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode 44 || event.charCode 46" filled v-model="scoreLabel" label="wprowadź wynik"/>
                    <q-btn class="col-1" icon="send" @click="setScore(scoreList.uuid,scoreLabel,innerTen,outerTen)">
                      <q-tooltip v-if="scoreList.member != null" anchor="top middle" self="bottom middle" :offset="[12, 12]">Wprowadź wynik {{scoreList.member.secondName}}</q-tooltip>
                      <q-tooltip v-if="scoreList.otherPersonEntity != null" anchor="top middle" self="bottom middle" :offset="[12, 12]">Wprowadź wynik {{scoreList.otherPersonEntity.secondName}}</q-tooltip>
                      </q-btn>
                    <q-field class="box col-1" standout label="Wynik" stack-label>
                      <template v-slot:control>
                        <div class="self-center full-width col no-outline" tabindex="0">{{scoreList.score}}</div>
                      </template>
                    </q-field>
                    <q-field class="box col-1" standout label="10" stack-label>
                      <template v-slot:control>
                        <div class="self-center full-width col no-outline" tabindex="0">{{scoreList.outerTen}}</div>
                      </template>
                    </q-field>
                    <q-field class="box col-1" standout label="10W" stack-label>
                      <template v-slot:control>
                        <div class="self-center full-width col no-outline" tabindex="0">{{scoreList.innerTen}}</div>
                      </template>
                    </q-field>
                    </div>
                  </div>
                  </div>
                </q-card-section>
                </div>
              </q-expansion-item>
        </q-card>
      </div>
      </q-card>
    <q-card class="col-2">
      <div>
        <q-item>
          <q-item-label class="text-h5 text-bold">
            Zamknięte Zawody
          </q-item-label>
        </q-item>
        <div v-for="(tournamentsClosed,id) in tournamentsClosed" :key="id">
          <q-item>
            <q-btn :label="tournamentsClosed.date" @click="tournamentUUID = tournamentsClosed.tournamentUUID,getAnnouncementFromCompetition()"></q-btn>
          </q-item>
        </div>
      </div>
    </q-card>
    </div>
    <q-dialog v-model="createNewCompetiton" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-item-section v-if="!notUsed">
            <q-item-label class="text-h4 text-bold">Kreator Konkurencji</q-item-label>
            <q-label>Utworzenie nowej konkurencji da możliwość wybrania jej podczas kolejnych zawodów </q-label>
            <div class="row bg-grey-1">
              <q-radio class="col" color="orange" @input="meters = false" v-model="choice" :val="'10'" label="10m"></q-radio>
              <q-radio class="col" color="orange" @input="meters = false" v-model="choice" :val="'25'" label="25m"></q-radio>
              <q-radio class="col" color="orange" @input="meters = false" v-model="choice" :val="'50'" label="50m"></q-radio>
              <q-checkbox class="col" color="orange" @input="choice = ''" v-model="meters" :val="false" label="inne"></q-checkbox>
              <q-item class="col"><q-input onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="bg-grey-4 center justify" filled v-if="meters" style="width: 100px" v-model="choice" stack-label label="ilość metrów"></q-input></q-item>
            </div>
            <div class="row bg-grey-2">
              <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="' Pistolet'" label="Pistolet"></q-radio>
              <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="' Karabin'" label="Karabin"></q-radio>
              <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="' Strzelba'" label="Strzelba"></q-radio>
            </div>
            <div class="col bg-grey-2">
              <q-checkbox class="row" v-if="choice1 == ' Strzelba' " :val="''" true-value=" maszynowa" false-value="" color="orange" v-model="choice2" label="maszynowa"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" maszynowy" false-value="" color="orange" v-model="choice2" label="maszynowy"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 == ' Strzelba' " :val="''" true-value=" dynamiczna"  false-value="" color="orange" v-model="choice3" label="dynamiczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" dynamiczny" false-value="" color="orange" v-model="choice3" label="dynamiczny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="choice1 == ' Strzelba' " :val="''" true-value=" sportowa" false-value="" color="orange" v-model="choice5" label="sportowa"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value=" sportowy" false-value="" color="orange" v-model="choice5" label="sportowy"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 == ' Strzelba' " :val="''" true-value=" dowolna" false-value="" color="orange" v-model="choice6" label="dowolna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" dowolny" false-value="" color="orange" v-model="choice6" label="dowolny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="choice1 == ' Strzelba' " :val="''" true-value=" pneumatyczna" false-value="" color="orange" v-model="choice7" label="pneumatyczna"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value=" pneumatyczny" false-value="" color="orange" v-model="choice7" label="pneumatyczny"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 == ' Strzelba' " :val="''" true-value=" statyczna" false-value="" color="orange" v-model="choice8" label="statyczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" statyczny" false-value="" color="orange" v-model="choice8" label="statyczny"></q-checkbox>
            </div>
            <div class="row bg-grey-3">
              <q-radio class="col" v-if="!choice7 && choice1 != ' Strzelba' && !choice5" color="orange" v-model="choice9" :val="' centralnego zapłonu'" label="centralnego zapłonu"></q-radio>
              <q-radio class="col" v-if="!choice7 && choice1 != ' Strzelba'" color="orange" v-model="choice9" :val="' bocznego zapłonu'" label="bocznego zapłonu"></q-radio>
            </div>
            <div class="row bg-grey-4">
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 5'" label="5 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 7'" label="7 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 10'" label="10 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 15'" label="15 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 20'" label="20 strzałów"></q-radio>
              <q-checkbox class="row" color="orange" @input="choice10 = ''" v-model="quantity" :val="false" label="inne"></q-checkbox>
              <q-item class="row"><q-input @focus="choice10 = ' '" onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width bg-grey-4 center justify" filled v-if="quantity" style="width: 100px" v-model="choice10" stack-label label="ilość strzałów" ></q-input></q-item>
            </div>
            <div class="row bg-grey-5">
              <q-radio color="orange" v-model="choice11" :val="' OPEN'" label="OPEN"></q-radio>
              <q-radio color="orange" v-model="choice11" :val="' Młodzieżowa'" label="Młodzieżowa"></q-radio>
            </div>
            <div class="row"><q-label class="text-h6">Nazwa konkurencji : </q-label>
              <q-label class="text-h6"> {{choice + 'm'}} {{' ' + choice1}} {{' ' + choice2}} {{' ' + choice3}} {{' ' + choice4}} {{' ' + choice5}} {{' ' + choice6}} {{' ' + choice7}} {{' ' + choice8}} {{' ' + choice9}} {{' ' + choice10  + ' strzałów'}} {{' ' + choice11}}</q-label>
            </div>
          </q-item-section>
          <q-item-section v-if="notUsed">
              <q-item><q-label class="text-h6 text-bold text-justify">Można nadać własną nazwę zawodów bez używania kreatora</q-label></q-item>
            <div class="row bg-grey-2">
              <q-radio class="col" color="black" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="' Pistolet'" label="Pistolet"></q-radio>
              <q-radio class="col" color="black" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="' Karabin'" label="Karabin"></q-radio>
              <q-radio class="col" color="black" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="' Strzelba'" label="Strzelba"></q-radio>
            </div>
             <q-input class="full-width bg-grey-4 center justify" filled v-model="competitionName " stack-label label="wprowadź własną nazwę" ></q-input>
          </q-item-section>
        </q-card-section>
        <div class="row">
        <q-card-actions class="col" align="left">
          <q-checkbox @input="competitionName = null" class="row text-grey-4" keep-color color="grey-4" v-model="notUsed" :val="false" label="nieużywaj kreatora"></q-checkbox>
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
            <q-item><q-input v-model="tournamentName" hint="nazwa" label="Nowa nazwa zawodów" filled /></q-item>
            <q-item><q-input filled v-model="tournamentDate" mask="####/##/##" :rules="['date']" label="Wybierz datę" hint="użyj kalendarza">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date v-model="tournamentDate">
                                    <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Zamknij" color="primary" flat />
                                    </div>
                                  </q-date>
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input></q-item>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="anuluj" color="primary" v-close-popup />
            <q-btn flat label="aktualizuj" color="primary" v-close-popup @click="tournamentConfirm = true"/>
          </q-card-actions>
        </q-card>
    </q-dialog>
    <q-dialog v-model="addArbitersConfirmbtn" persistent>
      <q-card>
        <q-card-section style="min-width: 500px" class="row items-center">
          <q-item-section>
            <div class="q-pa-md bg-grey-2">
    <q-field standout stack-label>
      <template v-slot:control>
        <div class="self-center full-width col no-outline" tabindex="0">Sędzia Główny</div>
      </template>
    </q-field>
    <div>
      <q-select @input="otherMainArbiterName ='0 0' " color="orange" class="full-width" filled v-model="mainArbiter" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterMp" style="width: 350px" label="Wybierz z Klubu">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Brak wyników
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select @input="mainArbiter ='0 0' " color="orange" filled v-model="otherMainArbiterName" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterOtherArbiters" label="Dodaj sędziego spoza klubu">
        <template v-slot:no-option>
          <q-btn class="full-width" color="orange" label="dodaj nową osobę" @click="addNewOtherPerson = true"/>
        </template>
      </q-select>
    </div>
    <q-item v-if="mainArbiter!=null && mainArbiter != '0 0' "><q-btn label="Dodaj" color="orange" @click="addMainArbiterToTournament()"/></q-item>
    <q-item v-if="otherMainArbiterName!=null && otherMainArbiterName != '0 0' "><q-btn label="Dodaj" color="orange" @click="addMainArbiterToTournament()"/></q-item>
    </div>
    <div class="q-pa-md bg-grey-3">
    <q-field standout stack-label>
      <template v-slot:control>
        <div class="self-center full-width col no-outline" tabindex="0">Sędzia RTS</div>
      </template>
    </q-field>
    <div>
      <q-select @input="otherRTSArbiterName ='0 0'" class="full-width" color="orange" filled v-model="countArbiter" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterMp" style="width: 350px" label="Wybierz z Klubu">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Brak wyników
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select @input="countArbiter ='0 0'" class="full-width" color="orange" filled v-model="otherRTSArbiterName" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterOtherArbiters" label="Dodaj sędziego spoza klubu">
        <template v-slot:no-option>
          <q-btn class="full-width" color="orange" label="dodaj nową osobę" @click="addNewOtherPerson = true"/>
        </template>
      </q-select>
    </div>
          <q-item v-if="countArbiter!=null && countArbiter !='0 0' "><q-btn label="Dodaj" color="primary" @click="addRTSArbiterToTournament()"/></q-item>
          <q-item v-if="otherRTSArbiterName!=null && otherRTSArbiterName != '0 0' "><q-btn label="Dodaj" color="primary" @click="addRTSArbiterToTournament()"/></q-item>
          </div>
          <div class="q-pa-md bg-grey-4">
    <q-field standout stack-label>
      <template v-slot:control>
        <div class="self-center full-width col no-outline" tabindex="0">Sędziowie stanowiskowi</div>
      </template>
    </q-field>
    <div>
      <q-select @input="otherArbitersList = '0 0'" class="full-width" filled v-model="otherArbiter" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterMp" style="width: 350px" label="Wybierz z Klubu">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Brak wyników
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select @input="otherArbiter = '0 0'" class="full-width" color="orange" filled v-model="otherArbitersList" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterOtherArbiters" label="Dodaj sędziego spoza klubu">
        <template v-slot:no-option>
          <q-btn class="full-width" color="orange" label="dodaj nową osobę" @click="addNewOtherPerson = true"/>
        </template>
      </q-select>
    </div>
            <div class="col">
            <div>
            <q-item v-if="otherArbiter!=null && otherArbiter!='0 0'"><q-btn class="full-width" label="Dodaj sędziego stanowiskowego" color="primary" @click="addOtherArbiterToTournament()"/></q-item>
            <q-item v-if="otherArbitersList!=null && otherArbitersList!='0 0' "><q-btn class="full-width" label="Dodaj sędziego stanowiskowego spoza klubu" color="primary" @click="addOtherArbiterToTournament()"/></q-item>
            </div>
            <div>
            <q-item v-if="otherArbiter!=null && otherArbiter!='0 0' "><q-btn class="full-width" label="usuń sędziego stanowiskowego" color="primary" @click="removeArbiter()"/></q-item>
            <q-item v-if="otherArbitersList!=null && otherArbitersList!='0 0'"><q-btn class="full-width" label="usuń sędziego stanowiskowego spoza klubu" color="primary" @click="removeArbiter()"/></q-item>
            </div>
            </div>
            </div>
          </q-item-section>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="orange" v-close-popup @click="mainArbiter=null,countArbiter=null,otherArbiter=null,otherMainArbiterName=null,otherRTSArbiterName=null,otherArbitersList=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="removeFromList">
      <q-card>
        <q-card-section>
          <div class="text-h6">Usunąć zawodnika z listy startujących w konkurencji?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn label="usuń" color="warning" v-close-popup @click="removeMemberFromCompetition(competitionUUID, finder),finder = null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="tournamentConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary" />
          <span class="q-ml-sm">Czy zaktualizować zawody?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
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
    <q-dialog v-model="tournamentUpdated" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Zaktualizowano</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="tournamentCloseConfirm" persistent>
      <q-card class="bg-warning">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" />
          <span class="q-ml-sm">Czy zamknąć zawody?</span>
          <span class="q-ml-sm">Nie będzie można już nic zmienić.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" v-close-popup />
          <q-btn
            flat
            label="Zamknij"
            v-close-popup
            @click="closeTournament()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addMemberConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary" />
          <span class="q-ml-sm">Czy dodać Zawodnika?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn
            flat
            label="Dodaj"
            color="primary"
            v-close-popup
            @click="
              addMemberToCompetition(competitionUUID, finder),
                (finder = null)
            "
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addCompetitionConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary" />
          <span class="q-ml-sm">Czy dodać konkurencję do zawodów?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn
            flat
            label="Dodaj"
            color="primary"
            v-close-popup
            @click="addCompetitonToTournament()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addNewTournament" persistent>
      <q-card style="width: 400px">
        <q-card-section class="col items-center">
          <q-item><q-item-label>Nazwa zawodów</q-item-label></q-item>
          <q-item
            ><q-input class="full-width" v-model="tournamentName" filled label="Nazwa"
          /></q-item>
          <q-item><q-item-label>Data zawodów</q-item-label></q-item>
          <q-item
            ><q-input class="full-width" filled v-model="tournamentDate" mask="####/##/##" label="Wybierz datę" hint="użyj kalendarza">
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
              </template> </q-input
          ></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click=" createNewTournament(tournamentName,tournamentDate)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="tournamentAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano nowe zawody</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="tournamentCloseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zawody są już zamknięte</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addMemberAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Zawodnika</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addOtherAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zapisano do bazy</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="removeMemberAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Usunięto Zawodnika z listy</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
            @click="showloading(), getListTournaments(), getcompetitions()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="removeArbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Usunięto sędziego z listy</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addArbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Sędziego</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addCompetitionAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano konkurencję do zawodów</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="newCompetitionAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano nową konkurencję</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="failure">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można dodać konkurencji bo taka konkurencja już istnieje.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="memberFailure">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można dodać Zawodnika bo już znajduje się w konkurencji.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dataFail">
      <q-card>
        <q-card-section>
          <div class="text-h6">Sprawdź poprawność danych</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="arbiterFailure">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można dodać Sędziego.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addNewOtherPerson">
      <q-card class="full-width">
        <q-card-section>
          <div class="text-h6">Dodawanie nowej osoby spoza klubu</div>
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="otherFirstName" label="Imię *"/></q-item>
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="otherSecondName" label="Nazwisko *"/></q-item>
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="clubName" label="Nazwa Klubu *"/></q-item>
          <q-item><q-input class="full-width" mask="### ### ###" filled v-model="otherPhoneNumber" label="Numer telefonu"/></q-item>
          <q-item><q-input class="full-width" filled v-model="otherEmail" label="e-mail"/></q-item>
          <q-item class="full-width">
            <q-field class="full-width" standout stack-label>
              <template v-slot:control>
                <div class="self-center full-width col no-outline" tabindex="0">Uprawniena Sędziowskie - można zostawić puste</div>
              </template>
            </q-field>
          </q-item>
          <div class="row">
          <q-item><q-radio v-model="ordinal" :val="1" label="Klasa 3" color="secondary" /></q-item>
          <q-item><q-radio v-model="ordinal" :val="2" label="Klasa 2" color="secondary" /></q-item>
          <q-item><q-radio v-model="ordinal" :val="3" label="Klasa 1" color="secondary" /></q-item>
          <q-item><q-radio v-model="ordinal" :val="4" label="Klasa Państwowa" color="secondary" /></q-item>
          <q-item><q-radio v-model="ordinal" :val="5" label="Klasa Międzynarodowa" color="secondary" /></q-item>
          </div>
          <q-input outlined filled class="full-width" v-model="permissionsOtherArbiterNumber" label="Numer uprawnień" />
          <q-input class="col-5" outlined filled v-model="permissionsOtherArbiterPermissionValidThru" mask="####/12/31" label="Ważne do:">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="permissionsOtherArbiterPermissionValidThru">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
         <div>* pole wymagane</div>
        <q-item><q-btn label="Zapisz do bazy" v-close-popup @click="addOtherPerson ()" color="primary"/></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Zamknij" color="primary" v-close-popup @click="otherFirstName=null,otherSecondName=null,clubName=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addAmmo">
                <div class="bg-white">
                  <div class="row">
                    <q-field class="full-width col" standout stack-label>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">Wybierz Kaliber</div>
                    </template>
                    </q-field>
                  </div>
                  <div class="row">
                  <div class="full-width">
                      <q-radio v-model="caliberUUID" v-for="(calibers,uuid) in calibers" :key="uuid" :val="calibers.uuid">
                        <q-field borderless style="full-width">
                         <template v-slot:control>
                          <div class="full-width">{{calibers.name}}</div>
                         </template>
                        </q-field>
                      </q-radio>
                  </div>
                  </div>
                  <q-input filled class="full-width col" onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="ammoQuantity" label="Ilość Amunicji"></q-input>
                  <div class="row">
                  <q-btn flat label="zamknij" color="primary" v-close-popup />
                  <q-btn class="full-width col" color="primary" label="wydaj amunicję" @click="addAmmoConfirm = true"></q-btn>
                  </div>
                </div>
    </q-dialog>
    <q-dialog v-model="ammoAdded" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Amunicja została dodana do listy</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
    <q-dialog v-model="addAmmoConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy napewno chcesz Dodać amunicję?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="addMemberAndAmmoToCaliber()" />
        </q-card-actions>
      </q-card>
</q-dialog>
  </q-page>
</template>
<style>
  .box:focus-within{
    background-color:orange;
  }
  .box:hover{
    background-color: orange;
  }
  .siz{
    font-size: 10px;
    padding: 0;
  }
</style>
<script>
const stringOptions = []
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios
export default {
  data () {
    return {
      val: [],
      uuid: null,
      tournamentUUID: null,
      tournamentConfirm: false,
      tournamentAlert: false,
      tournamentCloseConfirm: false,
      tournamentCloseAlert: false,
      tournamentUpdateConfirm: false,
      tournamentUpdated: false,
      addMemberConfirm: false,
      addNewTournament: false,
      addMemberAlert: false,
      addOtherAlert: false,
      removeMemberAlert: false,
      removeArbiterAlert: false,
      addArbiterAlert: false,
      addCompetitionConfirmbtn: false,
      addArbitersConfirmbtn: false,
      addCompetitionConfirm: false,
      addCompetitionAlert: false,
      newCompetitionAlert: false,
      createNewCompetiton: false,
      competitionName: null,
      failure: false,
      memberFailure: false,
      dataFail: false,
      arbiterFailure: false,
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
      choice10: '',
      choice11: '',
      tournaments: [],
      competitions: [],
      filters: [],
      filtersPermission: [],
      filtersOther: [],
      tournamentsClosed: [],
      calibers: [],
      caliberUUID: null,
      tournamentName: '',
      tournamentDate: '',
      options: stringOptions,
      finder: '',
      mainArbiter: null,
      countArbiter: null,
      otherArbiter: null,
      competitionRadio: '',
      removeFromList: false,
      memberName: null,
      otherName: null,
      score: null,
      scoreLabel: null,
      addNewOtherPerson: false,
      otherFirstName: null,
      otherSecondName: null,
      clubName: null,
      innerTen: null,
      outerTen: null,
      meters: false,
      quantity: false,
      notUsed: false,
      state: null,
      addAmmo: false,
      addAmmoConfirm: false,
      ammoQuantity: '',
      memberLeg: null,
      ammoAdded: false,
      date: '',
      name: '',
      otherID: '',
      filtersOtherArbiters: [],
      otherMainArbiterName: null,
      otherRTSArbiterName: null,
      otherPersonArbiterName: null,
      ordinal: '',
      permissionsOtherArbiterNumber: '',
      permissionsOtherArbiterPermissionValidThru: '',
      permissionsArbiterPermissionValidThru: '',
      otherArbitersList: null,
      otherPhoneNumber: '',
      otherEmail: ''
    }
  },
  created () {
    this.getListTournaments()
    this.getcompetitions()
    this.getCLosedTournaments()
    this.getOther()
    this.getOtherArbiters()
  },
  methods: {
    onEnter (scoreUUID) {
      this.setScore(scoreUUID, this.scoreLabel, this.innerTen, this.outerTen)
    },
    getListTournaments () {
      this.getMembersNames()
      this.getMembersNameswithPermissions()
      fetch('http://localhost:8080/shootingplace-1.0/tournament/list', {
        method: 'GET'
      }).then(response => response.json())
        .then(tournaments => {
          this.tournaments = tournaments
        })
    },
    getcompetitions () {
      fetch('http://localhost:8080/shootingplace-1.0/competition/', {
        method: 'GET'
      }).then(response => response.json())
        .then(competitions => {
          this.competitions = competitions
        })
    },
    getListCalibers () {
      fetch('http://localhost:8080/shootingplace-1.0/ammoEvidence/calibers', {
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
      fetch('http://localhost:8080/shootingplace-1.0/member/getAllActiveMembersNames', {
        method: 'GET'
      }).then(response => response.json())
        .then(filters => {
          this.filters = filters
        })
    },
    getMembersNameswithPermissions () {
      fetch('http://localhost:8080/shootingplace-1.0/member/getArbiters', {
        method: 'GET'
      }).then(response => response.json())
        .then(filtersPermission => {
          this.filtersPermission = filtersPermission
        })
    },
    getOther () {
      fetch('http://localhost:8080/shootingplace-1.0/other/', {
        method: 'GET'
      }).then(response => response.json())
        .then(filtersOther => {
          this.filtersOther = filtersOther
        })
    },
    getOtherArbiters () {
      fetch('http://localhost:8080/shootingplace-1.0/other/arbiters', {
        method: 'GET'
      }).then(response => response.json())
        .then(filtersOtherArbiters => {
          this.filtersOtherArbiters = filtersOtherArbiters
        })
    },
    addMemberAndAmmoToCaliber () {
      fetch('http://localhost:8080/shootingplace-1.0/ammoEvidence/ammo?caliberUUID=' + this.caliberUUID + '&legitimationNumber=' + this.memberLeg + '&counter=' + this.ammoQuantity + '&otherID=' + this.otherID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.toggleAmmunitionInScore(this.scoreUUID)
          this.ammoAdded = true
          this.showloading()
        } else { this.failure = true }
      }
      )
    },
    addOtherPerson () {
      var person = {
        firstName: this.otherFirstName,
        secondName: this.otherSecondName,
        phoneNumber: this.otherPhoneNumber,
        email: this.otherEmail
      }
      fetch('http://localhost:8080/shootingplace-1.0/other?club=' + this.clubName + '&arbiterClass=' + this.ordinal + '&arbiterNumber=' + this.permissionsOtherArbiterNumber + '&arbiterPermissionValidThru=' + this.permissionsOtherArbiterPermissionValidThru.replace(/\//gi, '-'), {
        method: 'POST',
        body: JSON.stringify(person),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 201) {
          this.addOtherAlert = true
          this.getOther()
          this.getOtherArbiters()
        } else { this.dataFail = true }
      })
    },
    createNewTournament (name, date) {
      var data = {
        name: name,
        date: date.replace(/\//gi, '-'),
        open: true
      }
      fetch('http://localhost:8080/shootingplace-1.0/tournament/', {
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
        }
      })
    },
    createCompetition () {
      var name = null
      if (this.competitionName !== null) {
        name = this.competitionName
      } else {
        name =
        this.choice + 'm' + this.choice1 + this.choice2 + this.choice3 + this.choice4 + this.choice5 + this.choice6 + this.choice7 + this.choice8 + this.choice9 + this.choice10 + ' strzałów' + this.choice11
      }
      fetch('http://localhost:8080/shootingplace-1.0/competition?name=' + name + '&discipline=' + this.choice1, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 201) {
          this.newCompetitionAlert = true
          this.competitionName = ''
          this.showloading()
          this.getListTournaments()
          this.getcompetitions()
        } else {
          this.failure = true
        }
      })
    },
    updateTournament () {
      var data = {
        name: this.tournamentName,
        date: this.tournamentDate.replace(/\//gi, '-')
      }
      fetch('http://localhost:8080/shootingplace-1.0/tournament/' + this.tournamentUUID, {
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
        }
      })
    },
    addMemberToCompetition (uuid) {
      const memberNameWord = this.memberName.split(' ')
      var legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      const otherNameWord = this.otherName.split(' ')
      var idNumber = otherNameWord.length
      const otherNameID = otherNameWord[idNumber - 1]
      fetch('http://localhost:8080/shootingplace-1.0/competitionMembersList/addMember?competitionUUID=' + uuid + '&legitimationNumber=' + memberNameUUID + '&otherPerson=' + otherNameID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addMemberAlert = true
          this.showloading()
          this.getListTournaments()
        } else { this.dataFail = true }
      })
    },
    removeMemberFromCompetition (uuid, finder) {
      const memberNameWord = this.memberName.split(' ')
      var legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      const otherNameWord = this.otherName.split(' ')
      var idNumber = otherNameWord.length
      const otherNameID = otherNameWord[idNumber - 1]
      fetch('http://localhost:8080/shootingplace-1.0/competitionMembersList/removeMember?competitionUUID=' + uuid + '&legitimationNumber=' + memberNameUUID + '&otherPerson=' + otherNameID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.removeMemberAlert = true
        } else { this.dataFail = true }
      })
    },
    addCompetitonToTournament () {
      if (this.competitionRadio != null && this.competitionRadio !== '') {
        fetch('http://localhost:8080/shootingplace-1.0/tournament/addCompetition/' + this.tournamentUUID + '?competitionUUID=' + this.competitionRadio, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.status === 200) {
            this.addCompetitionAlert = true
            this.showloading()
            this.getListTournaments()
            this.getcompetitions()
          } else { this.failure = true }
        })
      } else {
        this.dataFail = true
      }
    },
    setScore (scoreUUID, score, innerTen, outerTen) {
      if (innerTen === null) {
        innerTen = '-1'
      }
      if (outerTen === null) {
        outerTen = '-1'
      }
      if (score === null) {
        score = '-1'
      }
      fetch('http://localhost:8080/shootingplace-1.0/competition?scoreUUID=' + scoreUUID + '&score=' + parseFloat(score.replace(/,/gi, '.')) + '&innerTen=' + parseFloat(innerTen.replace(/,/gi, '.')) + '&outerTen=' + parseFloat(outerTen.replace(/,/gi, '.')), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.scoreLabel = null
          this.innerTen = null
          this.outerTen = null
          this.getListTournaments()
        } else { this.dataFail = true }
      })
    },
    toggleAmmunitionInScore (scoreUUID) {
      fetch('http://localhost:8080/shootingplace-1.0/competition/?scoreUUID=' + scoreUUID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.getListTournaments()
        } else { this.dataFail = true }
      })
    },
    closeTournament () {
      fetch('http://localhost:8080/shootingplace-1.0/tournament/' + this.tournamentUUID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.tournamentCloseAlert = true
          this.showloading()
          this.getListTournaments()
          this.getCLosedTournaments()
        }
      })
    },
    getCLosedTournaments () {
      fetch('http://localhost:8080/shootingplace-1.0/tournament/closedList', {
        method: 'GET'
      }).then(response => {
        response.json().then(tournamentsClosed => {
          this.tournamentsClosed = tournamentsClosed
        })
      })
    },
    removeArbiter () {
      const otherArbiterWord = this.otherArbiter.split(' ')
      var legNumber = otherArbiterWord.length
      const otherArbiterUUID = otherArbiterWord[legNumber - 1]
      const otherPersonArbiterWord = this.otherArbitersList.split(' ')
      var personLegNumber = otherPersonArbiterWord.length
      const otherPersonArbiterID = otherPersonArbiterWord[personLegNumber - 1]
      fetch('http://localhost:8080/shootingplace-1.0/tournament/removeArbiter/' + this.tournamentUUID + '?number=' + otherArbiterUUID + '&id=' + otherPersonArbiterID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            this.removeArbiterAlert = true,
            this.otherArbiter = null,
            this.otherArbitersList = null,
            this.showloading(),
            this.getListTournaments()
          )
        } else { this.arbiterFailure = true }
      })
    },
    addMainArbiterToTournament () {
      const mainArbiterWord = this.mainArbiter.split(' ')
      var legNumber = mainArbiterWord.length
      const mainArbiterUUID = mainArbiterWord[legNumber - 1]
      const mainOtherArbiterWord = this.otherMainArbiterName.split(' ')
      var otherLegNumber = mainOtherArbiterWord.length
      const mainOtherArbiterID = mainOtherArbiterWord[otherLegNumber - 1]
      fetch('http://localhost:8080/shootingplace-1.0/tournament/addMainArbiter/' + this.tournamentUUID + '?number=' + mainArbiterUUID + '&id=' + mainOtherArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addArbiterAlert = true
          this.mainArbiter = null
          this.otherMainArbiterName = null
          this.showloading()
          this.getListTournaments()
        } else { this.arbiterFailure = true }
      })
    },
    addRTSArbiterToTournament () {
      const countArbiterWord = this.countArbiter.split(' ')
      var legNumber = countArbiterWord.length
      const countArbiterUUID = countArbiterWord[legNumber - 1]
      const countOtherArbiterWord = this.otherRTSArbiterName.split(' ')
      var otherLegNumber = countOtherArbiterWord.length
      const countOtherArbiterID = countOtherArbiterWord[otherLegNumber - 1]
      fetch('http://localhost:8080/shootingplace-1.0/tournament/addRTSArbiter/' + this.tournamentUUID + '?number=' + countArbiterUUID + '&id=' + countOtherArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addArbiterAlert = true
          this.countArbiter = null
          this.otherRTSArbiterName = null
          this.showloading()
          this.getListTournaments()
        } else { this.arbiterFailure = true }
      })
    },
    addOtherArbiterToTournament () {
      const otherArbiterWord = this.otherArbiter.split(' ')
      var legNumber = otherArbiterWord.length
      const otherArbiterUUID = otherArbiterWord[legNumber - 1]
      const otherPersonArbiterWord = this.otherArbitersList.split(' ')
      var personLegNumber = otherPersonArbiterWord.length
      const otherPersonArbiterID = otherPersonArbiterWord[personLegNumber - 1]
      fetch('http://localhost:8080/shootingplace-1.0/tournament/addOthersArbiters/' + this.tournamentUUID + '?number=' + otherArbiterUUID + '&id=' + otherPersonArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addArbiterAlert = true
          this.otherArbiter = null
          this.otherArbitersList = null
          this.showloading()
          this.getListTournaments()
        } else { this.arbiterFailure = true }
      })
    },
    filterFn (val, update) {
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
    filterMp (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filtersPermission.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filtersPermission.filter(v => v.toLowerCase().indexOf(needle) > -1)
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
    sortArray () {
      fetch('http://localhost:8080/shootingplace-1.0/competitionMembersList/sort?competitionUUID=' + this.competitionUUID + '&sort=' + this.state, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.state = null
          this.getListTournaments()
        } else { this.failure = true }
      })
    },
    getAnnouncementFromCompetition () {
      axios({
        url: 'http://localhost:8080/shootingplace-1.0/files/downloadAnnouncementFromCompetition/' + this.tournamentUUID,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Zawody_' + this.name + '_' + this.date + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    }
  },
  name: 'tournament'
}
</script>
