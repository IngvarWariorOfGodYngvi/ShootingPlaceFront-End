<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Zawody</div>
        </q-item>
      </div>
      <q-card class="row">
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
                @click="getListCalibers(),createNewCompetiton = true"
              ></q-btn>
        </q-card-section>
      </q-card>
      <div class="row">
      <q-card class="col-10">
      <div v-if="tournaments!=null" class="row bg-grey-2 text-h6">
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
          <q-item>
            <q-btn-dropdown @click="tournamentUUID = tournaments.uuid,date= tournaments.date,name = tournaments.name" align="center" class="full-width" label="pobierz komunikat" color="primary">
              <q-list>
                <q-item v-close-popup class="q-pa-none">
                  <q-item-section>
                    <q-btn @click="getAnnouncementFromCompetition()" class="full-width bg-red-6" label="pobierz plik .pdf" color="secondary"></q-btn>
                  </q-item-section>
                </q-item>
                <q-item v-close-popup class="q-pa-none">
                  <q-item-section>
                    <q-btn @click="getAnnouncementFromCompetitionXLSX()" class="full-width bg-green-6" label="pobierz plik .xslx" color="secondary"></q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-item>
          <q-item><q-btn color="primary" class="full-width" label="pobierz listę Sędziów" @click="tournamentUUID = tournaments.uuid,name= tournaments.name,date = tournaments.date,getJudgeFromTournament ()" ></q-btn></q-item>
          <q-item><q-btn color="white" class="text-black full-width" v-if="tournaments.open" label="dodaj sędziów" @click="tournamentUUID = tournaments.uuid,addArbitersConfirmbtn = true"></q-btn></q-item>
          <q-item v-if="tournaments.open"><q-btn color="white" class="text-black full-width" label="dodaj konkurencje" @click="tournamentUUID = tournaments.uuid,addCompetitionConfirmbtn = true"></q-btn></q-item>
    <q-dialog v-model="addCompetitionConfirmbtn">
      <q-card class="flex-center">
      <q-card class="col">
        <q-card-section class="col">
          <div class="text-center text-bold text-h5">Pistolet</div>
            <div v-for="(item,uuid) in competitions" :key="uuid" class="col">
              <div v-if="item.discipline == 'Pistolet'" class="bg-grey-2">
                <q-checkbox v-if="item.countingMethod == 'COMSTOCK'" :val="item.uuid" v-model="competitionAddToTournamentList">{{item.name}} ({{item.countingMethod}})</q-checkbox>
                <q-checkbox v-else :val="item.uuid" v-model="competitionAddToTournamentList">{{item.name}}</q-checkbox>
              </div>
            </div>
        </q-card-section>
      </q-card>
      <q-card class="col">
        <q-card-section class="col">
          <div class="text-center text-bold text-h5">Karabin</div>
            <div v-for="(item,uuid) in competitions" :key="uuid" class="col">
              <div v-if="item.discipline == 'Karabin'" class="bg-grey-4">
                <q-checkbox v-if="item.countingMethod == 'COMSTOCK'" :val="item.uuid" v-model="competitionAddToTournamentList">{{item.name}} ({{item.countingMethod}})</q-checkbox>
                <q-checkbox v-else :val="item.uuid" v-model="competitionAddToTournamentList">{{item.name}}</q-checkbox>
            </div>
            </div>
        </q-card-section>
      </q-card>
      <q-card class="col">
        <q-card-section class="col">
          <div class="text-center text-bold text-h5">Strzelba</div>
            <div v-for="(item,uuid) in competitions" :key="uuid" class="col">
              <div v-if="item.discipline == 'Strzelba'" class="bg-grey-5">
                <q-checkbox v-if="item.countingMethod == 'COMSTOCK'" :val="item.uuid" v-model="competitionAddToTournamentList">{{item.name}} ({{item.countingMethod}})</q-checkbox>
                <q-checkbox v-else :val="item.uuid" v-model="competitionAddToTournamentList">{{item.name}}</q-checkbox>
              </div>
            </div>
        </q-card-section>
      </q-card>
      <q-card class="col">
        <q-card-section class="col">
          <div class="text-center text-bold text-h5">Pozostałe</div>
            <div v-for="(item,uuid) in competitions" :key="uuid" class="col">
              <div v-if="item.discipline == null" class="bg-grey-5">
                <q-checkbox v-if="item.countingMethod == 'COMSTOCK'" :val="item.uuid" v-model="competitionAddToTournamentList">{{item.name}} ({{item.countingMethod}})</q-checkbox>
                <q-checkbox v-else :val="item.uuid" v-model="competitionAddToTournamentList">{{item.name}}</q-checkbox>
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
          <q-btn flat label="zamknij" color="primary" v-close-popup @click="competitionAddToTournamentList=[]"/>
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
                <q-field v-if="tournaments.mainArbiter!=null" class="col" standout="bg-accent text-black">
                    <div class="self-center col full-width no-outline text-black" tabindex="0">{{tournaments.mainArbiter.firstName}} {{tournaments.mainArbiter.secondName}} {{tournaments.mainArbiter.memberPermissions.arbiterClass}}</div>
                </q-field>
                <q-field v-if="tournaments.otherMainArbiter!=null" class="col" standout="bg-accent text-black">
                    <div class="self-center col full-width no-outline text-black" tabindex="0">{{tournaments.otherMainArbiter.firstName}} {{tournaments.otherMainArbiter.secondName}} {{tournaments.otherMainArbiter.permissionsEntity.arbiterClass}}</div>
                </q-field>
                </div>
                <div class="col">
                <q-field standout="bg-accent text-black" stack-label>
                    <div class="text-bold self-center full-width no-outline text-black" tabindex="0">Sędziowie stanowiskowi</div>
                </q-field>
                <div v-if="tournaments.arbitersList.length>0">
                <q-field v-for="(arbiters,uuid) in tournaments.arbitersList" :key="uuid" standout="bg-accent text-black">
                    <div class="self-center full-width no-outline text-black" tabindex="0">{{arbiters.firstName}} {{arbiters.secondName}} {{arbiters.memberPermissions.arbiterClass}}</div>
                </q-field>
                </div>
                <div v-if="tournaments.otherArbitersList.length>0">
                <q-field v-for="(otherArbitersList,id) in tournaments.otherArbitersList" :key="id" standout="bg-accent text-black" >
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
                <q-field v-if="tournaments.commissionRTSArbiter!=null" class="col" standout="bg-accent text-black">
                    <div class="self-center col full-width no-outline text-black" tabindex="0">{{tournaments.commissionRTSArbiter.firstName}} {{tournaments.commissionRTSArbiter.secondName}} {{tournaments.commissionRTSArbiter.memberPermissions.arbiterClass}}</div>
                </q-field>
                <q-field v-if="tournaments.otherCommissionRTSArbiter!=null" class="col" standout="bg-accent text-black">
                    <div class="self-center col full-width no-outline text-black" tabindex="0">{{tournaments.otherCommissionRTSArbiter.firstName}} {{tournaments.otherCommissionRTSArbiter.secondName}} {{tournaments.otherCommissionRTSArbiter.permissionsEntity.arbiterClass}}</div>
                </q-field>
                </div>
                <div class="col">
                <q-field standout="bg-accent text-black" stack-label>
                    <div class="text-bold self-center full-width no-outline text-black" tabindex="0">Sędziowie biura obiczeń</div>
                </q-field>
                <div v-if="tournaments.arbitersRTSList.length>0">
                <q-field v-for="(arbitersRTSList,uuid) in tournaments.arbitersRTSList" :key="uuid" standout="bg-accent text-black">
                    <div class="self-center full-width no-outline text-black" tabindex="0">{{arbitersRTSList.firstName}} {{arbitersRTSList.secondName}} {{arbitersRTSList.memberPermissions.arbiterClass}}</div>
                </q-field>
                </div>
                <div v-if="tournaments.otherArbitersRTSList.length>0">
                <q-field v-for="(otherArbitersRTSList,id) in tournaments.otherArbitersRTSList" :key="id" standout="bg-accent text-black">
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
          <div class="row bg-grey-3">
            <div class="text-h6 col-6 text-center self-center no-outline" tabindex="0">Dodawanie zawodników</div>
            <div class="col">Wydaj Broń na zawody
              <div class="full-width bg-grey-1">
                <q-input type="password" v-model="barcode" color="black" bg-color="grey-4" dense filled label="zeskanuj kod tutaj" @keypress.enter="tournamentUUID = tournaments.uuid, addGunToTournament(barcode)"></q-input>
                <div>
                  <q-expansion-item exact label="Lista Broni Na Zawodach" dense class="text-left text-h6 text-bold bg-grey-3" @click="tournamentUUID = tournaments.uuid, getGunInTournament()">
                    <q-virtual-scroll :items="gunsUsed" visible class="full-width q-pa-none text-caption" style="height: 200px;">
                      <template v-slot="{ item, index }">
                        <q-item :key="index" dense>
                         <div class="col">{{item.gunName}}</div>
                         <div class="col-4">{{item.gunSerialNumber}}</div>
                        </q-item>
                      </template>
                    </q-virtual-scroll>
                  </q-expansion-item>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
                <q-card-section class="col-6">
                  <div class="col">
                <q-select filled v-model="memberName" dense use-input hide-selected fill-input input-debounce="0" :options="options" @input="otherName='0 0'" @filter="filterFn" label="Wybierz osobę z klubu">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Brak wyników
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select filled v-model="otherName" dense use-input hide-selected fill-input input-debounce="0" :options="options" @input="memberName='0 0'" @filter="filterOther" label="Wybierz osobę spoza klubu">
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
                    <q-btn v-if="memberName==null||otherName==null" color="grey-5" class="full-width" label="Aby wybrać konkurencje najpierw wybierz osobę"><q-tooltip :delay="1500" content-class="text-subtitle2" anchor="top middle" self="bottom middle" :offset="[12, 12]">wybierz kogoś</q-tooltip><q-tooltip :delay="4000" content-class="text-subtitle2" anchor="top middle" self="bottom middle" :offset="[12, 12]">NO WYBIERZ</q-tooltip><q-tooltip :delay="8000" content-class="bg-red text-h2 text-bold" anchor="top middle" self="bottom middle" :offset="[12, 12]">WYBIERAJ!!!</q-tooltip></q-btn>
                    <q-btn v-else @click="tournamentUUID = tournaments.uuid, getCompetitionsInTournament(),competitionsInfo=true" class="full-width" label="wybierz konkurencje"/>
                </div>
                <div>
                  <div>
                    <p></p>
                    <q-btn v-if="memberName==null||otherName==null" class="col full-width" label="Drukuj metryki" color="grey-5"/>
                    <q-btn v-else class="col full-width" label="Drukuj metryki" color="primary" @click="tournamentUUID = tournaments.uuid,getMemberUUIDFromLegitimationNuber (),getScoreInfoByLegitimation(),getMetricNumber ()"/>
                  </div>
                </div>
                </q-card-section>
                </div>
              <q-item v-for="(competitionsList,uuid) in tournaments.competitionsList" :key="uuid" >
                <div class="col">
                  <q-item v-if="competitionsList.countingMethod == 'COMSTOCK'" class="full-width text-h5 text-bold text-center">{{competitionsList.name}} ({{competitionsList.countingMethod}})</q-item>
                  <q-item v-else class="full-width text-h5 text-bold text-center">{{competitionsList.name}}</q-item>
                      <div dense class="row">
                        <q-field dense class="col" standout="bg-accent text-black" stack-label>
                            <div class="col-2 self-center no-outline text-left text-black" tabindex="0">lp amunicja</div>
                            <div class="col-2 self-center no-outline text-left text-black" tabindex="1">Zawodnik</div>
                            <div class="col-2 self-center no-outline text-left text-black" tabindex="1">Klub</div>
                            <div class="col self-center no-outline text-center text-black" tabindex="2">Wynik</div>
                        </q-field>
                      </div>
                  <q-virtual-scroll :items="competitionsList.scoreList" visible class="full-width q-pa-none">
                    <template dense v-slot="{ item, index }">
                      <div :key="index" dense>
                      <div dense v-if="competitionsList.countingMethod == 'COMSTOCK'" class="row text-body2">
                      <div class="col-1">
                      <div class="row" v-if="item.ammunition == false && item.gun == false && item.member!=null" ><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,memberLeg = item.member.legitimationNumber,otherID = 0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Wydaj broń lub amunicję {{item.member.secondName}}</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == true && item.gun == false && item.member!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" color="green" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,memberLeg = item.member.legitimationNumber,otherID = 0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Amunicja wydana</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == false && item.gun == true && item.member!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" color="yellow" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,memberLeg = item.member.legitimationNumber,otherID = 0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń wydana</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == true && item.gun == true && item.member!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense glossy class="col" color="green" text-color="yellow" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,memberLeg = item.member.legitimationNumber,otherID = 0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń i Amunicja wydana</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == false && item.gun == false && item.otherPersonEntity!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,otherID = item.otherPersonEntity.id,memberLeg=0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Wydaj broń lub amunicję {{item.otherPersonEntity.secondName}}</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == true && item.gun == false && item.otherPersonEntity!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" color="green" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,otherID = item.otherPersonEntity.id,memberLeg=0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Amunicja wydana</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == false && item.gun == true && item.otherPersonEntity!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" color="yellow" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,otherID = item.otherPersonEntity.id,memberLeg=0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń wydana</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == true && item.gun == true && item.otherPersonEntity!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" color="green" text-color="yellow" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,otherID = item.otherPersonEntity.id,memberLeg=0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń i Amunicja wydana</q-tooltip></q-btn></div>
                      </div>
                      <div v-if="item.otherPersonEntity == null" class="col" @dblclick="tournamentUUID = tournaments.uuid,memberName=null,otherName=null,memberUUID=item.member.uuid,otherID = '0',date=tournaments.date,name=item.member.secondName,memberLeg = item.member.legitimationNumber,startNumber=item.metricNumber,getScoreInfo(),metricsInfo=true">
                        <q-field dense standout="bg-accent text-black" stack-label>
                            <q-tooltip v-if="!item.member.active" content-class="bg-red text-subtitle2" anchor="top middle" >UREGULUJ SKŁADKI</q-tooltip>
                            <div class="q-pa-xs row full-width text-caption">
                            <div v-if="item.otherPersonEntity == null" class="col no-outline text-black" tabindex="0">{{item.member.secondName}} {{item.member.firstName}}</div>
                            <div v-if="item.otherPersonEntity == null" class="col-5 no-outline text-black" tabindex="0">{{item.member.club.name}}</div>
                            </div>
                        </q-field>
                      </div>
                      <div v-if="item.member == null" class="col" @dblclick="tournamentUUID = tournaments.uuid,memberName=null,otherName=null,memberUUID='0',otherID = item.otherPersonEntity.id,date=tournaments.date,name=item.otherPersonEntity.secondName,startNumber=item.metricNumber,getScoreInfo(),metricsInfo=true">
                      <q-field dense standout="bg-accent text-black" stack-label >
                          <div class="q-pa-xs row full-width text-caption">
                          <div v-if="item.member == null" class="col no-outline text-black" tabindex="0">{{item.otherPersonEntity.secondName}} {{item.otherPersonEntity.firstName}}</div>
                          <div v-if="item.member == null" class="col-5 no-outline text-black" tabindex="0">{{item.otherPersonEntity.club.name}}</div>
                          </div>
                      </q-field>
                      </div>
                      <div class="col-1" @dblclick="scoreUUID = item.uuid,toggleDSQDNF=true">
                        <q-field dense class="text-center" standout="bg-accent text-black" stack-label label="metryka">
                            <div class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.metricNumber}}</div>
                        </q-field>
                      </div>
                      <q-field dense v-if="competitionsList.disciplines==null" class="box col-1 cursor-pointer" standout="bg-accent text-black" label="trafienia" stack-label>
                        <q-popup-edit v-model="outerTen">
                          <q-input v-if="alfa == '' && charlie == '' && delta == ''" @focus="scoreUUID = item.uuid" input-class="text-center" v-model="outerTen" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="trafienia" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="alfa" stack-label label="Alfa" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="charlie" stack-label label="Charlie" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="delta" stack-label label="Delta" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <div class="q-pa-xs">
                            <q-btn color="primary" label="Anuluj" v-close-popup @click="outerTen='',alfa='',charlie='',delta=''"></q-btn>
                            <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = item.uuid, setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                          </div>
                        </q-popup-edit>
                        <div class="self-center full-width col no-outline text-center text-black" tabindex="0">{{item.outerTen}}</div>
                      </q-field>
                      <div v-if="competitionsList.disciplines!=null" class="row">
                      <q-field dense v-if="competitionsList.disciplines.includes('Pistolet')" class="box col cursor-pointer" standout="bg-accent text-black" label="p" stack-label>
                        <q-popup-edit v-model="outerTen">
                          <q-input v-if="alfa == '' && charlie == '' && delta == ''" @focus="scoreUUID = item.uuid" input-class="text-center" v-model="outerTen" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="trafienia" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="alfa" stack-label label="Alfa" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="charlie" stack-label label="Charlie" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="delta" stack-label label="Delta" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <div class="q-pa-xs">
                            <q-btn color="primary" label="Anuluj" v-close-popup @click="outerTen='',alfa='',charlie='',delta=''"></q-btn>
                            <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = item.uuid, setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                          </div>
                        </q-popup-edit>
                        <div class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.outerTen}}</div>
                      </q-field>
                      <q-field dense v-if="competitionsList.disciplines.includes('Karabin')" class="box col cursor-pointer" standout="bg-accent text-black" label="k" stack-label>
                        <q-popup-edit v-model="outerTen">
                          <q-input v-if="alfa == '' && charlie == '' && delta == ''" @focus="scoreUUID = item.uuid" input-class="text-center" v-model="outerTen" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="trafienia" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="alfa" stack-label label="Alfa" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="charlie" stack-label label="Charlie" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="delta" stack-label label="Delta" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <div class="q-pa-xs">
                            <q-btn color="primary" label="Anuluj" v-close-popup @click="outerTen='',alfa='',charlie='',delta=''"></q-btn>
                            <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = item.uuid, setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                          </div>
                        </q-popup-edit>
                        <div class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.outerTen}}</div>
                      </q-field>
                      <q-field dense v-if="competitionsList.disciplines.includes('Strzelba')" class="box col cursor-pointer" standout="bg-accent text-black" label="s" stack-label>
                        <q-popup-edit v-model="outerTen">
                          <q-input v-if="alfa == '' && charlie == '' && delta == ''" @focus="scoreUUID = item.uuid" input-class="text-center" v-model="outerTen" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="trafienia" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="alfa" stack-label label="Alfa" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="charlie" stack-label label="Charlie" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <q-input @focus="scoreUUID = item.uuid" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" input-class="text-center" v-model="delta" stack-label label="Delta" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                          <div class="q-pa-xs">
                            <q-btn color="primary" label="Anuluj" v-close-popup @click="outerTen='',alfa='',charlie='',delta=''"></q-btn>
                            <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = item.uuid, setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                          </div>
                        </q-popup-edit>
                        <div class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.outerTen}}</div>
                      </q-field>
                      </div>
                    <q-field dense class="box col-1 cursor-pointer" standout="bg-accent text-black" label="czas" stack-label>
                      <q-popup-edit v-model="innerTen">
                        <q-input @focus="scoreUUID = item.uuid" input-class="text-center" v-model="innerTen" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="czas" onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode 44 || event.charCode 46" />
                        <div class="q-pa-xs">
                          <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                          <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = item.uuid, setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                        </div>
                      </q-popup-edit>
                      <div class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.innerTen}}</div>
                    </q-field>
                    <q-field dense class="box col-1 cursor-pointer" standout="bg-accent text-black" label="procedury" stack-label>
                      <q-popup-edit v-model="procedures">
                        <q-input @focus="scoreUUID = item.uuid" input-class="text-center" v-model="procedures" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="procedury + 3 sek" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                        <div class="q-pa-xs row full-width">
                          <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                          <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = item.uuid, setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                        </div>
                      </q-popup-edit>
                      <div class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.procedures}}</div>
                    </q-field>
                    <q-field dense class="col-1" standout="bg-accent text-black" label="HF" stack-label>
                      <q-tooltip v-if="item.alfa>0||item.charlie>0||item.delta>0" anchor="top middle" self="bottom middle" :offset="[12, 12]">
                        <div v-if="item.alfa>0">alfa: {{item.alfa}}</div>
                        <div v-if="item.charlie>0">charlie: {{item.charlie}}</div>
                        <div v-if="item.delta>0">delta: {{item.delta}}</div>
                      </q-tooltip>
                        <div class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.hf}} </div>
                    </q-field>
                    <div class="col-1">
                    <q-field dense standout="bg-accent text-black" label="Wynik" clickable stack-label >
                      <q-popup-edit v-model="scoreLabel">
                        <q-input @focus="scoreUUID = item.uuid" input-class="text-center" v-model="scoreLabel" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="Wynik" onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode 44 || event.charCode 46"/>
                        <div class="q-pa-xs">
                          <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                          <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = item.uuid, forceSetScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                        </div>
                      </q-popup-edit>
                      <div v-if="item.dnf||item.dsq||item.pk" class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">
                          <div v-if="item.dnf">DNF</div>
                          <div v-if="item.dsq">DSQ</div>
                          <div v-if="item.pk">PK</div>
                      </div>
                      <div v-else class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.score}}</div>
                    </q-field>
                    </div>
                    </div>
                    <div dense v-else class="row text-body2">
                      <div class="col-1">
                      <div class="row" v-if="item.ammunition == false && item.gun == false && item.member!=null" ><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,memberLeg = item.member.legitimationNumber,otherID = 0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Wydaj broń lub amunicję {{item.member.secondName}}</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == true && item.gun == false && item.member!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" color="green" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,memberLeg = item.member.legitimationNumber,otherID = 0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Amunicja wydana</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == false && item.gun == true && item.member!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" color="yellow" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,memberLeg = item.member.legitimationNumber,otherID = 0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń wydana</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == true && item.gun == true && item.member!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense glossy class="col" color="green" text-color="yellow" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,memberLeg = item.member.legitimationNumber,otherID = 0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń i Amunicja wydana</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == false && item.gun == false && item.otherPersonEntity!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,otherID = item.otherPersonEntity.id,memberLeg=0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Wydaj broń lub amunicję {{item.otherPersonEntity.secondName}}</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == true && item.gun == false && item.otherPersonEntity!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" color="green" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,otherID = item.otherPersonEntity.id,memberLeg=0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Amunicja wydana</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == false && item.gun == true && item.otherPersonEntity!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" color="yellow" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,otherID = item.otherPersonEntity.id,memberLeg=0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń wydana</q-tooltip></q-btn></div>
                      <div class="row" v-if="item.ammunition == true && item.gun == true && item.otherPersonEntity!=null"><div class="col-5 self-center">{{index+1}}.</div><q-btn dense class="col" color="green" text-color="yellow" style="text-8" icon="book" @click="tournamentUUID = tournaments.uuid,compName=competitionsList.name,scoreUUID = item.uuid,otherID = item.otherPersonEntity.id,memberLeg=0,getScoreUUID(competitionsList.name), getListCalibers(),caliberUUID = competitionsList.caliberUUID,ammoQuantity = competitionsList.practiceShots + competitionsList.numberOfShots,addAmmo=true" ><q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń i Amunicja wydana</q-tooltip></q-btn></div>
                      </div>
                      <div class="col" v-if="item.otherPersonEntity == null" @dblclick="tournamentUUID = tournaments.uuid,memberName=null,otherName=null,memberUUID=item.member.uuid,memberLeg = item.member.legitimationNumber,otherID = '0',date=tournaments.date,name=item.member.secondName + ' ' + item.member.firstName,startNumber=item.metricNumber,getScoreInfo(),metricsInfo=true">
                        <q-field dense standout="bg-accent text-black" stack-label>
                            <q-tooltip v-if="!item.member.active" content-class="bg-red text-subtitle2" anchor="top middle" >UREGULUJ SKŁADKI</q-tooltip>
                            <div class="q-pa-xs row full-width text-caption">
                              <div v-if="item.otherPersonEntity == null" class="col no-outline text-black" tabindex="0">{{item.member.secondName}} {{item.member.firstName}} </div>
                              <div v-if="item.otherPersonEntity == null" class="col-5 no-outline text-black" tabindex="0">{{item.member.club.name}}</div>
                            </div>
                        </q-field>
                      </div>
                    <div class="col" v-if="item.member == null" @dblclick="tournamentUUID = tournaments.uuid,memberName=null,otherName=null,memberUUID='0',otherID = item.otherPersonEntity.id,date=tournaments.date,name=item.otherPersonEntity.secondName + ' ' + item.otherPersonEntity.firstName,startNumber=item.metricNumber,getScoreInfo(),metricsInfo=true">
                    <q-field dense standout="bg-accent text-black" stack-label >
                        <div class="q-pa-xs row full-width text-caption">
                        <div v-if="item.member == null" class="col no-outline text-black" tabindex="0">{{item.otherPersonEntity.secondName}} {{item.otherPersonEntity.firstName}}  </div>
                        <div v-if="item.member == null" class="col-5 no-outline text-black" tabindex="0"> {{item.otherPersonEntity.club.name}}</div>
                        </div>
                    </q-field>
                    </div>
                    <div dense class="col-1" @dblclick="scoreUUID = item.uuid,metric = item.metricNumber,toggleDSQDNF=true">
                        <q-field dense class="text-center" standout="bg-accent text-black" stack-label label="metryka">
                            <div class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.metricNumber}}</div>
                        </q-field>
                      </div>
                      <q-field dense class="box col-2 cursor-pointer" standout="bg-accent text-black" label="10 ogólnie" stack-label>
                          <q-popup-edit v-model="outerTen">
                              <q-input @focus="scoreUUID = item.uuid" input-class="text-center" v-model="outerTen" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="ilość 10 ogólnie" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
                              <div class="q-pa-xs">
                                <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                                <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = item.uuid, setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                              </div>
                            </q-popup-edit>
                            <div class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.outerTen}}</div>
                      </q-field>
                    <q-field dense class="box col-2 cursor-pointer" standout="bg-accent text-black" label="10 wewnętrzne" stack-label>
                        <q-popup-edit v-model="innerTen">
                              <q-input @focus="scoreUUID = item.uuid" input-class="text-center" v-model="innerTen" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="ilość 10 wewnętrznych" onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                              <div class="q-pa-xs">
                                <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                                <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = item.uuid, setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                              </div>
                            </q-popup-edit>
                        <div class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.innerTen}}</div>
                    </q-field>
                    <q-field dense class="box col-1 cursor-pointer" standout="bg-accent text-black" label="Wynik" stack-label>
                        <q-popup-edit v-model="scoreLabel">
                          <q-input @focus="scoreUUID = item.uuid" input-class="text-center" v-model="scoreLabel" @keypress.enter="scoreUUID = item.uuid, onEnter(scoreUUID)" dense autofocus stack-label label="Wynik" onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode 44 || event.charCode 46"/>
                            <div class="q-pa-xs">
                              <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                              <q-btn color="primary" label="Zapisz" v-close-popup @click="scoreUUID = item.uuid, setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                            </div>
                        </q-popup-edit>
                        <div v-if="item.dnf||item.dsq||item.pk" class="self-center full-width col no-outline text-center text-black" tabindex="0">
                          <div v-if="item.dnf">DNF</div>
                          <div v-if="item.dsq">DSQ</div>
                          <div v-if="item.pk">PK</div>
                          </div>
                        <div v-else class="self-center full-width col no-outline text-center text-black text-caption" tabindex="0">{{item.score}}</div>
                    </q-field>
                    </div>
                      </div>
                    </template>
                  </q-virtual-scroll>
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
        <q-virtual-scroll :items="tournamentsClosed" style="height: 600px;">
          <template v-slot="{ item, index }">
            <q-item :key="index" dense class="col">
              <q-btn class="col" :label="item.date" @click="tournamentClosedName=item.name,tournamentUUID = item.tournamentUUID,name= item.name,date = item.date,closedTournamentInfo=true,getStatistics ()"></q-btn>
            </q-item>
            <p></p>
          </template>
        </q-virtual-scroll>
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
              <q-checkbox v-model="dynamic" label="konkurencja dynamiczna"></q-checkbox>
              <div v-if="!dynamic">
                <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Pistolet'" label="Pistolet"></q-radio>
                <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Karabin'" label="Karabin"></q-radio>
                <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '', meters = false, choice = '' " v-model="choice1" :val="'Strzelba'" label="Strzelba"></q-radio>
              </div>
              <div v-else>
                <q-checkbox class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="dynamicChoice" :val="'Pistolet'" label="Pistolet"></q-checkbox>
                <q-checkbox class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="dynamicChoice" :val="'Karabin'" label="Karabin"></q-checkbox>
                <q-checkbox class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '', meters = false, choice = '' " v-model="dynamicChoice" :val="'Strzelba'" label="Strzelba"></q-checkbox>
              </div>
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
              <q-checkbox class="row" color="orange" @input="choice10 = []" v-model="quantity" :val="false" label="inne"></q-checkbox>
              <q-item class="row"><q-input @focus="choice10 = []" onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width bg-grey-4 center justify" filled v-if="quantity" style="width: 100px" v-model="choice10" stack-label label="Ilość strzałów" ></q-input></q-item>
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
            <div class="row bg-grey-7">
              <q-item dense class="row justify-arou">Kaliber : </q-item>
              <q-radio dense class="row justify-around q-pl-md" v-model="choice13" v-for="(calibers,uuid) in calibers" :key="uuid" :val="calibers.uuid" :label="calibers.name">
              </q-radio>
            </div>
            <div class="row bg-grey-8">
              <q-item class="items-center">Ilość Strzałów próbnych : </q-item>
                <q-input onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify" filled v-model="choice14" stack-label ></q-input>
            </div>
            <div class="row"><q-label class="text-h6">Nazwa konkurencji : </q-label>
              <q-label v-if="choice" class="text-h6"> {{choice + 'm'}} {{' ' + choice1}} {{' ' + choice2}} {{' ' + choice3}} {{' ' + choice4}} {{' ' + choice5}} {{' ' + choice6}} {{' ' + choice7}} {{' ' + choice8}} {{' ' + choice9}} {{' ' + choice10 }} {{' ' + choice11}}</q-label>
              <q-label v-else class="text-h6"> {{choice}} {{' ' + choice1}} {{' ' + choice2}} {{' ' + choice3}} {{' ' + choice4}} {{' ' + choice5}} {{' ' + choice6}} {{' ' + choice7}} {{' ' + choice8}} {{' ' + choice9}} {{' ' + choice10 }} {{' ' + choice11}}</q-label>
            </div>
          </q-item-section>
          <q-item-section v-if="notUsed">
              <q-item><q-label class="text-h6 text-bold text-justify">Można nadać własną nazwę zawodów bez używania kreatora</q-label></q-item>
            <div class="row bg-grey-2">
              <q-checkbox v-model="dynamic" @input="choice12 = 'COMSTOCK'" label="konkurencja dynamiczna"></q-checkbox>
              <div v-if="!dynamic">
                <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Pistolet'" label="Pistolet"></q-radio>
                <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="choice1" :val="'Karabin'" label="Karabin"></q-radio>
                <q-radio class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '', meters = false, choice = '' " v-model="choice1" :val="'Strzelba'" label="Strzelba"></q-radio>
              </div>
              <div v-else>
                <q-checkbox class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="dynamicChoice" :val="'Pistolet'" label="Pistolet"></q-checkbox>
                <q-checkbox class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '' " v-model="dynamicChoice" :val="'Karabin'" label="Karabin"></q-checkbox>
                <q-checkbox class="col" color="orange" @input="choice2 = '', choice3 = '', choice4 = '', choice5 = '', choice6 = '', choice7 = '', choice8 = '', choice9 = '', meters = false, choice = '' " v-model="dynamicChoice" :val="'Strzelba'" label="Strzelba"></q-checkbox>
              </div>
                <q-input v-if="!dynamic" @focus="choice10 = []" onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify" filled style="width: 100px" v-model="choice10" stack-label label="Ilość strzałów pistolet" ></q-input>
              <div v-if="dynamic" class="row">
                <q-input v-if="dynamicChoice.includes('Pistolet')" onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify" filled v-model="dynamicChoice1" stack-label label="Ilość strzałów pistolet" ></q-input>
                <q-input v-if="dynamicChoice.includes('Karabin')" onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify" filled v-model="dynamicChoice2" stack-label label="Ilość strzałów karabin" ></q-input>
                <q-input v-if="dynamicChoice.includes('Strzelba')" onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify" filled v-model="dynamicChoice3" stack-label label="Ilość strzałów strzelba" ></q-input>
              {{dynamicChoice1}}
              {{dynamicChoice2}}
              {{dynamicChoice3}}
              </div>
            </div>
              <div class="row">
                <q-item class="items-center">Metoda Liczenia : </q-item>
                <q-radio v-if="!dynamic" class="col" color="black" v-model="choice12" :val="'NORMAL'" label="Normalnie"></q-radio>
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
    <q-dialog v-model="addArbitersConfirmbtn">
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
    <q-dialog :position="'top'" v-model="addOtherAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zapisano do bazy</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="removeArbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Usunięto sędziego z listy</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="addArbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Sędziego</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="addCompetitionAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano konkurencję do zawodów</div>
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
          <div class="text-h6">{{message}}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="toggleDSQDNF">
      <q-card>
        <q-card-section>
          <div>
            <div class="text-h5 text-bold text-center">Kary dla zawodnika z numerem {{metric}}</div>
          </div>
          <div class="col q-pa-md">
            <q-btn color="primary" class="full-width q-pa-md" @click="toggleDnfScore()">przyznaj DNF</q-btn>
            <p></p>
            <q-btn color="primary" class="full-width q-pa-md" @click="toggleDsqScore()">przyznaj DSQ</q-btn>
            <p></p>
            <q-btn color="primary" class="full-width q-pa-md" @click="togglePkScore()">przyznaj PK</q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Anuluj" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="memberFailure">
          <q-card>
            <q-card-section>
              <div class="text-h6">Nie można dodać Zawodnika bo już znajduje się w konkurencji.</div>
            </q-card-section>

          </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="arbiterFailure">
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
                      <q-input @keypress.enter="addAmmoConfirm = true" type="number" filled class="full-width col" onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="ammoQuantity" label='"Ilość Amunicji wraz z próbnymi"'></q-input>
                      <div align="right">
                      <q-btn v-if="caliberUUID==null||ammoQuantity==null||ammoQuantity==''" class="col full-width" color="grey-5" >
                        <div>
                          <div v-if="caliberUUID==null">wybierz kaliber </div>
                          <div v-if="ammoQuantity==null||ammoQuantity==''">wprowadź ilość</div>
                        </div>
                      </q-btn>
                      <q-btn v-if="caliberUUID!==null&&ammoQuantity!=null&&ammoQuantity!=''" class="col full-width" color="primary" label="wydaj amunicję" @click="addAmmoConfirm = true"></q-btn>
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
    <q-dialog :position="'top'" v-model="gunAdded" persistent @keypress.enter="gunAdded=false">
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
              <q-btn flat label="Wydaj" color="primary" v-close-popup @click="addMemberAndAmmoToCaliber(),addAmmoConfirm=false,ammoQuantity=null,addAmmo=false" />
            </q-card-actions>
          </q-card>
    </q-dialog>
    <q-dialog v-model="deleteTournamentAlert" persistent>
          <q-card class="bg-red-5 text-center">
            <q-card-section class="flex-center">
              <h3><span class="q-ml-sm text-bold">UWAGA - Zmiana będzie nieodwracalna</span></h3>
              <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
              <div><q-input @keypress.enter="deleteTournament(),deleteTournamentAlert=false" autofocus type="password" v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input></div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn label="anuluj" color="black" v-close-popup @click="code=null"/>
              <q-btn id="3" label="otwórz" color="black" v-close-popup @click="deleteTournament()" />
            </q-card-actions>
          </q-card>
    </q-dialog>
    <q-dialog v-model="statistics">
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
    <q-dialog v-model="competitionsInfo">
      <q-card>
        <q-card-section>
        <div v-for="(item,id) in options2" :key="id">
          <div>
            <q-checkbox v-model="listOfCompetitions" :val="item" :label="item"></q-checkbox>
          </div>
        </div>
        <div class="row q-pa-md">
            <q-btn class="col full-width" color="red" label="Usuń z listy" @click="removeMemberFromCompetition(),finder = null"></q-btn>
            <q-btn class="col full-width" label="Dodaj do listy" @click="addMemberToCompetition(), (finder = null)"></q-btn>
        </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="metricsInfo">
          <q-card >
            <q-card-section class="col">
              <div class="q-ml-sm text-h6 text-center text-bold">POBIERZ METRYKI STARTOWE ZAWODNIKA</div>
              <div class="q-ml-sm text-h6 text-center text-bold">{{name}}</div>
              <ol class="col">
                <li class="row" v-for="info in infoScore" :key="info">
                  <q-checkbox color="secondary" class="col" v-model="compList" :val="info" :label="info"/>
                  <div><q-btn class="col-3" color="primary" label="Wydaj amunicję" @click="compName=info,getListCalibers(),getScoreUUID(info),addAmmo=true"/></div>
                </li></ol>
              <div class="row q-pa-xs">
                <q-btn @click="getMemberMetrics(compList),info=[],compList=[]" class="col q-pa-xs" color="secondary">wydrukuj wybrane metryki zawodnika</q-btn>
                <q-item></q-item>
                <q-btn @click="getMemberMetrics(infoScore),info=[],compList=[]" class="col q-pa-xs" color="primary">wydrukuj wszystkie metryki zawodnika</q-btn>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn @click="compName='',compList=[]" label="zamknij" color="primary" v-close-popup />
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
              <!-- <div><q-item><q-btn @click="getAnnouncementFromCompetition()" class="full-width" color="primary">pobierz komunikat</q-btn></q-item></div> -->
              <div>
                <q-item>
                  <q-btn-dropdown align="center" class="full-width" label="pobierz komunikat" color="primary">
                    <q-list>
                      <q-item v-close-popup class="q-pa-none">
                        <q-item-section>
                          <q-btn @click="getAnnouncementFromCompetition()" class="full-width bg-red-6" label="pobierz plik .pdf" color="secondary"></q-btn>
                        </q-item-section>
                      </q-item>
                      <q-item v-close-popup class="q-pa-none">
                        <q-item-section>
                          <q-btn @click="getAnnouncementFromCompetitionXLSX()" class="full-width bg-green-6" label="pobierz plik .xslx" color="secondary"></q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </q-item>
              </div>
              <div><q-item><q-btn @click="getJudgeFromTournament ()" class="full-width" color="primary">pobierz listę sędziów</q-btn></q-item></div>
              <div v-if="tournaments==null"><q-item><q-btn @click="openList=true" class="full-width" color="primary">otwórz zawody</q-btn></q-item></div>
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
    <q-dialog :position="'top'" v-model="forbidden">
          <q-card class="bg-warning">
            <q-card-section>
              <div class="text-h6">Niewłaściwy kod. Spróbuj ponownie.</div>
            </q-card-section>
          </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="listDownload">
      <q-card>
        <q-card-section class="col">
        <div class="self-center col full-width no-outline text-center text-h5 text-bold">Pobrano</div>
      </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
          <q-card>
            <q-card-section>
              <div v-if="message!=null" class="text-h6">{{message}}</div>
            </q-card-section>

          </q-card>
    </q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">
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
      competitionsInfo: false,
      listOfCompetitions: [],
      uuid: null,
      valUUID: null,
      code: null,
      barcode: null,
      openList: false,
      listDownload: false,
      forbidden: false,
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
      addOtherAlert: false,
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
      arbiterFailure: false,
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
      tournaments: null,
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
      singleScore: null,
      options: stringOptions,
      finder: '',
      mainArbiter: null,
      countArbiter: null,
      otherArbiter: null,
      otherRTSArbiter: null,
      competitionAddToTournamentList: [],
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
      alfa: '',
      charlie: '',
      delta: '',
      procedures: null,
      meters: false,
      quantity: false,
      notUsed: false,
      state: null,
      metric: null,
      addAmmo: false,
      addAmmoConfirm: false,
      ammoQuantity: null,
      memberLeg: null,
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
      message: null,
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
      this.setScore(scoreUUID, this.scoreLabel, this.innerTen, this.outerTen, this.alfa, this.charlie, this.delta, this.procedures)
    },
    getListTournaments () {
      this.getMembersNames()
      this.getMembersNameswithPermissions()
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
    getMemberUUIDFromLegitimationNuber () {
      const memberNameWord = this.memberName.split(' ')
      const legNumber = memberNameWord.length
      const memberlegNumber = memberNameWord[legNumber - 1]
      fetch('http://' + this.local + '/member/ID/' + memberlegNumber, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          if (response.length > 0) {
            this.memberUUID = response
            this.memberLeg = memberlegNumber
          } else {
            this.message = response
            this.failure = true
            this.autoClose()
          }
        })
    },
    getScoreInfoByLegitimation () {
      if (this.memberName === null || this.otherName === null) {
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
              this.memberLeg = memberlegNumber
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
      if (this.memberName === null || this.otherName === null) {
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
              this.memberLeg = memberlegNumber
              this.otherID = otherNameID
            } else {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          })
      }
    },
    getScoreUUID (compName) {
      let memberlegNumber
      let otherNameID
      if (this.memberName !== null || this.otherName !== null) {
        const memberNameWord = this.memberName.split(' ')
        const legNumber = memberNameWord.length
        memberlegNumber = memberNameWord[legNumber - 1]
        const otherNameWord = this.otherName.split(' ')
        const idNumber = otherNameWord.length
        otherNameID = otherNameWord[idNumber - 1]
      } else {
        memberlegNumber = this.memberLeg
        otherNameID = this.otherID
      }
      fetch('http://' + this.local + '/competitionMembersList/getScoreIdByNumberAndCompetitionName?tournamentUUID=' + this.tournamentUUID + '&legNumber=' + memberlegNumber + '&otherID=' + otherNameID + '&competitionName=' + compName, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.singleScore = response
          this.scoreUUID = response.uuid
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
    getGunInTournament () {
      fetch('http://' + this.local + '/tournament/getGunInTournament?tournamentUUID=' + this.tournamentUUID, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunsUsed = response
        })
    },
    addMemberAndAmmoToCaliber () {
      const quantity = this.ammoQuantity
      fetch('http://' + this.local + '/ammoEvidence/ammo?caliberUUID=' + this.caliberUUID + '&legitimationNumber=' + this.memberLeg + '&counter=' + this.ammoQuantity + '&otherID=' + this.otherID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          if (this.singleScore !== null) {
            if (this.singleScore.ammunition && quantity < 0) {
              this.toggleAmmunitionInScore(this.scoreUUID)
            }
            if (!this.singleScore.ammunition && quantity > 0) {
              this.toggleAmmunitionInScore(this.scoreUUID)
            }
          } else {
            this.toggleAmmunitionInScore(this.scoreUUID)
          }
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      }
      )
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
    addCompetitonToTournament () {
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
    setScore (scoreUUID, score, innerTen, outerTen, alfa, charlie, delta, procedures) {
      if (innerTen === null) {
        innerTen = '-1'
      }
      if (outerTen === null) {
        outerTen = '-1'
      }
      if (alfa === '') {
        alfa = '-1'
      }
      if (charlie === '') {
        charlie = '-1'
      }
      if (delta === '') {
        delta = '-1'
      }
      if (score === null) {
        score = '-1'
      }
      if (procedures === null) {
        procedures = '-1'
      }
      fetch('http://' + this.local + '/competition/score/set?scoreUUID=' + scoreUUID + '&score=' + parseFloat(score.replace(/,/gi, '.')) + '&innerTen=' + parseFloat(innerTen.replace(/,/gi, '.')) + '&outerTen=' + parseFloat(outerTen.replace(/,/gi, '.')) + '&alfa=' + parseFloat(alfa.replace(/,/gi, '.')) + '&charlie=' + parseFloat(charlie.replace(/,/gi, '.')) + '&delta=' + parseFloat(delta.replace(/,/gi, '.')) + '&procedures=' + procedures, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.showloading()
              this.scoreLabel = null
              this.innerTen = null
              this.outerTen = null
              this.procedures = null
              this.alfa = ''
              this.charlie = ''
              this.delta = ''
              this.message = response
              this.success = true
              this.getListTournaments()
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
    forceSetScore (scoreUUID, score, innerTen, outerTen, alfa, charlie, delta, procedures) {
      if (innerTen === null) {
        innerTen = '-1'
      }
      if (outerTen === null) {
        outerTen = '-1'
      }
      if (alfa === '') {
        alfa = '-1'
      }
      if (charlie === '') {
        charlie = '-1'
      }
      if (delta === '') {
        delta = '-1'
      }
      if (score === null) {
        score = '-1'
      }
      if (procedures === null) {
        procedures = '-1'
      }
      fetch('http://' + this.local + '/competition/score/forceSetScore?scoreUUID=' + scoreUUID + '&score=' + parseFloat(score.replace(/,/gi, '.')), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.showloading()
              this.scoreLabel = null
              this.innerTen = null
              this.outerTen = null
              this.procedures = null
              this.alfa = ''
              this.charlie = ''
              this.delta = ''
              this.message = response
              this.success = true
              this.getListTournaments()
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
    toggleAmmunitionInScore (scoreUUID) {
      fetch('http://' + this.local + '/competition/score/ammo?scoreUUID=' + scoreUUID, {
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
              this.getListTournaments()
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
    toggleGunInScore () {
      fetch('http://' + this.local + '/competition/score/gun?scoreUUID=' + this.scoreUUID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              console.log(response)
              this.message = response
              this.success = true
              this.getListTournaments()
              this.autoClose()
              this.showloading()
            }
          )
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
              this.showloading()
            }
          )
        }
      })
    },
    toggleDnfScore () {
      fetch('http://' + this.local + '/competition/score/dnf?scoreUUID=' + this.scoreUUID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
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
    toggleDsqScore () {
      fetch('http://' + this.local + '/competition/score/dsq?scoreUUID=' + this.scoreUUID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
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
    togglePkScore () {
      fetch('http://' + this.local + '/competition/score/pk?scoreUUID=' + this.scoreUUID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
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
              this.getCLosedTournaments()
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
      const legNumber = otherArbiterWord.length
      const otherArbiterUUID = otherArbiterWord[legNumber - 1]
      const otherPersonArbiterWord = this.otherArbitersList.split(' ')
      const personLegNumber = otherPersonArbiterWord.length
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
      const legNumber = otherArbiterWord.length
      const otherArbiterUUID = otherArbiterWord[legNumber - 1]
      const otherPersonArbiterWord = this.otherRTSArbitersList.split(' ')
      const personLegNumber = otherPersonArbiterWord.length
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
      const legNumber = mainArbiterWord.length
      const mainArbiterUUID = mainArbiterWord[legNumber - 1]
      const mainOtherArbiterWord = this.otherMainArbiterName.split(' ')
      const otherLegNumber = mainOtherArbiterWord.length
      const mainOtherArbiterID = mainOtherArbiterWord[otherLegNumber - 1]
      fetch('http://' + this.local + '/tournament/addMainArbiter/' + this.tournamentUUID + '?number=' + mainArbiterUUID + '&id=' + mainOtherArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.mainArbiter = null
              this.otherMainArbiterName = null
              this.showloading()
              this.getListTournaments()
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
    addRTSArbiterToTournament () {
      const countArbiterWord = this.countArbiter.split(' ')
      const legNumber = countArbiterWord.length
      const countArbiterUUID = countArbiterWord[legNumber - 1]
      const countOtherArbiterWord = this.otherRTSArbiterName.split(' ')
      const otherLegNumber = countOtherArbiterWord.length
      const countOtherArbiterID = countOtherArbiterWord[otherLegNumber - 1]
      fetch('http://' + this.local + '/tournament/addRTSArbiter/' + this.tournamentUUID + '?number=' + countArbiterUUID + '&id=' + countOtherArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.countArbiter = null
              this.otherRTSArbiterName = null
              this.showloading()
              this.getListTournaments()
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
    addOtherArbiterToTournament () {
      const otherArbiterWord = this.otherArbiter.split(' ')
      const legNumber = otherArbiterWord.length
      const otherArbiterUUID = otherArbiterWord[legNumber - 1]
      const otherPersonArbiterWord = this.otherArbitersList.split(' ')
      const personLegNumber = otherPersonArbiterWord.length
      const otherPersonArbiterID = otherPersonArbiterWord[personLegNumber - 1]
      fetch('http://' + this.local + '/tournament/addOthersArbiters/' + this.tournamentUUID + '?number=' + otherArbiterUUID + '&id=' + otherPersonArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.otherArbiter = null
              this.otherArbitersList = null
              this.showloading()
              this.getListTournaments()
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
    addOtherRTSArbiterToTournament () {
      const otherArbiterWord = this.otherRTSArbiter.split(' ')
      const legNumber = otherArbiterWord.length
      const otherArbiterUUID = otherArbiterWord[legNumber - 1]
      const otherPersonArbiterWord = this.otherRTSArbitersList.split(' ')
      const personLegNumber = otherPersonArbiterWord.length
      const otherPersonArbiterID = otherPersonArbiterWord[personLegNumber - 1]
      fetch('http://' + this.local + '/tournament/addOthersRTSArbiters/' + this.tournamentUUID + '?number=' + otherArbiterUUID + '&id=' + otherPersonArbiterID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.otherArbiter = null
              this.otherArbitersList = null
              this.otherRTSArbitersList = null
              this.showloading()
              this.getListTournaments()
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
        url: 'http://' + this.local + '/files/downloadMetric/' + this.tournamentUUID + '?otherID=' + this.otherID + '&memberUUID=' + this.memberUUID + '&competitions=' + info + '&startNumber=' + this.startNumber,
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
    getRankingCompetitions () {
      axios({
        url: 'http://' + this.local + '/files/downloadRanking',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
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
    autoClose () {
      setTimeout(() => {
        this.tournamentAlert = false
        this.tournamentCloseAlert = false
        this.addOtherAlert = false
        this.addArbiterAlert = false
        this.addCompetitionAlert = false
        this.newCompetitionAlert = false
        this.memberFailure = false
        this.failure = false
        this.arbiterFailure = false
        this.gunAdded = false
        this.arbiterFailure = false
        this.tournamentUpdated = false
        this.forbidden = false
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
