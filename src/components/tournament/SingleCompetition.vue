<template>
  <div class="col q-pa-md bg-dark">
    <div class="row">
      <div dense class="row col" standout="bg-accent text-positive">
        <div class="col-1 self-center text-left text-positive text-caption">Amunicja</div>
        <div class="col-2 self-center text-left text-positive">Zawodnik</div>
        <div class="col-2 self-center text-center text-positive">Klub</div>
        <div class="col self-center text-center text-positive">Wynik</div>
      </div>
    </div>
    <div v-for="(item, index) in competition.scoreList" :key="index" class="full-width q-pa-none ghover">
      <div class="row text-body2 full-width">
        <!-- button -->
        <div class="row" style="width: 5%;">
          <q-btn dense glossy class="full-width box"
            :icon="item.ammunition === false && item.gun === false ? 'book' : item.ammunition === true && item.gun === false ? 'done book' : item.ammunition === false && item.gun === true ? 'book done' : item.ammunition === true && item.gun === true ? 'done' : 'book'"
            @click="scoreUUID = item.uuid; temp = item.member != null ? item.member : item.otherPersonEntity.secondName; item.member != null ? (memberLeg = item.member.legitimationNumber, otherID = 0) : (otherID = item.otherPersonEntity.id, memberLeg = 0); getListCalibers(); caliberUUID = competition.caliberUUID; ammoQuantity = competition.practiceShots + competition.numberOfShots; member = item.member; other = item.otherPersonEntity; addAmmo = true">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 0]">{{ item.ammunition === false &&
              item.gun === false ? 'Wydaj broń lub amunicję' : item.ammunition === true && item.gun === false ? 'Amunicja              wydana':item.ammunition === false && item.gun === true?'Broń wydana':'Broń i Amunicja Wydane' }}
            </q-tooltip>
          </q-btn>
        </div>
        <!-- name & club -->
        <div class="col-5 box" @dblclick="item.member != null && item.member.uuid ? memberExist = true : memberExist = false; item.member != null ?
          (memberUUID = item.member.uuid, otherID = 0, temp = item.member, memberLeg = item.member.legitimationNumber, name = item.member.secondName + ' ' + item.member.firstName + ' ' + item.member.legitimationNumber)
          :
          (memberUUID = '0', otherID = item.otherPersonEntity.id, temp = item.otherPersonEntity, name = item.otherPersonEntity.secondName + ' ' + item.otherPersonEntity.firstName + ' ' + item.otherPersonEntity.id);
        date = competition.date; startNumber = item.metricNumber; getScoreInfo(); metricsInfo = true">
          <div dense standout="bg-accent text-positive row" class="row fit text-positive">
            <q-tooltip content-class="bg-dark text-positive text-subtitle2" self="bottom middle" :offset="[0, 0]" anchor="top middle">Kliknij 2 razy aby wydrukować metryki</q-tooltip>
            <div class="self-center row full-width text-caption">
              <div class="text-positive">&nbsp;{{ index + 1 }}.</div>
              <div class="col text-positive">
                {{ item.member != null ? temp = item.member.secondName : temp = item.otherPersonEntity.secondName }}
                {{ item.member != null ? temp = item.member.firstName : temp = item.otherPersonEntity.firstName }}
              </div>
              <div class="self-center col-5 no-outline text-positive">
                {{ item.member != null ? temp = item.member.club.shortName : temp = item.otherPersonEntity.club.shortName }}
              </div>
            </div>
          </div>
        </div>
        <!-- metric -->
        <div class="col-1 text-positive box"
          @dblclick="scoreUUID = item.uuid; metric = item.metricNumber;item.member != null && item.member.uuid ? memberExist = true : memberExist = false; item.member != null ?
          (memberUUID = item.member.uuid, otherID = 0, temp = item.member, memberLeg = item.member.legitimationNumber, name = item.member.secondName + ' ' + item.member.firstName)
          :
          (memberUUID = '0', otherID = item.otherPersonEntity.id, temp = item.otherPersonEntity, name = item.otherPersonEntity.secondName + ' ' + item.otherPersonEntity.firstName); toggleDSQDNF = true">
          <q-tooltip content-class="bg-dark text-positive text-subtitle2" self="bottom middle" :offset="[0, 0]" anchor="top middle">Przyznaj kary</q-tooltip>
          <div class="text-center">
            <label style="font-size: 10px">metryka</label>
            <div class="self-center text-center text-positive text-caption">
              {{ item.metricNumber }}
            </div>
          </div>
        </div>
        <div v-if="competition.countingMethod === 'Pojedynek Strzelecki'" class="row col box">
          <q-popup-edit @before-show="setVariables(item); series = setSeriesValues(item.series)" value=""
            content-class="bg-dark text-positive">
            <q-input @focus="scoreUUID = item.uuid" input-class="text-center text-positive" v-model="outerTen"
              @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus stack-label
              label="ilość 10 zwykłe" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @focus="scoreUUID = item.uuid" input-class="text-center text-positive" v-model="innerTen"
              @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus stack-label
              label="ilość 10 wewnętrzne" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode === 44  || event.charCode === 46"
              v-model="forceScore" stack-label label-color="positive"
              @keypress.enter="scoreUUID = item.uuid; forceSetScore(item.uuid,forceScore)" :label="'wynik'"
              input-class="text-center text-positive" />
            <div class="q-pa-xs text-center">
              <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
              <q-btn color="primary" label="Zapisz" v-close-popup
                @click="scoreUUID = item.uuid; forceSetScore(item.uuid,forceScore)"></q-btn>
            </div>
          </q-popup-edit>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">10 wew.</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.innerTen }}
            </div>
          </div>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">10 zw.</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.outerTen }}
            </div>
          </div>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">Wynik</label>
            <div v-if="item.dnf || item.dsq || item.pk" class="self-center col text-center text-positive text-caption">
              <div v-if="item.dnf">DNF ({{ item.score }})</div>
              <div v-if="item.dsq">DSQ ({{ item.score }})</div>
              <div v-if="item.pk">PK ({{ item.score }})</div>
            </div>
            <div v-else
              :class="`self-center col text-center text-positive text-caption ${item.edited ? '' : 'bg-warning round1'}`">
              {{ item.score }}
            </div>
          </div>
        </div>
        <div v-if="competition.countingMethod === 'NORMAL'" class="row col box">
          <q-popup-edit @before-show="setVariables(item); series = setSeriesValues(item.series)" value=""
            content-class="bg-dark text-positive">
            <q-input @focus="scoreUUID = item.uuid" input-class="text-center text-positive" v-model="outerTen"
              @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus stack-label
              label="ilość 10 zwykłe" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @focus="scoreUUID = item.uuid" input-class="text-center text-positive" v-model="innerTen"
              @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus stack-label
              label="ilość 10 wewnętrzne" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input v-for="(item1, index) in item.series" :key="index" @focus="scoreUUID = item1.uuid"
              @input="replaceComa(series[index], index)"
              onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode === 44  || event.charCode === 46"
              v-model="series[index]" stack-label label-color="positive"
              @keypress.enter="scoreUUID = item.uuid; onEnter(item.uuid)" :label="'Seria ' + (index + 1)"
              input-class="text-center text-positive" />
            <div class="q-pa-xs text-center">
              <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
              <q-btn color="primary" label="Zapisz" v-close-popup
                @click="scoreUUID = item.uuid; setScore(item.uuid, scoreLabel, innerTen, outerTen, alfa, charlie, delta, procedures, miss, series)"></q-btn>
            </div>
          </q-popup-edit>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">10 wew.</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.innerTen }}
            </div>
          </div>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">10 zw.</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.outerTen }}
            </div>
          </div>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">Wynik</label>
            <div v-if="item.dnf || item.dsq || item.pk" class="self-center col text-center text-positive text-caption">
              <div v-if="item.dnf">DNF ({{ item.score }})</div>
              <div v-if="item.dsq">DSQ ({{ item.score }})</div>
              <div v-if="item.pk">PK ({{ item.score }})</div>
            </div>
            <div v-else
              :class="`self-center col text-center text-positive text-caption ${item.edited ? '' : 'bg-warning round1'}`">
              {{ item.score }}
            </div>
          </div>
        </div>
        <div v-if="competition.countingMethod === 'COMSTOCK'" class="row col box">
          <q-popup-edit @before-show="setVariables(item); series = setSeriesValues(item.series)" value=""
            content-class="bg-dark text-positive">
            <q-input type="number" min="0" input-class="text-center text-positive text-h6" v-model="outerTen"
              class="col-3" @keypress.enter=" onEnter(scoreUUID)" stack-label label="trafienia" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" type="number" min="0"
              input-class="text-center text-positive text-h6" v-model="alfa" class="col" stack-label label="Alfa"
              label-color="positive" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" type="number" min="0"
              input-class="text-center text-positive text-h6" v-model="charlie" class="col" stack-label label="Charlie"
              label-color="positive" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" type="number" min="0"
              input-class="text-center text-positive text-h6" v-model="delta" class="col" stack-label label="Delta"
              label-color="positive" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="innerTen" class="col" stack-label label="czas" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58 || event.charCode > 44 || event.charCode < 46)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" type="number" min="0"
              input-class="text-center text-positive text-h6" v-model="procedures" class="col" stack-label
              label="procedury" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <div class="q-pa-xs text-center">
              <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
              <q-btn color="primary" label="Zapisz" v-close-popup
                @click="scoreUUID = item.uuid; setScore(item.uuid, scoreLabel, innerTen, outerTen, alfa, charlie, delta, procedures, miss, series)"></q-btn>
            </div>
          </q-popup-edit>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">tr.</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.outerTen }}
            </div>
          </div>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">czas</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.innerTen }}
            </div>
          </div>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">proc.</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.procedures }}
            </div>
          </div>
          <div class="text-center col-3">
            <label class="text-positive" style="font-size: 10px;">Wynik / HF</label>
            <div v-if="item.dnf || item.dsq || item.pk" class="self-center col text-center text-positive text-caption">
              <div v-if="item.dnf">DNF ({{ item.score }})</div>
              <div v-if="item.dsq">DSQ ({{ item.score }})</div>
              <div v-if="item.pk">PK ({{ item.score }})</div>
            </div>
            <div v-else
              :class="`self-center col text-center text-positive text-caption ${item.edited ? '' : 'bg-warning round1'}`">
              {{ item.score }} / {{ item.hf }}
            </div>
          </div>
        </div>
        <div v-if="competition.countingMethod === 'CZAS'" class="row col box">
          <q-popup-edit @before-show="setVariables(item); series = setSeriesValues(item.series)" value=""
            content-class="bg-dark text-positive">
            <q-input @focus="scoreUUID = item.uuid" input-class="text-center text-positive" v-model="scoreLabel"
              @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus stack-label label="czas"
              label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58 || event.charCode > 44 || event.charCode < 46)" />
            <q-input @focus="scoreUUID = item.uuid" input-class="text-center text-positive" v-model="procedures"
              @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus stack-label label="procedury"
              label-color="positive" onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <div class="q-pa-xs text-center">
              <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
              <q-btn color="primary" label="Zapisz" v-close-popup
                @click="scoreUUID = item.uuid; setScore(item.uuid, scoreLabel, innerTen, outerTen, alfa, charlie, delta, procedures, miss, series)"></q-btn>
            </div>
          </q-popup-edit>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">proc.</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.procedures }}
            </div>
          </div>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">czas</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.score }}
            </div>
          </div>
        </div>
        <div v-if="competition.countingMethod === 'IPSC'" class="row col box">
          <q-popup-edit @before-show="setVariables(item); series = setSeriesValues(item.series)" value=""
            content-class="bg-dark text-positive">
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="alfa" class="col" stack-label label="Alfa" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="charlie" class="col" stack-label label="Charlie" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="delta" class="col" stack-label label="Delta" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="innerTen" class="col" stack-label label="czas" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58 || event.charCode > 44 || event.charCode < 46)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="procedures" class="col" stack-label label="procedury" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="miss" class="col" stack-label label="miss" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <div class="q-pa-xs text-center">
              <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
              <q-btn color="primary" label="Zapisz" v-close-popup
                @click="scoreUUID = item.uuid; setScore(item.uuid, scoreLabel, innerTen, outerTen, alfa, charlie, delta, procedures, miss, series)"></q-btn>
            </div>
          </q-popup-edit>
          <div class="text-center row col">
            <div class="col">
              <label class="text-positive" style="font-size: 10px;">alfa</label>
              <div class="self-center col text-center text-positive text-caption">
                {{ item.alfa }}
              </div>
            </div>
            <div class="col">
              <label class="text-positive" style="font-size: 10px;">charlie</label>
              <div class="self-center col text-center text-positive text-caption">
                {{ item.charlie }}
              </div>
            </div>
            <div class="col">
              <label class="text-positive" style="font-size: 10px;">delta</label>
              <div class="self-center col text-center text-positive text-caption">
                {{ item.delta }}
              </div>
            </div>
          </div>
          <div class="text-center col-1">
            <label class="text-positive" style="font-size: 10px;">miss</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.miss }}
            </div>
          </div>
          <div class="text-center col-1">
            <label class="text-positive" style="font-size: 10px;">czas</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.innerTen }}
            </div>
          </div>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">Wynik / HF</label>
            <div :class="`self-center col text-center text-positive text-caption ${item.edited ? '' : 'bg-warning round1'}`">
              {{ item.score }} / {{ item.hf.toFixed(4) }}
            </div>
          </div>
        </div>
        <div v-if="competition.countingMethod === 'Dynamika Dziesiątka'" class="row col box">
          <q-popup-edit @before-show="setVariables(item); series = setSeriesValues(item.series)" value=""
            content-class="bg-dark text-positive">
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="alfa" class="col" stack-label label="Alfa" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="charlie" class="col" stack-label label="Charlie" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="delta" class="col" stack-label label="Delta" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="innerTen" class="col" stack-label label="czas" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58 || event.charCode > 44 || event.charCode < 46)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="procedures" class="col" stack-label label="procedury" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <q-input @keypress.enter=" onEnter(scoreUUID)" input-class="text-center text-positive text-h6"
              v-model="miss" class="col" stack-label label="miss" label-color="positive"
              onkeypress="return (event.charCode > 47 && event.charCode < 58)" />
            <div class="q-pa-xs text-center">
              <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
              <q-btn color="primary" label="Zapisz" v-close-popup
                @click="scoreUUID = item.uuid; setScore(item.uuid, scoreLabel, innerTen, outerTen, alfa, charlie, delta, procedures, miss, series)"></q-btn>
            </div>
          </q-popup-edit>
          <div class="text-center row col">
            <div class="col">
              <label class="text-positive" style="font-size: 10px;">alfa</label>
              <div class="self-center col text-center text-positive text-caption">
                {{ item.alfa }}
              </div>
            </div>
            <div class="col">
              <label class="text-positive" style="font-size: 10px;">charlie</label>
              <div class="self-center col text-center text-positive text-caption">
                {{ item.charlie }}
              </div>
            </div>
            <div class="col">
              <label class="text-positive" style="font-size: 10px;">delta</label>
              <div class="self-center col text-center text-positive text-caption">
                {{ item.delta }}
              </div>
            </div>
          </div>
          <div class="text-center col-1">
            <label class="text-positive" style="font-size: 10px;">miss</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.miss }}
            </div>
          </div>
          <div class="text-center col-1">
            <label class="text-positive" style="font-size: 10px;">czas</label>
            <div class="self-center col text-center text-positive text-caption">
              {{ item.innerTen }}
            </div>
          </div>
          <div class="text-center col">
            <label class="text-positive" style="font-size: 10px;">Wynik / HF</label>
            <div :class="`self-center col text-center text-positive text-caption ${item.edited ? '' : 'bg-warning round1'}`">
              {{ item.score }} / {{ item.hf.toFixed(4) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="toggleDSQDNF">
      <q-card class="bg-dark text-positive">
        <q-card-actions align="right" class="q-pa-xs q-ma-xs">
          <div class="text-h5 text-bold text-center col">Kary dla zawodnika</div>
          <q-btn icon="close" color="primary" round dense v-close-popup />
        </q-card-actions>
        <div class="text-h6 text-center">{{name}}</div>
        <div class="text-h6 text-center">Numer startowy {{ metric }}</div>
        <q-card-section>
          <div class="col q-pa-md">
            <q-btn color="primary" class="full-width q-pa-md" @click="toggleDnfScore()">przyznaj DNF</q-btn>
            <p></p>
            <q-btn color="primary" class="full-width q-pa-md" @click="toggleDsqScore()">przyznaj DSQ</q-btn>
            <p></p>
            <q-btn color="primary" class="full-width q-pa-md" @click="togglePkScore()">przyznaj PK</q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addAmmo">
      <q-card class="bg-dark text-positive">
        <q-card-actions align="right">
          <q-btn icon="close" color="primary" round dense v-close-popup/>
        </q-card-actions>
        <q-card-section>
          <div class="text-bold text-center text-h6">WYDAWANIE AMUNICJI</div>
          <div class="bg-dark">
            <div class="row">
              <div class="full-width text-positive">
                <div class="text-center full-width">Wybierz
                  <b>Kaliber</b> właściwy dla konkurencji
                </div>
                <div class="text-center full-width text-bold text-h6">
                  {{ compName }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="full-width">
                <q-radio v-model="caliberUUID" v-for="(calibers, uuid) in calibers" :label="calibers.name" :key="uuid"
                  :val="calibers.uuid" />
              </div>
            </div>
            <q-input @keypress.enter="addAmmoConfirm = true" type="number" filled class="full-width col"
              input-class="text-positive" label-color="positive"
              onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="ammoQuantity"
              label='"Ilość Amunicji wraz z próbnymi"'></q-input>
            <div align="right">
              <q-btn v-if="caliberUUID === null || ammoQuantity === null || ammoQuantity === ''" class="col full-width"
                color="grey-5">
                <div>
                  <div v-if="caliberUUID === null">wybierz kaliber</div>
                  <div v-if="ammoQuantity === null || ammoQuantity === ''">wprowadź ilość</div>
                </div>
              </q-btn>
              <q-btn v-if="caliberUUID !== null && ammoQuantity !== null && ammoQuantity !== ''" class="col full-width"
                color="primary" label="wydaj amunicję" @click="addAmmoConfirm = true"></q-btn>
            </div>
          </div>
        </q-card-section>
        <!-- <q-card-section>
          <div class="text-bold text-center text-h6">WYDAWANIE BRONI</div>
          <div align="right">
            <q-btn class="full-width" color="primary" @click="showloading(); toggleGunInScore()">wydaj broń</q-btn>
          </div>
        </q-card-section> -->
        <q-card-section>
          <div class="text-bold text-center text-h6">WYDAWANIE PAKIETU AMUNICJI</div>
          <q-btn label="Wydaj Pakiet" color="primary" class="full-width" @click="setPacket=true"></q-btn>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="gunAdded" persistent @keypress.enter="gunAdded = false">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6 text-bold">Broń została przydzielona</span>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="setPacket">
        <AddShootingPacket v-on:addMemberAndAmmoToCaliber="toggleAmmunitionInScore(scoreUUID)"
            :nameMember="member != null ? member : { firstName: '0', secondName: '0', legitimationNumber: '0' }"
            :nameOther="other != null ? other : { firstName: '0', secondName: '0', id: '0' }">
          </AddShootingPacket>
    </q-dialog>
    <q-dialog v-model="addAmmoConfirm" persistent
      @keypress.enter="addMemberAndAmmoToCaliber(); addAmmoConfirm = false; ammoQuantity = null; addAmmo = false">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy na pewno chcesz Wydać amunicję?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup />
          <q-btn text-color="white" label="Wydaj" color="primary" v-close-popup
            @click="addMemberAndAmmoToCaliber(); addAmmoConfirm = false; ammoQuantity = null; addAmmo = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="metricsInfo">
      <q-card @hook:destroyed="infoScore = []; infoScore1 = []" class="bg-dark text-positive">
        <q-card-actions align="right">
          <q-btn icon="close" color="primary" round dense v-close-popup/>
        </q-card-actions>
        <q-card-section class="col">
          <div class="q-ml-sm text-h6 text-center text-bold">POBIERZ METRYKI STARTOWE ZAWODNIKA</div>
          <div class="q-ml-sm text-h6 text-center text-bold">{{ name }}</div>
          <ol class="col">
            <li class="row hover1" v-for="(item, index) in infoScore" :key="index">
              <q-checkbox color="secondary" class="col" v-model="compList" :val="infoScore1[index]" :label="item" />
            </li>
          </ol>
          <div>
            <q-checkbox class="hover1" v-model="a5rotate" :value="a5rotate" label="rozmiar A5"></q-checkbox>
          </div>
          <div class="row q-pa-xs">
            <q-btn v-if="memberExist" dense @click="memberDial = true" class="col q-pa-xs" color="primary">
              wyświetl profil
            </q-btn>
            <q-item></q-item>
            <q-btn dense @click="getMemberMetrics(compList); compList = []" class="col q-pa-xs" color="secondary">
              wydrukuj wybrane metryki
            </q-btn>
            <q-item></q-item>
            <q-btn dense @click="getMemberMetrics(infoScore1); compList = []" class="col q-pa-xs" color="primary">
              wydrukuj
              wszystkie metryki
            </q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="compName = ''; infoScore = []; infoScore1 = []; compList = []" label="zamknij" color="primary"
            v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="listDownload">
      <q-card>
        <q-card-section class="col">
          <div class="self-center col full-width no-outline text-center text-h5 text-bold">Pobrano</div>
        </q-card-section>
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
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card class="bg-dark" style="min-width: 80vw">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="memberLeg"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style src="../../style/style.scss" lang="scss"></style>
<script>
import App from 'src/App.vue'
import axios from 'axios'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'

export default {
  name: 'SingleCompetition',
  components: {
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    }),
    AddShootingPacket: lazyLoadComponent({
      componentFactory: () => import('components/ammoList/AddShootingPacket.vue'),
      loading: SkeletonBox
    })
  },
  created () {
    this.getCompetitionByID(this.uuid)
  },
  data () {
    return {
      competition: {
        scoreList: []
      },
      controlSize: 0,
      shootingPlace: App.shootingPlace,
      a5rotate: false,
      val: [],
      info: [],
      temp: '',
      memberDial: false,
      legitimationNumber: null,
      memberExist: false,
      listDownload: false,
      success: false,
      failure: false,
      toggleDSQDNF: false,
      calibers: [],
      infoScore: [],
      infoScore1: [],
      caliberUUID: null,
      scoreUUID: null,
      singleScore: null,
      score: '',
      forceScore: '',
      scoreLabel: '',
      innerTen: '',
      outerTen: '',
      alfa: '',
      charlie: '',
      delta: '',
      miss: '',
      series: [],
      procedures: '',
      quantity: false,
      metric: null,
      addAmmo: false,
      addAmmoConfirm: false,
      ammoQuantity: null,
      memberLeg: null,
      gunAdded: false,
      metricsInfo: false,
      startNumber: '',
      member: null,
      other: null,
      compName: null,
      name: '',
      date: '',
      compList: [],
      otherID: '',
      memberUUID: null,
      setPacket: false,
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
    replaceComa (val, index) {
      const v = val.replaceAll(/,/g, '.')
      this.series[index] = v
    },
    setSeriesValues (arr) {
      const series = new Array(arr)
      for (let i = 0; i < arr.length; i++) {
        series[i] = arr[i]
      }
      return series
    },
    setVariables (item) {
      this.scoreUUID = item.uuid
      this.scoreLabel = item.score
      this.innerTen = checkZero(item.innerTen)
      this.outerTen = checkZero(item.outerTen)
      this.procedures = checkZero(item.procedures)
      this.alfa = checkZero(item.alfa)
      this.charlie = checkZero(item.charlie)
      this.delta = checkZero(item.delta)
      this.miss = checkZero(item.miss)
      this.series = this.setSeriesValues(item.series)
      this.temp = item.member != null ? item.member : item.otherPersonEntity
      this.startNumber = item.metricNumber
      this.competitionTemp = this.competition
      function checkZero (number) {
        return number.toString() !== 0 ? number : ''
      }
    },
    getCompetitionByID (uuid) {
      fetch(`${this.local}/competitionMembersList/getByID/?uuid=${uuid}`, {
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
    onEnter (scoreUUID) {
      this.setScore(scoreUUID, this.scoreLabel, this.innerTen, this.outerTen, this.alfa, this.charlie, this.delta, this.procedures, this.miss, this.series)
    },
    getListCalibers () {
      fetch(`${this.local}/armory/calibers`, {
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
    getScoreInfo () {
      fetch(`${this.local}/competitionMembersList/getMemberStarts?tournamentUUID=${this.competition.attachedToTournament}&memberUUID=${this.memberUUID}&otherID=${this.otherID}`, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          for (let i = 0; i < response.length; i++) {
            this.infoScore.push(response[i].substring(0, response[i].indexOf(';')))
            this.infoScore1.push(response[i].substring(response[i].indexOf(';') + 1, response[i].length))
          }
        })
    },
    addMemberAndAmmoToCaliber () {
      const quantity = this.ammoQuantity
      fetch(`${this.local}/ammoEvidence/ammo?caliberUUID=${this.caliberUUID}&legitimationNumber=${this.memberLeg}&counter=${this.ammoQuantity}&otherID=${this.otherID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          if (this.singleScore !== null) {
            if (this.singleScore.ammunition && quantity < 0) {
              this.toggleAmmunitionInScore(this.scoreUUID)
            }
            if (!this.singleScore.ammunition && quantity > 0) {
              this.toggleAmmunitionInScore(this.scoreUUID)
            }
          } else {
            this.toggleAmmunitionInScore(this.scoreUUID)
          }
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      }
      )
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
      fetch(`${this.local}/score/set?scoreUUID=${scoreUUID}&score=${score}&innerTen=${innerTen}&outerTen=${outerTen}&alfa=${alfa}&charlie=${charlie}&delta=${delta}&procedures=${procedures}&miss=${miss}&series=${series}`, {
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
      fetch(`${this.local}/score/ammo?scoreUUID=${scoreUUID}`, {
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
      fetch(`${this.local}/score/gun?scoreUUID=${this.scoreUUID}`, {
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
      fetch(`${this.local}/score/dnf?scoreUUID=${this.scoreUUID}`, {
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
      })
    },
    toggleDsqScore () {
      fetch(`${this.local}/score/dsq?scoreUUID=${this.scoreUUID}`, {
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
      })
    },
    forceSetScore (scoreUUID, forceScore) {
      fetch(`${this.local}/score/forceSetScore?scoreUUID=${scoreUUID}&score=${forceScore}`, {
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
    togglePkScore () {
      fetch(`${this.local}/score/pk?scoreUUID=${this.scoreUUID}`, {
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
      })
    },
    getMemberMetrics (info) {
      if (info.length < 1) {
        this.message = 'lista jest pusta - dodaj coś'
        this.failure = true
        this.autoClose()
        return
      }
      const { local, otherID, memberUUID, name, date } = this
      axios({
        url: `${local}/files/downloadMetric/${this.competition.attachedToTournament}?otherID=${otherID}&memberUUID=${memberUUID}&competitions=${info}&startNumber=${this.startNumber}&a5rotate=${this.a5rotate}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `metryki ${name} ${date}.pdf`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
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

<style scoped></style>
