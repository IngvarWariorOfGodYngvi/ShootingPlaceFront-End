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
      <q-expansion-item v-for="tournaments in tournaments" :key="tournaments.uuid" group="tournaments" class="bg-grey-3">
        <template v-slot:header class="row">
          <q-item-section>
            <q-item-label
              >{{ tournaments.name }} {{ tournaments.date }} {{tournaments.uuid}}</q-item-label
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
          <q-expansion-item label="Sędziowie" class="bg-grey-2">
            <div class="bg-grey-1">
              <q-item v-if="tournaments.open"><q-btn label="dodaj sędziów" @click="(uuid = tournaments.uuid),addArbitersConfirmbtn = true"></q-btn></q-item>
              <q-item v-if="tournaments.mainArbiter!=null"><q-item-label>Sędzia Główny Zawodów : {{tournaments.mainArbiter.firstName}} {{tournaments.mainArbiter.secondName}}</q-item-label></q-item>
              <q-item v-if="tournaments.commissionRTSArbiter!=null"><q-item-label>Sędzia Obliczeniowy : {{tournaments.commissionRTSArbiter.firstName}} {{tournaments.commissionRTSArbiter.secondName}}</q-item-label></q-item>
              <q-item v-for="arbiters in tournaments.arbitersList" :key="arbiters"><q-item-label>Sędzia Pomocniczy : {{arbiters.firstName}} {{arbiters.secondName}}</q-item-label></q-item>
            </div>
          </q-expansion-item>
        </div>
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
                <q-item v-if="mainArbiter!=null"><q-btn label="Dodaj" color="primary" @click="addMainArbiterToTournament(),addArbiterAlert=true"/></q-item>
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
                <q-item v-if="countArbiter!=null"><q-btn label="Dodaj" color="primary" @click="addRTSArbiterToTournament(),addArbiterAlert=true"/></q-item>
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
                  <q-item v-if="otherArbiter!=null"><q-btn  label="Dodaj" color="primary" @click="addOtherArbiterToTournament(),addArbiterAlert=true"/></q-item>
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
        <q-card >
          <q-card-section class="col">
            <q-item class="bg-grey-2"><q-item-label class="text-h6">Konkurencje</q-item-label></q-item>
              <div v-for="competitionsList in tournaments.competitionsList" :key="competitionsList" class="row">
                <q-card-section>
                <q-item><q-item-label>{{ competitionsList.name }}</q-item-label></q-item>
                <q-select v-if="tournaments.open" filled v-model="finder" use-input hide-selected fill-input input-debounce="0" :options="options" @filter="filterFn" style="width: 250px; padding-bottom: 32px" label="Nazwisko">
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
                  <q-item class="row" v-for="uuid in competitionsList.membersList" :key="uuid">
                  <ol>{{uuid.secondName}} {{uuid.firstName}}</ol>
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
                        <q-btn label="usuń" color="warning" v-close-popup @click="removeMemberFromCompetition(competitionUUID, finder),removeMemberAlert = true,finder = null"/>
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                  </q-item>
                  </q-expansion-item>
                </q-card-section>
              </div>
          </q-card-section>
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
            @click="showloading(), getListTournaments()"
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
            @click="closeTournament(uuid), (tournamentCloseAlert = true)"
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
                (addMemberAlert = true),
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
          <q-btn flat label="Dodaj" color="primary" @click=" createNewTournament(tournamentName,tournamentDate),tournamentAlert=true" v-close-popup />
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
            @click="showloading(), getListTournaments()"
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
            @click="showloading(), getListTournaments()"
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
            v-close-popup
            @click="showloading(), getListTournaments(), getcompetitions()"
          />
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
            @click="showloading(), getListTournaments(), getcompetitions()"
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
            @click="showloading(), getcompetitions()"
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
      removeFromList: false
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
      }).then(response => response.json())
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
          this.competitionName = ''
          this.choice = null
          this.newCompetitionAlert = true
        } else {
          this.failure = true
          this.competitionName = ''
          this.choice = null
        }
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
        }
      })
    },
    addMemberToCompetition (uuid, finder) {
      const word = finder.split(' ')
      const memberUUID = word[2]
      fetch('http://localhost:8080/competitionMembersList/addMember?competitionUUID=' + uuid + '&memberUUID=' + memberUUID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
    },
    removeMemberFromCompetition (uuid, finder) {
      const word = finder.split(' ')
      const memberUUID = word[2]
      fetch('http://localhost:8080/competitionMembersList/removeMember?competitionUUID=' + uuid + '&memberUUID=' + memberUUID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
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
            response.json().then(
              this.addCompetitionAlert = true
            )
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
          response.json().then(
            this.tournamentCloseAlert = true
          )
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
          response.json().then(
          )
        } else { this.arbiterFailure = true }
      })
      this.showloading()
      this.getListTournaments()
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
          response.json().then(
          )
        } else { this.arbiterFailure = true }
      })
      this.showloading()
      this.getListTournaments()
    },
    addOtherArbiterToTournament () {
      const otherArbiterWord = this.otherArbiter.split(' ')
      const otherArbiterUUID = otherArbiterWord[2]
      fetch('http://localhost:8080/tournament/addOthersArbiters/' + this.uuid + '?memberUUID=' + otherArbiterUUID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
          )
        } else { this.arbiterFailure = true }
      })
      this.showloading()
      this.getListTournaments()
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
