<template>
  <q-page>
    <div class="full-width row reverse">
      <q-btn v-if="!mobile && ClosedCompetitionTabEXP" dense color="primary" class="q-pa-none q-ma-none brand" :icon="icon"
          @click="toggleShowClosedCompetitions=!toggleShowClosedCompetitions;toggleShowClosedCompetitions?getClosedTournaments(pageNumber):''"
          @mousemove="!toggleShowClosedCompetitions?icon='arrow_left':icon='arrow_right'"
          @mouseleave="icon='menu'">
        <q-tooltip content-class="bg-secondary text-h6" content-style="opacity: 93%;">{{toggleShowClosedCompetitions?'Ukryj':'Pokaż'}} zamknięte zawody</q-tooltip></q-btn>
    </div>
    <div class="row">
      <q-card class="col bg-dark text-positive">
        <div class="row">
          <q-card-section v-if="tournaments == null">
            <q-btn color="primary" label="dodaj zawody" @click="addNewTournament = true"/>
          </q-card-section>
          <!-- <q-card-section>
            <q-btn color="secondary" label="Kreator konkurencji" @click="getCountingMethods ();createNewCompetiton = true"/>
          </q-card-section> -->
          <CompetitonCreator v-on:createCompetition="getCompetitions" class="q-pa-md"></CompetitonCreator>
        </div>
        <div v-if="tournaments == null" class="text-center text-h6 text-positive full-width">{{resp}}</div>
        <div v-if="tournaments != null" class="row text-h6">
          <div class="col-6">
            <q-item-section class="col q-pa-md">
              <div class="col">
                <q-item-label>{{ tournaments.name }} {{ tournaments.date }}</q-item-label>
                <q-item-label caption lines="2" class="text-positive">zawody{{ !tournaments.wzss?' nie':'' }} wpisane do
                  kalendarza Wojewódzkiego Związku Strzelectwa Sportowego
                </q-item-label>
              </div>
            </q-item-section>
          </div>
          <div class="col-3">
            <q-item>
              <q-btn-dropdown @click="tournamentUUID = tournaments.uuid; date = tournaments.date; name = tournaments.name"
                align="center" content-class="bg-dark" class="full-width ghover1" label="pobierz komunikat" color="primary">
                <q-list>
                      <q-btn v-close-popup @click="getAnnouncementFromCompetition()" rounded dense class="full-width bg-red-6 q-ma-xs"
                        label="pobierz plik .pdf" color="secondary"/>
                      <q-btn v-close-popup @click="getAnnouncementFromCompetitionXLSX()" rounded dense class="full-width bg-green-6 q-ma-xs"
                        label="pobierz plik .xslx" color="secondary"/>
                </q-list>
              </q-btn-dropdown>
            </q-item>
            <q-item>
              <q-btn color="primary" class="full-width ghover1" label="pobierz listę Sędziów"
                @click="getJudgeFromTournament(tournaments.uuid,tournaments.name,tournaments.date)"/>
            </q-item>
            <q-item>
              <q-btn color="white" class="text-black full-width ghover1" v-if="tournaments.open" label="dodaj sędziów"
                @click="tournamentUUID = tournaments.uuid;getArbiters();getOtherArbiters();addArbitersConfirmbtn = true"/>
            </q-item>
            <q-item v-if="tournaments.open">
              <q-btn color="white" class="text-black full-width ghover1" label="dodaj konkurencje"
                @click="tournamentUUID = tournaments.uuid; addCompetitionConfirmbtn = true"/>
            </q-item>
            <q-dialog v-model="addCompetitionConfirmbtn">
              <q-card class="text-center bg-dark text-positive" style="min-width: 50vw;height: 75vh">
                <q-checkbox v-model="check.pistol" :val=check.pistol :value=true label="Pistolet"></q-checkbox>
                <q-checkbox v-model="check.rifle" :val=check.rifle :value=true label="Karabin"></q-checkbox>
                <q-checkbox v-model="check.shotgun" :val=check.shotgun :value=true label="Strzelba"></q-checkbox>
                <q-checkbox v-model="check.other" :val=check.other :value=true label="Pozostałe"></q-checkbox>
                <div v-if="check.pistol" class="text-center text-bold text-h5">Pistolet</div>
                <div v-for="(item, uuid) in competitions.filter(f=>f.discipline==='Pistolet' && check.pistol)" :key="uuid" class="col">
                  <div class="text-left" style="padding-left: 25%" :class="backgroundDark ? 'bg-dark text-positive' : 'bg-grey-2'">
                    <q-checkbox class="hover1" dense :val="item.uuid" v-model="competitionAddToTournamentList" :label="(item.name) + ' ' +
                      (item.countingMethod === 'NORMAL' ? '' : '(' + item.countingMethod + ')')"/>
                  </div>
                </div>
                <div v-if="check.rifle" class="text-center text-bold text-h5">Karabin</div>
                <div v-for="(item, uuid) in competitions.filter(f=>f.discipline==='Karabin' && check.rifle)" :key="uuid" class="col">
                  <div class="text-left" style="padding-left: 25%" :class="backgroundDark ? 'bg-dark text-positive' : 'bg-grey-3'">
                    <q-checkbox class="hover1" dense :val="item.uuid" v-model="competitionAddToTournamentList" :label="(item.name) + ' ' +
                      (item.countingMethod === 'NORMAL' ? '' : '(' + item.countingMethod + ')')"/>
                  </div>
                </div>
                <div v-if="check.shotgun" class="text-center text-bold text-h5">Strzelba</div>
                <div v-for="(item, uuid) in competitions.filter(f=>f.discipline==='Strzelba' && check.shotgun)" :key="uuid" class="col">
                  <div class="text-left" style="padding-left: 25%" :class="backgroundDark ? 'bg-dark text-positive' : 'bg-grey-4'">
                    <q-checkbox class="hover1" dense :val="item.uuid" v-model="competitionAddToTournamentList" :label="(item.name) + ' ' +
                      (item.countingMethod === 'NORMAL' ? '' : '(' + item.countingMethod + ')')"/>
                  </div>
                </div>
                <div v-if="check.other" class="text-center text-bold text-h5">Pozostałe</div>
                <div v-for="(item, uuid) in competitions.filter(f=>f.discipline==null && check.other)" :key="uuid" class="col">
                  <div class="text-left" style="padding-left: 25%" :class="backgroundDark ? 'bg-dark text-positive' : 'bg-grey-5'">
                    <q-checkbox class="hover1" dense :val="item.uuid" v-model="competitionAddToTournamentList" :label="(item.name) + ' ' +
                      (item.countingMethod === 'NORMAL' ? '' : '(' + item.countingMethod + ')')"/>
                  </div>
                </div>
                <q-card-actions align="right">
                  <q-item>
                    <q-btn label="Dodaj konkurencje" color="secondary" @click="addCompetitionConfirm = true" />
                  </q-item>
                  <q-btn label="zamknij" color="primary" v-close-popup @click="competitionAddToTournamentList = []" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <div class="col-3">
            <q-item>
              <q-btn class="full-width ghover1" color="primary" label="Aktualizuj"
                @click="tournamentUUID = tournaments.uuid; tournamentUpdateConfirm = true" />
            </q-item>
            <q-item>
              <q-btn class="full-width ghover1" color="primary" label="Statystyki"
                @click="tournamentUUID = tournaments.uuid; getStatistics(); statistics = true" />
            </q-item>
            <q-item
              v-if="(tournaments.mainArbiter != null || tournaments.otherMainArbiter != null) && (tournaments.commissionRTSArbiter != null || tournaments.otherCommissionRTSArbiter != null)">
              <q-btn class="full-width ghover1" color="secondary" label="Zamknij zawody"
                @click="tournamentUUID = tournaments.uuid; (tournamentCloseConfirm = true) " />
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
                <div class="col text-body2">
                  <q-item dense stack-label>
                    <div class="text-bold self-center full-width text-positive">Sędzia główny</div>
                  </q-item>
                  <q-item dense v-if="tournaments.mainArbiter != null" class="col" style="cursor: pointer;" @dblclick="memberLeg=tournaments.mainArbiter.legitimationNumber;memberDial=true">
                    <Tooltip2clickToShow></Tooltip2clickToShow>
                    <div class="self-center col full-width text-positive">
                      {{ tournaments.mainArbiter.firstName }} {{ tournaments.mainArbiter.secondName }}
                      {{ tournaments.mainArbiter.memberPermissions.arbiterClass }}
                    </div>
                  </q-item>
                  <q-item dense v-if="tournaments.otherMainArbiter != null" class="col">
                    <div class="self-center col full-width text-positive">
                      {{ tournaments.otherMainArbiter.firstName }} {{ tournaments.otherMainArbiter.secondName }}
                      {{ tournaments.otherMainArbiter.permissionsEntity.arbiterClass }}
                    </div>
                  </q-item>
                </div>
                <div class="col text-body2">
                  <q-item dense stack-label>
                    <div class="text-bold self-center full-width text-positive">Sędziowie
                      stanowiskowi
                    </div>
                  </q-item>
                  <q-item dense v-for="(arbiters, uuid) in tournaments.arbitersList" :key="uuid" style="cursor: pointer;" @dblclick="memberLeg=arbiters.legitimationNumber;memberDial=true">
                    <Tooltip2clickToShow></Tooltip2clickToShow>
                    <div class="self-center full-width text-positive">{{ arbiters.firstName }}
                      {{ arbiters.secondName }} {{ arbiters.memberPermissions.arbiterClass }}
                    </div>
                  </q-item>
                  <q-item dense v-for="(otherArbitersList, id) in tournaments.otherArbitersList" :key="id">
                    <div class="text-bold self-center full-width text-positive">
                      {{ otherArbitersList.firstName }} {{ otherArbitersList.secondName }}
                      {{ otherArbitersList.permissionsEntity.arbiterClass }}
                    </div>
                  </q-item>
                </div>
              </div>
              <div class="row">
                <div class="col text-body2">
                  <q-item dense stack-label>
                    <div class="text-bold self-center full-width text-positive">Sędzia komisji
                      RTS
                    </div>
                  </q-item>
                  <q-item dense v-if="tournaments.commissionRTSArbiter != null" class="col" style="cursor: pointer;" @dblclick="memberLeg=tournaments.commissionRTSArbiter.legitimationNumber;memberDial=true">
                    <Tooltip2clickToShow></Tooltip2clickToShow>
                    <div class="self-center col full-width text-positive">
                      {{ tournaments.commissionRTSArbiter.firstName }} {{ tournaments.commissionRTSArbiter.secondName }}
                      {{ tournaments.commissionRTSArbiter.memberPermissions.arbiterClass }}
                    </div>
                  </q-item>
                  <q-item dense v-if="tournaments.otherCommissionRTSArbiter != null" class="col">
                    <div class="self-center col full-width text-positive">
                      {{ tournaments.otherCommissionRTSArbiter.firstName }}
                      {{ tournaments.otherCommissionRTSArbiter.secondName }}
                      {{ tournaments.otherCommissionRTSArbiter.permissionsEntity.arbiterClass }}
                    </div>
                  </q-item>
                </div>
                <div class="col text-body2">
                  <q-item dense stack-label>
                    <div class="text-bold self-center full-width text-positive">Sędziowie biura
                      obliczeń
                    </div>
                  </q-item>
                  <q-item dense v-for="(arbitersRTSList, uuid) in tournaments.arbitersRTSList" :key="uuid" style="cursor: pointer;" @dblclick="memberLeg=arbitersRTSList.legitimationNumber;memberDial=true">
                    <Tooltip2clickToShow></Tooltip2clickToShow>
                    <div class="self-center full-width text-positive">
                      {{ arbitersRTSList.firstName }} {{ arbitersRTSList.secondName }}
                      {{ arbitersRTSList.memberPermissions.arbiterClass }}
                    </div>
                  </q-item>
                  <q-item dense v-for="(otherArbitersRTSList, id) in tournaments.otherArbitersRTSList" :key="id">
                    <div class="text-bold self-center full-width text-positive">
                      {{ otherArbitersRTSList.firstName }} {{ otherArbitersRTSList.secondName }}
                      {{ otherArbitersRTSList.permissionsEntity.arbiterClass }}
                    </div>
                  </q-item>
                </div>
              </div>
            </div>
            <div class="col-6 text-center q-pr-md q-pl-xs q-pt-md">
              <q-btn-dropdown label="Lista Konkurencji" class="text-bold full-width ghover1" text-color="black" color="grey-4">
            <div class="text-positive" :class="backgroundDark?'bg-dark':'bg-grey-3'" dense>
                <q-list>
              <div class="row ghover2" v-for="(item, uuid) in tournaments.competitionsList" :key="uuid">
                  <div class="self-center col no-outline text-positive">{{ item.name }} ({{ item.countingMethod }})
                  </div>
                <q-btn dense v-if="item.scoreList < 1" color="warning"  text-color="white" class="col-2 q-ma-xs" label="usuń"
                  @click="competitionListUUID = item.uuid; tournamentUUID = tournaments.uuid; deleteListFromTournament()"/>
              </div>
              </q-list>
            </div>
            </q-btn-dropdown>
            </div>
          </div>
          <q-card class="full-width bg-dark" flat>
            <div class="row">
              <div class="text-h6 col-6 text-center text-bold self-center">Dodawanie zawodników</div>
              <div class="text-h6 col-6 text-center text-bold self-center">{{name}}</div>
            </div>
            <div class="row">
              <q-card-section class="row full-width q-pl-md q-mr-md q-pb-none">
                  <q-select label="Wybierz osobę z Klubu"
                            input-class="text-white" label-color="white"
                            popup-content-class="bg-dark text-positive"
                            options-dense class="col q-mr-md"
                            :class="memberName.secondName!=='0'?'bg-primary':'bg-secondary'"
                    :option-label="opt => opt.secondName !== '0' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.legitimationNumber).toString() : ''"
                    emit-value map-options v-model="memberName" filled dense use-input hide-selected fill-input
                    :options="options" @input="otherName = Object({secondName:'0', firstName: '0',id: '0'})" @filter="filterFn">
                    <template v-slot:option="option">
                      <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option.itemProps"
                        v-on="option.itemEvents">
                        <q-item-section style="padding: 0.5em; margin: 0;"
                          :class="option.opt.active ? '' : 'bg-warning rounded text-black'"
                          @click="name = option.opt.name">
                          <div class="container">
                          <div class="background text-caption text-right">{{ !option.opt.declarationLOK && shootingPlace==='prod'?'Brak Podpisanej Deklaracji LOK':'' }}</div>
                          <div>{{ option.opt.secondName }} {{ option.opt.firstName }}
                            {{ option.opt.legitimationNumber }} {{ option.opt.adult ? 'Ogólna' : 'Młodzież' }} {{
                              option.opt.active ? '' : '- BRAK SKŁADEK' }}
                          </div>
                        </div>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Brak wyników - sprawdź w skreślonych
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <div class="col">
                  <q-btn v-if="memberName.secondName === '0' && otherName.secondName === '0'" color="grey-5" class="fit"
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
                    @click="tournamentUUID = tournaments.uuid; getCompetitionsInTournament();getAllUsersInWork(); competitionsInfo = true"
                    class="fit" color="primary" text-color="white" label="wybierz konkurencje" />
                </div>
              </q-card-section>
              <q-card-section class="row full-width q-pl-md q-pr-md q-pt-xs">
                <q-select @popup-show="getOther()" @popup-hide="getOther()" input-class="text-white" label-color="white" popup-content-class="bg-dark text-positive"
                    v-model="otherName" options-dense filled dense use-input hide-selected fill-input class="col q-mr-md"
                    :class="otherName.secondName!=='0'?'bg-primary':'bg-secondary'"
                    :option-label="opt => opt.secondName !== '0' ? Object(opt.fullName + ' ' + opt.club.name).toString() : ''"
                    :options="options" @input="memberName = Object({secondName:'0', firstName: '0',legitimationNumber: '0'})" @filter="filterOther" label="Wybierz osobę spoza klubu">
                    <template v-slot:option="option">
                      <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option.itemProps"
                        v-on="option.itemEvents">
                        <q-item-section style="padding: 0.5em; margin: 0;"
                          :class="option.opt.active ? '' : 'bg-warning rounded text-black'"
                          @click="name = option.opt.fullName + ' ' + option.opt.club.name">
                          <div>{{option.opt.fullName}} {{ option.opt.club.name }}
                          </div>
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <div>
                        <div class="q-pa-md bg-grey-5 text-center text-bold">Brak wyników - możesz dodać nową osobę
                        </div>
                        <div class="q-pa-md bg-grey-5">
                            <AddNewOtherPerson v-on:addOtherPerson="getOther()"></AddNewOtherPerson>
                        </div>
                      </div>
                    </template>
                  </q-select>
                <div class="col">
                  <q-btn :disable="memberName.secondName === '0' && otherName.secondName === '0'" class="fit" label="Drukuj metryki" color="secondary"
                    @click="tournamentUUID = tournaments.uuid;memberName.secondName != '0'?name = memberName.name:otherName.name;date = tournaments.date; getMemberUUIDFromLegitimationNumber();getMetricNumber()" />
                </div>
              </q-card-section>
            </div>
            <div class="full-width text-right q-pa-md"><q-btn @click="openAll=!openAll" color="primary">{{ openAll ? 'zwiń' : 'rozwiń' }} wszystko</q-btn></div>
            <div v-for="(item, index) in tournaments.competitionsList" :key="index" class="q-pl-md q-pr-md">
              <q-expansion-item :label="`${item.name} ${item.countingMethod}`" class="col" :header-class="index%2===0?'bg-grey text-black':''" :value="openAll">
                <SingleCompetition :uuid="item.uuid" :size="item.scoreListSize"></SingleCompetition>
              </q-expansion-item>
            </div>
            <div style="height: 20vh"></div>
          </q-card>
        </div>
      </q-card>
      <q-card v-if="toggleShowClosedCompetitions" class="col-2 bg-dark text-positive">
        <div>
          <q-item>
            <q-item-label class="text-h5 text-bold">
              Zamknięte Zawody
            </q-item-label>
          </q-item>
          <div class="row full-width bg-secondary q-mb-xs">
            <q-btn icon="arrow_left" :disable="pageNumber === 0"
              @click="showloading(); pageNumber = pageNumber - 1; getClosedTournaments(pageNumber)" class="col-2"
              color="primary"></q-btn>
            <div class="self-center text-bold text-center text-white col">STRONA {{ pageNumber + 1 }}</div>
            <q-btn icon="arrow_right"
              @click="showloading(); pageNumber = tournamentsClosed.length === 15 ? pageNumber + 1 : pageNumber; getClosedTournaments(pageNumber)"
              :disabled="tournamentsClosed.length !== 15" class="col-2" color="primary"></q-btn>
          </div>
          <div>
            <div v-for="(item, index) in tournamentsClosed" :key="index">
                <q-btn class="full-width q-mb-xs" text-color="white" color="primary"
                  :label="'#' + ((index + 1) + (pageNumber * 15)) + ' ' + item.date"
                  @click="tournamentClosedName = item.name; tournamentUUID = item.tournamentUUID; name = item.name; date = item.date; closedTournamentInfo = true; getStatistics()"><q-tooltip
                    content-class="bg-primary text-h6 text-bold" anchor="top middle">
                    <div>{{ item.name }}</div>
                  </q-tooltip></q-btn>
            </div>
          </div>
        </div>
      </q-card>
    </div>
    <q-dialog v-model="createNewCompetiton">
      <q-card class="bg-dark">
        <q-card-section class="row items-center">
          <q-item-section v-if="!notUsed">
            <q-item-label class="text-h4 text-bold text-positive">Kreator Konkurencji</q-item-label>
            <q-item-label class="text-positive">Utworzenie nowej konkurencji da możliwość wybrania jej podczas zawodów
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
                <q-input onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="bg-grey-4 center justify"
                  filled v-if="meters" style="width: 100px" v-model="choice" stack-label label="ilość metrów"></q-input>
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
              <q-checkbox class="row" v-if="choice1 === 'Strzelba'" :val="''" true-value=" maszynowa" false-value=""
                color="orange" v-model="choice2" label="maszynowa"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" maszynowy" false-value="" color="orange"
                v-model="choice2" label="maszynowy"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 === 'Strzelba'" :val="''" true-value=" dynamiczna" false-value=""
                color="orange" v-model="choice3" label="dynamiczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" dynamiczny" false-value="" color="orange"
                v-model="choice3" label="dynamiczny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="choice1 === 'Strzelba'" :val="''"
                true-value=" sportowa" false-value="" color="orange" v-model="choice5" label="sportowa"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value=" sportowy" false-value=""
                color="orange" v-model="choice5" label="sportowy"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 === 'Strzelba'" :val="''" true-value=" dowolna" false-value=""
                color="orange" v-model="choice6" label="dowolna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" dowolny" false-value="" color="orange"
                v-model="choice6" label="dowolny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="choice1 === 'Strzelba'" :val="''"
                true-value=" pneumatyczna" false-value="" color="orange" v-model="choice7"
                label="pneumatyczna"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value=" pneumatyczny" false-value=""
                color="orange" v-model="choice7" label="pneumatyczny"></q-checkbox>
              <q-checkbox class="row" v-if="choice1 === 'Strzelba'" :val="''" true-value=" statyczna" false-value=""
                color="orange" v-model="choice8" label="statyczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" statyczny" false-value="" color="orange"
                v-model="choice8" label="statyczny"></q-checkbox>
            </div>
            <div class="row bg-grey-3">
              <q-radio class="col" v-if="!choice7 && choice1 !== 'Strzelba' && !choice5" color="orange" v-model="choice9"
                :val="' centralnego zapłonu'" label="centralnego zapłonu"></q-radio>
              <q-radio class="col" v-if="!choice7 && choice1 !== 'Strzelba'" color="orange" v-model="choice9"
                :val="' bocznego zapłonu'" label="bocznego zapłonu"></q-radio>
            </div>
            <div class="row bg-grey-4">
              <div class="q-pa-xs">Strzały oceniane</div>
              <div>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'5'"
                label="5 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'7'"
                label="7 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'10'"
                label="10 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'15'"
                label="15 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'20'"
                label="20 strzałów"></q-radio>
              <q-checkbox class="row" color="orange" @input="choice10 = []" v-model="quantity" :val="false"
                label="inne"></q-checkbox>
                <q-input @focus="choice10 = []" onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                  class="full-width bg-grey-4 center justify" filled v-if="quantity" style="width: 100px"
                  v-model="choice10" stack-label label="Ilość strzałów"></q-input>
              </div>
            </div>
            <div class="row bg-grey-5">
              <q-radio color="orange" v-model="choice11" :val="' OPEN'" label="OPEN"></q-radio>
              <q-radio color="orange" v-model="choice11" :val="' Młodzieżowa'" label="Młodzieżowa"></q-radio>
            </div>
            <div class="row bg-grey-6">
              <q-item class="items-center">Metoda Liczenia :</q-item>
              <q-radio v-for="(item,index) in countingMethods" v-model="choice12" :key="index" :val="item" :label="item"></q-radio>
              <!-- <q-radio class="col" color="primary" v-model="choice12" :val="'NORMAL'" label="Normalnie"></q-radio>
              <q-radio class="col" color="primary" v-model="choice12" :val="'COMSTOCK'" label="Comstock"></q-radio> -->
            </div>
            <div class="row bg-grey-7">
              <q-item dense class="row justify-around">Kaliber :</q-item>
              <q-radio dense class="row justify-around q-pl-md" v-model="choice13" v-for="(calibers, uuid) in calibers"
                :key="uuid" :val="calibers.uuid" :label="calibers.name">
              </q-radio>
            </div>
            <div class="row bg-grey-8">
              <q-item class="items-center">Ilość Strzałów próbnych :</q-item>
              <q-input onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                class="full-width col center justify" filled v-model="choice14" stack-label></q-input>
            </div>
            <div class="row text-h6 text-positive">
              <q-item-label>Nazwa konkurencji :</q-item-label>
              <q-item-label v-if="choice"> {{ choice + 'm' }} {{ ' ' + choice1 }} {{ ' ' + choice2 }}
                {{ ' ' + choice3 }} {{ ' ' + choice4 }} {{ ' ' + choice5 }} {{ ' ' + choice6 }} {{ ' ' + choice7 }}
                {{ ' ' + choice8 }} {{ ' ' + choice9 }} {{ ' ' + choice10 + ' strzałów' }} {{ ' ' + choice11 }}
              </q-item-label>
              <q-item-label v-else> {{ choice }} {{ ' ' + choice1 }} {{ ' ' + choice2 }}
                {{ ' ' + choice3 }}
                {{ ' ' + choice4 }} {{ ' ' + choice5 }} {{ ' ' + choice6 }} {{ ' ' + choice7 }} {{ ' ' + choice8 }}
                {{ ' ' + choice9 }} {{ ' ' + choice10 + ' strzałów' }} {{ ' ' + choice11 }}
              </q-item-label>
            </div>
          </q-item-section>
          <q-item-section v-if="notUsed">
            <q-item>
              <q-item-label class="text-h6 text-bold text-justify text-positive">Można nadać własną nazwę zawodów bez używania
                kreatora
              </q-item-label>
            </q-item>
            <div class="col bg-grey-2">
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
              <div v-else class="row bg-grey-3">
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
              <div v-if="dynamic" class="row">
                <q-input v-if="dynamicChoice.includes('Pistolet')"
                  onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify"
                  filled v-model="dynamicChoice1" stack-label label="Ilość strzałów pistolet"></q-input>
                <q-input v-if="dynamicChoice.includes('Karabin')"
                  onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify"
                  filled v-model="dynamicChoice2" stack-label label="Ilość strzałów karabin"></q-input>
                <q-input v-if="dynamicChoice.includes('Strzelba')"
                  onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify"
                  filled v-model="dynamicChoice3" stack-label label="Ilość strzałów strzelba"></q-input>
                {{ dynamicChoice1 }}
                {{ dynamicChoice2 }}
                {{ dynamicChoice3 }}
              </div>
              <q-input v-if="!dynamic" @focus="choice10 = []"
                onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify"
                filled style="width: 100px" v-model="choice10" stack-label label="Ilość strzałów z próbnymi"></q-input>
            </div>
            <div class="row bg-grey-3">
              <q-item class="items-center">Metoda Liczenia :</q-item>
              <q-radio v-if="!dynamic" class="col" color="black" v-model="choice12" :val="'NORMAL'"
                label="Normalnie"></q-radio>
              <q-radio class="col" color="black" v-model="choice12" :val="'COMSTOCK'" label="Comstock"></q-radio>
            </div>
            <q-input class="full-width bg-grey-4 center justify" filled v-model="competitionName" stack-label
              label="wprowadź własną nazwę"></q-input>
          </q-item-section>
        </q-card-section>
        <div class="row">
          <q-card-actions class="col" align="left">
            <q-checkbox @input="competitionName = null" class="row text-dark" keep-color color="dark"
              v-model="notUsed" :val="false" label="nie używaj kreatora"></q-checkbox>
          </q-card-actions>
          <q-card-actions class="row" align="right">
            <q-btn label="zamknij" color="secondary" v-close-popup />
            <q-btn label="utwórz" color="primary" v-close-popup @click="createCompetition()" />
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="tournamentUpdateConfirm">
      <q-card style="width: 40vw" class="bg-dark text-positive">
        <q-card-section class="col items-center">
          <q-item>
            <q-input v-model="tournamentName" dense class="full-width" label-color="positive" input-class="text-positive" label="Nowa nazwa zawodów" filled />
          </q-item>
          <q-item>
            <q-input filled v-model="tournamentDate" dense mask="####-##-##" label="Wybierz datę" label-color="positive" input-class="text-positive"
              hint="użyj kalendarza" class="full-width">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer text-positive">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="tournamentDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
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
          <q-btn label="Usuń zawody" color="warning" v-close-popup @click="deleteTournamentAlert = true"></q-btn>
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="aktualizuj" color="primary" v-close-popup @click="tournamentConfirm = true" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addArbitersConfirmbtn">
      <q-card style="min-width: 60vw" class="bg-dark text-positive">
        <q-card-section style="min-width: 500px" class="row items-center bg-dark text-positive text-bold">
          <div class="row full-width bg-dark">
            <div class="q-pa-md col-6 text-positive">
                <div class="text-center full-width q-pa-md">Sędzia Główny</div>
              <div>
                <q-select @input="otherMainArbiterName = ''" dense label="Dodaj sędziego z klubu" color="secondary" label-color="positive" input-class="text-positive" class="full-width" filled use-input
                hide-selected fill-input input-debounce="0" :options="options"
                popup-content-class="bg-dark text-positive"
                :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.arbiterClass).toString() : ''"
                emit-value map-options options-dense options-selected-class="bg-green-3 text-positive"
                v-model="mainArbiter" @filter="filterArbiters">
                <template v-slot:option="option">
            <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']"
              v-on="option.itemEvents">
              <q-item-section style="padding: 0.5em; margin: 0;" :class="option.opt.active ? '' : 'bg-warning rounded'"
                >
                <div class="container">
                  <div class="background text-caption text-right">{{ !option.opt.declarationLOK && shootingPlace==='prod'?'Brak Podpisanej Deklaracji LOK':'' }}</div>
                  {{ option.opt.secondName }} {{ option.opt.firstName }}
                  {{ option.opt.arbiterClass }} {{ option.opt.active ? '' : ' - BRAK SKŁADEK' }}
                </div>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Brak wyników
              </q-item-section>
            </q-item>
          </template>
                </q-select>
                <q-select @input="mainArbiter = ''" dense options-dense color="secondary" label-color="positive" input-class="text-positive" filled
                  v-model="otherMainArbiterName" use-input
                  hide-selected fill-input input-debounce="0" :options="options" @filter="filterOtherArbiters" popup-content-class="bg-dark text-positive" options-selected-class="bg-green-3 text-positive"
                  :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.arbiterClass).toString() : ''"
                  label="Dodaj sędziego spoza klubu">
                  <template v-slot:no-option>
                      <div class="q-pa-md bg-dark text-positive text-center text-bold">Brak wyników - możesz dodać nową osobę</div>
                          <AddNewOtherPerson v-on:addOtherPerson="getOther()"></AddNewOtherPerson>
                  </template>
                </q-select>
              </div>
              <q-item v-if="mainArbiter !== '' || otherMainArbiterName !== ''">
                <q-btn v-if="mainArbiter !== ''" label="Dodaj" color="primary" @click="addMainArbiterToTournament(mainArbiter)" />
                <q-btn v-if="otherMainArbiterName !== ''" label="Dodaj" color="primary" @click="addMainArbiterToTournament(otherMainArbiterName)" />
              </q-item>
              <q-item v-else></q-item>
            </div>
            <div class="q-pa-md col-6 text-positive">
                <div class="text-center full-width q-pa-md">Sędzia RTS</div>
              <div>
                <q-select @input="otherRTSArbiterName = ''" dense label="Dodaj sędziego z klubu" color="secondary" label-color="positive" input-class="text-positive" class="full-width" filled use-input
                hide-selected fill-input input-debounce="0" :options="options"
                popup-content-class="bg-dark text-positive"
                :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.arbiterClass).toString() : ''"
                emit-value map-options options-dense options-selected-class="bg-green-3 text-positive"
                v-model="countArbiter" @filter="filterArbiters">
                <template v-slot:option="option">
            <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']"
              v-on="option.itemEvents">
              <q-item-section style="padding: 0.5em; margin: 0;" :class="option.opt.active ? '' : 'bg-warning rounded'"
                >
                <div class="container">
                  <div class="background text-caption text-right">{{ !option.opt.declarationLOK && shootingPlace==='prod'?'Brak Podpisanej Deklaracji LOK':'' }}</div>
                  {{ option.opt.secondName }} {{ option.opt.firstName }}
                  {{ option.opt.arbiterClass }} {{ option.opt.active ? '' : ' - BRAK SKŁADEK' }}
                </div>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Brak wyników
              </q-item-section>
            </q-item>
          </template>
                </q-select>
                <q-select @input="countArbiter = ''" dense options-dense class="full-width" label-color="positive" input-class="text-positive" color="secondary" filled
                  v-model="otherRTSArbiterName" use-input hide-selected fill-input input-debounce="0" :options="options"  popup-content-class="bg-dark text-positive" options-selected-class="bg-green-3 text-positive"
                  :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.arbiterClass).toString() : ''"
                  @filter="filterOtherArbiters" label="Dodaj sędziego spoza klubu">
                  <template v-slot:no-option>
                      <div class="q-pa-md bg-dark text-positive text-center text-bold">Brak wyników - możesz dodać nową osobę</div>
                          <AddNewOtherPerson v-on:addOtherPerson="getOther()"></AddNewOtherPerson>
                  </template>
                </q-select>
              </div>
              <q-item v-if="countArbiter !== '' || otherRTSArbiterName !== ''">
                <q-btn v-if="countArbiter !== ''" label="Dodaj" color="primary" @click="addRTSArbiterToTournament(countArbiter)" />
                <q-btn v-if="otherRTSArbiterName !== ''" label="Dodaj" color="primary" @click="addRTSArbiterToTournament(otherRTSArbiterName)" />
              </q-item>
              <q-item v-else>
              </q-item>
            </div>
          </div>
          <div class="row full-width">
            <div class="q-pa-md col-6 text-positive">
                <div class="text-center full-width q-pa-md">Sędziowie stanowiskowi</div>
              <div>
                <!-- <q-input @input="otherArbitersList = '0 0'" label-color="positive" input-class="text-positive" color="secondary" class="full-width" filled type="password"
                  v-model="otherArbiter" use-input hide-selected fill-input input-debounce="0" style="width: 350px"
                  label="Zeskanuj Kartę" @keypress.enter="addOtherArbiterToTournament(otherArbiter)">
                </q-input> -->
                <q-select @input="otherArbitersList = ''" dense label="Dodaj sędziego z klubu" color="secondary" label-color="positive" input-class="text-positive" class="full-width" filled use-input
                hide-selected fill-input input-debounce="0" :options="options"
                popup-content-class="bg-dark text-positive"
                :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.arbiterClass).toString() : ''"
                emit-value map-options options-dense options-selected-class="bg-green-3 text-positive"
                v-model="otherArbiter" @filter="filterArbiters">
                <template v-slot:option="option">
            <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']"
              v-on="option.itemEvents">
              <q-item-section style="padding: 0.5em; margin: 0;" :class="option.opt.active ? '' : 'bg-warning rounded'"
                >
                <div class="container">
                  <div class="background text-caption text-right">{{ !option.opt.declarationLOK && shootingPlace==='prod'?'Brak Podpisanej Deklaracji LOK':'' }}</div>
                  {{ option.opt.secondName }} {{ option.opt.firstName }}
                  {{ option.opt.arbiterClass }} {{ option.opt.active ? '' : ' - BRAK SKŁADEK' }}
                </div>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Brak wyników
              </q-item-section>
            </q-item>
          </template>
                </q-select>
                <q-select @input="otherArbiter = ''" dense options-dense class="full-width" color="secondary" label-color="positive" input-class="text-positive" filled
                  v-model="otherArbitersList" use-input hide-selected fill-input input-debounce="0" :options="options"  popup-content-class="bg-dark text-positive" options-selected-class="bg-green-3 text-positive"
                  :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.arbiterClass).toString() : ''"
                  @filter="filterOtherArbiters" label="Dodaj sędziego spoza klubu">
                  <template v-slot:no-option>
                      <div class="q-pa-md bg-dark text-positive text-center text-bold">Brak wyników - możesz dodać nową osobę</div>
                          <AddNewOtherPerson v-on:addOtherPerson="getOther()"></AddNewOtherPerson>
                  </template>
                </q-select>
              </div>
              <div class="col">
                <div>
                  <q-item v-if="otherArbiter !== '' || otherArbitersList !== ''">
                    <q-btn v-if="otherArbiter !== ''" class="full-width" label="Dodaj sędziego stanowiskowego" color="primary" @click="addOtherArbiterToTournament(otherArbiter)" />
                    <q-btn v-if="otherArbitersList !== ''" class="full-width" label="Dodaj sędziego stanowiskowego" color="primary" @click="addOtherArbiterToTournament(otherArbitersList)" />
                  </q-item>
                  <q-item v-else>
                  </q-item>
                </div>
                <div>
                  <q-item v-if="otherArbiter !== '' || otherArbitersList !== ''">
                    <q-btn v-if="otherArbiter !== ''" class="full-width" label="usuń sędziego stanowiskowego" color="primary" @click="removeArbiter(otherArbiter)" />
                    <q-btn v-if="otherArbitersList !== ''" class="full-width" label="usuń sędziego stanowiskowego" color="primary" @click="removeArbiter(otherArbitersList)" />
                  </q-item>
                  <q-item v-else>
                  </q-item>
                </div>
              </div>
            </div>
            <div class="q-pa-md col-6 text-positive">
                <div class="text-center full-width q-pa-md">Sędziowie biura obliczeń</div>
              <div>
                <!-- <q-input @input="otherRTSArbitersList = '0 0'" label-color="positive" input-class="text-positive" color="secondary" class="full-width" filled
                  v-model="otherRTSArbiter" use-input hide-selected fill-input input-debounce="0" type="password"
                  style="width: 350px" label="Zeskanuj kartę"
                  @keypress.enter="addOtherRTSArbiterToTournament(otherRTSArbiter)">
                </q-input> -->
                <q-select @input="otherRTSArbitersList = ''" dense label="Dodaj sędziego z klubu" color="secondary" label-color="positive" input-class="text-positive" class="full-width" filled use-input
                hide-selected fill-input input-debounce="0" :options="options"
                popup-content-class="bg-dark text-positive"
                :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.arbiterClass).toString() : ''"
                emit-value map-options options-dense options-selected-class="bg-green-3 text-positive"
                v-model="otherRTSArbiter" @filter="filterArbiters">
                <template v-slot:option="option">
            <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']"
              v-on="option.itemEvents">
              <q-item-section style="padding: 0.5em; margin: 0;" :class="option.opt.active ? '' : 'bg-warning rounded'"
                >
                <div class="container">
                  <div class="background text-caption text-right">{{ !option.opt.declarationLOK && shootingPlace==='prod'?'Brak Podpisanej Deklaracji LOK':'' }}</div>
                  {{ option.opt.secondName }} {{ option.opt.firstName }}
                  {{ option.opt.arbiterClass }} {{ option.opt.active ? '' : ' - BRAK SKŁADEK' }}
                </div>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Brak wyników
              </q-item-section>
            </q-item>
          </template>
                </q-select>
                <q-select @popup-show="getOtherArbiters()" dense options-dense @input="otherRTSArbiter = ''" class="full-width" color="secondary" label-color="positive" input-class="text-positive" filled
                  v-model="otherRTSArbitersList" use-input hide-selected fill-input input-debounce="0" :options="options"  popup-content-class="bg-dark text-positive" options-selected-class="bg-green-3 text-positive"
                  :option-label="opt => opt !== '' ? Object(opt.secondName + ' ' + opt.firstName + ' ' + opt.arbiterClass).toString() : ''"
                  @filter="filterOtherArbiters" label="Dodaj sędziego spoza klubu">
                  <template v-slot:no-option>
                      <div class="q-pa-md bg-dark text-positive text-center text-bold">Brak wyników - możesz dodać nową osobę</div>
                          <AddNewOtherPerson v-on:addOtherPerson="getOther()"></AddNewOtherPerson>
                  </template>
                </q-select>
              </div>
              <div class="col">
                <div>
                  <q-item v-if="otherRTSArbiter !== '' || otherRTSArbitersList !== ''">
                    <q-btn v-if="otherRTSArbiter !== ''" class="full-width" label="Dodaj sędziego biura obliczeń" color="primary" @click="addOtherRTSArbiterToTournament(otherRTSArbiter)" />
                    <q-btn v-if="otherRTSArbitersList !== ''" class="full-width" label="Dodaj sędziego biura obliczeń" color="primary" @click="addOtherRTSArbiterToTournament(otherRTSArbitersList)" />
                  </q-item>
                  <q-item v-else>
                  </q-item>
                </div>
                <div>
                  <q-item v-if="otherRTSArbiter !== '' || otherRTSArbitersList !== ''">
                    <q-btn v-if="otherRTSArbiter !== ''" class="full-width" label="usuń sędziego biura obliczeń" color="primary" @click="removeRTSArbiter(otherRTSArbiter)" />
                    <q-btn v-if="otherRTSArbitersList !== ''" class="full-width" label="usuń sędziego biura obliczeń" color="primary" @click="removeRTSArbiter(otherRTSArbitersList)" />
                  </q-item>
                  <q-item v-else>
                  </q-item>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup
            @click="mainArbiter = ''; countArbiter = ''; otherArbiter = ''; otherRTSArbiter = ''; otherMainArbiterName = ''; otherRTSArbiterName = ''; otherArbitersList = ''; otherRTSArbitersList = ''" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="removeFromList">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-h6">Usunąć zawodnika z listy startujących w konkurencji?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="usuń" color="warning" v-close-popup @click="removeMemberFromCompetition()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="tournamentConfirm" persistent>
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy zaktualizować zawody?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="Zmień" color="primary" v-close-popup @click="updateTournament()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="tournamentCloseConfirm">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center text-h6">
          <span class="q-ml-sm">Zamknąć zawody?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="Zamknij" color="primary" v-close-popup @click="closeTournament()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addCompetitionConfirm" persistent>
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy dodać konkurencję do zawodów?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="secondary" v-close-popup />
          <q-btn label="Dodaj" color="primary" v-close-popup @click="addCompetitionToTournament()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addNewTournament" persistent>
      <q-card style="width: 400px" class="bg-dark text-positive">
        <q-card-section class="col items-center">
          <q-item>
            <q-item-label class="text-h6 text-center full-width">Nazwa zawodów</q-item-label>
          </q-item>
          <q-item>
            <q-input class="full-width" v-model="tournamentName" filled label="Nazwa" input-class="text-positive" label-color="positive" />
          </q-item>
          <q-item>
            <q-item-label class="text-h6 text-center full-width">Data zawodów</q-item-label>
          </q-item>
          <q-item>
            <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="tournamentDate" mask="####-##-##" label="Wybierz datę">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer text-positive">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="tournamentDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
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
          <q-btn label="anuluj" color="primary" v-close-popup />
          <q-btn label="Dodaj" color="primary" v-close-popup
            @click="createNewTournament(tournamentName, tournamentDate)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="failure" position="standard">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="gunAdded" @keypress.enter="gunAdded = false">
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
            <q-input @keypress.enter="deleteTournament(); deleteTournamentAlert = false" autofocus type="password"
              v-model="code" filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn label="otwórz" color="black" v-close-popup @click="deleteTournament()" />
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
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="competitionsInfo">
      <q-card class="bg-dark text-positive" style="min-width:60vw;" v-if="usersInWork.length>0">
        <q-card-section>
          <div class="col">
            <div class="text-h6 text-bold text-center">DODAWANIE KONKURENCJI {{name}}</div>
            <div class="text-center row"><div class="col">Konkurencje</div><div class="col">Amunicja</div></div>
          <div v-for="(item, index) in options2" :key="index">
            <div class="row text-left">
              <q-checkbox class="col hover1" dense v-model="listOfCompetitions" :val="item.uuid" :label="item.name" @input="checkAtTap(item.uuid);listOfCompetitions.length===options2.length?addAllCompetition=true:addAllCompetition=false"></q-checkbox>
              <div class="col-1"></div>
              <q-checkbox v-if="item.caliberUUID != null" :disable="!listOfCompetitions.includes(item.uuid)" class="col hover1" dense v-model="listOfAddAmmo" :val="item.uuid" :label="item.name + ' ' + item.numberOfShots + ' strzałów ' + '(' + (item.practiceShots!=null?item.practiceShots:'0') +' próbnych)'" @input="listOfAddAmmo.length===options2.length?addAllAmmo=true:addAllAmmo=false"/>
              <div v-else class="col">Brak przypisanej amunicji</div>
            </div>
          </div>
          <p></p>
          <div class="row">
            <q-checkbox color="secondary" class="col hover1" dense v-model="addAllCompetition" :val="false" :value="false" @input="selectAllToAddToCompetition()" label ="zaznacz wszystko" />
            <div class="col-1"></div>
            <q-checkbox color="secondary" class="col hover1" dense v-model="addAllAmmo" :disable="listOfCompetitions.length === 0" :val="false" :value="false" @input="selectAllToAddAmmunition()" label ="zaznacz wszystko" />
          </div>
      </div>
          <div class="row q-pa-md">
            <q-btn class="col full-width" color="red" label="Usuń z listy *"
              @click="removeMemberFromCompetition()"></q-btn>
            <q-btn class="col full-width" color="secondary" :loading="loading[0]" :disable="dis" label="Dodaj do listy"
              @click="dis=true;simulateProgress(0)"></q-btn>
          </div>
          <div class="row">
            <div class="q-pa-sm col-6">
              * Osoby usunięte z listy NIE ZOSTANĄ automatycznie usunięte z listy amunicyjnej
            </div>
            <div class="q-pa-sm col-6">
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
      <q-card v-else class="text-h1 text-bold bg-warning text-center">
        <q-card-section>
          Zarejestruj Pobyt w Klubie
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="metricsInfo">
      <q-card @hook:destroyed="infoScore = []; infoScore1 = []" class="bg-dark text-positive">
        <q-card-section class="col">
          <div class="q-ml-sm text-h6 text-center text-bold">POBIERZ METRYKI STARTOWE ZAWODNIKA</div>
          <div class="q-ml-sm text-h6 text-center text-bold">{{ name }}</div>
          <ol class="col">
            <li class="row hover1" v-for="(item,index) in infoScore" :key="index">
              <q-checkbox color="secondary" class="col" v-model="compList" :val="infoScore1[index]" @input="compList.length===infoScore.length?printAll=true:printAll=false" :label="item" />
            </li>
          </ol>
          <div class="full-width">
            <q-checkbox class="hover1" v-model="a5rotate" :value="a5rotate" label="rozmiar A5"></q-checkbox>
          </div>
          <div class="row q-pa-xs">
            <q-btn v-if="memberExist" dense @click="memberDial=true, memberLeg = memberName.legitimationNumber" class="col q-pa-xs" color="primary">
              wyświetl profil
            </q-btn>
            <q-item></q-item>
            <q-btn @click="getMemberMetrics(compList); compList = []" class="col q-pa-xs" color="secondary">
              wydrukuj wybrane metryki zawodnika
            </q-btn>
            <q-item></q-item>
            <q-btn @click="getMemberMetrics(infoScore1); compList = []" class="col q-pa-xs" color="primary">wydrukuj
              wszystkie metryki zawodnika
            </q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="compName = '';infoScore = []; infoScore1 = []; compList = []" label="zamknij" color="primary" v-close-popup />
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
              <q-btn-dropdown align="center" content-class="bg-dark" class="full-width" label="pobierz komunikat" color="primary">
                <q-list>
                      <q-btn v-close-popup @click="getAnnouncementFromCompetition()" rounded dense class="full-width bg-red-6 q-ma-xs"
                        label="pobierz plik .pdf" color="secondary"></q-btn>
                      <q-btn v-close-popup @click="getAnnouncementFromCompetitionXLSX()" rounded dense class="full-width bg-green-6 q-ma-xs"
                        label="pobierz plik .xslx" color="secondary"></q-btn>
                </q-list>
              </q-btn-dropdown>
            </q-item>
          </div>
          <div>
            <q-item>
              <q-btn @click="getJudgeFromTournament(tournamentUUID,tournamentClosedName,date)" class="full-width" color="primary">pobierz listę sędziów</q-btn>
            </q-item>
          </div>
          <div v-if="tournaments == null">
            <q-item>
              <q-btn @click="openList = true" class="full-width" color="primary">otwórz zawody</q-btn>
            </q-item>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="listDownload">
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
            <q-input @keypress.enter="openTournament(); openList = false" autofocus type="password" v-model="code" filled
              color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click="code = null" />
          <q-btn label="otwórz" color="black" v-close-popup @click="openTournament()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card class="bg-dark" style="min-width: 80vw">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="memberLeg"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">
#container {
   position: relative;
}

#background {
   position: absolute;
   padding: 50%;
   margin: 50%;
   z-index: -1;
   overflow: hidden;
}</style>
<script>
import axios from 'axios'
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import { ref } from 'vue'

export default {
  name: 'tournament',
  components: {
    SingleCompetition: lazyLoadComponent({
      componentFactory: () => import('components/tournament/SingleCompetition.vue'),
      loading: SkeletonBox
    }),
    AddNewOtherPerson: lazyLoadComponent({
      componentFactory: () => import('components/AddNewOtherPerson.vue'),
      loading: SkeletonBox
    }),
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    }),
    Tooltip2clickToShow: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickToShow.vue'),
      loading: SkeletonBox
    }),
    CompetitonCreator: lazyLoadComponent({
      componentFactory: () => import('components/tournament/CompetitionCreator.vue'),
      loading: SkeletonBox
    })
  },
  setup () {
    const loading = ref([
      false
    ])
    const progress = ref(false)

    function simulateProgress (number) {
      loading.value[number] = true
      this.addMemberToCompetition()
      setTimeout(() => {
        loading.value[number] = false
      }, 0)
    }
    function simulateProgressGun (number, evidenceUUID, barcode) {
      loading.value[number] = true
      this.addGunToList(evidenceUUID, barcode)
      setTimeout(() => {
        loading.value[number] = false
      }, 0)
    }

    return {
      loading,
      progress,
      simulateProgress,
      simulateProgressGun
    }
  },
  data () {
    return {
      val: '',
      check: {
        pistol: true,
        rifle: true,
        shotgun: true,
        other: true
      },
      dis: false,
      usersInWork: [],
      icon: 'menu',
      backgroundDark: JSON.parse(window.localStorage.getItem('BackgroundDark')),
      ClosedCompetitionTabEXP: JSON.parse(window.localStorage.getItem('ClosedCompetitionTab')),
      mobile: App.mobile,
      a5rotate: false,
      printAll: false,
      memberExist: false,
      addAllCompetition: false,
      addAllAmmo: false,
      memberDial: false,
      memberLeg: null,
      toggleShowClosedCompetitions: false,
      competitionsInfo: false,
      listOfCompetitions: [],
      listOfAddAmmo: [],
      pageNumber: 0,
      code: null,
      barcode: null,
      openList: false,
      listDownload: false,
      success: false,
      tournamentUUID: null,
      tournamentConfirm: false,
      tournamentCloseConfirm: false,
      tournamentUpdateConfirm: false,
      addMemberConfirm: false,
      addNewTournament: false,
      addCompetitionConfirmbtn: false,
      addArbitersConfirmbtn: false,
      addCompetitionConfirm: false,
      createNewCompetiton: false,
      competitionName: null,
      countingMethods: [],
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
      tournaments: null,
      competitions: [],
      filters: [],
      filtersOther: [],
      tournamentsClosed: [],
      calibers: [],
      statistic: [],
      infoScore: [],
      infoScore1: [],
      gunsUsed: [],
      dynamic: false,
      caliberUUID: null,
      tournamentName: '',
      tournamentDate: '',
      scoreUUID: null,
      options: [],
      options3: [],
      mainArbiter: '',
      countArbiter: '',
      otherArbiter: '',
      otherRTSArbiter: '',
      competitionAddToTournamentList: [],
      removeFromList: false,
      memberName: {
        firstName: '0',
        secondName: '0',
        legitimationNumber: 0
      },
      otherName: {
        firstName: '0',
        secondName: '0',
        id: 0
      },
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
      filtersArbiters: [],
      otherMainArbiterName: '',
      otherRTSArbiterName: '',
      otherArbitersList: '',
      otherRTSArbitersList: '',
      ordinal: '',
      permissionsOtherArbiterNumber: '',
      permissionsOtherArbiterPermissionValidThru: '',
      deleteTournamentAlert: false,
      closedTournamentInfo: false,
      tournamentClosedName: null,
      competitionListUUID: '',
      wzss: true,
      message: null,
      resp: '',
      filterOptions: [],
      openAll: false,
      visible: true,
      shootingPlace: App.shootingPlace,
      local: App.host
    }
  },
  created () {
    this.getListTournaments()
    this.getCompetitions()
    this.getOther()
    this.getAllClubsToTournament()
  },
  methods: {
    selectAllToPrint () {
      this.compList = []
      if (this.printAll) {
        this.infoScore1.forEach(e => {
          this.compList.push(e)
        })
      }
    },
    selectAllToAddToCompetition () {
      this.listOfCompetitions = []
      if (this.addAllCompetition) {
        this.options2.forEach(e => {
          this.listOfCompetitions.push(e.uuid)
          if (this.addAllAmmo) {
            this.listOfAddAmmo.push(e.uuid)
          }
        })
      }
      if (!this.addAllCompetition) {
        this.listOfAddAmmo = []
        this.addAllAmmo = false
      }
    },
    selectAllToAddAmmunition () {
      this.listOfAddAmmo = []
      if (this.addAllAmmo) {
        this.options2.forEach(e => {
          if (e.caliberUUID != null && this.listOfCompetitions.includes(e.uuid)) {
            this.listOfAddAmmo.push(e.uuid)
          }
        })
      }
    },
    checkAtTap (uuid) {
      if (!this.listOfCompetitions.includes(uuid) && this.listOfAddAmmo.includes(uuid)) {
        this.listOfAddAmmo = this.listOfAddAmmo.filter(f => f !== uuid)
        this.addAllAmmo = false
      }
      if (this.addAllAmmo) {
        this.listOfAddAmmo.push(uuid)
      }
    },
    getCountingMethods () {
      fetch(`http://${this.local}/competition/getCountingMethods`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.countingMethods = response
        })
    },
    getAllUsersInWork () {
      fetch(`http://${this.local}/work/`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.usersInWork = response
        })
    },
    getListTournaments () {
      this.getMembersNames()
      fetch(`http://${this.local}/tournament/openTournament`, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(response => {
            this.tournaments = response
          })
        } if (response.status === 418) {
          this.tournaments = null
          window.localStorage.setItem('arbiter', '000')
        }
      })
    },
    getCompetitions () {
      fetch(`http://${this.local}/competition/`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.competitions = response
        })
    },
    getListCalibers () {
      fetch(`http://${this.local}/armory/calibers`, {
        method: 'GET'
      }).then(response => response.json())
        .then(calibers => {
          this.calibers = calibers
        })
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      let time = 1000
      this.timer = setTimeout(() => {
        if (!this.visible) {
          this.$q.loading.hide()
          this.timer = 0
        } else {
          time = 1000
        }
      }, time)
    },
    getMembersNames () {
      fetch(`http://${this.local}/member/getAllNames`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters = response
        })
    },
    getOther () {
      fetch(`http://${this.local}/other/all`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filtersOther = response
        })
    },
    getCompetitionsInTournament () {
      fetch(`http://${this.local}/tournament/competitions?tournamentUUID=${this.tournamentUUID}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.options2 = response
        })
    },
    getStatistics () {
      fetch(`http://${this.local}/tournament/stat?tournamentUUID=${this.tournamentUUID}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.statistic = response
        })
    },
    getMemberUUIDFromLegitimationNumber () {
      const memberlegNumber = this.memberName.legitimationNumber
      fetch(`http://${this.local}/member/ID/${memberlegNumber}`, {
        method: 'GET'
      }).then(response => response.text())
        .then(response => {
          if (response.length > 0) {
            this.memberUUID = response
            this.memberExist = true
          } else {
            this.message = response
            this.failure = true
            this.memberExist = false
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
        const memberlegNumber = this.memberName.legitimationNumber
        const otherNameID = this.otherName.id
        fetch(`http://${this.local}/competitionMembersList/getMemberStartsByLegitimation?tournamentUUID=${this.tournamentUUID}&legNumber=${memberlegNumber}&otherID=${otherNameID}`, {
          method: 'GET'
        }).then(response => response.json())
          .then(response => {
            for (let i = 0; i < response.length; i++) {
              this.infoScore.push(response[i].substring(0, response[i].indexOf(';')))
              this.infoScore1.push(response[i].substring(response[i].indexOf(';') + 1, response[i].length))
            }
            this.otherID = otherNameID
            this.metricsInfo = true
          })
      }
    },
    getMetricNumber () {
      if (this.memberName === '' || this.otherName === '') {
        this.message = 'coś jest nie tak - sprawdź poprawność danych'
        this.failure = true
        this.autoClose()
      } else {
        const memberlegNumber = this.memberName.legitimationNumber
        const otherNameID = this.otherName.id
        fetch(`http://${this.local}/competitionMembersList/getMetricNumber?tournamentUUID=${this.tournamentUUID}&legNumber=${memberlegNumber}&otherID=${otherNameID}`, {
          method: 'GET'
        }).then(response => {
          if (response.status === 200) {
            response.text().then(response => {
              this.startNumber = response
              this.otherID = otherNameID
              this.getScoreInfoByLegitimation()
            })
          } else {
            response.text().then(response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
          }
        })
      }
    },
    getArbiters () {
      fetch(`http://${this.local}/member/getArbiters`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filtersArbiters = response
        })
    },
    getOtherArbiters () {
      fetch(`http://${this.local}/other/arbiters`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filtersOtherArbiters = response
        })
    },
    getGunInTournament () {
      fetch(`http://${this.local}/tournament/getGunInTournament?tournamentUUID=${this.tournamentUUID}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.gunsUsed = response
        })
    },
    createNewTournament (name, date) {
      const data = {
        name: name,
        date: date.replace(/\//gi, '-'),
        open: true,
        wzss: this.wzss
      }
      fetch(`http://${this.local}/tournament/`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 201) {
          response.text().then(response => {
            this.message = response
            this.success = true
            this.showloading()
            this.getListTournaments()
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
    createCompetition () {
      let name = null
      let numberOfManyShotsTable = null
      console.log('choice9 = ' + this.choice9)
      console.log('competitionName = ' + this.competitionName)
      if (this.choice10 !== null && this.choice10.lenght > 1) {
        this.choice10 = ' ' + this.choice10 + ' strzałów'
      } else {
        numberOfManyShotsTable = [this.dynamicChoice1, this.dynamicChoice2, this.dynamicChoice3]
        this.choice10 = ' ' + this.choice10 + ' strzałów'
      }
      if (this.choice !== null && this.choice !== '') {
        this.choice = this.choice + 'm '
      } else {
        this.choice = ''
      }
      if (this.competitionName !== null) {
        name = this.competitionName
      } else {
        name =
          this.choice + this.choice1 + this.choice2 + this.choice3 + this.choice4 + this.choice5 + this.choice6 + this.choice7 + this.choice8 + this.choice9 + this.choice10 + this.choice11
      }
      console.log('name = ' + name)
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
      fetch(`http://${this.local}/competition`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 201) {
          response.text().then(response => {
            this.message = response
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
            this.meters = false
            this.quantity = false
            this.success = true
            this.competitionName = null
            this.showloading()
            this.getListTournaments()
            this.getCompetitions()
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
    updateTournament () {
      const data = {
        name: this.tournamentName,
        date: this.tournamentDate.replace(/\//gi, '-')
      }
      try {
        const response = fetch(`http://${this.local}/tournament/${this.tournamentUUID}`, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const message = response.text()
          this.message = message
          this.tournamentName = ''
          this.tournamentDate = ''
          this.success = true
          this.showloading()
          this.getListTournaments()
          this.autoClose()
        } else {
          const message = response.text()
          this.message = message
          this.failure = true
          this.autoClose()
        }
      } catch (error) {
        console.error(error)
        this.message = 'An error occurred while updating the tournament.'
        this.failure = true
        this.autoClose()
      }
    },
    addMemberToCompetition () {
      const { listOfCompetitions, listOfAddAmmo, local } = this
      const memberlegNumber = this.memberName.legitimationNumber
      const otherNameID = this.otherName.id
      const competitionUUIDList = listOfCompetitions.map(name => name.replaceAll(',', '.'))
      const url = `http://${local}/competitionMembersList/addMember?competitionUUIDList=${competitionUUIDList}&addAmmoList=${listOfAddAmmo}&legitimationNumber=${memberlegNumber}&otherPerson=${otherNameID}`
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          if (response.status === 200) {
            response.text().then(
              response => {
                this.message = response
                this.success = true
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
        }
      }).catch(() => {
        this.message = 'Coś się nie udało'
        this.failure = true
        this.autoClose()
      })
    },
    removeMemberFromCompetition () {
      const memberlegNumber = this.memberName.legitimationNumber
      const otherNameID = this.otherName.id
      const list = []
      for (let i = 0; i < this.listOfCompetitions.length; i++) {
        list.push(this.listOfCompetitions[i].replaceAll(',', '.'))
      }
      fetch(`http://${this.local}/competitionMembersList/removeMember?competitionNameList=${list}&legitimationNumber=${memberlegNumber}&otherPerson=${otherNameID}`, {
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
      fetch(`http://${this.local}/tournament/addCompetition/${this.tournamentUUID}?competitionsUUID=${this.competitionAddToTournamentList}`, {
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
      fetch(`http://${this.local}/tournament/${this.tournamentUUID}`, {
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
              this.tournaments = null
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
    openTournament () {
      fetch(`http://${this.local}/tournament/open/${this.tournamentUUID}?pinCode=${this.code}`, {
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
      fetch(`http://${this.local}/tournament/delete/${this.tournamentUUID}?pinCode=${this.code}`, {
        method: 'DELETE',
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
              this.getListTournaments()
              this.getClosedTournaments()
              this.autoClose()
            })
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
    getClosedTournaments (pageNumber) {
      if (pageNumber < 0) {
        this.pageNumber = 0
      }
      fetch(`http://${this.local}/tournament/closedList?page=${pageNumber}&size=15`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.tournamentsClosed = response
        })
    },
    removeArbiter (member) {
      const memberUUID = member.uuid
      const otherId = member.id
      fetch(`http://${this.local}/tournament/removeArbiter/${this.tournamentUUID}?memberUUID=${memberUUID}&id=${otherId}`, {
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
              this.otherArbitersList = ''
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
    removeRTSArbiter (member) {
      const memberUUID = member.uuid
      const otherId = member.id
      fetch(`http://${this.local}/tournament/removeRTSArbiter/${this.tournamentUUID}?memberUUID=${memberUUID}&id=${otherId}`, {
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
              this.otherRTSArbitersList = ''
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
    addMainArbiterToTournament (member) {
      const memberUUID = member.uuid
      const otherId = member.id
      fetch(`http://${this.local}/tournament/addMainArbiter/${this.tournamentUUID}?memberUUID=${memberUUID}&id=${otherId}`, {
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
              this.otherMainArbiterName = ''
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
    addRTSArbiterToTournament (member) {
      const memberUUID = member.uuid
      const otherId = member.id
      fetch(`http://${this.local}/tournament/addRTSArbiter/${this.tournamentUUID}?memberUUID=${memberUUID}&id=${otherId}`, {
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
              this.otherRTSArbiterName = ''
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
    addOtherArbiterToTournament (member) {
      const memberUUID = member.uuid
      const otherId = member.id
      fetch(`http://${this.local}/tournament/addOthersArbiters/${this.tournamentUUID}?memberUUID=${memberUUID}&id=${otherId}`, {
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
              this.otherArbitersList = ''
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
    addOtherRTSArbiterToTournament (member) {
      const memberUUID = member.uuid
      const otherId = member.id
      fetch(`http://${this.local}/tournament/addOthersRTSArbiters/${this.tournamentUUID}?memberUUID=${memberUUID}&id=${otherId}`, {
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
              this.otherRTSArbitersList = ''
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
      fetch(`http://${this.local}/competitionMembersList/delete?tournamentUUID=${this.tournamentUUID}&competitionUUID=${this.competitionListUUID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.tournamentUUID = null
              this.competitionListUUID = ''
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
          this.options = this.filtersOther.filter(v => v.fullName.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filtersOther.filter(v => v.fullName.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterOtherArbiters (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filtersOtherArbiters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filtersOtherArbiters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterArbiters (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filtersArbiters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filtersArbiters.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    getAnnouncementFromCompetition () {
      this.showloading()
      axios({
        url: `http://${this.local}/files/downloadAnnouncementFromCompetition/${this.tournamentUUID}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `rezultaty${this.shootingPlace === 'prod' ? 'DZIESIĄTKA' : 'RSCPANASZEW'} ${this.date.replaceAll('-', '')}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAnnouncementFromCompetitionXLSX () {
      this.showloading()
      axios({
        url: `http://${this.local}/files/downloadAnnouncementFromCompetitionXLSX/${this.tournamentUUID}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `rezultaty${this.shootingPlace === 'prod' ? 'DZIESIĄTKA' : 'RSCPANASZEW'} ${this.date.replaceAll('-', '')}.xlsx`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getJudgeFromTournament (uuid, name, date) {
      axios({
        url: `http://${this.local}/files/downloadJudge/${uuid}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `Lista sędziów na zawodach ${name} ${date}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getMemberMetrics (info) {
      if (info.length < 1) {
        this.message = 'lista jest pusta - dodaj coś'
        this.failure = true
        this.autoClose()
        return
      }
      const { local, tournamentUUID, otherID, memberUUID, name, date } = this
      axios({
        url: `http://${local}/files/downloadMetric/${tournamentUUID}?otherID=${otherID}&memberUUID=${memberUUID}&competitions=${info}&startNumber=${this.startNumber}&a5rotate=${this.a5rotate}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `metryki ${name} ${date}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllClubsToTournament () {
      fetch(`http://${this.local}/club/tournament`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubs = response
        })
    },
    addGunToTournament (barcode) {
      fetch(`http://${this.local}/tournament/addGunToTournament?barcode=${barcode}&tournamentUUID=${this.tournamentUUID}`, {
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
      this.visible = false
      setTimeout(() => {
        this.gunAdded = false
        this.listDownload = false
        this.listOfCompetitions = []
        this.listOfAddAmmo = []
        this.competitionAddToTournamentList = []
        this.deleteTournamentAlert = false
        this.printAll = false
        this.addAllCompetition = false
        this.addAllAmmo = false
        this.dis = false
        this.message = null
        this.success = false
        this.failure = false
        this.barcode = null
      }, 2000)
    }
  }
}
</script>
