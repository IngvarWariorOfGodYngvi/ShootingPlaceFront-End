<template>
  <div class="col">
    <q-item
      class="full-width text-h5 text-bold text-center">{{
        competition.countingMethod === 'COMSTOCK' ? competition.name + ' ' + competition.countingMethod : competition.name
      }}
    </q-item>
    <div class="row">
      <q-field dense class="col" standout="bg-accent text-positive" stack-label>
        <div class="col-2 self-center text-left text-positive">lp amunicja</div>
        <div class="col-2 self-center text-left text-positive">Zawodnik</div>
        <div class="col-2 self-center text-left text-positive">Klub</div>
        <div class="col self-center text-center text-positive">Wynik</div>
      </q-field>
    </div>
    <q-virtual-scroll :items="competition.scoreList" visible class="full-width q-pa-none">
      <template v-slot="{ item, index }">
        <div :key="index">
          <div class="row text-body2 full-width">
            <!-- button -->
            <div class="col-1">
              <div class="row" v-if="item.ammunition === false && item.gun === false">
                <div class="col-5 self-center">{{ index + 1 }}.</div>
                <q-btn dense glossy class="col" icon="book"
                       @click="scoreUUID = item.uuid;temp=item.member!=null?item.member:item.otherPersonEntity.secondName;item.member!=null?(memberLeg = item.member.legitimationNumber,otherID = 0):(otherID = item.otherPersonEntity.id,memberLeg = 0); getListCalibers();caliberUUID = competition.caliberUUID;ammoQuantity = competition.practiceShots + competition.numberOfShots;addAmmo=true">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Wydaj broń lub
                    amunicję
                    {{ item.member != null ? temp = item.member.secondName : temp = item.otherPersonEntity.secondName }}
                  </q-tooltip>
                </q-btn>
              </div>
              <div class="row" v-if="item.ammunition === true && item.gun === false">
                <div class="col-5 self-center">{{ index + 1 }}.</div>
                <q-btn dense glossy class="col" color="primary" :icon="item.ammunition === true && item.gun === false?'done book':'book'"
                       @click="scoreUUID = item.uuid;item.member!=null?(memberLeg = item.member.legitimationNumber,otherID = 0):(otherID = item.otherPersonEntity.id,memberLeg=0); getListCalibers();caliberUUID = competition.caliberUUID;ammoQuantity = competition.practiceShots + competition.numberOfShots;addAmmo=true">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Amunicja wydana
                  </q-tooltip>
                </q-btn>
              </div>
              <div class="row" v-if="item.ammunition === false && item.gun === true">
                <div class="col-5 self-center">{{ index + 1 }}.</div>
                <q-btn dense glossy class="col" color="secondary" :icon="item.ammunition === false && item.gun === true?'book done':'book'"
                       @click="scoreUUID = item.uuid;item.member!=null?(memberLeg = item.member.legitimationNumber,otherID = 0):(otherID = item.otherPersonEntity.id,memberLeg=0); getListCalibers();caliberUUID = competition.caliberUUID;ammoQuantity = competition.practiceShots + competition.numberOfShots;addAmmo=true">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń wydana
                  </q-tooltip>
                </q-btn>
              </div>
              <div class="row" v-if="item.ammunition === true && item.gun === true">
                <div class="col-5 self-center">{{ index + 1 }}.</div>
                <q-btn dense glossy class="col" color="primary" icon="done"
                       @click="scoreUUID = item.uuid;item.member!=null?(memberLeg = item.member.legitimationNumber,otherID = 0):(otherID = item.otherPersonEntity.id,memberLeg=0); getListCalibers();caliberUUID = competition.caliberUUID;ammoQuantity = competition.practiceShots + competition.numberOfShots;addAmmo=true">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[12, 12]">Broń i Amunicja
                    wydana
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
            <!-- name & club -->
            <div class="col-5"
                 @dblclick="memberExist=true;item.member!=null?
                 (memberUUID=item.member.uuid,otherID = 0,temp=item.member,memberLeg = item.member.legitimationNumber)
                 :
                 (memberUUID='0',otherID = item.otherPersonEntity.id,temp=item.otherPersonEntity);
                 startNumber=item.metricNumber;getScoreInfo();metricsInfo=true">
              <q-field dense standout="bg-accent text-positive row" class="text-positive" stack-label>
                <q-tooltip v-if="item.member!=null &&!item.member.active" content-class="bg-red text-subtitle2"
                           anchor="top middle">UREGULUJ SKŁADKI
                </q-tooltip>
                <div class="q-pa-xs row full-width text-caption">
                  <div class="col no-outline text-positive" >
                    {{ item.member != null ? temp = item.member.secondName : temp = item.otherPersonEntity.secondName }}
                    {{ item.member != null ? temp = item.member.firstName : temp = item.otherPersonEntity.firstName }}
                  </div>
                  <div class="col-5 no-outline text-positive"
                       >
                    {{ item.member != null ? temp = item.member.club.name : temp = item.otherPersonEntity.club.name }}
                  </div>
                </div>
              </q-field>
            </div>
            <!-- metric -->
            <div class="col-1 text-positive" @dblclick="scoreUUID = item.uuid;toggleDSQDNF=true">
              <q-field dense class="text-center row" label-color="positive" standout="bg-accent" stack-label
                       label="metryka">
                <div class="self-center full-width col no-outline text-center text-positive text-caption"
                     >{{ item.metricNumber }}
                </div>
              </q-field>
            </div>
            <!-- innerTen -->
            <div v-if="competition.disciplines==null && competition.countingMethod === 'COMSTOCK'" class="box col-1 text-positive">
              <q-field dense class="row text-positive" label-color="positive" color="positive"
                       standout="bg-accent text-positive" label="trafienia" stack-label>
                <q-popup-edit v-model="outerTen">
                  <q-input v-if="alfa === '' && charlie === '' && delta === ''" @focus="scoreUUID = item.uuid"
                           input-class="text-center text-positive" v-model="outerTen"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus
                           stack-label label="trafienia"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="alfa" stack-label label="Alfa"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="charlie" stack-label label="Charlie"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="delta" stack-label label="Delta"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <div class="q-pa-xs">
                    <q-btn color="primary" label="Anuluj" v-close-popup
                           @click="outerTen='';alfa='';charlie='';delta=''"></q-btn>
                    <q-btn color="primary" label="Zapisz" v-close-popup
                           @click="scoreUUID = item.uuid; setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                  </div>
                </q-popup-edit>
                <div class="self-center full-width col no-outline text-center text-positive" >
                  {{ item.outerTen }}
                </div>
              </q-field>
            </div>
            <div v-if="competition.disciplines!=null && competition.countingMethod === 'COMSTOCK'" class="box col-1 ">
              <q-field dense v-if="competition.disciplines.includes('Pistolet')" class="row"
                        standout="bg-accent" label="p" stack-label>
                <q-popup-edit v-model="outerTen">
                  <q-input v-if="alfa === '' && charlie === '' && delta === ''" @focus="scoreUUID = item.uuid"
                           input-class="text-center" v-model="outerTen"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus
                           stack-label label="trafienia"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="alfa" stack-label label="Alfa"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="charlie" stack-label label="Charlie"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="delta" stack-label label="Delta"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <div class="q-pa-xs">
                    <q-btn color="primary" label="Anuluj" v-close-popup
                           @click="outerTen='';alfa='';charlie='';delta=''"></q-btn>
                    <q-btn color="primary" label="Zapisz" v-close-popup
                           @click="scoreUUID = item.uuid; setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                  </div>
                </q-popup-edit>
                <div class="self-center full-width col no-outline text-center text-positive text-caption"
                     >{{ item.outerTen }}
                </div>
              </q-field>
              <q-field dense v-if="competition.disciplines.includes('Karabin')" class="row"
                       standout="bg-accent" label="k" stack-label>
                <q-popup-edit v-model="outerTen">
                  <q-input v-if="alfa === '' && charlie === '' && delta === ''" @focus="scoreUUID = item.uuid"
                           input-class="text-center" v-model="outerTen"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus
                           stack-label label="trafienia"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="alfa" stack-label label="Alfa"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="charlie" stack-label label="Charlie"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="delta" stack-label label="Delta"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <div class="q-pa-xs">
                    <q-btn color="primary" label="Anuluj" v-close-popup
                           @click="outerTen='';alfa='';charlie='';delta=''"></q-btn>
                    <q-btn color="primary" label="Zapisz" v-close-popup
                           @click="scoreUUID = item.uuid; setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                  </div>
                </q-popup-edit>
                <div class="self-center full-width col no-outline text-center text-positive text-caption"
                     >{{ item.outerTen }}
                </div>
              </q-field>
              <q-field dense v-if="competition.disciplines.includes('Strzelba')" class="row"
                       standout="bg-accent" label="s" stack-label>
                <q-popup-edit v-model="outerTen">
                  <q-input v-if="alfa === '' && charlie === '' && delta === ''" @focus="scoreUUID = item.uuid"
                           input-class="text-center" v-model="outerTen"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus
                           stack-label label="trafienia"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="alfa" stack-label label="Alfa"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="charlie" stack-label label="Charlie"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <q-input @focus="scoreUUID = item.uuid"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)"
                           input-class="text-center" v-model="delta" stack-label label="Delta"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <div class="q-pa-xs">
                    <q-btn color="primary" label="Anuluj" v-close-popup
                           @click="outerTen='';alfa='';charlie='';delta=''"></q-btn>
                    <q-btn color="primary" label="Zapisz" v-close-popup
                           @click="scoreUUID = item.uuid; setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                  </div>
                </q-popup-edit>
                <div class="self-center full-width col no-outline text-center text-positive text-caption"
                     >{{ item.outerTen }}
                </div>
              </q-field>
            </div>
            <div v-if="competition.countingMethod === 'COMSTOCK'" class="box col-1 ">
              <q-field dense standout="bg-accent" class="row" color="positive" label-color="positive"
                       label="czas"
                       stack-label>
                <q-popup-edit v-model="innerTen">
                  <q-input @focus="scoreUUID = item.uuid" input-class="text-center" v-model="innerTen"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus
                           stack-label label="czas"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
                  <div class="q-pa-xs">
                    <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                    <q-btn color="primary" label="Zapisz" v-close-popup
                           @click="scoreUUID = item.uuid; setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                  </div>
                </q-popup-edit>
                <div class="self-center full-width col no-outline text-center text-positive text-caption"
                     >{{ item.innerTen }}
                </div>
              </q-field>
            </div>
            <!-- procedures -->
            <div v-if="competition.countingMethod === 'COMSTOCK'" class="box col-1 ">
              <q-field dense standout="bg-accent" class="row" color="positive" label-color="positive"
                       label="procedury" stack-label>
                <q-popup-edit v-model="procedures">
                  <q-input @focus="scoreUUID = item.uuid" input-class="text-center" v-model="procedures"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus
                           stack-label label="procedury + 3 sek"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <div class="q-pa-xs row full-width">
                    <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                    <q-btn color="primary" label="Zapisz" v-close-popup
                           @click="scoreUUID = item.uuid; setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                  </div>
                </q-popup-edit>
                <div class="self-center full-width col no-outline text-center text-positive text-caption"
                     >{{ item.procedures }}
                </div>
              </q-field>
            </div>
            <div v-if="competition.countingMethod === 'COMSTOCK'" class="box col-1 ">
              <q-field dense class="row" color="positive" label-color="positive"
                       standout="bg-accent text-positive" label="HF" stack-label>
                <q-tooltip v-if="item.alfa>0||item.charlie>0||item.delta>0" anchor="top middle"
                           self="bottom middle" :offset="[12, 12]">
                  <div v-if="item.alfa>0">alfa: {{ item.alfa }}</div>
                  <div v-if="item.charlie>0">charlie: {{ item.charlie }}</div>
                  <div v-if="item.delta>0">delta: {{ item.delta }}</div>
                </q-tooltip>
                <div class="self-center full-width col no-outline text-center text-positive text-caption"
                     >{{ item.hf }}
                </div>
              </q-field>
            </div>
            <div v-if="competition.countingMethod === 'NORMAL'" class="box col-2 ">
              <q-field dense standout="bg-accent" class="row" color="positive" label-color="positive"
                       label="10 ogólnie" stack-label>
                <q-popup-edit v-model="outerTen">
                  <q-input @focus="scoreUUID = item.uuid" input-class="text-center" v-model="outerTen"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus
                           stack-label label="ilość 10 ogólnie"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <div class="q-pa-xs">
                    <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                    <q-btn color="primary" label="Zapisz" v-close-popup
                           @click="scoreUUID = item.uuid; setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                  </div>
                </q-popup-edit>
                <div class="self-center full-width col no-outline text-center text-positive text-caption"
                     >{{ item.outerTen }}
                </div>
              </q-field>
            </div>
            <div v-if="competition.countingMethod === 'NORMAL'" class="box col-2 ">
              <q-field dense standout="bg-accent" class="row" color="positive" label-color="positive"
                       label="10 wewnętrzne" stack-label>
                <q-popup-edit v-model="innerTen">
                  <q-input @focus="scoreUUID = item.uuid" input-class="text-center" v-model="innerTen"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus
                           stack-label label="ilość 10 wewnętrznych"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58)"/>
                  <div class="q-pa-xs">
                    <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                    <q-btn color="primary" label="Zapisz" v-close-popup
                           @click="scoreUUID = item.uuid; setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                  </div>
                </q-popup-edit>
                <div class="self-center full-width col no-outline text-center text-positive text-caption"
                     >{{ item.innerTen }}
                </div>
              </q-field>
            </div>
            <!-- wynik -->
            <div class="box col-1 ">
              <q-field dense standout="bg-accent" label="Wynik" class="row" color="positive" label-color="positive"
                       stack-label>
                <q-popup-edit v-model="scoreLabel">
                  <q-input @focus="scoreUUID = item.uuid" input-class="text-center" v-model="scoreLabel"
                           @keypress.enter="scoreUUID = item.uuid; onEnter(scoreUUID)" dense autofocus
                           stack-label label="Wynik"
                           onkeypress="return (event.charCode > 47 && event.charCode < 58) || event.charCode > 44 || event.charCode < 46"/>
                  <div class="q-pa-xs">
                    <q-btn color="primary" label="Anuluj" v-close-popup></q-btn>
                    <q-btn color="primary" label="Zapisz" v-close-popup
                           @click="scoreUUID = item.uuid; setScore(item.uuid,scoreLabel,innerTen,outerTen,alfa, charlie, delta,procedures)"></q-btn>
                  </div>
                </q-popup-edit>
                <div v-if="item.dnf||item.dsq||item.pk"
                     class="self-center full-width col no-outline text-center text-positive" >
                  <div v-if="item.dnf">DNF</div>
                  <div v-if="item.dsq">DSQ</div>
                  <div v-if="item.pk">PK</div>
                </div>
                <div v-else class="self-center full-width col no-outline text-center text-positive text-caption"
                     >{{ item.score }}
                </div>
              </q-field>
            </div>
          </div>
          <!--          </div>-->
        </div>
      </template>
    </q-virtual-scroll>
    <q-dialog v-model="toggleDSQDNF">
      <q-card>
        <q-card-section>
          <div>
            <div class="text-h5 text-bold text-center">Kary dla zawodnika z numerem {{ metric }}</div>
          </div>
          <div class="col q-pa-md">
            <q-btn color="primary" class="full-width q-pa-md" @click="toggleDnfScore()">przyznaj DNF</q-btn>
            <p></p>
            <q-btn color="primary" class="full-width q-pa-md" @click="toggleDsqScore()">przyznaj DSQ</q-btn>
            <p></p>
            <q-btn color="primary" class="full-width q-pa-md" @click="togglePkScore()">przyznaj PK</q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Anuluj" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addAmmo">
      <q-card class="bg-dark text-positive">
        <q-card-section>
          <div class="text-bold text-center text-h6">WYDAWANIE AMUNICJI</div>
          <div class="bg-dark">
            <div class="row">
              <q-field class="full-width col text-positive" color="positive" standout="bg-accent text-positive" stack-label>
                <template v-slot:control>
                  <div class="text-center full-width no-outline text-center text-positive" >Wybierz
                    <b>Kaliber</b> właściwy dla konkurencji
                  </div>
                  <div class="text-center full-width no-outline text-bold text-center text-positive text-h6">
                    {{ compName }}
                  </div>
                </template>
              </q-field>
            </div>
            <div class="row">
              <div class="full-width">
                <q-radio v-model="caliberUUID" v-for="(calibers,uuid) in calibers" :key="uuid" :val="calibers.uuid">
                  <q-field borderless class="full-width">
                    <template v-slot:control>
                      <div class="full-width text-positive">{{ calibers.name }}</div>
                    </template>
                  </q-field>
                </q-radio>
              </div>
            </div>
            <q-input @keypress.enter="addAmmoConfirm = true" type="number" filled class="full-width col" input-class="text-positive" label-color="positive"
                     onkeypress="return (event.charCode > 44 && event.charCode < 58)" v-model="ammoQuantity"
                     label='"Ilość Amunicji wraz z próbnymi"'></q-input>
            <div align="right">
              <q-btn v-if="caliberUUID===null||ammoQuantity===null||ammoQuantity===''" class="col full-width"
                     color="grey-5">
                <div>
                  <div v-if="caliberUUID===null">wybierz kaliber</div>
                  <div v-if="ammoQuantity===null||ammoQuantity===''">wprowadź ilość</div>
                </div>
              </q-btn>
              <q-btn v-if="caliberUUID!==null&&ammoQuantity!==null&&ammoQuantity!==''" class="col full-width"
                     color="primary" label="wydaj amunicję" @click="addAmmoConfirm = true"></q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-bold text-center text-h6">WYDAWANIE BRONI</div>
          <div align="right">
            <q-btn class="full-width" color="primary" @click="showloading();toggleGunInScore()">wydaj broń</q-btn>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="gunAdded" persistent @keypress.enter="gunAdded=false">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-h6 text-bold">Broń została przydzielona</span>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="addAmmoConfirm" persistent
              @keypress.enter="addMemberAndAmmoToCaliber();addAmmoConfirm=false;ammoQuantity=null;addAmmo=false">
      <q-card class="bg-dark text-positive">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Czy na pewno chcesz Wydać amunicję?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="anuluj" color="secondary" v-close-popup/>
          <q-btn text-color="white" label="Wydaj" color="primary" v-close-popup
                 @click="addMemberAndAmmoToCaliber();addAmmoConfirm=false;ammoQuantity=null;addAmmo=false"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="metricsInfo">
      <q-card>
        <q-card-section class="col">
          <div class="q-ml-sm text-h6 text-center text-bold">POBIERZ METRYKI STARTOWE ZAWODNIKA</div>
          <div class="q-ml-sm text-h6 text-center text-bold">{{ name }}</div>
          <ol class="col">
            <li class="row" v-for="info in infoScore" :key="info">
              <q-checkbox color="secondary" class="col" v-model="compList" :val="info" :label="info"/>
              <!--              <div>-->
              <!--                <q-btn class="col-3" color="primary" label="Wydaj amunicję"-->
              <!--                       @click="compName=info;getListCalibers();addAmmo=true"/>-->
              <!--              </div>-->
            </li>
          </ol>
          <div class="row q-pa-xs">
            <q-btn v-if="memberExist" dense @click="memberDial=true" class="col q-pa-xs" color="primary">
              wyświetl profil
            </q-btn>
            <q-item></q-item>
            <q-btn dense @click="getMemberMetrics(compList);info=[];compList=[]" class="col q-pa-xs" color="secondary">
              wydrukuj wybrane metryki
            </q-btn>
            <q-item></q-item>
            <q-btn dense @click="getMemberMetrics(infoScore);info=[];compList=[]" class="col q-pa-xs" color="primary">
              wydrukuj
              wszystkie metryki
            </q-btn>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="compName='';compList=[]" label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="listDownload">
      <q-card>
        <q-card-section class="col">
          <div class="self-center col full-width no-outline text-center text-h5 text-bold">Pobrano</div>
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
    <q-dialog position="top" v-model="failure">
      <q-card class="bg-negative">
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{ message }}</div>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card style="min-width: 80vw">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="memberLeg"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="black" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

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
    })
  },
  created () {
    this.getCompetitionByID(this.uuid)
  },
  data () {
    return {
      competition: { hf: '', dsq: false, dnf: false, pk: false, countingMethod: '', disciplines: [], discipline: null, attachedToTournament: '', scoreList: { ammunition: false, otherPersonEntity: '', metricNumber: '' }, date: '', scoreListSize: '' },
      controlSize: 0,
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
      addAmmo: false,
      addAmmoConfirm: false,
      ammoQuantity: null,
      memberLeg: null,
      gunAdded: false,
      metricsInfo: false,
      startNumber: '',
      compName: null,
      name: '',
      compList: [],
      otherID: '',
      memberUUID: null,
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
      fetch('http://' + this.local + '/armory/calibers', {
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
      fetch('http://' + this.local + '/competitionMembersList/getMemberStarts?tournamentUUID=' + this.competition.attachedToTournament + '&memberUUID=' + this.memberUUID + '&otherID=' + this.otherID, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.infoScore = response
        })
    },
    addMemberAndAmmoToCaliber () {
      const quantity = this.ammoQuantity
      fetch('http://' + this.local + '/ammoEvidence/ammo?caliberUUID=' + this.caliberUUID + '&legitimationNumber=' + this.memberLeg + '&counter=' + this.ammoQuantity + '&otherID=' + this.otherID, {
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
    getMemberMetrics (info) {
      axios({
        url: 'http://' + this.local + '/files/downloadMetric/' + this.competition.attachedToTournament + '?otherID=' + this.otherID + '&memberUUID=' + this.memberUUID + '&competitions=' + info + '&startNumber=' + this.startNumber,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'metryki_' + this.name + '.pdf')
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

<style scoped>

</style>
