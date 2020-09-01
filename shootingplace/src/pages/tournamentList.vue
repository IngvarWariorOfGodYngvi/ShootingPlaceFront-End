<template>
  <q-page padding class="q-pa-md">
      <q-list>
      <q-expansion-item v-for="tournaments in tournaments" :key="tournaments.uuid" group="somegroup" >
          <template v-slot:header class="row">
          <q-item-section>
          <q-item-label>{{tournaments.name}} {{tournaments.date}}</q-item-label>
          </q-item-section>
          <q-item-section side top>
          <q-item v-if="tournaments.open"><q-btn color="warning" label="Zamknij zawody" @click="uuid=tournaments.uuid,tournamentCloseConfirm=true"/></q-item>
          <q-item v-if="!tournaments.open"><q-item-label>Zawody dą już zamknięte</q-item-label></q-item>
          </q-item-section>
        </template>
        <q-card class="row">
      <q-card-section>
      <q-item-section >
          <q-item-section>
              <q-item v-if="tournaments.mainArbiter!=null"><q-item-label>Sędzia Główny Zawodów {{tournaments.mainArbiter.firstName}} {{tournaments.mainArbiter.secondName}}</q-item-label></q-item>
          </q-item-section>
          <q-item-section>
              <q-item v-if="tournaments.commissionRTSArbiter!=null"><q-item-label>Sędzia RTS {{tournaments.commissionRTSArbiter.firstName}} {{tournaments.commissionRTSArbiter.secondName}}</q-item-label></q-item>
          </q-item-section>
          <q-item-section v-if="tournaments.open">
        <q-item><q-item-label>Zmień nazwę zawodów</q-item-label></q-item>
        <q-item><q-input v-model="tournamentName" filled label="Zmień nazwę"/></q-item>
        <q-item><q-btn label="zmień" color="primary" @click="uuid=tournaments.uuid,tournamentConfirm=true"/></q-item>
        <q-item><q-item-label>Zmień datę zawodów</q-item-label></q-item>
        <q-item><q-input v-model="tournamentDate" filled placeholder="YYYY-MM-DD" hint="YYYY-MM-DD" label="Zmień datę"/></q-item>
        <q-item><q-btn label="zmień" color="primary" @click="uuid=tournaments.uuid,tournamentDateConfirm=true"/></q-item>
        <q-item><q-item-label>Dodaj Sędziego Głównego zawodów</q-item-label></q-item>
        <q-item><q-input v-model="memberArbiterLegitimation" filled placeholder="Numer Legitymacji" hint="Numer Legitymacji" label="Sędzia Główny"/></q-item>
        <q-item><q-btn label="dodaj" color="primary" @click="uuid=tournaments.uuid,tournamentMainArbiterConfirm=true"/></q-item>
        <q-item><q-item-label>Dodaj Sędziego Komisji RTS zawodów</q-item-label></q-item>
        <q-item><q-input v-model="memberArbiterLegitimationRTS" filled placeholder="Numer Legitymacji" hint="Numer Legitymacji" label="Przewodniczący RTS"/></q-item>
        <q-item><q-btn label="dodaj" color="primary" @click="uuid=tournaments.uuid,tournamentRTSArbiterConfirm=true"/></q-item>
          </q-item-section>
      </q-item-section>
      </q-card-section>
      <q-card-section>
      <q-item-section v-if="tournaments.open">
        <q-item-label>Dodaj Klubowicza</q-item-label>
        <q-item v-for="competitionList in tournaments.competitionList" :key="competitionList.uuid" ><q-checkbox :label="competitionList.name" v-model="val[competitionList.name]"/></q-item>
        <q-item><q-input v-model="memberLegitimation" filled label="Numer Legitymacji Klubowej"/></q-item>
        <q-item><q-btn label="Dodaj" color="primary" @click="uuid=tournaments.uuid,addMemberConfirm=true"/></q-item>
      </q-item-section>
        </q-card-section>
        <q-card-section>
        <q-item-section>
            <q-item><q-item-label>Konkurencje</q-item-label></q-item>
            <!-- <q-item v-for="competitionList in tournaments.competitionList" :key="competitionList.uuid"><q-item-label>{{competitionList.name}}</q-item-label></q-item> -->
            <q-item v-for="(uuid) in tournaments.map" :key="uuid" ><q-item-label></q-item-label></q-item>
            <q-item><q-item-label>Lista Startujących</q-item-label></q-item>
            <q-item class="col" v-for="uuid in tournaments.members" :key="uuid">
            <q-item-label>{{uuid.firstName}} {{uuid.secondName}}</q-item-label>
            </q-item>
        </q-item-section>
        </q-card-section>
        </q-card>
      </q-expansion-item>
      </q-list>
<q-dialog v-model="tournamentConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy zmienić nazwę zawodów?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Zmień" color="primary" v-close-popup @click="updateTournament (uuid, tournamentName),tournamentAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="tournamentDateConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy zmienić datę zawodów?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Zmień" color="primary" v-close-popup @click="updateTournament (uuid, tournamentDate),tournamentDateAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="tournamentMainArbiterConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy zmienić Sędziego Głównego zawodów?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Zmień" color="primary" v-close-popup @click="addMainArbiter (uuid, memberArbiterLegitimation),tournamentMainArbiterAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="tournamentRTSArbiterConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy zmienić Komisji RTS zawodów?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Zmień" color="primary" v-close-popup @click="addMainArbiter (uuid, memberArbiterLegitimation),tournamentRTSArbiterAlert=true" />
        </q-card-actions>
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
          <q-btn flat label="anuluj" v-close-popup />
          <q-btn flat label="Zamknij" v-close-popup @click="closeTournament(uuid),tournamentCloseAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addMemberConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="add" color="primary"/>
          <span class="q-ml-sm">Czy dodać Klubowicza do zawodów?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup />
          <q-btn flat label="Dodaj" color="primary" v-close-popup @click="addMemberToTournament (uuid, memberLegitimation),addMemberAlert=true" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="tournamentAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zmieniono nazwę zawodów</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListTournaments()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="tournamentDateAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zmieniono datę zawodów</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListTournaments()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="tournamentMainArbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zmieniono Sędziego Głównego zawodów</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListTournaments()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="tournamentRTSArbiterAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zmieniono Sędziego Komisji RTS zawodów</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListTournaments()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="tournamentCloseAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Zawody są już zamknięte</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListTournaments()" />
        </q-card-actions>
      </q-card>
</q-dialog>
<q-dialog v-model="addMemberAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Dodano Klubowicza</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="showloading(),getListTournaments()" />
        </q-card-actions>
      </q-card>
</q-dialog>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      val: [],
      uuid: null,
      tournamentConfirm: false,
      tournamentAlert: false,
      tournamentDateConfirm: false,
      tournamentDateAlert: false,
      tournamentMainArbiterConfirm: false,
      tournamentMainArbiterAlert: false,
      tournamentCloseConfirm: false,
      tournamentCloseAlert: false,
      tournamentRTSArbiterConfirm: false,
      tournamentRTSArbiterAlert: false,
      addMemberConfirm: false,
      addMemberAlert: false,
      tournaments: [],
      tournamentName: '',
      tournamentDate: '',
      memberLegitimation: '',
      memberArbiterLegitimation: null,
      memberArbiterLegitimationRTS: null
    }
  },
  created () {
    this.getListTournaments()
  },
  methods: {
    getListTournaments () {
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
    updateTournament (uuid, name, date) {
      var data = {
        name: this.tournamentName,
        date: this.tournamentDate
      }
      fetch('http://localhost:8080/tournament/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(tournaments => {
          this.tournaments = tournaments
          this.tournamentName = ''
          this.tournamentDate = ''
        })
    },
    addMemberToTournament (uuid, memberLegitimation) {
      fetch('http://localhost:8080/tournament/addMember' + uuid + '?memberLegitimation=' + memberLegitimation, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(tournaments => {
          this.tournaments = tournaments
          this.memberLegitimation = ''
        })
    },
    closeTournament (uuid) {
      fetch('http://localhost:8080/tournament/' + uuid, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(tournaments => {
          this.tournaments = tournaments
        })
    },
    addMainArbiter (uuid, memberArbiterLegitimation) {
      fetch('http://localhost:8080/tournament/addMainArbiter' + this.uuid + '?memberLegitimation=' + memberArbiterLegitimation, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(tournaments => {
          this.tournaments = tournaments
          this.memberArbiterLegitimation = null
        })
    },
    addRTSArbiter (uuid, memberArbiterLegitimationRTS) {
      fetch('http://localhost:8080/tournament/addRTSArbiter' + this.uuid + '?memberLegitimation=' + memberArbiterLegitimationRTS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(tournaments => {
          this.tournaments = tournaments
          this.memberArbiterLegitimationRTS = null
        })
    }
  },
  name: 'tournament'
}
</script>
