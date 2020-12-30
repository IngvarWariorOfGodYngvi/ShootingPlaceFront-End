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
              <q-item v-if="tournaments.open"><q-btn class="full-width" color="primary" label="Aktualizuj" @click="tournamentUUID = tournaments.uuid, (tournamentUpdateConfirm = true) "/></q-item>
              <q-item v-if="tournaments.open"><q-btn class="full-width" color="warning" label="Zamknij zawody" @click="tournamentUUID = tournaments.uuid, (tournamentCloseConfirm = true) "/></q-item>
              <q-item v-if="!tournaments.open"><q-item-label>Zawody zamknięte</q-item-label></q-item>
        </div>
            <div class="full-width row bg-grey-1">
              <div class="col">
                <q-field v-if="tournaments.mainArbiter!=null" class="col" standout stack-label label="Sędzia Główny Zawodów">
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">{{tournaments.mainArbiter.firstName}} {{tournaments.mainArbiter.secondName}} {{tournaments.mainArbiter.memberPermissions.arbiterClass}}</div>
                  </template>
                </q-field>
                <q-field v-if="tournaments.commissionRTSArbiter!=null" class="col" standout stack-label label="Sędzia Obliczeniowy">
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">{{tournaments.commissionRTSArbiter.firstName}} {{tournaments.commissionRTSArbiter.secondName}} {{tournaments.mainArbiter.memberPermissions.arbiterClass}}</div>
                  </template>
                </q-field>
              </div>
              <div class="col" v-if="tournaments.commissionRTSArbiter!=null">
                <q-field standout stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">Lista sędziów pomocniczych</div>
                  </template>
                </q-field>
                <q-field v-for="(arbiters,uuid) in tournaments.arbitersList" :key="uuid" standout stack-label label="Sędzia Pomocniczy">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{arbiters.firstName}} {{arbiters.secondName}} {{arbiters.memberPermissions.arbiterClass}}</div>
                  </template>
                </q-field>
              </div>
            </div>
        <q-card class="full-width">
              <q-expansion-item expand-separator group="tournament-competition" v-for="(competitionsList,uuid) in tournaments.competitionsList" :key="uuid" :label="competitionsList.name">
                <div class="row">
                <q-card-section class="col-3">
                  <q-field class="col" standout stack-label>
                    <template v-slot:control>
                      <div class="text-h6 self-center col full-width no-outline" tabindex="0">{{ competitionsList.name }}</div>
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
                  <q-expansion-item class="full-width" label="Lista osób startujących" default-opened>
                  <div class="text-body2" v-for="(scoreList,uuid) in competitionsList.scoreList" :key="uuid">
                    <div class="row">
                    <q-field class="col-4" standout stack-label>
                      <template v-slot:control>
                        <div v-if="scoreList.otherPersonEntity == null" class="self-center full-width col no-outline" tabindex="0">{{scoreList.member.secondName}} {{scoreList.member.firstName}} {{scoreList.member.club.name}}</div>
                        <div v-if="scoreList.member == null" class="self-center full-width col no-outline" tabindex="0">{{scoreList.otherPersonEntity.secondName}} {{scoreList.otherPersonEntity.firstName}} Klub: {{scoreList.otherPersonEntity.club.name}}</div>
                      </template>
                    </q-field>
                    <q-input class="col-1" stack-label onkeypress="return (event.charCode > 47 && event.charCode < 58)" filled v-model="innerTen" label="10W"/>
                    <q-input class="col-1" stack-label onkeypress="return (event.charCode > 47 && event.charCode < 58)" filled v-model="outerTen" label="10Z"/>
                    <q-input color="black" @keypress.enter="scoreUUID = scoreList.uuid, onEnter(scoreUUID)" class="box col-2" stack-label onkeypress="return (event.charCode > 47 && event.charCode < 58)" filled v-model="scoreLabel" label="wprowadź wynik"/>
                    <!--  -->
                    <!--  -->
                    <!--  -->
                    <!--  -->
                    <q-btn class="col-1" icon="send" @click="setScore(scoreList.uuid,scoreLabel,innerTen,outerTen)"/>
                    <!--  -->
                    <!--  -->
                    <!--  -->
                    <!--  -->
                    <q-field class="box col-1" standout label="Wynik" stack-label>
                      <template v-slot:control>
                        <div class="self-center full-width col no-outline" tabindex="0">{{scoreList.score}}</div>
                      </template>
                    </q-field>
                    <q-field class="box col-1" standout label="10W" stack-label>
                      <template v-slot:control>
                        <div class="self-center full-width col no-outline" tabindex="0">{{scoreList.innerTen}}</div>
                      </template>
                    </q-field>
                    <q-field class="box col-1" standout label="10Z" stack-label>
                      <template v-slot:control>
                        <div class="self-center full-width col no-outline" tabindex="0">{{scoreList.outerTen}}</div>
                      </template>
                    </q-field>
                    </div>
                  </div>
                  </q-expansion-item>
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
            <q-btn :label="tournamentsClosed.date" @click="date = ammoListClose.date,uuid= ammoListClose.evidenceUUID,getAmmoListPDF()"></q-btn>
          </q-item>
        </div>
      </div>
    </q-card>
    </div>
    <q-dialog v-model="createNewCompetiton" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-item-section>
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
              <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Pistolet'" label="Pistolet"></q-radio>
              <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Karabin'" label="Karabin"></q-radio>
              <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Strzelba'" label="Strzelba"></q-radio>
            </div>
            <div class="col bg-grey-2">
              <q-checkbox class="row" v-if="choice1 == 'Strzelba' " :val="''" true-value="maszynowa" false-value="" color="orange" v-model="choice2" label="maszynowa"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value="maszynowy" false-value="" color="orange" v-model="choice2" label="maszynowy"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 == 'Strzelba' " :val="''" true-value="dynamiczna"  false-value="" color="orange" v-model="choice3" label="dynamiczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value="dynamiczny" false-value="" color="orange" v-model="choice3" label="dynamiczny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="choice1 == 'Strzelba' " :val="''" true-value="sportowa" false-value="" color="orange" v-model="choice5" label="sportowa"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value="sportowy" false-value="" color="orange" v-model="choice5" label="sportowy"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 == 'Strzelba' " :val="''" true-value="dowolna" false-value="" color="orange" v-model="choice6" label="dowolna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value="dowolny" false-value="" color="orange" v-model="choice6" label="dowolny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="choice1 == 'Strzelba' " :val="''" true-value="pneumatyczna" false-value="" color="orange" v-model="choice7" label="pneumatyczna"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value="pneumatyczny" false-value="" color="orange" v-model="choice7" label="pneumatyczny"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 == 'Strzelba' " :val="''" true-value="statyczna" false-value="" color="orange" v-model="choice8" label="statyczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value="statyczny" false-value="" color="orange" v-model="choice8" label="statyczny"></q-checkbox>
            </div>
            <div class="row bg-grey-3">
              <q-radio class="col" v-if="!choice7 && choice1 != 'Strzelba' && !choice5" color="orange" v-model="choice9" :val="'centralnego zapłonu'" label="centralnego zapłonu"></q-radio>
              <q-radio class="col" v-if="!choice7 && choice1 != 'Strzelba'" color="orange" v-model="choice9" :val="'bocznego zapłonu'" label="bocznego zapłonu"></q-radio>
            </div>
            <div class="row bg-grey-4">
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'5'" label="5 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'7'" label="7 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'10'" label="10 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'15'" label="15 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'20'" label="20 strzałów"></q-radio>
              <q-checkbox class="row" color="orange" @input="choice10 = ''" v-model="quantity" :val="false" label="niestandardowe"></q-checkbox>
              <q-item class="row"><q-input onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width bg-grey-4 center justify" filled v-if="quantity" style="width: 100px" v-model="choice10" stack-label label="ilość strzałów"></q-input></q-item>
            </div>
            <div class="row bg-grey-5">
              <q-radio color="orange" v-model="choice11" :val="'OPEN'" label="OPEN"></q-radio>
              <q-radio color="orange" v-model="choice11" :val="'Młodzieżowa'" label="Młodzieżowa"></q-radio>
            </div>
            <div class="row"><q-label class="text-h6">Nazwa konkurencji : </q-label>
              <q-label class="text-h6"> {{choice + 'm'}} {{choice1}} {{choice2}} {{choice3}} {{choice4}} {{choice5}} {{choice6}} {{choice7}} {{choice8}} {{choice9}} {{choice10  + ' strzałów'}} {{choice11}}</q-label>
            </div>
          </q-item-section>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
          <q-btn label="utwórz" color="primary" v-close-popup @click="createCompetition()"/>
        </q-card-actions>
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
        <q-card-section class="row items-center">
          <q-item-section>
    <q-item><q-item-label>Sędzia Główny</q-item-label></q-item>
    <q-item><q-select filled v-model="mainArbiter" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterMp" style="width: 350px; padding-bottom: 32px" label="Nazwisko">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select></q-item>
          <q-item v-if="mainArbiter!=null"><q-btn label="Dodaj" color="primary" @click="addMainArbiterToTournament()"/></q-item>
    <q-item><q-item-label>Sędzia Komisji</q-item-label></q-item>
    <q-item><q-select filled v-model="countArbiter" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterMp" style="width: 350px; padding-bottom: 32px" label="Nazwisko">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select></q-item>
          <q-item v-if="countArbiter!=null"><q-btn label="Dodaj" color="primary" @click="addRTSArbiterToTournament()"/></q-item>
    <q-item><q-item-label>Pozostali sędziowie</q-item-label></q-item>
    <q-item><q-select filled v-model="otherArbiter" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterMp" style="width: 350px; padding-bottom: 32px" label="Nazwisko">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select></q-item>
            <div class="row">
            <q-item v-if="otherArbiter!=null"><q-btn  label="Dodaj" color="primary" @click="addOtherArbiterToTournament()"/></q-item>
            <q-item v-if="otherArbiter!=null"><q-btn label="usuń sędziego pomocniczego" color="primary" @click="removeArbiter()"/></q-item>
            </div>
          </q-item-section>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup @click="mainArbiter=null,countArbiter=null,otherArbiter=null"/>
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
          <span class="q-ml-sm">Czy dodać Klubowicza do zawodów?</span>
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
      <q-card>
        <q-card-section class="col items-center">
          <q-item><q-item-label>Nazwa zawodów</q-item-label></q-item>
          <q-item
            ><q-input v-model="tournamentName" filled label="Nazwa"
          /></q-item>
          <q-item><q-item-label>Data zawodów</q-item-label></q-item>
          <q-item
            ><q-input
              filled
              v-model="tournamentDate"
              mask="date"
              label="Wybierz datę"
              hint="użyj kalendarza"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="tournamentDate">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Zamknij"
                          color="primary"
                          flat
                        />
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
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
            showloading(), getListTournaments()
          />
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
          <div class="text-h6">Dodano Klubowicza</div>
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
          <div class="text-h6">Usunięto Klubowicza z listy</div>
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
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="otherFirstName" label="Imię"/></q-item>
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="otherSecondName" label="Nazwisko"/></q-item>
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="clubName" label="Nazwa Klubu"/></q-item>
          <q-item><q-btn label="Zapisz do bazy" v-close-popup @click="addOtherPerson ()" color="primary"/></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Zamknij" color="primary" v-close-popup @click="otherFirstName=null,otherSecondName=null,clubName=null"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<style>
  .box:focus-within{
    background-color: #9b9b9b;
  }
  .box:hover{
    background-color: #b17f7f;
  }
</style>
<script>
const stringOptions = []
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
      quantity: false
    }
  },
  created () {
    this.getListTournaments()
    this.getcompetitions()
    this.getCLosedTournaments()
    this.getOther()
  },
  methods: {
    onEnter (scoreUUID) {
      this.setScore(scoreUUID, this.scoreLabel, this.innerTen, this.outerTen)
    },
    getListTournaments () {
      this.getMembersNames()
      this.getMembersNameswithPermissions()
      fetch('http://localhost:8080/tournament/list', {
        method: 'GET'
      }).then(response => response.json())
        .then(tournaments => {
          this.tournaments = tournaments
        })
    },
    getcompetitions () {
      fetch('http://localhost:8080/competition/', {
        method: 'GET'
      }).then(response => response.json())
        .then(competitions => {
          this.competitions = competitions
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
      fetch('http://localhost:8080/member/getMembersNames?active=true&adult=true&erase=false', {
        method: 'GET'
      }).then(response => response.json())
        .then(filters => {
          this.filters = filters
        })
    },
    getMembersNameswithPermissions () {
      fetch('http://localhost:8080/member/getArbiters', {
        method: 'GET'
      }).then(response => response.json())
        .then(filtersPermission => {
          this.filtersPermission = filtersPermission
        })
    },
    getOther () {
      fetch('http://localhost:8080/other/', {
        method: 'GET'
      }).then(response => response.json())
        .then(filtersOther => {
          this.filtersOther = filtersOther
        })
    },
    addOtherPerson () {
      var person = {
        firstName: this.otherFirstName,
        secondName: this.otherSecondName
      }
      fetch('http://localhost:8080/other?club=' + this.clubName, {
        method: 'POST',
        body: JSON.stringify(person),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 201) {
          this.getOther()
        } else { this.failure = true }
      })
    },
    createNewTournament (name, date) {
      var data = {
        name: name,
        date: date.replace(/\//gi, '-'),
        open: true
      }
      fetch('http://localhost:8080/tournament/', {
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
      var data = {
        name: this.choice1 + ' ' + this.competitionName
      }
      fetch('http://localhost:8080/competition/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 201) {
          this.newCompetitionAlert = true
          this.competitionName = ''
          this.choice1 = null
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
      fetch('http://localhost:8080/tournament/' + this.tournamentUUID, {
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
      fetch('http://localhost:8080/competitionMembersList/addMember?competitionUUID=' + uuid + '&legitimationNumber=' + memberNameUUID + '&otherPerson=' + otherNameID, {
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
      fetch('http://localhost:8080/competitionMembersList/removeMember?competitionUUID=' + uuid + '&legitimationNumber=' + memberNameUUID + '&otherPerson=' + otherNameID, {
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
        fetch('http://localhost:8080/tournament/addCompetition/' + this.tournamentUUID + '?competitionUUID=' + this.competitionRadio, {
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
      if (this.innerTen === null) {
        innerTen = '0'
      }
      if (this.outerTen === null) {
        outerTen = '0'
      }
      fetch('http://localhost:8080/competition?scoreUUID=' + scoreUUID + '&score=' + parseFloat(score.replace(/,/gi, '.')) + '&innerTen=' + parseFloat(innerTen.replace(/,/gi, '.')) + '&outerTen=' + parseFloat(outerTen.replace(/,/gi, '.')), {
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
    closeTournament () {
      fetch('http://localhost:8080/tournament/' + this.tournamentUUID, {
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
      fetch('http://localhost:8080/tournament/closedList', {
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
      fetch('http://localhost:8080/tournament/removeArbiter/' + this.tournamentUUID + '?number=' + otherArbiterUUID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            this.removeArbiterAlert = true,
            this.otherArbiter = null,
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
      fetch('http://localhost:8080/tournament/addMainArbiter/' + this.tournamentUUID + '?number=' + mainArbiterUUID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addArbiterAlert = true
          this.mainArbiter = null
          this.showloading()
          this.getListTournaments()
        } else { this.arbiterFailure = true }
      })
    },
    addRTSArbiterToTournament () {
      const countArbiterWord = this.countArbiter.split(' ')
      var legNumber = countArbiterWord.length
      const countArbiterUUID = countArbiterWord[legNumber - 1]
      fetch('http://localhost:8080/tournament/addRTSArbiter/' + this.tournamentUUID + '?number=' + countArbiterUUID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addArbiterAlert = true
          this.countArbiter = null
          this.showloading()
          this.getListTournaments()
        } else { this.arbiterFailure = true }
      })
    },
    addOtherArbiterToTournament () {
      const otherArbiterWord = this.otherArbiter.split(' ')
      var legNumber = otherArbiterWord.length
      const otherArbiterUUID = otherArbiterWord[legNumber - 1]
      fetch('http://localhost:8080/tournament/addOthersArbiters/' + this.tournamentUUID + '?number=' + otherArbiterUUID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addArbiterAlert = true
          this.otherArbiter = null
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
    }
  },
  name: 'tournament'
}
</script>
