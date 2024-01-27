<template>
  <div v-if="competition!=null" class="col">
    <div v-if="!juryPanelCompetitionInExpansionItem"
      class="full-width text-h5 text-bold text-center q-pa-none q-ma-none text-positive">{{
        competition.countingMethod === 'COMSTOCK' ? competition.name + ' ' + competition.countingMethod : competition.name
      }}
    </div>
    <div class="row q-pa-none q-ma-none">
      <div class="row fit q-pa-sm self-center text-positive">
        <div class="col-3 self-center text-left text-positive">Zawodnik</div>
        <div class="col-3 self-center text-left text-positive">Klub</div>
        <div class="col-1 self-center text-center text-positive">M.</div>
        <div class="col-1 self-center text-center text-positive">
          {{ competition.countingMethod === 'COMSTOCK' ? 'tr.' : '10/' }}
        </div>
        <div class="col-1 self-center text-center text-positive">
          {{ competition.countingMethod === 'COMSTOCK' ? 'cz.' : '10X' }}
        </div>
        <div v-if="competition.countingMethod === 'COMSTOCK'"
             class="col-1 self-center text-right text-positive"
        >proc.
        </div>
        <div v-if="competition.countingMethod !== 'COMSTOCK'" class="col-1"></div>
        <div class="col-2 self-center text-positive">
          <div v-if="competition.countingMethod === 'COMSTOCK'" class="text-center">
            <div>
              Wynik
            </div>
            <div>
              HF
            </div>
          </div>
          <div v-if="competition.countingMethod !== 'COMSTOCK'" class="text-center">
            <div> Wynik</div>
          </div>
        </div>
      </div>
    </div>
    <q-virtual-scroll :items="competition.scoreList" virtual-scroll-slice-size="500" visible class="full-width q-pa-none q-ma-none">
      <template v-slot="{ item, index }">
        <div :key="index">
          <div class="row text-body2 full-width" :class="index%2===0?'bg-grey text-black':'text-positive'">
            <div class="col"
                 @click="mobile?(scoreUUID = item.uuid, player = item,scoreLabel=item.score,innerTen=item.innerTen,outerTen=item.outerTen,procedures=item.procedures,setScorePlayer=true,series=setSeriesValues (item.series),item.member!=null?
                 (temp=item.member) : (temp=item.otherPersonEntity),
                 startNumber=item.metricNumber,competitionTemp = competition) : ' '"
                 @dblclick="!mobile?(scoreUUID = item.uuid, player = item,scoreLabel=item.score,innerTen=item.innerTen,outerTen=item.outerTen,procedures=item.procedures,setScorePlayer=true,series=setSeriesValues (item.series),item.member!=null?
                 (temp=item.member) : (temp=item.otherPersonEntity),
                 startNumber=item.metricNumber,competitionTemp = competition) : ' '">
              <div class="text-positive text-caption row q-pa-xs" style="cursor: pointer;">
                <div class="col-3 self-center text-left" :class="index%2===0?'text-black':'text-positive'">
                  <div>
                    {{ item.member != null ? temp = item.member.secondName : temp = item.otherPersonEntity.secondName }}
                  </div>
                  <div>
                    {{ item.member != null ? temp = item.member.firstName : temp = item.otherPersonEntity.firstName }}
                  </div>
                </div>
                <div class="col-3 self-center text-left" :class="index%2===0?'text-black':'text-positive'"
                >
                  {{ item.member != null ? temp = item.member.club.name : temp = item.otherPersonEntity.club.name }}
                </div>
                <div class="col-1 self-center text-center text-h6"
                     :class="index%2===0?'text-positive':'text-positive'"
                >{{ item.metricNumber }}
                </div>
                <div class="col-1 self-center text-center text-caption"
                     :class="index%2===0?'text-black':'text-positive'">
                  {{ competition.countingMethod === 'NORMAL' ? item.outerTen : item.outerTen }}
                </div>
                <div class="col-1 self-center text-right text-caption"
                     :class="index%2===0?'text-black':'text-positive'">{{ item.innerTen }}
                </div>
                <div v-if="competition.countingMethod === 'COMSTOCK'"
                     class="col-1 self-center text-right text-caption"
                     :class="index%2===0?'text-black':'text-positive'">{{ item.procedures }}
                </div>
                <div v-if="competition.countingMethod !== 'COMSTOCK'" class="col-1"></div>
                <div class="col-2 self-center text-center">
                  <div v-if="item.dnf||item.dsq||item.pk" :class="index%2===0?'text-black':'text-positive'"
                       class="self-center full-width text-center">
                    <div v-if="item.dnf">DNF ({{ item.score }})</div>
                    <div v-if="item.dsq">DSQ ({{ item.score }})</div>
                    <div v-if="item.pk">PK ({{ item.score }})</div>
                  </div>
                  <div v-else class="self-center text-caption text-center">
                    <div v-if="competition.countingMethod === 'COMSTOCK'"
                         :class="index%2===0?'text-black':'text-positive'">
                      <div>{{ item.score }}</div>
                      <div>{{ item.hf }}</div>
                    </div>
                    <div v-else class="text-center self-center"
                         :class="`${index%2===0?'text-black':'text-positive'} ${item.edited ? '': 'bg-warning round1'}`">
                      {{ item.score }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </q-virtual-scroll>
    <q-dialog v-model="setScorePlayer">
      <q-card style="min-width: 95vw;min-height: 90vh; margin-bottom: 10vh" class="bg-dark">
        <q-card-section class="full-width">
          <div>
            <div class="text-h5 text-positive text-bold text-center">{{ temp.secondName }} {{ temp.firstName }} nr
              {{ startNumber }}
            </div>
          </div>
          <div>
            <div class="text-h5 text-positive text-bold text-center">{{ competitionTemp.name }}</div>
          </div>
          <div v-if="competitionTemp.countingMethod === 'COMSTOCK'"
               class="row full-width">
            <q-input v-if="alfa === '' && charlie === '' && delta === ''" type="number"
                     input-class="text-center text-positive text-h6" v-model="outerTen" class="col-3"
                     @keypress.enter=" onEnter(scoreUUID)"
                     @focus="outerTen = null"
                     stack-label label="trafienia" label-color="positive"
                     onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            <q-input
              @keypress.enter=" onEnter(scoreUUID)" type="number"
              @focus="alfa = null"
              input-class="text-center text-positive text-h6" v-model="alfa" class="col-3" stack-label label="Alfa"
              label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            <q-input
              @keypress.enter=" onEnter(scoreUUID)" type="number"
              @focus="charlie = null"
              input-class="text-center text-positive text-h6" v-model="charlie" class="col-3" stack-label
              label="Charlie" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            <q-input
              @keypress.enter=" onEnter(scoreUUID)" type="number"
              @focus="delta = null"
              input-class="text-center text-positive text-h6" v-model="delta" class="col-3" stack-label label="Delta"
              label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          </div>
          <!-- <div v-if="competitionTemp.disciplines!=null && competitionTemp.countingMethod === 'COMSTOCK'"
               class="row full-width">
            <div v-if="competitionTemp.disciplines.includes('Pistolet')" class="row">
              <q-input v-if="alfa === '' && charlie === '' && delta === ''"
                       input-class="text-center text-positive text-h6" v-model="outerTen"
                       @keypress.enter=" onEnter(scoreUUID)"
                       stack-label label="trafienia" label-color="positive"
                       onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                @keypress.enter=" onEnter(scoreUUID)"
                input-class="text-center text-positive text-h6" v-model="alfa" stack-label label="Alfa"
                label-color="positive"
                onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                @keypress.enter=" onEnter(scoreUUID)"
                input-class="text-center text-positive text-h6" v-model="charlie" stack-label label="Charlie"
                label-color="positive"
                onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                @keypress.enter=" onEnter(scoreUUID)"
                input-class="text-center text-positive text-h6" v-model="delta" stack-label label="Delta"
                label-color="positive"
                onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            </div>
            <div v-if="competitionTemp.disciplines.includes('Karabin')" class="row">
              <q-input v-if="alfa === '' && charlie === '' && delta === ''"
                       input-class="text-center text-positive text-h6" v-model="outerTen"
                       @keypress.enter=" onEnter(scoreUUID)"
                       stack-label label="trafienia" label-color="positive"
                       onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                @keypress.enter=" onEnter(scoreUUID)"
                input-class="text-center text-positive text-h6" v-model="alfa" stack-label label="Alfa"
                label-color="positive"
                onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                @keypress.enter=" onEnter(scoreUUID)"
                input-class="text-center text-positive text-h6" v-model="charlie" stack-label label="Charlie"
                label-color="positive"
                onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                @keypress.enter=" onEnter(scoreUUID)"
                input-class="text-center text-positive text-h6" v-model="delta" stack-label label="Delta"
                label-color="positive"
                onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            </div>
            <div v-if="competitionTemp.disciplines.includes('Strzelba')" class="row">
              <q-input v-if="alfa === '' && charlie === '' && delta === ''"
                       input-class="text-center text-positive text-h6" v-model="outerTen"
                       @keypress.enter=" onEnter(scoreUUID)"
                       stack-label label="trafienia" label-color="positive"
                       onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                @keypress.enter=" onEnter(scoreUUID)"
                input-class="text-center text-positive text-h6" v-model="alfa" stack-label label="Alfa"
                label-color="positive"
                onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                @keypress.enter=" onEnter(scoreUUID)"
                input-class="text-center text-positive text-h6" v-model="charlie" stack-label label="Charlie"
                label-color="positive"
                onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                @keypress.enter=" onEnter(scoreUUID)"
                input-class="text-center text-positive text-h6" v-model="delta" stack-label label="Delta"
                label-color="positive"
                onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            </div>
          </div> -->
          <div v-if="competitionTemp.countingMethod === 'COMSTOCK'">
            <q-input input-class="text-center text-positive text-h6" v-model="innerTen" type="number"
                     @keypress.enter=" onEnter(scoreUUID)"
                     @focus="innerTen = null"
                     stack-label label="czas" label-color="positive"
                     onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
          </div>
          <!-- procedures -->
          <div v-if="competitionTemp.countingMethod === 'COMSTOCK'">
            <q-input input-class="text-center text-positive text-h6" v-model="procedures" type="number"
                     @keypress.enter="onEnter(scoreUUID)"
                     @focus="procedures = null"
                     stack-label :label="`procedury + ${shootingPlace == 'prod'?'3':'5'} sek`" label-color="positive"
                     onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          </div>
          <q-input v-if="competitionTemp.countingMethod === 'NORMAL'" input-class="text-center text-positive text-h6"
                   v-model="outerTen" type="number" min="0"
                   @keypress.enter="onEnter(scoreUUID)"
                   stack-label label="ilość 10 /" label-color="positive"
                   @input.self="outerTen=checkInput(outerTen)"
                   onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          <q-input v-if="competitionTemp.countingMethod === 'NORMAL'" input-class="text-center text-positive text-h6"
                   v-model="innerTen" type="number" min="0"
                   @keypress.enter="onEnter(scoreUUID)"
                   stack-label label="ilość 10 X" label-color="positive"
                   @input.self="innerTen=checkInput(innerTen)"
                   onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          <!-- wynik -->
          <div v-if="player!=null && player.series.length>0 && competitionTemp.countingMethod === 'NORMAL'">
            <q-input v-for="(item, index) in player.series" :key="index"
                     @keypress.enter="onEnter(scoreUUID)"
                     @input="checkInput(series[index])"
                     onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode === 44  || event.charCode === 46"
                     v-model="series[index]" stack-label label-color="positive" type="number" min="0"
                     :label="'Seria ' + (index + 1)" input-class="text-center text-h6 text-positive">
              <q-popup-edit value="" content-class="bg-dark text-positive" anchor="center middle" self="center middle"
                            style="opacity: 0.1"
                            @before-show="tempSeries = series[index];series[index] = '';series = setSeriesValues(series)"
                            @hide="innerTenSeries=0;outerTenSeries=0;manuallyClosed?'':(series[index]=tempSeries, series = setSeriesValues(series));manuallyClosed=false">
                <div class="text-h6 text-positive row" color="positive" label-color="positive">
                  <div class="col">
                    <div class="full-width">|{{ series[index] }}|</div>
                    <div class="full-width">
                      <div :class="series[index]!=null?tableLength(series[index])>(competitionTemp.numberOfShots>10?10:competitionTemp.numberOfShots)?'text-h4 text-red':'':series[index] = 0">Ilość strzałów:
                        {{ tableLength(series[index]) }}
                      </div>
                      <div>10/: {{ outerTenSeries }} 10X: {{ innerTenSeries }} suma: {{ series[index].length > 0? sum(series[index]): '0'}}</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-9">
                    <div class="row">
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'7':series[index] = series[index]+'+7';series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">7
                      </q-btn>
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'8':series[index] = series[index]+'+8';series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">8
                      </q-btn>
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'9':series[index] = series[index]+'+9';series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">9
                      </q-btn>
                    </div>
                    <div class="row">
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'4':series[index] = series[index]+'+4';series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">4
                      </q-btn>
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'5':series[index] = series[index]+'+5';series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">5
                      </q-btn>
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'6':series[index] = series[index]+'+6';series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">6
                      </q-btn>
                    </div>
                    <div class="row">
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'1':series[index] = series[index]+'+1';series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">1
                      </q-btn>
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'2':series[index] = series[index]+'+2';series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">2
                      </q-btn>
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'3':series[index] = series[index]+'+3';series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">3
                      </q-btn>
                    </div>
                    <div class="row">
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'0':series[index] = series[index]+'+0';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">0
                      </q-btn>
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'10X':series[index] = series[index]+'+10X';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">10X
                      </q-btn>
                      <q-btn color="primary"
                             @click="series[index].length<1? series[index] = series[index]+'10/':series[index] = series[index]+'+10/';outerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                             class="q-pa-xs text-h6 col-4" style="border: 2px solid">10/
                      </q-btn>
                    </div>
                  </div>
                  <div class="col-3">
                    <q-btn class="q-pa-xs full-width text-h6" style="border: 2px solid" color="red" label="C"
                           @click="series[index] = reduceArr(series[index]);outerTenSeriesCounter(series[index]);innerTenSeriesCounter(series[index]);series = setSeriesValues(series);manuallyClosed=true"/>
                    <q-btn class="q-pa-xs full-width text-h6" style="border: 2px solid" color="secondary"
                           label="reset"
                           @click="series[index] = '';innerTenSeries=0;outerTenSeries=0;series = setSeriesValues(series);manuallyClosed=true"/>
                    <q-btn class="q-pa-xs full-width text-h6" style="border: 2px solid" color="primary" label="sumuj"
                           v-close-popup
                           @click="series[index] ==null?series[index] ='':'';series[index] = sumByClick(series[index]);series = setSeriesValues(series);manuallyClosed=true"/>
                    <q-btn class="q-pa-xs full-width text-h6" style="border: 2px solid" color="primary"
                           text-color="white" label="Anuluj"
                           @click="series[index]=tempSeries;manuallyClosed=true;series = setSeriesValues(series)"
                           v-close-popup/>
                  </div>
                </div>
              </q-popup-edit>
            </q-input>
            <div class="row full-width q-pb-sm">
              <q-btn class="col-6" text-color="white" label="Anuluj" color="primary" v-close-popup/>
              <q-btn class="col-6" color="primary" label="Zapisz" text-color="white" v-close-popup
                     @click="setScore(scoreUUID,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures,series)"/>
            </div>
          </div>
          <div v-else>
            <q-input input-class="text-center text-positive text-h4" v-model="scoreLabel" type="number"
                     @keypress.enter="onEnter(scoreUUID)"
                     stack-label label="Wynik" label-color="positive"
                     onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
            <div class="row full-width q-pb-sm">
              <q-btn class="col-6" text-color="white" label="Anuluj" color="primary" v-close-popup/>
              <q-btn class="col-6" color="primary" label="Zapisz" text-color="white"
                     @click="setScore(scoreUUID,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures,series)"/>
            </div>
          </div>
          <div v-if="player!=null" class="col full-width">
            <q-btn color="primary" dense class="full-width" style="border: solid 2px black"
                   @click="toggleDnfScore();player.dnf=!player.dnf">
              {{ player.dnf ? 'usuń' : 'przyznaj' }} DNF
            </q-btn>
            <q-btn color="primary" dense class="full-width" style="border: solid 2px black"
                   @click="toggleDsqScore();player.dsq=!player.dsq">{{ player.dsq ? 'usuń' : 'przyznaj' }} DSQ
            </q-btn>
            <q-btn color="primary" dense class="full-width" style="border: solid 2px black"
                   @click="togglePkScore();player.pk=!player.pk">{{ player.pk ? 'usuń' : 'przyznaj' }} PK
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App.vue'
// import { isWindows } from 'mobile-device-detect'

export default {
  name: 'SingleCompetitionJuryPanel',
  created () {
    this.getCompetitionByID(this.uuid)
  },
  data () {
    return {
      juryPanelCompetitionInExpansionItem: JSON.parse(window.localStorage.getItem('JuryPanelCompetitionInExpansionItem')),
      competition: null,
      controlSize: 0,
      shootingPlace: App.shootingPlace,
      main: App.main,
      mobile: App.mobile,
      val: [],
      temp: '',
      competitionTemp: '',
      legitimationNumber: null,
      listDownload: false,
      success: false,
      failure: false,
      setScorePlayer: false,
      calibers: [],
      infoScore: [],
      caliberUUID: null,
      scoreUUID: null,
      singleScore: null,
      score: null,
      scoreLabel: null,
      innerTen: '',
      innerTenSeries: 0,
      outerTen: '',
      outerTenSeries: 0,
      alfa: '',
      charlie: '',
      delta: '',
      series: [],
      tempSeries: [],
      manuallyClosed: false,
      player: null,
      procedures: null,
      quantity: false,
      metric: null,
      ammoQuantity: null,
      gunAdded: false,
      startNumber: '',
      compName: null,
      name: '',
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
    checkInput (item) {
      if (item.length > 1 && item.startsWith('0')) {
        item = item.replace('0', '')
      }
      if (item === '') {
        return '0'
      } else {
        return item
      }
    },
    sum (n) {
      if (n.length > 0) {
        n = n.replaceAll('/', '')
        n = n.replaceAll('X', '')
        const arr = n.split('+')
        // this.outerTen = Number(this.outerTen) + Number(this.outerTenSeries)
        // this.innerTen = Number(this.innerTen) + Number(this.innerTenSeries)
        return arr.reduce((a, b) => Number(a) + Number(b), 0)
      }
    },
    sumByClick (n) {
      if (n == null) {
        return '0'
      }
      if (n.length > 0) {
        n = n.replaceAll('/', '')
        n = n.replaceAll('X', '')
        const arr = n.split('+')
        this.outerTen = Number(this.outerTen) + Number(this.outerTenSeries)
        this.innerTen = Number(this.innerTen) + Number(this.innerTenSeries)
        return arr.reduce((a, b) => Number(a) + Number(b), 0)
      }
    },
    reduceArr (n) {
      let string = ''
      if (n.includes('+')) {
        const arr = n.split('+')
        arr.pop()
        for (let i = 0; i < arr.length; i++) {
          string = string.length < 1 ? arr[i] : string + '+' + arr[i]
        }
      }
      return string
    },
    outerTenSeriesCounter (n) {
      if (n.includes('/')) {
        this.outerTenSeries = n.match(/\//g).length
      } else {
        this.outerTenSeries = 0
      }
    },
    innerTenSeriesCounter (n) {
      if (n.includes('X')) {
        this.innerTenSeries = n.match(/X/g).length
      } else {
        this.innerTenSeries = 0
      }
    },
    tableLength (n) {
      if (n === '' || n == null) {
        n = ''
      }
      if (n.length > 0) {
        const arr = n.split('+')
        return arr.length.toString()
      } else if (n.length === 0) {
        return '0'
      } else {
        return '1'
      }
    },
    setSeriesValues (arr) {
      const series = new Array(arr)
      for (let i = 0; i < arr.length; i++) {
        series[i] = arr[i]
      }
      return series
    },
    onEnter (scoreUUID) {
      this.setScore(scoreUUID, this.scoreLabel, this.innerTen, this.outerTen, this.alfa, this.charlie, this.delta, this.procedures, this.series)
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
    setScore (scoreUUID, score, innerTen, outerTen, alfa, charlie, delta, procedures, series) {
      if (innerTen === '') {
        innerTen = '-1.0'
      }
      if (outerTen === '') {
        outerTen = '-1.0'
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
      fetch('http://' + this.local + '/competition/score/set?scoreUUID=' + scoreUUID + '&score=' + parseFloat(score) + '&innerTen=' + parseFloat(innerTen) + '&outerTen=' + parseFloat(outerTen) + '&alfa=' + parseFloat(alfa) + '&charlie=' + parseFloat(charlie) + '&delta=' + parseFloat(delta) + '&procedures=' + parseFloat(procedures) + '&series=' + series, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.showloading()
              this.scoreLabel = null
              this.innerTen = ''
              this.outerTen = ''
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
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      }).catch(() => {
        this.message = 'Pojawił się problem - wynik niezostał wprowadzony'
        this.failure = true
        this.autoClose()
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
          response.text().then(
            response => {
              this.showloading()
              this.scoreLabel = null
              this.innerTen = ''
              this.outerTen = ''
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
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      }).catch(() => {
        this.message = 'Pojawił się problem - wynik niezostał wprowadzony'
        this.failure = true
        this.autoClose()
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
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.getCompetitionByID(this.uuid)
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
    toggleGunInScore () {
      fetch('http://' + this.local + '/competition/score/gun?scoreUUID=' + this.scoreUUID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.getCompetitionByID(this.uuid)
              this.autoClose()
              this.showloading()
            }
          )
        } else {
          response.text().then(
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
          response.text().then(
            response => {
              this.getCompetitionByID(this.uuid)
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
      }).catch(() => {
        this.message = 'Pojawił się problem - wynik niezostał wprowadzony'
        this.failure = true
        this.autoClose()
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
          response.text().then(
            response => {
              this.getCompetitionByID(this.uuid)
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
      }).catch(() => {
        this.message = 'Pojawił się problem - wynik niezostał wprowadzony'
        this.failure = true
        this.autoClose()
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
          response.text().then(
            response => {
              this.getCompetitionByID(this.uuid)
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
      }).catch(() => {
        this.message = 'Pojawił się problem - wynik niezostał wprowadzony'
        this.failure = true
        this.autoClose()
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
