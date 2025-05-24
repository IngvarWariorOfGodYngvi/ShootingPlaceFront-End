<template>
  <div>
    <div class="bg-grey col text-center text-black text-h6" style="border: solid transparent; border-radius: 20em;">{{ competition.name }}</div>
    <div class="full-width q-pa-none q-ma-none border-positive" style="border: solid 1px; border-radius: 2em;">
          <div class="row text-body2 full-width ghover">
            <div class="col"
                 @click="mobile?(setVariables (compStart)) : ' '"
                 @dblclick="!mobile?(setVariables (compStart)) : ' '">
              <div class="text-positive text-caption row q-pa-xs self-center text-center" style="cursor: pointer;">
                <div class="col-3 self-center">
                    {{ compStart.name }}
                </div>
                <div class="col-3 self-center" v-if="compStart != []">
                  {{ compStart.member != null ? temp = compStart.member.club.name : temp = compStart.otherPersonEntity.club.name }}
                </div>
                <div class="col-1 text-h6 self-center">{{ compStart.metricNumber }}</div>
                <div class="col-1 self-center">
                  <div v-if="competition.countingMethod === 'NORMAL'">{{compStart.innerTen}}</div>
                  <div v-if="competition.countingMethod === 'COMSTOCK'">{{compStart.innerTen}}</div>
                  <div v-if="competition.countingMethod === 'CZAS'"></div>
                  <div v-if="competition.countingMethod === 'IPSC'">{{ compStart.innerTen }}</div>
                  <div v-if="competition.countingMethod === 'Dynamika Dziesiątka'">
                    <div>{{ (compStart.alfa + compStart.charlie + compStart.delta) }}</div>
                    <div>{{ compStart.miss }}</div>
                  </div>
                </div>
                <div class="col-1 self-center">
                  <div v-if="competition.countingMethod === 'NORMAL'">{{compStart.outerTen}}</div>
                  <div v-if="competition.countingMethod === 'COMSTOCK'">{{compStart.outerTen}}</div>
                  <div v-if="competition.countingMethod === 'CZAS'"></div>
                  <div v-if="competition.countingMethod === 'IPSC'">
                    <div>{{ (compStart.alfa + compStart.charlie + compStart.delta) }}</div>
                    <div>{{ compStart.miss }}</div>
                  </div>
                  <div v-if="competition.countingMethod === 'Dynamika Dziesiątka'">{{ compStart.innerTen }}</div>
                </div>
                <div class="col-1 self-center">
                  <div v-if="competition.countingMethod === 'NORMAL'"></div>
                  <div v-if="competition.countingMethod === 'COMSTOCK'">{{compStart.procedures}}</div>
                  <div v-if="competition.countingMethod === 'CZAS'">{{compStart.procedures}}</div>
                  <div v-if="competition.countingMethod === 'IPSC'">{{ compStart.procedures }}</div>
                  <div v-if="competition.countingMethod === 'Dynamika Dziesiątka'">{{ compStart.procedures }}</div>
                </div>
                <div class="col-2 self-center">
                  <div v-if="compStart.dnf||compStart.dsq||compStart.pk"
                       class="self-center full-width text-center">
                    <div v-if="compStart.dnf">DNF ({{ compStart.score }})</div>
                    <div v-if="compStart.dsq">DSQ ({{ compStart.score }})</div>
                    <div v-if="compStart.pk">PK ({{ compStart.score }})</div>
                  </div>
                  <div v-else :class="compStart.edited?'':'bg-warning round1'">
                    <div v-if="competition.countingMethod === 'NORMAL'" class="text-center">
                      <div>{{ compStart.score }}</div>
                    </div>
                    <div v-if="competition.countingMethod === 'COMSTOCK'" class="text-center">
                      <div>{{ compStart.score }}</div>
                      <div>{{ compStart.hf.toFixed(4) }}</div>
                      <div>{{ compStart.outerTen }}</div>
                    </div>
                    <div v-if="competition.countingMethod === 'IPSC'" class="text-center">
                      <div>{{ compStart.score }}</div>
                      <div>{{ compStart.hf.toFixed(4) }}</div>
                      <div>{{ compStart.outerTen }}</div>
                    </div>
                    <div v-if="competition.countingMethod === 'Dynamika Dziesiątka'" class="text-center">
                      <div>{{ compStart.score }}</div>
                      <div>{{ compStart.hf.toFixed(4) }}</div>
                      <div>{{ compStart.outerTen }}</div>
                    </div>
                    <div v-if="competition.countingMethod === 'CZAS'" class="text-center">
                      <div>{{ compStart.score }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
    <q-dialog v-model="setScorePlayer">
      <q-card style="min-width: 95vw;min-height: 90vh; margin-bottom: 10vh" class="bg-dark" id="1">
        <q-card-section class="full-width">
          <div>
            <div class="text-h5 text-positive text-bold text-center">{{ compStart.name }} nr
              {{ startNumber }}
            </div>
          </div>
          <div>
            <div class="text-h5 text-positive text-bold text-center">{{ competitionTemp.name }}</div>
          </div>
          <!-- NORMAL -->
          <div v-if="competitionTemp.countingMethod === 'NORMAL'">
            <q-input input-class="text-center text-positive text-h6"
                   v-model="outerTen" type="number" min="0"
                   @keypress.enter="onEnter(scoreUUID)"
                   stack-label label="ilość 10 /" label-color="positive"
                   @input.self="outerTen=checkInput(outerTen)"
                   onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
            <q-input input-class="text-center text-positive text-h6"
                   v-model="innerTen" type="number" min="0"
                   @keypress.enter="onEnter(scoreUUID)"
                   stack-label label="ilość 10 X" label-color="positive"
                   @input.self="innerTen=checkInput(innerTen)"
                   onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                   <div v-if="player!=null && player.series.length>0 && competitionTemp.countingMethod === 'NORMAL'">
            <q-input v-for="(item, index) in player.series" :key="index"
                     @keypress.enter="onEnter(scoreUUID)"
                     @input="checkInput(series[index])"
                     onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode === 44  || event.charCode === 46"
                     v-model="series[index]" stack-label label-color="positive" type="number" min="0"
                     :label="'Seria ' + (index + 1)" input-class="text-center text-h6 text-positive">
            <q-popup-edit value="" content-class="bg-grey text-black" anchor="center middle" self="center middle"
                            style="opacity: 0.15"
                            @before-hide="removeClass()"
                            @before-show="tempSeries = series[index];series[index] = '';series = setSeriesValues(series); addClass()"
                            @hide="innerTenSeries=0;outerTenSeries=0;manuallyClosed?'':(series[index]=tempSeries, series = setSeriesValues(series));manuallyClosed=false">
              <div class="text-h6 text-black row" color="positive" label-color="positive">
                    <div class="col">
                      <div class="text-h5 text-bold text-center">{{ compStart.name }} nr
                        {{ startNumber }}
                      </div>
                      <div class="text-h5 text-bold text-center">Seria: {{ index+1 }}
                      </div>
                      <div>
                        <div class="text-h5 text-bold text-center">{{ competitionTemp.name }}</div>
                      </div>
                      <div class="full-width">|{{ series[index] }}|</div>
                      <div class="full-width">
                        <div :class="series[index]!=null?tableLength(series[index])>(competitionTemp.numberOfShots>10?10:competitionTemp.numberOfShots)?'text-h4 text-red':'':series[index] = 0">Ilość strzałów:
                          {{ tableLength(series[index]) }}
                        </div>
                        <div>10/: {{ outerTenSeries }} 10X: {{ innerTenSeries }} suma: {{ series[index].length > 0? sum(series[index]).toFixed(1): '0'}}</div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-9">
                      <div class="row">
                        <q-btn color="primary"
                               @click="series[index].length<1? series[index] = series[index]+'7': series[index].endsWith('.')?series[index] = series[index]+'7':series[index] = series[index]+'+7';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                               class="q-pa-xs text-h6 col-4" style="border: 2px solid">7
                        </q-btn>
                        <q-btn color="primary"
                        @click="series[index].length<1? series[index] = series[index]+'8': series[index].endsWith('.')?series[index] = series[index]+'8':series[index] = series[index]+'+8';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                        class="q-pa-xs text-h6 col-4" style="border: 2px solid">8
                        </q-btn>
                        <q-btn color="primary"
                        @click="series[index].length<1? series[index] = series[index]+'9': series[index].endsWith('.')?series[index] = series[index]+'9':series[index] = series[index]+'+9';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                        class="q-pa-xs text-h6 col-4" style="border: 2px solid">9
                        </q-btn>
                      </div>
                      <div class="row">
                        <q-btn color="primary"
                        @click="series[index].length<1? series[index] = series[index]+'4': series[index].endsWith('.')?series[index] = series[index]+'4':series[index] = series[index]+'+4';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                        class="q-pa-xs text-h6 col-4" style="border: 2px solid">4
                        </q-btn>
                        <q-btn color="primary"
                        @click="series[index].length<1? series[index] = series[index]+'5': series[index].endsWith('.')?series[index] = series[index]+'5':series[index] = series[index]+'+5';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                        class="q-pa-xs text-h6 col-4" style="border: 2px solid">5
                        </q-btn>
                        <q-btn color="primary"
                        @click="series[index].length<1? series[index] = series[index]+'6': series[index].endsWith('.')?series[index] = series[index]+'6':series[index] = series[index]+'+6';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                        class="q-pa-xs text-h6 col-4" style="border: 2px solid">6
                        </q-btn>
                      </div>
                      <div class="row">
                        <q-btn color="primary"
                        @click="series[index].length<1? series[index] = series[index]+'1': series[index].endsWith('.')?series[index] = series[index]+'1':series[index] = series[index]+'+1';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                        class="q-pa-xs text-h6 col-4" style="border: 2px solid">1
                        </q-btn>
                        <q-btn color="primary"
                        @click="series[index].length<1? series[index] = series[index]+'2': series[index].endsWith('.')?series[index] = series[index]+'2':series[index] = series[index]+'+2';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                        class="q-pa-xs text-h6 col-4" style="border: 2px solid">2
                        </q-btn>
                        <q-btn color="primary"
                        @click="series[index].length<1? series[index] = series[index]+'3': series[index].endsWith('.')?series[index] = series[index]+'3':series[index] = series[index]+'+3';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                        class="q-pa-xs text-h6 col-4" style="border: 2px solid">3
                        </q-btn>
                      </div>
                      <div class="row">
                        <q-btn color="primary"
                               @click="series[index].length<1? series[index] = series[index]+'.':series[index] = series[index]+'.';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                               class="q-pa-xs text-h6 col-3" style="border: 2px solid">.
                        </q-btn>
                        <q-btn color="primary"
                        @click="series[index].length<1? series[index] = series[index]+'0': series[index].endsWith('.')?series[index] = series[index]+'0':series[index] = series[index]+'+0';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                               class="q-pa-xs text-h6 col-3" style="border: 2px solid">0
                        </q-btn>
                        <q-btn color="primary"
                               @click="series[index].length<1? series[index] = series[index]+'10X':series[index] = series[index]+'+10X';innerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                               class="q-pa-xs text-h6 col-3" style="border: 2px solid">10X
                        </q-btn>
                        <q-btn color="primary"
                               @click="series[index].length<1? series[index] = series[index]+'10/':series[index] = series[index]+'+10/';outerTenSeriesCounter(series[index]);series=setSeriesValues(series)"
                               class="q-pa-xs text-h6 col-3" style="border: 2px solid">10/
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
                             @click="series[index] ==null?series[index] ='':'';series[index] = sumByClick(series[index]).toFixed(1);series = setSeriesValues(series);manuallyClosed=true"/>
                      <q-btn class="q-pa-xs full-width text-h6" style="border: 2px solid" color="primary"
                             text-color="white" label="Anuluj"
                             @click="series[index]=tempSeries;manuallyClosed=true;series = setSeriesValues(series)"
                             v-close-popup/>
                    </div>
                  </div>
                </q-popup-edit>
              </q-input>
            </div>
          </div>
          <!-- END NORMAL -->
          <!-- COMSTOCK -->
          <div v-if="competitionTemp.countingMethod === 'COMSTOCK'"
              class="col">
            <div class="row">
              <q-input v-if="(alfa === '' || alfa === 0) && (charlie === '' || charlie === 0) && (delta === '' || delta === 0)" type="number" min="0"
                        input-class="text-center text-positive text-h6" v-model="outerTen" class="col-3"
                        @keypress.enter=" onEnter(scoreUUID)"
                        @focus="temp=outerTen; outerTen=''"
                        @blur="outerTen===''?outerTen=temp:''"
                        stack-label label="trafienia" label-color="positive"
                        onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                 @keypress.enter=" onEnter(scoreUUID)" type="number" min="0"
                 input-class="text-center text-positive text-h6" v-model="alfa" class="col" stack-label label="Alfa"
                 @focus="temp=alfa; alfa=''"
                 @blur="alfa===''?alfa=temp:''"
                 label-color="positive"
                 onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                 @keypress.enter=" onEnter(scoreUUID)" type="number" min="0"
                 input-class="text-center text-positive text-h6" v-model="charlie" class="col" stack-label
                 @focus="temp=charlie; charlie=''"
                 @blur="charlie===''?charlie=temp:''"
                 label="Charlie" label-color="positive"
                 onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <q-input
                  @keypress.enter=" onEnter(scoreUUID)" type="number" min="0"
                  input-class="text-center text-positive text-h6" v-model="delta" class="col" stack-label label="Delta"
                  @focus="temp=delta; delta=''"
                  @blur="delta===''?delta=temp:''"
                  label-color="positive"
                  onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <div class="col-3 text-center self-center text-positive" style="border-top: 2px solid white;border-right: 2px solid white;border-left: 2px solid white;">
                <label>trafień / miss</label>
                <div class="text-h6">{{ (Number(alfa!==0&&alfa!==''?alfa:outerTen)+ Number(charlie) + Number(delta)) }} / {{(competitionTemp.numberOfShots - ((Number(alfa!==0?alfa:outerTen)+ Number(charlie) + Number(delta))))}}</div>
              </div>
            </div>
            <div class="row">
              <q-input input-class="text-center text-positive text-h6" v-model="innerTen" type="number" min="0"
                       @keypress.enter=" onEnter(scoreUUID)" class="col"
                       stack-label label="czas" label-color="positive"
                       @focus="temp=innerTen; innerTen=''"
                       @blur="innerTen===''?innerTen=temp:''"
                       onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
              <q-input input-class="text-center text-positive text-h6" v-model="procedures" type="number" min="0"
                       @keypress.enter="onEnter(scoreUUID)" class="col"
                       @focus="temp=procedures; procedures=''"
                       @blur="procedures===''?procedures=temp:''"
                       stack-label :label="`procedury + ${shootingPlace == 'prod'?'3':'5'} sek`" label-color="positive"
                       onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
              <div class="col-6 text-center self-center text-positive row">
                <div class="col" style="border-top: 2px solid white;border-bottom: 2px solid white;border-left: 2px solid white;">
                  <label>pkt</label>
                  <div class="text-h6"> {{ getPkt(competitionTemp.countingMethod) - ((competitionTemp.numberOfShots - ((Number(alfa!==0&&alfa!==''?alfa:outerTen)+ Number(charlie) + Number(delta))))*10) }}</div>
                </div>
                <div class="col" style="border-bottom: 2px solid white;border-right: 2px solid white;">
                  <label>hf</label>
                  <div v-if="getPkt(competitionTemp.countingMethod) - ((competitionTemp.numberOfShots - ((Number(alfa!==0&&alfa!==''?alfa:outerTen)+ Number(charlie) + Number(delta))))*10)<0" class="text-h6">0</div>
                  <div v-else class="text-h6">{{ Number((getPkt(competitionTemp.countingMethod) - ((competitionTemp.numberOfShots - ((Number(alfa!==0&&alfa!==''?alfa:outerTen)+ Number(charlie) + Number(delta))))*10)) / (Number(innerTen) + Number(procedures * (shootingPlace == 'prod'?3:5)))).toFixed(4) }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- END COMSTOCK -->
          <!-- CZAS -->
          <div v-if="competitionTemp.countingMethod === 'CZAS'" class="col">
            <q-input input-class="text-center text-positive text-h6" v-model="scoreLabel" type="number"
              @keypress.enter=" onEnter(scoreUUID)"
              @focus="temp=scoreLabel; scoreLabel=''"
              @blur="scoreLabel===''?scoreLabel=temp:''"
              stack-label label="czas" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
            <q-input input-class="text-center text-positive text-h6" v-model="procedures" type="number"
              @keypress.enter="onEnter(scoreUUID)"
              @focus="temp=procedures; procedures=''"
              @blur="procedures===''?procedures=temp:''"
              stack-label :label="`procedury + ${shootingPlace == 'prod'?'3':'5'} sek`" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
          </div>
          <!-- END CZAS -->
          <!-- IPSC -->
          <div v-if="competitionTemp.countingMethod === 'IPSC'" class="col">
            <q-input input-class="text-center text-positive text-h6" v-model="innerTen" type="number"
                @keypress.enter=" onEnter(scoreUUID)"
                @focus="temp=innerTen; innerTen=''"
                @blur="innerTen===''?innerTen=temp:''"
                stack-label label="czas" label-color="positive"
                onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
              <div class="row full-width">
                <q-input
                    @keypress.enter=" onEnter(scoreUUID)" type="number"
                    input-class="text-center text-positive text-h6" v-model="alfa" class="col-3" stack-label label="Alfa"
                    @focus="temp=alfa; alfa=''"
                    @blur="alfa===''?alfa=temp:''"
                    label-color="positive"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                    @keypress.enter=" onEnter(scoreUUID)" type="number"
                    input-class="text-center text-positive text-h6" v-model="charlie" class="col-3" stack-label
                    label="Charlie" label-color="positive"
                    @focus="temp=charlie; charlie=''"
                    @blur="charlie===''?charlie=temp:''"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                    @keypress.enter=" onEnter(scoreUUID)" type="number"
                    input-class="text-center text-positive text-h6" v-model="delta" class="col-3" stack-label label="Delta"
                    @focus="temp=delta; delta=''"
                    @blur="delta===''?delta=temp:''"
                    label-color="positive"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <div class="col-3 text-center self-center text-positive"  style="border-top: 2px solid white; border-left: 2px solid white; border-right: 2px solid white ">
                  <label>trafień</label>
                  <div class="text-h6">{{ (Number(alfa)+ Number(charlie) + Number(delta)) }}</div>
                </div>
              </div>
              <div class="row full-width">
                <q-input input-class="text-center text-positive text-h6" v-model="miss" type="number"
                    @keypress.enter=" onEnter(scoreUUID)" class="col"
                    @focus="temp=miss; miss=''"
                    @blur="miss===''?miss=temp:''"
                    stack-label label="miss" label-color="positive"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
                <q-input input-class="text-center text-positive text-h6" v-model="procedures" type="number"
                    @keypress.enter="onEnter(scoreUUID)" class="col-4"
                    @focus="temp=procedures; procedures=''"
                    @blur="procedures===''?procedures=temp:''"
                    stack-label :label="`procedury`" label-color="positive"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <div class="col-6 text-center self-center text-positive row">
                  <div class="col"  style="border-bottom: 2px solid white; border-left: 2px solid white; border-top: 2px solid white ">
                    <label>pkt</label>
                    <div class="text-h6"> {{ getPkt(competitionTemp.type) }}</div>
                  </div>
                  <div class="col"  style="border-bottom: 2px solid white; border-right: 2px solid white ">
                    <label>hf</label>
                    <div class="text-h6">{{ ( Number(getPkt(competitionTemp.type)) / Number(innerTen) ).toFixed(4) }}</div>
                  </div>
                </div>
              </div>
          </div>
          <!-- END IPSC -->
          <!-- Dynamika Dziesiątka -->
          <div v-if="competitionTemp.countingMethod === 'Dynamika Dziesiątka'" class="col">
            <q-input input-class="text-center text-positive text-h6" v-model="innerTen" type="number"
                @keypress.enter=" onEnter(scoreUUID)"
                @focus="temp=innerTen; innerTen=''"
                @blur="innerTen===''?innerTen=temp:''"
                stack-label label="czas" label-color="positive"
                onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
              <div class="row full-width">
                <q-input
                    @keypress.enter=" onEnter(scoreUUID)" type="number"
                    @focus="temp=alfa; alfa=''"
                    @blur="alfa===''?alfa=temp:''"
                    input-class="text-center text-positive text-h6" v-model="alfa" class="col-3" stack-label label="Alfa"
                    label-color="positive"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                    @keypress.enter=" onEnter(scoreUUID)" type="number"
                    @focus="temp=charlie; charlie=''"
                    @blur="charlie===''?charlie=temp:''"
                    input-class="text-center text-positive text-h6" v-model="charlie" class="col-3" stack-label
                    label="Charlie" label-color="positive"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <q-input
                    @keypress.enter=" onEnter(scoreUUID)" type="number"
                    @focus="temp=delta; delta=''"
                    @blur="delta===''?delta=temp:''"
                    input-class="text-center text-positive text-h6" v-model="delta" class="col-3" stack-label label="Delta"
                    label-color="positive"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <div class="col-3 text-center self-center text-positive"  style="border-top: 2px solid white; border-left: 2px solid white; border-right: 2px solid white ">
                  <label>trafień</label>
                  <div class="text-h6">{{ (Number(alfa)+ Number(charlie) + Number(delta)) }}</div>
                </div>
              </div>
              <div class="row full-width">
                <q-input input-class="text-center text-positive text-h6" v-model="miss" type="number"
                    @keypress.enter=" onEnter(scoreUUID)" class="col"
                    @focus="temp=miss; miss=''"
                    @blur="miss===''?miss=temp:''"
                    stack-label label="miss" label-color="positive"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
                <q-input input-class="text-center text-positive text-h6" v-model="procedures" type="number"
                    @keypress.enter="onEnter(scoreUUID)" class="col-4"
                    @focus="temp=procedures; procedures=''"
                    @blur="procedures===''?procedures=temp:''"
                    stack-label :label="`procedury`" label-color="positive"
                    onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                <div class="col-6 text-center self-center text-positive row">
                  <div class="col"  style="border-bottom: 2px solid white; border-left: 2px solid white; border-top: 2px solid white ">
                    <label>pkt</label>
                    <div class="text-h6"> {{ getPkt(competitionTemp.countingMethod) }}</div>
                  </div>
                  <div class="col"  style="border-bottom: 2px solid white; border-right: 2px solid white ">
                    <label>hf</label>
                    <div class="text-h6">{{ ( Number(getPkt(competitionTemp.countingMethod)) / Number(innerTen + (procedures * 3)) ).toFixed(4) }}</div>
                  </div>
                </div>
              </div>
          </div>
          <!-- END Dynamika Dziesiątka -->
          <!-- CLOSING -->
          <div class="row full-width q-pb-sm">
            <q-btn class="col-6" text-color="white" label="Anuluj" color="primary" v-close-popup/>
            <q-btn class="col-6" color="primary" label="Zapisz" text-color="white" v-close-popup
            @click="setScore(scoreUUID, scoreLabel, innerTen, outerTen, alfa, charlie, delta, procedures, miss, series)"/>
          </div>
          <!-- TOGGLE -->
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
<style src="src\style\style.scss" lang="scss">

</style>
<script>
import App from 'src/App.vue'

export default {
  data () {
    return {
      compStart: [],
      competition: '',
      number: '',
      val: [],
      temp: '',
      tempVar: null,
      competitionTemp: '',
      legitimationNumber: null,
      setScorePlayer: false,
      calibers: [],
      infoScore: [],
      caliberUUID: null,
      scoreUUID: null,
      singleScore: null,
      score: '',
      scoreLabel: '',
      innerTen: '',
      innerTenSeries: 0,
      outerTen: '',
      outerTenSeries: 0,
      alfa: '',
      charlie: '',
      delta: '',
      miss: '',
      series: [],
      tempSeries: [],
      manuallyClosed: false,
      player: null,
      procedures: '',
      quantity: false,
      metric: null,
      ammoQuantity: null,
      gunAdded: false,
      compName: null,
      failure: false,
      success: false,
      message: null,
      mobile: App.mobile,
      main: App.main,
      local: App.host
    }
  },
  created () {
    this.getFilteredCompetitionByID(this.uuid, this.startNumber)
    this.getCompetitionDTOByUUID(this.uuid)
  },
  props: {
    uuid: {
      type: String,
      required: true
    },
    startNumber: {
      type: Number,
      required: true
    }
  },
  watch: {
    startNumber (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getFilteredCompetitionByID(this.uuid, this.startNumber)
        this.getCompetitionDTOByUUID(this.uuid)
      }
    }
  },
  methods: {
    getFilteredCompetitionByID (uuid, number) {
      this.compStart = ''
      fetch(`${this.local}/competitionMembersList/getFilteredByID/?uuid=${uuid}&startNumber=${number}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response != null) {
          response.json().then(response => {
            this.compStart = response
          }).catch(() => {
            this.message = 'coś poszło nie tak'
            this.failure = true
            this.autoClose()
          })
        }
      })
    },
    getCompetitionDTOByUUID (uuid) {
      fetch(`${this.local}/competitionMembersList/getCompetitionDTOByUUID/?uuid=${uuid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        response.json().then(response => {
          this.competition = response
        })
      })
    },
    addClass () {
      document.getElementById('1').classList.add('blind')
    },
    removeClass () {
      document.getElementById('1').classList.remove('blind')
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
    getPkt (type) {
      let pkt
      console.log(type)
      if (type === 'MINOR') {
        pkt = (((Number(this.alfa) * 5) + (Number(this.charlie) * 3) + (Number(this.delta) * 1)) - (this.miss * 10) - (this.procedures * 10))
      }
      if (type === 'MAJOR') {
        pkt = (((Number(this.alfa) * 5) + (Number(this.charlie) * 4) + (Number(this.delta) * 2)) - (this.miss * 10) - (this.procedures * 10))
      }
      if (type === 'Dynamika Dziesiątka') {
        pkt = (((Number(this.alfa) * 5) + (Number(this.charlie) * 3) + (Number(this.delta) * 1)))
        console.log(pkt)
      }
      if (type === 'COMSTOCK') {
        pkt = (((Number(this.alfa !== 0 && this.alfa !== '' ? this.alfa : this.outerTen) * 5) + (Number(this.charlie) * 3) + (Number(this.delta) * 1)))
      }
      return pkt > 0 ? pkt : 0
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    setVariables (item) {
      this.scoreUUID = item.uuid
      this.player = item
      this.scoreLabel = item.score
      this.innerTen = checkZero(item.innerTen)
      this.outerTen = checkZero(item.outerTen)
      this.procedures = checkZero(item.procedures)
      this.alfa = checkZero(item.alfa)
      this.charlie = checkZero(item.charlie)
      this.delta = checkZero(item.delta)
      this.miss = checkZero(item.miss)
      this.setScorePlayer = true
      this.series = this.setSeriesValues(item.series)
      this.temp = item.member != null ? item.member : item.otherPersonEntity
      this.number = item.metricNumber
      this.competitionTemp = this.competition
      function checkZero (number) {
        return number.toString() !== 0 ? number : ''
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
      this.setScore(scoreUUID, this.scoreLabel, this.innerTen, this.outerTen, this.alfa, this.charlie, this.delta, this.procedures, this.miss, this.series)
    },
    setScore (scoreUUID, score, innerTen, outerTen, alfa, charlie, delta, procedures, miss, series) {
      if (innerTen === '' || innerTen === 'NaN') {
        innerTen = '-1.0'
      }
      if (outerTen === '' || outerTen === 'NaN') {
        outerTen = '-1.0'
      }
      if (alfa === '' || alfa === 'NaN') {
        alfa = '-1'
      }
      if (charlie === '' || charlie === 'NaN') {
        charlie = '-1'
      }
      if (delta === '' || delta === 'NaN') {
        delta = '-1'
      }
      if (score === null) {
        score = '-1'
      }
      if (procedures === '' || procedures === 'NaN') {
        procedures = '-1'
      }
      if (miss === '' || miss === 'NaN') {
        miss = '-1'
      }
      score = score.toString().replaceAll(/,/gi, '.')
      innerTen = innerTen.toString().replaceAll(/,/gi, '.')
      outerTen = outerTen.toString().replaceAll(/,/gi, '.')
      alfa = alfa.toString().replaceAll(/,/gi, '.')
      charlie = charlie.toString().replaceAll(/,/gi, '.')
      delta = delta.toString().replaceAll(/,/gi, '.')
      procedures = procedures.toString().replaceAll(/,/gi, '.')
      miss = miss.toString().replaceAll(/,/gi, '.')
      fetch(`${this.local}/competition/score/set?scoreUUID=${scoreUUID}&score=${score}&innerTen=${innerTen}&outerTen=${outerTen}&alfa=${alfa}&charlie=${charlie}&delta=${delta}&procedures=${procedures}&miss=${miss}&series=${series}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.showloading()
              this.scoreLabel = ''
              this.innerTen = ''
              this.outerTen = ''
              this.procedures = ''
              this.alfa = ''
              this.charlie = ''
              this.delta = ''
              this.miss = ''
              this.message = response
              this.success = true
              this.getFilteredCompetitionByID(this.uuid, this.startNumber)
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
    toggleDnfScore () {
      fetch(`${this.local}/competition/score/dnf?scoreUUID=${this.scoreUUID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.getFilteredCompetitionByID(this.uuid, this.startNumber)
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
      fetch(`${this.local}/competition/score/dsq?scoreUUID=${this.scoreUUID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.getFilteredCompetitionByID(this.uuid, this.startNumber)
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
      fetch(`${this.local}/competition/score/pk?scoreUUID=${this.scoreUUID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.getFilteredCompetitionByID(this.uuid, this.startNumber)
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
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>
