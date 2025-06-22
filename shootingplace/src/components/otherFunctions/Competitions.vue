<template>
  <div>
    <q-card class="bg-dark text-positive" >
      <div class="q-pa-md text-center full-width no-outline text-h5 text-bold">Lista Konkurencji
      </div>
      <div class="row col">
        <div class="col-4 self-center">Lp Nazwa Konkurencji</div>
        <div class="col text-center">Kolejność<br/>na listach</div>
        <div class="col text-center">Dyscypliny</div>
        <div class="col text-center">Metoda<br/>Liczenia</div>
        <div class="col-2 text-center">Ilość strzałów<br/>ocenianych</div>
        <div class="col-2 text-center">Ilość strzałów<br/>próbnych</div>
        <!-- <div class="col-1 text-center"></div> -->
      </div>
      <p></p>
      <q-scroll-area dense class="full-width q-pa-none" style="height: 400px;">
        <draggable v-model="array" group="people" @start="drag=true" @end="drag=false">
        <div v-for="(comp, index) in competitions" :key="index" class="col hover1 q-mb-xs" @dblclick="competition = comp;compID = competition.uuid; competitionInfo = true;getCountingMethods();getCalibersList(),getCompetitionTypes(),getDisciplines()">
            <div class="row">
              <Tooltip2clickTip/>
              <div class="col-4 self-center">{{ index + 1 }} {{ comp.name }}</div>
              <div class="col self-center text-center">{{ comp.ordering }}</div>
              <div class="col self-center text-center">{{ comp.disciplineList.length>0 ? arrayToString(comp.disciplineList) : comp.discipline }}</div>
              <div class="col self-center text-center">{{ comp.countingMethod }}</div>
              <div class="col-2 self-center text-center">{{ comp.numberOfShots }}</div>
              <div class="col-2 self-center text-center">{{ comp.practiceShots }}</div>
              <!-- <q-btn dense class="col-1" color="primary" icon="edit">
                <q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">
                  {{ comp.name }}
                </q-tooltip>
              </q-btn> -->
            </div>
          </div>
        </draggable>
      </q-scroll-area>
    </q-card>
    <q-dialog v-model="competitionInfo" @hide="getCompetitions()">
      <q-card class="bg-dark text-positive" @show="method = competition.countingMethod">
        <q-card-section class="text-bold">
          <div class="text-h6">{{ competition.name }}</div>
          <div>ID: {{ competition.uuid }}</div>
          <div v-if="competition.disciplineList!=null&&competition.disciplineList.length>0">dyscypliny: {{ arrayToString(competition.disciplineList) }}</div>
          <div v-else>Dyscyplina: {{ competition.discipline }}</div>
          <div>Ilość Strzałów: {{ competition.numberOfShots }}</div>
          <div>Rodzaj: {{ competition.type }}</div>
          <div>Metoda Liczenia: {{ competition.countingMethod === 'NORMAL'?'Normalnie' : ' COMSTOCK' }}</div>
          <div>Numer Kolejności na Listach: {{ competition.ordering }}</div>
          <div>Ilość Strzałów próbnych: {{ competition.practiceShots }}</div>
          <div>Kaliber: {{ competition.caliberUUID }}</div>
          <q-input @keypress.enter="competitionInfo=false;acceptDialog=true" dense input-class="text-positive" label-color="positive" v-model="name" label="nazwa"/>
          <q-checkbox class="col" v-for="(item,index) in disciplines" :key="index" :val="item" :label="item" v-model="disciplineList"/>
          <q-input @keypress.enter="competitionInfo=false;acceptDialog=true" dense input-class="text-positive" label-color="positive" v-model="orderNumber" label="kolejność na listach" onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          <q-input @keypress.enter="competitionInfo=false;acceptDialog=true" dense input-class="text-positive" label-color="positive" v-model="numberOfShots" label="ilość strzałów ocenianych" onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          <q-input @keypress.enter="competitionInfo=false;acceptDialog=true" dense input-class="text-positive" label-color="positive" v-model="practiceShots" label="ilość strzałów próbnych" onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          <q-select dense options-dense input-class="text-positive" options-selected-class="bg-dark text-positive" clearable clear-icon="cancel" label-color="positive" popup-content-class="bg-dark text-positive" :options="countingTypes" v-model="competitionType" use-input hide-selected fill-input label="Rodzaj"/>
          <q-select
           :option-value="opt => opt !== '' ? Object(opt.uuid).toString() : ''"
           :option-label="opt => opt !== '' ? Object(opt.name).toString() : ''"
           dense options-dense input-class="text-positive" options-selected-class="bg-dark text-positive" clearable clear-icon="cancel" label-color="positive" popup-content-class="bg-dark text-positive" :options="calibersList" v-model="caliberUUID" use-input hide-selected fill-input label="identyfikator kalibru"/>
          <q-radio v-for="(item,index) in countingMethods" :key="index" :label="item" class="col" :val="item" v-model="method"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="usuń" color="primary" @click="deleteCopmetition = true" v-close-popup />
          <q-btn label="zapisz" color="primary" @click="acceptDialog = true" v-close-popup />
          <q-btn label="zamknij" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteCopmetition"
      @keypress.enter="deleteCopmetitionCode = true; deleteCopmetition = false">
      <q-card class="bg-dark text-positive">
        <q-card-section class="items-center">
          <p class="q-ml-sm text-h6 text-center col">Czy na pewno chcesz usunąć Konkurencję?</p>
          <p class="q-ml-sm text-h6 text-center col">Zmiana będzie nieodwracalna!</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="usuń" color="primary" v-close-popup
            @click="deleteCopmetitionCode=true" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model=" deleteCopmetitionCode ">
      <q-card class="bg-red-5 text-center">
        <q-card-section class="flex-center">
          <h3><span class="q-ml-sm">Wprowadź kod potwierdzający</span></h3>
          <div>
            <q-input @keypress.enter=" deleteCompetition(compID, code); code = null; deleteCopmetitionCode = false " autofocus
              type="password" v-model=" code " filled color="Yellow" class="bg-yellow text-bold" mask="####"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="anuluj" color="black" v-close-popup @click=" code = null " />
          <q-btn id="3" label="Wprowadź zmiany" color="black" v-close-popup
            @click="deleteCompetition(compID, code); code = null; deletePacketCode = false; code = null " />
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
          <q-btn label="zapisz" color="black" v-close-popup
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
<style src="../../style/style.scss" lang="scss">
</style>
<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
import draggable from 'vuedraggable'
export default {
  name: 'Competitions.vue',
  created () {
    this.getCompetitions()
  },
  components: {
    draggable,
    Tooltip2clickTip: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickTip.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      array: [],
      competitions: [],
      competition: [],
      countingMethods: [],
      countingTypes: [],
      calibersList: [],
      disciplines: [],
      deleteCopmetitionCode: false,
      deleteCopmetition: false,
      acceptDialog: false,
      compID: null,
      orderNumber: null,
      numberOfShots: null,
      practiceShots: null,
      caliberUUID: null,
      disciplineList: [],
      competitionType: null,
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
      fetch(`${this.local}/competition/`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.competitions = response
        })
    },
    getCountingMethods () {
      fetch(`${this.local}/competition/getCountingMethods`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.countingMethods = response
        })
    },
    getCompetitionTypes () {
      fetch(`${this.local}/competition/getCompetitionTypes`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.countingTypes = response
        })
    },
    getDisciplines () {
      fetch(`${this.local}/competition/getDisciplines`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.disciplines = response
        })
    },
    getCalibersList () {
      fetch(`${this.local}/armory/calibers`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.calibersList = response
        })
    },
    arrayToString (arr) {
      let string = ''
      for (let i = 0; i < arr.length; i++) {
        string += arr[i].slice(0, -arr[i].length + 1) + ' '
      }
      return string
    },
    updateCompetition () {
      console.log(this.disciplineList)
      const data = {
        ordering: this.orderNumber,
        practiceShots: this.practiceShots,
        discipline: this.disciplineList.length === 1 ? this.disciplineList[0] : '',
        disciplineList: this.disciplineList.length > 1 ? this.disciplineList : [],
        caliberUUID: this.caliberUUID,
        type: this.competitionType,
        name: this.name,
        countingMethod: this.method,
        numberOfShots: this.numberOfShots
      }
      fetch(`${this.local}/competition/update?uuid=${this.compID}&pinCode=${this.code}`, {
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
      }).catch(() => {
        this.message = 'pojawił się jakiś błąd'
        this.failure = true
        this.autoClose()
      })
    },
    deleteCompetition (uuid, code) {
      fetch(`${this.local}/competition/delete?uuid=${uuid}&pinCode=${code}`, {
        method: 'DELETE',
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
      }).catch(() => {
        this.message = 'coś poszło nie tak'
        this.failure = true
        this.autoClose()
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
