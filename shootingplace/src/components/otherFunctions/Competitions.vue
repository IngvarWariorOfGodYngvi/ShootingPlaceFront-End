<template>
  <div>
    <q-card class="bg-dark text-positive" >
      <div class="q-pa-md text-center full-width no-outline text-h5 text-bold">Lista Konkurencji
      </div>
      <div class="row col">
        <div class="q-pr-md">lp</div>
        <div class="col">Nazwa Konkurencji</div>
        <div class="col text-center">kolejność na listach</div>
        <div class="col-2 text-center">Ilość strzałów</div>
        <div class="col-2 text-center">Ilość strzałów próbnych</div>
        <div class="col-1 text-center"></div>
      </div>
      <q-scroll-area dense class="full-width q-pa-none" style="height: 400px;">
        <div v-for="(comp, index) in competitions" :key="index">
          <div v-if="comp.name !== 'BRAK'" class="col">
            <div class="row">
              <div class="self-center q-pr-md">{{ index + 1 }}</div>
              <div class="col self-center text-left text-positive">{{ comp.name }}</div>
              <div class="col self-center text-center text-positive">{{ comp.ordering }}</div>
              <div class="col-2 self-center text-center text-positive">{{ comp.numberOfShots }}</div>
              <div class="col-2 self-center text-center text-positive">{{ comp.practiceShots }}</div>
              <q-btn dense class="col-1" color="primary" @click="competition = comp;compID = competition.uuid; competitionInfo = true" icon="edit">
                <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">
                  {{ comp.name }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
          <p></p>
        </div>
      </q-scroll-area>
    </q-card>
    <q-dialog v-model="competitionInfo" @hide="getCompetitions()">
      <q-card class="bg-dark text-positive" @show="method = competition.countingMethod">
        <q-card-section class="text-bold">
          <div class="text-h6">{{ competition.name }}</div>
          <div>ID: {{ competition.uuid }}</div>
          <div>Dyscyplina: {{ competition.discipline }}</div>
          <div>Ilość Strzałów: {{ competition.numberOfShots }}</div>
          <div>Rodzaj: {{ competition.type }}</div>
          <div>Metoda Liczenia: {{ competition.countingMethod === 'NORMAL'?'Normalnie' : ' COMSTOCK' }}</div>
          <div>Numer Kolejności na Listach: {{ competition.ordering }}</div>
          <div>Ilość Strzałów próbnych: {{ competition.practiceShots }}</div>
          <div>Kaliber: {{ competition.caliberUUID }}</div>
          <q-input @keypress.enter="competitionInfo=false;acceptDialog=true" dense input-class="text-positive" label-color="positive" v-model="orderNumber" label="kolejność na listach" onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          <q-input @keypress.enter="competitionInfo=false;acceptDialog=true" dense input-class="text-positive" label-color="positive" v-model="numberOfShots" label="ilość strzałów ocenianych" onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          <q-input @keypress.enter="competitionInfo=false;acceptDialog=true" dense input-class="text-positive" label-color="positive" v-model="practiceShots" label="ilość strzałów próbnych" onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          <q-input @keypress.enter="competitionInfo=false;acceptDialog=true" dense input-class="text-positive" label-color="positive" v-model="caliberUUID" label="identyfikator kalibru"/>
          <q-input @keypress.enter="competitionInfo=false;acceptDialog=true" dense input-class="text-positive" label-color="positive" v-model="name" label="nazwa"/>
          <div>Metoda Liczenia : Normalnie<q-toggle v-model="method" keep-color color="primary" :val="competition.countingMethod" false-value="NORMAL" true-value="COMSTOCK" ></q-toggle>COMSTOCK</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="zapisz" color="primary" @click="acceptDialog = true" v-close-popup />
          <q-btn label="zamknij" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" acceptDialog " persistent>
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <q-input
            @keypress.enter=" updateCompetition(); acceptDialog = false "
            autofocus type="password" v-model=" code " filled color="Yellow" class="bg-yellow text-bold"
            mask="####"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn label="Przedłuż" color="black" v-close-popup
            @click=" updateCompetition(); code = null " />
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
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
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
      acceptDialog: false,
      compID: null,
      orderNumber: null,
      numberOfShots: null,
      practiceShots: null,
      caliberUUID: null,
      name: null,
      method: null,
      competitionInfo: false,
      code: null,
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
        caliberUUID: this.caliberUUID,
        name: this.name,
        countingMethod: this.method,
        numberOfShots: this.numberOfShots
      }
      fetch(`http://${this.local}/competition/update?uuid=${this.compID}&pinCode=${this.code}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.getCompetitions()
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
        this.code = null
        this.orderNumber = null
        this.practiceShots = null
        this.numberOfShots = null
        this.caliberUUID = null
        this.name = null
        this.method = null
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>

<style scoped></style>
