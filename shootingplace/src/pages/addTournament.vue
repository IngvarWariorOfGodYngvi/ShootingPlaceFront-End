<template>
  <q-page padding>
    <div class="row">
        <div>
<q-card class="row">
    <q-card-section>
      <q-item-section>
          <div class="col">
        <q-item><q-item-label>Nazwa zawodów</q-item-label></q-item>
        <q-item><q-input v-model="tournamentName" filled label="Nazwa"/></q-item>
        <q-item><q-btn label="Dodaj" color="primary" @click="tournamentConfirm=true"/></q-item>
        <q-item><q-item-label>Data zawodów</q-item-label></q-item>
        <q-item><q-input v-model="tournamentDate" filled placeholder="YYYY-MM-DD" hint="YYYY-MM-DD" label="Data"/></q-item>
        <q-item><q-btn label="Dodaj" color="primary" @click="tournamentDateConfirm=true"/></q-item>
        <q-item><q-item-label>Dodaj Sędziego Głównego zawodów</q-item-label></q-item>
        <q-item><q-input v-model="memberArbiterLegitimation" filled placeholder="Numer Legitymacji" hint="Numer Legitymacji" label="Sędzia Główny"/></q-item>
        <q-item><q-btn label="dodaj" color="primary" @click="tournamentMainArbiterConfirm=true"/></q-item>
        <q-item><q-item-label>Dodaj Sędziego Komisji RTS zawodów</q-item-label></q-item>
        <q-item><q-input v-model="memberArbiterLegitimationRTS" filled placeholder="Numer Legitymacji" hint="Numer Legitymacji" label="Przewodniczący RTS"/></q-item>
        <q-item><q-btn label="dodaj" color="primary" @click="tournamentRTSArbiterConfirm=true"/></q-item>
          </div>
      </q-item-section>
      </q-card-section>
</q-card>
  </div>
    </div>
<q-dialog v-model="memberAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Witamy w Klubie</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Od tej chwili jesteś skazany na przenoszenie szaf z piętra na parter.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
</q-dialog>

  </q-page>
</template>

<script >
export default {
  data () {
    return {
      val: false,
      val1: false,
      val2: false,
      val3: false,
      val4: false,
      val5: false,
      uuid: null,
      tournamentName: null,
      tournamentDate: null,
      memberArbiterLegitimation: null,
      memberArbiterLegitimationRTS: null
    }
  },
  methods: {
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
  name: 'addTournament'
}
</script>
