<template>
  <div>{{ getCompetitionName() }}
    <q-btn color="secondary" label="Kreator konkurencji" @click="load();createNewCompetiton = true"/>
  <q-dialog v-model="createNewCompetiton">
    <q-card class="bg-dark text-positive" style="min-width: 65vw; height: 80vh">
        <q-card-section class="col items-center">
          <!-- <div class="col">
            <b>Rodzaj Konkurencji</b><br/>
            <q-radio v-model="type" @input="countingMethod=='IPSC'?countingMethod='NORMAL':''; discipline=''; disciplines=[]" :val="true" label="Statyczna" />
            <q-radio v-model="type" @input="countingMethod='COMSTOCK'; discipline=''; disciplines=[]" :val="false" label="Dynamiczna"/>
          </div> -->
          <div class="col">
            <b>Odległość {{ range }}m</b>
            <q-slider v-model="range" :min="0" :max="300" :step="1" marker-labels snap label color="primary" class="q-pa-md">
              <template v-slot:marker-label-group="{ markerList }">
                <div v-for="val of [10,25,50,300]" :key="val" style="width: 3vw" class="cursor-pointer bg-primary round text-white text-center" :class="markerList[val].classes" :style="markerList[val].style" @click="range = val">{{ val+'m' }}</div>
              </template>
            </q-slider>
          </div>
          <div>
            <b>Metoda Liczenia</b><br/>
            <q-radio v-model="countingMethod" class="q-pl-xs" v-for="(item,index) in countingMethods" :key="index" :val="item" :label="item" color="primary"/>
          </div>
          <!-- <div v-if="!type">
            <b>Metoda Liczenia</b><br/>
            <q-radio @input="countingMethod=='IPSC'?competitionType='MINOR':''"  class="q-pl-xs" v-model="countingMethod" v-for="(item,index) in countingMethods.filter(f=>f!='NORMAL')" :key="index" :val="item" :label="item" color="primary"/>
          </div> -->
          <!-- <div v-if="type">
            <b>Dyscyplina (wybierz 1)</b><br/>
            <q-radio dense v-model="discipline" class="q-pl-xs" v-for="(item,index) in disciplinesList" :key="index" :val="item" :label="item"/>
          </div> -->
          <div>
            <b>Dyscypliny</b><br/>
            <q-checkbox dense v-model="disciplines" class="q-pl-xs" v-for="(item,index) in disciplinesList" :key="index" :val="item" :label="item"/>
          </div>
          <div>
            <q-checkbox dense v-model="helperDisciplines" class="q-pl-xs" v-for="(item,index) in disciplinesHelpers" :key="index" :val="item" :label="item"/>
          </div>
          <!-- <div class="col">
            <div v-if="disciplines == 'Pistolet'" >
              <q-checkbox dense v-model="helperPistol" class="q-pl-xs" v-for="(item,index) in helpersPistol" :key="index" :val="item" :label="item"/>
            </div>
            <div v-if="disciplines == 'Karabin'" >
              <q-checkbox dense v-model="helperRifle" class="q-pl-xs" v-for="(item,index) in helpersRifle" :key="index" :val="item" :label="item"/>
            </div>
            <div v-if="disciplines == 'Strzelba'" >
              <q-checkbox dense v-model="helperShotgun" class="q-pl-xs" v-for="(item,index) in helpersShotgun" :key="index" :val="item" :label="item"/>
            </div>
          </div> -->
          <div v-if="disciplines.length<2">
            <b>Kaliber</b>
            <q-select label="Wybierz kaliber" color="white" input-class="text-white" label-color="white"
          popup-content-class="bg-dark text-positive"
          :option-value="opt => opt !== '' ? Object(opt.uuid).toString() : ''"
          :option-label="opt => opt !== '' ? Object(opt.name).toString() : ''"
          emit-value map-options options-dense options-selected-class="bg-negative text-positive" v-model="caliber"
          bg-color="primary" filled dense use-input hide-selected fill-input :options="calibers" @filter="filter">
          <template v-slot:option="option">
            <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']"
              v-on="option.itemEvents">
              <q-item-section style="padding: 0.5em; margin: 0;">
                <div>{{ option.opt.name }}
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
          </div>
          <div v-if="countingMethod=='IPSC'">
            <b>Rodzaj</b><br/>
            <q-radio dense v-model="competitionType" class="q-pl-xs" v-for="(item,index) in competitionTypes.filter(f=>f==='MINOR' || f==='MAJOR')" :key="index" :val="item" :label="item"/>
          </div>
          <div v-if="countingMethod!='IPSC'">
            <b>Rodzaj</b><br/>
            <q-radio dense v-model="competitionType" class="q-pl-xs" v-for="(item,index) in competitionTypes.filter(f=>f!='MINOR' && f!='MAJOR')" :key="index" :val="item" :label="item"/>
          </div>
          <div v-if="disciplines.length<2">
            <b>Ilość strzałów ocenianych {{ numberOfShots }}</b><br/>
            <q-slider dense v-model="numberOfShots" :min="0" :max="300" :step="1" snap label color="primary"  class="q-pa-md"/>
          </div>
          <div v-if="type">
            <b>Ilość strzałów próbnych {{ practiceShots }}</b><br/>
            <q-slider dense v-model="practiceShots" :min="0" :max="300" :step="1" snap label color="primary"  class="q-pa-md"/>
          </div>
          <div>
            <b>Nazwa Konkurencji</b><div v-if="stop" @click="stop=!stop" class="text-caption hover1">przywróć generowanie nazwy</div><br/>
            <q-input dense v-model="name" @click="stop=true" stack-label input-class="text-positive" filled label="* Edytujac nazwę zablokujesz jej generowanie" label-color="positive"/>
          </div>
        </q-card-section>
        <q-card-section>
          <div>
            <q-btn color="primary" label="zapisz" @click="createCompetition()" v-close-popup :disable="disciplines.length === 0"/>
            <q-btn color="secondary" label="anuluj" v-close-popup/>
          </div>
        </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="success" position="top">
    <q-card>
      <q-card-section>
        <div v-if="message != null" class="text-h6">{{ message }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="failure" position="standard">
    <q-card class="bg-warning">
      <q-card-section>
        <div class="text-h6">{{ message }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
  </div>
</template>
<script>
import App from 'src/App.vue'
import { ref } from 'vue'
export default {
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
      name: '',
      createNewCompetiton: false,
      countingMethods: [],
      disciplinesList: [],
      competitionTypes: [],
      calibers: [],
      range: 0,
      countingMethod: '',
      // discipline: '',
      disciplines: [],
      caliber: '',
      numberOfShots: 0,
      practiceShots: 0,
      type: true,
      competitionType: '',
      helpersPistol: ['pneumatyczny', 'sportowy', 'bocznego zapłonu', 'centralnego zapłonu', 'maszynowy', 'dynamiczny', 'z optyką', 'rewolwer'],
      helpersRifle: ['pneumatyczny', 'sportowy', 'bocznego zapłonu', 'centralnego zapłonu', 'maszynowy', 'dynamiczny', 'z optyką'],
      helpersShotgun: ['dynamiczna', 'tarcza', 'popery', 'automat', 'pump-action', 'z optyką'],
      disciplinesHelpers: ['pneumatyczny', 'sportowy', 'dowolny', 'bocznego zapłonu', 'centralnego zapłonu', 'maszynowy', 'dynamiczny', 'z optyką', 'rewolwer', 'dynamiczna', 'tarcza', 'popery', 'automat', 'pump-action', 'Tor'],
      helperPistol: [],
      helperRifle: [],
      helperShotgun: [],
      helperDisciplines: [],
      stop: false,
      message: null,
      success: false,
      failure: false,
      shootingPlace: App.shootingPlace,
      local: App.host
    }
  },
  methods: {
    load () {
      this.getCountingMethods()
      this.getDisciplines()
      this.getListCalibers()
      this.getCompetitionTypes()
    },
    getCountingMethods () {
      fetch(`${this.local}/competition/getCountingMethods`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.countingMethods = response
          this.countingMethod = response[0]
        })
    },
    getDisciplines () {
      fetch(`${this.local}/competition/getDisciplines`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.disciplinesList = response
        })
    },
    getCompetitionTypes () {
      fetch(`${this.local}/competition/getCompetitionTypes`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.competitionTypes = response
        })
    },
    getListCalibers () {
      fetch(`${this.local}/armory/calibers`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.calibers = response
        })
    },
    getCompetitionName () {
      if (!this.stop) {
        // if (this.type && this.discipline === 'Pistolet') {
        //   this.name = `${this.range > 0 ? this.range + 'm' : ''} ${this.helperPistol.includes('rewolwer') ? 'Rewolwer' : this.discipline} ${this.helperPistol.includes('rewolwer') ? this.helperPistol.filter(f => f !== 'rewolwer').toString().replaceAll(/,/gi, ' ') : this.helperPistol.toString().replaceAll(/,/gi, ' ')} ${this.numberOfShots > 0 ? this.numberOfShots + ' strzałów' : ''} ${this.competitionType}`
        // }
        // if (this.type && this.discipline === 'Karabin') {
        //   this.name = `${this.range > 0 ? this.range + 'm' : ''} ${this.discipline} ${this.helperRifle.toString().replaceAll(/,/gi, ' ')} ${this.numberOfShots > 0 ? this.numberOfShots + ' strzałów' : ''} ${this.competitionType}`
        // }
        // if (this.type && this.discipline === 'Strzelba') {
        //   this.name = `${this.range > 0 ? this.range + 'm' : ''} ${this.discipline} ${this.helperShotgun.toString().replaceAll(/,/gi, ' ')} ${this.numberOfShots > 0 ? this.numberOfShots + ' strzałów' : ''} ${this.competitionType}`
        // }
        // if (this.disciplines.length > 0) {
        this.name = `${this.range > 0 ? this.range + 'm' : ''} ${this.disciplines.toString().replaceAll(/,/g, ' ')} ${this.helperDisciplines.toString().replaceAll(/,/g, ' ')} ${this.numberOfShots > 0 ? this.numberOfShots + ' strzałów' : ''} ${this.competitionType}`
        // }
      }
    },
    createCompetition () {
      const name = this.name
      // if (this.type) {
      //   this.disciplines = []
      // }
      // if (!this.type) {
      // this.discipline = null
      if (this.disciplines.length > 1) {
        this.caliber = null
        this.numberOfShots = 0
        this.practiceShots = 0
      }
      const data = {
        name: name,
        // discipline: this.discipline !== null ? this.discipline.replace(/ /g, '') : this.discipline,
        disciplineList: this.disciplines,
        numberOfShots: this.numberOfShots,
        practiceShots: this.practiceShots,
        type: this.competitionType.replace(/ /, ''),
        countingMethod: this.countingMethod.replace(/ /, ''),
        numberOfManyShots: null,
        caliberUUID: this.caliber
      }
      fetch(`${this.local}/competition`, {
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
            this.$emit('createCompetition')
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
    filter (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.calibers = this.calibers.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.calibers = this.calibers.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    },
    autoClose () {
      setTimeout(() => {
        this.message = null
        this.success = false
        this.failure = false
      }, 2000)
    }
  }
}
</script>
