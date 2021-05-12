<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Lista Zawodów</div>
        </q-item>
      </div>
      <q-card class="row">
        <q-card-section v-if="tournaments.length < 1">
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
        <!-- <q-card-section>
              <q-btn
                color="secondary"
                label="ranking"
                @click="getRankingCompetitions ()"
              ></q-btn>
        </q-card-section> -->
      </q-card>
      <div class="row">
      <q-card class="col-10">
      <div v-for="(tournaments,uuid) in tournaments" :key="uuid" class="row bg-grey-2 text-h6">
        <div class="col-6">
          <q-item-section class="col q-pa-md">
              <div class="col">
                <q-item-label>{{ tournaments.name }} {{ tournaments.date }}</q-item-label>
                <q-item-label v-if="tournaments.wzss" caption lines="2">zawody wpisane do kalendarza Wojewódzkiego związku</q-item-label>
                <q-item-label v-if="!tournaments.wzss" caption lines="2">zawody nie wpisane do kalendarza Wojewódzkiego związku</q-item-label>
              </div>
          </q-item-section>
        </div>
        <div class="col-3">
          <q-item><q-btn color="primary" class="full-width" label="pobierz komunikat" @click="tournamentUUID = tournaments.uuid,date= tournaments.date,name = tournaments.name,getAnnouncementFromCompetition()"></q-btn></q-item>
          <q-item><q-btn color="primary" class="full-width" label="pobierz listę Sędziów" @click="tournamentUUID = tournaments.uuid,name= tournaments.name,date = tournaments.date,getJudgeFromTournament ()" ></q-btn></q-item>
          <q-item><q-btn color="white" class="text-black full-width" v-if="tournaments.open" label="dodaj sędziów" @click="tournamentUUID = tournaments.uuid,addArbitersConfirmbtn = true"></q-btn></q-item>
          <q-item v-if="tournaments.open"><q-btn color="white" class="text-black full-width" label="dodaj konkurencje" @click="tournamentUUID = tournaments.uuid,addCompetitionConfirmbtn = true"></q-btn></q-item>
    <q-dialog v-model="addCompetitionConfirmbtn" persistent>
      <q-card class="flex-center">
      <q-card class="col">
        <q-card-section class="col">
          <div class="text-center text-bold text-h5">Pistolet</div>
            <div v-for="(competitions,uuid) in competitions" :key="uuid" class="col">
              <div v-if="competitions.discipline == 'Pistolet'" class="bg-grey-2">
                <q-radio v-if="competitions.countingMethod == 'COMSTOCK'" :val="competitions.uuid" v-model="competitionRadio">{{competitions.name}} ({{competitions.countingMethod}})</q-radio>
                <q-radio v-else :val="competitions.uuid" v-model="competitionRadio">{{competitions.name}}</q-radio>
              </div>
            </div>
        </q-card-section>
      </q-card>
      <q-card class="col">
        <q-card-section class="col">
          <div class="text-center text-bold text-h5">Karabin</div>
            <div v-for="(competitions,uuid) in competitions" :key="uuid" class="col">
              <div v-if="competitions.discipline == 'Karabin'" class="bg-grey-4">
                <q-radio v-if="competitions.countingMethod == 'COMSTOCK'" :val="competitions.uuid" v-model="competitionRadio">{{competitions.name}} ({{competitions.countingMethod}})</q-radio>
                <q-radio v-else :val="competitions.uuid" v-model="competitionRadio">{{competitions.name}}</q-radio>
            </div>
            </div>
        </q-card-section>
      </q-card>
      <q-card class="col">
        <q-card-section class="col">
          <div class="text-center text-bold text-h5">Strzelba</div>
            <div v-for="(competitions,uuid) in competitions" :key="uuid" class="col">
              <div v-if="competitions.discipline == 'Strzelba'" class="bg-grey-5">
                <q-radio v-if="competitions.countingMethod == 'COMSTOCK'" :val="competitions.uuid" v-model="competitionRadio">{{competitions.name}} ({{competitions.countingMethod}})</q-radio>
                <q-radio v-else :val="competitions.uuid" v-model="competitionRadio">{{competitions.name}}</q-radio>
              </div>
            </div>
        </q-card-section>
      </q-card>
        <q-card-actions align="right">
            <q-item><q-btn
                label="Dodaj konkurencję"
                color="primary"
                @click="(addCompetitionConfirm = true)"
            /></q-item>
          <q-btn flat label="zamknij" color="primary" v-close-popup @click="competitionRadio=''"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
        </div>
        <div class="col-3">
              <q-item ><q-btn class="full-width" color="primary" label="Aktualizuj" @click="tournamentUUID = tournaments.uuid, (tournamentUpdateConfirm = true) "/></q-item>
              <q-item ><q-btn class="full-width" color="primary" label="Statystyki" @click="tournamentUUID = tournaments.uuid, getStatistics(), statistics=true"/></q-item>
              <q-item v-if="(tournaments.mainArbiter!=null || tournaments.otherMainArbiter!=null)&&(tournaments.commissionRTSArbiter!=null || tournaments.otherCommissionRTSArbiter!=null)" ><q-btn class="full-width" color="secondary" label="Zamknij zawody" @click="tournamentUUID = tournaments.uuid, (tournamentCloseConfirm = true) "/></q-item>
              <q-item v-else><q-btn :ripple="false" class="full-width text-black" color="grey-9" label="Zamknij zawody"><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Nie można zamknąć zawodów: brak ustawionych sędziów</q-tooltip></q-btn></q-item>
        </div>
            <div class="full-width row bg-grey-2">
              <div class="col">
              <div class="row">
                <div class="col">
                <q-field standout="bg-accent text-black" stack-label>
                    <div class="text-bold self-center full-width no-outline text-black" tabindex="0">Sędzia główny</div>
                </q-field>
                <q-field v-if="tournaments.mainArbiter!=null" class="col" standout="bg-accent text-black" stack-label label="Sędzia Główny Zawodów">
                    <div class="self-center col full-width no-outline text-black" tabindex="0">{{tournaments.mainArbiter.firstName}} {{tournaments.mainArbiter.secondName}} {{tournaments.mainArbiter.memberPermissions.arbiterClass}}</div>
                </q-field>
                <q-field v-if="tournaments.otherMainArbiter!=null" class="col" standout="bg-accent text-black" stack-label label="Sędzia Główny Zawodów">
                    <div class="self-center col full-width no-outline text-black" tabindex="0">{{tournaments.otherMainArbiter.firstName}} {{tournaments.otherMainArbiter.secondName}} {{tournaments.otherMainArbiter.permissionsEntity.arbiterClass}}</div>
                </q-field>
                </div>
                <div class="col">
                <q-field standout="bg-accent text-black" stack-label>
                    <div class="text-bold self-center full-width no-outline text-black" tabindex="0">Sędziowie stanowiskowi</div>
                </q-field>
                <div v-if="tournaments.arbitersList.length>0">
                <q-field v-for="(arbiters,uuid) in tournaments.arbitersList" :key="uuid" standout="bg-accent text-black" stack-label label="Sędzia Stanowiskowy">
                    <div class="self-center full-width no-outline text-black" tabindex="0">{{arbiters.firstName}} {{arbiters.secondName}} {{arbiters.memberPermissions.arbiterClass}}</div>
                </q-field>
                </div>
                <div v-if="tournaments.otherArbitersList.length>0">
                <q-field v-for="(otherArbitersList,id) in tournaments.otherArbitersList" :key="id" standout="bg-accent text-black" stack-label label="Sędzia Stanowiskowy spoza klubu">
                    <div class="text-bold self-center full-width no-outline text-black" tabindex="0">{{otherArbitersList.firstName}} {{otherArbitersList.secondName}} {{otherArbitersList.permissionsEntity.arbiterClass}}</div>
                </q-field>
                </div>
                </div>
                </div>
              <div class="row">
                <div class="col">
                <q-field standout="bg-accent text-black" stack-label>
                    <div class="text-bold self-center full-width no-outline text-black" tabindex="0">Sędzia komisji RTS</div>
                </q-field>
                <q-field v-if="tournaments.commissionRTSArbiter!=null" class="col" standout="bg-accent text-black" stack-label label="Przewodniczący Komisji RTS">
                    <div class="self-center col full-width no-outline text-black" tabindex="0">{{tournaments.commissionRTSArbiter.firstName}} {{tournaments.commissionRTSArbiter.secondName}} {{tournaments.commissionRTSArbiter.memberPermissions.arbiterClass}}</div>
                </q-field>
                <q-field v-if="tournaments.otherCommissionRTSArbiter!=null" class="col" standout="bg-accent text-black" stack-label label="Przewodniczący Komisji RTS">
                    <div class="self-center col full-width no-outline text-black" tabindex="0">{{tournaments.otherCommissionRTSArbiter.firstName}} {{tournaments.otherCommissionRTSArbiter.secondName}} {{tournaments.otherCommissionRTSArbiter.permissionsEntity.arbiterClass}}</div>
                </q-field>
                </div>
                <div class="col">
                <q-field standout="bg-accent text-black" stack-label>
                    <div class="text-bold self-center full-width no-outline text-black" tabindex="0">Sędziowie biura obiczeń</div>
                </q-field>
                <div v-if="tournaments.arbitersRTSList.length>0">
                <q-field v-for="(arbitersRTSList,uuid) in tournaments.arbitersRTSList" :key="uuid" standout="bg-accent text-black" stack-label label="Sędzia biura obliczeń">
                    <div class="self-center full-width no-outline text-black" tabindex="0">{{arbitersRTSList.firstName}} {{arbitersRTSList.secondName}} {{arbitersRTSList.memberPermissions.arbiterClass}}</div>
                </q-field>
                </div>
                <div v-if="tournaments.otherArbitersRTSList.length>0">
                <q-field v-for="(otherArbitersRTSList,id) in tournaments.otherArbitersRTSList" :key="id" standout="bg-accent text-black" stack-label label="Sędzia biura obliczeń spoza klubu">
                    <div class="text-bold self-center full-width no-outline text-black" tabindex="0">{{otherArbitersRTSList.firstName}} {{otherArbitersRTSList.secondName}} {{otherArbitersRTSList.permissionsEntity.arbiterClass}}</div>
                </q-field>
                </div>
                </div>
                </div>
              </div>
              <div class="col-5" >
                <q-field standout="bg-accent text-black" stack-label>
                    <div class="text-bold self-center full-width no-outline text-black">Lista Konkurencji</div>
                </q-field>
                <div class="row" v-for="(competitionsList,uuid) in tournaments.competitionsList" :key="uuid">
                <q-field class="col" standout="bg-accent text-black" stack-label>
                    <div v-if="competitionsList.countingMethod == 'COMSTOCK'" class="self-center full-width no-outline text-black" tabindex="0">{{competitionsList.name}} ({{competitionsList.countingMethod}})</div>
                    <div v-else class="self-center full-width no-outline text-black" tabindex="0">{{competitionsList.name}}</div>
                </q-field>
                  <q-btn v-if="competitionsList.scoreList<1" color="white" class="col-2 text-black" tabindex="0" @click="competitionListUUID = competitionsList.uuid,tournamentUUID = tournaments.uuid,deleteListFromTournament()">usuń</q-btn>
                </div>
              </div>
            </div>
        <q-card class="full-width">
                      <q-item><div class="text-h6 self-center row full-width no-outline" tabindex="0">Dodawnie zawodników</div></q-item>
          <div class="row">
                <q-card-section class="col-6">
                  <div class="col">
                <q-select filled v-model="memberName" use-input hide-selected fill-input input-debounce="0" :options="options" @input="otherName='0 0'" @filter="filterFn" label="Wybierz osobę z klubu">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Brak wyników
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select filled v-model="otherName" use-input hide-selected fill-input input-debounce="0" :options="options" @input="memberName='0 0'" @filter="filterOther" label="Wybierz osobę spoza klubu">
                  <template v-slot:no-option>
                    <div>
                      <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników  - możesz dodać nową osobę</div>
                      <div class="q-pa-md bg-grey-5"><q-btn class="full-width" color="primary" label="przejdź do formularza" @click="addNewOtherPerson = true"/></div>
                    </div>
                  </template>
                </q-select>
                  </div>
                  </q-card-section>
                  <q-card-section class="col-6">
                  <div class="col">
                <q-select @focus.self="tournamentUUID = tournaments.uuid, getCompetitionsInTournament()" @input="tournamentUUID = tournaments.uuid,getCompetitionID ()" filled v-model="competition" :options="options2" label="Wybierz Konkurencję"></q-select>
                </div>
                <div class="row">
                  <q-btn class="col full-width" v-if="tournaments.open" label="Usuń z listy" @click="removeMemberFromCompetition(valUUID, finder),finder = null"></q-btn>
                  <q-btn class="col full-width" v-if="tournaments.open" label="Dodaj do listy" @click="addMemberToCompetition(valUUID), (finder = null)"></q-btn>
                </div>
                </q-card-section>
                </div>
              <q-item v-for="(competitionsList,uuid) in tournaments.competitionsList" :key="uuid" >
                <div class="col">
                <q-card-section class="col-9">
                  <q-item v-if="competitionsList.countingMethod == 'COMSTOCK'" class="full-width text-h5 text-bold text-center">{{competitionsList.name}} ({{competitionsList.countingMethod}})</q-item>
                  <q-item v-else class="full-width text-h5 text-bold text-center">{{competitionsList.name}}</q-item>
                  <div>
                      <div class="row">
                        <q-field class="col-1" standout="bg-accent text-black" stack-label>
                            <div class="self-center full-width col no-outline text-center text-black" tabindex="0">amunicja</div>
                        </q-field>
                        <q-field class="col-5" standout="bg-accent text-black">
                          <div class="row full-width">
                            <div class="col self-center full-width no-outline text-center text-black" tabindex="1">Zawodnik</div>
                            <div class="col self-center full-width no-outline text-center text-black" tabindex="1">Klub</div>
                          </div>
                        </q-field>
                        <q-field class="col" standout="bg-accent text-black">
                            <div class="self-center full-width col no-outline text-center text-black" tabindex="2">Wynik</div>
                        </q-field>
                      </div>
                  <div class="text-body2" v-for="(scoreList,uuid) in competitionsList.scoreList" :key="uuid">
                    <div v-if="competitionsList.countingMethod == 'COMSTOCK'" class="row">
                      <q-btn v-if="scoreList.ammunition == false && scoreList.gun == false && scoreList.member!=null" class="col-1" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,memberLeg = scoreList.member.legitimationNumber,otherID = 0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Wydaj broń lub amunicję {{scoreList.member.secondName}}</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == true && scoreList.gun == false && scoreList.member!=null" class="col-1" color="green" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,memberLeg = scoreList.member.legitimationNumber,otherID = 0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Amunicja wydana</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == false && scoreList.gun == true && scoreList.member!=null" class="col-1" color="yellow" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,memberLeg = scoreList.member.legitimationNumber,otherID = 0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń wydana</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == true && scoreList.gun == true && scoreList.member!=null" glossy class="col-1" color="green" text-color="yellow" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,memberLeg = scoreList.member.legitimationNumber,otherID = 0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń i Amunicja wydana</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == false && scoreList.gun == false && scoreList.otherPersonEntity!=null" class="col-1" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,otherID = scoreList.otherPersonEntity.id,memberLeg=0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Wydaj broń lub amunicję {{scoreList.otherPersonEntity.secondName}}</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == true && scoreList.gun == false && scoreList.otherPersonEntity!=null" class="col-1" color="green" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,otherID = scoreList.otherPersonEntity.id,memberLeg=0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Amunicja wydana</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == false && scoreList.gun == true && scoreList.otherPersonEntity!=null" class="col-1" color="yellow" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,otherID = scoreList.otherPersonEntity.id,memberLeg=0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń wydana</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == true && scoreList.gun == true && scoreList.otherPersonEntity!=null" class="col-1" color="green" text-color="yellow" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,otherID = scoreList.otherPersonEntity.id,memberLeg=0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń i Amunicja wydana</q-tooltip></q-btn>
                      <div v-if="scoreList.otherPersonEntity == null" class="col-5" @dblclick="tournamentUUID = tournaments.uuid,memberUUID=scoreList.member.uuid,otherID = '0',date=tournaments.date,name=scoreList.member.secondName,startNumber=scoreList.metricNumber,getScoreInfo(),scoreInfo=true">
                        <q-field standout="bg-accent text-black" stack-label>
                            <q-tooltip v-if="!scoreList.member.active" content-class="bg-red text-subtitle2" anchor="top middle" >UREGULUJ SKŁADKI</q-tooltip>
                            <div class="q-pa-xs row full-width">
                            <div v-if="scoreList.otherPersonEntity == null" class="self-center full-width col no-outline text-black" tabindex="0">{{scoreList.member.secondName}} {{scoreList.member.firstName}}</div>
                            <div v-if="scoreList.otherPersonEntity == null" class="self-center full-width col no-outline text-black" tabindex="0">{{scoreList.member.club.name}}</div>
                            </div>
                        </q-field>
                      </div>
                      <div v-if="scoreList.member == null" class="col-5" @dblclick="tournamentUUID = tournaments.uuid,memberUUID=null,otherID = scoreList.otherPersonEntity.id,date=tournaments.date,name=scoreList.otherPersonEntity.secondName,startNumber=scoreList.metricNumber,getScoreInfo(),scoreInfo=true">
                      <q-field standout="bg-accent text-black" stack-label >
                          <div class="q-pa-xs row full-width">
                          <div v-if="scoreList.member == null" class="self-center full-width col no-outline text-black" tabindex="0">{{scoreList.otherPersonEntity.secondName}} {{scoreList.otherPersonEntity.firstName}}</div>
                          <div v-if="scoreList.member == null" class="self-center full-width col no-outline text-black" tabindex="0">{{scoreList.otherPersonEntity.club.name}}</div>
                          </div>
                      </q-field>
                      </div>
                      <q-field class="col-1 text-center" standout="bg-accent text-black" stack-label label="metryka">
                          <div class="self-center full-width col no-outline text-center text-black" tabindex="0">{{scoreList.metricNumber}}</div>
                      </q-field>
                      <q-field class="box col-1 cursor-pointer" standout="bg-accent text-black" label="trafienia" stack-label>
                        <q-popup-edit v-model="outerTen">
                          <q-input @focus="scoreUUID = scoreList.uuid" input-class="text-center" v-model="outerTen" @keypress.enter="scoreUUID = scoreList.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="trafienia" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <div class="q-pa-xs">
                            <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                            <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = scoreList.uuid, setScore(scoreList.uuid,scoreLabel,innerTen,outerTen,procedures)"></q-btn>
                          </div>
                        </q-popup-edit>
                        <div class="self-center full-width col no-outline text-center text-black" tabindex="0">{{scoreList.outerTen}}</div>
                      </q-field>
                    <q-field class="box col-1 cursor-pointer" standout="bg-accent text-black" label="czas" stack-label>
                      <q-popup-edit v-model="innerTen">
                        <q-input @focus="scoreUUID = scoreList.uuid" input-class="text-center" v-model="innerTen" @keypress.enter="scoreUUID = scoreList.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="czas" onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode 44 || event.charCode 46" />
                        <div class="q-pa-xs">
                          <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                          <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = scoreList.uuid, setScore(scoreList.uuid,scoreLabel,innerTen,outerTen,procedures)"></q-btn>
                        </div>
                      </q-popup-edit>
                      <div class="self-center full-width col no-outline text-center text-black" tabindex="0">{{scoreList.innerTen}}</div>
                    </q-field>
                    <q-field class="box col-1 cursor-pointer" standout="bg-accent text-black" label="procedury" stack-label>
                      <q-popup-edit v-model="procedures">
                        <q-input @focus="scoreUUID = scoreList.uuid" input-class="text-center" v-model="procedures" @keypress.enter="scoreUUID = scoreList.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="procedury + 3 sek" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                        <div class="q-pa-xs row full-width">
                          <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                          <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = scoreList.uuid, setScore(scoreList.uuid,scoreLabel,innerTen,outerTen,procedures)"></q-btn>
                        </div>
                      </q-popup-edit>
                      <div class="self-center full-width col no-outline text-center text-black" tabindex="0">{{scoreList.procedures}}</div>
                    </q-field>
                    <q-field class="col-1" standout="bg-accent text-black" label="HF" stack-label>
                        <div class="self-center full-width col no-outline text-center text-black" tabindex="0">{{scoreList.hf}}</div>
                    </q-field>
                    <div class="col-1" @dblclick="toggleDSQDNF=true">
                    <q-field standout="bg-accent text-black" label="Wynik" clickable stack-label @dblclick="toggleDSQDNF=true">
                        <div class="self-center full-width col no-outline text-center text-black q-pa-xs" tabindex="0">{{scoreList.score}}</div>
                    </q-field>
                    </div>
                    </div>
                    <div v-else class="row">
                      <q-btn v-if="scoreList.ammunition == false && scoreList.gun == false && scoreList.member!=null" class="col-1" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,memberLeg = scoreList.member.legitimationNumber,otherID = 0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Wydaj broń lub amunicję {{scoreList.member.secondName}}</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == true && scoreList.gun == false && scoreList.member!=null" class="col-1" color="green" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,memberLeg = scoreList.member.legitimationNumber,otherID = 0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Amunicja wydana</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == false && scoreList.gun == true && scoreList.member!=null" class="col-1" color="yellow" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,memberLeg = scoreList.member.legitimationNumber,otherID = 0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń wydana</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == true && scoreList.gun == true && scoreList.member!=null" glossy class="col-1" color="green" text-color="yellow" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,memberLeg = scoreList.member.legitimationNumber,otherID = 0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń i Amunicja wydana</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == false && scoreList.gun == false && scoreList.otherPersonEntity!=null" class="col-1" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,otherID = scoreList.otherPersonEntity.id,memberLeg=0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Wydaj broń lub amunicję {{scoreList.otherPersonEntity.secondName}}</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == true && scoreList.gun == false && scoreList.otherPersonEntity!=null" class="col-1" color="green" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,otherID = scoreList.otherPersonEntity.id,memberLeg=0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Amunicja wydana</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == false && scoreList.gun == true && scoreList.otherPersonEntity!=null" class="col-1" color="yellow" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,otherID = scoreList.otherPersonEntity.id,memberLeg=0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń wydana</q-tooltip></q-btn>
                      <q-btn v-if="scoreList.ammunition == true && scoreList.gun == true && scoreList.otherPersonEntity!=null" class="col-1" color="green" text-color="yellow" style="text-8" icon="book" @click="compName=competitionsList.name,scoreUUID = scoreList.uuid,otherID = scoreList.otherPersonEntity.id,memberLeg=0, getListCalibers(),addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń i Amunicja wydana</q-tooltip></q-btn>
                      <div class="col" v-if="scoreList.otherPersonEntity == null" @dblclick="tournamentUUID = tournaments.uuid,memberUUID=scoreList.member.uuid,otherID = '0',date=tournaments.date,name=scoreList.member.secondName + ' ' + scoreList.member.firstName,startNumber=scoreList.metricNumber,getScoreInfo(),scoreInfo=true">
                        <q-field standout="bg-accent text-black" stack-label>
                            <q-tooltip v-if="!scoreList.member.active" content-class="bg-red text-subtitle2" anchor="top middle" >UREGULUJ SKŁADKI</q-tooltip>
                            <div class="q-pa-xs row full-width">
                            <div v-if="scoreList.otherPersonEntity == null" class="self-center full-width col no-outline text-black" tabindex="0">{{scoreList.member.secondName}} {{scoreList.member.firstName}} </div>
                            <div v-if="scoreList.otherPersonEntity == null" class="self-center full-width col no-outline text-black" tabindex="0">{{scoreList.member.club.name}}</div>
                            </div>
                        </q-field>
                      </div>
                    <div class="col" v-if="scoreList.member == null" @dblclick="tournamentUUID = tournaments.uuid,memberUUID=null,otherID = scoreList.otherPersonEntity.id,date=tournaments.date,name=scoreList.otherPersonEntity.secondName + ' ' + scoreList.otherPersonEntity.firstName,startNumber=scoreList.metricNumber,getScoreInfo(),scoreInfo=true">
                    <q-field standout="bg-accent text-black" stack-label >
                        <div class="q-pa-xs row full-width">
                        <div v-if="scoreList.member == null" class="self-center full-width col no-outline text-black" tabindex="0">{{scoreList.otherPersonEntity.secondName}} {{scoreList.otherPersonEntity.firstName}}  </div>
                        <div v-if="scoreList.member == null" class="self-center full-width col no-outline text-black" tabindex="0"> {{scoreList.otherPersonEntity.club.name}}</div>
                        </div>
                    </q-field>
                    </div>
                    <q-field class="col-1 text-center" standout="bg-accent text-black" stack-label label="metryka">
                        <div class="self-center full-width col no-outline text-center text-black" tabindex="0">{{scoreList.metricNumber}}</div>
                    </q-field>
                      <q-field class="box col-2 cursor-pointer" standout="bg-accent text-black" label="10 ogólnie" stack-label>
                          <q-popup-edit v-model="outerTen">
                              <q-input @focus="scoreUUID = scoreList.uuid" input-class="text-center" v-model="outerTen" @keypress.enter="scoreUUID = scoreList.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="ilość 10 ogólnie" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                              <div class="q-pa-xs">
                                <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                                <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = scoreList.uuid, setScore(scoreList.uuid,scoreLabel,innerTen,outerTen,procedures)"></q-btn>
                              </div>
                            </q-popup-edit>
                            <div class="self-center full-width col no-outline text-center text-black" tabindex="0">{{scoreList.outerTen}}</div>
                      </q-field>
                    <q-field class="box col-2 cursor-pointer" standout="bg-accent text-black" label="10 wewnętrzne" stack-label>
                        <q-popup-edit v-model="innerTen">
                              <q-input @focus="scoreUUID = scoreList.uuid" input-class="text-center" v-model="innerTen" @keypress.enter="scoreUUID = scoreList.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="ilość 10 wewnętrznych" onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                              <div class="q-pa-xs">
                                <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                                <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = scoreList.uuid, setScore(scoreList.uuid,scoreLabel,innerTen,outerTen,procedures)"></q-btn>
                              </div>
                            </q-popup-edit>
                        <div class="self-center full-width col no-outline text-center text-black" tabindex="0">{{scoreList.innerTen}}</div>
                    </q-field>
                    <q-field class="box col-1 cursor-pointer" standout="bg-accent text-black" label="Wynik" stack-label>
                        <q-popup-edit v-model="scoreLabel">
                              <q-input @focus="scoreUUID = scoreList.uuid" input-class="text-center" v-model="scoreLabel" @keypress.enter="scoreUUID = scoreList.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="Wynik" onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode 44 || event.charCode 46"/>
                              <div class="q-pa-xs">
                                <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                                <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = scoreList.uuid, setScore(scoreList.uuid,scoreLabel,innerTen,outerTen,procedures)"></q-btn>
                              </div>
                            </q-popup-edit>
                        <div class="self-center full-width col no-outline text-center text-black" tabindex="0">{{scoreList.score}}</div>
                    </q-field>
                    </div>
                  </div>
                  </div>
                </q-card-section>
                </div>
              </q-item>
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
          <div class="col">
          <q-item>
            <q-btn class="col" :label="tournamentsClosed.date" @click="tournamentClosedName=tournamentsClosed.name,tournamentUUID = tournamentsClosed.tournamentUUID,name= tournamentsClosed.name,date = tournamentsClosed.date,closedTournamentInfo=true,getStatistics ()"></q-btn>
          </q-item>
          </div>
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
              <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Pistolet'" label="Pistolet"></q-radio>
              <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Karabin'" label="Karabin"></q-radio>
              <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '', meters = false, choice = '' " v-model="choice1" :val="'Strzelba'" label="Strzelba"></q-radio>
            </div>
            <div class="col bg-grey-2">
              <q-checkbox class="row" v-if="choice1 == 'Strzelba' " :val="''" true-value=" maszynowa" false-value="" color="orange" v-model="choice2" label="maszynowa"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" maszynowy" false-value="" color="orange" v-model="choice2" label="maszynowy"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 == 'Strzelba' " :val="''" true-value=" dynamiczna"  false-value="" color="orange" v-model="choice3" label="dynamiczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" dynamiczny" false-value="" color="orange" v-model="choice3" label="dynamiczny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="choice1 == 'Strzelba' " :val="''" true-value=" sportowa" false-value="" color="orange" v-model="choice5" label="sportowa"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value=" sportowy" false-value="" color="orange" v-model="choice5" label="sportowy"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 == 'Strzelba' " :val="''" true-value=" dowolna" false-value="" color="orange" v-model="choice6" label="dowolna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" dowolny" false-value="" color="orange" v-model="choice6" label="dowolny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="choice1 == 'Strzelba' " :val="''" true-value=" pneumatyczna" false-value="" color="orange" v-model="choice7" label="pneumatyczna"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value=" pneumatyczny" false-value="" color="orange" v-model="choice7" label="pneumatyczny"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 == 'Strzelba' " :val="''" true-value=" statyczna" false-value="" color="orange" v-model="choice8" label="statyczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" statyczny" false-value="" color="orange" v-model="choice8" label="statyczny"></q-checkbox>
            </div>
            <div class="row bg-grey-3">
              <q-radio class="col" v-if="!choice7 && choice1 != 'Strzelba' && !choice5" color="orange" v-model="choice9" :val="' centralnego zapłonu'" label="centralnego zapłonu"></q-radio>
              <q-radio class="col" v-if="!choice7 && choice1 != 'Strzelba'" color="orange" v-model="choice9" :val="' bocznego zapłonu'" label="bocznego zapłonu"></q-radio>
            </div>
            <div class="row bg-grey-4">
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 5'" label="5 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 7'" label="7 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 10'" label="10 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 15'" label="15 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="' 20'" label="20 strzałów"></q-radio>
              <q-checkbox class="row" color="orange" @input="choice10 = ''" v-model="quantity" :val="false" label="inne"></q-checkbox>
              <q-item class="row"><q-input @focus="choice10 = ' '" onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width bg-grey-4 center justify" filled v-if="quantity" style="width: 100px" v-model="choice10" stack-label label="Ilość strzałów" ></q-input></q-item>
            </div>
            <div class="row bg-grey-5">
              <q-radio color="orange" v-model="choice11" :val="' OPEN'" label="OPEN"></q-radio>
              <q-radio color="orange" v-model="choice11" :val="' Młodzieżowa'" label="Młodzieżowa"></q-radio>
            </div>
            <div class="row bg-grey-6">
              <q-item class="items-center">Metoda Liczenia : </q-item>
              <q-radio class="col" color="primary" v-model="choice12" :val="'NORMAL'" label="Normalnie"></q-radio>
              <q-radio class="col" color="primary" v-model="choice12" :val="'COMSTOCK'" label="Comstock"></q-radio>
            </div>
            <div class="row"><q-label class="text-h6">Nazwa konkurencji : </q-label>
              <q-label v-if="choice" class="text-h6"> {{choice + 'm'}} {{' ' + choice1}} {{' ' + choice2}} {{' ' + choice3}} {{' ' + choice4}} {{' ' + choice5}} {{' ' + choice6}} {{' ' + choice7}} {{' ' + choice8}} {{' ' + choice9}} {{' ' + choice10 }} {{' ' + choice11}}</q-label>
              <q-label v-else class="text-h6"> {{choice}} {{' ' + choice1}} {{' ' + choice2}} {{' ' + choice3}} {{' ' + choice4}} {{' ' + choice5}} {{' ' + choice6}} {{' ' + choice7}} {{' ' + choice8}} {{' ' + choice9}} {{' ' + choice10 }} {{' ' + choice11}}</q-label>
            </div>
          </q-item-section>
          <q-item-section v-if="notUsed">
              <q-item><q-label class="text-h6 text-bold text-justify">Można nadać własną nazwę zawodów bez używania kreatora</q-label></q-item>
            <div class="row bg-grey-2">
              <q-radio class="col" color="black" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Pistolet'" label="Pistolet"></q-radio>
              <q-radio class="col" color="black" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Karabin'" label="Karabin"></q-radio>
              <q-radio class="col" color="black" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Strzelba'" label="Strzelba"></q-radio>
              <q-input @focus="choice10 = ' '" onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify" filled style="width: 100px" v-model="choice10" stack-label label="Ilość strzałów" ></q-input>
            </div>
              <div class="row">
                <q-item class="items-center">Metoda Liczenia : </q-item>
                <q-radio class="col" color="black" v-model="choice12" :val="'NORMAL'" label="Normalnie"></q-radio>
                <q-radio class="col" color="black" v-model="choice12" :val="'COMSTOCK'" label="Comstock"></q-radio>
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
            <q-btn color="red" label="Usuń" v-close-popup @click="deleteTournamentAlert = true"></q-btn>
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
        <div class="self-center full-width col no-outline text-black" tabindex="0">Sędzia Główny</div>
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
          <div>
            <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników  - możesz dodać nową osobę</div>
            <div class="q-pa-md bg-grey-5"><q-btn class="full-width" color="primary" label="przejdź do formularza" @click="addNewOtherPerson = true"/></div>
          </div>
        </template>
      </q-select>
    </div>
    <q-item v-if="mainArbiter!=null && mainArbiter != '0 0' "><q-btn label="Dodaj" color="orange" @click="addMainArbiterToTournament()"/></q-item>
    <q-item v-if="otherMainArbiterName!=null && otherMainArbiterName != '0 0' "><q-btn label="Dodaj" color="orange" @click="addMainArbiterToTournament()"/></q-item>
    </div>
    <div class="q-pa-md bg-grey-3">
    <q-field standout stack-label>
        <div class="self-center full-width col no-outline text-black" tabindex="0">Sędzia RTS</div>
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
          <div>
            <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników  - możesz dodać nową osobę</div>
            <div class="q-pa-md bg-grey-5"><q-btn class="full-width" color="primary" label="przejdź do formularza" @click="addNewOtherPerson = true"/></div>
          </div>
        </template>
      </q-select>
    </div>
          <q-item v-if="countArbiter!=null && countArbiter !='0 0' "><q-btn label="Dodaj" color="primary" @click="addRTSArbiterToTournament()"/></q-item>
          <q-item v-if="otherRTSArbiterName!=null && otherRTSArbiterName != '0 0' "><q-btn label="Dodaj" color="primary" @click="addRTSArbiterToTournament()"/></q-item>
          </div>
    <div class="q-pa-md bg-grey-4">
    <q-field standout stack-label>
        <div class="self-center full-width col no-outline text-black" tabindex="0">Sędziowie stanowiskowi</div>
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
          <div>
            <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników  - możesz dodać nową osobę</div>
            <div class="q-pa-md bg-grey-5"><q-btn class="full-width" color="primary" label="przejdź do formularza" @click="addNewOtherPerson = true"/></div>
          </div>
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
    <div class="q-pa-md bg-grey-4">
    <q-field standout stack-label>
        <div class="self-center full-width col no-outline text-black" tabindex="0">Sędziowie biura obliczeń</div>
    </q-field>
    <div>
      <q-select @input="otherRTSArbitersList = '0 0'" class="full-width" filled v-model="otherRTSArbiter" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterMp" style="width: 350px" label="Wybierz z Klubu">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Brak wyników
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select @input="otherRTSArbiter = '0 0'" class="full-width" color="orange" filled v-model="otherRTSArbitersList" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterOtherArbiters" label="Dodaj sędziego spoza klubu">
        <template v-slot:no-option>
          <div>
            <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników  - możesz dodać nową osobę</div>
            <div class="q-pa-md bg-grey-5"><q-btn class="full-width" color="primary" label="przejdź do formularza" @click="addNewOtherPerson = true"/></div>
          </div>
        </template>
      </q-select>
    </div>
            <div class="col">
            <div>
            <q-item v-if="otherRTSArbiter!=null && otherRTSArbiter!='0 0'"><q-btn class="full-width" label="Dodaj sędziego biura obliczeń" color="primary" @click="addOtherRTSArbiterToTournament()"/></q-item>
            <q-item v-if="otherRTSArbitersList!=null && otherRTSArbitersList!='0 0' "><q-btn class="full-width" label="Dodaj sędziego biura obliczeń spoza klubu" color="primary" @click="addOtherRTSArbiterToTournament()"/></q-item>
            </div>
            <div>
            <q-item v-if="otherRTSArbiter!=null && otherRTSArbiter!='0 0' "><q-btn class="full-width" label="usuń sędziego biura obliczeń" color="primary" @click="removeRTSArbiter()"/></q-item>
            <q-item v-if="otherRTSArbitersList!=null && otherRTSArbitersList!='0 0'"><q-btn class="full-width" label="usuń sędziego biura obliczeń spoza klubu" color="primary" @click="removeRTSArbiter()"/></q-item>
            </div>
            </div>
    </div>
          </q-item-section>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="orange" v-close-popup @click="mainArbiter=null,countArbiter=null,otherArbiter=null,otherRTSArbiter=null,otherMainArbiterName=null,otherRTSArbiterName=null,otherArbitersList=null,otherRTSArbitersList=null"/>
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
          <q-btn label="usuń" color="warning" v-close-popup @click="removeMemberFromCompetition(valUUID, finder),finder = null"/>
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
    <q-dialog position="top" v-model="tournamentUpdated" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6 text-bold">Zaktualizowano</span>
        </q-card-section>

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
          <q-item><q-item-label class="text-h6 text-center full-width">Nazwa zawodów</q-item-label></q-item>
          <q-item
            ><q-input class="full-width" v-model="tournamentName" filled label="Nazwa"
          /></q-item>
          <q-item><q-item-label class="text-h6 text-center full-width">Data zawodów</q-item-label></q-item>
          <q-item>
            <q-input class="full-width" filled v-model="tournamentDate" mask="####/##/##" label="Wybierz datę" hint="użyj kalendarza">
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
          <q-checkbox v-model="wzss" class="full-width"><div class="text-bold text-center text-h6">zawody wpisane do WZSS</div></q-checkbox>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click=" createNewTournament(tournamentName,tournamentDate)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="tournamentAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano nowe zawody</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="tournamentCloseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zawody są już zamknięte</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="tournamentOpenAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zawody są otwarte</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="addOtherAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zapisano do bazy</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="removeMemberAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Usunięto Zawodnika z listy</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="removeArbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Usunięto sędziego z listy</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="addArbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Sędziego</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="addCompetitionAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano konkurencję do zawodów</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="newCompetitionAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano nową konkurencję</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="failure" @keypress.enter="failure=false">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można dodać konkurencji. Sprawdź poprawność danych.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="toggleDSQDNF" @keypress.enter="failure=false">
      <q-card>
        <q-card-section>
          <div>
            <div class="text-h6">Czy ustawić w wyniku DNF?</div>
            <q-btn>ustaw zawodnikowi DNF</q-btn>
          </div>
          <div>
            <div class="text-h6">Czy ustawić w wyniku DSQ?</div>
            <q-btn>ustaw zawodnikowi DSQ</q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="memberFailure">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można dodać Zawodnika bo już znajduje się w konkurencji.</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="dataFail">
      <q-card>
        <q-card-section>
          <div class="text-h6">Sprawdź poprawność danych</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="arbiterFailure">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nie można dodać Sędziego.</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="addNewOtherPerson">
      <q-card class="full-width">
        <q-card-section>
          <div class="text-h6">Dodawanie nowej osoby spoza klubu</div>
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 32" filled v-model="otherFirstName" label="Imię *"/></q-item>
          <q-item><q-input class="full-width" onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || (event.charCode > 210 && event.charCode < 400) || event.charCode == 45" filled v-model="otherSecondName" label="Nazwisko *"/></q-item>
          <q-item><q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubName" :val="'BRAK'" label="Brak Klubu"></q-checkbox>
          <!-- <q-input v-if="clubName!='BRAK'" class="full-width" filled v-model="clubName" label="Nazwa Klubu"/> -->
          <q-item v-if="clubName!='BRAK'" class="full-width">
            <q-select v-if="clubName!='BRAK'" class="full-width" @new-value="createValue" hide-selected use-chips filled v-model="clubName" use-input fill-input input-debounce="0" :options="filterOptions" @filter="filterFna" label="Wybierz Klub">
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
          <q-item><q-input class="full-width" mask="### ### ###" filled v-model="otherPhoneNumber" label="Numer telefonu"/></q-item>
          <q-item><q-input class="full-width" filled v-model="otherEmail" label="e-mail"/></q-item>
          <q-item class="full-width">
            <q-field class="full-width" standout stack-label>
                <div class="self-center full-width col no-outline" tabindex="0">Uprawniena Sędziowskie - można zostawić puste</div>
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
        <q-item><q-btn label="Zapisz do bazy" v-close-popup @click="addOtherPerson (),otherFirstName=null,otherSecondName=null,clubName=''" color="primary"/></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Zamknij" color="primary" v-close-popup @click="otherFirstName=null,otherSecondName=null,clubName=''"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addAmmo">
      <q-card>
        <q-card-section>
          <div class="text-bold text-center text-h6">WYDAWANIE AMUNICJI</div>
                <div class="bg-white">
                  <div class="row">
                    <q-field class="full-width col" standout="bg-accent text-black" stack-label>
                    <template v-slot:control>
                      <div class="text-center full-width no-outline text-center text-black" tabindex="0">Wybierz <b>Kaliber</b> właściwy dla konkurencji</div>
                      <div class="text-center full-width no-outline text-bold text-center text-black text-h6">{{compName}}</div>
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
                  <q-input @keypress.enter="addAmmoConfirm = true" type="number" filled class="full-width col" onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="ammoQuantity" label="Ilość Amunicji"></q-input>
                  <div align="right">
                  <q-btn class="col full-width" color="primary" label="wydaj amunicję" @click="addAmmoConfirm = true"></q-btn>
                  </div>
                </div>
                </q-card-section>
                <q-card-section>
                  <div class="text-bold text-center text-h6">WYDAWANIE BRONI</div>
                  <div align="right">
                  <q-btn class="full-width" color="primary" @click="showloading(),toggleGunInScore()">wydaj broń</q-btn>
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="zamknij" color="primary" v-close-popup />
                </q-card-actions>
                </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="gunAdded" persistent @keypress.enter="gunAdded=false">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6 text-bold">Broń została przydzielona</span>
        </q-card-section>

      </q-card>
</q-dialog>
    <q-dialog v-model="addAmmoConfirm" persistent @keypress.enter="addMemberAndAmmoToCaliber(),addAmmoConfirm=false,ammoQuantity=null,addAmmo=false">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy napewno chcesz Wydać amunicję?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Wydaj" color="primary" v-close-popup @click="addMemberAndAmmoToCaliber(),ammoQuantity=null,addAmmoConfirm=false,addAmmo=false" />
        </q-card-actions>
      </q-card>
</q-dialog>
    <q-dialog v-model="deleteTournamentAlert" persistent>
      <q-card class="bg-red">
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h4 text-bold">Czy napewno usunąć zawody? Zmiana będzie nieodwracalna</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="black" v-close-popup />
          <q-btn flat label="USUŃ" color="black" v-close-popup @click="deleteTournament()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="statistics" persistent>
      <q-card >
        <q-card-section class="col items-center">
          <span class="q-ml-sm text-h6 text-bold">STATYSTYKI ZAWODÓW</span>
          <div class="text-bold">
          <div>ilość konkurencji : {{statistic[0]}}</div>
          <div>ilość zawodników : {{statistic[1]}}</div>
          <div>ilość osobostartów : {{statistic[2]}}</div>
          <div>ile razy była pobrana amunicja : {{statistic[3]}}</div>
          <div>ile razy była pobrana broń : {{statistic[4]}}</div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="scoreInfo" persistent>
      <q-card >
        <q-card-section class="col">
          <div class="q-ml-sm text-h6 text-center text-bold">POBIERZ METRYKI STARTOWE ZAWODNIKA</div>
          <div class="q-ml-sm text-h6 text-center text-bold">{{name}}</div>
          <ol><li v-for="info in infoScore" :key="info"><q-checkbox v-model="compList" :val="info" :label="info"></q-checkbox></li></ol>
          <div class="row q-pa-xs">
            <q-btn @click="getMemberMetrics(compList),info=[],compList=[]" class="col q-pa-xs" color="secondary">wydrukuj wybrane metryki zawodnika</q-btn>
            <q-item></q-item>
            <q-btn @click="getMemberMetrics(infoScore),info=[],compList=[]" class="col q-pa-xs" color="primary">wydrukuj wszystkie metryki zawodnika</q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="info=[],compList=[]" label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="closedTournamentInfo">
      <q-card >
        <q-card-section class="col">
          <div class="q-ml-sm text-h6 text-center text-bold">INFORMACJE O ZAMKNIĘTYCH ZAWODACH</div>
          <div class="q-ml-sm text-h6 text-center text-bold">{{tournamentClosedName}} {{date}}</div>
          <div class="q-ml-sm text-h6 text-center text-bold">STATYSTYKI ZAWODÓW</div>
          <div class="text-bold">
          <div>ilość konkurencji : {{statistic[0]}}</div>
          <div>ilość zawodników : {{statistic[1]}}</div>
          <div>ilość osobostartów : {{statistic[2]}}</div>
          <div>ile razy była pobrana amunicja : {{statistic[3]}}</div>
          <div>ile razy była pobrana broń : {{statistic[4]}}</div>
          </div>
          <div><q-item><q-btn @click="getAnnouncementFromCompetition()" class="full-width" color="primary">pobierz komunikat</q-btn></q-item></div>
          <div><q-item><q-btn @click="getJudgeFromTournament ()" class="full-width" color="primary">pobierz listę sędziów</q-btn></q-item></div>
          <div><q-item><q-btn @click="openList=true" class="full-width" color="primary">otwórz zawody</q-btn></q-item></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>
    <q-dialog v-model="openList" persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div><q-input @keypress.enter="openTournament(),openList=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
          <q-btn id="3" label="otwórz" color="black" v-close-popup @click="openTournament()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="forbidden">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">Niewłaściwy kod. Spróbuj ponownie.</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  <q-dialog position="top" v-model="listDownload">
  <q-card>
    <q-card-section class="col">
    <div class="self-center col full-width no-outline text-center text-h5 text-bold">Pobrano</div>
  </q-card-section>
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
import App from 'src/App.vue'
Vue.prototype.$axios = axios
export default {
  data () {
    return {
      val: [],
      uuid: null,
      valUUID: null,
      code: null,
      openList: false,
      listDownload: false,
      forbidden: false,
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
      toggleDSQDNF: false,
      memberFailure: false,
      dataFail: false,
      arbiterFailure: false,
      clubs: [],
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
      choice12: '',
      options2: [],
      competition: null,
      tournaments: [],
      competitions: [],
      filters: [],
      filtersPermission: [],
      filtersOther: [],
      tournamentsClosed: [],
      calibers: [],
      statistic: [],
      infoScore: [],
      caliberUUID: null,
      tournamentName: '',
      tournamentDate: '',
      scoreUUID: null,
      options: stringOptions,
      finder: '',
      mainArbiter: null,
      countArbiter: null,
      otherArbiter: null,
      otherRTSArbiter: null,
      competitionRadio: '',
      removeFromList: false,
      memberName: null,
      otherName: null,
      score: null,
      scoreLabel: null,
      addNewOtherPerson: false,
      otherFirstName: null,
      otherSecondName: null,
      otherPhoneNumber: '',
      otherEmail: '',
      clubName: '',
      innerTen: null,
      outerTen: null,
      procedures: null,
      meters: false,
      quantity: false,
      notUsed: false,
      state: null,
      addAmmo: false,
      addAmmoConfirm: false,
      ammoQuantity: '',
      memberLeg: null,
      gunAdded: false,
      statistics: false,
      scoreInfo: false,
      startNumber: null,
      compName: null,
      date: '',
      name: '',
      compList: [],
      otherID: '',
      memberUUID: null,
      filtersOtherArbiters: [],
      otherMainArbiterName: null,
      otherRTSArbiterName: null,
      otherPersonArbiterName: null,
      otherArbitersList: null,
      otherRTSArbitersList: null,
      ordinal: '',
      permissionsOtherArbiterNumber: '',
      permissionsOtherArbiterPermissionValidThru: '',
      permissionsArbiterPermissionValidThru: '',
      deleteTournamentAlert: false,
      closedTournamentInfo: false,
      tournamentClosedName: null,
      competitionListUUID: null,
      wzss: true,
      filterOptions: stringOptions,
      local: App.host
    }
  },
  created () {
    this.getListTournaments()
    this.getCompetitions()
    this.getCLosedTournaments()
    this.getOther()
    this.getOtherArbiters()
    this.getAllClubsToTournament()
  },
  methods: {
    onEnter (scoreUUID) {
      this.setScore(scoreUUID, this.scoreLabel, this.innerTen, this.outerTen, this.procedures)
    },
    getListTournaments () {
      this.getMembersNames()
      this.getMembersNameswithPermissions()
      fetch('http://' + this.local + '/tournament/list', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.tournaments = response
          this.getCompetitions()
        })
    },
    getCompetitions () {
      fetch('http://' + this.local + '/competition/', {
        method: 'GET'
      }).then(response => response.json())
        .then(competitions => {
          this.competitions = competitions
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
        .then(filters => {
          this.filters = filters
        })
    },
    getMembersNameswithPermissions () {
      fetch('http://' + this.local + '/member/getArbiters', {
        method: 'GET'
      }).then(response => response.json())
        .then(filtersPermission => {
          this.filtersPermission = filtersPermission
        })
    },
    getOther () {
      fetch('http://' + this.local + '/other/', {
        method: 'GET'
      }).then(response => response.json())
        .then(filtersOther => {
          this.filtersOther = filtersOther
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
    getScoreInfo () {
      fetch('http://' + this.local + '/competitionMembersList/getMemberStarts?tournamentUUID=' + this.tournamentUUID + '&memberUUID=' + this.memberUUID + '&otherID=' + this.otherID, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.infoScore = response
        })
    },
    getCompetitionID () {
      fetch('http://' + this.local + '/competitionMembersList/getID?name=' + this.competition + '&tournamentUUID=' + this.tournamentUUID, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.valUUID = response
        })
    },
    getOtherArbiters () {
      fetch('http://' + this.local + '/other/arbiters', {
        method: 'GET'
      }).then(response => response.json())
        .then(filtersOtherArbiters => {
          this.filtersOtherArbiters = filtersOtherArbiters
        })
    },
    addMemberAndAmmoToCaliber () {
      fetch('http://' + this.local + '/ammoEvidence/ammo?caliberUUID=' + this.caliberUUID + '&legitimationNumber=' + this.memberLeg + '&counter=' + this.ammoQuantity + '&otherID=' + this.otherID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.toggleAmmunitionInScore(this.scoreUUID)
          this.showloading()
          this.autoClose()
        } else {
          this.dataFail = true
          this.autoClose()
        }
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
      fetch('http://' + this.local + '/other?club=' + this.clubName + '&arbiterClass=' + this.ordinal + '&arbiterNumber=' + this.permissionsOtherArbiterNumber + '&arbiterPermissionValidThru=' + this.permissionsOtherArbiterPermissionValidThru.replace(/\//gi, '-'), {
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
          this.autoClose()
        } else {
          this.dataFail = true
          this.autoClose()
        }
      })
    },
    createNewTournament (name, date) {
      var data = {
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
        }
      })
    },
    createCompetition () {
      var name = null
      if (this.choice10 !== null && this.choice10 !== '') {
        this.choice10 = this.choice10 + ' strzałów'
      }
      if (this.choice !== null && this.choice !== '') {
        this.choice = this.choice + 'm '
      } else { this.choice = '' }
      // if (this.choice === ' ') {
      //   this.choice = ''
      // }
      if (this.competitionName !== null) {
        name = this.competitionName
      } else {
        name =
        this.choice + this.choice1 + this.choice2 + this.choice3 + this.choice4 + this.choice5 + this.choice6 + this.choice7 + this.choice8 + this.choice9 + this.choice10 + this.choice11
      }
      const choice10 = this.choice10.replace(/ strzałów/g, '')
      var data = {
        name: name,
        discipline: this.choice1.replace(/ /g, ''),
        numberOfShots: choice10,
        type: this.choice11.replace(/ /, ''),
        countingMethod: this.choice12
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
          this.choice10 = null
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
      var data = {
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
    addMemberToCompetition (uuid) {
      const memberNameWord = this.memberName.split(' ')
      var legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      const otherNameWord = this.otherName.split(' ')
      var idNumber = otherNameWord.length
      const otherNameID = otherNameWord[idNumber - 1]
      fetch('http://' + this.local + '/competitionMembersList/addMember?competitionUUID=' + uuid + '&legitimationNumber=' + memberNameUUID + '&otherPerson=' + otherNameID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.showloading()
          this.getListTournaments()
          this.autoClose()
        } else {
          this.dataFail = true
          this.autoClose()
        }
      })
    },
    removeMemberFromCompetition (uuid, finder) {
      const memberNameWord = this.memberName.split(' ')
      var legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      const otherNameWord = this.otherName.split(' ')
      var idNumber = otherNameWord.length
      const otherNameID = otherNameWord[idNumber - 1]
      fetch('http://' + this.local + '/competitionMembersList/removeMember?competitionUUID=' + uuid + '&legitimationNumber=' + memberNameUUID + '&otherPerson=' + otherNameID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.removeMemberAlert = true
          this.showloading()
          this.getListTournaments()
          this.getCompetitions()
          this.autoClose()
        } else {
          this.dataFail = true
          this.autoClose()
        }
      })
    },
    addCompetitonToTournament () {
      if (this.competitionRadio != null && this.competitionRadio !== '') {
        fetch('http://' + this.local + '/tournament/addCompetition/' + this.tournamentUUID + '?competitionUUID=' + this.competitionRadio, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.status === 200) {
            this.addCompetitionAlert = true
            this.showloading()
            this.getListTournaments()
            this.getCompetitions()
            this.autoClose()
          } else {
            this.failure = true
            this.autoClose()
          }
        })
      } else {
        this.dataFail = true
        this.autoClose()
      }
    },
    setScore (scoreUUID, score, innerTen, outerTen, procedures) {
      if (innerTen === null) {
        innerTen = '-1'
      }
      if (outerTen === null) {
        outerTen = '-1'
      }
      if (score === null) {
        score = '-1'
      }
      if (procedures === null) {
        procedures = '-1'
      }
      fetch('http://' + this.local + '/competition?scoreUUID=' + scoreUUID + '&score=' + parseFloat(score.replace(/,/gi, '.')) + '&innerTen=' + parseFloat(innerTen.replace(/,/gi, '.')) + '&outerTen=' + parseFloat(outerTen.replace(/,/gi, '.')) + '&procedures=' + procedures, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.scoreLabel = null
          this.innerTen = null
          this.outerTen = null
          this.procedures = null
          this.getListTournaments()
        } else {
          this.dataFail = true
          this.autoClose()
        }
      })
    },
    toggleAmmunitionInScore (scoreUUID) {
      fetch('http://' + this.local + '/competition/ammo?scoreUUID=' + scoreUUID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.getListTournaments()
        } else {
          this.dataFail = true
          this.autoClose()
        }
      })
    },
    toggleGunInScore () {
      fetch('http://' + this.local + '/competition/gun?scoreUUID=' + this.scoreUUID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.getListTournaments()
          this.gunAdded = true
          this.autoClose()
        } else {
          this.dataFail = true
          this.autoClose()
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
          this.showloading()
          this.getListTournaments()
          this.getCLosedTournaments()
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
          this.code = null
          this.tournamentOpenAlert = true
          this.closedTournamentInfo = false
          this.showloading()
          this.getListTournaments()
          this.getCLosedTournaments()
          this.autoClose()
        }
      })
    },
    deleteTournament () {
      fetch('http://' + this.local + '/tournament/delete/' + this.tournamentUUID, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.tournamentCloseAlert = true
          this.showloading()
          this.getListTournaments()
          this.getCLosedTournaments()
          this.autoClose()
        }
      })
    },
    getCLosedTournaments () {
      fetch('http://' + this.local + '/tournament/closedList', {
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
      fetch('http://' + this.local + '/tournament/removeArbiter/' + this.tournamentUUID + '?number=' + otherArbiterUUID + '&id=' + otherPersonArbiterID, {
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
            this.getListTournaments(),
            this.autoClose()
          )
        } else {
          this.arbiterFailure = true
          this.autoClose()
        }
      })
    },
    removeRTSArbiter () {
      const otherArbiterWord = this.otherRTSArbiter.split(' ')
      var legNumber = otherArbiterWord.length
      const otherArbiterUUID = otherArbiterWord[legNumber - 1]
      const otherPersonArbiterWord = this.otherRTSArbitersList.split(' ')
      var personLegNumber = otherPersonArbiterWord.length
      const otherPersonArbiterID = otherPersonArbiterWord[personLegNumber - 1]
      fetch('http://' + this.local + '/tournament/removeRTSArbiter/' + this.tournamentUUID + '?number=' + otherArbiterUUID + '&id=' + otherPersonArbiterID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            this.removeArbiterAlert = true,
            this.otherRTSArbiter = null,
            this.otherRTSArbitersList = null,
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
      fetch('http://' + this.local + '/tournament/addMainArbiter/' + this.tournamentUUID + '?number=' + mainArbiterUUID + '&id=' + mainOtherArbiterID, {
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
          this.autoClose()
        } else {
          this.arbiterFailure = true
          this.autoClose()
        }
      })
    },
    addRTSArbiterToTournament () {
      const countArbiterWord = this.countArbiter.split(' ')
      var legNumber = countArbiterWord.length
      const countArbiterUUID = countArbiterWord[legNumber - 1]
      const countOtherArbiterWord = this.otherRTSArbiterName.split(' ')
      var otherLegNumber = countOtherArbiterWord.length
      const countOtherArbiterID = countOtherArbiterWord[otherLegNumber - 1]
      fetch('http://' + this.local + '/tournament/addRTSArbiter/' + this.tournamentUUID + '?number=' + countArbiterUUID + '&id=' + countOtherArbiterID, {
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
          this.autoClose()
        } else {
          this.arbiterFailure = true
          this.autoClose()
        }
      })
    },
    addOtherArbiterToTournament () {
      const otherArbiterWord = this.otherArbiter.split(' ')
      var legNumber = otherArbiterWord.length
      const otherArbiterUUID = otherArbiterWord[legNumber - 1]
      const otherPersonArbiterWord = this.otherArbitersList.split(' ')
      var personLegNumber = otherPersonArbiterWord.length
      const otherPersonArbiterID = otherPersonArbiterWord[personLegNumber - 1]
      fetch('http://' + this.local + '/tournament/addOthersArbiters/' + this.tournamentUUID + '?number=' + otherArbiterUUID + '&id=' + otherPersonArbiterID, {
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
          this.autoClose()
        } else {
          this.arbiterFailure = true
          this.autoClose()
        }
      })
    },
    addOtherRTSArbiterToTournament () {
      const otherArbiterWord = this.otherRTSArbiter.split(' ')
      var legNumber = otherArbiterWord.length
      const otherArbiterUUID = otherArbiterWord[legNumber - 1]
      const otherPersonArbiterWord = this.otherRTSArbitersList.split(' ')
      var personLegNumber = otherPersonArbiterWord.length
      const otherPersonArbiterID = otherPersonArbiterWord[personLegNumber - 1]
      fetch('http://' + this.local + '/tournament/addOthersRTSArbiters/' + this.tournamentUUID + '?number=' + otherArbiterUUID + '&id=' + otherPersonArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addArbiterAlert = true
          this.otherArbiter = null
          this.otherArbitersList = null
          this.otherRTSArbitersList = null
          this.showloading()
          this.getListTournaments()
          this.autoClose()
        } else {
          this.arbiterFailure = true
          this.autoClose()
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
          this.dataFail = true
          this.autoClose()
        }
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
      axios({
        url: 'http://' + this.local + '/files/downloadAnnouncementFromCompetition/' + this.tournamentUUID,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', this.date + '-Dziesiątka-' + this.name + '.pdf')
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
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
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
        url: 'http://' + this.local + '/files/downloadMetric/' + this.tournamentUUID + '?otherID=' + this.otherID + '&memberUUID=' + this.memberUUID + '&competitions=' + info + '&startNumber=' + this.startNumber,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'metryki_' + this.name + '_' + this.date + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getRankingCompetitions () {
      axios({
        url: 'http://' + this.local + '/files/downloadRanking',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'zestawienie_rankingowe.pdf')
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
    autoClose () {
      setTimeout(() => {
        this.tournamentAlert = false
        this.tournamentCloseAlert = false
        this.addOtherAlert = false
        this.removeMemberAlert = false
        this.addArbiterAlert = false
        this.addCompetitionAlert = false
        this.newCompetitionAlert = false
        this.memberFailure = false
        this.dataFail = false
        this.arbiterFailure = false
        this.gunAdded = false
        this.arbiterFailure = false
        this.tournamentUpdated = false
        this.forbidden = false
        this.tournamentOpenAlert = false
        this.listDownload = false
      }, 2000)
    }
  },
  name: 'tournament'
}
</script>
