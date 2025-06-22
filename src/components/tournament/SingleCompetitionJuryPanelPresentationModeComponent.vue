<template>
  <div v-if="competition!=null" class="col">
    <div
      class="full-width text-h5 text-bold text-center q-pa-none q-ma-none text-positive">{{competition.name}}
    </div>
    <div class="row fit q-pa-sm self-center text-positive" v-if="competition.countingMethod === 'NORMAL'">
        <div class="col-3 self-center text-left text-positive">Zawodnik</div>
        <div class="col-2 self-center text-left text-positive">Klub</div>
        <div class="col-1 self-center text-left text-positive">Numer Startowy</div>
        <div v-if="competition.countingMethod !== 'COMSTOCK'" class="col row">
          <div v-for="(item1,index1) in competition.scoreList[0].series" :key="index1"
               class="col self-center text-center text-positive">
            <div class="col">Seria {{ arabicToRomanNumberConverter(index1+1) }}</div>
          </div>
        </div>
        <div class="col-1 self-center text-center text-positive">10X</div>
        <div class="col-1 self-center text-center text-positive">10/</div>
        <div class="col-1 self-center text-positive"></div>
        <div class="col-1 self-center text-center text-positive">Wynik</div>
    </div>
    <div class="row fit q-pa-sm self-center text-positive" v-if="competition.countingMethod === 'COMSTOCK'">
      <div class="col-3 self-center text-left text-positive">Zawodnik</div>
      <div class="col-2 self-center text-left text-positive">Klub</div>
      <div class="col-1 self-center text-left text-positive">Numer Startowy</div>
      <div v-if="competition.countingMethod !== 'COMSTOCK'" class="col row">
        <div v-for="(item1,index1) in competition.scoreList[0].series" :key="index1" class="col self-center text-center text-positive">
          <div class="col">Seria {{ arabicToRomanNumberConverter(index1+1) }}</div>
        </div>
      </div>
      <div class="col-1 self-center text-center text-positive">czas</div>
      <div class="col-1 self-center text-center text-positive">trafienia</div>
      <div class="col-1 self-center text-center text-positive">procedury</div>
      <div class="col"></div>
      <div class="col-2 self-center text-positive">
        <div class="text-center">
          <div>
            Wynik / HF
          </div>
        </div>
      </div>
    </div>
    <div class="row fit q-pa-sm self-center text-positive" v-if="competition.countingMethod === 'IPSC'">
        <div class="col-3 self-center text-left text-positive">Zawodnik</div>
        <div class="col-2 self-center text-left text-positive">Klub</div>
        <div class="col-1 self-center text-left text-positive">Numer Startowy</div>
        <div v-if="competition.countingMethod !== 'COMSTOCK'" class="col row">
          <div v-for="(item1,index1) in competition.scoreList[0].series" :key="index1"
               class="col self-center text-center text-positive">
            <div class="col">Seria {{ arabicToRomanNumberConverter(index1+1) }}</div>
          </div>
        </div>
        <div class="col-1 self-center text-center text-positive">
          {{ competition.countingMethod === 'IPSC' ? 'czas' : '10X' }}
        </div>
        <div class="col-1 self-center text-center text-positive">
          {{ competition.countingMethod === 'IPSC' ? 'trafienia' : '10/' }}
        </div>
        <div v-if="competition.countingMethod === 'IPSC'"
             class="col-1 self-center text-center text-positive">
          procedury
        </div>
        <div v-if="competition.countingMethod === 'IPSC'" class="col"></div>
        <div class="col-2 self-center text-positive">
          <div v-if="competition.countingMethod === 'IPSC'" class="text-center">
            <div>
              Wynik / HF
            </div>
          </div>
        </div>
    </div>
    <div class="row fit q-pa-sm self-center text-positive" v-if="competition.countingMethod === 'CZAS'">
        <div class="col-3 self-center text-left text-positive">Zawodnik</div>
        <div class="col-2 self-center text-left text-positive">Klub</div>
        <div class="col-1 self-center text-left text-positive">Numer Startowy</div>
        <div v-if="competition.countingMethod !== 'COMSTOCK'" class="col row">
          <div v-for="(item1,index1) in competition.scoreList[0].series" :key="index1"
               class="col self-center text-center text-positive">
            <div class="col">Seria {{ arabicToRomanNumberConverter(index1+1) }}</div>
          </div>
        </div>
        <div class="col-1 self-center text-center text-positive">
          {{ competition.countingMethod === 'CZAS' ? 'czas' : '10X' }}
        </div>
        <div class="col-1 self-center text-center text-positive">
          {{ competition.countingMethod === 'CZAS' ? 'trafienia' : '10/' }}
        </div>
        <div v-if="competition.countingMethod === 'CZAS'"
             class="col-1 self-center text-center text-positive">
          procedury
        </div>
        <div v-if="competition.countingMethod === 'CZAS'" class="col"></div>
        <div class="col-2 self-center text-positive">
          <div v-if="competition.countingMethod === 'CZAS'" class="text-center">
            <div>
              Wynik / HF
            </div>
          </div>
          <div v-if="competition.countingMethod !== 'CZAS'" class="text-center">
            <div> Wynik</div>
          </div>
        </div>
    </div>
    <div class="row fit q-pa-sm self-center text-positive" v-if="competition.countingMethod === 'Dynamika Dziesiątka'">
        <div class="col-3 self-center text-left text-positive">Zawodnik</div>
        <div class="col-2 self-center text-left text-positive">Klub</div>
        <div class="col-1 self-center text-left text-positive">Numer Startowy</div>
        <div v-if="competition.countingMethod !== 'COMSTOCK'" class="col row">
          <div v-for="(item1,index1) in competition.scoreList[0].series" :key="index1"
               class="col self-center text-center text-positive">
            <div class="col">Seria {{ arabicToRomanNumberConverter(index1+1) }}</div>
          </div>
        </div>
        <div class="col-1 self-center text-center text-positive">
          czas
        </div>
        <div class="col-1 self-center text-center text-positive">
          punkty
        </div>
        <div class="col-1 self-center text-center text-positive">
          procedury
        </div>
        <div class="col"></div>
        <div class="col-2 self-center text-positive">
          <div class="text-center">
            <div>
              Wynik / HF
            </div>
          </div>
        </div>
    </div>
    <div v-if="competition.countingMethod === 'Pojedynek Strzelecki'">
      <div v-for="(item,index) in competition.scoreList" :key="index" class="full-width q-pa-none q-ma-none">
        <div class="q-pl-xs q-pr-xs" :class="index===0?'bg-yellow':index===1?'bg-gray':index===2?'bg-brown':''">
          <div class="row text-body2 full-width" :class="index===0?'bg-yellow':index===1?'bg-gray':index===2?'bg-brown':index>3&&index%2===0?'bg-grey-3 text-black':'text-positive'">
            <!-- name & club -->
              <div class="col row q-pa-none q-pl-xs q-pr-xs self-center text-positive">
                <div class="col-3 self-center text-left text-bold"
                     :class="index%2===0?'text-black':'text-positive'">
                  <div class="q-pa-none">
                    {{index+1}}
                    {{ item.member != null ? item.member.secondName : item.otherPersonEntity.secondName }}
                    {{ item.member != null ? item.member.firstName : item.otherPersonEntity.firstName }}
                  </div>
                </div>
                <div class="col-2 self-center text-left  "
                     :class="index%2===0?'text-black':'text-positive'">
                  {{ item.member != null ? item.member.club.shortName : item.otherPersonEntity.club.shortName }}
                </div>
                <div class="col-1 self-center text-center "
                :class="index%2===0?'text-black':'text-positive'">{{ item.metricNumber }}
              </div>
                <div class="col-1"></div>
                <div class="col-1 self-center text-center">
                  <div v-if="item.dnf||item.dsq||item.pk" :class="index%2===0?'text-black':'text-positive'"
                       class="self-center full-width text-center">
                    <div v-if="item.dnf">DNF ({{ item.score }})</div>
                    <div v-if="item.dsq">DSQ ({{ item.score }})</div>
                    <div v-if="item.pk">PK ({{ item.score }})</div>
                  </div>
                  <div v-else class="self-center text-center text-bold q-pa-none q-ma-none">
                    <div v-if="item.edited" class="text-center self-center text-bold"
                         :class="index%2===0?'text-black':'text-positive'">
                      {{ item.score }}
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="competition.countingMethod === 'NORMAL'">
      <div v-for="(item,index) in competition.scoreList" :key="index" class="full-width q-pa-none q-ma-none">
        <div class="q-pl-xs q-pr-xs">
          <div class="row text-body2 full-width" :class="index%2===0?'bg-grey-3 text-black':'text-positive'">
            <!-- name & club -->
              <div class="col row q-pa-none q-pl-xs q-pr-xs self-center text-positive">
                <div class="col-3 self-center text-left text-bold"
                     :class="index%2===0?'text-black':'text-positive'">
                  <div class="q-pa-none">
                    {{index+1}}
                    {{ item.member != null ? item.member.secondName : item.otherPersonEntity.secondName }}
                    {{ item.member != null ? item.member.firstName : item.otherPersonEntity.firstName }}
                  </div>
                </div>
                <div class="col-2 self-center text-left  "
                     :class="index%2===0?'text-black':'text-positive'">
                  {{ item.member != null ? item.member.club.shortName : item.otherPersonEntity.club.shortName }}
                </div>
                <div class="col-1 self-center text-center "
                :class="index%2===0?'text-black':'text-positive'">{{ item.metricNumber }}
              </div>
              <div class="col row">
                <div v-for="(item1,index1) in item.series" :key="index1"
                     class="col self-center text-center " :class="index%2===0?'text-black':'text-positive'">
                  <div class="col" v-if="item.edited">{{ item1 }}</div>
                </div>
              </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.innerTen !== 0 ? item.innerTen : '' }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 ? item.outerTen: '' }}
                </div>
                <div class="col-1"></div>
                <div class="col-1 self-center text-center">
                  <div v-if="item.dnf||item.dsq||item.pk" :class="index%2===0?'text-black':'text-positive'"
                       class="self-center full-width text-center">
                    <div v-if="item.dnf">DNF ({{ item.score }})</div>
                    <div v-if="item.dsq">DSQ ({{ item.score }})</div>
                    <div v-if="item.pk">PK ({{ item.score }})</div>
                  </div>
                  <div v-else class="self-center text-center text-bold q-pa-none q-ma-none">
                    <div v-if="item.edited" class="text-center self-center text-bold"
                         :class="index%2===0?'text-black':'text-positive'">
                      {{ item.score }}
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="competition.countingMethod === 'COMSTOCK'">
      <div v-for="(item,index) in competition.scoreList" :key="index" class="full-width q-pa-none q-ma-none">
        <div class="q-pl-xs q-pr-xs">
          <div class="row text-body2 full-width" :class="index%2===0?'bg-grey-3 text-black':'text-positive'">
            <!-- name & club -->
              <div class="col row q-pa-none q-pl-xs q-pr-xs self-center text-positive">
                <div class="col-3 self-center text-left text-bold"
                     :class="index%2===0?'text-black':'text-positive'">
                  <div class="q-pa-none">
                    {{index+1}}
                    {{ item.member != null ? item.member.secondName : item.otherPersonEntity.secondName }}
                    {{ item.member != null ? item.member.firstName : item.otherPersonEntity.firstName }}
                  </div>
                </div>
                <div class="col-2 self-center text-left  "
                     :class="index%2===0?'text-black':'text-positive'">
                  {{ item.member != null ? item.member.club.shortName : item.otherPersonEntity.club.shortName }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.metricNumber }}
                </div>
                <div v-if="competition.countingMethod !== 'COMSTOCK'" class="col row">
                  <div v-for="(item1,index1) in item.series" :key="index1"
                       class="col self-center text-center " :class="index%2===0?'text-black':'text-positive'">
                    <div class="col">{{ item1 }}</div>
                  </div>
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.innerTen !== 0 ? competition.countingMethod === 'COMSTOCK' ? (item.innerTen + ' s') : item.innerTen : '' }}
                </div>
                <div v-if="competition.countingMethod === 'COMSTOCK'"
                     class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 ? item.outerTen: '' }}
                    </div>
                    <div class="col-1 self-center text-center "
                    :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 && item.innerTen !== 0 ? item.procedures: '' }}
                  </div>
                <div v-if="competition.countingMethod === 'COMSTOCK'" class="col"></div>
                <div class="col-2 self-center text-center">
                  <div v-if="item.dnf||item.dsq||item.pk" :class="index%2===0?'text-black':'text-positive'"
                       class="self-center full-width text-center">
                    <div v-if="item.dnf">DNF ({{ item.score }})</div>
                    <div v-if="item.dsq">DSQ ({{ item.score }})</div>
                    <div v-if="item.pk">PK ({{ item.score }})</div>
                  </div>
                  <div v-else class="self-center text-center text-bold q-pa-none q-ma-none">
                    <div v-if="competition.countingMethod === 'COMSTOCK'" class="q-pa-none q-ma-none"
                         :class="index%2===0?'text-black':'text-positive'">
                      <div class="q-pa-none q-ma-none">{{ item.outerTen !== 0 && item.innerTen !== 0 ? (item.score + ' / ' + item.hf) : ''}}</div>
                    </div>
                    <div v-else class="text-center self-center text-bold"
                         :class="index%2===0?'text-black':'text-positive'">
                      {{ item.score }}
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="competition.countingMethod === 'IPSC'">
      <div v-for="(item,index) in competition.scoreList" :key="index" class="full-width q-pa-none q-ma-none">
        <div class="q-pl-xs q-pr-xs">
          <div class="row text-body2 full-width" :class="index%2===0?'bg-grey-3 text-black':'text-positive'">
            <!-- name & club -->
              <div class="col row q-pa-none q-pl-xs q-pr-xs self-center text-positive">
                <div class="col-3 self-center text-left text-bold"
                     :class="index%2===0?'text-black':'text-positive'">
                  <div class="q-pa-none">
                    {{index+1}}
                    {{ item.member != null ? item.member.secondName : item.otherPersonEntity.secondName }}
                    {{ item.member != null ? item.member.firstName : item.otherPersonEntity.firstName }}
                  </div>
                </div>
                <div class="col-2 self-center text-left  "
                     :class="index%2===0?'text-black':'text-positive'">
                  {{ item.member != null ? item.member.club.shortName : item.otherPersonEntity.club.shortName }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.metricNumber }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.innerTen !== 0 ? (item.innerTen + ' s') : '' }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 && item.innerTen !== 0 ? item.procedures: '' }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 ? item.outerTen: '' }}
                </div>
                <div class="col"></div>
                <div class="col-2 self-center text-center">
                  <div v-if="item.dnf||item.dsq||item.pk" :class="index%2===0?'text-black':'text-positive'"
                       class="self-center full-width text-center">
                    <div v-if="item.dnf">DNF ({{ item.score }})</div>
                    <div v-if="item.dsq">DSQ ({{ item.score }})</div>
                    <div v-if="item.pk">PK ({{ item.score }})</div>
                  </div>
                  <div v-else class="self-center text-center text-bold q-pa-none q-ma-none">
                    <div class="q-pa-none q-ma-none" :class="index%2===0?'text-black':'text-positive'">
                      <div class="q-pa-none q-ma-none">{{ item.outerTen !== 0 && item.innerTen !== 0 ? (item.score + ' / ' + item.hf) : ''}}</div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- tutaj trzeba jeszcze poprawić -->
    <div v-if="competition.countingMethod === 'CZAS'">
      <div v-for="(item,index) in competition.scoreList" :key="index" class="full-width q-pa-none q-ma-none">
        <div class="q-pl-xs q-pr-xs">
          <div class="row text-body2 full-width" :class="index%2===0?'bg-grey-3 text-black':'text-positive'">
            <!-- name & club -->
              <div class="col row q-pa-none q-pl-xs q-pr-xs self-center text-positive">
                <div class="col-3 self-center text-left text-bold"
                     :class="index%2===0?'text-black':'text-positive'">
                  <div class="q-pa-none">
                    {{index+1}}
                    {{ item.member != null ? item.member.secondName : item.otherPersonEntity.secondName }}
                    {{ item.member != null ? item.member.firstName : item.otherPersonEntity.firstName }}
                  </div>
                </div>
                <div class="col-2 self-center text-left  "
                     :class="index%2===0?'text-black':'text-positive'">
                  {{ item.member != null ? item.member.club.shortName : item.otherPersonEntity.club.shortName }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.metricNumber }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.innerTen !== 0 ? (item.innerTen + ' s') : '' }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 && item.innerTen !== 0 ? item.procedures: '' }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 ? item.outerTen: '' }}
                </div>
                <div v-if="competition.countingMethod === 'COMSTOCK'" class="col"></div>
                <div class="col-2 self-center text-center">
                  <div v-if="item.dnf||item.dsq||item.pk" :class="index%2===0?'text-black':'text-positive'"
                       class="self-center full-width text-center">
                    <div v-if="item.dnf">DNF ({{ item.score }})</div>
                    <div v-if="item.dsq">DSQ ({{ item.score }})</div>
                    <div v-if="item.pk">PK ({{ item.score }})</div>
                  </div>
                  <div v-else class="self-center text-center text-bold q-pa-none q-ma-none">
                    <div class="q-pa-none q-ma-none"
                         :class="index%2===0?'text-black':'text-positive'">
                      <div class="q-pa-none q-ma-none">{{ item.outerTen !== 0 && item.innerTen !== 0 ? (item.score + ' / ' + item.hf) : ''}}</div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="competition.countingMethod === 'Dynamika Dziesiątka'">
      <div v-for="(item,index) in competition.scoreList" :key="index" class="full-width q-pa-none q-ma-none">
        <div class="q-pl-xs q-pr-xs">
          <div class="row text-body2 full-width" :class="index%2===0?'bg-grey-3 text-black':'text-positive'">
            <!-- name & club -->
              <div class="col row q-pa-none q-pl-xs q-pr-xs self-center text-positive">
                <div class="col-3 self-center text-left text-bold"
                     :class="index%2===0?'text-black':'text-positive'">
                  <div class="q-pa-none">
                    {{index+1}}
                    {{ item.member != null ? item.member.secondName : item.otherPersonEntity.secondName }}
                    {{ item.member != null ? item.member.firstName : item.otherPersonEntity.firstName }}
                  </div>
                </div>
                <div class="col-2 self-center text-left  "
                     :class="index%2===0?'text-black':'text-positive'">
                  {{ item.member != null ? item.member.club.shortName : item.otherPersonEntity.club.shortName }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.metricNumber }}
                </div>
                <div class="col"></div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.innerTen !== 0 ? (item.innerTen + ' s') : '' }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 ? item.outerTen: '' }}
                </div>
                <div class="col-1 self-center text-center "
                     :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 && item.innerTen !== 0 ? item.procedures: '' }}
                </div>
                <div class="col"></div>
                <div class="col-2 self-center text-center">
                  <div v-if="item.dnf||item.dsq||item.pk" :class="index%2===0?'text-black':'text-positive'"
                       class="self-center full-width text-center">
                    <div v-if="item.dnf">DNF ({{ item.score }})</div>
                    <div v-if="item.dsq">DSQ ({{ item.score }})</div>
                    <div v-if="item.pk">PK ({{ item.score }})</div>
                  </div>
                  <div v-else class="self-center text-center text-bold q-pa-none q-ma-none">
                    <div class="q-pa-none q-ma-none"
                         :class="index%2===0?'text-black':'text-positive'">
                      <div class="q-pa-none q-ma-none">{{ item.outerTen !== 0 && item.innerTen !== 0 ? (item.score + ' / ' + item.hf) : ''}}</div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import App from 'src/App'
import { scroll } from 'quasar'
const { setVerticalScrollPosition } = scroll
export default {
  name: 'SingleCompetitionJuryPanelPresentationModeComponent.vue',
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  created () {
    this.getCompetitionByID(this.uuid)
  },
  watch: {
    uuid (newValue, oldValue) {
      if (newValue !== oldValue) {
        setVerticalScrollPosition(document.documentElement, 0, 0)
        this.getCompetitionByID(this.uuid)
      }
      if (newValue === oldValue) {
        this.getCompetitionByID(this.uuid)
      }
    }
  },
  data () {
    return {
      competition: null,
      local: App.host
    }
  },
  methods: {
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
    arabicToRomanNumberConverter (arabicNumber) {
      let romanNumber
      switch (arabicNumber) {
        case 0:
          romanNumber = ''
          break
        case 1:
          romanNumber = 'I'
          break
        case 2:
          romanNumber = 'II'
          break
        case 3:
          romanNumber = 'III'
          break
        case 4:
          romanNumber = 'IV'
          break
        case 5:
          romanNumber = 'V'
          break
        case 6:
          romanNumber = 'VI'
          break
        case 7:
          romanNumber = 'VII'
          break
        case 8:
          romanNumber = 'VIII'
          break
        case 9:
          romanNumber = 'IX'
          break
        case 10:
          romanNumber = 'X'
          break
        default:
          romanNumber = 'error'
          break
      }
      return romanNumber
    }
  }
}
</script>

<style scoped>

</style>
