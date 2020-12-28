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
                label="dodaj nową konkurencję"
                @click="createNewCompetiton = true"
              ></q-btn>
          <q-dialog v-model="createNewCompetiton" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-item-section>
                  <q-item-label><b>Dodaj nową Konkurencję</b></q-item-label>
                  <q-label>Utworzenie nowej konkurencji da możliwość wybrania jej podczas kolejnych zawodów </q-label>
                  <div> Wybierz Dyscyplinę :
                  <q-radio v-model="choice" :val="'Pistolet'" label="Pistolet"></q-radio>
                  <q-radio v-model="choice" :val="'Karabin'" label="Karabin"></q-radio>
                  <q-radio v-model="choice" :val="'Strzelba'" label="Strzelba"></q-radio>
                  </div>
                  <div class="row"><q-label> Wpisz nazwę : </q-label>
                    <q-label> {{choice}} {{competitionName}}</q-label>
                  </div>
                    <q-input v-model="competitionName" label="nazwa zawodów">
                    </q-input>
                </q-item-section>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="zamknij" color="primary" v-close-popup @click="competitionName = '', choice = null" />
                <q-btn label="utwórz" color="primary" v-close-popup @click="createCompetition()"/>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-card-section>
      </q-card>
    <q-list bordered>
      <q-expansion-item expand-separator v-for="tournaments in tournaments" :key="tournaments.uuid" group="tournaments" class="bg-grey-3 text-h6">
        <template v-slot:header class="row">
          <q-item-section>
            <q-item-label
              >{{ tournaments.name }} {{ tournaments.date }}</q-item-label
            >
          </q-item-section>
          <q-item-section side top >
            <div class="row">
              <q-item v-if="tournaments.open"><q-btn color="primary" label="Aktualizuj" @click="(uuid = tournaments.uuid), (tournamentUpdateConfirm = true) "/></q-item>
              <q-item v-if="tournaments.open"><q-btn color="warning" label="Zamknij zawody" @click="(uuid = tournaments.uuid), (tournamentCloseConfirm = true) "/></q-item>
              <q-item v-if="!tournaments.open"><q-item-label>Zawody zamknięte</q-item-label></q-item>
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
            </div>
          </q-item-section>
        </template>
        <div class="bg-grey-3">
          <q-expansion-item expand-separator group="tournament-ads" label="Sędziowie" class="bg-grey-2">
            <div class="bg-grey-1">
              <q-item v-if="tournaments.mainArbiter==null && tournaments.commissionRTSArbiter==null && tournaments.arbitersList.lenght<1">
                <q-field class="col" standout stack-label>
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">Lista sędziów jest pusta</div>
                  </template>
                </q-field>
              </q-item>
              <q-item v-if="tournaments.open"><q-btn label="dodaj sędziów" @click="(uuid = tournaments.uuid),addArbitersConfirmbtn = true"></q-btn></q-item>
              <q-item v-if="tournaments.mainArbiter!=null">
                <q-field class="col" standout stack-label label="Sędzia Główny Zawodów">
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">{{tournaments.mainArbiter.firstName}} {{tournaments.mainArbiter.secondName}}</div>
                  </template>
                </q-field>
              </q-item>
              <q-item v-if="tournaments.commissionRTSArbiter!=null">
                <q-field class="col" standout stack-label label="Sędzia Obliczeniowy">
                  <template v-slot:control>
                    <div class="self-center col full-width no-outline" tabindex="0">{{tournaments.commissionRTSArbiter.firstName}} {{tournaments.commissionRTSArbiter.secondName}}</div>
                  </template>
                </q-field>
              </q-item>
              <div class="col" v-if="tournaments.commissionRTSArbiter!=null">
                <q-item v-for="arbiters in tournaments.arbitersList" :key="arbiters">
                <q-item-section>
                <q-field standout stack-label label="Sędzia Pomocniczy">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{arbiters.firstName}} {{arbiters.secondName}}</div>
                  </template>
                </q-field>
                </q-item-section>
                </q-item>
              </div>
            </div>
          </q-expansion-item>
        </div>
        <q-card >
            <q-expansion-item expand-separator group="tournament-ads" class="text-h6" label="Konkurencje">
                      <div class="row bg-grey-2">
        <q-item v-if="tournaments.open"><q-btn label="dodaj konkurencje" @click="(uuid = tournaments.uuid),addCompetitionConfirmbtn = true"></q-btn></q-item>
          <q-dialog v-model="addCompetitionConfirmbtn" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-item-section v-if="tournaments.open">
                  <q-item-label>Dodaj Konkurencje</q-item-label>
                  <q-item
                    v-for="competitions in competitions"
                    :key="competitions.uuid"
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
                  <q-item v-if="otherArbiter!=null"><q-btn label="usuń sędziego pomocniczego" color="primary" v-close-popup @click="removeArbiter()"/></q-item>
                  <q-item v-if="otherArbiter!=null"><q-btn  label="Dodaj" color="primary" @click="addOtherArbiterToTournament()"/></q-item>
                  </div>
                </q-item-section>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="zamknij" color="primary" v-close-popup @click="mainArbiter=null,countArbiter=null,otherArbiter=null"/>
              </q-card-actions>
            </q-card>
          </q-dialog>
            <q-item v-if="!tournaments.open"><q-btn label="generuj plik"></q-btn></q-item>
          </div>
              <q-expansion-item expand-separator group="tournament-competition" v-for="competitionsList in tournaments.competitionsList" :key="competitionsList" class="full-width" :label="competitionsList.name">
                <div class="row">
                <q-card-section>
                  <q-field class="col" standout stack-label>
                    <template v-slot:control>
                      <div class="text-h6 self-center col full-width no-outline" tabindex="0">{{ competitionsList.name }}</div>
                    </template>
                  </q-field>
                <q-select v-if="tournaments.open" filled v-model="memberName" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterFn" label="Dodaj osobę">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <div class="row">
                  <q-item><q-btn v-if="tournaments.open" label="Usuń z listy" @click="(competitionUUID = competitionsList.uuid),removeFromList=true"></q-btn></q-item>
                  <q-item><q-btn v-if="tournaments.open" label="Dodaj do listy" @click="(competitionUUID = competitionsList.uuid),(addMemberConfirm = true)"></q-btn></q-item>
                </div>
                </q-card-section>
                <q-card-section>
                  <q-expansion-item label="Lista osób startujących" default-opened>
                  <div class="row text-body2" v-for="membersList in competitionsList.membersList" :key="membersList">
                  <ol>{{membersList.secondName}} {{membersList.firstName}}</ol>
                  <q-dialog v-model="removeFromList">
                    <q-card>
                      <q-card-section>
                        <div class="text-h6">Usunąć zawodnika z listy startujących w konkurencji?</div>
                      </q-card-section>
                      <!-- <q-item-section>
                      <q-item class="col" v-for="ammo in members.personalEvidence.ammo" :key="ammo" >{{ammo}}</q-item>
                      </q-item-section> -->

                      <q-card-actions align="right">
                        <q-btn flat label="anuluj" color="primary" v-close-popup />
                        <q-btn label="usuń" color="warning" v-close-popup @click="removeMemberFromCompetition(competitionUUID, finder),finder = null"/>
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                  </div>
                  </q-expansion-item>
                </q-card-section>
                </div>
              </q-expansion-item>
              </q-expansion-item>
        </q-card>
      </q-expansion-item>
    </q-list>
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
            @click="closeTournament(uuid)"
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
  </q-page>
</template>

<script>
const stringOptions = []
export default {
  data () {
    return {
      val: [],
      uuid: null,
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
      tournaments: [],
      competitions: [],
      filters: [],
      filtersPermission: [],
      tournamentName: '',
      tournamentDate: '',
      options: stringOptions,
      finder: '',
      mainArbiter: null,
      countArbiter: null,
      otherArbiter: null,
      competitionRadio: '',
      removeFromList: false,
      memberName: null
    }
  },
  created () {
    this.getListTournaments()
    this.getcompetitions()
  },
  methods: {
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
        name: this.choice + ' ' + this.competitionName
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
          this.choice = null
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
      fetch('http://localhost:8080/tournament/' + this.uuid, {
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
    addMemberToCompetition (uuid, finder) {
      const memberNameWord = this.memberName.split(' ')
      var legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      fetch('http://localhost:8080/competitionMembersList/addMember?competitionUUID=' + uuid + '&legitimationNumber=' + memberNameUUID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addMemberAlert = true
          this.showloading()
          this.getListTournaments()
        } else { this.memberFailure = true }
      })
    },
    removeMemberFromCompetition (uuid, finder) {
      const memberNameWord = this.memberName.split(' ')
      var legNumber = memberNameWord.length
      const memberNameUUID = memberNameWord[legNumber - 1]
      fetch('http://localhost:8080/competitionMembersList/removeMember?competitionUUID=' + uuid + '&legitimationNumber=' + memberNameUUID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.removeMemberAlert = true
        } else { this.memberFailure = true }
      })
    },
    addCompetitonToTournament () {
      if (this.competitionRadio != null && this.competitionRadio !== '') {
        fetch('http://localhost:8080/tournament/addCompetition/' + this.uuid + '?competitionUUID=' + this.competitionRadio, {
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
    closeTournament (uuid) {
      fetch('http://localhost:8080/tournament/' + uuid, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.tournamentCloseAlert = true
          this.showloading()
          this.getListTournaments()
        }
      })
    },
    removeArbiter () {
      const otherArbiterWord = this.otherArbiter.split(' ')
      const otherArbiterUUID = otherArbiterWord[2]
      fetch('http://localhost:8080/tournament/removeArbiter/' + this.uuid + '?memberUUID=' + otherArbiterUUID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            this.removeArbiterAlert = true,
            this.showloading(),
            this.getListTournaments()
          )
        } else { this.arbiterFailure = true }
      })
    },
    addMainArbiterToTournament () {
      const mainArbiterWord = this.mainArbiter.split(' ')
      const mainArbiterUUID = mainArbiterWord[2]
      fetch('http://localhost:8080/tournament/addMainArbiter/' + this.uuid + '?memberUUID=' + mainArbiterUUID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addArbiterAlert = true
          this.showloading()
          this.getListTournaments()
        } else { this.arbiterFailure = true }
      })
    },
    addRTSArbiterToTournament () {
      const countArbiterWord = this.countArbiter.split(' ')
      const countArbiterUUID = countArbiterWord[2]
      fetch('http://localhost:8080/tournament/addRTSArbiter/' + this.uuid + '?memberUUID=' + countArbiterUUID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addArbiterAlert = true
          this.showloading()
          this.getListTournaments()
        } else { this.arbiterFailure = true }
      })
    },
    addOtherArbiterToTournament () {
      const otherArbiterWord = this.otherArbiter.split(' ')
      const otherArbiterUUID = otherArbiterWord[2]
      // const memberNameWord = this.memberName.split(' ')
      // var legNumber = memberNameWord.length
      // const memberNameUUID = memberNameWord[legNumber - 1]
      fetch('http://localhost:8080/tournament/addOthersArbiters/' + this.uuid + '?memberUUID=' + otherArbiterUUID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.addArbiterAlert = true
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
    }
  },
  name: 'tournament'
}
</script>
