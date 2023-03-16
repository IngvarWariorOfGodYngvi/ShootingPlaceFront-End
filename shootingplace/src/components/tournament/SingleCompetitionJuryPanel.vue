<template>
  <div class="col">
    <div
      class="full-width text-h5 text-bold text-center q-pa-none q-ma-none text-positive">{{
        competition.countingMethod === 'COMSTOCK' ? competition.name + ' ' + competition.countingMethod : competition.name
      }}
    </div>
    <div class="row q-pa-none q-ma-none">
      <q-field dense class="col text-positive" standout="bg-accent text-positive" stack-label>
        <div class="col-3 self-center no-outline text-left text-positive">Zawodnik</div>
        <div class="col-3 self-center no-outline text-left text-positive">Klub</div>
        <div class="col-1 self-center no-outline text-left text-positive">M.</div>
        <div class="col-1 self-center no-outline text-left text-positive">
          {{ competition.countingMethod === 'COMSTOCK' ? 'tr.' : '10/' }}
        </div>
        <div class="col-1 self-center no-outline text-right text-positive">
          {{ competition.countingMethod === 'COMSTOCK' ? 'cz.' : '10X' }}
        </div>
        <div v-if="competition.countingMethod === 'COMSTOCK'" class="col-1 self-center no-outline text-right text-positive"
             >proc.
        </div>
        <div
          :class="competition.countingMethod === 'COMSTOCK'?'col-2 self-center no-outline text-right text-positive':'col-3 self-center no-outline text-center text-positive'"
          tabindex="3">
          <div v-if="competition.countingMethod === 'COMSTOCK'" class="text-right">
            <div>
              Wynik
            </div>
            <div>
              HF
            </div>
          </div>
          <div v-else> Wynik</div>
        </div>
      </q-field>
    </div>
    <q-virtual-scroll :items="competition.scoreList" visible class="full-width q-pa-none q-ma-none">
      <template v-slot="{ item, index }">
        <div :key="index">
          <div :class="index%2===0?'bg-grey row text-body2 full-width':'row text-body2 full-width'">
            <!-- name & club -->
            <div class="col"
                 @dblclick="scoreUUID = item.uuid;toggleDSQDNF=true;item.member!=null?
                 (temp=item.member)
                 :
                 (temp=item.otherPersonEntity);
                 startNumber=item.metricNumber;competitionTemp = competition">
              <q-field dense standout="bg-accent text-positive row" class="text-positive text-caption" stack-label>
                <div class="q-pa-none row full-width text-caption">
                  <div :class="index%2===0?'col-3 text-black self-center text-left':'col-3 text-positive self-center no-outline text-left'">
                    <div>
                      {{
                        item.member != null ? temp = item.member.secondName : temp = item.otherPersonEntity.secondName
                      }}
                    </div>
                    <div>
                      {{ item.member != null ? temp = item.member.firstName : temp = item.otherPersonEntity.firstName }}
                    </div>
                  </div>
                  <div :class="index%2===0?'col-3 text-black self-center no-outline text-left':'col-3 text-positive self-center no-outline text-left'"
                       tabindex="0">
                    {{ item.member != null ? temp = item.member.club.name : temp = item.otherPersonEntity.club.name }}
                  </div>
                  <div :class="index%2===0?'col-1 self-center no-outline text-left text-black':'col-1 self-center no-outline text-left text-positive'"
                       tabindex="0">{{ item.metricNumber }}
                  </div>
                  <div :class="index%2===0?'self-center col-1 no-outline text-left text-black text-caption':'self-center col-1 no-outline text-left text-positive text-caption'"
                       tabindex="0">{{competition.countingMethod === 'NORMAL'? item.outerTen - item.innerTen : item.outerTen}}
                  </div>
                  <div :class="index%2===0?'self-center col-1 no-outline text-right text-black text-caption':'self-center col-1 no-outline text-right text-positive text-caption'"
                       tabindex="0">{{ item.innerTen }}
                  </div>
                  <div v-if="competition.countingMethod === 'COMSTOCK'"
                       :class="index%2===0?'self-center col-1 no-outline text-right text-black text-caption':'self-center col-1 no-outline text-right text-positive text-caption'"
                       tabindex="0">{{ item.procedures }}
                  </div>
                  <div :class="competition.countingMethod === 'COMSTOCK'?'col-2':'col-3 text-center'">
                    <div v-if="item.dnf||item.dsq||item.pk"
                         class="self-center full-width no-outline text-center">
                      <div v-if="item.dnf">DNF</div>
                      <div v-if="item.dsq">DSQ</div>
                      <div v-if="item.pk">PK</div>
                    </div>
                    <div v-else
                         :class="competition.countingMethod === 'COMSTOCK'?'self-center full-width no-outline text-right text-caption':'self-center full-width no-outline text-center text-caption'"
                         tabindex="0">
                      <div v-if="competition.countingMethod === 'COMSTOCK'" :class="index%2===0?'text-black':'text-positive'">
                        <div>{{item.score}}</div>
                        <div>{{item.hf}}</div>
                      </div>
                      <div v-else :class="index%2===0?'text-black text-center self-center':'text-positive text-center self-center'">{{item.score}}</div>
                    </div>
                  </div>
                </div>
              </q-field>
            </div>
          </div>
        </div>
      </template>
    </q-virtual-scroll>
    <q-dialog v-model="toggleDSQDNF">
      <q-card style="min-width: 95vw;min-height: 95vh;" class="bg-dark">
        <q-card-section class="full-width">
          <div>
            <div class="text-h5 text-positive text-bold text-center">{{ temp.secondName }} {{ temp.firstName }} nr M{{startNumber}}</div>
          </div>
          <div>
            <div class="text-h5 text-positive text-bold text-center">{{ competitionTemp.name }}</div>
          </div>
          <div v-if="competitionTemp.disciplines==null && competitionTemp.countingMethod === 'COMSTOCK'"
               class="row full-width">
            <q-input v-if="alfa === '' && charlie === '' && delta === ''" type="number"
                     input-class="text-center text-positive text-h4" v-model="outerTen" class="col-3"
                     @keypress.enter=" onEnter(scoreUUID)"
                     stack-label label="trafienia" label-color="positive"
                     onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            <q-input
              @keypress.enter=" onEnter(scoreUUID)" type="number"
              input-class="text-center text-positive text-h4" v-model="alfa" class="col-3" stack-label label="Alfa" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            <q-input
              @keypress.enter=" onEnter(scoreUUID)" type="number"
              input-class="text-center text-positive text-h4" v-model="charlie" class="col-3" stack-label label="Charlie" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            <q-input
              @keypress.enter=" onEnter(scoreUUID)" type="number"
              input-class="text-center text-positive text-h4" v-model="delta" class="col-3" stack-label label="Delta" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          </div>
          <div v-if="competitionTemp.disciplines!=null && competitionTemp.countingMethod === 'COMSTOCK'"
               class="row full-width">
            <div v-if="competitionTemp.disciplines.includes('Pistolet')" class="row">
                <q-input v-if="alfa === '' && charlie === '' && delta === ''"
                         input-class="text-center text-positive text-h4" v-model="outerTen"
                         @keypress.enter=" onEnter(scoreUUID)"
                         stack-label label="trafienia" label-color="positive"
                         onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                  @keypress.enter=" onEnter(scoreUUID)"
                  input-class="text-center text-positive text-h4" v-model="alfa" stack-label label="Alfa" label-color="positive"
                  onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                  @keypress.enter=" onEnter(scoreUUID)"
                  input-class="text-center text-positive text-h4" v-model="charlie" stack-label label="Charlie" label-color="positive"
                  onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                  @keypress.enter=" onEnter(scoreUUID)"
                  input-class="text-center text-positive text-h4" v-model="delta" stack-label label="Delta" label-color="positive"
                  onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            </div>
            <div v-if="competitionTemp.disciplines.includes('Karabin')" class="row">
                <q-input v-if="alfa === '' && charlie === '' && delta === ''"
                         input-class="text-center text-positive text-h4" v-model="outerTen"
                         @keypress.enter=" onEnter(scoreUUID)"
                         stack-label label="trafienia" label-color="positive"
                         onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                  @keypress.enter=" onEnter(scoreUUID)"
                  input-class="text-center text-positive text-h4" v-model="alfa" stack-label label="Alfa" label-color="positive"
                  onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                  @keypress.enter=" onEnter(scoreUUID)"
                  input-class="text-center text-positive text-h4" v-model="charlie" stack-label label="Charlie" label-color="positive"
                  onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                  @keypress.enter=" onEnter(scoreUUID)"
                  input-class="text-center text-positive text-h4" v-model="delta" stack-label label="Delta" label-color="positive"
                  onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            </div>
            <div v-if="competitionTemp.disciplines.includes('Strzelba')" class="row">
                <q-input v-if="alfa === '' && charlie === '' && delta === ''"
                         input-class="text-center text-positive text-h4" v-model="outerTen"
                         @keypress.enter=" onEnter(scoreUUID)"
                         stack-label label="trafienia" label-color="positive"
                         onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                  @keypress.enter=" onEnter(scoreUUID)"
                  input-class="text-center text-positive text-h4" v-model="alfa" stack-label label="Alfa" label-color="positive"
                  onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                  @keypress.enter=" onEnter(scoreUUID)"
                  input-class="text-center text-positive text-h4" v-model="charlie" stack-label label="Charlie" label-color="positive"
                  onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                  @keypress.enter=" onEnter(scoreUUID)"
                  input-class="text-center text-positive text-h4" v-model="delta" stack-label label="Delta" label-color="positive"
                  onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            </div>
          </div>
          <div v-if="competitionTemp.countingMethod === 'COMSTOCK'" class="row full-width">
                <q-input input-class="text-center text-positive text-h4" v-model="innerTen" type="number"
                         @keypress.enter=" onEnter(scoreUUID)"
                         stack-label label="czas" label-color="positive" class="col-10"
                         onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
          </div>
          <!-- procedures -->
          <div v-if="competitionTemp.countingMethod === 'COMSTOCK'" class="row full-width">
                <q-input input-class="text-center text-positive text-h4" v-model="procedures" type="number"
                         @keypress.enter="onEnter(scoreUUID)"
                         stack-label label="procedury + 3 sek" label-color="positive" class="col-10"
                         onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          </div>
          <div v-if="competitionTemp.countingMethod === 'NORMAL'" class="row full-width">
                <q-input input-class="text-center text-positive text-h4" v-model="outerTen" type="number"
                         @keypress.enter="onEnter(scoreUUID)"
                         stack-label label="ilość 10 Ogólnie" label-color="positive" class="col-10"
                         onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          </div>
          <div v-if="competitionTemp.countingMethod === 'NORMAL'" class="row full-width">
                <q-input input-class="text-center text-positive text-h4" v-model="innerTen" type="number"
                         @keypress.enter="onEnter(scoreUUID)"
                         stack-label label="ilość 10 X" label-color="positive" class="col-10"
                         onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          </div>
          <!-- wynik -->
          <div class="row full-width">
            <q-input input-class="text-center text-positive text-h4" v-model="scoreLabel" type="number"
                     @keypress.enter="onEnter(scoreUUID)"
                     stack-label label="Wynik" label-color="positive" class="col-10"
                     onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
            <q-btn color="primary" label="Zapisz" text-color="white" class="col-2"
                   @click="setScore(scoreUUID,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
          </div>
          <div class="row q-pa-md">
            <q-btn color="primary" class="full-width q-pa-md" @click="toggleDnfScore()">przyznaj DNF</q-btn>
            <p></p>
            <q-btn color="primary" class="full-width q-pa-md" @click="toggleDsqScore()">przyznaj DSQ</q-btn>
            <p></p>
            <q-btn color="primary" class="full-width q-pa-md" @click="togglePkScore()">przyznaj PK</q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="Anuluj" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App.vue'

export default {
  name: 'SingleCompetitionJuryPanel',
  created () {
    this.getCompetitionByID(this.uuid)
  },
  data () {
    return {
      competition: null,
      controlSize: 0,
      val: [],
      temp: '',
      competitionTemp: '',
      legitimationNumber: null,
      listDownload: false,
      success: false,
      failure: false,
      toggleDSQDNF: false,
      calibers: [],
      infoScore: [],
      caliberUUID: null,
      scoreUUID: null,
      singleScore: null,
      score: null,
      scoreLabel: null,
      innerTen: null,
      outerTen: null,
      alfa: '',
      charlie: '',
      delta: '',
      procedures: null,
      quantity: false,
      metric: null,
      ammoQuantity: null,
      gunAdded: false,
      startNumber: '',
      compName: null,
      name: '',
      compList: [],
      otherID: '',
      message: null,
      local: App.host
    }
  },
  props: {
    uuid: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: false
    }
  },
  watch: {
    uuid (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getCompetitionByID(this.uuid)
      }
    },
    size (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getCompetitionByID(this.uuid)
      }
    }
  },
  methods: {
    getCompetitionByID (uuid) {
      fetch('http://' + App.host + '/competitionMembersList/getByID/?uuid=' + uuid, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        response.json().then(response => {
          this.competition = response
          this.compName = response.name
        })
      })
    },
    call (uuid) {
      console.log('wołam reset')
      console.log(uuid)
    },
    onEnter (scoreUUID) {
      this.setScore(scoreUUID, this.scoreLabel, this.innerTen, this.outerTen, this.alfa, this.charlie, this.delta, this.procedures)
    },
    getListCalibers () {
      fetch('http://' + App.host + '/armory/calibers', {
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
              this.getCompetitionByID(this.uuid)
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
              this.getCompetitionByID(this.uuid)
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
              this.getCompetitionByID(this.uuid)
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
              this.getCompetitionByID(this.uuid)
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
              this.getCompetitionByID(this.uuid)
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
              this.getCompetitionByID(this.uuid)
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
              this.getCompetitionByID(this.uuid)
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
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.gunAdded = false
        this.listDownload = false
        this.message = null
        this.success = false
      }, 2000)
    }
  }
}
</script>

<style scoped>

</style>
