<template>
  <div>
    <div class="text-body2 bg-white">
      <q-card-section>
        <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista Konkurencji
        </div>
        <q-scroll-area dense class="full-width q-pa-none" style="height: 400px;">
          <div v-for="(comp,uuid) in competitions" :key="uuid">
            <div v-if="comp.name!=='BRAK'" class="col">
              <div class="row">
                <q-field dense class="col-5" label="Konkurencja" standout="bg-accent text-black" stack-label clickable>
                  <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{ comp.name }}
                  </div>
                </q-field>
                <q-field dense class="col-4" label="Kolejność na listach" standout="bg-accent text-black" stack-label
                         clickable>
                  <div class="self-center col full-width no-outline text-center text-black" tabindex="1">
                    {{ comp.ordering }}
                  </div>
                </q-field>
                <q-btn dense class="col-1" @click="competition=comp;competitionInfo=true"  icon="edit">
                  <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">
                    {{ comp.name }}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
            <p></p>
          </div>
        </q-scroll-area>
      </q-card-section>
    </div>
    <q-dialog v-model="competitionInfo">
      <q-card>
        <q-card-section class="text-bold">
          <div class="text-h6">{{competition.name}}</div>
          <div>ID: {{competition.uuid}}</div>
          <div>Dyscyplina: {{competition.discipline}}</div>
          <div>Ilość Strzałów: {{competition.numberOfShots}}</div>
          <div>Rodzaj: {{competition.type}}</div>
          <div class="row">Metoda Liczenia: <div v-if="competition.countingMethod === 'NORMAL'">: Normalnie</div><div v-else>{{competition.countingMethod}}</div></div>
          <div>Numer Kolejności na Listach: {{competition.ordering}}</div>
          <div>Ilość Strzałów próbnych: {{competition.practiceShots}}</div>
          <div>Kaliber: {{competition.caliberUUID}}</div>
          <q-field class="col-2 cursor-pointer" standout="bg-accent text-black" label="ZMIEŃ NUMER KOLEJNOŚCI NA LISTACH">
            <q-popup-edit @keypress.enter="compID=competition.uuid;updateCompetition()">
              <q-input v-model="orderNumber" input-class="text-center" dense autofocus stack-label label="zmień na inny numer" onkeypress="return (event.charCode > 47 && event.charCode < 58)" @keypress.enter="compID=competition.uuid,updateCompetition()"/>
              <div class="q-pa-xs">
                <q-btn align="left" color="primary" label="Anuluj" v-close-popup></q-btn>
                <q-btn align="right" color="primary" label="Zmień" v-close-popup @click="compID=competition.uuid;updateCompetition()"></q-btn>
              </div>
            </q-popup-edit>
          </q-field>
          <q-field class="col-2 cursor-pointer" standout="bg-accent text-black" label="ZMIEŃ ILOŚĆ STRZAŁÓW PRÓBNYCH">
            <q-popup-edit @keypress.enter="compID=competition.uuid;updateCompetition()">
              <q-input v-model="practiceShots" input-class="text-center" dense autofocus stack-label label="zmień na inny numer" onkeydown="return (event.charCode > 47 && event.charCode < 58)" @keypress.enter="compID=competition.uuid,updateCompetition()"/>
              <div class="q-pa-xs">
                <q-btn align="left" color="primary" label="Anuluj" v-close-popup></q-btn>
                <q-btn align="right" color="primary" label="Zmień" v-close-popup @click="compID=competition.uuid;updateCompetition()"></q-btn>
              </div>
            </q-popup-edit>
          </q-field>
          <q-field class="col-2 cursor-pointer" standout="bg-accent text-black" label="ZMIEŃ KALIBER">
            <q-popup-edit @keypress.enter="compID=competition.uuid;updateCompetition()">
              <q-input v-model="caliberUUID" input-class="text-center" dense autofocus stack-label label="zmień na inny numer" onkeypress="return (event.charCode > 47 && event.charCode < 58)" @keypress.enter="compID=competition.uuid,updateCompetition()"/>
              <div class="q-pa-xs">
                <q-btn align="left" color="primary" label="Anuluj" v-close-popup></q-btn>
                <q-btn align="right" color="primary" label="Zmień" v-close-popup @click="compID=competition.uuid;updateCompetition()"></q-btn>
              </div>
            </q-popup-edit>
          </q-field>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="failure">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'

export default {
  name: 'Competitions.vue',
  created () {
    this.getCompetitions()
  },
  data () {
    return {
      competitions: [],
      competition: [],
      compID: null,
      orderNumber: null,
      practiceShots: null,
      caliberUUID: null,
      competitionInfo: false,
      success: false,
      failure: false,
      message: null,
      local: App.host
    }
  },
  methods: {
    getCompetitions () {
      fetch('http://' + this.local + '/competition/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.competitions = response
        })
    },
    updateCompetition () {
      const data = {
        ordering: this.orderNumber,
        practiceShots: this.practiceShots,
        caliberUUID: this.caliberUUID
      }
      fetch('http://' + this.local + '/competition/update?uuid=' + this.compID, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              if (this.orderNumber !== null) {
                this.competition.ordering = this.orderNumber
              }
              if (this.practiceShots !== null) {
                this.competition.practiceShots = this.practiceShots
              }
              if (this.caliberUUID !== null) {
                this.competition.caliberUUID = this.caliberUUID
              }
              this.message = response
              this.success = true
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
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>

<style scoped>

</style>
